'use strict';

export const zeroPad = (num, length) => {
  const n = Math.abs(num);
  const zeros = Math.max(0, length - Math.floor(n).toString().length);
  let zeroString = Math.pow(10, zeros).toString().substr(1);
  if (num < 0) {
    zeroString = '-' + zeroString;
  }
  return zeroString + n;
};

export const closestPoint = (x, y, points) => {
  let minDistance = false;
  let closestPoint;
  for (let a = 0; a < points.length; a++) {
    const distance = Math.sqrt(
      (x - points[a].x) * (x - points[a].x) + (y - points[a].y) * (y - points[a].y)
    );
    if (minDistance === false || distance < minDistance) {
      minDistance = distance;
      closestPoint = points[a];
    }
  }
  return closestPoint;
};

export const doScreenfull = () => {
  // const isAndroid = /(android)/i.test(window.navigator.userAgent);
  // if (isAndroid && screenfull.enabled) {
  //   document.getElementById(GAME_DIV_ID).addEventListener('click', () => {
  //     if (screenfull.enabled && !screenfull.isFullscreen) {
  //       // screenfull.on('error', (event) => {
  //       //   console.error('Failed to enable fullscreen', event);
  //       // });
  //       // screenfull.on('change', () => {
  //       //   console.log('Am I fullscreen?', screenfull.isFullscreen ? 'Yes' : 'No');
  //       // });
  //       screenfull.request();
  //     }
  //   });
  // }
};
