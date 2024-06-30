import { putAssetRecord } from './shared/dexie.js';

import { fileNameRegex, getSyncFileHandle } from './shared/opfs.js';

self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  if (msg.data.nuggetId && msg.data.subDir && msg.data.fileHandles) {
    for (const sysFH of msg.data.fileHandles) {
      console.log('SYSFH', sysFH);

      const fileName = sysFH.name.replace(fileNameRegex, "-");

      // Matches Dexie/IndexedDB key value
      const keyPath = `${msg.data.nuggetId}/${msg.data.subDir}/${fileName}`;

      const fullPath = `nugget/${keyPath}`
      const opfsFH = await getSyncFileHandle(fullPath)

      let fileData;
      let contents = false;
      let response;
      let fileType;

      const fileProvider = sysFH.toString();
      switch (fileProvider) {
        case '[object FileSystemFileHandle]':

          fileData = await sysFH.getFile();
          contents = await fileData.arrayBuffer();
          fileType = fileData.type;

          break;

        case '[object File]':

          console.log('File input file found', )
          contents = new Uint8Array(await sysFH.arrayBuffer())
          fileType = sysFH.type;
          break;
      }

      if(contents) {
        opfsFH.write(contents, { at: 0 });
        console.log('OPFS FILE RAESLT')
        console.log(opfsFH)
        opfsFH.flush();
        const newSize = opfsFH.getSize();
        opfsFH.close();

        const assetMeta = {
          nuggetId: msg.data.nuggetId,
          subDir: msg.data.subDir,
          fileName: fileName,
          mimeType: fileType,
          dateCreated: new Date().toISOString(),
          fileSize: newSize
        };

        console.log('META', assetMeta)

        const newId = await putAssetRecord(assetMeta);
        console.log("NEW FILE", newId);

        response = {
          fileId: newId,
          meta: assetMeta
        };

        self.postMessage({ responseData: response });
      }
    }
  }
};
