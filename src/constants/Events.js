/**
 * @const SETTINGS_EVENTS
 * @description collection of constant string id's related to settings events
 * @property {string} CLOSED=CLOSED string dispatched when settings are closed
 * @property {string} CHANGED=CHANGED string dispatched when settings are changed
 * @property {string} AUDIO_CHANGED=AUDIO_CHANGED string dispatched when settings audio is changed
 */
export const SETTINGS_EVENTS = {
  CLOSED: 'CLOSED',
  CHANGED: 'CHANGED',
  AUDIO_CHANGED: 'AUDIO_CHANGED',
};

/**
 * @const VIEWPORT_EVENTS
 * @description collection of constant string id's related to viewport events
 * @property {string} UPDATED='UPDATED' string dispatched when view port is updated
 */
export const VIEWPORT_EVENTS = {
  UPDATED: 'UPDATED',
};

/**
 * @const UI_EVENTS
 * @description collection of constant string id's related to ui events
 * @property {string} TAP=TAP string dispatched as a tap event
 */
export const UI_EVENTS = {
  TAP: 'TAP',
};
