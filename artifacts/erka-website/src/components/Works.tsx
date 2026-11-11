import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';

type Cat = 'tesisat' | 'revizyon' | 'magaza';
type Item = { src: string; poster?: string; video?: boolean; cat: Cat; title: string };

const cats: { id: 'all' | Cat; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'tesisat', label: 'Klima Altyapı Tesisatı' },
  { id: 'revizyon', label: 'Revizyon & Servis' },
  { id: 'magaza', label: 'Mağaza & Stok' },
];

const items: Item[] = [
  { src: '/works/video-tesisat-2.mp4', poster: '/works/video-tesisat-2.jpg', video: true, cat: 'tesisat', title: 'Asma tavan içi klima altyapısı' },
  { src: '/works/tesisat-1.jpg', cat: 'tesisat', title: 'Bakır boru ve kablo hattı çıkışı' },
  { src: '/works/revizyon-3.jpg', cat: 'revizyon', title: 'Kombi hidrolik grup revizyonu' },
  { src: '/works/magaza-1.jpg', cat: 'magaza', title: 'Mağazamız · klima ve kombi stokları' },
  { src: '/works/revizyon-1.jpg', cat: 'revizyon', title: 'Atölyede parça yenileme' },
  { src: '/works/video-revizyon.mp4', poster: '/works/video-revizyon.jpg', video: true, cat: 'revizyon', title: 'Kombi iç aksam bakımı' },
  { src: '/works/tesisat-2.jpg', cat: 'tesisat', title: 'Tavan arası tesisat geçişi' },
  { src: '/works/magaza-2.jpg', cat: 'magaza', title: 'Teslimata hazır kombiler' },
  { src: '/works/video-magaza.mp4', poster: '/works/video-magaza.jpg', video: true, cat: 'magaza', title: 'Mağazadan · satışa hazır cihazlar' },
  { src: '/works/tesisat-3.jpg', cat: 'tesisat', title: 'İç ünite yeri hazırlığı' },
  { src: '/works/revizyon-2.jpg', cat: 'revizyon', title: 'Kombi arıza tespiti' },
  { src: '/works/tesisat-4.jpg', cat: 'tesisat', title: 'Alçıpan tavan içi hat' },
  { src: '/works/video-tesisat-1.mp4', poster: '/works/video-tesisat-1.jpg', video: true, cat: 'tesisat', title: 'Sıva altı boru döşeme' },
];

function Tile({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const play = () => { ref.current?.play().catch(() => {}); };
  const stop = () => { const v = ref.current; if (v) { v.pause(); v.currentTime = 0; } };
  return (
    <button type="button" className={`work ${item.video ? 'is-video' : ''}`} onClick={onOpen} onMouseEnter={play} onMouseLeave={stop} aria-label={`${item.title} — büyüt`}>
      {item.video
        ? <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="none" />
        : <img src={item.src} alt={item.title} loading="lazy" />}
      {item.video && <span className="work-play"><Play size={18} fill="currentColor" /></span>}
      <span className="work-cap"><small>{cats.find((c) => c.id === item.cat)?.label}</small>{item.title}</span>
    </button>
  );
}

export default function Works() {
  const [cat, setCat] = useState<'all' | Cat>('all');
  const [open, setOpen] = useState<number | null>(null);
  const list = items.filter((i) => cat === 'all' || i.cat === cat);
  const cur = open === null ? null : list[open];

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((v) => (v === null ? v : (v + 1) % list.length));
      if (e.key === 'ArrowLeft') setOpen((v) => (v === null ? v : (v - 1 + list.length) % list.length));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, list.length]);

  return (
    <section className="works section-pad" id="works">
      <div className="wrap">
        <div className="section-heading split reveal">
          <div>
            <span className="eyebrow">Referanslar</span>
            <h2 className="serif">Sahadan,<br /><em>Kendi İşlerimiz.</em></h2>
          </div>
          <p>Hazır görsel değil; hepsi ekibimizin yaptığı işlerden ve mağazamızdan gerçek kareler.</p>
        </div>
        <div className="work-tabs reveal" role="tablist" aria-label="Referans kategorileri">
          {cats.map((c) => <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={cat === c.id ? 'active' : ''} onClick={() => { setCat(c.id); setOpen(null); }}>{c.label}</button>)}
        </div>
        <div className="work-grid" key={cat}>
          {list.map((item, i) => <div className="work-cell" key={item.src} style={{ animationDelay: `${i * 0.05}s` }}><Tile item={item} onOpen={() => setOpen(i)} /></div>)}
        </div>
      </div>
      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={cur.title} onClick={() => setOpen(null)}>
          <button type="button" className="lb-close" aria-label="Kapat" onClick={() => setOpen(null)}><X size={22} /></button>
          <button type="button" className="lb-nav prev" aria-label="Önceki" onClick={(e) => { e.stopPropagation(); setOpen((open! - 1 + list.length) % list.length); }}><ChevronLeft size={26} /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            {cur.video
              ? <video key={cur.src} src={cur.src} poster={cur.poster} controls autoPlay muted loop playsInline />
              : <img src={cur.src} alt={cur.title} />}
            <figcaption>{cur.title}<span>{open! + 1} / {list.length}</span></figcaption>
          </figure>
          <button type="button" className="lb-nav next" aria-label="Sonraki" onClick={(e) => { e.stopPropagation(); setOpen((open! + 1) % list.length); }}><ChevronRight size={26} /></button>
        </div>
      )}
    </section>
  );
}
