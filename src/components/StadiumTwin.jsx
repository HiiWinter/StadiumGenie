// src/components/StadiumTwin.jsx - Interactive Stadium Operations Digital Twin

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STADIUM_MANUAL } from '../data/stadium_manual';
import { callLiveGemini, simulateGemini } from '../utils/custom_gemini';
import { renderFrame, createParticles } from '../utils/canvasRenderer';
import { toCanvasCoords, hitTestEntities } from '../utils/hitTest';
import { CANVAS, LOG_ICONS } from '../utils/constants';

import { TRANSLATIONS } from '../data/translations';

// ── Helpers ──────────────────────────────────────────────

/** Deep-clone the manual layout so each reset starts fresh. */
const cloneLayout = () => JSON.parse(JSON.stringify(STADIUM_MANUAL.layout));

/** Icon element for a given log type. */
const LogIcon = ({ type }) => (
  <i className={LOG_ICONS[type] || LOG_ICONS.info} style={{ marginRight: 6 }} />
);

/** Tooltip type-to-icon mapping. */
const TOOLTIP_ICONS = {
  section:    'fa-solid fa-chair',
  concession: 'fa-solid fa-burger',
  gate:       'fa-solid fa-door-open',
};

const STADIUMS_DATA = [
  {
    key: "newyork",
    name: "MetLife Stadium (New York/New Jersey)",
    capacity: "82,500",
    location: "East Rutherford, NJ",
    image: "/stadiums/newyork.png",
    description: "Features premium multi-tiered seating. Selected to host the FIFA World Cup 2026 Final match on July 19, 2026. Equipped with advanced crowd management control sensors.",
    hostCountry: "United States",
    surface: "Grass (hybrid)",
    matches: "8 matches (including Final)"
  },
  {
    key: "dallas",
    name: "AT&T Stadium (Dallas Stadium)",
    capacity: "80,000 (expands to 105,000)",
    location: "Arlington, TX",
    image: "/stadiums/dallas.png",
    description: "Retractable roof stadium. Features the famous center-hung 175-foot video board. Known for its column-free structure and category-based color-coded seating sectors.",
    hostCountry: "United States",
    surface: "Grass",
    matches: "9 matches (including Semi-final)"
  },
  {
    key: "seattle",
    name: "Lumen Field (Seattle Stadium)",
    capacity: "68,740",
    location: "Seattle, WA",
    image: "/stadiums/seattle.png",
    description: "Open-air stadium with a unique horseshoe-shaped design. Famous for its roof canopy which reflects crowd noise back onto the pitch for an intense acoustic atmosphere.",
    hostCountry: "United States",
    surface: "Grass",
    matches: "6 matches (including Round of 32)"
  },
  {
    key: "losangeles",
    name: "SoFi Stadium (Los Angeles Stadium)",
    capacity: "70,240",
    location: "Inglewood, CA",
    image: "/stadiums/losangeles.png",
    description: "Features a translucent canopy roof and the colossal double-sided Infinity Screen by Samsung. Host of the opening match for the US Men's National Team.",
    hostCountry: "United States",
    surface: "Grass",
    matches: "8 matches (including Quarter-final)"
  },
  {
    key: "atlanta",
    name: "Mercedes-Benz Stadium (Atlanta Stadium)",
    capacity: "71,000",
    location: "Atlanta, GA",
    image: "/stadiums/atlanta.png",
    description: "State-of-the-art retractable pinwheel roof and a halo video board. LEED Platinum certified for sustainability. Color-coded ticket sectors mapped from Category 1 to 4.",
    hostCountry: "United States",
    surface: "Grass",
    matches: "8 matches (including Semi-final)"
  }
];

// ── Component ────────────────────────────────────────────

