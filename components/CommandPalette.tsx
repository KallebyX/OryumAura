import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, Clock } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  keywords?: string[];
  section?: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  recentItems?: string[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  items,
  isOpen,
  onClose,
  placeholder = 'Buscar ou executar comando...',
  recentItems = []
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search) return items;

    const query = search.toLowerCase();
    return items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(query);
      const keywordMatch = item.keywords?.some(k => k.toLowerCase().includes(query));
      return labelMatch || keywordMatch;
    });
  }, [items, search]);

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach(item => {
      const section = item.section || 'Comandos';
      if (!groups[section]) groups[section] = [];
      groups[section].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].onSelect();
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  let currentIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
              <Search className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
              />
              <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                Esc
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-12 text-center text-gray-500">
                  Nenhum resultado encontrado
                </div>
              ) : (
                Object.entries(groupedItems).map(([section, sectionItems]) => (
                  <div key={section}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                      {section}
                    </div>
                    {sectionItems.map((item) => {
                      const itemIndex = currentIndex++;
                      const isSelected = itemIndex === selectedIndex;

                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            item.onSelect();
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          whileHover={{ x: 4 }}
                          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                            isSelected
                              ? 'bg-gradient-to-r from-prefeitura-verde/10 to-green-50 border-l-2 border-prefeitura-verde'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {item.icon && (
                            <span className={isSelected ? 'text-prefeitura-verde' : 'text-gray-400'}>
                              {item.icon}
                            </span>
                          )}
                          <span className="flex-1 text-left font-medium text-gray-900">
                            {item.label}
                          </span>
                          {recentItems.includes(item.id) && (
                            <Clock size={16} className="text-gray-400" />
                          )}
                          <ChevronRight
                            size={16}
                            className={`transition-opacity ${
                              isSelected ? 'opacity-100 text-prefeitura-verde' : 'opacity-0'
                            }`}
                          />
                        </motion.button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↑</kbd>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↓</kbd>
                  <span className="ml-1">Navegar</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">↵</kbd>
                  <span className="ml-1">Selecionar</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">Cmd</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm">K</kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
