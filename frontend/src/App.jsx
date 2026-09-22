import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import SchemaExplorer from './components/SchemaExplorer';
import IdeWorkspace from './components/IdeWorkspace';
import AIChatPanel from './components/AIChatPanel';
import { queryDatabase, executeRawSql } from './services/api';

function AppContent() {
  const [activeSql, setActiveSql] = useState('');
  const [results, setResults] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Resizable Panes State
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [chatWidth, setChatWidth] = useState(340);
  const appRef = useRef(null);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  useEffect(() => {
    setChatMessages([
      { 
        id: 'welcome', 
        type: 'ai', 
        content: 'Hi! I am your AI Data Assistant. Ask me a question about your business, and I will generate the SQL and visualize the data for you.' 
      }
    ]);

    const handleMouseMove = (e) => {
      if (!appRef.current) return;
      if (isDraggingLeft.current) {
        const newWidth = Math.max(150, Math.min(e.clientX, 600));
        setSidebarWidth(newWidth);
      } else if (isDraggingRight.current) {
        const containerWidth = appRef.current.getBoundingClientRect().width;
        const newWidth = Math.max(250, Math.min(containerWidth - e.clientX, 800));
        setChatWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingLeft.current = false;
      isDraggingRight.current = false;
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleAiQuestion = async (question) => {
    const userMsg = { id: Date.now().toString(), type: 'user', content: question };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const data = await queryDatabase(question);
      setActiveSql(data.sql);
      setResults(data.result);
      
      const aiMsg = { 
        id: (Date.now() + 1).toString(), 
        type: 'ai', 
        content: data.nl_answer || `I have generated the SQL for your question and executed it. Found ${data.row_count} rows.` 
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Something went wrong';
      setChatMessages(prev => [...prev, { id: Date.now().toString(), type: 'error', content: errorMsg }]);
    }
    setIsAiThinking(false);
  };

  const handleRunSql = async (sql) => {
    setIsExecuting(true);
    try {
      const data = await executeRawSql(sql);
      setResults(data.result);
      setActiveSql(sql);
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'system',
        content: `Executed query successfully. Returned ${data.row_count} rows.`
      }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'SQL Execution Failed';
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'error',
        content: `Execution failed: ${errorMsg}`,
        errorSql: sql
      }]);
    }
    setIsExecuting(false);
  };

  const startDragLeft = (e) => {
    e.preventDefault();
    isDraggingLeft.current = true;
    document.body.style.cursor = 'col-resize';
  };

  const startDragRight = (e) => {
    e.preventDefault();
    isDraggingRight.current = true;
    document.body.style.cursor = 'col-resize';
  };

  return (
    <div 
      ref={appRef}
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--bg-primary)'
      }}
    >
      {/* Left Pane: Schema Explorer */}
      <div style={{ width: sidebarWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <SchemaExplorer />
      </div>

      <div className="resizer" onMouseDown={startDragLeft} />

      {/* Center Pane: IDE Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 400 }}>
        <IdeWorkspace 
          sql={activeSql} 
          onSqlChange={setActiveSql}
          onRunSql={handleRunSql}
          results={results}
          isExecuting={isExecuting || isAiThinking}
          onRequestFix={(badSql, errorMsg) => {
             handleAiQuestion(`Fix this SQL error: ${errorMsg}\n\nSQL:\n${badSql}`);
          }}
        />
      </div>

      <div className="resizer" onMouseDown={startDragRight} />

      {/* Right Pane: AI Chat */}
      <div style={{ width: chatWidth, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <AIChatPanel 
          messages={chatMessages}
          onSendMessage={handleAiQuestion}
          isThinking={isAiThinking}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
