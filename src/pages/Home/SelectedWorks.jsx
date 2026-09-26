import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { useScene } from '../../lib/useScene.js';
import { artworks, artUrl, artSrcSet } from '../../data/catalog.mjs';

// Paintings scattered over a tall canvas; each moves at its own speed on scroll.
const LAYOUT = [
  { art: 'the-hat',         x: 36, y: 2,  w: 28, speed: 0.6 },
  { art: 'anatomy-of-us',   x: 4,  y: 22, w: 18, speed: 1.4 },
  { art: 'veins',           x: 74, y: 18, w: 20, speed: 1.0 },
  { art: 'earring',         x: 40, y: 48, w: 22, speed: 0.9 },
  { art: 'cockatoo',        x: 10, y: 66, w: 16, speed: 1.6 },
  { art: 'turban',          x: 70, y: 62, w: 18, speed: 1.2 },
];

export default function SelectedWorks() {
  const root = useRef(null);

  useScene(root, () => {
    // Parallax travel is shorter on phones so items stay close together.
    gsap.matchMedia().add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (c) => {
      const amp = c.conditions.mobile ? 0.35 : 1;
      gsap.utils.toArray('.sw-item').forEach((el) => {
        const speed = Number(el.dataset.speed);
        gsap.fromTo(
          el,
          { y: 120 * speed * amp },
          { y: -220 * speed * amp, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } }
        );
      });
    });
    gsap.from('.sw-head .line', {
      yPercent: 110, stagger: 0.12, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.sw-head', start: 'top 85%' },
    });
  }, { waitForInput: true });

  return (
    <section ref={root} className="sw">
      <header className="sw-head">
        <span className="eyebrow">01 — Selected works</span>
        <h2 className="display">
          <span className="line-mask"><span className="line">A room of</span></span>
          <span className="line-mask"><span className="line">floating canvases</span></span>
        </h2>
      </header>
      <div className="sw-canvas">
        {LAYOUT.map((l, i) => {
          const a = artworks.find((x) => x.id === l.art);
          return (
            <Link
              key={a.id}
              to={`/shop?art=${a.id}`}
              className="sw-item"
              data-speed={l.speed}
              data-cursor="View"
              style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.w}%` }}
            >
              <span className="sw-index">{String(i + 1).padStart(2, '0')}</span>
              <figure style={{ aspectRatio: `${a.width} / ${a.height}` }}>
                <img src={artUrl(a.id)} srcSet={artSrcSet(a.id)} sizes={`(max-width: 900px) 44vw, ${l.w}vw`} alt={a.alt || a.title} loading="lazy" decoding="async" />
              </figure>
              <figcaption className="sw-cap">
                <strong>{a.title}</strong>
                <span>{a.medium}</span>
                <span>{a.width} × {a.height} cm</span>
                <span>{a.year}</span>
              </figcaption>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
