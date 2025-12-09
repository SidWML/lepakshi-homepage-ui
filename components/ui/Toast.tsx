"use client";

import { motion, AnimatePresence } from "framer-motion";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string | null;
  variant?: ToastVariant;
  onClose?: () => void;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: "bg-[#1a1a1a]",
    icon: (
      <svg className="w-5 h-5 text-[#c9a227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bg: "bg-[#d32f2f]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-[#f57c00]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-[#1976d2]",
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export function Toast({ message, variant = "success", onClose }: ToastProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${styles.bg} text-white px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3`}
        >
          {styles.icon}
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Hook for easier usage
import { useState, useCallback } from "react";

interface ToastState {
  message: string | null;
  variant: ToastVariant;
}

export function useToast(duration = 3000) {
  const [toast, setToast] = useState<ToastState>({ message: null, variant: "success" });

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToast({ message, variant });
    setTimeout(() => setToast({ message: null, variant: "success" }), duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    setToast({ message: null, variant: "success" });
  }, []);

  return {
    message: toast.message,
    variant: toast.variant,
    showToast,
    hideToast,
  };
}

export default Toast;
