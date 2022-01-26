import { playerFactory, computerFactory } from '../src/player-factory';

describe('test normal player', () => {
  let player,
    n = 10,
    m = 10;
  beforeEach(() => {
    player = playerFactory(n, m, 'player1');
  });

  test('name is set', () => {
    expect(player.name).toBe('player1');
  });
});

describe('test computer player', () => {
  let computer,
    n = 10,
    m = 8;
  beforeEach(() => {
    computer = computerFactory(n, m, 'computer');
  });

  test('name is set', () => {
    expect(computer.name).toBe('computer');
  });

  test('return valid move', () => {
    const move = computer.getMove();
    expect(move.x).toBeGreaterThan(0);
    expect(move.x).toBeLessThan(n + 1);
    expect(move.y).toBeGreaterThan(0);
    expect(move.y).toBeLessThan(m + 1);
  });

  test('return valid moves till runout', () => {
    let vis = new Array(n + 1);
    for (let i = 1; i <= n; i++) {
      vis[i] = new Array(m + 1);
      for (let j = 1; j <= m; j++) {
        vis[i][j] = false;
      }
    }

    for (let i = 0; i < n * m; i++) {
      const move = computer.getMove();
      expect(vis[move.x][move.y]).toBe(false);
      vis[move.x][move.y] = true;
    }

    expect(computer.getMove()).toBe('Out of moves');
  });
});
