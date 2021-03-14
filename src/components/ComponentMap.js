import { CopyPlugin } from './copy/CopyPlugin';
import { CaptionsPlugin } from './captions/CaptionsPlugin';
import { GameHudPlugin } from './gamehud/GameHudPlugin';
import { VibratePlugin } from './vibrate/VibratePlugin';
import { SettingsPlugin } from './settings/SettingsPlugin';
import { SoundPlugin } from './sound/SoundPlugin';
import { AppUrlsPlugin } from './appurls/AppUrlsPlugin';
import { ViewportPlugin } from './viewport/ViewportPlugin';
import { ShortcutsPlugin } from './shortcuts/ShortcutsPlugin';
import { BoundsDebugPlugin } from './debug/BoundsDebugPlugin';
import { SceneControllerPlugin } from '@jollywise/jollygoodgame/src/components/sceneController/SceneControllerPlugin';

export const ComponentMap = {
  // core components
  copy: {
    component: CopyPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  captions: {
    component: CaptionsPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  settings: {
    component: SettingsPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  sceneController: {
    component: SceneControllerPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  soundController: {
    component: SoundPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  viewportController: {
    component: ViewportPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  shortcuts: {
    component: ShortcutsPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  appUrls: {
    component: AppUrlsPlugin,
    gameKey: true,
    sceneKey: true,
    required : true
  },
  // optional components
  gamehud: {
    component: GameHudPlugin,
    gameKey: true,
    sceneKey: true,
  },
  vibrate: {
    component: VibratePlugin,
    gameKey: true,
    sceneKey: true,
  },
  boundsDebug: {
    component: BoundsDebugPlugin,
  },
};
