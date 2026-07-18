import { describe, it, expect } from 'vitest';
import { PLAYER_DATABASE, searchPlayers, getPlayersByCountry, getPlayerByName } from '../playerDatabase';

describe('playerDatabase', () => {
  it('should contain players database', () => {
    expect(Array.isArray(PLAYER_DATABASE)).toBe(true);
    expect(PLAYER_DATABASE.length).toBeGreaterThan(100);
  });

  it('should validate player object schema integrity', () => {
    const sample = PLAYER_DATABASE[0];
    expect(sample).toHaveProperty('name');
    expect(sample).toHaveProperty('country');
    expect(sample).toHaveProperty('position');
  });

  it('should search players by query', () => {
    const results = searchPlayers({ query: 'Messi' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name.toLowerCase()).toContain('messi');
  });

  it('should filter players by country', () => {
    const algSquad = getPlayersByCountry('Algeria');
    expect(algSquad.length).toBeGreaterThan(0);
    expect(algSquad.every(p => p.country.toLowerCase() === 'algeria')).toBe(true);
  });

  it('should get player by exact or case-insensitive name', () => {
    const player = getPlayerByName('Melvin MASTIL');
    expect(player).not.toBeNull();
    expect(player.code).toBe('ALG');
  });

  it('should return null for non-existent player name', () => {
    const player = getPlayerByName('Unknown Fake Player 999');
    expect(player).toBeNull();
  });
});
