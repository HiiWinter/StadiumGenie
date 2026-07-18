// src/data/__tests__/translations.test.js
import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../translations';

describe('Translations Data', () => {
  const REQUIRED_LOCALES = ['en', 'es', 'fr', 'pt'];

  it('should contain all required locales', () => {
    REQUIRED_LOCALES.forEach((locale) => {
      expect(TRANSLATIONS).toHaveProperty(locale);
    });
  });

  it('all locales should have the same keys as English', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    REQUIRED_LOCALES.forEach((locale) => {
      enKeys.forEach((key) => {
        expect(TRANSLATIONS[locale]).toHaveProperty(key);
        expect(typeof TRANSLATIONS[locale][key]).toBe('string');
      });
    });
  });

  it('no translation value should be empty', () => {
    REQUIRED_LOCALES.forEach((locale) => {
      Object.entries(TRANSLATIONS[locale]).forEach(([key, value]) => {
        expect(value, `${locale}.${key} is empty`).toBeTruthy();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  it('English locale should have key translations for core UI', () => {
    const coreKeys = ['editions', 'champion', 'totalGoals', 'attendance'];
    coreKeys.forEach((key) => {
      expect(TRANSLATIONS.en).toHaveProperty(key);
    });
  });
});
