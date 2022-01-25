function shipFactory(start_x, start_y, length, isVertical) {
  const isDestroyed = new Array(length);
  for (let i = 0; i < length; i++) {
    isDestroyed[i] = false;
  }

  let getPosition = (target_x, target_y) => {
    if (isVertical) {
      return target_y - start_y;
    } else {
      return target_x - start_x;
    }
  };

  let canHit = (target_x, target_y) => {
    const position = getPosition(target_x, target_y);
    if (0 <= position && position < length && !isDestroyed[position]) {
      return true;
    } else {
      return false;
    }
  };

  let hit = (target_x, target_y) => {
    const position = getPosition(target_x, target_y);
    if (!canHit(target_x, target_y)) {
      return false;
    }
    isDestroyed[position] = true;
    return true;
  };

  let isSunk = () => {
    return isDestroyed.reduce((sunk, current) => {
      if (!current) {
        return false;
      } else {
        return sunk;
      }
    }, true);
  };

  return { start_x, start_y, length, isVertical, hit, canHit, isSunk };
}

export default shipFactory;
