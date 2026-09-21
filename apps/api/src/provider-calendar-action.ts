export type CalendarWriteConnection={provider:string;state:string;revision:number;capabilities:Array<{key:string;mode:string;enabled:boolean;verifiedAt:string|null}>};

export function buildProviderPublicFields(event:{title:string;startsAt:Date|string;endsAt:Date|string;timezone:string},overrides?:Record<string,unknown>){
  const iso=(value:Date|string)=>new Date(value).toISOString();
  return {title:typeof overrides?.title==="string"?overrides.title:event.title,startsAt:typeof overrides?.startsAt==="string"?overrides.startsAt:iso(event.startsAt),endsAt:typeof overrides?.endsAt==="string"?overrides.endsAt:iso(event.endsAt),timezone:typeof overrides?.timezone==="string"?overrides.timezone:event.timezone,description:typeof overrides?.description==="string"?overrides.description:null,location:typeof overrides?.location==="string"?overrides.location:null};
}

export function providerWriteReadiness(connection:CalendarWriteConnection){
  if(!["microsoft","google_calendar"].includes(connection.provider))return"provider_calendar_write_unsupported";
  if(connection.state!=="connected")return"provider_connection_not_connected";
  const write=connection.capabilities.find(capability=>capability.mode==="live_write"&&capability.enabled&&capability.verifiedAt);
  if(!write)return"provider_calendar_write_not_verified";
  return null;
}
