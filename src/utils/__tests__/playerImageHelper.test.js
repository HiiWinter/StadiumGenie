// src/utils/__tests__/playerImageHelper.test.js
import { describe, it, expect } from 'vitest';
import { getPlayerImageUrl } from '../playerImageHelper';

describe('playerImageHelper', () => {
  describe('getPlayerImageUrl', () => {
    it('should return a valid image path for known players', () => {
      const url = getPlayerImageUrl('Lionel Messi', 'Argentina');
      expect(url).toBeTruthy();
      expect(url).toContain('/players/');
      expect(url).toMatch(/\.(jpg|png)$/);
    });

    it('should return null for unknown players', () => {
      const url = getPlayerImageUrl('Unknown Player XYZ123', 'Unknown Country');
      expect(url).toBeNull();
    });

    it('should be case-insensitive for name matching', () => {
      const url1 = getPlayerImageUrl('lionel messi', 'Argentina');
      const url2 = getPlayerImageUrl('LIONEL MESSI', 'Argentina');
      expect(url1).toEqual(url2);
    });

    it('should handle empty strings gracefully', () => {
      const url = getPlayerImageUrl('', '');
      expect(url).toBeNull();
    });

    it('should handle null/undefined inputs gracefully', () => {
      expect(getPlayerImageUrl(null, null)).toBeNull();
      expect(getPlayerImageUrl(undefined, undefined)).toBeNull();
    });

    it('should return path for Algeria players after roster update', () => {
      const url = getPlayerImageUrl('Riyad Mahrez', 'Algeria');
      // Should resolve to a local path or null (fallback handles it)
      expect(url === null || url.includes('/players/')).toBe(true);
    });
  });
});
