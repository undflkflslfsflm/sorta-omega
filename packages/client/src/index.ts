import createClient from "openapi-fetch";
import type { paths } from "./schema.js";

export type { components, operations, paths } from "./schema.js";

export type SortaClientOptions={baseUrl?:string;fetch?:typeof globalThis.fetch};

export function createSortaClient(options:SortaClientOptions={}){
  return createClient<paths>({baseUrl:options.baseUrl??"",credentials:"include",fetch:options.fetch});
}
