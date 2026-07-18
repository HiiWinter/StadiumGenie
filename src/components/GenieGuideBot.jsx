// src/components/GenieGuideBot.jsx - Redesigned Floating Baby Tiger Chatbot Assistant ("Tiggy")
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { callLiveGemini } from '../utils/custom_gemini';
import { STADIUM_MANUAL } from '../data/stadium_manual';

/** Maps internal tab keys to human-readable context labels for the AI assistant */
const TAB_CONTEXT_MAP = {
  twin: 'Stadium Digital Twin (live crowd monitoring & safety operations)',
  viewer: 'Spectator Hub (virtual seat guide & stadium navigation)',
  tournament: 'Tournament Match Centre (live match stats & fixtures)',
  history: 'FIFA World Cup History (tactical eras & legends database)',
  charts: 'FIFA Analytics Charts (data visualizations & insights)',
  settings: 'Application Settings (language, theme, API key configuration)',
  about: 'About StadiumGenie (project information)'
};

const OFFLINE_RESPONSES = {
  en: {
    seats: "You can locate your seat on the 'Virtual Seat Guide' tab! Select your section (Sec 101 to Sec 112) to view the 2D pitch viewpoint, restroom queues, and directions to your nearest exit gate.",
    food: "MetLife Stadium offers great options: Touchdown Tacos (Sec 102), Gridiron Grill (Sec 105), Penalty Pizza (Sec 108), and Corner Kick Coffee (Sec 111). Check the Virtual Seat Guide tab to see live wait times!",
    restroom: "Restrooms are located near Sections 103, 106, 109, and 112. Check the Virtual Seat Guide for live queues. Restroom D near Section 112 usually has shorter wait times!",
    weather: "MetLife Stadium 2026 features a retractable roof dome. In case of extreme weather, the roof is automatically closed and spectators are advised to remain in covered concourses.",
    evac: "In case of emergency evacuation, remain calm. Walk, do not run, to the nearest open Gate (Gates A to F). Gate A connects to Meadowlands Rail Station. Gate D connects to Lot G shuttle buses.",
    transit: "Meadowlands Rail (Gate A) departs every 10 minutes. Shuttle buses (Gate D, Lot G) depart every 5 minutes but currently report a minor 5-minute delay.",
    history: "You can explore all World Cup editions (from Uruguay 1930 to Qatar 2022, plus the live 2026 tourney) under the 'FIFA History' tab, including tactical eras and legends!",
    default: "That is a great question! I recommend exploring the interactive tabs: Stadium Twin (operational safety), Virtual Seat Guide (navigation/seats), or FIFA History (stats & simulator). Let me know if you need specific stadium assistance!"
  },
  es: {
    seats: "¡Puede ubicar su asiento en la pestaña 'Guía de Asiento Virtual'! Seleccione su sección (Sec 101 a 112) para ver la vista virtual del campo, colas de baños y direcciones de salida.",
    food: "MetLife ofrece: Touchdown Tacos (Sec 102), Gridiron Grill (Sec 105), Penalty Pizza (Sec 108) y Corner Kick Coffee (Sec 111). ¡Vea los tiempos de espera en la pestaña de Asientos!",
    restroom: "Los baños están cerca de las secciones 103, 106, 109 y 112. ¡Consulte la pestaña del asiento para ver las colas en tiempo real! ¡El baño D (Sec 112) suele estar más vacío!",
    weather: "El estadio MetLife 2026 tiene un techo retráctil. Si hay clima extremo, el techo se cierra automáticamente y se aconseja quedarse en los pasillos cubiertos.",
    evac: "En caso de evacuación, mantenga la calma. Camine, no corra, hacia la Puerta más cercana (A a F). La Puerta A conecta con el tren Meadowlands. La Puerta D conecta con los autobuses del Lote G.",
    transit: "El tren de Meadowlands (Puerta A) sale cada 10 minutos. Los autobuses (Puerta D, Lote G) salen cada 5 minutos, aunque reportan un pequeño retraso de 5 minutos.",
    history: "¡Puede explorar todas las ediciones de la Copa Mundial (1930-2022 y la de 2026) bajo la pestaña 'Historia de FIFA', incluyendo alineaciones y esquemas tácticos!",
    default: "¡Excelente pregunta! Le recomiendo explorar nuestras pestañas interactivas: Gemelo del Estadio, Guía de Asiento Virtual, o Historia de FIFA. ¡Dígame si necesita ayuda con el estadio!"
  },
  fr: {
    seats: "Vous pouvez localiser votre siège dans l'onglet 'Guide de Siège Virtuel' ! Sélectionnez votre section (Sec 101 à 112) pour voir le point de vue sur le terrain, les files d'attente et l'itinéraire de sortie.",
    food: "Le stade MetLife propose : Touchdown Tacos (Sec 102), Gridiron Grill (Sec 105), Penalty Pizza (Sec 108) et Corner Kick Coffee (Sec 111). Consultez l'onglet Sièges pour les temps d'attente !",
    restroom: "Les toilettes se situent près des sections 103, 106, 109 et 112. Regardez le Guide de Siège pour les files d'attente. Les toilettes D (Sec 112) ont souvent moins d'attente !",
    weather: "Le dôme du stade dispose d'un toit rétractable. En cas de tempête, le dôme est fermé et il est conseillé de s'abriter sous les coursives couvertes.",
    evac: "En cas d'évacuation, restez calme. Marchez vers la porte ouverte la plus proche (Portes A à F). La Porte A mène à la gare Meadowlands. La Porte D mène aux navettes du Parking G.",
    transit: "Le train Meadowlands (Porte A) part toutes les 10 minutes. Les navettes (Porte D, Parking G) partent toutes les 5 minutes (actuellement 5 min de retard signalées).",
    history: "Découvrez toutes les éditions de la Coupe du Monde (1930 à 2022 et le direct 2026) dans l'onglet 'Histoire de la FIFA', avec les systèmes tactiques et les joueurs légendaires !",
    default: "C'est une excellente question ! Je vous invite à parcourir nos onglets : Jumeau du Stade, Guide de Siège Virtuel, ou Histoire de la FIFA. Je reste à votre écoute pour vous guider !"
  },
  pt: {
    seats: "Você pode localizar seu assento na aba 'Guia de Assento Virtual'! Selecione o seu setor (Sec 101 a Sec 112) para ver a vista virtual do campo, filas de banheiros e rotas de saída.",
    food: "O MetLife oferece: Touchdown Tacos (Sec 102), Gridiron Grill (Sec 105), Penalty Pizza (Sec 108) e Corner Kick Coffee (Sec 111). Veja os tempos de espera na aba do Guia de Assento!",
    restroom: "Os banheiros ficam perto dos setores 103, 106, 109 e 112. Veja as filas em tempo real na aba do Guia de Assento. O banheiro D (Sec 112) costuma ter menos fila!",
    weather: "O estádio MetLife 2026 tem teto retrátil. Em caso de chuva forte ou raios, o teto é fechado e recomendamos que permaneça nos corredores cobertos.",
    evac: "Em caso de evacuação de emergência, mantenha a calma. Caminhe até o Portão mais próximo (Portões A a F). O Portão A liga ao trem Meadowlands. O Portão D liga aos ônibus do Lote G.",
    transit: "O trem Meadowlands (Portão A) parte a cada 10 minutos. Os ônibus (Portão D, Lote G) partem a cada 5 minutos, com relato de atraso leve de 5 minutos.",
    history: "Você pode conferir todas as edições da Copa do Mundo (de 1930 a 2022, além de 2026 ao vivo) na aba 'Histórico da FIFA', incluindo táticas e craques de cada época!",
    default: "Esta é uma ótima pergunta! Recomendo explorar as abas interactivas: Gêmeo do Estádio (operações), Guia de Assento (mapas) ou Histórico da FIFA (simulador). Estou à disposição!"
  }
};

