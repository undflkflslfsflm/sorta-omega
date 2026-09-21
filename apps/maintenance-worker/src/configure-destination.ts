import path from "node:path";
import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { maintenanceConfig } from "./config.js";

const args=new Map<string,string>();for(let index=2;index<process.argv.length;index+=2){const key=process.argv[index],value=process.argv[index+1];if(!key?.startsWith("--")||!value)throw new Error("usage: backup:configure --label <label> --root <absolute-path>");args.set(key.slice(2),value);}
const label=args.get("label")?.trim(),rawRoot=args.get("root");if(!label||label.length>200||!rawRoot||!path.isAbsolute(rawRoot))throw new Error("backup_destination_requires_label_and_absolute_root");
const storageRoot=path.resolve(rawRoot);await mkdir(storageRoot,{recursive:true});const pool=new Pool({connectionString:maintenanceConfig.DATABASE_URL,max:1});
try{const result=await pool.query<{id:string}>("INSERT INTO backup_destinations(id,label,storage_root,encryption_profile_id,active) VALUES ($1,$2,$3,'aes-256-gcm-host-v1',true) ON CONFLICT(label) DO UPDATE SET storage_root=EXCLUDED.storage_root,encryption_profile_id=EXCLUDED.encryption_profile_id,active=true,updated_at=now() RETURNING id",[randomUUID(),label,storageRoot]);console.log(JSON.stringify({destinationId:result.rows[0].id,label,storageRoot,encryptionProfileId:"aes-256-gcm-host-v1"}));}finally{await pool.end();}
