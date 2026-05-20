'use client';

import { useCart } from './CartContext';
import { useEffect, useRef } from 'react';

export default function CartPanel() {
  const { items, isOpen, closeCart, removeFromCart, clearCart } = useCart();
  const panelRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  // NO body scroll lock — page stays fully interactive

  return (
    <>
      {/* NO full-screen backdrop — page remains accessible */}
      {/* Subtle edge shadow only to hint at the panel */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'transparent',
          zIndex: 9998,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      {/* Side Panel — slides in from right, non-blocking */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(400px, 88vw)',
          height: '100vh',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-subtle)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isOpen ? '-12px 0 40px rgba(0,0,0,0.2)' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              Selected Services
            </h2>
            <span style={{
              background: 'var(--cta)',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 100,
              minWidth: 20,
              textAlign: 'center',
            }}>
              {items.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              cursor: 'pointer',
              padding: 6,
              color: 'var(--text-muted)',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-elevated)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 24px',
        }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 16,
              color: 'var(--text-muted)',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              <p style={{ fontSize: 15, fontWeight: 500 }}>No services selected</p>
              <p style={{ fontSize: 13, opacity: 0.7 }}>Browse our services and add them here</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item.number}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 12,
                    padding: '16px',
                    display: 'flex',
                    gap: 14,
                    alignItems: 'flex-start',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    color: item.color || '#6366F1',
                    flexShrink: 0,
                  }}>
                    {item.icon || (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                      lineHeight: 1.3,
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.number)}
                    title="Remove"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: 4,
                      borderRadius: 6,
                      transition: 'color 0.15s',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3D5A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {items.length} service{items.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#FF3D5A',
                  fontWeight: 500,
                  padding: '4px 8px',
                  borderRadius: 4,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,61,90,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                Clear All
              </button>
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px 24px',
                fontSize: 14,
                fontWeight: 600,
              }}
              onClick={() => {
                closeCart();
                const el = document.querySelector('#contact');
                if (el) {
                  setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
                }
              }}
            >
              Request Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              className="btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px 24px',
                fontSize: 13,
              }}
              onClick={closeCart}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </>
  );
}
