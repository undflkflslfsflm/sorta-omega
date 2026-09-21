import {describe,expect,it} from "vitest";import {initialIntegration} from "./integration-capabilities.js";
describe("integration capability honesty",()=>{
  it("does not treat adapter registration as live access",()=>{for(const provider of ["microsoft","google_calendar","firecrawl"] as const){const value=initialIntegration(provider);expect(value.state).toBe("needs_provider_configuration");expect(value.capabilities[0]).toMatchObject({enabled:false,verifiedAt:null,mode:"unverified"});}});
  it("marks unverified owner-export paths as import-only",()=>{for(const provider of ["visma_inschool","youtube","spotify","tiktok","instagram","reddit","discord","maxun","anakin_oss","meetily"] as const){const value=initialIntegration(provider);expect(value.state).toBe("import_only");expect(value.capabilities[0]?.mode).toBe("import_only");}});
});
