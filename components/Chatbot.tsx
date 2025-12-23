import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { ChatbotMessage } from '../types';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface ChatbotProps {
  sessionId?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ sessionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSessionId] = useState(sessionId || `session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([
        {
          id: 0,
          session_id: currentSessionId,
          sender: 'bot',
          message: 'Ola! Sou o assistente virtual da Secretaria de Assistencia Social. Como posso ajudar voce hoje?',
          timestamp: new Date().toISOString(),
          intent: 'greeting',
          confidence: 1.0
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatbotMessage = {
      id: Date.now(),
      session_id: currentSessionId,
      sender: 'user',
      message: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot/message', {
        session_id: currentSessionId,
        message: inputMessage
      });

      const botMessage: ChatbotMessage = {
        id: response.data.message.id,
        session_id: currentSessionId,
        sender: 'bot',
        message: response.data.message.message,
        timestamp: response.data.message.timestamp,
        intent: response.data.message.intent,
        confidence: response.data.message.confidence
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatbotMessage = {
        id: Date.now(),
        session_id: currentSessionId,
        sender: 'bot',
        message: 'Desculpe, ocorreu um erro. Por favor, tente novamente.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Quais sao os horarios de atendimento?',
    'Como fazer o CadUnico?',
    'Como solicitar o Bolsa Familia?',
    'Como solicitar uma cesta basica?',
    'Como agendar um atendimento?'
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg z-50 transition-transform hover:scale-110"
          aria-label="Abrir chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <div>
                <h3 className="font-bold">Assistente Virtual</h3>
                <p className="text-xs opacity-90">Sempre online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
              aria-label="Fechar chat"
            >
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Bot size={18} className="text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Perguntas frequentes:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(question);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg disabled:opacity-50 transition-opacity"
                aria-label="Enviar mensagem"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Pressione Enter para enviar
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
