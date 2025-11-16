import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <motion.input
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={`
              w-full px-4 py-2.5
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-prefeitura-verde focus:border-transparent'
              }
              ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
