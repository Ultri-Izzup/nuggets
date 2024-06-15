import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { db } from "../dexie/db.js";
import { liveQuery } from "dexie";
import { useObservable } from "@vueuse/rxjs";

export const useNuggetStore = defineStore("nugget", () => {

  // Create Nugget
  const createNugget = async (nuggetData) => {
    const cleanNugget = resolveJSON(nuggetData);
    cleanNugget.dateCreated = new Date().toISOString();
    cleanNugget.dateModified = null;

    const newId = await db.nuggets.add(cleanNugget);
    return newId;
  }

  // Resolve a JavaScript object with possible refs to plain JSON
  const resolveJSON = (data) => {
    return JSON.parse(JSON.stringify(data));
  }

  return {
    createNugget,
    resolveJSON
  }
});
