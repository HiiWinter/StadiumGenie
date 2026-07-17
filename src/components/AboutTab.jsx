// src/components/AboutTab.jsx - About Section for StadiumGenie
import React from 'react';

export default function AboutTab() {
  return (
    <div className="about-tab-container" style={{ padding: 16, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Intro Hero */}
      <div className="glass-card about-hero-card" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05), rgba(124, 58, 237, 0.05))', border: '1px solid var(--border-color)', padding: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
          About StadiumGenie Operations Dome
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
          StadiumGenie is an end-to-end, multimodal GenAI solution designed specifically to optimize live stadium safety for the FIFA World Cup 2026. The platform merges real-time IoT feeds, spectator reports, and venue manuals into a centralized Command Visualizer, backed by Google Gemini 1.5 Pro RAG inferencing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        {/* Core Architecture highlights */}
        <div className="glass-card architecture-highlights">
          <div className="card-title" style={{ fontSize: 12 }}>
            <span><i className="fa-solid fa-layer-group" style={{ marginRight: 6, color: 'var(--neon-cyan)' }} /> CORE TECH STACK</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>1. Multimodal Gemini 1.5 Pro:</strong>
              <p>Processes real-time telemetry inputs alongside grounding manuals to output JSON mitigation plans.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>2. Live HTML5 Canvas Visualizer:</strong>
              <p>Renders real-time spectator density gradients, crowd particle simulations, and security status indicators.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3. Spectator Crowd Ticker Dispatcher:</strong>
              <p>Enables real-time event reporting from fans directly to the Operations Dome console.</p>
            </div>
          </div>
        </div>

        {/* Challenge guidelines & rules */}
        <div className="glass-card challenge-rules-highlights">
          <div className="card-title" style={{ fontSize: 12 }}>
            <span><i className="fa-solid fa-flag-checkered" style={{ marginRight: 6, color: 'var(--neon-green)' }} /> CHALLENGE SUBMISSION DIRECTIVES</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12, lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>1. High-Density Visual Interface:</strong>
              <p>Uses a clean light mode theme by default to offer a premium operational center layout.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>2. Zero-Loss State Preservation:</strong>
              <p>Dashboard tabs keep all background simulations, Recharts, and console log feeds active and synchronized.</p>
            </div>
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>3. Multi-Lingual Support:</strong>
              <p>Fully localized into English, Spanish, French, and Portuguese for global operations.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
