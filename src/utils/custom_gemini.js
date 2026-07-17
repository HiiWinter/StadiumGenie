// src/utils/custom_gemini.js - Injects system prompts and handles live Gemini API key connection vs. simulated responses

export const SYSTEM_PROMPTS = {
  ops_orchestrator: `You are "Command-Orchestrator", the operations intelligence engine for the stadium.
Your job is to analyze real-time alerts, compute flow mitigations, and draft emergency communications.

GROUNDING RULES:
1. You are provided with:
   - The current incident telemetry (anomaly location, density count, active exits).
   - The official Stadium Evacuation and Crowd Control Manual.
2. You must formulate a traffic diversion strategy. The mathematical formula for traffic diversion target is:
   Target Diverted Traffic = Current Density * 0.25
   Include this calculation in your response.
3. Keep notifications clear, actionable, and calm. Avoid panic-inducing terms.
4. Always output your response in JSON format matching the schema below:

SCHEMA:
{
  "incident_analysis": {
    "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "cause": string,
    "impacted_zones": [string]
  },
  "mitigation_actions": [
    { "action": string, "priority": "IMMEDIATE" | "SECONDARY" }
  ],
  "traffic_diversion": {
    "target_percentage": 25,
    "target_diverted_count": number,
    "suggested_exits": [string]
  },
  "public_announcement": {
    "push_notification_text": string,
    "signage_display_text": string
  }
}`,

  fifa_historian: `You are "Fifa-Historian", a legendary football tactician and sports analytics expert.
Your job is to analyze a given World Cup edition based on its statistics, tactical setups, and iconic players.
Your response must be in JSON format matching the schema.

GROUNDING RULES:
1. Ground your response in the provided statistics (year, host, teams, winner, total goals).
2. Deep dive into the tactical innovations of that specific tournament (e.g. Total Football in 1974, Catenaccio, WW Metodo system, Tiki-Taka, or compact low-blocks).
3. Do not invent key statistics, but write an engaging, professional, and exciting tactical breakdown.
4. Output your response strictly in JSON format matching the schema below:

SCHEMA:
{
  "tactical_breakdown": string,
  "historical_significance": string,
  "era_tactics_title": string,
  "legend_impact_quote": string
}`,

  chatbot: `You are "GenieGuide", the official AI spectator guide for the 2026 FIFA World Cup at MetLife Stadium.
Your job is to answer spectator questions in a friendly, clear, and concise manner.
Ground your responses in the official Stadium Manual (seating layouts, concessions, restrooms, transport schedules, emergency protocols).
Always answer in the user's language. Keep answers under 3 sentences.
Always output in JSON matching the SCHEMA:
{
  "reply": string
}`
};

