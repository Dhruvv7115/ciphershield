'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';
import { services, categories } from '@/components/servicesData';
import Link from 'next/link';
import Image from 'next/image';
import LoginModal from '@/components/LoginModal';
import ThemeToggle from '@/components/ThemeToggle';

/* ─── Service icon SVGs ──────────────────────── */
const serviceIcons = {
  '01': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 14h4l2-4 2 6 2-3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="21" cy="7" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  '02': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path d="M4 6a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="11" r="1.2" fill="currentColor" /><circle cx="14" cy="11" r="1.2" fill="currentColor" /><circle cx="18" cy="11" r="1.2" fill="currentColor" />
    </svg>
  ),
  '03': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 15v5M10 25a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="10" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  '04': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="3" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h10M9 12h7M9 16h10M9 20h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  '05': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  '06': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path d="M4 7a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10l4 3-4 3M14 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '07': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="14" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="14" cy="13" r="1" fill="currentColor" />
    </svg>
  ),
  '08': (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 10h24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M8 17l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function ServicesPage() {
  const { user } = useAuth();
  const { addToCart, items: cartItems, toggleCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [mounted, setMounted] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid var(--border-subtle)',
          borderTopColor: 'var(--cta)',
          borderRadius: '50%',
          animation: 'rotate-slow 0.7s linear infinite',
        }} />
      </div>
    );
  }

  const filtered = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const isInCart = (num) => cartItems.some((i) => i.number === num);

  const handleAddToCart = (service) => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    if (!isInCart(service.number)) addToCart(service);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        background: 'var(--nav-bg-scrolled)',
        borderBottom: '1px solid var(--nav-border-scrolled)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, position: 'relative', flexShrink: 0 }}>
              <Image src="/aritaro-logo.png" alt="Aritaro" fill sizes="40px" style={{ objectFit: 'contain' }} priority />
            </div>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>ARITARO</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Cart icon */}
            <button
              onClick={toggleCart}
              style={{
                position: 'relative',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cta)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6, right: -6,
                  background: '#FF3D5A',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 18, height: 18,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* User badge */}
            {user ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 100,
                padding: '4px 14px 4px 4px',
              }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {user.avatar}
                </div>
                <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                  {user.name}
                </span>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '7px 14px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-sans)',
                  background: 'none',
                  cursor: 'pointer',
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero header */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 100, padding: '6px 20px',
            marginBottom: 22,
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--cyan-primary)',
              boxShadow: '0 0 8px rgba(99,102,241,0.5)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: '2.5px',
              color: 'var(--hero-badge-text)', fontWeight: 600,
            }}>ALL SERVICES</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            Our{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>complete</span>{' '}
            capabilities
          </h1>

          <p style={{
            maxWidth: 540, margin: '0 auto',
            color: 'var(--text-muted)',
            fontSize: 16, lineHeight: 1.75,
          }}>
            Browse and select the services your organization needs. Add them to your quote
            and we&apos;ll put together a tailored protection plan.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px',
              borderRadius: 100,
              border: activeCategory === cat ? '1px solid var(--cta)' : '1px solid var(--border-subtle)',
              background: activeCategory === cat ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: activeCategory === cat ? 'var(--cta)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = 'var(--cta)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== cat) {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services grid — narrower cards, more height */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <div className="services-page-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {filtered.map((service) => {
            const isThreat = service.color === '#FF3D5A';
            const inCart = isInCart(service.number);

            return (
              <div
                key={service.number}
                className="s-card"
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--service-card-border)',
                  borderRadius: 16,
                  padding: '30px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: 'var(--service-card-shadow)',
                  minHeight: 380,
                }}
              >
                {/* Category tag */}
                <span style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '1px',
                  color: isThreat ? '#FF3D5A' : 'var(--cta)',
                  background: isThreat ? 'rgba(255,61,90,0.08)' : 'rgba(99,102,241,0.08)',
                  border: `1px solid ${isThreat ? 'rgba(255,61,90,0.15)' : 'rgba(99,102,241,0.15)'}`,
                  borderRadius: 100,
                  padding: '3px 10px',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {service.category}
                </span>

                {/* Number badge */}
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9, fontWeight: 700,
                  color: isThreat ? 'rgba(255,61,90,0.4)' : 'rgba(99,102,241,0.35)',
                  letterSpacing: '1px',
                  marginBottom: 14,
                }}>{service.number}</span>

                {/* Icon */}
                <div style={{
                  width: 46, height: 46,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: service.color,
                  background: isThreat ? 'rgba(255,61,90,0.06)' : 'rgba(99,102,241,0.07)',
                  border: `1px solid ${isThreat ? 'rgba(255,61,90,0.15)' : 'rgba(99,102,241,0.15)'}`,
                  marginBottom: 18,
                }}>
                  {serviceIcons[service.number]}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                  lineHeight: 1.35,
                }}>{service.title}</h3>

                {/* Description */}
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: 18,
                  flex: 1,
                }}>{service.desc}</p>

                {/* Features */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="feature-tag"
                      style={isThreat ? {
                        background: 'rgba(255,61,90,0.05)',
                        borderColor: 'rgba(255,61,90,0.14)',
                        color: '#FF3D5A',
                      } : {}}
                    >{f}</span>
                  ))}
                </div>

                {/* Price */}
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {service.price}
                </div>

                {/* Divider */}
                <div style={{
                  height: 1,
                  background: isThreat
                    ? 'linear-gradient(90deg, rgba(255,61,90,0.2), transparent 70%)'
                    : 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent 70%)',
                  marginBottom: 16,
                }} />

                {/* Add to cart button */}
                <button
                  onClick={() => handleAddToCart(service)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 10,
                    border: inCart
                      ? '1px solid rgba(74,222,128,0.3)'
                      : `1px solid ${isThreat ? 'rgba(255,61,90,0.3)' : 'rgba(99,102,241,0.3)'}`,
                    background: inCart
                      ? 'rgba(74,222,128,0.08)'
                      : 'transparent',
                    color: inCart
                      ? '#4ADE80'
                      : isThreat ? '#FF3D5A' : 'var(--cta)',
                    cursor: inCart ? 'default' : 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.2s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!inCart) {
                      e.currentTarget.style.background = isThreat ? 'rgba(255,61,90,0.08)' : 'rgba(99,102,241,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!inCart) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {inCart ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Added to Quote
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                      </svg>
                      Add to Quote
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back to home — NO MembershipSection */}
      <div style={{
        textAlign: 'center',
        padding: '60px 24px',
        background: 'var(--bg-base)',
      }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          color: 'var(--text-muted)',
          textDecoration: 'none',
          transition: 'color 0.15s',
          padding: '12px 24px',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
        }}>
          ← Back to Home
        </Link>
      </div>

      <ThemeToggle />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        message="Sign in to add services to your quote and access the full catalog."
      />

      <style>{`
        @media (max-width: 640px) {
          .services-page-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
