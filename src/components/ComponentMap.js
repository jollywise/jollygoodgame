import { CopyPlugin } from './copy/CopyPlugin';
import { CaptionsPlugin } from './captions/CaptionsPlugin';
import { GameHudPlugin } from './gamehud/GameHudPlugin';
import { VibratePlugin } from './vibrate/VibratePlugin';
import { SettingsPlugin } from './settings/SettingsPlugin';
import { SoundPlugin } from './sound/SoundPlugin';


export const ComponentMap = {
  copy: {
    component: CopyPlugin,
    gameKey: true,
    sceneKey: true,
  },
  captions: {
    component: CaptionsPlugin,
    gameKey: true,
    sceneKey: true,
  },
  settings: {
    component: SettingsPlugin,
    gameKey: true,
    sceneKey: true,
  },
  soundController: {
    component: SoundPlugin,
    gameKey: true,
    sceneKey: true,
  },
  gamehud: {
    component: GameHudPlugin,
    gameKey: true,
    sceneKey: true,
    optional: true,
  },
  vibrate: {
    component: VibratePlugin,
    gameKey: true,
    sceneKey: true,
    optional: true,
  },
};
