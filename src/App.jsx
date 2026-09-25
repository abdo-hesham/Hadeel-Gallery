import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './lib/CartContext.jsx';
import SmoothScroll from './lib/SmoothScroll.jsx';
import Nav from './components/Nav.jsx';
import Cursor from './components/Cursor.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home/Home.jsx';
import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Success from './pages/Success.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const dark = location.pathname === '/';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [location.pathname]);

  return (
    <CartProvider>
      <SmoothScroll>
        <Cursor />
        <Nav />
        <PageTransition>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/confirmation" element={<Navigate to="/success" replace />} />
          </Routes>
        </PageTransition>
      </SmoothScroll>
    </CartProvider>
  );
}
