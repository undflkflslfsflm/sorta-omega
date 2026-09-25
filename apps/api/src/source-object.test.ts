import {describe,expect,it} from "vitest";
import {sourceExclusionInputSchema,sourceObjectDetailSchema} from "@sorta/contracts";
import {mapStoredSourceRevision} from "./source-object-revision.js";

const id="00000000-0000-4000-8000-000000000123";

describe("source object contracts",()=>{
  it("keeps immutable evidence separate from current access state",()=>{
    const source={id,vaultId:id,connectionId:id,providerObjectId:"provider-1",containerId:null,kind:"document",title:"Source",accessState:"available" as const,freshness:"current" as const,currentRevision:2,deepLink:"https://provider.example/item/1",excluded:false,exclusionReason:null,lastAttemptAt:null,lastSuccessAt:"2026-09-21T05:00:00.000Z",revision:3,createdAt:"2026-09-20T05:00:00.000Z",updatedAt:"2026-09-21T05:00:00.000Z"};
    expect(sourceObjectDetailSchema.safeParse({source,selectedRevision:{id,sourceObjectId:id,revision:1,contentHash:"a".repeat(64),exactContent:"Historical evidence",metadata:{},attachmentBlobIds:[],fetchedAt:"2026-09-20T05:00:00.000Z"},current:false,historical:true}).success).toBe(true);
    expect(sourceExclusionInputSchema.safeParse({excluded:true,reason:"Owner excluded this source"}).success).toBe(true);
    expect(sourceExclusionInputSchema.safeParse({excluded:true,reason:""}).success).toBe(false);
  });
  it("returns stored provider text and file IDs from the actual revision columns",()=>{
    const revision=mapStoredSourceRevision({id,source_object_id:id,revision:2,content_hash:"a".repeat(64),content_text:"Full Microsoft assignment instructions",metadata:{assignment:true},attachment_blob_ids:[id],fetched_at:new Date("2026-09-25T08:00:00.000Z")});
    expect(revision.exactContent).toBe("Full Microsoft assignment instructions");
    expect(revision.attachmentBlobIds).toEqual([id]);
  });
});
