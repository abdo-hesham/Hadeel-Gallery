import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '../lib/CartContext.jsx';
import { gsap } from '../lib/gsap.js';

export default function Nav() {
  const { items } = useCart();
  const badge = useRef(null);
  const location = useLocation();
  const inCheckout = location.pathname === '/checkout' || location.pathname === '/success' || location.pathname === '/confirmation';

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!badge.current) return;
    gsap.fromTo(badge.current, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  }, [items.length]);

  // Checkout pages get a solid nav once the page scrolls, so form text never runs under it.
  useEffect(() => {
    if (!inCheckout) { setScrolled(false); return; }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [inCheckout]);

  return (
    <header className={`nav ${inCheckout ? 'nav-solid' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <Link to="/" className="nav-brand">LILLY'S BOUTIQUE</Link>
      {!inCheckout && (
        <nav className="nav-links">
          <NavLink to="/">Gallery</NavLink>
          <NavLink to="/shop">Works</NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-cart ${isActive ? 'active' : ''} ${items.length > 0 ? 'has-items' : ''}`}
            aria-label={`Cart with ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
          >
            Cart {items.length > 0 && <span ref={badge} className="nav-badge" aria-live="polite">{String(items.length).padStart(2, '0')}</span>}
          </NavLink>
        </nav>
      )}
      {inCheckout && <span className="nav-secure">Secure checkout</span>}
    </header>
  );
}
