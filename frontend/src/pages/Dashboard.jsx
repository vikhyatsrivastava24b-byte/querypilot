import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, History, Bookmark, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/research', { state: { initialQuery: query } });
    }
  };

  return (
    <div style={{ padding: '48px 64px', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Good evening</h1>
      <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px' }}>What are you researching today?</p>

      {/* Primary Input */}
      <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '64px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={24} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Should I buy a MacBook under ₹1 lakh for programming?"
            style={{
              width: '100%',
              padding: '24px 24px 24px 60px',
              fontSize: '18px',
              background: 'var(--bg-secondary)',
              border: '2px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxShadow: 'var(--shadow-sm)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Ctrl + Enter</span>
          </div>
        </div>
      </form>

      {/* Grid of cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Recent Queries */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <History size={18} style={{ color: 'var(--accent)' }} /> Recent Queries
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Best laptop for coding under 70k</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>React vs Vue for large scale enterprise apps</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>How to optimize PostgreSQL queries</div>
          </div>
        </div>

        {/* Active Projects */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Bookmark size={18} style={{ color: 'var(--success)' }} /> Active Projects
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>📁 AI in Education Research</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>📁 Tech Stack 2026 Comparison</div>
          </div>
        </div>

        {/* Analytics / Stats */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} style={{ color: 'var(--warning)' }} /> Weekly Insights
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>14</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Queries researched this week</div>
        </div>
      </div>
    </div>
  );
}
