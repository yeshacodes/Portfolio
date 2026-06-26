import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { resumeData } from '../data/resume';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgwqbrd';

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { email, links } = resumeData.personalInfo;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="ed-section">
      <div className="ed-wrap ed-contact" ref={ref}>
        <div>
          <p className="ed-eyebrow ed-reveal">Get in touch</p>
          <h2 className="ed-h2 ed-contact-h ed-reveal d1">
            Say <span className="ed-em">hello</span>
          </h2>
          <p className="ed-contact-p ed-reveal d2">
            Looking for full-time roles in full-stack, backend, and AI. Or if you just want to
            talk shop, that works too.
          </p>
          <div className="ed-contact-links ed-reveal d3">
            <a className="ed-link ed-link--accent" href={`mailto:${email}`}>
              {email} <span className="ed-arrow">→</span>
            </a>
            <a className="ed-link" href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn <span className="ed-arrow">↗</span>
            </a>
            <a className="ed-link" href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub <span className="ed-arrow">↗</span>
            </a>
          </div>
        </div>

        <form className="ed-form ed-reveal d2" onSubmit={handleSubmit}>
          <input type="text" name="_gotcha" style={{ display: 'none' }} />
          <div className="ed-form-row">
            <input className="ed-input" name="name" placeholder="Your name" required />
            <input className="ed-input" name="email" type="email" placeholder="your@email.com" required />
          </div>
          <input className="ed-input" name="subject" placeholder="Subject" required />
          <textarea className="ed-input ed-textarea" name="message" placeholder="Your message…" required />
          <button type="submit" className="ed-btn ed-btn-dark" disabled={status === 'loading'} style={{ alignSelf: 'flex-start' }}>
            {status === 'loading' ? 'Sending…' : 'Send message →'}
          </button>
          {status === 'success' && <p className="ed-form-ok">Sent — I'll get back to you soon.</p>}
          {status === 'error' && <p className="ed-form-err">Something went wrong. Email me directly?</p>}
        </form>
      </div>
    </section>
  );
}
