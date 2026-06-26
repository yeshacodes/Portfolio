import { useEffect, useRef } from 'react';

const chips = [
  'Atlanta, GA',
  'KSU CS · May 2026',
  'Painting',
  'Badminton',
  'Travel',
];

const stats = [
  { num: '3.75', lbl: 'GPA at KSU · UPE Honor Society' },
  { num: '5+',   lbl: 'Projects shipped' },
  { num: '173',  lbl: 'Orders/sec in load testing' },
  { num: '30%',  lbl: 'Test coverage increase at LexisNexis' },
];

const chapters = [
  {
    label: 'What I work on',
    text: (
      <>
        Mostly <strong>full-stack and backend</strong> — APIs, distributed systems, the parts
        that have to not fall over. I like building the whole thing and seeing it actually
        work, not just one slice of it.
      </>
    ),
  },
  {
    label: 'How I work',
    text: (
      <>
        I like understanding how something works end to end, not just the piece I'm handed.
        And I care about things being reliable and actually pleasant to use, not just working
        on my machine.
      </>
    ),
  },
  {
    label: 'Outside work',
    text: (
      <>
        Painting, badminton, and hunting down good places to eat. I get bored easily, so
        there's usually something I'm building or learning on the side.
      </>
    ),
  },
];

export function About() {
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    rightRef.current?.querySelectorAll('.st-chapter, .st-reveal').forEach((el) =>
      observer.observe(el)
    );
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="st-about-section">
      <div className="st-about-sticky-container">

        {/* Left — sticky quote */}
        <div className="st-about-left">
          <span className="st-label" style={{ marginBottom: '1.25rem' }}>About Me</span>
          <h2 className="st-about-quote">
            I build software<br />
            and like figuring out<br />
            <em>how things work.</em>
          </h2>
          <p className="st-about-location">Full-Stack Engineer · Atlanta, GA</p>
          <div className="st-chips">
            {chips.map((chip) => (
              <span key={chip} className="st-chip">{chip}</span>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--st-sans)',
            fontSize: '0.78rem',
            color: 'var(--st-rust)',
            fontWeight: 500,
            marginTop: '1.5rem',
            letterSpacing: '0.01em',
          }}>
            Open to full-time roles in full-stack, backend, and AI.
          </p>
        </div>

        {/* Right — scrolling chapters */}
        <div className="st-about-right" ref={rightRef}>
          {chapters.map((ch) => (
            <div key={ch.label} className="st-chapter">
              <p className="st-chapter-label">{ch.label}</p>
              <p className="st-chapter-text">{ch.text}</p>
            </div>
          ))}

          {/* Stats grid as final chapter */}
          <div className="st-chapter">
            <p className="st-chapter-label">By the numbers</p>
            <div className="st-about-stats">
              {stats.map((s) => (
                <div key={s.num} className="st-about-stat">
                  <div className="st-stat-num">{s.num}</div>
                  <div className="st-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
