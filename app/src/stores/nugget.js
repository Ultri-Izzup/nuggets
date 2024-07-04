// import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { useNuggets } from "@/composables/Nuggets";

const {
  addNuggetAttachments,
    addNuggetAsset,
    createNugget,
    getNugget,
    getNuggetAssets,
    newFileTimestamp,
    readOPFSFile,
    setGeoLocation,
    tmpStore,

    // VIDEO / IMAGES
    showCamera,
    showCameraDialog,
    saveVideoSource,
    videoSource,
    selectedVideoDevice,
    preferredCamera,
    saveVideoChunk,
    tmpImages,
    tmpVideos,

    //AUDIO
    tmpAudios,
} = useNuggets();

export const useNuggetStore = defineStore("nugget", () => {

  // STATE
  const recentNuggets = useStorage('recentNuggets', []);
  const lastNugget = useStorage('lastNugget', 0);
  // const preferredCamera = useStorage('preferredCamera', null);
  const pendingExports = useStorage('pendingExports', new Map());
  const dowloadedExports = useStorage('downloadedExports', []);

  // GETTERS / CALCULATED STATE


  // ACTIONS / FUNCTIONS
  const startNuggetExport = async(nuggetId) => {

    if(pendingExports.value.has(nuggetId)) {
      console.log(`Export already in process for nugget ${nuggetId}` )
      // return;
    } // else {
      const nowTime = new Date().toISOString();
      pendingExports.value.set(nuggetId, { createdAt: nowTime });
      const exportId = await Nug.startExport(nuggetId);
      const jobData = { nuggetId: nuggetId, createdAt: nowTime, exportId: exportId };
      pendingExports.value.set(nuggetId, jobData);
      return jobData;
   //}
  }

  return {
    // State

    // Getters
    tmpImages,
    tmpVideos,
    selectedVideoDevice,
    preferredCamera,
    showCameraDialog,
    saveVideoSource,
    showCamera,
    videoSource,

    tmpAudios,



    // Actions/Functions


    addNuggetAttachments,
    addNuggetAsset,
    createNugget,
    getNugget,
    getNuggetAssets,
    newFileTimestamp,
    readOPFSFile,

    setGeoLocation,

    tmpStore,


    startNuggetExport,
  }
});
