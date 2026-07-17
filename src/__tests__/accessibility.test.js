// src/__tests__/accessibility.test.js — Accessibility validation tests
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Accessibility Tests', () => {
  describe('index.html accessibility', () => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');

    it('should have a lang attribute on html element', () => {
      expect(html).toMatch(/<html[^>]+lang="/);
    });

    it('should have a charset meta tag', () => {
      expect(html).toMatch(/<meta\s+charset="UTF-8"/i);
    });

    it('should have a viewport meta tag', () => {
      expect(html).toMatch(/name="viewport"/);
    });

    it('should have a descriptive title tag', () => {
      expect(html).toMatch(/<title>[^<]+<\/title>/);
      expect(html).not.toMatch(/<title>\s*<\/title>/);
    });

    it('should have a root element for React mounting', () => {
      expect(html).toContain('id="root"');
    });

    it('should contain skip-to-content link', () => {
      expect(html).toContain('skip-to-content');
    });

    it('should have meta description for SEO', () => {
      expect(html).toMatch(/name="description"/);
    });
  });

  describe('CSS accessibility features', () => {
    const css = readFileSync(resolve(__dirname, '../index.css'), 'utf-8');

    it('should include focus-visible styles', () => {
      expect(css).toContain('focus-visible');
    });

    it('should include prefers-reduced-motion support', () => {
      expect(css).toContain('prefers-reduced-motion');
    });

    it('should include screen-reader-only utility class', () => {
      expect(css).toContain('sr-only');
    });

    it('should include skip-to-content styles', () => {
      expect(css).toContain('skip-to-content');
    });
  });
});
