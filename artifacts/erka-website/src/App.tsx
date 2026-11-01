import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight, Check, ChevronDown, Menu, MessageCircle, Phone, X,
} from 'lucide-react';

const navigation = [
  { label: 'Ana Sayfa', href: '#home' },
  { label: 'Hakkımızda', href: '#about' },
  { label: 'Hizmetler', href: '#services' },
  { label: 'Ürünler', href: '#products' },
  { label: 'İletişim', href: '#contact' },
];

const services = [
  { id: 'kombi-servisi', title: 'Kombi Servisi', description: 'Kombi bakım, arıza tespiti ve onarım hizmetleri.', image: '/images/boiler-service.jpg', alt: 'Kombi bakım ve teknik servis işlemi' },
  { id: 'kombi-revizyon', title: 'Kombi Revizyon', description: 'Kombi sistemlerinin kontrolü, yenilenmesi ve performans iyileştirmeleri.', image: '/images/boiler-revision.jpg', alt: 'Kombi sisteminde revizyon ve yenileme çalışması' },
  { id: 'klima-servisi', title: 'Klima Servisi', description: 'Klima bakım, temizlik, arıza tespiti ve onarım hizmetleri.', image: '/images/service-detail.jpg', alt: 'Klima ünitesinde dikkatli bakım ve servis çalışması' },
  { id: 'klima-revizyon', title: 'Klima Revizyon', description: 'Klima sistemlerinin kontrolü ve verimlilik iyileştirmeleri.', image: '/images/climate-revision.jpg', alt: 'Klima sisteminde kontrol ve verimlilik iyileştirme çalışması' },
  { id: 'yedek-parca', title: 'Yedek Parça', description: 'Kombi ve klima sistemleri için yedek parça çözümleri.', image: '/images/spare-parts.jpg', alt: 'Kombi ve klima sistemlerine yönelik yedek parça detayları' },
  { id: 'ikinci-el-sifir-urunler', title: 'İkinci El & Sıfır Ürünler', description: 'Sıfır ve ikinci el kombi ve klima ürünleri.', image: '/images/used-boiler-category.jpg', alt: 'İkinci el ve sıfır ürün kategorisini temsil eden kombi görseli' },
];

const productCategories = [
  { id: 'new-boilers', title: 'Yeni Kombiler', type: 'KOMBİ', image: '/images/boiler-detail.jpg', alt: 'Yeni kombi kategorisini temsil eden kombi görseli' },
  { id: 'used-boilers', title: 'İkinci El Kombiler', type: 'KOMBİ', image: '/images/used-boiler-category.jpg', alt: 'İkinci el kombi kategorisini temsil eden görsel' },
  { id: 'new-air-conditioners', title: 'Yeni Klimalar', type: 'KLİMA', image: '/images/hero-interior.jpg', alt: 'Yeni klima kategorisini temsil eden modern iç mekân görseli' },
  { id: 'used-air-conditioners', title: 'İkinci El Klimalar', type: 'KLİMA', image: '/images/used-climate-category.jpg', alt: 'İkinci el klima kategorisini temsil eden görsel' },
];

const values = [
  'Profesyonel Teknik Yaklaşım',
  'Çözüm Odaklı Hizmet',
  'Geniş Hizmet Yelpazesi',
  'Müşteri Memnuniyeti',
];

