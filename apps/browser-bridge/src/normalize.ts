import { createHash } from "node:crypto";

export function cleanVisibleTexts(values:string[],limit=500,totalByteLimit=20*1024*1024){const seen=new Set<string>(),items:string[]=[];let totalBytes=0;for(const value of values){const clean=value.replace(/\u00a0/g," ").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();if(!clean||clean.length>100_000||seen.has(clean))continue;const byteLength=Buffer.byteLength(clean,"utf8");if(totalBytes+byteLength>totalByteLimit)break;seen.add(clean);items.push(clean);totalBytes+=byteLength;if(items.length>=limit)break;}return items;}

export function teamsNotes(values:string[],capturedAt:string){return cleanVisibleTexts(values).map((body,index)=>({id:createHash("sha256").update(`teams:${body}`).digest("hex"),title:`Teams chat item ${index+1} · ${capturedAt.slice(0,10)}`,body:`Imported from the owner-selected Teams web conversation at ${capturedAt}. This is a browser snapshot, not live synchronization.\n\n${body}`,path:`teams/${String(index+1).padStart(5,"0")}.json`}));}

export function inSchoolSnapshot(values:string[],capturedAt:string){return{version:"omega_school_json_v1",source_timestamp:capturedAt,records:cleanVisibleTexts(values,1_000).map(text=>({kind:"lesson",externalId:createHash("sha256").update(`inschool:${text}`).digest("hex"),title:text.slice(0,1_000)}))};}
