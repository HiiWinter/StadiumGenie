// src/components/RootConnectionChart.jsx - SVG-based Player Relationship Network Graph & Legends Tree of Fame
import React, { useState, useMemo, useEffect } from 'react';
import { FIFA_WORLD_CUP_HISTORY } from '../data/world_cup_history';
import { TRANSLATIONS } from '../data/translations';
import { PlayerAvatar } from '../utils/playerImageHelper';

const TEAMS_LIST = ["Argentina", "France", "USA", "England", "Brazil", "Spain", "Germany", "Canada", "Mexico", "Iran", "Japan", "Morocco", "Italy", "Uruguay", "Belgium", "Croatia", "Netherlands", "Portugal", "Saudi Arabia"];

const LEGEND_PLAYERS_DATA = {
  "Pelé": {
    name: "Pelé",
    team: "Brazil",
    position: "Forward",
    goals: 12,
    matches: 14,
    details: "The King of Football. The only player to win three FIFA World Cups (1958, 1962, 1970). Scored over 1,200 career goals.",
    club: "Santos",
    league: "Campeonato Paulista",
    marketValue: "Priceless"
  },
  "Diego Maradona": {
    name: "Diego Maradona",
    team: "Argentina",
    position: "Midfielder",
    goals: 8,
    matches: 21,
    details: "Renowned for his sublime dribbling, vision, and the legendary 1986 World Cup triumph where he scored the 'Goal of the Century'.",
    club: "Napoli",
    league: "Serie A",
    marketValue: "Priceless"
  },
  "Lionel Messi": {
    name: "Lionel Messi",
    team: "Argentina",
    position: "Forward",
    goals: 13,
    matches: 26,
    details: "The Maestro who completed football by hoisting the 2022 FIFA World Cup in Qatar. Winner of 8 Ballon d'Or awards.",
    club: "Inter Miami",
    league: "MLS",
    marketValue: "Priceless"
  },
  "Johan Cruyff": {
    name: "Johan Cruyff",
    team: "Netherlands",
    position: "Forward",
    goals: 3,
    matches: 7,
    details: "The architect of Total Football. Led the Netherlands to the 1974 World Cup final. Dutch legend and 3x Ballon d'Or winner.",
    club: "Ajax",
    league: "Eredivisie",
    marketValue: "Priceless"
  },
  "Zinedine Zidane": {
    name: "Zinedine Zidane",
    team: "France",
    position: "Midfielder",
    goals: 5,
    matches: 12,
    details: "Elegant playmaker who scored two headers in the 1998 World Cup Final to win the title for France. Recipient of 1998 Ballon d'Or.",
    club: "Real Madrid",
    league: "La Liga",
    marketValue: "Priceless"
  },
  "Cristiano Ronaldo": {
    name: "Cristiano Ronaldo",
    team: "Portugal",
    position: "Forward",
    goals: 8,
    matches: 22,
    details: "One of the most prolific goalscorers in football history. Five-time Ballon d'Or winner and Portugal's all-time top scorer.",
    club: "Al Nassr",
    league: "Saudi Pro League",
    marketValue: "Priceless"
  },
  "Didier Drogba": {
    name: "Didier Drogba",
    team: "Ivory Coast",
    position: "Forward",
    goals: 2,
    matches: 8,
    details: "Legendary Chelsea striker who led Ivory Coast to their first-ever World Cup appearance in 2006. Renowned for his power and leadership.",
    club: "Chelsea",
    league: "Premier League",
    marketValue: "Priceless"
  },
  "Samuel Eto'o": {
    name: "Samuel Eto'o",
    team: "Cameroon",
    position: "Forward",
    goals: 3,
    matches: 8,
    details: "Four-time African Player of the Year. Participated in four World Cups (1998, 2002, 2010, 2014) representing Cameroon.",
    club: "Barcelona",
    league: "La Liga",
    marketValue: "Priceless"
  },
  "Christian Pulisic": {
    name: "Christian Pulisic",
    team: "USA",
    position: "Forward",
    goals: 1,
    matches: 4,
    details: "Captain America. Scored the crucial winning goal in the 2022 World Cup group stage. The leading superstar of US soccer.",
    club: "AC Milan",
    league: "Serie A",
    marketValue: "$40M"
  },
  "Landon Donovan": {
    name: "Landon Donovan",
    team: "USA",
    position: "Midfielder",
    goals: 5,
    matches: 12,
    details: "Joint all-time top scorer for the United States. Scored the famous late winning goal against Algeria in the 2010 World Cup.",
    club: "LA Galaxy",
    league: "MLS",
    marketValue: "Retired"
  }
};

