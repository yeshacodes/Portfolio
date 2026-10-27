import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Copy, Download, Github, Linkedin, Mail, Menu, X } from 'lucide-react';
import { Hero } from '../components/Hero';
import { resumeData } from '../data/resume';
import { CAREGAP } from './caregap';
import { ABOUT, ABOUT_TITLE, CASES, EXPERIENCE, HERO_BIO, type CaseCopy } from './copy';
import { PULSECHECK } from './pulsecheck';
import './darkroom.css';

// Darkroom portfolio. Yesha's red hero is the safelight: the room darkens around her, she becomes the first print on
// the drying line, and the rest of the work develops as you scroll. Red is where it starts; colour arrives as each
// print is developed, and the room lights come on at the end.

const P = resumeData.personalInfo, ED = resumeData.education[0], SK = resumeData.skills;
const NOW = EXPERIENCE[0];                                                          // the current role

type Analysis = typeof CAREGAP.analysis;
type Work = {
  title: string; subtitle: string; category: string; techStack: readonly string[]; description: string; image: string; imageFocus?: string;
  link?: { readonly label: string; readonly url: string }; github?: string;
  copy?: CaseCopy; analysis?: Analysis;
};
// Order follows the Portfolio repo: FlowCommerce, CareGap, then the rest of the résumé projects, with PulseCheck after
// LearnBot as on the October 2026 résumé. Each app project takes its darkroom wording from copy.ts; links, images and
// categories still come from the résumé data.
const withCopy = (w: Work): Work => {
  const c = CASES[w.title];
  return c ? { ...w, subtitle: c.subtitle, description: c.what, techStack: c.techStack ?? w.techStack, copy: c } : w;
};
const BASE = (resumeData.projects as readonly Work[]).map(withCopy);
const WORK: Work[] = [BASE[0], CAREGAP, BASE[1], withCopy(PULSECHECK), ...BASE.slice(2)];
const printNo = (i: number) => String(i + 1).padStart(3, '0');       // projects are numbered 001–007 in line order
const COUNT = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][WORK.length] ?? String(WORK.length);

// Yesha's painting, as she uploaded it. If this is ever set to null, the Painting print is left out entirely.
const PAINTING_SRC: string | null = '/images/yesha-painting.webp';
const ALL_TRIPS = [
  { cat: 'Travel', note: 'New places, as often as I can.', src: '/images/place-6.JPEG' as string | null },
  { cat: 'Painting', note: 'What I do when I want to slow down.', src: PAINTING_SRC },
  { cat: 'Hiking', note: 'Mostly for the view at the top.', src: '/images/place-5.JPEG' },
  { cat: 'New restaurants', note: 'Always on the lookout for the next one.', src: '/images/food.JPEG' },
  { cat: 'Exploring', note: 'Wandering around with no real plan.', src: '/images/place-2.JPEG' },
];
const TRIPS = ALL_TRIPS.filter((t): t is { cat: string; note: string; src: string } => !!t.src);
const SHELF: [string, string, readonly string[]][] = [
  ['01', 'Languages', SK.languages], ['02', 'Backend', SK.backend], ['03', 'Cloud & databases', SK.cloud],
  ['04', 'AI & data', SK.ai], ['05', 'Frontend', SK.frontend], ['06', 'DevOps & testing', SK.devops],
];
const NAV = [['about', 'About'], ['work', 'Projects'], ['experience', 'Experience'], ['skills', 'Skills'], ['outside', 'Outside of code'], ['contact', 'Contact']] as const;

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const smooth = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Reduced motion follows the system setting; ?reduced-motion forces it for review.
const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]reduced-motion/.test(location.search);

