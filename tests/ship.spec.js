import { TestWatcher } from 'jest';
import shipFactory from '../src/ship-factory.js';

describe('ship object testing', () => {
  let ship;
  beforeEach(() => {
    ship = shipFactory(5);
  });

  test('check if length is set', () => {
    expect(ship.length).toBe(5);
  });

  test('check if ship is sunk at start', () => {
    expect(ship.isSunk()).toBe(false);
  });

  test('check all position are not hit', () => {
    for (let i = 0; i < ship.length; i++) {
      expect(ship.canHit(i)).toBe(true);
    }
  });

  test('check hit works', () => {
    expect(ship.hit(ship.length - 1)).toBe(true);
    expect(ship.canHit(ship.length - 1)).toBe(false);
    for (let i = 0; i < ship.length - 1; i++) {
      expect(ship.canHit(i)).toBe(true);
    }
  });

  test('check ship can be sunk', () => {
    for (let i = 0; i < ship.length; i++) {
      expect(ship.hit(i)).toBe(true);
    }
    expect(ship.isSunk()).toBe(true);
  });
});
