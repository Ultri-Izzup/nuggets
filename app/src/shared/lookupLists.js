export const nuggetRelationTypes = new Map([[1, 'parent'], [2, 'child']])

export const discreteMimeTypes = ['application', 'audio', 'font', 'image', 'model', 'text', 'video']

export const platformMimeTypes = {
  application: ['octet-stream', 'gzip', 'json', 'pdf', 'xml', 'x-7z-compressed', 'zip'],
  audio: ['aac', 'midi', 'mpeg', 'ogg', 'webm'],
  image: ['apmg', 'bmp', 'gif', 'jpeg', 'png', 'webp'],
  font: ['otf', 'woff', 'woff2'],
  model: [],
  text: ['css', 'csv', 'html', 'calendar', 'javascript', 'plain'],
  video: ['avi', 'mp4', 'mpeg', 'ogg', 'webm']
}
