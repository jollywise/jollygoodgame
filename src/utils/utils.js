/*
 * https://stackoverflow.com/questions/3698200/window-onload-vs-document-ready
 * https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery/55649686#55649686
 */
export const dOMReady = function (callback) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback());
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState !== 'loading') {
        callback();
      }
    });
  }
};

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
