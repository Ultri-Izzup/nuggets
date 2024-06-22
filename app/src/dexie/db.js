import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(3).stores({
  nuggets: '++id, name, dateCreated, dateModified, *tags', // Primary key and indexed props
  files: 'id, nuggetId, directoryPath, fileName, ext, dateCreated, dateModified, *tags',
});
