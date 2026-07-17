// src/components/TournamentCenter.jsx - Interactive FIFA 2026 Tournament & Match Centre
import React, { useState, useEffect, useMemo } from 'react';
import { FIFA_WORLD_CUP_HISTORY } from '../data/world_cup_history';
import { PlayerAvatar } from '../utils/playerImageHelper';

// 1. Data Tables
const GROUP_STANDINGS = {
  A: [
    { team: "USA", played: 3, win: 2, draw: 1, loss: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ["W", "D", "W"] },
    { team: "Mexico", played: 3, win: 2, draw: 0, loss: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: ["W", "L", "W"] },
    { team: "Ecuador", played: 3, win: 1, draw: 1, loss: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["D", "W", "L"] },
    { team: "Bolivia", played: 3, win: 0, draw: 0, loss: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] }
  ],
  B: [
    { team: "England", played: 3, win: 3, draw: 0, loss: 0, gf: 8, ga: 1, gd: 7, pts: 9, form: ["W", "W", "W"] },
    { team: "Iran", played: 3, win: 0, draw: 3, loss: 0, gf: 3, ga: 3, gd: 0, pts: 3, form: ["D", "D", "D"] },
    { team: "Belgium", played: 3, win: 1, draw: 1, loss: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["W", "D", "L"] },
    { team: "New Zealand", played: 3, win: 0, draw: 2, loss: 1, gf: 2, ga: 5, gd: -3, pts: 2, form: ["D", "D", "L"] }
  ],
  C: [
    { team: "Argentina", played: 3, win: 2, draw: 1, loss: 0, gf: 7, ga: 2, gd: 5, pts: 7, form: ["W", "D", "W"] },
    { team: "Poland", played: 3, win: 1, draw: 1, loss: 1, gf: 3, ga: 4, gd: -1, pts: 4, form: ["L", "W", "D"] },
    { team: "Saudi Arabia", played: 3, win: 1, draw: 0, loss: 2, gf: 2, ga: 5, gd: -3, pts: 3, form: ["W", "L", "L"] },
    { team: "Senegal", played: 3, win: 0, draw: 2, loss: 1, gf: 2, ga: 3, gd: -1, pts: 2, form: ["D", "D", "L"] }
  ],
  D: [
    { team: "France", played: 3, win: 2, draw: 1, loss: 0, gf: 6, ga: 1, gd: 5, pts: 7, form: ["W", "W", "D"] },
    { team: "Denmark", played: 3, win: 1, draw: 2, loss: 0, gf: 4, ga: 3, gd: 1, pts: 5, form: ["D", "W", "D"] },
    { team: "Tunisia", played: 3, win: 1, draw: 0, loss: 2, gf: 2, ga: 5, gd: -3, pts: 3, form: ["L", "L", "W"] },
    { team: "Australia", played: 3, win: 0, draw: 1, loss: 2, gf: 1, ga: 4, gd: -3, pts: 1, form: ["L", "D", "L"] }
  ],
  E: [
    { team: "Spain", played: 3, win: 2, draw: 1, loss: 0, gf: 8, ga: 2, gd: 6, pts: 7, form: ["W", "W", "D"] },
    { team: "Japan", played: 3, win: 2, draw: 0, loss: 1, gf: 5, ga: 4, gd: 1, pts: 6, form: ["W", "L", "W"] },
    { team: "Costa Rica", played: 3, win: 1, draw: 0, loss: 2, gf: 3, ga: 7, gd: -4, pts: 3, form: ["L", "W", "L"] },
    { team: "Germany", played: 3, win: 0, draw: 1, loss: 2, gf: 2, ga: 5, gd: -3, pts: 1, form: ["D", "L", "L"] }
  ],
  F: [
    { team: "Morocco", played: 3, win: 2, draw: 1, loss: 0, gf: 4, ga: 1, gd: 3, pts: 7, form: ["W", "D", "W"] },
    { team: "Croatia", played: 3, win: 1, draw: 2, loss: 0, gf: 3, ga: 2, gd: 1, pts: 5, form: ["D", "W", "D"] },
    { team: "Canada", played: 3, win: 1, draw: 1, loss: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["W", "D", "L"] },
    { team: "Morocco B", played: 3, win: 0, draw: 0, loss: 3, gf: 0, ga: 6, gd: -6, pts: 0, form: ["L", "L", "L"] }
  ]
};

