import { useState } from 'react';
import { Flame, Snowflake } from 'lucide-react';
import { useCount } from './fx';

function Kombi({ on }: { on: boolean }) {
  const t = useCount(65, on, 20);
  return (
    <svg viewBox="0 0 240 340" className={`dev dev-kombi ${on ? 'on' : ''}`} role="img" aria-label="Çalışan kombi animasyonu">
      <defs>
        <linearGradient id="kb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6f1e8" /><stop offset="1" stopColor="#d9cfbf" /></linearGradient>
        <radialGradient id="fl" cx=".5" cy=".8" r=".7"><stop offset="0" stopColor="#ffe08a" /><stop offset=".45" stopColor="#ff9a3c" /><stop offset="1" stopColor="#e2471f" stopOpacity="0" /></radialGradient>
        <filter id="blur6"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      {/* steam */}
      <g className="k-steam" filter="url(#blur6)">
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={78 + i * 21} cy="58" r="15" style={{ animationDelay: `${i * 0.35}s` }} />)}
      </g>
      {/* flue */}
      <rect x="104" y="0" width="32" height="34" rx="3" className="k-flue" />
      {/* body */}
      <rect x="40" y="30" width="160" height="230" rx="14" fill="url(#kb)" className="k-body" />
      {/* top grille */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={66 + i * 16} y="46" width="9" height="34" rx="4" className="k-grill" />)}
      {/* window with flame */}
      <rect x="92" y="104" width="56" height="62" rx="8" className="k-window" />
      <g className="k-flame">
        <ellipse cx="120" cy="150" rx="20" ry="26" fill="url(#fl)" />
        <path d="M120 126 C 132 142, 130 152, 120 160 C 110 152, 108 142, 120 126 Z" fill="#ffd36b" />
      </g>
      {/* display */}
      <rect x="64" y="190" width="112" height="44" rx="8" className="k-display" />
      <text x="120" y="220" textAnchor="middle" className="k-temp">{t}°C</text>
      <circle cx="78" cy="212" r="4" className="k-led" />
      {/* pipes */}
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${82 + i * 26} 260 V 320`} className="k-pipe" />)}
      <path d="M70 320 H 170" className="k-pipe thin" />
    </svg>
  );
}

function Klima({ on }: { on: boolean }) {
  const t = useCount(18, on, 30);
  return (
    <svg viewBox="0 0 420 300" className={`dev dev-klima ${on ? 'on' : ''}`} role="img" aria-label="Çalışan klima animasyonu">
      <defs>
        <linearGradient id="ac" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f8f5ef" /><stop offset="1" stopColor="#ddd5c8" /></linearGradient>
      </defs>
      <rect x="20" y="20" width="380" height="104" rx="22" fill="url(#ac)" className="a-body" />
      <path d="M44 56 H 300" className="a-line" />
      <rect x="318" y="44" width="58" height="24" rx="6" className="a-display" />
      <text x="347" y="61" textAnchor="middle" className="a-temp">{t}°</text>
      <rect x="44" y="96" width="332" height="12" rx="6" className="a-vent" />
      <g className="a-flap"><rect x="44" y="104" width="332" height="10" rx="5" /></g>
      {/* air streams */}
      <g className="a-air">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path key={i} d={`M${70 + i * 46} 122 C ${56 + i * 46} 170, ${92 + i * 46} 210, ${70 + i * 46} 290`} style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </g>
      <g className="a-snow">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <text key={i} x={60 + ((i * 41) % 300)} y="130" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }}>{'\u2744\uFE0E'}</text>
        ))}
      </g>
    </svg>
  );
}

export default function Devices() {
  const [heat, setHeat] = useState(false);
  const [cool, setCool] = useState(false);
  return (
    <div className="devices">
      <button type="button" className={`device-stage heat ${heat ? 'on' : ''}`} onMouseEnter={() => setHeat(true)} onMouseLeave={() => setHeat(false)} onClick={() => setHeat((v) => !v)} aria-pressed={heat} data-testid="button-device-kombi">
        <span className="stage-glow" />
        <Kombi on={heat} />
        <span className="stage-label"><Flame size={15} /> Kombi · {heat ? 'Isıtıyor' : 'Üzerine gelin'}</span>
      </button>
      <button type="button" className={`device-stage cool ${cool ? 'on' : ''}`} onMouseEnter={() => setCool(true)} onMouseLeave={() => setCool(false)} onClick={() => setCool((v) => !v)} aria-pressed={cool} data-testid="button-device-klima">
        <span className="stage-glow" />
        <Klima on={cool} />
        <span className="stage-label"><Snowflake size={15} /> Klima · {cool ? 'Soğutuyor' : 'Üzerine gelin'}</span>
      </button>
    </div>
  );
}
