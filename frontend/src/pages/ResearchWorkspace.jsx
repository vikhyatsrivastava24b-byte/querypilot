import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Brain, Loader2, Target, HelpCircle, Globe, Play } from 'lucide-react';
import { analyzeResearch, executeSearch } from '../services/api';

export default function ResearchWorkspace() {
  const location = useLocation();
  const initialQuery = location.state?.initialQuery || "Should I buy a MacBook under ₹1 lakh for programming?";
  
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  
  // Search state
  const [isExecuting, setIsExecuting] = useState(false);
  const [sources, setSources] = useState([]);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    async function fetchAnalysis() {
      setAnalyzing(true);
      setError(null);
      try {
        const data = await analyzeResearch(initialQuery);
        setAnalysisData(data);
      } catch (err) {
        console.error("Analysis failed", err);
        setError("Failed to analyze query. Please try again.");
      } finally {
        setAnalyzing(false);
      }
    }
    
    if (initialQuery) {
      fetchAnalysis();
    }
  }, [initialQuery]);

  const handleExecuteResearch = async () => {
    if (!analysisData) return;
    setIsExecuting(true);
    setSearchError(null);
    try {
      const data = await executeSearch(analysisData.improved_query, analysisData.research_plan);
      setSources(data.sources);
    } catch (err) {
      console.error("Search failed", err);
      setSearchError("Failed to fetch live sources.");
    } finally {
      setIsExecuting(false);
    }
  };

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
          ) : error ? (
            <div style={{ color: 'var(--error)', padding: '16px', background: 'var(--error-light)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              {error}
            </div>
          ) : analysisData ? (
            <>
              {/* Intent Analysis */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px' }}>
                  <Brain size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Need Analysis</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Intent:</strong> {analysisData.understanding.intent}</div>
                  <div><strong>Topic:</strong> {analysisData.understanding.topic}</div>
                  {analysisData.understanding.budget && (
                    <div><strong>Constraints:</strong> {analysisData.understanding.budget}</div>
                  )}
                  <div style={{ marginTop: '8px', color: 'var(--text-primary)' }}>
                    {analysisData.understanding.purpose}
                  </div>
                </div>
              </div>

              {/* Missing Info */}
              <div style={{ border: '1px solid var(--warning-light)', background: 'var(--bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '12px' }}>
                  <HelpCircle size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Missing Context</span>
                </div>
                <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analysisData.missing_information.map((info, idx) => (
                    <li key={idx}>{info}</li>
                  ))}
                </ul>
              </div>

              {/* Improved Query */}
              <div style={{ border: '1px solid var(--accent)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '12px' }}>
                  <Target size={16} /> <span style={{ fontWeight: 600, fontSize: '14px' }}>Improved Query</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  "{analysisData.improved_query}"
                </div>
                <button 
                  onClick={handleExecuteResearch}
                  disabled={isExecuting}
                  style={{ width: '100%', background: isExecuting ? 'var(--bg-tertiary)' : 'var(--accent)', color: isExecuting ? 'var(--text-tertiary)' : 'white', border: 'none', padding: '8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: isExecuting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  {isExecuting ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} 
                  {isExecuting ? "Searching Web..." : "Execute Plan"}
                </button>
              </div>
            </>
          ) : null}
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
          {analyzing ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-tertiary)' }}>
              Generating custom research plan...
            </div>
          ) : analysisData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Research Plan</h1>
              <p style={{ color: 'var(--text-secondary)' }}>Based on the improved query, here is the structured plan to gather evidence.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysisData.research_plan.map((step, i) => (
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
              Waiting for research execution to begin...
            </div>
          ) : isExecuting ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px 0', alignItems: 'center', color: 'var(--text-tertiary)' }}>
              <Loader2 size={24} className="animate-spin" />
              <span style={{ fontSize: '13px' }}>Scouring the web for sources...</span>
            </div>
          ) : searchError ? (
            <div style={{ color: 'var(--error)', padding: '16px', background: 'var(--error-light)', borderRadius: 'var(--radius-md)', fontSize: '13px' }}>
              {searchError}
            </div>
          ) : sources.length > 0 ? (
            <>
              {sources.map((src, i) => (
                <a 
                  key={i} 
                  href={src.url} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', transition: 'border-color 0.2s', cursor: 'pointer' }}
                       onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                       onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Globe size={12} color="var(--accent)" />
                      <span style={{ fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', fontWeight: 700 }}>{src.type}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.4 }}>{src.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{src.domain}</div>
                  </div>
                </a>
              ))}
            </>
          ) : (
             <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', textAlign: 'center', padding: '24px' }}>
               Click "Execute Plan" to retrieve live sources.
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
