// import { ref, computed } from "vue";
import { defineStore } from "pinia";
// import { useStorage } from "@vueuse/core";

import { useNuggets } from "@/composables/Nuggets";

const Nug = useNuggets();

export const useNuggetStore = defineStore("nugget", () => {

  // STATE


  // GETTERS / CALCULATED STATE
  const newFileTimestamp = Nug.newFileTimestamp

  // ACTIONS / FUNCTIONS
  const createNugget = Nug.createNugget;

  const resolveToJSON = Nug.resolveToJSON;

  return {
    // State

    // Getters
    newFileTimestamp,

    // Actions/Functions
    createNugget,
    resolveToJSON
  }
});
