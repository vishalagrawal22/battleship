import { publish, subscribe, unsubscribe } from './topic-manager';
import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';
import { playerFactory, computerFactory } from './player-factory';
import {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_VERDICT_TO_DISPLAY,
  INIT_DOM,
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

  return { init, end };
}

const players = [
  playerFactory(10, 10, 'player1'),
  computerFactory(10, 10, 'computer'),
];

const playersShips = [
  shipFactory(2, 8, 2, 0),
  shipFactory(9, 8, 3, 1),
  shipFactory(9, 2, 3, 1),
  shipFactory(6, 6, 4, 1),
  shipFactory(1, 4, 5, 0),
];

playersShips.forEach((ship) => {
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

publish(INIT_DOM, {});

let game = gameFactory('VS Computer', players);
game.init();
