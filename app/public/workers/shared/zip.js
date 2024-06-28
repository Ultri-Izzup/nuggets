import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
} from "../node_modules/@zip.js/zip.js/index.js";


export async function getZipWriter () {
  const blobWriter = new BlobWriter("application/zip")
  const zipWriter = new ZipWriter(blobWriter);
  return zipWriter;
}

export async function getEncryptedZipWriter (secret, strength) {
  const blobWriter = new BlobWriter("application/zip")
  const zipWriter = new ZipWriter(blobWriter, { password: secret, encryptionStrength: strength });
  return zipWriter;
}

