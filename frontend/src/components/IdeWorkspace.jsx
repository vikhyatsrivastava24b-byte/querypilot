import { useState, useEffect } from 'react';
import { Play, Code, Loader2 } from 'lucide-react';
import ResultsTable from './ResultsTable';
import ChartView from './ChartView';

export default function IdeWorkspace({ sql, onSqlChange, onRunSql, results, isExecuting }) {
  const [activeTab, setActiveTab] = useState('data');

  // Switch to chart automatically if chart is available and data was just loaded
  useEffect(() => {
    if (results && results.columns?.length >= 2) {
      const hasNumeric = results.rows?.some(row => row.some(cell => typeof cell === 'number'));
      if (hasNumeric) {
        setActiveTab('chart');
      } else {
        setActiveTab('data');
      }
    }
  }, [results]);

  const handleRun = () => {
    if (sql.trim() && !isExecuting) {
      onRunSql(sql);
    }
  };

  return (
    <div className="pane" style={{ background: 'var(--bg-primary)' }}>
      {/* Top Half: Editor */}
      <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid var(--border-color)' }}>
        <div className="pane-header">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={14} style={{ color: 'var(--accent)' }} />
            SQL Editor
          </span>
          <button
            onClick={handleRun}
            disabled={isExecuting || !sql.trim()}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: sql.trim() ? 'var(--success)' : 'var(--bg-tertiary)',
              color: 'white',
              border: 'none',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: sql.trim() && !isExecuting ? 'pointer' : 'not-allowed',
              opacity: isExecuting ? 0.7 : 1,
            }}
          >
            {isExecuting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            Run Query
          </button>
        </div>
        
        <div className="editor-container" style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={sql}
            onChange={(e) => onSqlChange(e.target.value)}
            spellCheck={false}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              padding: '20px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              color: '#e6edf3',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              whiteSpace: 'pre',
            }}
          />
        </div>
      </div>

      {/* Bottom Half: Results */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          padding: '0 16px'
        }}>
          {['data', 'chart'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              {tab === 'data' ? 'Data Table' : 'Visualization'}
            </button>
          ))}
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
          {isExecuting ? (
             <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                <Loader2 size={24} className="animate-spin" />
             </div>
          ) : !results ? (
             <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                Run a query to see results
             </div>
          ) : activeTab === 'data' ? (
            <ResultsTable columns={results.columns} rows={results.rows} />
          ) : (
            <ChartView columns={results.columns} rows={results.rows} />
          )}
        </div>
      </div>
    </div>
  );
}

