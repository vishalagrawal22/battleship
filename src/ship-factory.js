function shipFactory(length) {
  const isDestroyed = new Array(length);
  for (let i = 0; i < length; i++) {
    isDestroyed[i] = false;
  }

  let canHit = (position) => {
    if (0 <= position && position < length && !isDestroyed[position]) {
      return true;
    } else {
      return false;
    }
  };

  let hit = (position) => {
    if (!canHit(position)) {
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

  return { length, hit, canHit, isSunk };
}

export default shipFactory;
