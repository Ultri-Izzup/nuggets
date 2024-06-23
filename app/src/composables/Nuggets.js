/**
 * NUGGETS LOGIC AND FUNCTIONALITY
 */


// Pure functions with no dependencies or side effects.
import { newFileTimestamp, resolveToJSON } from '@/shared/utilityFuncs'

// Access Dexie IndexedDB tables and worker
import { dexCreateNugget, dexGetNugget } from '@/shared/dexieFuncs'

// Use shared data lookup lists
import { nuggetRelationTypes } from '@/shared/lookupLists'

const createNugget = async (fullNugget) => {
  const nuggetId = await dexCreateNugget(fullNugget.data);

  if(fullNugget.selectedFiles && fullNugget.selectedFiles.length > 0)
    {
      console.log('ATTACH FILES', fullNugget.selectedFiles)
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

const getNugget = async (nuggetId) => {
  return dexGetNugget(nuggetId)
}

/**
 * Nugget logic is defined here.
 * It will normally be accessed through the nugget Pinia store.
 */
export function useNuggets() {

  return {
    createNugget,
    getNugget,
    newFileTimestamp,
    nuggetRelationTypes
  };
}
