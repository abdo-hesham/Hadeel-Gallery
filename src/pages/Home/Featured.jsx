import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { useScene } from '../../lib/useScene.js';
import { artworks, artUrl, artSrcSet } from '../../data/catalog.mjs';

// One painting owns the viewport. Scrolling zooms into the texture before
// releasing to the next section.
export default function Featured() {
  const root = useRef(null);
  const a = artworks.find((x) => x.id === 'the-hat');

  useScene(root, () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=220%', pin: true, scrub: 1 },
      defaults: { ease: 'none' },
    });
    tl.fromTo('.ft-img', { scale: 0.62 }, { scale: 1.0, duration: 0.35 }, 0)
      .to('.ft-img', { scale: 2.6, duration: 0.65 }, 0.35)
      .to('.ft-caption, .ft-label', { opacity: 0, y: -30, duration: 0.2 }, 0.45)
      .fromTo('.ft-detail', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power3.out' }, 0.5)
      .to('.ft-detail', { opacity: 0, y: -12, duration: 0.08, ease: 'power2.in' }, 0.86)
      .to('.ft-veil', { opacity: 1, duration: 0.08 }, 0.92);
  }, { waitForInput: true });

  return (
    <section ref={root} className="ft">
      <div className="ft-stage">
        <span className="ft-label eyebrow">01 / Featured work</span>
        <figure className="ft-img" style={{ aspectRatio: `${a.width} / ${a.height}` }}>
          <img src={artUrl(a.id)} srcSet={artSrcSet(a.id)} sizes="(max-width: 900px) 74vw, 46vw" alt={a.alt || a.title} loading="lazy" decoding="async" />
        </figure>
        <div className="ft-caption">
          <h3 className="display-sm">{a.title}</h3>
          <span>{a.medium}</span>
          <span>{a.year}</span>
          <Link to={`/shop?art=${a.id}`} className="link-arrow" data-cursor="Discover">Discover</Link>
        </div>
        <p className="ft-detail">Only greys. The brim was cut in one sitting, stripe by stripe, until the face disappeared beneath it.</p>
        <div className="ft-veil" />
      </div>
    </section>
  );
}
