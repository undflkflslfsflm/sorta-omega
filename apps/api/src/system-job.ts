export type SystemJobPolicyInput={kind:string;status:string;stage:string;retryable:boolean;attempts:number;maxAttempts:number};

export function systemJobCancellationDecision(job:SystemJobPolicyInput){
  if(["succeeded","failed","cancelled","superseded"].includes(job.status))return"terminal" as const;
  if(job.kind==="restore_apply"&&["committing_restore","committed"].includes(job.stage))return"restore_commit_boundary" as const;
  return job.status==="queued"?"cancel_now" as const:"request_cancellation" as const;
}

export function systemJobRetryDecision(job:SystemJobPolicyInput){
  return job.status==="failed"&&job.retryable&&job.attempts<job.maxAttempts?"retry" as const:"not_retryable" as const;
}
