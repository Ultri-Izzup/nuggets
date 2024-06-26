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
  const newFileTimestamp = Nug.newFileTimestamp

  // ACTIONS / FUNCTIONS
  const createNugget = async (fullNugget) => {
    console.log(fullNugget);

    const nuggetId = await Nug.createNugget(fullNugget);

    return nuggetId;
  }

  const getNugget = Nug.getNugget;

  return {
    // State
    preferredCamera,

    // Getters
    newFileTimestamp,

    // Actions/Functions
    createNugget,
    getNugget,
    getNuggetAssets: Nug.getNuggetAssets,
  }
});
