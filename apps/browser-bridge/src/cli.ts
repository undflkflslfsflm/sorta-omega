import { chromium, type Page } from "playwright-core";
import { link, mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { inSchoolSnapshot,teamsNotes } from "./normalize.js";

const args=new Map<string,string>();for(let index=2;index<process.argv.length;index+=2){const key=process.argv[index],value=process.argv[index+1];if(!key?.startsWith("--")||!value)throw new Error("usage: browser-bridge --provider teams|inschool --profile <absolute-directory> --output <absolute-json-file> [--origin https://county.inschool.visma.no]");args.set(key.slice(2),value);}
const provider=args.get("provider"),profile=args.get("profile"),destination=args.get("output");if(!["teams","inschool"].includes(provider??"")||!profile||!destination||!path.isAbsolute(profile)||!path.isAbsolute(destination))throw new Error("browser_bridge_requires_provider_and_absolute_profile_output_paths");
const profileRoot=path.resolve(profile),artifactPath=path.resolve(destination),relativeToProfile=path.relative(profileRoot,artifactPath);if(path.extname(artifactPath).toLowerCase()!==".json"||relativeToProfile===""||!relativeToProfile.startsWith("..")&&!path.isAbsolute(relativeToProfile))throw new Error("browser_bridge_output_must_be_json_outside_profile");

async function writeNewArtifact(value:unknown){await mkdir(path.dirname(artifactPath),{recursive:true});const temporary=`${artifactPath}.${process.pid}.tmp`;await writeFile(temporary,`${JSON.stringify(value,null,2)}\n`,{flag:"wx"});try{await link(temporary,artifactPath);}finally{await unlink(temporary).catch(()=>undefined);}}

function assertAllowed(page:Page){const url=new URL(page.url());if(url.protocol!=="https:")throw new Error("browser_bridge_https_required");if(provider==="teams"&&url.hostname!=="teams.microsoft.com")throw new Error("teams_navigation_left_registered_origin");if(provider==="inschool"&&!url.hostname.endsWith(".inschool.visma.no"))throw new Error("inschool_navigation_left_registered_origin");}

async function scrollToOldest(page:Page){for(let attempt=0,stable=0,previous="";attempt<200&&stable<4;attempt++){const state=await page.evaluate(()=>{const candidates=[...document.querySelectorAll<HTMLElement>('[data-tid="message-pane-list-runway"], [role="log"], [data-tid="chat-pane-list"]')],target=candidates.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];if(!target)return"missing";target.scrollTop=0;return`${target.scrollHeight}:${target.textContent?.slice(0,200)??""}`;});stable=state===previous?stable+1:0;previous=state;await page.waitForTimeout(750);}}

const context=await chromium.launchPersistentContext(path.resolve(profile),{channel:"msedge",headless:false,acceptDownloads:false,args:["--disable-features=PasswordLeakDetection"]}),pages=context.pages(),page=pages[0]??await context.newPage(),terminal=createInterface({input,output});
try{
  if(provider==="teams"){
    await page.goto("https://teams.microsoft.com/",{waitUntil:"domcontentloaded"});
    await terminal.question("Sign in interactively if needed, open the exact chat or channel you want to export, then press Enter here. ");assertAllowed(page);await scrollToOldest(page);
    const selectors=['[data-tid="chat-pane-message"]','[data-tid="message-pane-list-runway"] [role="listitem"]','[role="log"] [role="listitem"]'];let texts:string[]=[];for(const selector of selectors){texts=await page.locator(selector).allTextContents();if(texts.length)break;}if(!texts.length)throw new Error("teams_message_elements_not_found_layout_review_required");const capturedAt=new Date().toISOString(),notes=teamsNotes(texts,capturedAt);await writeNewArtifact(notes);console.log(JSON.stringify({provider:"teams",format:"omega_notes_json_v1",visibleElementCount:texts.length,itemCount:notes.length,itemLimit:500,output:artifactPath,sessionRetainedInProfile:true,credentialsExported:false,liveConnectionCreated:false,coverageLimitation:texts.length>500?"At most 500 normalized visible messages are exported per snapshot.":null}));
  }else{
    const origin=new URL(args.get("origin")??"");if(origin.protocol!=="https:"||!origin.hostname.endsWith(".inschool.visma.no")||origin.username||origin.password)throw new Error("registered_inschool_origin_required");await page.goto(origin.origin,{waitUntil:"domcontentloaded"});
    await terminal.question("Sign in through Feide interactively if needed, open the exact timetable week to snapshot, then press Enter here. ");assertAllowed(page);const selectors=['[data-testid*="lesson" i]','[data-testid*="schedule" i] [role="button"]','[class*="lesson" i]','[class*="timetable" i] [role="button"]'];let texts:string[]=[];for(const selector of selectors){texts=await page.locator(selector).allTextContents();if(texts.length)break;}if(!texts.length)throw new Error("inschool_lesson_elements_not_found_layout_review_required");const capturedAt=new Date().toISOString(),snapshot=inSchoolSnapshot(texts,capturedAt);await writeNewArtifact(snapshot);console.log(JSON.stringify({provider:"inschool",format:"omega_school_json_v1",visibleElementCount:texts.length,itemCount:snapshot.records.length,itemLimit:1000,output:artifactPath,sessionRetainedInProfile:true,credentialsExported:false,liveConnectionCreated:false,coverageLimitation:texts.length>1000?"At most 1000 normalized visible timetable elements are exported per snapshot.":null}));
  }
}finally{terminal.close();await context.close();}
