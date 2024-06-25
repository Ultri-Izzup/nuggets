import { db } from "../src/dexie/db.js";

import {fileNameRegex, getSyncFileHandle} from './shared/opfs.js';

self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  if (msg.data.nuggetId && msg.data.subDir && msg.data.fileHandles ) {
    for(const sysFH of msg.data.fileHandles) {
      console.log('SYSFH', sysFH);

      if(sysFH.kind === 'file') {

        //const opfsDirPath = `/nugget/${msg.data.nuggetId}/${msg.data.subDir}`;
        const fileName = sysFH.name.replace(fileNameRegex, "-");

        // Matches Dexie/IndexedDB key value
        const keyPath = `${msg.data.nuggetId}/${msg.data.subDir}/${fileName}`;

        const fullPath = `nugget/${keyPath}`
        const opfsFH = await getSyncFileHandle(fullPath)
        const fileData = await sysFH.getFile();
        const contents = await fileData.arrayBuffer();

        opfsFH.write(contents, { at: 0 });
        opfsFH.flush();
        const newSize = opfsFH.getSize();
        opfsFH.close();

        const assetMeta = {
          nuggetId: msg.data.nuggetId,
          subDir: msg.data.subDir,
          fileName: fileName,
          mimeType: fileData.type,
          dateCreated: new Date().toISOString(),
          fileSize: newSize
        };

        console.log('META', assetMeta)

        const newId = await db.assets.put(assetMeta);
        console.log("NEW FILE", newId);

        const response = {
          fileId: newId,
          meta: assetMeta
        };

        self.postMessage({ responseData: response });
      }
    }
  }

  // const handler = msg.data.targetHandler;

  // console.log("USE HANDLER", handler, msgHandlers);

  // await msgHandlers[handler](msg.data.targetData, msg.data.responseHandler);
};
