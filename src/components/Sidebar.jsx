// src/components/Sidebar.jsx - Collapsible sidebar navigation with localized tabs and language selector
import React, { useState } from 'react';
import { TRANSLATIONS } from '../data/translations';

const NAV_ITEMS = [
  { id: 'twin',        icon: 'fa-solid fa-satellite-dish',      labelKey: 'stadiumTwin' },
  { id: 'viewer',      icon: 'fa-solid fa-flag',                labelKey: 'spectatorHub' },
  { id: 'tournament',  icon: 'fa-solid fa-circle-dot',          labelKey: 'tournamentCentre' },
  { id: 'history',     icon: 'fa-solid fa-trophy',              labelKey: 'fifaHistory' },
  { id: 'charts',      icon: 'fa-solid fa-chart-line',          labelKey: 'statsTrends' },
  { id: 'settings',    icon: 'fa-solid fa-sliders',             labelKey: 'settings' },
  { id: 'about',       icon: 'fa-solid fa-circle-info',         labelKey: 'about' }
];

export default function Sidebar({ activeTab, setActiveTab, locale = 'en', setLocale, apiKey, setApiKey }) {
  const [collapsed, setCollapsed] = useState(false);
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  const handleKeyChange = (e) => {
    const key = e.target.value.trim();
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

      {/* Logo + collapse toggle */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon"><i className="fa-solid fa-wand-magic-sparkles" /></div>
          {!collapsed && (
            <div className="logo-text">
              <h1>StadiumGenie</h1>
              <span>2026 Live Ops</span>
            </div>
          )}
        </div>
        <button className="collapse-btn" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
          <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`} />
        </button>
      </div>

      {/* Language Selector Dropdown */}
      {!collapsed && (
        <div className="sidebar-language-wrapper">
          <i className="fa-solid fa-earth-americas lang-globe-icon" />
          <select 
            value={locale} 
            onChange={(e) => setLocale(e.target.value)}
            className="sidebar-locale-dropdown"
          >
            <option value="en">English 🇬🇧</option>
            <option value="es">Español 🇪🇸</option>
            <option value="fr">Français 🇫🇷</option>
            <option value="pt">Português 🇵🇹</option>
          </select>
        </div>
      )}

      {/* Navigation items */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const label = t[item.labelKey] || item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? label : undefined}
            >
              <i className={item.icon} />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="sidebar-spacer" />

      {/* API key section at bottom */}
      <div className="sidebar-footer">
        <div className={`sidebar-api-status ${apiKey ? 'live' : ''}`}>
          <i className="fa-solid fa-key" />
          {!collapsed && <span>{apiKey ? t.liveApi : t.simulated}</span>}
        </div>
        {!collapsed && (
          <input
            type="password"
            className="sidebar-api-input"
            value={apiKey}
            onChange={handleKeyChange}
            placeholder={t.geminiKey}
          />
        )}
      </div>
    </aside>
  );
}
