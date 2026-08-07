'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', isOpen, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-xl bg-card border border-white/10 shadow-2xl backdrop-blur-xl"
        >
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-accent" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-medium text-white">{message}</span>
          <button
            onClick={onClose}
            className="p-1 text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
