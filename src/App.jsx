import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import Sidebar from './components/Sidebar';
import GenieGuideBot from './components/GenieGuideBot';
import CelebrationOverlay from './components/CelebrationOverlay';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy loading heavy component tabs for instant initial render & smooth transitions
const StadiumTwin = lazy(() => import('./components/StadiumTwin'));
const SpectatorHub = lazy(() => import('./components/SpectatorHub'));
const TournamentCenter = lazy(() => import('./components/TournamentCenter'));
const FifaHistory = lazy(() => import('./components/FifaHistory'));
const FifaCharts = lazy(() => import('./components/FifaCharts'));
const SettingsTab = lazy(() => import('./components/SettingsTab'));
const AboutTab = lazy(() => import('./components/AboutTab'));

function TabFallbackLoader() {
  return (
    <div className="tab-loading-skeleton" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ height: '36px', width: '240px', borderRadius: '8px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.1), rgba(255,255,255,0.04))', backgroundSize: '200% 100%', animation: 'skeletonShimmer 1.5s infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: '140px', borderRadius: '12px', background: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.1), rgba(255,255,255,0.04))', backgroundSize: '200% 100%', animation: 'skeletonShimmer 1.5s infinite' }} />
        ))}
      </div>
    </div>
  );
}

const BANNER_NEWS = [
  {
    tag: { en: "LIVE NOW", es: "EN VIVO", fr: "EN DIRECT", pt: "AO VIVO" },
    tagColor: "var(--neon-red)",
    headline: {
      en: "Argentina vs France Quarter-final tonight at SoFi Stadium, LA!",
      es: "¡Cuartos de final Argentina vs Francia esta noche en SoFi Stadium, LA!",
      fr: "Quart de finale Argentine vs France ce soir au SoFi Stadium, LA !",
      pt: "Quartas de final Argentina vs França esta noite no SoFi Stadium, LA!"
    },
    details: {
      en: "Lineups locked. Messi and Mbappé face off in a historic World Cup rematch.",
      es: "Alineaciones confirmadas. Messi y Mbappé se enfrentan en una revancha histórica.",
      fr: "Compositions confirmées. Messi et Mbappé s'affrontent dans un match historique.",
      pt: "Escalações confirmadas. Messi e Mbappé se enfrentam em uma revanche histórica."
    },
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "SHOCK UPSET", es: "SORPRESA", fr: "SURPRISE", pt: "SURPRESA" },
    tagColor: "var(--neon-orange)",
    headline: {
      en: "Norway stun Brazil 2-1 to reach historical Quarter-Finals!",
      es: "¡Noruega sorprende a Brasil 2-1 y llega a cuartos de final!",
      fr: "La Norvège surprend le Brésil 2-1 et se qualifie pour les quarts !",
      pt: "Noruega surpreende o Brasil por 2-1 e chega às quartas de final!"
    },
    details: {
      en: "Erling Haaland scores a dramatic 89th-minute penalty to seal victory in Dallas.",
      es: "Erling Haaland anota un penal dramático en el minuto 89 para sellar la victoria.",
      fr: "Erling Haaland marque un penalty à la 89e minute pour sceller la victoire.",
      pt: "Erling Haaland marca um pênalti dramático aos 89 minutos para selar a vitória."
    },
    image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "MATCH DAY", es: "DÍA DE PARTIDO", fr: "JOUR DE MATCH", pt: "DIA de JOGO" },
    tagColor: "var(--neon-cyan)",
    headline: {
      en: "Belgium dismantle USA 4-1 — Kevin De Bruyne masterclass!",
      es: "Bélgica vence a EE. UU. 4-1 — ¡Cátedra de Kevin De Bruyne!",
      fr: "Belgique bat USA 4-1 — Masterclass de Kevin De Bruyne !",
      pt: "Belgique goleia os EUA por 4-1 — Aula de Kevin De Bruyne!"
    },
    details: {
      en: "The Red Devils advance to the quarterfinals behind an inspiring performance.",
      es: "Los Diablos Rojos avanzan a cuartos gracias a una actuación inspiradora.",
      fr: "Les Diables Rouges filent en quarts après une prestation de haut vol.",
      pt: "Os Diabos Vermelhos avançam para as quartas com uma atuação inspiradora."
    },
    image: "https://images.unsplash.com/photo-1579952362864-3b4437de1111?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "OFFICIAL NEWS", es: "NOTICIA OFICIAL", fr: "OFFICIEL", pt: "NOTÍCIA OFICIAL" },
    tagColor: "var(--neon-purple)",
    headline: {
      en: "Record-breaking 3.2 million tickets sold across venues!",
      es: "¡Récord histórico de 3.2 millones de entradas vendidas!",
      fr: "Record de 3,2 millions de billets vendus sur tous les sites !",
      pt: "Recorde de 3,2 milhões de ingressos vendidos em todas as sedes!"
    },
    details: {
      en: "FIFA confirms sold-out status for all upcoming quarter-final stadiums.",
      es: "La FIFA confirma estadios llenos para todos los partidos de cuartos de final.",
      fr: "La FIFA confirme des guichets fermés pour tous les stades des quarts.",
      pt: "A FIFA confirma lotação esgotada para todas as quartas de final."
    },
    image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "TICKET SALE", es: "VENTA DE ENTRADAS", fr: "BILLETERIE", pt: "INGRESSOS" },
    tagColor: "var(--neon-green)",
    headline: {
      en: "Second Phase of Ticket Sales Opens Today!",
      es: "¡Hoy abre la segunda fase de venta de entradas!",
      fr: "La deuxième phase de vente de billets commence aujourd'hui !",
      pt: "A segunda fase de venda de ingressos começa hoje!"
    },
    details: {
      en: "Fans can apply for tickets on the official FIFA website. Massive demand expected.",
      es: "Los fanáticos pueden solicitar entradas en el sitio web de la FIFA. Se espera alta demanda.",
      fr: "Les supporters peuvent demander des billets sur le site officiel. Forte demande attendue.",
      pt: "Os torcedores podem solicitar ingressos no site oficial. Expectativa de grande procura."
    },
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "PREPARATION", es: "PREPARACIÓN", fr: "PRÉPARATION", pt: "PREPARAÇÃO" },
    tagColor: "var(--neon-cyan)",
    headline: {
      en: "USMNT schedules friendly matches against Italy and Uruguay!",
      es: "¡La selección de EE. UU. programa amistosos contra Italia y Uruguay!",
      fr: "L'USMNT programme des matchs amicaux contre l'Italie et l'Uruguay !",
      pt: "A seleção dos EUA agenda amistosos contra Itália e Uruguai!"
    },
    details: {
      en: "Coach plans intensive summer camp to test squad depth before home World Cup.",
      es: "El entrenador planea un campamento intensivo para probar la profundidad del plantel.",
      fr: "Le sélectionneur prévoit un stage intensif pour tester la profondeur de l'effectif.",
      pt: "O técnico planeja um período intensivo de treinos para testar a profundidade do elenco."
    },
    image: "https://images.unsplash.com/photo-1504156806659-288d447c562b?w=450&h=270&fit=crop&q=80"
  },
  {
    tag: { en: "HOST CITIES", es: "SEDES", fr: "VILLES HÔTES", pt: "CIDADES SEDES" },
    tagColor: "var(--neon-orange)",
    headline: {
      en: "Vancouver and Toronto unveil official mascot installations!",
      es: "¡Vancouver y Toronto presentan instalaciones de la mascota oficial!",
      fr: "Vancouver et Toronto dévoilent les installations de la mascotte officielle !",
      pt: "Vancouver e Toronto revelam instalações da mascotte oficial!"
    },
    details: {
      en: "Interactive street exhibitions and fan parks set to launch across host cities.",
      es: "Exposiciones interactivas y parques de fanáticos se lanzarán en las ciudades sede.",
      fr: "Des expositions de rue et des fan zones vont ouvrir dans les villes hôtes.",
      pt: "Exposições interativas e fan zones serão lançadas nas cidades-sede."
    },
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=450&h=270&fit=crop&q=80"
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('twin');
  const [locale, setLocale] = useState('en');
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'dark');
  const [currentNewsIdx, setCurrentNewsIdx] = useState(0);
  
  // Webpage Loader State
  const [loading, setLoading] = useState(true);
  const [loadingYear, setLoadingYear] = useState(1930);
  const [showCelebration, setShowCelebration] = useState(false);

  // Apply theme
  useEffect(() => {
    const rootEl = document.documentElement;
    if (theme === 'dark') {
      rootEl.classList.add('dark-theme');
    } else {
      rootEl.classList.remove('dark-theme');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!localStorage.getItem('app_theme')) {
      localStorage.setItem('app_theme', 'dark');
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    const years = [1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < years.length) {
        setLoadingYear(years[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          setShowCelebration(true);
        }, 200);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewsIdx(prev => (prev + 1) % BANNER_NEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  const handleNextNews = () => {
    setCurrentNewsIdx(prev => (prev + 1) % BANNER_NEWS.length);
  };

  const handlePrevNews = () => {
    setCurrentNewsIdx(prev => (prev - 1 + BANNER_NEWS.length) % BANNER_NEWS.length);
  };

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  if (loading) {
    return (
      <div className="fifa-trophy-loader-screen" style={{
        background: 'radial-gradient(circle at center, #0d1117 0%, #05070a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        zIndex: 9999,
        fontFamily: 'var(--font-display)',
        color: '#fff'
      }}>
        <div className="loader-trophy-container glass-card" style={{
          padding: '40px 50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          maxWidth: '420px',
          border: '1px solid rgba(0, 255, 255, 0.15)',
          background: 'rgba(13, 17, 23, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.02)',
          textAlign: 'center'
        }}>
          {/* Real FIFA World Cup Trophy SVG Representation */}
          <div className="real-trophy-wrapper" style={{ flexShrink: 0 }}>
            <svg viewBox="0 0 100 160" width="180" height="280" className="real-fifa-trophy-svg">
              <defs>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2A3" />
                  <stop offset="30%" stopColor="#F5D34C" />
                  <stop offset="70%" stopColor="#C99318" />
                  <stop offset="100%" stopColor="#7A5408" />
                </linearGradient>
                <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFDF0" />
                  <stop offset="40%" stopColor="#FBE068" />
                  <stop offset="80%" stopColor="#D59B1F" />
                  <stop offset="100%" stopColor="#6C4800" />
                </radialGradient>
                <linearGradient id="goldHighlight" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#7A5408" />
                  <stop offset="25%" stopColor="#C99318" />
                  <stop offset="50%" stopColor="#FFEFA0" />
                  <stop offset="75%" stopColor="#C99318" />
                  <stop offset="100%" stopColor="#7A5408" />
                </linearGradient>
                <linearGradient id="malachiteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0B3C21" />
                  <stop offset="50%" stopColor="#1E8B4C" />
                  <stop offset="100%" stopColor="#0B3C21" />
                </linearGradient>
              </defs>
              
              {/* Bottom-most gold rim */}
              <path d="M 30,150 Q 50,154 70,150 L 68,145 Q 50,148 32,145 Z" fill="url(#goldHighlight)" />
              
              {/* Malachite band 1 (Bottom green ring) */}
              <path d="M 32,145 Q 50,148 68,145 L 66,136 Q 50,139 34,136 Z" fill="url(#malachiteGrad)" stroke="#111" strokeWidth="0.5" />
              
              {/* Middle gold spacer ring */}
              <path d="M 34,136 Q 50,139 66,136 L 65,130 Q 50,133 35,130 Z" fill="url(#goldHighlight)" />
              
              {/* Malachite band 2 (Top green ring) */}
              <path d="M 35,130 Q 50,133 65,130 L 63,121 Q 50,124 37,121 Z" fill="url(#malachiteGrad)" stroke="#111" strokeWidth="0.5" />
              
              {/* Top gold base collar */}
              <path d="M 37,121 Q 50,124 63,121 L 60,112 Q 50,115 40,112 Z" fill="url(#goldHighlight)" />
              
              {/* The Stem / Two Athletes Figures */}
              <path d="M 40,112 C 38,100 32,80 34,70 C 36,60 44,54 44,54 C 44,54 40,65 42,75 C 44,85 50,96 50,112 Z" fill="url(#goldGrad)" />
              <path d="M 60,112 C 62,100 68,80 66,70 C 64,60 56,54 56,54 C 56,54 60,65 58,75 C 56,85 50,96 50,112 Z" fill="url(#goldGrad)" />
              
              {/* Intricate central spiraling lines */}
              <path d="M 42,105 C 45,95 48,80 43,65 C 40,56 46,50 50,45 C 54,50 60,56 57,65 C 52,80 55,95 58,105" fill="none" stroke="url(#goldHighlight)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 46,95 C 48,88 50,75 48,60 C 47,56 53,56 52,60 C 50,75 52,88 54,95" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
              
              {/* Dynamic swooshes wrapped around the body */}
              <path d="M 38,100 C 42,95 46,95 50,102 C 54,95 58,95 62,100" fill="none" stroke="#FFF2A3" strokeWidth="1.5" opacity="0.7" />
              <path d="M 35,85 C 40,80 45,82 50,88 C 55,82 60,80 65,85" fill="none" stroke="#FFF2A3" strokeWidth="1.5" opacity="0.7" />

              {/* The Golden Globe (Earth) at the top */}
              <circle cx="50" cy="40" r="21" fill="url(#goldGlow)" stroke="#7A5408" strokeWidth="0.5" />
              
              {/* Earth Continent Details */}
              <path d="M 36,32 Q 40,30 42,34 Q 45,38 43,45 Q 40,48 41,53 M 43,45 Q 48,46 47,48" fill="none" stroke="#7A5408" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M 52,25 Q 56,22 62,25 Q 65,28 63,35 Q 58,38 56,43 Q 54,48 57,53 Q 63,55 64,58 M 58,35 Q 54,34 52,38" fill="none" stroke="#7A5408" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M 29,40 Q 50,45 71,40" fill="none" stroke="#FFF2A3" strokeWidth="0.75" opacity="0.4" />
              <path d="M 33,30 Q 50,34 67,30" fill="none" stroke="#FFF2A3" strokeWidth="0.75" opacity="0.4" />
              <path d="M 33,50 Q 50,55 67,50" fill="none" stroke="#FFF2A3" strokeWidth="0.75" opacity="0.4" />
            </svg>
          </div>
          
          <div className="loader-year-glowing" style={{ fontSize: '48px', fontWeight: '900', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', textShadow: '0 0 15px var(--neon-cyan), 0 0 30px var(--neon-purple)', margin: '10px 0 0 0', lineHeight: 1 }}>{loadingYear}</div>
          
          <div className="loader-progress-bar-wrap" style={{ width: '280px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div className="loader-progress-bar-fill" style={{ width: `${((loadingYear - 1930) / (2026 - 1930)) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--neon-purple), var(--neon-cyan))', boxShadow: '0 0 8px var(--neon-cyan)', transition: 'width 0.1s ease-out' }} />
          </div>
          
          <div className="loader-loading-text" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase' }}>Loading Archives...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-to-content" style={{ position: 'absolute', top: '-100px', left: '16px', zIndex: 999999, background: 'var(--neon-cyan)', color: '#000', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', transition: 'top 0.2s' }}>
        Skip to main content
      </a>
      {showCelebration && (
        <CelebrationOverlay onComplete={handleCelebrationComplete} />
      )}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        locale={locale}
        setLocale={setLocale}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
      <main className="app-main-content">
        
        {/* Top Promotional Live Match Banner */}
        {activeTab === 'twin' && (
          <div className="tournament-countdown-banner" style={{ padding: '16px 24px', background: 'transparent' }}>
            <div className="banner-content" style={{
              backgroundImage: `linear-gradient(to right, rgba(6, 7, 9, 0.9) 25%, rgba(6, 7, 9, 0.3) 70%, rgba(6, 7, 9, 0.95) 100%), url(${BANNER_NEWS[currentNewsIdx].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'var(--glass-shadow)'
            }}>
              <button className="banner-nav-btn prev" onClick={handlePrevNews} aria-label="Previous News" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(13, 17, 23, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', transition: 'all 0.25s' }}>
                <i className="fa-solid fa-chevron-left" style={{ fontSize: '14px' }} />
              </button>
              
              <div className="banner-slide-wrap" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 70px',
                width: '100%',
                minHeight: '140px',
                position: 'relative'
              }}>
                <div className="banner-slide-text" style={{ zIndex: 2 }}>
                  <span className="banner-pulse" style={{ background: `${BANNER_NEWS[currentNewsIdx].tagColor}15`, color: BANNER_NEWS[currentNewsIdx].tagColor, border: `1px solid ${BANNER_NEWS[currentNewsIdx].tagColor}30`, padding: '4px 10px', borderRadius: '20px', fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: BANNER_NEWS[currentNewsIdx].tagColor, display: 'inline-block', boxShadow: `0 0 6px ${BANNER_NEWS[currentNewsIdx].tagColor}` }} /> {BANNER_NEWS[currentNewsIdx].tag[locale] || BANNER_NEWS[currentNewsIdx].tag.en}
                  </span>
                  <div className="banner-headline-group" style={{ marginTop: '12px' }}>
                    <strong style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)', display: 'block' }}>
                      {BANNER_NEWS[currentNewsIdx].headline[locale] || BANNER_NEWS[currentNewsIdx].headline.en}
                    </strong>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px', textShadow: '0 1px 4px rgba(0,0,0,0.8)', maxWidth: '80%', lineHeight: '1.4' }}>
                      {BANNER_NEWS[currentNewsIdx].details[locale] || BANNER_NEWS[currentNewsIdx].details.en}
                    </p>
                  </div>
                </div>
              </div>

              <button className="banner-nav-btn next" onClick={handleNextNews} aria-label="Next News" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(13, 17, 23, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', transition: 'all 0.25s' }}>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '14px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Tab rendering: Render active tab on demand with ErrorBoundary & Suspense lazy loading */}
        <div id="main-content" tabIndex="-1" className="tab-render-wrapper tab-fade-in" key={activeTab} style={{ height: '100%' }}>
          <ErrorBoundary>
            <Suspense fallback={<TabFallbackLoader />}>
              {activeTab === 'twin' && <StadiumTwin apiKey={apiKey} locale={locale} />}
              {activeTab === 'viewer' && <SpectatorHub locale={locale} />}
              {activeTab === 'tournament' && <TournamentCenter locale={locale} />}
              {activeTab === 'history' && <FifaHistory apiKey={apiKey} locale={locale} />}
              {activeTab === 'charts' && <FifaCharts locale={locale} />}
              {activeTab === 'settings' && <SettingsTab locale={locale} setLocale={setLocale} theme={theme} setTheme={setTheme} />}
              {activeTab === 'about' && <AboutTab />}
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {/* Floating AI Spectator Companion */}
      <GenieGuideBot apiKey={apiKey} locale={locale} activeTab={activeTab} />
    </div>
  );
}

export default App;
