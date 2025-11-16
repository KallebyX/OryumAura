import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import Avatar from './Avatar';

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignee?: {
    name: string;
    avatar?: string;
  };
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  limit?: number;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  onCardClick?: (card: KanbanCard) => void;
  onAddCard?: (columnId: string) => void;
  onDeleteCard?: (cardId: string, columnId: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns: initialColumns,
  onCardMove,
  onCardClick,
  onAddCard,
  onDeleteCard
}) => {
  const [columns, setColumns] = useState(initialColumns);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200'
  };

  const handleReorder = (columnId: string, newOrder: KanbanCard[]) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === columnId ? { ...col, cards: newOrder } : col
      )
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-2">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-4 border border-gray-200"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {column.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
              )}
              <h3 className="font-bold text-gray-900">{column.title}</h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-300">
                {column.cards.length}
                {column.limit && `/${column.limit}`}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onAddCard?.(column.id)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
            >
              <Plus size={18} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Cards */}
          <Reorder.Group
            axis="y"
            values={column.cards}
            onReorder={(newOrder) => handleReorder(column.id, newOrder)}
            className="space-y-3 min-h-[200px]"
          >
            <AnimatePresence>
              {column.cards.map((card) => (
                <Reorder.Item
                  key={card.id}
                  value={card}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05, rotate: 2 }}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  onClick={() => onCardClick?.(card)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1 pr-2">
                      {card.title}
                    </h4>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCard?.(card.id, column.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                    </motion.button>
                  </div>

                  {/* Description */}
                  {card.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {card.description}
                    </p>
                  )}

                  {/* Tags */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {card.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {card.assignee ? (
                      <Avatar
                        src={card.assignee.avatar}
                        name={card.assignee.name}
                        size="sm"
                      />
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-2">
                      {card.dueDate && (
                        <span className="text-xs text-gray-500">
                          {card.dueDate}
                        </span>
                      )}
                      {card.priority && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            priorityColors[card.priority]
                          }`}
                        >
                          {card.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          {/* Add Card Button */}
          {column.cards.length === 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onAddCard?.(column.id)}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-prefeitura-verde hover:text-prefeitura-verde transition-colors"
            >
              + Adicionar cartão
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default KanbanBoard;
