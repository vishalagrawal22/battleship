const ADD_GAME_BOARDS_TO_DISPLAY = 'DOM: add player game boards to display';
// data: { currentPlayerGameBoard, opponentGameBoard }
// both should be gameboard object

const HANDLE_ATTACK = 'Controller: handle attack on gameboard';
// data: { x, y }

const ADD_VERDICT_TO_DISPLAY = 'DOM: add verdict to display';
// data: { verdict, currentPlayerGameBoard, opponentGameBoard }

const HANDLE_ADD_SHIP = 'Controller: handle add ship';
// data: { start_x, start_y, length, isVertical, id }

const INIT_DOM = 'DOM: Initialize';
// data: { }

const HANDLE_START_GAME = 'Controller: start game';
// data: { }

const ADD_SHIP_TO_DISPLAY = 'DOM: add ship to display';
// data: { ship }

export {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_VERDICT_TO_DISPLAY,
  HANDLE_ADD_SHIP,
  ADD_SHIP_TO_DISPLAY,
  INIT_DOM,
  HANDLE_START_GAME,
};
