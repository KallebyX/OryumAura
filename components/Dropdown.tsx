import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  selectedValue?: string;
  align?: 'left' | 'right';
  width?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  options,
  onSelect,
  selectedValue,
  align = 'left',
  width = 'w-56'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value: string, disabled?: boolean) => {
    if (!disabled) {
      onSelect(value);
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 ${width} ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-1 overflow-hidden">
              {options.map((option, index) => (
                <React.Fragment key={index}>
                  {option.divider ? (
                    <div className="my-1 border-t border-gray-200" />
                  ) : (
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(option.value, option.disabled)}
                      disabled={option.disabled}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
                        option.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.icon && (
                        <span className={option.disabled ? 'text-gray-400' : 'text-gray-500'}>
                          {option.icon}
                        </span>
                      )}
                      <span className="flex-1">{option.label}</span>
                      {selectedValue === option.value && (
                        <Check size={18} className="text-green-600" />
                      )}
                    </motion.button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
