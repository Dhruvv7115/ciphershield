'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

import WhatsAppWidget from '@/components/WhatsAppWidget';

const INCLUDES = [
  'External attack surface enumeration',
  'DNS & subdomain security check',
  'SSL/TLS configuration analysis',
  'HTTP security headers review',
  'Public exposure scan',
  'Executive summary with top 3 recommendations',
];

export default function FreeAuditClient() {
  const [form, setForm] = useState({ name: '', email: '', company: '', url: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would POST to an API endpoint
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>


      <section style={{ padding: '80px 24px 80px', position: 'relative' }}>
        <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#25D366', animation: 'pulse-glow 2s ease-in-out infinite' }} />
              FREE · NO COMMITMENT
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 16 }}>
              Free External <span style={{ color: 'var(--accent)' }}>Security Audit</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
              Get an external security assessment of your application — completely free. No sales pressure, no commitment. Just actionable insights.
            </p>
          </div>

          <div className="audit-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
            {/* What's Included */}
            <div style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>What&apos;s Included</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {INCLUDES.map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 28, padding: '16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 12 }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--accent)' }}>Turnaround:</strong> Results delivered within 3-5 business days via email. A 20-minute walkthrough call is included.
                </p>
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: '32px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 18 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2" strokeLinecap="round" style={{ marginBottom: 16 }}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Request Received!</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>We&apos;ll review your submission and send results within 3-5 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Request Your Free Audit</h2>
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', required: true },
                    { key: 'email', label: 'Business Email', type: 'email', required: true },
                    { key: 'company', label: 'Company Name', type: 'text', required: true },
                    { key: 'url', label: 'Application URL', type: 'url', required: true },
                  ].map(({ key, label, type, required }) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{label} {required && '*'}</label>
                      <input
                        type={type}
                        required={required}
                        value={form[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        style={{
                          padding: '10px 14px', fontSize: 14,
                          background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                          borderRadius: 10, color: 'var(--text-primary)',
                          outline: 'none', transition: 'border-color 0.2s',
                          fontFamily: 'var(--font-sans)',
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Additional Notes</label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{
                        padding: '10px 14px', fontSize: 14, resize: 'vertical',
                        background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                        borderRadius: 10, color: 'var(--text-primary)',
                        outline: 'none', fontFamily: 'var(--font-sans)',
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: 6, padding: '14px', fontSize: 15, width: '100%', justifyContent: 'center' }}>
                    Request Free Audit
                  </button>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                    Your data is handled with enterprise-grade confidentiality. We sign NDAs as standard.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', padding: '32px 24px 48px' }}>
        <Link href="/" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', padding: '12px 24px', border: '1px solid var(--border-subtle)', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          ← Back to Home
        </Link>
      </div>


      <WhatsAppWidget />

      <style>{`
        @media (max-width: 700px) {
          .audit-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
