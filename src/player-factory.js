import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';

function playerFactory(num_of_rows, num_of_columns, name) {
  let gameboard = gameBoardFactory(num_of_rows, num_of_columns);
  return { name, gameboard };
}

function computerFactory(num_of_rows, num_of_columns, name) {
  let { gameboard } = playerFactory(num_of_rows, num_of_columns, name);
  let moves = [];
  for (let x = 1; x <= num_of_rows; x++) {
    for (let y = 1; y <= num_of_columns; y++) {
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

  let getMove = () => {
    if (moves.length === 0) {
      return 'Out of moves';
    }
    let ind = getRandomInt(0, moves.length - 1);
    const move = moves[ind];
    moves.splice(ind, 1);
    return move;
  };

  return { name, gameboard, getMove, generateGrid };
}

export { computerFactory, playerFactory };
