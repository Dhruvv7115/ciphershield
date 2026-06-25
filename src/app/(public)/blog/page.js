'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


const blogPosts = [
  {
    id: 1,
    title: 'Zero-Trust Architecture: Why Every Enterprise Needs It in 2025',
    excerpt: 'The perimeter is dead. Learn how zero-trust architecture fundamentally changes how organizations approach cybersecurity — and why legacy models leave you vulnerable.',
    category: 'Cybersecurity',
    date: 'May 8, 2025',
    readTime: '8 min read',
    author: { name: 'Aritaro Research', avatar: 'A' },
    featured: true,
    color: '#A855F7',
    image: null,
  },
  {
    id: 2,
    title: 'How AI Agents Are Replacing Traditional Business Workflows',
    excerpt: 'From invoice processing to customer onboarding, AI agents are automating complex multi-step workflows. Here\'s what that means for your bottom line.',
    category: 'AI & Automation',
    date: 'May 5, 2025',
    readTime: '6 min read',
    author: { name: 'Priya Sharma', avatar: 'P' },
    featured: true,
    color: '#6366F1',
    image: null,
  },
  {
    id: 3,
    title: 'The CISO\'s Guide to Penetration Testing: Red Team vs. Blue Team',
    excerpt: 'Understand the difference between offensive and defensive security testing approaches, and learn which methodology is right for your organization.',
    category: 'Cybersecurity',
    date: 'Apr 28, 2025',
    readTime: '10 min read',
    author: { name: 'Raj Malhotra', avatar: 'R' },
    featured: false,
    color: '#A855F7',
    image: null,
  },
  {
    id: 4,
    title: 'Building RAG-Powered Knowledge Assistants for Enterprise',
    excerpt: 'A deep dive into Retrieval-Augmented Generation architecture — how to build internal knowledge bots that actually work at scale.',
    category: 'AI & Automation',
    date: 'Apr 22, 2025',
    readTime: '12 min read',
    author: { name: 'Aritaro Engineering', avatar: 'A' },
    featured: false,
    color: '#6366F1',
    image: null,
  },
  {
    id: 5,
    title: 'Cloud Security Posture Management: A Practical Framework',
    excerpt: 'Misconfigured cloud infrastructure is responsible for 80% of breaches. Here\'s a practical CSPM framework to secure your AWS, Azure, and GCP environments.',
    category: 'Cloud Security',
    date: 'Apr 15, 2025',
    readTime: '9 min read',
    author: { name: 'Dev Patel', avatar: 'D' },
    featured: false,
    color: '#818CF8',
    image: null,
  },
  {
    id: 6,
    title: 'WhatsApp Chatbots: Converting 3x More Leads with Conversational AI',
    excerpt: 'Learn how enterprises are using intelligent WhatsApp chatbots to qualify leads, answer customer queries, and close deals — all on autopilot.',
    category: 'AI & Automation',
    date: 'Apr 10, 2025',
    readTime: '7 min read',
    author: { name: 'Sneha Gupta', avatar: 'S' },
    featured: false,
    color: '#6366F1',
    image: null,
  },
  {
    id: 7,
    title: 'Incident Response Playbook: The First 72 Hours After a Breach',
    excerpt: 'When a security incident occurs, every minute counts. This battle-tested playbook covers the critical steps from detection to recovery.',
    category: 'Cybersecurity',
    date: 'Apr 3, 2025',
    readTime: '11 min read',
    author: { name: 'Aritaro SOC Team', avatar: 'A' },
    featured: false,
    color: '#A855F7',
    image: null,
  },
  {
    id: 8,
    title: 'Next.js 16 and the Future of Enterprise Web Applications',
    excerpt: 'The latest Next.js release brings server components, improved caching, and better DX. Here\'s what it means for enterprise web development.',
    category: 'Development',
    date: 'Mar 28, 2025',
    readTime: '6 min read',
    author: { name: 'Vikram Singh', avatar: 'V' },
    featured: false,
    color: '#818CF8',
    image: null,
  },
];

