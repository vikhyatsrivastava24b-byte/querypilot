import { useState, useEffect } from 'react';
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

  // Initial welcome message
  useEffect(() => {
    setChatMessages([
      { 
        id: 'welcome', 
        type: 'ai', 
        content: 'Hi! I am your AI Data Assistant. Ask me a question about your business, and I will generate the SQL and visualize the data for you.' 
      }
    ]);
  }, []);

  const handleAiQuestion = async (question) => {
    // Add user message
    const userMsg = { id: Date.now().toString(), type: 'user', content: question };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiThinking(true);

    try {
      const data = await queryDatabase(question);
      
      // Update the IDE
      setActiveSql(data.sql);
      setResults(data.result);
      
      // Add AI response
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
      
      // Notify in chat
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
        content: `Execution failed: ${errorMsg}`
      }]);
    }
    setIsExecuting(false);
  };

  return (
    <div className="ide-container">
      {/* Left Pane: Schema Explorer */}
      <SchemaExplorer />

      {/* Center Pane: IDE Workspace */}
      <IdeWorkspace 
        sql={activeSql} 
        onSqlChange={setActiveSql}
        onRunSql={handleRunSql}
        results={results}
        isExecuting={isExecuting || isAiThinking}
      />

      {/* Right Pane: AI Chat */}
      <AIChatPanel 
        messages={chatMessages}
        onSendMessage={handleAiQuestion}
        isThinking={isAiThinking}
      />
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
