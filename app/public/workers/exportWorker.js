import { markExportComplete, getNuggetData, getNuggetAssets, getNuggetRelations } from './shared/dexie.js';
import { writeJSONtoOPFS, getOPFSDirHandle } from './shared/opfs.js';
import { getZipWriter } from './shared/zip.js';

self.onmessage = async (msg) => {
  console.log("export WORKER MESSAGE RECEIVED", msg);
  console.log("data", msg.data);
  const nuggetId = msg.data.nuggetId;
  const exportId = msg.data.exportId;

  await copyDataToOPFS(nuggetId);

  const zipResult = await zipExportNugget(nuggetId);

  markExportComplete(exportId);

}

const zipExportNugget = async (nuggetId) => {

  // Get the Nugget's root OPFS directory handle
  const rootDH = await getOPFSDirHandle(`nugget/${nuggetId}`);

  const zipWriter = await getZipWriter();

  console.log(zipWriter, rootDH)
}

const copyDataToOPFS = async (nuggetId) => {

  // * Export Dexie Nugget data to json in OPFS /nugget/:nuggetId/nuggetData.json
  const nuggetData = await getNuggetData(nuggetId);
  await (writeJSONtoOPFS(nuggetData, `nugget/${nuggetId}/nuggetData.json`))

  // * Export Dexie assets data to json in OPFS /nugget/:nuggetId/assetManifest.json
  const nuggetAssets = await getNuggetAssets(nuggetId);
  if (nuggetAssets && nuggetAssets.length > 0) {
    await (writeJSONtoOPFS(nuggetAssets, `nugget/${nuggetId}/assetManifest.json`))
  }

  // * Export Dexie relations data to json in OPFS /nugget/:nuggetId/relatedNuggets.json
  const nuggetRelations = await getNuggetRelations(nuggetId);
  if (nuggetRelations && nuggetRelations.length > 0) {
    await (writeJSONtoOPFS(nuggetRelations, `nugget/${nuggetId}/relatedNuggets.json`))
  }

}

// * Export Dexie Nugget data to json in OPFS /nuggets/:nuggetId/nugget.json
// * Export Dexie assets data to json in OPFS /nuggets/:nuggetId/assetManifest.json
// * Export Dexie relations data to json in OPFS /nuggets/:nuggetId/relatedNuggets.json

// * IF sysDirHandle is provided, sync the Nugget specific subdir of it with OPFS.
// * OPFS `nugget/:nuggetId/*` gets written to `sysDirHandle/:nuggetId`

// * IF sysDirHandle was not provided, zip the contents into the OPFS /exports directory
// * Zip contents of /nuggets/:nuggetId into OPFS /exports/

// * Update Dexie export record completedAt time
// * Send completion message to calling script

//

// if (msg.data.nuggetId && msg.data.subDir && msg.data.export ) {
//   for(const dataObj of msg.data.export) {
//     console.log('dataObj', dataObj);

//       const fileName = dataObj.name.replace(fileNameRegex, "-");

//       // Matches Dexie/IndexedDB key value
//       const keyPath = `${msg.data.nuggetId}/${msg.data.subDir}/${fileName}`;

//       const fullPath = `nugget/${keyPath}`
//       const opfsFH = await getSyncFileHandle(fullPath)

//       const fetched = await fetch(dataObj.blobURL);

//       const cBlob = await fetched.blob();

//       const contents = await cBlob.arrayBuffer();


//       opfsFH.write(contents, { at: 0 });
//       opfsFH.flush();
//       const newSize = opfsFH.getSize();
//       opfsFH.close();

//       const assetMeta = {
//         nuggetId: msg.data.nuggetId,
//         subDir: msg.data.subDir,
//         fileName: fileName,
//         mimeType: dataObj.type,
//         dateCreated: new Date().toISOString(),
//         fileSize: newSize
//       };

//       console.log('META', assetMeta)

//       const newId = await db.assets.put(assetMeta);
//       console.log("NEW FILE", newId);

//       const response = {
//         fileId: newId,
//         meta: assetMeta
//       };

//       self.postMessage({ responseData: response });
//   }


