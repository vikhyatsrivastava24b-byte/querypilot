import { Database, Sparkles, Table, BarChart3, MessageSquare, Zap } from 'lucide-react';

export default function WelcomeScreen({ onSuggestionClick, suggestions }) {
  const features = [
    { icon: <MessageSquare size={20} />, title: 'Natural Language', desc: 'Ask questions in plain English' },
    { icon: <Database size={20} />, title: 'SQL Generation', desc: 'Auto-generates validated SQL' },
    { icon: <Table size={20} />, title: 'Data Tables', desc: 'Sortable, paginated results' },
    { icon: <BarChart3 size={20} />, title: 'Visualizations', desc: 'Auto-generated charts' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      flex: 1,
    }}>
      {/* Logo */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
      }}>
        <Sparkles size={30} color="white" />
      </div>

      <h2 style={{
        fontSize: '28px',
        fontWeight: 800,
        color: 'var(--text-primary)',
        marginBottom: '8px',
      }}>
        Welcome to QueryPilot
      </h2>
      <p style={{
        fontSize: '15px',
        color: 'var(--text-secondary)',
        marginBottom: '36px',
        textAlign: 'center',
        maxWidth: '460px',
        lineHeight: '1.6',
      }}>
        Ask questions about your business data in plain English.
        I'll generate SQL, run it, and show you the results.
      </p>

      {/* Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '36px',
        maxWidth: '460px',
        width: '100%',
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            transition: 'all 0.2s',
          }}>
            <div style={{ color: 'var(--accent)', marginBottom: '8px' }}>
              {feature.icon}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
              {feature.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              {feature.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div style={{ maxWidth: '520px', width: '100%' }}>
        <p style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Zap size={12} />
          Try asking
        </p>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {suggestions?.slice(0, 6).map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
                lineHeight: '1.4',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent-light)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              → {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

