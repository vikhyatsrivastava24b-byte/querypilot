import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';

const COLORS = [
  '#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

const GRADIENTS = [
  { id: 'gradient-0', color: '#4f6ef7' },
  { id: 'gradient-1', color: '#10b981' },
  { id: 'gradient-2', color: '#f59e0b' },
];

function detectChartType(columns, rows) {
  if (!columns || !rows || rows.length === 0) return null;
  if (columns.length < 2) return null;

  // Check if ANY column after the first one is numeric
  const hasNumeric = rows.some(row => row.slice(1).some(cell => typeof cell === 'number'));
  if (!hasNumeric) return null;

  if (columns.length === 2 && rows.length <= 8 && rows.length >= 2) return 'pie';

  const firstColSample = String(rows[0]?.[0] || '');
  const looksLikeDate = /\d{4}[-/]\d{2}/.test(firstColSample) ||
    /^\d{4}$/.test(firstColSample) ||
    columns[0]?.toLowerCase().includes('date') ||
    columns[0]?.toLowerCase().includes('month') ||
    columns[0]?.toLowerCase().includes('year');

  if (looksLikeDate || rows.length > 12) return 'area';

  return 'bar';
}

function prepareChartData(columns, rows) {
  return rows.slice(0, 30).map(row => {
    const dataPoint = {};
    columns.forEach((col, index) => { dataPoint[col] = row[index]; });
    return dataPoint;
  });
}

export default function ChartView({ columns, rows }) {
  const chartType = useMemo(() => detectChartType(columns, rows), [columns, rows]);
  const chartData = useMemo(() => prepareChartData(columns, rows), [columns, rows]);

  const numericColumns = useMemo(() => {
    if (!columns || !rows) return [];
    return columns.slice(1).filter((_, index) =>
      rows.some(row => typeof row[index + 1] === 'number')
    );
  }, [columns, rows]);

  if (!chartType || !chartData.length || numericColumns.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        This query result cannot be visualized. (Requires at least one numeric column)
      </div>
    );
  }

  const labelKey = columns[0];

  const commonProps = { margin: { top: 10, right: 30, left: 10, bottom: 10 } };
  const tooltipStyle = {
    backgroundColor: 'var(--bg-glass-strong)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    fontSize: '12px',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-md)',
    backdropFilter: 'blur(12px)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(8px)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{
        fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: '16px',
        display: 'flex', alignItems: 'center', gap: '6px',
      }}>
        <span className="gradient-text">📊 Visualization</span>
        <span style={{
          fontSize: '10px', padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--accent-light)',
          color: 'var(--accent)', fontWeight: 700,
        }}>
          {chartType.toUpperCase()}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false}
              angle={chartData.length > 6 ? -45 : 0} textAnchor={chartData.length > 6 ? 'end' : 'middle'}
              height={chartData.length > 6 ? 80 : 40} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--accent-light)' }} />
            <Legend />
            {numericColumns.map((col, index) => (
              <Bar key={col} dataKey={col} fill={COLORS[index % COLORS.length]} radius={[6, 6, 0, 0]}
                animationDuration={800} animationEasing="ease-out" />
            ))}
          </BarChart>
        ) : chartType === 'area' ? (
          <AreaChart data={chartData} {...commonProps}>
            <defs>
              {GRADIENTS.map(g => (
                <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={g.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={g.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey={labelKey} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            {numericColumns.map((col, index) => (
              <Area key={col} type="monotone" dataKey={col} stroke={COLORS[index % COLORS.length]} strokeWidth={2.5}
                fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
                animationDuration={1200} animationEasing="ease-out" />
            ))}
          </AreaChart>
        ) : (
          <PieChart {...commonProps}>
            <Pie data={chartData} dataKey={numericColumns[0]} nameKey={labelKey}
              cx="50%" cy="50%" innerRadius={55} outerRadius={110} paddingAngle={3}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true} animationDuration={1000} animationEasing="ease-out">
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
}
