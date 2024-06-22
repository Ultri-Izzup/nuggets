import { db } from "@/dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

import {resolveToJSON } from '@/shared/utilityFuncs'

// Create Nugget
export async function createNugget (nuggetData) {

  console.log(nuggetData)

  const cleanNugget = resolveToJSON(nuggetData);
  cleanNugget.createdAt = new Date().toISOString();
  cleanNugget.updatedAt = null;

  console.log(cleanNugget)

  const newId = await db.nuggets.add(cleanNugget);

  console.log('Selected Files', nuggetData.selectedFiles)
  console.log('Captured Images', nuggetData.capturedImages)
  console.log('Recorded Videos', nuggetData.videoRecordings)
  console.log('Recorded Audio', nuggetData.audioRecordings)

  return newId;
}

export async function getNugget (nuggetId) {
  const nuggetData = await db.nuggets.where("id").equals(Number(nuggetId)).first();
  console.log(nuggetData)
  return nuggetData;
}

