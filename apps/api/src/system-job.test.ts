import {describe,expect,it} from "vitest";
import {systemJobCancellationDecision,systemJobRetryDecision} from "./system-job.js";

const base={kind:"backup_create",status:"queued",stage:"queued",retryable:false,attempts:0,maxAttempts:3};

describe("installation job policy",()=>{
  it("cancels queued work immediately and requests cooperative cancellation for running work",()=>{
    expect(systemJobCancellationDecision(base)).toBe("cancel_now");
    expect(systemJobCancellationDecision({...base,status:"running",stage:"writing_manifest"})).toBe("request_cancellation");
  });
  it("does not claim a committed replacement restore can be cancelled",()=>{
    expect(systemJobCancellationDecision({...base,kind:"restore_apply",status:"running",stage:"committing_restore"})).toBe("restore_commit_boundary");
    expect(systemJobCancellationDecision({...base,status:"succeeded"})).toBe("terminal");
  });
  it("retries only failed retryable work below its attempt cap",()=>{
    expect(systemJobRetryDecision({...base,status:"failed",retryable:true,attempts:1})).toBe("retry");
    expect(systemJobRetryDecision({...base,status:"failed",retryable:true,attempts:3})).toBe("not_retryable");
    expect(systemJobRetryDecision({...base,status:"cancelled",retryable:true,attempts:1})).toBe("not_retryable");
  });
});
