import { useState, useEffect } from 'react';
import { History, Clock, Database, Trash2, X, ChevronLeft } from 'lucide-react';
import { getQueryHistory, clearHistory } from '../services/api';

export default function Sidebar({ isOpen, onClose, onSelectQuery }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (isOpen) {
      fetchHistory();
    }
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 40,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '340px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        zIndex: 50,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isOpen ? 'var(--shadow-lg)' : 'none',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}>
            <History size={20} />
            Query History
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                style={{
                  padding: '6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear history"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '6px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* History List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px',
        }}>
          {loading ? (
            <div style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
              fontSize: '14px',
            }}>
              Loading...
            </div>
          ) : history.length === 0 ? (
            <div style={{
              padding: '40px 24px',
              textAlign: 'center',
              color: 'var(--text-tertiary)',
            }}>
              <Clock size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px', fontWeight: 500 }}>No queries yet</p>
              <p style={{ fontSize: '12px', marginTop: '4px' }}>
                Your query history will appear here
              </p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectQuery(item.question);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  marginBottom: '4px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: '1.4',
                  marginBottom: '6px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {item.question}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Database size={10} />
                    {item.tables_used?.join(', ')}
                  </span>
                  <span>{item.row_count} rows</span>
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}

