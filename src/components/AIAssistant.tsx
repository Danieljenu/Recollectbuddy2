import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Check, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIAssistantProps {
  onAddTask: (title: string, category: string) => void;
  onAddEvent: (title: string, date: string, time: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function AIAssistant({ onAddTask, onAddEvent, onShowToast }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am RecollectBuddy, your personal AI productivity companion. How can I help you organize your tasks, habits, or files today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  const quickPrompts = [
    'How do I stay more focused today?',
    'Plan a 3-step study block',
    'Draft a Google Drive project note outline',
    'Suggest a daily habit for productivity',
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'I apologize, I encountered a temporary connection issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I failed to receive response from the server. Please verify your GEMINI_API_KEY configuration.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: 'task' | 'event', text: string) => {
    if (type === 'task') {
      onAddTask(text, 'Work');
      onShowToast(`Success: Added task "${text}" to Work category!`, 'success');
    } else if (type === 'event') {
      const today = new Date().toISOString().split('T')[0];
      onAddEvent(text, today, '12:00 PM');
      onShowToast(`Success: Added event "${text}" to today's schedule!`, 'success');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] bg-[#121212] border border-neutral-800 rounded-none overflow-hidden relative">
      <div className="absolute top-0 left-0 w-16 h-1 bg-white z-10"></div>
      
      {/* Header */}
      <div className="p-5 border-b border-neutral-800 bg-[#161616] flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-900 border border-neutral-800 rounded">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-widest font-sans uppercase">RecollectBuddy AI Assistant</h2>
            <span className="text-[9px] text-[#00FF00] font-mono tracking-wider block mt-0.5">SYSTEM_ONLINE_OK</span>
          </div>
        </div>
        <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-amber-400">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0E0E0E]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="h-8 w-8 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex flex-col space-y-1.5 max-w-[80%]">
              <div
                className={`p-4 rounded-none text-xs leading-relaxed font-sans ${
                  msg.sender === 'user'
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#161616] text-neutral-200 border border-neutral-800 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>

                {/* Offer actionable buttons for specific topics */}
                {msg.sender === 'ai' && (msg.text.toLowerCase().includes('task') || msg.text.toLowerCase().includes('plan')) && (
                  <div className="mt-4 pt-3 border-t border-neutral-850 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAction('task', 'Complete requested action')}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all"
                    >
                      <Plus className="h-3 w-3" />
                      Create Task
                    </button>
                    <button
                      onClick={() => handleAction('event', 'Focus block based on AI')}
                      className="inline-flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all border border-neutral-750"
                    >
                      <Plus className="h-3 w-3" />
                      Schedule Focus Block
                    </button>
                  </div>
                )}
              </div>
              <span className={`text-[9px] text-neutral-500 font-mono tracking-wider ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-none bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-neutral-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="h-8 w-8 rounded-none bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="p-4 bg-[#161616] text-neutral-400 border border-neutral-800 rounded-none shadow-sm flex items-center gap-2.5">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
              <span className="text-[10px] font-mono uppercase tracking-widest">AWAITING_GEMINI_API_RESPONSE...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-neutral-800 bg-[#121212] space-y-4">
        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-mono uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white px-3.5 py-2 rounded transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything... (e.g. Help me plan my day)"
            disabled={loading}
            className="flex-1 bg-[#161616] border border-neutral-800 focus:border-neutral-500 rounded-none px-4 py-3.5 text-xs focus:outline-none transition-all placeholder:text-neutral-600 text-white font-sans"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="bg-white hover:bg-neutral-200 disabled:bg-neutral-900 text-black disabled:text-neutral-700 font-bold uppercase tracking-widest text-xs px-5 py-3.5 rounded-none transition-all flex items-center justify-center shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
