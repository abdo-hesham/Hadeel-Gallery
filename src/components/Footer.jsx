import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-row">
        <div className="footer-col">
          <span className="eyebrow">Studio</span>
          <a href="mailto:studio@hadeel.art">studio@hadeel.art</a>
          <a href="https://www.instagram.com/had.eel_art?stkn=dHp2bmR0ZDQ1NTg1&utm_source=qr" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <div className="footer-col">
          <span className="eyebrow">Shipping</span>
          <p>Worldwide. Every work is packed by hand and insured in transit.</p>
        </div>
        <div className="footer-col">
          <span className="eyebrow">Pages</span>
          <Link to="/">Gallery</Link>
          <Link to="/shop">Works</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="signature">Lilly Boutique</span>
        <span>© 2026 Lilly Boutique. All works original.</span>
      </div>
    </footer>
  );
}
