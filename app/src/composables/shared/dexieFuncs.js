import { db } from "@/dexie/db.js";
// import { liveQuery } from "dexie";
// import { useObservable } from "@vueuse/rxjs";

import {resolveToJSON } from './utilityFuncs'

  // Create Nugget
 export async function createNugget (nuggetData) {

    const cleanNugget = resolveToJSON(nuggetData.data);
    cleanNugget.dateCreated = new Date().toISOString();
    cleanNugget.dateModified = null;

    const newId = await db.nuggets.add(cleanNugget);

    console.log('Selected Files', nuggetData.selectedFiles)
    console.log('Captured Images', nuggetData.capturedImages)
    console.log('Recorded Videos', nuggetData.videoRecordings)
    console.log('Recorded Audio', nuggetData.audioRecordings)

    return newId;
  }
