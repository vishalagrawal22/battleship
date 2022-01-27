import { publish, subscribe } from './topic-manager';
import gameBoardFactory from './game-board';
import shipFactory from './ship-factory';
import { ADD_GAME_BOARDS_TO_DISPLAY, HANDLE_ATTACK } from './topic';

const currentPlayerGameBoard = gameBoardFactory(10, 10);
const currentPlayerShips = [
  shipFactory(3, 5, 2, 1),
  shipFactory(9, 4, 3, 1),
  shipFactory(2, 1, 3, 0),
  shipFactory(5, 6, 4, 1),
  shipFactory(2, 3, 5, 0),
];

currentPlayerShips.forEach((ship) => {
  currentPlayerGameBoard.addShip(ship);
});

const opponentGameBoard = gameBoardFactory(10, 10);
const opponentShips = [
  shipFactory(2, 8, 2, 0),
  shipFactory(9, 8, 3, 1),
  shipFactory(9, 2, 3, 1),
  shipFactory(6, 6, 4, 1),
  shipFactory(1, 4, 5, 0),
];

opponentShips.forEach((ship) => {
  opponentGameBoard.addShip(ship);
});

publish(ADD_GAME_BOARDS_TO_DISPLAY, {
  currentPlayerGameBoard,
  opponentGameBoard,
});

function handleAttack(topic, { x, y }) {
  opponentGameBoard.attack(x, y);
  publish(ADD_GAME_BOARDS_TO_DISPLAY, {
    currentPlayerGameBoard,
    opponentGameBoard,
  });
}
subscribe(HANDLE_ATTACK, handleAttack);
