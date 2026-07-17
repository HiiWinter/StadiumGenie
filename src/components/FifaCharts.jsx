import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, Line, 
  BarChart, Bar, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { FIFA_WORLD_CUP_HISTORY } from '../data/world_cup_history';
import { TRANSLATIONS } from '../data/translations';
import RootConnectionChart from './RootConnectionChart';

export default function FifaCharts({ locale = 'en' }) {
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  const [chartsSubTab, setChartsSubTab] = useState('trends'); // 'trends' or 'connections'

  // Map historical database to chart format
  const chartData = FIFA_WORLD_CUP_HISTORY.map(ed => ({
    year: ed.year,
    goals: ed.totalGoals,
    attendance: ed.attendance,
    teams: ed.teams,
    avgGoals: parseFloat((ed.totalGoals / ed.matches).toFixed(2))
  }));

  // Custom tooltip styling
  const customTooltipStyle = {
    backgroundColor: 'var(--bg-sidebar)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'monospace',
    fontSize: '12px'
  };

  return (
    <div className="fifa-charts-tab-container">
      
      {/* Sub tabs for Trends vs Connections */}
      <div className="charts-subtabs-row" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <button 
          className={`subtab-btn ${chartsSubTab === 'trends' ? 'active' : ''}`}
          onClick={() => setChartsSubTab('trends')}
        >
          <i className="fa-solid fa-chart-line" style={{ marginRight: 6 }} />
          {t.statsTrends}
        </button>
        <button 
          className={`subtab-btn ${chartsSubTab === 'connections' ? 'active' : ''}`}
          onClick={() => setChartsSubTab('connections')}
        >
          <i className="fa-solid fa-network-wired" style={{ marginRight: 6 }} />
          {t.rootConnectionTitle}
        </button>
      </div>

      {chartsSubTab === 'connections' ? (
        <RootConnectionChart locale={locale} />
      ) : (
        <div className="fifa-charts-tab">
          
          {/* Analytics Summary Banner */}
          <div className="glass-card analytics-banner" style={{ marginBottom: '20px', padding: '16px' }}>
            <div className="card-title">
              <span><i className="fa-solid fa-chart-line" style={{ marginRight: '6px', color: 'var(--neon-cyan)' }}></i> {locale === 'es' ? 'Crecimiento del Fútbol e Información de Asistencia' : 'Football Growth & Attendance Insights'}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {locale === 'es' 
                ? 'Al rastrear las métricas de la Copa Mundial desde 1930, vemos inflexiones históricas claras. La expansión a 32 países en 1998 impulsó el total de goles, mientras que EE. UU. 1994 sigue siendo el pico de asistencia por capacidad del estadio. En 2026, con 48 equipos, se proyecta romper récords.'
                : 'By tracking World Cup metrics since 1930, we see clear historical inflections. The expansion of competing teams to 32 nations in 1998 caused a steady rise in total goals, while USA 1994 remains the undisputed peak due to massive stadium capacities. In 2026, the expansion to 48 teams projects to break all previous metrics.'
              }
            </p>
          </div>

          <div className="charts-grid">
            
            {/* Chart 1: Total Goals Over Time */}
            <div className="glass-card chart-card">
              <div className="card-title">
                <i className="fa-solid fa-futbol" style={{ color: 'var(--neon-cyan)', marginRight: 6 }} /> 
                {locale === 'es' ? 'Goles Totales Marcados (1930 – 2022)' : 'Total Goals Scored (1930 – 2022)'}
              </div>
              <div style={{ width: '100%', height: 260, minHeight: 260 }}>
                <ResponsiveContainer width="100%" height={260} minWidth={100} minHeight={260}>
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" style={{ fontSize: 10 }} />
                    <YAxis stroke="var(--text-secondary)" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line 
                       type="monotone" 
                      dataKey="goals" 
                      name={locale === 'es' ? 'Goles Totales' : 'Total Goals'} 
                      stroke="var(--neon-cyan)" 
                      strokeWidth={2}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgGoals" 
                      name={locale === 'es' ? 'Goles/Partido' : 'Goals/Match'} 
                      stroke="var(--neon-green)" 
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Spectator Attendance */}
            <div className="glass-card chart-card">
              <div className="card-title">
                <i className="fa-solid fa-users" style={{ color: 'var(--neon-purple)', marginRight: 6 }} /> 
                {locale === 'es' ? 'Tendencias de Asistencia de Espectadores' : 'Total Attendance Trends'}
              </div>
              <div style={{ width: '100%', height: 260, minHeight: 260 }}>
                <ResponsiveContainer width="100%" height={260} minWidth={100} minHeight={260}>
                  <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" style={{ fontSize: 10 }} />
                    <YAxis 
                      stroke="var(--text-secondary)" 
                      style={{ fontSize: 10 }} 
                      tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip contentStyle={customTooltipStyle} tickFormatter={(val) => val.toLocaleString()} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="attendance" name={locale === 'es' ? 'Espectadores' : 'Spectators'} fill="var(--neon-purple)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Competing Nations */}
            <div className="glass-card chart-card" style={{ gridColumn: 'span 2' }}>
              <div className="card-title">
                <i className="fa-solid fa-earth-americas" style={{ color: 'var(--neon-green)', marginRight: 6 }} /> 
                {locale === 'es' ? 'Expansión de Equipos Competidores' : 'Expansion of Competing Teams'}
              </div>
              <div style={{ width: '100%', height: 260, minHeight: 260 }}>
                <ResponsiveContainer width="100%" height={260} minWidth={100} minHeight={260}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="year" stroke="var(--text-secondary)" style={{ fontSize: 10 }} />
                    <YAxis stroke="var(--text-secondary)" style={{ fontSize: 10 }} />
                    <Tooltip contentStyle={customTooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area 
                      type="monotone" 
                      dataKey="teams" 
                      name={locale === 'es' ? 'Número de Equipos' : 'Number of Teams'} 
                      stroke="var(--neon-green)" 
                      fill="rgba(0, 255, 102, 0.08)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
