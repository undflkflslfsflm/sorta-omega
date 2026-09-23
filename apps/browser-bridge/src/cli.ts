import { chromium, type Browser, type Page } from "playwright-core";
import { link, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { inSchoolTimetableSnapshot,teamsNotes,type InSchoolVisibleLesson } from "./normalize.js";

const args=new Map<string,string>();for(let index=2;index<process.argv.length;index+=2){const key=process.argv[index],value=process.argv[index+1];if(!key?.startsWith("--")||!value)throw new Error("usage: browser-bridge --provider teams|inschool --output <absolute-json-file> [--origin https://county.inschool.visma.no] (--profile <absolute-directory> OR --cdp http://127.0.0.1:9222 OR --cdp-profile <absolute-directory> --noninteractive true)");args.set(key.slice(2),value);}
const provider=args.get("provider"),profile=args.get("profile"),cdpProfile=args.get("cdp-profile"),destination=args.get("output"),noninteractive=args.get("noninteractive")==="true";
let cdp=args.get("cdp");
if(!["teams","inschool"].includes(provider??"")||!destination||!path.isAbsolute(destination)||(!profile&&!cdp&&!cdpProfile)||profile&&!path.isAbsolute(profile)||cdpProfile&&!path.isAbsolute(cdpProfile)||cdp&&cdpProfile)throw new Error("browser_bridge_requires_provider_and_absolute_output_plus_profile_or_cdp");
if(cdpProfile){const [portText,socketPath]=(await readFile(path.join(cdpProfile,"DevToolsActivePort"),"utf8")).trim().split(/\r?\n/),port=Number(portText);if(!Number.isInteger(port)||port<1024||port>65535||!/^\/devtools\/browser\/[a-zA-Z0-9-]+$/.test(socketPath??""))throw new Error("browser_bridge_cdp_profile_port_invalid");cdp=`ws://127.0.0.1:${port}${socketPath}`;}
if(cdp){const url=new URL(cdp);if(!["http:","ws:"].includes(url.protocol)||!["127.0.0.1","localhost"].includes(url.hostname)||url.username||url.password||url.search||url.hash||url.protocol==="http:"&&url.pathname!=="/"||url.protocol==="ws:"&&!/^\/devtools\/browser\/[a-zA-Z0-9-]+$/.test(url.pathname))throw new Error("browser_bridge_cdp_must_be_local_loopback");}
if(noninteractive&&!cdp)throw new Error("browser_bridge_noninteractive_requires_attached_browser");
const artifactPath=path.resolve(destination);if(path.extname(artifactPath).toLowerCase()!==".json")throw new Error("browser_bridge_output_must_be_json");
for(const root of [profile,cdpProfile].filter((value):value is string=>Boolean(value))){const profileRoot=path.resolve(root),relativeToProfile=path.relative(profileRoot,artifactPath);if(relativeToProfile===""||!relativeToProfile.startsWith("..")&&!path.isAbsolute(relativeToProfile))throw new Error("browser_bridge_output_must_be_outside_profile");}

async function writeNewArtifact(value:unknown){await mkdir(path.dirname(artifactPath),{recursive:true});const temporary=`${artifactPath}.${process.pid}.tmp`;await writeFile(temporary,`${JSON.stringify(value,null,2)}\n`,{flag:"wx"});try{await link(temporary,artifactPath);}finally{await unlink(temporary).catch(()=>undefined);}}

function assertAllowed(page:Page){const url=new URL(page.url());if(url.protocol!=="https:")throw new Error("browser_bridge_https_required");if(provider==="teams"&&!['teams.microsoft.com','teams.cloud.microsoft'].includes(url.hostname))throw new Error("teams_navigation_left_registered_origin");if(provider==="inschool"&&!url.hostname.endsWith(".inschool.visma.no"))throw new Error("inschool_navigation_left_registered_origin");}

async function scrollToOldest(page:Page){for(let attempt=0,stable=0,previous="";attempt<200&&stable<4;attempt++){const state=await page.evaluate(()=>{const candidates=[...document.querySelectorAll<HTMLElement>('[data-tid="message-pane-list-runway"], [role="log"], [data-tid="chat-pane-list"]')],target=candidates.sort((a,b)=>b.scrollHeight-a.scrollHeight)[0];if(!target)return"missing";target.scrollTop=0;return`${target.scrollHeight}:${target.textContent?.slice(0,200)??""}`;});stable=state===previous?stable+1:0;previous=state;await page.waitForTimeout(750);}}

const browser:Browser|null=cdp?await chromium.connectOverCDP(cdp).catch(()=>{throw new Error("browser_bridge_cdp_connection_failed");}):null;
const context=browser?browser.contexts()[0]:await chromium.launchPersistentContext(path.resolve(profile!),{channel:"msedge",headless:false,acceptDownloads:false,args:["--disable-features=PasswordLeakDetection"]});
if(!context){await browser?.close();throw new Error("browser_bridge_cdp_context_not_found");}
const pages=context.pages(),existing=cdp?pages.find(candidate=>{try{const url=new URL(candidate.url());return provider==="teams"?['teams.microsoft.com','teams.cloud.microsoft'].includes(url.hostname):url.hostname.endsWith(".inschool.visma.no");}catch{return false;}}):null;
const terminal=createInterface({input,output});
try{
  if(cdp&&!existing)throw new Error("browser_bridge_matching_signed_in_tab_not_found");
  const page=existing??pages[0]??await context.newPage();
  if(provider==="teams"){
    if(!cdp)await page.goto("https://teams.microsoft.com/",{waitUntil:"domcontentloaded"});
    if(!noninteractive)await terminal.question("Sign in interactively if needed, open the exact chat or channel you want to export, then press Enter here. ");assertAllowed(page);await scrollToOldest(page);
    const selectors=['[data-tid="chat-pane-message"]','[data-tid="message-pane-list-runway"] [role="listitem"]','[role="log"] [role="listitem"]'];let texts:string[]=[];for(const selector of selectors){texts=await page.locator(selector).allTextContents();if(texts.length)break;}if(!texts.length)throw new Error("teams_message_elements_not_found_layout_review_required");const capturedAt=new Date().toISOString(),notes=teamsNotes(texts,capturedAt);await writeNewArtifact(notes);console.log(JSON.stringify({provider:"teams",format:"omega_notes_json_v1",visibleElementCount:texts.length,itemCount:notes.length,itemLimit:500,output:artifactPath,sessionRetainedInProfile:true,credentialsExported:false,liveConnectionCreated:false,coverageLimitation:texts.length>500?"At most 500 normalized visible messages are exported per snapshot.":null}));
  }else{
    const origin=new URL(args.get("origin")??"");if(origin.protocol!=="https:"||!origin.hostname.endsWith(".inschool.visma.no")||origin.username||origin.password)throw new Error("registered_inschool_origin_required");if(!cdp)await page.goto(origin.origin,{waitUntil:"domcontentloaded"});
    if(!noninteractive)await terminal.question("Sign in through Feide interactively if needed, open the timetable, then press Enter here. ");
    assertAllowed(page);
    if(new URL(page.url()).origin!==origin.origin)throw new Error("inschool_tab_origin_does_not_match_registered_origin");
    const items=await page.evaluate(String.raw`(() => [...document.querySelectorAll('.Timetable-TimetableItem[starttimeanddateunix]')].map(element => ({
      entityId: element.getAttribute('entityid') ?? '',
      teachingGroupId: element.getAttribute('teachinggroupid') ?? '',
      startUnix: element.getAttribute('starttimeanddateunix') ?? '',
      hours: element.querySelector('.Timetable-TimetableItem-hours')?.textContent ?? '',
      subjectCode: element.getAttribute('subjectcode') ?? '',
      subjectName: element.querySelector('.Timetable-TimetableItem-subject-name')?.textContent ?? '',
      room: element.querySelector('.Timetable-TimetableItem-location')?.textContent ?? '',
      teachers: element.querySelector('.Timetable-TimetableItem-teachers')?.textContent ?? '',
      lessonType: element.getAttribute('tttype') ?? '',
    })))()` ) as InSchoolVisibleLesson[];
    if(!items.length)throw new Error("inschool_lesson_elements_not_found_layout_review_required");
    const capturedAt=new Date().toISOString(),snapshot={...inSchoolTimetableSnapshot(items,capturedAt),source_origin:origin.origin};
    if(!snapshot.records.some(record=>record.kind==="lesson"))throw new Error("inschool_lesson_times_not_parsed_layout_review_required");
    await writeNewArtifact(snapshot);
    console.log(JSON.stringify({provider:"inschool",format:"omega_school_json_v1",visibleElementCount:items.length,itemCount:snapshot.records.length,itemLimit:1000,output:artifactPath,sessionRetainedInProfile:true,credentialsExported:false,liveConnectionCreated:false,coverageLimitation:"This capture covers the currently visible timetable week only. Absence and grade details are not yet included."}));
  }
}finally{terminal.close();if(browser)await browser.close();else await context.close();}