const STADIUMS_INFO = [
  { name: "MetLife Stadium", city: "New York/New Jersey", capacity: 82500, games: 8, keyMatch: "FIFA World Cup 2026 Final", image: "metlife.png" },
  { name: "SoFi Stadium", city: "Los Angeles", capacity: 70240, games: 8, keyMatch: "USA Opening Match", image: "sofi.png" },
  { name: "Estadio Azteca", city: "Mexico City", capacity: 83264, games: 5, keyMatch: "Tournament Opening Match", image: "azteca.png" },
  { name: "BC Place", city: "Vancouver", capacity: 54500, games: 7, keyMatch: "Canada Opening Match", image: "bcplace.png" },
  { name: "AT&T Stadium", city: "Dallas", capacity: 92967, games: 9, keyMatch: "Semi-Final Match", image: "att.png" },
  { name: "Mercedes-Benz Stadium", city: "Atlanta", capacity: 71000, games: 8, keyMatch: "Semi-Final Match", image: "mercedes.png" },
  { name: "Hard Rock Stadium", city: "Miami", capacity: 64767, games: 7, keyMatch: "Quarter-Final / 3rd Place", image: "hardrock.png" },
  { name: "Gillette Stadium", city: "Boston", capacity: 65878, games: 7, keyMatch: "Quarter-Final Match", image: "gillette.png" }
];

const OFFICIALS_LIST = [
  { name: "Szymon Marciniak", country: "Poland", role: "Referee", matches: 4, rating: "4.9/5" },
  { name: "Daniele Orsato", country: "Italy", role: "Referee / VAR Coordinator", matches: 3, rating: "4.8/5" },
  { name: "César Arturo Ramos", country: "Mexico", role: "Referee", matches: 3, rating: "4.7/5" },
  { name: "Mustapha Ghorbal", country: "Algeria", role: "Referee", matches: 2, rating: "4.6/5" },
  { name: "Michael Oliver", country: "England", role: "VAR Official", matches: 5, rating: "4.8/5" }
];

