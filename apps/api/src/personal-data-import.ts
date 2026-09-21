import type {z} from "zod";import{normalizedPersonalDataRecordSchema}from"@sorta/contracts";
export type NormalizedRecord=z.infer<typeof normalizedPersonalDataRecordSchema>;
export function personalDataRecordKey(record:NormalizedRecord){return `${record.sourceItemId}\u0000${record.actionKind}`;}
export function summarizePersonalDataRecords(records:NormalizedRecord[],suppressedSourceIds=new Set<string>()){
  const seen=new Set<string>();let duplicateCount=0;let unknownActionCount=0;let suppressedCount=0;const unique:NormalizedRecord[]=[];
  for(const record of records){const key=personalDataRecordKey(record);if(seen.has(key)){duplicateCount++;continue;}seen.add(key);if(record.actionKind==="unknown")unknownActionCount++;if(suppressedSourceIds.has(record.sourceItemId)){suppressedCount++;continue;}unique.push(record);}
  return{unique,summary:{recordCount:records.length,uniqueCount:unique.length,duplicateCount,unknownActionCount,suppressedCount}};
}
