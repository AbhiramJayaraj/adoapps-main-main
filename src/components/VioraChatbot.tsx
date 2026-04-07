import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, ArrowUp, TriangleAlert, CheckCircle2, X } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface VioraChatbotProps {
  onClose: () => void;
  onAddCalories: (kcal: number) => void;
  targetCalories: number;
  consumedCalories: number;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  isHtml?: boolean;
  isLoading?: boolean;
}

export const VioraChatbot: React.FC<VioraChatbotProps> = ({ onClose, onAddCalories, targetCalories, consumedCalories }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      content: `Namaste! 🙏 I'm Viora. Tell me what you ate today (e.g., <span class="text-orange-400 font-medium">"2 butter chicken, 1 butter naan"</span>) and I'll track the calories & macros for you.`,
      isHtml: true,
    }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  
  // Custom styling elements to mirror HTML provided
  const bgStyle = {
    backgroundColor: '#050505',
    backgroundImage: 'radial-gradient(100% 50% at 50% 0%, #1c0e05 0%, #050505 100%)',
    backgroundAttachment: 'fixed',
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    
    const loadingId = 'loading-' + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: 'user-' + Date.now(), sender: 'user', content: userMsg },
      { 
        id: loadingId, 
        sender: 'bot', 
        isLoading: true,
        content: `
          <div class="flex items-center gap-1.5 px-2 py-1">
            <div class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-duration: 0.8s"></div>
            <div class="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style="animation-duration: 0.8s; animation-delay: 0.15s"></div>
            <div class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style="animation-duration: 0.8s; animation-delay: 0.3s"></div>
          </div>
        `,
        isHtml: true 
      }
    ]);

    try {
      const response = await callGemini(userMsg);
      setMessages((prev) => prev.filter(m => m.id !== loadingId));
      
      const messageHtml = `
        <div class="flex flex-col gap-3 w-full">
            <p class="font-medium text-white text-[15px] pb-2 border-b border-white/5">${response.summary}</p>
            <div class="bg-black/40 rounded-2xl border border-white/5 p-3 space-y-2.5">
                ${response.food_items.map((item: any) => `
                    <div class="flex flex-col gap-1.5 text-[14px] border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <div class="flex justify-between items-start">
                            <span class="text-neutral-200 font-medium max-w-[70%] leading-tight">${item.name}</span>
                            <span class="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">${item.calories} <span class="text-[10px] text-neutral-500 font-sans">kcal</span></span>
                        </div>
                        <div class="flex gap-3 text-[10px] font-mono tracking-wide text-neutral-500">
                            <span class="bg-white/5 px-2 py-0.5 rounded-full border border-white/5">P:${item.protein}</span>
                            <span class="bg-white/5 px-2 py-0.5 rounded-full border border-white/5">C:${item.carbs}</span>
                            <span class="bg-white/5 px-2 py-0.5 rounded-full border border-white/5">F:${item.fats}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="window.dispatchEvent(new CustomEvent('viora-add-calories', { detail: ${response.total_calories} }))" 
                class="mt-1 w-full bg-neutral-800/80 hover:bg-neutral-700 text-white text-sm py-3 rounded-2xl border border-white/10 font-semibold transition-all hover:border-orange-500/50 group active:scale-[0.98] shadow-lg">
                Log <span class="text-orange-400 group-hover:text-orange-300 transition-colors">+${response.total_calories}</span> calories
            </button>
        </div>
      `;
      setMessages((prev) => [...prev, { id: 'bot-' + Date.now(), sender: 'bot', content: messageHtml, isHtml: true }]);
    } catch (err: any) {
      setMessages((prev) => prev.filter(m => m.id !== loadingId));
      setMessages((prev) => [...prev, { 
        id: 'error-' + Date.now(), 
        sender: 'bot', 
        content: `<span class="text-rose-400 flex items-center gap-2">Error: ${err.message}</span>`, 
        isHtml: true 
      }]);
    }
  };

  useEffect(() => {
    const handleAddCalories = (e: any) => {
      onAddCalories(e.detail);
      setMessages((prev) => [...prev, {
        id: 'ack-' + Date.now(),
        sender: 'bot',
        content: `<span class="flex items-center gap-2 text-[14px]">Added ${e.detail} kcal to your daily log. Keep it up!</span>`,
        isHtml: true
      }]);
    };
    window.addEventListener('viora-add-calories', handleAddCalories);
    return () => window.removeEventListener('viora-add-calories', handleAddCalories);
  }, [onAddCalories]);

  const callGemini = async (prompt: string) => {
    // Attempt to use system env key, fallback to user provided one from their html
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBQ_fMH_R5TQ6XzuIAU80ITBpgRTZNvZ3c';
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    const systemContext = `You are Viora, a premium lifestyle Indian Diet AI Expert. The user will tell you what they ate. 
    Identify the Indian food items, estimate portions sensibly if not mentioned, and calculate calories, protein, carbs, and fats.
    Respond ONLY in JSON format like this:
    {"food_items": [{"name": "item", "calories": 100, "protein": 5, "carbs": 10, "fats": 2}], "total_calories": 100, "summary": "Nice choices! Here is the breakdown:"}`;

    const result = await model.generateContent(`${systemContext}\nUser input: ${prompt}`);
    const text = result.response.text();
    return JSON.parse(text);
  };

  const remaining = Math.max(targetCalories - consumedCalories, 0);
  const progressPct = Math.min((consumedCalories / targetCalories) * 100, 100);
  const isOver = consumedCalories > targetCalories;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col font-sans selection:bg-orange-500/30 overflow-hidden" style={bgStyle}>
      {/* Header & Progress */}
      <header className="bg-black/65 backdrop-blur-xl border-b border-white/10 relative z-20 shrink-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/25 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                        <Flame className="text-white w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-[22px] font-bold text-white tracking-tight leading-none mb-1">Viora</h1>
                        <p className="text-[11px] text-orange-400 font-semibold tracking-wider uppercase">Indian Diet AI</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block mb-0.5">Daily Target</span>
                        <p className="text-sm font-bold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{targetCalories} <span className="text-neutral-400 text-xs font-normal">kcal</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 active:scale-95 transition-all outline-none">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full">
                <div className="flex justify-between items-baseline mb-2">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-bold transition-colors duration-500 ${isOver ? 'text-rose-500' : 'text-white'}`}>{consumedCalories}</span>
                        <span className="text-xs text-neutral-500 font-medium">kcal consumed</span>
                    </div>
                    <span className="text-xs font-semibold text-orange-400">{remaining} left</span>
                </div>
                <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden border border-white/5 p-[1px] relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isOver ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-r from-orange-400 to-rose-500'}`} 
                      style={{ width: `${progressPct}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/30 to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 relative z-0 scroll-smooth" ref={chatRef}>
          {/* Faint grid background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto space-y-6 flex flex-col justify-end min-h-full pb-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-3 w-full animate-in slide-in-from-bottom-2 fade-in duration-300 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-md z-10 mb-1">
                      <Sparkles className="text-orange-400 w-3 h-3 fill-current" />
                  </div>
                )}
                
                <div className={`
                    max-w-[85%] text-[15px] leading-relaxed relative z-10 p-4 shadow-lg
                    ${msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-orange-500 to-rose-600 text-white rounded-[24px] rounded-br-sm shadow-[0_4px_20px_rgba(249,115,22,0.25)]' 
                      : 'bg-[#141414] border border-white/10 rounded-[24px] rounded-bl-sm text-neutral-200'}
                    ${msg.isLoading ? 'opacity-80 py-3 px-4' : ''}
                `}>
                    {msg.isHtml ? <div dangerouslySetInnerHTML={{ __html: msg.content }} /> : <p>{msg.content}</p>}
                </div>
              </div>
            ))}
          </div>
      </main>

      {/* Input Area */}
      <footer className="bg-black/65 backdrop-blur-xl border-t border-white/10 p-4 pb-6 pt-3 shrink-0 relative z-20">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
              <div className="flex gap-2 relative items-end">
                  <input 
                      type="text" 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your meal here..."
                      className="flex-1 bg-neutral-900/80 border border-neutral-700/50 text-white placeholder-neutral-500 rounded-full pl-5 pr-14 py-3.5 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-[15px] shadow-inner"
                  />
                  <button 
                      onClick={handleSendMessage}
                      className="absolute right-1.5 bottom-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-105 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all active:scale-95 group"
                  >
                      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
              </div>
              <p className="text-[9px] text-center text-neutral-600 font-semibold tracking-widest">POWERED BY GEMINI AI</p>
          </div>
      </footer>
    </div>
  );
};
