/**
 * NUGGETS LOGIC AND FUNCTIONALITY
 */

// Use shared data lookup lists
import { nuggetRelationTypes } from '@/shared/lookupLists'

// Pure functions with no dependencies or side effects.
import { newFileTimestamp } from '@/shared/utilityFuncs'

// Access Dexie IndexedDB tables and worker
import { dexCreateNugget, dexGetNugget } from '@/shared/dexieFuncs'

/**
 * Create a new nugget from related parts.
 * @param {object} fullNugget
 * @returns {number}
 */
const createNugget = async (fullNugget) => {
  const nuggetId = await dexCreateNugget(fullNugget.data);

  if(fullNugget.selectedFiles && fullNugget.selectedFiles.length > 0)
    {
      console.log('ATTACH FILES', fullNugget.selectedFiles)
      // Send system fileHandles to the worker script.
    }

    if(fullNugget.capturedImages && fullNugget.capturedImages.length > 0)
    {
      console.log('ATTACH IMAGES', fullNugget.capturedImages)
    }

    if(fullNugget.videoRecordings && fullNugget.videoRecordings.length > 0)
    {
      console.log('ATTACH VIDEO', fullNugget.videoRecordings)
    }

    if(fullNugget.audioRecordings && fullNugget.audioRecordings.length > 0)
    {
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
 * export for use as a composable
 */
export function useNuggets() {

  return {
    createNugget,
    getNugget,
    newFileTimestamp,
    nuggetRelationTypes
  };
}
