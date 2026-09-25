import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { artUrl, formatPrice } from '../data/catalog.mjs';
import { useCart } from '../lib/CartContext.jsx';
import { getLenis } from '../lib/SmoothScroll.jsx';

export default function ArtworkDetail({ artwork: a, onClose }) {
  const root = useRef(null);
  const { add, has } = useCart();
  const navigate = useNavigate();
  const inCart = has(a.id);
  const sold = a.status === 'sold';

  const close = () => {
    gsap.timeline({ onComplete: onClose })
      .to('.ad-panel', { xPercent: 100, duration: 0.6, ease: 'expo.in' })
      .to('.ad-backdrop', { opacity: 0, duration: 0.3 }, '-=0.2');
  };

  useLayoutEffect(() => {
    getLenis()?.stop();
    const ctx = gsap.context(() => {
      gsap.timeline()
        .fromTo('.ad-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo('.ad-panel', { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: 'expo.out' }, 0.05)
        .fromTo('.ad-img', { clipPath: 'inset(0 0 100% 0)', scale: 1.1 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.1, ease: 'expo.inOut' }, 0.15)
        .from('.ad-info > *', { y: 20, opacity: 0, stagger: 0.06, duration: 0.8 }, 0.5);
    }, root);
    return () => {
      ctx.revert();
      getLenis()?.start();
    };
  }, [a.id]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const addAndGo = () => {
    add(a.id);
    close();
    setTimeout(() => navigate('/cart'), 650);
  };

  return (
    <div ref={root} className="ad" role="dialog" aria-modal="true" aria-label={a.title}>
      <div className="ad-backdrop" onClick={close} />
      <aside className="ad-panel" data-lenis-prevent>
        <button className="ad-close" onClick={close} aria-label="Close">Close ×</button>
        <figure className="ad-img" style={{ aspectRatio: `${a.width} / ${a.height}` }}>
          <img src={artUrl(a.id)} alt={a.title} />
        </figure>
        <div className="ad-info">
          <span className="eyebrow">Original artwork · 1 of 1</span>
          <h2 className="display-sm">{a.title}</h2>
          <dl className="ad-specs">
            <div><dt>Year</dt><dd>{a.year}</dd></div>
            <div><dt>Medium</dt><dd>{a.medium}</dd></div>
            <div><dt>Dimensions</dt><dd>{a.width} × {a.height} cm</dd></div>
            <div><dt>Availability</dt><dd>{sold ? 'Sold' : 'Available'}</dd></div>
          </dl>
          <p className="ad-price">{sold ? 'Sold' : formatPrice(a.price)}</p>
          <div className="ad-actions">
            {sold ? (
              <span className="btn is-disabled">This work has found its home</span>
            ) : inCart ? (
              <button className="btn" onClick={() => { close(); setTimeout(() => navigate('/cart'), 650); }}>In your cart — view</button>
            ) : (
              <button className="btn" onClick={addAndGo} data-cursor="Add">Add to cart</button>
            )}
          </div>
          <div className="ad-notes">
            <p><strong>Shipping.</strong> Worldwide, insured, 5–10 business days. Calculated at checkout.</p>
            <p><strong>Framing.</strong> Ships unframed on stretched canvas with painted edges, ready to hang. Framing available on request.</p>
            <p><strong>Authenticity.</strong> Signed on the back with a hand-written certificate.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
