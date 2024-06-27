// import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { useNuggets } from "@/composables/Nuggets";

const Nug = useNuggets();

export const useNuggetStore = defineStore("nugget", () => {

  // STATE
  const recentNuggets = useStorage('recentNuggets', []);
  const lastNugget = useStorage('lastNugget', 0);
  const preferredCamera = useStorage('preferredCamera', null);

  // GETTERS / CALCULATED STATE


  // ACTIONS / FUNCTIONS

  return {
    // State
    preferredCamera,

    // Getters

    // Actions/Functions

    createNugget: Nug.createNugget,
    getNugget: Nug.getNugget,
    getNuggetAssets: Nug.getNuggetAssets,
    newFileTimestamp: Nug.newFileTimestamp,
    readOPFSFile: Nug.readOPFSFile
  }
});
