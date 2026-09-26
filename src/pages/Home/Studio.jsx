import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap.js';
import { artworks, artUrl } from '../../data/catalog.mjs';

// Section 03. One painting (Half Wing) is built in front of the viewer while the
// section is pinned: a detail fragment, then sketch, palette and texture arrive
// around it, the full canvas reveals, the process assets clear away, and finally
// the finished painting travels down into the first slot of Section 04.
//
// Handoff mechanics: after the pin releases, this section and Section 04 scroll
// together, so the offset between the painting and its target card is constant.
// We measure both at refresh time (pins reverted) and correct for the pin
// distance, then scrub the painting wrapper to that offset.

export const HANDOFF_ID = 'half-wing';

export default function Studio() {
  const root = useRef(null);
  const a = artworks.find((x) => x.id === HANDOFF_ID);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (c) => {
        const { mobile } = c.conditions;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'studio-pin',
            trigger: root.current,
            start: 'top top',
            end: '+=380%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
          defaults: { ease: 'power3.out' },
        });

        // Arrival — the previous macro zoom resolves into a quiet, lit studio wall.
        tl.fromTo(q('.sd-room-glow'), { opacity: 0, scale: 0.76 }, { opacity: 1, scale: 1, duration: 0.34, ease: 'sine.out' }, 0)
          .fromTo(q('.sd-grid'), { opacity: 0 }, { opacity: 0.38, duration: 0.2 }, 0)
          .from(q('.sd-head .line'), { yPercent: 110, stagger: 0.035, duration: 0.15, ease: 'expo.out' }, 0.02)
          .from(q('.sd-head .eyebrow, .sd-head p'), { opacity: 0, y: 14, stagger: 0.025, duration: 0.12 }, 0.04)
          .fromTo(q('.sd-ghost'), { opacity: 0, xPercent: 7 }, { opacity: 1, xPercent: 0, duration: 0.3 }, 0.02)
          .fromTo(q('.sd-progress'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.12 }, 0.06)
          .to(q('.sd-progress-fill'), { scaleX: 1, duration: 0.86, ease: 'none' }, 0.1);

        // Fragment: only a detail of the painting is visible at first.
        tl.fromTo(q('.sd-painting'),
          { clipPath: 'inset(31% 29% 32% 31%)', scale: 1.82, y: 32 },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, y: 0, duration: 0.34, ease: 'power3.inOut' },
          0.46);
        tl.fromTo(q('.sd-paint-frame'), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.18 }, 0.4)
          .fromTo(q('.sd-frag-label'), { opacity: 1 }, { opacity: 0, duration: 0.06 }, 0.46);

        // 2 — sketch (idea), 3 — palette (colour), 4 — texture (surface).
        tl.fromTo(q('.sd-sketch'), { x: -70, y: 50, rotate: -8, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, y: 0, rotate: -3, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.2, ease: 'power3.out' }, 0.13);
        tl.fromTo(q('.sd-palette'), { x: 70, y: -24, rotate: 7, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, { x: 0, y: 0, rotate: 4, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.18, ease: 'power3.out' }, 0.27);
        tl.fromTo(q('.sd-texture'), { y: 52, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.18, ease: 'power3.out' }, 0.39)
          .fromTo(q('.sd-texture img'), { scale: 1.12 }, { scale: 1, duration: 0.3, ease: 'power2.out' }, 0.38);
        tl.fromTo(q('.sd-asset figcaption'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.08, stagger: 0.1 }, 0.22);

        // Each process word gets one clear moment rather than competing at once.
        const phases = q('.sd-phase');
        phases.forEach((phase, i) => {
          const at = [0.12, 0.28, 0.42, 0.72][i];
          tl.fromTo(phase, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.075 }, at);
          if (i < phases.length - 1) tl.to(phase, { opacity: 0, y: -8, duration: 0.03, ease: 'power2.in' }, [0.245, 0.385, 0.675][i]);
        });
        q('.sd-step').forEach((step, i) => {
          tl.to(step, { color: 'var(--fg)', opacity: 1, duration: 0.045 }, [0.12, 0.28, 0.42, 0.72][i]);
          if (i < 3) tl.to(step, { opacity: 0.38, duration: 0.045 }, [0.28, 0.42, 0.72][i]);
        });

        // 5 — process clears, only the finished painting remains.
        tl.to(q('.sd-sketch'), { x: -46, y: 34, rotate: -6, opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.76);
        tl.to(q('.sd-palette'), { x: 42, y: -26, rotate: 7, opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.78);
        tl.to(q('.sd-texture'), { y: 42, opacity: 0, duration: 0.1, ease: 'power2.in' }, 0.8);
        tl.to(q('.sd-paint-frame'), { opacity: 0, scale: 1.04, duration: 0.1 }, 0.8);
        tl.fromTo(q('.sd-caption'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.1 }, 0.86);
        tl.to(q('.sd-head, .sd-ghost'), { opacity: 0.22, duration: 0.12 }, 0.82);
        tl.to(q('.sd-progress'), { opacity: 0, y: -8, duration: 0.05, ease: 'power2.in' }, 0.95);

        // Tiny depth parallax while pinned (each asset drifts by its own amount).
        q('[data-depth]').forEach((el) => {
          const d = Number(el.dataset.depth);
          tl.fromTo(el, { yPercent: 6 * d }, { yPercent: -6 * d, ease: 'none', duration: 1 }, 0);
        });

        // 6 — handoff: the finished painting becomes card 01 of "Ready to leave the studio".
        const mover = q('.sd-paint-move')[0];
        const target = document.querySelector('.av-card.is-handoff figure');
        if (target) {
          // Document-space math so it is correct whenever it is evaluated:
          // after the pin releases, this section sits at st.end (its start + pin distance),
          // and the mover's untransformed offset inside the stage is its layout position.
          const measure = () => {
            const st = ScrollTrigger.getById('studio-pin');
            const t = target.getBoundingClientRect();
            const stage = mover.offsetParent.getBoundingClientRect();
            const moverDocTop = (st ? st.end : stage.top + window.scrollY) + mover.offsetTop;
            const moverLeft = stage.left + mover.offsetLeft;
            return { x: t.left - moverLeft, y: t.top + window.scrollY - moverDocTop, scale: t.width / mover.offsetWidth };
          };
          gsap.timeline({
            scrollTrigger: {
              trigger: target,
              start: 'top 128%',
              end: 'top 18%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
            .to(mover, { x: () => measure().x, y: () => measure().y, scale: () => measure().scale, ease: 'power2.inOut', duration: 1 })
            .to(q('.sd-caption'), { opacity: 0, duration: 0.15 }, 0)
            .set(mover, { opacity: 0 }, 0.995)
            .set(target.querySelector('img'), { opacity: 1 }, 0.995);
          gsap.set(target.querySelector('img'), { opacity: 0 });
        }

        // Pointer parallax on desktop only: foreground moves more than background.
        if (!mobile) {
          const studio = root.current;
          const layers = q('[data-depth]').map((el) => ({
            el, d: Number(el.dataset.depth),
            x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }),
            y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }),
          }));
          const onMove = (e) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            layers.forEach((l) => { l.x(nx * 6 * l.d); l.y(ny * 5 * l.d); });
          };
          studio.addEventListener('pointermove', onMove);
          return () => studio.removeEventListener('pointermove', onMove);
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="sd" aria-labelledby="studio-title">
      <div className="sd-stage">
        <div className="sd-room-glow" aria-hidden="true" />
        <div className="sd-grid" aria-hidden="true" />
        <div className="sd-grain" aria-hidden="true" />
        <div className="sd-ghost" aria-hidden="true">Process</div>
        <header className="sd-head">
          <span className="eyebrow">03 — Inside the studio</span>
          <h2 id="studio-title" className="display">
            <span className="line-mask"><span className="line">Behind</span></span>
            <span className="line-mask"><span className="line">the canvas</span></span>
          </h2>
          <p>Process, imperfections and everything between.</p>
        </header>

        <div className="sd-progress" aria-hidden="true">
          <div className="sd-progress-track"><span className="sd-progress-fill" /></div>
          <ol className="sd-steps">
            <li className="sd-step">01 <span>Mark</span></li>
            <li className="sd-step">02 <span>Colour</span></li>
            <li className="sd-step">03 <span>Surface</span></li>
            <li className="sd-step">04 <span>Release</span></li>
          </ol>
        </div>

        <div className="sd-phases" aria-hidden="true">
          <p className="sd-phase"><span>01 / Mark</span>The idea begins as a line.</p>
          <p className="sd-phase"><span>02 / Colour</span>Red holds tension. Blue opens space.</p>
          <p className="sd-phase"><span>03 / Surface</span>Built, scraped back, built again.</p>
          <p className="sd-phase"><span>04 / Release</span>The work leaves the hand.</p>
        </div>

        <figure className="sd-asset sd-sketch" data-depth="1.4">
          <img src="/art/process-sketch.webp" alt="Pencil sketch of the butterfly" loading="lazy" />
          <figcaption>01 — Sketch</figcaption>
        </figure>
        <figure className="sd-asset sd-palette" data-depth="0.8">
          <img src="/art/process-palette.webp" alt="Red, blue and beige paint swatches" loading="lazy" />
          <figcaption>02 — Palette</figcaption>
        </figure>
        <figure className="sd-asset sd-texture" data-depth="1.1">
          <img src="/art/process-texture.webp" alt="Macro of the brushwork" loading="lazy" />
          <figcaption>03 — Texture</figcaption>
        </figure>

        <div className="sd-paint-move">
          <div className="sd-paint-frame" aria-hidden="true"><i /><i /><i /><i /></div>
          <figure className="sd-painting">
            <img src={artUrl(a.id)} alt={a.alt || a.title} loading="lazy" decoding="async" />
          </figure>
          <span className="sd-frag-label eyebrow">Detail — in progress</span>
          <figcaption className="sd-caption">
            <strong>{a.title}</strong>
            <span>{a.medium} · {a.width} × {a.height} cm · {a.year}</span>
          </figcaption>
        </div>
      </div>
    </section>
  );
}
