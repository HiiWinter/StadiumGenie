// src/components/SpectatorHub.jsx - FIFA World Cup 2026 Teams, Countries, News & Player Search
import React, { useState, useMemo, useEffect } from 'react';
import { getPlayerImageUrl, PlayerAvatar } from '../utils/playerImageHelper';

// ─── Player Database with profile details ───
import { PLAYER_DATABASE } from '../data/playerDatabase';


// ─── All 48 Qualified Teams ───
const HOST_COUNTRIES = [
  { name: "Canada", code: "CAN", flag: "🇨🇦", stage: "Quarter-final", form: ["W","W","L"], lastMatch: { score: "0 - 3", opponent: "MAR", opFlag: "🇲🇦" }, nextMatch: null },
  { name: "Mexico", code: "MEX", flag: "🇲🇽", stage: "Quarter-final", form: ["W","D","W"], lastMatch: { score: "2 - 3", opponent: "ENG", opFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, nextMatch: null },
  { name: "USA", code: "USA", flag: "🇺🇸", stage: "Quarter-final", form: ["W","W","L"], lastMatch: { score: "1 - 4", opponent: "BEL", opFlag: "🇧🇪" }, nextMatch: null },
];

const QUALIFIED_TEAMS = [
  { name: "Algeria", code: "ALG", flag: "🇩🇿", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 2", opponent: "SUI", opFlag: "🇨🇭" }, nextMatch: null },
  { name: "Argentina", code: "ARG", flag: "🇦🇷", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "3 - 2", opponent: "EGY", opFlag: "🇪🇬" }, nextMatch: { date: "12/07/26", opponent: "SUI", opFlag: "🇨🇭" } },
  { name: "Australia", code: "AUS", flag: "🇦🇺", stage: "Round of 32", form: ["-"], lastMatch: { score: "(2) 1-1 (4)", opponent: "EGY", opFlag: "🇪🇬" }, nextMatch: null },
  { name: "Austria", code: "AUT", flag: "🇦🇹", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 3", opponent: "ESP", opFlag: "🇪🇸" }, nextMatch: null },
  { name: "Belgium", code: "BEL", flag: "🇧🇪", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "4 - 1", opponent: "USA", opFlag: "🇺🇸" }, nextMatch: { date: "11/07/26", opponent: "ESP", opFlag: "🇪🇸" } },
  { name: "Bosnia and Herzegovina", code: "BIH", flag: "🇧🇦", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 2", opponent: "USA", opFlag: "🇺🇸" }, nextMatch: null },
  { name: "Brazil", code: "BRA", flag: "🇧🇷", stage: "Round of 16", form: ["W","D","W"], lastMatch: { score: "1 - 2", opponent: "NOR", opFlag: "🇳🇴" }, nextMatch: null },
  { name: "Cabo Verde", code: "CPV", flag: "🇨🇻", stage: "Round of 32", form: ["-"], lastMatch: { score: "2 - 3", opponent: "ARG", opFlag: "🇦🇷" }, nextMatch: null },
  { name: "Colombia", code: "COL", flag: "🇨🇴", stage: "Round of 16", form: ["W","W","D"], lastMatch: { score: "(3) 0-0 (4)", opponent: "SUI", opFlag: "🇨🇭" }, nextMatch: null },
  { name: "Congo DR", code: "COD", flag: "🇨🇩", stage: "Round of 32", form: ["-"], lastMatch: { score: "1 - 2", opponent: "ENG", opFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, nextMatch: null },
  { name: "Côte d'Ivoire", code: "CIV", flag: "🇨🇮", stage: "Round of 32", form: ["-"], lastMatch: { score: "1 - 2", opponent: "NOR", opFlag: "🇳🇴" }, nextMatch: null },
  { name: "Croatia", code: "CRO", flag: "🇭🇷", stage: "Round of 32", form: ["-"], lastMatch: { score: "1 - 2", opponent: "POR", opFlag: "🇵🇹" }, nextMatch: null },
  { name: "Curaçao", code: "CUW", flag: "🇨🇼", stage: "#4 - Group E", form: ["-","-"], lastMatch: { score: "0 - 2", opponent: "CIV", opFlag: "🇨🇮" }, nextMatch: null },
  { name: "Czechia", code: "CZE", flag: "🇨🇿", stage: "#4 - Group A", form: ["-","-"], lastMatch: { score: "0 - 3", opponent: "MEX", opFlag: "🇲🇽" }, nextMatch: null },
  { name: "Ecuador", code: "ECU", flag: "🇪🇨", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 2", opponent: "MEX", opFlag: "🇲🇽" }, nextMatch: null },
  { name: "Egypt", code: "EGY", flag: "🇪🇬", stage: "Round of 16", form: ["W","W","L"], lastMatch: { score: "2 - 3", opponent: "ARG", opFlag: "🇦🇷" }, nextMatch: null },
  { name: "England", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "3 - 2", opponent: "MEX", opFlag: "🇲🇽" }, nextMatch: { date: "12/07/26", opponent: "NOR", opFlag: "🇳🇴" } },
  { name: "France", code: "FRA", flag: "🇫🇷", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "1 - 0", opponent: "PAR", opFlag: "🇵🇾" }, nextMatch: { date: "10/07/26", opponent: "MAR", opFlag: "🇲🇦" } },
  { name: "Germany", code: "GER", flag: "🇩🇪", stage: "Round of 32", form: ["-"], lastMatch: { score: "(3) 1-1 (4)", opponent: "PAR", opFlag: "🇵🇾" }, nextMatch: null },
  { name: "Ghana", code: "GHA", flag: "🇬🇭", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 1", opponent: "COL", opFlag: "🇨🇴" }, nextMatch: null },
  { name: "Haiti", code: "HAI", flag: "🇭🇹", stage: "#4 - Group C", form: ["-","-"], lastMatch: { score: "2 - 4", opponent: "MAR", opFlag: "🇲🇦" }, nextMatch: null },
  { name: "IR Iran", code: "IRN", flag: "🇮🇷", stage: "#3 - Group G", form: ["-","-"], lastMatch: { score: "1 - 1", opponent: "EGY", opFlag: "🇪🇬" }, nextMatch: null },
  { name: "Iraq", code: "IRQ", flag: "🇮🇶", stage: "#4 - Group I", form: ["-","-"], lastMatch: { score: "0 - 5", opponent: "SEN", opFlag: "🇸🇳" }, nextMatch: null },
  { name: "Japan", code: "JPN", flag: "🇯🇵", stage: "Round of 32", form: ["-"], lastMatch: { score: "1 - 2", opponent: "BRA", opFlag: "🇧🇷" }, nextMatch: null },
  { name: "Jordan", code: "JOR", flag: "🇯🇴", stage: "#4 - Group J", form: ["-","-"], lastMatch: { score: "1 - 3", opponent: "ARG", opFlag: "🇦🇷" }, nextMatch: null },
  { name: "Korea Republic", code: "KOR", flag: "🇰🇷", stage: "#3 - Group A", form: ["-","-"], lastMatch: { score: "0 - 1", opponent: "RSA", opFlag: "🇿🇦" }, nextMatch: null },
  { name: "Morocco", code: "MAR", flag: "🇲🇦", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "3 - 0", opponent: "CAN", opFlag: "🇨🇦" }, nextMatch: { date: "10/07/26", opponent: "FRA", opFlag: "🇫🇷" } },
  { name: "Netherlands", code: "NED", flag: "🇳🇱", stage: "Round of 32", form: ["-"], lastMatch: { score: "(2) 1-1 (3)", opponent: "MAR", opFlag: "🇲🇦" }, nextMatch: null },
  { name: "New Zealand", code: "NZL", flag: "🇳🇿", stage: "#4 - Group G", form: ["-","-"], lastMatch: { score: "1 - 5", opponent: "BEL", opFlag: "🇧🇪" }, nextMatch: null },
  { name: "Norway", code: "NOR", flag: "🇳🇴", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "2 - 1", opponent: "BRA", opFlag: "🇧🇷" }, nextMatch: { date: "12/07/26", opponent: "ENG", opFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" } },
  { name: "Panama", code: "PAN", flag: "🇵🇦", stage: "#4 - Group L", form: ["-","-"], lastMatch: { score: "0 - 2", opponent: "ENG", opFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, nextMatch: null },
  { name: "Paraguay", code: "PAR", flag: "🇵🇾", stage: "Round of 16", form: ["W","D","L"], lastMatch: { score: "0 - 1", opponent: "FRA", opFlag: "🇫🇷" }, nextMatch: null },
  { name: "Portugal", code: "POR", flag: "🇵🇹", stage: "Round of 16", form: ["W","W","L"], lastMatch: { score: "0 - 1", opponent: "ESP", opFlag: "🇪🇸" }, nextMatch: null },
  { name: "Qatar", code: "QAT", flag: "🇶🇦", stage: "#4 - Group B", form: ["-","-"], lastMatch: { score: "1 - 3", opponent: "BIH", opFlag: "🇧🇦" }, nextMatch: null },
  { name: "Saudi Arabia", code: "KSA", flag: "🇸🇦", stage: "#4 - Group H", form: ["-","-"], lastMatch: { score: "0 - 0", opponent: "CPV", opFlag: "🇨🇻" }, nextMatch: null },
  { name: "Scotland", code: "SCO", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", stage: "#3 - Group C", form: ["-","-"], lastMatch: { score: "0 - 3", opponent: "BRA", opFlag: "🇧🇷" }, nextMatch: null },
  { name: "Senegal", code: "SEN", flag: "🇸🇳", stage: "Round of 32", form: ["-"], lastMatch: { score: "2 - 3", opponent: "BEL", opFlag: "🇧🇪" }, nextMatch: null },
  { name: "South Africa", code: "RSA", flag: "🇿🇦", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 1", opponent: "CAN", opFlag: "🇨🇦" }, nextMatch: null },
  { name: "Spain", code: "ESP", flag: "🇪🇸", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "1 - 0", opponent: "POR", opFlag: "🇵🇹" }, nextMatch: { date: "11/07/26", opponent: "BEL", opFlag: "🇧🇪" } },
  { name: "Sweden", code: "SWE", flag: "🇸🇪", stage: "Round of 32", form: ["-"], lastMatch: { score: "0 - 3", opponent: "FRA", opFlag: "🇫🇷" }, nextMatch: null },
  { name: "Switzerland", code: "SUI", flag: "🇨🇭", stage: "Quarter-final", form: ["W","W","W"], lastMatch: { score: "(4) 0-0 (3)", opponent: "COL", opFlag: "🇨🇴" }, nextMatch: { date: "12/07/26", opponent: "ARG", opFlag: "🇦🇷" } },
  { name: "Tunisia", code: "TUN", flag: "🇹🇳", stage: "#4 - Group F", form: ["-","-"], lastMatch: { score: "1 - 3", opponent: "NED", opFlag: "🇳🇱" }, nextMatch: null },
  { name: "Türkiye", code: "TUR", flag: "🇹🇷", stage: "#4 - Group D", form: ["-","-"], lastMatch: { score: "3 - 2", opponent: "USA", opFlag: "🇺🇸" }, nextMatch: null },
  { name: "Uruguay", code: "URU", flag: "🇺🇾", stage: "#3 - Group H", form: ["-","-"], lastMatch: { score: "0 - 1", opponent: "ESP", opFlag: "🇪🇸" }, nextMatch: null },
  { name: "Uzbekistan", code: "UZB", flag: "🇺🇿", stage: "#4 - Group K", form: ["-","-"], lastMatch: { score: "1 - 3", opponent: "COD", opFlag: "🇨🇩" }, nextMatch: null },
];

// ─── FIFA 2026 Latest News ───
const NEWS_ITEMS = [
  { id: 1, date: "8 Jul 2026", headline: "Quarter-Final Draw Complete: Argentina vs Switzerland, France vs Morocco headline blockbuster ties", tag: "KNOCKOUT", color: "var(--neon-red)" },
  { id: 2, date: "8 Jul 2026", headline: "Norway stun Brazil 2-1 in Dallas to advance to their first-ever World Cup Quarter-Final", tag: "UPSET", color: "var(--neon-orange)" },
  { id: 3, date: "7 Jul 2026", headline: "Belgium dismantle USA 4-1 at SoFi Stadium — Kevin De Bruyne masterclass with 2 goals and 1 assist", tag: "RESULT", color: "var(--neon-cyan)" },
  { id: 4, date: "7 Jul 2026", headline: "England edge past Mexico 3-2 in a five-goal thriller at MetLife Stadium — Kane hat-trick", tag: "RESULT", color: "var(--neon-cyan)" },
  { id: 5, date: "6 Jul 2026", headline: "Morocco continue fairytale run, blanking Canada 3-0 — Hakimi scores a 40-yard free kick", tag: "RESULT", color: "var(--neon-cyan)" },
  { id: 6, date: "6 Jul 2026", headline: "Switzerland defeat Colombia on penalties (4-3) after 120 goalless minutes of tactical chess", tag: "RESULT", color: "var(--neon-cyan)" },
  { id: 7, date: "5 Jul 2026", headline: "FIFA confirms all Quarter-Final venues: AT&T Stadium, SoFi, Hard Rock, and Gillette selected", tag: "OFFICIAL", color: "var(--neon-purple)" },
  { id: 8, date: "5 Jul 2026", headline: "Germany eliminated on penalties by Paraguay — Florian Wirtz misses decisive spot-kick", tag: "SHOCK", color: "var(--neon-red)" },
  { id: 9, date: "4 Jul 2026", headline: "Record-breaking 3.2 million match tickets sold across Round of 32 & Round of 16 stages", tag: "MILESTONE", color: "var(--neon-orange)" },
  { id: 10, date: "4 Jul 2026", headline: "IR Iran finish unbeaten in Group G but fail to advance — Team Melli draws all 3 matches", tag: "GROUP", color: "var(--text-muted)" },
];

function getStageColor(stage) {
  if (stage.includes("Quarter")) return "var(--neon-cyan)";
  if (stage.includes("Round of 16")) return "var(--neon-purple)";
  if (stage.includes("Round of 32")) return "var(--neon-orange)";
  if (stage.startsWith("#3")) return "var(--neon-red)";
  if (stage.startsWith("#4")) return "var(--text-muted)";
  return "var(--text-muted)";
}

function getFormDot(f) {
  if (f === "W") return { bg: "rgba(22, 163, 74, 0.1)", color: "var(--neon-green)", label: "W" };
  if (f === "L") return { bg: "rgba(220, 38, 38, 0.1)", color: "var(--neon-red)", label: "L" };
  if (f === "D") return { bg: "var(--bg-input)", color: "var(--text-muted)", label: "D" };
  return { bg: "rgba(0,0,0,0.02)", color: "var(--text-muted)", label: "-" };
}

// ─── National Jersey Color Mapping ───
const getJerseyColors = (countryName) => {
  const name = countryName.toLowerCase();
  if (name.includes("argentina")) return { primary: "#74acdf", secondary: "#ffffff", style: "stripes" };
  if (name.includes("brazil")) return { primary: "#ffdf00", secondary: "#009b3a", style: "solid" };
  if (name.includes("france")) return { primary: "#002395", secondary: "#ffffff", style: "solid" };
  if (name.includes("spain")) return { primary: "#c60b1e", secondary: "#f1bf00", style: "solid" };
  if (name.includes("england")) return { primary: "#ffffff", secondary: "#000033", style: "solid" };
  if (name.includes("germany")) return { primary: "#ffffff", secondary: "#000000", style: "stripes" };
  if (name.includes("mexico")) return { primary: "#006847", secondary: "#ffffff", style: "solid" };
  if (name.includes("usa") || name.includes("united states")) return { primary: "#ffffff", secondary: "#002868", style: "solid" };
  if (name.includes("canada")) return { primary: "#ff0000", secondary: "#ffffff", style: "solid" };
  if (name.includes("morocco")) return { primary: "#c1272d", secondary: "#006233", style: "solid" };
  if (name.includes("belgium")) return { primary: "#e30613", secondary: "#ffed00", style: "solid" };
  if (name.includes("italy")) return { primary: "#0087dc", secondary: "#ffffff", style: "solid" };
  if (name.includes("portugal")) return { primary: "#c1272d", secondary: "#006233", style: "half" };
  if (name.includes("netherlands")) return { primary: "#f36c21", secondary: "#ffffff", style: "solid" };
  if (name.includes("uruguay")) return { primary: "#5cb5e6", secondary: "#ffffff", style: "solid" };
  if (name.includes("colombia")) return { primary: "#fcd116", secondary: "#003893", style: "solid" };
  if (name.includes("norway")) return { primary: "#d81e05", secondary: "#00205b", style: "solid" };
  return { primary: "#64748b", secondary: "#cbd5e1", style: "solid" };
};

// ─── Football Jersey SVG component ───
function FootballJerseySVG({ countryName, number = "10" }) {
  const { primary, secondary, style } = getJerseyColors(countryName);
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Shirt outline */}
      <path d="M 20,25 L 32,15 L 42,19 L 50,15 L 58,19 L 68,15 L 80,25 L 74,42 L 67,39 L 67,85 L 33,85 L 33,39 L 26,42 Z" fill={primary} stroke="var(--text-primary)" strokeWidth="2.5" />
      {/* Stripes design */}
      {style === "stripes" && (
        <>
          <rect x="38" y="20" width="5" height="65" fill={secondary} />
          <rect x="47" y="20" width="5" height="65" fill={secondary} />
          <rect x="56" y="20" width="5" height="65" fill={secondary} />
        </>
      )}
      {/* Half and half design */}
      {style === "half" && (
        <path d="M 50,18 L 50,85 L 67,85 L 67,39 L 74,42 L 80,25 L 68,15 L 50,18" fill={secondary} />
      )}
      {/* Collar details */}
      <polygon points="40,19 50,28 60,19" fill={secondary} stroke="var(--text-primary)" strokeWidth="1.5" />
      {/* Number on shirt */}
      <text x="50" y="58" fontSize="20" fontWeight="bold" fontFamily="monospace" fill={secondary} textAnchor="middle" alignmentBaseline="middle">{number}</text>
    </svg>
  );
}

// ─── Dynamic Squad Generator ───
const getSquadForCountry = (countryName) => {
  const explicitPlayers = PLAYER_DATABASE.filter(p => p.country.toLowerCase() === countryName.toLowerCase());
  
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Attacking Midfielder", "Winger", "Forward"];
  const generatedPlayers = [];
  
  const positionsToGenerate = [...positions];
  explicitPlayers.forEach(p => {
    const idx = positionsToGenerate.indexOf(p.position);
    if (idx > -1) {
      positionsToGenerate.splice(idx, 1);
    }
  });
  
  const mockNames = {
    Goalkeeper: ["Alex Carter", "David Miller", "Marc Dubois", "Luis Santos", "Jonas Becker", "Oliver Hansen"],
    Defender: ["Christian Romero", "John Stone", "Thiago Silva", "Virgil Dijk", "Mats Hummels", "Giorgio Chiellini"],
    Midfielder: ["Luka Modric", "Declan Rice", "Bruno Fernandes", "Rodrigo De Paul", "Casemiro", "Joshua Kimmich"],
    "Attacking Midfielder": ["Antoine Griezmann", "Bernardo Silva", "Martin Ødegaard", "Cole Palmer", "Jamal Musiala", "Florian Wirtz"],
    Winger: ["Bukayo Saka", "Vinícius Jr", "Rafael Leão", "Ousmane Dembélé", "Rodrygo", "Luis Díaz"],
    Forward: ["Harry Kane", "Lautaro Martínez", "Robert Lewandowski", "Cristiano Ronaldo", "Romelu Lukaku", "Marcus Rashford"]
  };

  const clubs = ["Manchester City", "Real Madrid", "FC Barcelona", "Bayern Munich", "Paris Saint-Germain", "Liverpool FC", "Arsenal FC", "Inter Miami CF", "Juventus FC"];
  const leagues = ["Premier League", "La Liga", "Bundesliga", "Ligue 1", "Serie A", "MLS"];

  positionsToGenerate.forEach((pos, i) => {
    const seed = (countryName.charCodeAt(0) + pos.charCodeAt(0) + i) % 6;
    const baseName = mockNames[pos][seed];
    
    const clubSeed = (countryName.charCodeAt(1) + i) % clubs.length;
    const leagueSeed = (countryName.charCodeAt(2) + i) % leagues.length;
    
    const age = 20 + ((countryName.charCodeAt(0) + i) % 15);
    const height = 175 + ((countryName.charCodeAt(1) + i) % 20);
    const weight = 65 + ((countryName.charCodeAt(2) + i) % 25);
    
    const goals = pos === "Forward" || pos === "Winger" ? (5 + (countryName.charCodeAt(0) % 30)) : (pos === "Midfielder" ? (1 + (countryName.charCodeAt(0) % 10)) : 0);
    const caps = 10 + (countryName.charCodeAt(0) % 90);
    
    generatedPlayers.push({
      name: `${baseName}`,
      country: countryName,
      position: pos,
      height: `${height} cm`,
      weight: `${weight} kg`,
      age,
      club: clubs[clubSeed],
      league: leagues[leagueSeed],
      goals,
      caps,
      image: null
    });
  });

  return [...explicitPlayers, ...generatedPlayers];
};

// ─── Squad Family Tree Chart Component ───
function SquadTreeChart({ countryName, flag, squad }) {
  // Group players by position
  const positions = {
    "Goalkeeper": [],
    "Defender": [],
    "Midfielder": [],
    "Forward": []
  };

  squad.forEach(p => {
    let pos = p.position;
    if (pos.includes("Goalkeeper")) pos = "Goalkeeper";
    else if (pos.includes("Defender") || pos.includes("Back")) pos = "Defender";
    else if (pos.includes("Midfielder")) pos = "Midfielder";
    else pos = "Forward";
    
    if (positions[pos]) {
      positions[pos].push(p.name);
    }
  });

  const maxPlayersInPos = Math.max(
    positions.Goalkeeper.length,
    positions.Defender.length,
    positions.Midfielder.length,
    positions.Forward.length
  );

  const width = 900;
  const height = Math.max(480, 210 + maxPlayersInPos * 50 + 20);
  const rootX = 450;
  const rootY = 40;

  const colX = {
    "Goalkeeper": 112,
    "Defender": 337,
    "Midfielder": 562,
    "Forward": 787
  };

  const posColor = {
    "Goalkeeper": "var(--neon-cyan)",
    "Defender": "var(--neon-green)",
    "Midfielder": "var(--neon-purple)",
    "Forward": "var(--neon-red)"
  };

  return (
    <div className="flat-panel" style={{ padding: 20 }}>
      <div className="card-title" style={{ marginBottom: 16 }}>
        <span><i className="fa-solid fa-sitemap" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> Squad Family Tree Chart</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>HIERARCHICAL POSITION CHART</span>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <div style={{ minWidth: 900, display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <svg width={width} height={height} style={{ background: 'var(--bg-input)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <defs>
            <linearGradient id="rootGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)" />
              <stop offset="100%" stopColor="var(--neon-purple)" />
            </linearGradient>
          </defs>

          {/* Links: Root to Positions */}
          {Object.keys(colX).map(pos => (
            <path
              key={`link-root-${pos}`}
              d={`M ${rootX} ${rootY + 28} C ${rootX} ${(rootY + 130)/2 + 20}, ${colX[pos]} ${(rootY + 130)/2 + 20}, ${colX[pos]} 120`}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="2.5"
            />
          ))}

          {/* Links: Positions to Players */}
          {Object.keys(positions).map(pos => {
            const px = colX[pos];
            return positions[pos].map((player, idx) => {
              const py = 210 + idx * 50;
              return (
                <line
                  key={`link-${pos}-${idx}`}
                  x1={px}
                  y1={140}
                  x2={px}
                  y2={py - 12}
                  stroke={posColor[pos]}
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
              );
            });
          })}

          {/* Root Node */}
          <g>
            <circle cx={rootX} cy={rootY} r={28} fill="url(#rootGrad)" stroke="var(--border-color)" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
            <text x={rootX} y={rootY + 6} fontSize="18" textAnchor="middle">{flag}</text>
            <text x={rootX} y={rootY + 46} fill="var(--text-primary)" fontSize="11" fontWeight="bold" textAnchor="middle">{countryName.toUpperCase()}</text>
          </g>

          {/* Position Nodes */}
          {Object.keys(colX).map(pos => {
            const px = colX[pos];
            return (
              <g key={`pos-node-${pos}`}>
                <circle cx={px} cy={130} r={20} fill="var(--bg-card)" stroke={posColor[pos]} strokeWidth="3.5" />
                <text x={px} y={134} fill="var(--text-primary)" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {pos === "Goalkeeper" ? "GK" : pos[0]}
                </text>
                <text x={px} y={106} fill="var(--text-muted)" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {pos.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Player Nodes */}
          {Object.keys(positions).map(pos => {
            const px = colX[pos];
            return positions[pos].map((player, idx) => {
              const py = 210 + idx * 50;
              return (
                <g key={`player-${player}-${idx}`}>
                  <rect
                    x={px - 75}
                    y={py - 14}
                    width={150}
                    height={28}
                    rx={7}
                    fill="var(--bg-card)"
                    stroke="var(--border-color)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={px}
                    y={py + 4}
                    fill="var(--text-primary)"
                    fontSize="10"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {player.split(' ').length > 1 ? player.split(' ').slice(-1)[0] : player}
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>
    </div>
  </div>
  );
}

// ─── Canada Team Stats Data ───
const CANADA_TEAM_STATS = [
  { group: "General Team Metrics", stats: [
    { label: "Matches Played", val: 5 },
    { label: "Goals", val: 9 },
    { label: "Goals Conceded", val: 6 },
    { label: "Clean Sheets", val: 2 },
    { label: "Red Cards", val: 0 },
    { label: "Yellow Cards", val: 11 },
  ]},
  { group: "Attacking & Attempts", stats: [
    { label: "Attempts at goal", val: 81 },
    { label: "Attempts On Target", val: 32 },
    { label: "Attempts Inside Penalty Area", val: 57 },
    { label: "Attempt Outside Penalty Area", val: 24 },
    { label: "Assists", val: 3 },
    { label: "Corners", val: 50 },
    { label: "Penalties Scored", val: 0 },
    { label: "Own Goals", val: 0 },
  ]},
  { group: "Passing & Distribution", stats: [
    { label: "Passes", val: 2098 },
    { label: "Passes Completed", val: 1722 },
    { label: "Crosses", val: 158 },
    { label: "Crosses Completed", val: 38 },
    { label: "Linebreaks Attempted", val: 844 },
    { label: "Linebreaks Completed", val: 546 },
    { label: "Completed Switches Of Play", val: 15 },
  ]},
  { group: "Offers & Receptions", stats: [
    { label: "Offers To Receive In Behind", val: 533 },
    { label: "Offers To Receive In Between", val: 576 },
    { label: "Offers To Receive In Front", val: 480 },
    { label: "Offers To Receive Total", val: 1589 },
    { label: "Central Channel Reception", val: 52 },
    { label: "Inside Left Channel", val: 43 },
    { label: "Inside Right Channel", val: 33 },
    { label: "Left Channel Reception", val: 106 },
    { label: "Right Channel Reception", val: 113 },
  ]},
  { group: "Defensive & Physical", stats: [
    { label: "Fouls Against", val: 72 },
    { label: "Forced turnovers", val: 228 },
    { label: "Pressing Applied", val: 1183 },
    { label: "Free Kicks", val: 79 },
  ]}
];

// Helper to load team stats dynamically
const getTeamStats = (countryName) => {
  if (countryName.toLowerCase() === "canada") {
    return CANADA_TEAM_STATS;
  }
  const seed = countryName.charCodeAt(0) || 5;
  return [
    { group: "General Team Metrics", stats: [
      { label: "Matches Played", val: 4 + (seed % 2) },
      { label: "Goals", val: 5 + (seed % 6) },
      { label: "Goals Conceded", val: 3 + (seed % 4) },
      { label: "Clean Sheets", val: 1 + (seed % 3) },
      { label: "Red Cards", val: seed % 2 },
      { label: "Yellow Cards", val: 6 + (seed % 8) },
    ]},
    { group: "Attacking & Attempts", stats: [
      { label: "Attempts at goal", val: 60 + (seed % 30) },
      { label: "Attempts On Target", val: 20 + (seed % 15) },
      { label: "Assists", val: 2 + (seed % 4) },
      { label: "Corners", val: 30 + (seed % 20) },
    ]},
    { group: "Passing & Distribution", stats: [
      { label: "Passes", val: 1800 + (seed * 10) },
      { label: "Passes Completed", val: 1500 + (seed * 8) },
      { label: "Linebreaks Attempted", val: 700 + (seed % 100) },
      { label: "Linebreaks Completed", val: 450 + (seed % 100) },
    ]}
  ];
};

// Helper to load Canada player statistics leaderboard
const getPlayerLeaderboard = (countryName) => {
  if (countryName.toLowerCase() === "canada") {
    return [
      { name: "Jonathan David", role: "Most Goals", val: "3 goals", details: "18 Attempts at Goal • 93 Receptions between Midfield & Defensive Line • 227 Pressing Applied", image: "/players/david.png" },
      { name: "Stephen Eustaquio", role: "Most Passes & Playmaking", val: "281 passes", details: "42 Crosses • 212 Offers To Receive", image: "/players/eustaquio.png" },
      { name: "Alistair Johnston", role: "Workrate & Linebreaks", val: "53.46 km", details: "264 Sprints • 124 Attempted (82 Completed) Line Breaks", image: "/players/johnston.png" },
      { name: "Jacob Shaffelburg", role: "Average Speed", val: "7.63 km/h", details: "High-intensity wing transition runs", image: "/players/shaffelburg.png" },
      { name: "Nathan Saliba", role: "Most Assists", val: "2 assists", details: "Key creator in final third transitions", image: null }
    ];
  }
  const squad = getSquadForCountry(countryName);
  const forward = squad.find(p => p.position === "Forward") || squad[0];
  const mid = squad.find(p => p.position === "Midfielder") || squad[1] || squad[0];
  const def = squad.find(p => p.position === "Defender") || squad[2] || squad[0];
  return [
    { name: forward.name, role: "Most Goals", val: `${forward.goals} goals`, details: `${forward.goals * 5} attempts at goal`, image: forward.image },
    { name: mid.name, role: "Most Passes", val: `${180 + (countryName.charCodeAt(0) % 120)} passes`, details: "Midfield control", image: mid.image },
    { name: def.name, role: "Total Distance Ran", val: `${42 + (countryName.charCodeAt(0) % 10)} km`, details: "Defensive stability", image: def.image }
  ];
};

// Country detail news
const getCountryNews = (countryName) => {
  if (countryName.toLowerCase() === "canada") {
    return [
      { id: 1, date: "9 Jul 2026", headline: "Canada advances to Round of 16 knockout stage under Jesse Marsch after stellar run!", tag: "KNOCKOUT", color: "var(--neon-red)" },
      { id: 2, date: "8 Jul 2026", headline: "Stephen Eustaquio speaks on Canada's tactical transition shape adjustments", tag: "TACTICS", color: "var(--neon-cyan)" },
      { id: 3, date: "6 Jul 2026", headline: "Jonathan David and Alistair Johnston set top stats benchmarks for running distance and attempts", tag: "ANALYTICS", color: "var(--neon-purple)" }
    ];
  }
  return [
    { id: 1, date: "9 Jul 2026", headline: `${countryName} tactical breakdown: Inverted wing-backs and defensive recovery lines`, tag: "ANALYTICS", color: "var(--neon-cyan)" },
    { id: 2, date: "8 Jul 2026", headline: `${countryName} squad begins recovery sessions before next tournament round`, tag: "TRAINING", color: "var(--neon-orange)" }
  ];
};

function TeamCard({ team, isHost, onClick }) {
  const stageColor = getStageColor(team.stage);
  return (
    <div className="team-tournament-card" onClick={onClick} style={{
      background: isHost
        ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.08), rgba(2, 132, 199, 0.05))'
        : 'var(--bg-card)',
      border: `1px solid ${isHost ? 'rgba(234, 88, 12, 0.25)' : 'var(--border-color)'}`,
      borderRadius: 10, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 8,
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: 'var(--glass-shadow)',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.borderColor = 'var(--neon-cyan)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = isHost ? 'rgba(234, 88, 12, 0.25)' : 'var(--border-color)';
    }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '45%',
        backgroundImage: `url(/flags/${team.code.toLowerCase()}.png)`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.20, pointerEvents: 'none',
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1), transparent)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1), transparent)',
        zIndex: 0
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 22 }}>{team.flag}</span>
          <div>
            <strong style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', display: 'block' }}>{team.name}</strong>
            {isHost && (
              <span style={{ fontSize: 8, background: 'rgba(234, 88, 12, 0.15)', color: 'var(--neon-orange)', padding: '1px 5px', borderRadius: 3, fontWeight: 'bold', letterSpacing: 0.5 }}>HOST</span>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 9, fontWeight: 'bold', fontFamily: 'var(--font-mono)',
          color: stageColor, background: `${stageColor}15`, border: `1px solid ${stageColor}30`,
          padding: '2px 6px', borderRadius: 4, letterSpacing: 0.5,
        }}>
          {team.stage}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', marginRight: 4, fontFamily: 'var(--font-mono)' }}>FORM</span>
        {team.form.map((f, i) => {
          const d = getFormDot(f);
          return (
            <span key={i} style={{
              fontSize: 8, padding: '2px 5px', borderRadius: 3,
              background: d.bg, color: d.color, fontWeight: 'bold',
            }}>{d.label}</span>
          );
        })}
      </div>

      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 6, padding: '6px 8px', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 3 }}>LAST MATCH</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>{team.flag} {team.code}</span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{team.lastMatch.score}</strong>
          <span>{team.lastMatch.opFlag} {team.lastMatch.opponent}</span>
        </div>
      </div>

      <div style={{
        background: team.nextMatch ? 'rgba(2, 132, 199, 0.04)' : 'rgba(0,0,0,0.015)',
        border: `1px solid ${team.nextMatch ? 'rgba(2, 132, 199, 0.12)' : 'var(--border-color)'}`,
        borderRadius: 6, padding: '6px 8px', position: 'relative', zIndex: 1,
      }}>
        <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 3 }}>NEXT MATCH</span>
        {team.nextMatch ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 'bold' }}>{team.nextMatch.date}</span>
            <span>v {team.nextMatch.opFlag} {team.nextMatch.opponent}</span>
          </div>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>— Eliminated —</span>
        )}
      </div>
    </div>
  );
}

const FUT_CARD_PATH = "M1 29.0484C1 21.7037 6.27366 15.5079 13.5238 14.4178C41.6096 10.1951 107.863 1.03396 154.143 1.0001C201.691 0.965304 269.826 10.2227 298.43 14.4477C305.7 15.5215 311 21.7258 311 29.0863V29.2971V29.5094V29.7231V29.9382V30.1548V30.3728V30.5922V30.813V31.0353V31.2589V31.484V31.7105V31.9383V32.1676V32.3983V32.6303V32.8637V33.0985V33.3347V33.5722V33.8111V34.0514V34.293V34.536V34.7803V35.026V35.273V35.5214V35.771V36.022V36.2744V36.528V36.783V37.0392V37.2968V37.5557V37.8159V38.0773V38.3401V38.6041V38.8694V39.136V39.4039V39.673V39.9435V40.2151V40.488V40.7622V41.0376V41.3143V41.5922V41.8713V42.1517V42.4333V42.7161V43.0001V43.2853V43.5718V43.8594V44.1483V44.4383V44.7296V45.022V45.3156V45.6104V45.9064V46.2035V46.5019V46.8013V47.102V47.4037V47.7067V48.0108V48.316V48.6223V48.9298V48.9298V49.2385V49.5482V49.8591V50.1711V50.4842V50.7984V51.1137V51.4301V51.7476V52.0662V52.3859V52.7067V53.0285V53.3514V53.6754V54.0005V54.3266V54.6538V54.982V55.3113V55.6416V55.973V56.3054V56.6388V56.9733V57.3088V57.6453V57.9828V58.3213V58.6609V59.0014V59.343V59.6855V60.029V60.3735V60.3735V60.719V61.0655V61.413V61.7614V62.1108V62.4611V62.8124V63.1647V63.5179V63.872V64.2271V64.5831V64.9401V65.298V65.6568V66.0165V66.3771V66.7387V67.1011V67.4645V67.8287V68.1939V68.5599V68.9268V69.2946V69.6633V70.0329V70.4033V70.7746V71.1467V71.5197V71.8936V72.2683V72.2683V72.6438V73.0202V73.3974V73.7754V74.1543V74.534V74.9145V75.2959V75.678V76.0609V76.4447V76.8292V77.2145V77.6007V77.9876V78.3753V78.7637V79.1529V79.5429V79.9337V80.3252V80.7175V81.1105V81.5043V81.8988V82.2941V82.6901V83.0868V83.4842V83.8824V84.2813V84.6809V85.0812V85.4822V85.8839V86.2863V86.6894V87.0931V87.4976V87.9027V88.3086V88.7151V89.1222V89.53V89.9385V90.3476V90.7574V91.1678V91.5789V91.9906V92.4029V92.8159V93.2295V93.6437V94.0585V94.474V94.89V95.3066V95.7239V96.1417V96.5602V96.9792V97.3988V97.819V98.2397V98.661V99.0829V99.5054V99.9284V100.352V100.776V101.201V101.626V102.052V102.052V102.478V102.905V103.332V103.76V104.188V104.617V105.046V105.476V105.907V106.337V106.769V107.201V107.633V108.066V108.499V108.933V109.367V109.802V110.237V110.672V111.108V111.545V111.982V112.419V112.857V113.295V113.733V114.173V114.612V115.052V115.492V115.933V116.374V116.374V116.815V117.257V117.699V118.142V118.585V119.028V119.472V119.916V120.36V120.805V121.25V121.696V122.142V122.588V123.034V123.481V123.928V124.376V124.824V125.272V125.72V126.169V126.618V127.067V127.517V127.967V128.417V128.868V129.318V129.769V130.221V130.672V131.124V131.576V132.028V132.481V132.934V133.387V133.387V133.84V134.293V134.747V135.201V135.655V136.11V136.564V137.019V137.474V137.929V138.384V138.84V139.296V139.752V140.208V140.664V141.12V141.577V142.034V142.491V142.948V143.405V143.862V144.32V144.777V145.235V145.693V146.151V146.609V147.067V147.525V147.984V148.442V148.901V149.359V149.818V150.277V150.736V151.195V151.654V152.113V152.572V153.032V153.491V153.95V154.41V154.869V155.329V155.788V156.248V156.707V157.167V157.626V158.086V158.546V159.005V159.465V159.924V160.384V160.844V161.303V161.763V162.222V162.682V163.141V163.6V164.06V164.519V164.978V165.437V165.897V166.356V166.815V167.274V167.274V167.732V168.191V168.65V169.108V169.567V170.025V170.484V170.942V171.4V171.858V172.316V172.773V173.231V173.688V174.146V174.603V175.06V175.517V175.973V176.43V176.886V177.342V177.798V178.254V178.71V179.166V179.621V180.076V180.531V180.986V181.44V181.895V182.349V182.803V183.256V183.71V184.163V184.616V185.069V185.521V185.973V186.425V186.877V187.329V187.78V188.231V188.681V189.132V189.582V190.032V190.481V190.931V191.38V191.828V192.277V192.725V193.172V193.62V194.067V194.514V194.96V195.406V195.852V196.298V196.743V197.187V197.632V198.076V198.519V198.963V199.406V199.848V200.29V200.732V201.173V201.614V202.055V202.495V202.935V203.374V203.813V204.252V204.69V205.127V205.565V206.001V206.438V206.874V207.309V207.744V208.179V208.613V209.047V209.48V209.912V210.345V210.776V211.208V211.638V212.069V212.498V212.928V213.356V213.785V214.212V214.64V215.066V215.492V215.918V216.343V216.768V217.192V217.615V218.038V218.46V218.882V219.303V219.724V220.144V220.563V220.982V221.401V221.818V222.236V222.652V223.068V223.483V223.898V224.312V224.726V225.138V225.551V225.962V226.373V226.783V227.193V227.602V228.01V228.418V228.825V229.231V229.637V230.042V230.446V230.85V231.253V231.655V232.057V232.458V232.861V233.265V233.67V234.076V234.482V234.889V235.297V235.705V236.114V236.524V236.934V237.345V237.757V238.169V238.582V238.996V239.41V239.825V240.241V240.657V241.074V241.491V241.91V242.328V242.748V243.168V243.588V244.009V244.431V244.853V245.276V245.7V246.124V246.548V246.974V247.399V247.826V248.253V248.68V249.108V249.536V249.966V250.395V250.825V251.256V251.687V252.119V252.551V252.984V253.417V253.851V254.285V254.72V255.155V255.59V256.027V256.463V256.9V257.338V257.776V258.214V258.653V259.093V259.533V259.973V260.413V260.855V261.296V261.738V262.181V262.623V263.067V263.51V263.954V264.399V264.843V265.289V265.734V266.18V266.627V267.073V267.52V267.968V268.416V268.864V269.312V269.761V270.21V270.66V271.11V271.56V272.01V272.461V272.912V273.364V273.816V274.268V274.268V274.72V275.173V275.626V276.079V276.532V276.986V277.44V277.895V278.349V278.804V279.259V279.715V280.17V280.626V281.082V281.539V281.995V282.452V282.909V283.366V283.824V284.281V284.739V285.197V285.655V286.114V286.572V287.031V287.49V287.949V288.409V288.868V289.328V289.788V290.247V290.708V291.168V291.628V292.089V292.549V293.01V293.471V293.932V294.393V294.854V295.316V295.777V296.239V296.7V297.162V297.624V298.086V298.548V299.01V299.472V299.934V300.396V300.859V301.321V301.783V302.246V302.708V303.171V303.633V304.096V304.558V305.021V305.483V305.946V306.409V306.871V307.334V307.796V308.259V308.721V309.184V309.646V310.109V310.571V311.034V311.496V311.958V312.421V312.883V313.345V313.807V314.269V314.731V315.193V315.654V316.116V316.577V317.039V317.5V317.962V318.423V318.884V319.345V319.805V320.266V320.727V321.187V321.647V322.107V322.567V323.027V323.487V323.946V324.406V324.865V325.324V325.783V326.241V326.7V327.158V327.616V328.074V328.531V328.989V329.446V329.903V330.36V330.816V331.273V331.729V332.185V332.64V333.096V333.551V334.006V334.46V334.915V335.369V335.823V336.276V336.729V337.182V337.635V338.087V338.539V338.991V339.443V339.894V340.345V340.795V341.245V341.695V342.145V342.594V343.043V343.491V343.94V344.387V344.835V345.282V345.729V346.175V346.621V347.067V347.512V347.957V348.401V348.845V349.289V349.732V350.175V350.617V351.059V351.501V351.942V352.383V352.823V353.263V353.702V354.141V354.58V355.018V355.455V355.893V356.329V356.765V357.201V357.636V358.071V358.505V358.939V359.372V359.805V360.237V360.669V361.1V361.531V361.961V362.39V362.82V363.248V363.676V364.104V364.53V364.957V365.383V365.808V366.232V366.657V367.08V367.503V367.925V368.347V368.768V369.189V369.609V370.028V370.447V370.865V371.282V371.699V372.116V372.531V372.946V373.361V373.774V374.187V374.6V375.011V375.422V375.833V376.243V376.652V377.06V377.468V377.875V378.281V378.687V379.092V379.496V379.899V380.302V380.704V381.105V381.506V381.906V382.305V382.704V383.101V383.498V383.894V384.29V384.684V385.078V385.471V385.864V386.255V386.646V387.036V387.425V387.814V388.201V388.588V388.974V389.359V389.743V390.127V390.51V390.892V391.273V391.653V392.032V392.411V392.788V393.165V393.541V393.916V394.29V394.664V395.036V395.408V395.779V396.148V396.517V396.885V397.252V397.619V397.984V398.348V398.712V399.074V399.436V399.797V400.156V400.515V400.873V401.23V401.586V401.941V402.295V402.648V403V403.351V403.701V404.05V404.398V404.746V405.092V405.437V405.781V406.124V406.466V406.807V407.148V407.487V407.825V408.162V408.498V408.832V409.166V409.499V409.831V410.162V410.491V410.82V411.147V411.474V411.799V412.123V412.446V412.768V413.089V413.409V413.728V414.045V414.362V414.677V414.992V415.305V415.617V415.928V416.237V416.546V416.853V417.159V417.465V417.768V418.071V418.373V418.673V418.972V419.27V419.567V419.863V420.157V420.451V420.743V421.034V421.323V421.612V421.899V422.185V422.469V422.753V423.035V423.316V423.596V423.874V424.151V424.427V424.702V424.975V425.248V425.518V425.788V426.056V426.323V426.589V426.853V427.116V427.378V427.639V427.898V428.156V428.412V428.667V428.921V429.174V429.425V429.675V429.923V430.17V430.416V430.66V430.903V431.145V431.385V431.624V431.861V432.097V432.332V432.565V432.797V433.028V433.257V433.484V433.71V433.935V434.159V434.38V434.601V434.82V435.037V435.254V435.468V435.681V435.893V436.103V436.312V436.52C311 443.574 306.084 449.668 299.189 451.168L157.574 481.977L12.8723 451.126C5.94809 449.65 1 443.546 1 436.468L1 232.458L1 29.0484Z";

function PlayerProfileCard({ player }) {
  const seed = player.name.length;
  // Compute realistic rating
  const rating = player.position === "Goalkeeper"
    ? 78 + (player.caps % 18)
    : 78 + ((player.goals * 3 + player.caps) % 20);
    
  // Position label
  const posLabel = player.position === "Goalkeeper" ? "GK" : (player.position === "Defender" ? "CB" : (player.position === "Midfielder" ? "CM" : "ST"));
  
  // OUTFIELD Stats
  const pac = 65 + (seed % 30);
  const sho = player.position === 'Forward' ? 78 + (player.goals % 18) : 50 + (player.goals % 30);
  const pas = 70 + (seed % 25);
  const dri = 72 + (seed % 24);
  const def = player.position === 'Defender' ? 78 + (seed % 18) : 40 + (seed % 30);
  const phy = 65 + (seed % 30);
  
  // GOALKEEPER Stats
  const div = 80 + (seed % 18);
  const han = 75 + (seed % 20);
  const kic = 70 + (seed % 25);
  const ref = 82 + (seed % 15);
  const spd = 50 + (seed % 30);
  const pos_stat = 78 + (seed % 18);

  const isGK = player.position === "Goalkeeper";

  const imgUrl = player.image || getPlayerImageUrl(player.name, player.country);

  return (
    <div className="player-fut-card-wrapper" style={{
      width: 312,
      height: 483,
      position: 'relative',
      userSelect: 'none',
      transition: 'transform 0.3s ease, filter 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)';
      e.currentTarget.style.filter = 'drop-shadow(0 12px 30px rgba(0,255,255,0.25))';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1) translateY(0)';
      e.currentTarget.style.filter = 'none';
    }}
    >
      <svg width="312" height="483" viewBox="0 0 312 483" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="futCardBg" x1="0" y1="0" x2="312" y2="483" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(20, 24, 33, 0.95)" />
            <stop offset="50%" stopColor="rgba(10, 12, 18, 0.98)" />
            <stop offset="100%" stopColor="rgba(5, 6, 8, 0.96)" />
          </linearGradient>
          <linearGradient id="futCardBorder" x1="0" y1="0" x2="312" y2="483" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--neon-cyan)" />
            <stop offset="35%" stopColor="var(--neon-purple)" />
            <stop offset="70%" stopColor="var(--neon-orange)" />
            <stop offset="100%" stopColor="var(--neon-red)" />
          </linearGradient>
        </defs>
        
        {/* Glow Shadow Outline */}
        <path d={FUT_CARD_PATH} fill="url(#futCardBg)" stroke="url(#futCardBorder)" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.15))' }} />
        
        {/* Fut card divider lines */}
        <line x1="30" y1="290" x2="282" y2="290" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <line x1="30" y1="340" x2="282" y2="340" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        <line x1="156" y1="345" x2="156" y2="425" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      </svg>
      
      {/* HTML elements on top using absolute positioning */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 312,
        height: 483,
        pointerEvents: 'none',
        fontFamily: 'var(--font-display)',
        color: '#fff'
      }}>
        {/* Left Side: Rating, Position, Flag, Chemistry/Foot */}
        <div style={{ position: 'absolute', top: 40, left: 35, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 44, fontWeight: 900, fontFamily: 'var(--font-display)', letterSpacing: -1, background: 'linear-gradient(to bottom, #ffffff, #8b9bb4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{rating}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{posLabel}</span>
          
          <div style={{ width: 32, height: 1.5, background: 'rgba(255,255,255,0.15)', margin: '4px 0' }} />
          
          <span style={{ fontSize: 24, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} title={player.country}>{player.flag || "🏳️"}</span>
          
          <span style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--neon-cyan)', marginTop: 4 }}>CHEM</span>
          <div style={{ display: 'flex', gap: 2 }}>
            <i className="fa-solid fa-star" style={{ fontSize: 7, color: 'var(--neon-orange)' }} />
            <i className="fa-solid fa-star" style={{ fontSize: 7, color: 'var(--neon-orange)' }} />
            <i className="fa-solid fa-star" style={{ fontSize: 7, color: 'var(--neon-orange)' }} />
          </div>
        </div>

        {/* Right Side: Player Photo inside clipped ellipse */}
        <div style={{
          position: 'absolute',
          top: 30,
          right: 32,
          width: 140,
          height: 175,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 80%)'
        }}>
          {imgUrl ? (
            <img src={imgUrl} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
              <FootballJerseySVG countryName={player.country} number={player.position === "Goalkeeper" ? "1" : "10"} />
            </div>
          )}
        </div>

        {/* Player Name */}
        <div style={{
          position: 'absolute',
          top: 240,
          left: 30,
          right: 30,
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: 18,
            fontWeight: 800,
            margin: 0,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: '#fff',
            textShadow: '0 0 10px rgba(255,255,255,0.1)'
          }}>{player.name.split(' ').length > 2 ? player.name.split(' ').slice(0, 2).join(' ') : player.name}</h3>
          
          <span style={{
            fontSize: 9,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginTop: 2,
            display: 'block'
          }}>
            {player.club} • {player.league}
          </span>
        </div>

        {/* Player Stats Section */}
        {isGK ? (
          /* Goalkeeper Stats */
          <div style={{
            position: 'absolute',
            top: 298,
            left: 36,
            right: 36,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 16,
            rowGap: 6,
            fontSize: 13,
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>DIV</span>
              <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>{div}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>REF</span>
              <span style={{ color: 'var(--neon-purple)', fontFamily: 'var(--font-mono)' }}>{ref}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>HAN</span>
              <span style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>{han}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>SPD</span>
              <span style={{ color: 'var(--neon-orange)', fontFamily: 'var(--font-mono)' }}>{spd}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>KIC</span>
              <span style={{ color: 'var(--neon-red)', fontFamily: 'var(--font-mono)' }}>{kic}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>POS</span>
              <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>{pos_stat}</span>
            </div>
          </div>
        ) : (
          /* Outfield Stats */
          <div style={{
            position: 'absolute',
            top: 298,
            left: 36,
            right: 36,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: 16,
            rowGap: 6,
            fontSize: 13,
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>PAC</span>
              <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>{pac}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>DRI</span>
              <span style={{ color: 'var(--neon-purple)', fontFamily: 'var(--font-mono)' }}>{dri}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>SHO</span>
              <span style={{ color: 'var(--neon-red)', fontFamily: 'var(--font-mono)' }}>{sho}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 2 }}>
              <span style={{ color: 'var(--text-muted)' }}>DEF</span>
              <span style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>{def}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>PAS</span>
              <span style={{ color: 'var(--neon-orange)', fontFamily: 'var(--font-mono)' }}>{pas}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>PHY</span>
              <span style={{ color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>{phy}</span>
            </div>
          </div>
        )}

        {/* Bottom Details Section (Bio & Value) */}
        <div style={{
          position: 'absolute',
          top: 352,
          left: 36,
          right: 36,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>HEIGHT</span>
            <strong style={{ fontSize: 11, color: 'var(--text-primary)' }}>{player.height}</strong>
          </div>
          <div>
            <span style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>WEIGHT</span>
            <strong style={{ fontSize: 11, color: 'var(--text-primary)' }}>{player.weight}</strong>
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>AGE</span>
            <strong style={{ fontSize: 11, color: 'var(--text-primary)' }}>{player.age} yrs</strong>
          </div>
          <div style={{ marginTop: 4 }}>
            <span style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block' }}>VALUATION</span>
            <strong style={{ fontSize: 11, color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>{player.marketValue || "$25M"}</strong>
          </div>
        </div>

        {/* Stats Summary at the very bottom */}
        <div style={{
          position: 'absolute',
          bottom: 42,
          left: 30,
          right: 30,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          fontSize: 10,
          fontWeight: 800,
          color: 'var(--text-secondary)'
        }}>
          <span>{player.caps} CAPS</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>{player.goals} INTL GOALS</span>
        </div>
      </div>
    </div>
  );
}

export default function SpectatorHub({ _locale = 'en' }) {
  const [filter, setFilter] = useState('all');
  const [playerSearch, setPlayerSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedPlayerModal, setSelectedPlayerModal] = useState(null);
  const [newsFeed, setNewsFeed] = useState(NEWS_ITEMS);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const fetchNews = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/news", { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          setNewsFeed(data);
        }
      } catch (err) {
        console.warn("FastAPI offline, using static news data:", err.message);
      } finally {
        clearTimeout(timeoutId);
      }
    };
    fetchNews();
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const allTeams = [...QUALIFIED_TEAMS];
  const activeTeams = allTeams.filter(t => t.nextMatch !== null);
  const eliminatedTeams = allTeams.filter(t => t.nextMatch === null);

  let displayTeams = allTeams;
  if (filter === 'active') displayTeams = activeTeams;
  if (filter === 'eliminated') displayTeams = eliminatedTeams;
  if (filter === 'hosts') displayTeams = [];

  const searchResults = useMemo(() => {
    if (!playerSearch.trim()) return [];
    const q = playerSearch.toLowerCase().trim();
    return PLAYER_DATABASE.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q)
    ).slice(0, 36);
  }, [playerSearch]);

  // Render country detail view
  if (selectedCountry) {
    const squad = getSquadForCountry(selectedCountry.name);
    const stats = getTeamStats(selectedCountry.name);
    const leaders = getPlayerLeaderboard(selectedCountry.name);
    const localNews = getCountryNews(selectedCountry.name);

    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => {
            setSelectedCountry(null);
            setSelectedPlayerModal(null);
          }}
          className="subtab-btn active"
          style={{ width: 'fit-content', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 14px', borderRadius: 6 }}
        >
          <i className="fa-solid fa-arrow-left" /> Back to Countries List
        </button>

        {/* Selected Country Header */}
        <div className="flat-panel" style={{
          display: 'flex', gap: 16, padding: 16, alignItems: 'center',
          position: 'relative', overflow: 'visible', flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08))'
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
            backgroundImage: `url(/flags/${selectedCountry.code.toLowerCase()}.png)`,
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            opacity: 0.20, pointerEvents: 'none',
            maskImage: 'linear-gradient(to top, transparent, rgba(0,0,0,1))',
            WebkitMaskImage: 'linear-gradient(to top, transparent, rgba(0,0,0,1))',
            borderRadius: 12,
            zIndex: 0
          }} />
          <span style={{ fontSize: 56, position: 'relative', zIndex: 1 }}>{selectedCountry.flag}</span>
          <div style={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 200 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {selectedCountry.name} ({selectedCountry.code})
            </h2>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Tournament Stage: <strong style={{ color: getStageColor(selectedCountry.stage) }}>{selectedCountry.stage}</strong>
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', zIndex: 1 }}>
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px', minWidth: 120, textAlign: 'center' }}>
              <span style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 2 }}>LAST MATCH</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{selectedCountry.lastMatch?.score || "N/A"}</strong>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>vs {selectedCountry.lastMatch?.opponent}</span>
            </div>
            {selectedCountry.nextMatch ? (
              <div style={{ background: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.2)', borderRadius: 8, padding: '8px 12px', minWidth: 120, textAlign: 'center' }}>
                <span style={{ fontSize: 8, color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 2 }}>NEXT KICKOFF</span>
                <strong style={{ fontSize: 12, color: 'var(--text-primary)' }}>{selectedCountry.nextMatch.date}</strong>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)', display: 'block', marginTop: 2 }}>vs {selectedCountry.nextMatch.opponent}</span>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '8px 12px', minWidth: 120, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'bold' }}>ELIMINATED</span>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column layout for News, Team Stats, and Player Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left Column: News and Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Country-Specific News */}
            <div className="flat-panel" style={{ padding: 16 }}>
              <div className="card-title" style={{ marginBottom: 12 }}>
                <span><i className="fa-solid fa-newspaper" style={{ marginRight: 6, color: 'var(--neon-red)' }} /> Related News & Bulletins</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {localNews.map(news => (
                  <div key={news.id} style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                    borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center',
                    borderLeft: `4px solid ${news.color}`
                  }}>
                    <span style={{ fontSize: 8, color: news.color, background: `${news.color}15`, border: `1px solid ${news.color}30`, padding: '2px 4px', borderRadius: 4, fontWeight: 'bold' }}>{news.tag}</span>
                    <p style={{ flex: 1, fontSize: 11, color: 'var(--text-primary)', margin: 0 }}>{news.headline}</p>
                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{news.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Stats Dashboard */}
            <div className="flat-panel" style={{ padding: 16 }}>
              <div className="card-title" style={{ marginBottom: 12 }}>
                <span><i className="fa-solid fa-chart-line" style={{ marginRight: 6, color: 'var(--neon-orange)' }} /> Tournament Team Stats</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                {stats.map(group => (
                  <div key={group.group}>
                    <span style={{ fontSize: 10, fontWeight: 'bold', color: 'var(--neon-purple)', display: 'block', marginBottom: 6, borderBottom: '1px solid var(--border-color)', paddingBottom: 2, fontFamily: 'var(--font-mono)' }}>{group.group}</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {group.stats.map(s => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '6px 10px', borderRadius: 6, fontSize: 10 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{s.val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Player Tournament Leaders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="flat-panel" style={{ padding: 16, height: '100%' }}>
              <div className="card-title" style={{ marginBottom: 12 }}>
                <span><i className="fa-solid fa-medal" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> Player Stats Leaderboard</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {leaders.map(p => {
                  return (
                    <div 
                      key={p.name} 
                      onClick={() => setSelectedPlayerModal({ name: p.name, country: selectedCountry.name, flag: selectedCountry.flag, code: selectedCountry.code, position: p.role || 'Forward', club: 'National Squad', caps: 35, goals: 12 })}
                      style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 10, cursor: 'pointer', transition: 'all 0.2s ease' }}
                      title="Click to view full player profile card"
                    >
                      <PlayerAvatar name={p.name} country={selectedCountry.name} size={52} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</strong>
                          <span style={{ fontSize: 9, background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: 4, color: 'var(--neon-green)', fontWeight: 'bold' }}>{p.val}</span>
                        </div>
                        <span style={{ display: 'block', fontSize: 10, color: 'var(--neon-cyan)', fontWeight: 'bold', marginTop: 2 }}>{p.role}</span>
                        <p style={{ margin: '3px 0 0 0', fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{p.details}</p>
                        <span style={{ fontSize: 8, color: 'var(--neon-cyan)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontWeight: '600' }}>
                          <i className="fa-solid fa-address-card" /> Click to view full player profile card
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Squad Hierarchy Family Tree Chart */}
        <SquadTreeChart countryName={selectedCountry.name} flag={selectedCountry.flag} squad={squad} />

        {/* Squad list header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <i className="fa-solid fa-users" style={{ color: 'var(--neon-cyan)', fontSize: 18 }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Official Squad List ({squad.length} Players)
          </h3>
        </div>

        {/* Squad list grid - Rendering exact same FUT PlayerProfileCard UI as search results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(312px, 1fr))', gap: 16, justifyItems: 'center' }}>
          {squad.map(player => (
            <PlayerProfileCard 
              key={player.name}
              player={{
                name: player.name,
                country: selectedCountry.name,
                flag: selectedCountry.flag,
                code: selectedCountry.code,
                position: player.position,
                club: player.club,
                caps: player.caps,
                goals: player.goals,
                age: player.age
              }}
            />
          ))}
        </div>
        <div style={{ height: 60 }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, height: '100%', overflowY: 'auto' }}>

      {/* Player Search Bar */}
      <div className="flat-panel" style={{ padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <i className="fa-solid fa-magnifying-glass" style={{ color: 'var(--neon-cyan)', fontSize: 16 }} />
        <input
          type="text"
          placeholder="Search players by name or country (e.g. Jimenez, Argentina, Messi...)"
          value={playerSearch}
          onChange={(e) => setPlayerSearch(e.target.value)}
          style={{
            flex: 1, padding: '8px 12px', background: 'var(--bg-input)',
            border: '1px solid var(--border-input)', borderRadius: 6,
            color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none',
          }}
        />
        {playerSearch && (
          <button onClick={() => setPlayerSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14 }}>
            <i className="fa-solid fa-xmark" />
          </button>
        )}
      </div>

      {/* Player Search Results */}
      {searchResults.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-id-card" style={{ color: 'var(--neon-cyan)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Player Profiles ({searchResults.length})</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(312px, 1fr))', gap: 16, justifyItems: 'center' }}>
            {searchResults.map(player => (
              <PlayerProfileCard key={player.name} player={player} />
            ))}
          </div>
        </div>
      )}

      {/* Main Countries Tab view */}
      <div className="history-subtabs-row" style={{ display: 'flex', gap: 10 }}>
        <button className={`subtab-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} style={{ color: 'var(--text-primary)' }}>
          All Participating Teams ({allTeams.length})
        </button>
        <button className={`subtab-btn ${filter === 'hosts' ? 'active' : ''}`} onClick={() => setFilter('hosts')} style={{ color: 'var(--text-primary)' }}>
          <i className="fa-solid fa-star" style={{ marginRight: 6, color: 'var(--neon-orange)' }} /> Host Countries (3)
        </button>
        <button className={`subtab-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')} style={{ color: 'var(--text-primary)' }}>
          <i className="fa-solid fa-circle-play" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> Still Active ({activeTeams.length})
        </button>
        <button className={`subtab-btn ${filter === 'eliminated' ? 'active' : ''}`} onClick={() => setFilter('eliminated')} style={{ color: 'var(--text-primary)' }}>
          <i className="fa-solid fa-circle-xmark" style={{ marginRight: 6, color: 'var(--neon-red)' }} /> Eliminated ({eliminatedTeams.length})
        </button>
      </div>

      {/* Host Countries Section */}
      {(filter === 'all' || filter === 'hosts') && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-star" style={{ color: 'var(--neon-orange)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Host Countries</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {HOST_COUNTRIES.map(team => (
              <TeamCard key={team.code} team={team} isHost={true} onClick={() => setSelectedCountry(team)} />
            ))}
          </div>
        </>
      )}

      {/* Latest FIFA 2026 News Section */}
      {(filter === 'all' || filter === 'hosts') && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <i className="fa-solid fa-newspaper" style={{ color: 'var(--neon-red)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Latest FIFA World Cup 2026 News</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {newsFeed.map(news => (
              <div key={news.id} className="team-tournament-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'center',
                borderLeft: `4px solid ${news.color}`,
                boxShadow: 'var(--glass-shadow)',
              }}>
                <span style={{
                  fontSize: 8, fontWeight: 'bold', fontFamily: 'var(--font-mono)',
                  color: news.color, background: `${news.color}15`, border: `1px solid ${news.color}30`,
                  padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap',
                }}>{news.tag}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>{news.headline}</p>
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{news.date}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Qualified Teams Section */}
      {filter !== 'hosts' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <i className="fa-solid fa-circle-play" style={{ color: 'var(--neon-green)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Tournament Participating Countries</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {displayTeams.map(team => (
              <TeamCard key={team.code} team={team} isHost={false} onClick={() => setSelectedCountry(team)} />
            ))}
          </div>
        </>
      )}

      <div style={{ height: 60 }} />

      {/* Interactive Modal View for Official Squad List Player FUT Card */}
      {selectedPlayerModal && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.82)', backdropFilter: 'blur(8px)',
            zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }}
          onClick={() => setSelectedPlayerModal(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <button
              onClick={() => setSelectedPlayerModal(null)}
              style={{
                position: 'absolute', top: -45, right: 0,
                background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                transition: 'background 0.2s'
              }}
              title="Close Profile Modal"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <PlayerProfileCard player={selectedPlayerModal} />
          </div>
        </div>
      )}
    </div>
  );
}
