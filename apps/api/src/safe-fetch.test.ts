import {describe,expect,it} from "vitest";
import {isPublicAddress,validatePublicUrl} from "./safe-fetch.js";

describe("public URL safety",()=>{
  it("rejects private, link-local, metadata, credential and unsafe-port targets",()=>{
    for(const value of ["http://127.0.0.1/","http://10.0.0.1/","http://169.254.169.254/latest/meta-data/","http://metadata.google.internal/","http://user:pass@example.com/","https://example.com:8443/"])expect(()=>validatePublicUrl(value)).toThrow();
  });
  it("accepts ordinary public HTTP(S) URLs and classifies address ranges",()=>{
    expect(validatePublicUrl("https://example.com/article#fragment").toString()).toBe("https://example.com/article");expect(isPublicAddress("8.8.8.8")).toBe(true);expect(isPublicAddress("192.168.1.1")).toBe(false);expect(isPublicAddress("::1")).toBe(false);
  });
});
