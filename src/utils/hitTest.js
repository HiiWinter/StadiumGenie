// src/utils/hitTest.js - Canvas coordinate hit-detection for the Digital Twin map

import { CANVAS } from './constants';

/**
 * Convert a DOM mouse event to canvas-space coordinates,
 * accounting for CSS scaling.
 */
export function toCanvasCoords(event, canvasEl) {
  const rect = canvasEl.getBoundingClientRect();
  const scaleX = canvasEl.width  / rect.width;
  const scaleY = canvasEl.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top)  * scaleY,
    // Keep raw DOM-relative coords for tooltip positioning
    domX: event.clientX - rect.left,
    domY: event.clientY - rect.top,
  };
}

/**
 * Test which map entity (section / concession / gate) the cursor is over.
 * Returns { type, name, details, domX, domY } or null.
 */
export function hitTestEntities({ x, y, domX, domY }, sections, concessions, gates) {
  // Sections (radius 18)
  for (const sec of sections) {
    if (Math.hypot(sec.x - x, sec.y - y) < CANVAS.SECTION_RADIUS) {
      return {
        type: 'section',
        name: sec.id,
        details: `Floor ${sec.floor} Seating Zone • Density: ${(sec.current_density * 100).toFixed(0)}% • Capacity: ${sec.capacity} fans`,
        domX, domY,
      };
    }
  }

  // Concessions (radius 15)
  for (const conc of concessions) {
    if (Math.hypot(conc.x - x, conc.y - y) < CANVAS.CONCESSION_RADIUS) {
      const waitMins = Math.round(conc.line_count / conc.service_rate_per_min);
      return {
        type: 'concession',
        name: conc.name,
        details: `Concession Stand @ ${conc.section} • Wait: ${waitMins} mins • Queue: ${conc.line_count}`,
        domX, domY,
      };
    }
  }

  // Gates (radius 22)
  for (const gate of gates) {
    if (Math.hypot(gate.x - x, gate.y - y) < CANVAS.GATE_RADIUS) {
      return {
        type: 'gate',
        name: gate.id,
        details: `${gate.name} • Status: ${gate.status} • Security: ${gate.security_allocation} stewards`,
        domX, domY,
      };
    }
  }

  return null;
}