const blogCategories = ['All', 'Cybersecurity', 'AI & Automation', 'Cloud Security', 'Development'];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory);

  const featuredPosts = filtered.filter((p) => p.featured);
  const regularPosts = filtered.filter((p) => !p.featured);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>


      {/* Hero */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 48px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />

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
            }}>INSIGHTS & RESEARCH</span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            The Aritaro{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Blog</span>
          </h1>

          <p style={{
            maxWidth: 540, margin: '0 auto',
            color: 'var(--text-muted)',
            fontSize: 16, lineHeight: 1.75,
          }}>
            Expert insights on cybersecurity, AI automation, and enterprise technology
            from our research team and industry leaders.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 24px 40px',
        display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap',
      }}>
        {blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: 100,
              border: activeCategory === cat ? '1px solid var(--cta)' : '1px solid var(--border-subtle)',
              background: activeCategory === cat ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: activeCategory === cat ? 'var(--cta)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = 'var(--cta)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
            onMouseLeave={(e) => { if (activeCategory !== cat) { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
          >{cat}</button>
        ))}
      </div>

      {/* Featured posts */}
      {featuredPosts.length > 0 && (
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 48px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 24,
          }} className="blog-featured-grid">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: '32px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = post.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
              >
                {/* Featured badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: `${post.color}15`,
                  border: `1px solid ${post.color}30`,
                  borderRadius: 100, padding: '4px 12px',
                  marginBottom: 20,
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: post.color,
                  }} />
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '1.5px',
                    color: post.color, fontFamily: 'var(--font-mono)',
                  }}>FEATURED</span>
                </div>

                <div style={{
                  display: 'flex', gap: 8, marginBottom: 14,
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: post.color,
                    background: `${post.color}12`,
                    padding: '3px 10px', borderRadius: 100,
                  }}>{post.category}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.date}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.readTime}</span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(18px, 2.5vw, 24px)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                  marginBottom: 12,
                }}>{post.title}</h2>

                <p style={{
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: 20,
                }}>{post.excerpt}</p>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${post.color}, ${post.color}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>{post.author.avatar}</div>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{post.author.name}</span>
                </div>

                {/* Decorative gradient line */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${post.color}60, transparent)`,
                  opacity: 0.6,
                }} />
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Regular posts grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        {regularPosts.length > 0 && (
          <>
            <h3 style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: '1px solid var(--border-subtle)',
            }}>Latest Articles</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 20,
            }}>
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = `${post.color}50`;
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: post.color,
                      background: `${post.color}10`,
                      padding: '3px 10px', borderRadius: 100,
                    }}>{post.category}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.readTime}</span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.35,
                    marginBottom: 10,
                  }}>{post.title}</h3>

                  <p style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    lineHeight: 1.7,
                    marginBottom: 16,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>{post.excerpt}</p>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: `linear-gradient(135deg, ${post.color}80, ${post.color}40)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 10, fontWeight: 700,
                      }}>{post.author.avatar}</div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.author.name}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            color: 'var(--text-muted)',
          }}>
            <p style={{ fontSize: 16, marginBottom: 8 }}>No articles found in this category.</p>
            <p style={{ fontSize: 14, opacity: 0.7 }}>Check back soon for new content!</p>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <section style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '64px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Stay ahead of threats
          </h2>
          <p style={{
            fontSize: 15,
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            marginBottom: 28,
          }}>
            Get weekly threat intelligence, AI insights, and security best practices
            delivered straight to your inbox.
          </p>
          <div style={{
            display: 'flex',
            gap: 10,
            maxWidth: 420,
            margin: '0 auto',
          }} className="newsletter-form">
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                fontSize: 14,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                outline: 'none',
                transition: 'border-color 0.2s',
                minWidth: 0,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--cta)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border-subtle)'; }}
            />
            <button className="btn-primary" style={{ padding: '12px 24px', fontSize: 14, flexShrink: 0 }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Back to home */}
      <div style={{
        textAlign: 'center',
        padding: '40px 24px',
        background: 'var(--bg-base)',
      }}>
        <Link href="/" style={{
          fontSize: 14, color: 'var(--text-muted)',
          textDecoration: 'none',
          padding: '12px 24px',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}>
          ← Back to Home
        </Link>
      </div>



      <style>{`
        @media (max-width: 860px) {
          .blog-featured-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .newsletter-form { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
