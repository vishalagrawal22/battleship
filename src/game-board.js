function gameBoardFactory(num_of_rows, num_of_columns) {
  let ships = [];
  let grid = new Array(num_of_rows + 1);
  let isAttacked = new Array(num_of_rows + 1);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(num_of_columns + 1);
    isAttacked[i] = new Array(num_of_columns + 1);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = -1;
      isAttacked[i][j] = false;
    }
  }

  let checkValid = (ship) => {
    if (!(0 <= ship.start_x && ship.start_x < num_of_columns)) {
      return false;
    }

    if (!(0 <= ship.start_y && ship.start_y < num_of_rows)) {
      return false;
    }

    if (ship.isVertical) {
      const end_y = ship.start_y + ship.length - 1;
      if (!(0 <= end_y && end_y < num_of_rows)) {
        return false;
      }
    } else {
      const end_x = ship.start_x + ship.length - 1;
      if (!(0 <= end_x && end_x < num_of_columns)) {
        return false;
      }
    }
    return true;
  };

  let checkOverlap = (ship) => {
    for (let i = 0; i < ship.length; i++) {
      if (ship.isVertical) {
        if (grid[ship.start_x][ship.start_y + i] !== -1) {
          return true;
        }
      } else {
        if (grid[ship.start_x + i][ship.start_y] !== -1) {
          return true;
        }
      }
    }
    return false;
  };

  let addShip = (ship) => {
    if (!checkValid(ship) || checkOverlap(ship)) {
      return false;
    }

    ships.push(ship);
    for (let i = 0; i < ship.length; i++) {
      if (ship.isVertical) {
        grid[ship.start_x][ship.start_y + i] = ships.length - 1;
      } else {
        grid[ship.start_x + i][ship.start_y] = ships.length - 1;
      }
    }
    return true;
  };

  let canAttack = (target_x, target_y) => {
    if (isAttacked[target_x][target_y]) {
      return false;
    } else {
      return true;
    }
  };

  let isEmpty = (target_x, target_y) => {
    if (grid[target_x][target_y] == -1) {
      return true;
    } else {
      return false;
    }
  };

  let attack = (target_x, target_y) => {
    if (!canAttack(target_x, target_y)) {
      return false;
    }
    isAttacked[target_x][target_y] = true;
    if (!isEmpty(target_x, target_y)) {
      ships[grid[target_x][target_y]].hit(target_x, target_y);
    }
    return true;
  };

  let isGameOver = () => {
    return ships.reduce((result, ship) => {
      if (!ship.isSunk()) {
        return false;
      } else {
        return result;
      }
    }, true);
  };

  return {
    num_of_rows,
    num_of_columns,
    ships,
    addShip,
    attack,
    canAttack,
    isGameOver,
    isEmpty,
  };
}

export default gameBoardFactory;