const TEAM_PROFILES = {
  "Argentina": {
    "captain": "Jose Manuel LOPEZ",
    "representative": "Lionel SCALONI (Head Coach)",
    "association": "AFA",
    "ranking": 1,
    "nickname": "La Albiceleste",
    "history": "3-time World Cup Champions (1978, 1986, 2022)."
  },
  "Australia": {
    "captain": "Nishan VELUPILLAY",
    "representative": "Tony Popović (Head Coach)",
    "association": "Football Australia",
    "ranking": 24,
    "nickname": "Socceroos",
    "history": "Best finish: Round of 16 (2006, 2022)."
  },
  "Austria": {
    "captain": "Michael Gregoritsch",
    "representative": "Ralf RANGNICK (Head Coach)",
    "association": "ÖFB",
    "ranking": 22,
    "nickname": "Das Nationalteam",
    "history": "Best finish: 3rd Place (1954)."
  },
  "Belgium": {
    "captain": "Matias FERNANDEZ-PARDO",
    "representative": "Rudi Garcia (Head Coach)",
    "association": "RBFA",
    "ranking": 6,
    "nickname": "The Red Devils",
    "history": "Best finish: 3rd Place (2018)."
  },
  "Bosnia and Herzegovina": {
    "captain": "Esmir BAJRAKTAREVIC",
    "representative": "Sergej BARBAREZ (Head Coach)",
    "association": "NFSBIH",
    "ranking": 74,
    "nickname": "Dragons",
    "history": "Qualified in 2014."
  },
  "Brazil": {
    "captain": "GABRIEL MARTINELLI",
    "representative": "Carlo Ancelotti (Head Coach)",
    "association": "CBF",
    "ranking": 5,
    "nickname": "Seleção",
    "history": "5-time World Cup Champions (1958, 1962, 1970, 1994, 2002)."
  },
  "Canada": {
    "captain": "Jayden Nelson",
    "representative": "Jesse Alan Marsch (Head Coach)",
    "association": "Canada Soccer",
    "ranking": 40,
    "nickname": "Les Rouges",
    "history": "Qualified in 1986, 2022, and 2026."
  },
  "Cabo Verde": {
    "captain": "DAILON LIVRAMENTO",
    "representative": "Pedro Leitão Brito (Head Coach)",
    "association": "FCF",
    "ranking": 65,
    "nickname": "Blue Sharks",
    "history": "First-time qualification for World Cup 2026."
  },
  "Colombia": {
    "captain": "Jaminton CAMPAZ",
    "representative": "Néstor Gabriel Lorenzo (Head Coach)",
    "association": "FCF",
    "ranking": 9,
    "nickname": "Los Cafeteros",
    "history": "Best finish: Quarter-Finals (2014)."
  },
  "Congo DR": {
    "captain": "Cedric BAKAMBU",
    "representative": "Sébastien Desabre (Head Coach)",
    "association": "FECOFA",
    "ranking": 62,
    "nickname": "The Leopards",
    "history": "Qualified as Zaire in 1974."
  },
  "Côte d'Ivoire": {
    "captain": "Bazoumana TOURE",
    "representative": "Emerse FAE (Head Coach)",
    "association": "FIF",
    "ranking": 38,
    "nickname": "The Elephants",
    "history": "Qualified in 2006, 2010, 2014, 2026."
  },
  "Croatia": {
    "captain": "Igor MATANOVIC",
    "representative": "Zlatko Dalić (Head Coach)",
    "association": "HNS",
    "ranking": 12,
    "nickname": "Kockasti",
    "history": "Runners-up in 2018; 3rd Place in 1998, 2022."
  },
  "Curaçao": {
    "captain": "Gervane KASTANEER",
    "representative": "Dick ADVOCAAT (Head Coach)",
    "association": "FFK",
    "ranking": 86,
    "nickname": "La Familia Azul",
    "history": "First-time qualification for World Cup 2026."
  },
  "Czechia": {
    "captain": "Denis VISINSKY",
    "representative": "Miroslav KOUBEK (Head Coach)",
    "association": "FAČR",
    "ranking": 47,
    "nickname": "Our Team",
    "history": "Runners-up in 1934, 1962 (as Czechoslovakia)."
  },
  "Ecuador": {
    "captain": "Nilson ANGULO",
    "representative": "Andrés Beccacece (Head Coach)",
    "association": "FEF",
    "ranking": 30,
    "nickname": "La Tri",
    "history": "Best finish: Round of 16 (2006)."
  },
  "Egypt": {
    "captain": "OMAR MARMOUSH",
    "representative": "Hossam Hassan (Head Coach)",
    "association": "EFA",
    "ranking": 36,
    "nickname": "The Pharaohs",
    "history": "Qualified in 1934, 1990, 2018, 2026."
  },
  "England": {
    "captain": "Marcus RASHFORD",
    "representative": "Thomas Tuchel (Head Coach)",
    "association": "The FA",
    "ranking": 4,
    "nickname": "The Three Lions",
    "history": "1-time World Cup Champions (1966)."
  },
  "France": {
    "captain": "Jean-Philippe MATETA",
    "representative": "Didier Deschamps (Head Coach)",
    "association": "FFF",
    "ranking": 2,
    "nickname": "Les Bleus",
    "history": "2-time World Cup Champions (1998, 2018)."
  },
  "Germany": {
    "captain": "Maximilian BEIER",
    "representative": "Julian NAGELSMANN (Head Coach)",
    "association": "DFB",
    "ranking": 11,
    "nickname": "Die Mannschaft",
    "history": "4-time World Cup Champions (1954, 1974, 1990, 2014)."
  },
  "Ghana": {
    "captain": "Christopher Bonsu BAAH",
    "representative": "Carlos QUEIROZ (Head Coach)",
    "association": "GFA",
    "ranking": 64,
    "nickname": "Black Stars",
    "history": "Best finish: Quarter-Finals (2010)."
  },
  "Haiti": {
    "captain": "Frantzdy Pierrot",
    "representative": "Sebastien MIGNE (Head Coach)",
    "association": "FHF",
    "ranking": 85,
    "nickname": "Les Grenadiers",
    "history": "Qualified in 1974."
  },
  "IR Iran": {
    "captain": "Amirhossein Hosseinzadeh",
    "representative": "Amir Ghalenoei (Head Coach)",
    "association": "FFIRI",
    "ranking": 20,
    "nickname": "Team Melli",
    "history": "6 tournament qualifications."
  },
  "Iraq": {
    "captain": "AYMEN HUSSEIN",
    "representative": "Graham James Arnold (Head Coach)",
    "association": "IFA",
    "ranking": 55,
    "nickname": "Lions of Mesopotamia",
    "history": "Qualified in 1986."
  },
  "Japan": {
    "captain": "Kento SHIOGAI",
    "representative": "Hajime Moriyasu (Head Coach)",
    "association": "JFA",
    "ranking": 17,
    "nickname": "Samurai Blue",
    "history": "Round of 16 in 2002, 2010, 2018, 2022."
  },
  "Jordan": {
    "captain": "MAHMOUD ALMARDI",
    "representative": "Jamal SELLAMI (Head Coach)",
    "association": "JFA",
    "ranking": 68,
    "nickname": "The Chivalrous",
    "history": "First-time qualification for World Cup 2026."
  },
  "Korea Republic": {
    "captain": "LEE Donggyeong",
    "representative": "Myung-Bo Hong (Head Coach)",
    "association": "KFA",
    "ranking": 23,
    "nickname": "Taegeuk Warriors",
    "history": "Best finish: 4th Place (2002)."
  },
  "Morocco": {
    "captain": "Ayoube AMAIMOUNI",
    "representative": "Mohamed OUAHBI (Head Coach)",
    "association": "FRMF",
    "ranking": 14,
    "nickname": "Atlas Lions",
    "history": "Best finish: 4th Place (2022)."
  },
  "Mexico": {
    "captain": "Guillermo MARTINEZ",
    "representative": "Javier Aguirre (Head Coach)",
    "association": "FMF",
    "ranking": 15,
    "nickname": "El Tri",
    "history": "Quarter-Finals in 1970, 1986."
  },
  "Netherlands": {
    "captain": "Crysencio SUMMERVILLE",
    "representative": "Ronald KOEMAN (Head Coach)",
    "association": "KNVB",
    "ranking": 7,
    "nickname": "Oranje",
    "history": "Runners-up in 1974, 1978, 2010."
  },
  "New Zealand": {
    "captain": "Kosta BARBAROUSES",
    "representative": "Darren BAZELEY (Head Coach)",
    "association": "NZF",
    "ranking": 94,
    "nickname": "All Whites",
    "history": "Qualified in 1982, 2010."
  },
  "Norway": {
    "captain": "Jorgen STRAND LARSEN",
    "representative": "Ståle Solbakken (Head Coach)",
    "association": "NFF",
    "ranking": 44,
    "nickname": "Løvene",
    "history": "Best finish: Round of 16 (1998)."
  },
  "Panama": {
    "captain": "Cecilio Waterman",
    "representative": "Thomas Christiansen (Head Coach)",
    "association": "FEPAFUT",
    "ranking": 43,
    "nickname": "Los Canaleros",
    "history": "Qualified in 2018."
  },
  "Paraguay": {
    "captain": "Alejandro ROMERO GAMARRA",
    "representative": "Gustavo ALFARO (Head Coach)",
    "association": "APF",
    "ranking": 56,
    "nickname": "La Albirroja",
    "history": "Best finish: Quarter-Finals (2010)."
  },
  "Portugal": {
    "captain": "FRANCISCO CONCEICAO",
    "representative": "Roberto Martínez (Head Coach)",
    "association": "FPF",
    "ranking": 8,
    "nickname": "Seleção das Quinas",
    "history": "Best finish: 3rd Place (1966)."
  },
  "Qatar": {
    "captain": "TAHSIN MOHAMMED",
    "representative": "Julen Lopetegui (Head Coach)",
    "association": "QFA",
    "ranking": 35,
    "nickname": "The Maroons",
    "history": "Qualified as hosts in 2022."
  },
  "Saudi Arabia": {
    "captain": "ABDULLAH ALHAMDDAN",
    "representative": "Georgios DONIS (Head Coach)",
    "association": "SAFF",
    "ranking": 53,
    "nickname": "Green Falcons",
    "history": "Best finish: Round of 16 (1994)."
  },
  "Scotland": {
    "captain": "Lawrence SHANKLAND",
    "representative": "Steve Clarke (Head Coach)",
    "association": "SFA",
    "ranking": 39,
    "nickname": "The Tartan Army",
    "history": "8 tournament qualifications."
  },
  "Senegal": {
    "captain": "Ibrahim MBAYE",
    "representative": "Pape THIAW (Head Coach)",
    "association": "FSF",
    "ranking": 21,
    "nickname": "Lions of Teranga",
    "history": "Best finish: Quarter-Finals (2002)."
  },
  "South Africa": {
    "captain": "Kamogelo SEBELEBELE",
    "representative": "Hugo Broos (Head Coach)",
    "association": "SAFA",
    "ranking": 59,
    "nickname": "Bafana Bafana",
    "history": "Qualified in 1998, 2002, 2010."
  },
  "Spain": {
    "captain": "Borja IGLESIAS",
    "representative": "Luis de la Fuente (Head Coach)",
    "association": "RFEF",
    "ranking": 3,
    "nickname": "La Roja",
    "history": "1-time World Cup Champions (2010)."
  },
  "Sweden": {
    "captain": "Viktor GYOKERES",
    "representative": "Jon Dahl Tomasson (Head Coach)",
    "association": "SvFF",
    "ranking": 28,
    "nickname": "Blågult",
    "history": "Runners-up in 1958; 3rd Place in 1950, 1994."
  },
  "Switzerland": {
    "captain": "Christian FASSNACHT",
    "representative": "Murat Yakin (Head Coach)",
    "association": "SFV",
    "ranking": 19,
    "nickname": "La Nati",
    "history": "Best finish: Quarter-Finals (1934, 1938, 1954)."
  },
  "Tunisia": {
    "captain": "Sebastian TOUNEKTI",
    "representative": "Herve RENARD (Head Coach)",
    "association": "FTF",
    "ranking": 41,
    "nickname": "Eagles of Carthage",
    "history": "6 tournament qualifications."
  },
  "Türkiye": {
    "captain": "Baris Alper YILMAZ",
    "representative": "Vincenzo MONTELLA (Head Coach)",
    "association": "TFF",
    "ranking": 26,
    "nickname": "Bizim Çocuklar",
    "history": "Best finish: 3rd Place (2002)."
  },
  "USA": {
    "captain": "Folarin BALOGUN",
    "representative": "Mauricio POCHETTINO (Head Coach)",
    "association": "US Soccer",
    "ranking": 16,
    "nickname": "The Stars & Stripes",
    "history": "Best finish: 3rd Place (1930)."
  },
  "Uruguay": {
    "captain": "Juan Manuel SANABRIA",
    "representative": "Marcelo BIELSA (Head Coach)",
    "association": "AUF",
    "ranking": 11,
    "nickname": "La Celeste",
    "history": "2-time World Cup Champions (1930, 1950)."
  },
  "Uzbekistan": {
    "captain": "Abbosbek FAYZULLAEV",
    "representative": "Fabio CANNAVARO (Head Coach)",
    "association": "UFA",
    "ranking": 60,
    "nickname": "White Wolves",
    "history": "First-time qualification for World Cup 2026."
  }
};

