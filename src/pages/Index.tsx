import { Dumbbell, UtensilsCrossed, ArrowRight, ChevronRight, Flame, Target, Bell, X, Plus, Trash2, TrendingUp, Settings, UserCircle, Clock, CheckCircle, Apple, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MobileLayout from "@/components/MobileLayout";
import ProgressRing from "@/components/ProgressRing";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

const bodyParts = [
  { id: "chest", emoji: "🫁", label: "Chest" },
  { id: "back", emoji: "🔙", label: "Back" },
  { id: "shoulders", emoji: "🤷", label: "Shoulders" },
  { id: "arms", emoji: "💪", label: "Arms" },
  { id: "forearms", emoji: "🦾", label: "Forearms" },
  { id: "legs", emoji: "🦵", label: "Quads" },
  { id: "hamstrings", emoji: "🦿", label: "Hamstrings" },
  { id: "core", emoji: "🔥", label: "Core" },
  { id: "obliques", emoji: "↔️", label: "Obliques" },
  { id: "glutes", emoji: "🍑", label: "Glutes" },
  { id: "calves", emoji: "🏔️", label: "Calves" },
  { id: "neck", emoji: "🦴", label: "Neck" },
  { id: "traps", emoji: "🔺", label: "Traps" },
  { id: "lats", emoji: "🔱", label: "Lats" },
  { id: "lower-back", emoji: "⬇️", label: "Lower Back" },
  { id: "hip-flexors", emoji: "🧘", label: "Hip Flexors" },
  { id: "rear-delts", emoji: "🎯", label: "Rear Delts" },
];

import { animalAvatars, avatarCategories } from "@/data/avatars";

interface WorkoutHistoryEntry {
  id: string;
  name: string;
  date: string;
  duration: string;
  calories: number;
  bodyPart: string;
}

const defaultWorkoutHistory: WorkoutHistoryEntry[] = [
  { id: "1", name: "Upper Body Blast", date: "Today", duration: "35 min", calories: 280, bodyPart: "💪" },
  { id: "2", name: "Core Destroyer", date: "Yesterday", duration: "20 min", calories: 180, bodyPart: "🔥" },
  { id: "3", name: "Leg Day Crusher", date: "2 days ago", duration: "40 min", calories: 350, bodyPart: "🦵" },
  { id: "4", name: "Cardio HIIT", date: "3 days ago", duration: "25 min", calories: 400, bodyPart: "🏃" },
  { id: "5", name: "Morning Stretch", date: "4 days ago", duration: "15 min", calories: 80, bodyPart: "🧘" },
];

const defaultReminders: Reminder[] = [
  { id: "1", label: "Morning Workout", time: "07:00", enabled: true },
  { id: "2", label: "Protein Shake", time: "08:00", enabled: false },
  { id: "3", label: "Stretch Break", time: "12:00", enabled: true },
  { id: "4", label: "Evening Run", time: "18:00", enabled: false },
  { id: "5", label: "Hydration Check", time: "10:00", enabled: true },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showReminders, setShowReminders] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem("ado-avatar") || "wolf");
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("ado-reminders");
    return saved ? JSON.parse(saved) : defaultReminders;
  });
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [workoutHistory] = useState<WorkoutHistoryEntry[]>(() => {
    const saved = localStorage.getItem("ado-workout-history");
    return saved ? JSON.parse(saved) : defaultWorkoutHistory;
  });

  // Mark today as active for tracking
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const saved = localStorage.getItem("ado-active-days");
    const days: string[] = saved ? JSON.parse(saved) : [];
    if (!days.includes(today)) {
      days.push(today);
      localStorage.setItem("ado-active-days", JSON.stringify(days));
    }
  }, []);

  useEffect(() => { localStorage.setItem("ado-reminders", JSON.stringify(reminders)); }, [reminders]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    const intervals: ReturnType<typeof setInterval>[] = [];
    reminders.filter(r => r.enabled).forEach(r => {
      const iv = setInterval(() => {
        const now = new Date();
        const [h, m] = r.time.split(":").map(Number);
        if (now.getHours() === h && now.getMinutes() === m && now.getSeconds() === 0) {
          if ("Notification" in window && Notification.permission === "granted") new Notification("Ado Work Reminder", { body: r.label });
        }
      }, 1000);
      intervals.push(iv);
    });
    return () => intervals.forEach(clearInterval);
  }, [reminders]);

  const addReminder = () => {
    if (!newLabel.trim()) return;
    setReminders(prev => [...prev, { id: Date.now().toString(), label: newLabel, time: newTime, enabled: true }]);
    setNewLabel(""); setNewTime("09:00");
    toast({ title: "Reminder set!", description: `${newLabel} at ${newTime}` });
  };

  const handleBodyPartClick = (id: string) => {
    setBouncingId(id);
    setTimeout(() => { setBouncingId(null); navigate(`/body/${id}`); }, 400);
  };

  const handleAvatarSelect = (id: string) => {
    setBouncingId(id);
    setTimeout(() => {
      setSelectedAvatar(id);
      localStorage.setItem("ado-avatar", id);
      setBouncingId(null);
      setShowAvatarPicker(false);
      toast({ title: "Avatar updated!", description: `You are now ${animalAvatars.find(a => a.id === id)?.name}` });
    }, 400);
  };

  const currentAvatar = animalAvatars.find(a => a.id === selectedAvatar) || animalAvatars[0];
  const userName = localStorage.getItem("ado-user-name") || currentAvatar.name;

  // Compute real data from onboarding + tracking
  const userWeight = parseInt(localStorage.getItem("ado-user-weight") || "70");
  const userGoal = localStorage.getItem("ado-user-goal") || "";
  const goalAdjust: Record<string, number> = { lose: -500, gain: 300, maintain: 0, endurance: 200, flexibility: -200, strength: 400 };
  const dailyCalorieTarget = userWeight * 30 + (goalAdjust[userGoal] || 0);
  const dailyBurnTarget = Math.round(dailyCalorieTarget * 0.25);

  const dietLog: { date: string; calories: number }[] = JSON.parse(localStorage.getItem("ado-diet-log") || "[]");
  const today = new Date().toISOString().split("T")[0];
  const todayCalories = dietLog.filter(l => l.date === today).reduce((s, l) => s + l.calories, 0);

  const workoutLog: { date: string; calories: number }[] = JSON.parse(localStorage.getItem("ado-workout-log") || "[]");
  const todayBurnt = workoutLog.filter(l => l.date === today).reduce((s, l) => s + l.calories, 0);

  const goalProgress = dailyCalorieTarget > 0 ? Math.min(100, Math.round((todayCalories / dailyCalorieTarget) * 100)) : 0;

  const activeDaysList: string[] = JSON.parse(localStorage.getItem("ado-active-days") || "[]");
  const userLevel = Math.max(1, Math.floor(activeDaysList.length / 7));
  const totalSessions = activeDaysList.length;

  return (
    <MobileLayout>
      <div className="animate-fade-in space-y-5 px-4 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate("/growth")} className="flex items-center gap-2 rounded-full border border-border px-3 py-2 transition-transform active:scale-95">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold">Lvl {userLevel}</span>
          </button>
          <h1 className="text-lg font-bold">Ado Work</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/install")} className="rounded-full border border-border p-2 transition-transform active:scale-95">
              <Download className="h-4 w-4" />
            </button>
            <button onClick={() => navigate("/settings")} className="rounded-full border border-border p-2 transition-transform active:scale-95">
              <Settings className="h-4 w-4" />
            </button>
            <button onClick={() => setShowReminders(true)} className="relative rounded-full border border-border p-2 transition-transform active:scale-95">
              <Bell className="h-4 w-4" />
              {reminders.filter(r => r.enabled).length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {reminders.filter(r => r.enabled).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Avatar + Greeting */}
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAvatarPicker(true)} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-2xl transition-transform active:scale-90 hover:scale-105">
            {currentAvatar.emoji}
          </button>
          <div>
            <p className="text-sm font-bold">Hey, {userName}! 💪</p>
            <p className="text-[10px] text-muted-foreground">Today's workout: {localStorage.getItem("ado-user-workout-duration") || "45"} min · {(() => { const g = localStorage.getItem("ado-user-goal"); const map: Record<string, string> = { lose: "Burn fat", gain: "Build muscle", maintain: "Stay fit", endurance: "Cardio", flexibility: "Mobility", strength: "Strength" }; return map[g || ""] || "Stay active"; })()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button onClick={() => navigate("/workout")} className="flex flex-1 items-center gap-2 rounded-full gym-gradient-orange px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
            <Dumbbell className="h-4 w-4" /> Track Workout
          </button>
          <button onClick={() => navigate("/diet")} className="flex flex-1 items-center gap-2 rounded-full gym-gradient-orange px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
            <UtensilsCrossed className="h-4 w-4" /> Track Diet
          </button>
        </div>

        {/* Track Your Goal */}
        <div>
          <h2 className="mb-3 text-lg font-bold">Track your goal</h2>
          <div className="gym-gradient-card rounded-2xl p-4">
            <div className="flex items-center gap-4">
              <ProgressRing progress={goalProgress} size={70} strokeWidth={5} />
              <div className="flex-1 space-y-3">
                <button onClick={() => navigate("/diet-insight")} className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20"><UtensilsCrossed className="h-3.5 w-3.5 text-primary" /></div>
                    <div className="text-left">
                      <p className="text-sm font-bold"><span className="text-foreground">{todayCalories.toLocaleString()}</span><span className="text-muted-foreground text-xs">/{dailyCalorieTarget.toLocaleString()} Kcal</span></p>
                      <p className="text-[10px] text-muted-foreground">Calories Consumed</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <button onClick={() => navigate("/diet-insight")} className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gym-green/20"><Flame className="h-3.5 w-3.5 text-gym-green" /></div>
                    <div className="text-left">
                      <p className="text-sm font-bold"><span className="text-foreground">{todayBurnt.toLocaleString()}</span><span className="text-muted-foreground text-xs">/{dailyBurnTarget.toLocaleString()} Kcal</span></p>
                      <p className="text-[10px] text-muted-foreground">Calories Burnt</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Diet Plan Card */}
        <button onClick={() => navigate("/diet-plan")} className="w-full relative overflow-hidden gym-gradient-card rounded-2xl p-4 transition-transform active:scale-[0.98]">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" />
          <div className="absolute -right-2 bottom--2 h-16 w-16 rounded-full bg-primary/5" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
              <Apple className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold">Diet Plan</p>
              <p className="text-[10px] text-muted-foreground">Personalized meal plans with macro tracking</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">6 diet types</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">4 goals</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">Full macros</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </button>

        {/* Select My Work */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Select My Work</h2>
            <button onClick={() => navigate("/body-selector")} className="flex items-center gap-1 text-[10px] font-semibold text-primary">
              <UserCircle className="h-3.5 w-3.5" /> Full Body Model <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <button onClick={() => navigate("/body-selector")} className="w-full gym-gradient-card rounded-2xl p-4 transition-transform active:scale-[0.98]">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 80 140" className="h-24 w-16 shrink-0 body-glow">
                <ellipse cx="40" cy="12" rx="8" ry="10" className="fill-primary/30 stroke-primary/50 muscle-breathe" strokeWidth="1" />
                <rect x="30" y="22" width="20" height="40" rx="5" className="fill-primary/20 stroke-primary/50 body-pulse" strokeWidth="1" />
                <rect x="15" y="26" width="10" height="30" rx="4" className="fill-primary/15 stroke-primary/40 body-pulse" strokeWidth="1" style={{ animationDelay: "0.5s" }} />
                <rect x="55" y="26" width="10" height="30" rx="4" className="fill-primary/15 stroke-primary/40 body-pulse" strokeWidth="1" style={{ animationDelay: "0.7s" }} />
                <rect x="30" y="64" width="10" height="35" rx="4" className="fill-primary/15 stroke-primary/40 body-pulse" strokeWidth="1" style={{ animationDelay: "0.3s" }} />
                <rect x="42" y="64" width="10" height="35" rx="4" className="fill-primary/15 stroke-primary/40 body-pulse" strokeWidth="1" style={{ animationDelay: "0.6s" }} />
                <ellipse cx="35" cy="103" rx="6" ry="3" className="fill-primary/10 stroke-primary/30" strokeWidth="0.5" />
                <ellipse cx="47" cy="103" rx="6" ry="3" className="fill-primary/10 stroke-primary/30" strokeWidth="0.5" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-bold">Tap to select body part</p>
                <p className="text-[10px] text-muted-foreground mt-1">Interactive body model with equipment selection</p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">11 body parts</span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">8 equipment</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Target Body Part Grid */}
        <div>
          <h2 className="mb-3 text-sm font-bold">Target Body Part</h2>
          <div className="grid grid-cols-4 gap-2">
            {bodyParts.map(part => (
              <button key={part.id} onClick={() => handleBodyPartClick(part.id)}
                className={`gym-gradient-card flex flex-col items-center gap-1.5 rounded-2xl p-2.5 transition-all ${
                  bouncingId === part.id ? "animate-bounce scale-110" : "active:scale-95"
                }`}
              >
                <span className="text-xl">{part.emoji}</span>
                <span className="text-[9px] font-semibold">{part.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Workout History */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Workout History</h2>
            <button onClick={() => navigate("/workout")} className="text-[10px] font-semibold text-primary flex items-center gap-1">
              View All <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {workoutHistory.slice(0, 4).map(entry => (
              <div key={entry.id} className="flex items-center gap-3 gym-gradient-card rounded-2xl p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-xl">{entry.bodyPart}</div>
                <div className="flex-1">
                  <p className="text-xs font-bold">{entry.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{entry.duration}</span>
                    <span className="text-[9px] text-muted-foreground flex items-center gap-0.5"><Flame className="h-2.5 w-2.5" />{entry.calories} cal</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground">{entry.date}</p>
                  <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* My Fitness Goal */}
        <div className="gym-gradient-card overflow-hidden rounded-2xl">
          <div className="gym-gradient-orange py-3 text-center">
            <h3 className="text-sm font-bold text-primary-foreground">My Fitness Goal</h3>
          </div>
          <div className="relative p-4">
            <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">{totalSessions > 0 ? `${Math.min(100, Math.round((totalSessions / 365) * 100))}%` : "0%"}</div>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20"><Target className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xl font-bold">{totalSessions}<span className="text-xs text-muted-foreground">/365</span></p>
                  <p className="text-[10px] text-muted-foreground">Active Days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20"><Target className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xl font-bold">{(() => { const g = localStorage.getItem("ado-user-goal"); const map: Record<string, string> = { lose: "🔥 Lose", gain: "💪 Gain", maintain: "⚖️ Keep", endurance: "🏃 Cardio", flexibility: "🧘 Flex", strength: "🏋️ Strong" }; return map[g || ""] || "🎯 Fit"; })()}</p>
                  <p className="text-[10px] text-muted-foreground">Current Goal</p>
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/diet-insight")} className="mt-4 flex w-full items-center justify-center gap-1 rounded-lg border border-border py-2.5 text-xs font-semibold text-foreground transition-colors active:bg-secondary">
              View Goal Analysis <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Reminders Modal */}
      {showReminders && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60" onClick={() => setShowReminders(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Reminders</h2>
              <button onClick={() => setShowReminders(false)} className="p-1"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" placeholder="Reminder label..." value={newLabel} onChange={e => setNewLabel(e.target.value)} className="flex-1 rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none" />
              <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} className="w-24 rounded-xl bg-secondary px-2 py-2.5 text-xs text-foreground outline-none" />
              <button onClick={addReminder} className="flex items-center justify-center rounded-xl bg-primary px-3 text-primary-foreground active:scale-95 transition-transform"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {reminders.length === 0 && <p className="text-center text-xs text-muted-foreground py-6">No reminders set</p>}
              {reminders.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
                  <button onClick={() => setReminders(prev => prev.map(x => x.id === r.id ? { ...x, enabled: !x.enabled } : x))} className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${r.enabled ? "border-primary bg-primary" : "border-muted-foreground"}`}>
                    {r.enabled && <svg className="h-full w-full text-primary-foreground" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                  </button>
                  <div className="flex-1">
                    <p className="text-xs font-semibold">{r.label}</p>
                    <p className="text-[10px] text-muted-foreground">{r.time}</p>
                  </div>
                  <button onClick={() => setReminders(prev => prev.filter(x => x.id !== r.id))} className="p-1"><Trash2 className="h-3.5 w-3.5 text-muted-foreground" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60" onClick={() => setShowAvatarPicker(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8 animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Choose Your Avatar</h2>
              <button onClick={() => setShowAvatarPicker(false)} className="p-1"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Pick your spirit animal 🔥</p>
            {avatarCategories.map(cat => (
              <div key={cat} className="mt-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
                <div className="grid grid-cols-4 gap-2">
                  {animalAvatars.filter(a => a.category === cat).map(avatar => (
                    <button key={avatar.id} onClick={() => handleAvatarSelect(avatar.id)}
                      className={`flex flex-col items-center gap-1 rounded-2xl p-2.5 transition-all duration-300 ${
                        bouncingId === avatar.id ? "animate-bounce scale-110" : ""
                      } ${selectedAvatar === avatar.id ? "ring-2 ring-primary bg-primary/10 scale-105" : "gym-gradient-card active:scale-90 hover:scale-105"}`}
                    >
                      <span className="text-xl">{avatar.emoji}</span>
                      <span className="text-[7px] font-bold leading-tight text-center">{avatar.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MobileLayout>
  );
};

export default Index;
