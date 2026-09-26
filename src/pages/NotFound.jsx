import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { artworks, artUrl } from '../data/catalog.mjs';
import { SplitChars } from '../lib/text.jsx';

// 404: an empty wall, one painting hung slightly askew.
export default function NotFound() {
  const root = useRef(null);
  const a = artworks.find((x) => x.id === 'earring');

  useEffect(() => {
    document.title = "Page not found — Lilly's Boutique";
    return () => { document.title = "Lilly's Boutique — Original Works"; };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.2 })
        .from('.nf-code .char', { yPercent: 110, stagger: 0.06, duration: 1.2, ease: 'expo.out' })
        .fromTo('.nf-art', { clipPath: 'inset(0 0 100% 0)', rotate: 0 }, { clipPath: 'inset(0 0 0% 0)', rotate: -2.5, duration: 1.3, ease: 'expo.inOut' }, '-=0.7')
        .from('.nf-body > *', { y: 18, opacity: 0, stagger: 0.08, duration: 0.8 }, '-=0.6');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="nf">
      <div className="nf-text">
        <span className="eyebrow">Error 404</span>
        <h1 className="nf-code"><SplitChars text="404" /></h1>
        <div className="nf-body">
          <p className="lede">This wall is empty. The page you were looking for has been taken down, or never hung here.</p>
          <div className="nf-links">
            <Link to="/" className="link-arrow" data-cursor="Home">Back to the gallery</Link>
            <Link to="/shop" className="link-arrow" data-cursor="Works">See available works</Link>
          </div>
        </div>
      </div>
      <figure className="nf-art" style={{ aspectRatio: `${a.width} / ${a.height}` }}>
        <img src={artUrl(a.id)} alt={a.alt || a.title} />
      </figure>
    </main>
  );
}
