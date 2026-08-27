import { useReveal } from '../hooks/useReveal';
import { Placeholder } from './Placeholder';

// Real photos mapped to the interests they best fit. Badminton and New
// Restaurants are travel stand-ins until dedicated photos exist — swap `src`.
const moments = [
  { cat: 'Travel', note: 'New places, often.', src: '/images/place-6.JPEG', ratio: '4 / 3' },
  { cat: 'Painting', note: 'When I need to slow down.', src: '/images/painting.png', ratio: '3 / 4' },
  { cat: 'Hiking', note: 'Mostly for the view.', src: '/images/place-5.JPEG', ratio: '3 / 4' },
  { cat: 'New Restaurants', note: 'Always hunting.', src: '/images/food.JPEG', ratio: '4 / 5' },
  { cat: 'Exploring', note: 'Wandering, no plan.', src: '/images/place-2.JPEG', ratio: '4 / 3' },
];

export function OutsideOfCode() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="outside" className="ed-section ed-section--linen">
      <div className="ed-wrap" ref={ref}>
        <div className="ed-outside-head">
          <p className="ed-eyebrow ed-reveal">Off the clock</p>
          <h2 className="ed-h2 ed-reveal d1">Outside of code</h2>
          <p className="ed-lead ed-reveal d2" style={{ marginTop: '1.25rem' }}>
            I get bored easily, so I'm rarely sitting still. A few of the things that fill the
            rest of my time.
          </p>
        </div>

        <div className="ed-life-grid">
          <div className="ed-life-col">
            {moments.filter((_, i) => i % 2 === 0).map((m) => (
              <figure className="ed-life-card ed-reveal" key={m.cat}>
                <Placeholder className="ed-life-photo" ratio={m.ratio} label={m.cat} src={m.src} alt={m.cat} />
                <figcaption className="ed-life-cap">
                  <span className="ed-life-cat">{m.cat}</span>
                  <span className="ed-life-note">{m.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="ed-life-col">
            {moments.filter((_, i) => i % 2 === 1).map((m) => (
              <figure className="ed-life-card ed-reveal" key={m.cat}>
                <Placeholder className="ed-life-photo" ratio={m.ratio} label={m.cat} src={m.src} alt={m.cat} />
                <figcaption className="ed-life-cap">
                  <span className="ed-life-cat">{m.cat}</span>
                  <span className="ed-life-note">{m.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
