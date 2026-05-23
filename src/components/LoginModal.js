'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import Link from 'next/link';

export default function LoginModal({ isOpen, onClose, onSuccess, message }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setName('');
      setMode('login');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        if (!email || !password) { setError('Please fill in all fields'); setLoading(false); return; }
        login(email, password);
      } else {
        if (!name || !email || !password) { setError('Please fill in all fields'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        signup(name, email, password);
      }
      await new Promise(r => setTimeout(r, 700));
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: `1px solid ${focused === field ? 'rgba(99,102,241,0.6)' : 'rgba(51,65,85,0.7)'}`,
    background: focused === field ? 'rgba(30,41,59,0.8)' : 'rgba(15,23,42,0.6)',
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: focused === field ? '0 0 0 3px rgba(99,102,241,0.12), inset 0 1px 2px rgba(0,0,0,0.2)' : 'inset 0 1px 2px rgba(0,0,0,0.2)',
    boxSizing: 'border-box',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#94A3B8',
    marginBottom: 7,
    fontFamily: 'var(--font-sans)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 10000,
          animation: 'modalFadeIn 0.3s ease',
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(460px, 94vw)',
          zIndex: 10001,
          animation: 'modalSlideIn 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.97) 0%, rgba(2,6,23,0.98) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          {/* Top gradient accent */}
          <div style={{
            height: 3,
            background: 'linear-gradient(90deg, transparent, #6366F1 20%, #818CF8 50%, #22D3EE 80%, transparent)',
          }} />

          {/* Decorative orb */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ padding: '28px 32px 0', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                {/* Logo mark */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818CF8',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '2.5px',
                    color: '#818CF8',
                    fontWeight: 600,
                  }}>SECURE ACCESS</span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#F1F5F9',
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}>
                  {mode === 'login' ? 'Welcome back' : 'Get started'}
                </h2>

                <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.8)', lineHeight: 1.5 }}>
                  {message || (mode === 'login'
                    ? 'Sign in to your account to continue'
                    : 'Create your free account in seconds')}
                </p>
              </div>

              <button
                onClick={onClose}
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
                  flexShrink: 0,
                  marginTop: 4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(51,65,85,0.4)'; e.currentTarget.style.color = '#94A3B8'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mode tabs */}
            <div style={{
              display: 'flex',
              marginTop: 24,
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(51,65,85,0.5)',
              borderRadius: 12,
              padding: 4,
              gap: 4,
            }}>
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    borderRadius: 9,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    background: mode === m
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(129,140,248,0.2))'
                      : 'transparent',
                    color: mode === m ? '#E2E8F0' : '#64748B',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    boxShadow: mode === m ? '0 1px 0 rgba(99,102,241,0.2)' : 'none',
                    border: mode === m ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '20px 32px 10px' }}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={inputStyle('name')}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={inputStyle('email')}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ ...inputStyle('password'), paddingRight: 46 }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748B',
                    padding: 0,
                    display: 'flex',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(255,61,90,0.08)',
                border: '1px solid rgba(255,61,90,0.25)',
                color: '#FF3D5A',
                fontSize: 13,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                animation: 'shake 0.3s ease',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: loading
                  ? 'rgba(99,102,241,0.4)'
                  : 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                border: 'none',
                borderRadius: 12,
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: 'var(--font-sans)',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)';
              }}
            >
              {loading ? (
                <div style={{
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 32px' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.5)' }} />
            <span style={{ fontSize: 11, color: '#475569', fontFamily: 'var(--font-sans)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.5)' }} />
          </div>

          {/* Google SSO */}
          <div style={{ padding: '0 32px 8px' }}>
            <Link
              href="/login"
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '12px',
                background: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(51,65,85,0.6)',
                borderRadius: 12,
                fontSize: 13,
                color: '#94A3B8',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#E2E8F0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; e.currentTarget.style.color = '#94A3B8'; }}
            >
              Open full login page →
            </Link>
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 32px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: 11, color: 'rgba(148,163,184,0.45)', fontFamily: 'var(--font-sans)' }}>
              256-bit encrypted · SOC 2 compliant · ISO 27001
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.94); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </>
  );
}
