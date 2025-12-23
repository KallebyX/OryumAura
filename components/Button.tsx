import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gradient';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  glow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  glow = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2.5
    font-semibold tracking-tight
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    dark:focus-visible:ring-offset-slate-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
  `;

  const variantClasses: Record<ButtonVariant, string> = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-600
      hover:from-primary-600 hover:to-primary-700
      active:from-primary-700 active:to-primary-800
      text-white shadow-lg shadow-primary-500/25
      focus-visible:ring-primary-500
      ${glow ? 'hover:shadow-primary-500/40 hover:shadow-xl' : ''}
    `,
    secondary: `
      bg-slate-800 dark:bg-slate-700
      hover:bg-slate-700 dark:hover:bg-slate-600
      active:bg-slate-900 dark:active:bg-slate-800
      text-white shadow-lg shadow-slate-900/25 dark:shadow-slate-900/50
      focus-visible:ring-slate-500
    `,
    outline: `
      bg-transparent border-2 border-slate-200 dark:border-slate-700
      hover:bg-slate-50 dark:hover:bg-slate-800/50
      hover:border-primary-300 dark:hover:border-primary-700
      active:bg-slate-100 dark:active:bg-slate-800
      text-slate-700 dark:text-slate-200
      focus-visible:ring-primary-500
    `,
    ghost: `
      bg-transparent
      hover:bg-slate-100 dark:hover:bg-slate-800
      active:bg-slate-200 dark:active:bg-slate-700
      text-slate-700 dark:text-slate-300
      focus-visible:ring-slate-500
    `,
    danger: `
      bg-gradient-to-r from-danger-500 to-danger-600
      hover:from-danger-600 hover:to-danger-700
      active:from-danger-700 active:to-danger-800
      text-white shadow-lg shadow-danger-500/25
      focus-visible:ring-danger-500
      ${glow ? 'hover:shadow-danger-500/40 hover:shadow-xl' : ''}
    `,
    success: `
      bg-gradient-to-r from-success-500 to-success-600
      hover:from-success-600 hover:to-success-700
      active:from-success-700 active:to-success-800
      text-white shadow-lg shadow-success-500/25
      focus-visible:ring-success-500
      ${glow ? 'hover:shadow-success-500/40 hover:shadow-xl' : ''}
    `,
    gradient: `
      bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500
      bg-[length:200%_auto]
      hover:bg-right
      text-white shadow-lg shadow-primary-500/25
      focus-visible:ring-primary-500
      ${glow ? 'hover:shadow-accent-500/40 hover:shadow-xl' : ''}
    `,
  };

  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const iconSizes: Record<ButtonSize, number> = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  };

  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${rounded ? 'rounded-full' : 'rounded-xl'}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {/* Shimmer effect for gradient variant */}
      {variant === 'gradient' && !isDisabled && (
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {loading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}

      <span className="relative">{children}</span>

      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
