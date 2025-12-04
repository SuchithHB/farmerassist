
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sprout, Loader2 } from 'lucide-react';
import { ChatMessage } from './types';
import { sendGeminiMessage } from './services/geminiService';
import { MessageBubble } from './components/MessageBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Namaste! I am **Farmer Assist**. \n\nI can help you with:\n\n🌱 Crop recommendations based on soil & weather\n🌦️ Real-time weather updates\n🛒 **Amazon Deals** on agricultural tools & seeds\n\nI speak **English**, **Hindi**, and **Kannada**. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue('');

    // Add user message to state
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Exclude the very last message (the one we just added) to avoid duplication in history if logic changed,
      // but here we pass the current known history.
      const historyForApi = messages.filter(m => !m.isError); 
      
      const response = await sendGeminiMessage(historyForApi, userText);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        groundingChunks: response.groundingChunks,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I couldn't connect to the service right now. Please try again later.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-50 to-amber-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="flex-none bg-white/80 backdrop-blur-md border-b border-green-100 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-green-600 to-emerald-500 p-2 rounded-lg text-white">
              <Sprout size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600">
                Farmer Assist
              </h1>
              <p className="text-xs text-slate-500 font-medium">Smart Farming & Shopping Companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <Loader2 size={16} className="text-white animate-spin" />
                </div>
                <span className="text-sm text-slate-500 font-medium animate-pulse">
                  Searching for best crops & Amazon deals...
                </span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-none p-4 bg-white border-t border-green-100">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about crops, weather, or Amazon products (English/Hindi/Kannada)..."
            className="w-full pl-5 pr-14 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-50 transition-all outline-none text-slate-700 placeholder-slate-400 shadow-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <div className="max-w-3xl mx-auto mt-2 text-center">
          <p className="text-[10px] text-slate-400">
            Powered by Gemini 2.5 Flash & Google Search Grounding
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
