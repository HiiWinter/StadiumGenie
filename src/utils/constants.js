// src/utils/constants.js - Shared constants and configuration values

// Canvas color palette (dynamically switches based on html class for light/dark modes)
export const COLORS = {
  get BG() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? '#0a0b0e' : '#f8fafc';
  },
  get GRID() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.04)';
  },
  get PITCH_FILL() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(0, 255, 102, 0.05)' : 'rgba(22, 163, 74, 0.06)';
  },
  get PITCH_STROKE() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(0, 255, 102, 0.3)' : 'rgba(22, 163, 74, 0.4)';
  },
  get PITCH_LINES() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(0, 255, 102, 0.12)' : 'rgba(22, 163, 74, 0.15)';
  },

  get DENSITY_HIGH() {
    return 'rgba(255, 0, 85, 0.8)';
  },
  get DENSITY_HIGH_EDGE() {
    return 'rgba(255, 0, 85, 1)';
  },
  get DENSITY_HIGH_GLOW() {
    return 'rgba(255, 0, 85, 0.5)';
  },
  get DENSITY_MED() {
    return 'rgba(255, 153, 0, 0.7)';
  },
  get DENSITY_MED_EDGE() {
    return 'rgba(255, 153, 0, 0.9)';
  },
  get DENSITY_LOW() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(0, 240, 255, 0.3)' : 'rgba(2, 132, 199, 0.4)';
  },
  get DENSITY_LOW_EDGE() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(0, 240, 255, 0.5)' : 'rgba(2, 132, 199, 0.6)';
  },

  get GATE_DEFAULT_FILL() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(18, 20, 26, 0.9)' : 'rgba(255, 255, 255, 0.95)';
  },
  get GATE_DEFAULT_STROKE() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.15)';
  },
  get GATE_CONGESTED_FILL() {
    return 'rgba(255, 0, 85, 0.2)';
  },
  get GATE_CONGESTED() {
    return '#ff0055';
  },
  get GATE_CONGESTED_PULSE() {
    return 'rgba(255, 0, 85, 0.3)';
  },
  get GATE_EVAC_FILL() {
    return 'rgba(0, 255, 102, 0.1)';
  },
  get GATE_EVAC() {
    return '#00ff66';
  },

  get NEON_PURPLE() {
    return '#ab47bc';
  },
  get NEON_CYAN() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? '#00f0ff' : '#0284c7';
  },
  get NEON_RED() {
    return '#ff0055';
  },

  get TEXT_WHITE() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? '#fff' : '#0f172a';
  },
  get TEXT_MUTED() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? '#8a99ad' : '#475569';
  },
  get PARTICLE() {
    return (typeof document !== 'undefined' && document.documentElement.classList.contains('dark-theme')) ? 'rgba(255, 255, 255, 0.3)' : 'rgba(15, 23, 42, 0.2)';
  },
};

// Canvas layout constants
export const CANVAS = {
  WIDTH:  800,
  HEIGHT: 600,
  CENTER: { x: 400, y: 300 },
  GRID_SPACING: 40,
  PITCH_RX: 160,
  PITCH_RY: 110,
  SECTION_RADIUS: 18,
  GATE_RADIUS: 22,
  CONCESSION_RADIUS: 15,
  PARTICLE_COUNT: 120,
};

// Density thresholds
export const DENSITY = {
  HIGH: 0.8,
  MEDIUM: 0.5,
  BOTTLENECK_ALERT: 0.70,
};

// Log type to Font Awesome icon class mapping
export const LOG_ICONS = {
  info:    'fa-solid fa-circle-info',
  success: 'fa-solid fa-circle-check',
  warn:    'fa-solid fa-triangle-exclamation',
  danger:  'fa-solid fa-skull-crossbones',
};

// Flow state visual config
export const FLOW_STATE_CONFIG = {
  Normal:     { colorClass: 'green',  cssVar: 'var(--neon-green)'  },
  Congested:  { colorClass: 'orange', cssVar: 'var(--neon-orange)' },
  Evacuating: { colorClass: 'red',    cssVar: 'var(--neon-red)'    },
};
