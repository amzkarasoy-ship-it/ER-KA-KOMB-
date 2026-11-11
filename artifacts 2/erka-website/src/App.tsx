import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, ClipboardCheck, Clock, Flame, MapPin, Menu, MessageCircle, Navigation, Phone, PhoneCall, Search, Snowflake, Wrench, X,
} from 'lucide-react';
import {
  Chill, Cursor, FxDefs, Particles, PipeFlow, Preloader, Scan, ScrollProgress, Steam, TiltCard, useReveal, type Mode,
} from './components/fx';
import Devices from './components/Devices';
import Works from './components/Works';

const PHONE = '+905319111769';
const PHONE_LABEL = '0531 911 17 69';
const PHONE2 = '+905302815002';
const PHONE2_LABEL = '0530 281 50 02';
const WA = 'https://wa.me/905319111769';
const ADDRESS = 'Yavuz Selim Mahallesi, 1053. Sokak No: 51/A, Bağcılar / İstanbul';
const MAP_Q = encodeURIComponent('Yavuz Selim Mahallesi 1053. Sokak No 51/A Bağcılar İstanbul');
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_Q}`;
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_Q}&output=embed`;
const HOURS = 'Pazartesi – Cumartesi · 09:00 – 20:00';
const AREA = 'İstanbul Avrupa Yakası';

function isOpenNow() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Istanbul', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
  const day = parts.find((x) => x.type === 'weekday')?.value;
  const hour = Number(parts.find((x) => x.type === 'hour')?.value) % 24;
  return day !== 'Sun' && hour >= 9 && hour < 20;
}

const navigation = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Referanslar', href: '#works' },
  { label: 'Ürünler', href: '#products' },
  { label: 'İletişim', href: '#contact' },
];

type Fx = 'steam' | 'chill' | 'pipe' | 'scan';
type Service = { id: string; no: string; title: string; tag: string; description: string; image: string; alt: string; fx: Fx[]; fxPos?: { x: number; y: number; w: number } };

const services: Service[] = [
  { id: 'klima-altyapi-tesisati', no: '01', tag: 'Tesisat', title: 'Klima Altyapı Tesisatı', description: 'Yeni yapı ve tadilatlarda klima bakır boru, drenaj ve elektrik altyapısının planlanması ve kurulumu.', image: '/images/service-detail.jpg', alt: 'Klima altyapı tesisatı çalışması', fx: ['pipe', 'chill'], fxPos: { x: 2, y: 44, w: 62 } },
  { id: 'klima-satis', no: '02', tag: 'Alım · Satım · Montaj', title: 'Klima Alım & Satım · Sıfır & 2. El', description: 'Sıfır ve ikinci el klima satışı, montajı ve kullanılmış klimanızın alımı. Tüm markalar.', image: '/images/used-climate-category.jpg', alt: 'Duvara monte edilmiş beyaz klima', fx: ['chill'], fxPos: { x: 18, y: 46, w: 68 } },
  { id: 'kombi-satis', no: '03', tag: 'Alım · Satım · Montaj', title: 'Kombi Alım & Satım · Sıfır & 2. El', description: 'Sıfır ve ikinci el kombi satışı, montajı ve kullanılmış kombinizin alımı. Tüm markalar.', image: '/images/used-boiler-category.jpg', alt: 'Duvara monte edilmiş beyaz kombi', fx: ['steam'], fxPos: { x: 22, y: 52, w: 46 } },
  { id: 'revizyon', no: '04', tag: 'Revizyon', title: 'Kombi & Klima Revizyon', description: 'Tüm marka cihazlarda kapsamlı kontrol, aşınan parçaların yenilenmesi ve performansın geri kazandırılması.', image: '/images/boiler-revision.jpg', alt: 'Kombi revizyon çalışması', fx: ['scan', 'steam'], fxPos: { x: 42, y: 50, w: 40 } },
  { id: 'ariza-bakim-onarim', no: '05', tag: 'Servis', title: 'Arıza · Bakım · Onarım', description: 'Kombi ve klimalarda arıza tespiti, periyodik bakım, temizlik ve onarım hizmetleri.', image: '/images/climate-revision.jpg', alt: 'Klima bakım ve onarım çalışması', fx: ['scan', 'chill'], fxPos: { x: 28, y: 42, w: 62 } },
];

