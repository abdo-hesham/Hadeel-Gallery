import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from '../lib/gsap.js';
import { useCart } from '../lib/CartContext.jsx';
import { artUrl, formatPrice } from '../data/catalog.mjs';

const SHIPPING = { standard: { label: 'Standard', days: '7–10 business days', price: 2350 }, express: { label: 'Express', days: '2–4 business days', price: 6250 } };
const PAYMENTS = {
  cod: { label: 'Cash on delivery', note: 'Pay in cash when your artwork arrives.' },
  instapay: { label: 'Instapay', note: 'The studio will contact you with the transfer details before dispatch.' },
};
const ORDER_NOTIFICATION_URL = 'https://formsubmit.co/ajax/abdohesham203@gmail.com';

export default function Checkout() {
  const root = useRef(null);
  const navigate = useNavigate();
  const { items, subtotal, placeOrder } = useCart();
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('cod');
  const [form, setForm] = useState({ email: '', name: '', address: '', city: '', postal: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = subtotal + SHIPPING[delivery].price;

  // Empty cart has nothing to pay for. Skipped while an order is being placed,
  // since placing it empties the cart right before we move to the confirmation.
  useEffect(() => {
    if (items.length === 0 && !busy) navigate('/cart', { replace: true });
  }, [items.length, busy, navigate]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.co-steps, .co-form > *, .co-summary', { y: 24, opacity: 0, stagger: 0.07, delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);
    const order = {
        number: String(400 + Math.floor(Math.random() * 600)).padStart(5, '0'),
        items,
        email: form.email,
        name: form.name,
        address: form.address,
        city: form.city,
        postal: form.postal,
        delivery: SHIPPING[delivery],
        payment: PAYMENTS[payment],
        subtotal,
        total,
    };

    try {
      const response = await fetch(ORDER_NOTIFICATION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New Lilly's Boutique order #${order.number}`,
          _template: 'table',
          _captcha: 'false',
          _replyto: order.email,
          order_number: order.number,
          customer_name: order.name,
          customer_email: order.email,
          shipping_address: `${order.address}, ${order.city}, ${order.postal}`,
          delivery: `${order.delivery.label} — ${order.delivery.days}`,
          payment: order.payment.label,
          artworks: order.items.map((item) => `${item.title} (${item.width} × ${item.height} cm) — ${formatPrice(item.price)}`).join(' | '),
          subtotal: formatPrice(order.subtotal),
          shipping: formatPrice(order.delivery.price),
          total: formatPrice(order.total),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) throw new Error('Notification was not accepted');

      placeOrder(order);
      navigate('/success');
    } catch {
      setError('We could not confirm your order. Please check your connection and try again. Your cart is still saved.');
      setBusy(false);
    }
  };

  if (items.length === 0 && !busy) return null;

  return (
    <main ref={root} className="co">
      <ol className="co-steps">
        <li><Link to="/cart">Cart</Link></li>
        <li className="is-current">Checkout</li>
        <li>Confirmation</li>
      </ol>

      <div className="co-layout">
        <aside className="co-summary">
          <h2>Order summary</h2>
          {items.map((a) => (
            <div key={a.id} className="co-item">
              <figure style={{ aspectRatio: `${a.width} / ${a.height}` }}><img src={artUrl(a.id)} alt="" /></figure>
              <div><strong>{a.title}</strong><span>{a.width} × {a.height} cm</span></div>
              <span className="price">{formatPrice(a.price)}</span>
            </div>
          ))}
          <div className="co-totals">
            <div className="row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="row"><span>Shipping</span><span>{formatPrice(SHIPPING[delivery].price)}</span></div>
            <div className="row"><span>Payment</span><span>{PAYMENTS[payment].label}</span></div>
            <div className="row is-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </aside>

        <form className="co-form" onSubmit={submit}>
          <fieldset>
            <legend>Contact</legend>
            <label><span>Email</span><input type="email" required autoComplete="email" value={form.email} onChange={set('email')} /></label>
          </fieldset>

          <fieldset>
            <legend>Shipping address</legend>
            <label><span>Full name</span><input required autoComplete="name" value={form.name} onChange={set('name')} /></label>
            <label><span>Address</span><input required autoComplete="street-address" value={form.address} onChange={set('address')} /></label>
            <div className="co-row">
              <label><span>City</span><input required autoComplete="address-level2" value={form.city} onChange={set('city')} /></label>
              <label><span>Postal code</span><input required autoComplete="postal-code" value={form.postal} onChange={set('postal')} /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Delivery</legend>
            {Object.entries(SHIPPING).map(([k, s]) => (
              <label key={k} className={`co-radio ${delivery === k ? 'is-on' : ''}`}>
                <input type="radio" name="delivery" value={k} checked={delivery === k} onChange={() => setDelivery(k)} />
                <span className="co-radio-dot" />
                <span className="co-radio-text"><strong>{s.label}</strong><small>{s.days}</small></span>
                <span className="price">{formatPrice(s.price)}</span>
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            {Object.entries(PAYMENTS).map(([key, option]) => (
              <label key={key} className={`co-radio co-payment ${payment === key ? 'is-on' : ''}`}>
                <input type="radio" name="payment" value={key} checked={payment === key} onChange={() => setPayment(key)} />
                <span className="co-radio-dot" />
                <span className="co-radio-text"><strong>{option.label}</strong><small>{option.note}</small></span>
              </label>
            ))}
          </fieldset>

          <div className="co-submit-panel">
            <div><span className="eyebrow">Order total</span><strong>{formatPrice(total)}</strong></div>
            <button type="submit" className={`btn btn-wide ${busy ? 'is-busy' : ''}`} disabled={busy}>
              {busy ? 'Confirming order…' : 'Confirm order'}
            </button>
            <p className="co-submit-note">By confirming, you agree to be contacted about payment and delivery.</p>
            {error && <p className="co-error" role="alert">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
}
