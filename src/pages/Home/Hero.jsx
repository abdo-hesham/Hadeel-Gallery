import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { artworks, artUrl } from '../../data/catalog.mjs';
import { SplitChars, SplitWordChars } from '../../lib/text.jsx';

// Reference: the video intro. A centred serif title sits alone; on scroll, image
// tiles fly in from the edges at different scales, layer over the title, drift
// upward at different speeds and clear out, leaving a calm text block behind.
//
// Each tile: `at` = when it enters (0..1 of the pinned scroll), `from` = edge it
// enters from, `x`/`y` = resting position (vw / vh), `w` = width (vw), `speed` =
// parallax exit multiplier.
const TILES = [
  { art: 'anatomy-of-us',   at: 0.05, from: 'left',   x: 4,  y: 40, w: 22, speed: 1.0 },
  { art: 'earring',         at: 0.10, from: 'right',  x: 68, y: 6,  w: 24, speed: 1.3 },
  { art: 'half-wing',       at: 0.15, from: 'bottom', x: 50, y: 60, w: 18, speed: 0.8 },
  { art: 'veins',           at: 0.20, from: 'top',    x: 12, y: 2,  w: 20, speed: 1.1 },
  { art: 'turban',          at: 0.26, from: 'right',  x: 76, y: 42, w: 20, speed: 0.9 },
  { art: 'one-milkshake',   at: 0.32, from: 'left',   x: 28, y: 52, w: 16, speed: 1.4 },
  { art: 'cockatoo',        at: 0.38, from: 'bottom', x: 44, y: 20, w: 16, speed: 1.2 },
  { art: 'night-on-a-case', at: 0.44, from: 'top',    x: 2,  y: 8,  w: 12, speed: 0.7 },
  { art: 'pear-and-roses',  at: 0.50, from: 'right',  x: 58, y: 34, w: 18, speed: 1.0 },
  { art: 'the-hat',         at: 0.56, from: 'left',   x: 30, y: 10, w: 28, speed: 1.0 },
];
const ENTER = 0.14; // scroll fraction a tile takes to fly in
const CLEAR = 0.8;  // by this point every tile has left through the top

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro (on load): letters rise, meta lines fade.
      gsap.timeline({ delay: 0.2 })
        .from('.hero-title .char', { yPercent: 110, stagger: 0.05, duration: 1.2, ease: 'expo.out' })
        .from('.hero-meta > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.9 }, '-=0.7')
        .from('.hero-cta', { y: 16, opacity: 0, duration: 0.8 }, '-=0.5')
        .from('.hero-scrollhint', { opacity: 0, duration: 0.8 }, '-=0.4');

      // Scroll-driven collage. Pinned for 450vh; timeline maps 0..1 to scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=380%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      });

      // The intro above owns the inner elements' opacity; the scroll timeline fades
      // their wrappers so the two never fight over one property during refresh.
      tl.to('.hero-hintwrap', { opacity: 0, duration: 0.05 }, 0);
      tl.to('.hero-ctawrap', { opacity: 0, y: -20, duration: 0.1 }, 0.05);
      // Title lingers, then is slowly pushed up and out behind the tiles.
      tl.to('.hero-title', { yPercent: -320, duration: 0.6 }, 0.22);
      tl.to('.hero-meta', { yPercent: -400, opacity: 0, duration: 0.45 }, 0.18);

      const vw = window.innerWidth / 100, vh = window.innerHeight / 100;
      TILES.forEach((t, i) => {
        const el = root.current.querySelector(`[data-tile="${i}"]`);
        const tileH = el.offsetHeight;
        // Start fully outside the viewport on the chosen edge, with a little diagonal drift.
        const from = {
          left:   { x: -(t.x * vw + t.w * vw + 8 * vw), y: 10 * vh },
          right:  { x: (100 - t.x) * vw + 8 * vw, y: -10 * vh },
          top:    { x: 0, y: -(t.y * vh + tileH + 8 * vh) },
          bottom: { x: 0, y: (100 - t.y) * vh + 8 * vh },
        }[t.from];
        tl.fromTo(
          el,
          { x: from.x, y: from.y, scale: 0.7, rotate: (i % 2 ? 1 : -1) * 4 },
          { x: 0, y: 0, scale: 1, rotate: 0, duration: ENTER, ease: 'power2.out', immediateRender: true },
          t.at
        );
        // Exit: drift upward at its own speed; every tile fully clears the top by CLEAR.
        const exitY = -(t.y * vh + tileH + 6 * vh) * Math.max(1, t.speed);
        const start = t.at + ENTER;
        tl.to(el, { y: exitY, duration: CLEAR - start, ease: 'none' }, start);
      });

      // Closing text block rises into the emptied stage.
      tl.fromTo('.hero-after', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, CLEAR - 0.08);
      // Scroll-scrubbed text fill: letters turn from grey to white one after another.
      tl.fromTo(
        '.hero-after .char',
        { color: 'rgba(240,235,226,0.28)' },
        { color: 'rgba(240,235,226,1)', duration: 0.03, ease: 'none', stagger: { each: 0.0012 } },
        CLEAR - 0.02
      );
      tl.fromTo('.hero-after .eyebrow', { opacity: 0 }, { opacity: 1, duration: 0.04 }, '>-0.02');
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero">
      <div className="hero-stage">
        <div className="hero-titleblock">
          <h1 className="hero-title"><SplitChars text="HADEEL" /></h1>
          <div className="hero-meta">
            <span>Original works</span>
            <span>2024 — 2026</span>
          </div>
          <div className="hero-ctawrap">
            <Link to="/shop" className="hero-cta link-arrow" data-cursor="Explore">Explore the collection</Link>
          </div>
        </div>

        <div className="hero-tiles" aria-hidden="true">
          {TILES.map((t, i) => {
            const a = artworks.find((x) => x.id === t.art);
            return (
              <figure
                key={t.art}
                data-tile={i}
                className="hero-tile"
                style={{ left: `${t.x}vw`, top: `${t.y}vh`, width: `${t.w}vw`, aspectRatio: `${a.width} / ${a.height}` }}
              >
                <img src={artUrl(a.id)} alt="" loading="eager" />
              </figure>
            );
          })}
        </div>

        <div className="hero-after">
          <p className="lede">
            <SplitWordChars text="Hadeel paints from a small studio with a north-facing window. Every canvas here exists once. This is not a store first; it is a room you walk through, and some of what hangs in it can go home with you." />
          </p>
          <span className="eyebrow">Scroll to enter the gallery</span>
        </div>

        <div className="hero-hintwrap"><div className="hero-scrollhint"><span /> Scroll</div></div>
      </div>
    </section>
  );
}
