'use client';
import { useState, useRef, useEffect } from 'react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I am the Pincode Club AI. 🚀 I can help you find PIN codes, Bank IFSCs, or navigate the site. What are you looking for today?", isBot: true }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    // 1. Add User Message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput(''); // Clear input field

    // 2. Simulate AI Thinking and Replying (Dummy Logic for now)
    setTimeout(() => {
      let botReply = "I am an AI assistant in training! 🤖 Right now, you can use the Search bars on our website to find exact PIN Codes and Bank IFSCs.";
      
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
        botReply = "Hello there! 👋 How can I help you navigate Pincode Club today?";
      } else if (lowerInput.includes('pin') || lowerInput.includes('pincode')) {
        botReply = "Looking for a PIN code? Just head over to our 'PIN Codes' tab at the top and type your city or village name!";
      } else if (lowerInput.includes('bank') || lowerInput.includes('ifsc')) {
        botReply = "Need bank details? Click on the 'IFSC Directory' at the top to search through 1.8 Lakh+ bank branches across India.";
      } else if (lowerInput.includes('who are you') || lowerInput.includes('name')) {
        botReply = "I am Pincode AI, built exclusively for Pincode Club to assist users like you! 🚀";
      }

      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    }, 1000); // 1 second delay to feel like real typing
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex justify-between items-center shadow-md z-10">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="text-xl">🤖</span> Pincode AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {/* Chat Area */}
          <div className="p-4 h-72 overflow-y-auto space-y-4 bg-slate-800/50 flex flex-col custom-scrollbar">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`p-3 rounded-xl text-sm shadow-sm max-w-[85%] ${msg.isBot ? 'bg-slate-700 text-white rounded-tl-none' : 'bg-orange-500 text-white rounded-tr-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..." 
              className="w-full bg-slate-800 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors" 
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-orange-500/30 shadow-xl flex items-center justify-center hover:scale-110 transition-transform ml-auto border-2 border-slate-900"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <span className="text-3xl">🤖</span>
        )}
      </button>
    </div>
  );
}