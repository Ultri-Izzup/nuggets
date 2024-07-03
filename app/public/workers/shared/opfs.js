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
  if (fileHandles.has(cleanPath)) {
    fh = fileHandles.get(cleanPath);
  } else {
    fh = _resolveSyncFileHandle(cleanPath);
    fileHandles.set(cleanPath, fh)
  }

  return fh;
}

const newFileTimestamp = (short=false) => {
  let str = new Date().toISOString()
    .replaceAll('-', '')
    .replaceAll('T', '_')
    .replaceAll(':', '')
    .replaceAll('.', '_')
    .replaceAll('Z', '');

    if(short) {
      const parts = str.split('_')
      parts.pop();
      str = parts.join('_');
    }

    return str;
}

const writeJSONtoOPFS = async (json, filePath) => {

  const writeHandle = await getSyncFileHandle(filePath);

  const contents = textEncoder.encode(JSON.stringify(json));

  const newSize = await writeHandle.write(contents, { at: 0 });
  writeHandle.flush();
  writeHandle.close();

  return { filePath: filePath, fileSize: newSize }
}

const writeFiletoOPFS = async (content, filePath) => {

  const writeHandle = await getSyncFileHandle(filePath);

  console.log('WRITE CONTENT', content)

  const contents = await content.arrayBuffer();

  const newSize = writeHandle.write(contents, { at: 0 });
  writeHandle.flush();
  writeHandle.close();

  return { filePath: filePath, fileSize: newSize}
}

const getOPFSDirHandle = async (dirPath) => {
  return await _resolveDirHandle(dirPath.split('/'))
}

const opfsSyncRead = async (filePath) => {
  const pathParts = filePath.split('/');
  const fileName = pathParts.pop();
  const dirHandle = await _resolveDirHandle(pathParts);
  const fileHandle = await dirHandle.getFileHandle(fileName);
  const accessHandle = await fileHandle.createSyncAccessHandle();
  const size = accessHandle.getSize();
  console.log(size)
  const dataView = new DataView(new ArrayBuffer(size));
  await accessHandle.read(dataView);
  return dataView;
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

  if (dirHandles.has(path)) {
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

export { opfsRoot, fileNameRegex, opfsSyncRead, getSyncFileHandle, writeFiletoOPFS, writeJSONtoOPFS, newFileTimestamp }
