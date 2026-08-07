'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  glowOnHover = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={glowOnHover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative group rounded-2xl bg-card/80 backdrop-blur-xl border border-white/[0.08] hover:border-accent/40 shadow-glass overflow-hidden transition-all duration-300 ${
        glowOnHover ? 'hover:shadow-glow-accent' : ''
      } ${className}`}
    >
      {/* Background radial gradient spotlight effect */}
      {glowOnHover && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
