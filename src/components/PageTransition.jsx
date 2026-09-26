import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../lib/gsap.js';
import { getLenis } from '../lib/SmoothScroll.jsx';

// Curtain wipe between routes. The old page is held until the curtain covers the
// viewport, then the new page is swapped in, scroll resets, and the curtain lifts.
export default function PageTransition({ children }) {
  const location = useLocation();
  const [shown, setShown] = useState({ key: location.pathname, node: children });
  const curtain = useRef(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      gsap.set(curtain.current, { yPercent: -100 });
      return;
    }
    if (shown.key === location.pathname) {
      setShown({ key: location.pathname, node: children });
      return;
    }
    const tl = gsap.timeline();
    tl.set(curtain.current, { yPercent: 100 })
      .to(curtain.current, { yPercent: 0, duration: 0.6, ease: 'power4.inOut' })
      .add(() => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
        getLenis()?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
        setShown({ key: location.pathname, node: children });
      })
      .add(() => ScrollTrigger.refresh(), '+=0.08')
      .to(curtain.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '+=0.1');
    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, children]);

  return (
    <>
      <div key={shown.key} className="page">{shown.node}</div>
      <div ref={curtain} className="curtain"><span>LILLY'S BOUTIQUE</span></div>
    </>
  );
}
