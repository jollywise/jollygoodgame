import { CopyPlugin } from './copy/CopyPlugin';
import { CaptionsPlugin } from './captions/CaptionsPlugin';
import { GameHudPlugin } from './gamehud/GameHudPlugin';
import { VibratePlugin } from './vibrate/VibratePlugin';
import { SettingsPlugin } from './settings/SettingsPlugin';
import { SoundPlugin } from './sound/SoundPlugin';

export const ComponentMap = {
  CORE: [
    {
      key: 'copy',
      component: CopyPlugin,
      gameKey: true,
      sceneKey: true,
    },
    {
      key: 'captions',
      component: CaptionsPlugin,
      gameKey: true,
      sceneKey: true,
    },
    {
      key: 'settings',
      component: SettingsPlugin,
      gameKey: true,
      sceneKey: true,
    },
    {
      key: 'soundController',
      component: SoundPlugin,
      gameKey: true,
      sceneKey: true,
    },
  ],
  OPTIONAL: [
    {
      key: 'gamehud',
      component: GameHudPlugin,
      gameKey: true,
      sceneKey: true,
    },
    {
      key: 'vibrate',
      component: VibratePlugin,
      gameKey: true,
      sceneKey: true,
    },
  ],
};