// Simulated Gemini responses for quick hackathon demonstrations without API Key configuration
export function simulateGemini(type, inputs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === 'ops_orchestrator') {
        const density = inputs.density || 0.85;
        const gate = inputs.gate || "Gate C";
        const divertedCount = Math.round(density * 1000 * 0.25);

        resolve({
          incident_analysis: {
            severity: density > 0.8 ? "HIGH" : "MEDIUM",
            cause: `Sensor flags crowd bottleneck at exit corridor near ${gate}. Density level: ${(density*100).toFixed(0)}%.`,
            impacted_zones: ["Section 108 Corridor", "Concourse Exit C", "Restroom B Area"]
          },
          mitigation_actions: [
            { action: `Dispatch 6 additional stewards from Gate D to ${gate} to guide and partition flows.`, priority: "IMMEDIATE" },
            { action: "Open reserve exit gates at Gate B and Gate D.", priority: "IMMEDIATE" },
            { action: "Set directional concession digital displays to show alternative paths.", priority: "SECONDARY" }
          ],
          traffic_diversion: {
            target_percentage: 25,
            target_diverted_count: divertedCount,
            suggested_exits: ["Gate B", "Gate D"]
          },
          public_announcement: {
            push_notification_text: `Safety Advisory: Crowd density is high near ${gate}. For your convenience, please use Gate B or Gate D for exiting. Security staff are present to guide you.`,
            signage_display_text: `<- DETOUR: GATE B & GATE D OPEN | EXIT ${gate.toUpperCase()} CONGESTED ->`
          }
        });
      }
      else if (type === 'fifa_historian') {
        const year = inputs.year || 2022;
        const winner = inputs.winner || "Argentina";
        const host = inputs.host || "Qatar";

        const simulatedData = {
          1930: {
            tactical_breakdown: "The inaugural tournament was dominated by the classic 2-3-5 Pyramid formation. Offense was favored heavily, with inside-forwards acting as direct goalscoring threats. Uruguay's compact defensive line led by captain José Nasazzi was the key differentiator against Argentina's raw attacking prowess.",
            historical_significance: "Established football as a truly global spectator sport. The final was played with two different balls (one chosen by Argentina for the first half, one by Uruguay for the second half), highlighting the early era's organizational charm.",
            era_tactics_title: "The Offensive 2-3-5 Pyramid",
            legend_impact_quote: "Guillermo Stábile scored 8 goals in just 4 games, establishing the striker template for generations to come."
          },
          1958: {
            tactical_breakdown: "Brazil revolutionized football by introducing the 4-2-4 formation. This structure provided defensive stability while allowing two midfielders (Didi and Zito) to transition fluidly. Pelé's freedom to drift off the left wing created a prototype for the modern 'false 9' or inside forward.",
            historical_significance: "Brazil's first World Cup victory and the introduction of 17-year-old Pelé. France's Just Fontaine also set the record of 13 goals in a single tournament, which remains unbroken.",
            era_tactics_title: "Brazil's Revolutionary 4-2-4 System",
            legend_impact_quote: "The birth of Jogo Bonito. Pelé and Garrincha together played 40 matches for Brazil and never lost a single one."
          },
          1970: {
            tactical_breakdown: "A celebration of absolute attacking fluid play. Brazil deployed a 4-3-3 shape that morphed into a 4-2-4. Players like Jairzinho, Tostão, Pelé, and Rivelino swapped positions dynamically, overwhelming Italian Catenaccio structures in the final.",
            historical_significance: "Regarded as the peak of classical football. It was the first tournament broadcast in color, bringing the golden yellow of Brazil's jerseys into living rooms worldwide.",
            era_tactics_title: "Dynamic Attacking Fluidity (Jogo Bonito)",
            legend_impact_quote: "Jairzinho became the only player in World Cup history to score in every single round of the tournament."
          },
          1974: {
            tactical_breakdown: "The birth of 'Totaalvoetbal' (Total Football) by Rinus Michels and Johan Cruyff. Outfield players swapped positions fluidly to stretch the pitch. Pressing was highly active, trapping opponents in their own half and forcing quick turnovers.",
            historical_significance: "Though West Germany won the final through defensive resilience and clinical counter-pressing, the tournament is remembered for the Dutch team's tactical philosophy that redefined modern coaching.",
            era_tactics_title: "Total Football (Totaalvoetbal)",
            legend_impact_quote: "Johan Cruyff orchestrated play like a conductor, mapping space visually and altering coordinates in real-time."
          },
          1986: {
            tactical_breakdown: "Carlos Bilardo introduced a specialized 3-5-2 system for Argentina. By using three central defenders, they locked down opponent wingers, allowing midfielders to push higher. This tactical layout gave Diego Maradona absolute freedom to create and attack.",
            historical_significance: "Diego Maradona's individual tournament performance is widely considered the greatest in sports history. His matches against England and Belgium are legendary tactical masterclasses.",
            era_tactics_title: "The Playmaker-Centric 3-5-2",
            legend_impact_quote: "Maradona completed 53 dribbles during the tournament, accounts for over half of Argentina's total dribbles."
          },
          1998: {
            tactical_breakdown: "Aimé Jacquet deployed a 4-3-2-1 structure, using a double pivot in midfield (Deschamps and Petit) to secure the center. This robust midfield shield protected the backline while giving creative freedom to Zidane to orchestrate attacking sweeps.",
            historical_significance: "France won their first World Cup on home soil. It was the first edition featuring 32 teams, setting the stage for modern high-density tournament groupings.",
            era_tactics_title: "The Midfield Pivot Shield (4-2-3-1)",
            legend_impact_quote: "Zinedine Zidane's two headers in the final demonstrated how box-to-box midfield runs could split deep defensive zones."
          },
          2010: {
            tactical_breakdown: "Spain perfected the 'Tiki-Taka' possession system. They focused on short, quick passes, triangular positioning, and immediately winning back the ball through high counter-pressing. Spain suffocated opponents, controlling tempo and minimizing risk.",
            historical_significance: "Spain's first World Cup win, following their Euro 2008 victory. It was the first tournament hosted on the African continent, highlighting global football integration.",
            era_tactics_title: "Tiki-Taka Possession Dominance",
            legend_impact_quote: "Andrés Iniesta's winning goal in the 116th minute of the final was the ultimate execution of quick, close-range tactical passing."
          },
          2022: {
            tactical_breakdown: "Tactical versatility was the primary theme in Qatar. Finalists Argentina and France shifted shapes dynamically (between 4-3-3, 4-4-2, and 3-5-2). Lionel Messi acted as a deep playmaker, utilizing Enzo Fernández and Rodrigo De Paul to run off-the-ball screens.",
            historical_significance: "Widely regarded as the greatest final in history. Lionel Messi completed his trophy collection, cementing his status as the greatest of all time, while Kylian Mbappé scored the first final hat-trick since 1966.",
            era_tactics_title: "Hybrid Positional Versatility",
            legend_impact_quote: "Lionel Messi became the first player to score in the group stage, round of 16, quarterfinals, semifinals, and final of a single World Cup."
          }
        };

        const defaultResult = {
          tactical_breakdown: `In ${year}, the tournament saw high tactical sophistication. ${winner} utilized structured transitions to unlock compact defenses. Playing on the host soil of ${host}, tactical setups adapted to quick physical recovery cycles.`,
          historical_significance: `This tournament was a milestone in global expansion. It set records in attendance and broadcast metrics, expanding football's footprint.`,
          era_tactics_title: "Positional Transition Play",
          legend_impact_quote: "A tournament defined by athletic excellence, tactical precision, and high-tempo vertical transitions."
        };

        resolve(simulatedData[year] || defaultResult);
      } else {
        // Default fallback for any other type (like 'chatbot')
        resolve({
          reply: `(Offline Simulator) Received your input for ${type}. Live API requires a key.`,
          tactical_breakdown: "Offline Mode",
          historical_significance: "Offline Mode"
        });
      }
    }, 100);
  });
}

// Call live Gemini API using user-provided API key and optional model selection
export async function callLiveGemini(apiKey, type, promptText, model = 'gemini-1.5-flash') {
  const cleanApiKey = (apiKey || '').trim();
  if (!cleanApiKey) {
    throw new Error("API Key is required to call live Gemini service.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const systemInstruction = SYSTEM_PROMPTS[type] || "You are a football analytics expert.";

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: String(promptText || '') }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": cleanApiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(candidateText.trim());
  } catch (err) {
    console.error("Live Gemini Call Failed: ", err.message || err);
    throw err;
  }
}
