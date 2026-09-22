import { useState, useEffect } from 'react';
import { Database, Table, Columns, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { getSchema } from '../services/api';

export default function SchemaExplorer() {
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTables, setExpandedTables] = useState({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const data = await getSchema();
        setSchema(data.tables || []);
        
        // Expand first table by default
        if (data.tables?.length > 0) {
          setExpandedTables({ [data.tables[0].table]: true });
        }
      } catch (error) {
        console.error("Failed to load schema", error);
      }
      setLoading(false);
    };
    fetchSchema();
  }, []);

  const toggleTable = (tableName) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  return (
    <div className="pane" style={{ background: 'var(--bg-secondary)' }}>
      <div className="pane-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={14} style={{ color: 'var(--accent)' }} />
          Database Explorer
        </span>
      </div>
      
      <div className="pane-content" style={{ padding: '12px 0' }}>
        {loading ? (
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {schema.map((tableInfo) => (
              <div key={tableInfo.table}>
                {/* Table Row */}
                <button 
                  onClick={() => toggleTable(tableInfo.table)}
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {expandedTables[tableInfo.table] ? (
                    <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
                  ) : (
                    <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                  <Table size={14} style={{ color: 'var(--accent)' }} />
                  {tableInfo.table}
                </button>
                
                {/* Columns */}
                {expandedTables[tableInfo.table] && (
                  <div style={{ padding: '4px 0 8px 0' }}>
                    {tableInfo.columns.map(col => (
                      <div 
                        key={col}
                        style={{
                          padding: '4px 16px 4px 44px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <Columns size={12} style={{ color: 'var(--text-tertiary)' }} />
                        {col}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

