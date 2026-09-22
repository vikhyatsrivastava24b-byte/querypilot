import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Lightbulb, Loader2, Copy, Check } from 'lucide-react';
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
      } catch {
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
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-xs)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 14px',
        background: 'var(--bg-tertiary)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '11px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'var(--text-tertiary)',
        }}>
          <Code size={13} />
          Generated SQL
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplain}
            disabled={loadingExplanation}
            style={{
              padding: '5px 12px', fontSize: '11px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: showExplanation ? 'var(--accent-light)' : 'var(--bg-primary)',
              color: showExplanation ? 'var(--accent)' : 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            {loadingExplanation ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={11} />
              </motion.div>
            ) : (
              <Lightbulb size={11} />
            )}
            {showExplanation ? 'Hide' : 'Explain'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            style={{
              padding: '5px 12px', fontSize: '11px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              background: copied ? 'var(--success-light)' : 'var(--bg-primary)',
              color: copied ? 'var(--success)' : 'var(--text-secondary)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
              fontWeight: 600, transition: 'all 0.2s',
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check size={11} />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy size={11} />
                </motion.span>
              )}
            </AnimatePresence>
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
      </div>

      {/* SQL Code */}
      <pre style={{
        padding: '16px 18px', margin: 0,
        background: 'var(--bg-code)',
        color: '#a5d6ff',
        fontSize: '13px', lineHeight: '1.7',
        overflowX: 'auto',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontWeight: 500,
      }}>
        <code>{sql}</code>
      </pre>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '16px 18px',
              background: 'var(--accent-light)',
              borderTop: '1px solid var(--border-color)',
              fontSize: '13px', lineHeight: '1.8',
              color: 'var(--text-primary)', whiteSpace: 'pre-wrap',
            }}>
              <div style={{
                fontWeight: 700, marginBottom: '10px',
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                <Lightbulb size={13} style={{ color: 'var(--accent)' }} />
                <span className="gradient-text">Explanation</span>
              </div>
              {explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