const products = [
  { id: 'sifir-kombi', badge: 'Sıfır', type: 'Kombi', title: 'Sıfır Kombiler', image: '/images/boiler-detail.jpg', fx: 'steam' as const, pos: { x: 36, y: 44, w: 42 } },
  { id: 'ikinci-el-kombi', badge: '2. El', type: 'Kombi', title: 'İkinci El Kombiler', image: '/images/used-boiler-category.jpg', fx: 'steam' as const, pos: { x: 22, y: 52, w: 46 } },
  { id: 'sifir-klima', badge: 'Sıfır', type: 'Klima', title: 'Sıfır Klimalar', image: '/images/used-climate-category.jpg', fx: 'chill' as const, pos: { x: 18, y: 46, w: 68 } },
  { id: 'ikinci-el-klima', badge: '2. El', type: 'Klima', title: 'İkinci El Klimalar', image: '/images/climate-revision.jpg', fx: 'chill' as const, pos: { x: 28, y: 42, w: 62 } },
];

const steps = [
  { icon: PhoneCall, title: 'Bize Ulaşın', text: 'Telefon veya WhatsApp ile ihtiyacınızı anlatın.' },
  { icon: Search, title: 'Keşif & Tespit', text: 'Cihazı ya da mekânı inceleyip en doğru çözümü belirleyelim.' },
  { icon: Wrench, title: 'Uygulama', text: 'Satış, montaj, tesisat veya onarımı özenle tamamlayalım.' },
  { icon: ClipboardCheck, title: 'Test & Teslim', text: 'Sistemi test edip çalışır hâlde teslim edelim.' },
];

const values = ['Tüm Markalara Hizmet', 'Sıfır & 2. El Alım Satım', 'Montajdan Revizyona Tek Adres', 'İstanbul Avrupa Yakasının Tamamı'];
const rotating = ['Alım Satım', 'Montaj', 'Tesisat', 'Bakım', 'Onarım', 'Revizyon'];
const marquee = ['Klima Altyapı Tesisatı', 'Sıfır & 2. El Klima', 'Sıfır & 2. El Kombi', 'Montaj', 'Revizyon', 'Arıza · Bakım · Onarım', 'Tüm Markalar', '2. El Alım'];

type FormValues = { name: string; phone: string; service: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

function SplitLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <span className="split-line"><span style={{ animationDelay: `${delay}s` }}>{children}</span></span>;
}

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % rotating.length), 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="rotator" aria-live="polite">
      {rotating.map((w, k) => <span key={w} className={k === i ? 'in' : k === (i - 1 + rotating.length) % rotating.length ? 'out' : ''}>{w}</span>)}
    </span>
  );
}

