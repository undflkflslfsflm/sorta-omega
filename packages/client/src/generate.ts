import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const directory=path.dirname(fileURLToPath(import.meta.url));
const specificationPath=path.resolve(directory,"../../../docs/openapi.json");
const outputPath=path.resolve(directory,"./schema.ts");
const generated=`/* This file is generated from docs/openapi.json. Do not edit by hand. */\n${astToString(await openapiTS(pathToFileURL(specificationPath))).trimEnd()}\n`;
if(process.argv.includes("--check")){
  const current=await readFile(outputPath,"utf8").catch(()=>"");
  if(current!==generated){console.error(`Generated TypeScript client schema is stale: ${outputPath}`);process.exitCode=1;}else console.log("Generated TypeScript client schema is current");
}else{await writeFile(outputPath,generated,"utf8");console.log(`Generated TypeScript client schema at ${outputPath}`);}
