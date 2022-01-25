import shipFactory from '../src/ship-factory.js';

describe('ship object testing', () => {
  let verticalShip, horizontalShip;
  beforeEach(() => {
    verticalShip = shipFactory(3, 2, 5, true);
    horizontalShip = shipFactory(2, 3, 3, false);
  });

  test('checks length is set', () => {
    expect(verticalShip.length).toBe(5);
    expect(horizontalShip.length).toBe(3);
  });

  test('checks ships are not sunk', () => {
    expect(verticalShip.isSunk()).toBe(false);
    expect(horizontalShip.isSunk()).toBe(false);
  });

  test('checks all positions in vertical ship is not hit', () => {
    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        verticalShip.canHit(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(true);
    }
  });

  test('checks all positions in horizontal ship is not hit', () => {
    for (let i = 0; i < horizontalShip.length; i++) {
      expect(
        horizontalShip.canHit(
          horizontalShip.start_x + i,
          horizontalShip.start_y
        )
      ).toBe(true);
    }
  });

  test('check hit works in vertical ship', () => {
    expect(
      verticalShip.canHit(verticalShip.start_x, verticalShip.start_y + 1)
    ).toBe(true);

    expect(
      verticalShip.hit(verticalShip.start_x, verticalShip.start_y + 1)
    ).toBe(true);

    expect(
      verticalShip.canHit(verticalShip.start_x, verticalShip.start_y + 1)
    ).toBe(false);
  });

  test('check hit works in horizontal ship', () => {
    expect(
      horizontalShip.canHit(horizontalShip.start_x + 1, horizontalShip.start_y)
    ).toBe(true);

    expect(
      horizontalShip.hit(horizontalShip.start_x + 1, horizontalShip.start_y)
    ).toBe(true);

    expect(
      horizontalShip.canHit(horizontalShip.start_x + 1, horizontalShip.start_y)
    ).toBe(false);
  });

  test('check vertical ship can be sunk', () => {
    for (let i = 0; i < verticalShip.length; i++) {
      expect(
        verticalShip.hit(verticalShip.start_x, verticalShip.start_y + i)
      ).toBe(true);
    }
    expect(verticalShip.isSunk()).toBe(true);
  });

  test('check horizontal ship can be sunk', () => {
    for (let i = 0; i < horizontalShip.length; i++) {
      expect(
        horizontalShip.hit(horizontalShip.start_x + i, horizontalShip.start_y)
      ).toBe(true);
    }
    expect(horizontalShip.isSunk()).toBe(true);
  });
});
