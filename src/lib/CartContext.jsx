import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { artworks } from '../data/catalog.mjs';
import { track } from './analytics.js';

const CartContext = createContext(null);
const KEY = 'hadeel.cart';
const ORDER_KEY = 'hadeel.lastOrder';

export function CartProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [lastOrder, setLastOrder] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  useEffect(() => {
    try {
      if (lastOrder) sessionStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder));
    } catch {
      /* ignore */
    }
  }, [lastOrder]);

  const value = useMemo(() => {
    const items = ids.map((id) => artworks.find((a) => a.id === id)).filter(Boolean);
    const subtotal = items.reduce((s, a) => s + a.price, 0);
    return {
      items,
      subtotal,
      has: (id) => ids.includes(id),
      add: (id) => {
        const a = artworks.find((x) => x.id === id);
        if (a && !ids.includes(id)) track('Add to cart', { artwork: a.title, price: a.price });
        setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      },
      remove: (id) => {
        const a = artworks.find((x) => x.id === id);
        if (a) track('Remove from cart', { artwork: a.title });
        setIds((prev) => prev.filter((x) => x !== id));
      },
      clear: () => setIds([]),
      lastOrder,
      placeOrder: (order) => {
        track('Order placed', { items: order.items.length, total: order.total, payment: order.payment?.label ?? null });
        setLastOrder(order);
        setIds([]);
      },
    };
  }, [ids, lastOrder]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
