'use client';

import { useCart } from './CartContext';
import { useEffect, useRef } from 'react';

export default function CartPanel() {
  const { items, isOpen, closeCart, removeFromCart, clearCart } = useCart();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Side Panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(440px, 92vw)',
          height: '100vh',
          background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.99) 100%)',
          borderLeft: '1px solid rgba(99,102,241,0.2)',
          zIndex: 9999,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isOpen ? '-20px 0 80px rgba(0,0,0,0.6), -1px 0 0 rgba(99,102,241,0.15)' : 'none',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent line */}
        <div style={{
          height: 2,
          background: 'linear-gradient(90deg, transparent, #6366F1 30%, #818CF8 70%, transparent)',
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          padding: '22px 28px',
          borderBottom: '1px solid rgba(51,65,85,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818CF8',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 15,
                fontWeight: 700,
                color: '#E2E8F0',
                lineHeight: 1,
                marginBottom: 3,
              }}>
                Service Quote
              </h2>
              <span style={{
                fontSize: 11,
                color: 'rgba(148,163,184,0.7)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
              }}>
                {items.length} SERVICE{items.length !== 1 ? 'S' : ''} SELECTED
              </span>
            </div>
          </div>

          <button
            onClick={closeCart}
            style={{
              width: 32,
              height: 32,
              background: 'rgba(51,65,85,0.4)',
              border: '1px solid rgba(51,65,85,0.6)',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              e.currentTarget.style.color = '#E2E8F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(51,65,85,0.4)';
              e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 28px',
        }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 20,
            }}>
              {/* Empty state icon */}
              <div style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: 'rgba(99,102,241,0.07)',
                border: '1px solid rgba(99,102,241,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(99,102,241,0.5)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#E2E8F0', marginBottom: 8 }}>
                  No services yet
                </p>
                <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', lineHeight: 1.6 }}>
                  Browse our catalog and add services<br />to build your custom quote
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary"
                style={{ fontSize: 13, padding: '10px 24px' }}
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map((item, i) => {
                const isThreat = item.color === '#FF3D5A';
                const accentColor = isThreat ? '#FF3D5A' : '#818CF8';
                return (
                  <div
                    key={item.number}
                    style={{
                      background: 'rgba(30,41,59,0.6)',
                      border: `1px solid rgba(${isThreat ? '255,61,90' : '99,102,241'},0.15)`,
                      borderRadius: 14,
                      padding: '16px',
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      transition: 'all 0.2s ease',
                      animation: `cartItemIn 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `rgba(${isThreat ? '255,61,90' : '99,102,241'},0.3)`;
                      e.currentTarget.style.background = 'rgba(30,41,59,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `rgba(${isThreat ? '255,61,90' : '99,102,241'},0.15)`;
                      e.currentTarget.style.background = 'rgba(30,41,59,0.6)';
                    }}
                  >
                    {/* Icon */}
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `rgba(${isThreat ? '255,61,90' : '99,102,241'},0.08)`,
                      border: `1px solid rgba(${isThreat ? '255,61,90' : '99,102,241'},0.18)`,
                      color: accentColor,
                      flexShrink: 0,
                    }}>
                      {item.icon || (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <h4 style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#E2E8F0',
                          lineHeight: 1.3,
                        }}>
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.number)}
                          title="Remove"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'rgba(148,163,184,0.5)',
                            padding: '2px',
                            borderRadius: 4,
                            transition: 'color 0.15s',
                            flexShrink: 0,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3D5A'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(148,163,184,0.5)'; }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p style={{
                        fontSize: 11,
                        color: 'rgba(148,163,184,0.65)',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: 8,
                      }}>
                        {item.desc}
                      </p>
                      {item.price && (
                        <span style={{
                          fontSize: 11,
                          fontFamily: 'var(--font-mono)',
                          color: accentColor,
                          fontWeight: 600,
                        }}>
                          {item.price}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 28px 28px',
            borderTop: '1px solid rgba(51,65,85,0.5)',
            flexShrink: 0,
            background: 'rgba(2,6,23,0.5)',
          }}>
            {/* Summary */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              padding: '12px 16px',
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.12)',
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 13, color: '#94A3B8', fontFamily: 'var(--font-sans)' }}>
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
                  fontFamily: 'var(--font-sans)',
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
                padding: '15px 24px',
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 10,
                borderRadius: 12,
                letterSpacing: '0.02em',
              }}
              onClick={() => {
                closeCart();
                const el = document.querySelector('#contact');
                if (el) {
                  setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 350);
                }
              }}
            >
              Request Custom Quote
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={closeCart}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(51,65,85,0.6)',
                borderRadius: 12,
                fontSize: 13,
                color: '#94A3B8',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                e.currentTarget.style.color = '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes cartItemIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
