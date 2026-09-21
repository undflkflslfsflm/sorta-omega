import type { z } from "zod";
import { integrationCapabilitySchema, integrationProviderSchema, integrationStateSchema } from "@sorta/contracts";

type Provider=z.infer<typeof integrationProviderSchema>;type State=z.infer<typeof integrationStateSchema>;type Capability=z.infer<typeof integrationCapabilitySchema>;
export function initialIntegration(provider:Provider):{state:State;capabilities:Capability[]}{
  const importOnly=new Set<Provider>(["visma_inschool","youtube","spotify","tiktok","instagram","reddit","discord","maxun","anakin_oss","meetily"]);
  const capability=provider==="google_calendar"?"calendar.events":provider==="microsoft"?"microsoft.selected_resources":provider==="firecrawl"?"public_web.fetch":`${provider}.owner_export`;
  const isImportOnly=importOnly.has(provider);
  return {state:isImportOnly?"import_only":"needs_provider_configuration",capabilities:[integrationCapabilitySchema.parse({key:capability,mode:isImportOnly?"import_only":"unverified",enabled:false,verifiedAt:null,limitation:isImportOnly?"No verified live account interface is configured. Use an owner-provided supported export after preview.":"Provider credentials, scopes, selected resources, and live field coverage have not been verified."})]};
}
