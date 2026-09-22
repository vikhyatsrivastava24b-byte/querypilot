import { useState, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Download, Settings2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#a855f7', '#ef4444', '#3b82f6', '#ec4899', '#f97316'];

function getInitialConfig(columns, rows) {
  if (!columns || !rows || rows.length === 0 || columns.length < 2) return null;

  // Find all numeric columns for Y-axis options
  const numericColumns = columns.slice(1).filter((_, index) =>
    rows.some(row => typeof row[index + 1] === 'number')
  );

  if (numericColumns.length === 0) return null;

  let type = 'bar';
  const labelCol = columns[0];
  const firstColSample = String(rows[0]?.[0] || '');
  const looksLikeDate = /\d{4}[-/]\d{2}/.test(firstColSample) ||
    /^\d{4}$/.test(firstColSample) ||
    labelCol.toLowerCase().includes('date') ||
    labelCol.toLowerCase().includes('month') ||
    labelCol.toLowerCase().includes('year');

  if (looksLikeDate || rows.length > 12) type = 'area';
  if (columns.length === 2 && rows.length <= 8 && rows.length >= 2 && !looksLikeDate) type = 'pie';

  return {
    type,
    xAxis: labelCol,
    yAxis: numericColumns[0]
  };
}

export default function ChartView({ columns, rows }) {
  const chartRef = useRef(null);
  
  const [userConfig, setUserConfig] = useState(null);
  
  const defaultConfig = useMemo(() => getInitialConfig(columns, rows), [columns, rows]);
  const config = userConfig || defaultConfig;

  const chartData = useMemo(() => {
    return rows.slice(0, 50).map(row => {
      const dataPoint = {};
      columns.forEach((col, index) => { dataPoint[col] = row[index]; });
      return dataPoint;
    });
  }, [columns, rows]);

  const numericColumns = useMemo(() => {
    if (!columns || !rows) return [];
    return columns.filter((_, index) =>
      rows.some(row => typeof row[index] === 'number')
    );
  }, [columns, rows]);

  const categoricalColumns = useMemo(() => {
    if (!columns) return [];
    return columns; // Allow any column as X axis theoretically
  }, [columns]);

  if (!defaultConfig || !chartData.length || numericColumns.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        This query result cannot be visualized. (Requires at least one numeric column)
      </div>
    );
  }

  const handleExport = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#0d1117' });
      const link = document.createElement('a');
      link.download = 'querypilot-chart.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export chart', err);
    }
  };

  const renderChart = () => {
    const commonProps = { margin: { top: 10, right: 30, left: 10, bottom: 10 } };
    const tooltipStyle = {
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      color: 'var(--text-primary)',
      fontSize: '12px'
    };

    switch (config.type) {
      case 'area':
        return (
          <AreaChart data={chartData} {...commonProps}>
            <defs>
              <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey={config.xAxis} stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey={config.yAxis} stroke={COLORS[0]} fillOpacity={1} fill="url(#colorY)" />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart data={chartData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey={config.xAxis} stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={config.yAxis} stroke={COLORS[1]} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
            <Pie
              data={chartData}
              dataKey={config.yAxis}
              nameKey={config.xAxis}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={chartData} {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey={config.xAxis} stroke="var(--text-tertiary)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'var(--bg-hover)' }} />
            <Bar dataKey={config.yAxis} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Config Toolbar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingBottom: '12px',
        marginBottom: '12px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Settings2 size={16} style={{ color: 'var(--text-tertiary)' }} />
          
          <select 
            value={config.type} 
            onChange={e => setUserConfig({ ...config, type: e.target.value })}
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}
          >
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Donut Chart</option>
          </select>

          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>X:</span>
          <select 
            value={config.xAxis} 
            onChange={e => setUserConfig({ ...config, xAxis: e.target.value })}
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}
          >
            {categoricalColumns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>

          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Y:</span>
          <select 
            value={config.yAxis} 
            onChange={e => setUserConfig({ ...config, yAxis: e.target.value })}
            style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}
          >
            {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
        
        <button
          onClick={handleExport}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            border: '1px solid var(--border-color)', borderRadius: '4px',
            padding: '6px 10px', fontSize: '12px', cursor: 'pointer'
          }}
        >
          <Download size={14} /> Export PNG
        </button>
      </div>

      {/* Chart Canvas */}
      <div ref={chartRef} style={{ flex: 1, position: 'relative', padding: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
