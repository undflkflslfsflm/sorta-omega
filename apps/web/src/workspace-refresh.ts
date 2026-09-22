import { ApiError } from "./api";

export type WorkspaceRefreshFailure="authentication_required"|"access_denied"|"outage"|"other";
export function classifyWorkspaceRefreshFailure(error:unknown):WorkspaceRefreshFailure{
  if(error instanceof ApiError&&error.status===401)return "authentication_required";
  if(error instanceof ApiError&&error.status===403)return "access_denied";
  if(error instanceof TypeError||error instanceof ApiError&&error.status>=500)return "outage";
  return "other";
}
