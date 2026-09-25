import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { artworks, artUrl, roomUrl, roomRatio, formatPrice } from '../../data/catalog.mjs';
import { HANDOFF_ID } from './Studio.jsx';

export default function Available() {
  const root = useRef(null);
  // The painting built in Section 03 leads this list, shown flat so the handoff
  // lands on the exact same image. The rest use their room mockups.
  const lead = artworks.find((a) => a.id === HANDOFF_ID);
  const rest = artworks.filter((a) => a.status === 'available' && a.id !== HANDOFF_ID).slice(0, 3);
  const list = [lead, ...rest];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.av-head .line', {
        yPercent: 110, stagger: 0.1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.av-head', start: 'top 85%' },
      });
      gsap.utils.toArray('.av-card').forEach((el) => {
        if (!el.classList.contains('is-handoff')) {
          gsap.from(el, { y: 80, opacity: 0, duration: 1.2, scrollTrigger: { trigger: el, start: 'top 88%' } });
          gsap.fromTo(el.querySelector('img'), { yPercent: -6 }, {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        } else {
          gsap.from(el.querySelector('.av-meta'), { opacity: 0, y: 16, scrollTrigger: { trigger: el, start: 'top 30%' } });
        }
      });
      gsap.from('.av-all', { opacity: 0, y: 20, scrollTrigger: { trigger: '.av-all', start: 'top 92%' } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="av">
      <header className="av-head">
        <span className="eyebrow">04 — Available works</span>
        <h2 className="display">
          <span className="line-mask"><span className="line">Ready to</span></span>
          <span className="line-mask"><span className="line">leave the studio</span></span>
        </h2>
      </header>
      <div className="av-grid">
        {list.map((a, i) => {
          const handoff = a.id === HANDOFF_ID;
          return (
            <Link key={a.id} to={`/shop?art=${a.id}`} className={`av-card ${handoff ? 'is-handoff' : ''}`} data-cursor="View">
              <span className="av-num">{String(i + 1).padStart(2, '0')}</span>
              <figure style={{ aspectRatio: handoff ? `${a.width} / ${a.height}` : roomRatio(a) }}>
                <img src={handoff ? artUrl(a.id) : roomUrl(a)} alt={a.title} loading="lazy" />
              </figure>
              <div className="av-meta">
                <strong>{a.title}</strong>
                <span>{a.width} × {a.height} cm</span>
                <span className="price">{formatPrice(a.price)}</span>
                <span className="link-arrow">View artwork</span>
              </div>
            </Link>
          );
        })}
      </div>
      <Link to="/shop" className="av-all link-arrow big">View all works</Link>
    </section>
  );
}
