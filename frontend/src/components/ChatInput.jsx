import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';

export default function ChatInput({ onSend, isLoading, suggestions }) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!isLoading) {
      onSend(suggestion);
    }
  };

  const isReady = input.trim() && !isLoading;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-glass-strong)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px 28px 20px',
      }}
    >
      {/* Suggestion pills */}
      <AnimatePresence>
        {suggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--text-secondary)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-light)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-glass)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <Sparkles size={10} style={{ marginRight: 4, display: 'inline' }} />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <motion.div
          animate={{
            boxShadow: isFocused
              ? '0 0 0 3px var(--accent-glow), var(--shadow-sm)'
              : 'var(--shadow-xs)',
            borderColor: isFocused ? 'var(--accent)' : 'var(--border-color)',
          }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1,
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-input)',
            overflow: 'hidden',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your business data..."
            disabled={isLoading}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={!isReady}
          whileHover={isReady ? { scale: 1.05 } : {}}
          whileTap={isReady ? { scale: 0.92 } : {}}
          animate={{
            background: isReady
              ? 'var(--accent-gradient)'
              : 'var(--bg-tertiary)',
            boxShadow: isReady
              ? '0 4px 15px var(--accent-glow)'
              : 'none',
          }}
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-lg)',
            border: 'none',
            background: isReady ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
            color: isReady ? 'var(--text-on-primary)' : 'var(--text-tertiary)',
            cursor: isReady ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
          }}
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader2 size={20} />
            </motion.div>
          ) : (
            <Send size={20} />
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
