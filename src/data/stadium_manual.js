// src/data/stadium_manual.js - FIFA World Cup 2026 Stadium Reference Manual

export const STADIUM_MANUAL = {
  stadium_name: "MetLife Stadium 2026 (New York/New Jersey)",
  capacity: 82500,
  layout: {
    gates: [
      { id: "Gate A", name: "MetLife Gate (North)", x: 400, y: 70, status: "OPEN", security_allocation: 12 },
      { id: "Gate B", name: "Verizon Gate (North-East)", x: 620, y: 180, status: "OPEN", security_allocation: 8 },
      { id: "Gate C", name: "HCLTech Gate (South-East)", x: 620, y: 420, status: "OPEN", security_allocation: 10 },
      { id: "Gate D", name: "Pepsi Gate (South)", x: 400, y: 530, status: "OPEN", security_allocation: 15 },
      { id: "Gate E", name: "Bud Light Gate (South-West)", x: 180, y: 420, status: "OPEN", security_allocation: 8 },
      { id: "Gate F", name: "Welch's Gate (North-West)", x: 180, y: 180, status: "OPEN", security_allocation: 9 }
    ],
    sections: [
      { id: "Sec 101", x: 400, y: 140, floor: 1, capacity: 500, current_density: 0.15 },
      { id: "Sec 102", x: 490, y: 160, floor: 1, capacity: 600, current_density: 0.20 },
      { id: "Sec 103", x: 550, y: 210, floor: 1, capacity: 550, current_density: 0.18 },
      { id: "Sec 104", x: 570, y: 300, floor: 1, capacity: 700, current_density: 0.25 },
      { id: "Sec 105", x: 550, y: 390, floor: 1, capacity: 550, current_density: 0.30 },
      { id: "Sec 106", x: 490, y: 440, floor: 1, capacity: 600, current_density: 0.35 },
      { id: "Sec 107", x: 400, y: 460, floor: 1, capacity: 500, current_density: 0.40 },
      { id: "Sec 108", x: 310, y: 440, floor: 1, capacity: 600, current_density: 0.75 },
      { id: "Sec 109", x: 250, y: 390, floor: 1, capacity: 550, current_density: 0.85 },
      { id: "Sec 110", x: 230, y: 300, floor: 1, capacity: 700, current_density: 0.45 },
      { id: "Sec 111", x: 250, y: 210, floor: 1, capacity: 550, current_density: 0.22 },
      { id: "Sec 112", x: 310, y: 160, floor: 1, capacity: 600, current_density: 0.14 }
    ],
    concessions: [
      { id: "Concession 102", name: "Touchdown Tacos", section: "Sec 102", type: "Food", items: ["Tacos ($12)", "Nachos ($10)", "Soda ($6)", "Bottled Water ($5)"], service_rate_per_min: 4, line_count: 8, x: 495, y: 125, stock: { "Tacos": 120, "Nachos": 90, "Soda": 300, "Bottled Water": 15 } },
      { id: "Concession 105", name: "Gridiron Grill", section: "Sec 105", type: "Food", items: ["Burger ($14)", "Hot Dog ($9)", "Fries ($6)", "Beer ($15)", "Soda ($6)", "Bottled Water ($5)"], service_rate_per_min: 3, line_count: 14, x: 575, y: 410, stock: { "Burger": 80, "Hot Dog": 150, "Fries": 200, "Beer": 250, "Soda": 400, "Bottled Water": 120 } },
      { id: "Concession 108", name: "Penalty Pizza", section: "Sec 108", type: "Food", items: ["Pizza Slice ($8)", "Pretzel ($7)", "Soda ($6)", "Bottled Water ($5)"], service_rate_per_min: 5, line_count: 22, x: 290, y: 460, stock: { "Pizza Slice": 40, "Pretzel": 100, "Soda": 150, "Bottled Water": 8 } },
      { id: "Concession 111", name: "Corner Kick Coffee", section: "Sec 111", type: "Beverages", items: ["Coffee ($6)", "Donut ($4)", "Soda ($6)", "Bottled Water ($5)"], service_rate_per_min: 6, line_count: 5, x: 230, y: 190, stock: { "Coffee": 300, "Donut": 120, "Soda": 200, "Bottled Water": 180 } }
    ],
    restrooms: [
      { id: "Restroom A", section: "Sec 103", gender: "All-Gender", service_rate_per_min: 8, line_count: 6, x: 560, y: 175 },
      { id: "Restroom B", section: "Sec 106", gender: "All-Gender", service_rate_per_min: 10, line_count: 25, x: 510, y: 460 },
      { id: "Restroom C", section: "Sec 109", gender: "All-Gender", service_rate_per_min: 7, line_count: 18, x: 215, y: 410 },
      { id: "Restroom D", section: "Sec 112", gender: "All-Gender", service_rate_per_min: 9, line_count: 3, x: 295, y: 135 }
    ]
  },
  emergency_protocols: {
    crowd_bottleneck: {
      alert_threshold: 0.70,
      actions: [
        "Notify nearby security stewards to redirect incoming spectators.",
        "Update digital signage at the affected gate to guide fans to adjacent exits.",
        "Send localized push notifications to fans inside the warning zone.",
        "Divert at least 25% of active traffic flow to the closest secondary exit."
      ],
      announcements: {
        en: "ATTENTION: High crowd density detected at Gate C/Section 108. Please proceed to Gate D or Gate B to exit or move. Follow steward instructions.",
        es: "ATENCIÓN: Alta densidad de multitud detectada en la Puerta C/Sección 108. Por favor, diríjase a la Puerta D o B para salir. Siga las instrucciones del personal.",
        jp: "ご注意：ゲートC/セクション108付近で混雑が発生しています。退場または移動の際はゲートDまたはゲートBへお進みください。係員の指示に従ってください。"
      }
    },
    evacuation: {
      alert_level: "CRITICAL",
      actions: [
        "Open all gates immediately.",
        "Disable entry turnstiles and mark them as exits.",
        "Flash emergency red lights and play auditory guide signals.",
        "Divert traffic evenly across all 6 gates: Target flow rate = 13,750 people per gate."
      ],
      announcements: {
        en: "EMERGENCY: Please evacuate the stadium immediately through the nearest open exit. Walk, do not run. Follow safety personnel.",
        es: "EMERGENCIA: Evacue el estadio de inmediato por la salida abierta más cercana. Camine, no corra. Siga al personal de seguridad.",
        jp: "緊急避難：最寄りの避難口から直ちに避難してください。走らずに歩いて、安全管理スタッフの指示に従ってください。"
      }
    }
  },
  transport_schedule: {
    train: {
      name: "NJ Transit Meadowlands Rail",
      frequency_minutes: 10,
      next_departures: ["10:15 PM", "10:25 PM", "10:35 PM", "10:45 PM"],
      status: "ON_TIME",
      boarding_location: "Meadowlands Station (Exit Gate A)"
    },
    shuttle: {
      name: "Metropolitan Shuttle Service",
      frequency_minutes: 5,
      next_departures: ["10:12 PM", "10:17 PM", "10:22 PM", "10:27 PM"],
      status: "DELAYED_5_MIN",
      boarding_location: "Lot G (Exit Gate D)"
    }
  }
};
