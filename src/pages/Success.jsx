import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { useCart } from '../lib/CartContext.jsx';
import { artUrl, formatPrice } from '../data/catalog.mjs';
import { SplitChars } from '../lib/text.jsx';

export default function Success() {
  const root = useRef(null);
  const navigate = useNavigate();
  const { lastOrder: order } = useCart();
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (!order) navigate('/shop', { replace: true });
  }, [order, navigate]);

  useLayoutEffect(() => {
    if (!order) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.3 })
        .from('.cf-title .char', { yPercent: 110, stagger: 0.045, duration: 1.15, ease: 'expo.out' })
        .fromTo('.cf-art', { clipPath: 'inset(50% 0 50% 0)', scale: 1.15 }, { clipPath: 'inset(0% 0 0% 0)', scale: 1, duration: 1.6, ease: 'expo.inOut' }, '-=0.4')
        .from('.cf-body > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.9 }, '-=0.8');
      gsap.from('.cf-close .line', {
        yPercent: 110, stagger: 0.12, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: '.cf-close', start: 'top 80%' },
      });
    }, root);
    return () => ctx.revert();
  }, [order]);

  if (!order) return null;
  const artwork = order.items[0];
  const payment = order.payment || { label: 'Cash on delivery', note: 'Pay in cash when your artwork arrives.' };

  return (
    <main ref={root} className="cf">
      <section className="cf-hero">
        <figure className="cf-art" style={{ aspectRatio: `${artwork.width} / ${artwork.height}` }}>
          <img src={artUrl(artwork.id)} alt={artwork.title} />
        </figure>
        <h1 className="cf-title"><SplitChars text="Order received." /></h1>
        <div className="cf-body">
          <p className="lede">Thank you for supporting independent art.</p>
          <span className="eyebrow">Order #{order.number}</span>
          <p className="cf-work">
            {order.items.map((work) => `${work.title} — ${work.year}`).join(' · ')}
            <br />
            <span>Original / 1 of 1</span>
          </p>
          <div className="cf-payment-status">
            <span className="eyebrow">Payment</span>
            <strong>{payment.label}</strong>
            <p>{payment.note}</p>
          </div>
          <button className="link-arrow" onClick={() => setDetails((value) => !value)}>{details ? 'Hide order details' : 'View order details'}</button>
          {details && (
            <dl className="cf-details">
              <div><dt>Ship to</dt><dd>{order.name}</dd></div>
              <div><dt>Address</dt><dd>{order.address}, {order.city} {order.postal}</dd></div>
              <div><dt>Delivery</dt><dd>{order.delivery.label} · {order.delivery.days}</dd></div>
              <div><dt>Payment</dt><dd>{payment.label}</dd></div>
              <div><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{formatPrice(order.delivery.price)}</dd></div>
              <div><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          )}
          <p className="cf-email">We’ll use <strong>{order.email}</strong> for payment and delivery updates.</p>
        </div>
      </section>

      <section className="cf-close">
        <h2 className="display">
          <span className="line-mask"><span className="line">From my studio</span></span>
          <span className="line-mask"><span className="line">to your space.</span></span>
        </h2>
        <span className="signature">Lilly Boutique</span>
        <Link to="/" className="link-arrow big">Back to the gallery</Link>
      </section>
    </main>
  );
}
