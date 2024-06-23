self.onmessage = async (msg) => {
  console.log("WORKER MESSAGE RECEIVED", msg);

  // const handler = msg.data.targetHandler;

  // console.log("USE HANDLER", handler, msgHandlers);

  // await msgHandlers[handler](msg.data.targetData, msg.data.responseHandler);
};
