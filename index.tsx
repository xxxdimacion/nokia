import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

// --- Types ---
interface Guide {
  id: number;
  title: string;
  description: string;
  url: string;
}

// --- Data ---
const GUIDES: Guide[] = [
  {
    id: 1,
    title: "СТАРТ НОВИЧКА",
    description: "Основы игры",
    url: "#guide1",
  },
  {
    id: 2,
    title: "ТАКТИКИ",
    description: "Секреты про",
    url: "#guide2",
  },
  {
    id: 3,
    title: "ФАРМ",
    description: "Где искать",
    url: "#guide3",
  },
  {
    id: 4,
    title: "БОССЫ",
    description: "Разбор механик",
    url: "#guide4",
  },
];

const TELEGRAM_CHANNEL_URL = "https://t.me/+BTuTG45GQ7w3Mjhi";

// --- Audio ---
const playClickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // High pitched square wave for that "digital" 2000s phone feel
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(1000, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors (e.g. if user hasn't interacted yet)
    console.error(e);
  }
};

// --- Styles ---

const Styles = () => (
  <style>{`
    :root {
      /* Nokia 3310 "Dark Mode" Palette */
      --nokia-bg: #43523d;       /* Dark Swamp Green Background */
      --nokia-fg: #c7f0d8;       /* Light LCD Green Text */
      --nokia-case: #3a4a5e;     /* Classic Navy Blue Case */
      --nokia-case-shadow: #212b36;
      --pixel-grid: rgba(0, 0, 0, 0.15);
      
      /* Button Colors */
      --btn-silver: #e8e8e8;
      --btn-shadow: #999;
      --btn-text: #3a4a5e;
    }

    body {
      background-color: #222;
      color: var(--nokia-fg);
      font-family: 'Press Start 2P', monospace;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      font-size: 10px;
    }

    /* Phone Casing */
    .nokia-case {
      background-color: var(--nokia-case);
      padding: 40px 20px 50px 20px;
      border-radius: 40px 40px 60px 60px;
      box-shadow: 
        inset 5px 5px 15px rgba(255,255,255,0.1),
        inset -5px -5px 15px rgba(0,0,0,0.3),
        10px 10px 30px rgba(0,0,0,0.5);
      border: 4px solid var(--nokia-case-shadow);
      position: relative;
      width: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Faceplate Accent (The grey area around the screen on original 3310) */
    .faceplate-accent {
      width: 110%;
      height: 280px;
      position: absolute;
      top: 30px;
      border-radius: 30px 30px 50px 50px;
      background: rgba(255,255,255,0.05);
      pointer-events: none;
      z-index: 0;
    }

    /* The Screen Glass area */
    .screen-glass {
      background-color: #2a3628;
      padding: 15px 15px;
      border-radius: 15px 15px 25px 25px;
      border: 3px solid #1a2218;
      width: 100%;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
      margin-bottom: 25px; /* Space for Nav Buttons */
      position: relative;
      z-index: 1;
    }

    /* The LCD Display */
    .lcd-display {
      background-color: var(--nokia-bg);
      width: 100%;
      height: 200px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 2px solid rgba(0,0,0,0.2);
    }

    /* Pixel Grid Effect */
    .pixel-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(transparent 2px, var(--pixel-grid) 2px),
        linear-gradient(90deg, transparent 2px, var(--pixel-grid) 2px);
      background-size: 3px 3px;
      pointer-events: none;
      z-index: 10;
      opacity: 0.6;
    }

    /* Typography & Elements */
    h1 {
      font-size: 14px;
      text-transform: uppercase;
      text-align: center;
      margin: 10px 0 15px 0;
      border-bottom: 2px solid var(--nokia-fg);
      padding-bottom: 5px;
      letter-spacing: 1px;
    }

    p {
      line-height: 1.5;
      font-size: 10px;
      text-align: center;
      margin-bottom: 15px;
    }

    /* UI Buttons inside screen */
    .btn {
      display: block;
      width: 100%;
      padding: 12px 5px;
      background: var(--nokia-fg);
      color: var(--nokia-bg);
      font-family: 'Press Start 2P', monospace;
      font-size: 10px;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
      text-align: center;
      border: 2px solid var(--nokia-fg);
      box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
      margin-top: 10px;
    }

    .btn:active {
      transform: translate(2px, 2px);
      box-shadow: none;
    }

    /* Menu Items */
    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 5px;
      overflow-y: auto;
      height: 100%;
    }

    .menu-item {
      display: flex;
      flex-direction: column;
      padding: 8px 4px;
      border: 2px solid transparent;
      color: var(--nokia-fg);
      text-decoration: none;
      cursor: pointer;
    }

    .menu-item:hover {
      background-color: var(--nokia-fg);
      color: var(--nokia-bg);
    }
    
    .menu-item:hover .menu-desc {
      color: var(--nokia-bg);
    }

    .menu-title {
      font-size: 10px;
      font-weight: bold;
    }
    
    .menu-desc {
      font-size: 8px;
      opacity: 0.8;
      margin-top: 4px;
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 4px;
      border-bottom: 2px solid var(--nokia-fg);
      margin-bottom: 5px;
      height: 18px;
    }

    .signal, .battery {
      display: flex;
      gap: 1px;
      align-items: flex-end;
      height: 8px;
    }
    
    .bar {
      width: 2px;
      background-color: var(--nokia-fg);
    }
    .bar-1 { height: 2px; }
    .bar-2 { height: 4px; }
    .bar-3 { height: 6px; }
    .bar-4 { height: 8px; }
    
    .battery-box {
      width: 12px;
      height: 6px;
      border: 1px solid var(--nokia-fg);
      padding: 1px;
      display: flex;
    }
    .battery-fill {
      width: 100%;
      height: 100%;
      background-color: var(--nokia-fg);
    }

    /* Nokia Logo */
    .nokia-logo {
      font-family: sans-serif;
      font-weight: 900;
      color: #8899a6;
      letter-spacing: 2px;
      font-size: 16px;
      margin-bottom: 10px;
      text-align: center;
      opacity: 0.7;
    }

    /* --- PHYSICAL BUTTONS STYLING --- */

    .control-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 90%;
      margin-bottom: 20px;
      padding: 0 10px;
      z-index: 2;
    }

    /* The 'C' Button */
    .btn-c-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .btn-c {
      width: 35px;
      height: 25px;
      background: linear-gradient(180deg, #fff 0%, #ccc 100%);
      border: 1px solid #aaa;
      border-bottom: 3px solid #888;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: sans-serif;
      font-weight: bold;
      color: var(--btn-text);
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 2px 3px rgba(0,0,0,0.2);
      user-select: none;
    }
    .btn-c:active { transform: translateY(2px); border-bottom-width: 1px; }

    /* The Big Navi Key */
    .btn-navi {
      width: 90px;
      height: 35px;
      background: linear-gradient(180deg, #f8f8f8 0%, #d8d8d8 100%);
      border: 1px solid #bbb;
      border-bottom: 4px solid #999;
      border-radius: 10px 10px 20px 20px; /* Distinctive Navi Key shape */
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 3px 5px rgba(0,0,0,0.2);
      user-select: none;
    }
    .btn-navi-line {
      width: 40px;
      height: 4px;
      background-color: #3a75ba; /* Classic Nokia Blue accent */
      border-radius: 2px;
    }
    .btn-navi:active { transform: translateY(2px); border-bottom-width: 2px; }

    /* The Arrow Buttons */
    .btn-arrows {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .arrow-key {
      width: 30px;
      height: 20px;
      background: linear-gradient(180deg, #fff 0%, #ccc 100%);
      border: 1px solid #aaa;
      border-bottom: 3px solid #888;
      border-radius: 8px; /* Slightly squarer than C */
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      color: var(--btn-text);
      cursor: pointer;
      user-select: none;
    }
    .arrow-key:active { transform: translateY(2px); border-bottom-width: 1px; }

    /* The Keypad */
    .keypad {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px 15px; /* Spacing between keys */
      width: 85%;
      z-index: 2;
    }
    
    .key {
      height: 35px;
      background: linear-gradient(180deg, #f0f0f0 0%, #ccc 100%); /* Silver rubbery look */
      border: 1px solid #bbb;
      border-bottom: 4px solid #888;
      border-radius: 14px 14px 18px 18px; /* Pill shape */
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
      user-select: none;
    }
    
    .key:active {
      transform: translateY(2px);
      border-bottom-width: 2px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .key-num {
      font-family: Arial, sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: #333;
      line-height: 1;
    }
    
    .key-letters {
      font-family: Arial, sans-serif;
      font-size: 8px;
      font-weight: 600;
      color: #666;
      margin-top: 2px;
      letter-spacing: 1px;
    }

    /* Scrollbar override for webkit */
    ::-webkit-scrollbar {
      width: 4px;
    }
    ::-webkit-scrollbar-track {
      background: var(--nokia-bg); 
    }
    ::-webkit-scrollbar-thumb {
      background: var(--nokia-fg); 
    }

  `}</style>
);

