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
  sceneController: {
    component: SceneControllerPlugin,
    gameKey: true,
    sceneKey: true,
  },
  soundController: {
    component: SoundPlugin,
    gameKey: true,
    sceneKey: true,
  },
  viewportController: {
    component: ViewportPlugin,
    gameKey: true,
    sceneKey: true,
  },
  shortcuts: {
    component: ShortcutsPlugin,
    gameKey: true,
    sceneKey: true,
  },
  appUrls: {
    component: AppUrlsPlugin,
    gameKey: true,
    sceneKey: true,
  },
  // optional components
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
  boundsDebug: {
    component: BoundsDebugPlugin,
    optional: true,
    isScenePlugin: true,
  },
};
