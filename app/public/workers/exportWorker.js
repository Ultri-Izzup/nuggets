import { markExportComplete, getNuggetData, getNuggetAssets, getNuggetRelations } from './shared/dexie.js';
import { writeJSONtoOPFS, writeFiletoOPFS, opfsSyncRead, newFileTimestamp } from './shared/opfs.js';
import { getZipWriter } from './shared/zip.js';

import {
  TextReader
} from "../../../node_modules/@zip.js/zip.js/index.js";

const textDecoder = new TextDecoder();

self.onmessage = async (msg) => {
  console.log("export WORKER MESSAGE RECEIVED", msg);
  console.log("data", msg.data);
  const nuggetId = msg.data.nuggetId;
  const exportId = msg.data.exportId;

  if(nuggetId && exportId) {

    const zipWriter = await getZipWriter();

    const dataFiles = await exportDexieToFiles(nuggetId);

    // Add files we just wrote to zipWriter
    for(const dataFile of dataFiles) {
      const filePath = dataFile.filePath;
      const fileBlob = await opfsSyncRead(filePath);
      await zipWriter.add(filePath, new TextReader(textDecoder.decode(fileBlob)))
    }

    // Export Assets data from Dexie, as well as the corresponding file.
    // Only valid exports end up in the assetsManifest.json
    const nuggetAssets = await getNuggetAssets(nuggetId);

    if (nuggetAssets && nuggetAssets.length > 0) {
      const validAssets = [];

      // Atempt to write the specified file to the zipWriter.
      // // Add sucessful records to the
      // for(const asset of nuggetAssets) {
      //   try {
      //     const filePath = `nugget/${asset.nuggetId}/${asset.subDir}/${asset.fileName}`;
      //     const fileBlob = await opfsSyncRead(filePath);
      //     await zipWriter.add(filePath, fileBlob);
      //     validAssets.push(asset);
      //   } catch (error) {

      //   }
      // }

      // Write the validAssets to to zipWriter as assetManifest.json
      // const manifestResult = await zipWriter.add(`nugget/${nuggetId}/assetManifest.json`, fileBlob);

    }

    const zipped = await zipWriter.close();

    console.log(zipped)

    // Write the zipped content to OPFS /exports
    const zipFileName = `nugget_${nuggetId}_${exportId}_${newFileTimestamp(true)}`
    const writtenZip = await writeFiletoOPFS(zipped, `nugget/${nuggetId}/exports/${zipFileName}.zip`)

    markExportComplete(exportId);

    self.postMessage(writtenZip);

  }
}

const exportDexieToFiles = async (nuggetId) => {

  const dataFiles = [];

  // * Export Dexie Nugget data to json in OPFS /nugget/:nuggetId/nuggetData.json
  const nuggetData = await getNuggetData(nuggetId);
  if(nuggetData) {
    const writeResult = await (writeJSONtoOPFS(nuggetData, `nugget/${nuggetId}/nuggetData.json`));
    dataFiles.push(writeResult);
  }

  // * Export Dexie relations data to json in OPFS /nugget/:nuggetId/relatedNuggets.json
  const nuggetAssets = await getNuggetAssets(nuggetId);
  if (nuggetAssets && nuggetAssets.length > 0) {
    const writeResult = await (writeJSONtoOPFS(nuggetAssets, `nugget/${nuggetId}/nuggetAssets.json`));
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
