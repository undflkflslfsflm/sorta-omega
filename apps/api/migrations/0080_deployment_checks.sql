ALTER TABLE system_jobs DROP CONSTRAINT IF EXISTS system_jobs_kind_check;
ALTER TABLE system_jobs ADD CONSTRAINT system_jobs_kind_check CHECK (kind IN ('backup_create','backup_verify','restore_plan','restore_apply','deployment_check'));
