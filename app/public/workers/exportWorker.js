import { markExportComplete, getNuggetData, getNuggetAssets, getNuggetRelations } from './shared/dexie.js';
import { writeJSONtoOPFS, opfsSyncRead } from './shared/opfs.js';
import { getZipWriter } from './shared/zip.js';

import {
  TextReader
} from "../../../node_modules/@zip.js/zip.js/index.js";

self.onmessage = async (msg) => {
  console.log("export WORKER MESSAGE RECEIVED", msg);
  console.log("data", msg.data);
  const nuggetId = msg.data.nuggetId;
  const exportId = msg.data.exportId;

  if(nuggetId && exportId) {

    const zipWriter = await getZipWriter();

    const dataFiles = await copyDataToOPFS(nuggetId);

    // Add files we just wrote to zipWriter
    for(const dataFile of dataFiles) {
      const filePath = dataFile.filePath;
      const fileBlob = await opfsSyncRead(filePath);
      await zipWriter.add(filePath, new TextReader(textDecoder.decode(fileBlob)))
    }

    const zipped = await zipWriter.close();

    console.log(zipped)

    // Write the zipped content to OPFS /exports



  //
  // const filePath = `nugget/${nuggetId}/nuggetData.json`;
  // const fileBlob = await  opfsSyncRead(filePath);
  // console.log(fileBlob)
  // console.log(textDecoder.decode(fileBlob));

  // await zipWriter.add(filePath, new TextReader(textDecoder.decode(fileBlob)))

  // const zipped = await zipWriter.close();

  // console.log(zipped)

    // const zipResult = await zipExportNugget(nuggetId, dataFiles);

    // markExportComplete(exportId);

  }


}

const textDecoder = new TextDecoder();

const zipExportNugget = async (nuggetId) => {

  const zipWriter = await getZipWriter();
  console.log(zipWriter)

  // Add known files to zip
  // nuggetData.json
  // nuggetRelations.json
  const filePath = `nugget/${nuggetId}/nuggetData.json`;
  const fileBlob = await  opfsSyncRead(filePath);
  console.log(fileBlob)
  console.log(textDecoder.decode(fileBlob));

  await zipWriter.add(filePath, new TextReader(textDecoder.decode(fileBlob)))

  const zipped = await zipWriter.close();

console.log(zipped)

  // Read in assets manifest
  // Loop through assets, adding each file to zip
  // Add assets manifest JSON to zip

}

const copyDataToOPFS = async (nuggetId) => {

  const dataFiles = [];

  // * Export Dexie Nugget data to json in OPFS /nugget/:nuggetId/nuggetData.json
  const nuggetData = await getNuggetData(nuggetId);
  if(nuggetData) {
    const writeResult = await (writeJSONtoOPFS(nuggetData, `nugget/${nuggetId}/nuggetData.json`));
    dataFiles.push(writeResult);
  }

  // * Export Dexie assets data to json in OPFS /nugget/:nuggetId/assetManifest.json
  const nuggetAssets = await getNuggetAssets(nuggetId);
  if (nuggetAssets && nuggetAssets.length > 0) {
    const writeResult = await (writeJSONtoOPFS(nuggetAssets, `nugget/${nuggetId}/assetManifest.json`));
    dataFiles.push(writeResult);
  }

  // * Export Dexie relations data to json in OPFS /nugget/:nuggetId/relatedNuggets.json
  const nuggetRelations = await getNuggetRelations(nuggetId);
  if (nuggetRelations && nuggetRelations.length > 0) {
    const writeResult = await (writeJSONtoOPFS(nuggetRelations, `nugget/${nuggetId}/relatedNuggets.json`));
    dataFiles.push(writeResult);
  }

  return dataFiles;
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


