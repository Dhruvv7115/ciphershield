'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/components/CartContext';
import { services, categories } from '@/components/servicesData';
import Link from 'next/link';

const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  cart: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

const serviceIcons = {
  '01': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" /><path d="M8 14h4l2-4 2 6 2-3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="21" cy="7" r="3" fill="currentColor" opacity="0.3" /></svg>,
  '02': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M4 6a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.5" /><circle cx="10" cy="11" r="1.2" fill="currentColor" /><circle cx="14" cy="11" r="1.2" fill="currentColor" /><circle cx="18" cy="11" r="1.2" fill="currentColor" /></svg>,
  '03': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M14 15v5M10 25a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="14" cy="10" r="2" fill="currentColor" opacity="0.3" /></svg>,
  '04': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M9 8h10M9 12h7M9 16h10M9 20h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
  '05': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" /><circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" /><circle cx="14" cy="14" r="1.5" fill="currentColor" /></svg>,
  '06': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M4 7a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 10l4 3-4 3M14 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  '07': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="14" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" /><circle cx="14" cy="13" r="1" fill="currentColor" /></svg>,
  '08': <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" /><path d="M2 10h24" stroke="currentColor" strokeWidth="1" opacity="0.5" /><path d="M8 17l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

export default function ServicesPage() {
  const { items: cartItems, addToCart, removeFromCart, totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <main className="dash-main">
      <div className="dash-main-bg" />
      <div className="dash-content">
        {/* Header */}
        <div className="dash-header dash-animate dash-animate-1" style={{ marginBottom: 24 }}>
          <div className="dash-header-left">
            <div className="dash-operational-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: 100,
              padding: '4px 14px',
              marginBottom: 12,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#818CF8',
                boxShadow: '0 0 8px rgba(129,140,248,0.7)',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '2px',
                color: '#818CF8',
                fontWeight: 600,
              }}>SERVICE CATALOG</span>
            </div>
            <h1>Browse Services</h1>
            <p>Select services to customize your protection and automation stack.</p>
          </div>

          <div className="dash-header-actions">
            <Link href="/dashboard" className="dash-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Back to Overview
            </Link>
            <button className="dash-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
              {Icons.cart} {totalItems} Items in Quote
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="dash-full-panel dash-animate dash-animate-2" style={{
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: activeCategory === cat ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)',
                  background: activeCategory === cat ? 'rgba(99,102,241,0.1)' : 'rgba(2,6,23,0.3)',
                  color: activeCategory === cat ? '#818CF8' : '#94A3B8',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = '#F1F5F9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#94A3B8';
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748B', display: 'flex', alignItems: 'center' }}>
              {Icons.search}
            </span>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 40px',
                borderRadius: 12,
                background: 'rgba(2,6,23,0.5)',
                border: '1px solid rgba(51,65,85,0.4)',
                color: '#F1F5F9',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(51,65,85,0.4)'}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
        }} className="dash-animate dash-animate-3">
          {filteredServices.map((service, index) => {
            const isAdded = cartItems.some((item) => item.number === service.number);

            return (
              <div
                key={service.number}
                style={{
                  background: 'rgba(15,23,42,0.45)',
                  border: '1px solid rgba(99,102,241,0.12)',
                  borderRadius: 18,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 320,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Glowing decorative background */}
                <div style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 120,
                  height: 120,
                  background: `radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                <div>
                  {/* Card Header Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'rgba(99,102,241,0.45)',
                    }}>{service.number}</span>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: service.color,
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid rgba(255,255,255,0.05)`,
                      borderRadius: 100,
                      padding: '2px 8px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                    }}>{service.category}</span>
                  </div>

                  {/* Title & Icon */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: service.color,
                      background: 'rgba(99,102,241,0.06)',
                      border: '1px solid rgba(99,102,241,0.1)',
                      flexShrink: 0,
                    }}>
                      {serviceIcons[service.number]}
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', marginTop: 8 }}>{service.title}</h3>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.5, marginBottom: 16 }}>{service.desc}</p>

                  {/* Features List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                    {service.features.map((feat, fidx) => (
                      <span key={fidx} style={{
                        fontSize: 10,
                        color: '#64748B',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: 6,
                        padding: '2px 6px',
                      }}>
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                  paddingTop: 16,
                  marginTop: 8,
                }}>
                  <div>
                    <span style={{ fontSize: 10, color: '#475569', display: 'block' }}>EST. COST</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', fontFamily: 'var(--font-mono)' }}>{service.price}</span>
                  </div>

                  {isAdded ? (
                    <button
                      onClick={() => removeFromCart(service.number)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'rgba(74,222,128,0.1)',
                        border: '1px solid rgba(74,222,128,0.3)',
                        color: '#4ADE80',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                        e.currentTarget.style.color = '#EF4444';
                        e.currentTarget.innerText = 'Remove';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(74,222,128,0.1)';
                        e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)';
                        e.currentTarget.style.color = '#4ADE80';
                        e.currentTarget.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><polyline points="20 6 9 17 4 12"></polyline></svg> Added`;
                      }}
                    >
                      {Icons.check} Added
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(service)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        borderRadius: 10,
                        fontSize: 12,
                        fontWeight: 600,
                        background: 'rgba(99,102,241,0.12)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        color: '#818CF8',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                        e.currentTarget.style.color = '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(99,102,241,0.12)';
                        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
                        e.currentTarget.style.color = '#818CF8';
                      }}
                    >
                      {Icons.plus} Add to Quote
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '48px 24px',
            background: 'rgba(15,23,42,0.3)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 18,
            color: '#64748B',
            marginTop: 20,
          }}>
            <p style={{ fontSize: 15, marginBottom: 8 }}>No services found matching your criteria.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} style={{
              background: 'none',
              border: 'none',
              color: '#818CF8',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: 13,
            }}>Reset filters</button>
          </div>
        )}
      </div>
    </main>
  );
}
