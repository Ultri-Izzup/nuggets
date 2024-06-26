import { putAssetRecord } from './shared/dexie.js';
import {fileNameRegex, getSyncFileHandle} from './shared/opfs.js';

self.onmessage = async (msg) => {
  // console.log("dataURL WORKER MESSAGE RECEIVED", msg);
  // console.log("data", msg.data);
  // console.log("dataURLs", msg.data.dataURLObjs);

  if (msg.data.nuggetId && msg.data.subDir && msg.data.dataURLObjs ) {
    for(const dataObj of msg.data.dataURLObjs) {
      console.log('dataObj', dataObj);

        const fileName = dataObj.name.replace(fileNameRegex, "-");

        // Matches Dexie/IndexedDB key value
        const keyPath = `${msg.data.nuggetId}/${msg.data.subDir}/${fileName}`;

        const fullPath = `nugget/${keyPath}`
        const opfsFH = await getSyncFileHandle(fullPath)

        // const fileData = await sysFH.getFile();
        // const contents = await fileData.arrayBuffer();

        const fetched = await fetch(dataObj.dataURL);
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
          mimeType: cBlob.type,
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
