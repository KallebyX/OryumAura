import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const typeConfig = {
  success: {
    bg: 'bg-gradient-to-r from-green-500 to-green-600',
    icon: CheckCircle,
    border: 'border-green-400'
  },
  error: {
    bg: 'bg-gradient-to-r from-red-500 to-red-600',
    icon: XCircle,
    border: 'border-red-400'
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: Info,
    border: 'border-blue-400'
  },
  warning: {
    bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    icon: AlertTriangle,
    border: 'border-yellow-400'
  }
};

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastNotificationProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-3 max-w-md">
      <AnimatePresence>
        {toasts.map(({ id, message, type }) => {
          const config = typeConfig[type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              layout
              className={`${config.bg} text-white py-4 px-5 rounded-xl shadow-2xl border-l-4 ${config.border} backdrop-blur-sm`}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                >
                  <Icon size={24} className="flex-shrink-0" />
                </motion.div>
                <p className="flex-1 font-medium text-sm leading-relaxed">{message}</p>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(id)}
                  className="text-white/80 hover:text-white transition-colors flex-shrink-0"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;
