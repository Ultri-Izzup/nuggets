/**
 * NUGGETS LOGIC AND FUNCTIONALITY
 */
// Use shared data lookup lists
import { nuggetRelationTypes } from '@/shared/lookupLists'

// Pure functions with no dependencies or side effects.
import { newFileTimestamp } from '@/shared/utilityFuncs'

// Access Dexie IndexedDB tables and worker
import { dexCreateNugget, dexGetNugget, dexGetNuggetAssets, dexCreateExportRecord, dexUpdateNugget } from '@/shared/dexieFuncs'

// Access OPFS
import { readOPFSFile } from '@/shared/opfsFuncs'

// Worker scripts
/**
  * Initialize Ultri Worker
  */
let fileHandleWorker = null;  // Used for local file attachments
let dataURLWorker = null;     // Used for images
let blobWorker = null;        // Used for audio and video
let exportWorker = null;      // Used for exporting Nuggets

if (window.Worker) {

  fileHandleWorker = new Worker("/workers/fileHandleWorker.js", { type: "module" });
  fileHandleWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED FileHandle WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("FILE WORKER LOADED IN Nuggets Composable");

  dataURLWorker = new Worker("/workers/dataURLWorker.js", { type: "module" });
  dataURLWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED URLDATA WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("DATAURL WORKER LOADED IN Nuggets Composable");

  blobWorker = new Worker("/workers/blobWorker.js", { type: "module" });
  blobWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED BLOB WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("BLOB WORKER LOADED IN Nuggets Composable");

  exportWorker = new Worker("/workers/exportWorker.js", { type: "module" });
  exportWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED EXPORT WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };
  console.log("EXPORT WORKER LOADED IN Nuggets Composable");
}


/**
 * Create a new nugget from related parts.
 * @param {object} fullNugget
 * @returns {number}
 */
const createNugget = async (fullNugget) => {

  const nuggetId = await dexCreateNugget(fullNugget.data);

  if (fullNugget.selectedFiles && fullNugget.selectedFiles.length > 0) {
    console.log('ATTACH FILES', fullNugget.selectedFiles)
    // Send system fileHandles to the worker script.
    const fhArray = Array.from(fullNugget.selectedFiles)
    fileHandleWorker.postMessage({ nuggetId: nuggetId, subDir: "files", fileHandles: fhArray });
  }

  if (fullNugget.capturedImages && fullNugget.capturedImages.length > 0) {
    console.log('ATTACH IMAGES', fullNugget.capturedImages)
    const cleanImgObjs = [];
    for(const imgObj of fullNugget.capturedImages) {
      cleanImgObjs.push({ name: imgObj.name, dataURL: imgObj.dataURL})
    }
    dataURLWorker.postMessage({ nuggetId: nuggetId, subDir: "images", dataURLObjs: cleanImgObjs });
  }

  if (fullNugget.videoRecordings && fullNugget.videoRecordings.length > 0) {
    console.log('ATTACH VIDEO', fullNugget.videoRecordings)
    const cleanBlobArr= [];
    for(const vBlob of fullNugget.videoRecordings) {
      cleanBlobArr.push({ name: vBlob.name, blobURL: vBlob.blobURL})
    }
    blobWorker.postMessage({ nuggetId: nuggetId, subDir: "videos", blobs: cleanBlobArr });
  }

  if (fullNugget.audioRecordings && fullNugget.audioRecordings.length > 0) {
    console.log('ATTACH AUDIO', fullNugget.audioRecordings)
    const cleanBlobArr= [];
    for(const vBlob of fullNugget.audioRecordings) {
      cleanBlobArr.push({ name: vBlob.name, blobURL: vBlob.blobURL})
    }
    blobWorker.postMessage({ nuggetId: nuggetId, subDir: "audio", blobs: cleanBlobArr });
  }

  return nuggetId;
}

/**
 *
 * @param {number} nuggetId
 * @param {array} selectedFiles
 */
const addNuggetAttachments = async (nuggetId, selectedFiles) => {
  const fhArray = Array.from(selectedFiles)
  fileHandleWorker.postMessage({ nuggetId: nuggetId, subDir: "files", fileHandles: fhArray });
}

const addNuggetAsset = async (nuggetId, subDir, asset) => {
  console.log(asset)
  blobWorker.postMessage({ nuggetId: Number(nuggetId), subDir: subDir, blobs: [asset] });
}

/**
 * Get data for a given nuggetId
 * @param {number} nuggetId
 * @returns {object}
 */
const getNugget = async (nuggetId) => {
  return dexGetNugget(nuggetId)
}

/**
 * Get attached assets for a given nuggetId
 * @param {number} nuggetId
 * @param {string} subDir
 * @returns {object}
 */
const getNuggetAssets = async (nuggetId, subDir) => {
  return dexGetNuggetAssets(nuggetId, subDir)
}

const setGeoLocation = async (nuggetId, geoLocation) => {
  const updateObj = {
    geoLocation: geoLocation
  }

  const updated = await dexUpdateNugget(nuggetId, updateObj);

  console.log(updated);

  return updateObj;
}

const startExport = async (nuggetId) => {
  console.log('NUGGET START EXPORT', nuggetId)
  // Create Dexie/IndexedDB record for job.
  const exportId = await dexCreateExportRecord(nuggetId);

  // The remainder of the export takes place in the Worker.
  exportWorker.postMessage({ nuggetId: nuggetId, exportId: exportId });

  return exportId;
}

/**
 * export for use as a composable
 */
export function useNuggets() {

  return {
    addNuggetAttachments,
    addNuggetAsset,
    createNugget,
    getNugget,
    getNuggetAssets,
    newFileTimestamp,
    nuggetRelationTypes,
    readOPFSFile,
    setGeoLocation,
    startExport,
  };
}
