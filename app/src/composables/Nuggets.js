/**
 * NUGGETS LOGIC AND FUNCTIONALITY
 */

// Use shared data lookup lists
import { nuggetRelationTypes } from '@/shared/lookupLists'

// Pure functions with no dependencies or side effects.
import { newFileTimestamp } from '@/shared/utilityFuncs'

// Access Dexie IndexedDB tables and worker
import { dexCreateNugget, dexGetNugget, dexGetNuggetAssets } from '@/shared/dexieFuncs'

// Access OPFS
import { readOPFSFile } from '@/shared/opfsFuncs'

// Worker scripts
/**
  * Initialize Ultri Worker
  */
let fileHandleWorker = null;
let dataURLWorker = null;
let blobWorker = null;

if (window.Worker) {

  //////////////////
  // Create Ultri Dedicated OPFS Worker.
  // Each script or tab will have it's own copy of this worker.
  fileHandleWorker = new Worker("/workers/fileHandleWorker.js", { type: "module" });

  // Define handlers for each message type
  fileHandleWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED FileHandle WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };

  console.log("FILE WORKER LOADED IN Nuggets Composable");

  //////////////////
  dataURLWorker = new Worker("/workers/dataURLWorker.js", { type: "module" });

  // Define handlers for each message type
  dataURLWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED URLDATA WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };

  console.log("DATA WORKER LOADED IN Nuggets Composable");

  // //////////////////
  blobWorker = new Worker("/workers/blobWorker.js", { type: "module" });

  // Define handlers for each message type
  blobWorker.onmessage = (msg) => {
    console.log(
      "DEDICATED BLOB WORKER EVENT RETURNED DATA TO Nuggets Composable \n",
      msg
    );
  };

  console.log("BLOB WORKER LOADED IN Nuggets Composable");
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
  }

  if (fullNugget.audioRecordings && fullNugget.audioRecordings.length > 0) {
    console.log('ATTACH AUDIO', fullNugget.audioRecordings)
  }

  return nuggetId;
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

/**
 * Fetch a file from OPFS
 * @param {string} filePath
 */
// const readOPFSFile = async (filePath) => {
//   const fh = await opfsFile(filePath);
//   const file = await fh.getFile();
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   return reader;
// }

/**
 * export for use as a composable
 */
export function useNuggets() {

  return {
    createNugget,
    getNugget,
    getNuggetAssets,
    newFileTimestamp,
    nuggetRelationTypes,
    readOPFSFile
  };
}
