import { describe, it, expect } from 'vitest';
import { simulateGemini, SYSTEM_PROMPTS } from '../utils/custom_gemini';
import { TRANSLATIONS } from '../data/translations';
import { getPlayerImageUrl, getPlayerInitials } from '../utils/playerImageHelper';

describe('Stadium Operations & Crowd Control Simulation Tests', () => {
  it('should compute correct traffic diversion target (Current Density * 0.25)', async () => {
    const density = 0.88;
    const res = await simulateGemini('ops_orchestrator', { density, gate: 'Gate A' });
    expect(res).toBeDefined();
    expect(res.incident_analysis.severity).toBe('HIGH');
    expect(res.traffic_diversion.target_percentage).toBe(25);
    expect(res.traffic_diversion.target_diverted_count).toBe(Math.round(0.88 * 1000 * 0.25));
  });

  it('should return MEDIUM severity for density <= 0.8', async () => {
    const res = await simulateGemini('ops_orchestrator', { density: 0.7, gate: 'Gate B' });
    expect(res.incident_analysis.severity).toBe('MEDIUM');
    expect(res.traffic_diversion.target_diverted_count).toBe(Math.round(0.7 * 1000 * 0.25));
  });

  it('should provide valid mitigation actions and public announcement text', async () => {
    const res = await simulateGemini('ops_orchestrator', { density: 0.9, gate: 'Gate Gate C' });
    expect(res.mitigation_actions.length).toBeGreaterThan(0);
    expect(res.public_announcement.push_notification_text).toContain('Gate Gate C');
    expect(res.public_announcement.signage_display_text).toContain('DETOUR');
  });

  it('should support all groundings in system prompts', () => {
    expect(SYSTEM_PROMPTS.ops_orchestrator).toContain('Command-Orchestrator');
    expect(SYSTEM_PROMPTS.fifa_historian).toContain('Fifa-Historian');
    expect(SYSTEM_PROMPTS.chatbot).toContain('GenieGuide');
  });
});

describe('FIFA Historian & Offline Simulator Tests', () => {
  it('should return accurate 1970 World Cup historical breakdown', async () => {
    const res = await simulateGemini('fifa_historian', { year: 1970, winner: 'Brazil', host: 'Mexico' });
    expect(res.era_tactics_title).toBe('Dynamic Attacking Fluidity (Jogo Bonito)');
    expect(res.legend_impact_quote).toContain('Jairzinho');
  });

  it('should return fallback data for unlisted World Cup years', async () => {
    const res = await simulateGemini('fifa_historian', { year: 1966, winner: 'England', host: 'England' });
    expect(res.era_tactics_title).toBe('Positional Transition Play');
    expect(res.tactical_breakdown).toContain('In 1966');
  });
});

describe('Multilingual & Player Avatar Utility Tests', () => {
  it('should support all 4 official tournament languages in TRANSLATIONS', () => {
    expect(Object.keys(TRANSLATIONS)).toEqual(['en', 'es', 'fr', 'pt']);
    ['en', 'es', 'fr', 'pt'].forEach(lang => {
      expect(TRANSLATIONS[lang].stadiumTwin).toBeDefined();
      expect(TRANSLATIONS[lang].spectatorHub).toBeDefined();
    });
  });

  it('should resolve player initials correctly', () => {
    expect(getPlayerInitials('Lionel Messi')).toBe('LM');
    expect(getPlayerInitials('Pelé')).toBe('PE');
    expect(getPlayerInitials('')).toBe('?');
  });

  it('should resolve local player image URLs accurately', () => {
    expect(getPlayerImageUrl('Lionel Messi')).toBe('/players/arg_lionel_messi.jpg');
    expect(getPlayerImageUrl('Kylian Mbappe')).toBe('/players/fra_kylian_mbappe.jpg');
    expect(getPlayerImageUrl('Unknown Player Name XYZ')).toBeNull();
  });
});
