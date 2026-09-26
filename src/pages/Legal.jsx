import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import Footer from '../components/Footer.jsx';

// Shared layout for the legal pages. `sections` is [{ h, p: [..] }].
export default function Legal({ eyebrow, title, updated, intro, sections }) {
  const root = useRef(null);

  useEffect(() => {
    document.title = `${title} — Lilly's Boutique`;
    return () => { document.title = "Lilly's Boutique — Original Works"; };
  }, [title]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.legal-head > *', { y: 24, opacity: 0, stagger: 0.08, delay: 0.2 });
      gsap.from('.legal-body > *', { y: 20, opacity: 0, stagger: 0.05, delay: 0.5, duration: 0.9 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root} className="legal">
      <header className="legal-head">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="display-sm">{title}</h1>
        <p className="legal-updated">Last updated {updated}</p>
        {intro && <p className="lede">{intro}</p>}
      </header>
      <div className="legal-body">
        {sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}
        <p className="legal-contact">
          Questions? Write to <a href="mailto:studio@hadeel.art">studio@hadeel.art</a> or go <Link to="/">back to the gallery</Link>.
        </p>
      </div>
      <Footer />
    </main>
  );
}
