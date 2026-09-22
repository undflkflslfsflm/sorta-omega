use serde::{Deserialize, Serialize};
use std::{env, path::{Path, PathBuf}, time::Duration};
use tauri::{AppHandle, Emitter, Manager};
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri_plugin_autostart::ManagerExt as AutostartExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, ShortcutState};

mod native_auth;
use native_auth::{native_api_request, native_auth_status, native_pairing_begin, native_pairing_poll, native_unpair, upload_file, NativeClient};

const DEFAULT_SHORTCUT: &str = "Ctrl+Shift+Space";

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ClipboardCapture {
    text: String,
    mime_type: &'static str,
}

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkspaceTarget {
    workspace: String,
    record_id: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct EventSourceTarget {
    kind: String,
    record_id: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopStatus {
    shortcut: &'static str,
    shortcut_registered: bool,
    start_at_login: bool,
    platform: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct HostPreflightCheck {
    kind: &'static str,
    status: &'static str,
    detail: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct HostPreflight {
    platform: &'static str,
    architecture: &'static str,
    checks: Vec<HostPreflightCheck>,
    mutations_applied: bool,
    secrets_included: bool,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ModelSummary {
    id: String,
    digest: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ModelRuntimeInspection {
    backend: &'static str,
    endpoint: &'static str,
    status: &'static str,
    models: Vec<ModelSummary>,
    limitation: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ModelInspection {
    runtimes: Vec<ModelRuntimeInspection>,
    mutations_applied: bool,
    credentials_sent: bool,
}

fn path_has_executable(file_names: &[&str], fixed_candidates: &[PathBuf]) -> bool {
    if fixed_candidates.iter().any(|candidate| candidate.is_file()) { return true; }
    env::var_os("PATH").is_some_and(|value| env::split_paths(&value).any(|directory| {
        file_names.iter().any(|file_name| Path::new(&directory).join(file_name).is_file())
    }))
}

fn program_files_candidate(relative: &str) -> Vec<PathBuf> {
    ["ProgramFiles", "ProgramFiles(x86)"].iter().filter_map(|name| env::var_os(name)).map(|root| PathBuf::from(root).join(relative)).collect()
}

fn local_app_data_candidate(relative: &str) -> Vec<PathBuf> {
    env::var_os("LOCALAPPDATA").map(|root| vec![PathBuf::from(root).join(relative)]).unwrap_or_default()
}

fn executable_check(kind: &'static str, available: bool, present: &'static str, absent: &'static str) -> HostPreflightCheck {
    HostPreflightCheck { kind, status: if available { "pass" } else { "fail" }, detail: if available { present } else { absent } }
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
async fn file_import(app: AppHandle, state: tauri::State<'_, NativeClient>, vault_id: String) -> Result<Option<serde_json::Value>, String> {
    let selected = app.dialog().file().blocking_pick_file();
    let Some(path) = selected.and_then(|file| file.into_path().ok()) else { return Ok(None); };
    upload_file(&state, &vault_id, &path).await.map(Some)
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
    emit_navigation(&app, target)
}

fn emit_navigation(app: &AppHandle, target: WorkspaceTarget) -> Result<(), String> {
    show_window(&app, "main")?;
    app.emit_to("main", "desktop:navigate", target).map_err(|_| "desktop_navigation_failed".to_string())
}

#[tauri::command]
fn launch_calendar_view(app: AppHandle) -> Result<(), String> {
    emit_navigation(&app, WorkspaceTarget { workspace: "calendar".to_string(), record_id: None })
}

#[tauri::command]
fn open_calendar_event(app: AppHandle, event_id: String) -> Result<(), String> {
    if !valid_record_id(&event_id) { return Err("calendar_event_id_invalid".to_string()); }
    emit_navigation(&app, WorkspaceTarget { workspace: "calendar".to_string(), record_id: Some(event_id) })
}

#[tauri::command]
fn open_commitment(app: AppHandle, commitment_id: String) -> Result<(), String> {
    if !valid_record_id(&commitment_id) { return Err("commitment_id_invalid".to_string()); }
    emit_navigation(&app, WorkspaceTarget { workspace: "life".to_string(), record_id: Some(commitment_id) })
}

#[tauri::command]
fn navigate_to_event_source(app: AppHandle, target: EventSourceTarget) -> Result<(), String> {
    if !valid_record_id(&target.record_id) { return Err("event_source_record_id_invalid".to_string()); }
    let workspace = match target.kind.as_str() {
        "note" => "brain",
        "task" => "tasks",
        "calendar_event" => "calendar",
        "commitment" => "life",
        _ => return Err("event_source_kind_invalid".to_string()),
    };
    emit_navigation(&app, WorkspaceTarget { workspace: workspace.to_string(), record_id: Some(target.record_id) })
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
fn host_preflight() -> HostPreflight {
    let mut docker_candidates=program_files_candidate(r"Docker\Docker\resources\bin\docker.exe");
    let tailscale_candidates=program_files_candidate(r"Tailscale\tailscale.exe");
    let mut ollama_candidates=program_files_candidate(r"Ollama\ollama.exe");
    ollama_candidates.extend(local_app_data_candidate(r"Programs\Ollama\ollama.exe"));
    docker_candidates.extend(local_app_data_candidate(r"Docker\Docker\resources\bin\docker.exe"));
    let architecture=match env::consts::ARCH { "x86_64"=>"x86_64", "aarch64"=>"aarch64", "x86"=>"x86", _=>"unknown" };
    HostPreflight {
        platform: "windows",
        architecture,
        checks: vec![
            HostPreflightCheck { kind:"desktop_runtime",status:"pass",detail:"The packaged Windows host command executed." },
            executable_check("docker_cli",path_has_executable(&["docker.exe","docker"],&docker_candidates),"Docker CLI is installed in a recognized local location.","Docker CLI was not found in PATH or a recognized local install location."),
            executable_check("tailscale_cli",path_has_executable(&["tailscale.exe","tailscale"],&tailscale_candidates),"Tailscale CLI is installed in a recognized local location.","Tailscale CLI was not found in PATH or a recognized local install location."),
            executable_check("ollama_cli",path_has_executable(&["ollama.exe","ollama"],&ollama_candidates),"Ollama CLI is installed in a recognized local location.","Ollama CLI was not found in PATH or a recognized local install location."),
            executable_check("node_runtime",path_has_executable(&["node.exe","node"],&[]),"Node runtime is available in the desktop process PATH.","Node runtime is not available in the desktop process PATH."),
            executable_check("pnpm_runtime",path_has_executable(&["pnpm.cmd","pnpm.exe","pnpm"],&[]),"pnpm is available in the desktop process PATH.","pnpm is not available in the desktop process PATH."),
            executable_check("rust_toolchain",path_has_executable(&["cargo.exe","cargo"],&[]),"Rust Cargo is available in the desktop process PATH.","Rust Cargo is not available in the desktop process PATH."),
            HostPreflightCheck { kind:"hardware_inventory",status:"unknown",detail:"Hardware inventory requires the separately reviewed host doctor; this bounded command does not infer it." },
            HostPreflightCheck { kind:"service_state",status:"unknown",detail:"Service readiness was not probed; installed command presence is not represented as a running service." },
        ],
        mutations_applied: false,
        secrets_included: false,
    }
}

async fn inspect_model_runtime(client: &reqwest::Client, backend: &'static str, endpoint: &'static str) -> ModelRuntimeInspection {
    const LIMITATION: &str = "A model listing proves runtime presence only; capability, quality, digest trust and resource use require a real test.";
    let response=match client.get(endpoint).header("accept","application/json").send().await {
        Ok(response) if response.status().is_success()=>response,
        _=>return ModelRuntimeInspection { backend,endpoint,status:"unavailable",models:Vec::new(),limitation:LIMITATION },
    };
    let bytes=match response.bytes().await {
        Ok(bytes) if bytes.len()<=1_048_576=>bytes,
        _=>return ModelRuntimeInspection { backend,endpoint,status:"invalid_response",models:Vec::new(),limitation:LIMITATION },
    };
    let value:serde_json::Value=match serde_json::from_slice(&bytes) {
        Ok(value)=>value,
        Err(_)=>return ModelRuntimeInspection { backend,endpoint,status:"invalid_response",models:Vec::new(),limitation:LIMITATION },
    };
    let entries=if backend=="ollama" { value.get("models") } else { value.get("data") }.and_then(|item| item.as_array());
    let Some(entries)=entries else { return ModelRuntimeInspection { backend,endpoint,status:"invalid_response",models:Vec::new(),limitation:LIMITATION }; };
    let models=entries.iter().filter_map(|item| {
        let id=if backend=="ollama" { item.get("name") } else { item.get("id") }?.as_str()?;
        if id.is_empty()||id.len()>300{return None;}
        let digest=item.get("digest").and_then(|value| value.as_str()).filter(|value| !value.is_empty()&&value.len()<=300).map(str::to_string);
        Some(ModelSummary { id:id.to_string(),digest })
    }).take(200).collect();
    ModelRuntimeInspection { backend,endpoint,status:"available",models,limitation:LIMITATION }
}

#[tauri::command]
async fn model_inspect() -> Result<ModelInspection, String> {
    let client=reqwest::Client::builder().timeout(Duration::from_secs(3)).redirect(reqwest::redirect::Policy::none()).build().map_err(|_| "model_inspection_client_unavailable".to_string())?;
    let generation=inspect_model_runtime(&client,"openai_compatible","http://127.0.0.1:8000/v1/models").await;
    let embedding=inspect_model_runtime(&client,"ollama","http://127.0.0.1:11434/api/tags").await;
    Ok(ModelInspection { runtimes:vec![generation,embedding],mutations_applied:false,credentials_sent:false })
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
        .invoke_handler(tauri::generate_handler![capture_open, clipboard_capture_selection, file_import, app_open_workspace, launch_calendar_view, open_calendar_event, open_commitment, navigate_to_event_source, desktop_status, host_preflight, model_inspect, set_start_at_login, native_pairing_begin, native_pairing_poll, native_auth_status, native_api_request, native_unpair])
        .run(tauri::generate_context!())
        .expect("Sorta desktop runtime failed");
}
