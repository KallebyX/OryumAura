import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <motion.select
            ref={ref}
            whileFocus={{ scale: 1.01 }}
            className={`
              w-full px-4 py-2.5 pr-10
              appearance-none
              border rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              dark:focus:ring-offset-gray-900
              ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-transparent'
              }
              ${props.disabled
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800'
              }
              text-gray-900 dark:text-white
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            <ChevronDown size={20} />
          </div>
        </div>

        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-1.5 text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
