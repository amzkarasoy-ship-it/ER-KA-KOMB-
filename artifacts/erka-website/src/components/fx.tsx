import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export type Mode = 'heat' | 'cool';

/* ---------- Steam rising (kombi) ---------- */
export function Steam({ x = 50, y = 10, spread = 18, count = 12 }: { x?: number; y?: number; spread?: number; count?: number }) {
  return (
    <span className="fx fx-steam" aria-hidden="true" style={{ left: `${x}%`, top: `${y}%`, width: `${spread}%` } as CSSProperties}>
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} style={{ '--i': i, left: `${(i / (count - 1)) * 100}%`, animationDelay: `${(i * 0.37) % 2.6}s` } as CSSProperties} />
      ))}
    </span>
  );
}

/* ---------- Cold air + snow (klima) ---------- */
export function Chill({ x = 20, y = 40, w = 60, flakes = 10 }: { x?: number; y?: number; w?: number; flakes?: number }) {
  return (
    <span className="fx fx-chill" aria-hidden="true" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%` } as CSSProperties}>
      <svg viewBox="0 0 200 120" preserveAspectRatio="none">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path key={i} d={`M${12 + i * 25} 0 C ${4 + i * 25} 40, ${28 + i * 25} 70, ${14 + i * 25} 118`} style={{ animationDelay: `${i * 0.22}s` }} />
        ))}
      </svg>
      {Array.from({ length: flakes }).map((_, i) => (
        <b key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i * 0.41) % 3}s`, fontSize: `${8 + ((i * 5) % 9)}px` }}>{'\u2744\uFE0E'}</b>
      ))}
    </span>
  );
}

/* ---------- Diagnostic scan ---------- */
export function Scan() {
  return <span className="fx fx-scan" aria-hidden="true"><i /></span>;
}

/* ---------- Refrigerant pipe flow (tesisat) ---------- */
export function PipeFlow() {
  return (
    <span className="fx fx-pipe" aria-hidden="true">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none">
        <path className="p-hot" d="M-10 250 H120 Q140 250 140 230 V120 Q140 100 160 100 H410" />
        <path className="p-cold" d="M-10 272 H150 Q170 272 170 252 V142 Q170 122 190 122 H410" />
      </svg>
    </span>
  );
}

/* ---------- Particle canvas (embers / snow) ---------- */
export function Particles({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; t: number };
    let ps: P[] = [];
    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (w * h) / 14000));
      ps = Array.from({ length: n }, () => spawn(true));
    };
    const spawn = (anywhere = false): P => {
      const heat = modeRef.current === 'heat';
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : heat ? h + 10 : -10,
        r: heat ? Math.random() * 1.8 + 0.6 : Math.random() * 2.4 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: heat ? -(Math.random() * 0.7 + 0.25) : Math.random() * 0.6 + 0.25,
        a: Math.random() * 0.6 + 0.25,
        t: Math.random() * 100,
      };
    };
    const tick = () => {
      const heat = modeRef.current === 'heat';
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.t += 0.02;
        p.x += p.vx + Math.sin(p.t) * (heat ? 0.35 : 0.5);
        p.y += heat ? -Math.abs(p.vy) : Math.abs(p.vy);
        if ((heat && p.y < -12) || (!heat && p.y > h + 12)) ps[i] = spawn();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        const c = heat ? '255,170,90' : '200,230,255';
        g.addColorStop(0, `rgba(${c},${p.a})`);
        g.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    resize();
    window.addEventListener('resize', resize);
    if (!reduce) tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}

/* ---------- Custom cursor ---------- */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const t = e.target as HTMLElement;
      ring.current?.classList.toggle('hover', !!t.closest('a, button, select, input, textarea, [data-hover]'));
    };
    const loop = () => {
      rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move);
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.documentElement.classList.remove('has-cursor'); };
  }, []);
  return (<><div ref={ring} className="cursor-ring" aria-hidden="true" /><div ref={dot} className="cursor-dot" aria-hidden="true" /></>);
}

/* ---------- Preloader ---------- */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setGone(true), 1500);
    const t2 = setTimeout(() => setHidden(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (hidden) return null;
  return (
    <div className={`preloader ${gone ? 'gone' : ''}`} aria-hidden="true">
      <div className="pre-inner">
        <svg viewBox="0 0 60 60" className="pre-mark"><rect x="2" y="2" width="56" height="56" /><text x="30" y="40" textAnchor="middle">E</text></svg>
        <div className="pre-word">{'ER-KA'.split('').map((c, i) => <span key={i} style={{ animationDelay: `${0.35 + i * 0.08}s` }}>{c}</span>)}</div>
        <div className="pre-sub">Kombi · Klima</div>
      </div>
    </div>
  );
}

/* ---------- Scroll progress ---------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}

/* ---------- Tilt + spotlight card ---------- */
export function TiltCard({ className = '', children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--ry', `${(px - 0.5) * 7}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * 7}deg`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };
  return <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>{children}</div>;
}

/* ---------- Count-up number ---------- */
export function useCount(target: number, active: boolean, from = 0, ms = 1400) {
  const [v, setV] = useState(from);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const begin = v;
    const end = active ? target : from;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(begin + (end - begin) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, target]);
  return v;
}

/* ---------- Reveal observer ---------- */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .draw-on-view').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
