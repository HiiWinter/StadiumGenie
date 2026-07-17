// src/utils/canvasRenderer.js - Enhanced canvas drawing for the Stadium Digital Twin

import { COLORS, CANVAS, DENSITY } from './constants';

const { CENTER, GRID_SPACING, PITCH_RX, PITCH_RY, SECTION_RADIUS, GATE_RADIUS } = CANVAS;

/** Draw background grid and pitch oval. */
function drawBackground(ctx, w, h, stadiumKey = 'newyork') {
  ctx.fillStyle = COLORS.BG;
  ctx.fillRect(0, 0, w, h);

  // Subtle radial gradient overlay for depth
  const gradient = ctx.createRadialGradient(CENTER.x, CENTER.y, 50, CENTER.x, CENTER.y, 380);
  gradient.addColorStop(0, 'rgba(0, 240, 255, 0.02)');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = COLORS.GRID;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += GRID_SPACING) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += GRID_SPACING) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Draw stadium name in background as large subtle text overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  const nameLabel = stadiumKey === 'newyork' ? 'METLIFE STADIUM' :
                    stadiumKey === 'dallas' ? 'AT&T STADIUM' :
                    stadiumKey === 'seattle' ? 'LUMEN FIELD' :
                    stadiumKey === 'losangeles' ? 'SOFI STADIUM' : 'MERCEDES-BENZ STADIUM';
  ctx.fillText(nameLabel, CENTER.x, 80);

  // Pitch oval sizes adjusted dynamically
  const rx = stadiumKey === 'dallas' ? PITCH_RX * 1.15 : stadiumKey === 'atlanta' ? PITCH_RX * 0.88 : PITCH_RX;
  const ry = stadiumKey === 'dallas' ? PITCH_RY * 1.15 : stadiumKey === 'atlanta' ? PITCH_RY * 0.88 : PITCH_RY;

  ctx.beginPath();
  ctx.ellipse(CENTER.x, CENTER.y, rx, ry, 0, 0, Math.PI * 2);
  
  if (stadiumKey === 'losangeles') {
    ctx.fillStyle = 'rgba(171, 71, 188, 0.04)';
  } else if (stadiumKey === 'seattle') {
    ctx.fillStyle = 'rgba(0, 255, 102, 0.03)';
  } else if (stadiumKey === 'dallas') {
    ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
  } else {
    ctx.fillStyle = COLORS.PITCH_FILL;
  }
  ctx.fill();
  
  ctx.strokeStyle = stadiumKey === 'losangeles' ? 'rgba(171, 71, 188, 0.35)' : COLORS.PITCH_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pitch markings
  ctx.strokeStyle = COLORS.PITCH_LINES;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.rect(CENTER.x - rx * 0.65, CENTER.y - ry * 0.55, rx * 1.3, ry * 1.1);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(CENTER.x, CENTER.y, 40, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(CENTER.x, CENTER.y - ry);
  ctx.lineTo(CENTER.x, CENTER.y + ry);
  ctx.stroke();

  // Goal boxes
  ctx.beginPath();
  ctx.rect(CENTER.x - 30, CENTER.y - ry - 2, 60, 14);
  ctx.rect(CENTER.x - 30, CENTER.y + ry - 12, 60, 14);
  ctx.strokeStyle = 'rgba(0, 255, 102, 0.08)';
  ctx.stroke();

  // Stadium-specific structural enhancements
  if (stadiumKey === 'dallas') {
    // Retractable roof lines running vertically
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(CENTER.x - 120, 0); ctx.lineTo(CENTER.x - 120, h);
    ctx.moveTo(CENTER.x + 120, 0); ctx.lineTo(CENTER.x + 120, h);
    ctx.stroke();

    // Giant Center-hung board in middle
    ctx.fillStyle = 'rgba(0, 240, 255, 0.04)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(CENTER.x - 85, CENTER.y - 20, 170, 40, 6);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('175FT HALO VIDEO SCREEN', CENTER.x, CENTER.y + 3);
  }

  if (stadiumKey === 'seattle') {
    // Horseshoe U-shaped outer boundary
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.12)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(CENTER.x, CENTER.y + 20, 210, -Math.PI * 0.9, -Math.PI * 0.1, true);
    ctx.stroke();
  }

  if (stadiumKey === 'losangeles') {
    // Colossal dual-sided Infinity Screen ring
    ctx.strokeStyle = 'rgba(171, 71, 188, 0.15)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.ellipse(CENTER.x, CENTER.y, 110, 75, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(CENTER.x, CENTER.y, 117, 82, 0, 0, Math.PI * 2);
    ctx.ellipse(CENTER.x, CENTER.y, 103, 68, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(171, 71, 188, 0.5)';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SAMSUNG INFINITY SCREEN', CENTER.x, CENTER.y + 3);
  }

  if (stadiumKey === 'atlanta') {
    // Pinwheel retractable roof structure
    ctx.strokeStyle = 'rgba(255, 153, 0, 0.08)';
    ctx.lineWidth = 1.5;
    const numPetals = 8;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(CENTER.x, CENTER.y);
      ctx.lineTo(CENTER.x + 65 * Math.cos(angle), CENTER.y + 65 * Math.sin(angle));
      ctx.lineTo(CENTER.x + 55 * Math.cos(angle + 0.38), CENTER.y + 55 * Math.sin(angle + 0.38));
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 153, 0, 0.015)';
      ctx.fill();
      ctx.stroke();
    }
  }
}

