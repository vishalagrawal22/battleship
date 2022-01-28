import { publish, subscribe, unsubscribe } from './topic-manager';
import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';
import { playerFactory, computerFactory } from './player-factory';
import {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_VERDICT_TO_DISPLAY,
  INIT_DOM,
  HANDLE_START_GAME,
} from './topic';

function updateDisplay(currentPlayerGameBoard, opponentGameBoard) {
  publish(ADD_GAME_BOARDS_TO_DISPLAY, {
    currentPlayerGameBoard,
    opponentGameBoard,
  });
}

function addVerdictToDisplay(
  verdict,
  currentPlayerGameBoard,
  opponentGameBoard
) {
  publish(ADD_VERDICT_TO_DISPLAY, {
    verdict,
    currentPlayerGameBoard,
    opponentGameBoard,
  });
}

function gameFactory(mode, players) {
  let currentPlayer = 0;
  let tokens = [];
  function changeCurrentPlayer() {
    currentPlayer = 1 - currentPlayer;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getOpponent() {
    return 1 - currentPlayer;
  }

  function getCurrentPlayerBoard() {
    return players[getCurrentPlayer()].gameboard;
  }

  function getOpponentBoard() {
    return players[getOpponent()].gameboard;
  }

  function isGameOver() {
    const opponentGameBoard = players[getOpponent()].gameboard;
    return opponentGameBoard.isGameOver();
  }

  function registerAttack(x, y) {
    const opponentGameBoard = players[getOpponent()].gameboard;
    opponentGameBoard.attack(x, y);
  }

  function manageNextMove() {
    let gameOver = false;
    if (mode === 'PVP') {
      changeCurrentPlayer();
    } else {
      changeCurrentPlayer();
      const computer = players[getCurrentPlayer()];
      const { x, y } = computer.getMove();
      registerAttack(x, y);
      gameOver = isGameOver();
      if (gameOver) {
        const winner = players[getCurrentPlayer()].name;
        changeCurrentPlayer();
        end(`${winner} won!`);
      } else {
        changeCurrentPlayer();
      }
    }
    return { gameOver };
  }

  function handleAttack(topic, { x, y }) {
    registerAttack(x, y);
    if (isGameOver()) {
      const winner = players[getCurrentPlayer()].name;
      end(`${winner} won!`);
    } else {
      if (!manageNextMove().gameOver) {
        updateDisplay(getCurrentPlayerBoard(), getOpponentBoard());
      }
    }
  }
  const handleAttackToken = subscribe(HANDLE_ATTACK, handleAttack);
  tokens.push(handleAttackToken);

  function init() {
    updateDisplay(getCurrentPlayerBoard(), getOpponentBoard());
  }

  function end(verdict = 'game aborted') {
    addVerdictToDisplay(verdict, getCurrentPlayerBoard(), getOpponentBoard());
    tokens.forEach((token) => {
      unsubscribe(token);
    });
  }

  return { init, end, isGameOver };
}

const playersShipsData = [
  {
    start_x: 2,
    start_y: 8,
    length: 2,
    isVertical: false,
  },
  {
    start_x: 9,
    start_y: 2,
    length: 3,
    isVertical: true,
  },
  {
    start_x: 9,
    start_y: 8,
    length: 3,
    isVertical: true,
  },
  {
    start_x: 6,
    start_y: 6,
    length: 4,
    isVertical: true,
  },
  {
    start_x: 1,
    start_y: 4,
    length: 5,
    isVertical: false,
  },
];

const computerShipsData = [
  {
    start_x: 2,
    start_y: 8,
    length: 2,
    isVertical: false,
  },
  {
    start_x: 9,
    start_y: 2,
    length: 3,
    isVertical: true,
  },
  {
    start_x: 9,
    start_y: 8,
    length: 3,
    isVertical: true,
  },
  {
    start_x: 6,
    start_y: 6,
    length: 4,
    isVertical: true,
  },
  {
    start_x: 1,
    start_y: 4,
    length: 5,
    isVertical: false,
  },
];

publish(INIT_DOM, {});

let game = null;
function manageLastGame() {
  if (!game.isGameOver()) {
    game.end();
  }
  game = null;
}

function handleStartGame(topic, {}) {
  if (game !== null) {
    manageLastGame();
  }

  const players = [
    playerFactory(10, 10, 'player1'),
    computerFactory(10, 10, 'computer'),
  ];

  playersShipsData.forEach((shipData) => {
    const ship = shipFactory(
      shipData.start_x,
      shipData.start_y,
      shipData.length,
      shipData.isVertical
    );
    players[0].gameboard.addShip(ship);
  });

  computerShipsData.forEach((shipData) => {
    const ship = shipFactory(
      shipData.start_x,
      shipData.start_y,
      shipData.length,
      shipData.isVertical
    );
    players[1].gameboard.addShip(ship);
  });

  game = gameFactory('VS Computer', players);
  game.init();
}
subscribe(HANDLE_START_GAME, handleStartGame);
