import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap.js';

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.4 });
      }
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };
    const over = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        label.current.textContent = t.dataset.cursor;
        gsap.to(ring.current, { scale: 3.2, duration: 0.5, ease: 'expo.out' });
        gsap.to(label.current, { opacity: 1, duration: 0.3 });
        gsap.to(dot.current, { scale: 0, duration: 0.3 });
      } else if (e.target.closest('a, button, [role=button]')) {
        gsap.to(ring.current, { scale: 1.8, duration: 0.4 });
      }
    };
    const out = (e) => {
      if (e.target.closest('[data-cursor], a, button, [role=button]')) {
        gsap.to(ring.current, { scale: 1, duration: 0.5, ease: 'expo.out' });
        gsap.to(label.current, { opacity: 0, duration: 0.2 });
        gsap.to(dot.current, { scale: 1, duration: 0.3 });
      }
    };
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    document.documentElement.classList.add('has-cursor');
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring"><span ref={label} className="cursor-label" /></div>
    </>
  );
}
