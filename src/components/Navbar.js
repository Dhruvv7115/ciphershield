'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import LoginModal from './LoginModal';

const megaServices = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'MDR',
    desc: 'Managed Detection & Response',
    color: '#6366F1',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    ),
    title: 'Cloud Security',
    desc: 'Posture management & CSPM',
    color: '#818CF8',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: 'Red Team Ops',
    desc: 'Adversary simulation & pentesting',
    color: '#FF3D5A',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Identity & Access',
    desc: 'IAM, SSO & zero-trust access',
    color: '#818CF8',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'AI Automation',
    desc: 'Business process automation with AI',
    color: '#6366F1',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      </svg>
    ),
    title: 'Chatbot Dev',
    desc: 'Enterprise chatbots & AI assistants',
    color: '#818CF8',
  },
];

const navLinks = [
  { label: 'Why Us', href: '#why-choose-us' },
  { label: 'About', href: '#about' },
  { label: 'Blog', href: '/blog', isRoute: true },
  { label: 'Pricing', href: '#pricing', requiresAuth: true },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const navRef = useRef(null);
  const { user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href, requiresAuth = false) => {
    setMenuOpen(false);

    // If requires auth and not logged in, show login modal
    if (requiresAuth && !user) {
      setLoginMessage('Sign in to view pricing and membership plans.');
      setLoginOpen(true);
      return;
    }

    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    router.push('/services');
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0',
          background: scrolled ? 'var(--nav-bg-scrolled)' : 'transparent',
          borderBottom: `1px solid ${scrolled ? 'var(--nav-border-scrolled)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick('#top')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div style={{ width: 46, height: 46, position: 'relative', flexShrink: 0 }}>
              <Image
                src="/aritaro-logo.png"
                alt="Aritaro"
                fill
                sizes="46px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
            }}>
              ARITARO
            </span>
          </button>

          {/* Desktop nav */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
            className="nav-desktop"
          >
            {/* Services with mega-menu */}
            <div className="nav-services" style={{ position: 'relative' }}>
              <button
                className="nav-services-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  borderRadius: 8,
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
                onClick={handleServicesClick}
              >
                Services
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="nav-chevron">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Redesigned Mega menu */}
              <div className="mega-menu">
                {/* Header */}
                <div className="mega-header">
                  <span className="mega-header-title">Our Services</span>
                  <span className="mega-header-count">{megaServices.length} services</span>
                </div>

                {/* Grid */}
                <div className="mega-grid">
                  {megaServices.map((s) => (
                    <button
                      key={s.title}
                      className="mega-item"
                      onClick={handleServicesClick}
                      style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}
                    >
                      <div className="mega-icon" style={{ color: s.color }}>
                        {s.icon}
                      </div>
                      <div>
                        <div className="mega-item-title">{s.title}</div>
                        <div className="mega-item-desc">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="mega-footer">
                  <button
                    className="mega-footer-btn"
                    onClick={handleServicesClick}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%' }}
                  >
                    <span>View All Services</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Other links */}
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    background: 'none',
                    textDecoration: 'none',
                    padding: '8px 14px',
                    fontSize: 15,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    transition: 'color 0.15s, background 0.15s',
                    borderRadius: 6,
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.requiresAuth)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    fontSize: 15,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    transition: 'color 0.15s, background 0.15s',
                    borderRadius: 6,
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'none';
                  }}
                >
                  {link.label}
                </button>
              )
            )}
          </div>

          {/* Right: Cart + Auth + CTA + toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Cart icon */}
            <button
              onClick={toggleCart}
              aria-label="View cart"
              style={{
                position: 'relative',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '7px 10px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                transition: 'border-color 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cta)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -5, right: -5,
                  background: '#FF3D5A',
                  color: '#fff',
                  fontSize: 9,
                  fontWeight: 700,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth — Login or User avatar */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 30, height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  title={user.name}
                  onClick={logout}
                >
                  {user.avatar}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setLoginMessage('');
                  setLoginOpen(true);
                }}
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--cta)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Login
              </button>
            )}

            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary nav-cta-desktop"
              style={{ fontSize: 13, padding: '8px 20px' }}
            >
              Get Protected
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className="nav-hamburger"
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: 8,
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <path d="M18 6L6 18M6 6l12 12" />
                  : <path d="M3 12h18M3 6h18M3 18h18" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            background: 'var(--mobile-menu-bg)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '16px 24px 24px',
          }}>
            {[{ label: 'Services', href: '/services', isRoute: true }, ...navLinks].map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    width: '100%',
                    borderBottom: '1px solid var(--border-subtle)',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href, link.requiresAuth)}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    padding: '14px 0',
                    fontSize: 16,
                    fontWeight: 400,
                    color: 'var(--text-muted)',
                    textAlign: 'left',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {link.label}
                </button>
              )
            )}

            {!user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setLoginMessage('');
                  setLoginOpen(true);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '14px 0',
                  fontSize: 16,
                  fontWeight: 400,
                  color: 'var(--cta)',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                }}
              >
                Login / Sign Up
              </button>
            )}

            <button
              onClick={() => handleNavClick('#contact')}
              className="btn-primary"
              style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
            >
              Get Protected
            </button>
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .nav-desktop { display: none !important; }
            .nav-hamburger { display: flex !important; }
            .nav-cta-desktop { display: none !important; }
          }
          @media (max-width: 500px) {
            .mega-menu { width: calc(100vw - 32px) !important; left: -100px !important; }
            .mega-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        message={loginMessage}
      />
    </>
  );
}
