import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Zap, Target, Crown } from 'lucide-react';

interface BadgeProps {
  type: 'award' | 'star' | 'trophy' | 'zap' | 'target' | 'crown';
  label: string;
  description?: string;
  earned?: boolean;
  progress?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  type,
  label,
  description,
  earned = false,
  progress,
  size = 'md',
  onClick
}) => {
  const icons = {
    award: Award,
    star: Star,
    trophy: Trophy,
    zap: Zap,
    target: Target,
    crown: Crown
  };

  const Icon = icons[type];

  const sizeClasses = {
    sm: { container: 'w-16 h-16', icon: 20 },
    md: { container: 'w-24 h-24', icon: 32 },
    lg: { container: 'w-32 h-32', icon: 40 }
  };

  const gradients = {
    award: 'from-blue-400 to-blue-600',
    star: 'from-yellow-400 to-yellow-600',
    trophy: 'from-yellow-500 to-orange-600',
    zap: 'from-purple-400 to-purple-600',
    target: 'from-green-400 to-green-600',
    crown: 'from-yellow-400 to-yellow-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={earned ? { scale: 1.1, rotate: 5 } : {}}
      className={`flex flex-col items-center gap-2 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Badge Icon */}
      <div className="relative">
        <motion.div
          className={`${sizeClasses[size].container} rounded-full flex items-center justify-center ${
            earned
              ? `bg-gradient-to-br ${gradients[type]} shadow-2xl`
              : 'bg-gray-200'
          }`}
          animate={earned ? {
            boxShadow: [
              '0 10px 30px rgba(0,0,0,0.2)',
              '0 15px 40px rgba(0,0,0,0.3)',
              '0 10px 30px rgba(0,0,0,0.2)'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon
            size={sizeClasses[size].icon}
            className={earned ? 'text-white' : 'text-gray-400'}
          />
        </motion.div>

        {/* Progress Ring */}
        {!earned && progress !== undefined && (
          <svg className="absolute inset-0 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-300"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-prefeitura-verde"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                strokeDasharray: '1',
                strokeDashoffset: '0'
              }}
            />
          </svg>
        )}

        {/* Sparkle Effect for Earned Badges */}
        {earned && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={`font-semibold ${earned ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {!earned && progress !== undefined && (
          <p className="text-xs text-prefeitura-verde font-semibold mt-1">
            {progress}%
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default Badge;