type FormValues = { name: string; phone: string; service: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({ name: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const changeField = (field: keyof FormValues, value: string) => {
    setFormValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setSubmitted(false);
  };

  const submitToWhatsApp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FormErrors = {};
    if (formValues.name.trim().length < 2) nextErrors.name = 'Lütfen adınızı ve soyadınızı yazın.';
    if (!/^[+()\d\s-]{10,}$/.test(formValues.phone.trim())) nextErrors.phone = 'Geçerli bir telefon numarası yazın.';
    if (!formValues.service) nextErrors.service = 'Lütfen ilgilendiğiniz hizmeti seçin.';
    if (formValues.message.trim().length < 10) nextErrors.message = 'Mesajınız en az 10 karakter olmalı.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitted(false);
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    const message = [
      'Merhaba ER-KA Kombi Klima,',
      '',
      `Ad Soyad: ${formValues.name.trim()}`,
      `Telefon: ${formValues.phone.trim()}`,
      `İlgilendiğim hizmet: ${formValues.service}`,
      `Mesajım: ${formValues.message.trim()}`,
    ].join('\n');
    setSubmitted(true);
    window.open(`https://wa.me/905319111769?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="site-shell">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#home" aria-label="ER-KA Kombi Klima ana sayfa" data-testid="link-header-home">
          <span className="brand-mark">E</span>
          <span><span className="brand-word">ER-KA</span><span className="brand-sub">KOMBİ KLİMA</span></span>
        </a>
        <nav className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Ana gezinme">
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} data-testid={`link-navigation-${item.href.slice(1)}`}>{item.label}</a>)}
        </nav>
        <a className="header-contact" href="#contact" data-testid="link-header-contact">Bize Ulaşın <ArrowRight size={14} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-mobile-menu">
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-content">
            <div className="hero-kicker">ER-KA Kombi Klima</div>
            <h1 className="serif" id="hero-title" data-testid="text-hero-headline">Konforun<br />Zarafetle<br /><em>Buluştuğu Nokta.</em></h1>
            <p className="hero-copy">Kombi ve klima sistemlerinde profesyonel bakım, teknik servis, revizyon ve yedek parça çözümleri.</p>
            <div className="actions">
              <a className="button button-gold" href="#services" data-testid="link-hero-services">Hizmetlerimizi Keşfedin <ArrowRight size={15} /></a>
              <a className="button button-ghost" href="#contact" data-testid="link-hero-contact">Bizimle İletişime Geçin</a>
            </div>
          </div>
          <div className="hero-bottom">
            <span className="scroll-cue">Keşfetmeye devam edin</span>
            <span className="hero-index"><span /> ER-KA / 01</span>
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="wrap about-grid">
            <div className="about-art reveal">
              <img src="/images/boiler-detail.jpg" alt="Modern bir yaşam alanında özenle konumlandırılmış kombi sistemi" width="720" height="900" loading="lazy" data-testid="image-about-boiler" />
              <div className="art-caption"><small>ER-KA yaklaşımı</small><span>Teknikte incelik.</span></div>
            </div>
            <div className="about-copy reveal">
              <span className="eyebrow">Hakkımızda</span>
              <h2 className="serif">Teknik Uzmanlık.<br />Kusursuz Konfor.</h2>
              <p>ER-KA Kombi Klima olarak yaşam alanlarınızın konforunu önemsiyoruz. Kombi ve klima sistemlerine yönelik bakım, onarım, revizyon ve yedek parça hizmetlerimizle ihtiyaçlarınıza profesyonel çözümler sunuyoruz.</p>
              <a className="text-link" href="#services" data-testid="link-about-services">Hizmet anlayışımızı keşfedin <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        <section className="services section-pad" id="services">
          <div className="wrap">
            <div className="section-heading reveal">
              <span className="eyebrow">Hizmetlerimiz</span>
              <h2 className="serif">Her Detayda<br />Profesyonel Dokunuş.</h2>
              <p>İhtiyacınıza uygun, özenli ve profesyonel teknik çözümler.</p>
            </div>
            <div className="service-cards reveal">
              {services.map((service, index) => (
                <article className="service-card" key={service.id} data-testid={`card-service-${service.id}`}>
                  <a className="service-card-link" href="#contact" aria-label={`${service.title} hakkında bilgi alın`} data-testid={`link-service-${service.id}`}>
                    <div className="service-card-image">
                      <img src={service.image} alt={service.alt} width="720" height="520" loading="lazy" data-testid={`image-service-${service.id}`} />
                      <span className="service-card-number">0{index + 1}</span>
                    </div>
                    <div className="service-card-content">
                      <div><h3 data-testid={`text-service-title-${service.id}`}>{service.title}</h3><p data-testid={`text-service-description-${service.id}`}>{service.description}</p></div>
                      <span className="service-card-arrow" aria-hidden="true"><ArrowRight size={16} /></span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="values section-pad">
          <div className="wrap values-row reveal">
            <div>
              <span className="eyebrow">ER-KA standartları</span>
              <h2 className="serif values-title">Kalite Bir Tercih Değil,<br />Standartlarımızdır.</h2>
            </div>
            <div className="values-grid">
              {values.map((value, index) => <div className="value-item" key={value} data-testid={`text-value-${index + 1}`}><Check size={15} strokeWidth={1.5} /><span>{value}</span></div>)}
            </div>
          </div>
        </section>

        <section className="products section-pad" id="products">
          <div className="wrap">
            <div className="products-top reveal">
              <div className="section-heading">
                <span className="eyebrow">Ürün Grupları</span>
                <h2 className="serif">İhtiyacınıza Uygun<br />Ürün Seçenekleri.</h2>
              </div>
              <p className="products-aside">Yeni ve ikinci el kombi ve klima kategorileri hakkında bilgi almak için bizimle iletişime geçin.</p>
            </div>
            <div className="product-grid reveal">
              {productCategories.map(({ id, title, type, image, alt }) => (
                <article className="product-card" key={id} data-testid={`card-product-category-${id}`}>
                  <div className="product-image">
                    <img src={image} alt={alt} width="640" height="430" loading="lazy" data-testid={`image-product-category-${id}`} />
                    <span>Temsilî kategori görseli</span>
                  </div>
                  <small>{type}</small>
                  <h3 data-testid={`text-product-category-${id}`}>{title}</h3>
                  <a href="#contact" aria-label={`${title} hakkında bilgi al`} data-testid={`link-product-category-${id}`}>Bilgi Al <ArrowRight size={14} /></a>
                </article>
              ))}
            </div>
            <p className="product-disclaimer">Kategori görselleri temsilîdir; ürün bilgisi için bizimle iletişime geçin.</p>
          </div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="wrap contact-grid">
            <div className="contact-copy reveal">
              <span className="eyebrow">İletişim</span>
              <h2 className="serif">Konforunuz İçin<br />Bir Adım Uzağınızdayız.</h2>
              <p>Hizmet ve ürünler hakkında bilgi almak için bize ulaşın. İhtiyacınızı birlikte değerlendirelim.</p>
              <div className="contact-methods">
                <a className="contact-method" href="tel:+905319111769" data-testid="link-contact-phone-primary"><Phone size={17} /><span><small>Bizi arayın</small>0531 911 17 69</span></a>
                <a className="contact-method" href="tel:+905302815002" data-testid="link-contact-phone-secondary"><Phone size={17} /><span><small>Alternatif telefon</small>0530 281 50 02</span></a>
                <a className="contact-method" href="https://wa.me/905319111769" target="_blank" rel="noopener noreferrer" data-testid="link-contact-whatsapp"><MessageCircle size={17} /><span><small>WhatsApp</small>Mesaj gönderin</span></a>
              </div>
            </div>
            <form className="form-card reveal" onSubmit={submitToWhatsApp} noValidate>
              <h3>Size nasıl yardımcı olabiliriz?</h3>
              <p className="form-intro">Bilgilerinizi ve talebinizi paylaşın; mesajınız WhatsApp üzerinden açılacaktır.</p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="name">Ad Soyad</label>
                  <input id="name" name="name" autoComplete="name" value={formValues.name} onChange={(event) => changeField('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} data-testid="input-contact-name" />
                  {errors.name && <span className="field-error" id="name-error" data-testid="error-contact-name">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Telefon</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={formValues.phone} onChange={(event) => changeField('phone', event.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} data-testid="input-contact-phone" />
                  {errors.phone && <span className="field-error" id="phone-error" data-testid="error-contact-phone">{errors.phone}</span>}
                </div>
                <div className="field full">
                  <label htmlFor="service">İlgilendiğiniz hizmet</label>
                  <select id="service" name="service" value={formValues.service} onChange={(event) => changeField('service', event.target.value)} aria-invalid={!!errors.service} aria-describedby={errors.service ? 'service-error' : undefined} data-testid="select-contact-service">
                    <option value="">Hizmet seçin</option>
                    {services.map((service) => <option key={service.title} value={service.title}>{service.title}</option>)}
                    <option value="Ürün Bilgisi">Ürün Bilgisi</option>
                  </select>
                  {errors.service && <span className="field-error" id="service-error" data-testid="error-contact-service">{errors.service}</span>}
                </div>
                <div className="field full">
                  <label htmlFor="message">Mesajınız</label>
                  <textarea id="message" name="message" value={formValues.message} onChange={(event) => changeField('message', event.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} data-testid="input-contact-message" />
                  {errors.message && <span className="field-error" id="message-error" data-testid="error-contact-message">{errors.message}</span>}
                </div>
              </div>
              <p className="whatsapp-note"><MessageCircle size={15} /> Gönder’e bastığınızda mesajınız WhatsApp’ta açılır. İletişimin tamamlanması için WhatsApp ekranında mesajı ayrıca göndermeniz gerekir.</p>
              <button className="button button-gold form-submit" type="submit" data-testid="button-submit-contact">WhatsApp’ta Devam Et <ArrowRight size={15} /></button>
              {submitted && <p className="form-success" role="status" data-testid="status-contact-whatsapp-opened">Mesajınız WhatsApp’ta açıldı. İletişimi tamamlamak için oradan gönderin.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-main">
            <div className="footer-about">
              <a className="brand" href="#home" data-testid="link-footer-home">
                <span className="brand-mark">E</span>
                <span><span className="brand-word">ER-KA</span><span className="brand-sub">KOMBİ KLİMA</span></span>
              </a>
              <p>Kombi ve klima sistemlerinde profesyonel bakım, teknik servis, revizyon ve yedek parça çözümleri.</p>
            </div>
            <div><h4>Keşfedin</h4><div className="footer-list">{navigation.map((item) => <a href={item.href} key={item.href} data-testid={`link-footer-nav-${item.href.slice(1)}`}>{item.label}</a>)}</div></div>
            <div><h4>Hizmetler</h4><div className="footer-list">{services.slice(0, 4).map((service, index) => <a href="#services" key={service.title} data-testid={`link-footer-service-${index + 1}`}>{service.title}</a>)}<a href="#services" data-testid="link-footer-service-parts">Yedek Parça</a><a href="#products" data-testid="link-footer-products">Ürün Grupları</a></div></div>
            <div className="footer-contact"><h4>İletişim</h4><div className="footer-list"><a href="tel:+905319111769" data-testid="link-footer-phone-primary">0531 911 17 69</a><a href="tel:+905302815002" data-testid="link-footer-phone-secondary">0530 281 50 02</a><a href="https://wa.me/905319111769" target="_blank" rel="noopener noreferrer" data-testid="link-footer-whatsapp">WhatsApp üzerinden yazın</a></div></div>
          </div>
          <div className="footer-bottom"><span data-testid="text-footer-copyright">© {new Date().getFullYear()} ER-KA Kombi Klima. Tüm hakları saklıdır.</span><a href="#home" style={{ color: 'inherit', textDecoration: 'none' }} data-testid="link-footer-back-to-top">Başa dön <ChevronDown size={12} style={{ display: 'inline', transform: 'rotate(180deg)' }} /></a></div>
        </div>
      </footer>

      <div className="mobile-actions" aria-label="Hızlı iletişim">
        <a className="mobile-call" href="tel:+905319111769" data-testid="link-mobile-call"><Phone size={15} /> Ara</a>
        <a className="mobile-wa" href="https://wa.me/905319111769" target="_blank" rel="noopener noreferrer" data-testid="link-mobile-whatsapp"><MessageCircle size={15} /> WhatsApp</a>
      </div>
    </div>
  );
}

export default App;
