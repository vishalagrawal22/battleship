import { publish, subscribe } from './topic-manager';
import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';
import { playerFactory, computerFactory } from './player-factory';
import {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_WINNER_TO_DISPLAY,
  INIT_DOM,
} from './topic';

function gameFactory(mode, players) {
  let currentPlayer = 0;
  function changeCurrentPlayer() {
    currentPlayer = 1 - currentPlayer;
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getOpponent() {
    return 1 - currentPlayer;
  }

  function updateDisplay() {
    const currentPlayerGameBoard = players[getCurrentPlayer()].gameboard;
    const opponentGameBoard = players[getOpponent()].gameboard;
    publish(ADD_GAME_BOARDS_TO_DISPLAY, {
      currentPlayerGameBoard,
      opponentGameBoard,
    });
  }

  function isGameOver() {
    const opponentGameBoard = players[getOpponent()].gameboard;
    return opponentGameBoard.isGameOver();
  }

  function registerAttack(x, y) {
    const opponentGameBoard = players[getOpponent()].gameboard;
    opponentGameBoard.attack(x, y);
  }

  function endGame(winner, currentPlayerGameBoard, opponentGameBoard) {
    publish(ADD_WINNER_TO_DISPLAY, {
      winner,
      currentPlayerGameBoard,
      opponentGameBoard,
    });
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
        // here we switch boards because current player is computer
        const currentPlayerGameBoard = players[getOpponent()].gameboard;
        const opponentGameBoard = players[getCurrentPlayer()].gameboard;
        endGame(winner, currentPlayerGameBoard, opponentGameBoard);
      }
      changeCurrentPlayer();
    }
    return { gameOver };
  }

  function handleAttack(topic, { x, y }) {
    registerAttack(x, y);
    if (isGameOver()) {
      const winner = players[getCurrentPlayer()].name;
      const currentPlayerGameBoard = players[getCurrentPlayer()].gameboard;
      const opponentGameBoard = players[getOpponent()].gameboard;
      endGame(winner, currentPlayerGameBoard, opponentGameBoard);
    } else {
      if (!manageNextMove().gameOver) {
        updateDisplay();
      }
    }
  }
  subscribe(HANDLE_ATTACK, handleAttack);

  function init() {
    updateDisplay();
  }

  return { init };
}

const players = [
  playerFactory(10, 10, 'player1'),
  computerFactory(10, 10, 'computer'),
];

const playerShip = [
  shipFactory(3, 5, 2, 1),
  shipFactory(9, 4, 3, 1),
  shipFactory(2, 1, 3, 0),
  shipFactory(5, 6, 4, 1),
  shipFactory(2, 3, 5, 0),
];

playerShip.forEach((ship) => {
  players[0].gameboard.addShip(ship);
});

const computerShips = [
  shipFactory(2, 8, 2, 0),
  shipFactory(9, 8, 3, 1),
  shipFactory(9, 2, 3, 1),
  shipFactory(6, 6, 4, 1),
  shipFactory(1, 4, 5, 0),
];

computerShips.forEach((ship) => {
  players[1].gameboard.addShip(ship);
});

let game = gameFactory('VS Computer', players);
game.init();

publish(INIT_DOM, {});
