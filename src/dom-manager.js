import {
  ADD_GAME_BOARDS_TO_DISPLAY,
  HANDLE_ATTACK,
  ADD_VERDICT_TO_DISPLAY,
  HANDLE_ADD_SHIP,
  HANDLE_START_GAME,
  INIT_DOM,
} from './topic';
import gameBoardFactory from './game-board';
import { publish, subscribe } from './topic-manager';

function createGrid(num_of_rows, num_of_columns, player_type) {
  const grid = document.createElement('article');
  grid.setAttribute('data-player-type', player_type);
  for (let i = 0; i < num_of_rows; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < num_of_columns; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (i == 0) {
        cell.style['border-top'] = '2px solid black';
      } else if (i === num_of_rows - 1) {
        cell.style['border-bottom'] = '2px solid black';
      }

      if (j == 0) {
        cell.style['border-left'] = '2px solid black';
      } else if (j === num_of_columns - 1) {
        cell.style['border-right'] = '2px solid black';
      }

      const shipContainer = document.createElement('div');
      cell.appendChild(shipContainer);
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  return grid;
}

function getCell(grid, x, y) {
  const row = grid.children.item(y - 1);
  const cell = row.children.item(x - 1);
  return cell.firstChild;
}

function addShipToGrid(grid, ship) {
  const start = getCell(grid, ship.start_x, ship.start_y);
  if (ship.isVertical) {
    start.classList.add('round-top');
  } else {
    start.classList.add('round-left');
  }

  if (ship.isVertical) {
    const end = getCell(grid, ship.start_x, ship.start_y + ship.length - 1);
    end.classList.add('round-bottom');
  } else {
    const end = getCell(grid, ship.start_x + ship.length - 1, ship.start_y);
    end.classList.add('round-right');
  }

  for (let i = 1; i <= ship.length - 2; i++) {
    let cell;
    if (ship.isVertical) {
      cell = getCell(grid, ship.start_x, ship.start_y + i);
    } else {
      cell = getCell(grid, ship.start_x + i, ship.start_y);
    }
    cell.classList.add('mid');
  }
}

function massAddShipsToGrid(grid, ships) {
  ships.forEach((ship) => {
    addShipToGrid(grid, ship);
  });
}

function markDestroyedCells(grid, gameboard) {
  for (let y = 1; y <= gameboard.num_of_rows; y++) {
    for (let x = 1; x <= gameboard.num_of_columns; x++) {
      if (!gameboard.canAttack(x, y)) {
        const cell = getCell(grid, x, y);
        cell.classList.add('destroyed');
      }
    }
  }
}

function setupDropZone(grid, gameboard) {
  for (let y = 1; y <= gameboard.num_of_rows; y++) {
    for (let x = 1; x <= gameboard.num_of_columns; x++) {
      const cell = getCell(grid, x, y);
      cell.addEventListener('dragover', (event) => {
        event.preventDefault();
      });

      cell.addEventListener('drop', (event) => {
        event.preventDefault();
        const id = event.dataTransfer.getData('ship-id');
        const offset = event.dataTransfer.getData('ship-offset');
        const ship = document.querySelector(`#${id}`);
        const length = parseInt(ship.getAttribute('data-length'));
        const isVertical = ship.classList.contains('vertical');
        let start_x = x;
        let start_y = y;
        if (isVertical) {
          start_y -= offset;
        } else {
          start_x -= offset;
        }

        publish(HANDLE_ADD_SHIP, {
          start_x,
          start_y,
          length,
          isVertical,
          id,
        });
      });
    }
  }
}

function getCurrentPlayerGrid(gameboard) {
  const grid = createGrid(
    gameboard.num_of_rows,
    gameboard.num_of_columns,
    'current'
  );
  setupDropZone(grid, gameboard);
  markDestroyedCells(grid, gameboard);
  massAddShipsToGrid(grid, gameboard.ships);
  return grid;
}

function markSuccessfullyDestroyedShipParts(grid, gameboard) {
  for (let y = 1; y <= gameboard.num_of_rows; y++) {
    for (let x = 1; x <= gameboard.num_of_columns; x++) {
      if (!gameboard.canAttack(x, y) && !gameboard.isEmpty(x, y)) {
        const cell = getCell(grid, x, y);
        cell.classList.add('success');
      }
    }
  }
}

function disableAttackListeners(grid) {
  grid.style['pointer-events'] = 'none';
}

function setupAttackListener(grid, gameboard) {
  for (let y = 1; y <= gameboard.num_of_rows; y++) {
    for (let x = 1; x <= gameboard.num_of_columns; x++) {
      if (gameboard.canAttack(x, y)) {
        const cell = getCell(grid, x, y);
        cell.addEventListener('click', () => {
          disableAttackListeners(grid);
          publish(HANDLE_ATTACK, { x, y });
        });
      }
    }
  }
}

function getOpponentGrid(gameboard) {
  const grid = createGrid(
    gameboard.num_of_rows,
    gameboard.num_of_columns,
    'opponent'
  );
  markSuccessfullyDestroyedShipParts(grid, gameboard);
  markDestroyedCells(grid, gameboard);
  return grid;
}

function setupDisplay(topic, { currentPlayerGameBoard, opponentGameBoard }) {
  const gameBoardsSection = document.querySelector('.game-boards-section');
  gameBoardsSection.innerHTML = '';
  const currentPlayerGrid = getCurrentPlayerGrid(currentPlayerGameBoard);
  const opponentGrid = getOpponentGrid(opponentGameBoard);
  setupAttackListener(opponentGrid, opponentGameBoard);
  gameBoardsSection.append(currentPlayerGrid, opponentGrid);
}
subscribe(ADD_GAME_BOARDS_TO_DISPLAY, setupDisplay);

function addVerdictToDisplay(
  topic,
  { verdict, currentPlayerGameBoard, opponentGameBoard }
) {
  const verdictElement = document.querySelector('.verdict');
  verdictElement.textContent = verdict;
  setupDisplay(null, { currentPlayerGameBoard, opponentGameBoard });
  const opponentGrid = document.querySelector('[data-player-type="opponent"]');
  disableAttackListeners(opponentGrid);
}
subscribe(ADD_VERDICT_TO_DISPLAY, addVerdictToDisplay);

function setupDraggableShips() {
  const shipLengths = [5, 4, 3, 3, 2];
  const ships = Array.from(document.querySelector('.drag-ships').children);
  ships.forEach((ship, index) => {
    ship.setAttribute('draggable', 'true');
    ship.setAttribute('data-length', shipLengths[index]);

    ship.classList.add('ship');
    for (let i = 0; i < shipLengths[index]; i++) {
      const cell = document.createElement('div');
      cell.classList.add('ship-part');
      const shipContainer = document.createElement('div');
      if (i === 0) {
        shipContainer.classList.add('round-left');
      } else if (i === shipLengths[index] - 1) {
        shipContainer.classList.add('round-right');
      } else {
        shipContainer.classList.add('mid');
      }
      cell.appendChild(shipContainer);
      ship.appendChild(cell);
    }

    ship.addEventListener('dragstart', (event) => {
      const partRef = event.explicitOriginalTarget;
      const isRef = (part) => part.firstChild === partRef;
      const offset = Array.from(ship.children).findIndex(isRef);
      event.dataTransfer.setData('ship-id', ship.id);
      event.dataTransfer.setData('ship-offset', offset);
    });

    ship.addEventListener('dblclick', (event) => {
      const start = ship.firstChild.firstChild;
      const end = ship.lastChild.firstChild;
      if (ship.classList.contains('vertical')) {
        start.classList.replace('round-top', 'round-left');
        end.classList.replace('round-bottom', 'round-right');
      } else {
        start.classList.replace('round-left', 'round-top');
        end.classList.replace('round-right', 'round-bottom');
      }
      ship.classList.toggle('vertical');
    });
  });
}

function setupStartButton() {
  const start = document.querySelector('.start');
  start.addEventListener('click', () => {
    publish(HANDLE_START_GAME, {});
  });
}

function setupActionButtons() {
  setupStartButton();
}

function setupDummyGameBoards() {
  const gameBoardsSection = document.querySelector('.game-boards-section');
  const dummyGameboard = gameBoardFactory(10, 10);
  const currentPlayerGrid = getCurrentPlayerGrid(dummyGameboard);
  const opponentGrid = getOpponentGrid(dummyGameboard);
  gameBoardsSection.append(currentPlayerGrid, opponentGrid);
}

function initializeDOM(topic, {}) {
  setupDraggableShips();
  setupDummyGameBoards();
  setupActionButtons();
}
subscribe(INIT_DOM, initializeDOM);
