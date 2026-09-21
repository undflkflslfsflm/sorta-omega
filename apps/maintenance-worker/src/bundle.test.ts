import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { describe,expect,it } from "vitest";
import { decryptBackup,encryptBackup,safeChild,validateExtractedBackup } from "./bundle.js";

describe("encrypted maintenance bundles",()=>{
  it("authenticates ciphertext and rejects traversal",()=>{const key=Buffer.alloc(32,7),plain=Buffer.from("private backup");expect(decryptBackup(encryptBackup(plain,key),key)).toEqual(plain);const damaged=encryptBackup(plain,key);damaged[damaged.length-1]^=1;expect(()=>decryptBackup(damaged,key)).toThrow();expect(()=>safeChild("C:/safe","../escape")).toThrow("unsafe_backup_path");});
  it("validates every dump and blob hash",async()=>{const root=await mkdtemp(path.join(os.tmpdir(),"omega-backup-test-")),blobs=path.join(root,"blobs"),dump=Buffer.from("dump"),blob=Buffer.from("blob");await mkdir(blobs);await writeFile(path.join(root,"database.dump"),dump);await writeFile(path.join(blobs,"a.bin"),blob);const hash=(value:Buffer)=>createHash("sha256").update(value).digest("hex");await writeFile(path.join(root,"manifest.json"),JSON.stringify({format:"sorta-omega-backup-v2",dump_file:"database.dump",dump_sha256:hash(dump),dump_bytes:dump.length,blob_directory:"blobs",blob_count:1,blob_bytes:blob.length,blobs:[{path:"a.bin",sha256:hash(blob),bytes:blob.length}]}));expect((await validateExtractedBackup(root)).blob_count).toBe(1);await writeFile(path.join(blobs,"a.bin"),"tampered");await expect(validateExtractedBackup(root)).rejects.toThrow("backup_blob_integrity_failure");});
});
