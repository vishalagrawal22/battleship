import gameBoardFactory from './game-board';

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

  let getRandomInt = (upper_bound) => {
    let value = Math.floor(Math.random() * (upper_bound + 1));
    return value;
  };

  let getMove = () => {
    if (moves.length === 0) {
      return 'Out of moves';
    }
    let ind = getRandomInt(moves.length - 1);
    const move = moves[ind];
    moves.splice(ind, 1);
    return move;
  };

  return { name, gameboard, getMove };
}

export { computerFactory, playerFactory };
