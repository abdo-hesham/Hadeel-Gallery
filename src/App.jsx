import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { CartProvider } from './lib/CartContext.jsx';
import SmoothScroll from './lib/SmoothScroll.jsx';
import Nav from './components/Nav.jsx';
import Cursor from './components/Cursor.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home from './pages/Home/Home.jsx';

// Only the home page ships in the entry bundle; the other routes load on demand.
const Shop = lazy(() => import('./pages/Shop.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Success = lazy(() => import('./pages/Success.jsx'));
const page = (el) => <Suspense fallback={null}>{el}</Suspense>;

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
            <Route path="/shop" element={page(<Shop />)} />
            <Route path="/cart" element={page(<Cart />)} />
            <Route path="/checkout" element={page(<Checkout />)} />
            <Route path="/success" element={page(<Success />)} />
            <Route path="/confirmation" element={<Navigate to="/success" replace />} />
          </Routes>
        </PageTransition>
      </SmoothScroll>
    </CartProvider>
  );
}
