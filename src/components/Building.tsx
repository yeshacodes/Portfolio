import { useReveal } from '../hooks/useReveal';

const things = [
  {
    title: 'Distributed systems',
    text: "Backends made of moving parts — queues, services, databases — that have to stay correct under load instead of just on my laptop. I like the puzzle of making them not lose things.",
  },
  {
    title: 'AI products',
    text: "RAG pipelines, vector search, things built on top of LLMs. The interesting part isn't the model — it's wiring it into something that actually gives useful, grounded answers.",
  },
  {
    title: 'Interfaces people enjoy using',
    text: "The frontend matters as much as the backend to me. I'd rather ship something that feels obvious and a little pleasant than something technically clever that's annoying to use.",
  },
];

export function Building() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="building" className="ed-section">
      <div className="ed-wrap" ref={ref}>
        <div className="ed-build-head">
          <p className="ed-eyebrow ed-reveal">What I do</p>
          <h2 className="ed-h2 ed-reveal d1">
            Things I like <span className="ed-em">building</span>
          </h2>
        </div>

        <div className="ed-build-list">
          {things.map((t, i) => (
            <div className="ed-build-row ed-reveal" key={t.title}>
              <span className="ed-build-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ed-h3 ed-build-title">{t.title}</h3>
              <p className="ed-build-text">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
