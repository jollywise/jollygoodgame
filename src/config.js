// eslint-disable-next-line no-unused-vars
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
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
      createContainer: true,
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