export default function RootConnectionChart({ locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const [selectedTeam, setSelectedTeam] = useState("Argentina");
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [chartType, setChartType] = useState('association'); // 'association' or 'legends-tree'

  // Extract 2026 players for the selected team
  const squad = useMemo(() => {
    const wc2026 = FIFA_WORLD_CUP_HISTORY.find(ed => ed.year === 2026);
    if (!wc2026) return [];
    return wc2026.legendPlayers.filter(p => p.team === selectedTeam);
  }, [selectedTeam]);

  // If no players in database for this team, fall back to mock stars
  const players = useMemo(() => {
    if (squad.length > 0) return squad;
    
    const mockDb = {
      Spain: [
        { name: "Lamine Yamal", team: "Spain", position: "Forward", goals: 2, matches: 5, details: "The teenage sensation of La Roja, cutting inside from the wing.", club: "Barcelona", league: "La Liga", marketValue: "$120M" },
        { name: "Pedri", team: "Spain", position: "Midfielder", goals: 1, matches: 5, details: "Midfield magician controlling tempo and distribution.", club: "Barcelona", league: "La Liga", marketValue: "$80M" },
        { name: "Rodri", team: "Spain", position: "Midfielder", goals: 0, matches: 5, details: "The defensive anchor, orchestrating play from deep.", club: "Manchester City", league: "Premier League", marketValue: "$110M" }
      ],
      Germany: [
        { name: "Florian Wirtz", team: "Germany", position: "Midfielder", goals: 3, matches: 5, details: "Playmaker excelling in tight half-spaces and key assists.", club: "Bayer Leverkusen", league: "Bundesliga", marketValue: "$110M" },
        { name: "Jamal Musiala", team: "Germany", position: "Midfielder", goals: 2, matches: 5, details: "Silky dribbler twisting and turning in tight areas.", club: "Bayern Munich", league: "Bundesliga", marketValue: "$110M" },
        { name: "Antonio Rüdiger", team: "Germany", position: "Defender", goals: 0, matches: 5, details: "Aggressive defensive wall leading the German backline.", club: "Real Madrid", league: "La Liga", marketValue: "$55M" }
      ],
      Canada: [
        { name: "Alphonso Davies", team: "Canada", position: "Defender", goals: 1, matches: 4, details: "Lightning-fast wing-back leading Canada's transition.", club: "Bayern Munich", league: "Bundesliga", marketValue: "$70M" },
        { name: "Jonathan David", team: "Canada", position: "Forward", goals: 2, matches: 4, details: "Clinical central striker with intelligent runs in behind.", club: "Lille", league: "Ligue 1", marketValue: "$50M" }
      ],
      Mexico: [
        { name: "Santiago Giménez", team: "Mexico", position: "Forward", goals: 2, matches: 4, details: "Lethal finisher inside the box, holding up play.", club: "Feyenoord", league: "Eredivisie", marketValue: "$40M" },
        { name: "Edson Álvarez", team: "Mexico", position: "Midfielder", goals: 0, matches: 4, details: "Combative defensive midfielder protecting the defense.", club: "West Ham United", league: "Premier League", marketValue: "$35M" }
      ]
    };
    return mockDb[selectedTeam] || [
      { name: "Star Player A", team: selectedTeam, position: "Forward", goals: 2, matches: 4, details: "Creative attacking leader.", club: "European Club", league: "Elite League", marketValue: "$50M" },
      { name: "Star Player B", team: selectedTeam, position: "Midfielder", goals: 1, matches: 4, details: "Hardworking central engine.", club: "Elite Club", league: "Elite League", marketValue: "$40M" }
    ];
  }, [selectedTeam, squad]);

  // Set default selected player on state changes
  useEffect(() => {
    if (chartType === 'association') {
      if (players.length > 0) {
        setSelectedPlayer(players[0]);
      }
    } else {
      setSelectedPlayer(LEGEND_PLAYERS_DATA["Lionel Messi"]);
    }
  }, [chartType, players]);

  // Graph Size: 600 x 460
  const width = 600;
  const height = 460;
  const center = { x: width / 2, y: height / 2 };

  // Generate association graph dataset
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];

    const rootId = `root-${selectedTeam}`;
    nodes.push({
      id: rootId,
      label: selectedTeam,
      type: 'root',
      x: center.x,
      y: center.y,
      r: 30,
      color: 'var(--neon-cyan)',
      glowColor: 'rgba(0, 240, 255, 0.4)'
    });

    const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
    const r1 = 90;
    const posAngles = {
      "Goalkeeper": -Math.PI / 2,
      "Defender": Math.PI,
      "Midfielder": 0,
      "Forward": Math.PI / 2
    };

    positions.forEach((pos) => {
      const angle = posAngles[pos];
      const px = center.x + r1 * Math.cos(angle);
      const py = center.y + r1 * Math.sin(angle);
      const posId = `pos-${pos}`;

      nodes.push({
        id: posId,
        label: pos.substring(0, 3).toUpperCase(),
        fullName: pos,
        type: 'position',
        x: px,
        y: py,
        r: 18,
        color: 'var(--neon-green)',
        glowColor: 'rgba(0, 255, 102, 0.3)'
      });

      links.push({
        source: rootId,
        target: posId,
        type: 'root-pos'
      });
    });

    const playersByPos = {};
    players.forEach(p => {
      const pos = p.position.includes("Goalkeeper") ? "Goalkeeper" :
                  p.position.includes("Defender") ? "Defender" :
                  p.position.includes("Midfielder") ? "Midfielder" : "Forward";
      if (!playersByPos[pos]) playersByPos[pos] = [];
      playersByPos[pos].push(p);
    });

    positions.forEach((pos) => {
      const posId = `pos-${pos}`;
      const posPlayers = playersByPos[pos] || [];
      const baseAngle = posAngles[pos];
      
      posPlayers.forEach((player, idx) => {
        const count = posPlayers.length;
        let spread = 0.5;
        let angleOffset = 0;
        if (count > 1) {
          angleOffset = ((idx / (count - 1)) - 0.5) * spread;
        }
        const angle = baseAngle + angleOffset;
        
        const r2 = 175;
        const plx = center.x + r2 * Math.cos(angle);
        const ply = center.y + r2 * Math.sin(angle);
        const playerId = `player-${player.name}`;

        nodes.push({
          id: playerId,
          label: player.name.split(' ').pop(),
          fullName: player.name,
          playerData: player,
          type: 'player',
          x: plx,
          y: ply,
          r: 12,
          color: 'var(--neon-purple)',
          glowColor: 'rgba(171, 71, 188, 0.3)'
        });

        links.push({
          source: posId,
          target: playerId,
          type: 'pos-player'
        });

        if (player.club) {
          const r3 = 230;
          const clx = center.x + r3 * Math.cos(angle);
          const cly = center.y + r3 * Math.sin(angle);
          const clubId = `club-${player.club}`;

          let clubNode = nodes.find(n => n.id === clubId);
          if (!clubNode) {
            clubNode = {
              id: clubId,
              label: player.club,
              type: 'club',
              x: clx,
              y: cly,
              r: 8,
              color: 'var(--neon-orange)',
              glowColor: 'rgba(255, 153, 0, 0.3)'
            };
            nodes.push(clubNode);
          }

          links.push({
            source: playerId,
            target: clubId,
            type: 'player-club'
          });
        }
      });
    });

    return { nodes, links };
  }, [selectedTeam, players, center.x, center.y]);

  // Generate Legends Tree of Fame dataset
  const treeData = useMemo(() => {
    const nodes = [
      { id: "tree-root", label: "Legends Hall", type: "root", x: 300, y: 55, r: 24, color: "var(--neon-cyan)" },
      
      // Continents
      { id: "tree-sa", label: "S. America", type: "continent", x: 105, y: 155, r: 17, color: "var(--neon-green)" },
      { id: "tree-eu", label: "Europe", type: "continent", x: 235, y: 155, r: 17, color: "var(--neon-purple)" },
      { id: "tree-af", label: "Africa", type: "continent", x: 365, y: 155, r: 17, color: "var(--neon-orange)" },
      { id: "tree-na", label: "N. America", type: "continent", x: 495, y: 155, r: 17, color: "var(--neon-cyan)" },
      
      // S. America Legends
      { id: "tree-pele", label: "Pelé", fullName: "Pelé", type: "player", x: 60, y: 270, r: 12, color: "var(--neon-green)", playerData: LEGEND_PLAYERS_DATA["Pelé"] },
      { id: "tree-maradona", label: "Maradona", fullName: "Diego Maradona", type: "player", x: 105, y: 340, r: 12, color: "var(--neon-green)", playerData: LEGEND_PLAYERS_DATA["Diego Maradona"] },
      { id: "tree-messi", label: "Messi", fullName: "Lionel Messi", type: "player", x: 150, y: 410, r: 12, color: "var(--neon-green)", playerData: LEGEND_PLAYERS_DATA["Lionel Messi"] },
      
      // Europe Legends
      { id: "tree-cruyff", label: "Cruyff", fullName: "Johan Cruyff", type: "player", x: 200, y: 270, r: 12, color: "var(--neon-purple)", playerData: LEGEND_PLAYERS_DATA["Johan Cruyff"] },
      { id: "tree-zidane", label: "Zidane", fullName: "Zinedine Zidane", type: "player", x: 235, y: 340, r: 12, color: "var(--neon-purple)", playerData: LEGEND_PLAYERS_DATA["Zinedine Zidane"] },
      { id: "tree-ronaldo", label: "C. Ronaldo", fullName: "Cristiano Ronaldo", type: "player", x: 270, y: 410, r: 12, color: "var(--neon-purple)", playerData: LEGEND_PLAYERS_DATA["Cristiano Ronaldo"] },
      
      // Africa Legends
      { id: "tree-drogba", label: "Drogba", fullName: "Didier Drogba", type: "player", x: 345, y: 270, r: 12, color: "var(--neon-orange)", playerData: LEGEND_PLAYERS_DATA["Didier Drogba"] },
      { id: "tree-etoo", label: "Eto'o", fullName: "Samuel Eto'o", type: "player", x: 385, y: 340, r: 12, color: "var(--neon-orange)", playerData: LEGEND_PLAYERS_DATA["Samuel Eto'o"] },
      
      // N. America Legends
      { id: "tree-pulisic", label: "Pulisic", fullName: "Christian Pulisic", type: "player", x: 470, y: 270, r: 12, color: "var(--neon-cyan)", playerData: LEGEND_PLAYERS_DATA["Christian Pulisic"] },
      { id: "tree-donovan", label: "Donovan", fullName: "Landon Donovan", type: "player", x: 515, y: 340, r: 12, color: "var(--neon-cyan)", playerData: LEGEND_PLAYERS_DATA["Landon Donovan"] }
    ];

    const links = [
      { source: "tree-root", target: "tree-sa" },
      { source: "tree-root", target: "tree-eu" },
      { source: "tree-root", target: "tree-af" },
      { source: "tree-root", target: "tree-na" },
      
      { source: "tree-sa", target: "tree-pele" },
      { source: "tree-sa", target: "tree-maradona" },
      { source: "tree-sa", target: "tree-messi" },
      
      { source: "tree-eu", target: "tree-cruyff" },
      { source: "tree-eu", target: "tree-zidane" },
      { source: "tree-eu", target: "tree-ronaldo" },
      
      { source: "tree-af", target: "tree-drogba" },
      { source: "tree-af", target: "tree-etoo" },
      
      { source: "tree-na", target: "tree-pulisic" },
      { source: "tree-na", target: "tree-donovan" }
    ];

    return { nodes, links };
  }, []);

  const activeData = useMemo(() => {
    return chartType === 'association' ? graphData : treeData;
  }, [chartType, graphData, treeData]);

  return (
    <div className="root-connection-container">
      
      {/* Title Header Banner */}
      <div className="flat-panel connection-banner" style={{ marginBottom: 20 }}>
        <div className="card-title">
          <span><i className="fa-solid fa-network-wired" style={{ marginRight: 6, color: 'var(--neon-purple)' }} /> {t.rootConnectionTitle}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {t.rootConnectionDesc}
        </p>

        {/* Chart View Toggle Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginTop: 15, flexWrap: 'wrap' }}>
          <button
            onClick={() => setChartType('association')}
            className={`subtab-btn ${chartType === 'association' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              background: chartType === 'association' ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4), rgba(171, 71, 188, 0.4))' : 'rgba(255,255,255,0.03)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: chartType === 'association' ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <i className="fa-solid fa-circle-nodes" style={{ marginRight: 6 }} /> Squad Associations
          </button>
          <button
            onClick={() => setChartType('legends-tree')}
            className={`subtab-btn ${chartType === 'legends-tree' ? 'active' : ''}`}
            style={{
              padding: '8px 14px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid var(--border-color)',
              background: chartType === 'legends-tree' ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.4), rgba(171, 71, 188, 0.4))' : 'rgba(255,255,255,0.03)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: chartType === 'legends-tree' ? '0 0 10px rgba(0, 240, 255, 0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <i className="fa-solid fa-sitemap" style={{ marginRight: 6 }} /> Legends Tree of Fame
          </button>
        </div>

        {/* Dropdown Select Team (Only active in Association mode) */}
        {chartType === 'association' && (
          <div className="team-selector-wrap" style={{ marginTop: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ fontSize: 12, fontWeight: 500 }}>{t.selectTeam}:</label>
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="styled-dropdown"
            >
              {TEAMS_LIST.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="connection-split-grid">
        
        {/* SVG Interactive Chart Panel */}
        <div className="flat-panel svg-graph-panel" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          
          <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-hand-pointer" style={{ marginRight: 4 }} /> Hover/Click nodes to explore
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" className="relationship-svg" style={{ maxWidth: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connection Paths */}
            {activeData.links.map((link, idx) => {
              const srcNode = activeData.nodes.find(n => n.id === link.source);
              const tgtNode = activeData.nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const isHovered = hoveredNode && (hoveredNode.id === srcNode.id || hoveredNode.id === tgtNode.id);
              const isSelected = selectedPlayer && (selectedPlayer.name === srcNode.fullName || selectedPlayer.name === tgtNode.fullName);
              const isHighlight = isHovered || isSelected;

              return (
                <g key={idx}>
                  <path
                    d={`M ${srcNode.x} ${srcNode.y} L ${tgtNode.x} ${tgtNode.y}`}
                    stroke={isHighlight ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={isHighlight ? 2.5 : 1}
                    strokeDasharray={link.type === 'player-club' ? '4 3' : (isHighlight ? '8 4' : undefined)}
                    className={isHighlight ? 'pulse-path-animation' : ''}
                    style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
                  />
                  {isHighlight && (
                    <circle r="3" fill="var(--neon-green)">
                      <animateMotion
                        path={`M ${srcNode.x} ${srcNode.y} L ${tgtNode.x} ${tgtNode.y}`}
                        dur="3.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Nodes Group */}
            {activeData.nodes.map((node) => {
              const isHovered = hoveredNode && hoveredNode.id === node.id;
              const isSelected = selectedPlayer && (selectedPlayer.name === node.fullName);
              const isActive = isHovered || isSelected;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    if (node.type === 'player') {
                      setSelectedPlayer(node.playerData);
                    }
                  }}
                >
                  {/* Glowing backing ring */}
                  <circle
                    r={node.r + (isActive ? 4 : 2)}
                    fill="transparent"
                    stroke={isActive ? node.color : 'transparent'}
                    strokeWidth={isActive ? 2 : 0}
                    style={{ filter: node.type === 'root' ? 'url(#glow-cyan)' : 'url(#glow-purple)', transition: 'all 0.2s' }}
                  />

                  {/* Center Dot Node */}
                  <circle
                    r={node.r}
                    fill={node.type === 'root' ? '#12141a' : node.color}
                    stroke={node.type === 'root' ? node.color : 'rgba(255, 255, 255, 0.15)'}
                    strokeWidth={2}
                    style={{ transition: 'all 0.2s' }}
                  />

                  {/* Label Text for Root Nodes */}
                  {node.type === 'root' && (
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fill="#fff"
                      style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.5, fontFamily: 'var(--font-display)' }}
                    >
                      {node.label}
                    </text>
                  )}

                  {/* Label Text for Continent Nodes */}
                  {node.type === 'continent' && (
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fill="#fff"
                      style={{ fontSize: 8.5, fontWeight: 700, fontFamily: 'var(--font-sans)' }}
                    >
                      {node.label}
                    </text>
                  )}

                  {/* Label Text for Position Hubs */}
                  {node.type === 'position' && (
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fill="#000"
                      style={{ fontSize: 8, fontWeight: 800, fontFamily: 'var(--font-sans)' }}
                    >
                      {node.label}
                    </text>
                  )}

                  {/* Label Text for Club Nodes */}
                  {node.type === 'club' && (
                    <text
                      textAnchor="middle"
                      y={14}
                      fill="var(--text-secondary)"
                      style={{ fontSize: 7, fontWeight: 400, fontFamily: 'var(--font-sans)' }}
                    >
                      {node.label}
                    </text>
                  )}

                  {/* Label Text for Player Nodes */}
                  {node.type === 'player' && (
                    <text
                      textAnchor="middle"
                      y={18}
                      fill="var(--text-secondary)"
                      style={{ fontSize: 8.5, fontWeight: 500, fontFamily: 'var(--font-sans)' }}
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Info Card Panel (Side Panel) */}
        <div className="flat-panel detail-side-panel">
          <div className="card-title">
            <span><i className="fa-solid fa-id-card" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> {t.playerDetails}</span>
          </div>

          {selectedPlayer ? (
            <div className="player-detail-body">
              
              <div className="player-avatar-large-wrap">
                <PlayerAvatar name={selectedPlayer.name} country={selectedPlayer.team} size={86} />
              </div>

              <div className="player-core-meta">
                <h3>{selectedPlayer.name}</h3>
                <span className="player-country-pill">{selectedPlayer.team}</span>
              </div>

              <div className="player-extended-stats">
                <div className="stats-box-item">
                  <span className="stat-num">{selectedPlayer.goals}</span>
                  <span className="stat-lbl"><i className="fa-solid fa-futbol" /> Goals</span>
                </div>
                <div className="stats-box-item">
                  <span className="stat-num">{selectedPlayer.matches}</span>
                  <span className="stat-lbl"><i className="fa-solid fa-stopwatch" /> Apps</span>
                </div>
              </div>

              <div className="detail-meta-list">
                <div className="meta-row">
                  <span>{t.clubAffiliation}</span>
                  <strong>{selectedPlayer.club || "N/A"}</strong>
                </div>
                <div className="meta-row">
                  <span>League</span>
                  <strong>{selectedPlayer.league || "N/A"}</strong>
                </div>
                <div className="meta-row">
                  <span>{t.marketValue}</span>
                  <strong className="cyan-text">{selectedPlayer.marketValue || "N/A"}</strong>
                </div>
              </div>

              <p className="player-summary-bio">{selectedPlayer.details}</p>
            </div>
          ) : (
            <div className="empty-panel-prompt">
              <i className="fa-solid fa-circle-nodes" />
              <p>Select a player node in the graph to view their detailed analytics card.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
