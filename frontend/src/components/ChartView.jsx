import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

function detectChartType(columns, rows) {
  if (!columns || !rows || rows.length === 0) return null;
  if (columns.length < 2) return null;

  const hasNumericSecondCol = rows.some(row => typeof row[1] === 'number');
  if (!hasNumericSecondCol) return null;

  // Pie chart: 2 columns, <=8 rows, one is categorical one is numeric
  if (columns.length === 2 && rows.length <= 8 && rows.length >= 2) {
    return 'pie';
  }

  // Line chart: if first column looks like dates or has many data points
  const firstColSample = String(rows[0]?.[0] || '');
  const looksLikeDate = /\d{4}[-/]\d{2}/.test(firstColSample) ||
    /^\d{4}$/.test(firstColSample) ||
    columns[0]?.toLowerCase().includes('date') ||
    columns[0]?.toLowerCase().includes('month') ||
    columns[0]?.toLowerCase().includes('year');

  if (looksLikeDate || rows.length > 12) {
    return 'line';
  }

  return 'bar';
}

function prepareChartData(columns, rows) {
  return rows.slice(0, 30).map(row => {
    const dataPoint = {};
    columns.forEach((col, index) => {
      dataPoint[col] = row[index];
    });
    return dataPoint;
  });
}

export default function ChartView({ columns, rows }) {
  const chartType = useMemo(() => detectChartType(columns, rows), [columns, rows]);
  const chartData = useMemo(() => prepareChartData(columns, rows), [columns, rows]);

  if (!chartType || !chartData.length) {
    return null;
  }

  const labelKey = columns[0];
  const numericColumns = columns.slice(1).filter((_, index) =>
    rows.some(row => typeof row[index + 1] === 'number')
  );

  if (numericColumns.length === 0) return null;

  const commonProps = {
    margin: { top: 10, right: 30, left: 10, bottom: 10 },
  };

  const tooltipStyle = {
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '12px',
    color: 'var(--text-primary)',
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '12px',
      }}>
        📊 Visualization
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'bar' ? (
          <BarChart data={chartData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey={labelKey}
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickLine={false}
              angle={chartData.length > 6 ? -45 : 0}
              textAnchor={chartData.length > 6 ? 'end' : 'middle'}
              height={chartData.length > 6 ? 80 : 40}
            />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            {numericColumns.map((col, index) => (
              <Bar
                key={col}
                dataKey={col}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey={labelKey}
              tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            {numericColumns.map((col, index) => (
              <Line
                key={col}
                type="monotone"
                dataKey={col}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <PieChart {...commonProps}>
            <Pie
              data={chartData}
              dataKey={numericColumns[0]}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={true}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

