import { useState } from 'react';
import { Code, ChevronDown, ChevronUp, Lightbulb, Loader2 } from 'lucide-react';
import { explainSQL } from '../services/api';

export default function SQLDisplay({ sql, question }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleExplain = async () => {
    if (showExplanation && explanation) {
      setShowExplanation(false);
      return;
    }

    if (!explanation) {
      setLoadingExplanation(true);
      try {
        const result = await explainSQL(sql, question);
        setExplanation(result.explanation);
      } catch (error) {
        setExplanation('Unable to generate explanation.');
      }
      setLoadingExplanation(false);
    }

    setShowExplanation(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <Code size={14} />
          Generated SQL
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExplain}
            disabled={loadingExplanation}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            {loadingExplanation ? (
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Lightbulb size={12} />
            )}
            {showExplanation ? 'Hide' : 'Explain'}
          </button>
          <button
            onClick={handleCopy}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* SQL Code */}
      <pre style={{
        padding: '14px 16px',
        margin: 0,
        backgroundColor: 'var(--bg-code)',
        color: '#e2e8f0',
        fontSize: '13px',
        lineHeight: '1.6',
        overflowX: 'auto',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      }}>
        <code>{sql}</code>
      </pre>

      {/* Explanation */}
      {showExplanation && explanation && (
        <div style={{
          padding: '14px 16px',
          backgroundColor: 'var(--accent-light)',
          borderTop: '1px solid var(--border-color)',
          fontSize: '13px',
          lineHeight: '1.7',
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
        }}>
          <div style={{
            fontWeight: 600,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent)',
          }}>
            <Lightbulb size={14} />
            Explanation
          </div>
          {explanation}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

