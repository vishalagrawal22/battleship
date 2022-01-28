import shipFactory from '../src/ship-factory';
import gameBoardFactory from '../src/game-board';

describe('gameboard object testing', () => {
  let verticalShip, horizontalShip, gameBoard;
  beforeEach(() => {
    verticalShip = shipFactory(3, 2, 5, true);
    horizontalShip = shipFactory(1, 1, 3, false);
    gameBoard = gameBoardFactory(10, 10);
  });

  test('can add ship', () => {
    expect(gameBoard.addShip(verticalShip)).toBe(true);
    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        gameBoard.isEmpty(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(false);
    }
  });

  test('can add two ships which does not conflict', () => {
    expect(gameBoard.addShip(horizontalShip)).toBe(true);
    expect(gameBoard.addShip(verticalShip)).toBe(true);

    for (let i = 0; i < horizontalShip.length; i++) {
      expect(
        gameBoard.isEmpty(horizontalShip.start_x + i, horizontalShip.start_y)
      ).toBe(false);
    }

    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        gameBoard.isEmpty(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(false);
    }
  });

  // this test will break if overlapping ship coordinates are changed
  test('can not add ship which conflicts', () => {
    let overlapShip = shipFactory(2, 3, 3, false);
    expect(gameBoard.addShip(verticalShip)).toBe(true);
    expect(gameBoard.addShip(overlapShip)).toBe(false);
    expect(gameBoard.isEmpty(overlapShip.start_x, overlapShip.start_y)).toBe(
      true
    );
    expect(gameBoard.isEmpty(3, 3)).toBe(false);
  });

  test('can attack a cell', () => {
    expect(gameBoard.canAttack(4, 5)).toBe(true);
    expect(gameBoard.attack(4, 5)).toBe(true);
    expect(gameBoard.canAttack(4, 5)).toBe(false);
  });

  test('can end game', () => {
    expect(gameBoard.addShip(verticalShip)).toBe(true);
    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        gameBoard.attack(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(true);
    }
    expect(gameBoard.isGameOver()).toBe(true);
  });

  test('empty board is game over', () => {
    expect(gameBoard.isGameOver()).toBe(true);
  });

  test('can end game multi ships', () => {
    expect(gameBoard.addShip(verticalShip)).toBe(true);
    expect(gameBoard.addShip(horizontalShip)).toBe(true);

    expect(gameBoard.isGameOver()).toBe(false);

    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        gameBoard.attack(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(true);
    }

    expect(gameBoard.isGameOver()).toBe(false);

    for (let i = 0; i < horizontalShip.length; i++) {
      expect(
        gameBoard.attack(horizontalShip.start_x + i, horizontalShip.start_y)
      ).toBe(true);
    }
    expect(gameBoard.isGameOver()).toBe(true);
  });
});
