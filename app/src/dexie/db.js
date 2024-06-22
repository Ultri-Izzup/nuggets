import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(4).stores({
  nuggets: '++id, name, dateCreated, dateModified, *tags, parentNuggetId', // Primary key and indexed props
});
