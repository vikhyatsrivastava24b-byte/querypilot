import { useState, useEffect } from 'react';
import { Bookmark, Folder, Search, Loader2 } from 'lucide-react';
import { getProjects } from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div style={{ padding: '48px 64px', maxWidth: '1200px', margin: '0 auto', width: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Your Projects</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your saved research workspaces.</p>
        </div>
        <button style={{ background: 'var(--accent)', color: 'white', padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
          + New Project
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
        <input 
          type="text" 
          placeholder="Search projects..." 
          style={{ width: '100%', padding: '16px 16px 16px 48px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}><Loader2 className="animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
          <Folder size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3>No projects found</h3>
          <p>Create a project to start saving your research.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {projects.map(p => (
            <div key={p.id} style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--accent)' }}>
                  <Bookmark size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{p.title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Last edited recently</span>
                </div>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Contains research notes, sources, and insight graphs.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
