const buttons = {
  home: {
    id: 'btn_home',
    costume: 'btn_home',
    buttongroup: 'topleft',
    ariaLabelID: 'ariaLabelHud_home',
    gelvo: 'home',
    event: 'RETURN_HOME',
  },
  pause: {
    id: 'btn_pause',
    costume: 'btn_pause',
    buttongroup: 'topright',
    ariaLabelID: 'ariaLabelHud_pause',
    gelvo: 'pause',
    event: 'PAUSE_GAME',
  },
  howtoplay: {
    id: 'btn_howtoplay',
    costume: 'btn_howtoplay',
    buttongroup: 'bottomright',
    ariaLabelID: 'ariaLabelHud_howtoplay',
    gelvo: 'how_to_play',
  },
  exit_game: {
    id: 'btn_exit',
    costume: 'btn_exit',
    buttongroup: 'topleft',
    ariaLabelID: 'ariaLabelHud_exit',
    gelvo: 'exit',
    event: 'EXIT_GAME',
  },
  settings: {
    id: 'btn_settings',
    costume: 'btn_settings',
    buttongroup: 'topright',
    ariaLabelID: 'ariaLabelHud_settings',
    gelvo: 'settings',
    event: 'SHOW_SETTINGS',
  },
  sound: {
    id: 'btn_sound',
    costume: 'btn_sound',
    buttongroup: 'topright',
    ariaLabelID: 'ariaLabelHud_togglesound',
    event: 'TOGGLE_SOUND',
  },
  pause_resume: {
    id: 'btn_resume',
    costume: 'btn_play',
    buttongroup: 'center',
    ariaLabelID: 'ariaLabelHud_resume',
    gelvo: 'resume',
    event: 'RESUME_GAME',
  },
  start_game: {
    id: 'btn_play',
    costume: 'btn_play',
    buttongroup: 'center',
    ariaLabelID: 'ariaLabelHud_startgame',
    gelvo: 'play',
    event: 'START_GAME',
  },
};

const buttongroups = {
  center: {
    anchor_group: { x: 0.5, y: 0.5 },
    anchor_screen: { x: 0.5, y: 0.5 },
    align_buttons: 'center',
  },
  topright: {
    anchor_group: { x: 1, y: 0 },
    anchor_screen: { x: 1, y: 0 },
    align_buttons: 0,
  },
  topleft: {
    anchor_group: { x: 0, y: 0 },
    anchor_screen: { x: 0, y: 0 },
    align_buttons: 0,
  },
  bottomleft: {
    anchor_group: { x: 0, y: 1 },
    anchor_screen: { x: 0, y: 1 },
    align_buttons: 1,
  },
  bottomright: {
    anchor_group: { x: 1, y: 1 },
    anchor_screen: { x: 1, y: 1 },
    align_buttons: 1,
  },
};

const states = {
  EMPTY: {
    modal: false,
    buttons: [],
  },
  WELCOME: {
    buttons: ['exit_game', 'sound', 'settings', 'start_game', 'howtoplay'],
  },
  BASIC: {
    modal: false,
    buttons: ['pause'],
  },
  BASIC_HOME: {
    modal: false,
    buttons: ['home', 'pause'],
  },
  PAUSE: {
    modal: true,
    buttons: ['home', 'sound', 'settings', 'pause_resume', 'howtoplay'],
  },
};

export const HUD_CONFIG = {
  states,
  buttons,
  buttongroups,
};
