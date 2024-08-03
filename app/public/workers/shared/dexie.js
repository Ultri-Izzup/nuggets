import { db } from "../../src/dexie/db.js";
import { nanoid } from '../../node_modules/nanoid';

export async function putAssetRecord (record) {
  record.uniq =  nanoid();
  return await db.assets.put(record);
}

export async function markExportComplete (exportId) {
  const updateData = {
    completedAt: new Date().toISOString()
  }
  return await db.exports.update(exportId, updateData);
}

export async function getNuggetData (nuggetId) {
  return await db.nuggets.where("id").equals(Number(nuggetId)).first();
}

export async function getNuggetAssets (nuggetId) {
  return await db.assets.where("nuggetId").equals(Number(nuggetId)).toArray();
}

export async function getNuggetRelations (nuggetId) {
  return await db.relations.where("nuggetId").equals(Number(nuggetId)).toArray();
}






