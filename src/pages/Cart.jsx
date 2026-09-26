import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { useCart } from '../lib/CartContext.jsx';
import { artUrl, formatPrice } from '../data/catalog.mjs';

export default function Cart() {
  const root = useRef(null);
  const { items, subtotal, remove } = useCart();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cart-head > *', { y: 24, opacity: 0, stagger: 0.08, delay: 0.2 });
      gsap.from('.cart-row, .cart-sum, .cart-empty', { y: 30, opacity: 0, stagger: 0.1, delay: 0.5 });
    }, root);
    return () => ctx.revert();
  }, []);

  const removeRow = (id, el) => {
    gsap.to(el, { x: 40, opacity: 0, duration: 0.4, onComplete: () => remove(id) });
  };

  return (
    <main ref={root} className="cart">
      <header className="cart-head">
        <h1 className="display-sm">Your cart</h1>
        <span>{String(items.length).padStart(2, '0')} {items.length === 1 ? 'item' : 'items'}</span>
      </header>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Nothing here yet.</p>
          <Link to="/shop" className="link-arrow big">Explore the works</Link>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((a) => (
              <li key={a.id} className="cart-row">
                <figure style={{ aspectRatio: `${a.width} / ${a.height}` }}>
                  <img src={artUrl(a.id)} alt={a.alt || a.title} />
                </figure>
                <div className="cart-info">
                  <strong>{a.title}</strong>
                  <span>Original artwork · 1 of 1</span>
                  <span>{a.medium}</span>
                  <span>{a.width} × {a.height} cm</span>
                  <span className="price">{formatPrice(a.price)}</span>
                </div>
                <button className="cart-remove" aria-label={`Remove ${a.title}`} onClick={(e) => removeRow(a.id, e.currentTarget.closest('li'))}>×</button>
              </li>
            ))}
          </ul>
          <div className="cart-sum">
            <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="row"><span>Shipping</span><span>Calculated at checkout</span></div>
            <Link to="/checkout" className="btn" data-cursor="Go">Checkout</Link>
            <p className="cart-reassure">Original artwork · Secure checkout · Carefully packaged</p>
          </div>
        </>
      )}
    </main>
  );
}