export function Darkroom() {
  const reduced = useRef(prefersReduced());
  const opening = useRef<HTMLElement>(null);
  const print = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [light, setLight] = useState<'safe' | 'warm' | 'on'>('safe');
  const [open, setOpen] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  // ---------- scroll-driven scenes ----------
  useEffect(() => {
    let raf = 0, alive = true, sentKey = '';
    const ptr = { x: innerWidth / 2, y: innerHeight / 2 };
    const onMove = (e: PointerEvent) => { if (!e.isTrusted) return; ptr.x = e.clientX; ptr.y = e.clientY; sentKey = ''; };
    addEventListener('pointermove', onMove, { passive: true });
    const root = document.documentElement;
    const tick = () => { if (!alive) return; raf = requestAnimationFrame(tick); frame(); };
    // review aid: ?capture exposes one synchronous frame, for screenshots while the window is in the background
    if (location.search.includes('capture')) (window as unknown as { __dr: unknown }).__dr = { frame: () => frame() };
    const frame = () => {
      const W = innerWidth, H = innerHeight, rm = reduced.current;

      // 1. The opening: the room darkens, a safelight lowers, the hero becomes a print on the line. Short on purpose.
      const op = opening.current, pr = print.current;
      if (op && pr) {
        const r = op.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - H));
        const k = rm ? (p > 0.04 ? 1 : 0) : smooth(seg(p, 0.04, 0.62));
        const narrow = W < 760, target = narrow ? 0.8 : 0.5;
        const s = lerp(1, target, k), cx = W / 2, cy = lerp(H / 2, narrow ? H * 0.42 : H * 0.48, k);
        const x = cx - (W * s) / 2, y = cy - (H * s) / 2, rot = lerp(0, -1.4, k);
        pr.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s})`;
        op.style.setProperty('--k', String(k)); op.style.setProperty('--bw', `${(14 / s) * smooth(seg(k, 0.25, 0.8))}px`);
        op.style.setProperty('--copy', String(1 - smooth(seg(p, 0.02, 0.08))));
        op.style.setProperty('--pin-y', `${y - 22}px`);
        const navk = r.bottom > H ? smooth(seg(p, 0.06, 0.3)) : 1;                       // the hero keeps its own nav until it becomes a print
        root.style.setProperty('--navk', String(navk));
        const nav = document.querySelector<HTMLElement>('.dr-nav'); if (nav) nav.style.pointerEvents = navk > 0.5 ? 'auto' : 'none';
        pr.style.pointerEvents = p < 0.02 ? 'auto' : 'none';
        // her gaze keeps finding the real cursor while she is a print (rotation is small enough to ignore)
        if (k > 0.001) {
          const mx = (ptr.x - x) / s, my = (ptr.y - y) / s, key = `${Math.round(mx)},${Math.round(my)}`;
          if (key !== sentKey && r.bottom > 0) { sentKey = key; dispatchEvent(new PointerEvent('pointermove', { clientX: mx, clientY: my })); }
        } else if (sentKey !== 'id') { sentKey = 'id'; dispatchEvent(new PointerEvent('pointermove', { clientX: ptr.x, clientY: ptr.y })); }
      }

      // 2. The drying line: vertical scroll moves the line sideways; prints develop as they reach the inspection lamp.
      const ln = line.current, tk = track.current;
      if (ln && tk && W >= 760) {
        const r = ln.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - H));
        const first = tk.firstElementChild as HTMLElement | null, last = tk.lastElementChild as HTMLElement | null;
        if (first && last) {
          const start = W / 2 - (first.offsetLeft + first.offsetWidth / 2), end = W / 2 - (last.offsetLeft + last.offsetWidth / 2);
          tk.style.transform = `translateX(${lerp(start, end, p)}px)`;
          [...tk.children].forEach(c => {
            const el = c as HTMLElement, b = el.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - W / 2) / (W * 0.55);
            el.style.setProperty('--c', String(rm ? 1 : smooth(1 - d)));                     // colour under the lamp
            el.style.setProperty('--dev', String(rm ? 1 : smooth(1.25 - d)));                // latent → developed
          });
        }
      } else if (tk) { tk.style.transform = ''; [...tk.children].forEach(c => { (c as HTMLElement).style.setProperty('--c', '1'); (c as HTMLElement).style.setProperty('--dev', '1'); }); }
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); };
  }, []);

  // ---------- room lighting follows the section in view ----------
  useEffect(() => {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setLight((e.target as HTMLElement).dataset.light as 'safe' | 'warm' | 'on'); }), { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll<HTMLElement>('[data-light]').forEach(s => io.observe(s));
    // the negative strip prints to a positive once it is seen
    const neg = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).dataset.printed = 'true'; }), { threshold: 0.45 });
    document.querySelectorAll('.dr-frame').forEach(f => { if (reduced.current) (f as HTMLElement).dataset.printed = 'true'; else neg.observe(f); });
    return () => { io.disconnect(); neg.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menu) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [menu]);

  const openPrint = (i: number, from: HTMLElement) => { lastFocus.current = from; setOpen(i); };
  const closePrint = useCallback(() => { setOpen(null); setTimeout(() => lastFocus.current?.focus({ preventScroll: true }), 0); }, []);
  const go = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: reduced.current ? 'auto' : 'smooth' }); };

  return (
    <main className="dr" data-light={light} data-reduced={reduced.current}>
      <div className="dr-room" aria-hidden="true" />

      <nav className="dr-nav" aria-label="Sections">
        <button type="button" className="dr-brand" onClick={() => scrollTo({ top: 0, behavior: reduced.current ? 'auto' : 'smooth' })}>Yesha</button>
        <div className="dr-links">{NAV.map(([id, label]) => <button key={id} type="button" onClick={() => go(id)}>{label}</button>)}</div>
        <a className="dr-cv" href={P.resumePdf} target="_blank" rel="noreferrer">Résumé</a>
        <button type="button" className="dr-menu-btn" aria-expanded={menu} aria-controls="dr-menu" onClick={() => setMenu(m => !m)}>{menu ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}<span>Menu</span></button>
        {menu && <div id="dr-menu" className="dr-menu">{NAV.map(([id, label]) => <button key={id} type="button" onClick={() => go(id)}>{label}</button>)}</div>}
      </nav>

      {/* 1. The opening: the live hero becomes the first print on the line */}
      <section ref={opening} className="dr-opening" data-light="safe" aria-label="Introduction">
        <div className="dr-opening-stage">
          <div className="dr-safelight" aria-hidden="true"><span className="dr-lamp" /><span className="dr-cone" /></div>
          <div className="dr-wire" aria-hidden="true"><span className="dr-pin" /></div>
          <div ref={print} className="dr-print-hero"><Hero bio={HERO_BIO} /></div>
          <div className="dr-opening-label" aria-hidden="true">
            <p className="dr-mono">Software engineer · {P.location}</p>
            <p className="dr-pencil">Yesha Bhavsar</p>
          </div>
        </div>
      </section>

      {/* 2. About: the words that go with the hero's print */}
      <section id="about" className="dr-section dr-about" data-light="safe" aria-labelledby="about-title">
        <span id="building" className="dr-anchor" aria-hidden="true" />{/* the hero's own About button */}
        <div className="dr-copy">
          <p className="dr-mono">01 · About</p>
          <h2 id="about-title">{ABOUT_TITLE}</h2>
          <p className="dr-lede">{ABOUT[0]}</p>
          {ABOUT.slice(1).map(t => <p key={t}>{t}</p>)}
          <div className="dr-actions">
            <button type="button" className="is-solid" onClick={() => go('work')}>See my projects <ArrowRight size={15} aria-hidden="true" /></button>
            <span className="dr-cv-pair">
              <a href={P.resumePdf} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={15} aria-hidden="true" /></a>
              <a href={P.resumePdf} download="Yesha_Bhavsar_Resume.pdf"><Download size={15} aria-hidden="true" /> Download PDF</a>
            </span>
            <a href={P.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} aria-hidden="true" /> LinkedIn</a>
            <a href={P.links.github} target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" /> GitHub</a>
          </div>
        </div>
        <dl className="dr-log" aria-label="At a glance">
          <div><dt>Based in</dt><dd>{P.location}</dd></div>
          <div><dt>Degree</dt><dd>BS Computer Science, {ED.school} · {ED.graduationDate}</dd></div>
          <div><dt>GPA</dt><dd>{ED.gpa} · Member of Upsilon Pi Epsilon (UPE)</dd></div>
          <div><dt>Currently</dt><dd>{NOW.role}, {NOW.company}</dd></div>
        </dl>
      </section>

      {/* 3. Work: the drying line */}
      <section ref={line} id="work" className="dr-line" data-light="safe" style={{ height: `${100 + WORK.length * 58}vh` }} aria-labelledby="work-title">
        <span id="projects" className="dr-anchor" aria-hidden="true" />{/* the hero's own Work button */}
        <div className="dr-line-stage">
          <header className="dr-line-head">
            <p className="dr-mono">02 · Projects</p>
            <h2 id="work-title">Things I’ve built</h2>
            <p>{COUNT} projects, each with what it does, the idea behind it, and how it works. Scroll along the line, or pick one below.</p>
          </header>
          <ol className="dr-index" aria-label="All projects">
            {WORK.map((w, i) => <li key={w.title}><button type="button" onClick={e => openPrint(i, e.currentTarget)}><span className="dr-mono">{printNo(i)}</span>{w.title}</button></li>)}
          </ol>
          <div className="dr-inspect" aria-hidden="true" />
          <div className="dr-wire dr-wire-long" aria-hidden="true" />
          <div ref={track} className="dr-track" role="list">
            {WORK.map((w, i) => (
              <div key={w.title} className="dr-hang" role="listitem" style={{ animationDelay: `${-i * 1.3}s` }}>
                <span className="dr-pin" aria-hidden="true" />
                <button type="button" className="dr-photo" onClick={e => openPrint(i, e.currentTarget)} aria-label={`${w.title}: ${w.subtitle}. Open the case study`}>
                  <span className="dr-photo-img"><img src={w.image} alt="" loading="lazy" style={{ objectPosition: w.imageFocus ?? 'center top' }} /><span className="dr-tint" /></span>
                  <span className="dr-photo-cap"><span className="dr-pencil">{w.title}</span><span className="dr-mono">No. {printNo(i)} · {w.category}</span></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Experience: the negative strip */}
      <section id="experience" className="dr-section dr-experience" data-light="safe" aria-labelledby="xp-title">
        <header className="dr-head"><p className="dr-mono">03 · Experience</p><h2 id="xp-title">Where I’ve worked</h2><p>My internships, starting with the one I’m in now.</p></header>
        {/* one negative strip per role, most recent first; frames are lettered by roll (A, B, …) */}
        {EXPERIENCE.map((x, r) => (
          <div key={x.company} className="dr-role">
            <h3>{x.role} at {x.company}</h3>
            <p className="dr-role-meta">{x.location} · {x.dates}</p>
            <div className="dr-strip" tabIndex={0} aria-label={`${x.company} highlights, scrolls sideways`}>
              {x.points.map((d, i) => (
                <article key={i} className="dr-frame" data-printed="false"><span className="dr-mono">{String(i + 1).padStart(2, '0')}{String.fromCharCode(65 + r)}</span><p>{d}</p></article>
              ))}
            </div>
            <p className="dr-swipe" aria-hidden="true">Swipe for more <ArrowRight size={12} /></p>{/* phones only; the strip's label already says it scrolls */}
          </div>
        ))}
        <p className="dr-edu"><span className="dr-mono">Education</span> BS in Computer Science, {ED.school} · {ED.graduationDate} · GPA {ED.gpa} · Member of Upsilon Pi Epsilon (UPE)</p>
      </section>

      {/* 5. Skills: the chemistry shelf */}
      <section id="skills" className="dr-section dr-skills" data-light="safe" aria-labelledby="sk-title">
        <header className="dr-head"><p className="dr-mono">04 · Skills</p><h2 id="sk-title">Tools I work with</h2><p>The languages, frameworks, and tools I reach for most.</p></header>
        <ul className="dr-shelf">
          {SHELF.map(([no, name, items]) => (
            <li key={name} className="dr-bottle">
              <span className="dr-cap" aria-hidden="true" />
              <div className="dr-glass">
                <div className="dr-label">
                  <p className="dr-label-no">No. {no}</p>
                  <h3>{name}</h3>
                  <ul>{items.map(s => <li key={s}>{s}</li>)}</ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ul className="dr-certs">{resumeData.certifications.map(c => <li key={c.name}><span className="dr-mono">{c.date}</span> {c.name} ({c.issuer.replace(' (Coursera)', ', via Coursera')})</li>)}</ul>
      </section>

      {/* 6. Outside of code: prints from the trips */}
      <section id="outside" className="dr-section dr-outside" data-light="warm" aria-labelledby="out-title">
        <header className="dr-head"><p className="dr-mono">05 · Outside of code</p><h2 id="out-title">Painting, food, and new places</h2><p>When I’m not building something, I’m usually somewhere new, at a canvas, or looking for a good place to eat. A few favorites:</p></header>
        <div className="dr-wire dr-wire-trips" aria-hidden="true" />
        <ul className="dr-trips" style={{ ['--n' as string]: TRIPS.length }}>
          {TRIPS.map((t, i) => (
            <li key={t.cat} style={{ ['--r' as string]: `${[-3, 2, -1.5, 3, -2][i % 5]}deg` }}>
              <span className="dr-pin" aria-hidden="true" />
              <figure>
                <img src={t.src} alt={t.cat} loading="lazy" />
                <figcaption><span className="dr-pencil">{t.cat}</span>{t.note}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* 7. Contact: lights on */}
      <section id="contact" className="dr-section dr-contact" data-light="on" aria-labelledby="ct-title">
        <p className="dr-mono">Lights on</p>
        <h2 id="ct-title">Say hello.</h2>
        <p>Thanks for looking around. I’m looking for a full-time software engineering role, in full-stack, backend, or AI, and I’d love to hear about what you’re building.</p>
        <p>I’m based in {P.location}. Email is the quickest way to reach me.</p>
        <Email email={P.email} />
        <div className="dr-actions">
          <a className="is-solid" href={P.resumePdf} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={15} aria-hidden="true" /></a>
          <a href={P.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} aria-hidden="true" /> LinkedIn</a>
          <a href={P.links.github} target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" /> GitHub</a>
        </div>
        <p className="dr-foot dr-mono">Yesha Bhavsar · {new Date().getFullYear()}</p>
      </section>

      {open !== null && <LightTable index={open} onClose={closePrint} onMove={i => setOpen(i)} />}
    </main>
  );
}

function Email({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => undefined); };
  return (
    <p className="dr-email">
      <a href={`mailto:${email}`}><Mail size={18} aria-hidden="true" /> {email}</a>
      <button type="button" onClick={copy} aria-label="Copy email address"><Copy size={15} aria-hidden="true" /> {copied ? 'Copied' : 'Copy email'}</button>
    </p>
  );
}

/* ---------- The light table: one print, a loupe, and the case study ---------- */
function LightTable({ index, onClose, onMove }: { index: number; onClose: () => void; onMove: (i: number) => void }) {
  const w = WORK[index], n = WORK.length;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const fine = useRef(matchMedia('(hover: hover) and (pointer: fine)').matches);
  const [loupe, setLoupe] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [touchZoom, setTouchZoom] = useState(false);
  useEffect(() => { closeBtn.current?.focus({ preventScroll: true }); surface.current?.scrollTo({ top: 0 }); setLoupe(null); setTouchZoom(false); }, [index]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onMove((index + 1) % n);
      if (e.key === 'ArrowLeft') onMove((index + n - 1) % n);
      if (e.key === 'Tab' && surface.current) {                                           // keep focus inside the dialog
        const f = [...surface.current.querySelectorAll<HTMLElement>('button, a[href]')]; if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    };
    addEventListener('keydown', k); const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [index, n, onClose, onMove]);
  // Mouse: the loupe follows the pointer. Touch: tap to pick up the loupe, drag to move it (it sits above the finger),
  // tap again to put it down; page scrolling is only blocked while the loupe is held.
  const place = (e: React.PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setLoupe({ x: e.clientX - r.left, y: e.clientY - r.top - (fine.current ? 0 : 70), w: r.width, h: r.height }); };
  const onMoveP = (e: React.PointerEvent<HTMLDivElement>) => { if (fine.current || touchZoom) place(e); };
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => { if (fine.current) return; if (touchZoom) { setTouchZoom(false); setLoupe(null); } else { setTouchZoom(true); place(e); } };
  const Z = 2.4, L = fine.current ? 170 : 140;
  const A = w.analysis;
  return (
    <div className="dr-table" role="dialog" aria-modal="true" aria-labelledby="lt-title">
      <div ref={surface} className="dr-table-surface">
        <div className="dr-table-bar">
          <button ref={closeBtn} type="button" onClick={onClose}><X size={16} aria-hidden="true" /> Back to projects</button>
          <span className="dr-mono">Project {index + 1} of {n}</span>
          <span className="dr-table-nav">
            <button type="button" onClick={() => onMove((index + n - 1) % n)} aria-label={`Previous project: ${WORK[(index + n - 1) % n].title}`}><ArrowLeft size={16} aria-hidden="true" /></button>
            <button type="button" onClick={() => onMove((index + 1) % n)} aria-label={`Next project: ${WORK[(index + 1) % n].title}`}><ArrowRight size={16} aria-hidden="true" /></button>
          </span>
        </div>
        <div className="dr-table-body">
          <div className="dr-table-print">
            <div className={`dr-loupe-area${touchZoom ? ' is-held' : ''}`} onPointerMove={onMoveP} onPointerDown={onDown} onPointerLeave={() => { if (fine.current) setLoupe(null); }}>
              <img src={w.image} alt={A ? `${w.title} Power BI dashboard` : `${w.title} interface`} />
              {loupe && <span className="dr-loupe" aria-hidden="true" style={{ left: loupe.x - L / 2, top: loupe.y - L / 2, width: L, height: L, backgroundImage: `url(${w.image})`, backgroundSize: `${loupe.w * Z}px ${loupe.h * Z}px`, backgroundPosition: `${-(loupe.x * Z - L / 2)}px ${-(loupe.y * Z - L / 2)}px` }} />}
            </div>
            <p className="dr-pencil dr-table-cap">{w.title}</p>
            <p className="dr-table-tip">{fine.current ? 'Hover over the screenshot to zoom in.' : touchZoom ? 'Drag to move the magnifier. Tap again to put it away.' : 'Tap the screenshot to zoom in.'}</p>
          </div>
          <article className="dr-case">
            <p className="dr-mono">{w.subtitle} · {w.category}</p>
            <h2 id="lt-title">{w.title}</h2>
            <p className="dr-lede">{w.description}</p>
            {A ? <AnalysisCase a={A} /> : w.copy && (
              <div className="dr-story">
                <section><h3>The idea</h3><p>{w.copy.idea}</p></section>
                <section><h3>How it works</h3>{w.copy.how.map(t => <p key={t}>{t}</p>)}</section>
                <section><h3>Results</h3>{w.copy.results && <p>{w.copy.results}</p>}
                  <ul className="dr-metrics">{w.copy.metrics.map(m => <li key={m.value}><b>{m.value}</b><span>{m.desc}</span></li>)}</ul>
                </section>
              </div>
            )}
            {w.copy?.toolGroups ? (
              <div className="dr-stack"><span>Tools</span>
                <dl>{w.copy.toolGroups.map(([layer, tools]) => <div key={layer}><dt>{layer}</dt><dd>{tools}</dd></div>)}</dl>
              </div>
            ) : <p className="dr-stack"><span>Tools</span> {w.techStack.join(' · ')}</p>}
            <div className="dr-actions">
              {w.link && <a className="is-solid" href={w.link.url} target="_blank" rel="noreferrer">{w.link.label} <ArrowUpRight size={15} aria-hidden="true" /></a>}
              {w.github && <a href={w.github} target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" /> GitHub</a>}
            </div>
            <p className="dr-next"><button type="button" onClick={() => onMove((index + 1) % n)}>Next project: {WORK[(index + 1) % n].title} <ArrowRight size={15} aria-hidden="true" /></button></p>
          </article>
        </div>
      </div>
    </div>
  );
}

/* CareGap reads as an analysis: question, data, method, findings, and the honest limits of the data. */
function AnalysisCase({ a }: { a: Analysis }) {
  return (
    <div className="dr-analysis">
      <section><h3>The questions</h3><ul>{a.questions.map(q => <li key={q}>{q}</li>)}</ul></section>
      <section><h3>The data</h3><p>{a.source}</p>
        <ul className="dr-summary">{a.summary.map(s => <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}</ul>
      </section>
      <section><h3>The method</h3><ol className="dr-pipeline">{a.pipeline.map(p => <li key={p.step}><b>{p.step}</b><span>{p.detail}</span></li>)}</ol></section>
      <section><h3>What the data shows</h3><ul>{a.findings.map(f => <li key={f}>{f}</li>)}</ul></section>
      <section><h3>Limitations</h3><p className="dr-caveat">{a.limitations}</p></section>
      <section><h3>Next questions</h3><p>{a.next.join(' · ')}</p></section>
    </div>
  );
}
