import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, BarChart3, Download, MessageSquare, Database, Clock, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from 'lucide-react';
import ResultsTable from './ResultsTable';
import ChartView from './ChartView';
import SQLDisplay from './SQLDisplay';
import { exportCSV } from '../services/api';

/* Typewriter component for NL answers */
function TypewriterText({ text, speed = 15 }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!done && <span className="typewriter-cursor" />}
    </span>
  );
}

export default function ChatMessage({ message }) {
  const [activeTab, setActiveTab] = useState('table');
  const [showSQL, setShowSQL] = useState(false);

  if (message.type === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '6px 28px',
        }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            maxWidth: '70%',
            padding: '14px 20px',
            borderRadius: '20px 20px 4px 20px',
            background: 'var(--bg-user-msg)',
            color: 'var(--text-on-primary)',
            fontSize: '14px',
            lineHeight: '1.6',
            boxShadow: '0 4px 15px var(--accent-glow)',
            fontWeight: 500,
          }}
        >
          {message.content}
        </motion.div>
      </motion.div>
    );
  }

  if (message.type === 'loading') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '6px 28px',
        }}
      >
        <motion.div
          animate={{ boxShadow: ['var(--shadow-sm)', 'var(--shadow-glow)', 'var(--shadow-sm)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '18px 24px',
            borderRadius: '20px 20px 20px 4px',
            background: 'var(--bg-glass-strong)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', gap: '5px' }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
                style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Analyzing your question...
          </span>
        </motion.div>
      </motion.div>
    );
  }

  if (message.type === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '6px 28px',
        }}
      >
        <div style={{
          maxWidth: '85%',
          padding: '16px 20px',
          borderRadius: '20px 20px 20px 4px',
          background: 'var(--error-light)',
          border: '1px solid var(--error)',
          fontSize: '14px',
          color: 'var(--error)',
          boxShadow: 'var(--shadow-sm)',
          fontWeight: 500,
        }}>
          ⚠️ {message.content}
        </div>
      </motion.div>
    );
  }

  // AI response with results
  const { data } = message;
  const hasChart = data?.result?.columns?.length >= 2 &&
    data?.result?.rows?.some(row => row.some(cell => typeof cell === 'number'));

  const handleExport = () => {
    if (data?.result) {
      exportCSV(data.result.columns, data.result.rows, 'querypilot_results');
    }
  };

  const tabs = [
    { key: 'table', label: 'Table', icon: <Table size={14} /> },
    ...(hasChart ? [{ key: 'chart', label: 'Chart', icon: <BarChart3 size={14} /> }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '6px 28px',
      }}
    >
      <div style={{
        maxWidth: '92%',
        width: '100%',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-glass)',
        overflow: 'hidden',
      }}>
        {/* NL Answer with typewriter */}
        {data?.nl_answer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              padding: '20px 24px',
              fontSize: '14px',
              lineHeight: '1.7',
              color: 'var(--text-primary)',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              <Sparkles size={13} style={{ color: 'var(--accent)' }} />
              <span className="gradient-text">AI Answer</span>
            </div>
            <TypewriterText text={data.nl_answer} />
          </motion.div>
        )}

        {/* Meta badges */}
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '12px 24px',
          fontSize: '12px',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'var(--accent-light)', color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            <Database size={11} />
            {data?.tables_used?.join(', ')}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'var(--success-light)', color: 'var(--success)',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={11} />
            {data?.row_count} rows
          </motion.span>
          {data?.retry_count > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: 'var(--radius-full)',
                background: 'var(--warning-light)', color: 'var(--warning)',
                fontWeight: 600,
              }}
            >
              <Clock size={11} />
              {data.retry_count} retries
            </motion.span>
          )}
        </div>

        {/* SQL Toggle */}
        <div style={{ padding: '0 24px' }}>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => setShowSQL(!showSQL)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 0', fontSize: '13px',
              color: 'var(--text-secondary)', background: 'none',
              border: 'none', cursor: 'pointer', fontWeight: 600,
            }}
          >
            <motion.span animate={{ rotate: showSQL ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} />
            </motion.span>
            {showSQL ? 'Hide SQL' : 'Show SQL'}
          </motion.button>

          <AnimatePresence>
            {showSQL && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden', paddingBottom: '12px' }}
              >
                <SQLDisplay sql={data?.sql} question={data?.question} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tab Bar */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
          position: 'relative',
        }}>
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ backgroundColor: 'var(--bg-hover)' }}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--text-tertiary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ backgroundColor: 'var(--bg-hover)' }}
            whileTap={{ scale: 0.96 }}
            onClick={handleExport}
            style={{
              padding: '12px 20px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--text-tertiary)',
              borderBottom: '2px solid transparent',
              transition: 'color 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Download size={14} /> CSV
          </motion.button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{ padding: '20px 24px' }}
          >
            {activeTab === 'table' && (
              <ResultsTable columns={data?.result?.columns} rows={data?.result?.rows} />
            )}
            {activeTab === 'chart' && (
              <ChartView columns={data?.result?.columns} rows={data?.result?.rows} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
