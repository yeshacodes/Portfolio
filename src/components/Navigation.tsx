import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { id: 'building', label: 'Building' },
  { id: 'outside', label: 'Outside of Code' },
  { id: 'projects', label: 'Projects' },
  { id: 'now', label: 'Now' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.body.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <div className="ed-nav-progress" style={{ width: `${progress}%` }} aria-hidden="true" />
      <nav className={`ed-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="ed-nav-inner">
          <button className="ed-nav-logo" onClick={() => go('hero')}>
            Yesha Bhavsar<span className="dot">.</span>
          </button>

          <ul className="ed-nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <button className="ed-nav-link" onClick={() => go(item.id)}>
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <button className="ed-nav-cta" onClick={() => go('contact')}>
                Say hello
              </button>
            </li>
          </ul>

          <button
            className="ed-nav-burger"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="ed-mobile-menu">
          {navItems.map((item) => (
            <button key={item.id} className="ed-mobile-link" onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
          <button className="ed-mobile-link" style={{ color: 'var(--ed-accent)' }} onClick={() => go('contact')}>
            Say hello
          </button>
        </div>
      )}
    </>
  );
}