/** Draw connection lines from sections to their nearest gate. */
function drawConnections(ctx, sections, gates) {
  ctx.lineWidth = 0.5;
  sections.forEach(s => {
    // Find closest gate
    let minDist = Infinity, closest = gates[0];
    gates.forEach(g => {
      const d = Math.hypot(g.x - s.x, g.y - s.y);
      if (d < minDist) { minDist = d; closest = g; }
    });

    const alpha = s.current_density > DENSITY.HIGH ? 0.12 : 0.03;
    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(closest.x, closest.y);
    ctx.stroke();
  });
}

/** Draw sections with heat-map glow for high density. */
function drawSections(ctx, sections) {
  const time = Date.now();

  sections.forEach(s => {
    const d = s.current_density;
    let fill, stroke;

    if (d > DENSITY.HIGH) {
      // Pulsing glow for critical density
      const pulse = 0.7 + Math.sin(time / 300) * 0.3;
      fill   = `rgba(255, 0, 85, ${0.5 + pulse * 0.3})`;
      stroke = COLORS.DENSITY_HIGH_EDGE;
      ctx.shadowColor = COLORS.DENSITY_HIGH_GLOW;
      ctx.shadowBlur  = 12 + pulse * 6;
    } else if (d > DENSITY.MEDIUM) {
      fill   = COLORS.DENSITY_MED;
      stroke = COLORS.DENSITY_MED_EDGE;
      ctx.shadowBlur = 0;
    } else {
      fill   = COLORS.DENSITY_LOW;
      stroke = COLORS.DENSITY_LOW_EDGE;
      ctx.shadowBlur = 0;
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(s.x, s.y, SECTION_RADIUS + 3, 0, Math.PI * 2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Filled section
    ctx.beginPath();
    ctx.arc(s.x, s.y, SECTION_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    // Label
    ctx.fillStyle    = COLORS.TEXT_WHITE;
    ctx.font         = 'bold 9px Courier';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.id.split(' ')[1], s.x, s.y - 2);

    // Density percentage below
    ctx.fillStyle = d > DENSITY.HIGH ? '#ff6688' : 'rgba(255,255,255,0.4)';
    ctx.font = '7px monospace';
    ctx.fillText(`${(d * 100).toFixed(0)}%`, s.x, s.y + 9);
  });
}

/** Draw POI markers (concessions & restrooms). */
function drawPOIs(ctx, concessions, restrooms) {
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';

  concessions.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 9, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(171, 71, 188, 0.35)';
    ctx.strokeStyle = COLORS.NEON_PURPLE;
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.TEXT_WHITE;
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('F', c.x, c.y);
  });

  restrooms.forEach(r => {
    ctx.beginPath();
    ctx.arc(r.x, r.y, 9, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(0, 240, 255, 0.12)';
    ctx.strokeStyle = COLORS.NEON_CYAN;
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = COLORS.TEXT_WHITE;
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('R', r.x, r.y);
  });
}

/** Draw gates with status effects. */
function drawGates(ctx, gates, evacActive) {
  const time = Date.now();

  gates.forEach(g => {
    let fillColor   = COLORS.GATE_DEFAULT_FILL;
    let strokeColor = COLORS.GATE_DEFAULT_STROKE;
    let lineWidth   = 1.5;

    if (g.status === 'CONGESTED') {
      fillColor   = COLORS.GATE_CONGESTED_FILL;
      strokeColor = COLORS.GATE_CONGESTED;
      lineWidth   = 3;

      // Double pulsing ring
      for (let i = 0; i < 2; i++) {
        const phase = (time + i * 500) % 1000;
        const rPulse = GATE_RADIUS + phase / 25;
        const alpha  = 0.4 * (1 - phase / 1000);
        ctx.beginPath();
        ctx.arc(g.x, g.y, rPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 0, 85, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (evacActive) {
      fillColor   = COLORS.GATE_EVAC_FILL;
      strokeColor = COLORS.GATE_EVAC;
      lineWidth   = 3;

      // Animated outward arrow with chevron
      const angle = Math.atan2(g.y - CENTER.y, g.x - CENTER.x);
      const arrowLen = 30 + Math.sin(time / 200) * 8;
      const endX = g.x + Math.cos(angle) * arrowLen;
      const endY = g.y + Math.sin(angle) * arrowLen;

      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = COLORS.GATE_EVAC;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Arrowhead
      const headLen = 8;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headLen * Math.cos(angle - 0.4), endY - headLen * Math.sin(angle - 0.4));
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headLen * Math.cos(angle + 0.4), endY - headLen * Math.sin(angle + 0.4));
      ctx.stroke();
    }

    // Gate circle
    ctx.beginPath();
    ctx.arc(g.x, g.y, GATE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle   = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = lineWidth;
    ctx.fill();
    ctx.stroke();

    // Gate icon/label
    ctx.fillStyle = COLORS.TEXT_WHITE;
    ctx.font      = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(g.id.split(' ')[1], g.x, g.y - 3);

    // Security count
    ctx.fillStyle = COLORS.TEXT_MUTED;
    ctx.font      = '8px monospace';
    ctx.fillText(`⛨ ${g.security_allocation}`, g.x, g.y + 9);
  });
}

/** Update and draw crowd-flow particles. */
function drawParticles(ctx, particles, sections, bottleneckActive) {
  particles.forEach(p => {
    const target = sections[p.targetIdx];
    const dx = target.x - p.x;
    const dy = target.y - p.y;
    const dist = Math.hypot(dx, dy);

    if (p.x === 0 && p.y === 0) {
      p.x = CENTER.x + Math.cos(p.angle) * 180;
      p.y = CENTER.y + Math.sin(p.angle) * 130;
    }

    if (dist < 10) {
      p.targetIdx = Math.floor(Math.random() * sections.length);
    } else {
      const speed = bottleneckActive && Math.hypot(p.x - 310, p.y - 440) < 60
        ? p.speed * 0.3   // slow down near bottleneck
        : p.speed;
      p.x += (dx / dist) * speed;
      p.y += (dy / dist) * speed;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

    if (bottleneckActive && Math.hypot(p.x - 310, p.y - 440) < 60) {
      ctx.fillStyle = COLORS.NEON_RED;
    } else {
      ctx.fillStyle = COLORS.PARTICLE;
    }
    ctx.fill();
  });
}

/** Draw the map legend in the bottom-left corner. */
function drawLegend(ctx, h) {
  const x = 15, y = h - 95;

  ctx.fillStyle = 'rgba(10, 11, 14, 0.85)';
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, 130, 85, 6);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 9px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.textAlign = 'left';
  ctx.fillText('MAP LEGEND', x + 8, y + 14);

  const items = [
    { color: COLORS.DENSITY_LOW,  label: 'Low Density (<50%)' },
    { color: COLORS.DENSITY_MED,  label: 'Medium (50-80%)' },
    { color: COLORS.DENSITY_HIGH, label: 'Critical (>80%)' },
    { color: COLORS.NEON_PURPLE,  label: 'Concession Stand' },
  ];

  ctx.font = '8px sans-serif';
  items.forEach((item, i) => {
    const iy = y + 28 + i * 15;
    ctx.beginPath();
    ctx.arc(x + 14, iy, 4, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(item.label, x + 24, iy + 3);
  });
}

/** Draw weather (retractable roof dome + rain animation + storm effects). */
function drawWeather(ctx, w, h, weatherActive) {
  if (!weatherActive) return;
  const time = Date.now();

  // 1. Draw structural glass dome over pitch
  ctx.beginPath();
  ctx.ellipse(400, 300, 190, 135, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 240, 255, 0.06)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.fill();
  ctx.stroke();

  // Draw dome grids
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 0.5;
  for (let angle = 0; angle < Math.PI; angle += Math.PI / 6) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(400 - 190 * cos, 300 - 135 * sin);
    ctx.lineTo(400 + 190 * cos, 300 + 135 * sin);
    ctx.stroke();
  }

  // Draw storm cloud in corner
  ctx.fillStyle = 'rgba(100, 116, 139, 0.8)';
  ctx.beginPath();
  ctx.arc(60, 45, 14, 0, Math.PI * 2);
  ctx.arc(75, 40, 16, 0, Math.PI * 2);
  ctx.arc(90, 46, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('⚡ STORM ALERT', 75, 70);

  // Lightning strike simulation
  if (Math.random() < 0.03) {
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(75, 52);
    ctx.lineTo(65, 78);
    ctx.lineTo(78, 72);
    ctx.lineTo(68, 98);
    ctx.stroke();
  }

  // 2. Draw falling rain drips and snow particles across screen
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    const rx = ((i * 37) + 20) % w;
    const ry = ((time * (0.3 + (i % 3) * 0.1) + i * 83) % h);
    
    const distToCenter = Math.hypot(rx - 400, ry - 300);
    if (distToCenter < 180) {
      // Inside the dome structure - draw expanding splash ripples on the glass roof
      if (i % 4 === 0) {
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(rx, ry, 3 + (time % 12) * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      if (i % 2 === 0) {
        // Draw slanted rain streak
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 3, ry + 12);
        ctx.stroke();
      } else {
        // Draw a drifting snowflake
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(rx + Math.sin(time / 500 + i) * 6, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

/** Draw medical emergency dispatcher track with moving ambulance vehicle. */
function drawMedical(ctx, medicalActive) {
  if (!medicalActive) return;
  const time = Date.now();
  const blink = Math.sin(time / 200) > 0;

  // 1. Blink target Sec 105 (x: 550, y: 390)
  ctx.beginPath();
  ctx.arc(550, 390, 24, 0, Math.PI * 2);
  ctx.strokeStyle = blink ? 'var(--neon-red)' : 'rgba(220, 38, 38, 0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw red cross icon
  if (blink) {
    ctx.fillStyle = 'var(--neon-red)';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✚', 550, 350);
  }

  // 2. Draw emergency responder access corridor
  ctx.strokeStyle = 'var(--neon-green)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.lineDashOffset = -time / 30;
  
  ctx.beginPath();
  ctx.moveTo(400, 140);
  ctx.lineTo(490, 160);
  ctx.lineTo(550, 210);
  ctx.lineTo(570, 300);
  ctx.lineTo(550, 390);
  ctx.stroke();
  ctx.setLineDash([]); // reset dash

  // 3. Render moving ambulance along path
  const progress = (time / 3200) % 1.0;
  const points = [
    { x: 400, y: 140 },
    { x: 490, y: 160 },
    { x: 550, y: 210 },
    { x: 570, y: 300 },
    { x: 550, y: 390 }
  ];
  
  const totalSegments = points.length - 1;
  const segment = Math.floor(progress * totalSegments);
  const segProgress = (progress * totalSegments) % 1.0;
  const p1 = points[segment];
  const p2 = points[segment + 1];
  
  const ax = p1.x + (p2.x - p1.x) * segProgress;
  const ay = p1.y + (p2.y - p1.y) * segProgress;

  // Draw ambulance body
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(ax - 9, ay - 6, 18, 12, 3);
  ctx.fill();
  ctx.stroke();

  // Red cross graphic
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText('+', ax, ay + 1);

  // Flashing blue emergency light
  const ambLight = Math.sin(time / 80) > 0;
  ctx.fillStyle = ambLight ? '#00e5ff' : '#2563eb';
  ctx.beginPath();
  ctx.arc(ax, ay - 8, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

/** Draw secure VIP escort pathway with moving limousine convoy. */
function drawVip(ctx, vipActive) {
  if (!vipActive) return;
  const time = Date.now();

  // 1. Draw secure corridor cordon Gate A (400, 70) to Sec 101/102
  ctx.strokeStyle = 'rgba(124, 58, 237, 0.7)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(400, 70);
  ctx.lineTo(400, 135);
  ctx.stroke();

  // Barricades
  ctx.strokeStyle = 'var(--neon-purple)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(355, 100); ctx.lineTo(385, 100);
  ctx.moveTo(415, 100); ctx.lineTo(445, 100);
  ctx.stroke();

  // 2. Render moving limousine convoy
  const progress = (time / 2800) % 1.0;
  const vy = 70 + progress * 65;

  // Limousine body
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(390, vy - 10, 20, 15, 4);
  ctx.fill();
  ctx.stroke();

  // Flashing red/blue strobe lights
  const strobe = Math.sin(time / 90) > 0;
  ctx.fillStyle = strobe ? '#ef4444' : '#3b82f6';
  ctx.beginPath();
  ctx.arc(400, vy - 12, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'var(--text-primary)';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('⭐ VIP convoy', 412, vy + 4);
}

/** Draw concession water depletion warnings. */
function drawWater(ctx, concessions, lowWaterActive) {
  if (!lowWaterActive) return;
  const time = Date.now();
  const blink = Math.sin(time / 220) > 0;

  concessions.forEach(c => {
    if (c.id === 'Concession 108') {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 22, 0, Math.PI * 2);
      ctx.strokeStyle = blink ? 'var(--neon-orange)' : 'rgba(234, 88, 12, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (blink) {
        ctx.fillStyle = 'var(--neon-orange)';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('💧 DEPLETED', c.x, c.y - 18);
      }
    }
  });
}

/** Main render — composes all layers. */
export function renderFrame(ctx, opts) {
  const { 
    stadiumKey, width, height, sections, concessions, restrooms, gates, particles, 
    evacActive, bottleneckActive, weatherActive, medicalActive, vipActive, lowWaterActive 
  } = opts;

  drawBackground(ctx, width, height, stadiumKey);
  drawConnections(ctx, sections, gates);
  drawSections(ctx, sections);
  drawPOIs(ctx, concessions, restrooms);
  drawGates(ctx, gates, evacActive);
  
  // Custom simulation overlays
  drawWeather(ctx, width, height, weatherActive);
  drawMedical(ctx, medicalActive);
  drawVip(ctx, vipActive);
  drawWater(ctx, concessions, lowWaterActive);

  drawParticles(ctx, particles, sections, bottleneckActive);
  drawLegend(ctx, height);
}

/** Create initial particle array. */
export function createParticles(sectionCount, count = CANVAS.PARTICLE_COUNT) {
  return Array.from({ length: count }, () => ({
    x: 0,
    y: 0,
    targetIdx: Math.floor(Math.random() * sectionCount),
    angle: Math.random() * Math.PI * 2,
    speed: 0.5 + Math.random() * 0.5,
    size: 1.5 + Math.random() * 2,
  }));
}
