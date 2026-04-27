import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

let toastListeners = [];

const emitToast = (toast) => {
  toastListeners.forEach((listener) => listener(toast));
};

export const toast = {
  success: (message) => emitToast({ type: 'success', message }),
  error: (message) => emitToast({ type: 'error', message }),
  info: (message) => emitToast({ type: 'info', message }),
  warning: (message) => emitToast({ type: 'warning', message }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (newToast) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...newToast, id }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    toastListeners.push(handleToast);

    return () => {
      toastListeners = toastListeners.filter((listener) => listener !== handleToast);
    };
  }, []);

  const icons = {
    success: FaCheckCircle,
    error: FaTimesCircle,
    info: FaInfoCircle,
    warning: FaExclamationTriangle,
  };

  const colors = {
    success: 'bg-positive text-white',
    error: 'bg-accent text-white',
    info: 'bg-trust text-white',
    warning: 'bg-warning text-deep',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg min-w-[300px] ${colors[toast.type]}`}
            >
              <Icon className="text-xl shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export { toast as default };
