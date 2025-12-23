import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Check } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'ghost';
  showPasswordToggle?: boolean;
  success?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  showPasswordToggle = false,
  success = false,
  fullWidth = true,
  className = '',
  type = 'text',
  disabled,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const variantClasses = {
    default: `
      bg-white dark:bg-slate-800
      border-2 border-slate-200 dark:border-slate-700
      hover:border-slate-300 dark:hover:border-slate-600
    `,
    filled: `
      bg-slate-100 dark:bg-slate-800
      border-2 border-transparent
      hover:bg-slate-50 dark:hover:bg-slate-700
    `,
    ghost: `
      bg-transparent
      border-2 border-transparent border-b-slate-200 dark:border-b-slate-700
      rounded-none rounded-t-lg
      hover:border-b-slate-300 dark:hover:border-b-slate-600
    `,
  };

  const stateClasses = error
    ? 'border-danger-500 dark:border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
    : success
    ? 'border-success-500 dark:border-success-500 focus:border-success-500 focus:ring-success-500/20'
    : 'focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500/20';

  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {props.required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className={`
            absolute left-4 top-1/2 -translate-y-1/2
            text-slate-400 dark:text-slate-500
            transition-colors duration-200
            ${isFocused ? 'text-primary-500 dark:text-primary-400' : ''}
            ${error ? 'text-danger-500' : ''}
          `}>
            {leftIcon}
          </div>
        )}

        <motion.input
          ref={ref}
          type={inputType}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full rounded-xl
            text-slate-900 dark:text-white
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-4
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${stateClasses}
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon || showPasswordToggle || error || success ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right side icons */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-danger-500"
            >
              <AlertCircle size={iconSizes[size]} />
            </motion.div>
          )}

          {success && !error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-success-500"
            >
              <Check size={iconSizes[size]} />
            </motion.div>
          )}

          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={iconSizes[size]} />
              ) : (
                <Eye size={iconSizes[size]} />
              )}
            </button>
          )}

          {rightIcon && !error && !success && !showPasswordToggle && (
            <span className="text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
      </div>

      {/* Error/Helper Text */}
      <AnimatePresence mode="wait">
        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`
              mt-2 text-sm
              ${error ? 'text-danger-500' : 'text-slate-500 dark:text-slate-400'}
            `}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
