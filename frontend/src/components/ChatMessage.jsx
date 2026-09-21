import { useState } from 'react';
import { Table, BarChart3, Download, MessageSquare, Database, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import ResultsTable from './ResultsTable';
import ChartView from './ChartView';
import SQLDisplay from './SQLDisplay';
import { exportCSV } from '../services/api';

export default function ChatMessage({ message }) {
  const [activeTab, setActiveTab] = useState('table');
  const [showSQL, setShowSQL] = useState(false);

  if (message.type === 'user') {
    return (
      <div className="animate-fade-in-up" style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '4px 24px',
      }}>
        <div style={{
          maxWidth: '70%',
          padding: '12px 18px',
          borderRadius: '18px 18px 4px 18px',
          backgroundColor: 'var(--bg-user-msg)',
          color: 'var(--text-on-primary)',
          fontSize: '14px',
          lineHeight: '1.5',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  if (message.type === 'loading') {
    return (
      <div className="animate-fade-in-up" style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '4px 24px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderRadius: '18px 18px 18px 4px',
          backgroundColor: 'var(--bg-ai-msg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
            <div className="typing-dot" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Analyzing your question...
          </span>
        </div>
      </div>
    );
  }

  if (message.type === 'error') {
    return (
      <div className="animate-fade-in-up" style={{
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '4px 24px',
      }}>
        <div style={{
          maxWidth: '85%',
          padding: '14px 18px',
          borderRadius: '18px 18px 18px 4px',
          backgroundColor: 'var(--bg-ai-msg)',
          border: '1px solid var(--error)',
          fontSize: '14px',
          color: 'var(--error)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          ⚠️ {message.content}
        </div>
      </div>
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

  return (
    <div className="animate-fade-in-up" style={{
      display: 'flex',
      justifyContent: 'flex-start',
      padding: '4px 24px',
    }}>
      <div style={{
        maxWidth: '90%',
        width: '100%',
        borderRadius: '18px 18px 18px 4px',
        backgroundColor: 'var(--bg-ai-msg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        {/* NL Answer */}
        {data?.nl_answer && (
          <div style={{
            padding: '16px 20px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <MessageSquare size={14} />
              Answer
            </div>
            {data.nl_answer}
          </div>
        )}

        {/* Meta Info */}
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '10px 20px',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          borderBottom: '1px solid var(--border-color)',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Database size={12} />
            {data?.tables_used?.join(', ')}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Table size={12} />
            {data?.row_count} rows
          </span>
          {data?.retry_count > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
              <Clock size={12} />
              {data.retry_count} retries
            </span>
          )}
        </div>

        {/* SQL Toggle */}
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={() => setShowSQL(!showSQL)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 0',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {showSQL ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showSQL ? 'Hide SQL' : 'Show SQL'}
          </button>

          {showSQL && (
            <div style={{ paddingBottom: '12px' }}>
              <SQLDisplay sql={data?.sql} question={data?.question} />
            </div>
          )}
        </div>

        {/* Tab Bar */}
        <div style={{
          display: 'flex',
          gap: '0',
          borderTop: '1px solid var(--border-color)',
          borderBottom: '1px solid var(--border-color)',
        }}>
          <button
            onClick={() => setActiveTab('table')}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'table' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
              color: activeTab === 'table' ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'table' ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <Table size={14} /> Table
          </button>
          {hasChart && (
            <button
              onClick={() => setActiveTab('chart')}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'chart' ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                color: activeTab === 'chart' ? 'var(--accent)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'chart' ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              <BarChart3 size={14} /> Chart
            </button>
          )}
          <button
            onClick={handleExport}
            style={{
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              borderBottom: '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <Download size={14} /> Export
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '16px 20px' }}>
          {activeTab === 'table' && (
            <ResultsTable columns={data?.result?.columns} rows={data?.result?.rows} />
          )}
          {activeTab === 'chart' && (
            <ChartView columns={data?.result?.columns} rows={data?.result?.rows} />
          )}
        </div>
      </div>
    </div>
  );
}

