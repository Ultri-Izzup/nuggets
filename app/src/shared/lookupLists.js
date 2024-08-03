const metaTypes = ['action', 'creativeWork', 'entity', 'event', 'item', 'collection', 'place'];

const nuggetTypes = [
  ['creativeWork', ['post', 'canvas']],
  ['entity', ['org', 'person', 'circle']],
  ['plan', ['project', 'list', 'task']],
  ['location', ['address', 'geoJSON']],
  ['commerce', ['collection', 'product']],
  ['pack', ['container', 'item']],
  ['communication', ['call', 'chat',
    'email', 'conversation', 'meeting']]
];

const planningTypes = new Map([
  ['project', { label: 'Project' }],
  ['list', { label: 'Label' }],
  ['task', { label: 'Task' }],
  ['goal', { label: 'Goal' }],
]);

const recordKeepingTypes = new Map([
  ['canvas', { label: 'Canvas' }],
  ['document', { label: 'Document' }],
  ['record', { label: 'Record' }],
])

const marketplaceTypes = new Map([
  ['catalog', { label: 'Catalog' }],
  ['product', { label: 'Product' }],
]);

const packingTypes = new Map([
  ['container', { label: 'Container' }],
  ['item', { label: 'Item' }],
])

const calendarTypes = new Map([
  ['calendarEvent', { label: 'Calendar' }],
])

const communicationTypes = new Map([
  ['fediverseAccount', { label: 'Fediverse' }],
  ['sipAccount', { label: 'VoIP Service' }],
  ['communication', { label: 'Communication' }],
])

export const nugTypes = new Map([
  ['planning', {
    label: 'Planning',
    types: planningTypes
  }],
  ['documentation', {
    label: 'Record Keeping',
    types: recordKeepingTypes
  }],
  ['marketplace', {
    label: 'Marketplace',
    types: marketplaceTypes
  }],
  ['packing', {
    label: 'Pack and Store',
    types: packingTypes
  }],
  ['calendar', {
    label: 'Calendar',
    types: calendarTypes
  }],
  ['communicate', {
    label: 'Communications',
    types: communicationTypes
  }],
]);

  // // People and Orgs
  // ['circle', { label: 'Circle' }],
  // ['member', { label: 'Member' }],
  // ['organization', { label: 'Organization' }],
  // ['contact', { label: 'Contact' }],

  // // Governance
  // ['proposal', { label: 'Proposal' }],
  // ['decision', { label: 'Decision' }],
  // ['agreement', { label: 'Agreement' }],

export const nuggetRelationTypes = ['includes', 'hasPropertyOf', 'replacedBy', 'inSeries'];

const actionDependencyTypes = ['finishToStart', 'startToStart', 'finishToFinish', 'startToFinish'];

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
