import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Mic, Loader2 } from "lucide-react";
import BottomNav from "./BottomNav";
import { VoiceTrainer } from "../services/ai/voiceTrainer";

const MobileLayout = ({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) => {
  const { pathname } = useLocation();

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleVoiceAssistant = async () => {
    if (isListening) return;
    setIsListening(true);
    try {
      await VoiceTrainer.listenAndAct();
    } catch (e) {
      console.error(e);
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background relative">
      <div className={hideNav ? "" : "pb-20"}>{children}</div>
      
      {/* Floating AI Coach Button */}
      <button 
        onClick={toggleVoiceAssistant}
        className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full gym-gradient-orange text-white shadow-xl shadow-primary/20 active:scale-95 transition-transform"
      >
        {isListening ? <Loader2 className="h-6 w-6 animate-spin" /> : <Mic className="h-6 w-6" />}
      </button>

      {!hideNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
