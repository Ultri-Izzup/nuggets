import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(15).stores({
  nuggets: '++id, name, createdAt, updatedAt, *tags',
  assets: '[directoryPath+fileName], nuggetId, mimeType',
  relations: '++id, [nuggetId+relationTypeId], relatedId',
});
