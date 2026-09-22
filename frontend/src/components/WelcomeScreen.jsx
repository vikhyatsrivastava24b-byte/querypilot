import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, Sparkles, Table, BarChart3, MessageSquare, Zap, ArrowRight, Shield, Brain } from 'lucide-react';

function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.1,
    })), []);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      pointerEvents: 'none', zIndex: 0,
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: '110vh', x: `${p.x}%`, opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'var(--accent)',
          }}
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function WelcomeScreen({ onSuggestionClick, suggestions }) {
  const features = [
    { icon: <Brain size={22} />, title: 'AI-Powered', desc: 'Natural language to SQL with LLM intelligence', color: '#4f6ef7' },
    { icon: <Database size={22} />, title: 'Live Database', desc: 'Real-time queries on PostgreSQL', color: '#10b981' },
    { icon: <BarChart3 size={22} />, title: 'Auto Charts', desc: 'Smart visualization recommendations', color: '#f59e0b' },
    { icon: <Shield size={22} />, title: 'Secure', desc: 'SELECT-only with SQL validation', color: '#8b5cf6' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <FloatingParticles />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1,
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* Animated Logo */}
        <motion.div
          variants={itemVariants}
          style={{ position: 'relative', marginBottom: '24px' }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px var(--accent-glow)',
            }}
          >
            <Sparkles size={34} color="white" />
          </motion.div>
          {/* Glow ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: '-8px',
              borderRadius: 'var(--radius-2xl)',
              border: '2px solid var(--accent)',
              opacity: 0.3,
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: '36px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          Welcome to <span className="gradient-text">QueryPilot</span>
        </motion.h2>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            textAlign: 'center',
            maxWidth: '480px',
            lineHeight: '1.7',
          }}
        >
          Ask questions about your business data in plain English.
          AI generates SQL, executes it, and shows you results with smart visualizations.
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            marginBottom: '40px',
            width: '100%',
            maxWidth: '520px',
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4, boxShadow: 'var(--shadow-md)' }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(12px)',
                cursor: 'default',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = feature.color + '40'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: feature.color + '15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: feature.color,
                marginBottom: '12px',
              }}>
                {feature.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {feature.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', lineHeight: '1.5' }}>
                {feature.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Suggestions */}
        <motion.div variants={itemVariants} style={{ width: '100%', maxWidth: '520px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Zap size={12} />
            Try asking
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestions?.slice(0, 5).map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08 }}
                whileHover={{ x: 6, background: 'var(--accent-light)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSuggestionClick(suggestion)}
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  lineHeight: '1.4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 500,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <span>{suggestion}</span>
                <ArrowRight size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
