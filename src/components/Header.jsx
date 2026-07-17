import React from 'react';

export default function Header({ activeTab, setActiveTab, apiKey, setApiKey }) {
  const handleKeyChange = (e) => {
    const key = e.target.value.trim();
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
        <div className="logo-text">
          <h1>StadiumGenie</h1>
          <span>Multimodal Operational Twin & FIFA Analytics Dashboard</span>
        </div>
      </div>

      <nav className="header-nav">
        <button 
          className={`nav-tab-btn ${activeTab === 'twin' ? 'active' : ''}`}
          onClick={() => setActiveTab('twin')}
        >
          <i className="fa-solid fa-network-wired" style={{ marginRight: '6px' }}></i> Stadium Twin
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fa-solid fa-trophy" style={{ marginRight: '6px' }}></i> FIFA History
        </button>
        <button 
          className={`nav-tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          <i className="fa-solid fa-chart-line" style={{ marginRight: '6px' }}></i> Stats & Trends
        </button>
      </nav>
      
      <div className={`api-settings ${apiKey ? 'active' : ''}`}>
        <i className="fa-solid fa-key status-icon-key" style={{ marginRight: '6px', color: apiKey ? 'var(--neon-green)' : 'var(--text-muted)' }}></i>
        <input 
          type="password" 
          value={apiKey} 
          onChange={handleKeyChange}
          placeholder="Enter Gemini API Key..." 
        />
        <span className="mode-badge">{apiKey ? 'Live API' : 'Simulated'}</span>
      </div>
    </header>
  );
}
