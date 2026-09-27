import { Clock, Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();

  const mockHistory = [
    { date: "Today", items: [
      { q: "Should I buy a MacBook under ₹1 lakh for programming?", intent: "Product Evaluation" },
      { q: "React vs Vue for large scale enterprise apps", intent: "Technical Comparison" }
    ]},
    { date: "Yesterday", items: [
      { q: "How to optimize PostgreSQL queries", intent: "Debugging & Optimization" },
      { q: "Best noise cancelling headphones for office", intent: "Shopping" }
    ]}
  ];

  return (
    <div style={{ padding: '48px 64px', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock className="text-accent" /> Research History
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Pick up exactly where you left off.</p>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '48px' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input 
          type="text" 
          placeholder="Search past queries..." 
          style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {mockHistory.map((group, i) => (
          <div key={i}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              {group.date}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {group.items.map((item, j) => (
                <div 
                  key={j} 
                  onClick={() => navigate('/research', { state: { initialQuery: item.q } })}
                  style={{ background: 'var(--bg-secondary)', padding: '20px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                >
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>"{item.q}"</h4>
                    <span style={{ fontSize: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '4px 8px', borderRadius: '4px' }}>
                      {item.intent}
                    </span>
                  </div>
                  <ArrowRight size={20} color="var(--text-tertiary)" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
