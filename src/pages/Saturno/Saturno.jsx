import React, { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import saturnLogo from "../../assets/saturn-white.png";

// ---------------------------------------------------------------------------
// Tokens
// black   #000000   fundo
// cyan    #4fd8ff   acento tecnológico / IA
// violet  #8b6bff   segundo acento
// paper   #ffffff   texto
// ---------------------------------------------------------------------------

function generateShadows(count, color, spread) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * spread) - spread / 2;
    const y = Math.floor(Math.random() * spread) - spread / 2;
    parts.push(`${x}px ${y}px ${color}`);
  }
  return parts.join(",");
}

function StarLayer({ count, size, color, duration, opacity }) {
  const shadow = useMemo(() => generateShadows(count, color, 2200), [count, color]);
  return (
    <div className="star-layer" style={{ animationDuration: `${duration}s`, opacity }}>
      <div className="star-dot" style={{ width: size, height: size, boxShadow: shadow }} />
      <div className="star-dot" style={{ width: size, height: size, boxShadow: shadow, top: 2200 }} />
    </div>
  );
}

function SaturnMark({ size = 220 }) {
  return (
    <div className="saturn-mark" style={{ width: size, height: size }}>
      <div className="saturn-glow" />
      <img
        src={saturnLogo}
        alt="Saturno IA Soluções"
        width={size}
        height={size}
        className="saturn-svg"
        draggable={false}
      />
    </div>
  );
}

export default function Saturno() {
  const rootRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e) => {
    const rect = rootRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 26, y: py * 26 });
  }, []);

  const handleMouseLeave = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  const handleParticipar = useCallback(() => {
    navigate("/cadastro");
  }, [navigate]);

  return (
    <div
      ref={rootRef}
      className="page-root"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-2200px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.08); }
        }
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,216,255,0.4), 0 0 0 0 rgba(139,107,255,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(79,216,255,0), 0 0 0 20px rgba(139,107,255,0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .page-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #000000;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .star-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2200px;
          animation-name: drift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .star-dot {
          position: absolute;
          background: transparent;
          border-radius: 9999px;
        }
      `}</style>

      <style>{`
        .content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: transform 0.15s ease-out;
        }

        .saturn-mark {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.9s ease both;
        }
        .saturn-glow {
          position: absolute;
          width: 130%;
          height: 130%;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(79,216,255,0.25) 0%, rgba(139,107,255,0.12) 45%, transparent 70%);
          filter: blur(6px);
          animation: glowPulse 5s ease-in-out infinite;
        }
        .saturn-svg {
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 0 18px rgba(79,216,255,0.35));
        }

        .tagline {
          margin-top: 26px;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          animation: fadeUp 0.9s ease 0.15s both;
        }
        .tagline strong {
          color: #ffffff;
          font-weight: 600;
        }

        .star-btn {
          position: relative;
          margin-top: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 42px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.18);
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #ffffff;
          background: linear-gradient(135deg, rgba(79,216,255,0.14), rgba(139,107,255,0.14));
          backdrop-filter: blur(6px);
          animation: fadeUp 0.9s ease 0.3s both, btnPulse 2.8s ease-out 1.2s infinite;
          transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
        }
        .star-btn:hover {
          transform: translateY(-2px) scale(1.03);
          border-color: rgba(79,216,255,0.6);
          background: linear-gradient(135deg, rgba(79,216,255,0.28), rgba(139,107,255,0.28));
        }
        .star-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .star-btn-spark {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
        }
      `}</style>

      <StarLayer count={240} size={1} color="#ffffff" duration={75} opacity={0.85} />
      <StarLayer count={100} size={2} color="#ffffff" duration={140} opacity={0.65} />
      <StarLayer count={40} size={2.5} color="#4fd8ff" duration={200} opacity={0.5} />

      <div
        className="content"
        style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
      >
        <p className="tagline">
          Desenvolvido por
        </p>
        <SaturnMark size={220} />

        <p className="tagline">
         <strong>Saturno Soluções Digitais</strong>
        </p>

        <button className="star-btn" onClick={handleParticipar}>
          <svg className="star-btn-spark" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"
              fill="#4fd8ff"
            />
          </svg>
          CLICK AQUI PARA PARTICIPAR
        </button>
      </div>
    </div>
  );
}
