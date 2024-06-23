import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(13).stores({
  nuggets: '++id, name, createdAt, updatedAt, *tags',
  assets: '[directoryPath+fileName], nuggetId',
  relations: '++id, [nuggetId+relationTypeId], relatedId',
});
