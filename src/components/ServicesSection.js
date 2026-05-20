'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from './AuthContext';
import LoginModal from './LoginModal';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'AI Business Process Automation',
    desc: 'Transform manual workflows into intelligent, AI-driven processes that cut costs, eliminate errors, and scale operations 10× faster.',
    features: ['Workflow Orchestration', 'Smart Triggers', 'Data Pipelines', 'ROI Analytics'],
    color: '#6366F1',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 14h4l2-4 2 6 2-3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="7" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Chatbot Development',
    desc: 'Deploy intelligent chatbots across Web, WhatsApp, and support channels that understand context and convert visitors 24/7.',
    features: ['Multi-Platform', 'NLP Powered', 'WhatsApp API', 'Live Analytics'],
    color: '#818CF8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path d="M4 6a3 3 0 013-3h14a3 3 0 013 3v10a3 3 0 01-3 3H10l-4 4v-4H7a3 3 0 01-3-3V6z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="11" r="1.2" fill="currentColor" />
        <circle cx="14" cy="11" r="1.2" fill="currentColor" />
        <circle cx="18" cy="11" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'AI Agents for Repetitive Workflows',
    desc: 'Deploy autonomous AI agents that handle repetitive tasks — from data entry to report generation — freeing your team for high-value work.',
    features: ['Autonomous Execution', 'Multi-Step Reasoning', 'Tool Integration', 'Self-Learning'],
    color: '#6366F1',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 15v5M10 25a7 7 0 0114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="10" r="2" fill="currentColor" opacity="0.3" />
        <path d="M20 6l3-3M8 6L5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'GPT-Powered Enterprise Tools',
    desc: 'Custom GPT-powered tools for your company — smart document analysis, automated communications, and intelligent decision support.',
    features: ['Custom Fine-Tuning', 'API Integration', 'Doc Intelligence', 'Secure Deploy'],
    color: '#818CF8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect x="5" y="3" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8h10M9 12h7M9 16h10M9 20h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="22" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M21 22l1 1 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Internal Knowledge Assistants',
    desc: 'Build a company knowledge bot that instantly answers employee questions by learning from your docs, SOPs, and knowledge base.',
    features: ['RAG Architecture', 'Knowledge Indexing', 'Role-Based Access', 'Continuous Learning'],
    color: '#818CF8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
        <path d="M14 4v6M14 18v6M4 14h6M18 14h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: '06',
    title: 'AI Content Generation Pipelines',
    desc: 'End-to-end content pipelines powered by AI — blog posts, product descriptions, social media, and marketing copy at scale.',
    features: ['Multi-Format', 'Brand Voice', 'SEO Optimized', 'Batch Processing'],
    color: '#6366F1',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path d="M4 7a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10l4 3-4 3M14 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '07',
    title: 'Cybersecurity Audits & Pen Testing',
    desc: 'Military-grade penetration testing and security audits to identify vulnerabilities before adversaries exploit them. Zero-trust methodology.',
    features: ['Red Teaming', 'VAPT', 'Compliance', 'Threat Modeling'],
    color: '#FF3D5A',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="14" cy="13" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M14 10v-3M14 19v-3M11 13H8M20 13h-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    number: '08',
    title: 'Web Development Services',
    desc: 'Premium web applications and digital platforms built with cutting-edge tech — performant, secure, and designed to convert.',
    features: ['Next.js / React', 'API Integration', 'Performance', 'SEO & Security'],
    color: '#818CF8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 10h24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="6" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="9.5" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="13" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <path d="M8 17l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/* ─── Spring-physics tilt card ──────────────────────── */
