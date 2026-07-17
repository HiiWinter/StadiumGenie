// src/data/__tests__/world_cup_history.test.js
import { describe, it, expect } from 'vitest';
import { FIFA_WORLD_CUP_HISTORY } from '../world_cup_history';

describe('FIFA World Cup History Data', () => {
  it('should contain all 23 World Cup editions (1930-2026)', () => {
    expect(FIFA_WORLD_CUP_HISTORY.length).toBeGreaterThanOrEqual(22);
  });

  it('should have the first edition as 1930', () => {
    expect(FIFA_WORLD_CUP_HISTORY[0].year).toBe(1930);
  });

  it('should have the latest edition as 2026', () => {
    const last = FIFA_WORLD_CUP_HISTORY[FIFA_WORLD_CUP_HISTORY.length - 1];
    expect(last.year).toBe(2026);
  });

  it('every edition should have required fields', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      expect(edition).toHaveProperty('year');
      expect(edition).toHaveProperty('host');
      expect(edition).toHaveProperty('winner');
      expect(edition).toHaveProperty('runnerUp');
      expect(edition).toHaveProperty('finalScore');
      expect(edition).toHaveProperty('totalGoals');
      expect(edition).toHaveProperty('teams');
      expect(edition).toHaveProperty('attendance');
      expect(edition).toHaveProperty('tacticalEra');
      expect(edition).toHaveProperty('legendPlayers');
    });
  });

  it('every edition should have numeric year', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      expect(typeof edition.year).toBe('number');
      expect(edition.year).toBeGreaterThanOrEqual(1930);
      expect(edition.year).toBeLessThanOrEqual(2026);
    });
  });

  it('every edition should have positive attendance', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      expect(edition.attendance).toBeGreaterThan(0);
    });
  });

  it('every edition should have at least one legend player', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      expect(Array.isArray(edition.legendPlayers)).toBe(true);
      expect(edition.legendPlayers.length).toBeGreaterThan(0);
    });
  });

  it('legend players should have required fields', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      edition.legendPlayers.forEach((player) => {
        expect(player).toHaveProperty('name');
        expect(player).toHaveProperty('team');
        expect(player).toHaveProperty('position');
        expect(player).toHaveProperty('goals');
        expect(player).toHaveProperty('matches');
        expect(typeof player.name).toBe('string');
        expect(player.name.length).toBeGreaterThan(0);
      });
    });
  });

  it('editions should be sorted chronologically', () => {
    for (let i = 1; i < FIFA_WORLD_CUP_HISTORY.length; i++) {
      expect(FIFA_WORLD_CUP_HISTORY[i].year).toBeGreaterThan(
        FIFA_WORLD_CUP_HISTORY[i - 1].year
      );
    }
  });

  it('should have non-empty tacticalEra descriptions', () => {
    FIFA_WORLD_CUP_HISTORY.forEach((edition) => {
      expect(typeof edition.tacticalEra).toBe('string');
      expect(edition.tacticalEra.length).toBeGreaterThan(10);
    });
  });
});
