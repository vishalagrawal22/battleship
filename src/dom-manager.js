import { ADD_GAME_BOARDS_TO_DISPLAY, HANDLE_ATTACK } from './topic';
import { publish, subscribe } from './topic-manager';

function createGrid(num_of_rows, num_of_columns) {
  const grid = document.createElement('article');
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

function getCurrentPlayerGrid(gameboard) {
  const grid = createGrid(gameboard.num_of_rows, gameboard.num_of_columns);
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
  const grid = createGrid(gameboard.num_of_rows, gameboard.num_of_columns);
  markSuccessfullyDestroyedShipParts(grid, gameboard);
  markDestroyedCells(grid, gameboard);
  setupAttackListener(grid, gameboard);
  return grid;
}

function setupDisplay(topic, { currentPlayerGameBoard, opponentGameBoard }) {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const currentPlayerGrid = getCurrentPlayerGrid(currentPlayerGameBoard);
  const opponentGrid = getOpponentGrid(opponentGameBoard);
  main.append(currentPlayerGrid, opponentGrid);
}
subscribe(ADD_GAME_BOARDS_TO_DISPLAY, setupDisplay);
