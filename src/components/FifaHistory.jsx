// src/components/FifaHistory.jsx - FIFA World Cup History with grouped player roster

import React, { useState, useMemo } from 'react';
import { FIFA_WORLD_CUP_HISTORY } from '../data/world_cup_history';
import { callLiveGemini, simulateGemini } from '../utils/custom_gemini';
import { TRANSLATIONS } from '../data/translations';
import MatchSimulator from './MatchSimulator';
import { PlayerAvatar } from '../utils/playerImageHelper';

/** Group players by team for display. */
function groupPlayersByTeam(players, winner, runnerUp) {
  const groups = {};
  players.forEach(p => {
    const team = p.team || 'Unknown';
    if (!groups[team]) groups[team] = [];
    groups[team].push(p);
  });

  // Sort: winner first, runner-up second, then alphabetical
  const sortOrder = (t) => {
    if (t === winner) return 0;
    if (t === runnerUp) return 1;
    return 2;
  };

  return Object.entries(groups).sort((a, b) => sortOrder(a[0]) - sortOrder(b[0]));
}

export default function FifaHistory({ apiKey, locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const [historySubTab, setHistorySubTab] = useState('history'); // 'history' or 'simulator'

  const [selectedEdition, setSelectedEdition] = useState(
    FIFA_WORLD_CUP_HISTORY[FIFA_WORLD_CUP_HISTORY.length - 1]
  );
  const [geminiAnalysis, setGeminiAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectEdition = (edition) => {
    setSelectedEdition(edition);
    setGeminiAnalysis(null);
  };

  // Filtered timeline
  const filteredEditions = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return FIFA_WORLD_CUP_HISTORY;
    return FIFA_WORLD_CUP_HISTORY.filter(e =>
      e.year.toString().includes(q) ||
      e.winner.toLowerCase().includes(q) ||
      e.host.toLowerCase().includes(q) ||
      e.runnerUp.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Grouped players
  const playerGroups = useMemo(
    () => groupPlayersByTeam(selectedEdition.legendPlayers, selectedEdition.winner, selectedEdition.runnerUp),
    [selectedEdition]
  );

  const handleTriggerAnalysis = async () => {
    setLoadingAnalysis(true);
    setGeminiAnalysis({
      era_tactics_title: "Invoking Gemini 1.5 Pro…",
      tactical_breakdown: "Consulting historical soccer tactics database…",
      historical_significance: "Analyzing tournament legacy…",
      legend_impact_quote: ""
    });

    const promptText =
      `HISTORICAL WORLD CUP CONTEXT:\n` +
      `Year: ${selectedEdition.year}\nHost: ${selectedEdition.host}\n` +
      `Winner: ${selectedEdition.winner}\nRunner Up: ${selectedEdition.runnerUp}\n` +
      `Final Score: ${selectedEdition.finalScore}\n` +
      `Total Goals: ${selectedEdition.totalGoals}\nTeams: ${selectedEdition.teams}\n` +
      `Tactical Era: ${selectedEdition.tacticalEra}\n` +
      `Star Players: ${JSON.stringify(selectedEdition.legendPlayers.map(p => `${p.name} (${p.team})`))}\n\n` +
      `Provide a tactical deep dive matching the SCHEMA requirements.`;

    try {
      const result = apiKey
        ? await callLiveGemini(apiKey, 'fifa_historian', promptText)
        : await simulateGemini('fifa_historian', {
            year: selectedEdition.year,
            winner: selectedEdition.winner,
            host: selectedEdition.host,
          });
      setGeminiAnalysis(result);
    } catch (err) {
      setGeminiAnalysis({
        era_tactics_title: "Analysis Failure",
        tactical_breakdown: `Unable to query Gemini API: ${err.message}`,
        historical_significance: "Fallback to offline database rules.",
        legend_impact_quote: "Error occurred."
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  return (
    <div className="fifa-history-tab-container">
      
      {/* Sub tabs for History vs Simulator */}
      <div className="history-subtabs-row" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button 
          className={`subtab-btn ${historySubTab === 'history' ? 'active' : ''}`}
          onClick={() => setHistorySubTab('history')}
        >
          <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 6 }} />
          {t.editions}
        </button>
        <button 
          className={`subtab-btn ${historySubTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setHistorySubTab('simulator')}
        >
          <i className="fa-solid fa-gamepad" style={{ marginRight: 6 }} />
          {t.matchSimulator}
        </button>
      </div>

      {historySubTab === 'simulator' ? (
        <MatchSimulator locale={locale} />
      ) : (
        <div className="fifa-history-tab">

          {/* Sidebar timeline */}
          <aside className="timeline-sidebar glass-card">
            <div className="card-title">
              <span><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 6 }} /> {t.editions}</span>
            </div>

            <div className="timeline-search-bar" style={{ marginBottom: 12, position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-secondary)', fontSize: 11 }} />
              <input
                type="text"
                placeholder={t.searchEditions}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 32px', borderRadius: 6,
                  border: '1px solid var(--border-input)', background: 'var(--bg-input)',
                  color: 'var(--text-primary)', fontSize: 12, outline: 'none', fontFamily: 'var(--font-sans)',
                }}
              />
            </div>

            <div className="timeline-list">
              {filteredEditions.length > 0 ? (
                filteredEditions.map(edition => (
                  <div
                    key={edition.year}
                    className={`timeline-item ${selectedEdition.year === edition.year ? 'active' : ''}`}
                    onClick={() => handleSelectEdition(edition)}
                  >
                    <div className="timeline-year">{edition.year}</div>
                    <div className="timeline-meta">
                      <span className="winner-label"><i className="fa-solid fa-trophy" style={{ fontSize: 9, marginRight: 3 }} /> {edition.winner}</span>
                      <span className="host-label"><i className="fa-solid fa-location-dot" style={{ fontSize: 9, marginRight: 3 }} /> {edition.host}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  No matches found.
                </div>
              )}
            </div>
          </aside>

          {/* Main content */}
          <section className="edition-details-container">

            {/* Header card */}
            <div className="glass-card details-header-card">
              <div className="details-header-main">
                <div>
                  <h2 className="details-title">{selectedEdition.year} FIFA World Cup</h2>
                  <p className="details-subtitle">
                    <i className="fa-solid fa-location-dot" style={{ color: 'var(--neon-cyan)', marginRight: 6 }} />
                    {t.hostedBy} <strong>{selectedEdition.host}</strong>
                  </p>
                </div>
                <div className="trophy-badge">
                  <i className="fa-solid fa-trophy" style={{ marginRight: 6 }} />
                  {t.champion}: <strong>{selectedEdition.winner}</strong>
                </div>
              </div>

              <div className="edition-quick-stats">
                <div className="quick-stat-box">
                  <span className="quick-stat-val">{selectedEdition.finalScore}</span>
                  <span className="quick-stat-lbl">
                    <i className="fa-solid fa-futbol" style={{ marginRight: 4 }} /> {t.finalScore} {selectedEdition.year === 2026 ? "" : `vs ${selectedEdition.runnerUp}`}
                  </span>
                </div>
                <div className="quick-stat-box">
                  <span className="quick-stat-val">{selectedEdition.totalGoals}</span>
                  <span className="quick-stat-lbl">
                    <i className="fa-solid fa-circle-dot" style={{ marginRight: 4 }} /> {t.totalGoals}
                  </span>
                </div>
                <div className="quick-stat-box">
                  <span className="quick-stat-val">{selectedEdition.teams}</span>
                  <span className="quick-stat-lbl">
                    <i className="fa-solid fa-people-group" style={{ marginRight: 4 }} /> {t.competingTeams}
                  </span>
                </div>
                <div className="quick-stat-box">
                  <span className="quick-stat-val">{selectedEdition.attendance.toLocaleString()}</span>
                  <span className="quick-stat-lbl">
                    <i className="fa-solid fa-ticket" style={{ marginRight: 4 }} /> {t.attendance}
                  </span>
                </div>
              </div>
            </div>

            {/* Tactical Era + Gemini Analysis */}
            <div className="glass-card tactical-era-card">
              <div className="card-title">
                <span><i className="fa-solid fa-chess-board" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> {t.tacticalEra}</span>
              </div>
              <p className="tactical-era-text">{selectedEdition.tacticalEra}</p>

              {selectedEdition.year !== 2026 && (
                <button
                  className="action-btn trigger-analysis-btn"
                  onClick={handleTriggerAnalysis}
                  disabled={loadingAnalysis}
                  style={{ marginTop: 16, width: '100%', justifyContent: 'center', gap: 8 }}
                >
                  <i className="fa-solid fa-brain" />
                  {loadingAnalysis ? 'Consulting Gemini…' : t.askGeminiTactics}
                </button>
              )}

              {geminiAnalysis && (
                <div className="gemini-tactical-block" style={{ marginTop: 16 }}>
                  <div style={{ fontWeight: 700, color: 'var(--neon-cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i className="fa-solid fa-robot" /> {geminiAnalysis.era_tactics_title}
                  </div>
                  <div className="gemini-text-chunk">
                    <strong>Tactical Deep-Dive:</strong> {geminiAnalysis.tactical_breakdown}
                  </div>
                  <div className="gemini-text-chunk" style={{ marginTop: 8 }}>
                    <strong>Legacy & Significance:</strong> {geminiAnalysis.historical_significance}
                  </div>
                  {geminiAnalysis.legend_impact_quote && (
                    <blockquote className="gemini-quote">
                      <i className="fa-solid fa-quote-left" style={{ marginRight: 6, fontSize: 11, verticalAlign: 'top', color: 'rgba(255,153,0,0.5)' }} />
                      {geminiAnalysis.legend_impact_quote}
                    </blockquote>
                  )}
                </div>
              )}
            </div>

            {/* Star Players — grouped by team */}
            <div className="glass-card star-players-card">
              <div className="card-title">
                <span><i className="fa-solid fa-user-ninja" style={{ marginRight: 6, color: 'var(--neon-purple)' }} /> {t.legendPlayers}</span>
                <span className="player-count-badge">{selectedEdition.legendPlayers.length} {t.playersCount}</span>
              </div>

              {playerGroups.map(([teamName, players]) => {
                const isWinner = teamName === selectedEdition.winner;
                const isRunnerUp = teamName === selectedEdition.runnerUp;
                return (
                  <div key={teamName} className="team-group">
                    <div className="team-group-header">
                      <span className={`team-tag ${isWinner ? 'winner' : isRunnerUp ? 'runner-up' : 'other'}`}>
                        {isWinner && <i className="fa-solid fa-trophy" style={{ marginRight: 4 }} />}
                        {isRunnerUp && <i className="fa-solid fa-medal" style={{ marginRight: 4 }} />}
                        {!isWinner && !isRunnerUp && <i className="fa-solid fa-flag" style={{ marginRight: 4 }} />}
                        {teamName}
                        {isWinner && ' — Champions'}
                        {isRunnerUp && ' — Runners-Up'}
                      </span>
                    </div>
                    <div className="star-players-list">
                      {players.map((player, idx) => (
                        <div key={idx} className="player-profile-card">
                          <PlayerAvatar name={player.name} country={player.team} size={48} />
                          <div className="player-info">
                            <div className="player-name">{player.name}</div>
                            <div className="player-stats">
                              <span><i className="fa-solid fa-shirt" style={{ marginRight: 3 }} /> {player.position}</span>
                              <span><i className="fa-solid fa-futbol" style={{ marginRight: 3 }} /> {player.goals} Goals</span>
                              <span><i className="fa-solid fa-stopwatch" style={{ marginRight: 3 }} /> {player.matches} Apps</span>
                            </div>
                            {player.club && (
                              <div style={{ fontSize: 10, color: 'var(--neon-orange)', fontFamily: 'monospace', marginTop: 3 }}>
                                <i className="fa-solid fa-shield-halved" style={{ marginRight: 4 }} /> {player.club} ({player.league})
                              </div>
                            )}
                            <p className="player-details">{player.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
