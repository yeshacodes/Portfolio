import { useReveal } from '../hooks/useReveal';

export function Now() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="now" className="ed-section">
      <div className="ed-wrap ed-now" ref={ref}>
        <div className="ed-reveal">
          <p className="ed-eyebrow">Now</p>
          <p className="ed-now-meta">Atlanta, GA · Updated June 2026</p>
        </div>

        <div className="ed-now-body">
          <p className="ed-reveal d1">
            Graduated with a B.S. in Computer Science from Kennesaw State University in May 2026.
            Recently completed a software engineering internship at LexisNexis and currently{' '}
            <a href="mailto:yesha.bhavsar02@gmail.com">looking for full-time software engineering
            opportunities</a> in full-stack, backend, and AI.
          </p>
          <p className="ed-reveal d2">
            Most days I'm building something, learning a new technology, planning my next trip,
            or looking for a great place to eat.
          </p>
        </div>
      </div>
    </section>
  );
}
