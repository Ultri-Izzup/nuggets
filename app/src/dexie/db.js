import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(20).stores({
  nuggets: '++id, name, createdAt, updatedAt, *tags',
  assets: '[nuggetId+subDir+fileName], mimeType',
  relations: '++id, [nuggetId+relationTypeId], relatedId',
});
