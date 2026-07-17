// src/__tests__/efficiency.test.js — Efficiency validation tests
import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'fs';
import { resolve } from 'path';

describe('Efficiency Tests', () => {
  describe('Bundle and Asset Optimization', () => {
    it('source CSS should be under 60KB', () => {
      const stats = statSync(resolve(__dirname, '../index.css'));
      expect(stats.size).toBeLessThan(60 * 1024);
    });

    it('App component should be under 25KB', () => {
      const stats = statSync(resolve(__dirname, '../App.jsx'));
      expect(stats.size).toBeLessThan(25 * 1024);
    });
  });

  describe('Code Splitting Validation', () => {
    it('App.jsx should use React.lazy for code splitting', () => {
      const app = readFileSync(resolve(__dirname, '../App.jsx'), 'utf-8');
      expect(app).toContain('lazy(');
      expect(app).toContain('import(');
    });

    it('App.jsx should have Suspense boundary for lazy components', () => {
      const app = readFileSync(resolve(__dirname, '../App.jsx'), 'utf-8');
      expect(app).toContain('Suspense');
    });
  });

  describe('Performance Patterns', () => {
    it('StadiumTwin should use useRef for animation state', () => {
      const twin = readFileSync(resolve(__dirname, '../components/StadiumTwin.jsx'), 'utf-8');
      expect(twin).toContain('useRef');
      expect(twin).toContain('requestAnimationFrame');
      expect(twin).toContain('cancelAnimationFrame');
    });

    it('StadiumTwin should not pass state directly to animation loop dependencies', () => {
      const twin = readFileSync(resolve(__dirname, '../components/StadiumTwin.jsx'), 'utf-8');
      expect(twin).toContain('renderStateRef');
    });

    it('SpectatorHub should use useMemo for search filtering', () => {
      const hub = readFileSync(resolve(__dirname, '../components/SpectatorHub.jsx'), 'utf-8');
      expect(hub).toContain('useMemo');
    });

    it('SpectatorHub should cap search results to prevent DOM flooding', () => {
      const hub = readFileSync(resolve(__dirname, '../components/SpectatorHub.jsx'), 'utf-8');
      expect(hub).toContain('.slice(0,');
    });

    it('SpectatorHub should use AbortController for network requests', () => {
      const hub = readFileSync(resolve(__dirname, '../components/SpectatorHub.jsx'), 'utf-8');
      expect(hub).toContain('AbortController');
    });

    it('CelebrationOverlay should clean up animation frames on unmount', () => {
      const overlay = readFileSync(resolve(__dirname, '../components/CelebrationOverlay.jsx'), 'utf-8');
      expect(overlay).toContain('cancelAnimationFrame');
    });
  });
});
