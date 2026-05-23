'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  { icon: '🛡️', title: 'Military-Grade Security', desc: 'Zero-trust architecture protecting your assets 24/7' },
  { icon: '⚡', title: 'AI-Powered Detection', desc: 'Sub-millisecond threat identification at enterprise scale' },
  { icon: '🌐', title: 'Global Coverage', desc: 'Operations across 40+ countries, always-on protection' },
];

export default function LoginPage() {
  const { user, login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) { setError('Please fill in all fields'); setLoading(false); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name'); setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }

    await new Promise(r => setTimeout(r, 900));

    try {
      if (mode === 'signup') signup(name, email, password);
      else login(email, password);
      router.replace(redirect);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  if (user) return null;

  const inputStyle = (field) => ({
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    border: `1px solid ${focused === field ? 'rgba(99,102,241,0.6)' : 'rgba(51,65,85,0.6)'}`,
    background: focused === field ? 'rgba(30,41,59,0.8)' : 'rgba(15,23,42,0.5)',
    color: '#E2E8F0',
    fontSize: 14,
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: focused === field ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#020617',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50%',
          height: '70%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          animation: 'floatOrb1 12s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '45%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)',
          animation: 'floatOrb2 15s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          width: '30%',
          height: '40%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)',
          animation: 'floatOrb3 10s ease-in-out infinite',
        }} />
      </div>

      {/* Grid texture */}
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} />

      {/* Left branding panel */}
      <div className="login-left" style={{
        flex: '1 1 55%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 60px 60px 80px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', marginBottom: 64 }}>
          <div style={{ width: 48, height: 48, position: 'relative', flexShrink: 0 }}>
            <Image src="/aritaro-logo.png" alt="Aritaro" fill sizes="48px" style={{ objectFit: 'contain' }} priority />
          </div>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#E2E8F0',
          }}>ARITARO</span>
        </Link>

        {/* Headline */}
        <div style={{ maxWidth: 480 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: 100,
            padding: '6px 18px',
            marginBottom: 24,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#6366F1',
              boxShadow: '0 0 8px rgba(99,102,241,0.8)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2px', color: '#818CF8', fontWeight: 600 }}>
              ENTERPRISE SECURITY PLATFORM
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(32px,4vw,48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#F1F5F9',
            marginBottom: 20,
          }}>
            Unseen protection,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #818CF8, #22D3EE)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              real results
            </span>
          </h1>

          <p style={{
            fontSize: 16,
            color: '#64748B',
            lineHeight: 1.75,
            marginBottom: 48,
          }}>
            Access your complete cybersecurity dashboard — monitor threats, manage services,
            and protect your enterprise with AI-powered intelligence.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 16,
                  padding: '16px 20px',
                  background: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(51,65,85,0.5)',
                  borderRadius: 14,
                  transition: 'all 0.3s ease',
                  animation: mounted ? `fadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s both` : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)';
                  e.currentTarget.style.background = 'rgba(15,23,42,0.5)';
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: '1 1 45%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Vertical separator */}
        <div className="login-divider" style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          height: '80%',
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.2) 30%, rgba(99,102,241,0.2) 70%, transparent)',
        }} />

        <div style={{
          width: '100%',
          maxWidth: 460,
          background: 'linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.97) 100%)',
          border: '1px solid rgba(99,102,241,0.18)',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 32px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
          animation: mounted ? 'formIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both' : 'none',
        }}>
          {/* Top accent bar */}
          <div style={{
            height: 3,
            background: 'linear-gradient(90deg, transparent, #6366F1 30%, #818CF8 60%, #22D3EE 90%, transparent)',
          }} />

          <div style={{ padding: '32px 36px' }}>
            {/* Mobile logo */}
            <div className="login-mobile-logo" style={{ display: 'none', marginBottom: 28 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, position: 'relative' }}>
                  <Image src="/aritaro-logo.png" alt="Aritaro" fill sizes="36px" style={{ objectFit: 'contain' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', color: '#E2E8F0' }}>ARITARO</span>
              </Link>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: 'rgba(15,23,42,0.6)',
              border: '1px solid rgba(51,65,85,0.5)',
              borderRadius: 14,
              padding: 4,
              gap: 4,
              marginBottom: 28,
            }}>
              {['login', 'signup'].map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '11px 0',
                    border: mode === m ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
                    borderRadius: 11,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: 600,
                    background: mode === m
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(129,140,248,0.15))'
                      : 'transparent',
                    color: mode === m ? '#E2E8F0' : '#475569',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 22,
              fontWeight: 800,
              color: '#F1F5F9',
              marginBottom: 6,
            }}>
              {mode === 'login' ? 'Welcome back' : 'Get started free'}
            </h2>
            <p style={{ fontSize: 13, color: '#475569', marginBottom: 26, lineHeight: 1.5 }}>
              {mode === 'login'
                ? 'Enter your credentials to access your dashboard'
                : 'Create your account to access all enterprise services'}
            </p>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(255,61,90,0.08)',
                border: '1px solid rgba(255,61,90,0.25)',
                borderRadius: 10,
                padding: '11px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                animation: 'shake 0.3s ease',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF3D5A" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                <span style={{ fontSize: 13, color: '#FF3D5A', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                    style={inputStyle('name')} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                  style={inputStyle('email')} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle('password'), paddingRight: 48 }}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0, display: 'flex' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; }}
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

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading
                    ? 'rgba(99,102,241,0.3)'
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
                  boxShadow: loading ? 'none' : '0 6px 24px rgba(99,102,241,0.4)',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)'; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 24px rgba(99,102,241,0.4)'; }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.5)' }} />
              <span style={{ fontSize: 11, color: '#334155' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(51,65,85,0.5)' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={() => { login('user@google.com', 'google'); router.replace(redirect); }}
              style={{
                width: '100%',
                padding: '13px',
                background: 'rgba(30,41,59,0.5)',
                border: '1px solid rgba(51,65,85,0.6)',
                borderRadius: 12,
                fontSize: 14,
                color: '#94A3B8',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
                marginBottom: 20,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#E2E8F0'; e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(30,41,59,0.5)'; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link href="/" style={{
                fontSize: 13,
                color: '#334155',
                textDecoration: 'none',
                transition: 'color 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#334155'; }}
              >
                ← Back to homepage
              </Link>
            </div>
          </div>

          {/* Security footer */}
          <div style={{
            padding: '14px 36px 20px',
            borderTop: '1px solid rgba(51,65,85,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: 'rgba(2,6,23,0.3)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: 11, color: '#1E293B', fontFamily: 'var(--font-sans)' }}>
              256-bit AES encrypted · SOC 2 Type II · ISO 27001
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatOrb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,-30px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,40px) scale(1.08); }
        }
        @keyframes floatOrb3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-20px) scale(1.05); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes formIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @media (max-width: 900px) {
          .login-left { display: none !important; }
          .login-divider { display: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
