const ADD_GAME_BOARDS_TO_DISPLAY = 'DOM: add player game boards to display';
// data: { currentPlayerGameBoard, opponentGameBoard }
// both should be gameboard object

const HANDLE_ATTACK = 'Controller: handle attack on gameboard';
// data: { x, y }

const ADD_WINNER_TO_DISPLAY = 'DOM: add winner to display';
// data: { winner, currentPlayerGameBoard, opponentGameBoard }

export { ADD_GAME_BOARDS_TO_DISPLAY, HANDLE_ATTACK, ADD_WINNER_TO_DISPLAY };
