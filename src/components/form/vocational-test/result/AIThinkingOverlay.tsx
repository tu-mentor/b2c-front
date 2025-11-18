import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import AIThinkingAnimation from './AIThinkingAnimation';

interface AIThinkingOverlayProps {
  isVisible: boolean;
  progress?: number;
  progressMessage?: string;
}

const AIThinkingOverlay: React.FC<AIThinkingOverlayProps> = ({ isVisible, progress = 0, progressMessage = "La IA está procesando los resultados..." }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <AIThinkingAnimation />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Brain className="h-16 w-16 text-white" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="absolute bottom-20 w-full max-w-md px-8"
          >
            <p className="text-white text-lg font-semibold mb-3 text-center">
              {progressMessage}
            </p>
            
            {/* Barra de progreso */}
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ 
                  duration: progress === 100 ? 0.8 : 0.5, 
                  ease: progress === 100 ? "easeInOut" : "easeOut" 
                }}
              />
            </div>
            
            {/* Porcentaje */}
            <motion.p
              className="text-white text-sm mt-1 text-center"
              key={Math.round(progress)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIThinkingOverlay;

