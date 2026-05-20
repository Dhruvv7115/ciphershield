'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess, message }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setName('');
      setMode('login');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        login(email, password);
      } else {
        if (!name || !email || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        signup(name, email, password);
      }
      // Simulate brief loading for premium feel
      setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        onClose();
      }, 600);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10000,
          animation: 'loginFadeIn 0.25s ease',
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
          width: 'min(440px, 92vw)',
          zIndex: 10001,
          animation: 'loginSlideIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Glass card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
        }}>
          {/* Top accent bar */}
          <div style={{
            height: 3,
            background: 'linear-gradient(90deg, transparent, var(--cta), transparent)',
          }} />

          {/* Header */}
          <div style={{
            padding: '28px 32px 0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cta)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '2px',
                  color: 'var(--cta)',
                  fontWeight: 600,
                }}>SECURE ACCESS</span>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                marginBottom: 6,
              }}>
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>

              {message && (
                <p style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  maxWidth: 300,
                }}>
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: 6,
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
                flexShrink: 0,
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '20px 32px 28px' }}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                  fontFamily: 'var(--font-sans)',
                }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--cta)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-muted)',
                marginBottom: 6,
                fontFamily: 'var(--font-sans)',
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--cta)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-muted)',
                marginBottom: 6,
                fontFamily: 'var(--font-sans)',
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--cta)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: 'rgba(255,61,90,0.08)',
                border: '1px solid rgba(255,61,90,0.2)',
                color: '#FF3D5A',
                fontSize: 12,
                marginBottom: 16,
                fontFamily: 'var(--font-sans)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px 24px',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {loading ? (
                <div style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'rotate-slow 0.6s linear infinite',
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

            {/* Toggle mode */}
            <div style={{
              textAlign: 'center',
              marginTop: 18,
              fontSize: 13,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
            }}>
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cta)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--cta)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Bottom security note */}
          <div style={{
            padding: '14px 32px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              opacity: 0.6,
              fontFamily: 'var(--font-sans)',
            }}>
              256-bit encrypted • SOC 2 compliant
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes loginSlideIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
}