export default function GenieGuideBot({ apiKey, locale = 'en', activeTab = 'twin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gemini-1.5-flash");
  const [isRoaring, setIsRoaring] = useState(false);
  const scrollRef = useRef(null);

  const getIntroMessage = (lang) => {
    if (lang === 'es') return "¡Grrr! ¡Bienvenido a StadiumGenie! 🐯 Soy Tiggy, tu cachorro de tigre y asistente virtual. ¿Cómo te puedo ayudar a explorar la Copa Mundial 2026? ¡Rugido! 🐾";
    if (lang === 'fr') return "Grrr ! Bienvenue sur StadiumGenie ! 🐯 Je suis Tiggy, ton bébé tigre assistant. Comment puis-je t'aider pour la Coupe du Monde 2026 ? Rugissement ! 🐾";
    if (lang === 'pt') return "Grrr! Bem-vindo ao StadiumGenie! 🐯 Eu sou o Tiggy, seu filhote de tigre assistente. Como posso te ajudar na Copa do Mundo 2026? Rugido! 🐾";
    return "Grrr! Welcome to StadiumGenie! 🐯 I am Tiggy, your baby tiger virtual assistant. How can I help you navigate the 2026 FIFA World Cup? Roar! 🐾";
  };

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      { sender: 'bot', text: getIntroMessage(locale), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  }, [locale]);

  // Scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendText = async (textToSend) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text: textToSend, time: timeString }]);
    setLoading(true);

    // Trigger Tiger Roar Animation for responsiveness
    setIsRoaring(true);
    setTimeout(() => setIsRoaring(false), 1200);

    // Call live API if key is available, else offline simulated keywords match
    if (apiKey) {
      try {
        const tabContext = TAB_CONTEXT_MAP[activeTab] || 'General Dashboard';
        const promptText = 
          `STADIUM REFERENCE CONTEXT:\n${JSON.stringify(STADIUM_MANUAL)}\n\n` +
          `USER CURRENT PAGE CONTEXT: The user is currently viewing the "${tabContext}" section of the app.\n\n` +
          `USER QUESTION:\n${textToSend}\n\n` +
          `Respond to the user as Tiggy, a playful baby tiger mascot assistant at the FIFA World Cup. Tailor your response to be relevant to their current page context when appropriate. Start or end your response with cute tiger noises (like Grrr, Roar, Purr) and emojis (🐯, 🐾). Answer in the same language as their query: "${locale}".`;
        
        const result = await callLiveGemini(apiKey, 'chatbot', promptText, model);
        const reply = result.reply || JSON.stringify(result);
        
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: timeString }]);
      } catch (err) {
        console.warn("Gemini chatbot error:", err?.message || err);
        const offlineReply = getOfflineReply(textToSend, locale);
        setMessages(prev => [...prev, { sender: 'bot', text: `[API Error] Fallback: ${offlineReply}`, time: timeString }]);
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate think delay
      setTimeout(() => {
        const reply = getOfflineReply(textToSend, locale);
        setMessages(prev => [...prev, { sender: 'bot', text: reply, time: timeString }]);
        setLoading(false);
      }, 700);
    }
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;
    setInputVal("");
    handleSendText(query);
  };

  const handleQuickPrompt = (query) => {
    handleSendText(query);
  };

  const getOfflineReply = (query, lang) => {
    const q = query.toLowerCase();
    const repo = OFFLINE_RESPONSES[lang] || OFFLINE_RESPONSES.en;
    let baseResponse = repo.default;

    if (q.includes("seat") || q.includes("asiento") || q.includes("siege") || q.includes("assento") || q.includes("view") || q.includes("vista") || q.includes("ticket") || q.includes("boleto") || q.includes("billet")) {
      baseResponse = repo.seats;
    } else if (q.includes("food") || q.includes("pizza") || q.includes("burger") || q.includes("taco") || q.includes("beer") || q.includes("coca") || q.includes("water") || q.includes("comida") || q.includes("lanchonete") || q.includes("nourriture") || q.includes("buvette")) {
      baseResponse = repo.food;
    } else if (q.includes("restroom") || q.includes("toilet") || q.includes("bath") || q.includes("baño") || q.includes("toilettes") || q.includes("sanitarios") || q.includes("w.c") || q.includes("wc")) {
      baseResponse = repo.restroom;
    } else if (q.includes("weather") || q.includes("rain") || q.includes("roof") || q.includes("clima") || q.includes("lluvia") || q.includes("pluie") || q.includes("chuva") || q.includes("domo") || q.includes("toit")) {
      baseResponse = repo.weather;
    } else if (q.includes("evac") || q.includes("exit") || q.includes("gate") || q.includes("emergenc") || q.includes("salida") || q.includes("porte") || q.includes("portao") || q.includes("danger") || q.includes("alert")) {
      baseResponse = repo.evac;
    } else if (q.includes("train") || q.includes("bus") || q.includes("shuttle") || q.includes("transit") || q.includes("transporte") || q.includes("navette")) {
      baseResponse = repo.transit;
    } else if (q.includes("history") || q.includes("world cup") || q.includes("mundial") || q.includes("messi") || q.includes("mbappe") || q.includes("winner") || q.includes("campeon") || q.includes("1930") || q.includes("2022") || q.includes("2026")) {
      baseResponse = repo.history;
    } else if (q.includes("roar") || q.includes("rugido") || q.includes("rugissement") || q.includes("make tiggy roar")) {
      return "ROOOOOOAAAR!!! 🐯🐾 I am Tiggy, the baby tiger! I hope that scared you just a little bit, haha! Let me know if I can guide you around the stadiums! 🐅";
    }

    const prefixes = {
      en: ["Grrr! 🐯", "Roar! 🐾", "Grrr-eat question! 🐯", "Purr-fect! 🐾"],
      es: ["¡Grrr! 🐯", "¡Rugido! 🐾", "¡Excelente pregunta! 🐯", "¡Perfecto! 🐾"],
      fr: ["Grrr ! 🐯", "Rugissement ! 🐾", "Très bonne question ! 🐯", "Parfait ! 🐾"],
      pt: ["Grrr! 🐯", "Rugido! 🐾", "Ótima pergunta! 🐯", "Perfeito! 🐾"]
    };
    
    const langPrefixes = prefixes[lang] || prefixes.en;
    const randomPrefix = langPrefixes[Math.floor(Math.random() * langPrefixes.length)];
    
    return `${randomPrefix} ${baseResponse} 🐾🐯`;
  };

  const handleReset = () => {
    setMessages([
      { sender: 'bot', text: getIntroMessage(locale), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
  };

  // Simulate scanning a ticket with vision processing
  const handleSimulateTicketScan = () => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, {
      sender: 'user',
      text: "📸 [Camera Ticket Scan]: metlife_stadium_admission_ticket_9284.png",
      time: timeString
    }]);
    setLoading(true);
    setIsRoaring(true);
    setTimeout(() => setIsRoaring(false), 1200);
    
    setTimeout(() => {
      const sections = ["Sec 103", "Sec 106", "Sec 108", "Sec 112"];
      const rows = ["C", "F", "L", "VIP"];
      const seats = ["2", "12", "14", "1"];
      const randIdx = Math.floor(Math.random() * sections.length);
      const chosenSection = sections[randIdx];
      const chosenRow = rows[randIdx];
      const chosenSeat = seats[randIdx];

      window.dispatchEvent(new CustomEvent('ticket_scanned', { 
        detail: { section: chosenSection, row: chosenRow, seat: chosenSeat } 
      }));

      const reply = `🐾 Grrr! Vision Parsing Complete! [Agent: ${model.toUpperCase()}]
      Ticket successfully verified: 
      🏟️ MetLife Stadium — FIFA World Cup 2026 Semi-Final 1
      📍 Seat Location: Section ${chosenSection.split(' ')[1]}, Row ${chosenRow}, Seat ${chosenSeat}.
      
      I have synchronized your Seating Visualizer tab. The 3D viewpoint and restroom/concession wait times are now live! Let me know if you need exit gate routing. Roar! 🐯`;

      setMessages(prev => [...prev, { sender: 'bot', text: reply, time: timeString }]);
      setLoading(false);
    }, 1200);
  };

  // Cute SVG Baby Tiger Head component
  const TigerSVG = () => (
    <svg 
      className={`tiger-svg-container ${isRoaring ? 'tiger-roar-active' : ''}`} 
      viewBox="0 0 60 60" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ears */}
      <g className="tiger-ear-left">
        <circle cx="18" cy="18" r="8" fill="#ff9900" />
        <circle cx="18" cy="18" r="5" fill="#ffcc80" />
      </g>
      <g className="tiger-ear-right">
        <circle cx="42" cy="18" r="8" fill="#ff9900" />
        <circle cx="42" cy="18" r="5" fill="#ffcc80" />
      </g>
      
      {/* Head Base */}
      <circle cx="30" cy="34" r="18" fill="#ff9900" />
      
      {/* Cheeks */}
      <ellipse cx="18" cy="38" rx="5" ry="3" fill="#ffcc80" />
      <ellipse cx="42" cy="38" rx="5" ry="3" fill="#ffcc80" />
      
      {/* Snout */}
      <ellipse cx="30" cy="39" rx="6" ry="4" fill="#ffffff" />
      
      {/* Nose */}
      <polygon points="28,37 32,37 30,39.5" fill="#e57373" />
      
      {/* Mouth */}
      <path className="tiger-mouth" d="M28,41 Q30,43 32,41" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      
      {/* Eyes */}
      <g className="tiger-eye">
        <circle cx="23" cy="31" r="3.5" fill="#111111" />
        <circle cx="22" cy="30" r="1" fill="#ffffff" />
      </g>
      <g className="tiger-eye">
        <circle cx="37" cy="31" r="3.5" fill="#111111" />
        <circle cx="36" cy="30" r="1" fill="#ffffff" />
      </g>
      
      {/* Stripes */}
      <path d="M30,17 L30,22" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27,19 L28,23" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33,19 L32,23" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12,32 L16,33" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11,36 L15,36" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M48,32 L44,33" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M49,36 L45,36" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="genie-chatbot-widget">
      
      {/* Floating Toggle Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Tiggy"
        aria-label={isOpen ? "Close Tiggy chat assistant" : "Open Tiggy chat assistant"}
      >
        {isOpen ? (
          <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 153, 0, 0.2)', borderRadius: '50%', border: '1.5px solid var(--neon-orange)' }}>
            <i className="fa-solid fa-xmark" style={{ fontSize: 24, color: 'var(--neon-orange)' }} />
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <TigerSVG />
            <span className="pulse-dot-unread" />
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chatbot-window-panel glass-card" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', boxShadow: 'var(--glass-shadow)' }}>
          
          {/* Header */}
          <div className="chat-panel-header" style={{ borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px' }}>
            <div className="chat-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(255, 153, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="24" fill="#ff9900" />
                  <circle cx="23" cy="28" r="3" fill="#111" />
                  <circle cx="37" cy="28" r="3" fill="#111" />
                  <ellipse cx="30" cy="36" rx="5" ry="3" fill="#fff" />
                  <polygon points="29,34 31,34 30,35.5" fill="#e57373" />
                </svg>
              </div>
              <div>
                <h5 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 13, fontWeight: 700 }}>Tiggy</h5>
                <span style={{ color: 'var(--neon-orange)', fontSize: 9, fontFamily: 'var(--font-mono)' }}>FIFA BABY TIGER BOT</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  color: 'var(--text-primary)',
                  fontSize: 10,
                  padding: '2px 4px',
                  borderRadius: 4,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash ⚡</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro 🧠</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash 🚀</option>
              </select>
              <button className="chat-header-btn" onClick={handleReset} title="Reset Chat" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-rotate-right" />
              </button>
              <button className="chat-header-btn close" onClick={() => setIsOpen(false)} aria-label="Close chat" style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fa-solid fa-times" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="tiger-quick-actions" style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 153, 0, 0.02)' }}>
            <button className="tiger-action-btn" type="button" onClick={() => handleQuickPrompt("Show me exit gates info")}>
              🚨 exit gates
            </button>
            <button className="tiger-action-btn" type="button" onClick={() => handleQuickPrompt("Where are food concessions?")}>
              🍔 food stalls
            </button>
            <button className="tiger-action-btn" type="button" onClick={() => handleQuickPrompt("Check restroom wait times")}>
              🚻 restrooms
            </button>
            <button className="tiger-action-btn" type="button" onClick={() => handleQuickPrompt("Make Tiggy roar!")}>
              🐯 roar!
            </button>
          </div>

          {/* Messages Feed */}
          <div className="chat-messages-container" role="log" aria-live="polite" aria-relevant="additions" style={{ padding: 12, height: 260, overflowY: 'auto' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message-bubble-wrap ${msg.sender}`} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div className="bubble" style={{
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, var(--neon-cyan), rgba(2, 132, 199, 0.4))' : 'rgba(255, 255, 255, 0.04)',
                  border: msg.sender === 'user' ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  padding: '8px 12px',
                  maxWidth: '85%',
                  boxShadow: msg.sender === 'user' ? '0 4px 10px rgba(0, 240, 255, 0.1)' : 'none'
                }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: 11.5, color: '#fff', lineHeight: 1.4 }}>{msg.text}</p>
                  <span className="timestamp" style={{ fontSize: 8, color: 'var(--text-secondary)', display: 'block', textAlign: 'right', marginTop: 4 }}>{msg.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message-bubble-wrap bot" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
                <div className="bubble typing-indicator-bubble" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '8px 12px' }}>
                  <div className="typing-dots" style={{ display: 'flex', gap: 4 }}>
                    <span style={{ width: 5, height: 5, background: 'var(--neon-orange)', borderRadius: '50%', animation: 'banner-dot-pulse 1s infinite alternate' }} />
                    <span style={{ width: 5, height: 5, background: 'var(--neon-orange)', borderRadius: '50%', animation: 'banner-dot-pulse 1s infinite alternate 0.2s' }} />
                    <span style={{ width: 5, height: 5, background: 'var(--neon-orange)', borderRadius: '50%', animation: 'banner-dot-pulse 1s infinite alternate 0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Form Input */}
          <form className="chat-input-bar-wrap" onSubmit={handleSend} style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-sidebar)', padding: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <button 
              type="button" 
              onClick={handleSimulateTicketScan}
              className="chat-header-btn"
              style={{ color: 'var(--neon-orange)', background: 'none', border: 'none', padding: '0 4px 0 0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Simulate Ticket Scanner"
            >
              <i className="fa-solid fa-camera" style={{ fontSize: 16 }} />
            </button>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={locale === 'es' ? 'Pregúntale a Tiggy...' : 'Ask Tiggy...'}
              className="chat-input-box"
              style={{
                flex: 1,
                background: 'var(--bg-input)',
                border: '1px solid var(--border-input)',
                borderRadius: 20,
                padding: '8px 14px',
                color: 'var(--text-primary)',
                fontSize: 11,
                outline: 'none'
              }}
            />
            <button type="submit" className="chat-send-btn" disabled={!inputVal.trim()} style={{ background: 'var(--neon-orange)', border: 'none', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: inputVal.trim() ? 1 : 0.5 }}>
              <i className="fa-solid fa-paper-plane" style={{ color: '#000', fontSize: 11 }} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}

GenieGuideBot.propTypes = {
  apiKey: PropTypes.string,
  locale: PropTypes.string,
  activeTab: PropTypes.string
};
