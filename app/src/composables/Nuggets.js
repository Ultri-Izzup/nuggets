/**
 * NUGGETS LOGIC AND FUNCTIONALITY
 */


// Pure functions with no dependencies or side effects.
import { newFileTimestamp, resolveToJSON } from '@/shared/utilityFuncs'

// Access Dexie IndexedDB tables and worker
import { createNugget, getNugget } from '@/shared/dexieFuncs'

// Use shared data lookup lists
import { nuggetRelationTypes } from '@/shared/lookupLists'

/**
 * Nugget logic is defined here.
 * It will normally be accessed through the nugget Pinia store.
 */
export function useNuggets() {

  return {
    createNugget,
    getNugget,
    newFileTimestamp,
    nuggetRelationTypes,
    resolveToJSON
  };
}
