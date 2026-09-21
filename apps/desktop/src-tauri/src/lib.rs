use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, Manager};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri_plugin_autostart::ManagerExt as AutostartExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

mod native_auth;
use native_auth::{native_api_request, native_auth_status, native_pairing_begin, native_pairing_poll, native_unpair, NativeClient};

const DEFAULT_SHORTCUT: &str = "Ctrl+Shift+Space";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ClipboardCapture {
    text: String,
    mime_type: &'static str,
}

#[derive(Serialize)]
struct PickedFile {
    path: String,
    name: String,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkspaceTarget {
    workspace: String,
    record_id: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopStatus {
    shortcut: &'static str,
    shortcut_registered: bool,
    start_at_login: bool,
    platform: &'static str,
}

fn show_window(app: &AppHandle, label: &str) -> Result<(), String> {
    let window = app.get_webview_window(label).ok_or_else(|| "desktop_window_unavailable".to_string())?;
    window.show().map_err(|_| "desktop_window_show_failed".to_string())?;
    window.set_focus().map_err(|_| "desktop_window_focus_failed".to_string())
}

#[tauri::command]
fn capture_open(app: AppHandle) -> Result<(), String> {
    show_window(&app, "quick-capture")
}

#[tauri::command]
fn clipboard_capture_selection() -> Result<ClipboardCapture, String> {
    let mut clipboard = arboard::Clipboard::new().map_err(|_| "clipboard_unavailable".to_string())?;
    let text = clipboard.get_text().map_err(|_| "clipboard_has_no_text".to_string())?;
    if text.len() > 1_000_000 {
        return Err("clipboard_text_too_large".to_string());
    }
    Ok(ClipboardCapture { text, mime_type: "text/plain" })
}

#[tauri::command]
async fn file_import_pick(app: AppHandle) -> Result<Option<PickedFile>, String> {
    let selected = app.dialog().file().blocking_pick_file();
    let Some(path) = selected.and_then(|file| file.into_path().ok()) else { return Ok(None); };
    let name = path.file_name().and_then(|value| value.to_str()).ok_or_else(|| "selected_file_name_invalid".to_string())?.to_string();
    Ok(Some(PickedFile { path: path.to_string_lossy().into_owned(), name }))
}

fn valid_record_id(value: &str) -> bool {
    value.len() == 36 && value.chars().enumerate().all(|(index, character)| {
        matches!(index, 8 | 13 | 18 | 23) && character == '-' || !matches!(index, 8 | 13 | 18 | 23) && character.is_ascii_hexdigit()
    })
}

#[tauri::command]
fn app_open_workspace(app: AppHandle, target: WorkspaceTarget) -> Result<(), String> {
    const WORKSPACES: [&str; 9] = ["inbox", "today", "calendar", "tasks", "brain", "search", "settings", "school", "life"];
    if !WORKSPACES.contains(&target.workspace.as_str()) || target.record_id.as_deref().is_some_and(|id| !valid_record_id(id)) {
        return Err("workspace_target_invalid".to_string());
    }
    show_window(&app, "main")?;
    app.emit_to("main", "desktop:navigate", target).map_err(|_| "desktop_navigation_failed".to_string())
}

#[tauri::command]
fn desktop_status(app: AppHandle) -> Result<DesktopStatus, String> {
    Ok(DesktopStatus {
        shortcut: DEFAULT_SHORTCUT,
        shortcut_registered: app.global_shortcut().is_registered(DEFAULT_SHORTCUT),
        start_at_login: app.autolaunch().is_enabled().map_err(|_| "autostart_status_unavailable".to_string())?,
        platform: "windows",
    })
}

#[tauri::command]
fn set_start_at_login(app: AppHandle, enabled: bool) -> Result<(), String> {
    let manager = app.autolaunch();
    if enabled { manager.enable() } else { manager.disable() }.map_err(|_| "autostart_change_failed".to_string())
}

pub fn run() {
    tauri::Builder::default()
        .manage(NativeClient::new())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
        .setup(|app| {
            let capture = MenuItem::with_id(app, "capture", "Quick capture", true, None::<&str>)?;
            let open = MenuItem::with_id(app, "open", "Open Sorta", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&capture, &open, &quit])?;
            let mut tray = TrayIconBuilder::new().tooltip("Sorta Omega").menu(&menu).on_menu_event(|app, event| match event.id().as_ref() {
                "capture" => { let _ = show_window(app, "quick-capture"); }
                "open" => { let _ = show_window(app, "main"); }
                "quit" => app.exit(0),
                _ => {}
            });
            if let Some(icon) = app.default_window_icon() { tray = tray.icon(icon.clone()); }
            tray.build(app)?;

            app.handle().plugin(tauri_plugin_global_shortcut::Builder::new().with_handler(|app, _shortcut, event| {
                if event.state() == ShortcutState::Pressed { let _ = show_window(app, "quick-capture"); }
            }).build())?;
            app.global_shortcut().register(DEFAULT_SHORTCUT)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![capture_open, clipboard_capture_selection, file_import_pick, app_open_workspace, desktop_status, set_start_at_login, native_pairing_begin, native_pairing_poll, native_auth_status, native_api_request, native_unpair])
        .run(tauri::generate_context!())
        .expect("Sorta desktop runtime failed");
}
