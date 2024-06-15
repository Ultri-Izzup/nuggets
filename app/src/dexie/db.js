import Dexie from 'dexie';

export const db = new Dexie('nuggetData');
db.version(1).stores({
  nuggets: '++id, name, dateCreated, dateModified, *tags', // Primary key and indexed props
  files: 'id, nuggetId, directoryPath, fileName, dateCreated, dateModified, *tags',
});
