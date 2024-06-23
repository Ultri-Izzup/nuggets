/**
 * Worker script dedicated to handling system fileHandles from the browser,
 * writing the file to OPFS in the given directory, and then
 * creating a record in the Dexie/IndexedDB assets linking to the nugget.
 */

/**
 * DEFINE onmessage HANDLERS
 */
const msgHandlers = {
  // opfsUploadNuggetFile: opfsUploadNuggetFile,
  // opfsWriteNuggetFile: opfsWriteNuggetFile,
  // spaceExport: spaceExport
};

/**
 * HANDLE onmessage EVENTS.
 * Use msgHandlers object to map msg to a handler functions above.
 * @param {*} msg
 */
self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  // const handler = msg.data.targetHandler;

  // console.log("USE HANDLER", handler, msgHandlers);

  // await msgHandlers[handler](msg.data.targetData, msg.data.responseHandler);
};
