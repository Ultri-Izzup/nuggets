const metaTypes = ['action', 'creativeWork', 'entity', 'event', 'item', 'collection', 'place', 'circle']

export const nuggetRelationTypes = ['includes','hasPropertyOf','replacedBy','inSeries'];

const actionDependencyTypes = ['finishToStart','startToStart','finishToFinish','startToFinish'];

export const discreteMimeTypes = ['application', 'audio', 'font', 'image', 'text', 'video']

// The short list we recommend using
export const platformMimeTypes = {
  application: ['octet-stream', 'gzip', 'json', 'pdf', 'xml', 'x-7z-compressed', 'zip'],
  audio: ['mpeg', 'ogg', 'webm'],
  image: ['gif', 'jpeg', 'png', 'webp'],
  font: ['otf', 'woff', 'woff2'],
  text: ['css', 'csv', 'html', 'calendar', 'javascript', 'plain'],
  video: ['mp4', 'mpeg', 'ogg', 'webm']
}

export const allPlatformMimeTypes = [...platformMimeTypes.application, ...platformMimeTypes.audio, ...platformMimeTypes.image, platformMimeTypes.font, platformMimeTypes.text, platformMimeTypes.video]