export default function StadiumTwin({ apiKey, locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;

  const [selectedStadiumKey, setSelectedStadiumKey] = useState("newyork");
  const [visualMode, setVisualMode] = useState("telemetry"); // "chart" (uploaded seating map) or "telemetry" (interactive sensors)
  const selectedStadium = STADIUMS_DATA.find(s => s.key === selectedStadiumKey) || STADIUMS_DATA[0];

  // Layout state (deep-cloned from manual so mutations don't leak)
  const [gates, setGates]             = useState(() => cloneLayout().gates);
  const [sections, setSections]       = useState(() => cloneLayout().sections);
  const [concessions, setConcessions] = useState(() => cloneLayout().concessions);
  const [restrooms, setRestrooms]     = useState(() => cloneLayout().restrooms);

  // Stadium-specific dynamic layouts generator
  const getLayoutForStadium = (stadiumKey) => {
    const baseLayout = cloneLayout();
    if (stadiumKey === 'newyork') {
      return baseLayout;
    }
    
    const cx = 400, cy = 300;
    
    if (stadiumKey === 'dallas') {
      baseLayout.sections = baseLayout.sections.map(s => {
        const dx = s.x - cx;
        const dy = s.y - cy;
        return { ...s, x: Math.round(cx + dx * 1.18), y: Math.round(cy + dy * 0.95) };
      });
      baseLayout.gates = baseLayout.gates.map(g => {
        const dx = g.x - cx;
        const dy = g.y - cy;
        return { ...g, x: Math.round(cx + dx * 1.18), y: Math.round(cy + dy * 0.95) };
      });
      baseLayout.concessions = baseLayout.concessions.map(c => {
        const dx = c.x - cx;
        const dy = c.y - cy;
        return { ...c, x: Math.round(cx + dx * 1.18), y: Math.round(cy + dy * 0.95) };
      });
      baseLayout.restrooms = baseLayout.restrooms.map(r => {
        const dx = r.x - cx;
        const dy = r.y - cy;
        return { ...r, x: Math.round(cx + dx * 1.18), y: Math.round(cy + dy * 0.95) };
      });
      return baseLayout;
    }
    
    if (stadiumKey === 'seattle') {
      baseLayout.sections = baseLayout.sections.filter(s => s.id !== 'Sec 101');
      baseLayout.gates = baseLayout.gates.filter(g => g.id !== 'Gate A');
      baseLayout.sections = baseLayout.sections.map(s => {
        let sx = s.x;
        let sy = s.y;
        if (sy < cy - 50) {
          if (sx < cx) sx -= 25;
          if (sx > cx) sx += 25;
        }
        return { ...s, x: sx, y: sy };
      });
      return baseLayout;
    }
    
    if (stadiumKey === 'losangeles') {
      const rSec = 170;
      const rGate = 240;
      
      baseLayout.sections = baseLayout.sections.map((s, idx) => {
        const angle = (idx / baseLayout.sections.length) * Math.PI * 2 - Math.PI / 2;
        return { ...s, x: Math.round(cx + rSec * Math.cos(angle)), y: Math.round(cy + rSec * Math.sin(angle)) };
      });
      baseLayout.gates = baseLayout.gates.map((g, idx) => {
        const angle = (idx / baseLayout.gates.length) * Math.PI * 2 - Math.PI / 2;
        return { ...g, x: Math.round(cx + rGate * Math.cos(angle)), y: Math.round(cy + rGate * Math.sin(angle)) };
      });
      baseLayout.concessions = baseLayout.concessions.map((c, idx) => {
        const angle = (idx / baseLayout.concessions.length) * Math.PI * 2 - Math.PI / 4;
        return { ...c, x: Math.round(cx + (rSec - 30) * Math.cos(angle)), y: Math.round(cy + (rSec - 30) * Math.sin(angle)) };
      });
      baseLayout.restrooms = baseLayout.restrooms.map((r, idx) => {
        const angle = (idx / baseLayout.restrooms.length) * Math.PI * 2 - Math.PI / 8;
        return { ...r, x: Math.round(cx + (rSec + 30) * Math.cos(angle)), y: Math.round(cy + (rSec + 30) * Math.sin(angle)) };
      });
      return baseLayout;
    }
    
    if (stadiumKey === 'atlanta') {
      baseLayout.sections = baseLayout.sections.map(s => {
        const dx = s.x - cx;
        const dy = s.y - cy;
        return { ...s, x: Math.round(cx + dx * 0.88), y: Math.round(cy + dy * 0.88) };
      });
      baseLayout.gates = baseLayout.gates.map(g => {
        const dx = g.x - cx;
        const dy = g.y - cy;
        return { ...g, x: Math.round(cx + dx * 0.88), y: Math.round(cy + dy * 0.88) };
      });
      baseLayout.concessions = baseLayout.concessions.map(c => {
        const dx = c.x - cx;
        const dy = c.y - cy;
        return { ...c, x: Math.round(cx + dx * 0.88), y: Math.round(cy + dy * 0.88) };
      });
      baseLayout.restrooms = baseLayout.restrooms.map(r => {
        const dx = r.x - cx;
        const dy = r.y - cy;
        return { ...r, x: Math.round(cx + dx * 0.88), y: Math.round(cy + dy * 0.88) };
      });
      return baseLayout;
    }
    
    return baseLayout;
  };

  // Sync stadium dynamic layout changes
  useEffect(() => {
    const layout = getLayoutForStadium(selectedStadiumKey);
    setGates(layout.gates);
    setSections(layout.sections);
    setConcessions(layout.concessions);
    setRestrooms(layout.restrooms);

    // Initialize rendering densities immediately to prevent transition on stadium change
    layout.sections.forEach(s => {
      currentDensitiesRef.current[s.id] = s.current_density;
    });

    // Reset alert overlays for fresh simulation states
    setBottleneckActive(false);
    setEvacActive(false);
    setLowWaterActive(false);
    setWeatherActive(false);
    setMedicalActive(false);
    setVipActive(false);
    setSecurityShift(0);
    setFlowState('Normal');
    setActiveAlerts(0);
    setGeminiResult('Idle. Change security levels or trigger anomalies to run the Command-Orchestrator prompt.');
  }, [selectedStadiumKey]);

  // Simulation toggles
  const [bottleneckActive, setBottleneckActive] = useState(false);
  const [evacActive, setEvacActive]             = useState(false);
  const [lowWaterActive, setLowWaterActive]     = useState(false);
  const [weatherActive, setWeatherActive]       = useState(false);
  const [medicalActive, setMedicalActive]       = useState(false);
  const [vipActive, setVipActive]               = useState(false);
  const [securityShift, setSecurityShift]       = useState(0);

  // Dashboard stats
  const [flowState, setFlowState]       = useState('Normal');
  const [activeAlerts, setActiveAlerts] = useState(0);

  // Gemini output
  const [geminiResult, setGeminiResult] = useState(
    'Idle. Change security levels or trigger anomalies to run the Command-Orchestrator prompt.'
  );
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), text: 'StadiumGenie operations system initialized.', type: 'info' },
    { time: new Date().toLocaleTimeString(), text: 'RAG Grounding context loaded from STADIUM_MANUAL.', type: 'info' },
  ]);

  // Interactive state
  const [hoveredItem, setHoveredItem] = useState(null);
  const [copied, setCopied]           = useState(false);

  // Refs
  const canvasRef    = useRef(null);
  const particlesRef = useRef([]);
  const currentDensitiesRef = useRef({});

  // ── Utility callbacks ──────────────────────────────────

  const addLog = useCallback((text, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text, type }]);
  }, []);

  const handleCopyJson = useCallback(() => {
    navigator.clipboard.writeText(geminiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [geminiResult]);

  // ── Gemini Orchestrator ────────────────────────────────

  const runOpsOrchestrator = useCallback(async (isEvac, isBottleneck, incidentType = 'NONE') => {
    setGeminiResult('Command-Orchestrator prompt triggered…\nInvoking Gemini 1.5 Pro with RAG groundings…');

    const telemetry = {
      timestamp: new Date().toISOString(),
      stadium_capacity: parseInt(selectedStadium.capacity.replace(/,/g, '')),
      incident: isEvac ? 'EVACUATION' : isBottleneck ? 'BOTTLENECK_GATE_C' : incidentType,
      gate_status: gates,
      concession_status: concessions.map(c => ({ id: c.id, line: c.line_count, stock: c.stock })),
      sections_high_density: sections.filter(s => s.current_density > 0.6).map(s => s.id),
    };

    const promptText =
      `GROUNDING DATA MANUAL:\n${JSON.stringify(STADIUM_MANUAL.emergency_protocols)}\n\n` +
      `CURRENT TELEMETRY:\n${JSON.stringify(telemetry)}\n\n` +
      `Analyze the telemetry based on stadium safety rules. Formulate the response JSON strictly following the SCHEMA:`;

    try {
      const result = apiKey
        ? await callLiveGemini(apiKey, 'ops_orchestrator', promptText)
        : await simulateGemini('ops_orchestrator', {
            density: isEvac ? 1.0 : isBottleneck ? 0.88 : (incidentType !== 'NONE' ? 0.65 : 0.25),
            gate: isEvac ? 'All Gates' : 'Gate C',
          });

      setGeminiResult(JSON.stringify(result, null, 2));
      addLog(`Gemini Orchestrator completed. Action: ${result.mitigation_actions[0].action}`, 'success');
    } catch (err) {
      setGeminiResult(`Error: ${err.message}\nFalling back to simulated safety response…`);
      addLog(`Gemini connection error: ${err.message}`, 'danger');
    }
  }, [apiKey, gates, concessions, sections, selectedStadium, addLog]);

  // ── Particles initialisation ───────────────────────────

  useEffect(() => {
    particlesRef.current = createParticles(sections.length);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Viewer incident reports listener ───────────────────
  useEffect(() => {
    const handleViewerIncident = (e) => {
      const { text, type, sectionId, density } = e.detail;
      addLog(text, type);
      if (sectionId && density !== undefined) {
        setSections(prev => prev.map(s => 
          s.id === sectionId ? { ...s, current_density: density } : s
        ));
      }
      runOpsOrchestrator(evacActive, bottleneckActive, type.toUpperCase());
    };
    window.addEventListener('viewer_incident_report', handleViewerIncident);
    return () => window.removeEventListener('viewer_incident_report', handleViewerIncident);
  }, [addLog, runOpsOrchestrator, evacActive, bottleneckActive]);

  // ── Canvas animation loop ──────────────────────────────

  const renderStateRef = useRef({
    selectedStadiumKey,
    sections,
    concessions,
    restrooms,
    gates,
    evacActive,
    bottleneckActive,
    weatherActive,
    medicalActive,
    vipActive,
    lowWaterActive
  });

  useEffect(() => {
    renderStateRef.current = {
      selectedStadiumKey,
      sections,
      concessions,
      restrooms,
      gates,
      evacActive,
      bottleneckActive,
      weatherActive,
      medicalActive,
      vipActive,
      lowWaterActive
    };
  }, [selectedStadiumKey, sections, concessions, restrooms, gates, evacActive, bottleneckActive, weatherActive, medicalActive, vipActive, lowWaterActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const loop = () => {
      const state = renderStateRef.current;
      // Smoothly interpolate current densities towards target densities
      state.sections.forEach(s => {
        const curr = currentDensitiesRef.current[s.id] ?? s.current_density;
        const target = s.current_density;
        const diff = target - curr;
        if (Math.abs(diff) > 0.002) {
          currentDensitiesRef.current[s.id] = curr + diff * 0.08; // 8% interpolation per frame
        } else {
          currentDensitiesRef.current[s.id] = target;
        }
      });

      const animatedSections = state.sections.map(s => ({
        ...s,
        current_density: currentDensitiesRef.current[s.id] ?? s.current_density
      }));

      renderFrame(ctx, {
        stadiumKey: state.selectedStadiumKey,
        width: CANVAS.WIDTH,
        height: CANVAS.HEIGHT,
        sections: animatedSections,
        concessions: state.concessions,
        restrooms: state.restrooms,
        gates: state.gates,
        particles: particlesRef.current,
        evacActive: state.evacActive,
        bottleneckActive: state.bottleneckActive,
        weatherActive: state.weatherActive,
        medicalActive: state.medicalActive,
        vipActive: state.vipActive,
        lowWaterActive: state.lowWaterActive
      });
      frameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(frameId);
  }, [selectedStadiumKey]);

  // ── Mouse handlers ─────────────────────────────────────

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const coords = toCanvasCoords(e, canvas);
    const hit = hitTestEntities(coords, sections, concessions, gates);
    setHoveredItem(hit);
  }, [sections, concessions, gates]);

  const handleMouseLeave = useCallback(() => setHoveredItem(null), []);

  // ── Simulation toggles (immutable updates) ─────────────

  const toggleBottleneck = useCallback(() => {
    const next = !bottleneckActive;
    setBottleneckActive(next);

    setSections(prev => prev.map(s => {
      if (s.id === 'Sec 108') return { ...s, current_density: next ? 0.92 : 0.75 };
      if (s.id === 'Sec 109') return { ...s, current_density: next ? 0.88 : 0.65 };
      return s;
    }));
    setGates(prev => prev.map(g =>
      g.id === 'Gate C' ? { ...g, status: next ? 'CONGESTED' : 'OPEN' } : g
    ));

    if (next) {
      setActiveAlerts(a => a + 1);
      setFlowState('Congested');
      addLog('WARNING: Sensor flags bottleneck at Gate C. Density = 92%', 'warn');
      runOpsOrchestrator(evacActive, true);
    } else {
      setActiveAlerts(a => Math.max(0, a - 1));
      setFlowState(evacActive ? 'Evacuating' : 'Normal');
      addLog('INFO: Gate C density cleared. Normal flow restored.', 'info');
      setGeminiResult('Normal status restored. Ready.');
    }
  }, [bottleneckActive, evacActive, addLog, runOpsOrchestrator]);

  const toggleEvacuation = useCallback(() => {
    const next = !evacActive;
    setEvacActive(next);

    if (next) {
      setSections(prev => prev.map(s => ({
        ...s, current_density: Math.min(0.95, s.current_density + 0.35),
      })));
      setGates(prev => prev.map(g => ({ ...g, status: 'EVACUATION_EXIT' })));
      setActiveAlerts(a => a + 1);
      setFlowState('Evacuating');
      addLog('CRITICAL: Evacuation protocol triggered.', 'danger');
      runOpsOrchestrator(true, bottleneckActive);
    } else {
      const baseline = cloneLayout().sections;
      setSections(baseline);
      setGates(prev => prev.map(g => ({ ...g, status: 'OPEN' })));
      setActiveAlerts(a => Math.max(0, a - 1));
      setFlowState(bottleneckActive ? 'Congested' : 'Normal');
      addLog('INFO: Evacuation drill finished. System reset.', 'info');
      setGeminiResult('Drill concluded. Operational twin restored to nominal states.');
    }
  }, [evacActive, bottleneckActive, addLog, runOpsOrchestrator]);

  const handleSecuritySlider = useCallback((e) => {
    const val = parseInt(e.target.value, 10);
    setSecurityShift(val);

    const baseC = STADIUM_MANUAL.layout.gates.find(g => g.id === 'Gate C').security_allocation;
    const baseD = STADIUM_MANUAL.layout.gates.find(g => g.id === 'Gate D').security_allocation;

    setGates(prev => prev.map(g => {
      if (g.id === 'Gate C') return { ...g, security_allocation: baseC + val };
      if (g.id === 'Gate D') return { ...g, security_allocation: baseD - val };
      return g;
    }));

    if (bottleneckActive) {
      setSections(prev => prev.map(s =>
        s.id === 'Sec 108' ? { ...s, current_density: Math.max(0.6, 0.92 - val * 0.03) } : s
      ));
      addLog(`Resource Allocation: Shifted ${val} stewards to Gate C.`, 'info');
    }
  }, [bottleneckActive, addLog]);

  const toggleLowWater = useCallback(() => {
    const next = !lowWaterActive;
    setLowWaterActive(next);

    setConcessions(prev => prev.map(c => {
      if (c.id === 'Concession 108') return { ...c, stock: { ...c.stock, 'Bottled Water': next ? 0 : 8 } };
      if (c.id === 'Concession 102') return { ...c, stock: { ...c.stock, 'Bottled Water': next ? 2 : 15 } };
      return c;
    }));

    addLog(
      next ? 'INVENTORY WARN: Concession 108 Bottled Water depleted.' : 'INVENTORY INFO: Restocked water.',
      next ? 'warn' : 'info'
    );
  }, [lowWaterActive, addLog]);

  const toggleWeather = useCallback(() => {
    const next = !weatherActive;
    setWeatherActive(next);

    if (next) {
      setSections(prev => prev.map(s => ({ ...s, current_density: Math.min(0.95, s.current_density + 0.15) })));
      setActiveAlerts(a => a + 1);
      setFlowState('Weather Alert');
      addLog(t.weatherClosed, 'warn');
      runOpsOrchestrator(evacActive, bottleneckActive, 'WEATHER_ALERT');
    } else {
      setSections(cloneLayout().sections);
      setActiveAlerts(a => Math.max(0, a - 1));
      setFlowState('Normal');
      addLog(t.weatherRestored, 'info');
      setGeminiResult('Skydome roof reopened. Operations normal.');
    }
  }, [weatherActive, evacActive, bottleneckActive, addLog, runOpsOrchestrator, t]);

  const toggleMedical = useCallback(() => {
    const next = !medicalActive;
    setMedicalActive(next);
    
    if (next) {
      setActiveAlerts(a => a + 1);
      setFlowState('Medical Alert');
      addLog(t.medicalActive, 'danger');
      runOpsOrchestrator(evacActive, bottleneckActive, 'MEDICAL_EMERGENCY');
    } else {
      setActiveAlerts(a => Math.max(0, a - 1));
      setFlowState('Normal');
      addLog(t.medicalCleared, 'info');
      setGeminiResult('Medical emergency at Sec 105 cleared.');
    }
  }, [medicalActive, evacActive, bottleneckActive, addLog, runOpsOrchestrator, t]);

  const toggleVip = useCallback(() => {
    const next = !vipActive;
    setVipActive(next);

    if (next) {
      setActiveAlerts(a => a + 1);
      setFlowState('VIP Escort');
      addLog(t.vipActive, 'warn');
      runOpsOrchestrator(evacActive, bottleneckActive, 'VIP_ESCORT_PROTOCOL');
    } else {
      setActiveAlerts(a => Math.max(0, a - 1));
      setFlowState('Normal');
      addLog(t.vipCleared, 'info');
      setGeminiResult('VIP escort completed. Gate A returned to standard flow.');
    }
  }, [vipActive, evacActive, bottleneckActive, addLog, runOpsOrchestrator, t]);

  // ── Derived values ─────────────────────────────────────

  const totalStewards = gates.reduce((sum, g) => sum + g.security_allocation, 0);
  
  const flowCfg = {
    'Normal':        { colorClass: 'green',  cssVar: 'var(--neon-green)'  },
    'Congested':     { colorClass: 'orange', cssVar: 'var(--neon-orange)' },
    'Evacuating':    { colorClass: 'red',    cssVar: 'var(--neon-red)'    },
    'Weather Alert': { colorClass: 'cyan',   cssVar: 'var(--neon-cyan)'   },
    'VIP Escort':    { colorClass: 'purple', cssVar: 'var(--neon-purple)' },
    'Medical Alert': { colorClass: 'red',    cssVar: 'var(--neon-red)'    }
  }[flowState] || { colorClass: 'green', cssVar: 'var(--neon-green)' };

  const getTranslatedFlowState = (state) => {
    if (state === 'Normal') return t.normal;
    if (state === 'Congested') return t.congested;
    if (state === 'Evacuating') return t.evacuating;
    if (state === 'Weather Alert') return t.weatherAlert;
    if (state === 'VIP Escort') return t.vipEscort;
    if (state === 'Medical Alert') return t.medicalAlert;
    return state;
  };

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="stadium-twin-tab">

      {/* Operations Live Match Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(255,0,85,0.12), rgba(0,240,255,0.08))',
        border: '1px solid rgba(0,240,255,0.15)', borderRadius: 8,
        padding: '10px 16px', margin: '0 0 12px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: 'var(--neon-red)', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '2px 6px', borderRadius: 3, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, background: '#fff', borderRadius: '50%', animation: 'banner-dot-pulse 1s infinite alternate' }} /> LIVE OPS
          </span>
          <span style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
            🇦🇷 Argentina 2 - 1 France 🇫🇷
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Quarter-final</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          <i className="fa-solid fa-location-dot" style={{ marginRight: 4 }} /> {selectedStadium.name.split(' (')[0]} • Capacity: {selectedStadium.capacity.split(' ')[0]}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="glass-card stat-item">
          <span className="stat-icon cyan"><i className="fa-solid fa-users" /></span>
          <div>
            <div className="stat-value">82,410</div>
            <div className="stat-label">{t.attendance}</div>
          </div>
        </div>
        <div className="glass-card stat-item">
          <span className={`stat-icon ${flowCfg.colorClass}`}>
            <i className="fa-solid fa-gauge-high" />
          </span>
          <div>
            <div className="stat-value" style={{ color: flowCfg.cssVar }}>{getTranslatedFlowState(flowState)}</div>
            <div className="stat-label">{t.crowdFlow}</div>
          </div>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-icon orange"><i className="fa-solid fa-user-shield" /></span>
          <div>
            <div className="stat-value">{totalStewards}</div>
            <div className="stat-label">{t.activeStewards}</div>
          </div>
        </div>
        <div className="glass-card stat-item">
          <span className="stat-icon red"><i className="fa-solid fa-triangle-exclamation" /></span>
          <div>
            <div className="stat-value">{activeAlerts}</div>
            <div className="stat-label">{t.activeAlerts}</div>
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="main-operational-split">

        {/* Canvas panel */}
        <div className="flat-panel map-panel-container" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className="fa-solid fa-satellite-dish" style={{ color: 'var(--neon-cyan)' }} />
              <select 
                value={selectedStadiumKey} 
                onChange={(e) => setSelectedStadiumKey(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 6,
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {STADIUMS_DATA.map(st => (
                  <option key={st.key} value={st.key} style={{ background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}>{st.name}</option>
                ))}
              </select>
            </div>
            
            {/* Toggle Modes */}
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg-input)', padding: 3, borderRadius: 6, border: '1px solid var(--border-input)' }}>
              <button 
                onClick={() => setVisualMode('chart')}
                style={{
                  background: visualMode === 'chart' ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  color: visualMode === 'chart' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  fontSize: 10,
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-map" style={{ marginRight: 4 }} /> SEATING CHART
              </button>
              <button 
                onClick={() => setVisualMode('telemetry')}
                style={{
                  background: visualMode === 'telemetry' ? 'var(--bg-card)' : 'transparent',
                  border: 'none',
                  borderRadius: 4,
                  color: visualMode === 'telemetry' ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  fontSize: 10,
                  fontWeight: 'bold',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-gauge-high" style={{ marginRight: 4 }} /> LIVE TELEMETRY
              </button>
            </div>
          </div>

          {/* Map display area */}
          {visualMode === 'chart' ? (
            <div style={{
              position: 'relative',
              width: '100%',
              height: CANVAS.HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-input)',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              overflow: 'hidden'
            }}>
              <img 
                src={selectedStadium.image} 
                alt={selectedStadium.name} 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
              />
            </div>
          ) : (
            <div className="stadium-canvas-wrap" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <canvas
                ref={canvasRef}
                width={CANVAS.WIDTH}
                height={CANVAS.HEIGHT}
                style={{ maxWidth: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseMove}
              />
            </div>
          )}

          {/* Hover tooltip */}
          {visualMode === 'telemetry' && hoveredItem && (
            <div className="canvas-hover-tooltip" style={{
              position: 'absolute',
              left:  hoveredItem.domX + 35,
              top:   hoveredItem.domY + 50,
              pointerEvents: 'none',
              zIndex: 10,
            }}>
              <div className="tooltip-header">
                <i className={TOOLTIP_ICONS[hoveredItem.type]} />
                {hoveredItem.name}
              </div>
              <div className="tooltip-body">{hoveredItem.details}</div>
            </div>
          )}

          {/* Stadium Profile & Info Section */}
          <div style={{ 
            padding: 14, 
            background: 'var(--bg-input)', 
            borderRadius: 8, 
            border: '1px solid var(--border-color)',
            marginTop: 4
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: 13, color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-solid fa-circle-info" /> {selectedStadium.name} Details
            </h4>
            <p style={{ margin: '0 0 10px 0', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {selectedStadium.description}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, fontSize: 10 }}>
              <div style={{ padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedStadium.location}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Capacity: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedStadium.capacity}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Pitch Surface: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedStadium.surface}</strong>
              </div>
              <div style={{ padding: '6px 8px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Allocated Matches: </span>
                <strong style={{ color: 'var(--text-primary)' }}>{selectedStadium.matches}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Controls panel */}
        <div className="side-controls-panel">
          <div className="flat-panel control-group">
            <div className="card-title">
              <span><i className="fa-solid fa-sliders" style={{ marginRight: 6 }} /> {t.simulationControls}</span>
            </div>

            <button className={`action-btn ${bottleneckActive ? 'active' : ''}`} onClick={toggleBottleneck}>
              <span><i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 6 }} /> {t.btnBottleneck}</span>
              <span className="action-badge">{bottleneckActive ? (locale === 'es' ? 'CONGESTIÓN' : 'CONGESTED') : 'Inactive'}</span>
            </button>

            <button className={`action-btn ${evacActive ? 'active' : ''}`} onClick={toggleEvacuation}>
              <span><i className="fa-solid fa-bullhorn" style={{ marginRight: 6 }} /> {t.btnEvacuation}</span>
              <span className="action-badge">{evacActive ? (locale === 'es' ? 'ACTIVO' : 'ACTIVE') : 'Inactive'}</span>
            </button>

            <div className="range-slider" style={{ marginTop: 10 }}>
              <label>
                <span>{t.securityShift}</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--neon-cyan)' }}>{securityShift}</span>
              </label>
              <input type="range" min={0} max={10} value={securityShift} onChange={handleSecuritySlider} />
            </div>

            <button className={`action-btn ${lowWaterActive ? 'active' : ''}`} onClick={toggleLowWater}>
              <span><i className="fa-solid fa-bottle-water" style={{ marginRight: 6 }} /> {t.btnWaterLow}</span>
              <span className="action-badge">{lowWaterActive ? (locale === 'es' ? 'AGOTADO' : 'DEPLETED') : 'Normal'}</span>
            </button>

            {/* Weather warning simulation button */}
            <button className={`action-btn weather-btn ${weatherActive ? 'active' : ''}`} onClick={toggleWeather}>
              <span><i className="fa-solid fa-cloud-bolt" style={{ marginRight: 6 }} /> {t.btnWeather}</span>
              <span className="action-badge">{weatherActive ? (locale === 'es' ? 'ALERTA' : 'ALERT') : 'Inactive'}</span>
            </button>

            {/* Medical emergency simulation button */}
            <button className={`action-btn medical-btn ${medicalActive ? 'active' : ''}`} onClick={toggleMedical}>
              <span><i className="fa-solid fa-truck-medical" style={{ marginRight: 6 }} /> {t.btnMedical}</span>
              <span className="action-badge">{medicalActive ? (locale === 'es' ? 'ALERTA' : 'ALERT') : 'Inactive'}</span>
            </button>

            {/* VIP Escort simulation button */}
            <button className={`action-btn vip-btn ${vipActive ? 'active' : ''}`} onClick={toggleVip}>
              <span><i className="fa-solid fa-star" style={{ marginRight: 6 }} /> {t.btnVip}</span>
              <span className="action-badge">{vipActive ? (locale === 'es' ? 'ACTIVO' : 'ACTIVE') : 'Inactive'}</span>
            </button>
          </div>

          {/* Gemini response console */}
          <div className="flat-panel response-console-container">
            <div className="card-title">
              <span><i className="fa-solid fa-robot" style={{ marginRight: 6 }} /> {t.geminiResponse}</span>
              <button className="copy-btn" onClick={handleCopyJson}>
                <i className={copied ? 'fa-solid fa-check' : 'fa-solid fa-copy'} />
                {copied ? ` ${t.copied}` : ` ${t.copy}`}
              </button>
            </div>
            <pre className="gemini-response-box">{geminiResult}</pre>

            <div className="console-logs-box">
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: 4 }}>
                {t.consoleLogs.toUpperCase()}
              </div>
              {logs.map((log, i) => (
                <div key={i} className={`console-line ${log.type}`}>
                  <LogIcon type={log.type} />
                  [{log.time}] {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
