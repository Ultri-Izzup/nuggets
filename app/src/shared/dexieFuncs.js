import { db } from "@/dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

import {resolveToJSON } from '@/shared/utilityFuncs'

// Create Nugget
export async function dexCreateNugget (nuggetData) {

  console.log(nuggetData)

  const cleanNugget = resolveToJSON(nuggetData);
  cleanNugget.createdAt = new Date().toISOString();
  cleanNugget.updatedAt = null;

  console.log(cleanNugget)

  const newId = await db.nuggets.add(cleanNugget);

  return newId;
}

export async function dexGetNugget (nuggetId) {
  const nuggetData = await db.nuggets.where("id").equals(Number(nuggetId)).first();
  console.log(nuggetData)
  return nuggetData;
}

export async function dexGetNuggetFiles (nuggetId) {
  const nuggetFiles = await db.assets.where("nuggetId").equals(Number(nuggetId)).toArray();
  console.log(nuggetFiles)
  return nuggetFiles;
}

