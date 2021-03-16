// eslint-disable-next-line no-unused-vars

import { SavesPlugin } from '@jollywise/jollygoodgame/src/components';
import { AppUrlsPlugin } from '@jollywise/jollygoodgame/src/components/appurls/AppUrlsPlugin';
import { CaptionsPlugin } from '@jollywise/jollygoodgame/src/components/captions/CaptionsPlugin';
import { CopyPlugin } from '@jollywise/jollygoodgame/src/components/copy/CopyPlugin';
import { GameHudPlugin } from '@jollywise/jollygoodgame/src/components/gamehud/GameHudPlugin';
import { SceneControllerPlugin } from '@jollywise/jollygoodgame/src/components/sceneController/SceneControllerPlugin';
import { SettingsPlugin } from '@jollywise/jollygoodgame/src/components/settings/SettingsPlugin';
import { ShortcutsPlugin } from '@jollywise/jollygoodgame/src/components/shortcuts/ShortcutsPlugin';
import { SoundPlugin } from '@jollywise/jollygoodgame/src/components/sound/SoundPlugin';
import { VibratePlugin } from '@jollywise/jollygoodgame/src/components/vibrate/VibratePlugin';
import { ViewportPlugin } from '@jollywise/jollygoodgame/src/components/viewport/ViewportPlugin';
import * as SpinePlugin from 'phaser/plugins/spine/dist/SpinePlugin';
/*
 * https://github.com/samme/phaser-plugin-game-scale
 * fit — scale the canvas up or down to fit the container, and within min/max lengths (if set).
 * resize — change the game dimensions to fit the container, and within min/max lengths (if set).
 * resize-and-fit — resize within min/max lengths, then scale the canvas to fit any remaining space within the container.
 * none — set the canvas scale to 100%.
 */

const GAME_WIDTH_DEFAULT = 1680;
const GAME_HEIGHT_DEFAULT = 720;
const GAME_WIDTH_SAFE = 960;
const GAME_HEIGHT_SAFE = 720;
const GAME_DIV_ID = 'game-holder';

export const getConfigBase = ({
  type = Phaser.AUTO,
  parent = GAME_DIV_ID,
  width = GAME_WIDTH_DEFAULT,
  height = GAME_HEIGHT_DEFAULT,
  safeWidth = GAME_WIDTH_SAFE,
  safeHeight = GAME_HEIGHT_SAFE,
  physics = true,
  gameURL = './',
  assetsRoot = 'assets/',
} = {}) => {
  const conf = {
    gameURL: '',
    gameVersion: '2',
    type,
    parent,
    width,
    height,
    safeWidth,
    safeHeight,
    banner: false,
    fps: 60,
    maxParallelDownloads: 32,
    audio: {
      disableWebAudio: false,
    },
    plugins: {
      global: [],
      scene: [
        {
          key: 'SpinePlugin',
          plugin: window.SpinePlugin,
          sceneKey: 'spine',
        },
      ],
    },
    scale: {
      mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
      createContainer: true,
    },
    // AppBase components
    components: {
      copy: CopyPlugin,
      settings: SettingsPlugin,
      sceneController: SceneControllerPlugin,
      soundController: SoundPlugin,
      viewportController: ViewportPlugin,
      shortcuts: ShortcutsPlugin,
      hud: GameHudPlugin,
      vibrate: VibratePlugin,
      captions: CaptionsPlugin,
      saves: SavesPlugin,
      appUrls: { component: AppUrlsPlugin, data: { base: gameURL, assets: assetsRoot } },
    },
  };
  if (physics) {
    conf.physics = {
      default: 'matter',
      matter: {
        debug: __WATCH__,
        debugBodyColor: 0x000000,
      },
    };
  }
  return conf;
};
