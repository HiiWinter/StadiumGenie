// src/components/MatchSimulator.jsx - 2026 Live World Cup Match Outcome Simulator
import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from '../data/translations';

const TEAMS = [
  { name: "Argentina", rating: 92, stars: ["Messi", "Alvarez", "Enzo"], style: "Jogo Bonito" },
  { name: "France", rating: 91, stars: ["Mbappé", "Griezmann", "Saliba"], style: "Explosive Transitions" },
  { name: "England", rating: 89, stars: ["Kane", "Bellingham", "Saka"], style: "Direct Attacking" },
  { name: "Brazil", rating: 90, stars: ["Vinícius", "Rodrygo", "Neymar"], style: "Samba Fluidity" },
  { name: "Spain", rating: 89, stars: ["Yamal", "Pedri", "Rodri"], style: "Tiki-Taka" },
  { name: "Germany", rating: 88, stars: ["Wirtz", "Musiala", "Rüdiger"], style: "Gegenpressing" },
  { name: "USA", rating: 82, stars: ["Pulisic", "McKennie", "Dest"], style: "High Workrate" },
  { name: "Canada", rating: 80, stars: ["Davies", "David", "Eustaquio"], style: "Vertical Pace" },
  { name: "Mexico", rating: 81, stars: ["Giménez", "Alvarez", "Chavez"], style: "Aggressive Press" }
];

const TACTICAL_STYLES = [
  { id: "tiki_taka", name: "Tiki-Taka (Possession)", possessionBonus: 15, defenseBonus: 5 },
  { id: "gegenpressing", name: "Gegenpressing (Counter-Press)", shotBonus: 4, possessionBonus: -2 },
  { id: "counter_attack", name: "Explosive Counter-Attack", shotBonus: 2, defenseBonus: -2 },
  { id: "park_bus", name: "Park the Bus (Defensive Block)", defenseBonus: 15, shotBonus: -5 }
];

