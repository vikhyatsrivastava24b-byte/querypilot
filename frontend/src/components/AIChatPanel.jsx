import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChatPanel({ messages, onSendMessage, isThinking }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="pane" style={{ background: 'var(--bg-secondary)' }}>
      <div className="pane-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          AI Assistant
        </span>
      </div>

      <div className="pane-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                flexDirection: msg.type === 'user' ? 'row-reverse' : 'row'
              }}>
                {msg.type === 'user' ? <User size={12} /> : (msg.type === 'error' || msg.type === 'system' ? null : <Bot size={12} />)}
                {msg.type === 'user' ? 'You' : (msg.type === 'ai' ? 'QueryPilot AI' : msg.type === 'error' ? 'Error' : 'System')}
              </div>
              <div style={{
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.5',
                maxWidth: '90%',
                background: msg.type === 'user' ? 'var(--bg-user-msg)' : 
                            msg.type === 'error' ? 'var(--error-light)' : 'var(--bg-tertiary)',
                color: msg.type === 'user' ? 'white' : 
                       msg.type === 'error' ? 'var(--error)' : 'var(--text-primary)',
                border: msg.type === 'ai' ? '1px solid var(--border-color)' : 'none',
              }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-tertiary)', fontSize: '13px' }}
            >
              <Loader2 size={14} className="animate-spin" />
              Thinking...
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isThinking}
            style={{
              width: '100%',
              padding: '12px 40px 12px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isThinking || !input.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: input.trim() && !isThinking ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: input.trim() && !isThinking ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

