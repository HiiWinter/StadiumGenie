// src/__tests__/components.test.jsx
// Component rendering tests — validates that core UI components mount without crashing
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Lazy-loaded components we test directly
import AboutTab from '../components/AboutTab';
import SettingsTab from '../components/SettingsTab';

describe('Component Rendering Tests', () => {

  describe('AboutTab', () => {
    it('should render without crashing', () => {
      const { container } = render(<AboutTab />);
      expect(container).toBeTruthy();
    });

    it('should display the About heading', () => {
      render(<AboutTab />);
      expect(screen.getByText(/About StadiumGenie/i)).toBeTruthy();
    });

    it('should contain core tech stack section', () => {
      render(<AboutTab />);
      expect(screen.getByText(/CORE TECH STACK/i)).toBeTruthy();
    });
  });

  describe('SettingsTab', () => {
    it('should render without crashing', () => {
      const mockSetLocale = vi.fn();
      const mockSetTheme = vi.fn();
      const { container } = render(
        <SettingsTab locale="en" setLocale={mockSetLocale} theme="dark" setTheme={mockSetTheme} />
      );
      expect(container).toBeTruthy();
    });

    it('should display profile settings', () => {
      const mockSetLocale = vi.fn();
      const mockSetTheme = vi.fn();
      render(
        <SettingsTab locale="en" setLocale={mockSetLocale} theme="dark" setTheme={mockSetTheme} />
      );
      // SettingsTab should contain user profile area
      expect(screen.getByDisplayValue('StadiumGenie Fan')).toBeTruthy();
    });

    it('should display language options', () => {
      const mockSetLocale = vi.fn();
      const mockSetTheme = vi.fn();
      render(
        <SettingsTab locale="en" setLocale={mockSetLocale} theme="dark" setTheme={mockSetTheme} />
      );
      // Language selector should be present
      expect(screen.getByDisplayValue('Argentina')).toBeTruthy();
    });
  });

});
