export const checkRects = (rectA, rectB) => {
  if (
    rectA.x + rectA.width > rectB.x &&
    rectA.x < rectB.x + rectB.width &&
    rectA.y + rectA.height > rectB.y &&
    rectA.y < rectB.y + rectB.height
  ) {
    return true;
  }
  return false;
};

export const checkPoint = (x, y, rect) => {
  return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
};
