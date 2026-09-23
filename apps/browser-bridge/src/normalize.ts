import { createHash } from "node:crypto";

export function cleanVisibleTexts(values:string[],limit=500,totalByteLimit=20*1024*1024){const seen=new Set<string>(),items:string[]=[];let totalBytes=0;for(const value of values){const clean=value.replace(/\u00a0/g," ").replace(/[ \t]+/g," ").replace(/\n{3,}/g,"\n\n").trim();if(!clean||clean.length>100_000||seen.has(clean))continue;const byteLength=Buffer.byteLength(clean,"utf8");if(totalBytes+byteLength>totalByteLimit)break;seen.add(clean);items.push(clean);totalBytes+=byteLength;if(items.length>=limit)break;}return items;}

export function teamsNotes(values:string[],capturedAt:string){return cleanVisibleTexts(values).map((body,index)=>({id:createHash("sha256").update(`teams:${body}`).digest("hex"),title:`Teams chat item ${index+1} · ${capturedAt.slice(0,10)}`,body:`Imported from the owner-selected Teams web conversation at ${capturedAt}. This is a browser snapshot, not live synchronization.\n\n${body}`,path:`teams/${String(index+1).padStart(5,"0")}.json`}));}

export function inSchoolSnapshot(values:string[],capturedAt:string){return{version:"omega_school_json_v1",source_timestamp:capturedAt,records:cleanVisibleTexts(values,1_000).map(text=>({kind:"lesson",externalId:createHash("sha256").update(`inschool:${text}`).digest("hex"),title:text.slice(0,1_000)}))};}

export type InSchoolVisibleLesson = {
  entityId: string;
  teachingGroupId: string;
  startUnix: string;
  hours: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  teachers: string;
  lessonType: string;
};

export function inSchoolTimetableSnapshot(items:InSchoolVisibleLesson[],capturedAt:string){
  const records:Array<Record<string,unknown>>=[];
  const seenSubjects=new Set<string>(),seenCourses=new Set<string>(),seenLessons=new Set<string>();
  for(const item of items){
    const subjectName=item.subjectName.replace(/\s+/g," ").trim().slice(0,500);
    const unix=Number(item.startUnix);
    const hours=item.hours.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
    if(!subjectName||!Number.isSafeInteger(unix)||unix<946684800||unix>4102444800||!hours)continue;
    const startMinutes=Number(hours[1])*60+Number(hours[2]),endMinutes=Number(hours[3])*60+Number(hours[4]);
    const duration=(endMinutes-startMinutes+1440)%1440;
    if(duration<5||duration>600)continue;
    const startsAt=new Date(unix*1000).toISOString(),endsAt=new Date(unix*1000+duration*60_000).toISOString();
    const subjectCode=item.subjectCode.trim().slice(0,80);
    const subjectExternalId=`subject:${subjectCode||subjectName.toLocaleLowerCase("nb-NO")}`;
    const courseExternalId=`course:${item.teachingGroupId.trim()||subjectExternalId}`;
    if(!seenSubjects.has(subjectExternalId)){seenSubjects.add(subjectExternalId);records.push({kind:"subject",externalId:subjectExternalId,title:subjectName,code:subjectCode||null});}
    if(!seenCourses.has(courseExternalId)){seenCourses.add(courseExternalId);records.push({kind:"course",externalId:courseExternalId,title:subjectName,subjectExternalId,teachingGroupId:item.teachingGroupId.trim()||null});}
    const lessonExternalId=createHash("sha256").update(`inschool:lesson:${item.entityId}:${item.teachingGroupId}:${unix}:${item.lessonType}`).digest("hex");
    if(seenLessons.has(lessonExternalId))continue;
    seenLessons.add(lessonExternalId);
    records.push({kind:"lesson",externalId:lessonExternalId,title:subjectName,courseExternalId,subjectExternalId,startsAt,endsAt,timezone:"Europe/Oslo",room:item.room.trim()||null,teachers:item.teachers.trim()||null,lessonType:item.lessonType.trim()||null,sourceEntityId:item.entityId.trim()||null});
    if(records.length>=1_000)break;
  }
  return {version:"omega_school_json_v1",source_timestamp:capturedAt,timezone:"Europe/Oslo",records:records.slice(0,1_000)};
}
