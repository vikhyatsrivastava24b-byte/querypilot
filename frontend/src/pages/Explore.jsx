import { Search, Compass, Code, ShoppingCart, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
  const navigate = useNavigate();

  const categories = [
    { name: 'Coding & Tech', icon: Code, color: '#3b82f6' },
    { name: 'Shopping & Reviews', icon: ShoppingCart, color: '#f59e0b' },
    { name: 'Business & Finance', icon: Briefcase, color: '#10b981' },
    { name: 'Academic Research', icon: GraduationCap, color: '#8b5cf6' }
  ];

  const templates = [
    { title: "Laptop Comparison", query: "Compare the best laptops under ₹1 lakh for software development.", cat: 1 },
    { title: "Tech Stack Evaluation", query: "Should we use Next.js or Remix for a high-traffic enterprise application?", cat: 0 },
    { title: "Market Competitor Analysis", query: "Analyze the top 3 CRM software tools for small businesses.", cat: 2 },
    { title: "Literature Review", query: "Summarize recent papers on the impact of LLMs on junior developers.", cat: 3 },
  ];

  return (
    <div style={{ padding: '48px 64px', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Compass className="text-accent" /> Explore Templates
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Start your research with curated, highly-optimized query templates.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '48px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categories.map((c, i) => (
          <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            <c.icon size={16} color={c.color} /> {c.name}
          </button>
        ))}
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Trending Research Templates</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {templates.map((t, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{t.title}</h3>
            <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic', marginBottom: '24px', flex: 1 }}>
              "{t.query}"
            </div>
            <button 
              onClick={() => navigate('/research', { state: { initialQuery: t.query } })}
              style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