function Thermostat({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const heat = mode === 'heat';
  const temp = heat ? 24 : 18;
  const pct = heat ? 0.72 : 0.38;
  const C = 2 * Math.PI * 52;
  return (
    <div className={`thermostat ${mode}`} data-hover>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="52" className="t-track" />
        <circle cx="60" cy="60" r="52" className="t-arc" style={{ strokeDasharray: C, strokeDashoffset: C * (1 - pct) }} />
      </svg>
      <div className="t-read">
        <small>{heat ? 'Isıtma' : 'Soğutma'}</small>
        <strong>{temp}°</strong>
      </div>
      <div className="t-switch" role="group" aria-label="Mevsim modu">
        <button type="button" className={heat ? 'active' : ''} onClick={() => setMode('heat')} aria-pressed={heat} data-testid="button-mode-heat"><Flame size={14} /> Kış</button>
        <button type="button" className={!heat ? 'active' : ''} onClick={() => setMode('cool')} aria-pressed={!heat} data-testid="button-mode-cool"><Snowflake size={14} /> Yaz</button>
      </div>
    </div>
  );
}

function ServiceCard({ s, index }: { s: Service; index: number }) {
  const p = s.fxPos ?? { x: 30, y: 30, w: 40 };
  return (
    <TiltCard className={`service-card sc-${index}`} style={{ '--d': `${index * 0.08}s` } as CSSProperties} data-testid={`card-service-${s.id}`}>
      <a className="service-card-link" href="#contact" aria-label={`${s.title} hakkında bilgi alın`} data-testid={`link-service-${s.id}`}>
        <div className="service-card-image">
          <img src={s.image} alt={s.alt} loading="lazy" />
          {s.fx.includes('pipe') && <PipeFlow />}
          {s.fx.includes('scan') && <Scan />}
          <span className="img-space">
            {s.fx.includes('steam') && <Steam x={p.x} y={p.y} spread={p.w} />}
            {s.fx.includes('chill') && <Chill x={p.x} y={p.y} w={p.w} />}
          </span>
          <span className="sc-tag">{s.tag}</span>
          <span className="sc-no">{s.no}</span>
        </div>
        <div className="service-card-content">
          <div>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
          <span className="sc-arrow" aria-hidden="true"><ArrowUpRight size={17} /></span>
        </div>
      </a>
    </TiltCard>
  );
}

function App() {
  const month = new Date().getMonth();
  const [mode, setMode] = useState<Mode>(month >= 4 && month <= 8 ? 'cool' : 'heat');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({ name: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const open = isOpenNow();
  const heroRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  useReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
      const el = processRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const k = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
        el.style.setProperty('--progress', String(k));
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onHeroMove = (e: React.PointerEvent) => {
    const el = heroRef.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5));
  };

  const changeField = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitted(false);
  };

  const submitToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: FormErrors = {};
    if (formValues.name.trim().length < 2) next.name = 'Lütfen adınızı ve soyadınızı yazın.';
    if (!/^[+()\d\s-]{10,}$/.test(formValues.phone.trim())) next.phone = 'Geçerli bir telefon numarası yazın.';
    if (!formValues.service) next.service = 'Lütfen ilgilendiğiniz hizmeti seçin.';
    if (formValues.message.trim().length < 10) next.message = 'Mesajınız en az 10 karakter olmalı.';
    setErrors(next);
    if (Object.keys(next).length) {
      setSubmitted(false);
      document.getElementById(Object.keys(next)[0])?.focus();
      return;
    }
    const message = [
      'Merhaba ER-KA Kombi Klima,', '',
      `Ad Soyad: ${formValues.name.trim()}`,
      `Telefon: ${formValues.phone.trim()}`,
      `İlgilendiğim hizmet: ${formValues.service}`,
      `Mesajım: ${formValues.message.trim()}`,
    ].join('\n');
    setSubmitted(true);
    window.open(`${WA}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`site-shell mode-${mode}`}>
      <FxDefs />
      <Preloader />
      <Cursor />
      <ScrollProgress />

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#home" aria-label="ER-KA Kombi Klima ana sayfa" data-testid="link-header-home">
          <span className="brand-mark">E</span>
          <span><span className="brand-word">ER-KA</span><span className="brand-sub">KOMBİ · KLİMA</span></span>
        </a>
        <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Ana gezinme">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-navigation-${item.href.slice(1)}`}><span>{item.label}</span></a>)}
        </nav>
        <a className="header-call" href={`tel:${PHONE}`} data-testid="link-header-call"><span className="ring"><Phone size={14} /></span><span><small>Hemen arayın</small>{PHONE_LABEL}</span></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home" ref={heroRef} onPointerMove={onHeroMove} aria-labelledby="hero-title">
          <div className="hero-bg" />
          <div className="hero-tint" />
          <Particles mode={mode} />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content">
            <div className="hero-kicker">ER-KA Kombi Klima <span>·</span> Bağcılar <span>·</span> {AREA}</div>
            <h1 className="serif" id="hero-title" data-testid="text-hero-headline">
              <SplitLine delay={1.55}>Isıtmada ve</SplitLine>
              <SplitLine delay={1.68}>Soğutmada</SplitLine>
              <SplitLine delay={1.81}><em>Ustalık.</em></SplitLine>
            </h1>
            <div className="hero-rot">Kombi & Klima <Rotator /></div>
            <p className="hero-copy">Sıfır ve ikinci el kombi–klima alım satımı, montaj, klima altyapı tesisatı, revizyon, arıza, bakım ve onarım. Tüm markalarda, İstanbul Avrupa Yakası’nın her yerinde.</p>
            <div className={`open-pill ${open ? 'on' : ''}`}><i />{open ? 'Şu an açığız' : 'Şu an kapalıyız'} <span>· Pzt–Cmt 09:00–20:00</span></div>
            <div className="actions">
              <a className="button button-gold magnetic" href={`tel:${PHONE}`} data-testid="link-hero-call"><Phone size={15} /> Hemen Arayın</a>
              <a className="button button-ghost" href="#services" data-testid="link-hero-services">Hizmetlerimiz <ArrowRight size={15} /></a>
            </div>
          </div>
          <Thermostat mode={mode} setMode={setMode} />
          <div className="hero-bottom">
            <span className="scroll-cue"><i /> Kaydırın</span>
            <span className="hero-index">{mode === 'heat' ? 'Kış modu · Kombi' : 'Yaz modu · Klima'}</span>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marquee, ...marquee, ...marquee].map((m, i) => <span key={i}>{m}<i>✦</i></span>)}
          </div>
        </div>

        {/* INTERACTIVE DEVICES */}
        <section className="showcase section-pad" id="about">
          <div className="wrap">
            <div className="showcase-head reveal">
              <span className="eyebrow">Isıtırız · Soğuturuz</span>
              <h2 className="serif">Evinizin İklimi<br /><em>Bizim İşimiz.</em></h2>
              <p>ER-KA Kombi Klima olarak kombi ve klima sistemlerinde satıştan tesisata, bakımdan revizyona kadar her adımda yanınızdayız. Cihazların üzerine gelin, nasıl çalıştığını görün.</p>
            </div>
            <div className="reveal"><Devices /></div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services section-pad" id="services">
          <div className="wrap">
            <div className="section-heading split reveal">
              <div>
                <span className="eyebrow">Hizmetlerimiz</span>
                <h2 className="serif">Her Detayda<br /><em>Profesyonel Dokunuş.</em></h2>
              </div>
              <p>Beş ana hizmet, tek ekip. Kartların üzerine gelin.</p>
            </div>
            <div className="service-cards">
              {services.map((s, i) => <div className="reveal" key={s.id} style={{ transitionDelay: `${i * 0.08}s` }}><ServiceCard s={s} index={i} /></div>)}
            </div>
          </div>
        </section>

        <Works />

        {/* PROCESS */}
        <section className="process section-pad" id="process">
          <div className="wrap">
            <div className="section-heading center reveal">
              <span className="eyebrow">Nasıl çalışıyoruz</span>
              <h2 className="serif">Dört Adımda<br /><em>Sorunsuz Konfor.</em></h2>
            </div>
            <div className="steps" ref={processRef}>
              <div className="steps-line"><i /></div>
              {steps.map(({ icon: Icon, title, text }, i) => (
                <div className="step reveal" key={title} style={{ transitionDelay: `${i * 0.12}s` }}>
                  <div className="step-icon"><Icon size={22} strokeWidth={1.4} /><span>{String(i + 1).padStart(2, '0')}</span></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="values">
          <div className="wrap values-row reveal">
            <h2 className="serif values-title">Kalite bir tercih değil,<br /><em>standartlarımızdır.</em></h2>
            <div className="values-grid">
              {values.map((v, i) => <div className="value-item" key={v} style={{ transitionDelay: `${i * 0.1}s` }}><span className="vcheck"><Check size={14} strokeWidth={2} /></span><span>{v}</span></div>)}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="products section-pad" id="products">
          <div className="wrap">
            <div className="section-heading split reveal">
              <div>
                <span className="eyebrow">Ürün Grupları</span>
                <h2 className="serif">Sıfır ya da 2. El,<br /><em>Doğru Cihaz.</em></h2>
              </div>
              <p>Tüm markalarda stok ve fiyat bilgisi için bize ulaşın. Kullanılmış kombi ve klimanızı da değerinde alıyoruz.</p>
            </div>
            <div className="product-grid">
              {products.map((p, i) => (
                <div className="reveal" key={p.id} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <TiltCard className={`product-card ${p.fx}`} data-testid={`card-product-category-${p.id}`}>
                    <a href="#contact" aria-label={`${p.title} hakkında bilgi al`} data-testid={`link-product-category-${p.id}`}>
                      <div className="product-image">
                        <img src={p.image} alt={p.title} loading="lazy" />
                        <span className="img-space">{p.fx === 'steam' ? <Steam x={p.pos.x} y={p.pos.y} spread={p.pos.w} /> : <Chill x={p.pos.x} y={p.pos.y} w={p.pos.w} />}</span>
                        <span className={`badge ${p.badge === 'Sıfır' ? 'new' : 'used'}`}>{p.badge}</span>
                      </div>
                      <div className="product-meta">
                        <small>{p.type === 'Kombi' ? <Flame size={12} /> : <Snowflake size={12} />} {p.type}</small>
                        <h3>{p.title}</h3>
                        <span className="product-cta">Bilgi Al <ArrowRight size={14} /></span>
                      </div>
                    </a>
                  </TiltCard>
                </div>
              ))}
            </div>
            <p className="product-disclaimer">Görseller temsilîdir.</p>
          </div>
        </section>

        {/* CTA BAND */}
        <section className="cta-band">
          <div className="wrap cta-inner reveal">
            <div>
              <span className="eyebrow">Kombiniz mi arızalandı? Klimanız mı soğutmuyor?</span>
              <h2 className="serif">Bir telefon kadar <em>yakınız.</em></h2>
            </div>
            <div className="cta-actions">
              <a className="cta-phone" href={`tel:${PHONE}`} data-testid="link-cta-call"><span className="ring big"><Phone size={20} /></span>{PHONE_LABEL}</a>
              <a className="button button-ghost" href={WA} target="_blank" rel="noopener noreferrer" data-testid="link-cta-whatsapp"><MessageCircle size={15} /> WhatsApp</a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact section-pad" id="contact">
          <div className="wrap contact-grid">
            <div className="contact-copy reveal">
              <span className="eyebrow">İletişim</span>
              <h2 className="serif">Konforunuz İçin<br /><em>Bir Adım Uzağınızdayız.</em></h2>
              <p>Hizmet ve ürünler hakkında bilgi almak için bize ulaşın. İhtiyacınızı birlikte değerlendirelim.</p>
              <div className="contact-methods">
                <a className="contact-method" href={`tel:${PHONE}`} data-testid="link-contact-phone-primary"><span className="cm-ico"><Phone size={17} /></span><span><small>Bizi arayın</small>{PHONE_LABEL}</span><ArrowUpRight size={16} /></a>
                <a className="contact-method" href={`tel:${PHONE2}`} data-testid="link-contact-phone-secondary"><span className="cm-ico"><Phone size={17} /></span><span><small>Alternatif telefon</small>{PHONE2_LABEL}</span><ArrowUpRight size={16} /></a>
                <a className="contact-method" href={WA} target="_blank" rel="noopener noreferrer" data-testid="link-contact-whatsapp"><span className="cm-ico"><MessageCircle size={17} /></span><span><small>WhatsApp</small>Mesaj gönderin</span><ArrowUpRight size={16} /></a>
                <a className="contact-method" href={MAP_LINK} target="_blank" rel="noopener noreferrer" data-testid="link-contact-address"><span className="cm-ico"><MapPin size={17} /></span><span><small>Adres</small>{ADDRESS}</span><ArrowUpRight size={16} /></a>
                <div className="contact-method static"><span className="cm-ico"><Clock size={17} /></span><span><small>Çalışma saatleri</small>{HOURS}</span><span className={`open-dot ${open ? 'on' : ''}`}>{open ? 'Açık' : 'Kapalı'}</span></div>
              </div>
            </div>
            <form className="form-card reveal" onSubmit={submitToWhatsApp} noValidate>
              <h3>Size nasıl yardımcı olabiliriz?</h3>
              <p className="form-intro">Bilgilerinizi ve talebinizi paylaşın; mesajınız WhatsApp üzerinden açılacaktır.</p>
              <div className="form-grid">
                <div className="field">
                  <input id="name" name="name" placeholder=" " autoComplete="name" value={formValues.name} onChange={(e) => changeField('name', e.target.value)} aria-invalid={!!errors.name} data-testid="input-contact-name" />
                  <label htmlFor="name">Ad Soyad</label>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="field">
                  <input id="phone" name="phone" placeholder=" " type="tel" autoComplete="tel" inputMode="tel" value={formValues.phone} onChange={(e) => changeField('phone', e.target.value)} aria-invalid={!!errors.phone} data-testid="input-contact-phone" />
                  <label htmlFor="phone">Telefon</label>
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
                <div className="field full">
                  <select id="service" name="service" value={formValues.service} onChange={(e) => changeField('service', e.target.value)} aria-invalid={!!errors.service} className={formValues.service ? 'filled' : ''} data-testid="select-contact-service">
                    <option value="" />
                    {services.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
                    <option value="Diğer">Diğer</option>
                  </select>
                  <label htmlFor="service">İlgilendiğiniz hizmet</label>
                  {errors.service && <span className="field-error">{errors.service}</span>}
                </div>
                <div className="field full">
                  <textarea id="message" name="message" placeholder=" " value={formValues.message} onChange={(e) => changeField('message', e.target.value)} aria-invalid={!!errors.message} data-testid="input-contact-message" />
                  <label htmlFor="message">Mesajınız</label>
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>
              </div>
              <button className="button button-gold form-submit" type="submit" data-testid="button-submit-contact"><MessageCircle size={15} /> WhatsApp’ta Devam Et</button>
              <p className="whatsapp-note">Gönder’e bastığınızda mesajınız WhatsApp’ta açılır; iletmek için orada da gönder’e basmanız gerekir.</p>
              {submitted && <p className="form-success" role="status">Mesajınız WhatsApp’ta açıldı. İletişimi tamamlamak için oradan gönderin.</p>}
            </form>
          </div>
        </section>

        {/* MAP */}
        <section className="map-section">
          <iframe title="ER-KA Kombi Klima konum haritası" src={MAP_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="map-card reveal">
            <span className="eyebrow">Bizi ziyaret edin</span>
            <h3 className="serif">Bağcılar’dayız.</h3>
            <p>{ADDRESS}</p>
            <p className="map-area"><Navigation size={14} /> Hizmet bölgesi: {AREA}</p>
            <a className="button button-gold" href={MAP_LINK} target="_blank" rel="noopener noreferrer" data-testid="link-map-directions"><MapPin size={15} /> Yol Tarifi Al</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-giant" aria-hidden="true">ER-KA</div>
          <div className="footer-main">
            <div className="footer-about">
              <a className="brand" href="#home"><span className="brand-mark">E</span><span><span className="brand-word">ER-KA</span><span className="brand-sub">KOMBİ · KLİMA</span></span></a>
              <p>Tüm marka kombi ve klimalarda alım satım, montaj, tesisat, revizyon, arıza, bakım ve onarım.</p>
              <p className="footer-addr"><MapPin size={13} /> {ADDRESS}</p>
              <p className="footer-addr"><Clock size={13} /> {HOURS}</p>
            </div>
            <div><h4>Keşfedin</h4><div className="footer-list">{navigation.map((n) => <a href={n.href} key={n.href}>{n.label}</a>)}</div></div>
            <div><h4>Hizmetler</h4><div className="footer-list">{services.map((s) => <a href="#services" key={s.id}>{s.title}</a>)}</div></div>
            <div><h4>İletişim</h4><div className="footer-list"><a href={`tel:${PHONE}`}>{PHONE_LABEL}</a><a href={`tel:${PHONE2}`}>{PHONE2_LABEL}</a><a href={WA} target="_blank" rel="noopener noreferrer">WhatsApp üzerinden yazın</a></div></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} ER-KA Kombi Klima. Tüm hakları saklıdır.</span><a href="#home">Başa dön ↑</a></div>
        </div>
      </footer>

      <a className="wa-float" href={WA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile yazın" data-testid="link-whatsapp-float"><MessageCircle size={24} /></a>
      <div className="mobile-actions" aria-label="Hızlı iletişim">
        <a className="mobile-call" href={`tel:${PHONE}`} data-testid="link-mobile-call"><Phone size={15} /> Ara</a>
        <a className="mobile-wa" href={WA} target="_blank" rel="noopener noreferrer" data-testid="link-mobile-whatsapp"><MessageCircle size={15} /> WhatsApp</a>
      </div>
    </div>
  );
}

export default App;
