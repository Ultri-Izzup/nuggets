 /**
   * Shortens and simplifies a timestamp, for use in creating file names etc.
   * @returns {string}
   */
export function newFileTimestamp () {
    return new Date().toISOString()
    .replaceAll('-', '')
    .replaceAll('T', '_')
    .replaceAll(':', '')
    .replaceAll('.', '_')
    .replaceAll('Z', '');
  }

/**
 * Convert a JS object with ref values to plain JSON
 * @param {object} data
 * @returns
 */
export function resolveToJSON (data) {
  return JSON.parse(JSON.stringify(data));
}

