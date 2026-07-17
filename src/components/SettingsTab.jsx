// src/components/SettingsTab.jsx - User Preferences, Settings & Account Management
import React, { useState } from 'react';

export default function SettingsTab({ locale = 'en', setLocale, theme = 'dark', setTheme }) {
  // Profile settings state
  const [userName, setUserName] = useState("StadiumGenie Fan");
  const [userEmail, setUserEmail] = useState("fan@fifaworldcup2026.com");
  const [favoriteTeam, setFavoriteTeam] = useState("Argentina");
  const [timezone, setTimezone] = useState("EST");

  // Notification toggles
  const [notifyGoals, setNotifyGoals] = useState(true);
  const [notifyKickoffs, setNotifyKickoffs] = useState(true);
  const [notifyEmergency] = useState(true);

  // Success alert
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-tab-container" style={{ padding: 16, height: '100%', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      
      {/* Profile & Account Card */}
      <div className="glass-card my-profile-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="card-title">
          <span><i className="fa-solid fa-user" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> MY FAN PROFILE & FAVORITES</span>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>FAN ACCOUNT USERNAME</label>
            <input 
              type="text" 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
              style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={userEmail} 
              onChange={(e) => setUserEmail(e.target.value)}
              style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>FAVORITE NATION</label>
              <select 
                value={favoriteTeam} 
                onChange={(e) => setFavoriteTeam(e.target.value)}
                style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
              >
                <option value="Argentina">Argentina</option>
                <option value="France">France</option>
                <option value="USA">USA</option>
                <option value="England">England</option>
                <option value="Brazil">Brazil</option>
                <option value="Spain">Spain</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Mexico">Mexico</option>
                <option value="Iran">Iran</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>PREFERRED TIMEZONE</label>
              <select 
                value={timezone} 
                onChange={(e) => setTimezone(e.target.value)}
                style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
              >
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="action-btn"
            style={{ width: '100%', justifyContent: 'center', gap: 6, background: 'rgba(2, 132, 199, 0.08)', borderColor: 'var(--neon-cyan)', color: 'var(--text-primary)', marginTop: 8 }}
          >
            <i className="fa-solid fa-floppy-disk" /> SAVE PROFILE PREFERENCES
          </button>
        </form>

        {saveSuccess && (
          <div style={{ padding: 8, background: 'rgba(0, 255, 102, 0.08)', border: '1px solid var(--neon-green)', borderRadius: 6, fontSize: 11, color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-circle-check" /> User settings and profile updated successfully!
          </div>
        )}

        {/* Fan Rewards Point Box */}
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(234, 88, 12, 0.05)', border: '1px solid rgba(234, 88, 12, 0.15)', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 9, color: 'var(--neon-orange)', fontWeight: 'bold' }}>FIFA FAN REWARDS PROGRAM</span>
              <strong style={{ display: 'block', fontSize: 18, color: 'var(--text-primary)' }}>2,450 POINTS</strong>
            </div>
            <i className="fa-solid fa-gift" style={{ fontSize: 24, color: 'var(--neon-orange)' }} />
          </div>
          <span style={{ display: 'block', fontSize: 9, color: 'var(--text-secondary)', marginTop: 6 }}>
            Redeem rewards for official FIFA jerseys, souvenirs, and beverage vouchers at concessions.
          </span>
        </div>
      </div>

      {/* Notifications & Language Tab */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Theme & Language settings card */}
        <div className="glass-card language-settings-card">
          <div className="card-title">
            <span><i className="fa-solid fa-desktop" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> THEME & LANGUAGE SETTINGS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>INTERFACE COLOR THEME</label>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
              >
                <option value="light">Light Mode ☀️ (Default)</option>
                <option value="dark">Dark Mode 🌙</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 10, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>SYSTEM DISPLAY LANGUAGE</label>
              <select 
                value={locale} 
                onChange={(e) => setLocale(e.target.value)}
                style={{ width: '100%', padding: 8, background: 'var(--bg-input)', border: '1px solid var(--border-input)', borderRadius: 6, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
              >
                <option value="en">English 🇬🇧</option>
                <option value="es">Español 🇪🇸</option>
                <option value="fr">Français 🇫🇷</option>
                <option value="pt">Português 🇵🇹</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications card */}
        <div className="glass-card notifications-settings-card">
          <div className="card-title">
            <span><i className="fa-solid fa-bell" style={{ marginRight: 6, color: 'var(--neon-red)' }} /> NOTIFICATION TOGGLES</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Live Goal Alerts</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Get instant reports when a goal is scored.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyGoals} 
                onChange={(e) => setNotifyGoals(e.target.checked)} 
                style={{ width: 18, height: 18, accentColor: 'var(--neon-red)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Match Kick-offs</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Alert me 15 minutes prior to match kickoff.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyKickoffs} 
                onChange={(e) => setNotifyKickoffs(e.target.checked)} 
                style={{ width: 18, height: 18, accentColor: 'var(--neon-red)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>Emergency & Evacuation</strong>
                <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Broadcast critical safety announcements.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyEmergency} 
                disabled 
                style={{ width: 18, height: 18, accentColor: 'var(--neon-red)' }}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
