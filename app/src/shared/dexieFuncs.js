import { db } from "@/dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

import { resolveToJSON } from '@/shared/utilityFuncs'

// Create Nugget
export async function dexCreateNugget(nuggetData) {

  console.log(nuggetData)

  const cleanNugget = resolveToJSON(nuggetData);
  cleanNugget.createdAt = new Date().toISOString();
  cleanNugget.updatedAt = null;

  console.log(cleanNugget)

  const newId = await db.nuggets.add(cleanNugget);

  return newId;
}

export async function dexGetNugget(nuggetId) {
  return await db.nuggets.where("id").equals(Number(nuggetId)).first();
}

export async function dexGetNuggetAssets(nuggetId, subDir=false) {
  const whereClause = {
    nuggetId: Number(nuggetId),
  }

  if(subDir) {
    whereClause.subDir = subDir
  }
  return await db.assets.where(whereClause).toArray();
}

export async function dexCreateExportRecord(nuggetId) {
  const exportRecord = {
    nuggetId: nuggetId, createdAt: new Date().toISOString()
  }
  return await db.exports.add(exportRecord);
}

export async function dexUpdateNugget(nuggetId, updateObj) {

  updateObj.updatedAt = new Date().toISOString();

  const result = await db.nuggets.update(Number(nuggetId), updateObj);

  if(result) {
    return updateObj;
  }

}
