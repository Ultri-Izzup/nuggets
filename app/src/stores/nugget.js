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
    preferredCamera,

    // Getters

    // Actions/Functions

    addNuggetAttachments: Nug.addNuggetAttachments,
    addNuggetAsset: Nug.addNuggetAsset,
    createNugget: Nug.createNugget,
    getNugget: Nug.getNugget,
    getNuggetAssets: Nug.getNuggetAssets,
    newFileTimestamp: Nug.newFileTimestamp,
    readOPFSFile: Nug.readOPFSFile,
    startNuggetExport,
    setGeoLocation: Nug.setGeoLocation,
    supportedVoices: Nug.supportedVoices
  }
});
