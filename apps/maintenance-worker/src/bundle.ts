import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const magic=Buffer.from("SORTAOMEGA1","ascii");

export function encryptBackup(plain:Buffer,key:Buffer){
  if(key.length!==32)throw new Error("backup_key_must_be_32_bytes");
  const iv=randomBytes(12),cipher=createCipheriv("aes-256-gcm",key,iv),encrypted=Buffer.concat([cipher.update(plain),cipher.final()]),tag=cipher.getAuthTag();
  return Buffer.concat([magic,iv,tag,encrypted]);
}

export function decryptBackup(encrypted:Buffer,key:Buffer){
  if(key.length!==32||encrypted.length<magic.length+28||!encrypted.subarray(0,magic.length).equals(magic))throw new Error("invalid_encrypted_backup");
  const iv=encrypted.subarray(magic.length,magic.length+12),tag=encrypted.subarray(magic.length+12,magic.length+28),payload=encrypted.subarray(magic.length+28),decipher=createDecipheriv("aes-256-gcm",key,iv);decipher.setAuthTag(tag);return Buffer.concat([decipher.update(payload),decipher.final()]);
}

export function safeChild(root:string,candidate:string){const resolvedRoot=path.resolve(root),resolved=path.resolve(resolvedRoot,candidate),relative=path.relative(resolvedRoot,resolved);if(!relative||relative.startsWith("..")||path.isAbsolute(relative))throw new Error("unsafe_backup_path");return resolved;}

export async function sha256File(file:string){const hash=createHash("sha256");for await(const chunk of createReadStream(file))hash.update(chunk as Buffer);return hash.digest("hex");}

type Manifest={format:string;dump_file:string;dump_sha256:string;dump_bytes:number;blob_directory:string;blob_count:number;blob_bytes:number;blobs:Array<{path:string;sha256:string;bytes:number}>};

export async function validateExtractedBackup(root:string){
  const manifest=JSON.parse(await readFile(path.join(root,"manifest.json"),"utf8")) as Manifest;
  if(manifest.format!=="sorta-omega-backup-v2"||!Array.isArray(manifest.blobs))throw new Error("unsupported_backup_manifest");
  const dump=safeChild(root,manifest.dump_file);if((await stat(dump)).size!==manifest.dump_bytes||await sha256File(dump)!==manifest.dump_sha256)throw new Error("backup_dump_integrity_failure");
  const blobRoot=safeChild(root,manifest.blob_directory),seen=new Set<string>();let bytes=0;
  for(const entry of manifest.blobs){if(!entry.path||entry.path.includes("\\")||entry.path.startsWith("/")||entry.path.split("/").includes("..")||seen.has(entry.path))throw new Error("unsafe_backup_blob_manifest");seen.add(entry.path);const file=safeChild(blobRoot,entry.path),info=await stat(file);if(!info.isFile()||info.size!==entry.bytes||await sha256File(file)!==entry.sha256)throw new Error("backup_blob_integrity_failure");bytes+=entry.bytes;}
  const actual:string[]=[];async function walk(directory:string){for(const entry of await readdir(directory,{withFileTypes:true})){const target=path.join(directory,entry.name);if(entry.isDirectory())await walk(target);else if(entry.isFile())actual.push(path.relative(blobRoot,target).replaceAll("\\","/"));}}await walk(blobRoot);
  if(actual.length!==manifest.blob_count||seen.size!==manifest.blob_count||bytes!==manifest.blob_bytes||actual.some(item=>!seen.has(item)))throw new Error("backup_blob_manifest_incomplete");
  return manifest;
}

export async function writeEncryptedBundle(zipPath:string,outputPath:string,key:Buffer){await mkdir(path.dirname(outputPath),{recursive:true});await writeFile(outputPath,encryptBackup(await readFile(zipPath),key),{flag:"wx"});}