/*
  Uses a per-frame lerp loop so rotX/rotY *chase* the target
  at ~8% per frame — giving a smooth, elastic follow-through
  instead of instant snap.
*/
function SpringTiltCard({ service, cardRef: externalRef }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const shimRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    active: false,
    targetX: 0, targetY: 0,
    currentX: 0, currentY: 0,
    glowX: 50, glowY: 50,
  });

  const isThreat = service.color === '#FF3D5A';
  const accentRGB = isThreat ? '255,61,90' : '99,102,241';

  /* spring loop — runs only while hovered */
  const springLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.active) return;

    const LERP = 0.09; // ← smaller = more lag = smoother
    s.currentX += (s.targetX - s.currentX) * LERP;
    s.currentY += (s.targetY - s.currentY) * LERP;

    if (cardRef.current) {
      cardRef.current.style.transform =
        `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg) translateZ(8px) scale3d(1.015,1.015,1)`;
    }

    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${s.glowX}% ${s.glowY}%, rgba(${accentRGB},0.18) 0%, transparent 65%)`;
    }

    // keep running until we're visually settled
    const settled =
      Math.abs(s.currentX) < 0.02 &&
      Math.abs(s.currentY) < 0.02 &&
      Math.abs(s.targetX) < 0.02 &&
      Math.abs(s.targetY) < 0.02;
    if (!settled) rafRef.current = requestAnimationFrame(springLoop);
  }, [accentRGB]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 → 1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const s = stateRef.current;
    s.targetX = -ny * 11;
    s.targetY = nx * 11;
    s.glowX = ((nx + 1) / 2) * 100;
    s.glowY = ((ny + 1) / 2) * 100;
  }, []);

  const handleEnter = useCallback(() => {
    stateRef.current.active = true;
    if (shimRef.current) shimRef.current.style.opacity = '1';
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(springLoop);
  }, [springLoop]);

  const handleLeave = useCallback(() => {
    const s = stateRef.current;
    s.active = false;
    s.targetX = 0;
    s.targetY = 0;

    if (shimRef.current) shimRef.current.style.opacity = '0';
    if (glowRef.current) glowRef.current.style.background = 'none';

    // let spring settle back to zero
    const settleBack = () => {
      const LERP = 0.09;
      s.currentX += (0 - s.currentX) * LERP;
      s.currentY += (0 - s.currentY) * LERP;

      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg) translateZ(0) scale3d(1,1,1)`;
      }

      if (Math.abs(s.currentX) > 0.02 || Math.abs(s.currentY) > 0.02) {
        rafRef.current = requestAnimationFrame(settleBack);
      } else {
        if (cardRef.current) {
          cardRef.current.style.transform = '';
        }
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(settleBack);
  }, []);

  // merge external ref (for gsap scroll anim) + internal ref
  const setRef = useCallback((el) => {
    cardRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
    else if (externalRef) externalRef.current = el;
  }, [externalRef]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div
      ref={setRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        background: '',
        border: `1px solid var(--service-card-border)`,
        borderRadius: 16,
        padding: '26px 22px',
        cursor: 'default',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        boxShadow: 'var(--service-card-shadow)',
        /* border transition handled by CSS class */
      }}
      className="s-card"
    >
      {/* Spotlight glow (cursor tracked) */}
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transition: 'background 0.04s',
      }} />

      {/* Hover border overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        border: `1px solid rgba(${accentRGB},0)`,
        pointerEvents: 'none',
        transition: 'border-color 0.35s ease',
      }} className="s-card-border" />

      {/* Bottom shimmer line */}
      <div ref={shimRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, rgba(${accentRGB},0.8), transparent)`,
        borderRadius: '0 0 16px 16px',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Card content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Number badge */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9, fontWeight: 700,
          color: isThreat ? 'rgba(255,61,90,0.4)' : 'rgba(99,102,241,0.35)',
          letterSpacing: '1px',
          display: 'block',
          marginBottom: 12,
        }}>
          {service.number}
        </span>

        {/* Icon */}
        <div
          className="s-icon"
          style={{
            width: 44, height: 44,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: service.color,
            background: isThreat ? 'rgba(255,61,90,0.06)' : 'rgba(99,102,241,0.07)',
            border: `1px solid ${isThreat ? 'rgba(255,61,90,0.15)' : 'rgba(99,102,241,0.15)'}`,
            marginBottom: 16,
            transition: 'all 0.35s ease',
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(12px, 1.2vw, 14px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 10,
          lineHeight: 1.35,
        }}>
          {service.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.75,
          marginBottom: 16,
        }}>
          {service.desc}
        </p>

        {/* Feature tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {service.features.map((f) => (
            <span
              key={f}
              className="feature-tag"
              style={isThreat ? {
                background: 'rgba(255,61,90,0.05)',
                borderColor: 'rgba(255,61,90,0.14)',
                color: '#FF3D5A',
              } : {}}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Bottom accent line */}
        <div style={{
          marginTop: 18, height: 1,
          background: isThreat
            ? 'linear-gradient(90deg, rgba(255,61,90,0.25), transparent 70%)'
            : 'linear-gradient(90deg, rgba(99,102,241,0.2), transparent 70%)',
        }} />
      </div>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────── */
export default function ServicesSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const { user } = useAuth();
  const router = useRouter();
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: headingRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          y: 70, opacity: 0, duration: 0.85,
          delay: (i % 4) * 0.10,
          ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '110px 0 120px',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Bg decorations */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
      }} />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 64 }}>
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
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: '2.5px',
              color: 'var(--hero-badge-text)', fontWeight: 600,
            }}>
              CAPABILITIES
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 5vw, 54px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
            marginBottom: 18,
          }}>
            Intelligence that{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 60%, #6366F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.35))',
            }}>
              transforms
            </span>
          </h2>

          <p style={{
            maxWidth: 540, margin: '0 auto',
            color: 'var(--text-muted)',
            fontSize: 16, lineHeight: 1.75,
          }}>
            From intelligent automation to military-grade cybersecurity — we build the systems
            that give your business an unfair, unbeatable advantage.
          </p>
        </div>

        {/* Cards grid — show only first 3 on homepage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="services-grid">
          {services.slice(0, 3).map((service, i) => (
            <SpringTiltCard
              key={service.number}
              service={service}
              cardRef={(el) => { cardsRef.current[i] = el; }}
            />
          ))}
        </div>

        {/* View All Services CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          marginTop: 56,
        }}>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            textAlign: 'center',
          }}>
            Explore {services.length - 3} more services including cybersecurity, web development, and AI content tools.
          </p>
          <button
            onClick={() => {
              if (user) {
                router.push('/services');
              } else {
                setLoginOpen(true);
              }
            }}
            className="btn-primary"
            style={{
              fontSize: 15,
              padding: '14px 36px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            View All Services
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          {!user && (
            <span style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              opacity: 0.7,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Login required to access full service catalog
            </span>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }

        /* hover states driven by CSS for instant border feedback */
        .s-card:hover {
          border-color: transparent !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.3) !important;
        }
        .s-card:hover .s-card-border {
          border-color: rgba(99,102,241,0.5) !important;
        }
        .s-card:hover .s-icon {
          background: rgba(99,102,241,0.15) !important;
          border-color: rgba(99,102,241,0.4) !important;
          box-shadow: 0 0 20px rgba(99,102,241,0.2) !important;
        }
      `}</style>
    </section>

    <LoginModal
      isOpen={loginOpen}
      onClose={() => setLoginOpen(false)}
      onSuccess={() => router.push('/services')}
      message="Sign in to access the full service catalog and add services to your quote."
    />
    </>
  );
}
