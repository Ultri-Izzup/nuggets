import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(12).stores({
  nuggets: '++id, name, createdAt, updatedAt, *tags',
  assets: '[directoryPath+fileName], nuggetId',
  geoPoints: '++id, nuggetId, lat, long',
  relations: '++id, [nuggetId+relationTypeId], relatedId',
});
