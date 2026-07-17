
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const AIAdvisor: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, timestamp: number }[]>(() => {
    const saved = localStorage.getItem('mahalak_chat_history');
    if (saved) return JSON.parse(saved);
    return [
      { 
        role: 'ai', 
        text: 'Namaste! Main Mahalak Consultants AI Consultant hoon. Main aapki architecture, interior design ya Vastu Shastra mein kaise madad kar sakta hoon?',
        timestamp: Date.now()
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('mahalak_chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm("Aap apni saari chat history mitaana chahte hain?")) {
      const initial: { role: 'user' | 'ai', text: string, timestamp: number }[] = [{ 
        role: 'ai', 
        text: 'Namaste! Main Mahalak Consultants AI Consultant hoon. Main aapki architecture, interior design ya Vastu Shastra mein kaise madad kar sakta hoon?',
        timestamp: Date.now()
      }];
      setMessages(initial);
      localStorage.removeItem('mahalak_chat_history');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessage = { role: 'user' as const, text: userMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are an expert AI Consultant for "Mahalak Consultants", a premium firm specializing in Architecture, Interior Design, Civil Engineering, and Vastu Shastra. 
          Your tone is professional, helpful, and sophisticated. 
          Keep your answers concise and focused on design and Vastu principles. 
          If a user asks about pricing or booking, direct them to use the 'Contact' page of the website. 
          Respond in the language the user uses (Hindi, English, or Hinglish).`,
          temperature: 0.7,
        },
      });

      const aiText = response.text || "Maafi chahta hoon, main abhi samajh nahi paaya. Kya aap fir se puch sakte hain?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI. Please try again later.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button Position Adjusted to be above BackToTop */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 md:bottom-28 right-6 md:right-8 w-12 h-12 md:w-16 md:h-16 rounded-full shadow-2xl z-[100] flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: accentColor, color: 'white' }}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-xl md:text-2xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -left-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }}></span>
            <span className="relative inline-flex rounded-full h-4 w-4" style={{ backgroundColor: accentColor }}></span>
          </span>
        )}
      </button>

      {/* Chat Window Position Adjusted */}
      {isOpen && (
        <div className="fixed bottom-40 md:bottom-44 right-6 md:right-8 w-[90vw] md:w-[400px] h-[550px] bg-white rounded-[2rem] shadow-2xl z-[100] border border-stone-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: accentColor }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="font-bold text-sm">Mahalak AI Advisor</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest">Chat History Saved</p>
              </div>
            </div>
            <button 
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-trash-can text-sm"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-stone-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-stone-900 text-white rounded-tr-none' 
                      : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[8px] mt-2 opacity-40 text-right`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-stone-100">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Vastu, Materials..."
              className="flex-grow px-4 py-3 bg-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="w-12 h-12 rounded-xl text-white flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};
