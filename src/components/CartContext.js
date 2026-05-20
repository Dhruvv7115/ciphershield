'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((service) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.number === service.number);
      if (exists) return prev; // don't add duplicates
      return [...prev, { ...service, qty: 1 }];
    });
    setIsOpen(true); // open panel on add
  }, []);

  const removeFromCart = useCallback((serviceNumber) => {
    setItems((prev) => prev.filter((i) => i.number !== serviceNumber));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const totalItems = items.length;

  return (
    <CartContext.Provider value={{
      items, totalItems,
      isOpen, openCart, closeCart, toggleCart,
      addToCart, removeFromCart, clearCart,
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
