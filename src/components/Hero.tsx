import { resumeData } from '../data/resume';
import { Placeholder } from './Placeholder';

export function Hero() {
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="ed-hero">
      <div>
        <p className="ed-hero-eyebrow">Software Engineer · Atlanta, GA</p>
        <h1 className="ed-hero-name">
          Yesha<br />
          <em>Bhavsar</em>
        </h1>
        <p className="ed-hero-intro">
          I build full-stack and backend systems, and I like understanding how things work all
          the way down. This is some of what I've built — and a bit of who I am outside of it.
        </p>
        <div className="ed-hero-actions">
          <button className="ed-btn ed-btn-dark" onClick={() => go('projects')}>
            See the work
          </button>
          <a className="ed-link" href={`mailto:${resumeData.personalInfo.email}`}>
            Say hello <span className="ed-arrow">→</span>
          </a>
        </div>
      </div>

      <div className="ed-hero-portrait">
        <Placeholder ratio="4 / 5" label="Portrait" src="/images/place-1.JPEG" alt="Yesha Bhavsar" />
      </div>

      <div className="ed-hero-scroll" aria-hidden="true">
        Scroll
        <span className="ed-hero-scroll-line" />
      </div>
    </section>
  );
}
