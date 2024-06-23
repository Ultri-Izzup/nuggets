import { db } from "../src/dexie/db.js";

import {fileNameRegex, getSyncFileHandle} from './shared/opfs.js';

self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  if (msg.data.nuggetId && msg.data.subPath && msg.data.fileHandles ) {
    for(const sysFH of msg.data.fileHandles) {
      console.log('SYSFH', sysFH);

      if(sysFH.kind === 'file') {

        const opfsDirPath = `/nugget/${msg.data.nuggetId}/${msg.data.subPath}`;
        const fileName = sysFH.name.replace(fileNameRegex, "-");

        const fullPath = `${opfsDirPath}/${fileName}`;

        const opfsFH = await getSyncFileHandle(fullPath)

        console.log('FULLPATH', fullPath, opfsFH)
        const fileData = await sysFH.getFile();

        console.log(fileData)

        const contents = await fileData.arrayBuffer();

        console.log(contents)

        opfsFH.write(contents, { at: 0 });
        opfsFH.flush();
        const newSize = opfsFH.getSize();
        opfsFH.close();

        const assetMeta = {
          nuggetId: msg.data.nuggetId,
          directoryPath: opfsDirPath,
          fileName: fileName,
          dateCreated: new Date().toISOString(),
          mimeType: fileData.type,
          fileSize: newSize
        };

        const newId = await db.assets.put(assetMeta);
        console.log("NEW FILE", newId);

        const response = {
          fileId: newId,
          meta: assetMeta
        };

        self.postMessage({ responseData: response });

        // const reader = new FileReader();
        // reader.readAsArrayBuffer(sysFH.getFile());
        // reader.onload = async () => {
        //   console.log("LOCAL FILE READ RESULT", reader.result);
        //   opfsFH.write(reader.result, { at: 0 });
        //   opfsFH.flush();
        //   const newSize = opfsFH.getSize();
        //   opfsFH.close();

        //   const assetMeta = {
        //     nuggetId: msg.data.nuggetId,
        //     directoryPath: opfsDirPath,
        //     fileName: fileName,
        //     dateCreated: new Date().toISOString(),
        //     mimeType: null,
        //     fileSize: newSize
        //   };

        //   const newId = await db.assets.put(assetMeta);
        //   console.log("NEW FILE", newId);

        //   const response = {
        //     fileId: newId,
        //     meta: assetMeta
        //   };

        //   self.postMessage({ responseData: response });
        // }
      }
    }
  }

  // const handler = msg.data.targetHandler;

  // console.log("USE HANDLER", handler, msgHandlers);

  // await msgHandlers[handler](msg.data.targetData, msg.data.responseHandler);
};