// --- Components ---

const StatusBar = () => {
  const [time, setTime] = useState("12:00");
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="status-bar">
      <div className="signal">
        <div className="bar bar-1"></div>
        <div className="bar bar-2"></div>
        <div className="bar bar-3"></div>
        <div className="bar bar-4"></div>
      </div>
      <div style={{fontSize: '10px'}}>{time}</div>
      <div className="battery">
        <div className="battery-box">
           <div className="battery-fill"></div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionGate = ({ onSubscribe }: { onSubscribe: () => void }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      alignItems: 'center',
      paddingTop: '20px'
    }}>
      <h1 style={{ marginBottom: '5px' }}>ВНИМАНИЕ</h1>
      <p style={{ margin: '0 0 10px 0' }}>ДОСТУП ЗАКРЫТ</p>
      
      {/* Replaced exclamation mark with the subscription button */}
      <a 
        href={TELEGRAM_CHANNEL_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn"
        style={{
          width: '90%',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '10px 0',
          fontSize: '12px'
        }}
        onClick={() => {
          playClickSound();
          setTimeout(onSubscribe, 2000);
        }}
      >
        TELEGRAM
      </a>
      
      <p style={{fontSize: '8px', marginTop: '5px', opacity: 0.8}}>
        ПОДПИШИСЬ ЧТОБЫ ВОЙТИ
      </p>
    </div>
  );
};

