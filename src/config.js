// eslint-disable-next-line no-unused-vars
import * as SpinePlugin from 'phaser/plugins/spine/dist/SpinePlugin';
/**
 * https://github.com/samme/phaser-plugin-game-scale
 * fit — scale the canvas up or down to fit the container, and within min/max lengths (if set).
 * resize — change the game dimensions to fit the container, and within min/max lengths (if set).
 * resize-and-fit — resize within min/max lengths, then scale the canvas to fit any remaining space within the container.
 * none — set the canvas scale to 100%.
 */

export const getConfigBase = ({
  type,
  parent,
  width,
  height,
  safeWidth,
  safeHeight,
  shortcutsEnabled,
  physics = true,
}) => {
  const maxParallelDownloads = 32;
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
    maxParallelDownloads,
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
      parent,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width,
      height,
    },
    dom: {
      createContainer: true,
    },
    shortcutsEnabled,
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
