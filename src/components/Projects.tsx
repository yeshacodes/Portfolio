import { useReveal } from '../hooks/useReveal';
import { Placeholder } from './Placeholder';
import { resumeData } from '../data/resume';

type Project = typeof resumeData.projects[number];

function fallbackMetrics(p: Project) {
  // Projects without an explicit metrics array still get a single highlight.
  return [{ value: (p as any).impact ? '' : '', desc: '' }];
}

export function Projects() {
  const ref = useReveal<HTMLDivElement>();
  const projects = resumeData.projects;

  return (
    <section id="projects" className="ed-section">
      <div className="ed-wrap" ref={ref}>
        <div className="ed-proj-head">
          <div>
            <p className="ed-eyebrow ed-reveal">Selected work</p>
            <h2 className="ed-h2 ed-reveal d1">Projects, as stories</h2>
          </div>
          <span className="ed-proj-count ed-reveal d2">
            {String(projects.length).padStart(2, '0')} projects · full-stack, AI, distributed systems
          </span>
        </div>

        {projects.map((p, i) => {
          const metrics =
            'metrics' in p && Array.isArray((p as any).metrics)
              ? ((p as any).metrics as Array<{ value: string; desc: string }>)
              : fallbackMetrics(p);
          const showMetrics = metrics.some((m) => m.value);

          return (
            <article key={p.title} className="ed-proj ed-reveal">
              <div className="ed-proj-head-row">
                <p className="ed-proj-index">{String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</p>
                <p className="ed-proj-cat">{(p as any).category}</p>
                <h3 className="ed-h3 ed-proj-title">{p.title}</h3>
                <p className="ed-proj-sub">{p.subtitle}</p>
              </div>

              <div className="ed-proj-visual">
                <Placeholder ratio="2 / 1" label={p.title} hint="Project screenshot or visual" src={(p as any).image} alt={p.title} />
              </div>

              <div className="ed-proj-detail">
                <div className="ed-proj-story">
                  <div className="ed-proj-story-row">
                    <span className="ed-proj-story-label">Problem</span>
                    <span className="ed-proj-story-text">{(p as any).problem}</span>
                  </div>
                  <div className="ed-proj-story-row">
                    <span className="ed-proj-story-label">Built</span>
                    <span className="ed-proj-story-text">{(p as any).built}</span>
                  </div>
                  <div className="ed-proj-story-row">
                    <span className="ed-proj-story-label">Impact</span>
                    <span className="ed-proj-story-text">{(p as any).impact}</span>
                  </div>
                </div>

                <div className="ed-proj-aside">
                  {showMetrics && (
                    <div className="ed-proj-metrics">
                      {metrics.filter((m) => m.value).map((m) => (
                        <div key={m.value}>
                          <div className="ed-proj-metric-val">{m.value}</div>
                          <div className="ed-proj-metric-desc">{m.desc}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ed-proj-tags">
                    {p.techStack.map((t) => (
                      <span key={t} className="ed-proj-tag">{t}</span>
                    ))}
                  </div>

                  <div className="ed-proj-links">
                    {(p as any).link && (
                      <a className="ed-link ed-link--accent" href={(p as any).link.url} target="_blank" rel="noopener noreferrer">
                        {(p as any).link.label} <span className="ed-arrow">↗</span>
                      </a>
                    )}
                    {(p as any).github && (
                      <a className="ed-link" href={(p as any).github} target="_blank" rel="noopener noreferrer">
                        GitHub <span className="ed-arrow">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
