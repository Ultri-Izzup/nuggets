const opfsRoot = await navigator.storage.getDirectory();

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const fileNameRegex = /[^a-zA-Z0-9\-\_\.]/g;

const fileHandles = new Map();
const dirHandles = new Map();

const getSyncFileHandle = async (fullPath) => {
  let fh;

  const cleanPath = fullPath.replace(/^\/|\/$/g, '');
  console.log(cleanPath)
  if(fileHandles.has(cleanPath)) {
    fh = fileHandles.get(cleanPath);
  } else {
    fh = _resolveSyncFileHandle(cleanPath);
    fileHandles.set(cleanPath, fh)
  }

  return fh;
}

const _resolveSyncFileHandle = async (path) => {
  const segments = path.split('/');
  console.log(segments)
  const fileName = segments.pop();
  console.log(segments, fileName);

  const parentDH = await _resolveDirHandle(segments);

  const fh = await parentDH.getFileHandle(fileName, { create: true });

  const syncHandle = await fh.createSyncAccessHandle();

  return syncHandle;
}

const _resolveDirHandle = async (segments) => {
  const path = segments.join('/');
  console.log('PATH', path)

  let dh;

  if(dirHandles.has(path)) {
    dh = dirHandles.get(path)
  } else {
    dh = _createDH(segments)
    dirHandles.set(path, dh)
  }

  return dh;
}

const _createDH = async (dirSegments) => {

  let currDirHandle = opfsRoot;
  let currDirName = "/";

  for (const segment of dirSegments) {
    currDirName = `${currDirName}${segment}/`;
    console.log(`RECURSED TO ${currDirName}`);
    if (dirHandles.has(currDirName)) {
      console.log("USING CACHED DIRHANDLE", currDirName);
      currDirHandle = dirHandles.get(currDirName);
    } else {
      console.log("LOADING DIRHANDLE", currDirName);
      currDirHandle = await currDirHandle.getDirectoryHandle(segment, {
        create: true
      });
      dirHandles.set(currDirName, currDirHandle);
    }
  }

  return currDirHandle;
}

const writeJSONtoOPFS = async (json, filePath) => {

  const writeHandle = await getSyncFileHandle(filePath);

  const contents = textEncoder.encode(JSON.stringify(json));

  writeHandle.write(contents, { at: 0 });
  writeHandle.flush();
  const newSize = writeHandle.getSize();
  writeHandle.close();

  return { filePath: filePath, fileSize: newSize}
}

const getOPFSDirHandle = async (dirPath) => {
  return await _resolveDirHandle(dirPath.split('/'))
}

export { opfsRoot, fileNameRegex, getOPFSDirHandle, getSyncFileHandle, writeJSONtoOPFS}
