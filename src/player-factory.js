import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';

function playerFactory(num_of_rows, num_of_columns, name) {
  let gameboard = gameBoardFactory(num_of_rows, num_of_columns);
  return { name, gameboard };
}

function computerFactory(num_of_rows, num_of_columns, name) {
  let { gameboard } = playerFactory(num_of_rows, num_of_columns, name);
  let moves = [];
  let pendingMoves = [];
  // oponnentGridInfo can have only three values unknown, hit, miss
  let opponentGridInfo = new Array(num_of_rows + 1);
  for (let x = 1; x <= num_of_rows; x++) {
    opponentGridInfo[x] = new Array(num_of_columns + 1);
    for (let y = 1; y <= num_of_columns; y++) {
      opponentGridInfo[x][y] = 'unknown';
      moves.push({ x, y });
    }
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

  function isValid(x, y) {
    if (!(1 <= x && x <= num_of_columns)) {
      return false;
    }

    if (!(1 <= y && y <= num_of_rows)) {
      return false;
    }

    return true;
  }

  function isMoveUsed(x, y) {
    let ind = moves.findIndex((move) => move.x === x && move.y === y);
    return ind === -1;
  }

  function markMoveAsUsed(x, y) {
    let ind = moves.findIndex((move) => move.x === x && move.y === y);
    moves.splice(ind, 1);
  }

  function markAdjacentCellAsPending(x, y) {
    pendingMoves = [];
    let diffArray = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    diffArray.forEach((diff) => {
      let nx = x + diff[0];
      let ny = y + diff[1];
      if (isValid(nx, ny) && !isMoveUsed(nx, ny)) {
        pendingMoves.push({ x: nx, y: ny });
      }
    });
  }

  function feedback(x, y, wasSuccess) {
    if (wasSuccess) {
      opponentGridInfo[x][y] = 'hit';
      markAdjacentCellAsPending(x, y);
    } else {
      opponentGridInfo[x][y] = 'miss';
    }
  }

  let getMove = () => {
    if (moves.length === 0) {
      return 'Out of moves';
    }

    let move;
    if (pendingMoves.length !== 0) {
      move = pendingMoves.pop();
    } else {
      let ind = getRandomInt(0, moves.length - 1);
      move = moves[ind];
    }
    markMoveAsUsed(move.x, move.y);
    return {
      x: move.x,
      y: move.y,
      feedback: feedback.bind(null, move.x, move.y),
    };
  };

  return { name, gameboard, getMove, generateGrid };
}

export { computerFactory, playerFactory };
