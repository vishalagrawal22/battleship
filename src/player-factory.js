import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';

function playerFactory(num_of_rows, num_of_columns, name) {
  let gameboard = gameBoardFactory(num_of_rows, num_of_columns);
  return { name, gameboard };
}

function computerFactory(num_of_rows, num_of_columns, name) {
  let { gameboard } = playerFactory(num_of_rows, num_of_columns, name);
  let searchMoves = [];
  let destroyMove = null;
  let moves = [];
  for (let x = 1; x <= num_of_rows; x++) {
    for (let y = 1; y <= num_of_columns; y++) {
      moves.push(moveFactory(x, y));
    }
  }

  function moveFactory(x, y) {
    const isValid = () => {
      if (!(1 <= x && x <= num_of_columns)) {
        return false;
      }

      if (!(1 <= y && y <= num_of_rows)) {
        return false;
      }

      return true;
    };

    const isUsed = () => {
      const ind = moves.findIndex((move) => move.x === x && move.y === y);
      return ind === -1;
    };

    const check = () => {
      if (!isValid()) {
        return false;
      }

      if (isUsed()) {
        return false;
      }

      return true;
    };

    const markAsUsed = () => {
      const ind = moves.findIndex((move) => move.x === x && move.y === y);
      moves.splice(ind, 1);
    };

    return { x, y, isValid, isUsed, check, markAsUsed };
  }

  function randomMoveFactory(x, y) {
    const type = 'random';
    const { isValid, isUsed, markAsUsed } = moveFactory(x, y);
    return { x, y, type, isValid, isUsed, markAsUsed };
  }

  function searchMoveFactory(x, y, parent_x, parent_y) {
    const type = 'search';
    const { isValid, isUsed, markAsUsed, check } = moveFactory(x, y);
    return {
      x,
      y,
      parent_x,
      parent_y,
      type,
      isValid,
      isUsed,
      markAsUsed,
      check,
    };
  }

  function destroyMoveFactory(start_x, start_y, end_x, end_y) {
    const type = 'destroy';
    const direction = {
      x: Math.abs(start_x - end_x),
      y: Math.abs(start_y - end_y),
    };
    const startMove = moveFactory(start_x, start_y);
    const endMove = moveFactory(end_x, end_y);

    const checkStart = () => {
      return startMove.check();
    };

    const checkEnd = () => {
      return endMove.check();
    };

    const extend = (move) => {
      return moveFactory(move.x - direction.x, move.y - direction.y);
    };

    const checkValidity = () => {
      return checkStart() && checkEnd();
    };

    const extendStart = () => {
      startMove = extend(startMove);
    };

    const extendEnd = () => {
      endMove = extend(endMove);
    };

    return {
      type,
      startMove,
      endMove,
      checkValidity,
      checkEnd,
      checkStart,
      extendStart,
      extendEnd,
    };
  }

  let getRandomInt = (lower_bound, upper_bound) => {
    let value = lower_bound + Math.floor(Math.random() * (upper_bound + 1));
    return value;
  };

  async function generateGrid(shipLengths) {
    for (let index = 0; index < shipLengths.length; index++) {
      const length = shipLengths[index];
      let done = false;
      while (!done) {
        const start_x = getRandomInt(1, num_of_columns);
        const start_y = getRandomInt(1, num_of_rows);
        const isVertical = getRandomInt(0, 1);
        const ship = shipFactory(start_x, start_y, length, isVertical);
        if (gameboard.addShip(ship)) {
          done = true;
        }
      }
    }
  }

  function addSearchMoves(x, y) {
    searchMoves = [];
    let diffArray = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    diffArray.forEach((diff) => {
      let nx = x + diff[0];
      let ny = y + diff[1];
      const nextSearchMove = searchMoveFactory(nx, ny, x, y);
      if (nextSearchMove.check()) {
        searchMoves.push(nextSearchMove);
      }
    });
  }

  function feedback(move, wasSuccess) {
    console.log(move);
    if (wasSuccess) {
      addSearchMoves(move.x, move.y);
    }
  }

  let getMove = () => {
    if (moves.length === 0) {
      return 'Out of moves';
    }

    let move;
    if (searchMoves.length !== 0) {
      move = searchMoves.pop();
    } else {
      let ind = getRandomInt(0, moves.length - 1);
      move = randomMoveFactory(moves[ind].x, moves[ind].y);
    }
    move.markAsUsed();

    return {
      x: move.x,
      y: move.y,
      feedback: feedback.bind(null, move),
    };
  };

  return { name, gameboard, getMove, generateGrid };
}

export { computerFactory, playerFactory };
