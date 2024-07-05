// import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { useNuggets } from "@/composables/Nuggets";
import { useMulticorder } from "@/composables/Multicorder";

const {
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

  // SCREEN
  showScreenPicker,

  // GEO LOCATION
  getGeoLocation,
  geoLocation,
  waypoints,

  // FILES Broken?
  // These need to be accessed directly from Muticorder composable in each component.
  showFilePicker,
  tmpFiles,
  showFileSelectDialog,

  // DELETE TMP ASSETS FROM MULTICORDER
  resetMulticorderAssets,

} = useMulticorder();

const {
  addNuggetAttachments,
  addNuggetAsset,
  createNugget,
  getNugget,
  getNuggetAssets,
  newFileTimestamp,
  readOPFSFile,
  setGeoLocation,
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
  const startNuggetExport = async (nuggetId) => {

    if (pendingExports.value.has(nuggetId)) {
      console.log(`Export already in process for nugget ${nuggetId}`)
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

  const makeNugget = async (fullNugget) => {

    const nuggetId =  createNugget(fullNugget);

    // await resetMulticorderAssets();

    return nuggetId;

  }

  return {
    // State

    // MULTICORDER
    tmpImages,
    tmpVideos,
    selectedVideoDevice,
    preferredCamera,
    showCameraDialog,
    videoSource,
    tmpAudios,
    saveVideoSource,
    showCamera,
    tmpStore,
    showScreenPicker,
    getGeoLocation,
    geoLocation,
    waypoints,
    resetMulticorderAssets,
    // FILES Broken?
    // These need to be accessed directly from Muticorder composable in each component.
    showFilePicker,
    tmpFiles,
    showFileSelectDialog,




    // NUGGETS
    addNuggetAttachments,
    addNuggetAsset,
    // createNugget,
    getNugget,
    getNuggetAssets,
    newFileTimestamp,
    readOPFSFile,
    setGeoLocation,
    startNuggetExport,

    // LOCAL FUNCTIONS
    makeNugget
  }
});
