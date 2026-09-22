import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Clock, Database, Trash2, X, Search } from 'lucide-react';
import { getQueryHistory, clearHistory } from '../services/api';

export default function Sidebar({ isOpen, onClose, onSelectQuery }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getQueryHistory();
      setHistory(data.queries || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const filtered = history.filter(item =>
    search ? item.question.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, left: 0, bottom: 0,
              width: '360px',
              background: 'var(--bg-glass-strong)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: '1px solid var(--border-color)',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 22px',
              borderBottom: '1px solid var(--border-color)',
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '17px', fontWeight: 800,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)',
                }}>
                  <History size={18} />
                </div>
                <span className="gradient-text">History</span>
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {history.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClear}
                    style={{
                      padding: '7px', borderRadius: 'var(--radius-sm)',
                      border: 'none', background: 'var(--error-light)',
                      color: 'var(--error)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center',
                    }}
                    title="Clear history"
                  >
                    <Trash2 size={15} />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    padding: '7px', borderRadius: 'var(--radius-sm)',
                    border: 'none', background: 'var(--bg-tertiary)',
                    color: 'var(--text-tertiary)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: '12px 16px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-input)',
              }}>
                <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search queries..."
                  style={{
                    border: 'none', background: 'transparent',
                    color: 'var(--text-primary)', fontSize: '13px',
                    outline: 'none', width: '100%', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* History List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ padding: '50px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Clock size={44} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                  </motion.div>
                  <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
                    {search ? 'No matching queries' : 'No queries yet'}
                  </p>
                  <p style={{ fontSize: '12px' }}>
                    {search ? 'Try a different search' : 'Your query history will appear here'}
                  </p>
                </motion.div>
              ) : (
                filtered.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ x: 4, backgroundColor: 'var(--bg-hover)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectQuery(item.question);
                      onClose();
                    }}
                    style={{
                      width: '100%', padding: '14px 16px',
                      marginBottom: '4px', borderRadius: 'var(--radius-md)',
                      border: 'none', background: 'transparent',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{
                      fontSize: '13px', fontWeight: 600,
                      color: 'var(--text-primary)', lineHeight: '1.5',
                      marginBottom: '8px',
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {item.question}
                    </div>
                    <div style={{
                      display: 'flex', gap: '10px',
                      fontSize: '11px', color: 'var(--text-tertiary)',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Database size={10} />
                        {item.tables_used?.join(', ')}
                      </span>
                      <span>{item.row_count} rows</span>
                      <span style={{ marginLeft: 'auto' }}>{formatTime(item.timestamp)}</span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
