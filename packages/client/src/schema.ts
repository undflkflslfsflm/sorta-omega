/* This file is generated from docs/openapi.json. Do not edit by hand. */
export interface paths {
    "/api/v1/integration-providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listIntegrationProviders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/oauth/{providerId}/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["providerOAuthCallback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/oauth/microsoft/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["microsoftOAuthCallback"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/microsoft/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["microsoftChangeNotifications"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/integrations/google/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["googleCalendarChangeNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/people": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPeople"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/people/{personId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPersonContext"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/people/{personId}/availability-proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["proposeSocialTime"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["healthLive"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["healthReady"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/meta": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getMeta"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPreferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updatePreferences"];
        trace?: never;
    };
    "/api/v1/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system-jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSystemJobs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system-jobs/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSystemJob"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system-jobs/{jobId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelSystemJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system-jobs/{jobId}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["retrySystemJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/system-jobs/{jobId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["streamSystemJobEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/backups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listBackups"];
        put?: never;
        post: operations["createBackup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/backups/{backupId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getBackupManifest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/backups/{backupId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["downloadBackup"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/backups/{backupId}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["verifyBackup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/restore-plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createRestorePlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/restore-plans/{restorePlanId}/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["applyRestore"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/host/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getHostResources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/deployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getDeploymentProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/deployment/checks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["checkDeployment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/deployment/access-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewRemoteAccessSetup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/resource-policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getHostResourcePolicy"];
        put: operations["setHostResourcePolicy"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listVaults"];
        put?: never;
        post: operations["createVault"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getVault"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateVault"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/purge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["purgeVault"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/uploads": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/uploads/{uploadId}/parts/{partNumber}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["putUploadPart"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/uploads/{uploadId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["completeUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/uploads/{uploadId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["cancelUpload"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/blobs/{blobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getBlobMetadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/blobs/{blobId}/content": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getBlobContent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/imports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["planImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/imports/{importId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getImport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/imports/{importId}/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["applyImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/exports/{exportId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getExport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/exports/{exportId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["downloadExport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/bootstrap/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["bootstrapOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/bootstrap/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["bootstrapVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["loginOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["loginVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/recovery": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["recoverAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/passkeys": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPasskeys"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/passkeys/options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["passkeyOptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/passkeys/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["passkeyVerify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/passkeys/{passkeyId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deletePasskey"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/recovery-codes/rotate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["rotateRecoveryCodes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSessions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["revokeSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/token/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refreshNativeToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/device-pairings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createPairing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/device-pairings/{pairingId}/approve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["approvePairing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/device-pairings/{pairingId}/exchange": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["exchangePairing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/devices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listDevices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/devices/{deviceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["revokeDevice"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/devices/{deviceId}/cache-policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getDeviceCachePolicy"];
        put: operations["setDeviceCachePolicy"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/devices/{deviceId}/cache-purge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["requestDeviceCachePurge"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tokens": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listApiTokens"];
        put?: never;
        post: operations["createApiToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/tokens/{tokenId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["revokeApiToken"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listNotes"];
        put?: never;
        post: operations["createNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNote"];
        put?: never;
        post?: never;
        delete: operations["trashNote"];
        options?: never;
        head?: never;
        patch: operations["updateNoteMetadata"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/purge": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["purgeNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restoreTrashedNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/document": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNoteDocument"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/edits": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["editNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/reprocess": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reprocessNote"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/revisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listNoteRevisions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNoteRevision"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/revisions/{revisionId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restoreNoteRevision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/corrections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["correctOrganization"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/labels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listLabels"];
        put?: never;
        post: operations["createLabel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/labels/{labelId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteLabel"];
        options?: never;
        head?: never;
        patch: operations["updateLabel"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/labels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNoteLabels"];
        put: operations["setNoteLabels"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/collections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCollections"];
        put?: never;
        post: operations["createCollection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/collections/{collectionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteCollection"];
        options?: never;
        head?: never;
        patch: operations["updateCollection"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/collections/{collectionId}/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCollectionItems"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/rules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listRoutingRules"];
        put?: never;
        post: operations["createRoutingRule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/rules/{ruleId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteRoutingRule"];
        options?: never;
        head?: never;
        patch: operations["updateRoutingRule"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/rules/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewRoutingRule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/relationships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listRelationships"];
        put?: never;
        post: operations["createRelationship"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/relationships/{relationshipId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteRelationship"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notes/{noteId}/related": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getRelatedNotes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/resurfacing/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["resurfacingFeedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/captures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createCapture"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/url-captures": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createUrlCapture"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/generations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["generateArtifact"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/captures/{captureId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCapture"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listConnections"];
        put?: never;
        post: operations["createConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConnection"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["beginProviderAuthorization"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/reauthorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reauthorizeProvider"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConnectionCapabilities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/probe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["probeConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/mapping": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConnectionMapping"];
        put: operations["setConnectionMapping"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listConnectionResources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/selection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConnectionSelection"];
        put: operations["selectConnectionResources"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["syncConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/sync-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getConnectionSyncStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["setConnectionSchedule"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewConnectionDisconnect"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/source-objects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSourceObjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/source-objects/{sourceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSourceObject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/source-objects/{sourceId}/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refreshSourceObject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/source-objects/{sourceId}/exclusion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["excludeSourceObject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/transcripts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listTranscripts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/transcripts/{transcriptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getTranscript"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["correctTranscript"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/transcripts/{transcriptId}/lesson-association": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["associateTranscriptWithLesson"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/transcripts/{transcriptId}/analysis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["analyzeTranscript"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/connections/{connectionId}/disconnect": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["disconnectConnection"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/insights": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listInsights"];
        put?: never;
        post: operations["generateInsight"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/insights/{insightId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getInsight"];
        put?: never;
        post?: never;
        delete: operations["archiveInsight"];
        options?: never;
        head?: never;
        patch: operations["updateInsightFeedback"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPersonalDataItems"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["syncSelectedPersonalData"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/policies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPersonalDataPolicies"];
        put: operations["setPersonalDataPolicies"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/items/{itemId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPersonalDataItem"];
        put?: never;
        post?: never;
        delete: operations["deletePersonalDataItem"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/import-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewPersonalDataImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/import-previews/{previewId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPersonalDataImportPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-data/import-previews/{previewId}/apply": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["applyPersonalDataImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/interests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listInterests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/interests/{interestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getInterest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateInterest"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refreshPersonalProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile/rebuild": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["rebuildPersonalProfile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile/interests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listInterestClaims"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile/interests/{interestId}/evidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getInterestEvidence"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile/interests/{interestId}/decision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["decideInterestClaim"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tasks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listTasks"];
        put?: never;
        post: operations["createTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listProjects"];
        put?: never;
        post: operations["createProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/projects/{projectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProject"];
        put?: never;
        post?: never;
        delete: operations["archiveProject"];
        options?: never;
        head?: never;
        patch: operations["updateProject"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ideas": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listIdeas"];
        put?: never;
        post: operations["createIdea"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ideas/{ideaId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getIdea"];
        put?: never;
        post?: never;
        delete: operations["archiveIdea"];
        options?: never;
        head?: never;
        patch: operations["updateIdea"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/goals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listGoals"];
        put?: never;
        post: operations["createGoal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/goals/{goalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getGoal"];
        put?: never;
        post?: never;
        delete: operations["archiveGoal"];
        options?: never;
        head?: never;
        patch: operations["updateGoal"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/memories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listMemories"];
        put?: never;
        post: operations["createMemory"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/memories/{memoryId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getMemory"];
        put?: never;
        post?: never;
        delete: operations["archiveMemory"];
        options?: never;
        head?: never;
        patch: operations["updateMemory"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/personal-profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPersonalProfile"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tasks/{taskId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getTask"];
        put?: never;
        post?: never;
        delete: operations["deleteTask"];
        options?: never;
        head?: never;
        patch: operations["updateTask"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tasks/{taskId}/execution-history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getTaskExecutionHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/reminders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listReminders"];
        put?: never;
        post: operations["createReminder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/reminders/{reminderId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["deleteReminder"];
        options?: never;
        head?: never;
        patch: operations["updateReminder"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listNotifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/notifications/{notificationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateNotification"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-entities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendarEntities"];
        put?: never;
        post: operations["createCalendarEntity"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-entities/{entityId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendarEntity"];
        put?: never;
        post?: never;
        delete: operations["archiveCalendarEntity"];
        options?: never;
        head?: never;
        patch: operations["updateCalendarEntity"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["addEntityAlias"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-entities/{entityId}/aliases/{aliasId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["removeEntityAlias"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-entities/merge-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewEntityMerge"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-policies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendarPolicies"];
        put: operations["setCalendarPolicies"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-policies/dry-run": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["dryRunCalendarPolicy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-decisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendarDecisions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-decisions/{decisionId}/undo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["undoCalendarDecision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/commitments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCommitments"];
        put?: never;
        post: operations["createCommitment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/commitments/{commitmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCommitment"];
        put?: never;
        post?: never;
        delete: operations["archiveCommitment"];
        options?: never;
        head?: never;
        patch: operations["updateCommitment"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/commitments/{commitmentId}/match": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["rematchCommitment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendars": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendars"];
        put?: never;
        post: operations["createCalendar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendars/{calendarId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendar"];
        put?: never;
        post?: never;
        delete: operations["archiveCalendar"];
        options?: never;
        head?: never;
        patch: operations["updateCalendar"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendarEvents"];
        put?: never;
        post: operations["createCalendarEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-view": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendarView"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar/brief": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendarBrief"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar/brief-refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refreshCalendarBrief"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCalendarEvent"];
        put?: never;
        post?: never;
        delete: operations["trashCalendarEvent"];
        options?: never;
        head?: never;
        patch: operations["updateCalendarEvent"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["restoreCalendarEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/revisions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendarEventRevisions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/occurrences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listEventOccurrences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createEventException"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/exceptions/{exceptionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["removeEventException"];
        options?: never;
        head?: never;
        patch: operations["updateEventException"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar/free-busy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["calendarFreeBusy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar/conflicts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCalendarConflicts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar/preparation-plan": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewPreparationPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["exportCalendar"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-import-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewCalendarImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/private-context": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPrivateEventContext"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/context-refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["refreshPrivateEventContext"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/reminder-plan": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getEventReminderPlan"];
        put?: never;
        post: operations["setEventReminderPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createPrepItem"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/prep-items/{prepId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["removePrepItem"];
        options?: never;
        head?: never;
        patch: operations["updatePrepItem"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-events/{eventId}/provider-action-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewProviderCalendarAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-provider-actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listProviderCalendarActions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProviderCalendarAction"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/reconcile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reconcileProviderCalendarAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/calendar-provider-actions/{actionId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelPendingProviderCalendarAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["searchNotes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/chats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listChats"];
        put?: never;
        post: operations["createChat"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/chats/{chatId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getChat"];
        put?: never;
        post?: never;
        delete: operations["deleteChat"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/chats/{chatId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listMessages"];
        put?: never;
        post: operations["askNotes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/search/suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["suggestSearch"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/citations/{citationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["resolveCitation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listJobs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/jobs/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getJob"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/jobs/{jobId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/jobs/{jobId}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["retryJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/jobs/{jobId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["streamJobEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAiStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai/policy": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getVaultAiPolicy"];
        put: operations["setVaultAiPolicy"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai/disclosure-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewAiDisclosure"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/agent-tools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAgentTools"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tool-runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["runDomainTool"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tool-policies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getToolPolicies"];
        put: operations["setToolPolicies"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/commands": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["executeNaturalLanguageCommand"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/ai/models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listModelProfiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai/tests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["testAiSetup"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai-operations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAiOperations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai-operations/{operationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAiOperation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ai-operations/{operationId}/undo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["undoAiOperation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/activity": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getActivity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSubjects"];
        put?: never;
        post: operations["createSubject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/subjects/{subjectId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSubject"];
        put?: never;
        post?: never;
        delete: operations["archiveSubject"];
        options?: never;
        head?: never;
        patch: operations["updateSubject"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/courses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCourses"];
        put?: never;
        post: operations["createCourse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/courses/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getCourse"];
        put?: never;
        post?: never;
        delete: operations["archiveCourse"];
        options?: never;
        head?: never;
        patch: operations["updateCourse"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/courses/{courseId}/materials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listCourseMaterials"];
        put?: never;
        post: operations["linkCourseMaterial"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/courses/{courseId}/materials/{materialLinkId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["unlinkCourseMaterial"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/teachers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSchoolTeachers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchoolOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/import-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewSchoolImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/connections/{connectionId}/readiness": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchoolConnectionReadiness"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSchoolAssignments"];
        put?: never;
        post: operations["createManualSchoolAssignment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/assignments/{assignmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchoolAssignment"];
        put?: never;
        post?: never;
        delete: operations["archiveSchoolAssignment"];
        options?: never;
        head?: never;
        patch: operations["updateSchoolAssignmentOverlay"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/assignments/{assignmentId}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["archiveSchoolAssignmentOverlay"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/lessons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listSchoolLessons"];
        put?: never;
        post: operations["createSchoolLesson"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/lessons/{schoolLessonId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchoolLesson"];
        put?: never;
        post?: never;
        delete: operations["archiveSchoolLesson"];
        options?: never;
        head?: never;
        patch: operations["updateSchoolLesson"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/catch-up-plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createCatchUpPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/assessments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAssessments"];
        put?: never;
        post: operations["createAssessment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/assessments/{assessmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAssessment"];
        put?: never;
        post?: never;
        delete: operations["archiveAssessment"];
        options?: never;
        head?: never;
        patch: operations["updateAssessment"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/attendance/records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAttendanceRecords"];
        put?: never;
        post: operations["createAttendanceRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/attendance/records/{attendanceRecordId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAttendanceRecord"];
        put?: never;
        post?: never;
        delete: operations["archiveAttendanceRecord"];
        options?: never;
        head?: never;
        patch: operations["updateAttendanceRecord"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/attendance/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAttendanceSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/attendance/catch-up-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewAttendanceCatchUp"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/grades": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listGrades"];
        put?: never;
        post: operations["createGrade"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/grades/{gradeId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getGrade"];
        put?: never;
        post?: never;
        delete: operations["archiveGrade"];
        options?: never;
        head?: never;
        patch: operations["updateGrade"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/grades": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listGradeRecords"];
        put?: never;
        post: operations["createGradeRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/school/grades/{gradeRecordId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getGradeRecord"];
        put?: never;
        post?: never;
        delete: operations["archiveGradeRecord"];
        options?: never;
        head?: never;
        patch: operations["updateGradeRecord"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/targets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listPerformanceTargets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/targets/{courseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["setPerformanceTarget"];
        post?: never;
        delete: operations["removePerformanceTarget"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getPerformanceSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["generateStudyRecommendations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listStudyPlans"];
        put?: never;
        post: operations["createStudyPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/plans/{studyPlanId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStudyPlan"];
        put?: never;
        post?: never;
        delete: operations["archiveStudyPlan"];
        options?: never;
        head?: never;
        patch: operations["updateStudyPlan"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/plans/{studyPlanId}/withdraw": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["withdrawStudyPlan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/exercises": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listStudyExercises"];
        put?: never;
        post: operations["generateStudyExercise"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/exercises/{exerciseId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStudyExercise"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/exercises/{exerciseId}/attempts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["submitStudyAttempt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/attempts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listStudyAttempts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/attempts/{attemptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStudyAttempt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/attempts/{attemptId}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["gradeStudyAttempt"];
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["correctStudyFeedback"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/activities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listStudyActivities"];
        put?: never;
        post: operations["createStudyActivity"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/activities/{activityId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStudyActivity"];
        put?: never;
        post?: never;
        delete: operations["archiveStudyActivity"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/activities/{activityId}/responses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["submitStudyResponse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listStudySessions"];
        put?: never;
        post: operations["createStudySession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/sessions/{studySessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getStudySession"];
        put?: never;
        post?: never;
        delete: operations["archiveStudySession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/sessions/{studySessionId}/actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["applyStudySessionAction"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/knowledge-gaps": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listKnowledgeGaps"];
        put?: never;
        post: operations["createReportedKnowledgeGap"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/knowledge-gaps/{gapId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["updateKnowledgeGap"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/performance/knowledge-gaps/{gapId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["correctKnowledgeGap"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/decks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listFlashcardDecks"];
        put?: never;
        post: operations["createFlashcardDeck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/decks/{flashcardDeckId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getFlashcardDeck"];
        put?: never;
        post?: never;
        delete: operations["archiveFlashcardDeck"];
        options?: never;
        head?: never;
        patch: operations["updateFlashcardDeck"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/cards": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listFlashcards"];
        put?: never;
        post: operations["createFlashcard"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/cards/{flashcardId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getFlashcard"];
        put?: never;
        post?: never;
        delete: operations["archiveFlashcard"];
        options?: never;
        head?: never;
        patch: operations["updateFlashcard"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/review-queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getFlashcardReviewQueue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/cards/{flashcardId}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["recordFlashcardReview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/study/flashcards/{flashcardId}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["reviewFlashcard"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchedulerPreferences"];
        put: operations["setSchedulerPreferences"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewSchedule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/constraints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getSchedulingConstraints"];
        put: operations["setSchedulingConstraints"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/plans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["proposeSchedule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/replan": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewReplan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/replans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["proposeReplan"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/explanations/{proposalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getScheduleExplanation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/proposals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listProposals"];
        put?: never;
        post: operations["createProposal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/proposals/{proposalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getProposal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/proposals/{proposalId}/reject": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["rejectProposal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/proposals/{proposalId}/accept": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["acceptProposal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/proposals/{proposalId}/undo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["undoProposalApplication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ideas/{ideaId}/promotion-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["previewIdeaPromotion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/ideas/{ideaId}/project-proposal": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["proposeIdeaProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/tasks/{taskId}/breakdown": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["proposeTaskBreakdown"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/execution-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["startExecutionSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/execution-sessions/{executionSessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getExecutionSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/execution-sessions/{executionSessionId}/transition": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["transitionExecutionSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/index/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getIndexStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/index/rebuild": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["rebuildIndex"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/heartbeat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["workerHeartbeat"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["claimWorkerJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/input": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getWorkerJobInput"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/sources/{sourceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getWorkerJobSource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/evidence": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["getWorkerJobEvidence"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/index-batches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["appendWorkerIndexBatch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/heartbeat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["renewWorkerLease"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["appendWorkerEvents"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["completeWorkerJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/worker/jobs/{jobId}/fail": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["failWorkerJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listWorkers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/workers/{workerId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["configureWorker"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/today": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getToday"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/scheduler/recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNextActionCandidates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/next-actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getNextActions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/momentum/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getMomentumSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/momentum/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["setMomentumPreferences"];
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/sync/pull": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["pullSync"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/sync/push": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["pushSync"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/sync/snapshots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["createSyncSnapshot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/sync/ws": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["openSyncSocket"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/vaults/{vaultId}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["streamVaultEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        Health: {
            /** @enum {string} */
            status: "ok" | "ready";
        };
        Meta: {
            api_version: string;
            client_min_version: string;
            schema_version: number;
        };
        Preferences: {
            locale: string;
            timezone: string;
            notificationChannels: ("in_app" | "windows_native")[];
            protectFocusTime: boolean;
            defaultFocusMinutes: number;
            profileInferenceEnabled: boolean;
            expandedDataEgressEnabled: boolean;
            /** @enum {string} */
            defaultPersonalDataSync: "off" | "manual" | "scheduled";
            sensitiveSchoolCategories: ("attendance" | "performance" | "health" | "accommodations" | "discipline")[];
            revision: number;
            /** Format: date-time */
            updatedAt: string;
        };
        UpdatePreferences: {
            expectedRevision: number;
            patch: {
                locale?: string;
                timezone?: string;
                notificationChannels?: ("in_app" | "windows_native")[];
                protectFocusTime?: boolean;
                defaultFocusMinutes?: number;
                profileInferenceEnabled?: boolean;
                expandedDataEgressEnabled?: boolean;
                /** @enum {string} */
                defaultPersonalDataSync?: "off" | "manual" | "scheduled";
                sensitiveSchoolCategories?: ("attendance" | "performance" | "health" | "accommodations" | "discipline")[];
            };
        };
        SystemStatus: {
            storage: {
                /** @enum {string} */
                database: "available";
                databaseBytes: number;
                vaultCount: number;
            };
            sync: {
                activeDevices: number;
                latestEventId: string;
                retentionFloorEventId: string;
            };
            workers: {
                enrolled: number;
                online: number;
                /** Format: date-time */
                lastSeenAt: string | null;
            };
            backup: {
                /** @enum {string} */
                status: "not_configured" | "configured_unverified" | "verified" | "failed";
                /** Format: date-time */
                lastVerifiedAt: string | null;
                limitation: string;
            };
            versions: {
                api: string;
                schema: number;
                clientMinimum: string;
            };
            /** Format: date-time */
            checkedAt: string;
        };
        Vault: {
            /** Format: uuid */
            id: string;
            name: string;
            locale: string;
            timezone: string;
            /** @enum {string} */
            storageMode: "machine_local" | "host_synced";
            remoteAuthorized: boolean;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        VaultList: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                locale: string;
                timezone: string;
                /** @enum {string} */
                storageMode: "machine_local" | "host_synced";
                remoteAuthorized: boolean;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
        };
        CreateVault: {
            name: string;
            locale: string;
            timezone: string;
        };
        UpdateVault: {
            expectedRevision: number;
            patch: {
                name?: string;
                locale?: string;
                timezone?: string;
            };
        };
        PurgeRequest: {
            /** @enum {string} */
            confirmation: "permanently_purge";
            expectedRevision: number;
        };
        CreateUpload: {
            filename: string;
            /** @enum {string} */
            mediaType: "application/octet-stream" | "application/pdf" | "application/json" | "application/zip" | "application/x-tar" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "text/plain" | "text/markdown" | "text/csv" | "text/calendar" | "text/calendar; charset=utf-8" | "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/heic" | "image/heif" | "audio/mpeg" | "audio/mp4" | "audio/ogg" | "audio/wav" | "video/mp4" | "video/webm";
            byteLength: number;
            sha256: string;
        };
        UploadSession: {
            /** Format: uuid */
            uploadId: string;
            partSize: number;
            /** Format: date-time */
            expiresAt: string;
        };
        CompleteUpload: {
            sha256: string;
            partCount: number;
        };
        BlobSummary: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            filename: string;
            /** @enum {string} */
            mediaType: "application/octet-stream" | "application/pdf" | "application/json" | "application/zip" | "application/x-tar" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "text/plain" | "text/markdown" | "text/csv" | "text/calendar" | "text/calendar; charset=utf-8" | "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/heic" | "image/heif" | "audio/mpeg" | "audio/mp4" | "audio/ogg" | "audio/wav" | "video/mp4" | "video/webm";
            byteLength: number;
            sha256: string;
            /** Format: date-time */
            createdAt: string;
        };
        CreateExport: {
            scope: "all" | {
                domains: ("notes" | "tasks" | "calendar" | "school" | "study" | "profile")[];
            };
            /** @enum {string} */
            format: "markdown_bundle" | "full_fidelity";
            includeHistory: boolean;
        };
        ExportManifest: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "vault" | "calendar";
            /** @enum {string} */
            status: "generating" | "ready" | "failed" | "expired";
            /** @enum {string} */
            format: "markdown_bundle" | "full_fidelity" | "ics";
            /** @enum {string} */
            privacy: "authorized_full" | "minimal";
            byteLength: number | null;
            sha256: string | null;
            /** Format: date-time */
            expiresAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        PlanImport: {
            /** Format: uuid */
            blobId: string;
            /** @enum {string} */
            format: "markdown" | "plain_text" | "omega_notes_json_v1";
            /** @default {} */
            options: {
                /** @default null */
                defaultTitle: string | null;
                /** @default false */
                stripFrontmatter: boolean;
            };
        };
        ImportManifest: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            blobId: string;
            /** @enum {string} */
            format: "markdown" | "plain_text" | "omega_notes_json_v1";
            /** @enum {string} */
            status: "planned" | "applying" | "applied" | "failed";
            options: {
                defaultTitle: string | null;
                stripFrontmatter: boolean;
            };
            warnings: string[];
            counts: {
                total: number;
                create: number;
                skip: number;
                created: number;
                skipped: number;
                failed: number;
            };
            items: {
                /** Format: uuid */
                id: string;
                sequence: number;
                sourcePath: string;
                title: string;
                byteLength: number;
                contentSha256: string;
                /** @enum {string} */
                plannedAction: "create" | "skip";
                /** @enum {string} */
                applyStatus: "pending" | "created" | "skipped" | "failed";
                /** Format: uuid */
                appliedNoteId: string | null;
                warning: string | null;
            }[];
            planRevision: number;
            /** Format: date-time */
            appliedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ApplyImport: {
            planRevision: number;
            /** @enum {string} */
            collisionPolicy: "create_new" | "skip_existing_title";
            /** @enum {string} */
            confirmation: "apply_import_plan";
        };
        BootstrapOptionsInput: {
            bootstrap_secret: string;
            owner_label: string;
        };
        WebAuthnOptions: {
            /** Format: uuid */
            challenge_id: string;
            public_key_options: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            expires_at: string;
        };
        WebAuthnVerifyInput: {
            /** Format: uuid */
            challenge_id: string;
            credential: {
                [key: string]: unknown;
            };
        };
        BootstrapResult: {
            owner: {
                /** Format: uuid */
                id: string;
                label: string;
            };
            recovery_codes_once: string[];
            session: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                owner_id: string;
                /** Format: date-time */
                expires_at: string;
                /** @enum {string} */
                auth_level: "passkey" | "recovery";
            };
        };
        Session: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            owner_id: string;
            /** Format: date-time */
            expires_at: string;
            /** @enum {string} */
            auth_level: "passkey" | "recovery";
        };
        Note: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            title: string;
            body: string;
            /** @enum {string} */
            status: "saved" | "processing" | "ready" | "failed";
            /** @enum {string|null} */
            classification: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
            classificationLocked: boolean;
            suggestedTitle: string | null;
            classifiedRevision: number | null;
            organizationRevision: number;
            /** Format: uuid */
            sourceId: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        NoteList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                body: string;
                /** @enum {string} */
                status: "saved" | "processing" | "ready" | "failed";
                /** @enum {string|null} */
                classification: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                classificationLocked: boolean;
                suggestedTitle: string | null;
                classifiedRevision: number | null;
                organizationRevision: number;
                /** Format: uuid */
                sourceId: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
        };
        UpdateNoteMetadata: {
            title?: string;
            expectedRevision: number;
        };
        DocumentRepresentation: {
            /** @enum {string} */
            format: "editor_json" | "markdown" | "text" | "yjs_update";
            content: string | {
                /** @enum {string} */
                type: "doc";
                /** @default [] */
                content: {
                    /** @enum {string} */
                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                    attrs?: {
                        [key: string]: string | number | boolean | ("null" | null) | number[];
                    };
                    content?: {
                        /** @enum {string} */
                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                        attrs?: {
                            [key: string]: string | number | boolean | ("null" | null) | number[];
                        };
                        content?: {
                            /** @enum {string} */
                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                            content?: {
                                /** @enum {string} */
                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                                content?: {
                                    /** @enum {string} */
                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                    content?: {
                                        /** @enum {string} */
                                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                        content?: {
                                            /** @enum {string} */
                                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                            content?: {
                                                /** @enum {string} */
                                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                                content?: {
                                                    /** @enum {string} */
                                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                    content?: unknown;
                                                    text?: string;
                                                    marks?: {
                                                        /** @enum {string} */
                                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                                        attrs?: {
                                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                                        };
                                                    }[];
                                                }[];
                                                text?: string;
                                                marks?: {
                                                    /** @enum {string} */
                                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                }[];
                                            }[];
                                            text?: string;
                                            marks?: {
                                                /** @enum {string} */
                                                type: "bold" | "italic" | "strike" | "code" | "link";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                            }[];
                                        }[];
                                        text?: string;
                                        marks?: {
                                            /** @enum {string} */
                                            type: "bold" | "italic" | "strike" | "code" | "link";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                        }[];
                                    }[];
                                    text?: string;
                                    marks?: {
                                        /** @enum {string} */
                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                    }[];
                                }[];
                                text?: string;
                                marks?: {
                                    /** @enum {string} */
                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                }[];
                            }[];
                            text?: string;
                            marks?: {
                                /** @enum {string} */
                                type: "bold" | "italic" | "strike" | "code" | "link";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                            }[];
                        }[];
                        text?: string;
                        marks?: {
                            /** @enum {string} */
                            type: "bold" | "italic" | "strike" | "code" | "link";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                        }[];
                    }[];
                    text?: string;
                    marks?: {
                        /** @enum {string} */
                        type: "bold" | "italic" | "strike" | "code" | "link";
                        attrs?: {
                            [key: string]: string | number | boolean | ("null" | null) | number[];
                        };
                    }[];
                }[];
            };
            /** Format: uuid */
            revisionId: string;
            sourceMap: {
                start: number;
                end: number;
                /** Format: uuid */
                sourceId: string | null;
            }[];
        };
        EditNote: {
            expectedRevision: number;
            edit: {
                /** @enum {string} */
                kind: "replace_document";
                text: string;
            } | {
                /** @enum {string} */
                kind: "replace_editor_document";
                document: {
                    /** @enum {string} */
                    type: "doc";
                    /** @default [] */
                    content: {
                        /** @enum {string} */
                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                        attrs?: {
                            [key: string]: string | number | boolean | ("null" | null) | number[];
                        };
                        content?: {
                            /** @enum {string} */
                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                            content?: {
                                /** @enum {string} */
                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                                content?: {
                                    /** @enum {string} */
                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                    content?: {
                                        /** @enum {string} */
                                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                        content?: {
                                            /** @enum {string} */
                                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                            content?: {
                                                /** @enum {string} */
                                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                                content?: {
                                                    /** @enum {string} */
                                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                    content?: {
                                                        /** @enum {string} */
                                                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                        attrs?: {
                                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                                        };
                                                        content?: unknown;
                                                        text?: string;
                                                        marks?: {
                                                            /** @enum {string} */
                                                            type: "bold" | "italic" | "strike" | "code" | "link";
                                                            attrs?: {
                                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                                            };
                                                        }[];
                                                    }[];
                                                    text?: string;
                                                    marks?: {
                                                        /** @enum {string} */
                                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                                        attrs?: {
                                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                                        };
                                                    }[];
                                                }[];
                                                text?: string;
                                                marks?: {
                                                    /** @enum {string} */
                                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                }[];
                                            }[];
                                            text?: string;
                                            marks?: {
                                                /** @enum {string} */
                                                type: "bold" | "italic" | "strike" | "code" | "link";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                            }[];
                                        }[];
                                        text?: string;
                                        marks?: {
                                            /** @enum {string} */
                                            type: "bold" | "italic" | "strike" | "code" | "link";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                        }[];
                                    }[];
                                    text?: string;
                                    marks?: {
                                        /** @enum {string} */
                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                    }[];
                                }[];
                                text?: string;
                                marks?: {
                                    /** @enum {string} */
                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                }[];
                            }[];
                            text?: string;
                            marks?: {
                                /** @enum {string} */
                                type: "bold" | "italic" | "strike" | "code" | "link";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                            }[];
                        }[];
                        text?: string;
                        marks?: {
                            /** @enum {string} */
                            type: "bold" | "italic" | "strike" | "code" | "link";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                        }[];
                    }[];
                };
            } | {
                /** @enum {string} */
                kind: "append_markdown";
                markdown: string;
            };
        };
        ReprocessNote: {
            expectedRevision: number;
            stages: "classify"[];
        };
        NoteRevision: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            noteId: string;
            revision: number;
            title: string;
            text: string;
            /** @enum {string} */
            actorKind: "owner" | "capture" | "restore" | "ai" | "import" | "migration";
            /** Format: date-time */
            createdAt: string;
        };
        NoteRevisionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                noteId: string;
                revision: number;
                title: string;
                text: string;
                /** @enum {string} */
                actorKind: "owner" | "capture" | "restore" | "ai" | "import" | "migration";
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CorrectNoteClassification: {
            expectedRevision: number;
            /** @enum {string} */
            classification: "note" | "task" | "event" | "idea" | "reference" | "unknown";
            reason?: string;
            lock: boolean;
        };
        CorrectionReceipt: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            noteId: string;
            sourceNoteRevision: number;
            previousClassification: string | null;
            correctedClassification: string;
            locked: boolean;
            organizationRevision: number;
            /** Format: date-time */
            createdAt: string;
        };
        Label: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "area" | "project" | "topic" | "entity";
            name: string;
            aliases: string[];
            /** Format: uuid */
            parentId: string | null;
            /** @enum {string} */
            status: "provisional" | "confirmed";
            pinned: boolean;
            revision: number;
            supportedNoteCount: number;
            /** Format: date-time */
            createdAt: string;
        };
        LabelList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "area" | "project" | "topic" | "entity";
                name: string;
                aliases: string[];
                /** Format: uuid */
                parentId: string | null;
                /** @enum {string} */
                status: "provisional" | "confirmed";
                pinned: boolean;
                revision: number;
                supportedNoteCount: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CreateLabel: {
            /** @enum {string} */
            kind: "area" | "project" | "topic" | "entity";
            name: string;
            /** @default [] */
            aliases: string[];
            /** Format: uuid */
            parentId?: string | null;
        };
        UpdateLabel: {
            expectedRevision: number;
            name?: string;
            aliases?: string[];
            /** Format: uuid */
            parentId?: string | null;
            pinned?: boolean;
        };
        SetNoteLabels: {
            labelIds: string[];
            lockedLabelIds: string[];
            expectedRevision: number;
        };
        NoteOrganization: {
            /** Format: uuid */
            noteId: string;
            noteRevision: number;
            organizationRevision: number;
            labels: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "area" | "project" | "topic" | "entity";
                name: string;
                aliases: string[];
                /** Format: uuid */
                parentId: string | null;
                /** @enum {string} */
                status: "provisional" | "confirmed";
                pinned: boolean;
                revision: number;
                supportedNoteCount: number;
                /** Format: date-time */
                createdAt: string;
                locked: boolean;
                /** @enum {string} */
                provenance: "owner" | "classification" | "rule";
            }[];
        };
        Collection: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            name: string;
            filter: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            /** @enum {string} */
            sort: "updated_desc" | "created_desc" | "title_asc";
            /** @enum {string} */
            view: "grid" | "list";
            system: boolean;
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        CollectionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                filter: {
                    /** @enum {string} */
                    operator: "and" | "or";
                    conditions: ({
                        /** @enum {string} */
                        type: "classification";
                        /** @enum {string|null} */
                        value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                    } | {
                        /** @enum {string} */
                        type: "label";
                        /** Format: uuid */
                        labelId: string;
                    } | {
                        /** @enum {string} */
                        type: "text_contains";
                        value: string;
                    } | {
                        /** @enum {string} */
                        type: "status";
                        /** @enum {string} */
                        value: "saved" | "processing" | "ready" | "failed";
                    })[];
                };
                /** @enum {string} */
                sort: "updated_desc" | "created_desc" | "title_asc";
                /** @enum {string} */
                view: "grid" | "list";
                system: boolean;
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CreateCollection: {
            name: string;
            filter: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            /**
             * @default updated_desc
             * @enum {string}
             */
            sort: "updated_desc" | "created_desc" | "title_asc";
            /**
             * @default grid
             * @enum {string}
             */
            view: "grid" | "list";
        };
        UpdateCollection: {
            expectedRevision: number;
            name?: string;
            filter?: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            /** @enum {string} */
            sort?: "updated_desc" | "created_desc" | "title_asc";
            /** @enum {string} */
            view?: "grid" | "list";
        };
        CollectionItems: {
            collection: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                filter: {
                    /** @enum {string} */
                    operator: "and" | "or";
                    conditions: ({
                        /** @enum {string} */
                        type: "classification";
                        /** @enum {string|null} */
                        value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                    } | {
                        /** @enum {string} */
                        type: "label";
                        /** Format: uuid */
                        labelId: string;
                    } | {
                        /** @enum {string} */
                        type: "text_contains";
                        value: string;
                    } | {
                        /** @enum {string} */
                        type: "status";
                        /** @enum {string} */
                        value: "saved" | "processing" | "ready" | "failed";
                    })[];
                };
                /** @enum {string} */
                sort: "updated_desc" | "created_desc" | "title_asc";
                /** @enum {string} */
                view: "grid" | "list";
                system: boolean;
                revision: number;
                /** Format: date-time */
                createdAt: string;
            };
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                body: string;
                /** @enum {string} */
                status: "saved" | "processing" | "ready" | "failed";
                /** @enum {string|null} */
                classification: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                classificationLocked: boolean;
                suggestedTitle: string | null;
                classifiedRevision: number | null;
                organizationRevision: number;
                /** Format: uuid */
                sourceId: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        RoutingRule: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            name: string;
            condition: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            targetLabelIds: string[];
            priority: number;
            enabled: boolean;
            /** @enum {string} */
            provenance: "owner";
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        RoutingRuleList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                condition: {
                    /** @enum {string} */
                    operator: "and" | "or";
                    conditions: ({
                        /** @enum {string} */
                        type: "classification";
                        /** @enum {string|null} */
                        value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                    } | {
                        /** @enum {string} */
                        type: "label";
                        /** Format: uuid */
                        labelId: string;
                    } | {
                        /** @enum {string} */
                        type: "text_contains";
                        value: string;
                    } | {
                        /** @enum {string} */
                        type: "status";
                        /** @enum {string} */
                        value: "saved" | "processing" | "ready" | "failed";
                    })[];
                };
                targetLabelIds: string[];
                priority: number;
                enabled: boolean;
                /** @enum {string} */
                provenance: "owner";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CreateRoutingRule: {
            name: string;
            condition: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            targetLabelIds: string[];
            /** @default 100 */
            priority: number;
            /** @default true */
            enabled: boolean;
        };
        UpdateRoutingRule: {
            expectedRevision: number;
            name?: string;
            condition?: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            targetLabelIds?: string[];
            priority?: number;
            enabled?: boolean;
        };
        RoutingRulePreview: {
            condition: {
                /** @enum {string} */
                operator: "and" | "or";
                conditions: ({
                    /** @enum {string} */
                    type: "classification";
                    /** @enum {string|null} */
                    value: "note" | "task" | "event" | "idea" | "reference" | "unknown" | null;
                } | {
                    /** @enum {string} */
                    type: "label";
                    /** Format: uuid */
                    labelId: string;
                } | {
                    /** @enum {string} */
                    type: "text_contains";
                    value: string;
                } | {
                    /** @enum {string} */
                    type: "status";
                    /** @enum {string} */
                    value: "saved" | "processing" | "ready" | "failed";
                })[];
            };
            targetLabelIds: string[];
            /** @default 10 */
            sampleLimit: number;
        };
        RulePreviewResult: {
            affectedCount: number;
            sampleNoteIds: string[];
            conflicts: {
                /** Format: uuid */
                noteId: string;
                reason: string;
            }[];
        };
        Relationship: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            fromNoteId: string;
            /** Format: uuid */
            toNoteId: string;
            /** @enum {string} */
            kind: "related" | "supports" | "contradicts" | "duplicate_candidate";
            evidenceAnchorIds: string[];
            /** @enum {string} */
            status: "suggested" | "confirmed" | "dismissed";
            /** @enum {string} */
            authoredBy: "owner" | "system";
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        RelationshipList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                fromNoteId: string;
                /** Format: uuid */
                toNoteId: string;
                /** @enum {string} */
                kind: "related" | "supports" | "contradicts" | "duplicate_candidate";
                evidenceAnchorIds: string[];
                /** @enum {string} */
                status: "suggested" | "confirmed" | "dismissed";
                /** @enum {string} */
                authoredBy: "owner" | "system";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        RelatedResult: {
            explicitLinks: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                fromNoteId: string;
                /** Format: uuid */
                toNoteId: string;
                /** @enum {string} */
                kind: "related" | "supports" | "contradicts" | "duplicate_candidate";
                evidenceAnchorIds: string[];
                /** @enum {string} */
                status: "suggested" | "confirmed" | "dismissed";
                /** @enum {string} */
                authoredBy: "owner" | "system";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
            suggestedLinks: {
                /** Format: uuid */
                noteId: string;
                title: string;
                score: number;
                reasonCodes: "shared_label"[];
                sharedLabelIds: string[];
            }[];
            /** @enum {string} */
            suggestionMethod: "confirmed-shared-label-jaccard-v1";
            /** @enum {boolean} */
            suggestionsAreConfirmed: false;
        };
        ResurfacingFeedbackInput: {
            /** Format: uuid */
            noteId: string;
            /** @enum {string} */
            action: "dismiss" | "snooze" | "hide_topic";
            /** Format: uuid */
            labelId?: string | null;
            /** Format: date-time */
            until?: string | null;
        };
        ResurfacingFeedback: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            noteId: string;
            /** @enum {string} */
            action: "dismiss" | "snooze" | "hide_topic";
            /** Format: uuid */
            labelId: string | null;
            /** Format: date-time */
            until: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        CreateRelationship: {
            /** Format: uuid */
            fromNoteId: string;
            /** Format: uuid */
            toNoteId: string;
            /** @enum {string} */
            kind: "related" | "supports" | "contradicts" | "duplicate_candidate";
            /** @default [] */
            evidenceAnchorIds: string[];
        };
        CreateCapture: {
            text?: string;
            /** @default [] */
            blobIds: string[];
            title?: string;
            clientOperationId: string;
        };
        CreateUrlCapture: {
            /** Format: uri */
            url: string;
            /** @enum {boolean} */
            fetchConsent: true;
            selectedText?: string;
            title?: string;
        };
        GenerateArtifact: {
            /** @enum {string} */
            kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
            scope: {
                /** @default [] */
                noteIds: string[];
                /** @default [] */
                sourceIds: string[];
                /** @default [] */
                courseIds: string[];
                /** @default [] */
                projectIds: string[];
            };
            instructions?: string;
            outputLanguage?: string;
            /** Format: uuid */
            targetGeneratedNoteId?: string;
            expectedRevision?: number;
        };
        Capture: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "capture" | "file" | "url";
            originalText: string | null;
            /**
             * Format: uri
             * @default null
             */
            sourceUrl: string | null;
            /**
             * Format: uri
             * @default null
             */
            resolvedUrl: string | null;
            contentHash: string;
            blobs: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                filename: string;
                /** @enum {string} */
                mediaType: "application/octet-stream" | "application/pdf" | "application/json" | "application/zip" | "application/x-tar" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "text/plain" | "text/markdown" | "text/csv" | "text/calendar" | "text/calendar; charset=utf-8" | "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/heic" | "image/heif" | "audio/mpeg" | "audio/mp4" | "audio/ogg" | "audio/wav" | "video/mp4" | "video/webm";
                byteLength: number;
                sha256: string;
                /** Format: date-time */
                createdAt: string;
            }[];
            /** Format: uuid */
            noteId: string;
            /** Format: date-time */
            createdAt: string;
        };
        CreateNote: {
            /** Format: uuid */
            id?: string;
            title?: string;
            content: {
                /** @enum {string} */
                kind: "text";
                text: string;
            } | {
                /** @enum {string} */
                kind: "editor_document";
                document: {
                    /** @enum {string} */
                    type: "doc";
                    /** @default [] */
                    content: {
                        /** @enum {string} */
                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                        attrs?: {
                            [key: string]: string | number | boolean | ("null" | null) | number[];
                        };
                        content?: {
                            /** @enum {string} */
                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                            content?: {
                                /** @enum {string} */
                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                                content?: {
                                    /** @enum {string} */
                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                    content?: {
                                        /** @enum {string} */
                                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                        content?: {
                                            /** @enum {string} */
                                            type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                            content?: {
                                                /** @enum {string} */
                                                type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                                content?: {
                                                    /** @enum {string} */
                                                    type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                    content?: {
                                                        /** @enum {string} */
                                                        type: "paragraph" | "text" | "hardBreak" | "heading" | "bulletList" | "orderedList" | "listItem" | "taskList" | "taskItem" | "codeBlock" | "blockquote" | "callout" | "horizontalRule" | "table" | "tableRow" | "tableHeader" | "tableCell";
                                                        attrs?: {
                                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                                        };
                                                        content?: unknown;
                                                        text?: string;
                                                        marks?: {
                                                            /** @enum {string} */
                                                            type: "bold" | "italic" | "strike" | "code" | "link";
                                                            attrs?: {
                                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                                            };
                                                        }[];
                                                    }[];
                                                    text?: string;
                                                    marks?: {
                                                        /** @enum {string} */
                                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                                        attrs?: {
                                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                                        };
                                                    }[];
                                                }[];
                                                text?: string;
                                                marks?: {
                                                    /** @enum {string} */
                                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                                    attrs?: {
                                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                                    };
                                                }[];
                                            }[];
                                            text?: string;
                                            marks?: {
                                                /** @enum {string} */
                                                type: "bold" | "italic" | "strike" | "code" | "link";
                                                attrs?: {
                                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                                };
                                            }[];
                                        }[];
                                        text?: string;
                                        marks?: {
                                            /** @enum {string} */
                                            type: "bold" | "italic" | "strike" | "code" | "link";
                                            attrs?: {
                                                [key: string]: string | number | boolean | ("null" | null) | number[];
                                            };
                                        }[];
                                    }[];
                                    text?: string;
                                    marks?: {
                                        /** @enum {string} */
                                        type: "bold" | "italic" | "strike" | "code" | "link";
                                        attrs?: {
                                            [key: string]: string | number | boolean | ("null" | null) | number[];
                                        };
                                    }[];
                                }[];
                                text?: string;
                                marks?: {
                                    /** @enum {string} */
                                    type: "bold" | "italic" | "strike" | "code" | "link";
                                    attrs?: {
                                        [key: string]: string | number | boolean | ("null" | null) | number[];
                                    };
                                }[];
                            }[];
                            text?: string;
                            marks?: {
                                /** @enum {string} */
                                type: "bold" | "italic" | "strike" | "code" | "link";
                                attrs?: {
                                    [key: string]: string | number | boolean | ("null" | null) | number[];
                                };
                            }[];
                        }[];
                        text?: string;
                        marks?: {
                            /** @enum {string} */
                            type: "bold" | "italic" | "strike" | "code" | "link";
                            attrs?: {
                                [key: string]: string | number | boolean | ("null" | null) | number[];
                            };
                        }[];
                    }[];
                };
            };
            provenance?: {
                /** @enum {string} */
                kind: "owner";
                /** Format: date-time */
                authoredAt?: string;
            };
        };
        ExpectedNoteRevision: {
            expectedRevision: number;
        };
        RestoreNoteRevision: {
            expectedCurrentRevision: number;
        };
        Task: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            title: string;
            completed: boolean;
            /** Format: date-time */
            dueAt: string | null;
            estimatedMinutes: number | null;
            remainingMinutes: number | null;
            /** Format: date-time */
            earliestStart: string | null;
            priority: number;
            allowSplit: boolean;
            minBlockMinutes: number | null;
            maxBlockMinutes: number | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        Project: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            title: string;
            /** Format: uuid */
            descriptionNoteId: string | null;
            /** @enum {string} */
            status: "planned" | "active" | "paused" | "completed" | "cancelled";
            goalIds: string[];
            noteIds: string[];
            taskIds: string[];
            ideaIds: string[];
            sourceAnchorIds: string[];
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ProjectList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                /** Format: uuid */
                descriptionNoteId: string | null;
                /** @enum {string} */
                status: "planned" | "active" | "paused" | "completed" | "cancelled";
                goalIds: string[];
                noteIds: string[];
                taskIds: string[];
                ideaIds: string[];
                sourceAnchorIds: string[];
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateProject: {
            title: string;
            /**
             * Format: uuid
             * @default null
             */
            descriptionNoteId: string | null;
            /**
             * @default active
             * @enum {string}
             */
            status: "planned" | "active" | "paused" | "completed" | "cancelled";
            /** @default [] */
            goalIds: string[];
            /** @default [] */
            noteIds: string[];
            /** @default [] */
            taskIds: string[];
            /** @default [] */
            ideaIds: string[];
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateProject: {
            expectedRevision: number;
            patch: {
                title?: string;
                /**
                 * Format: uuid
                 * @default null
                 */
                descriptionNoteId: string | null;
                /**
                 * @default active
                 * @enum {string}
                 */
                status: "planned" | "active" | "paused" | "completed" | "cancelled";
                /** @default [] */
                goalIds: string[];
                /** @default [] */
                noteIds: string[];
                /** @default [] */
                taskIds: string[];
                /** @default [] */
                ideaIds: string[];
                /** @default [] */
                sourceAnchorIds: string[];
            };
        };
        Idea: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            sourceId: string;
            title: string | null;
            /** Format: uuid */
            projectId: string | null;
            /** @enum {string} */
            state: "inbox" | "developing" | "proposed" | "promoted" | "dismissed";
            sourceAnchorIds: string[];
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        IdeaList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                sourceId: string;
                title: string | null;
                /** Format: uuid */
                projectId: string | null;
                /** @enum {string} */
                state: "inbox" | "developing" | "proposed" | "promoted" | "dismissed";
                sourceAnchorIds: string[];
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateIdea: {
            /** Format: uuid */
            sourceId: string;
            /** @default null */
            title: string | null;
            /**
             * Format: uuid
             * @default null
             */
            projectId: string | null;
            /**
             * @default inbox
             * @enum {string}
             */
            state: "inbox" | "developing" | "proposed" | "promoted" | "dismissed";
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateIdea: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                sourceId?: string;
                /** @default null */
                title: string | null;
                /**
                 * Format: uuid
                 * @default null
                 */
                projectId: string | null;
                /**
                 * @default inbox
                 * @enum {string}
                 */
                state: "inbox" | "developing" | "proposed" | "promoted" | "dismissed";
                /** @default [] */
                sourceAnchorIds: string[];
            };
        };
        Goal: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            title: string;
            /** @enum {string} */
            kind: "study" | "project" | "habit" | "personal" | "other";
            target: string | null;
            scale: string | null;
            targetDate: string | null;
            /** Format: uuid */
            courseId: string | null;
            /** Format: uuid */
            projectId: string | null;
            constraints: {
                [key: string]: unknown;
            };
            sourceAnchorIds: string[];
            /** @enum {string} */
            status: "active" | "achieved" | "paused" | "abandoned";
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        GoalList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                /** @enum {string} */
                kind: "study" | "project" | "habit" | "personal" | "other";
                target: string | null;
                scale: string | null;
                targetDate: string | null;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                projectId: string | null;
                constraints: {
                    [key: string]: unknown;
                };
                sourceAnchorIds: string[];
                /** @enum {string} */
                status: "active" | "achieved" | "paused" | "abandoned";
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateGoal: {
            title: string;
            /** @enum {string} */
            kind: "study" | "project" | "habit" | "personal" | "other";
            /** @default null */
            target: string | null;
            /** @default null */
            scale: string | null;
            /** @default null */
            targetDate: string | null;
            /**
             * Format: uuid
             * @default null
             */
            courseId: string | null;
            /**
             * Format: uuid
             * @default null
             */
            projectId: string | null;
            /** @default {} */
            constraints: {
                [key: string]: unknown;
            };
            /** @default [] */
            sourceAnchorIds: string[];
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "achieved" | "paused" | "abandoned";
        };
        UpdateGoal: {
            expectedRevision: number;
            patch: {
                title?: string;
                /** @enum {string} */
                kind?: "study" | "project" | "habit" | "personal" | "other";
                /** @default null */
                target: string | null;
                /** @default null */
                scale: string | null;
                /** @default null */
                targetDate: string | null;
                /**
                 * Format: uuid
                 * @default null
                 */
                courseId: string | null;
                /**
                 * Format: uuid
                 * @default null
                 */
                projectId: string | null;
                /** @default {} */
                constraints: {
                    [key: string]: unknown;
                };
                /** @default [] */
                sourceAnchorIds: string[];
                /**
                 * @default active
                 * @enum {string}
                 */
                status: "active" | "achieved" | "paused" | "abandoned";
            };
        };
        Memory: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "fact" | "preference" | "workflow" | "plan" | "project_context" | "goal_context";
            content: string;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "explicit" | "inferred";
            /** Format: date-time */
            validFrom: string | null;
            /** Format: date-time */
            expiresAt: string | null;
            userConfirmed: boolean;
            /** @enum {string} */
            status: "active" | "superseded" | "dismissed";
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        MemoryList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "fact" | "preference" | "workflow" | "plan" | "project_context" | "goal_context";
                content: string;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "explicit" | "inferred";
                /** Format: date-time */
                validFrom: string | null;
                /** Format: date-time */
                expiresAt: string | null;
                userConfirmed: boolean;
                /** @enum {string} */
                status: "active" | "superseded" | "dismissed";
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateMemory: {
            /** @enum {string} */
            kind: "fact" | "preference" | "workflow" | "plan" | "project_context" | "goal_context";
            content: string;
            /** @default [] */
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "explicit" | "inferred";
            /**
             * Format: date-time
             * @default null
             */
            validFrom: string | null;
            /**
             * Format: date-time
             * @default null
             */
            expiresAt: string | null;
            /** @default false */
            userConfirmed: boolean;
            /**
             * @default active
             * @enum {string}
             */
            status: "active" | "superseded" | "dismissed";
        };
        UpdateMemory: {
            expectedRevision: number;
            patch: {
                /** @enum {string} */
                kind?: "fact" | "preference" | "workflow" | "plan" | "project_context" | "goal_context";
                content?: string;
                /** @default [] */
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin?: "explicit" | "inferred";
                /**
                 * Format: date-time
                 * @default null
                 */
                validFrom: string | null;
                /**
                 * Format: date-time
                 * @default null
                 */
                expiresAt: string | null;
                /** @default false */
                userConfirmed: boolean;
                /**
                 * @default active
                 * @enum {string}
                 */
                status: "active" | "superseded" | "dismissed";
            };
        };
        PersonalProfile: {
            memories: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "fact" | "preference" | "workflow" | "plan" | "project_context" | "goal_context";
                content: string;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "explicit" | "inferred";
                /** Format: date-time */
                validFrom: string | null;
                /** Format: date-time */
                expiresAt: string | null;
                userConfirmed: boolean;
                /** @enum {string} */
                status: "active" | "superseded" | "dismissed";
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            goals: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                /** @enum {string} */
                kind: "study" | "project" | "habit" | "personal" | "other";
                target: string | null;
                scale: string | null;
                targetDate: string | null;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                projectId: string | null;
                constraints: {
                    [key: string]: unknown;
                };
                sourceAnchorIds: string[];
                /** @enum {string} */
                status: "active" | "achieved" | "paused" | "abandoned";
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            projects: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                /** Format: uuid */
                descriptionNoteId: string | null;
                /** @enum {string} */
                status: "planned" | "active" | "paused" | "completed" | "cancelled";
                goalIds: string[];
                noteIds: string[];
                taskIds: string[];
                ideaIds: string[];
                sourceAnchorIds: string[];
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            summary: {
                explicitMemories: number;
                inferredUnconfirmedMemories: number;
                activeGoals: number;
                activeProjects: number;
            };
            limitations: string[];
            /** Format: date-time */
            generatedAt: string;
        };
        IntegrationConnection: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            provider: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
            label: string;
            /** @enum {string} */
            state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
            capabilities: {
                key: string;
                /** @enum {string} */
                mode: "live_read" | "live_write" | "import_only" | "unsupported" | "unverified";
                enabled: boolean;
                /** Format: date-time */
                verifiedAt: string | null;
                limitation: string | null;
            }[];
            credentialConfigured: boolean;
            /** Format: date-time */
            lastSuccessAt: string | null;
            /** Format: date-time */
            lastFailureAt: string | null;
            /** Format: date-time */
            nextScheduledAt: string | null;
            importedCount: number;
            coverage: {
                [key: string]: unknown;
            };
            lastErrorCode: string | null;
            schedule: ({
                /** @enum {string} */
                kind: "manual";
            } | {
                /** @enum {string} */
                kind: "daily";
                localTime: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "weekly";
                weekday: number;
                localTime: string;
                timezone: string;
            }) | {
                enabled: boolean;
                intervalMinutes: number;
                windows: {
                    weekday: number;
                    start: string;
                    end: string;
                    timezone: string;
                }[];
            };
            revision: number;
            /** Format: date-time */
            disconnectedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        IntegrationConnectionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                provider: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
                label: string;
                /** @enum {string} */
                state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
                capabilities: {
                    key: string;
                    /** @enum {string} */
                    mode: "live_read" | "live_write" | "import_only" | "unsupported" | "unverified";
                    enabled: boolean;
                    /** Format: date-time */
                    verifiedAt: string | null;
                    limitation: string | null;
                }[];
                credentialConfigured: boolean;
                /** Format: date-time */
                lastSuccessAt: string | null;
                /** Format: date-time */
                lastFailureAt: string | null;
                /** Format: date-time */
                nextScheduledAt: string | null;
                importedCount: number;
                coverage: {
                    [key: string]: unknown;
                };
                lastErrorCode: string | null;
                schedule: ({
                    /** @enum {string} */
                    kind: "manual";
                } | {
                    /** @enum {string} */
                    kind: "daily";
                    localTime: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "weekly";
                    weekday: number;
                    localTime: string;
                    timezone: string;
                }) | {
                    enabled: boolean;
                    intervalMinutes: number;
                    windows: {
                        weekday: number;
                        start: string;
                        end: string;
                        timezone: string;
                    }[];
                };
                revision: number;
                /** Format: date-time */
                disconnectedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateIntegrationConnection: {
            /** @enum {string} */
            provider: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
            label: string;
        };
        IntegrationCapabilityList: {
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
            items: {
                key: string;
                /** @enum {string} */
                mode: "live_read" | "live_write" | "import_only" | "unsupported" | "unverified";
                enabled: boolean;
                /** Format: date-time */
                verifiedAt: string | null;
                limitation: string | null;
            }[];
            disclaimer: string;
        };
        IntegrationProviderDescriptorList: {
            items: {
                /** @enum {string} */
                providerId: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
                displayName: string;
                backendIdentity: {
                    /** @enum {string} */
                    registry: "omega-local-provider-registry-v1";
                    adapter: string;
                    verified: boolean;
                };
                capabilities: {
                    key: string;
                    /** @enum {string} */
                    mode: "live_read" | "live_write" | "import_only" | "unsupported" | "unverified";
                    enabled: boolean;
                    /** Format: date-time */
                    verifiedAt: string | null;
                    limitation: string | null;
                }[];
                accountBlockers: string[];
                optionalModules: {
                    key: string;
                    enabled: boolean;
                    reason: string | null;
                }[];
                /** @enum {string} */
                authorizationMode: "oauth" | "owner_export" | "local_service" | "configuration_required";
            }[];
        };
        ConnectorResourceList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                connectionId: string;
                providerResourceId: string;
                kind: string;
                /** Format: uuid */
                parentId: string | null;
                name: string;
                /** @enum {string} */
                accessState: "available" | "denied" | "skipped" | "unavailable";
                selected: boolean;
                metadata: {
                    [key: string]: unknown;
                };
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        ResourceSelection: {
            selectedResourceIds: string[];
            window: {
                /** Format: date-time */
                from: string | null;
                /** Format: date-time */
                to: string | null;
            } | null;
            sensitiveDataOptIns: ("grades" | "attendance" | "private_chats" | "personal_data_history")[];
            revision: number;
        };
        ResourceSelectionInput: {
            selectedResourceIds: string[];
            /** @default null */
            window: {
                /** Format: date-time */
                from: string | null;
                /** Format: date-time */
                to: string | null;
            } | null;
            /** @default false */
            scopeExpansionApproval: boolean;
            /** @default [] */
            sensitiveDataOptIns: ("grades" | "attendance" | "private_chats" | "personal_data_history")[];
        };
        ConnectorSchedule: {
            enabled: boolean;
            intervalMinutes: number;
            windows: {
                weekday: number;
                start: string;
                end: string;
                timezone: string;
            }[];
        };
        ConnectorSyncStatus: {
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
            /** Format: date-time */
            lastAttemptAt: string | null;
            /** Format: date-time */
            lastSuccessAt: string | null;
            partialCoverage: {
                [key: string]: unknown;
            };
            throttled: boolean;
            authorizationRequired: boolean;
            workerAvailable: boolean;
            latestJob: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
                stage: string;
            } | null;
            blockers: string[];
        };
        ConnectionSyncResult: {
            coverage: {
                /** @enum {string} */
                dataset: "assignments" | "chats" | "channels" | "calendar" | "mail" | "files" | "sharepoint" | "todo" | "planner" | "onenote" | "contacts";
                imported: number;
                complete: boolean;
                contentComplete: boolean;
                limitations: string[];
                error: string | null;
            }[];
            complete: boolean;
            privateChatsOptedIn: boolean;
        };
        DisconnectIntegration: {
            /** Format: uuid */
            previewId: string;
            expectedRevision: number;
            /** @enum {string} */
            confirmation: "disconnect";
        };
        PreviewConnectionDisconnect: {
            /** @enum {string} */
            retentionChoice: "retain_imported" | "delete_imported" | "retain_sources_delete_derived";
        };
        ConnectionDisconnectPreview: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            connectionId: string;
            connectionRevision: number;
            /** @enum {string} */
            retentionChoice: "retain_imported" | "delete_imported" | "retain_sources_delete_derived";
            impact: {
                credentialReferencesToDelete: number;
                subscriptionsToStop: number;
                selectedResources: number;
                sourceObjects: number;
                derivedArtifacts: number;
                importedRecords: number;
                retainedRecordKinds: string[];
                deletedRecordKinds: string[];
                providerRevocationAttemptedOnApply: boolean;
                /** @enum {boolean} */
                providerCleanupMayBeIncomplete: true;
                /** @enum {boolean} */
                writesApplied: false;
            };
            /** @enum {string} */
            requiredConfirmation: "disconnect";
            stale: boolean;
            /** Format: date-time */
            expiresAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        ConnectionMapping: {
            datasets: {
                sourceKind: string;
                /** @enum {string} */
                targetRecordType: "calendar_event" | "task" | "school_lesson" | "school_assignment" | "school_assessment" | "attendance_record" | "grade_record" | "source_object" | "transcript" | "personal_data_item";
                fieldMappings: {
                    sourceField: string;
                    targetField: string;
                    /** @enum {string} */
                    transformation: "identity" | "string_trim" | "datetime_iso" | "string_array" | "boolean";
                    /** @enum {string} */
                    provenance: "provider_schema" | "owner_export_schema" | "browser_observation";
                }[];
            }[];
            timezone: string;
            entityMapping: {
                /** @enum {string} */
                person: "provider_id_then_email" | "provider_id_only" | "manual";
                /** @enum {string} */
                course: "provider_id_then_code" | "provider_id_only" | "manual";
                /** @enum {string} */
                calendar: "provider_id" | "manual";
            };
            /** @enum {string} */
            extractionProfile: "provider_native_v1" | "owner_export_v1" | "browser_session_v1";
        } & {
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            provider: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
            /** @enum {string} */
            schemaVersion: "connection-mapping-v1";
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SetConnectionMapping: {
            datasets: {
                sourceKind: string;
                /** @enum {string} */
                targetRecordType: "calendar_event" | "task" | "school_lesson" | "school_assignment" | "school_assessment" | "attendance_record" | "grade_record" | "source_object" | "transcript" | "personal_data_item";
                fieldMappings: {
                    sourceField: string;
                    targetField: string;
                    /** @enum {string} */
                    transformation: "identity" | "string_trim" | "datetime_iso" | "string_array" | "boolean";
                    /** @enum {string} */
                    provenance: "provider_schema" | "owner_export_schema" | "browser_observation";
                }[];
            }[];
            timezone: string;
            entityMapping: {
                /** @enum {string} */
                person: "provider_id_then_email" | "provider_id_only" | "manual";
                /** @enum {string} */
                course: "provider_id_then_code" | "provider_id_only" | "manual";
                /** @enum {string} */
                calendar: "provider_id" | "manual";
            };
            /** @enum {string} */
            extractionProfile: "provider_native_v1" | "owner_export_v1" | "browser_session_v1";
        };
        RebuildPersonalProfile: {
            sourceScope: {
                personalDataItemIds: string[];
                providers: string[];
            };
            timeWindow: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
            };
            policyRevision: number;
        };
        SyncSelectedPersonalData: {
            connectionIds: string[];
            capabilities: ("watch_history" | "listening_history" | "saved_items" | "likes" | "subscriptions" | "posts" | "comments")[];
            /** @default null */
            window: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
            } | null;
            catchUpRunKey?: string;
        };
        Insight: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "weekly_review" | "project_review" | "study_pattern" | "interest_trend";
            window: {
                from: string;
                to: string;
            };
            title: string;
            facts: {
                key: string;
                label: string;
                value: number | null;
                unit: string | null;
                /** @enum {string} */
                epistemicStatus: "observed" | "planned" | "unknown";
                evidenceIds: string[];
            }[];
            coverage: {
                /** @enum {string} */
                domain: "tasks" | "study" | "attendance" | "assessments" | "projects" | "ideas" | "calendar" | "personal_data";
                /** @enum {string} */
                status: "observed" | "partial" | "unavailable" | "not_requested";
                recordCount: number;
                limitation: string | null;
            }[];
            suggestions: {
                text: string;
                evidenceIds: string[];
                /** @enum {boolean} */
                bounded: true;
            }[];
            sourceManifest: {
                objectType: string;
                /** Format: uuid */
                objectId: string;
                revision: number;
            }[];
            generator: string;
            /** @enum {string} */
            state: "seen" | "dismissed" | "pinned";
            annotation: string | null;
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        InsightList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "weekly_review" | "project_review" | "study_pattern" | "interest_trend";
                window: {
                    from: string;
                    to: string;
                };
                title: string;
                facts: {
                    key: string;
                    label: string;
                    value: number | null;
                    unit: string | null;
                    /** @enum {string} */
                    epistemicStatus: "observed" | "planned" | "unknown";
                    evidenceIds: string[];
                }[];
                coverage: {
                    /** @enum {string} */
                    domain: "tasks" | "study" | "attendance" | "assessments" | "projects" | "ideas" | "calendar" | "personal_data";
                    /** @enum {string} */
                    status: "observed" | "partial" | "unavailable" | "not_requested";
                    recordCount: number;
                    limitation: string | null;
                }[];
                suggestions: {
                    text: string;
                    evidenceIds: string[];
                    /** @enum {boolean} */
                    bounded: true;
                }[];
                sourceManifest: {
                    objectType: string;
                    /** Format: uuid */
                    objectId: string;
                    revision: number;
                }[];
                generator: string;
                /** @enum {string} */
                state: "seen" | "dismissed" | "pinned";
                annotation: string | null;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        GenerateInsight: {
            /** @enum {string} */
            kind: "weekly_review";
            window: {
                from: string;
                to: string;
            };
            scope: ("tasks" | "study" | "attendance" | "assessments" | "projects" | "ideas" | "calendar" | "personal_data")[];
        };
        UpdateInsight: {
            expectedRevision: number;
            /** @enum {string} */
            state: "seen" | "dismissed" | "pinned";
            /** @default null */
            annotation: string | null;
        };
        PersonalDataItem: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            provider: string;
            accountLabel: string;
            sourceItemId: string;
            /** @enum {string} */
            actionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
            /** Format: date-time */
            observedAt: string | null;
            title: string | null;
            contentReference: string | null;
            url: string | null;
            metadata: {
                [key: string]: unknown;
            };
            coverage: {
                /** @enum {string} */
                semantics: "provider_declared" | "owner_export_declared" | "unknown";
                knownFields: string[];
                unknownFields: string[];
                /** Format: date-time */
                windowFrom: string | null;
                /** Format: date-time */
                windowTo: string | null;
                limitations: string[];
            };
            /** Format: uuid */
            importPreviewId: string | null;
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PersonalDataItemList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                provider: string;
                accountLabel: string;
                sourceItemId: string;
                /** @enum {string} */
                actionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
                /** Format: date-time */
                observedAt: string | null;
                title: string | null;
                contentReference: string | null;
                url: string | null;
                metadata: {
                    [key: string]: unknown;
                };
                coverage: {
                    /** @enum {string} */
                    semantics: "provider_declared" | "owner_export_declared" | "unknown";
                    knownFields: string[];
                    unknownFields: string[];
                    /** Format: date-time */
                    windowFrom: string | null;
                    /** Format: date-time */
                    windowTo: string | null;
                    limitations: string[];
                };
                /** Format: uuid */
                importPreviewId: string | null;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        PersonalDataPolicies: {
            /** Format: uuid */
            vaultId: string;
            enabledProviders: ("youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun")[];
            analysisTypes: ("interest_topics" | "activity_patterns" | "study_relevance")[];
            retentionDays: number;
            weeklySync: {
                enabled: boolean;
                weekday: number;
                localTime: string;
                timezone: string;
            };
            privacy: {
                includeRawTitles: boolean;
                includeUrls: boolean;
                allowProfileInference: boolean;
            };
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        SetPersonalDataPolicies: {
            policies: {
                enabledProviders: ("youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun")[];
                analysisTypes: ("interest_topics" | "activity_patterns" | "study_relevance")[];
                retentionDays: number;
                weeklySync: {
                    enabled: boolean;
                    weekday: number;
                    localTime: string;
                    timezone: string;
                };
                privacy: {
                    includeRawTitles: boolean;
                    includeUrls: boolean;
                    allowProfileInference: boolean;
                };
            };
            expectedRevision: number;
            /** @enum {string} */
            disclosureConfirmation?: "enable_personal_data_analysis";
        };
        PreviewPersonalDataImport: {
            provider: string;
            accountLabel: string;
            /** @enum {string} */
            exportFormat: "omega_normalized_json_v1";
            records: {
                sourceItemId: string;
                /** @enum {string} */
                actionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
                /** Format: date-time */
                observedAt: string | null;
                /** @default null */
                title: string | null;
                /** @default null */
                contentReference: string | null;
                /**
                 * Format: uri
                 * @default null
                 */
                url: string | null;
                /** @default {} */
                metadata: {
                    [key: string]: unknown;
                };
                coverage: {
                    /** @enum {string} */
                    semantics: "provider_declared" | "owner_export_declared" | "unknown";
                    knownFields: string[];
                    unknownFields: string[];
                    /** Format: date-time */
                    windowFrom: string | null;
                    /** Format: date-time */
                    windowTo: string | null;
                    limitations: string[];
                };
            }[];
        };
        PersonalDataImportPreview: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            provider: string;
            accountLabel: string;
            /** @enum {string} */
            exportFormat: "omega_normalized_json_v1";
            summary: {
                recordCount: number;
                uniqueCount: number;
                duplicateCount: number;
                unknownActionCount: number;
                suppressedCount: number;
            };
            sample: {
                sourceItemId: string;
                /** @enum {string} */
                actionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
                /** Format: date-time */
                observedAt: string | null;
                /** @default null */
                title: string | null;
                /** @default null */
                contentReference: string | null;
                /**
                 * Format: uri
                 * @default null
                 */
                url: string | null;
                /** @default {} */
                metadata: {
                    [key: string]: unknown;
                };
                coverage: {
                    /** @enum {string} */
                    semantics: "provider_declared" | "owner_export_declared" | "unknown";
                    knownFields: string[];
                    unknownFields: string[];
                    /** Format: date-time */
                    windowFrom: string | null;
                    /** Format: date-time */
                    windowTo: string | null;
                    limitations: string[];
                };
            }[];
            /** @enum {string} */
            status: "draft" | "applied" | "expired";
            revision: number;
            /** Format: date-time */
            expiresAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        ApplyPersonalDataImport: {
            expectedRevision: number;
            /** @enum {string} */
            confirmation: "apply_normalized_import";
        };
        PersonalDataImportReceipt: {
            /** Format: uuid */
            previewId: string;
            insertedCount: number;
            duplicateCount: number;
            suppressedCount: number;
            /** Format: date-time */
            appliedAt: string;
        };
        Interest: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            label: string;
            /** @enum {string} */
            origin: "explicit" | "inferred";
            /** @enum {string} */
            status: "tentative" | "confirmed" | "corrected" | "dismissed" | "retracted";
            metric: {
                /** @enum {string} */
                name: "deduplicated_observation_count";
                count: number;
                denominator: number;
                /** Format: date-time */
                windowFrom: string;
                /** Format: date-time */
                windowTo: string;
                actionKinds: ("saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown")[];
            };
            /** @enum {string} */
            confidenceSemantics: "rule_threshold_not_probability";
            /** @enum {string} */
            methodVersion: "owner-approved-topic-count-v1";
            /** Format: date-time */
            firstObservedAt: string | null;
            /** Format: date-time */
            lastObservedAt: string | null;
            evidenceItemIds: string[];
            ownerCorrection: string | null;
            suppression: {
                [key: string]: unknown;
            } | null;
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        InterestList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                label: string;
                /** @enum {string} */
                origin: "explicit" | "inferred";
                /** @enum {string} */
                status: "tentative" | "confirmed" | "corrected" | "dismissed" | "retracted";
                metric: {
                    /** @enum {string} */
                    name: "deduplicated_observation_count";
                    count: number;
                    denominator: number;
                    /** Format: date-time */
                    windowFrom: string;
                    /** Format: date-time */
                    windowTo: string;
                    actionKinds: ("saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown")[];
                };
                /** @enum {string} */
                confidenceSemantics: "rule_threshold_not_probability";
                /** @enum {string} */
                methodVersion: "owner-approved-topic-count-v1";
                /** Format: date-time */
                firstObservedAt: string | null;
                /** Format: date-time */
                lastObservedAt: string | null;
                evidenceItemIds: string[];
                ownerCorrection: string | null;
                suppression: {
                    [key: string]: unknown;
                } | null;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        InterestEvidence: {
            /** Format: uuid */
            personalDataItemId: string;
            /** @enum {string} */
            interactionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
            /** Format: date-time */
            observedEventTime: string | null;
            provider: string;
            accountLabel: string;
            sourceItemId: string;
            title: string | null;
            contentReference: string | null;
            sourceUrl: string | null;
            extractionLimits: {
                /** @enum {string} */
                semantics: "provider_declared" | "owner_export_declared" | "unknown";
                knownFields: string[];
                unknownFields: string[];
                /** Format: date-time */
                windowFrom: string | null;
                /** Format: date-time */
                windowTo: string | null;
                limitations: string[];
            };
            /** @enum {boolean} */
            fetchingContentProvesConsumption: false;
            /** Format: date-time */
            linkedAt: string;
        };
        InterestEvidenceList: {
            items: {
                /** Format: uuid */
                personalDataItemId: string;
                /** @enum {string} */
                interactionKind: "saved" | "liked" | "played" | "watched" | "skipped" | "subscribed" | "fetched" | "commented" | "posted" | "unknown";
                /** Format: date-time */
                observedEventTime: string | null;
                provider: string;
                accountLabel: string;
                sourceItemId: string;
                title: string | null;
                contentReference: string | null;
                sourceUrl: string | null;
                extractionLimits: {
                    /** @enum {string} */
                    semantics: "provider_declared" | "owner_export_declared" | "unknown";
                    knownFields: string[];
                    unknownFields: string[];
                    /** Format: date-time */
                    windowFrom: string | null;
                    /** Format: date-time */
                    windowTo: string | null;
                    limitations: string[];
                };
                /** @enum {boolean} */
                fetchingContentProvesConsumption: false;
                /** Format: date-time */
                linkedAt: string;
            }[];
            nextCursor: string | null;
        };
        RefreshPersonalProfile: {
            window: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
            };
            approvedTopicLabels: string[];
        };
        UpdateInterest: {
            expectedRevision: number;
            /** @enum {string} */
            action: "confirm" | "correct" | "dismiss";
            value?: string;
            reason?: string;
        };
        DecideInterestClaim: {
            /** @enum {string} */
            decision: "confirm" | "correct" | "dismiss";
            correctedValue?: string;
            reason?: string;
        };
        TaskList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                completed: boolean;
                /** Format: date-time */
                dueAt: string | null;
                estimatedMinutes: number | null;
                remainingMinutes: number | null;
                /** Format: date-time */
                earliestStart: string | null;
                priority: number;
                allowSplit: boolean;
                minBlockMinutes: number | null;
                maxBlockMinutes: number | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
        };
        CreateTask: {
            title: string;
            /** Format: date-time */
            dueAt?: string | null;
            estimatedMinutes?: number | null;
            /** Format: date-time */
            earliestStart?: string | null;
            /** @default 3 */
            priority: number;
            /** @default true */
            allowSplit: boolean;
            minBlockMinutes?: number | null;
            maxBlockMinutes?: number | null;
        };
        UpdateTask: {
            expectedRevision: number;
            patch: {
                title?: string;
                completed?: boolean;
                /** Format: date-time */
                dueAt?: string | null;
                estimatedMinutes?: number | null;
                remainingMinutes?: number | null;
                /** Format: date-time */
                earliestStart?: string | null;
                priority?: number;
                allowSplit?: boolean;
                minBlockMinutes?: number | null;
                maxBlockMinutes?: number | null;
            };
        };
        ExpectedTaskRevision: {
            expectedRevision: number;
        };
        Reminder: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            taskId: string | null;
            /** Format: uuid */
            sourceAnchorId: string | null;
            /** Format: date-time */
            remindAt: string;
            timezone: string;
            /** @enum {string} */
            channel: "in_app" | "desktop";
            /** @enum {string} */
            status: "scheduled" | "snoozed" | "delivered" | "missed" | "dismissed" | "cancelled";
            revision: number;
            /** Format: date-time */
            deliveredAt: string | null;
            /** Format: date-time */
            dismissedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ReminderList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                taskId: string | null;
                /** Format: uuid */
                sourceAnchorId: string | null;
                /** Format: date-time */
                remindAt: string;
                timezone: string;
                /** @enum {string} */
                channel: "in_app" | "desktop";
                /** @enum {string} */
                status: "scheduled" | "snoozed" | "delivered" | "missed" | "dismissed" | "cancelled";
                revision: number;
                /** Format: date-time */
                deliveredAt: string | null;
                /** Format: date-time */
                dismissedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateReminder: {
            /** Format: uuid */
            taskId?: string | null;
            /** Format: uuid */
            sourceAnchorId?: string | null;
            /** Format: date-time */
            remindAt: string;
            timezone: string;
            /** @enum {string} */
            channel: "in_app" | "desktop";
        };
        UpdateReminder: {
            /** Format: date-time */
            remindAt?: string;
            /** @enum {string} */
            status?: "scheduled" | "snoozed" | "dismissed";
            expectedRevision: number;
        };
        Notification: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            reminderId: string;
            /** Format: uuid */
            taskId: string | null;
            /** @enum {string} */
            channel: "in_app" | "desktop";
            title: string;
            body: string;
            /** @enum {string} */
            state: "unread" | "read" | "dismissed";
            revision: number;
            /** Format: date-time */
            deliveredAt: string;
            /** Format: date-time */
            readAt: string | null;
            /** Format: date-time */
            dismissedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        NotificationList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                reminderId: string;
                /** Format: uuid */
                taskId: string | null;
                /** @enum {string} */
                channel: "in_app" | "desktop";
                title: string;
                body: string;
                /** @enum {string} */
                state: "unread" | "read" | "dismissed";
                revision: number;
                /** Format: date-time */
                deliveredAt: string;
                /** Format: date-time */
                readAt: string | null;
                /** Format: date-time */
                dismissedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        UpdateNotification: {
            /** @enum {string} */
            state: "read" | "dismissed";
        };
        CalendarEntity: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "person" | "place" | "group" | "object" | "class";
            name: string;
            /** Format: uuid */
            mergedIntoEntityId: string | null;
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** @default [] */
            aliases: {
                /** Format: uuid */
                id: string;
                alias: string;
                /** @enum {string} */
                scope: "all" | "event_matching" | "search_only";
                /** Format: uuid */
                evidenceNoteId: string | null;
                revision: number;
            }[];
            /** @default [] */
            sourceLinks: {
                /** @enum {string} */
                kind: "alias_evidence" | "commitment_evidence";
                /** Format: uuid */
                sourceNoteId: string;
                /** Format: uuid */
                recordId: string;
            }[];
            /**
             * @default {
             *       "eventCount": 0,
             *       "activeCommitmentCount": 0,
             *       "otherCommitmentCount": 0
             *     }
             */
            dependencies: {
                eventCount: number;
                activeCommitmentCount: number;
                otherCommitmentCount: number;
            };
        };
        PersonSummary: {
            /** Format: uuid */
            id: string;
            name: string;
            roles: ("contact" | "teacher")[];
            aliases: string[];
            activeCommitmentCount: number;
            upcomingEventCount: number;
            revision: number;
            /** Format: date-time */
            updatedAt: string;
        };
        PersonSummaryList: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                roles: ("contact" | "teacher")[];
                aliases: string[];
                activeCommitmentCount: number;
                upcomingEventCount: number;
                revision: number;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        PersonContext: {
            person: {
                /** Format: uuid */
                id: string;
                name: string;
                roles: ("contact" | "teacher")[];
                aliases: string[];
                activeCommitmentCount: number;
                upcomingEventCount: number;
                revision: number;
                /** Format: date-time */
                updatedAt: string;
            };
            activeCommitments: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                text: string;
                /** Format: uuid */
                personEntityId: string;
                /** Format: uuid */
                objectEntityId: string | null;
                objectLabel: string;
                /** Format: uuid */
                sourceNoteId: string | null;
                /** @enum {string} */
                conditionKind: "next_meeting_with_person";
                /** @enum {string} */
                status: "active" | "fulfilled" | "cancelled" | "superseded";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
            upcomingPlans: {
                /** Format: uuid */
                eventId: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                timezone: string;
                revision: number;
            }[];
            borrowedItems: {
                /** Format: uuid */
                commitmentId: string;
                /** Format: uuid */
                objectEntityId: string | null;
                objectLabel: string;
                /** @enum {string} */
                status: "active" | "fulfilled" | "cancelled" | "superseded";
                /** Format: uuid */
                sourceNoteId: string | null;
            }[];
            discussionNotes: {
                /** Format: uuid */
                noteId: string;
                title: string;
                revision: number;
            }[];
            /** @enum {string} */
            identityPolicy: "exact_canonical_entity_only";
            /** @enum {string} */
            privateSourcePolicy: "owner_vault_and_explicit_links_only";
            /** @enum {boolean} */
            personalityInferences: false;
            /** Format: date-time */
            generatedAt: string;
        };
        ProposeSocialTime: {
            window: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            durationEstimate: number;
            userConstraintsRevision: number;
            /** @default null */
            connectedAvailabilityScope: {
                connectionIds: string[];
            } | null;
        };
        AuthorizationRequest: {
            requestedCapabilities: ("calendar.read" | "calendar.write" | "teams.read" | "teams.channels.read" | "classes.read" | "assignments.read" | "mail.read" | "files.read" | "files.read.all" | "sites.read" | "tasks.read" | "notes.read" | "contacts.read" | "offline.access")[];
            /** @enum {string} */
            registeredReturnTarget: "connections" | "connection_detail";
        };
        ReauthorizationRequest: {
            requestedCapabilities: ("calendar.read" | "calendar.write" | "teams.read" | "teams.channels.read" | "classes.read" | "assignments.read" | "mail.read" | "files.read" | "files.read.all" | "sites.read" | "tasks.read" | "notes.read" | "contacts.read" | "offline.access")[];
            /** @enum {string} */
            registeredReturnTarget: "connections" | "connection_detail";
            /** @enum {string} */
            reason: "expired" | "revoked" | "permission_upgrade" | "owner_requested";
        };
        AuthorizationStart: {
            /** Format: uuid */
            transactionId: string;
            /** @enum {string} */
            provider: "microsoft" | "google_calendar";
            /** Format: uri */
            authorizationUrl: string;
            requestedCapabilities: ("calendar.read" | "calendar.write" | "teams.read" | "teams.channels.read" | "classes.read" | "assignments.read" | "mail.read" | "files.read" | "files.read.all" | "sites.read" | "tasks.read" | "notes.read" | "contacts.read" | "offline.access")[];
            /** @enum {string} */
            registeredReturnTarget: "connections" | "connection_detail";
            /** Format: date-time */
            expiresAt: string;
            /** @enum {string} */
            pkce: "S256";
            /** @enum {boolean} */
            stateStoredAsHash: true;
            /** @enum {boolean} */
            secretsIncluded: false;
        };
        CalendarEntityList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "person" | "place" | "group" | "object" | "class";
                name: string;
                /** Format: uuid */
                mergedIntoEntityId: string | null;
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** @default [] */
                aliases: {
                    /** Format: uuid */
                    id: string;
                    alias: string;
                    /** @enum {string} */
                    scope: "all" | "event_matching" | "search_only";
                    /** Format: uuid */
                    evidenceNoteId: string | null;
                    revision: number;
                }[];
                /** @default [] */
                sourceLinks: {
                    /** @enum {string} */
                    kind: "alias_evidence" | "commitment_evidence";
                    /** Format: uuid */
                    sourceNoteId: string;
                    /** Format: uuid */
                    recordId: string;
                }[];
                /**
                 * @default {
                 *       "eventCount": 0,
                 *       "activeCommitmentCount": 0,
                 *       "otherCommitmentCount": 0
                 *     }
                 */
                dependencies: {
                    eventCount: number;
                    activeCommitmentCount: number;
                    otherCommitmentCount: number;
                };
            }[];
        };
        CreateCalendarEntity: {
            /** @enum {string} */
            kind: "person" | "place" | "group" | "object" | "class";
            name: string;
        };
        UpdateCalendarEntity: {
            name: string;
        };
        EntityAlias: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            entityId: string;
            alias: string;
            /** @enum {string} */
            scope: "all" | "event_matching" | "search_only";
            /** Format: uuid */
            evidenceNoteId: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        AddEntityAlias: {
            alias: string;
            /** @enum {string} */
            scope: "all" | "event_matching" | "search_only";
            /** Format: uuid */
            evidenceNoteId?: string | null;
        };
        PreviewEntityMerge: {
            entityIds: string[];
            /** Format: uuid */
            targetId: string;
            reason: string;
        };
        Calendar: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            name: string;
            timezone: string;
            /** @enum {string} */
            origin: "sorta" | "microsoft" | "google_calendar" | "visma_inschool";
            /** @enum {string} */
            ownership: "owner" | "provider";
            capabilities: {
                read: boolean;
                write: boolean;
            };
            selectedVisible: boolean;
            displayPreferences: {
                color: string;
                /** @default true */
                showWeekends: boolean;
            };
            providerMapping: {
                /** Format: uuid */
                connectionId: string;
                providerCalendarId: string;
            } | null;
            freshness: {
                /** @enum {string} */
                state: "current" | "stale" | "not_configured";
                /** Format: date-time */
                lastSyncedAt: string | null;
            };
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CalendarList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                timezone: string;
                /** @enum {string} */
                origin: "sorta" | "microsoft" | "google_calendar" | "visma_inschool";
                /** @enum {string} */
                ownership: "owner" | "provider";
                capabilities: {
                    read: boolean;
                    write: boolean;
                };
                selectedVisible: boolean;
                displayPreferences: {
                    color: string;
                    /** @default true */
                    showWeekends: boolean;
                };
                providerMapping: {
                    /** Format: uuid */
                    connectionId: string;
                    providerCalendarId: string;
                } | null;
                freshness: {
                    /** @enum {string} */
                    state: "current" | "stale" | "not_configured";
                    /** Format: date-time */
                    lastSyncedAt: string | null;
                };
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateCalendar: {
            name: string;
            /**
             * @default {
             *       "color": "#6366f1",
             *       "showWeekends": true
             *     }
             */
            displayPreferences: {
                color: string;
                /** @default true */
                showWeekends: boolean;
            };
            timezone: string;
            /** @enum {string} */
            origin: "sorta";
        };
        UpdateCalendar: {
            name?: string;
            timezone?: string;
            selectedVisible?: boolean;
            displayPreferences?: {
                color: string;
                /** @default true */
                showWeekends: boolean;
            };
            archived?: boolean;
        };
        CalendarPolicySetInput: {
            rules: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                sourceKind: "owner_note" | "provider_structured_event" | "provider_message" | "school_record";
                /** @enum {string} */
                action: "create_private_event" | "create_commitment" | "add_preparation" | "queue_external_calendar_action";
                enabled: boolean;
                /** @enum {string} */
                confirmation: "always_review" | "auto_local_only";
                predicate: {
                    /** @enum {string} */
                    statementKind: "definite_plan" | "explicit_commitment" | "structured_event";
                    requireResolvedDate: boolean;
                    requireResolvedIdentity: boolean;
                    /** @enum {string} */
                    encounterMode: "any" | "in_person" | "virtual";
                };
            }[];
        };
        CalendarPolicySet: {
            rules: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                sourceKind: "owner_note" | "provider_structured_event" | "provider_message" | "school_record";
                /** @enum {string} */
                action: "create_private_event" | "create_commitment" | "add_preparation" | "queue_external_calendar_action";
                enabled: boolean;
                /** @enum {string} */
                confirmation: "always_review" | "auto_local_only";
                predicate: {
                    /** @enum {string} */
                    statementKind: "definite_plan" | "explicit_commitment" | "structured_event";
                    requireResolvedDate: boolean;
                    requireResolvedIdentity: boolean;
                    /** @enum {string} */
                    encounterMode: "any" | "in_person" | "virtual";
                };
            }[];
            /** Format: uuid */
            vaultId: string;
            revision: number;
            effectSummary: {
                enabledLocalActions: number;
                reviewOnlyActions: number;
                newlyEnabledRuleIds: string[];
                /** @enum {boolean} */
                externalActionsAlwaysReviewed: true;
            };
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        PolicyDryRunInput: {
            policy: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                sourceKind: "owner_note" | "provider_structured_event" | "provider_message" | "school_record";
                /** @enum {string} */
                action: "create_private_event" | "create_commitment" | "add_preparation" | "queue_external_calendar_action";
                enabled: boolean;
                /** @enum {string} */
                confirmation: "always_review" | "auto_local_only";
                predicate: {
                    /** @enum {string} */
                    statementKind: "definite_plan" | "explicit_commitment" | "structured_event";
                    requireResolvedDate: boolean;
                    requireResolvedIdentity: boolean;
                    /** @enum {string} */
                    encounterMode: "any" | "in_person" | "virtual";
                };
            };
            sourceIds: string[];
            boundedWindow: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
            };
        };
        AutomationDecisionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                policyRuleId: string | null;
                /** Format: uuid */
                sourceId: string | null;
                /** Format: uuid */
                eventId: string | null;
                /** @enum {string} */
                action: "create_private_event" | "create_commitment" | "add_preparation" | "queue_external_calendar_action";
                /** @enum {string} */
                outcome: "applied" | "suggested" | "blocked";
                reasonCodes: string[];
                evidence: {
                    [key: string]: unknown;
                };
                policyRevision: number;
                reversible: boolean;
                /** Format: date-time */
                undoneAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        UndoCalendarDecision: {
            expectedRevision: number;
            clientOperationId: string;
        };
        CalendarDecisionUndoResult: {
            /** Format: uuid */
            decisionId: string;
            /** @enum {string} */
            compensation: "event_trashed" | "prep_invalidated" | "commitment_archived";
            /** Format: uuid */
            affectedRecordId: string;
            /** @enum {boolean} */
            writesApplied: true;
            /** Format: date-time */
            undoneAt: string;
        };
        Commitment: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            text: string;
            /** Format: uuid */
            personEntityId: string;
            /** Format: uuid */
            objectEntityId: string | null;
            objectLabel: string;
            /** Format: uuid */
            sourceNoteId: string | null;
            /** @enum {string} */
            conditionKind: "next_meeting_with_person";
            /** @enum {string} */
            status: "active" | "fulfilled" | "cancelled" | "superseded";
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        CommitmentList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                text: string;
                /** Format: uuid */
                personEntityId: string;
                /** Format: uuid */
                objectEntityId: string | null;
                objectLabel: string;
                /** Format: uuid */
                sourceNoteId: string | null;
                /** @enum {string} */
                conditionKind: "next_meeting_with_person";
                /** @enum {string} */
                status: "active" | "fulfilled" | "cancelled" | "superseded";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CreateCommitment: {
            text: string;
            /** Format: uuid */
            personEntityId: string;
            /** Format: uuid */
            objectEntityId?: string | null;
            objectLabel: string;
            /** Format: uuid */
            sourceNoteId?: string | null;
            /** @enum {string} */
            conditionKind: "next_meeting_with_person";
        };
        UpdateCommitment: {
            text?: string;
            /** Format: uuid */
            personEntityId?: string;
            /** Format: uuid */
            objectEntityId?: string | null;
            objectLabel?: string;
            /** @enum {string} */
            status?: "active" | "fulfilled" | "cancelled" | "superseded";
            /** @enum {string} */
            evidenceKind?: "owner_confirmed_action" | "source_note" | "owner_correction" | "superseded_by_new_commitment";
            /** Format: uuid */
            evidenceNoteId?: string | null;
            reason?: string | null;
        };
        RematchCommitment: {
            expectedRevision: number;
            clientOperationId: string;
        };
        CommitmentDetail: {
            commitment: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                text: string;
                /** Format: uuid */
                personEntityId: string;
                /** Format: uuid */
                objectEntityId: string | null;
                objectLabel: string;
                /** Format: uuid */
                sourceNoteId: string | null;
                /** @enum {string} */
                conditionKind: "next_meeting_with_person";
                /** @enum {string} */
                status: "active" | "fulfilled" | "cancelled" | "superseded";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            };
            person: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "person" | "place" | "group" | "object" | "class";
                name: string;
                /** Format: uuid */
                mergedIntoEntityId: string | null;
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** @default [] */
                aliases: {
                    /** Format: uuid */
                    id: string;
                    alias: string;
                    /** @enum {string} */
                    scope: "all" | "event_matching" | "search_only";
                    /** Format: uuid */
                    evidenceNoteId: string | null;
                    revision: number;
                }[];
                /** @default [] */
                sourceLinks: {
                    /** @enum {string} */
                    kind: "alias_evidence" | "commitment_evidence";
                    /** Format: uuid */
                    sourceNoteId: string;
                    /** Format: uuid */
                    recordId: string;
                }[];
                /**
                 * @default {
                 *       "eventCount": 0,
                 *       "activeCommitmentCount": 0,
                 *       "otherCommitmentCount": 0
                 *     }
                 */
                dependencies: {
                    eventCount: number;
                    activeCommitmentCount: number;
                    otherCommitmentCount: number;
                };
            };
            object: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "person" | "place" | "group" | "object" | "class";
                name: string;
                /** Format: uuid */
                mergedIntoEntityId: string | null;
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** @default [] */
                aliases: {
                    /** Format: uuid */
                    id: string;
                    alias: string;
                    /** @enum {string} */
                    scope: "all" | "event_matching" | "search_only";
                    /** Format: uuid */
                    evidenceNoteId: string | null;
                    revision: number;
                }[];
                /** @default [] */
                sourceLinks: {
                    /** @enum {string} */
                    kind: "alias_evidence" | "commitment_evidence";
                    /** Format: uuid */
                    sourceNoteId: string;
                    /** Format: uuid */
                    recordId: string;
                }[];
                /**
                 * @default {
                 *       "eventCount": 0,
                 *       "activeCommitmentCount": 0,
                 *       "otherCommitmentCount": 0
                 *     }
                 */
                dependencies: {
                    eventCount: number;
                    activeCommitmentCount: number;
                    otherCommitmentCount: number;
                };
            } | null;
            sourceEvidence: {
                /** Format: uuid */
                noteId: string;
                title: string;
                revision: number;
            } | null;
            bindings: {
                prepItem: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    eventId: string;
                    /** Format: uuid */
                    commitmentId: string | null;
                    occurrenceId: string | null;
                    /** @enum {string} */
                    type: "bring" | "review" | "checklist" | "custom";
                    text: string;
                    /** @enum {string} */
                    status: "needed" | "packed" | "dismissed" | "completed";
                    /** Format: uuid */
                    evidenceNoteId: string | null;
                    provenance: {
                        /** @enum {string} */
                        origin: "owner" | "commitment_rule" | "system";
                        /** Format: uuid */
                        sourceId?: string | null;
                        /** Format: uuid */
                        matchedAliasId?: string | null;
                    };
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                };
                event: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    /** Format: uuid */
                    calendarId: string;
                    title: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    privateContext: string | null;
                    revision: number;
                    timezone: string;
                    recurrence: {
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval: number;
                        timezone: string;
                        byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                        count?: number;
                        /** Format: date-time */
                        until?: string;
                    } | null;
                    /** Format: date-time */
                    trashedAt: string | null;
                    /** Format: date-time */
                    createdAt: string;
                };
            }[];
            statusHistory: {
                /** Format: uuid */
                id: string;
                /** @enum {string|null} */
                fromStatus: "active" | "fulfilled" | "cancelled" | "superseded" | null;
                /** @enum {string} */
                toStatus: "active" | "fulfilled" | "cancelled" | "superseded";
                /** @enum {string} */
                actor: "owner" | "system";
                /** @enum {string} */
                evidenceKind: "creation" | "owner_confirmed_action" | "source_note" | "owner_correction" | "superseded_by_new_commitment" | "archive";
                /** Format: uuid */
                evidenceNoteId: string | null;
                reason: string | null;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CalendarEvent: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            calendarId: string;
            title: string;
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            privateContext: string | null;
            revision: number;
            timezone: string;
            recurrence: {
                /** @enum {string} */
                frequency: "daily" | "weekly" | "monthly" | "yearly";
                /** @default 1 */
                interval: number;
                timezone: string;
                byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                count?: number;
                /** Format: date-time */
                until?: string;
            } | null;
            /** Format: date-time */
            trashedAt: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        CalendarView: {
            /** @enum {string} */
            view: "day" | "week" | "workweek" | "month" | "agenda";
            range: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
                timezone: string;
            };
            selectedCalendarIds: string[];
            occurrences: {
                id: string;
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                exceptionId: string | null;
                /** Format: date-time */
                originalStartsAt: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                /** Format: uuid */
                calendarId: string;
                eventRevision: number;
                timezone: string;
                /** @enum {string} */
                layer: "personal" | "school" | "study";
                source: {
                    /** @enum {string} */
                    kind: "local" | "provider";
                    /** Format: uuid */
                    connectionId: string | null;
                    stale: boolean;
                };
            }[];
            overlayItems: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "lesson" | "assignment" | "assessment" | "attendance";
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string | null;
                /** @enum {string} */
                layer: "school" | "deadline" | "assessment" | "attendance";
                /**
                 * @default null
                 * @enum {string|null}
                 */
                attendanceStatus: "present" | "absent" | "late" | "unknown" | null;
                /** @enum {string} */
                reason: "source_record_not_calendar_event";
                revision: number;
            }[];
            unknownTimeMarkers: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "lesson" | "assignment" | "assessment" | "attendance";
                title: string;
                date: string | null;
                /**
                 * @default null
                 * @enum {string|null}
                 */
                attendanceStatus: "present" | "absent" | "late" | "unknown" | null;
                /** @enum {string} */
                reason: "time_unknown" | "date_only" | "unlinked_school_record";
                revision: number;
            }[];
            staleSources: {
                /** Format: uuid */
                connectionId: string;
                /** @enum {string} */
                provider: "microsoft" | "google_calendar";
                label: string;
                /** @enum {string} */
                state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
                /** Format: date-time */
                lastSuccessAt: string | null;
                reason: string;
            }[];
        };
        CalendarBriefQuery: {
            date: string;
            timezone: string;
        };
        CalendarBrief: {
            /** Format: uuid */
            vaultId: string;
            date: string;
            timezone: string;
            /** @enum {string} */
            state: "missing" | "fresh" | "stale";
            revision: number;
            /** Format: date-time */
            generatedAt: string | null;
            items: {
                occurrenceId: string;
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                calendarId: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                eventRevision: number;
                prepItemCount: number;
                linkedCommitmentCount: number;
            }[];
            deterministicSummary: string[];
            sourceManifest: {
                /** @enum {string} */
                recordType: "calendar_event";
                /** Format: uuid */
                recordId: string;
                revision: number;
            }[];
            generation: {
                /** @enum {string} */
                method: "deterministic-calendar-brief-v1";
                sourceCount: number;
                cached: boolean;
            };
        };
        CalendarExportInput: {
            calendarIds: string[];
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to: string;
            /** @enum {string} */
            format: "ics";
            /** @enum {string} */
            privacy: "minimal";
        };
        CalendarImportInput: {
            /** Format: uuid */
            attachmentId: string;
            /** @enum {string} */
            format: "ics";
            timezone: string;
            /** Format: uuid */
            targetCalendarId: string;
        };
        PreviewProviderCalendarAction: {
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            kind: "create" | "update" | "delete" | "respond";
            targetCalendarId: string;
            /** @default [] */
            recipients: {
                /** Format: email */
                address: string;
                /** @default null */
                displayName: string | null;
            }[];
            publicFields?: {
                title?: string;
                /** Format: date-time */
                startsAt?: string;
                /** Format: date-time */
                endsAt?: string;
                timezone?: string;
                /** @default null */
                description: string | null;
                /** @default null */
                location: string | null;
            };
            /**
             * @default null
             * @enum {string|null}
             */
            response: "accepted" | "declined" | "tentative" | null;
        };
        ProviderCalendarAction: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            proposalId: string;
            /** Format: uuid */
            eventId: string;
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            provider: "microsoft" | "google_calendar";
            /** @enum {string} */
            actionKind: "create" | "update" | "delete" | "respond";
            targetCalendarId: string;
            recipients: {
                /** Format: email */
                address: string;
                /** @default null */
                displayName: string | null;
            }[];
            publicFields: {
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                timezone: string;
                /** @default null */
                description: string | null;
                /** @default null */
                location: string | null;
            };
            /** @enum {string|null} */
            response: "accepted" | "declined" | "tentative" | null;
            /** @enum {string} */
            state: "pending" | "in_flight" | "delivery_unknown" | "acknowledged" | "rejected" | "cancelled";
            idempotencyKey: string;
            providerOperationId: string | null;
            acknowledgement: {
                [key: string]: unknown;
            } | null;
            attemptCount: number;
            reconciliationRequired: boolean;
            sendsDisabledAfterRestore: boolean;
            lastErrorCode: string | null;
            revision: number;
            /** Format: date-time */
            sentAt: string | null;
            /** Format: date-time */
            acknowledgedAt: string | null;
            /** Format: date-time */
            cancelledAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ProviderCalendarActionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                connectionId: string;
                /** @enum {string} */
                provider: "microsoft" | "google_calendar";
                /** @enum {string} */
                actionKind: "create" | "update" | "delete" | "respond";
                targetCalendarId: string;
                recipients: {
                    /** Format: email */
                    address: string;
                    /** @default null */
                    displayName: string | null;
                }[];
                publicFields: {
                    title: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    timezone: string;
                    /** @default null */
                    description: string | null;
                    /** @default null */
                    location: string | null;
                };
                /** @enum {string|null} */
                response: "accepted" | "declined" | "tentative" | null;
                /** @enum {string} */
                state: "pending" | "in_flight" | "delivery_unknown" | "acknowledged" | "rejected" | "cancelled";
                idempotencyKey: string;
                providerOperationId: string | null;
                acknowledgement: {
                    [key: string]: unknown;
                } | null;
                attemptCount: number;
                reconciliationRequired: boolean;
                sendsDisabledAfterRestore: boolean;
                lastErrorCode: string | null;
                revision: number;
                /** Format: date-time */
                sentAt: string | null;
                /** Format: date-time */
                acknowledgedAt: string | null;
                /** Format: date-time */
                cancelledAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CalendarEventList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                calendarId: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                privateContext: string | null;
                revision: number;
                timezone: string;
                recurrence: {
                    /** @enum {string} */
                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                    /** @default 1 */
                    interval: number;
                    timezone: string;
                    byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                    count?: number;
                    /** Format: date-time */
                    until?: string;
                } | null;
                /** Format: date-time */
                trashedAt: string | null;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        CreateCalendarEvent: {
            /** Format: uuid */
            calendarId?: string;
            title: string;
            /** Format: date-time */
            startsAt: string;
            /** Format: date-time */
            endsAt: string;
            privateContext?: string | null;
            /** @default UTC */
            timezone: string;
            recurrence?: {
                /** @enum {string} */
                frequency: "daily" | "weekly" | "monthly" | "yearly";
                /** @default 1 */
                interval: number;
                timezone: string;
                byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                count?: number;
                /** Format: date-time */
                until?: string;
            } | null;
            /** @default [] */
            entityIds: string[];
        };
        UpdateCalendarEvent: {
            /** @enum {string} */
            scope: "series";
            expectedRevision: number;
            title?: string;
            /** Format: date-time */
            startsAt?: string;
            /** Format: date-time */
            endsAt?: string;
            timezone?: string;
            recurrence?: {
                /** @enum {string} */
                frequency: "daily" | "weekly" | "monthly" | "yearly";
                /** @default 1 */
                interval: number;
                timezone: string;
                byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                count?: number;
                /** Format: date-time */
                until?: string;
            } | null;
        };
        CalendarEventRevisionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                eventId: string;
                revision: number;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                timezone: string;
                recurrence: {
                    /** @enum {string} */
                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                    /** @default 1 */
                    interval: number;
                    timezone: string;
                    byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                    count?: number;
                    /** Format: date-time */
                    until?: string;
                } | null;
                /** @enum {string} */
                actorKind: "owner" | "provider" | "system";
                changedFields: string[];
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        EventOccurrenceList: {
            items: {
                id: string;
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                exceptionId: string | null;
                /** Format: date-time */
                originalStartsAt: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            }[];
        };
        OccurrenceExceptionInput: {
            /** @enum {string} */
            scope: "occurrence";
            expectedRevision: number;
            /** Format: date-time */
            originalStartsAt: string;
            /** @default false */
            cancelled: boolean;
            title?: string | null;
            /** Format: date-time */
            startsAt?: string | null;
            /** Format: date-time */
            endsAt?: string | null;
        };
        OccurrenceException: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            eventId: string;
            /** Format: date-time */
            originalStartsAt: string;
            cancelled: boolean;
            title: string | null;
            /** Format: date-time */
            startsAt: string | null;
            /** Format: date-time */
            endsAt: string | null;
            revision: number;
        };
        UpdateOccurrenceException: {
            /** @enum {string} */
            scope: "occurrence";
            expectedEventRevision: number;
            expectedExceptionRevision: number;
            cancelled?: boolean;
            title?: string | null;
            /** Format: date-time */
            startsAt?: string | null;
            /** Format: date-time */
            endsAt?: string | null;
        };
        FreeBusyQuery: {
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to: string;
            timezone: string;
            /** @default [] */
            calendarIds: string[];
        };
        FreeBusyResult: {
            /** Format: date-time */
            from: string;
            /** Format: date-time */
            to: string;
            timezone: string;
            busy: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                occurrenceIds: string[];
            }[];
            unknownTimeConflicts: unknown[];
            staleSources: unknown[];
        };
        CalendarConflictList: {
            items: {
                id: string;
                /** @enum {string} */
                kind: "overlap";
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                occurrenceIds: [
                    string,
                    string
                ];
                eventIds: [
                    string,
                    string
                ];
                titles: [
                    string,
                    string
                ];
            }[];
        };
        PrivateEventContext: {
            event: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                calendarId: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                privateContext: string | null;
                revision: number;
                timezone: string;
                recurrence: {
                    /** @enum {string} */
                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                    /** @default 1 */
                    interval: number;
                    timezone: string;
                    byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                    count?: number;
                    /** Format: date-time */
                    until?: string;
                } | null;
                /** Format: date-time */
                trashedAt: string | null;
                /** Format: date-time */
                createdAt: string;
            };
            privateContext: string | null;
            prepItems: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                commitmentId: string | null;
                occurrenceId: string | null;
                /** @enum {string} */
                type: "bring" | "review" | "checklist" | "custom";
                text: string;
                /** @enum {string} */
                status: "needed" | "packed" | "dismissed" | "completed";
                /** Format: uuid */
                evidenceNoteId: string | null;
                provenance: {
                    /** @enum {string} */
                    origin: "owner" | "commitment_rule" | "system";
                    /** Format: uuid */
                    sourceId?: string | null;
                    /** Format: uuid */
                    matchedAliasId?: string | null;
                };
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
            linkedCommitments: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                text: string;
                /** Format: uuid */
                personEntityId: string;
                /** Format: uuid */
                objectEntityId: string | null;
                objectLabel: string;
                /** Format: uuid */
                sourceNoteId: string | null;
                /** @enum {string} */
                conditionKind: "next_meeting_with_person";
                /** @enum {string} */
                status: "active" | "fulfilled" | "cancelled" | "superseded";
                revision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        RefreshPrivateEventContext: {
            /** @default null */
            occurrenceId: string | null;
            expectedRevision: number;
        };
        SetEventReminderPlan: {
            /** @enum {string} */
            occurrenceScope: "series" | "occurrence";
            /** @default null */
            occurrenceId: string | null;
            schedules: {
                minutesBefore: number;
            }[];
            channels: ("in_app" | "windows_native")[];
        };
        EventReminderPlan: {
            /** @enum {string} */
            occurrenceScope: "series" | "occurrence";
            /** @default null */
            occurrenceId: string | null;
            schedules: {
                minutesBefore: number;
            }[];
            channels: ("in_app" | "windows_native")[];
            /** Format: uuid */
            eventId: string;
            /** Format: uuid */
            vaultId: string;
            eventRevision: number;
            revision: number;
            nextTriggers: {
                /** Format: date-time */
                scheduledFor: string;
                minutesBefore: number;
                channels: ("in_app" | "windows_native")[];
            }[];
            deliverability: {
                /** @enum {string} */
                inApp: "durable_queue";
                /** @enum {string} */
                windowsNative: "not_requested" | "unverified_host_delivery";
                /** @enum {boolean} */
                guaranteedOsDelivery: false;
                quietHoursApplied: boolean;
            };
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        PrepItem: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            eventId: string;
            /** Format: uuid */
            commitmentId: string | null;
            occurrenceId: string | null;
            /** @enum {string} */
            type: "bring" | "review" | "checklist" | "custom";
            text: string;
            /** @enum {string} */
            status: "needed" | "packed" | "dismissed" | "completed";
            /** Format: uuid */
            evidenceNoteId: string | null;
            provenance: {
                /** @enum {string} */
                origin: "owner" | "commitment_rule" | "system";
                /** Format: uuid */
                sourceId?: string | null;
                /** Format: uuid */
                matchedAliasId?: string | null;
            };
            revision: number;
            /** Format: date-time */
            createdAt: string;
        };
        CreatePrepItem: {
            occurrenceId?: string | null;
            /** @enum {string} */
            type: "bring" | "review" | "checklist" | "custom";
            text: string;
            /** Format: uuid */
            evidenceNoteId?: string | null;
            /** Format: uuid */
            commitmentId?: string | null;
        };
        UpdatePrepItem: {
            expectedRevision: number;
            text?: string;
            /** @enum {string} */
            status?: "needed" | "packed" | "dismissed" | "completed";
        };
        SearchRequest: {
            query: string;
            /**
             * @default lexical
             * @enum {string}
             */
            mode: "lexical" | "hybrid" | "semantic";
            /**
             * @default {
             *       "kinds": [
             *         "note",
             *         "task",
             *         "calendar_event"
             *       ]
             *     }
             */
            scope: {
                /**
                 * @default [
                 *       "note",
                 *       "task",
                 *       "calendar_event"
                 *     ]
                 */
                kinds: ("note" | "task" | "calendar_event")[];
            };
            /** @default 20 */
            limit: number;
            cursor?: string;
        };
        SearchResponse: {
            /** @enum {string} */
            mode: "lexical" | "hybrid" | "semantic";
            query: string;
            items: {
                /** @enum {string} */
                kind: "note" | "task" | "calendar_event";
                /** Format: uuid */
                id: string;
                title: string;
                excerpt: string;
                score: number;
                /** Format: uuid */
                sourceId: string | null;
                revision: number;
                /** Format: date-time */
                updatedAt: string;
            }[];
            coverage: {
                kinds: ("note" | "task" | "calendar_event")[];
                semanticAvailable: boolean;
            };
            nextCursor: string | null;
        } | {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
            /** @enum {string} */
            status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
            /** Format: date-time */
            createdAt: string;
        };
        Chat: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            title: string | null;
            /** @enum {string} */
            defaultMode: "notes" | "tutor" | "calendar" | "profile" | "brainstorm";
            defaultScope: {
                /**
                 * @default [
                 *       "note"
                 *     ]
                 */
                kinds: ("note" | "task" | "calendar_event")[];
            };
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        ChatList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string | null;
                /** @enum {string} */
                defaultMode: "notes" | "tutor" | "calendar" | "profile" | "brainstorm";
                defaultScope: {
                    /**
                     * @default [
                     *       "note"
                     *     ]
                     */
                    kinds: ("note" | "task" | "calendar_event")[];
                };
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
        };
        CreateChat: {
            title?: string;
            /**
             * @default notes
             * @enum {string}
             */
            defaultMode: "notes" | "tutor" | "calendar" | "profile" | "brainstorm";
            /**
             * @default {
             *       "kinds": [
             *         "note"
             *       ]
             *     }
             */
            defaultScope: {
                /**
                 * @default [
                 *       "note"
                 *     ]
                 */
                kinds: ("note" | "task" | "calendar_event")[];
            };
        };
        ChatMessageList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                chatId: string;
                clientMessageId: string | null;
                /** @enum {string} */
                role: "user" | "assistant";
                text: string;
                /** @enum {string} */
                mode: "grounded" | "brainstorm";
                /** @enum {string} */
                status: "persisted" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled";
                /** Format: uuid */
                answerToId: string | null;
                /** Format: uuid */
                jobId: string | null;
                citations: {
                    citationId: string;
                    /** Format: uuid */
                    chunkId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    title: string;
                    startOffset: number;
                    endOffset: number;
                    quote: string;
                }[];
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateChatMessage: {
            clientMessageId: string;
            text: string;
            /**
             * @default grounded
             * @enum {string}
             */
            mode: "grounded" | "brainstorm";
            scope?: {
                /**
                 * @default [
                 *       "note"
                 *     ]
                 */
                kinds: ("note" | "task" | "calendar_event")[];
            };
            /** @default true */
            queueWhenOffline: boolean;
        };
        ChatMessageAccepted: {
            userMessage: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                chatId: string;
                clientMessageId: string | null;
                /** @enum {string} */
                role: "user" | "assistant";
                text: string;
                /** @enum {string} */
                mode: "grounded" | "brainstorm";
                /** @enum {string} */
                status: "persisted" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled";
                /** Format: uuid */
                answerToId: string | null;
                /** Format: uuid */
                jobId: string | null;
                citations: {
                    citationId: string;
                    /** Format: uuid */
                    chunkId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    title: string;
                    startOffset: number;
                    endOffset: number;
                    quote: string;
                }[];
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            };
            assistantMessage: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                chatId: string;
                clientMessageId: string | null;
                /** @enum {string} */
                role: "user" | "assistant";
                text: string;
                /** @enum {string} */
                mode: "grounded" | "brainstorm";
                /** @enum {string} */
                status: "persisted" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled";
                /** Format: uuid */
                answerToId: string | null;
                /** Format: uuid */
                jobId: string | null;
                citations: {
                    citationId: string;
                    /** Format: uuid */
                    chunkId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    title: string;
                    startOffset: number;
                    endOffset: number;
                    quote: string;
                }[];
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            };
            job: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
                /** @enum {string} */
                status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
                /** Format: date-time */
                createdAt: string;
            };
        };
        AskHandle: {
            /** Format: uuid */
            jobId: string;
            /** Format: uuid */
            userMessageId: string;
            /** Format: uuid */
            answerMessageId: string;
            /** @enum {string} */
            status: "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled";
        };
        SearchSuggestions: {
            labels: {
                /** Format: uuid */
                id: string;
                name: string;
            }[];
            titles: {
                /** @enum {string} */
                kind: "note" | "task" | "calendar_event";
                /** Format: uuid */
                id: string;
                title: string;
            }[];
            savedQueries: {
                /** Format: uuid */
                id: string;
                title: string;
                query: string;
            }[];
        };
        ResolvedCitation: {
            source: {
                /** Format: uuid */
                id: string;
                kind: string;
                contentHash: string;
                available: boolean;
            };
            revision: {
                /** Format: uuid */
                noteId: string;
                citedRevision: number;
                currentRevision: number | null;
            };
            anchor: {
                /** Format: uuid */
                chunkId: string;
                startOffset: number;
                endOffset: number;
            };
            exactExcerpt: string;
            currentNoteLink: {
                /** Format: uuid */
                noteId: string;
                title: string;
                path: string;
            } | null;
            historical: boolean;
        };
        Job: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
            /** @enum {string} */
            status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
            /** Format: date-time */
            createdAt: string;
            /** Format: uuid */
            vaultId: string;
            stage: string;
            progress: number | null;
            result: ({
                /** @enum {string} */
                type: "search";
                search: {
                    /** @enum {string} */
                    mode: "lexical" | "hybrid" | "semantic";
                    query: string;
                    items: {
                        /** @enum {string} */
                        kind: "note" | "task" | "calendar_event";
                        /** Format: uuid */
                        id: string;
                        title: string;
                        excerpt: string;
                        score: number;
                        /** Format: uuid */
                        sourceId: string | null;
                        revision: number;
                        /** Format: date-time */
                        updatedAt: string;
                    }[];
                    coverage: {
                        kinds: ("note" | "task" | "calendar_event")[];
                        semanticAvailable: boolean;
                    };
                    nextCursor: string | null;
                };
            } | {
                /** @enum {string} */
                type: "note_processing";
                /** Format: uuid */
                noteId: string;
                processedRevision: number;
                /** @enum {string} */
                classification: "note" | "task" | "event" | "idea" | "reference" | "unknown";
                suggestedTitle: string | null;
            } | {
                /** @enum {string} */
                type: "ai_setup_test";
                completion: boolean;
                structuredOutput: boolean;
                embeddings: boolean;
            } | {
                /** @enum {string} */
                type: "index_rebuild";
                indexedRevisions: number;
            } | {
                /** @enum {string} */
                type: "answer";
                /** Format: uuid */
                chatId: string;
                /** Format: uuid */
                messageId: string;
                answer: string;
                citations: {
                    citationId: string;
                    /** Format: uuid */
                    chunkId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    title: string;
                    startOffset: number;
                    endOffset: number;
                    quote: string;
                }[];
            } | {
                /** @enum {string} */
                type: "schedule_preview";
                /** Format: uuid */
                proposalId: string;
                constraintsRevision: number;
                inputRevisions: {
                    [key: string]: number;
                };
                calendarDigest: string;
                horizon: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                };
                placements: {
                    /** Format: uuid */
                    taskId: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    minutes: number;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unscheduled: {
                    /** Format: uuid */
                    taskId: string;
                    remainingMinutes: number | null;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unknownAvailability: string[];
                /** @enum {string} */
                algorithmVersion: "deterministic-scheduler-v1";
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "proposal_apply";
                /** Format: uuid */
                proposalId: string;
                createdEventIds: string[];
                /** Format: uuid */
                undoManifestId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "provider_calendar_action_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                actionId: string;
                /** @enum {boolean} */
                writesApplied: true;
                /** @enum {boolean} */
                externalDelivery: false;
            } | {
                /** @enum {string} */
                type: "entity_merge_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                targetEntityId: string;
                mergedEntityIds: string[];
                affectedEventIds: string[];
                affectedCommitmentIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "content_proposal_apply";
                /** Format: uuid */
                proposalId: string;
                /** @enum {string} */
                kind: "merge_notes" | "split_note" | "merge_labels" | "bulk_reassign" | "idea_promotion";
                createdRecordIds: string[];
                updatedRecordIds: string[];
                /** Format: uuid */
                applicationId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "url_capture";
                /** Format: uuid */
                captureId: string;
                /** Format: uuid */
                noteId: string;
                /** Format: uri */
                requestedUrl: string;
                /** Format: uri */
                finalUrl: string;
                redirectCount: number;
                byteLength: number;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "artifact_generation";
                /** Format: uuid */
                noteId: string;
                noteRevision: number;
                /** @enum {string} */
                kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
                created: boolean;
                sourceRecordIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "performance_recommendations";
                horizon: {
                    from: string;
                    to: string;
                };
                recommendations: {
                    /** Format: uuid */
                    courseId: string;
                    title: string;
                    rationale: string;
                    factors: {
                        /** @enum {string} */
                        kind: "target" | "assessment" | "knowledge_gap" | "remaining_effort" | "goal";
                        /** Format: uuid */
                        recordId: string | null;
                        summary: string;
                    }[];
                    uncertainty: string;
                    suggestedMinutes: number | null;
                    sourceIds: string[];
                }[];
                coverage: {
                    courseCount: number;
                    assessmentCount: number;
                    gapCount: number;
                    tasksWithKnownEffort: number;
                    tasksWithUnknownEffort: number;
                };
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "task_breakdown_proposal";
                /** Format: uuid */
                taskId: string;
                taskRevision: number;
                steps: {
                    stepId: string;
                    title: string;
                    description: string;
                    dependsOnStepIds: string[];
                    sourceIds: string[];
                    estimatedMinutes: number;
                    /** @enum {string} */
                    estimateOrigin: "model";
                }[];
                maxSessionMinutes: number | null;
                uncertainty: string;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "calendar_policy_dry_run";
                /** Format: uuid */
                policyRuleId: string;
                evaluatedSources: number;
                outcomes: {
                    /** Format: uuid */
                    sourceId: string;
                    /** @enum {string} */
                    outcome: "suggested" | "blocked";
                    reasonCodes: string[];
                }[];
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "study_plan_withdrawal_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                studyPlanId: string;
                trashedEventIds: string[];
                affectedTaskIds: string[];
                /** @enum {boolean} */
                historyDeleted: false;
                /** @enum {boolean} */
                fixedOrExternalEventsDeleted: false;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "commitment_rematch";
                matchedEvents: number;
                createdBindings: number;
                writesApplied: boolean;
            } | {
                /** @enum {string} */
                type: "calendar_context_refresh";
                /** Format: uuid */
                eventId: string;
                eventRevision: number;
                matchedCommitments: number;
                createdPrepItems: number;
                staleContext: boolean;
                writesApplied: boolean;
            } | {
                /** @enum {string} */
                type: "calendar_brief_refresh";
                date: string;
                timezone: string;
                briefRevision: number;
                sourceCount: number;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "calendar_import_preview";
                /** Format: uuid */
                proposalId: string;
                counts: {
                    create: number;
                    createSeries: number;
                    cancel: number;
                    duplicate: number;
                    blocked: number;
                };
                warnings: string[];
                /** @enum {boolean} */
                invitationsSent: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "export_generate";
                /** Format: uuid */
                exportId: string;
                /** @enum {string} */
                format: "markdown_bundle" | "full_fidelity" | "ics";
                byteLength: number;
                sha256: string;
                /** Format: date-time */
                expiresAt: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "domain_tool_run";
                /** @enum {string} */
                toolName: "search_notes" | "get_note_summary";
                output: {
                    [key: string]: unknown;
                };
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "natural_language_command";
                /** @enum {string} */
                intent: "search_notes" | "get_note_summary" | "needs_clarification";
                /** @enum {string|null} */
                toolName: "search_notes" | "get_note_summary" | null;
                output: {
                    [key: string]: unknown;
                } | null;
                clarification: string | null;
                policyRevision: number;
                /** @enum {boolean} */
                writesApplied: false;
                /** @enum {boolean} */
                externalWritesAuthorized: false;
            } | {
                /** @enum {string} */
                type: "transcript_analysis";
                /** Format: uuid */
                transcriptId: string;
                /** Format: uuid */
                artifactId: string;
                sourceRevision: number;
                /** @enum {string} */
                scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_plan_generation";
                /** Format: uuid */
                studyPlanId: string;
                unitCount: number;
                taskIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_exercise_generation";
                exerciseIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_attempt_feedback";
                /** Format: uuid */
                attemptId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "catch_up_plan";
                lessonIds: string[];
                coveredLessons: {
                    /** Format: uuid */
                    lessonId: string;
                    sourceIds: string[];
                    anchorIds: string[];
                    suggestedActions: {
                        /** @enum {string} */
                        kind: "read_source" | "review_notes" | "check_assignment";
                        /** Format: uuid */
                        sourceId: string;
                        label: string;
                        estimatedMinutes: number | null;
                    }[];
                }[];
                uncoveredLessonIds: string[];
                message: string;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "insight_generation";
                /** Format: uuid */
                insightId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "profile_refresh";
                interestIds: string[];
                skippedSparseTopics: string[];
                blockedSensitiveTopics: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "profile_rebuild_proposal";
                policyRevision: number;
                candidates: {
                    /** Format: uuid */
                    interestId: string;
                    label: string;
                    observationCount: number;
                    evidenceItemIds: string[];
                }[];
                skippedSparseTopics: string[];
                blockedSensitiveTopics: string[];
                /** @enum {boolean} */
                ownerLocksPreserved: true;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "import_plan";
                /** Format: uuid */
                importId: string;
                itemCount: number;
                warningCount: number;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "import_apply";
                /** Format: uuid */
                importId: string;
                createdNoteIds: string[];
                skippedItemIds: string[];
                idRemapping: {
                    [key: string]: string;
                };
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "school_import_preview";
                /** @enum {string} */
                detectedFormat: "omega_school_json_v1";
                /** Format: date-time */
                sourceTimestamp: string;
                timezone: string;
                period: {
                    from: string;
                    to: string;
                } | null;
                counts: {
                    [key: string]: number;
                };
                sample: {
                    /** @enum {string} */
                    kind: "subject" | "course" | "lesson" | "assignment" | "assessment" | "material";
                    externalId: string;
                    title: string;
                }[];
                warnings: string[];
                /** @enum {boolean} */
                snapshotOnly: true;
                /** @enum {boolean} */
                liveConnectionCreated: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "social_time_proposal";
                /** Format: uuid */
                personId: string;
                userConstraintsRevision: number;
                window: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                };
                durationEstimate: number;
                candidates: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    /** @enum {string} */
                    ownerAvailability: "free";
                    /** @enum {string} */
                    otherPersonAvailability: "explicitly_shared_free" | "unknown";
                    evidenceConnectionIds: string[];
                }[];
                connectedAvailabilityScope: string[];
                limitations: string[];
                /** @enum {boolean} */
                invitationsSent: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "note_purge";
                targetIdHash: string;
                deletedDerivedRecords: number;
                revokedJobs: number;
                sourceDeleted: boolean;
                blobFilesDeleted: number;
                blobFileDeleteFailures: number;
                /** @enum {boolean} */
                minimalLedgerRetained: true;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "sync_snapshot";
                /** @enum {number} */
                protocolVersion: 1;
                /** Format: uuid */
                snapshotId: string;
                /** Format: uuid */
                requestedForDeviceId: string;
                watermarkCursor: string;
                entries: {
                    /** @enum {string} */
                    recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                    /** Format: uuid */
                    recordId: string;
                    revision: number;
                    /** @enum {string} */
                    changeKind: "upsert" | "tombstone";
                }[];
                entryCount: number;
                /** Format: date-time */
                generatedAt: string;
                /** @enum {boolean} */
                writesApplied: false;
            }) | null;
            error: {
                code: string;
                detail: string;
                retryable: boolean;
            } | null;
            cancelRequested: boolean;
            attempts: number;
            /** Format: date-time */
            updatedAt: string;
        };
        JobHandle: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
            /** @enum {string} */
            status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
            /** Format: date-time */
            createdAt: string;
        };
        JobList: {
            items: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
                /** @enum {string} */
                status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
                /** Format: date-time */
                createdAt: string;
                /** Format: uuid */
                vaultId: string;
                stage: string;
                progress: number | null;
                result: ({
                    /** @enum {string} */
                    type: "search";
                    search: {
                        /** @enum {string} */
                        mode: "lexical" | "hybrid" | "semantic";
                        query: string;
                        items: {
                            /** @enum {string} */
                            kind: "note" | "task" | "calendar_event";
                            /** Format: uuid */
                            id: string;
                            title: string;
                            excerpt: string;
                            score: number;
                            /** Format: uuid */
                            sourceId: string | null;
                            revision: number;
                            /** Format: date-time */
                            updatedAt: string;
                        }[];
                        coverage: {
                            kinds: ("note" | "task" | "calendar_event")[];
                            semanticAvailable: boolean;
                        };
                        nextCursor: string | null;
                    };
                } | {
                    /** @enum {string} */
                    type: "note_processing";
                    /** Format: uuid */
                    noteId: string;
                    processedRevision: number;
                    /** @enum {string} */
                    classification: "note" | "task" | "event" | "idea" | "reference" | "unknown";
                    suggestedTitle: string | null;
                } | {
                    /** @enum {string} */
                    type: "ai_setup_test";
                    completion: boolean;
                    structuredOutput: boolean;
                    embeddings: boolean;
                } | {
                    /** @enum {string} */
                    type: "index_rebuild";
                    indexedRevisions: number;
                } | {
                    /** @enum {string} */
                    type: "answer";
                    /** Format: uuid */
                    chatId: string;
                    /** Format: uuid */
                    messageId: string;
                    answer: string;
                    citations: {
                        citationId: string;
                        /** Format: uuid */
                        chunkId: string;
                        /** Format: uuid */
                        noteId: string;
                        /** Format: uuid */
                        sourceId: string;
                        revision: number;
                        title: string;
                        startOffset: number;
                        endOffset: number;
                        quote: string;
                    }[];
                } | {
                    /** @enum {string} */
                    type: "schedule_preview";
                    /** Format: uuid */
                    proposalId: string;
                    constraintsRevision: number;
                    inputRevisions: {
                        [key: string]: number;
                    };
                    calendarDigest: string;
                    horizon: {
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                    };
                    placements: {
                        /** Format: uuid */
                        taskId: string;
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                        minutes: number;
                        reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                    }[];
                    unscheduled: {
                        /** Format: uuid */
                        taskId: string;
                        remainingMinutes: number | null;
                        reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                    }[];
                    unknownAvailability: string[];
                    /** @enum {string} */
                    algorithmVersion: "deterministic-scheduler-v1";
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "proposal_apply";
                    /** Format: uuid */
                    proposalId: string;
                    createdEventIds: string[];
                    /** Format: uuid */
                    undoManifestId: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "provider_calendar_action_apply";
                    /** Format: uuid */
                    proposalId: string;
                    /** Format: uuid */
                    actionId: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                    /** @enum {boolean} */
                    externalDelivery: false;
                } | {
                    /** @enum {string} */
                    type: "entity_merge_apply";
                    /** Format: uuid */
                    proposalId: string;
                    /** Format: uuid */
                    targetEntityId: string;
                    mergedEntityIds: string[];
                    affectedEventIds: string[];
                    affectedCommitmentIds: string[];
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "content_proposal_apply";
                    /** Format: uuid */
                    proposalId: string;
                    /** @enum {string} */
                    kind: "merge_notes" | "split_note" | "merge_labels" | "bulk_reassign" | "idea_promotion";
                    createdRecordIds: string[];
                    updatedRecordIds: string[];
                    /** Format: uuid */
                    applicationId: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "url_capture";
                    /** Format: uuid */
                    captureId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uri */
                    requestedUrl: string;
                    /** Format: uri */
                    finalUrl: string;
                    redirectCount: number;
                    byteLength: number;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "artifact_generation";
                    /** Format: uuid */
                    noteId: string;
                    noteRevision: number;
                    /** @enum {string} */
                    kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
                    created: boolean;
                    sourceRecordIds: string[];
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "performance_recommendations";
                    horizon: {
                        from: string;
                        to: string;
                    };
                    recommendations: {
                        /** Format: uuid */
                        courseId: string;
                        title: string;
                        rationale: string;
                        factors: {
                            /** @enum {string} */
                            kind: "target" | "assessment" | "knowledge_gap" | "remaining_effort" | "goal";
                            /** Format: uuid */
                            recordId: string | null;
                            summary: string;
                        }[];
                        uncertainty: string;
                        suggestedMinutes: number | null;
                        sourceIds: string[];
                    }[];
                    coverage: {
                        courseCount: number;
                        assessmentCount: number;
                        gapCount: number;
                        tasksWithKnownEffort: number;
                        tasksWithUnknownEffort: number;
                    };
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "task_breakdown_proposal";
                    /** Format: uuid */
                    taskId: string;
                    taskRevision: number;
                    steps: {
                        stepId: string;
                        title: string;
                        description: string;
                        dependsOnStepIds: string[];
                        sourceIds: string[];
                        estimatedMinutes: number;
                        /** @enum {string} */
                        estimateOrigin: "model";
                    }[];
                    maxSessionMinutes: number | null;
                    uncertainty: string;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "calendar_policy_dry_run";
                    /** Format: uuid */
                    policyRuleId: string;
                    evaluatedSources: number;
                    outcomes: {
                        /** Format: uuid */
                        sourceId: string;
                        /** @enum {string} */
                        outcome: "suggested" | "blocked";
                        reasonCodes: string[];
                    }[];
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "study_plan_withdrawal_apply";
                    /** Format: uuid */
                    proposalId: string;
                    /** Format: uuid */
                    studyPlanId: string;
                    trashedEventIds: string[];
                    affectedTaskIds: string[];
                    /** @enum {boolean} */
                    historyDeleted: false;
                    /** @enum {boolean} */
                    fixedOrExternalEventsDeleted: false;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "commitment_rematch";
                    matchedEvents: number;
                    createdBindings: number;
                    writesApplied: boolean;
                } | {
                    /** @enum {string} */
                    type: "calendar_context_refresh";
                    /** Format: uuid */
                    eventId: string;
                    eventRevision: number;
                    matchedCommitments: number;
                    createdPrepItems: number;
                    staleContext: boolean;
                    writesApplied: boolean;
                } | {
                    /** @enum {string} */
                    type: "calendar_brief_refresh";
                    date: string;
                    timezone: string;
                    briefRevision: number;
                    sourceCount: number;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "calendar_import_preview";
                    /** Format: uuid */
                    proposalId: string;
                    counts: {
                        create: number;
                        createSeries: number;
                        cancel: number;
                        duplicate: number;
                        blocked: number;
                    };
                    warnings: string[];
                    /** @enum {boolean} */
                    invitationsSent: false;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "export_generate";
                    /** Format: uuid */
                    exportId: string;
                    /** @enum {string} */
                    format: "markdown_bundle" | "full_fidelity" | "ics";
                    byteLength: number;
                    sha256: string;
                    /** Format: date-time */
                    expiresAt: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "domain_tool_run";
                    /** @enum {string} */
                    toolName: "search_notes" | "get_note_summary";
                    output: {
                        [key: string]: unknown;
                    };
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "natural_language_command";
                    /** @enum {string} */
                    intent: "search_notes" | "get_note_summary" | "needs_clarification";
                    /** @enum {string|null} */
                    toolName: "search_notes" | "get_note_summary" | null;
                    output: {
                        [key: string]: unknown;
                    } | null;
                    clarification: string | null;
                    policyRevision: number;
                    /** @enum {boolean} */
                    writesApplied: false;
                    /** @enum {boolean} */
                    externalWritesAuthorized: false;
                } | {
                    /** @enum {string} */
                    type: "transcript_analysis";
                    /** Format: uuid */
                    transcriptId: string;
                    /** Format: uuid */
                    artifactId: string;
                    sourceRevision: number;
                    /** @enum {string} */
                    scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "study_plan_generation";
                    /** Format: uuid */
                    studyPlanId: string;
                    unitCount: number;
                    taskIds: string[];
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "study_exercise_generation";
                    exerciseIds: string[];
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "study_attempt_feedback";
                    /** Format: uuid */
                    attemptId: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "catch_up_plan";
                    lessonIds: string[];
                    coveredLessons: {
                        /** Format: uuid */
                        lessonId: string;
                        sourceIds: string[];
                        anchorIds: string[];
                        suggestedActions: {
                            /** @enum {string} */
                            kind: "read_source" | "review_notes" | "check_assignment";
                            /** Format: uuid */
                            sourceId: string;
                            label: string;
                            estimatedMinutes: number | null;
                        }[];
                    }[];
                    uncoveredLessonIds: string[];
                    message: string;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "insight_generation";
                    /** Format: uuid */
                    insightId: string;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "profile_refresh";
                    interestIds: string[];
                    skippedSparseTopics: string[];
                    blockedSensitiveTopics: string[];
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "profile_rebuild_proposal";
                    policyRevision: number;
                    candidates: {
                        /** Format: uuid */
                        interestId: string;
                        label: string;
                        observationCount: number;
                        evidenceItemIds: string[];
                    }[];
                    skippedSparseTopics: string[];
                    blockedSensitiveTopics: string[];
                    /** @enum {boolean} */
                    ownerLocksPreserved: true;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "import_plan";
                    /** Format: uuid */
                    importId: string;
                    itemCount: number;
                    warningCount: number;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "import_apply";
                    /** Format: uuid */
                    importId: string;
                    createdNoteIds: string[];
                    skippedItemIds: string[];
                    idRemapping: {
                        [key: string]: string;
                    };
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "school_import_preview";
                    /** @enum {string} */
                    detectedFormat: "omega_school_json_v1";
                    /** Format: date-time */
                    sourceTimestamp: string;
                    timezone: string;
                    period: {
                        from: string;
                        to: string;
                    } | null;
                    counts: {
                        [key: string]: number;
                    };
                    sample: {
                        /** @enum {string} */
                        kind: "subject" | "course" | "lesson" | "assignment" | "assessment" | "material";
                        externalId: string;
                        title: string;
                    }[];
                    warnings: string[];
                    /** @enum {boolean} */
                    snapshotOnly: true;
                    /** @enum {boolean} */
                    liveConnectionCreated: false;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "social_time_proposal";
                    /** Format: uuid */
                    personId: string;
                    userConstraintsRevision: number;
                    window: {
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                    };
                    durationEstimate: number;
                    candidates: {
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                        /** @enum {string} */
                        ownerAvailability: "free";
                        /** @enum {string} */
                        otherPersonAvailability: "explicitly_shared_free" | "unknown";
                        evidenceConnectionIds: string[];
                    }[];
                    connectedAvailabilityScope: string[];
                    limitations: string[];
                    /** @enum {boolean} */
                    invitationsSent: false;
                    /** @enum {boolean} */
                    writesApplied: false;
                } | {
                    /** @enum {string} */
                    type: "note_purge";
                    targetIdHash: string;
                    deletedDerivedRecords: number;
                    revokedJobs: number;
                    sourceDeleted: boolean;
                    blobFilesDeleted: number;
                    blobFileDeleteFailures: number;
                    /** @enum {boolean} */
                    minimalLedgerRetained: true;
                    /** @enum {boolean} */
                    writesApplied: true;
                } | {
                    /** @enum {string} */
                    type: "sync_snapshot";
                    /** @enum {number} */
                    protocolVersion: 1;
                    /** Format: uuid */
                    snapshotId: string;
                    /** Format: uuid */
                    requestedForDeviceId: string;
                    watermarkCursor: string;
                    entries: {
                        /** @enum {string} */
                        recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                        /** Format: uuid */
                        recordId: string;
                        revision: number;
                        /** @enum {string} */
                        changeKind: "upsert" | "tombstone";
                    }[];
                    entryCount: number;
                    /** Format: date-time */
                    generatedAt: string;
                    /** @enum {boolean} */
                    writesApplied: false;
                }) | null;
                error: {
                    code: string;
                    detail: string;
                    retryable: boolean;
                } | null;
                cancelRequested: boolean;
                attempts: number;
                /** Format: date-time */
                updatedAt: string;
            }[];
        };
        JobEvent: {
            /** Format: uuid */
            jobId: string;
            sequence: number;
            /** @enum {string} */
            kind: "accepted" | "status" | "progress" | "completed" | "failed" | "cancelled";
            data: {
                [key: string]: unknown;
            };
            /** Format: date-time */
            createdAt: string;
        };
        SystemJobHandle: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "backup_create" | "backup_verify" | "restore_plan" | "restore_apply" | "deployment_check" | "access_setup_preview" | "vault_purge";
            /** @enum {string} */
            status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
            /** Format: date-time */
            createdAt: string;
        };
        SystemJobList: {
            items: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                kind: "backup_create" | "backup_verify" | "restore_plan" | "restore_apply" | "deployment_check" | "access_setup_preview" | "vault_purge";
                /** @enum {string} */
                status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
                /** Format: date-time */
                createdAt: string;
                stage: string;
                progress: number | null;
                retryable: boolean;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        SystemJob: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "backup_create" | "backup_verify" | "restore_plan" | "restore_apply" | "deployment_check" | "access_setup_preview" | "vault_purge";
            /** @enum {string} */
            status: "queued" | "waiting_for_worker" | "running" | "succeeded" | "failed" | "cancelled" | "superseded";
            /** Format: date-time */
            createdAt: string;
            stage: string;
            progress: number | null;
            retryable: boolean;
            /** Format: date-time */
            updatedAt: string;
            result: ({
                /** @enum {string} */
                type: "backup_created";
                /** Format: uuid */
                backupId: string;
                manifestSha256: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "backup_verified";
                /** Format: uuid */
                backupId: string;
                /** Format: date-time */
                verifiedAt: string;
                complete: boolean;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "restore_planned";
                /** Format: uuid */
                restorePlanId: string;
                compatible: boolean;
                planRevision: number;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "restore_applied";
                /** Format: uuid */
                restorePlanId: string;
                /** @enum {string} */
                mode: "isolated_validation" | "replace_installation";
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "deployment_checked";
                /** @enum {string} */
                profileId: "home-host";
                checks: {
                    /** @enum {string} */
                    kind: "database" | "blob_storage" | "canonical_origin" | "local_ai_endpoint" | "backup_destination";
                    /** @enum {string} */
                    status: "pass" | "fail" | "unknown";
                    detail: string;
                }[];
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "access_setup_planned";
                /** @enum {string} */
                mode: "tailscale_private" | "cloudflare_access";
                /** Format: uri */
                canonicalOriginCandidate: string;
                prerequisites: {
                    /** @enum {string} */
                    kind: "https_origin" | "loopback_service" | "provider_binary" | "owner_configuration";
                    /** @enum {string} */
                    status: "pass" | "fail" | "unknown";
                    detail: string;
                }[];
                reviewedActions: {
                    sequence: number;
                    action: string;
                    ownerConfirmationRequired: boolean;
                }[];
                risks: string[];
                /** @enum {boolean} */
                publicationApplied: false;
                /** @enum {boolean} */
                secretsIncluded: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "vault_purge";
                targetIdHash: string;
                revokedJobs: number;
                blobFilesDeleted: number;
                blobFileDeleteFailures: number;
                /** @enum {boolean} */
                minimalLedgerRetained: true;
                /** @enum {boolean} */
                writesApplied: true;
            }) | null;
            error: {
                code: string;
                detail: string;
                retryable: boolean;
            } | null;
            cancelRequested: boolean;
            attempts: number;
        };
        CreateBackup: {
            /** Format: uuid */
            destinationId: string;
            encryptionProfileId: string;
        };
        BackupSummary: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            destinationId: string;
            encryptionProfileId: string;
            /** @enum {string} */
            state: "queued" | "creating" | "ready" | "verification_failed" | "failed";
            manifestSha256: string | null;
            bundleSha256: string | null;
            byteLength: number | null;
            /** Format: date-time */
            verifiedAt: string | null;
            /** Format: date-time */
            retentionUntil: string | null;
            /** Format: uuid */
            systemJobId: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        BackupList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                destinationId: string;
                encryptionProfileId: string;
                /** @enum {string} */
                state: "queued" | "creating" | "ready" | "verification_failed" | "failed";
                manifestSha256: string | null;
                bundleSha256: string | null;
                byteLength: number | null;
                /** Format: date-time */
                verifiedAt: string | null;
                /** Format: date-time */
                retentionUntil: string | null;
                /** Format: uuid */
                systemJobId: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        BackupManifest: {
            backup: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                destinationId: string;
                encryptionProfileId: string;
                /** @enum {string} */
                state: "queued" | "creating" | "ready" | "verification_failed" | "failed";
                manifestSha256: string | null;
                bundleSha256: string | null;
                byteLength: number | null;
                /** Format: date-time */
                verifiedAt: string | null;
                /** Format: date-time */
                retentionUntil: string | null;
                /** Format: uuid */
                systemJobId: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            };
            /** @enum {string|null} */
            format: "sorta-omega-backup-v2" | null;
            manifest: {
                [key: string]: unknown;
            } | null;
            complete: boolean;
            restorePrerequisites: string[];
            /** @enum {boolean} */
            encrypted: true;
            downloadReady: boolean;
        };
        CreateRestorePlan: {
            /** Format: uuid */
            backupId: string;
            /** @enum {string} */
            targetMode: "isolated_validation" | "replace_installation";
        };
        ApplyRestore: {
            planRevision: number;
            /** @enum {string} */
            destructiveConfirmation: "replace_installation_from_verified_backup";
        };
        HostResourceReport: {
            cpu: {
                model: string;
                logicalProcessors: number;
                physicalCores: number | null;
            };
            memory: {
                totalBytes: number;
                freeBytes: number;
            };
            gpus: {
                name: string;
                driverVersion: string | null;
                adapterRamBytes: number | null;
            }[];
            disks: {
                name: string;
                sizeBytes: number;
                freeBytes: number;
                fileSystem: string | null;
            }[];
            runtime: {
                osPlatform: string;
                osRelease: string;
                architecture: string;
                nodeVersion: string;
                /** @enum {string} */
                localAiBackend: "ollama" | "openai_compatible";
                configuredModel: string;
                endpointOrigin: string;
            };
            probeState: {
                /** @enum {string} */
                windowsHardware: "available" | "unavailable" | "not_applicable";
                limitations: string[];
            };
            /** Format: date-time */
            observedAt: string;
        };
        DeploymentProfile: {
            /** @enum {string} */
            profileId: "home-host";
            /** Format: uri */
            canonicalOrigin: string;
            apiBind: {
                host: string;
                port: number;
            };
            /** @enum {string} */
            accessMode: "local_only" | "private_network" | "public_access_proxy" | "unknown";
            remoteAccessConfigured: boolean;
            /** @enum {string} */
            database: "available" | "unavailable";
            blobStorage: {
                configuredPath: string;
                available: boolean;
            };
            backupDestinationCount: number;
            workerCount: number;
            localAi: {
                /** @enum {string} */
                backend: "ollama" | "openai_compatible";
                model: string;
                endpointOrigin: string;
                liveVerified: boolean;
            };
            diagnostics: string[];
            /** Format: date-time */
            checkedAt: string;
        };
        CheckDeployment: {
            /** @enum {string} */
            profileId: "home-host";
            checkKinds: ("database" | "blob_storage" | "canonical_origin" | "local_ai_endpoint" | "backup_destination")[];
        };
        ResourcePolicy: {
            maxInferenceConcurrency: number;
            backgroundBudget: {
                maxConcurrentJobs: number;
                maxCpuPercent: number;
                maxGpuMemoryPercent: number;
            };
            quietHours: {
                startsAt: string;
                endsAt: string;
                timezone: string;
            } | null;
            pauseBackground: boolean;
            modelProfileIds: string[];
            /** @enum {string} */
            interactivePriority: "preempt_background" | "queue_ahead";
            /** @enum {string} */
            modelResidency: "unload_when_idle" | "keep_active_profiles";
        } & {
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        SetHostResourcePolicy: {
            maxInferenceConcurrency: number;
            backgroundBudget: {
                maxConcurrentJobs: number;
                maxCpuPercent: number;
                maxGpuMemoryPercent: number;
            };
            quietHours: {
                startsAt: string;
                endsAt: string;
                timezone: string;
            } | null;
            pauseBackground: boolean;
            modelProfileIds: string[];
            /** @enum {string} */
            interactivePriority: "preempt_background" | "queue_ahead";
            /** @enum {string} */
            modelResidency: "unload_when_idle" | "keep_active_profiles";
        };
        PreviewRemoteAccessSetup: {
            /** @enum {string} */
            mode: "tailscale_private" | "cloudflare_access";
            ownerConfigReference: string;
            /** Format: uri */
            canonicalOriginCandidate: string;
        };
        ToolDescriptorList: {
            items: {
                /** @enum {string} */
                name: "search_notes" | "get_note_summary";
                /** @enum {string} */
                domain: "notes";
                description: string;
                /** @enum {string} */
                effect: "read";
                /** @enum {string} */
                requiredGrant: "notes:read";
                inputSchema: {
                    [key: string]: unknown;
                };
                outputSchema: {
                    [key: string]: unknown;
                };
                capability: {
                    /** @enum {string} */
                    state: "available";
                    reason: string | null;
                };
            }[];
            /** @enum {unknown|null} */
            nextCursor: "null" | null;
        };
        RunDomainTool: {
            /** @enum {string} */
            toolName: "search_notes";
            input: {
                query: string;
                /** @default 10 */
                limit: number;
            };
            /** @enum {string} */
            mode: "read";
            expectedRevisions?: {
                [key: string]: number;
            };
            /** @enum {unknown|null} */
            approvedProposalId?: "null" | null;
        } | {
            /** @enum {string} */
            toolName: "get_note_summary";
            input: {
                /** Format: uuid */
                noteId: string;
            };
            /** @enum {string} */
            mode: "read";
            expectedRevisions?: {
                [key: string]: number;
            };
            /** @enum {unknown|null} */
            approvedProposalId?: "null" | null;
        };
        ToolPolicySet: {
            /** Format: uuid */
            vaultId: string;
            policies: {
                /** @enum {string} */
                toolName: "search_notes" | "get_note_summary";
                enabled: boolean;
                scope: {
                    /** @enum {string} */
                    kind: "vault" | "selected_notes";
                    noteIds: string[];
                };
                /** @enum {string} */
                confirmation: "none" | "always_review";
                quota: {
                    maxRunsPerHour: number;
                    maxResultBytes: number;
                };
            }[];
            /** @enum {string} */
            policyVersion: "tool-policy-v1";
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
            invariants: {
                /** @enum {boolean} */
                unrestrictedShell: false;
                /** @enum {boolean} */
                unrestrictedFilesystem: false;
                /** @enum {boolean} */
                unrestrictedNetwork: false;
                /** @enum {boolean} */
                externalAndDestructiveAlwaysReviewed: true;
            };
        };
        SetToolPolicies: {
            policies: {
                /** @enum {string} */
                toolName: "search_notes" | "get_note_summary";
                enabled: boolean;
                scope: {
                    /** @enum {string} */
                    kind: "vault" | "selected_notes";
                    noteIds: string[];
                };
                /** @enum {string} */
                confirmation: "none" | "always_review";
                quota: {
                    maxRunsPerHour: number;
                    maxResultBytes: number;
                };
            }[];
        };
        ExecuteNaturalLanguageCommand: {
            text: string;
            sourceScope: {
                noteIds: string[];
            };
            /** @default [] */
            contextIds: string[];
            clientOperationId: string;
        };
        SourceObjectList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                connectionId: string;
                providerObjectId: string;
                containerId: string | null;
                kind: string;
                title: string;
                /** @enum {string} */
                accessState: "available" | "denied" | "unavailable" | "excluded" | "deleted";
                /** @enum {string} */
                freshness: "current" | "stale" | "unverified" | "tombstoned";
                currentRevision: number;
                /** Format: uri */
                deepLink: string | null;
                excluded: boolean;
                exclusionReason: string | null;
                /** Format: date-time */
                lastAttemptAt: string | null;
                /** Format: date-time */
                lastSuccessAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        SourceObjectDetail: {
            source: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                connectionId: string;
                providerObjectId: string;
                containerId: string | null;
                kind: string;
                title: string;
                /** @enum {string} */
                accessState: "available" | "denied" | "unavailable" | "excluded" | "deleted";
                /** @enum {string} */
                freshness: "current" | "stale" | "unverified" | "tombstoned";
                currentRevision: number;
                /** Format: uri */
                deepLink: string | null;
                excluded: boolean;
                exclusionReason: string | null;
                /** Format: date-time */
                lastAttemptAt: string | null;
                /** Format: date-time */
                lastSuccessAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            };
            selectedRevision: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                sourceObjectId: string;
                revision: number;
                contentHash: string;
                exactContent: string | null;
                metadata: {
                    [key: string]: unknown;
                };
                attachmentBlobIds: string[];
                /** Format: date-time */
                fetchedAt: string;
            };
            current: boolean;
            historical: boolean;
        };
        RefreshSourceObject: {
            expectedRevision?: number;
        };
        SourceExclusionInput: {
            excluded: boolean;
            reason: string;
        };
        SourceExclusion: {
            /** Format: uuid */
            sourceObjectId: string;
            excluded: boolean;
            reason: string;
            revision: number;
            derivedIndexInvalidated: boolean;
            /** Format: date-time */
            updatedAt: string;
        };
        Transcript: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            sourceObject: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                connectionId: string;
                providerObjectId: string;
                containerId: string | null;
                kind: string;
                title: string;
                /** @enum {string} */
                accessState: "available" | "denied" | "unavailable" | "excluded" | "deleted";
                /** @enum {string} */
                freshness: "current" | "stale" | "unverified" | "tombstoned";
                currentRevision: number;
                /** Format: uri */
                deepLink: string | null;
                excluded: boolean;
                exclusionReason: string | null;
                /** Format: date-time */
                lastAttemptAt: string | null;
                /** Format: date-time */
                lastSuccessAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            };
            /** Format: uuid */
            sourceRevisionId: string;
            revision: number;
            originalBlobIds: string[];
            segments: {
                id: string;
                startMs: number;
                endMs: number;
                text: string;
                speaker: {
                    id: string | null;
                    label: string;
                    /** @enum {string} */
                    status: "unknown" | "machine_suggested" | "owner_confirmed";
                };
            }[];
            exactText: string;
            association: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                transcriptId: string;
                /** Format: uuid */
                lessonId: string;
                transcriptRevision: number;
                evidenceRefs: string[];
                /** @enum {string} */
                origin: "owner";
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | null;
            correctionOfRevision: number | null;
            analysisArtifacts: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                sourceRevision: number;
                /** Format: date-time */
                createdAt: string;
            }[];
            /** Format: date-time */
            createdAt: string;
        };
        TranscriptList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                sourceObject: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    /** Format: uuid */
                    connectionId: string;
                    providerObjectId: string;
                    containerId: string | null;
                    kind: string;
                    title: string;
                    /** @enum {string} */
                    accessState: "available" | "denied" | "unavailable" | "excluded" | "deleted";
                    /** @enum {string} */
                    freshness: "current" | "stale" | "unverified" | "tombstoned";
                    currentRevision: number;
                    /** Format: uri */
                    deepLink: string | null;
                    excluded: boolean;
                    exclusionReason: string | null;
                    /** Format: date-time */
                    lastAttemptAt: string | null;
                    /** Format: date-time */
                    lastSuccessAt: string | null;
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                };
                /** Format: uuid */
                sourceRevisionId: string;
                revision: number;
                originalBlobIds: string[];
                segments: {
                    id: string;
                    startMs: number;
                    endMs: number;
                    text: string;
                    speaker: {
                        id: string | null;
                        label: string;
                        /** @enum {string} */
                        status: "unknown" | "machine_suggested" | "owner_confirmed";
                    };
                }[];
                exactText: string;
                association: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    transcriptId: string;
                    /** Format: uuid */
                    lessonId: string;
                    transcriptRevision: number;
                    evidenceRefs: string[];
                    /** @enum {string} */
                    origin: "owner";
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                } | null;
                correctionOfRevision: number | null;
                analysisArtifacts: {
                    /** Format: uuid */
                    id: string;
                    /** @enum {string} */
                    scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                    sourceRevision: number;
                    /** Format: date-time */
                    createdAt: string;
                }[];
                /** Format: date-time */
                createdAt: string;
            }[];
            nextCursor: string | null;
        };
        TranscriptAssociation: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            transcriptId: string;
            /** Format: uuid */
            lessonId: string;
            transcriptRevision: number;
            evidenceRefs: string[];
            /** @enum {string} */
            origin: "owner";
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CorrectTranscript: {
            /** @default [] */
            segmentEdits: {
                segmentId: string;
                text: string;
            }[];
            /** @default [] */
            speakerLabelCorrections: {
                segmentId: string;
                speakerId: string | null;
                label: string;
                /** @enum {string} */
                status: "owner_confirmed";
            }[];
            expectedRevision: number;
        };
        AssociateTranscript: {
            /** Format: uuid */
            lessonId: string;
            /** @default [] */
            evidenceRefs: string[];
            expectedRevision: number;
        };
        AnalyzeTranscript: {
            /** @enum {string} */
            scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
            expectedRevision: number;
        };
        SchoolOverview: {
            window: {
                /** Format: date-time */
                from: string;
                /** Format: date-time */
                to: string;
            };
            subjects: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                code: string | null;
                academicPeriod: string | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            courses: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                subjectId: string;
                name: string;
                academicPeriod: string | null;
                teacherEntityIds: string[];
                classEntityIds: string[];
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            lessons: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                calendarEventId: string | null;
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    timezone: string;
                };
                room: string | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            assignments: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                title: string;
                instructionsSourceIds: string[];
                due: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialSourceIds: string[];
                taskIds: string[];
                /** @enum {string} */
                preparationStatus: "not_started" | "in_progress" | "prepared";
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            assessments: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                title: string;
                /** @enum {string} */
                kind: "exam" | "test" | "quiz" | "presentation" | "project" | "other";
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialScope: {
                    description: string | null;
                    sourceIds: string[];
                } | null;
                officialWeight: number | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            materials: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                connectionId: string;
                providerObjectId: string;
                containerId: string | null;
                kind: string;
                title: string;
                /** @enum {string} */
                accessState: "available" | "denied" | "unavailable" | "excluded" | "deleted";
                /** @enum {string} */
                freshness: "current" | "stale" | "unverified" | "tombstoned";
                currentRevision: number;
                /** Format: uri */
                deepLink: string | null;
                excluded: boolean;
                exclusionReason: string | null;
                /** Format: date-time */
                lastAttemptAt: string | null;
                /** Format: date-time */
                lastSuccessAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            studyLinks: {
                activePlanIds: string[];
                sessionIds: string[];
            };
            sensitiveData: {
                attendance: {
                    recordCount: number;
                    /** @enum {string} */
                    coverage: "explicit_opt_in";
                } | null;
                grades: {
                    recordCount: number;
                    /** @enum {string} */
                    coverage: "explicit_opt_in";
                } | null;
                reason: string;
            };
            coverage: {
                /** Format: uuid */
                connectionId: string;
                /** @enum {string} */
                state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
                /** Format: date-time */
                lastSuccessAt: string | null;
                freshness: {
                    current: number;
                    stale: number;
                    unverified: number;
                    tombstoned: number;
                };
                limitations: string[];
            }[];
            /** Format: date-time */
            generatedAt: string;
        };
        PreviewSchoolImport: {
            /** Format: uuid */
            attachmentId: string;
            /** @enum {string} */
            format: "auto" | "omega_school_json_v1";
            /** @default null */
            mapping: {
                [key: string]: "subject" | "course" | "lesson" | "assignment" | "assessment" | "material";
            } | null;
            /** Format: date-time */
            sourceTimestamp: string;
            timezone: string;
            /** @default null */
            period: {
                from: string;
                to: string;
            } | null;
        };
        AiStatus: {
            /** @enum {string} */
            state: "worker_offline" | "model_missing" | "busy" | "available" | "error";
            workers: {
                id: string;
                /** @enum {string} */
                backend: "ollama" | "openai_compatible" | "mixed";
                /** @enum {string} */
                state: "worker_offline" | "model_missing" | "busy" | "available" | "error";
                detail: string | null;
            }[];
            capabilities: {
                generate: boolean;
                chat: boolean;
                embed: boolean;
                extract: boolean;
                classify: boolean;
            };
            availableModels: string[];
            queuedJobs: number;
            /** @enum {boolean} */
            cloudFallbackEnabled: false;
        };
        VaultAiPolicy: {
            /** Format: uuid */
            vaultId: string;
            local: {
                enabled: boolean;
                profileId: string;
                /** @enum {string} */
                backend: "local_worker";
            };
            cloud: {
                enabled: boolean;
                /** Format: uuid */
                providerConnectionId: string | null;
            };
            purposes: ("note_classification" | "grounded_qa" | "study_generation" | "search" | "calendar_assistance" | "profile_analysis")[];
            limits: {
                maxSourceBytesPerRequest: number;
                maxRequestsPerDay: number;
            };
            disclosure: {
                cloudContentEgressEnabled: boolean;
                statement: string;
            };
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        AiDisclosurePreviewInput: {
            /** Format: uuid */
            providerConnectionId: string;
            /** @enum {string} */
            purpose: "note_classification" | "grounded_qa" | "study_generation" | "search" | "calendar_assistance" | "profile_analysis";
            scope: {
                kinds: ("note" | "task" | "calendar_event" | "school" | "profile")[];
                /** @default [] */
                sourceIds: string[];
            };
            limits: {
                maxSourceBytesPerRequest: number;
                maxRequestsPerDay: number;
            };
        };
        AiDisclosurePreview: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            providerConnectionId: string;
            provider: string;
            /** @enum {string} */
            purpose: "note_classification" | "grounded_qa" | "study_generation" | "search" | "calendar_assistance" | "profile_analysis";
            scope: {
                kinds: ("note" | "task" | "calendar_event" | "school" | "profile")[];
                /** @default [] */
                sourceIds: string[];
            };
            limits: {
                maxSourceBytesPerRequest: number;
                maxRequestsPerDay: number;
            };
            boundary: {
                /** @enum {boolean} */
                contentLeavesVault: true;
                fields: string[];
                excludedCategories: string[];
                providerReceives: string;
                /** @enum {boolean} */
                noContentSentDuringPreview: true;
            };
            /** Format: date-time */
            expiresAt: string;
            /** Format: date-time */
            createdAt: string;
        };
        SetVaultAiPolicy: {
            policy: {
                local: {
                    enabled: boolean;
                    profileId: string;
                    /** @enum {string} */
                    backend: "local_worker";
                };
                cloud: {
                    enabled: boolean;
                    /** Format: uuid */
                    providerConnectionId: string | null;
                };
                purposes: ("note_classification" | "grounded_qa" | "study_generation" | "search" | "calendar_assistance" | "profile_analysis")[];
                limits: {
                    maxSourceBytesPerRequest: number;
                    maxRequestsPerDay: number;
                };
                disclosure: {
                    cloudContentEgressEnabled: boolean;
                    statement: string;
                };
            };
            expectedRevision: number;
            /** Format: uuid */
            disclosurePreviewId?: string | null;
            /** @enum {boolean} */
            explicitConsent?: true;
        };
        AiTestRequest: {
            workerId: string;
            modelProfileId: string;
        };
        AiOperation: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            noteId: string | null;
            /** Format: uuid */
            jobId: string;
            /** @enum {string} */
            kind: "classification";
            sourceRevision: number;
            modelProfileId: string;
            modelDigest: string | null;
            promptVersion: string;
            result: {
                [key: string]: unknown;
            };
            inverse: {
                [key: string]: unknown;
            };
            applied: boolean;
            effectOrganizationRevision: number | null;
            /** Format: date-time */
            undoneAt: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        AiOperationList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                noteId: string | null;
                /** Format: uuid */
                jobId: string;
                /** @enum {string} */
                kind: "classification";
                sourceRevision: number;
                modelProfileId: string;
                modelDigest: string | null;
                promptVersion: string;
                result: {
                    [key: string]: unknown;
                };
                inverse: {
                    [key: string]: unknown;
                };
                applied: boolean;
                effectOrganizationRevision: number | null;
                /** Format: date-time */
                undoneAt: string | null;
                /** Format: date-time */
                createdAt: string;
            }[];
        };
        UndoAiOperation: {
            expectedCurrentRevision: number;
        };
        UndoReceipt: {
            /** Format: uuid */
            operationId: string;
            /** Format: uuid */
            noteId: string;
            restoredClassification: string | null;
            removedRuleLabels: number;
            organizationRevision: number;
            /** Format: date-time */
            undoneAt: string;
        };
        ActivityEventList: {
            items: {
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                noteId: string | null;
                /** @enum {string} */
                kind: "note_revision" | "classification_correction" | "ai_operation" | "ai_undo" | "relationship_created" | "routing_rule_created";
                /** @enum {string} */
                actor: "owner" | "system" | "model";
                /** @enum {string} */
                objectType: "note" | "relationship" | "routing_rule" | "ai_operation";
                /** Format: uuid */
                objectId: string;
                summary: string;
                metadata: {
                    [key: string]: unknown;
                };
                /** Format: date-time */
                createdAt: string;
            }[];
            nextCursor: string | null;
        };
        SchoolSubject: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            name: string;
            code: string | null;
            academicPeriod: string | null;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SchoolSubjectList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                name: string;
                code: string | null;
                academicPeriod: string | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateSchoolSubject: {
            name: string;
            code?: string | null;
            academicPeriod?: string | null;
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateSchoolSubject: {
            expectedRevision: number;
            patch: {
                name?: string;
                code?: string | null;
                academicPeriod?: string | null;
                sourceAnchorIds?: string[];
            };
        };
        SchoolCourse: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            subjectId: string;
            name: string;
            academicPeriod: string | null;
            teacherEntityIds: string[];
            classEntityIds: string[];
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SchoolCourseList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                subjectId: string;
                name: string;
                academicPeriod: string | null;
                teacherEntityIds: string[];
                classEntityIds: string[];
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        TeacherViewList: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                /** @enum {string} */
                role: "teacher";
                aliases: {
                    alias: string;
                    /** @enum {string} */
                    scope: "all" | "event_matching" | "search_only";
                }[];
                courseIds: string[];
                sourceAnchorIds: string[];
                revision: number;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        SchoolReadinessReport: {
            /** Format: uuid */
            connectionId: string;
            /** @enum {string} */
            provider: "microsoft" | "google_calendar" | "visma_inschool" | "youtube" | "spotify" | "tiktok" | "instagram" | "reddit" | "discord" | "maxun" | "firecrawl" | "anakin_oss" | "meetily";
            /** @enum {string} */
            state: "disconnected" | "authentication_required" | "admin_approval_required" | "needs_provider_configuration" | "connected" | "rate_limited" | "syncing" | "degraded" | "error" | "unsupported" | "import_only";
            route: {
                /** @enum {string} */
                kind: "live_adapter" | "import_snapshot" | "unsupported";
                approved: boolean;
                registeredReturnTargetRequired: boolean;
            };
            consent: {
                credentialConfigured: boolean;
                resourceSelectionRecorded: boolean;
            };
            capabilityTests: {
                key: string;
                /** @enum {string} */
                mode: "live_read" | "live_write" | "import_only" | "unsupported" | "unverified";
                enabled: boolean;
                /** Format: date-time */
                verifiedAt: string | null;
                passed: boolean;
                limitation: string | null;
            }[];
            readyForLiveSync: boolean;
            snapshotOnly: boolean;
            /** Format: date-time */
            lastSuccessAt: string | null;
            limitations: string[];
        };
        CreateSchoolCourse: {
            name: string;
            /** Format: uuid */
            subjectId: string;
            academicPeriod?: string | null;
            /** @default [] */
            teacherEntityIds: string[];
            /** @default [] */
            classEntityIds: string[];
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateSchoolCourse: {
            expectedRevision: number;
            patch: {
                name?: string;
                /** Format: uuid */
                subjectId?: string;
                academicPeriod?: string | null;
                teacherEntityIds?: string[];
                classEntityIds?: string[];
                sourceAnchorIds?: string[];
            };
        };
        CourseMaterialLink: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            sourceId: string;
            /** Format: uuid */
            revisionId: string;
            chapter: string | null;
            /** Format: uuid */
            lessonId: string | null;
            /** @enum {string} */
            mappingOrigin: "owner" | "provider" | "import" | "inferred";
            evidenceAnchorIds: string[];
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        CourseMaterialLinkList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                sourceId: string;
                /** Format: uuid */
                revisionId: string;
                chapter: string | null;
                /** Format: uuid */
                lessonId: string | null;
                /** @enum {string} */
                mappingOrigin: "owner" | "provider" | "import" | "inferred";
                evidenceAnchorIds: string[];
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        LinkCourseMaterial: {
            /** Format: uuid */
            sourceId: string;
            /** Format: uuid */
            revisionId?: string;
            /** @default null */
            chapter: string | null;
            /**
             * Format: uuid
             * @default null
             */
            lessonId: string | null;
            /** @enum {string} */
            mappingOrigin: "owner" | "provider" | "import" | "inferred";
            /** @default [] */
            evidenceAnchorIds: string[];
        };
        ArchiveSchoolAssignmentOverlay: {
            /** @default null */
            reason: string | null;
        };
        SchoolAssignment: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            title: string;
            instructionsSourceIds: string[];
            due: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            materialSourceIds: string[];
            taskIds: string[];
            /** @enum {string} */
            preparationStatus: "not_started" | "in_progress" | "prepared";
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SchoolAssignmentList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                title: string;
                instructionsSourceIds: string[];
                due: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialSourceIds: string[];
                taskIds: string[];
                /** @enum {string} */
                preparationStatus: "not_started" | "in_progress" | "prepared";
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateSchoolAssignment: {
            /** Format: uuid */
            courseId: string;
            title: string;
            /** @default [] */
            instructionsSourceIds: string[];
            /**
             * @default {
             *       "kind": "unknown"
             *     }
             */
            due: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            /** @default [] */
            materialSourceIds: string[];
            /** @default [] */
            taskIds: string[];
        };
        UpdateSchoolAssignment: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                courseId?: string;
                title?: string;
                instructionsSourceIds?: string[];
                due?: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialSourceIds?: string[];
                taskIds?: string[];
                /** @enum {string} */
                preparationStatus?: "not_started" | "in_progress" | "prepared";
            };
        };
        SchoolLesson: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            calendarEventId: string | null;
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                timezone: string;
            };
            room: string | null;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SchoolLessonList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                calendarEventId: string | null;
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    timezone: string;
                };
                room: string | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateSchoolLesson: {
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            calendarEventId?: string | null;
            /**
             * @default {
             *       "kind": "unknown"
             *     }
             */
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                timezone: string;
            };
            room?: string | null;
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateSchoolLesson: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                courseId?: string;
                /** Format: uuid */
                calendarEventId?: string | null;
                timeSpec?: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    timezone: string;
                };
                room?: string | null;
                sourceAnchorIds?: string[];
            };
        };
        SchoolAssessment: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            title: string;
            /** @enum {string} */
            kind: "exam" | "test" | "quiz" | "presentation" | "project" | "other";
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            materialScope: {
                description: string | null;
                sourceIds: string[];
            } | null;
            officialWeight: number | null;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        SchoolAssessmentList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                title: string;
                /** @enum {string} */
                kind: "exam" | "test" | "quiz" | "presentation" | "project" | "other";
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialScope: {
                    description: string | null;
                    sourceIds: string[];
                } | null;
                officialWeight: number | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateSchoolAssessment: {
            /** Format: uuid */
            courseId: string;
            title: string;
            /** @enum {string} */
            kind: "exam" | "test" | "quiz" | "presentation" | "project" | "other";
            /**
             * @default {
             *       "kind": "unknown"
             *     }
             */
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            /** @default null */
            materialScope: {
                description: string | null;
                sourceIds: string[];
            } | null;
            /** @default null */
            officialWeight: number | null;
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateSchoolAssessment: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                courseId?: string;
                title?: string;
                /** @enum {string} */
                kind?: "exam" | "test" | "quiz" | "presentation" | "project" | "other";
                timeSpec?: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialScope?: {
                    description: string | null;
                    sourceIds: string[];
                } | null;
                officialWeight?: number | null;
                sourceAnchorIds?: string[];
            };
        };
        AttendanceRecord: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            lessonId: string | null;
            date: string;
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            rawStatus: string;
            /** @enum {string} */
            normalizedStatus: "present" | "absent" | "late" | "unknown";
            /** @enum {string} */
            excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable";
            duration: number | null;
            /** @enum {string|null} */
            units: "minutes" | "lessons" | "source_defined" | null;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AttendanceRecordList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                lessonId: string | null;
                date: string;
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                rawStatus: string;
                /** @enum {string} */
                normalizedStatus: "present" | "absent" | "late" | "unknown";
                /** @enum {string} */
                excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable";
                duration: number | null;
                /** @enum {string|null} */
                units: "minutes" | "lessons" | "source_defined" | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateAttendanceRecord: {
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            lessonId?: string | null;
            date: string;
            /**
             * @default {
             *       "kind": "unknown"
             *     }
             */
            timeSpec: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            rawStatus: string;
            /** @enum {string} */
            normalizedStatus: "present" | "absent" | "late" | "unknown";
            /**
             * @default unknown
             * @enum {string}
             */
            excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable";
            /** @default null */
            duration: number | null;
            /**
             * @default null
             * @enum {string|null}
             */
            units: "minutes" | "lessons" | "source_defined" | null;
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdateAttendanceRecord: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                courseId?: string;
                /** Format: uuid */
                lessonId?: string | null;
                date?: string;
                /**
                 * @default {
                 *       "kind": "unknown"
                 *     }
                 */
                timeSpec: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                rawStatus?: string;
                /** @enum {string} */
                normalizedStatus?: "present" | "absent" | "late" | "unknown";
                /**
                 * @default unknown
                 * @enum {string}
                 */
                excusalStatus: "excused" | "unexcused" | "unknown" | "not_applicable";
                /** @default null */
                duration: number | null;
                /**
                 * @default null
                 * @enum {string|null}
                 */
                units: "minutes" | "lessons" | "source_defined" | null;
                /** @default [] */
                sourceAnchorIds: string[];
            };
        };
        AttendanceSummary: {
            from: string;
            to: string;
            /** @enum {string} */
            aggregation: "minutes" | "lessons" | "source_defined";
            counts: {
                [key: string]: number;
            };
            denominator: number;
            /** @enum {string} */
            units: "minutes" | "lessons" | "source_defined";
            coverage: {
                recordCount: number;
                knownCount: number;
                unknownCount: number;
            };
            excludedUnknowns: number;
            sourceAnchorIds: string[];
        };
        CreateCatchUpPlan: {
            lessonIds: string[];
            /** @default [] */
            authorizedSourceIds: string[];
            /**
             * @default unknown_unless_explicit
             * @enum {string}
             */
            estimatePolicy: "unknown_unless_explicit" | "bounded_default";
            expectedLessonRevisions: {
                [key: string]: number;
            };
        };
        PreviewAttendanceCatchUp: {
            attendanceRecordIds: string[];
            /** @default null */
            materialScope: {
                sourceIds: string[];
            } | null;
            /**
             * @default {
             *       "estimatePolicy": "unknown_unless_explicit"
             *     }
             */
            constraints: {
                /**
                 * @default unknown_unless_explicit
                 * @enum {string}
                 */
                estimatePolicy: "unknown_unless_explicit" | "bounded_default";
            };
            expectedRevisions: {
                [key: string]: number;
            };
        };
        CatchUpPlanResult: {
            /** @enum {string} */
            type: "catch_up_plan";
            lessonIds: string[];
            coveredLessons: {
                /** Format: uuid */
                lessonId: string;
                sourceIds: string[];
                anchorIds: string[];
                suggestedActions: {
                    /** @enum {string} */
                    kind: "read_source" | "review_notes" | "check_assignment";
                    /** Format: uuid */
                    sourceId: string;
                    label: string;
                    estimatedMinutes: number | null;
                }[];
            }[];
            uncoveredLessonIds: string[];
            message: string;
            /** @enum {boolean} */
            writesApplied: false;
        };
        PerformanceGrade: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            assessmentId: string | null;
            gradeValue: string;
            gradeScale: string;
            date: string;
            officialWeight: number | null;
            sourceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner" | "provider";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PerformanceGradeList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                assessmentId: string | null;
                gradeValue: string;
                gradeScale: string;
                date: string;
                officialWeight: number | null;
                sourceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner" | "provider";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreatePerformanceGrade: {
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            assessmentId?: string | null;
            gradeValue: string;
            gradeScale: string;
            date: string;
            /** @default null */
            officialWeight: number | null;
            /** @default [] */
            sourceAnchorIds: string[];
        };
        UpdatePerformanceGrade: {
            expectedRevision: number;
            patch: {
                /** Format: uuid */
                courseId?: string;
                /** Format: uuid */
                assessmentId?: string | null;
                gradeValue?: string;
                gradeScale?: string;
                date?: string;
                /** @default null */
                officialWeight: number | null;
                /** @default [] */
                sourceAnchorIds: string[];
            };
        };
        GradeRecord: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            assessmentId: string | null;
            rawGrade: string;
            scale: string;
            date: string;
            /** @enum {string} */
            officialOrManual: "official" | "manual";
            weight: number | null;
            sourceAnchorIds: string[];
            /** Format: uuid */
            feedbackSourceId: string | null;
            /** @enum {string} */
            origin: "owner" | "provider";
            sourceOwned: boolean;
            /** Format: date-time */
            archivedAt: string | null;
            archiveReason: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        GradeRecordList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                assessmentId: string | null;
                rawGrade: string;
                scale: string;
                date: string;
                /** @enum {string} */
                officialOrManual: "official" | "manual";
                weight: number | null;
                sourceAnchorIds: string[];
                /** Format: uuid */
                feedbackSourceId: string | null;
                /** @enum {string} */
                origin: "owner" | "provider";
                sourceOwned: boolean;
                /** Format: date-time */
                archivedAt: string | null;
                archiveReason: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateGradeRecord: {
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            assessmentId?: string | null;
            rawGrade: string;
            scale: string;
            date: string;
            /** @enum {string} */
            officialOrManual: "official" | "manual";
            /** @default null */
            weight: number | null;
            /** @default [] */
            sourceAnchorIds: string[];
            /**
             * Format: uuid
             * @default null
             */
            feedbackSourceId: string | null;
        };
        UpdateGradeRecord: {
            /** Format: uuid */
            courseId?: string;
            /** Format: uuid */
            assessmentId?: string | null;
            rawGrade?: string;
            scale?: string;
            date?: string;
            /** @enum {string} */
            officialOrManual?: "official" | "manual";
            /** @default null */
            weight: number | null;
            /** @default [] */
            sourceAnchorIds: string[];
            /**
             * Format: uuid
             * @default null
             */
            feedbackSourceId: string | null;
        };
        ArchiveGradeRecord: {
            /** @default null */
            reason: string | null;
        };
        PerformanceTarget: {
            /** Format: uuid */
            courseId: string;
            /** Format: uuid */
            vaultId: string;
            targetValue: string;
            scale: string;
            effectivePeriod: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PerformanceTargetList: {
            items: {
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                vaultId: string;
                targetValue: string;
                scale: string;
                effectivePeriod: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        SetPerformanceTarget: {
            targetValue: string;
            scale: string;
            effectivePeriod?: string | null;
            expectedRevision: number;
        };
        PerformanceSummary: {
            /** Format: uuid */
            courseId: string | null;
            from: string | null;
            to: string | null;
            /** @enum {string} */
            formulaId: "descriptive-v1";
            gradeCount: number;
            groups: {
                scale: string;
                count: number;
                observedValues: string[];
                knownWeightTotal: number;
                weightedNumericMean: number | null;
            }[];
            target: {
                /** Format: uuid */
                courseId: string;
                /** Format: uuid */
                vaultId: string;
                targetValue: string;
                scale: string;
                effectivePeriod: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | null;
            disclaimer: string;
        };
        GeneratePerformanceRecommendations: {
            /** @default [] */
            courseIds: string[];
            horizon: {
                from: string;
                to: string;
            };
            /**
             * @default {
             *       "sourceIds": []
             *     }
             */
            sourceScope: {
                /** @default [] */
                sourceIds: string[];
            };
            /** @default [] */
            goalIds: string[];
        };
        ProposeTaskBreakdown: {
            sourceScope: {
                sourceIds: string[];
            };
            /** @default null */
            maxSessionMinutes: number | null;
            /** @default null */
            remainingWork: {
                minutes?: number;
                description?: string;
            } | null;
        };
        StudyPlan: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string | null;
            /** Format: uuid */
            assessmentId: string | null;
            /** Format: uuid */
            generationJobId: string | null;
            /** @enum {string} */
            status: "generating" | "draft" | "active" | "completed" | "generation_failed";
            goals: string[];
            deadline: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            materialSourceIds: string[];
            materialSnapshots: {
                /** Format: uuid */
                sourceId: string;
                contentHash: string;
            }[];
            taskIds: string[];
            scheduleProposalIds: string[];
            scheduledBlockIds: string[];
            constraints: {
                dailyLimitMinutes?: number;
                breakMinutes?: number;
                minBlockMinutes?: number;
                maxBlockMinutes?: number;
                allowSplit?: boolean;
            };
            units: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                planId: string;
                sequence: number;
                title: string;
                objective: string;
                /** @enum {string} */
                kind: "read" | "explain" | "practice" | "recall" | "review";
                materialSourceIds: string[];
                estimatedMinutes: number;
                /** @enum {string} */
                estimateOrigin: "owner" | "model";
                /** Format: uuid */
                taskId: string | null;
                /** @enum {string} */
                status: "planned" | "in_progress" | "completed" | "skipped";
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            progress: {
                completedUnits: number;
                totalUnits: number;
                completedMinutes: number;
                totalMinutes: number;
            };
            staleSourceIds: string[];
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudyPlanList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                assessmentId: string | null;
                /** Format: uuid */
                generationJobId: string | null;
                /** @enum {string} */
                status: "generating" | "draft" | "active" | "completed" | "generation_failed";
                goals: string[];
                deadline: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                materialSourceIds: string[];
                materialSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                taskIds: string[];
                scheduleProposalIds: string[];
                scheduledBlockIds: string[];
                constraints: {
                    dailyLimitMinutes?: number;
                    breakMinutes?: number;
                    minBlockMinutes?: number;
                    maxBlockMinutes?: number;
                    allowSplit?: boolean;
                };
                units: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    planId: string;
                    sequence: number;
                    title: string;
                    objective: string;
                    /** @enum {string} */
                    kind: "read" | "explain" | "practice" | "recall" | "review";
                    materialSourceIds: string[];
                    estimatedMinutes: number;
                    /** @enum {string} */
                    estimateOrigin: "owner" | "model";
                    /** Format: uuid */
                    taskId: string | null;
                    /** @enum {string} */
                    status: "planned" | "in_progress" | "completed" | "skipped";
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                }[];
                progress: {
                    completedUnits: number;
                    totalUnits: number;
                    completedMinutes: number;
                    totalMinutes: number;
                };
                staleSourceIds: string[];
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateStudyPlan: {
            materialSourceIds: string[];
            /** Format: uuid */
            courseId?: string | null;
            /** Format: uuid */
            assessmentId?: string | null;
            /** @default [] */
            taskIds: string[];
            /**
             * @default {
             *       "kind": "unknown"
             *     }
             */
            deadline: {
                /** @enum {string} */
                kind: "unknown";
            } | {
                /** @enum {string} */
                kind: "date_only";
                date: string;
                timezone: string;
            } | {
                /** @enum {string} */
                kind: "exact";
                /** Format: date-time */
                dueAt: string;
                timezone: string;
            };
            /** @default [] */
            goals: string[];
            /** @default {} */
            constraints: {
                dailyLimitMinutes?: number;
                breakMinutes?: number;
                minBlockMinutes?: number;
                maxBlockMinutes?: number;
                allowSplit?: boolean;
            };
        };
        UpdateStudyPlan: {
            expectedRevision: number;
            patch: {
                goals?: string[];
                deadline?: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                /** @enum {string} */
                status?: "draft" | "active" | "completed";
                unitUpdates?: {
                    /** Format: uuid */
                    unitId: string;
                    expectedRevision: number;
                    patch: {
                        title?: string;
                        objective?: string;
                        /** @enum {string} */
                        kind?: "read" | "explain" | "practice" | "recall" | "review";
                        materialSourceIds?: string[];
                        estimatedMinutes?: number;
                        /** @enum {string} */
                        status?: "planned" | "in_progress" | "completed" | "skipped";
                    };
                }[];
            };
        };
        WithdrawStudyPlan: {
            selectedUnstartedBlockIds: string[];
            /** @default null */
            reason: string | null;
        };
        StudyWithdrawalProposal: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            studyPlanId: string;
            studyPlanRevision: number;
            /** @enum {string} */
            kind: "study_plan_withdrawal";
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            diff: {
                selectedUnstartedBlockIds: string[];
                affectedTaskIds: string[];
                /** @enum {boolean} */
                historyDeleted: false;
                /** @enum {boolean} */
                fixedOrExternalEventsDeleted: false;
                writesApplied: boolean;
            };
            reason: string | null;
            stale: boolean;
            /** Format: date-time */
            expiresAt: string;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudySession: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string | null;
            /** Format: uuid */
            planId: string | null;
            unitIds: string[];
            taskIds: string[];
            materialSourceIds: string[];
            /** Format: uuid */
            calendarEventId: string | null;
            /** @enum {string|null} */
            mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps" | null;
            /** @enum {string} */
            state: "planned" | "active" | "paused" | "interrupted" | "completed" | "skipped";
            estimatedMinutes: number | null;
            activeTimeSegments: {
                /** Format: date-time */
                startedAt: string;
                /** Format: date-time */
                endedAt: string | null;
            }[];
            observedActiveSeconds: number;
            outcome: string | null;
            actualProgress: number | null;
            sourceSnapshots: {
                /** Format: uuid */
                sourceId: string;
                contentHash: string;
            }[];
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudySessionList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                planId: string | null;
                unitIds: string[];
                taskIds: string[];
                materialSourceIds: string[];
                /** Format: uuid */
                calendarEventId: string | null;
                /** @enum {string|null} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps" | null;
                /** @enum {string} */
                state: "planned" | "active" | "paused" | "interrupted" | "completed" | "skipped";
                estimatedMinutes: number | null;
                activeTimeSegments: {
                    /** Format: date-time */
                    startedAt: string;
                    /** Format: date-time */
                    endedAt: string | null;
                }[];
                observedActiveSeconds: number;
                outcome: string | null;
                actualProgress: number | null;
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateStudySession: {
            /** Format: uuid */
            courseId?: string | null;
            /** Format: uuid */
            planId?: string | null;
            /** @default [] */
            unitIds: string[];
            /** @default [] */
            taskIds: string[];
            materialSourceIds: string[];
            /** Format: uuid */
            calendarEventId?: string | null;
            /** @enum {string|null} */
            mode?: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps" | null;
            estimatedMinutes?: number | null;
            /** @default false */
            startImmediately: boolean;
            /** @default {} */
            expectedTaskRevisions: {
                [key: string]: number;
            };
        };
        StudySessionAction: {
            /** @enum {string} */
            action: "start" | "pause" | "resume" | "interrupt" | "complete" | "skip";
            /** Format: date-time */
            observedAt: string;
            progress?: number | null;
            outcome?: string | null;
            expectedRevision: number;
        };
        TaskExecutionHistory: {
            /** Format: uuid */
            taskId: string;
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                planId: string | null;
                unitIds: string[];
                taskIds: string[];
                materialSourceIds: string[];
                /** Format: uuid */
                calendarEventId: string | null;
                /** @enum {string|null} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps" | null;
                /** @enum {string} */
                state: "planned" | "active" | "paused" | "interrupted" | "completed" | "skipped";
                estimatedMinutes: number | null;
                activeTimeSegments: {
                    /** Format: date-time */
                    startedAt: string;
                    /** Format: date-time */
                    endedAt: string | null;
                }[];
                observedActiveSeconds: number;
                outcome: string | null;
                actualProgress: number | null;
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                actions: {
                    /** Format: uuid */
                    id: string;
                    /** @enum {string} */
                    action: "start" | "pause" | "resume" | "interrupt" | "complete" | "skip";
                    /** Format: date-time */
                    observedAt: string;
                    resultingRevision: number;
                    /** Format: date-time */
                    createdAt: string;
                }[];
                actionsTruncated: boolean;
            }[];
            nextCursor: string | null;
        };
        StartExecutionSession: {
            /** Format: uuid */
            taskId: string;
            /**
             * Format: uuid
             * @default null
             */
            studySessionId: string | null;
            /** @default null */
            plannedMinutes: number | null;
            /** @enum {string} */
            mode: "focus" | "study" | "practice" | "project" | "admin" | "other";
            clientOperationId: string;
        };
        TransitionExecutionSession: {
            /** @enum {string} */
            action: "pause" | "resume" | "finish" | "abandon";
            /** Format: date-time */
            observedAt: string;
            /** @default null */
            completedWork: {
                minutes?: number;
                description?: string;
            } | null;
            /** @default null */
            remainingWork: {
                minutes?: number;
                description?: string;
            } | null;
            /** @default null */
            actualMinutesCorrection: number | null;
        };
        ExecutionSession: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            taskId: string;
            /** Format: uuid */
            studySessionId: string | null;
            plannedMinutes: number | null;
            /** @enum {string} */
            mode: "focus" | "study" | "practice" | "project" | "admin" | "other";
            /** @enum {string} */
            state: "active" | "paused" | "finished" | "abandoned";
            activeTimeSegments: {
                /** Format: date-time */
                startedAt: string;
                /** Format: date-time */
                endedAt: string | null;
            }[];
            observedActiveSeconds: number;
            actualMinutesCorrection: number | null;
            completedWork: {
                minutes?: number;
                description?: string;
            } | null;
            remainingWork: {
                minutes?: number;
                description?: string;
            } | null;
            referenceSourceIds: string[];
            clientOperationId: string;
            revision: number;
            /** Format: date-time */
            startedAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** Format: date-time */
            finishedAt: string | null;
        };
        CreateSyncSnapshot: {
            /** Format: uuid */
            deviceId: string;
        };
        PushSync: {
            /** Format: uuid */
            deviceId: string;
            operations: ({
                /** @enum {string} */
                type: "note_yjs_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                noteId: string;
                baseRevision: number;
                updateBase64: string;
            } | {
                /** @enum {string} */
                type: "task_create";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                taskId: string;
                command: {
                    title: string;
                    /** Format: date-time */
                    dueAt?: string | null;
                    estimatedMinutes?: number | null;
                    /** Format: date-time */
                    earliestStart?: string | null;
                    /** @default 3 */
                    priority: number;
                    /** @default true */
                    allowSplit: boolean;
                    minBlockMinutes?: number | null;
                    maxBlockMinutes?: number | null;
                };
            } | {
                /** @enum {string} */
                type: "task_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                taskId: string;
                expectedRevision: number;
                patch: {
                    title?: string;
                    completed?: boolean;
                    /** Format: date-time */
                    dueAt?: string | null;
                    estimatedMinutes?: number | null;
                    remainingMinutes?: number | null;
                    /** Format: date-time */
                    earliestStart?: string | null;
                    priority?: number;
                    allowSplit?: boolean;
                    minBlockMinutes?: number | null;
                    maxBlockMinutes?: number | null;
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_create";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                command: {
                    /** Format: uuid */
                    calendarId?: string;
                    title: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    privateContext?: string | null;
                    /** @default UTC */
                    timezone: string;
                    recurrence?: {
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval: number;
                        timezone: string;
                        byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                        count?: number;
                        /** Format: date-time */
                        until?: string;
                    } | null;
                    /** @default [] */
                    entityIds: string[];
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                command: {
                    /** @enum {string} */
                    scope: "series";
                    expectedRevision: number;
                    title?: string;
                    /** Format: date-time */
                    startsAt?: string;
                    /** Format: date-time */
                    endsAt?: string;
                    timezone?: string;
                    recurrence?: {
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval: number;
                        timezone: string;
                        byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                        count?: number;
                        /** Format: date-time */
                        until?: string;
                    } | null;
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_trash";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                expectedRevision: number;
                /** @enum {string} */
                scope: "series";
            })[];
            lastCursor: string;
        };
        SyncBatch: {
            events: {
                eventId: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                /** Format: uuid */
                recordId: string;
                /** @enum {string} */
                changeKind: "upsert" | "tombstone";
                revision: number;
                /** Format: date-time */
                changedAt: string;
                cursor: string;
            }[];
            nextCursor: string | null;
            hasMore: boolean;
            snapshotRequired: boolean;
            retentionFloorEventId: string;
            latestEventId: string;
        };
        SyncAck: {
            acceptedOperationIds: string[];
            cursor: string;
            conflicts: {
                /** Format: uuid */
                operationId: string;
                /** @enum {string} */
                code: "stale_revision" | "record_not_found" | "record_tombstoned" | "record_already_exists" | "invalid_command" | "operation_id_reused";
                currentRevision: number | null;
                tombstoned: boolean;
            }[];
        };
        SyncSocketClientFrame: {
            /** @enum {string} */
            type: "hello";
            /** @enum {number} */
            protocolVersion: 1;
            /** Format: uuid */
            deviceId: string;
            cursor: string;
            /** @enum {string} */
            mode: "read_only" | "read_write";
        } | {
            /** @enum {string} */
            type: "push";
            /** Format: uuid */
            requestId: string;
            lastCursor: string;
            operations: ({
                /** @enum {string} */
                type: "note_yjs_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                noteId: string;
                baseRevision: number;
                updateBase64: string;
            } | {
                /** @enum {string} */
                type: "task_create";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                taskId: string;
                command: {
                    title: string;
                    /** Format: date-time */
                    dueAt?: string | null;
                    estimatedMinutes?: number | null;
                    /** Format: date-time */
                    earliestStart?: string | null;
                    /** @default 3 */
                    priority: number;
                    /** @default true */
                    allowSplit: boolean;
                    minBlockMinutes?: number | null;
                    maxBlockMinutes?: number | null;
                };
            } | {
                /** @enum {string} */
                type: "task_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                taskId: string;
                expectedRevision: number;
                patch: {
                    title?: string;
                    completed?: boolean;
                    /** Format: date-time */
                    dueAt?: string | null;
                    estimatedMinutes?: number | null;
                    remainingMinutes?: number | null;
                    /** Format: date-time */
                    earliestStart?: string | null;
                    priority?: number;
                    allowSplit?: boolean;
                    minBlockMinutes?: number | null;
                    maxBlockMinutes?: number | null;
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_create";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                command: {
                    /** Format: uuid */
                    calendarId?: string;
                    title: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    privateContext?: string | null;
                    /** @default UTC */
                    timezone: string;
                    recurrence?: {
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval: number;
                        timezone: string;
                        byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                        count?: number;
                        /** Format: date-time */
                        until?: string;
                    } | null;
                    /** @default [] */
                    entityIds: string[];
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_update";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                command: {
                    /** @enum {string} */
                    scope: "series";
                    expectedRevision: number;
                    title?: string;
                    /** Format: date-time */
                    startsAt?: string;
                    /** Format: date-time */
                    endsAt?: string;
                    timezone?: string;
                    recurrence?: {
                        /** @enum {string} */
                        frequency: "daily" | "weekly" | "monthly" | "yearly";
                        /** @default 1 */
                        interval: number;
                        timezone: string;
                        byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                        count?: number;
                        /** Format: date-time */
                        until?: string;
                    } | null;
                };
            } | {
                /** @enum {string} */
                type: "calendar_event_trash";
                /** Format: uuid */
                operationId: string;
                /** Format: uuid */
                eventId: string;
                expectedRevision: number;
                /** @enum {string} */
                scope: "series";
            })[];
        } | {
            /** @enum {string} */
            type: "ping";
            nonce: string;
        };
        SyncSocketServerFrame: {
            /** @enum {string} */
            type: "hello_ack";
            /** @enum {number} */
            protocolVersion: 1;
            /** @enum {string} */
            mode: "read_only" | "read_write";
            cursor: string;
        } | {
            /** @enum {string} */
            type: "changes";
            events: {
                eventId: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                /** Format: uuid */
                recordId: string;
                /** @enum {string} */
                changeKind: "upsert" | "tombstone";
                revision: number;
                /** Format: date-time */
                changedAt: string;
                cursor: string;
            }[];
            nextCursor: string;
        } | {
            /** @enum {string} */
            type: "push_ack";
            /** Format: uuid */
            requestId: string;
            ack: {
                acceptedOperationIds: string[];
                cursor: string;
                conflicts: {
                    /** Format: uuid */
                    operationId: string;
                    /** @enum {string} */
                    code: "stale_revision" | "record_not_found" | "record_tombstoned" | "record_already_exists" | "invalid_command" | "operation_id_reused";
                    currentRevision: number | null;
                    tombstoned: boolean;
                }[];
            };
        } | {
            /** @enum {string} */
            type: "resync_required";
            /** @enum {string} */
            reason: "cursor_expired" | "cursor_ahead";
            retentionFloorEventId: string;
            latestEventId: string;
        } | {
            /** @enum {string} */
            type: "pong";
            nonce: string;
        } | {
            /** @enum {string} */
            type: "error";
            /** @enum {string} */
            code: "hello_required" | "invalid_frame" | "unsupported_protocol" | "origin_not_allowed" | "device_not_authorized" | "write_not_allowed" | "access_revoked" | "internal_error";
            retryable: boolean;
        };
        SyncSnapshotResult: {
            /** @enum {string} */
            type: "sync_snapshot";
            /** @enum {number} */
            protocolVersion: 1;
            /** Format: uuid */
            snapshotId: string;
            /** Format: uuid */
            requestedForDeviceId: string;
            watermarkCursor: string;
            entries: {
                /** @enum {string} */
                recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                /** Format: uuid */
                recordId: string;
                revision: number;
                /** @enum {string} */
                changeKind: "upsert" | "tombstone";
            }[];
            entryCount: number;
            /** Format: date-time */
            generatedAt: string;
            /** @enum {boolean} */
            writesApplied: false;
        };
        VaultChangeEvent: {
            eventId: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
            /** Format: uuid */
            recordId: string;
            /** @enum {string} */
            changeKind: "upsert" | "tombstone";
            revision: number;
            /** Format: date-time */
            changedAt: string;
            cursor: string;
        };
        KnowledgeGap: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string | null;
            concept: string;
            materialSourceIds: string[];
            statement: string;
            evidenceAnchorIds: string[];
            /** @enum {string} */
            origin: "owner_report" | "teacher_feedback" | "practice_inference";
            /** @enum {string} */
            status: "reported" | "confirmed" | "corrected" | "dismissed" | "resolved";
            uncertainty: string | null;
            correction: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        KnowledgeGapList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                concept: string;
                materialSourceIds: string[];
                statement: string;
                evidenceAnchorIds: string[];
                /** @enum {string} */
                origin: "owner_report" | "teacher_feedback" | "practice_inference";
                /** @enum {string} */
                status: "reported" | "confirmed" | "corrected" | "dismissed" | "resolved";
                uncertainty: string | null;
                correction: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateReportedKnowledgeGap: {
            /** Format: uuid */
            courseId?: string | null;
            concept: string;
            /** @default [] */
            materialSourceIds: string[];
            statement: string;
            /** @default [] */
            evidenceAnchorIds: string[];
        };
        UpdateKnowledgeGap: {
            /** @enum {string} */
            status: "confirmed" | "corrected" | "dismissed" | "resolved";
            correction?: string | null;
            evidenceAnchorIds?: string[];
            expectedRevision: number;
        };
        CorrectKnowledgeGap: {
            /** @enum {string} */
            state: "confirmed" | "corrected" | "dismissed" | "resolved";
            correctionReason: string;
            evidenceAnchorIds?: string[];
        };
        StudyExercise: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string | null;
            /** Format: uuid */
            generationJobId: string | null;
            /** @enum {string} */
            mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
            /** @enum {string|null} */
            difficulty: "introductory" | "standard" | "advanced" | null;
            /** @enum {string} */
            status: "generating" | "ready" | "generation_failed";
            prompt: string | null;
            answer: string | null;
            explanation: string | null;
            materialSourceIds: string[];
            sourceSnapshots: {
                /** Format: uuid */
                sourceId: string;
                contentHash: string;
            }[];
            sourceStale: boolean;
            modelProfileId: string | null;
            promptVersion: string | null;
            ownerCorrection: string | null;
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudyExerciseList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                generationJobId: string | null;
                /** @enum {string} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
                /** @enum {string|null} */
                difficulty: "introductory" | "standard" | "advanced" | null;
                /** @enum {string} */
                status: "generating" | "ready" | "generation_failed";
                prompt: string | null;
                answer: string | null;
                explanation: string | null;
                materialSourceIds: string[];
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                sourceStale: boolean;
                modelProfileId: string | null;
                promptVersion: string | null;
                ownerCorrection: string | null;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateStudyExercise: {
            /** @enum {string} */
            mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
            /**
             * @default null
             * @enum {string|null}
             */
            difficulty: "introductory" | "standard" | "advanced" | null;
            /** @default 1 */
            count: number;
            /**
             * Format: uuid
             * @default null
             */
            courseId: string | null;
            materialSourceIds: string[];
        };
        StudyAttempt: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            exerciseId: string;
            response: string;
            /** @enum {string} */
            responseKind: "text" | "self_assessment" | "spoken_transcript";
            /** Format: date-time */
            startedAt: string | null;
            /** Format: date-time */
            completedAt: string;
            hintsUsed: string[];
            confidenceSelfReport: number | null;
            /** @enum {string} */
            feedbackStatus: "not_requested" | "waiting_for_worker" | "ready" | "failed";
            /** Format: uuid */
            feedbackJobId: string | null;
            feedback: {
                summary: string;
                /** @enum {string} */
                estimatedCorrectness: "correct" | "partly_correct" | "incorrect" | "insufficient_evidence";
                scoreEstimate: number | null;
                uncertainty: string;
                materialSourceIds: string[];
            } | null;
            ownerCorrection: {
                correction: string;
                scoreOverride: number | null;
                evidenceSourceIds: string[];
                /** Format: date-time */
                correctedAt: string;
            } | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudyAttemptList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                exerciseId: string;
                response: string;
                /** @enum {string} */
                responseKind: "text" | "self_assessment" | "spoken_transcript";
                /** Format: date-time */
                startedAt: string | null;
                /** Format: date-time */
                completedAt: string;
                hintsUsed: string[];
                confidenceSelfReport: number | null;
                /** @enum {string} */
                feedbackStatus: "not_requested" | "waiting_for_worker" | "ready" | "failed";
                /** Format: uuid */
                feedbackJobId: string | null;
                feedback: {
                    summary: string;
                    /** @enum {string} */
                    estimatedCorrectness: "correct" | "partly_correct" | "incorrect" | "insufficient_evidence";
                    scoreEstimate: number | null;
                    uncertainty: string;
                    materialSourceIds: string[];
                } | null;
                ownerCorrection: {
                    correction: string;
                    scoreOverride: number | null;
                    evidenceSourceIds: string[];
                    /** Format: date-time */
                    correctedAt: string;
                } | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateStudyAttempt: {
            response: string;
            /**
             * @default text
             * @enum {string}
             */
            responseKind: "text" | "self_assessment" | "spoken_transcript";
            /** Format: date-time */
            startedAt?: string | null;
            /** Format: date-time */
            completedAt: string;
            /** @default [] */
            hintsUsed: string[];
            /** @default null */
            confidenceSelfReport: number | null;
            /** Format: uuid */
            idempotencyKey: string;
        };
        RequestStudyFeedback: {
            expectedAttemptRevision: number;
        };
        CorrectStudyFeedback: {
            expectedAttemptRevision: number;
            correction: string;
            /** @default null */
            scoreOverride: number | null;
            /** @default [] */
            evidenceSourceIds: string[];
        };
        StudyActivity: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            sessionId: string | null;
            /** Format: uuid */
            generationJobId: string | null;
            /** @enum {string} */
            mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "simple" | "advanced" | "knowledge_gaps";
            /** @enum {string|null} */
            difficulty: "introductory" | "standard" | "advanced" | null;
            requestedLength: number;
            language: string | null;
            materialSourceIds: string[];
            sourceSnapshots: {
                /** Format: uuid */
                sourceId: string;
                contentHash: string;
            }[];
            staleSourceIds: string[];
            /** @enum {string} */
            state: "generating" | "ready" | "generation_failed";
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                /** Format: uuid */
                generationJobId: string | null;
                /** @enum {string} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
                /** @enum {string|null} */
                difficulty: "introductory" | "standard" | "advanced" | null;
                /** @enum {string} */
                status: "generating" | "ready" | "generation_failed";
                prompt: string | null;
                answer: string | null;
                explanation: string | null;
                materialSourceIds: string[];
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                sourceStale: boolean;
                modelProfileId: string | null;
                promptVersion: string | null;
                ownerCorrection: string | null;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                responses: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    /** Format: uuid */
                    exerciseId: string;
                    response: string;
                    /** @enum {string} */
                    responseKind: "text" | "self_assessment" | "spoken_transcript";
                    /** Format: date-time */
                    startedAt: string | null;
                    /** Format: date-time */
                    completedAt: string;
                    hintsUsed: string[];
                    confidenceSelfReport: number | null;
                    /** @enum {string} */
                    feedbackStatus: "not_requested" | "waiting_for_worker" | "ready" | "failed";
                    /** Format: uuid */
                    feedbackJobId: string | null;
                    feedback: {
                        summary: string;
                        /** @enum {string} */
                        estimatedCorrectness: "correct" | "partly_correct" | "incorrect" | "insufficient_evidence";
                        scoreEstimate: number | null;
                        uncertainty: string;
                        materialSourceIds: string[];
                    } | null;
                    ownerCorrection: {
                        correction: string;
                        scoreOverride: number | null;
                        evidenceSourceIds: string[];
                        /** Format: date-time */
                        correctedAt: string;
                    } | null;
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                }[];
            }[];
            responseCount: number;
            revision: number;
            /** Format: date-time */
            archivedAt: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        StudyActivityList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                sessionId: string | null;
                /** Format: uuid */
                generationJobId: string | null;
                /** @enum {string} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "simple" | "advanced" | "knowledge_gaps";
                /** @enum {string|null} */
                difficulty: "introductory" | "standard" | "advanced" | null;
                requestedLength: number;
                language: string | null;
                materialSourceIds: string[];
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                staleSourceIds: string[];
                /** @enum {string} */
                state: "generating" | "ready" | "generation_failed";
                items: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    /** Format: uuid */
                    courseId: string | null;
                    /** Format: uuid */
                    generationJobId: string | null;
                    /** @enum {string} */
                    mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
                    /** @enum {string|null} */
                    difficulty: "introductory" | "standard" | "advanced" | null;
                    /** @enum {string} */
                    status: "generating" | "ready" | "generation_failed";
                    prompt: string | null;
                    answer: string | null;
                    explanation: string | null;
                    materialSourceIds: string[];
                    sourceSnapshots: {
                        /** Format: uuid */
                        sourceId: string;
                        contentHash: string;
                    }[];
                    sourceStale: boolean;
                    modelProfileId: string | null;
                    promptVersion: string | null;
                    ownerCorrection: string | null;
                    revision: number;
                    /** Format: date-time */
                    archivedAt: string | null;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                    responses: {
                        /** Format: uuid */
                        id: string;
                        /** Format: uuid */
                        vaultId: string;
                        /** Format: uuid */
                        exerciseId: string;
                        response: string;
                        /** @enum {string} */
                        responseKind: "text" | "self_assessment" | "spoken_transcript";
                        /** Format: date-time */
                        startedAt: string | null;
                        /** Format: date-time */
                        completedAt: string;
                        hintsUsed: string[];
                        confidenceSelfReport: number | null;
                        /** @enum {string} */
                        feedbackStatus: "not_requested" | "waiting_for_worker" | "ready" | "failed";
                        /** Format: uuid */
                        feedbackJobId: string | null;
                        feedback: {
                            summary: string;
                            /** @enum {string} */
                            estimatedCorrectness: "correct" | "partly_correct" | "incorrect" | "insufficient_evidence";
                            scoreEstimate: number | null;
                            uncertainty: string;
                            materialSourceIds: string[];
                        } | null;
                        ownerCorrection: {
                            correction: string;
                            scoreOverride: number | null;
                            evidenceSourceIds: string[];
                            /** Format: date-time */
                            correctedAt: string;
                        } | null;
                        revision: number;
                        /** Format: date-time */
                        createdAt: string;
                        /** Format: date-time */
                        updatedAt: string;
                    }[];
                }[];
                responseCount: number;
                revision: number;
                /** Format: date-time */
                archivedAt: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateStudyActivity: {
            /** @enum {string} */
            mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "simple" | "advanced" | "knowledge_gaps";
            sourceScope: {
                sourceIds: string[];
                /**
                 * Format: uuid
                 * @default null
                 */
                courseId: string | null;
            };
            /**
             * Format: uuid
             * @default null
             */
            sessionId: string | null;
            /**
             * @default null
             * @enum {string|null}
             */
            difficulty: "introductory" | "standard" | "advanced" | null;
            /** @default 5 */
            length: number;
            /** @default null */
            language: string | null;
        };
        SubmitStudyResponse: {
            /** Format: uuid */
            itemId: string;
            answer: string;
            /** Format: uuid */
            responseId: string;
            expectedActivityRevision: number;
            /** @default null */
            elapsedActiveSeconds: number | null;
        };
        FlashcardDeck: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            courseId: string | null;
            name: string;
            materialSourceIds: string[];
            sourceSnapshots: {
                /** Format: uuid */
                sourceId: string;
                contentHash: string;
            }[];
            /** @enum {string} */
            origin: "owner" | "generated";
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        FlashcardDeckList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                courseId: string | null;
                name: string;
                materialSourceIds: string[];
                sourceSnapshots: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                }[];
                /** @enum {string} */
                origin: "owner" | "generated";
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateFlashcardDeck: {
            name: string;
            /** Format: uuid */
            courseId?: string | null;
            /** @default [] */
            materialSourceIds: string[];
        };
        UpdateFlashcardDeck: {
            patch: {
                name?: string;
                /** Format: uuid */
                courseId?: string | null;
                /** @default [] */
                materialSourceIds: string[];
            };
            expectedRevision: number;
        };
        Flashcard: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            deckId: string;
            prompt: string;
            answer: string;
            sourceAnchorIds: string[];
            sourceStale: boolean;
            /** @enum {string} */
            origin: "owner" | "generated";
            /** @enum {string} */
            approvalStatus: "draft" | "approved";
            /** @enum {string} */
            reviewPolicyVersion: "omega-review-v1";
            /** Format: date-time */
            nextDue: string | null;
            reviewCount: number;
            /** Format: date-time */
            archivedAt: string | null;
            revision: number;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        FlashcardList: {
            items: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                deckId: string;
                prompt: string;
                answer: string;
                sourceAnchorIds: string[];
                sourceStale: boolean;
                /** @enum {string} */
                origin: "owner" | "generated";
                /** @enum {string} */
                approvalStatus: "draft" | "approved";
                /** @enum {string} */
                reviewPolicyVersion: "omega-review-v1";
                /** Format: date-time */
                nextDue: string | null;
                reviewCount: number;
                /** Format: date-time */
                archivedAt: string | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            nextCursor: string | null;
        };
        CreateFlashcard: {
            /** Format: uuid */
            deckId: string;
            prompt: string;
            answer: string;
            /** @default [] */
            sourceAnchorIds: string[];
            /**
             * @default approved
             * @enum {string}
             */
            approvalStatus: "draft" | "approved";
        };
        UpdateFlashcard: {
            patch: {
                /** Format: uuid */
                deckId?: string;
                prompt?: string;
                answer?: string;
                /** @default [] */
                sourceAnchorIds: string[];
                /**
                 * @default approved
                 * @enum {string}
                 */
                approvalStatus: "draft" | "approved";
            };
            expectedRevision: number;
        };
        FlashcardReviewQueue: {
            items: {
                card: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    /** Format: uuid */
                    deckId: string;
                    prompt: string;
                    answer: string;
                    sourceAnchorIds: string[];
                    sourceStale: boolean;
                    /** @enum {string} */
                    origin: "owner" | "generated";
                    /** @enum {string} */
                    approvalStatus: "draft" | "approved";
                    /** @enum {string} */
                    reviewPolicyVersion: "omega-review-v1";
                    /** Format: date-time */
                    nextDue: string | null;
                    reviewCount: number;
                    /** Format: date-time */
                    archivedAt: string | null;
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                };
                /** @enum {string} */
                dueBasis: "new" | "scheduled";
                /** Format: date-time */
                dueAt: string | null;
                /** @enum {string} */
                policyVersion: "omega-review-v1";
            }[];
            /** Format: date-time */
            at: string;
        };
        RecordFlashcardReview: {
            responseId: string;
            /** @enum {string} */
            rating: "again" | "hard" | "good" | "easy";
            /** Format: date-time */
            observedAt: string;
            activeSeconds?: number | null;
            expectedCardRevision: number;
        };
        ReviewFlashcard: {
            /** Format: date-time */
            observedAt: string;
            /** @enum {string} */
            outcome: "again" | "hard" | "good" | "easy";
            /** @default null */
            answer: string | null;
            /** @default null */
            hintsUsed: number | null;
            /** @default null */
            elapsedMs: number | null;
        };
        FlashcardReviewReceipt: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            responseId: string;
            /** Format: uuid */
            cardId: string;
            cardRevision: number;
            /** @enum {string} */
            rating: "again" | "hard" | "good" | "easy";
            /** Format: date-time */
            observedAt: string;
            activeSeconds: number | null;
            /** @enum {string} */
            reviewPolicyVersion: "omega-review-v1";
            /** Format: date-time */
            computedNextDue: string;
            /** Format: date-time */
            createdAt: string;
            answer: string | null;
            hintsUsed: number | null;
            elapsedMs: number | null;
        };
        FlashcardReview: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            responseId: string;
            /** Format: uuid */
            cardId: string;
            cardRevision: number;
            /** @enum {string} */
            rating: "again" | "hard" | "good" | "easy";
            /** Format: date-time */
            observedAt: string;
            activeSeconds: number | null;
            /** @enum {string} */
            reviewPolicyVersion: "omega-review-v1";
            /** Format: date-time */
            computedNextDue: string;
            /** Format: date-time */
            createdAt: string;
        };
        SchedulerPreferences: {
            timezone: string;
            protectedWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            preferredWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            dailyLimitMinutes: number;
            breakMinutes: number;
            minBlockMinutes: number;
            maxBlockMinutes: number;
            allowSplit: boolean;
            /** @enum {string} */
            replanPolicy: "manual_only" | "preview_on_conflict";
            /** @enum {string} */
            algorithmVersion: "deterministic-scheduler-v1";
            /** Format: uuid */
            vaultId: string;
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        SetSchedulerPreferences: {
            preferences: {
                timezone: string;
                protectedWindows: {
                    days: number[];
                    startLocal: string;
                    endLocal: string;
                    label: string;
                }[];
                preferredWindows: {
                    days: number[];
                    startLocal: string;
                    endLocal: string;
                    label: string;
                }[];
                dailyLimitMinutes: number;
                breakMinutes: number;
                minBlockMinutes: number;
                maxBlockMinutes: number;
                allowSplit: boolean;
                /** @enum {string} */
                replanPolicy: "manual_only" | "preview_on_conflict";
                /** @enum {string} */
                algorithmVersion: "deterministic-scheduler-v1";
            };
            expectedRevision: number;
        };
        SchedulingConstraints: {
            timezone: string;
            protectedWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            preferredWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            dailyLimitMinutes: number;
            breakMinutes: number;
            minBlockMinutes: number;
            maxBlockMinutes: number;
            allowSplit: boolean;
            /** @enum {string} */
            replanPolicy: "manual_only" | "preview_on_conflict";
            /** @enum {string} */
            algorithmVersion: "deterministic-scheduler-v1";
            /** Format: uuid */
            vaultId: string;
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        } & {
            freezeHorizonMinutes: number;
            /** @enum {string} */
            movementPolicy: "preserve_locked" | "minimize_disruption" | "allow_reflow";
            /** @enum {string} */
            fixedEventsSource: "canonical_calendar";
            /** @enum {boolean} */
            deadlinesEnforced: true;
            calendarRevision: string;
        };
        SetSchedulingConstraints: {
            timezone: string;
            protectedWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            preferredWindows: {
                days: number[];
                startLocal: string;
                endLocal: string;
                label: string;
            }[];
            dailyLimits: {
                defaultMinutes: number;
            };
            breaks: {
                betweenBlocksMinutes: number;
                minBlockMinutes: number;
                maxBlockMinutes: number;
            };
            freezeHorizonMinutes: number;
            /** @enum {string} */
            movementPolicy: "preserve_locked" | "minimize_disruption" | "allow_reflow";
            allowSplit: boolean;
        };
        ProposeSchedule: {
            taskIds: string[];
            window: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            constraintsRevision: number;
            calendarRevision: string;
            allowSplit: boolean;
            objectiveParameters?: {
                /** @enum {string} */
                strategy: "deadline_priority_v1";
            };
        };
        SchedulePreviewRequest: {
            taskIds?: string[];
            /** Format: uuid */
            studyPlanId?: string;
            horizon: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            constraintOverrides?: {
                dailyLimitMinutes?: number;
                breakMinutes?: number;
                minBlockMinutes?: number;
                maxBlockMinutes?: number;
                allowSplit?: boolean;
            };
            expectedInputRevisions: {
                [key: string]: number;
            };
        };
        PreparationPlanInput: {
            /** @default [] */
            taskIds: string[];
            /**
             * Format: uuid
             * @default null
             */
            studyPlanId: string | null;
            window: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            /** @default {} */
            limits: {
                dailyLimitMinutes?: number;
                breakMinutes?: number;
                minBlockMinutes?: number;
                maxBlockMinutes?: number;
                allowSplit?: boolean;
            };
            /** @default {} */
            estimates: {
                [key: string]: number | null;
            };
            /** @default [] */
            lockedEventIds: string[];
            expectedInputRevisions: {
                [key: string]: number;
            };
        };
        ScheduleReplanRequest: {
            /** @enum {string} */
            trigger: "missed_work" | "new_assignment" | "assessment_changed" | "availability_changed" | "event_changed" | "work_overrun" | "owner_requested";
            affectedTaskIds: string[];
            /**
             * Format: uuid
             * @default null
             */
            priorProposalId: string | null;
            horizon: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            /** @default {} */
            remainingWork: {
                [key: string]: number;
            };
            expectedInputRevisions: {
                [key: string]: number;
            };
        };
        ScheduleExplanation: {
            /** Format: uuid */
            proposalId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            stale: boolean;
            /** @enum {string} */
            algorithmVersion: "deterministic-scheduler-v1";
            horizon: {
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
            };
            constraintsRevision: number;
            calendarDigest: string;
            inputRevisions: {
                [key: string]: number;
            };
            placements: {
                /** Format: uuid */
                taskId: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                minutes: number;
                reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                explanations: string[];
            }[];
            unscheduled: {
                /** Format: uuid */
                taskId: string;
                remainingMinutes: number | null;
                reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                explanations: string[];
            }[];
            unknownAvailability: string[];
            writesApplied: boolean;
        };
        Proposal: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "schedule_plan";
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            diff: {
                horizon: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                };
                placements: {
                    /** Format: uuid */
                    taskId: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    minutes: number;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unscheduled: {
                    /** Format: uuid */
                    taskId: string;
                    remainingMinutes: number | null;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unknownAvailability: string[];
                writesApplied: boolean;
            };
            expectedRevisions: {
                [key: string]: number;
            };
            constraintsRevision: number;
            calendarDigest: string;
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "provider_calendar_action";
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            diff: {
                /** Format: uuid */
                eventId: string;
                /** Format: uuid */
                connectionId: string;
                /** @enum {string} */
                actionKind: "create" | "update" | "delete" | "respond";
                targetCalendarId: string;
                recipients: {
                    /** Format: email */
                    address: string;
                    /** @default null */
                    displayName: string | null;
                }[];
                publicFields: {
                    title: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    timezone: string;
                    /** @default null */
                    description: string | null;
                    /** @default null */
                    location: string | null;
                };
                /** @enum {string|null} */
                response: "accepted" | "declined" | "tentative" | null;
                privateFieldsExcluded: string[];
                writesApplied: boolean;
            };
            expectedRevisions: {
                event: number;
                connection: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "entity_merge";
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            diff: {
                /** Format: uuid */
                targetEntityId: string;
                sourceEntityIds: string[];
                reason: string;
                affectedEventIds: string[];
                affectedCommitmentIds: string[];
                writesApplied: boolean;
            };
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** Format: uuid */
            studyPlanId: string;
            studyPlanRevision: number;
            /** @enum {string} */
            kind: "study_plan_withdrawal";
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            diff: {
                selectedUnstartedBlockIds: string[];
                affectedTaskIds: string[];
                /** @enum {boolean} */
                historyDeleted: false;
                /** @enum {boolean} */
                fixedOrExternalEventsDeleted: false;
                writesApplied: boolean;
            };
            reason: string | null;
            stale: boolean;
            /** Format: date-time */
            expiresAt: string;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            kind: "merge_notes";
            diff: {
                /** Format: uuid */
                targetNoteId: string;
                sourceNoteIds: string[];
                mergedTitle: string;
                mergedBody: string;
                sourcePreviews: {
                    /** Format: uuid */
                    noteId: string;
                    title: string;
                    revision: number;
                }[];
                writesApplied: boolean;
            };
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            kind: "split_note";
            diff: {
                /** Format: uuid */
                sourceNoteId: string;
                parts: {
                    title: string;
                    body: string;
                }[];
                /** @enum {boolean} */
                preserveSourceAsTrashed: true;
                writesApplied: boolean;
            };
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            kind: "merge_labels";
            diff: {
                /** Format: uuid */
                targetLabelId: string;
                sourceLabelIds: string[];
                affectedNoteIds: string[];
                writesApplied: boolean;
            };
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            kind: "bulk_reassign";
            diff: {
                noteIds: string[];
                addLabelIds: string[];
                removeLabelIds: string[];
                lockedRemovalConflicts: {
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    labelId: string;
                }[];
                writesApplied: boolean;
            };
        } | {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
            revision: number;
            expectedRevisions: {
                [key: string]: number;
            };
            affectedRecordIds: string[];
            requiredPermissions: string[];
            stale: boolean;
            /** Format: date-time */
            expiresAt: string | null;
            rejectionReason: string | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
            /** @enum {string} */
            kind: "idea_promotion";
            diff: {
                /** Format: uuid */
                ideaId: string;
                /** @default [] */
                relatedIdeaIds: string[];
                /** Format: uuid */
                targetProjectId: string | null;
                newProjectName: string | null;
                /** @default null */
                proposedTitle: string | null;
                /** @enum {string} */
                action: "link_existing_project" | "create_project";
                /** @enum {boolean} */
                originalIdeaRetained: true;
                writesApplied: boolean;
            };
        };
        ProposalList: {
            items: ({
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "schedule_plan";
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                diff: {
                    horizon: {
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                    };
                    placements: {
                        /** Format: uuid */
                        taskId: string;
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                        minutes: number;
                        reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                    }[];
                    unscheduled: {
                        /** Format: uuid */
                        taskId: string;
                        remainingMinutes: number | null;
                        reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                    }[];
                    unknownAvailability: string[];
                    writesApplied: boolean;
                };
                expectedRevisions: {
                    [key: string]: number;
                };
                constraintsRevision: number;
                calendarDigest: string;
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "provider_calendar_action";
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                diff: {
                    /** Format: uuid */
                    eventId: string;
                    /** Format: uuid */
                    connectionId: string;
                    /** @enum {string} */
                    actionKind: "create" | "update" | "delete" | "respond";
                    targetCalendarId: string;
                    recipients: {
                        /** Format: email */
                        address: string;
                        /** @default null */
                        displayName: string | null;
                    }[];
                    publicFields: {
                        title: string;
                        /** Format: date-time */
                        startsAt: string;
                        /** Format: date-time */
                        endsAt: string;
                        timezone: string;
                        /** @default null */
                        description: string | null;
                        /** @default null */
                        location: string | null;
                    };
                    /** @enum {string|null} */
                    response: "accepted" | "declined" | "tentative" | null;
                    privateFieldsExcluded: string[];
                    writesApplied: boolean;
                };
                expectedRevisions: {
                    event: number;
                    connection: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                kind: "entity_merge";
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                diff: {
                    /** Format: uuid */
                    targetEntityId: string;
                    sourceEntityIds: string[];
                    reason: string;
                    affectedEventIds: string[];
                    affectedCommitmentIds: string[];
                    writesApplied: boolean;
                };
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                studyPlanId: string;
                studyPlanRevision: number;
                /** @enum {string} */
                kind: "study_plan_withdrawal";
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                diff: {
                    selectedUnstartedBlockIds: string[];
                    affectedTaskIds: string[];
                    /** @enum {boolean} */
                    historyDeleted: false;
                    /** @enum {boolean} */
                    fixedOrExternalEventsDeleted: false;
                    writesApplied: boolean;
                };
                reason: string | null;
                stale: boolean;
                /** Format: date-time */
                expiresAt: string;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** @enum {string} */
                kind: "merge_notes";
                diff: {
                    /** Format: uuid */
                    targetNoteId: string;
                    sourceNoteIds: string[];
                    mergedTitle: string;
                    mergedBody: string;
                    sourcePreviews: {
                        /** Format: uuid */
                        noteId: string;
                        title: string;
                        revision: number;
                    }[];
                    writesApplied: boolean;
                };
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** @enum {string} */
                kind: "split_note";
                diff: {
                    /** Format: uuid */
                    sourceNoteId: string;
                    parts: {
                        title: string;
                        body: string;
                    }[];
                    /** @enum {boolean} */
                    preserveSourceAsTrashed: true;
                    writesApplied: boolean;
                };
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** @enum {string} */
                kind: "merge_labels";
                diff: {
                    /** Format: uuid */
                    targetLabelId: string;
                    sourceLabelIds: string[];
                    affectedNoteIds: string[];
                    writesApplied: boolean;
                };
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** @enum {string} */
                kind: "bulk_reassign";
                diff: {
                    noteIds: string[];
                    addLabelIds: string[];
                    removeLabelIds: string[];
                    lockedRemovalConflicts: {
                        /** Format: uuid */
                        noteId: string;
                        /** Format: uuid */
                        labelId: string;
                    }[];
                    writesApplied: boolean;
                };
            } | {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** @enum {string} */
                status: "draft" | "approved" | "rejected" | "withdrawn" | "superseded" | "expired";
                revision: number;
                expectedRevisions: {
                    [key: string]: number;
                };
                affectedRecordIds: string[];
                requiredPermissions: string[];
                stale: boolean;
                /** Format: date-time */
                expiresAt: string | null;
                rejectionReason: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** @enum {string} */
                kind: "idea_promotion";
                diff: {
                    /** Format: uuid */
                    ideaId: string;
                    /** @default [] */
                    relatedIdeaIds: string[];
                    /** Format: uuid */
                    targetProjectId: string | null;
                    newProjectName: string | null;
                    /** @default null */
                    proposedTitle: string | null;
                    /** @enum {string} */
                    action: "link_existing_project" | "create_project";
                    /** @enum {boolean} */
                    originalIdeaRetained: true;
                    writesApplied: boolean;
                };
            })[];
            nextCursor: string | null;
        };
        ProposalInput: {
            /** @enum {string} */
            kind: "merge_notes";
            inputs: {
                /** Format: uuid */
                targetNoteId: string;
                sourceNoteIds: string[];
                mergedTitle: string;
                mergedBody: string;
            };
            expectedRevisions: {
                [key: string]: number;
            };
        } | {
            /** @enum {string} */
            kind: "split_note";
            inputs: {
                /** Format: uuid */
                sourceNoteId: string;
                parts: {
                    title: string;
                    body: string;
                }[];
            };
            expectedRevisions: {
                [key: string]: number;
            };
        } | {
            /** @enum {string} */
            kind: "merge_labels";
            inputs: {
                /** Format: uuid */
                targetLabelId: string;
                sourceLabelIds: string[];
            };
            expectedRevisions: {
                [key: string]: number;
            };
        } | {
            /** @enum {string} */
            kind: "bulk_reassign";
            inputs: {
                noteIds: string[];
                /** @default [] */
                addLabelIds: string[];
                /** @default [] */
                removeLabelIds: string[];
            };
            expectedRevisions: {
                [key: string]: number;
            };
        } | {
            /** @enum {string} */
            kind: "idea_promotion";
            inputs: {
                /** Format: uuid */
                ideaId: string;
                /** @default [] */
                relatedIdeaIds: string[];
                /** Format: uuid */
                targetProjectId?: string;
                newProjectName?: string;
                proposedTitle?: string;
            };
            expectedRevisions: {
                [key: string]: number;
            };
        };
        PreviewIdeaPromotion: {
            /** Format: uuid */
            targetProjectId?: string;
            newProjectName?: string;
            expectedRevisions: {
                [key: string]: number;
            };
        };
        ProposeIdeaProject: {
            /** @default [] */
            relatedIdeaIds: string[];
            proposedTitle: string;
            /** Format: uuid */
            existingProjectId?: string;
        };
        RejectProposal: {
            expectedProposalRevision: number;
            reason?: string | null;
        };
        AcceptProposal: {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "apply_schedule";
        } | {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "queue_provider_calendar_action";
        } | {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "merge_entities";
        } | {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "apply_content_proposal";
        } | {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "apply_study_withdrawal";
        };
        UndoProposal: {
            expectedProposalRevision: number;
            /** @enum {string} */
            confirmation: "undo_schedule";
        };
        ProposalUndoReceipt: {
            /** Format: uuid */
            proposalId: string;
            /** Format: uuid */
            applicationId: string;
            trashedEventIds: string[];
            /** Format: date-time */
            undoneAt: string;
            /** @enum {boolean} */
            writesApplied: true;
        };
        ModelProfileList: {
            items: {
                id: string;
                label: string;
                /** @enum {string} */
                backend: "ollama" | "openai_compatible";
                model: string;
                digest: string | null;
                capabilities: ("generate" | "chat" | "embed" | "extract" | "classify")[];
                enabled: boolean;
                installed: boolean;
                tested: boolean;
            }[];
        };
        IndexStatus: {
            currentProfile: string | null;
            /** Format: uuid */
            currentGenerationId: string | null;
            chunkerVersion: string | null;
            indexedRevisions: number;
            pending: number;
            errors: number;
            semanticAvailable: boolean;
        };
        RebuildIndexRequest: {
            modelProfileId: string;
            scope?: {
                noteIds?: string[];
            };
            chunkerVersion: string;
        };
        RecoveryRequest: {
            recovery_code: string;
        };
        RecoverySession: {
            /** Format: uuid */
            id: string;
            /** Format: date-time */
            expires_at: string;
            allowed_actions: ("list_passkeys" | "register_passkey")[];
        };
        PasskeySummary: {
            id: string;
            label: string;
            device_type: string;
            backed_up: boolean;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            last_used_at: string | null;
        };
        PasskeyList: {
            items: {
                id: string;
                label: string;
                device_type: string;
                backed_up: boolean;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                last_used_at: string | null;
            }[];
        };
        PasskeyOptionsRequest: {
            label: string;
        };
        RecoveryCodes: {
            codes_once: string[];
        };
        SessionSummaryList: {
            items: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                auth_level: "passkey" | "recovery";
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                last_seen_at: string;
                /** Format: date-time */
                expires_at: string;
                current: boolean;
            }[];
        };
        CreateDevicePairing: {
            device_name: string;
            /**
             * @default client
             * @enum {string}
             */
            requested_role: "client" | "worker";
            /** @default null */
            client_public_key: string | null;
        };
        DevicePairingChallenge: {
            /** Format: uuid */
            pairing_id: string;
            device_code_once: string;
            user_code: string;
            /** Format: date-time */
            expires_at: string;
        };
        ApproveDevicePairing: {
            user_code: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
            /** @enum {string} */
            approved_role: "client" | "worker";
        };
        DevicePairingApproval: {
            /** @enum {string} */
            status: "approved";
            /** Format: date-time */
            expires_at: string;
        };
        ExchangeDevicePairing: {
            device_code: string;
        };
        RefreshNativeToken: {
            refresh_token: string;
        };
        TokenPair: {
            /** Format: uuid */
            device_id: string;
            access_token: string;
            refresh_token: string;
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            refresh_expires_at: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
        };
        PairingExchangeResult: {
            /** Format: uuid */
            device_id: string;
            access_token: string;
            refresh_token: string;
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            refresh_expires_at: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
        } | {
            /** @enum {string} */
            status: "pending";
            retry_after_seconds: number;
        };
        DeviceList: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                /** @enum {string} */
                role: "client" | "worker";
                vault_ids: string[];
                scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
                /** Format: date-time */
                last_seen_at: string | null;
                /** Format: date-time */
                compromised_at: string | null;
                /** Format: date-time */
                created_at: string;
            }[];
        };
        DeviceCachePolicy: {
            /** Format: uuid */
            deviceId: string;
            /** @enum {string} */
            mode: "trusted_persistent" | "session_only";
            trusted: boolean;
            selectedVaultIds: string[];
            cacheLimits: {
                maxBytes: number;
                maxItems: number;
            };
            expireAfterSeconds: number | null;
            clearOnLogout: boolean;
            reportedState: {
                /** @enum {string} */
                status: "unknown" | "current" | "stale";
                cachedVaultIds: string[];
                byteCount: number | null;
                itemCount: number | null;
                /** Format: date-time */
                reportedAt: string | null;
            };
            latestPurge: {
                /** Format: uuid */
                id: string;
                /** @enum {string} */
                status: "requested" | "acknowledged";
                /** Format: date-time */
                requestedAt: string;
                /** Format: date-time */
                acknowledgedAt: string | null;
            } | null;
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        SetDeviceCachePolicy: {
            trusted: boolean;
            selectedVaultIds: string[];
            cacheLimits: {
                maxBytes: number;
                maxItems: number;
            };
            expireAfterSeconds: number | null;
            clearOnLogout: boolean;
        };
        RequestDeviceCachePurge: {
            selectedVaultIds: string[];
            requestReason: string;
        };
        CachePurgeRequest: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            deviceId: string;
            selectedVaultIds: string[];
            requestReason: string;
            /** @enum {string} */
            status: "requested" | "acknowledged";
            /** Format: date-time */
            requestedAt: string;
            /** Format: date-time */
            acknowledgedAt: string | null;
            /** @enum {boolean} */
            offlineErasureCertified: false;
        };
        CreateApiToken: {
            label: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
            /** Format: date-time */
            expires_at: string;
        };
        ApiTokenSummary: {
            /** Format: uuid */
            id: string;
            label: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            last_used_at: string | null;
            /** Format: date-time */
            created_at: string;
        };
        ApiTokenCreated: {
            /** Format: uuid */
            id: string;
            label: string;
            vault_ids: string[];
            scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
            /** Format: date-time */
            expires_at: string;
            /** Format: date-time */
            last_used_at: string | null;
            /** Format: date-time */
            created_at: string;
            secret_once: string;
        };
        ApiTokenList: {
            items: {
                /** Format: uuid */
                id: string;
                label: string;
                vault_ids: string[];
                scopes: ("vault:read" | "export:read" | "sync:read" | "sync:write" | "capture:write" | "notes:write" | "tasks:write" | "calendar:write" | "school:write" | "study:write" | "profile:write" | "integrations:write" | "ai:run" | "jobs:write")[];
                /** Format: date-time */
                expires_at: string;
                /** Format: date-time */
                last_used_at: string | null;
                /** Format: date-time */
                created_at: string;
            }[];
        };
        Today: {
            nextAction: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                completed: boolean;
                /** Format: date-time */
                dueAt: string | null;
                estimatedMinutes: number | null;
                remainingMinutes: number | null;
                /** Format: date-time */
                earliestStart: string | null;
                priority: number;
                allowSplit: boolean;
                minBlockMinutes: number | null;
                maxBlockMinutes: number | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            } | null;
            nextActionPlan: {
                task: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    title: string;
                    completed: boolean;
                    /** Format: date-time */
                    dueAt: string | null;
                    estimatedMinutes: number | null;
                    remainingMinutes: number | null;
                    /** Format: date-time */
                    earliestStart: string | null;
                    priority: number;
                    allowSplit: boolean;
                    minBlockMinutes: number | null;
                    maxBlockMinutes: number | null;
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                };
                /** @enum {string} */
                source: "scheduled_focus_block" | "deterministic_slot";
                /** Format: uuid */
                calendarEventId: string | null;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                durationMinutes: number;
                reasonCodes: ("scheduled_focus_block" | "preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "earliest_deadline" | "highest_priority")[];
                explanation: string;
                materialSourceIds: string[];
                /** Format: uuid */
                courseId: string | null;
                canStartNow: boolean;
            } | null;
            upcomingEvents: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                /** Format: uuid */
                calendarId: string;
                title: string;
                /** Format: date-time */
                startsAt: string;
                /** Format: date-time */
                endsAt: string;
                privateContext: string | null;
                revision: number;
                timezone: string;
                recurrence: {
                    /** @enum {string} */
                    frequency: "daily" | "weekly" | "monthly" | "yearly";
                    /** @default 1 */
                    interval: number;
                    timezone: string;
                    byWeekday?: ("MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU")[];
                    count?: number;
                    /** Format: date-time */
                    until?: string;
                } | null;
                /** Format: date-time */
                trashedAt: string | null;
                /** Format: date-time */
                createdAt: string;
            }[];
            dueTasks: {
                /** Format: uuid */
                id: string;
                /** Format: uuid */
                vaultId: string;
                title: string;
                completed: boolean;
                /** Format: date-time */
                dueAt: string | null;
                estimatedMinutes: number | null;
                remainingMinutes: number | null;
                /** Format: date-time */
                earliestStart: string | null;
                priority: number;
                allowSplit: boolean;
                minBlockMinutes: number | null;
                maxBlockMinutes: number | null;
                revision: number;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
            }[];
            noteCount: number;
        };
        NextActionSet: {
            /** Format: date-time */
            generatedAt: string;
            constraintsRevision: number;
            availableMinutes: number | null;
            /** @enum {string} */
            context: "any" | "school" | "home" | "on_the_go";
            contextApplied: boolean;
            /** Format: uuid */
            courseScope: string | null;
            candidates: {
                task: {
                    /** Format: uuid */
                    id: string;
                    /** Format: uuid */
                    vaultId: string;
                    title: string;
                    completed: boolean;
                    /** Format: date-time */
                    dueAt: string | null;
                    estimatedMinutes: number | null;
                    remainingMinutes: number | null;
                    /** Format: date-time */
                    earliestStart: string | null;
                    priority: number;
                    allowSplit: boolean;
                    minBlockMinutes: number | null;
                    maxBlockMinutes: number | null;
                    revision: number;
                    /** Format: date-time */
                    createdAt: string;
                    /** Format: date-time */
                    updatedAt: string;
                };
                /** @enum {string} */
                source: "scheduled_focus_block" | "deterministic_slot" | "unsized_task";
                /** Format: uuid */
                calendarEventId: string | null;
                /** Format: date-time */
                startsAt: string | null;
                /** Format: date-time */
                endsAt: string | null;
                durationMinutes: number | null;
                durationKnown: boolean;
                fitsAvailableMinutes: boolean | null;
                reasonCodes: ("scheduled_focus_block" | "preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort")[];
                explanation: string;
                materialSourceIds: string[];
                /** Format: uuid */
                courseId: string | null;
                canStartNow: boolean;
            }[];
            limitations: string[];
        };
        MomentumSummary: {
            window: {
                dateFrom: string;
                dateTo: string;
                timezone: string;
                /** Format: uuid */
                courseId: string | null;
            };
            preferences: {
                /** Format: uuid */
                vaultId: string;
                enabled: boolean;
                evidenceWindowDays: number;
                minObservations: number;
                userLockedParameters: ("estimated_minutes" | "preferred_windows" | "protected_windows" | "daily_limit_minutes" | "break_minutes" | "block_size" | "replan_policy")[];
                revision: number;
                /** Format: date-time */
                createdAt: string | null;
                /** Format: date-time */
                updatedAt: string | null;
            };
            counts: {
                sessionObservations: number;
                completedSessions: number;
                skippedSessions: number;
                interruptedSessions: number;
                sessionsWithMeasuredDuration: number;
                durationPairs: number;
            };
            duration: {
                observedMinutes: number;
                pairedObservedMinutes: number;
                pairedEstimatedMinutes: number;
                observedToEstimatedRatio: number | null;
            };
            evidence: {
                minimumObservations: number;
                sufficient: boolean;
                /** Format: date-time */
                firstObservedAt: string | null;
                /** Format: date-time */
                lastObservedAt: string | null;
                truncated: boolean;
            };
            adaptiveEstimateEligible: boolean;
            limitations: string[];
        };
        MomentumPreferences: {
            /** Format: uuid */
            vaultId: string;
            enabled: boolean;
            evidenceWindowDays: number;
            minObservations: number;
            userLockedParameters: ("estimated_minutes" | "preferred_windows" | "protected_windows" | "daily_limit_minutes" | "break_minutes" | "block_size" | "replan_policy")[];
            revision: number;
            /** Format: date-time */
            createdAt: string | null;
            /** Format: date-time */
            updatedAt: string | null;
        };
        UpdateMomentumPreferences: {
            enabled?: boolean;
            evidenceWindowDays?: number;
            minObservations?: number;
            userLockedParameters?: ("estimated_minutes" | "preferred_windows" | "protected_windows" | "daily_limit_minutes" | "break_minutes" | "block_size" | "replan_policy")[];
        };
        WorkerHeartbeatRequest: {
            /** Format: uuid */
            deviceId: string;
            installedProfiles: {
                id: string;
                model: string;
                digest: string;
                /** @enum {string} */
                backend: "ollama" | "openai_compatible";
            }[];
            capacity: {
                generationSlots: number;
                embeddingSlots: number;
            };
            /** @enum {string} */
            runtimeStatus: "offline" | "available" | "busy" | "error";
        };
        WorkerHeartbeatResponse: {
            /** Format: date-time */
            serverTime: string;
            configRevision: number;
        };
        ClaimWorkerJobRequest: {
            supportedJobTypes: ("note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge")[];
            availableCapacity: number;
        };
        WorkerLease: {
            /** Format: uuid */
            jobId: string;
            /** Format: uuid */
            vaultId: string;
            leaseToken: string;
            /** Format: date-time */
            expiresAt: string;
            inputManifest: {
                /** @enum {string} */
                kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
                inputHash: string;
            };
        };
        WorkerJobInput: {
            /** Format: uuid */
            jobId: string;
            /** Format: uuid */
            vaultId: string;
            /** @enum {string} */
            kind: "note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge";
            inputHash: string;
            payload: {
                /** @enum {string} */
                type: "note_processing";
                /** Format: uuid */
                noteId: string;
                /** Format: uuid */
                sourceId: string;
                revision: number;
                stages: "classify"[];
                source: {
                    contentHash: string;
                    text: string;
                };
            } | {
                /** @enum {string} */
                type: "search";
                query: string;
                /** @enum {string} */
                mode: "hybrid" | "semantic";
                scope: {
                    kinds: ("note" | "task" | "calendar_event")[];
                };
                limit: number;
            } | {
                /** @enum {string} */
                type: "ai_setup_test";
                workerId: string;
                modelProfileId: string;
            } | {
                /** @enum {string} */
                type: "index_rebuild";
                /** Format: uuid */
                generationId: string;
                modelProfileId: string;
                chunkerVersion: string;
                notes: {
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    contentHash: string;
                }[];
            } | {
                /** @enum {string} */
                type: "answer_generation";
                /** Format: uuid */
                chatId: string;
                /** Format: uuid */
                userMessageId: string;
                /** Format: uuid */
                assistantMessageId: string;
                question: string;
                /** @enum {string} */
                mode: "grounded" | "brainstorm";
                scope: {
                    /**
                     * @default [
                     *       "note"
                     *     ]
                     */
                    kinds: ("note" | "task" | "calendar_event")[];
                };
            } | {
                /** @enum {string} */
                type: "study_plan_generation";
                /** Format: uuid */
                studyPlanId: string;
                courseTitle: string | null;
                assessmentTitle: string | null;
                goals: string[];
                deadline: {
                    /** @enum {string} */
                    kind: "unknown";
                } | {
                    /** @enum {string} */
                    kind: "date_only";
                    date: string;
                    timezone: string;
                } | {
                    /** @enum {string} */
                    kind: "exact";
                    /** Format: date-time */
                    dueAt: string;
                    timezone: string;
                };
                sources: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                    text: string;
                }[];
            } | {
                /** @enum {string} */
                type: "study_exercise_generation";
                /** Format: uuid */
                requestId: string;
                /** @enum {string} */
                mode: "explain" | "socratic" | "active_recall" | "flashcards" | "practice" | "mock_exam" | "explain_12" | "advanced" | "knowledge_gaps";
                /** @enum {string|null} */
                difficulty: "introductory" | "standard" | "advanced" | null;
                count: number;
                /** Format: uuid */
                courseId: string | null;
                /** @default null */
                language: string | null;
                sources: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                    text: string;
                }[];
            } | {
                /** @enum {string} */
                type: "study_attempt_feedback";
                /** Format: uuid */
                attemptId: string;
                exercise: {
                    prompt: string;
                    referenceAnswer: string | null;
                    explanation: string | null;
                    mode: string;
                };
                attempt: {
                    response: string;
                    confidenceSelfReport: number | null;
                };
                sources: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                    text: string;
                }[];
            } | {
                /** @enum {string} */
                type: "transcript_analysis";
                /** Format: uuid */
                transcriptId: string;
                sourceRevision: number;
                /** @enum {string} */
                scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                segments: {
                    id: string;
                    startMs: number;
                    endMs: number;
                    speakerLabel: string;
                    text: string;
                }[];
            } | {
                /** @enum {string} */
                type: "artifact_generation";
                /** @enum {string} */
                kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
                instructions: string | null;
                outputLanguage: string | null;
                /** Format: uuid */
                targetGeneratedNoteId: string | null;
                expectedRevision: number | null;
                sourceManifest: {
                    /** Format: uuid */
                    recordId: string;
                    /** @enum {string} */
                    recordType: "note" | "source";
                    revision: number;
                    contentHash: string;
                    title: string;
                    text: string;
                }[];
            } | {
                /** @enum {string} */
                type: "task_breakdown";
                /** Format: uuid */
                taskId: string;
                taskRevision: number;
                taskTitle: string;
                maxSessionMinutes: number | null;
                remainingWork: {
                    minutes?: number;
                    description?: string;
                } | null;
                sources: {
                    /** Format: uuid */
                    sourceId: string;
                    contentHash: string;
                    text: string;
                }[];
            };
        };
        WorkerSourceInput: {
            /** Format: uuid */
            sourceId: string;
            /** Format: uuid */
            noteId: string;
            revision: number;
            contentHash: string;
            text: string;
        };
        WorkerEvidenceRequest: {
            leaseToken: string;
            /** @enum {string} */
            modelProfileId: "local-qwen-embedding";
            embedding: number[];
        };
        WorkerEvidencePacket: {
            items: {
                citationId: string;
                title: string;
                text: string;
            }[];
        };
        WorkerIndexBatch: {
            leaseToken: string;
            /** Format: uuid */
            generationId: string;
            /** Format: uuid */
            noteId: string;
            noteRevision: number;
            sourceHash: string;
            chunks: {
                sequence: number;
                text: string;
                startOffset: number;
                endOffset: number;
                contentHash: string;
                embedding: number[];
            }[];
        };
        IndexBatchAck: {
            acceptedChunks: number;
        };
        WorkerLeaseHeartbeat: {
            leaseToken: string;
            stage: string;
            progress?: number;
        };
        LeaseState: {
            /** Format: date-time */
            expiresAt: string;
            cancelRequested: boolean;
        };
        WorkerProgressEvents: {
            leaseToken: string;
            sequence: number;
            events: {
                /** @enum {string} */
                kind: "status" | "progress";
                stage: string;
                progress?: number;
                detail?: string;
            }[];
        };
        EventAck: {
            acceptedSequence: number;
        };
        WorkerComplete: {
            leaseToken: string;
            inputHash: string;
            result: ({
                /** @enum {string} */
                type: "search";
                search: {
                    /** @enum {string} */
                    mode: "lexical" | "hybrid" | "semantic";
                    query: string;
                    items: {
                        /** @enum {string} */
                        kind: "note" | "task" | "calendar_event";
                        /** Format: uuid */
                        id: string;
                        title: string;
                        excerpt: string;
                        score: number;
                        /** Format: uuid */
                        sourceId: string | null;
                        revision: number;
                        /** Format: date-time */
                        updatedAt: string;
                    }[];
                    coverage: {
                        kinds: ("note" | "task" | "calendar_event")[];
                        semanticAvailable: boolean;
                    };
                    nextCursor: string | null;
                };
            } | {
                /** @enum {string} */
                type: "note_processing";
                /** Format: uuid */
                noteId: string;
                processedRevision: number;
                /** @enum {string} */
                classification: "note" | "task" | "event" | "idea" | "reference" | "unknown";
                suggestedTitle: string | null;
            } | {
                /** @enum {string} */
                type: "ai_setup_test";
                completion: boolean;
                structuredOutput: boolean;
                embeddings: boolean;
            } | {
                /** @enum {string} */
                type: "index_rebuild";
                indexedRevisions: number;
            } | {
                /** @enum {string} */
                type: "answer";
                /** Format: uuid */
                chatId: string;
                /** Format: uuid */
                messageId: string;
                answer: string;
                citations: {
                    citationId: string;
                    /** Format: uuid */
                    chunkId: string;
                    /** Format: uuid */
                    noteId: string;
                    /** Format: uuid */
                    sourceId: string;
                    revision: number;
                    title: string;
                    startOffset: number;
                    endOffset: number;
                    quote: string;
                }[];
            } | {
                /** @enum {string} */
                type: "schedule_preview";
                /** Format: uuid */
                proposalId: string;
                constraintsRevision: number;
                inputRevisions: {
                    [key: string]: number;
                };
                calendarDigest: string;
                horizon: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                };
                placements: {
                    /** Format: uuid */
                    taskId: string;
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    minutes: number;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unscheduled: {
                    /** Format: uuid */
                    taskId: string;
                    remainingMinutes: number | null;
                    reasonCodes: ("preferred_window" | "earliest_feasible" | "bounded_block" | "short_final_block" | "unknown_effort" | "exceeds_unsplittable_maximum" | "deadline_before_horizon" | "no_capacity")[];
                }[];
                unknownAvailability: string[];
                /** @enum {string} */
                algorithmVersion: "deterministic-scheduler-v1";
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "proposal_apply";
                /** Format: uuid */
                proposalId: string;
                createdEventIds: string[];
                /** Format: uuid */
                undoManifestId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "provider_calendar_action_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                actionId: string;
                /** @enum {boolean} */
                writesApplied: true;
                /** @enum {boolean} */
                externalDelivery: false;
            } | {
                /** @enum {string} */
                type: "entity_merge_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                targetEntityId: string;
                mergedEntityIds: string[];
                affectedEventIds: string[];
                affectedCommitmentIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "content_proposal_apply";
                /** Format: uuid */
                proposalId: string;
                /** @enum {string} */
                kind: "merge_notes" | "split_note" | "merge_labels" | "bulk_reassign" | "idea_promotion";
                createdRecordIds: string[];
                updatedRecordIds: string[];
                /** Format: uuid */
                applicationId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "url_capture";
                /** Format: uuid */
                captureId: string;
                /** Format: uuid */
                noteId: string;
                /** Format: uri */
                requestedUrl: string;
                /** Format: uri */
                finalUrl: string;
                redirectCount: number;
                byteLength: number;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "artifact_generation";
                /** Format: uuid */
                noteId: string;
                noteRevision: number;
                /** @enum {string} */
                kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
                created: boolean;
                sourceRecordIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "performance_recommendations";
                horizon: {
                    from: string;
                    to: string;
                };
                recommendations: {
                    /** Format: uuid */
                    courseId: string;
                    title: string;
                    rationale: string;
                    factors: {
                        /** @enum {string} */
                        kind: "target" | "assessment" | "knowledge_gap" | "remaining_effort" | "goal";
                        /** Format: uuid */
                        recordId: string | null;
                        summary: string;
                    }[];
                    uncertainty: string;
                    suggestedMinutes: number | null;
                    sourceIds: string[];
                }[];
                coverage: {
                    courseCount: number;
                    assessmentCount: number;
                    gapCount: number;
                    tasksWithKnownEffort: number;
                    tasksWithUnknownEffort: number;
                };
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "task_breakdown_proposal";
                /** Format: uuid */
                taskId: string;
                taskRevision: number;
                steps: {
                    stepId: string;
                    title: string;
                    description: string;
                    dependsOnStepIds: string[];
                    sourceIds: string[];
                    estimatedMinutes: number;
                    /** @enum {string} */
                    estimateOrigin: "model";
                }[];
                maxSessionMinutes: number | null;
                uncertainty: string;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "calendar_policy_dry_run";
                /** Format: uuid */
                policyRuleId: string;
                evaluatedSources: number;
                outcomes: {
                    /** Format: uuid */
                    sourceId: string;
                    /** @enum {string} */
                    outcome: "suggested" | "blocked";
                    reasonCodes: string[];
                }[];
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "study_plan_withdrawal_apply";
                /** Format: uuid */
                proposalId: string;
                /** Format: uuid */
                studyPlanId: string;
                trashedEventIds: string[];
                affectedTaskIds: string[];
                /** @enum {boolean} */
                historyDeleted: false;
                /** @enum {boolean} */
                fixedOrExternalEventsDeleted: false;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "commitment_rematch";
                matchedEvents: number;
                createdBindings: number;
                writesApplied: boolean;
            } | {
                /** @enum {string} */
                type: "calendar_context_refresh";
                /** Format: uuid */
                eventId: string;
                eventRevision: number;
                matchedCommitments: number;
                createdPrepItems: number;
                staleContext: boolean;
                writesApplied: boolean;
            } | {
                /** @enum {string} */
                type: "calendar_brief_refresh";
                date: string;
                timezone: string;
                briefRevision: number;
                sourceCount: number;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "calendar_import_preview";
                /** Format: uuid */
                proposalId: string;
                counts: {
                    create: number;
                    createSeries: number;
                    cancel: number;
                    duplicate: number;
                    blocked: number;
                };
                warnings: string[];
                /** @enum {boolean} */
                invitationsSent: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "export_generate";
                /** Format: uuid */
                exportId: string;
                /** @enum {string} */
                format: "markdown_bundle" | "full_fidelity" | "ics";
                byteLength: number;
                sha256: string;
                /** Format: date-time */
                expiresAt: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "domain_tool_run";
                /** @enum {string} */
                toolName: "search_notes" | "get_note_summary";
                output: {
                    [key: string]: unknown;
                };
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "natural_language_command";
                /** @enum {string} */
                intent: "search_notes" | "get_note_summary" | "needs_clarification";
                /** @enum {string|null} */
                toolName: "search_notes" | "get_note_summary" | null;
                output: {
                    [key: string]: unknown;
                } | null;
                clarification: string | null;
                policyRevision: number;
                /** @enum {boolean} */
                writesApplied: false;
                /** @enum {boolean} */
                externalWritesAuthorized: false;
            } | {
                /** @enum {string} */
                type: "transcript_analysis";
                /** Format: uuid */
                transcriptId: string;
                /** Format: uuid */
                artifactId: string;
                sourceRevision: number;
                /** @enum {string} */
                scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_plan_generation";
                /** Format: uuid */
                studyPlanId: string;
                unitCount: number;
                taskIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_exercise_generation";
                exerciseIds: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "study_attempt_feedback";
                /** Format: uuid */
                attemptId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "catch_up_plan";
                lessonIds: string[];
                coveredLessons: {
                    /** Format: uuid */
                    lessonId: string;
                    sourceIds: string[];
                    anchorIds: string[];
                    suggestedActions: {
                        /** @enum {string} */
                        kind: "read_source" | "review_notes" | "check_assignment";
                        /** Format: uuid */
                        sourceId: string;
                        label: string;
                        estimatedMinutes: number | null;
                    }[];
                }[];
                uncoveredLessonIds: string[];
                message: string;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "insight_generation";
                /** Format: uuid */
                insightId: string;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "profile_refresh";
                interestIds: string[];
                skippedSparseTopics: string[];
                blockedSensitiveTopics: string[];
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "profile_rebuild_proposal";
                policyRevision: number;
                candidates: {
                    /** Format: uuid */
                    interestId: string;
                    label: string;
                    observationCount: number;
                    evidenceItemIds: string[];
                }[];
                skippedSparseTopics: string[];
                blockedSensitiveTopics: string[];
                /** @enum {boolean} */
                ownerLocksPreserved: true;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "import_plan";
                /** Format: uuid */
                importId: string;
                itemCount: number;
                warningCount: number;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "import_apply";
                /** Format: uuid */
                importId: string;
                createdNoteIds: string[];
                skippedItemIds: string[];
                idRemapping: {
                    [key: string]: string;
                };
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "school_import_preview";
                /** @enum {string} */
                detectedFormat: "omega_school_json_v1";
                /** Format: date-time */
                sourceTimestamp: string;
                timezone: string;
                period: {
                    from: string;
                    to: string;
                } | null;
                counts: {
                    [key: string]: number;
                };
                sample: {
                    /** @enum {string} */
                    kind: "subject" | "course" | "lesson" | "assignment" | "assessment" | "material";
                    externalId: string;
                    title: string;
                }[];
                warnings: string[];
                /** @enum {boolean} */
                snapshotOnly: true;
                /** @enum {boolean} */
                liveConnectionCreated: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "social_time_proposal";
                /** Format: uuid */
                personId: string;
                userConstraintsRevision: number;
                window: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                };
                durationEstimate: number;
                candidates: {
                    /** Format: date-time */
                    startsAt: string;
                    /** Format: date-time */
                    endsAt: string;
                    /** @enum {string} */
                    ownerAvailability: "free";
                    /** @enum {string} */
                    otherPersonAvailability: "explicitly_shared_free" | "unknown";
                    evidenceConnectionIds: string[];
                }[];
                connectedAvailabilityScope: string[];
                limitations: string[];
                /** @enum {boolean} */
                invitationsSent: false;
                /** @enum {boolean} */
                writesApplied: false;
            } | {
                /** @enum {string} */
                type: "note_purge";
                targetIdHash: string;
                deletedDerivedRecords: number;
                revokedJobs: number;
                sourceDeleted: boolean;
                blobFilesDeleted: number;
                blobFileDeleteFailures: number;
                /** @enum {boolean} */
                minimalLedgerRetained: true;
                /** @enum {boolean} */
                writesApplied: true;
            } | {
                /** @enum {string} */
                type: "sync_snapshot";
                /** @enum {number} */
                protocolVersion: 1;
                /** Format: uuid */
                snapshotId: string;
                /** Format: uuid */
                requestedForDeviceId: string;
                watermarkCursor: string;
                entries: {
                    /** @enum {string} */
                    recordType: "note" | "task" | "reminder" | "notification" | "calendar" | "calendar_event" | "event_reminder_plan" | "calendar_entity" | "commitment" | "school_subject" | "school_course" | "school_assignment" | "school_lesson" | "school_assessment" | "attendance_record" | "performance_grade" | "performance_target" | "study_session" | "knowledge_gap" | "flashcard_deck" | "flashcard" | "scheduler_preferences" | "momentum_preferences" | "project" | "idea" | "goal" | "memory" | "integration_connection" | "insight" | "personal_data_item" | "interest" | "provider_calendar_action";
                    /** Format: uuid */
                    recordId: string;
                    revision: number;
                    /** @enum {string} */
                    changeKind: "upsert" | "tombstone";
                }[];
                entryCount: number;
                /** Format: date-time */
                generatedAt: string;
                /** @enum {boolean} */
                writesApplied: false;
            }) | {
                /** @enum {string} */
                type: "search_embedding";
                query: string;
                /** @enum {string} */
                mode: "hybrid" | "semantic";
                modelProfileId: string;
                embedding: number[];
            } | {
                /** @enum {string} */
                type: "worker_answer";
                /** Format: uuid */
                chatId: string;
                /** Format: uuid */
                messageId: string;
                answer: string;
                citationIds: string[];
                insufficientEvidence: boolean;
            } | {
                /** @enum {string} */
                type: "worker_study_plan";
                /** Format: uuid */
                studyPlanId: string;
                units: {
                    title: string;
                    objective: string;
                    /** @enum {string} */
                    kind: "read" | "explain" | "practice" | "recall" | "review";
                    materialSourceIds: string[];
                    estimatedMinutes: number;
                }[];
            } | {
                /** @enum {string} */
                type: "worker_study_exercises";
                /** Format: uuid */
                requestId: string;
                exercises: {
                    prompt: string;
                    answer: string | null;
                    explanation: string | null;
                    materialSourceIds: string[];
                }[];
            } | {
                /** @enum {string} */
                type: "worker_study_feedback";
                /** Format: uuid */
                attemptId: string;
                feedback: {
                    summary: string;
                    /** @enum {string} */
                    estimatedCorrectness: "correct" | "partly_correct" | "incorrect" | "insufficient_evidence";
                    scoreEstimate: number | null;
                    uncertainty: string;
                    materialSourceIds: string[];
                };
            } | {
                /** @enum {string} */
                type: "worker_transcript_analysis";
                /** Format: uuid */
                transcriptId: string;
                sourceRevision: number;
                /** @enum {string} */
                scope: "concept_summary" | "instructions" | "homework" | "dates" | "questions" | "all";
                content: {
                    conceptSummary: string[];
                    instructions: string[];
                    homework: string[];
                    dates: {
                        text: string;
                        normalizedDate: string | null;
                        uncertain: boolean;
                    }[];
                    questions: string[];
                    limitations: string[];
                };
                sourceSegmentIds: string[];
            } | {
                /** @enum {string} */
                type: "worker_artifact_generation";
                /** @enum {string} */
                kind: "summary" | "project_brief" | "comparison" | "outline" | "study_questions" | "checklist" | "catch_up" | "lesson_summary";
                title: string;
                contentMarkdown: string;
                sourceRecordIds: string[];
            } | {
                /** @enum {string} */
                type: "worker_task_breakdown";
                /** Format: uuid */
                taskId: string;
                steps: {
                    stepId: string;
                    title: string;
                    description: string;
                    dependsOnStepIds: string[];
                    sourceIds: string[];
                    estimatedMinutes: number;
                }[];
                uncertainty: string;
            };
        };
        WorkerFail: {
            leaseToken: string;
            errorCode: string;
            safeDetail: string;
            retryable: boolean;
        };
        WorkerSummary: {
            /** Format: uuid */
            id: string;
            name: string;
            /** @enum {string} */
            role: "model" | "scheduler" | "connector";
            vaultIds: string[];
            allowedJobTypes: ("note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge")[];
            paused: boolean;
            /** @enum {string} */
            resourcePolicy: "balanced" | "low_resource" | "gaming";
            /** @enum {string} */
            runtimeStatus: "offline" | "available" | "busy" | "error";
            installedProfiles: {
                id: string;
                model: string;
                digest: string;
                /**
                 * @default ollama
                 * @enum {string}
                 */
                backend: "ollama" | "openai_compatible";
            }[];
            /** Format: date-time */
            lastSeenAt: string | null;
            revision: number;
        };
        WorkerList: {
            items: {
                /** Format: uuid */
                id: string;
                name: string;
                /** @enum {string} */
                role: "model" | "scheduler" | "connector";
                vaultIds: string[];
                allowedJobTypes: ("note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge")[];
                paused: boolean;
                /** @enum {string} */
                resourcePolicy: "balanced" | "low_resource" | "gaming";
                /** @enum {string} */
                runtimeStatus: "offline" | "available" | "busy" | "error";
                installedProfiles: {
                    id: string;
                    model: string;
                    digest: string;
                    /**
                     * @default ollama
                     * @enum {string}
                     */
                    backend: "ollama" | "openai_compatible";
                }[];
                /** Format: date-time */
                lastSeenAt: string | null;
                revision: number;
            }[];
        };
        ConfigureWorker: {
            vaultIds?: string[];
            allowedJobTypes?: ("note_process" | "hybrid_search" | "semantic_search" | "ai_setup_test" | "index_rebuild" | "answer_generation" | "schedule_preview" | "proposal_apply" | "calendar_policy_dry_run" | "commitment_rematch" | "calendar_context_refresh" | "calendar_brief_refresh" | "calendar_import_preview" | "export_generate" | "study_plan_generate" | "study_exercise_generate" | "study_attempt_feedback" | "catch_up_plan" | "insight_generate" | "profile_refresh" | "sync_snapshot" | "domain_tool_run" | "source_refresh" | "transcript_analysis" | "url_capture" | "artifact_generate" | "performance_recommendations" | "task_breakdown" | "natural_language_command" | "connection_probe" | "profile_rebuild" | "personal_data_sync" | "import_plan" | "import_apply" | "school_import_preview" | "social_time_proposal" | "note_purge")[];
            paused?: boolean;
            /** @enum {string} */
            resourcePolicy?: "balanced" | "low_resource" | "gaming";
            expectedRevision: number;
        };
    };
    responses: {
        /** @description Request validation failed */
        BadRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    error: string;
                };
            };
        };
        /** @description Authentication required */
        Unauthorized: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @constant */
                    error: "authentication_required";
                };
            };
        };
        /** @description Internal error */
        InternalError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    /** @constant */
                    error: "internal_error";
                };
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listIntegrationProviders: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationProviderDescriptorList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    providerOAuthCallback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                providerId: "microsoft" | "google_calendar";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            302: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    microsoftOAuthCallback: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            303: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    microsoftChangeNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    googleCalendarChangeNotification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    listPeople: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonSummaryList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPersonContext: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                personId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonContext"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    proposeSocialTime: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                personId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeSocialTime"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    healthLive: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Health"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    healthReady: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Health"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    getMeta: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Meta"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    getPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Preferences"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updatePreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePreferences"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Preferences"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemStatus"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSystemJobs: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSystemJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJob"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    cancelSystemJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJob"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    retrySystemJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    streamSystemJobEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": components["schemas"]["JobEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listBackups: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BackupList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createBackup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBackup"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getBackupManifest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                backupId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BackupManifest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    downloadBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                backupId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    verifyBackup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                backupId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createRestorePlan: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRestorePlan"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    applyRestore: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                restorePlanId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyRestore"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getHostResources: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HostResourceReport"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getDeploymentProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeploymentProfile"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    checkDeployment: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CheckDeployment"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewRemoteAccessSetup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewRemoteAccessSetup"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getHostResourcePolicy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourcePolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setHostResourcePolicy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetHostResourcePolicy"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourcePolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listVaults: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VaultList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createVault: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateVault"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Vault"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getVault: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Vault"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateVault: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateVault"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Vault"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    purgeVault: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PurgeRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SystemJobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createUpload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUpload"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadSession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    putUploadPart: {
        parameters: {
            query?: never;
            header: {
                "content-range": string;
                "x-part-sha256": string;
            };
            path: {
                vaultId: string;
                uploadId: string;
                partNumber: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/octet-stream": string;
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    completeUpload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                uploadId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CompleteUpload"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlobSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    cancelUpload: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                uploadId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getBlobMetadata: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                blobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlobSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getBlobContent: {
        parameters: {
            query?: {
                download?: boolean;
            };
            header?: {
                range?: string;
                "x-job-id"?: string;
                "x-job-lease-token"?: string;
            };
            path: {
                vaultId: string;
                blobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": unknown;
                };
            };
            /** @description Success */
            206: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateExport"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    planImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PlanImport"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                importId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportManifest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    applyImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                importId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyImport"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                exportId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExportManifest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    downloadExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                exportId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/octet-stream": unknown;
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    bootstrapOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BootstrapOptionsInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebAuthnOptions"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    bootstrapVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebAuthnVerifyInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BootstrapResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    loginOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebAuthnOptions"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    loginVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebAuthnVerifyInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    getSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    recoverAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecoveryRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecoverySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    listPasskeys: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasskeyList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    passkeyOptions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasskeyOptionsRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebAuthnOptions"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    passkeyVerify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebAuthnVerifyInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PasskeySummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deletePasskey: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                passkeyId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    rotateRecoveryCodes: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecoveryCodes"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSessions: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionSummaryList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    revokeSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    refreshNativeToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshNativeToken"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TokenPair"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    createPairing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDevicePairing"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DevicePairingChallenge"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    approvePairing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pairingId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApproveDevicePairing"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DevicePairingApproval"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    exchangePairing: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                pairingId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExchangeDevicePairing"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PairingExchangeResult"];
                };
            };
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PairingExchangeResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            500: components["responses"]["InternalError"];
        };
    };
    listDevices: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeviceList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    revokeDevice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                deviceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getDeviceCachePolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                deviceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeviceCachePolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setDeviceCachePolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                deviceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetDeviceCachePolicy"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeviceCachePolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    requestDeviceCachePurge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                deviceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RequestDeviceCachePurge"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CachePurgeRequest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listApiTokens: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiTokenList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createApiToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateApiToken"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ApiTokenCreated"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    revokeApiToken: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                tokenId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listNotes: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateNote"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    trashNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExpectedNoteRevision"];
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateNoteMetadata: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNoteMetadata"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    purgeNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PurgeRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    restoreTrashedNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExpectedNoteRevision"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNoteDocument: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DocumentRepresentation"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    editNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditNote"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteRevision"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    reprocessNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReprocessNote"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listNoteRevisions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteRevisionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNoteRevision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
                revisionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteRevision"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    restoreNoteRevision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
                revisionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RestoreNoteRevision"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteRevision"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    correctOrganization: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CorrectNoteClassification"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CorrectionReceipt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listLabels: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LabelList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createLabel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateLabel"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Label"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteLabel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                labelId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateLabel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                labelId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateLabel"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Label"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNoteLabels: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteOrganization"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setNoteLabels: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetNoteLabels"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NoteOrganization"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCollections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCollection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCollection"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Collection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteCollection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                collectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCollection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                collectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCollection"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Collection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCollectionItems: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                collectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CollectionItems"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listRoutingRules: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutingRuleList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createRoutingRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRoutingRule"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutingRule"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteRoutingRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ruleId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateRoutingRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ruleId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateRoutingRule"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoutingRule"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewRoutingRule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RoutingRulePreview"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RulePreviewResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listRelationships: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelationshipList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createRelationship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRelationship"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Relationship"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteRelationship: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                relationshipId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getRelatedNotes: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                noteId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelatedResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    resurfacingFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResurfacingFeedbackInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResurfacingFeedback"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCapture: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCapture"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createUrlCapture: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUrlCapture"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    generateArtifact: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateArtifact"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCapture: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                captureId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capture"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listConnections: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationConnectionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateIntegrationConnection"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationConnection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationConnection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    beginProviderAuthorization: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AuthorizationRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthorizationStart"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    reauthorizeProvider: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReauthorizationRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthorizationStart"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getConnectionCapabilities: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationCapabilityList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    probeConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getConnectionMapping: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectionMapping"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setConnectionMapping: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetConnectionMapping"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectionMapping"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listConnectionResources: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectorResourceList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getConnectionSelection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceSelection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    selectConnectionResources: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResourceSelectionInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResourceSelection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    syncConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectionSyncResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getConnectionSyncStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectorSyncStatus"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setConnectionSchedule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConnectorSchedule"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectorSchedule"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewConnectionDisconnect: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewConnectionDisconnect"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConnectionDisconnectPreview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSourceObjects: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceObjectList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSourceObject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                sourceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceObjectDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    refreshSourceObject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                sourceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshSourceObject"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    excludeSourceObject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                sourceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SourceExclusionInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SourceExclusion"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listTranscripts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TranscriptList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getTranscript: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                transcriptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transcript"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    correctTranscript: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                transcriptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CorrectTranscript"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Transcript"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    associateTranscriptWithLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                transcriptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssociateTranscript"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TranscriptAssociation"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    analyzeTranscript: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                transcriptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AnalyzeTranscript"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    disconnectConnection: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DisconnectIntegration"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IntegrationConnection"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listInsights: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InsightList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    generateInsight: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateInsight"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getInsight: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                insightId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveInsight: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                insightId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateInsightFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                insightId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateInsight"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Insight"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listPersonalDataItems: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataItemList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    syncSelectedPersonalData: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SyncSelectedPersonalData"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPersonalDataPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataPolicies"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setPersonalDataPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetPersonalDataPolicies"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataPolicies"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPersonalDataItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                itemId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataItem"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deletePersonalDataItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                itemId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewPersonalDataImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewPersonalDataImport"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataImportPreview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPersonalDataImportPreview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                previewId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataImportPreview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    applyPersonalDataImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                previewId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApplyPersonalDataImport"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalDataImportReceipt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listInterests: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterestList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getInterest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                interestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Interest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateInterest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                interestId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateInterest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Interest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    refreshPersonalProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshPersonalProfile"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    rebuildPersonalProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RebuildPersonalProfile"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listInterestClaims: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterestList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getInterestEvidence: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                interestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InterestEvidenceList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    decideInterestClaim: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                interestId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DecideInterestClaim"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Interest"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listTasks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaskList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTask"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Task"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listProjects: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateProject"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                projectId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                projectId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                projectId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateProject"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listIdeas: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IdeaList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createIdea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateIdea"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Idea"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getIdea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ideaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Idea"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveIdea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ideaId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Idea"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateIdea: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ideaId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateIdea"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Idea"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listGoals: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GoalList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createGoal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGoal"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Goal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getGoal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                goalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Goal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveGoal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                goalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Goal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateGoal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                goalId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateGoal"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Goal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listMemories: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemoryList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateMemory"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Memory"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                memoryId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Memory"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                memoryId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Memory"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateMemory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                memoryId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMemory"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Memory"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPersonalProfile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonalProfile"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Task"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExpectedTaskRevision"];
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateTask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateTask"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Task"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getTaskExecutionHistory: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TaskExecutionHistory"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listReminders: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReminderList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createReminder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReminder"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Reminder"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteReminder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                reminderId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExpectedNoteRevision"];
            };
        };
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateReminder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                reminderId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateReminder"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Reminder"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listNotifications: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                notificationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateNotification"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Notification"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendarEntities: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEntityList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCalendarEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCalendarEntity"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEntity"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendarEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEntity"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveCalendarEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                entityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCalendarEntity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                entityId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCalendarEntity"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEntity"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    addEntityAlias: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                entityId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddEntityAlias"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EntityAlias"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    removeEntityAlias: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                entityId: string;
                aliasId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewEntityMerge: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewEntityMerge"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendarPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarPolicySet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setCalendarPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CalendarPolicySetInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarPolicySet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    dryRunCalendarPolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PolicyDryRunInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendarDecisions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AutomationDecisionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    undoCalendarDecision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                decisionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UndoCalendarDecision"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarDecisionUndoResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCommitments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommitmentList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCommitment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCommitment"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Commitment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCommitment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                commitmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommitmentDetail"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveCommitment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                commitmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCommitment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                commitmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCommitment"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Commitment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    rematchCommitment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                commitmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RematchCommitment"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendars: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCalendar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCalendar"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Calendar"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                calendarId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Calendar"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveCalendar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                calendarId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCalendar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                calendarId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCalendar"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Calendar"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendarEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEventList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCalendarEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCalendarEvent"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendarView: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarView"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendarBrief: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarBrief"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    refreshCalendarBrief: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CalendarBriefQuery"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCalendarEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    trashCalendarEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCalendarEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCalendarEvent"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    restoreCalendarEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendarEventRevisions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarEventRevisionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listEventOccurrences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventOccurrenceList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createEventException: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OccurrenceExceptionInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OccurrenceException"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    removeEventException: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
                exceptionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateEventException: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
                exceptionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOccurrenceException"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OccurrenceException"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    calendarFreeBusy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FreeBusyQuery"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FreeBusyResult"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCalendarConflicts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CalendarConflictList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewPreparationPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreparationPlanInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    exportCalendar: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CalendarExportInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewCalendarImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CalendarImportInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPrivateEventContext: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivateEventContext"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    refreshPrivateEventContext: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshPrivateEventContext"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getEventReminderPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventReminderPlan"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setEventReminderPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetEventReminderPlan"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventReminderPlan"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createPrepItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePrepItem"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrepItem"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    removePrepItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
                prepId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updatePrepItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
                prepId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePrepItem"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrepItem"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewProviderCalendarAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                eventId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewProviderCalendarAction"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listProviderCalendarActions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProviderCalendarActionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getProviderCalendarAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                actionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProviderCalendarAction"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    reconcileProviderCalendarAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                actionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    cancelPendingProviderCalendarAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                actionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProviderCalendarAction"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    searchNotes: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResponse"];
                };
            };
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listChats: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createChat: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateChat"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Chat"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getChat: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                chatId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Chat"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    deleteChat: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                chatId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listMessages: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                chatId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    askNotes: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                chatId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateChatMessage"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AskHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    suggestSearch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchSuggestions"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    resolveCitation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                citationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResolvedCitation"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listJobs: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    cancelJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    retryJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    streamJobEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": components["schemas"]["JobEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getAiStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AiStatus"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getVaultAiPolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VaultAiPolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setVaultAiPolicy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetVaultAiPolicy"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VaultAiPolicy"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewAiDisclosure: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AiDisclosurePreviewInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AiDisclosurePreview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listAgentTools: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ToolDescriptorList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    runDomainTool: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RunDomainTool"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getToolPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ToolPolicySet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setToolPolicies: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetToolPolicies"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ToolPolicySet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    executeNaturalLanguageCommand: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExecuteNaturalLanguageCommand"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listModelProfiles: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ModelProfileList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    testAiSetup: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AiTestRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listAiOperations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AiOperationList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getAiOperation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                operationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AiOperation"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    undoAiOperation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                operationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UndoAiOperation"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UndoReceipt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getActivity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ActivityEventList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSubjects: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolSubjectList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolSubject"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolSubject"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                subjectId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolSubject"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                subjectId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateSubject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                subjectId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolSubject"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolSubject"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCourses: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolCourseList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolCourse"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolCourse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolCourse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateCourse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolCourse"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolCourse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listCourseMaterials: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseMaterialLinkList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    linkCourseMaterial: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkCourseMaterial"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CourseMaterialLink"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    unlinkCourseMaterial: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
                materialLinkId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSchoolTeachers: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeacherViewList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchoolOverview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolOverview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewSchoolImport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewSchoolImport"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchoolConnectionReadiness: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                connectionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolReadinessReport"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSchoolAssignments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssignmentList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createManualSchoolAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolAssignment"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssignment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchoolAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssignment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveSchoolAssignment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateSchoolAssignmentOverlay: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolAssignment"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssignment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveSchoolAssignmentOverlay: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assignmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ArchiveSchoolAssignmentOverlay"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssignment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listSchoolLessons: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolLessonList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createSchoolLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolLesson"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolLesson"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchoolLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                schoolLessonId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolLesson"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveSchoolLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                schoolLessonId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateSchoolLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                schoolLessonId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolLesson"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolLesson"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createCatchUpPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCatchUpPlan"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listAssessments: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssessmentList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSchoolAssessment"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssessment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssessment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateAssessment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                assessmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSchoolAssessment"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAssessment"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listAttendanceRecords: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecordList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createAttendanceRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAttendanceRecord"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getAttendanceRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attendanceRecordId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveAttendanceRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attendanceRecordId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateAttendanceRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attendanceRecordId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAttendanceRecord"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getAttendanceSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttendanceSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewAttendanceCatchUp: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewAttendanceCatchUp"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listGrades: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceGradeList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createGrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreatePerformanceGrade"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceGrade"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getGrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceGrade"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveGrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateGrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdatePerformanceGrade"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceGrade"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listGradeRecords: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradeRecordList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGradeRecord"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradeRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeRecordId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradeRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeRecordId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ArchiveGradeRecord"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradeRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateGradeRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gradeRecordId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateGradeRecord"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GradeRecord"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listPerformanceTargets: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceTargetList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setPerformanceTarget: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetPerformanceTarget"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceTarget"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    removePerformanceTarget: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                courseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getPerformanceSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PerformanceSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    generateStudyRecommendations: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GeneratePerformanceRecommendations"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listStudyPlans: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyPlanList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createStudyPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudyPlan"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStudyPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studyPlanId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyPlan"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveStudyPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studyPlanId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateStudyPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studyPlanId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateStudyPlan"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyPlan"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    withdrawStudyPlan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studyPlanId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawStudyPlan"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyWithdrawalProposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listStudyExercises: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyExerciseList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    generateStudyExercise: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudyExercise"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStudyExercise: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                exerciseId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyExercise"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    submitStudyAttempt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                exerciseId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudyAttempt"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyAttempt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listStudyAttempts: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyAttemptList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStudyAttempt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyAttempt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    gradeStudyAttempt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RequestStudyFeedback"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    correctStudyFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CorrectStudyFeedback"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyAttempt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listStudyActivities: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyActivityList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createStudyActivity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudyActivity"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStudyActivity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                activityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudyActivity"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveStudyActivity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                activityId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    submitStudyResponse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                activityId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitStudyResponse"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listStudySessions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudySessionList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createStudySession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateStudySession"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getStudySession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studySessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveStudySession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studySessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    applyStudySessionAction: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                studySessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StudySessionAction"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudySession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listKnowledgeGaps: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeGapList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createReportedKnowledgeGap: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReportedKnowledgeGap"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeGap"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateKnowledgeGap: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gapId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateKnowledgeGap"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeGap"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    correctKnowledgeGap: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                gapId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CorrectKnowledgeGap"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["KnowledgeGap"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listFlashcardDecks: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardDeckList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createFlashcardDeck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFlashcardDeck"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardDeck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getFlashcardDeck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardDeckId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardDeck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveFlashcardDeck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardDeckId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateFlashcardDeck: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardDeckId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFlashcardDeck"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardDeck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listFlashcards: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createFlashcard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateFlashcard"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Flashcard"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getFlashcard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Flashcard"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    archiveFlashcard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    updateFlashcard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateFlashcard"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Flashcard"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getFlashcardReviewQueue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardReviewQueue"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    recordFlashcardReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordFlashcardReview"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardReview"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    reviewFlashcard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                flashcardId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewFlashcard"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlashcardReviewReceipt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchedulerPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchedulerPreferences"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setSchedulerPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetSchedulerPreferences"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchedulerPreferences"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewSchedule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SchedulePreviewRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getSchedulingConstraints: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchedulingConstraints"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setSchedulingConstraints: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetSchedulingConstraints"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchedulingConstraints"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    proposeSchedule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeSchedule"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewReplan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScheduleReplanRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    proposeReplan: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ScheduleReplanRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getScheduleExplanation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                proposalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ScheduleExplanation"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listProposals: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProposalList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposalInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                proposalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    rejectProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                proposalId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RejectProposal"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    acceptProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                proposalId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcceptProposal"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    undoProposalApplication: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                proposalId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UndoProposal"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProposalUndoReceipt"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    previewIdeaPromotion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ideaId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewIdeaPromotion"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    proposeIdeaProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                ideaId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeIdeaProject"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Proposal"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    proposeTaskBreakdown: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProposeTaskBreakdown"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    startExecutionSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StartExecutionSession"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExecutionSession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getExecutionSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                executionSessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExecutionSession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    transitionExecutionSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
                executionSessionId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TransitionExecutionSession"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExecutionSession"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getIndexStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IndexStatus"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    rebuildIndex: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RebuildIndexRequest"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    workerHeartbeat: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerHeartbeatRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerHeartbeatResponse"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    claimWorkerJob: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClaimWorkerJobRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerLease"];
                };
            };
            /** @description No content */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getWorkerJobInput: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerJobInput"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getWorkerJobSource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
                sourceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerSourceInput"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getWorkerJobEvidence: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerEvidenceRequest"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerEvidencePacket"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    appendWorkerIndexBatch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerIndexBatch"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IndexBatchAck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    renewWorkerLease: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerLeaseHeartbeat"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LeaseState"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    appendWorkerEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerProgressEvents"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventAck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    completeWorkerJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerComplete"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    failWorkerJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WorkerFail"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    listWorkers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerList"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    configureWorker: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                workerId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfigureWorker"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WorkerSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getToday: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Today"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNextActionCandidates: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NextActionSet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getNextActions: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NextActionSet"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    getMomentumSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MomentumSummary"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    setMomentumPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMomentumPreferences"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MomentumPreferences"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    pullSync: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncBatch"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    pushSync: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PushSync"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncAck"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    createSyncSnapshot: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateSyncSnapshot"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JobHandle"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    openSyncSocket: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            101: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncSocketServerFrame"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
    streamVaultEvents: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                vaultId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": components["schemas"]["VaultChangeEvent"];
                };
            };
            400: components["responses"]["BadRequest"];
            401: components["responses"]["Unauthorized"];
            500: components["responses"]["InternalError"];
        };
    };
}
