import { useRef } from 'react';
import { gsap } from '../../lib/gsap.js';
import { useScene } from '../../lib/useScene.js';

export default function Statement() {
  const root = useRef(null);

  useScene(root, () => {
    gsap.from('.st-quote .line', {
      yPercent: 110, stagger: 0.14, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.st-quote', start: 'top 80%' },
    });
    gsap.from('.st-copy', {
      y: 30, opacity: 0, duration: 1.2,
      scrollTrigger: { trigger: '.st-copy', start: 'top 85%' },
    });
    gsap.fromTo('.st-img img', { scale: 1.25, yPercent: -8 }, {
      scale: 1, yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.st-img', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.st-img', {
      clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.st-img', start: 'top 80%' },
    });
  }, { waitForInput: true });

  return (
    <section ref={root} className="st">
      <div className="st-text">
        <span className="eyebrow">02 — Artist statement</span>
        <blockquote className="st-quote display">
          <span className="line-mask"><span className="line">“I paint the things</span></span>
          <span className="line-mask"><span className="line">I don’t know how</span></span>
          <span className="line-mask"><span className="line">to say.”</span></span>
        </blockquote>
        <p className="st-copy">
          Hadeel works slowly, mostly at night, in layers of acrylic and oil that are scraped back and rebuilt until the
          surface holds a mood rather than an image. The paintings are small conversations with silence, weather and rooms
          she has lived in. Nothing is reproduced. Each work leaves the studio once.
        </p>
      </div>
      <figure className="st-img">
        <img
          src="/art/the-artist.webp"
          srcSet="/art/the-artist-240.webp 240w, /art/the-artist-480.webp 480w, /art/the-artist-640.webp 640w, /art/the-artist-960.webp 960w, /art/the-artist.webp 1200w"
          sizes="(max-width: 900px) 100vw, 50vw"
          alt="Hadeel, the artist"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </section>
  );
}
