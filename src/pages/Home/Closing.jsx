import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap.js';
import { useScene } from '../../lib/useScene.js';
import Footer from '../../components/Footer.jsx';

export default function Closing() {
  const root = useRef(null);

  useScene(root, () => {
    gsap.from('.cl-title .line', {
      yPercent: 110, stagger: 0.12, duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: '.cl-title', start: 'top 80%' },
    });
    gsap.from('.cl-cta', { opacity: 0, y: 20, delay: 0.4, scrollTrigger: { trigger: '.cl-title', start: 'top 80%' } });
  }, { waitForInput: true });

  return (
    <section ref={root} className="cl">
      <h2 className="cl-title">
        <span className="line-mask"><span className="line">Find a piece</span></span>
        <span className="line-mask"><span className="line">that speaks</span></span>
        <span className="line-mask"><span className="line">to you.</span></span>
      </h2>
      <Link to="/shop" className="cl-cta link-arrow big" data-cursor="Explore">Explore all works</Link>
      <Footer />
    </section>
  );
}
