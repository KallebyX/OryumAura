import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 50
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; color: string }>>([]);

  useEffect(() => {
    if (active) {
      const colors = [
        '#2E7D32', // Green
        '#FFC107', // Yellow
        '#D32F2F', // Red
        '#1976D2', // Blue
        '#7B1FA2', // Purple
        '#F57C00'  // Orange
      ];

      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));

      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, particleCount, duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: -20,
              rotate: 0,
              opacity: 1
            }}
            animate={{
              y: '100vh',
              rotate: Math.random() * 360,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2 + Math.random() * 2,
              ease: 'linear'
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: particle.color,
              left: 0,
              top: 0
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
