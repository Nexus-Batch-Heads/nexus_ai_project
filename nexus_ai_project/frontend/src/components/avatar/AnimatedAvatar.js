'use client';
import { motion } from 'framer-motion';

export default function AnimatedAvatar({ size = 120, speaking = false, className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, #00f5ff, #b829ff, #ff2eea, #00f5ff)',
          opacity: 0.3,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '3px',
          background: 'conic-gradient(from 180deg, #00f5ff, #b829ff, #ff2eea, #00f5ff)',
          opacity: 0.2,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Avatar circle */}
      <motion.div
        className="absolute rounded-full bg-dark-800 flex items-center justify-center"
        style={{ inset: '6px' }}
        animate={speaking ? { scale: [1, 1.02, 1] } : {}}
        transition={speaking ? { duration: 0.5, repeat: Infinity } : {}}
      >
        {/* Face */}
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
          {/* Head glow */}
          <defs>
            <radialGradient id="headGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#b829ff" />
            </linearGradient>
          </defs>
          
          <circle cx="50" cy="50" r="45" fill="url(#headGlow)" />
          
          {/* Left eye */}
          <motion.ellipse
            cx="36" cy="42" rx="5" ry="6"
            fill="url(#faceGrad)"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          />
          
          {/* Right eye */}
          <motion.ellipse
            cx="64" cy="42" rx="5" ry="6"
            fill="url(#faceGrad)"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          />
          
          {/* Eye shine */}
          <circle cx="38" cy="40" r="1.5" fill="white" opacity="0.8" />
          <circle cx="66" cy="40" r="1.5" fill="white" opacity="0.8" />
          
          {/* Mouth */}
          <motion.path
            d={speaking ? "M 35 62 Q 50 75 65 62" : "M 38 62 Q 50 70 62 62"}
            fill="none"
            stroke="url(#faceGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={speaking ? {
              d: ["M 35 62 Q 50 75 65 62", "M 38 62 Q 50 68 62 62", "M 35 62 Q 50 75 65 62"]
            } : {}}
            transition={speaking ? { duration: 0.3, repeat: Infinity } : {}}
          />
          
          {/* Circuit line decorations */}
          <line x1="20" y1="30" x2="25" y2="35" stroke="#00f5ff" strokeWidth="0.5" opacity="0.4" />
          <line x1="75" y1="30" x2="80" y2="25" stroke="#b829ff" strokeWidth="0.5" opacity="0.4" />
          <circle cx="20" cy="30" r="1" fill="#00f5ff" opacity="0.4" />
          <circle cx="80" cy="25" r="1" fill="#b829ff" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-neon-cyan/30"
        animate={{
          scale: [1, 1.3, 1.3],
          opacity: [0.4, 0, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-neon-purple/20"
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.3, 0, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
    </div>
  );
}
