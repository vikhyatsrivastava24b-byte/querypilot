import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResultsTable({ columns, rows }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  if (!columns || !rows || rows.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: '40px', textAlign: 'center',
          color: 'var(--text-tertiary)', fontSize: '14px',
        }}
      >
        No results found
      </motion.div>
    );
  }

  const sortedRows = [...rows].sort((a, b) => {
    if (sortColumn === null) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    if (aVal === bVal) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    const comparison = typeof aVal === 'number'
      ? aVal - bVal
      : String(aVal).localeCompare(String(bVal));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = sortedRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleSort = (index) => {
    if (sortColumn === index) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(index);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const formatCell = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ width: '100%' }}
    >
      <div style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xs)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleSort(index)}
                  style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontWeight: 700, fontSize: '11px',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    color: sortColumn === index ? 'var(--accent)' : 'var(--text-tertiary)',
                    background: 'var(--bg-tertiary)',
                    borderBottom: '2px solid var(--border-color)',
                    cursor: 'pointer', userSelect: 'none',
                    whiteSpace: 'nowrap', transition: 'color 0.2s',
                    position: 'sticky', top: 0,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {col}
                    {sortColumn === index ? (
                      sortDirection === 'asc'
                        ? <ChevronUp size={13} />
                        : <ChevronDown size={13} />
                    ) : (
                      <ArrowUpDown size={11} style={{ opacity: 0.25 }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.02 }}
                style={{
                  background: rowIndex % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = rowIndex % 2 === 0 ? 'transparent' : 'var(--bg-secondary)'}
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    style={{
                      padding: '11px 16px',
                      borderBottom: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: typeof cell === 'number' ? 'tabular-nums' : 'normal',
                      fontWeight: typeof cell === 'number' ? 500 : 400,
                    }}
                  >
                    {formatCell(cell)}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 0', fontSize: '12px', color: 'var(--text-tertiary)',
        }}>
          <span style={{ fontWeight: 500 }}>
            Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, rows.length)} of {rows.length}
          </span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <motion.button
              whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-primary)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px', display: 'flex', alignItems: 'center',
                fontWeight: 600,
              }}
            >
              <ChevronLeft size={14} />
            </motion.button>

            <span style={{ padding: '0 8px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {currentPage} / {totalPages}
            </span>

            <motion.button
              whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-primary)',
                color: currentPage === totalPages ? 'var(--text-tertiary)' : 'var(--text-primary)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '12px', display: 'flex', alignItems: 'center',
                fontWeight: 600,
              }}
            >
              <ChevronRight size={14} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
