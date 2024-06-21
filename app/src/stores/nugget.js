import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { db } from "../dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

export const useNuggetStore = defineStore("nugget", () => {

  // STATE ////////////////////////


  // GETTERS /////////////////////
  const getFilenameDate = () => {
    return new Date().toISOString()
    .replaceAll('-', '')
    .replaceAll('T', '_')
    .replaceAll(':', '')
    .replaceAll('.', '_')
    .replaceAll('Z', '');
  }

  // ACTIONS //////////////////////

  // Create Nugget
  const createNugget = async (nuggetData) => {
    const cleanNugget = resolveJSON(nuggetData.data);
    cleanNugget.dateCreated = new Date().toISOString();
    cleanNugget.dateModified = null;

    const newId = await db.nuggets.add(cleanNugget);

    console.log('Selected Files', nuggetData.selectedFiles)
    console.log('Captured Images', nuggetData.capturedImages)
    console.log('Recorded Videos', nuggetData.videoRecordings)
    console.log('Recorded Audio', nuggetData.audioRecordings)

    return newId;
  }

  // Resolve a JavaScript object with possible refs to plain JSON
  const resolveJSON = (data) => {
    return JSON.parse(JSON.stringify(data));
  }

  return {
    // State

    // Getters
    getFilenameDate,

    // Actions
    createNugget,
    resolveJSON
  }
});