const GuideMenu = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
        МЕНЮ
      </div>
      <div className="menu-list">
        {GUIDES.map((guide) => (
          <a key={guide.id} href={guide.url} className="menu-item" onClick={playClickSound}>
            <span className="menu-title">{guide.id}. {guide.title}</span>
            <span className="menu-desc">{guide.description}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check local storage if needed
  }, []);

  const handleSubscribe = () => {
    setIsSubscribed(true);
  };

  const keypadKeys = [
    { num: '1', letters: 'o_o' }, { num: '2', letters: 'abc' }, { num: '3', letters: 'def' },
    { num: '4', letters: 'ghi' }, { num: '5', letters: 'jkl' }, { num: '6', letters: 'mno' },
    { num: '7', letters: 'pqrs' }, { num: '8', letters: 'tuv' }, { num: '9', letters: 'wxyz' },
    { num: '*', letters: '' }, { num: '0', letters: '_' }, { num: '#', letters: '' },
  ];

  const handlePhysicalNaviClick = () => {
    playClickSound();
    // Link logic removed as requested, button only makes sound
  };

  return (
    <>
      <Styles />
      <div className="nokia-case">
        <div className="faceplate-accent"></div>
        <div className="nokia-logo">NOKIA</div>
        
        <div className="screen-glass">
          <div className="lcd-display">
            <div className="pixel-overlay"></div>
            <StatusBar />
            <div style={{ padding: '5px', flex: 1, overflow: 'hidden' }}>
              {!isSubscribed ? (
                <SubscriptionGate onSubscribe={handleSubscribe} />
              ) : (
                <GuideMenu />
              )}
            </div>
          </div>
        </div>

        {/* Physical Controls - Styled like 3310 */}
        <div className="control-panel">
          <div className="btn-c-wrapper">
             <div className="btn-c" onClick={playClickSound}>C</div>
          </div>
          
          <div className="btn-navi" onClick={handlePhysicalNaviClick}>
            <div className="btn-navi-line"></div>
          </div>
          
          <div className="btn-arrows">
            <div className="arrow-key" onClick={playClickSound}>▲</div>
            <div className="arrow-key" onClick={playClickSound}>▼</div>
          </div>
        </div>

        <div className="keypad">
           {keypadKeys.map((k) => (
             <div key={k.num} className="key" onClick={playClickSound}>
               <span className="key-num">{k.num}</span>
               {k.letters && <span className="key-letters">{k.letters}</span>}
             </div>
           ))}
        </div>
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);