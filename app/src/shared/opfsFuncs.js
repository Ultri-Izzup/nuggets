const opfsRoot = await navigator.storage.getDirectory();

export async function opfsFile (path, writeable=false) {
  const segments = path.split('/');
  console.log(segments)
  const fileName = segments.pop();
  console.log(segments, fileName);

  const parentDH = await _getDH(segments);

  const fh = await parentDH.getFileHandle(fileName, { create: true });

  return fh
}

async function _getDH (dirSegments) {
  let currDirHandle = opfsRoot;
  let currDirName = "/";

  for (const segment of dirSegments) {
    currDirName = `${currDirName}${segment}/`;
    console.log(`RECURSED TO ${currDirName}`);
    console.log("LOADING DIRHANDLE", currDirName);
    currDirHandle = await currDirHandle.getDirectoryHandle(segment, {
      create: true
    });
  }

  return currDirHandle;
}
