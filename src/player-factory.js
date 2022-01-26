import gameBoardFactory from './game-board';

function playerFactory(n, m, name) {
  let board = gameBoardFactory(n, m);
  return { name, board };
}

function computerFactory(n, m, name) {
  let { board } = playerFactory(n, m, name);
  let moves = [];
  for (let x = 1; x <= n; x++) {
    for (let y = 1; y <= m; y++) {
      moves.push({ x, y });
    }
  }

  let getRandomInt = (n) => {
    let value = Math.floor(Math.random() * n);
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

  return { name, board, getMove };
}

export { computerFactory, playerFactory };
