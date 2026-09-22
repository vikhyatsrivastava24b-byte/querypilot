import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Brain, Loader2, Target, HelpCircle, FileText, Globe, CheckCircle2 } from 'lucide-react';

export default function ResearchWorkspace() {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || "Should I buy a MacBook under ₹1 lakh for programming?";
  
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden' }}>
      
      {/* Panel 1: Query Intelligence (Left) */}
      <div style={{ 
        width: '350px', 
        borderRight: '1px solid var(--border-color)', 
        background: 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Query Intelligence
          </h2>
        </div>
        
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Original */}
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Original Query</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>"{initialQuery}"</div>
          </div>

          {analyzing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 0', alignItems: 'center', color: 'var(--text-tertiary)' }}>
              <Loader2 size={24} className="animate-spin" />
              <span style={{ fontSize: '13px' }}>Analyzing underlying objective...</span>
            </div>
          ) : (
            <>
              {/* Intent Analysis */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px' }}>
                  <Brain size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Need Analysis</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Intent:</strong> Product Evaluation</div>
                  <div><strong>Topic:</strong> Laptop / Programming</div>
                  <div><strong>Budget:</strong> ₹1,00,000</div>
                  <div style={{ marginTop: '8px', color: 'var(--text-primary)' }}>
                    Evaluating if a MacBook fits programming workflows within a strict budget constraint.
                  </div>
                </div>
              </div>

              {/* Missing Info */}
              <div style={{ border: '1px solid var(--warning-light)', background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '12px' }}>
                  <HelpCircle size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Missing Context</span>
                </div>
                <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Type of programming? (Web, Mobile, AI)</li>
                  <li>Need for Docker / VMs?</li>
                  <li>Requirement for external monitors?</li>
                </ul>
              </div>

              {/* Improved Query */}
              <div style={{ border: '1px solid var(--accent)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px' }}>
                  <Target size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Improved Query</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  "Evaluate M-series MacBooks under ₹1,00,000 for software development. Compare CPU performance, RAM limits (8GB vs 16GB), Docker compatibility, and long-term value against Windows alternatives."
                </div>
                <button style={{ width: '100%', background: 'var(--accent)', color: 'white', border: 'none', padding: '8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Search size={14} /> Start Research
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Panel 2: Main Research (Center) */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-primary)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '24px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)', borderBottom: '2px solid var(--accent)', paddingBottom: '16px', marginBottom: '-17px' }}>Research Plan</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)', cursor: 'not-allowed' }}>Evidence Comparison</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-tertiary)', cursor: 'not-allowed' }}>Final Brief</span>
        </div>
        
        <div style={{ padding: '32px 48px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          {!analyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Research Plan</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Based on the improved query, here is the structured plan to gather evidence.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Identify available MacBook models under ₹1L (e.g., M2 Air 8GB, M1 Air).',
                  'Analyze RAM constraints (8GB) for local development and Docker.',
                  'Check developer-tool and IDE native Apple Silicon compatibility.',
                  'Evaluate battery life and thermal throttling under load.',
                  'Compare long-term value against Windows laptops (e.g., ThinkPad, XPS) at ₹1L.'
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel 3: Sources (Right) */}
      <div style={{ 
        width: '300px', 
        borderLeft: '1px solid var(--border-color)', 
        background: 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sources
          </h2>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analyzing ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
              Waiting for research to start...
            </div>
          ) : (
            <>
              {[
                { title: 'MacBook Air M2 for Developers in 2024', domain: 'reddit.com/r/macprogramming', type: 'Community' },
                { title: '8GB vs 16GB RAM for Software Engineering', domain: 'youtube.com', type: 'Review' },
                { title: 'Apple Silicon Docker Support Status', domain: 'docs.docker.com', type: 'Official' }
              ].map((src, i) => (
                <div key={i} style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Globe size={12} color="var(--text-tertiary)" />
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{src.type}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>{src.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-link)' }}>{src.domain}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

    </div>
  );
}
