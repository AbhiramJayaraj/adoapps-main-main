import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Share, Smartphone, CheckCircle, ChevronLeft, Monitor, Apple, Chrome } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">Install App</h1>
          <div className="w-6" />
        </div>

        {/* Hero */}
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl gym-gradient-orange shadow-lg">
            <img src="/pwa-icon-192.png" alt="Ado Work" className="h-20 w-20 rounded-2xl" />
          </div>
          <h2 className="mt-4 text-xl font-black">Ado Work</h2>
          <p className="text-xs text-muted-foreground mt-1">Install on your phone for the best experience</p>
        </div>

        {isInstalled ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-bold">Already Installed! 🎉</h3>
            <p className="text-xs text-muted-foreground">Ado Work is on your home screen. Open it from there for the full experience.</p>
          </div>
        ) : (
          <>
            {/* Install Button (Android/Desktop) */}
            {deferredPrompt && (
              <button onClick={handleInstall}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl gym-gradient-orange py-4 text-sm font-bold text-primary-foreground active:scale-95 transition-transform">
                <Download className="h-5 w-5" /> Install Ado Work
              </button>
            )}

            {/* Instructions */}
            <div className="mt-6 space-y-4">
              {/* iOS Instructions */}
              {isIOS && (
                <div className="gym-gradient-card rounded-2xl p-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Apple className="h-4 w-4 text-primary" /> Install on iPhone / iPad</h3>
                  <div className="mt-3 space-y-3">
                    {[
                      { step: "1", text: "Tap the Share button", icon: "📤", desc: "Bottom toolbar in Safari" },
                      { step: "2", text: "Scroll down and tap", icon: "➕", desc: "\"Add to Home Screen\"" },
                      { step: "3", text: "Tap \"Add\"", icon: "✅", desc: "App appears on home screen" },
                    ].map(s => (
                      <div key={s.step} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-primary">{s.step}</div>
                        <div>
                          <p className="text-xs font-semibold">{s.icon} {s.text}</p>
                          <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Android Instructions */}
              {!isIOS && !deferredPrompt && (
                <div className="gym-gradient-card rounded-2xl p-4">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Chrome className="h-4 w-4 text-primary" /> Install on Android</h3>
                  <div className="mt-3 space-y-3">
                    {[
                      { step: "1", text: "Open in Chrome browser", icon: "🌐", desc: "Must use Chrome for install" },
                      { step: "2", text: "Tap the menu (⋮)", icon: "📋", desc: "Top-right corner" },
                      { step: "3", text: "\"Add to Home Screen\"", icon: "➕", desc: "Or \"Install app\" if shown" },
                      { step: "4", text: "Tap \"Install\"", icon: "✅", desc: "App installs like a native app" },
                    ].map(s => (
                      <div key={s.step} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-black text-primary">{s.step}</div>
                        <div>
                          <p className="text-xs font-semibold">{s.icon} {s.text}</p>
                          <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="gym-gradient-card rounded-2xl p-4">
                <h3 className="text-sm font-bold mb-3">✨ Why install?</h3>
                <div className="space-y-2.5">
                  {[
                    { emoji: "⚡", title: "Instant Launch", desc: "Opens directly from home screen" },
                    { emoji: "📴", title: "Works Offline", desc: "Access workouts without internet" },
                    { emoji: "🖥️", title: "Full Screen", desc: "No browser bars — native app feel" },
                    { emoji: "🔔", title: "Notifications", desc: "Get workout reminders" },
                    { emoji: "💾", title: "Saves Data", desc: "Your progress is always saved" },
                  ].map(f => (
                    <div key={f.title} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2.5">
                      <span className="text-lg">{f.emoji}</span>
                      <div>
                        <p className="text-xs font-bold">{f.title}</p>
                        <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default Install;
