use std::time::{Duration, Instant};

use keyring::Entry;
use reqwest::{Client, Method, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::State;
use tokio::sync::Mutex;

const CREDENTIAL_SERVICE: &str = "app.sorta.omega";
const CREDENTIAL_ACCOUNT: &str = "native-device-refresh";
const MAX_REQUEST_BYTES: usize = 1_000_000;
const MAX_RESPONSE_BYTES: u64 = 5_000_000;
const ACCESS_REFRESH_AFTER: Duration = Duration::from_secs(14 * 60);

pub struct NativeClient {
    client: Client,
    origin: String,
    auth: Mutex<NativeAuthState>,
}

#[derive(Default)]
struct NativeAuthState {
    pending: Option<PendingPairing>,
    access: Option<MemoryAccess>,
}

struct PendingPairing {
    pairing_id: String,
    device_code: String,
}

struct MemoryAccess {
    token: String,
    refresh_after: Instant,
}

#[derive(Deserialize)]
struct PairingChallengeWire {
    pairing_id: String,
    device_code_once: String,
    user_code: String,
    expires_at: String,
}

#[derive(Deserialize)]
struct PendingWire {
    status: String,
    retry_after_seconds: u32,
}

#[derive(Deserialize, Serialize)]
struct TokenPairWire {
    device_id: String,
    access_token: String,
    refresh_token: String,
    expires_at: String,
    refresh_expires_at: String,
    vault_ids: Vec<String>,
    scopes: Vec<String>,
}

#[derive(Deserialize, Serialize)]
struct StoredCredential {
    refresh_token: String,
    device_id: String,
    refresh_expires_at: String,
    vault_ids: Vec<String>,
    scopes: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NativePairingChallenge {
    pairing_id: String,
    user_code: String,
    expires_at: String,
}

#[derive(Serialize)]
#[serde(tag = "status", rename_all = "lowercase")]
pub enum NativePairingStatus {
    Pending {
        #[serde(rename = "retryAfterSeconds")]
        retry_after_seconds: u32,
    },
    Paired {
        #[serde(rename = "deviceId")]
        device_id: String,
        #[serde(rename = "expiresAt")]
        expires_at: String,
        #[serde(rename = "refreshExpiresAt")]
        refresh_expires_at: String,
        #[serde(rename = "vaultIds")]
        vault_ids: Vec<String>,
        scopes: Vec<String>,
    },
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NativeAuthStatus {
    paired: bool,
    device_id: Option<String>,
    access_ready: bool,
    refresh_expires_at: Option<String>,
    vault_ids: Vec<String>,
    scopes: Vec<String>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct NativeApiRequest {
    method: String,
    path: String,
    body: Option<Value>,
}

#[derive(Serialize)]
pub struct NativeApiResponse {
    status: u16,
    body: Value,
}

impl NativeClient {
    pub fn new() -> Self {
        let configured = option_env!("SORTA_API_ORIGIN").unwrap_or("http://127.0.0.1:3210").trim_end_matches('/');
        let parsed = reqwest::Url::parse(configured).expect("SORTA_API_ORIGIN must be an absolute URL");
        let loopback_http = parsed.scheme() == "http" && matches!(parsed.host_str(), Some("127.0.0.1") | Some("localhost") | Some("[::1]"));
        assert!(parsed.scheme() == "https" || loopback_http, "SORTA_API_ORIGIN must use HTTPS unless it is loopback");
        assert!(parsed.username().is_empty() && parsed.password().is_none() && parsed.path() == "/" && parsed.query().is_none() && parsed.fragment().is_none(), "SORTA_API_ORIGIN cannot contain credentials, a path, query, or fragment");
        Self {
            client: Client::builder()
                .timeout(Duration::from_secs(30))
                .build()
                .expect("native HTTP client configuration is valid"),
            origin: configured.to_string(),
            auth: Mutex::new(NativeAuthState::default()),
        }
    }
}

fn credential_entry() -> Result<Entry, String> {
    Entry::new(CREDENTIAL_SERVICE, CREDENTIAL_ACCOUNT).map_err(|_| "credential_store_unavailable".to_string())
}

fn load_credential() -> Result<Option<StoredCredential>, String> {
    let entry = credential_entry()?;
    match entry.get_password() {
        Ok(value) => serde_json::from_str(&value).map(Some).map_err(|_| "stored_credential_invalid".to_string()),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(_) => Err("credential_store_read_failed".to_string()),
    }
}

fn save_credential(pair: &TokenPairWire) -> Result<(), String> {
    let stored = StoredCredential {
        refresh_token: pair.refresh_token.clone(),
        device_id: pair.device_id.clone(),
        refresh_expires_at: pair.refresh_expires_at.clone(),
        vault_ids: pair.vault_ids.clone(),
        scopes: pair.scopes.clone(),
    };
    let encoded = serde_json::to_string(&stored).map_err(|_| "credential_serialization_failed".to_string())?;
    credential_entry()?.set_password(&encoded).map_err(|_| "credential_store_write_failed".to_string())
}

fn delete_credential() -> Result<(), String> {
    let entry = credential_entry()?;
    match entry.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(_) => Err("credential_store_delete_failed".to_string()),
    }
}

fn install_token_pair(auth: &mut NativeAuthState, pair: &TokenPairWire) -> Result<(), String> {
    if let Err(error) = save_credential(pair) {
        let _ = delete_credential();
        auth.access = None;
        return Err(error);
    }
    auth.access = Some(MemoryAccess {
        token: pair.access_token.clone(),
        refresh_after: Instant::now() + ACCESS_REFRESH_AFTER,
    });
    Ok(())
}

fn valid_vault_path(path: &str) -> bool {
    let lowercase = path.to_ascii_lowercase();
    path.len() <= 4096
        && path.starts_with("/api/v1/vaults/")
        && !path.contains('\\')
        && !path.contains("://")
        && !path.contains("//")
        && !path.contains('#')
        && !lowercase.contains("%2e")
        && !lowercase.contains("%2f")
        && !lowercase.contains("%5c")
        && !path.split('?').next().unwrap_or(path).split('/').any(|segment| segment == "." || segment == "..")
}

async fn ensure_access(client: &NativeClient) -> Result<String, String> {
    let mut auth = client.auth.lock().await;
    if let Some(access) = &auth.access {
        if access.refresh_after > Instant::now() {
            return Ok(access.token.clone());
        }
    }

    let stored = load_credential()?.ok_or_else(|| "native_pairing_required".to_string())?;
    let response = client.client
        .post(format!("{}/api/v1/auth/token/refresh", client.origin))
        .json(&json!({ "refresh_token": stored.refresh_token }))
        .send().await.map_err(|_| "native_api_unreachable".to_string())?;
    if response.status().is_server_error() {
        return Err("native_refresh_temporarily_unavailable".to_string());
    }
    if !response.status().is_success() {
        auth.access = None;
        let _ = delete_credential();
        return Err("native_refresh_rejected_pair_again".to_string());
    }
    let pair: TokenPairWire = match response.json().await {
        Ok(pair) => pair,
        Err(_) => {
            auth.access = None;
            let _ = delete_credential();
            return Err("native_refresh_response_invalid_pair_again".to_string());
        }
    };
    install_token_pair(&mut auth, &pair)?;
    Ok(pair.access_token)
}

#[tauri::command]
pub async fn native_pairing_begin(state: State<'_, NativeClient>, device_name: String) -> Result<NativePairingChallenge, String> {
    let device_name = device_name.trim();
    if device_name.is_empty() || device_name.chars().count() > 120 {
        return Err("device_name_invalid".to_string());
    }
    let response = state.client
        .post(format!("{}/api/v1/device-pairings", state.origin))
        .json(&json!({ "device_name": device_name, "requested_role": "client", "client_public_key": null }))
        .send().await.map_err(|_| "native_api_unreachable".to_string())?;
    if response.status() != StatusCode::CREATED {
        return Err("pairing_begin_rejected".to_string());
    }
    let challenge: PairingChallengeWire = response.json().await.map_err(|_| "pairing_response_invalid".to_string())?;
    let output = NativePairingChallenge {
        pairing_id: challenge.pairing_id.clone(),
        user_code: challenge.user_code,
        expires_at: challenge.expires_at,
    };
    let mut auth = state.auth.lock().await;
    auth.pending = Some(PendingPairing { pairing_id: challenge.pairing_id, device_code: challenge.device_code_once });
    Ok(output)
}

#[tauri::command]
pub async fn native_pairing_poll(state: State<'_, NativeClient>) -> Result<NativePairingStatus, String> {
    let mut auth = state.auth.lock().await;
    let pending = auth.pending.as_ref().ok_or_else(|| "pairing_not_started".to_string())?;
    let response = state.client
        .post(format!("{}/api/v1/device-pairings/{}/exchange", state.origin, pending.pairing_id))
        .json(&json!({ "device_code": pending.device_code }))
        .send().await.map_err(|_| "native_api_unreachable".to_string())?;
    if response.status() == StatusCode::ACCEPTED {
        let pending: PendingWire = response.json().await.map_err(|_| "pairing_response_invalid".to_string())?;
        if pending.status != "pending" {
            return Err("pairing_response_invalid".to_string());
        }
        return Ok(NativePairingStatus::Pending { retry_after_seconds: pending.retry_after_seconds });
    }
    if response.status().is_server_error() {
        return Err("pairing_exchange_temporarily_unavailable".to_string());
    }
    if !response.status().is_success() {
        auth.pending = None;
        return Err("pairing_exchange_rejected".to_string());
    }
    let pair: TokenPairWire = response.json().await.map_err(|_| "pairing_response_invalid".to_string())?;
    install_token_pair(&mut auth, &pair)?;
    auth.pending = None;
    Ok(NativePairingStatus::Paired {
        device_id: pair.device_id,
        expires_at: pair.expires_at,
        refresh_expires_at: pair.refresh_expires_at,
        vault_ids: pair.vault_ids,
        scopes: pair.scopes,
    })
}

#[tauri::command]
pub async fn native_auth_status(state: State<'_, NativeClient>) -> Result<NativeAuthStatus, String> {
    let auth = state.auth.lock().await;
    let access_ready = auth.access.as_ref().is_some_and(|access| access.refresh_after > Instant::now());
    let stored = load_credential()?;
    Ok(match stored {
        Some(value) => NativeAuthStatus {
            paired: true,
            device_id: Some(value.device_id),
            access_ready,
            refresh_expires_at: Some(value.refresh_expires_at),
            vault_ids: value.vault_ids,
            scopes: value.scopes,
        },
        None => NativeAuthStatus { paired: false, device_id: None, access_ready: false, refresh_expires_at: None, vault_ids: vec![], scopes: vec![] },
    })
}

#[tauri::command]
pub async fn native_api_request(state: State<'_, NativeClient>, request: NativeApiRequest) -> Result<NativeApiResponse, String> {
    if !valid_vault_path(&request.path) {
        return Err("native_api_path_rejected".to_string());
    }
    let method = Method::from_bytes(request.method.as_bytes()).map_err(|_| "native_api_method_rejected".to_string())?;
    if !matches!(method.as_str(), "GET" | "POST" | "PUT" | "PATCH" | "DELETE") {
        return Err("native_api_method_rejected".to_string());
    }
    if let Some(body) = &request.body {
        if serde_json::to_vec(body).map_err(|_| "native_api_body_invalid".to_string())?.len() > MAX_REQUEST_BYTES {
            return Err("native_api_body_too_large".to_string());
        }
    }
    let access = ensure_access(&state).await?;
    let mut outgoing = state.client.request(method, format!("{}{}", state.origin, request.path)).bearer_auth(access);
    if let Some(body) = request.body {
        outgoing = outgoing.json(&body);
    }
    let response = outgoing.send().await.map_err(|_| "native_api_unreachable".to_string())?;
    let status = response.status();
    if response.content_length().is_some_and(|length| length > MAX_RESPONSE_BYTES) {
        return Err("native_api_response_too_large".to_string());
    }
    let bytes = response.bytes().await.map_err(|_| "native_api_response_read_failed".to_string())?;
    if bytes.len() as u64 > MAX_RESPONSE_BYTES {
        return Err("native_api_response_too_large".to_string());
    }
    if status == StatusCode::UNAUTHORIZED {
        state.auth.lock().await.access = None;
    }
    let body = if bytes.is_empty() { Value::Null } else {
        serde_json::from_slice(&bytes).unwrap_or_else(|_| Value::String(String::from_utf8_lossy(&bytes).into_owned()))
    };
    Ok(NativeApiResponse { status: status.as_u16(), body })
}

#[tauri::command]
pub async fn native_unpair(state: State<'_, NativeClient>) -> Result<(), String> {
    let mut auth = state.auth.lock().await;
    auth.pending = None;
    auth.access = None;
    delete_credential()
}

#[cfg(test)]
mod tests {
    use super::valid_vault_path;

    #[test]
    fn accepts_only_canonical_vault_paths() {
        assert!(valid_vault_path("/api/v1/vaults/00000000-0000-4000-8000-000000000042/tasks?limit=10"));
        assert!(!valid_vault_path("https://attacker.example/api/v1/vaults/x"));
        assert!(!valid_vault_path("/api/v1/auth/sessions"));
        assert!(!valid_vault_path("/api/v1/vaults/x/%2e%2e/auth"));
        assert!(!valid_vault_path("/api/v1/vaults//tasks"));
    }
}
