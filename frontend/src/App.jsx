import { useState, useRef, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import { queryDatabase, getSuggestions } from './services/api';

function AppContent() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const data = await getSuggestions();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      setSuggestions([
        "Show me total revenue by product category",
        "Who are the top 5 customers by order value?",
        "How many orders were placed each month in 2025?",
        "What is the average order value by region?",
      ]);
    }
  };

  const handleSendMessage = async (question) => {
    // Add user message
    const userMessage = { id: Date.now(), type: 'user', content: question };
    const loadingMessage = { id: Date.now() + 1, type: 'loading' };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const result = await queryDatabase(question);

      // Replace loading with result
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'loading');
        return [...filtered, {
          id: Date.now() + 2,
          type: 'response',
          data: result,
        }];
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Something went wrong';

      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'loading');
        return [...filtered, {
          id: Date.now() + 2,
          type: 'error',
          content: errorMsg,
        }];
      });
    }

    setIsLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'var(--bg-chat)',
    }}>
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectQuery={handleSendMessage}
      />

      {/* Chat Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.length === 0 ? (
          <WelcomeScreen
            suggestions={suggestions}
            onSuggestionClick={handleSendMessage}
          />
        ) : (
          <div style={{ padding: '16px 0', flex: 1 }}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        suggestions={messages.length > 0 ? suggestions : null}
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
