import Dexie from 'dexie';
Dexie.debug = true;

export const db = new Dexie('nuggetData');
db.version(23).stores({
  nuggets: '++id, name, createdAt, updatedAt, *tags',
  assets: '[nuggetId+subDir+fileName], mimeType',
  relations: '++id, [nuggetId+relationTypeId], relatedId',
  opfsHandles: 'handlePath, type',
  exports: '++id, nuggetId, createdAt, completedAt'
});
