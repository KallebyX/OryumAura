import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Tab Navigation */}
      <div className={`flex gap-2 ${variant === 'underline' ? 'border-b border-gray-200' : ''}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (variant === 'pills') {
            return (
              <motion.button
                key={tab.id}
                onClick={() => !tab.disabled && handleTabChange(tab.id)}
                disabled={tab.disabled}
                whileHover={!tab.disabled ? { scale: 1.05 } : {}}
                whileTap={!tab.disabled ? { scale: 0.95 } : {}}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all
                  flex items-center gap-2
                  ${isActive
                    ? 'bg-gradient-to-r from-prefeitura-verde to-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            );
          }

          if (variant === 'underline') {
            return (
              <motion.button
                key={tab.id}
                onClick={() => !tab.disabled && handleTabChange(tab.id)}
                disabled={tab.disabled}
                whileHover={!tab.disabled ? { y: -2 } : {}}
                className={`
                  relative px-4 py-3 font-semibold transition-colors
                  flex items-center gap-2
                  ${isActive ? 'text-prefeitura-verde' : 'text-gray-600 hover:text-gray-900'}
                  ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {tab.icon}
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-prefeitura-verde"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          }

          // Default variant
          return (
            <motion.button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              whileHover={!tab.disabled ? { scale: 1.05 } : {}}
              whileTap={!tab.disabled ? { scale: 0.95 } : {}}
              className={`
                px-4 py-2 rounded-t-lg font-semibold transition-all
                flex items-center gap-2 border-b-2
                ${isActive
                  ? 'bg-white text-prefeitura-verde border-prefeitura-verde'
                  : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'
                }
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
};

export default Tabs;
