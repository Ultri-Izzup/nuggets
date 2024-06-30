import {fileNameRegex, getSyncFileHandle} from './shared/opfs.js';
import { putAssetRecord } from './shared/dexie.js';

self.onmessage = async (msg) => {
  console.log("blobs WORKER MESSAGE RECEIVED", msg);
  console.log("data", msg.data);
  console.log("blobs", msg.data.blobs);

  if (msg.data.nuggetId && msg.data.subDir ) {

    let blobs;

    if(msg.data.blobs) {
      blobs = msg.data.blobs
    }

    for(const dataObj of blobs) {
      console.log('dataObj', dataObj);

        const fileName = dataObj.name.replace(fileNameRegex, "-");

        // Matches Dexie/IndexedDB key value
        const keyPath = `${msg.data.nuggetId}/${msg.data.subDir}/${fileName}`;

        const fullPath = `nugget/${keyPath}`
        const opfsFH = await getSyncFileHandle(fullPath)

        const fetched = await fetch(dataObj.blobURL);

        const cBlob = await fetched.blob();

        const contents = await cBlob.arrayBuffer();


        opfsFH.write(contents, { at: 0 });
        opfsFH.flush();
        const newSize = opfsFH.getSize();
        opfsFH.close();

        const assetMeta = {
          nuggetId: msg.data.nuggetId,
          subDir: msg.data.subDir,
          fileName: fileName,
          mimeType: dataObj.type,
          dateCreated: new Date().toISOString(),
          fileSize: newSize
        };

        console.log('META', assetMeta)

        const newId = await putAssetRecord(assetMeta);
        console.log("NEW FILE", newId);

        const response = {
          fileId: newId,
          meta: assetMeta
        };

        self.postMessage({ responseData: response });
    }
  }
};
