export const HUD_CONFIG = {
  "modal" : { "colour" : "0x140d17", "alpha" : 0.8 },
  "howtoplay": [
    { "title_id": "howtoplay_1_title", "copy_id": "howtoplay_1_copy", "image_key": "howtoplay_1" },
    { "title_id": "howtoplay_2_title", "copy_id": "howtoplay_2_copy", "image_key": "howtoplay_2" },
    { "title_id": "howtoplay_3_title", "copy_id": "howtoplay_3_copy", "image_key": "howtoplay_3" },
    { "title_id": "howtoplay_4_title", "copy_id": "howtoplay_4_copy", "image_key": "howtoplay_4" },
    { "title_id": "howtoplay_5_title", "copy_id": "howtoplay_5_copy", "image_key": "howtoplay_5" }
  ],
  "buttons": {
    "home": {
      "id": "btn_home",
      "costume": "btn_home",
      "buttongroup": "topleft",
      "ariaLabelID": "ariaLabelHud_home",
      "gelvo": "ui_home",
      "event": "RETURN_HOME"
    },
    "back_home": {
      "id": "btn_back_home",
      "costume": "btn_back",
      "buttongroup": "topleft",
      "ariaLabelID": "ariaLabelHud_home",
      "gelvo": "ui_home",
      "event": "RETURN_HOME"
    },
    "back": {
      "id": "btn_back",
      "costume": "btn_back",
      "buttongroup": "topleft",
      "ariaLabelID": "ariaLabelHud_back",
      "gelvo": "ui_back",
      "event": "BACK"
    },
    "howtoplay_back": {
      "id": "btn_back",
      "costume": "btn_back",
      "buttongroup": "topleft",
      "ariaLabelID": "ariaLabelHud_back",
      "gelvo": "ui_back",
      "event": "CLOSE_INSTRUCTIONS"
    },
    "pause": {
      "id": "btn_pause",
      "costume": "btn_pause",
      "buttongroup": "topright",
      "ariaLabelID": "ariaLabelHud_pause",
      "gelvo": "ui_pause",
      "event": "PAUSE_GAME"
    },
    "next": {
      "id": "btn_next",
      "costume": "btn_next",
      "ariaLabelID": "ariaLabelHud_next",
      "gelvo": "ui_next",
      "event": "NEXT"
    },
    "prev": {
      "id": "btn_prev",
      "costume": "btn_prev",
      "ariaLabelID": "ariaLabelHud_prev",
      "gelvo": "ui_previous",
      "event": "PREV"
    },
    "howtoplay": {
      "id": "btn_howtoplay",
      "costume": "btn_howtoplay",
      "buttongroup": "bottomright",
      "ariaLabelID": "ariaLabelHud_howtoplay",
      "gelvo": "ui_howtoplay",
      "event": "SHOW_INSTRUCTIONS"
    },
    "exit_game": {
      "id": "btn_exit",
      "costume": "btn_exit",
      "buttongroup": "topleft",
      "ariaLabelID": "ariaLabelHud_exit",
      "gelvo": "ui_exit",
      "event": "EXIT_GAME"
    },
    "go_explore": {
      "id": "btn_go_explore",
      "costume": "btn_goexplore",
      "buttongroup": "bottomleft",
      "ariaLabelID": "ariaLabelHud_exit",
      "gelvo": "ui_exit",
      "event": "EXIT_GAME"
    },
    "settings": {
      "id": "btn_settings",
      "costume": "btn_settings",
      "buttongroup": "topright",
      "ariaLabelID": "ariaLabelHud_settings",
      "gelvo": "ui_settings",
      "event": "SHOW_SETTINGS"
    },
    "sound": {
      "id": "btn_sound",
      "costume": "btn_sound",
      "buttongroup": "topright",
      "ariaLabelID": "ariaLabelHud_togglesound",
      "event": "TOGGLE_SOUND"
    },
    "pause_resume": {
      "id": "btn_resume",
      "costume": "btn_resume",
      "buttongroup": "center",
      "ariaLabelID": "ariaLabelHud_resume",
      "gelvo": "ui_resume",
      "event": "RESUME_GAME"
    },
    "start_game": {
      "id": "btn_play",
      "costume": "btn_play",
      "buttongroup": "center",
      "ariaLabelID": "ariaLabelHud_startgame",
      "gelvo": "ui_play",
      "event": "START_GAME"
    },
    "skip_cutscene": {
      "id": "btn_skip",
      "costume": "btn_skip",
      "buttongroup": "bottomright",
      "ariaLabelID": "ariaLabelHud_skip",
      "gelvo": "ui_skip",
      "event": "SKIP_CUTSCENE"
    }
  },
  "buttongroups" : {
    "center": {
      "anchor_group": { "x": 0.5, "y": 0.5 },
      "anchor_screen": { "x": 0.5, "y": 0.5 },
      "align_buttons": "center"
    },
    "topright": {
      "anchor_group": { "x": 1, "y": 0 },
      "anchor_screen": { "x": 1, "y": 0 },
      "align_buttons": 0
    },
    "topleft": {
      "anchor_group": { "x": 0, "y": 0 },
      "anchor_screen": { "x": 0, "y": 0 },
      "align_buttons": 0
    },
    "bottomleft": {
      "anchor_group": { "x": 0, "y": 1 },
      "anchor_screen": { "x": 0, "y": 1 },
      "align_buttons": 1
    },
    "bottomright": {
      "anchor_group": { "x": 1, "y": 1 },
      "anchor_screen": { "x": 1, "y": 1 },
      "align_buttons": 1
    }
  },
  "states": {
    "EMPTY": {
      "modal": false,
      "buttons": []
    },
    "BASIC_EXIT": {
      "buttons": ["exit_game", "pause"]
    },
    "BASIC": {
      "modal": false,
      "buttons": ["pause"]
    },
    "CUTSCENE": {
      "modal": false,
      "buttons": ["back_home", "pause", "skip_cutscene"]
    },
    "BASIC_HOME": {
      "modal": false,
      "buttons": ["home", "pause"]
    },
    "BASIC_BACK": {
      "modal": false,
      "buttons": ["back", "pause"]
    },
    "INGAME": {
      "modal": false,
      "buttons": ["back_home", "pause"]
    },
    "PAUSE": {
      "modal": true,
      "buttons": ["home", "sound", "settings", "pause_resume", "go_explore", "howtoplay"]
    },
    "HOW_TO_PLAY": {
      "modal": false,
      "buttons": ["howtoplay_back"]
    }
  }
}

