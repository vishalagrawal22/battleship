import shipFactory from './ship-factory';

function createGrid(length) {
  const grid = document.createElement('article');
  for (let i = 0; i < length; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < length; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
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

const grid = createGrid(10);
const verticalShip = shipFactory(2, 3, 5, 1);
const horizontalShip = shipFactory(5, 5, 4, 0);
massAddShipsToGrid(grid, [verticalShip, horizontalShip]);

const main = document.querySelector('main');
main.appendChild(grid);
