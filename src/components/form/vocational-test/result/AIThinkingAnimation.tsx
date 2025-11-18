import React from 'react';
import { motion } from 'framer-motion';

const AIThinkingAnimation: React.FC = () => {
  return (
    <div className="relative w-24 h-24">
      <motion.div
        className="absolute inset-0 bg-blue-500 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-2 bg-blue-400 rounded-full opacity-40"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-4 bg-blue-300 rounded-full"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                top: '10%',
                left: '50%',
                transformOrigin: '50% 2000%',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut",
              }}
              initial={{
                rotate: index * 60,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, -360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-blue-600 rounded-full"
            style={{
              top: '5%',
              left: '50%',
              transformOrigin: '50% 2250%',
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 1,
              ease: "easeInOut",
            }}
            initial={{
              rotate: index * 120,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default AIThinkingAnimation;

