import { NavLink } from 'react-router-dom';
import { Home, Compass, FolderClosed, Bookmark, History, BarChart2, Settings, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Projects', path: '/projects', icon: FolderClosed },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'History', path: '/history', icon: History },
    { name: 'Insights', path: '/insights', icon: BarChart2 },
  ];

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{ background: 'var(--accent)', padding: '6px', borderRadius: '8px', color: 'white' }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          QueryPilot
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => isActive ? 'active' : ''}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-light)' : 'transparent',
              transition: 'all 0.2s',
            })}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'transparent',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          Toggle Theme ({theme})
        </button>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 500,
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-light)' : 'transparent',
          })}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </div>
  );
}
