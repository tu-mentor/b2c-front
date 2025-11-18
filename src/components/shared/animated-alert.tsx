import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./button";

export type AlertType = "error" | "warning" | "success" | "info";

interface AnimatedAlertProps {
  message: string;
  type: AlertType;
  onClose: () => void;
  duration?: number;
}

const AnimatedAlert: React.FC<AnimatedAlertProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 150); // Reducir de 300ms a 150ms para que la animación de salida sea más rápida
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getAlertStyle = () => {
    switch (type) {
      case "error":
        return "bg-red-100 border-red-400 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "success":
        return "bg-green-100 border-green-400 text-green-700";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-gray-100 border-gray-400 text-gray-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-6 w-6" />;
      case "warning":
        return <AlertCircle className="h-6 w-6" />;
      case "success":
        return <CheckCircle className="h-6 w-6" />;
      case "info":
        return <AlertCircle className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md ${getAlertStyle()} border-l-4 rounded-lg shadow-lg`}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {getIcon()}
              <p className="ml-3 text-sm font-medium">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <motion.div
            className="h-1 bg-current opacity-25"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedAlert;
