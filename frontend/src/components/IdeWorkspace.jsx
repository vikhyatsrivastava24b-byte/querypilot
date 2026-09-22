import { useState, useRef, useEffect } from 'react';
import { Play, Code, Loader2 } from 'lucide-react';
import ResultsTable from './ResultsTable';
import ChartView from './ChartView';

export default function IdeWorkspace({ sql, onSqlChange, onRunSql, results, isExecuting, onRequestFix }) {
  const [activeTab, setActiveTab] = useState('data');
  
  // Resizable Editor State
  const [editorHeight, setEditorHeight] = useState(300);
  const workspaceRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (results && results.columns?.length >= 2) {
      const hasNumericValue = results.rows?.some(row => row.slice(1).some(cell => typeof cell === 'number'));
      if (hasNumericValue) {
        setActiveTab('chart');
      } else {
        setActiveTab('data');
      }
    }
  }, [results]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !workspaceRef.current) return;
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const newHeight = Math.max(100, Math.min(e.clientY - workspaceRect.top, workspaceRect.height - 100));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleRun = () => {
    if (sql.trim() && !isExecuting) {
      onRunSql(sql);
    }
  };

  const startDrag = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'row-resize';
  };

  return (
    <div className="pane" ref={workspaceRef} style={{ background: 'var(--bg-primary)', flex: 1 }}>
      {/* Top Half: Editor */}
      <div style={{ height: editorHeight, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
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
          {isExecuting ? (
            <div style={{ padding: '20px', height: '100%' }}>
              <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '14px', width: '40%' }} />
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <div className="resizer-h" onMouseDown={startDrag} />

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
             <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton" style={{ height: '40px', width: '100%' }} />
                <div className="skeleton" style={{ height: '100%', width: '100%' }} />
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
