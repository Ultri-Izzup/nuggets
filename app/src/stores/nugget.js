// import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { useNuggets } from "@/composables/Nuggets";

const Nug = useNuggets();

export const useNuggetStore = defineStore("nugget", () => {

  // STATE
  const recentNuggets = useStorage('recentNuggets', []);
  const lastNugget = useStorage('lastNugget', 0)

  // GETTERS / CALCULATED STATE
  const newFileTimestamp = Nug.newFileTimestamp

  // ACTIONS / FUNCTIONS
  const createNugget = async (fullNugget) => {
    console.log(fullNugget);

    const nuggetId = await Nug.createNugget(fullNugget);

    // console.log(nuggetId);

    // if(nuggetObj.selectedFiles && nuggetObj.selectedFiles.length > 0)
    // {
    //   console.log('ATTACH FILES', nuggetObj.selectedFiles)
    // }

    // if(nuggetObj.capturedImages && nuggetObj.capturedImages.length > 0)
    // {
    //   console.log('ATTACH IMAGES', nuggetObj.capturedImages)
    // }

    // if(nuggetObj.capturedVideos && nuggetObj.capturedVideos.length > 0)
    // {
    //   console.log('ATTACH VIDEO', nuggetObj.capturedVideos)
    // }

    // if(nuggetObj.capturedAudio && nuggetObj.capturedAudio.length > 0)
    // {
    //   console.log('ATTACH AUDIO', nuggetObj.capturedAudio)
    // }

    // if(nuggetObj.capturedAudio && nuggetObj.capturedAudio.length > 0)
    // {
    //   console.log('ATTACH AUDIO', nuggetObj.capturedAudio)
    // }


    return nuggetId;
  }

  const getNugget = Nug.getNugget;

  return {
    // State

    // Getters
    newFileTimestamp,

    // Actions/Functions
    createNugget,
    getNugget,
    resolveToJSON: Nug.resolveToJSON
  }
});
