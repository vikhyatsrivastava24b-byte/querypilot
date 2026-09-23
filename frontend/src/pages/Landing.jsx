import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Database, LayoutTemplate } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles className="text-accent" /> QueryPilot
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '14px', fontWeight: 500 }}>
          <span style={{ cursor: 'pointer' }}>Product</span>
          <span style={{ cursor: 'pointer' }}>How it Works</span>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ 
              background: 'var(--text-primary)', color: 'var(--bg-primary)',
              padding: '8px 16px', borderRadius: 'var(--radius-full)', border: 'none',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '24px' }}>
          Ask Better. <br />
          <span className="gradient-text">Understand Deeper.</span>
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '48px', lineHeight: 1.6 }}>
          Turn vague questions into structured research and detailed, traceable insights.
        </p>

        {/* Demo Input Mockup */}
        <div 
          onClick={() => navigate('/dashboard')}
          style={{
            width: '100%', maxWidth: '700px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: 'var(--radius-xl)',
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'text', transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '18px', color: 'var(--text-tertiary)' }}>
            Find the best laptop under ₹70,000 for programming...
          </span>
          <div style={{ background: 'var(--accent)', color: 'white', padding: '10px', borderRadius: '50%', display: 'flex' }}>
            <ArrowRight size={20} />
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={{ display: 'flex', gap: '32px', marginTop: '80px', maxWidth: '1000px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { icon: Database, title: 'Query Intelligence', desc: 'Break down complex intents and structure the problem.' },
            { icon: LayoutTemplate, title: 'Three-Panel Workspace', desc: 'Compare sources and synthesize evidence side-by-side.' },
            { icon: Sparkles, title: 'Insight Graph', desc: 'Trace insights back to their original sources flawlessly.' }
          ].map((f, i) => (
            <div key={i} style={{ flex: '1', minWidth: '250px', background: 'var(--bg-secondary)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'left' }}>
              <f.icon size={28} style={{ color: 'var(--accent)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

