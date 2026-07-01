'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from DB on mount/auth status change
  useEffect(() => {
    const loadCart = async () => {
      if (status === 'authenticated') {
        try {
          const res = await axios.get('/api/cart');
          setItems(res.data.items || []);
        } catch (err) {
          console.error('Failed to load cart from DB:', err);
        }
      }
    };
    loadCart();
  }, [status]);

  // Sync helper
  const syncCart = useCallback(async (newItems) => {
    if (status === 'authenticated') {
      try {
        await axios.post('/api/cart', { items: newItems });
      } catch (err) {
        console.error('Failed to sync cart to DB:', err);
      }
    }
  }, [status]);

  const addToCart = useCallback((service) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.number === service.number);
      if (exists) return prev; // don't add duplicates
      const updated = [...prev, { ...service, qty: 1, months: 1 }];
      syncCart(updated);
      return updated;
    });
    setIsOpen(true); // open panel on add
  }, [syncCart]);

  const removeFromCart = useCallback((serviceNumber) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.number !== serviceNumber);
      syncCart(updated);
      return updated;
    });
  }, [syncCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    syncCart([]);
  }, [syncCart]);

  const submitQuote = useCallback(async (notes = '') => {
    if (status === 'authenticated') {
      try {
        const res = await axios.post('/api/quotes', { notes });
        setItems([]);
        return { success: true, quoteId: res.data.quoteId };
      } catch (err) {
        console.error('Failed to submit quote request:', err);
        return { success: false, error: err.response?.data?.message || err.message };
      }
    }
    return { success: false, error: 'Unauthorized' };
  }, [status]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const totalItems = items.length;

  return (
    <CartContext.Provider value={{
      items, totalItems,
      isOpen, openCart, closeCart, toggleCart,
      addToCart, removeFromCart, clearCart, submitQuote,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
