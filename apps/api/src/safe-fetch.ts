import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import http from "node:http";
import https from "node:https";

const MAX_BYTES=5*1024*1024;
const blockedHostSuffixes=[".localhost",".local",".internal",".lan",".home",".home.arpa"];

export function isPublicAddress(address:string){
  const version=isIP(address);if(!version)return false;
  if(version===4){const parts=address.split(".").map(Number),[a,b,c]=parts;
    return !(a===0||a===10||a===127||(a===100&&b>=64&&b<=127)||(a===169&&b===254)||(a===172&&b>=16&&b<=31)||(a===192&&b===168)||(a===192&&b===0&&c===0)||(a===192&&b===0&&c===2)||(a===198&&(b===18||b===19))||(a===198&&b===51&&c===100)||(a===203&&b===0&&c===113)||a>=224);
  }
  const value=address.toLowerCase();if(value.startsWith("::ffff:"))return isPublicAddress(value.slice(7));
  return !(value==="::"||value==="::1"||value.startsWith("fc")||value.startsWith("fd")||/^fe[89ab]/.test(value)||value.startsWith("ff")||value.startsWith("2001:db8:"));
}

export function validatePublicUrl(raw:string){
  let url:URL;try{url=new URL(raw);}catch{throw new Error("invalid_url");}
  if(!["http:","https:"].includes(url.protocol))throw new Error("unsafe_url_scheme");
  if(url.username||url.password)throw new Error("url_credentials_forbidden");
  if((url.protocol==="http:"&&url.port&&url.port!=="80")||(url.protocol==="https:"&&url.port&&url.port!=="443"))throw new Error("unsafe_url_port");
  const host=url.hostname.toLowerCase().replace(/\.$/,"");
  if(!host||host==="localhost"||host==="metadata.google.internal"||blockedHostSuffixes.some(suffix=>host.endsWith(suffix)))throw new Error("private_url_forbidden");
  if(isIP(host)&&!isPublicAddress(host))throw new Error("private_url_forbidden");
  url.hostname=host;url.hash="";return url;
}

async function resolvePublic(host:string){
  if(isIP(host)){if(!isPublicAddress(host))throw new Error("private_url_forbidden");return [{address:host,family:isIP(host)}];}
  let addresses;try{addresses=await lookup(host,{all:true,verbatim:true});}catch{throw new Error("url_dns_failed");}
  if(!addresses.length||addresses.some(item=>!isPublicAddress(item.address)))throw new Error("private_url_forbidden");
  return addresses;
}

function requestPinned(url:URL,address:{address:string;family:number}){
  return new Promise<{status:number;headers:http.IncomingHttpHeaders;body:Buffer}>((resolve,reject)=>{
    const transport=url.protocol==="https:"?https:http;
    const request=transport.request({protocol:url.protocol,hostname:address.address,port:url.port||undefined,path:`${url.pathname}${url.search}`,method:"GET",servername:url.protocol==="https:"?url.hostname:undefined,headers:{Host:url.host,"User-Agent":"Sorta-Omega-SafeFetcher/1.0","Accept":"text/html,application/xhtml+xml,text/plain;q=0.9","Accept-Encoding":"identity"},timeout:15_000},response=>{
      const chunks:Buffer[]=[];let size=0;response.on("data",chunk=>{const part=Buffer.from(chunk);size+=part.length;if(size>MAX_BYTES){request.destroy(new Error("url_response_too_large"));return;}chunks.push(part);});response.on("end",()=>resolve({status:response.statusCode??0,headers:response.headers,body:Buffer.concat(chunks)}));
    });
    request.on("timeout",()=>request.destroy(new Error("url_fetch_timeout")));request.on("error",reject);request.end();
  });
}

export type SafeFetchResult={requestedUrl:string;finalUrl:string;contentType:string;etag:string|null;lastModified:string|null;title:string|null;text:string;byteLength:number;redirects:string[]};
export async function safeFetchText(raw:string):Promise<SafeFetchResult>{
  const requested=validatePublicUrl(raw);let current=requested,redirects:string[]=[];
  for(let hop=0;hop<=5;hop+=1){const addresses=await resolvePublic(current.hostname);const response=await requestPinned(current,addresses[0]);
    if([301,302,303,307,308].includes(response.status)){const location=response.headers.location;if(!location)throw new Error("redirect_location_missing");if(hop===5)throw new Error("too_many_redirects");const next=validatePublicUrl(new URL(location,current).toString());redirects.push(next.toString());current=next;continue;}
    if(response.status<200||response.status>=300)throw new Error(`url_http_${response.status}`);
    const contentType=String(response.headers["content-type"]??"text/plain").split(";",1)[0].toLowerCase();if(!["text/html","application/xhtml+xml","text/plain"].includes(contentType))throw new Error("unsupported_url_content_type");
    const rawText=response.body.toString("utf8");const title=contentType==="text/plain"?null:(rawText.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]??null);const withoutActive=rawText.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi," ");const text=contentType==="text/plain"?rawText:withoutActive.replace(/<br\s*\/?\s*>/gi,"\n").replace(/<\/p\s*>/gi,"\n").replace(/<[^>]+>/g," ").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&#39;/gi,"'").replace(/&quot;/gi,'"').replace(/[ \t]+/g," ").replace(/\n\s*\n\s*\n+/g,"\n\n").trim();
    return{requestedUrl:requested.toString(),finalUrl:current.toString(),contentType,etag:typeof response.headers.etag==="string"?response.headers.etag:null,lastModified:typeof response.headers["last-modified"]==="string"?response.headers["last-modified"]:null,title:title?.replace(/<[^>]+>/g,"").trim().slice(0,240)||null,text:text.slice(0,200_000),byteLength:response.body.length,redirects};
  }
  throw new Error("too_many_redirects");
}