export default function MatchSimulator({ locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  
  const [homeTeam, setHomeTeam] = useState(TEAMS[0]);
  const [awayTeam, setAwayTeam] = useState(TEAMS[1]);
  const [homeTactics, setHomeTactics] = useState(TACTICAL_STYLES[0]);
  const [awayTactics, setAwayTactics] = useState(TACTICAL_STYLES[2]);

  // Simulation states
  const [simulating, setSimulating] = useState(false);
  const [_simFinished, setSimFinished] = useState(false);
  const [matchMinute, setMatchMinute] = useState(0);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  
  // Dynamic stats
  const [stats, setStats] = useState({
    homePossession: 50,
    awayPossession: 50,
    homeShots: 0,
    homeShotsTarget: 0,
    awayShots: 0,
    awayShotsTarget: 0,
    homePasses: 0,
    awayPasses: 0,
    homeFouls: 0,
    awayFouls: 0
  });

  const [eventsList, setEventsList] = useState([]);
  const tickerEndRef = useRef(null);
  const timerRef = useRef(null);

  // Scroll ticker automatically
  useEffect(() => {
    if (tickerEndRef.current) {
      tickerEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [eventsList]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleKickOff = () => {
    setSimulating(true);
    setSimFinished(false);
    setMatchMinute(0);
    setHomeScore(0);
    setAwayScore(0);
    setEventsList([
      { min: 0, text: "The referee blows the whistle. Match kick-off!", type: 'info' }
    ]);
    
    // Initial stats setup
    const baseHomePos = Math.round(50 + (homeTactics.possessionBonus - awayTactics.possessionBonus) + (homeTeam.rating - awayTeam.rating) * 0.5);
    const clampedHomePos = Math.max(30, Math.min(70, baseHomePos));
    setStats({
      homePossession: clampedHomePos,
      awayPossession: 100 - clampedHomePos,
      homeShots: 0,
      homeShotsTarget: 0,
      awayShots: 0,
      awayShotsTarget: 0,
      homePasses: 0,
      awayPasses: 0,
      homeFouls: 0,
      awayFouls: 0
    });

    let currentMinute = 0;
    let hScore = 0;
    let aScore = 0;
    let hShots = 0;
    let hShotsTarget = 0;
    let aShots = 0;
    let aShotsTarget = 0;
    let hFouls = 0;
    let aFouls = 0;

    timerRef.current = setInterval(() => {
      currentMinute += Math.floor(Math.random() * 8) + 2; // Jump minutes
      if (currentMinute >= 90) {
        currentMinute = 90;
        clearInterval(timerRef.current);
        setSimulating(false);
        setSimFinished(true);
      }

      setMatchMinute(currentMinute);

      // Generate random match event
      const rand = Math.random();
      let eventText = "";
      let eventType = "info";

      // 1. Check for shots / goal opportunities
      if (rand < 0.25) {
        // Home team attack
        hShots++;
        const isTarget = Math.random() < (0.35 + (homeTeam.rating - awayTeam.rating) * 0.02);
        if (isTarget) {
          hShotsTarget++;
          // check if goal
          const isGoal = Math.random() < 0.35;
          if (isGoal) {
            hScore++;
            setHomeScore(hScore);
            const star = homeTeam.stars[Math.floor(Math.random() * homeTeam.stars.length)];
            eventText = `GOAL! ${homeTeam.name} scores! ${star} receives the ball in the penalty area and curls it beautifully past the keeper.`;
            eventType = 'goal';
          } else {
            eventText = `Shot on target by ${homeTeam.name}! Saved by the goalkeeper.`;
            eventType = 'shot';
          }
        } else {
          eventText = `Shot by ${homeTeam.name} sails wide of the target.`;
        }
      } else if (rand < 0.50) {
        // Away team attack
        aShots++;
        const isTarget = Math.random() < (0.35 + (awayTeam.rating - homeTeam.rating) * 0.02);
        if (isTarget) {
          aShotsTarget++;
          const isGoal = Math.random() < 0.35;
          if (isGoal) {
            aScore++;
            setAwayScore(aScore);
            const star = awayTeam.stars[Math.floor(Math.random() * awayTeam.stars.length)];
            eventText = `GOAL! ${awayTeam.name} scores! ${star} strikes it cleanly from 20 yards out into the top shelf!`;
            eventType = 'goal';
          } else {
            eventText = `Shot on target by ${awayTeam.name}! Spectacular dive from the keeper to deflect it.`;
            eventType = 'shot';
          }
        } else {
          eventText = `Shot by ${awayTeam.name} misses target, hitting the side netting.`;
        }
      } else if (rand < 0.65) {
        // Tactical / midfield battles
        const starH = homeTeam.stars[Math.floor(Math.random() * homeTeam.stars.length)];
        const starA = awayTeam.stars[Math.floor(Math.random() * awayTeam.stars.length)];
        const midScenarios = [
          `Midfield duel: ${starH} intercepts a pass from ${starA} to launch a transition play.`,
          `${homeTeam.name} dictating pace with a long string of short passes.`,
          `${awayTeam.name} maintains defensive shape, choking off space in the center.`,
          `Sensational piece of skill by ${starA} to bypass the defender.`
        ];
        eventText = midScenarios[Math.floor(Math.random() * midScenarios.length)];
      } else if (rand < 0.80) {
        // Fouls / Cards
        const isHomeFoul = Math.random() > 0.5;
        if (isHomeFoul) {
          hFouls++;
          const hasCard = Math.random() < 0.25;
          eventText = `Foul committed by ${homeTeam.name}.` + (hasCard ? " Yellow card shown by the referee!" : "");
          eventType = hasCard ? 'card' : 'info';
        } else {
          aFouls++;
          const hasCard = Math.random() < 0.25;
          eventText = `Foul committed by ${awayTeam.name}.` + (hasCard ? " Yellow card shown by the referee!" : "");
          eventType = hasCard ? 'card' : 'info';
        }
      } else {
        // Substitutions or corner kick events
        eventText = Math.random() > 0.5
          ? `Corner kick awarded to ${homeTeam.name}. Driven into the box, but cleared by defense.`
          : `Substitution made. Managers adapting team shapes.`;
      }

      // Add half time event
      if (currentMinute >= 45 && currentMinute < 50 && !eventsList.some(e => e.text.includes("Half-time"))) {
        setEventsList(prev => [
          ...prev,
          { min: 45, text: "Half-time whistle. Players head to the tunnels. Score: " + hScore + "-" + aScore, type: 'info' }
        ]);
      }

      setEventsList(prev => [
        ...prev,
        { min: currentMinute, text: eventText, type: eventType }
      ]);

      // Update Stats dynamically
      setStats(prev => ({
        ...prev,
        homeShots: hShots,
        homeShotsTarget: hShotsTarget,
        awayShots: aShots,
        awayShotsTarget: aShotsTarget,
        homeFouls: hFouls,
        awayFouls: aFouls,
        homePasses: Math.round(currentMinute * 4.8 * (prev.homePossession / 50)),
        awayPasses: Math.round(currentMinute * 4.8 * (prev.awayPossession / 50))
      }));

      // Finish match
      if (currentMinute === 90) {
        setEventsList(prev => [
          ...prev,
          { min: 90, text: `Full-time whistle! Final score: ${homeTeam.name} ${hScore} - ${aScore} ${awayTeam.name}.`, type: 'final' }
        ]);
      }
    }, 450); // fast simulation cycles
  };

  return (
    <div className="match-simulator-container">
      
      {/* Title Header */}
      <div className="glass-card match-sim-header" style={{ marginBottom: 20 }}>
        <div className="card-title">
          <span><i className="fa-solid fa-gamepad" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> {t.matchSimulator}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          Select World Cup teams, configure their playing styles, and run real-time tactical simulations to project matchday flow.
        </p>
      </div>

      <div className="match-sim-split">
        
        {/* Left Side: Parameters Config */}
        <div className="glass-card config-panel" style={{ flex: '0 0 300px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            
            {/* Home Team select */}
            <div className="team-config-box">
              <h4 style={{ color: 'var(--neon-cyan)', marginBottom: 8, fontSize: 12 }}>{t.homeTeam}</h4>
              <select
                value={homeTeam.name}
                onChange={(e) => setHomeTeam(TEAMS.find(t => t.name === e.target.value))}
                disabled={simulating}
                className="styled-dropdown"
              >
                {TEAMS.map(team => (
                  <option key={team.name} value={team.name}>{team.name} (Rtg: {team.rating})</option>
                ))}
              </select>
              
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t.selectTactics}</label>
                <select
                  value={homeTactics.id}
                  onChange={(e) => setHomeTactics(TACTICAL_STYLES.find(ts => ts.id === e.target.value))}
                  disabled={simulating}
                  className="styled-dropdown mini"
                >
                  {TACTICAL_STYLES.map(ts => (
                    <option key={ts.id} value={ts.id}>{ts.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              <i className="fa-solid fa-arrows-left-right" /> VS
            </div>

            {/* Away Team select */}
            <div className="team-config-box">
              <h4 style={{ color: 'var(--neon-purple)', marginBottom: 8, fontSize: 12 }}>{t.awayTeam}</h4>
              <select
                value={awayTeam.name}
                onChange={(e) => setAwayTeam(TEAMS.find(t => t.name === e.target.value))}
                disabled={simulating}
                className="styled-dropdown"
              >
                {TEAMS.filter(t => t.name !== homeTeam.name).map(team => (
                  <option key={team.name} value={team.name}>{team.name} (Rtg: {team.rating})</option>
                ))}
              </select>
              
              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{t.selectTactics}</label>
                <select
                  value={awayTactics.id}
                  onChange={(e) => setAwayTactics(TACTICAL_STYLES.find(ts => ts.id === e.target.value))}
                  disabled={simulating}
                  className="styled-dropdown mini"
                >
                  {TACTICAL_STYLES.map(ts => (
                    <option key={ts.id} value={ts.id}>{ts.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="action-btn sim-trigger-btn"
              onClick={handleKickOff}
              disabled={simulating}
              style={{ justifyContent: 'center', marginTop: 10 }}
            >
              <i className="fa-solid fa-play" style={{ marginRight: 6 }} />
              {simulating ? t.simulating : t.kickOff}
            </button>

          </div>
        </div>

        {/* Right Side: Scoreboard & Live Console Ticker */}
        <div className="glass-card console-simulation-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Main Scoreboard Display */}
          <div className="sim-scoreboard">
            <div className="team-display home">
              <span className="team-name">{homeTeam.name}</span>
              <span className="team-badge-desc">{homeTactics.name.split(' (')[0]}</span>
            </div>
            
            <div className="scores-wrap">
              <span className="live-time-minutes">{matchMinute}'</span>
              <div className="scores-nums">
                <span className="score-num">{homeScore}</span>
                <span className="score-divider">:</span>
                <span className="score-num">{awayScore}</span>
              </div>
            </div>

            <div className="team-display away">
              <span className="team-name">{awayTeam.name}</span>
              <span className="team-badge-desc">{awayTactics.name.split(' (')[0]}</span>
            </div>
          </div>

          {/* Stats Bar Layout */}
          <div className="sim-live-stats">
            <div className="stat-bar-group">
              <div className="stat-label-row">
                <span>{stats.homePossession}%</span>
                <span style={{ textTransform: 'uppercase', fontSize: 10 }}>{t.possession}</span>
                <span>{stats.awayPossession}%</span>
              </div>
              <div className="bar-visual-track">
                <div className="bar-fill home" style={{ width: `${stats.homePossession}%` }} />
                <div className="bar-fill away" style={{ width: `${stats.awayPossession}%` }} />
              </div>
            </div>

            <div className="stat-bar-grid">
              <div className="mini-stat-col">
                <span className="stat-num">{stats.homeShots} ({stats.homeShotsTarget})</span>
                <span className="stat-lbl">{t.shotsOnTarget}</span>
                <span className="stat-num">{stats.awayShots} ({stats.awayShotsTarget})</span>
              </div>
              <div className="mini-stat-col">
                <span className="stat-num">{stats.homePasses}</span>
                <span className="stat-lbl">{t.passesCompleted}</span>
                <span className="stat-num">{stats.awayPasses}</span>
              </div>
            </div>
          </div>

          {/* Live Ticker Feed */}
          <div className="sim-events-ticker-box">
            <div className="ticker-title"><i className="fa-solid fa-rectangle-list" /> {t.liveTicker}</div>
            <div className="ticker-content-feed">
              {eventsList.map((evt, idx) => (
                <div key={idx} className={`ticker-line-event ${evt.type}`}>
                  <span className="time">{evt.min}'</span>
                  <span className="icon">
                    {evt.type === 'goal' && <i className="fa-solid fa-futbol" style={{ color: 'var(--neon-green)' }} />}
                    {evt.type === 'shot' && <i className="fa-solid fa-crosshairs" style={{ color: 'var(--neon-cyan)' }} />}
                    {evt.type === 'card' && <i className="fa-solid fa-square-envelope" style={{ color: 'var(--neon-orange)' }} />}
                    {evt.type === 'final' && <i className="fa-solid fa-circle-check" style={{ color: 'var(--neon-cyan)' }} />}
                    {evt.type === 'info' && <i className="fa-solid fa-info-circle" />}
                  </span>
                  <span className="text">{evt.text}</span>
                </div>
              ))}
              <div ref={tickerEndRef} />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
