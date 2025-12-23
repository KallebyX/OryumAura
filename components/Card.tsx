import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  variant?: CardVariant;
  hoverable?: boolean;
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  accent?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  clickable = false,
  padding = 'lg',
  glow = false,
  accent,
  className = '',
  onClick,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  const variantClasses: Record<CardVariant, string> = {
    default: `
      bg-white dark:bg-slate-900
      border border-slate-200/60 dark:border-slate-700/60
      shadow-elevation-2
    `,
    elevated: `
      bg-white dark:bg-slate-800
      border border-slate-200/40 dark:border-slate-700/40
      shadow-elevation-4
    `,
    outlined: `
      bg-transparent
      border-2 border-slate-200 dark:border-slate-700
    `,
    glass: `
      bg-white/60 dark:bg-slate-900/60
      backdrop-blur-xl
      border border-white/30 dark:border-white/10
      shadow-glass dark:shadow-glass-dark
    `,
    gradient: `
      bg-gradient-to-br from-white via-slate-50 to-slate-100
      dark:from-slate-800 dark:via-slate-850 dark:to-slate-900
      border border-slate-200/60 dark:border-slate-700/60
      shadow-elevation-3
    `,
  };

  const accentClasses = accent ? {
    primary: 'border-l-4 border-l-primary-500',
    accent: 'border-l-4 border-l-accent-500',
    success: 'border-l-4 border-l-success-500',
    warning: 'border-l-4 border-l-warning-500',
    danger: 'border-l-4 border-l-danger-500',
  }[accent] : '';

  const glowClasses = glow ? `
    hover:shadow-glow dark:hover:shadow-glow-lg
  ` : '';

  const interactiveClasses = (hoverable || clickable) ? `
    cursor-pointer
    transition-all duration-300 ease-out
    hover:shadow-elevation-5
    hover:border-primary-200 dark:hover:border-primary-800
    hover:-translate-y-1
  ` : '';

  return (
    <motion.div
      whileHover={clickable ? { scale: 1.01, y: -4 } : hoverable ? { y: -4 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`
        rounded-2xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${accentClasses}
        ${glowClasses}
        ${interactiveClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* Card Header Component */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

/* Card Content Component */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-slate-600 dark:text-slate-300 ${className}`}>
      {children}
    </div>
  );
};

/* Card Footer Component */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = true,
}) => {
  return (
    <div
      className={`
        mt-6 pt-5
        ${border ? 'border-t border-slate-200/60 dark:border-slate-700/60' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/* Stat Card Component */
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'primary',
  className = '',
}) => {
  const colorClasses = {
    primary: 'text-primary-500',
    accent: 'text-accent-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    danger: 'text-danger-500',
  };

  const bgClasses = {
    primary: 'from-primary-500/10 to-primary-500/5',
    accent: 'from-accent-500/10 to-accent-500/5',
    success: 'from-success-500/10 to-success-500/5',
    warning: 'from-warning-500/10 to-warning-500/5',
    danger: 'from-danger-500/10 to-danger-500/5',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900
        border border-slate-200/60 dark:border-slate-700/60
        shadow-elevation-2 hover:shadow-elevation-4
        transition-shadow duration-300
        ${className}
      `}
    >
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgClasses[color]} rounded-full blur-2xl opacity-60`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {icon && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgClasses[color]} flex items-center justify-center ${colorClasses[color]}`}>
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </span>
          {change && (
            <span className={`
              flex items-center gap-1 text-sm font-medium mb-1
              ${change.type === 'increase' ? 'text-success-500' : 'text-danger-500'}
            `}>
              <span>{change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
