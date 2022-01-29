import { publish, subscribe, unsubscribe } from './topic-manager';
import shipFactory from './ship-factory';
import { playerFactory, computerFactory } from './player-factory';
import {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_VERDICT_TO_DISPLAY,
  INIT_DOM,
  HANDLE_START_GAME,
  ADD_SHIP_TO_DISPLAY,
  HANDLE_ADD_SHIP,
  ADD_ERROR_TO_DISPLAY,
  DOM_RESET_GAME,
  DOM_START_GAME,
  HANDLE_RESET_GAME,
} from './topic';
import gameBoardFactory from './game-board';

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
    return !opponentGameBoard.isEmpty(x, y);
  }

  function manageNextMove() {
    let gameOver = false;
    if (mode === 'PVP') {
      changeCurrentPlayer();
    } else {
      changeCurrentPlayer();
      const computer = players[getCurrentPlayer()];
      const { x, y, feedback } = computer.getMove();
      const wasSuccess = registerAttack(x, y);
      feedback(wasSuccess);
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
    publish(DOM_START_GAME, {
      currentPlayerGameBoard: getCurrentPlayerBoard(),
      opponentGameBoard: getOpponentBoard(),
    });
  }

  function end(verdict = 'game aborted') {
    addVerdictToDisplay(verdict, getCurrentPlayerBoard(), getOpponentBoard());
    tokens.forEach((token) => {
      unsubscribe(token);
    });
  }

  return { init, end, isGameOver };
}

let playersShipsData = [];
let checkerGameBoard = gameBoardFactory(10, 10);

function handleAddShip(topic, { start_x, start_y, length, isVertical }) {
  const ship = shipFactory(start_x, start_y, length, isVertical);
  let error = '';
  if (checkerGameBoard.addShip(ship)) {
    playersShipsData.push({
      start_x,
      start_y,
      length,
      isVertical,
    });
    publish(ADD_SHIP_TO_DISPLAY, {
      ship,
    });
  } else {
    error = 'Place the ship correctly';
  }

  publish(ADD_ERROR_TO_DISPLAY, {
    error,
  });
}
subscribe(HANDLE_ADD_SHIP, handleAddShip);

publish(INIT_DOM, {});

let game = null;
function manageLastGame() {
  if (game !== null && !game.isGameOver()) {
    game.end();
  }
  game = null;
}

async function handleStartGame(topic, { playerName, computerName }) {
  if (game !== null) {
    manageLastGame();
  }

  const player = playerFactory(10, 10, playerName);
  playersShipsData.forEach((shipData) => {
    const ship = shipFactory(
      shipData.start_x,
      shipData.start_y,
      shipData.length,
      shipData.isVertical
    );
    player.gameboard.addShip(ship);
  });

  const computer = computerFactory(10, 10, computerName);
  await computer.generateGrid([5, 4, 3, 3, 2]);

  const players = [player, computer];

  game = gameFactory('VS Computer', players);
  game.init();
}
subscribe(HANDLE_START_GAME, handleStartGame);

function handleResetGame(topic, {}) {
  manageLastGame();
  playersShipsData = [];
  checkerGameBoard = gameBoardFactory(10, 10);
  publish(DOM_RESET_GAME, {});
}
subscribe(HANDLE_RESET_GAME, handleResetGame);