export default function TournamentCenter({ _locale = 'en' }) {
  const [subTab, setSubTab] = useState('matches'); // matches, bracket, groups, teams, info, fan
  
  // Live Match Ticker State Simulation
  const [matchMinutes, setMatchMinutes] = useState(72);
  const [matchScore] = useState({ ARG: 2, FRA: 1 });
  const [liveCommentary, setLiveCommentary] = useState([
    { min: "71'", text: "Yellow card shown to Adrien Rabiot (France) for a late tactical challenge on Alexis Mac Allister." },
    { min: "68'", text: "SUBSTITUTION: Kingsley Coman replaces Antoine Griezmann for France to add raw pace on the wings." },
    { min: "65'", text: "Lionel Messi curls a corner kick into the box, but William Saliba rises high to clear the danger." },
    { min: "62'", text: "GOAL! Kylian Mbappé scores a sensational penalty after being fouled inside the area! France 1 - 2 Argentina." },
    { min: "58'", text: "Enzo Fernández fires a long-range rocket that grazes the crossbar! France is struggling in midfield transitions." }
  ]);
  const [newCommentaryText, setNewCommentaryText] = useState("");

  // Live Match ticker timer
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchMinutes(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 1;
      });
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Roster profiles list state
  const [activeProfileTeam, setActiveProfileTeam] = useState("Argentina");
  
  // 2026 Roster list
  const wc2026Players = useMemo(() => {
    const wc2026 = FIFA_WORLD_CUP_HISTORY.find(ed => ed.year === 2026);
    if (!wc2026) return [];
    return wc2026.legendPlayers;
  }, []);

  const activeRoster = useMemo(() => {
    return wc2026Players.filter(p => p.team === activeProfileTeam);
  }, [wc2026Players, activeProfileTeam]);

  const addCustomCommentary = (e) => {
    e.preventDefault();
    if (!newCommentaryText.trim()) return;
    setLiveCommentary(prev => [
      { min: `${matchMinutes}'`, text: newCommentaryText },
      ...prev
    ]);
    setNewCommentaryText("");
  };

  return (
    <div className="tournament-center-container" style={{ padding: 16, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Sub tabs navigation */}
      <div className="charts-subtabs-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10 }}>
        <button className={`subtab-btn ${subTab === 'matches' ? 'active' : ''}`} onClick={() => setSubTab('matches')}>
          <i className="fa-solid fa-circle-dot" style={{ color: 'var(--neon-red)', marginRight: 6 }} /> Match Centre
        </button>
        <button className={`subtab-btn ${subTab === 'bracket' ? 'active' : ''}`} onClick={() => setSubTab('bracket')}>
          <i className="fa-solid fa-sitemap" style={{ marginRight: 6 }} /> Bracket
        </button>
        <button className={`subtab-btn ${subTab === 'groups' ? 'active' : ''}`} onClick={() => setSubTab('groups')}>
          <i className="fa-solid fa-list-ol" style={{ marginRight: 6 }} /> Standings
        </button>
        <button className={`subtab-btn ${subTab === 'teams' ? 'active' : ''}`} onClick={() => setSubTab('teams')}>
          <i className="fa-solid fa-users" style={{ marginRight: 6 }} /> Team Profiles
        </button>
        <button className={`subtab-btn ${subTab === 'info' ? 'active' : ''}`} onClick={() => setSubTab('info')}>
          <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} /> Stadiums & Officials
        </button>
      </div>

      {/* RENDER CHOSEN SUBTAB */}
      {subTab === 'matches' && (
        <div className="hub-content-grid" style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: 16 }}>
          {/* Main Ticker Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Live score box */}
            <div className="glass-card live-match-score-hero" style={{ background: 'linear-gradient(135deg, rgba(10, 11, 14, 0.95), rgba(18, 20, 26, 0.95))', border: '1.5px solid var(--neon-red)', borderRadius: 12, padding: 20, position: 'relative' }}>
              <span className="live-view-indicator" style={{ position: 'absolute', top: 12, right: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span className="pulse-dot" style={{ background: 'var(--neon-red)' }} /> LIVE BROADCAST
              </span>

              <div className="match-hero-meta" style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                FIFA World Cup 2026 • Quarter-final • MetLife Stadium, NY/NJ
              </div>

              <div className="match-score-row" style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', justifyContent: 'space-around', margin: '20px 0' }}>
                <div className="team-score-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span className="team-flag-hero" style={{ fontSize: 32 }}>🇦🇷</span>
                  <strong style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>Argentina</strong>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Messi 18', Alvarez 42'</span>
                </div>

                <div className="score-ticker-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--neon-red)', textShadow: '0 0 10px rgba(255, 0, 85, 0.3)' }}>
                    {matchScore.ARG} - {matchScore.FRA}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text-secondary)', marginTop: 8, background: 'rgba(255, 255, 255, 0.05)', padding: '3px 10px', borderRadius: 12 }}>
                    {matchMinutes}'
                  </div>
                </div>

                <div className="team-score-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span className="team-flag-hero" style={{ fontSize: 32 }}>🇫🇷</span>
                  <strong style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>France</strong>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Mbappé 62' (P)</span>
                </div>
              </div>

              {/* Match stats progress */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8 }}>MATCH STATS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                      <span>POSSESSION</span>
                      <span>53% - 47%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '53%', background: 'var(--neon-cyan)', height: '100%' }} />
                      <div style={{ width: '47%', background: 'var(--neon-purple)', height: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                      <span>SHOTS ON TARGET</span>
                      <span>12 (6) - 9 (4)</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                      <div style={{ width: '60%', background: 'var(--neon-cyan)', height: '100%' }} />
                      <div style={{ width: '40%', background: 'var(--neon-purple)', height: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live commentary ticker list */}
            <div className="glass-card live-commentary-card">
              <div className="card-title">
                <span><i className="fa-solid fa-commentary" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> LIVE COMMENTARY FEED</span>
              </div>

              {/* Add custom commentary form (Fan reporting simulation) */}
              <form onSubmit={addCustomCommentary} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <input 
                  type="text"
                  placeholder="Simulate fan field commentary or reaction..."
                  value={newCommentaryText}
                  onChange={(e) => setNewCommentaryText(e.target.value)}
                  style={{ flex: 1, padding: 8, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: '#fff', fontSize: 11, outline: 'none' }}
                />
                <button type="submit" className="action-btn" style={{ padding: '8px 12px', fontSize: 11 }}>
                  Post Log
                </button>
              </form>

              <div className="commentary-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                {liveCommentary.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 8 }}>
                    <strong style={{ color: 'var(--neon-red)', fontFamily: 'var(--font-mono)', minWidth: 28 }}>{log.min}</strong>
                    <span style={{ color: 'var(--text-primary)' }}>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column match center: Fixtures schedule list */}
          <div className="glass-card fixtures-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-title">
              <span><i className="fa-solid fa-calendar-check" style={{ marginRight: 6, color: 'var(--neon-orange)' }} /> UPCOMING FIXTURES</span>
            </div>
            
            <div className="fixtures-list" style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', flex: 1 }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JULY 9, 2026 • SEMI-FINAL 2</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 3 }}>
                  <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England vs 🇪🇸 Spain</span>
                  <strong style={{ color: 'var(--neon-cyan)' }}>8:00 PM</strong>
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>AT&T Stadium, Dallas</span>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JULY 18, 2026 • 3RD PLACE PLAY-OFF</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 3 }}>
                  <span>TBD vs TBD</span>
                  <strong style={{ color: 'var(--text-secondary)' }}>4:00 PM</strong>
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Hard Rock Stadium, Miami</span>
              </div>

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 8 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JULY 19, 2026 • GRAND FINAL</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 3 }}>
                  <span>Winner SF1 vs Winner SF2</span>
                  <strong style={{ color: 'var(--neon-orange)' }}>8:00 PM</strong>
                </div>
                <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>MetLife Stadium, NY/NJ</span>
              </div>
            </div>

            {/* Ticket Hub Direct Link button */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <a 
                href="https://www.fifa.com/en/tickets" 
                target="_blank" 
                rel="noreferrer"
                className="action-btn"
                style={{ width: '100%', justifyContent: 'center', gap: 6, textDecoration: 'none', background: 'rgba(255, 153, 0, 0.08)', borderColor: 'var(--neon-orange)' }}
              >
                <i className="fa-solid fa-ticket" /> VISIT OFFICIAL FIFA TICKET PORTAL
              </a>
            </div>
          </div>
        </div>
      )}

      {subTab === 'bracket' && (
        <div className="glass-card bracket-card-view" style={{ overflowX: 'auto', padding: '20px 10px' }}>
          <div className="card-title">
            <span><i className="fa-solid fa-sitemap" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> INTERACTIVE KNOCKOUT BRACKET</span>
          </div>

          <div className="bracket-tree-wrapper" style={{ display: 'flex', gap: 20, minWidth: 700, justifyContent: 'space-between', padding: '10px 0' }}>
            
            {/* Quarters Column */}
            <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 20 }}>
              <div className="bracket-node" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: 6, width: 140 }}>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}><span>🇦🇷 Argentina</span> <strong>2 (4)</strong></div>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}><span>🇧🇷 Brazil</span> <strong>2 (2)</strong></div>
              </div>
              <div className="bracket-node" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: 6, width: 140 }}>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}><span>🇫🇷 France</span> <strong>1</strong></div>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}><span>🇲🇦 Morocco</span> <strong>0</strong></div>
              </div>
            </div>

            {/* Semis Column */}
            <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div className="bracket-node active" style={{ background: 'rgba(255,0,85,0.05)', border: '1.5px solid var(--neon-red)', padding: 10, borderRadius: 8, width: 150 }}>
                <div style={{ fontSize: 9, color: 'var(--neon-red)', fontWeight: 'bold', marginBottom: 4 }}>SEMI 1 • LIVE NOW</div>
                <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>🇦🇷 Argentina</span> <span>2</span></div>
                <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>🇫🇷 France</span> <span>1</span></div>
              </div>
            </div>

            {/* Final Match Node */}
            <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="bracket-node final" style={{ background: 'rgba(255,153,0,0.05)', border: '2px solid var(--neon-orange)', padding: 16, borderRadius: 10, width: 180, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--neon-orange)', fontWeight: 'bold', marginBottom: 6 }}><i className="fa-solid fa-trophy" /> GRAND FINAL</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>JULY 19 • NY/NJ</div>
                <div style={{ fontSize: 12, fontWeight: 'bold', marginTop: 8 }}>Winner Semi 1</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0' }}>vs</div>
                <div style={{ fontSize: 12, fontWeight: 'bold' }}>Winner Semi 2</div>
              </div>
            </div>

            {/* Semis Column 2 */}
            <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div className="bracket-node" style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.2)', padding: 10, borderRadius: 8, width: 150 }}>
                <div style={{ fontSize: 9, color: 'var(--neon-cyan)', fontWeight: 'bold', marginBottom: 4 }}>SEMI 2 • JULY 9</div>
                <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</span> <span>--</span></div>
                <div style={{ fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>🇪🇸 Spain</span> <span>--</span></div>
              </div>
            </div>

            {/* Quarters Column 2 */}
            <div className="bracket-column" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 20 }}>
              <div className="bracket-node" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: 6, width: 140 }}>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}><span>🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</span> <strong>3</strong></div>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}><span>🇩🇪 Germany</span> <strong>1</strong></div>
              </div>
              <div className="bracket-node" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: 6, width: 140 }}>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between' }}><span>🇪🇸 Spain</span> <strong>2</strong></div>
                <div style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}><span>🇨🇦 Canada</span> <strong>0</strong></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {subTab === 'groups' && (
        <div className="groups-standings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Object.entries(GROUP_STANDINGS).map(([groupName, teamsList]) => (
            <div key={groupName} className="glass-card group-table-card" style={{ padding: 12 }}>
              <div className="card-title" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 8, fontSize: 12 }}>
                <span>GROUP {groupName}</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ paddingBottom: 4 }}>Team</th>
                    <th style={{ paddingBottom: 4, textAlign: 'center' }}>P</th>
                    <th style={{ paddingBottom: 4, textAlign: 'center' }}>GD</th>
                    <th style={{ paddingBottom: 4, textAlign: 'center' }}>PTS</th>
                    <th style={{ paddingBottom: 4, textAlign: 'center' }}>Form</th>
                  </tr>
                </thead>
                <tbody>
                  {teamsList.map((tm, idx) => (
                    <tr key={tm.team} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', color: idx < 2 ? '#fff' : 'var(--text-secondary)' }}>
                      <td style={{ padding: '6px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: 9 }}>{idx+1}</span>
                        <span>{tm.team}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>{tm.played}</td>
                      <td style={{ textAlign: 'center', color: tm.gd > 0 ? 'var(--neon-green)' : tm.gd < 0 ? 'var(--neon-red)' : 'inherit' }}>
                        {tm.gd > 0 ? `+${tm.gd}` : tm.gd}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{tm.pts}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          {tm.form.map((f, fIdx) => (
                            <span key={fIdx} style={{ fontSize: 8, padding: '1px 3px', borderRadius: 2, background: f === 'W' ? 'rgba(0, 255, 102, 0.15)' : f === 'L' ? 'rgba(255, 0, 85, 0.15)' : 'rgba(255, 255, 255, 0.08)', color: f === 'W' ? 'var(--neon-green)' : f === 'L' ? 'var(--neon-red)' : 'var(--text-secondary)' }}>
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {subTab === 'teams' && (
        <div className="hub-content-grid" style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: 16 }}>
          {/* List of countries */}
          <div className="glass-card countries-picker-card" style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
            <div className="card-title">SELECT NATION</div>
            {Object.keys(TEAM_PROFILES).map((country) => (
              <button 
                key={country}
                onClick={() => setActiveProfileTeam(country)}
                className={`sidebar-nav-btn ${activeProfileTeam === country ? 'active' : ''}`}
                style={{ justifyContent: 'space-between', padding: '8px 12px' }}
              >
                <span>{country}</span>
                <i className="fa-solid fa-angle-right" />
              </button>
            ))}
          </div>

          {/* Roster profiles profile detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card team-detail-profile">
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10, marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>{activeProfileTeam}</h2>
                  <span style={{ fontSize: 11, color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)' }}>
                    NICKNAME: {TEAM_PROFILES[activeProfileTeam]?.nickname || "None"}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>FIFA RANKING</span>
                  <strong style={{ display: 'block', color: 'var(--neon-orange)', fontSize: 18 }}>#{TEAM_PROFILES[activeProfileTeam]?.ranking}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 12, marginBottom: 12 }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>CAPTAIN</span>
                  <strong style={{ display: 'block', color: '#fff', fontSize: 13 }}>{TEAM_PROFILES[activeProfileTeam]?.captain}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>REPRESENTATIVE (COACH)</span>
                  <strong style={{ display: 'block', color: '#fff', fontSize: 13 }}>{TEAM_PROFILES[activeProfileTeam]?.representative}</strong>
                </div>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>History:</strong> {TEAM_PROFILES[activeProfileTeam]?.history}
              </p>
            </div>

            {/* Roster squad details with CSS silhouettes */}
            <div className="glass-card roster-squad-card">
              <div className="card-title">
                <span>{activeProfileTeam} 2026 SQUAD LIST</span>
                <span className="player-count-badge">{activeRoster.length} Players Registered</span>
              </div>

              <div className="squad-list-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                {activeRoster.map((player) => (
                  <div key={player.name} className="player-profile-card" style={{ padding: 8 }}>
                    <PlayerAvatar name={player.name} country={activeProfileTeam} size={44} />
                    <div className="player-info" style={{ gap: 2 }}>
                      <div className="player-name" style={{ fontSize: 12 }}>{player.name}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {player.club} • {player.marketValue}
                      </div>
                      <div className="player-stats" style={{ fontSize: 9, margin: 0 }}>
                        <span><i className="fa-solid fa-shirt" style={{ marginRight: 2 }} /> {player.position}</span>
                        <span><i className="fa-solid fa-futbol" style={{ marginRight: 2 }} /> {player.goals} Goals</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'info' && (
        <div className="hub-content-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 16 }}>
          {/* Stadiums Breakdown */}
          <div className="glass-card host-stadiums-list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card-title">
              <span><i className="fa-solid fa-stadium" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> HOST VENUES & STADIUMS</span>
            </div>
            
            <div className="stadiums-grid-scroll" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {STADIUMS_INFO.map(std => (
                <div key={std.name} style={{ padding: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <strong style={{ fontSize: 13, display: 'block' }}>{std.name}</strong>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{std.city}</span>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                    Capacity: {std.capacity.toLocaleString()} • {std.games} Games
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--neon-cyan)', marginTop: 4, fontWeight: 'bold' }}>
                    Key Match: {std.keyMatch}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Match Officials & Referees */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="glass-card match-officials-card">
              <div className="card-title">
                <span><i className="fa-solid fa-whistle" style={{ marginRight: 6, color: 'var(--neon-orange)' }} /> MATCH OFFICIALS (REFEREES)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {OFFICIALS_LIST.map((ofc, idx) => (
                  <div key={idx} style={{ padding: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <div>
                      <strong style={{ display: 'block', color: '#fff' }}>{ofc.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{ofc.country} • {ofc.role}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--neon-orange)', fontWeight: 'bold' }}>{ofc.rating}</span>
                      <span style={{ display: 'block', fontSize: 9, color: 'var(--text-muted)' }}>{ofc.matches} Matches</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tie-breaker Rules & Regulations */}
            <div className="glass-card rules-card">
              <div className="card-title">
                <span><i className="fa-solid fa-scale-balanced" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> TIE-BREAKER REGULATIONS</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.4 }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 4 }}>
                  <strong>1. Greatest Points Difference:</strong> Total points gained across all group stage games.
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 4 }}>
                  <strong>2. Goal Difference:</strong> Difference in goals scored vs goals conceded in group stage.
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 4 }}>
                  <strong>3. Goals Scored:</strong> Total goals scored across all group stage games.
                </div>
                <div>
                  <strong>4. Fair Play Point Deductions:</strong> Yellow Card (-1 pt), Indirect Red (-3 pt), Direct Red (-4 pt).
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
