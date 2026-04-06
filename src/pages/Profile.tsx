import { ChevronLeft, Settings, Award, TrendingUp, Calendar, Target, X, Flame, Zap, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import ProgressRing from "@/components/ProgressRing";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

import { animalAvatars, avatarCategories } from "@/data/avatars";

// Only use real saved active days - no mock generation
const getActiveDays = (): string[] => {
  const saved = localStorage.getItem("ado-active-days");
  if (saved) return JSON.parse(saved);
  return [];
};

const calculateStreak = (activeDays: string[]): number => {
  if (activeDays.length === 0) return 0;
  const sorted = [...activeDays].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split("T")[0];
    if (sorted.includes(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
};

const getWeeklyActivity = (activeDays: string[]) => {
  const weeks: { week: string; days: number; minutes: number }[] = [];
  const now = new Date();
  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (w * 7 + weekStart.getDay()));
    let count = 0;
    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + d);
      if (activeDays.includes(day.toISOString().split("T")[0])) count++;
    }
    const label = w === 0 ? "This" : w === 1 ? "Last" : `${w}w`;
    weeks.push({ week: label, days: count, minutes: count * 35 });
  }
  return weeks;
};

const getMonthlyConsistency = (activeDays: string[]) => {
  const months: { month: string; percentage: number }[] = [];
  const now = new Date();
  for (let m = 5; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    let activeDaysInMonth = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(d.getFullYear(), d.getMonth(), day).toISOString().split("T")[0];
      if (activeDays.includes(dateStr)) activeDaysInMonth++;
    }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"];
    months.push({
      month: monthNames[d.getMonth()] || "?",
      percentage: daysInMonth > 0 ? Math.round((activeDaysInMonth / daysInMonth) * 100) : 0,
    });
  }
  return months;
};

// Track today as active when visiting profile
const markTodayActive = () => {
  const today = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem("ado-active-days");
  const days: string[] = saved ? JSON.parse(saved) : [];
  if (!days.includes(today)) {
    days.push(today);
    localStorage.setItem("ado-active-days", JSON.stringify(days));
  }
  return days;
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem("ado-avatar") || "wolf");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  // Mark today and get active days
  const activeDays = useMemo(() => markTodayActive(), []);
  const hasData = activeDays.length > 0;
  const streak = useMemo(() => calculateStreak(activeDays), [activeDays]);
  const weeklyData = useMemo(() => getWeeklyActivity(activeDays), [activeDays]);
  const consistencyData = useMemo(() => getMonthlyConsistency(activeDays), [activeDays]);
  const totalActiveDays = activeDays.length;

  const userName = localStorage.getItem("ado-user-name") || "User";
  const currentAvatar = animalAvatars.find(a => a.id === selectedAvatar) || animalAvatars[0];

  const handleAvatarSelect = (id: string) => {
    setBouncingId(id);
    setTimeout(() => {
      setSelectedAvatar(id);
      localStorage.setItem("ado-avatar", id);
      setBouncingId(null);
      setShowAvatarPicker(false);
      toast({ title: "Avatar updated!" });
    }, 400);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(calendarMonth.year, calendarMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarMonth.year, calendarMonth.month, 1).getDay();
  const today = new Date().toISOString().split("T")[0];

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [calendarMonth, daysInMonth, firstDayOfWeek]);

  const prevMonth = () => {
    setCalendarMonth(prev => ({
      year: prev.month === 0 ? prev.year - 1 : prev.year,
      month: prev.month === 0 ? 11 : prev.month - 1,
    }));
  };

  const nextMonth = () => {
    const now = new Date();
    const next = new Date(calendarMonth.year, calendarMonth.month + 1, 1);
    if (next > new Date(now.getFullYear(), now.getMonth() + 1, 0)) return;
    setCalendarMonth(prev => ({
      year: prev.month === 11 ? prev.year + 1 : prev.year,
      month: prev.month === 11 ? 0 : prev.month + 1,
    }));
  };

  const userWeight = localStorage.getItem("ado-user-weight") || "";
  const userHeight = localStorage.getItem("ado-user-height") || "";
  const userTargetWeight = localStorage.getItem("ado-user-target-weight") || "";
  const userGoal = localStorage.getItem("ado-user-goal") || "";
  const userExperience = localStorage.getItem("ado-user-experience") || "";
  const userDuration = localStorage.getItem("ado-user-workout-duration") || "";
  const userGender = localStorage.getItem("ado-user-gender") || "";
  const focusParts: string[] = JSON.parse(localStorage.getItem("ado-user-focus-parts") || "[]");

  const stats = [
    { icon: Calendar, label: "Days Active", value: totalActiveDays.toString() },
    { icon: TrendingUp, label: "Level", value: Math.max(1, Math.floor(totalActiveDays / 7)).toString() },
    { icon: Target, label: "Streak", value: streak > 0 ? `${streak}🔥` : "0" },
    { icon: Flame, label: "Goal", value: ({ lose: "Burn", gain: "Gain", maintain: "Keep", endurance: "Run", flexibility: "Flex", strength: "Lift" } as Record<string, string>)[userGoal] || "Fit" },
  ];

  const hasChartData = weeklyData.some(w => w.days > 0);

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">Profile</h1>
          <button onClick={() => navigate("/settings")} className="p-1 transition-transform active:scale-90"><Settings className="h-5 w-5 text-muted-foreground" /></button>
        </div>

        {/* Avatar */}
        <div className="mt-6 flex flex-col items-center">
          <button onClick={() => setShowAvatarPicker(true)} className="relative transition-transform active:scale-90 hover:scale-105">
            <ProgressRing progress={hasData ? Math.min(100, totalActiveDays * 2) : 0} size={100} strokeWidth={4} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-3xl">{currentAvatar.emoji}</div>
            </div>
          </button>
          <h2 className="mt-3 text-lg font-bold">{userName}</h2>
          <p className="text-xs text-muted-foreground">{(() => { const g = localStorage.getItem("ado-user-goal"); const map: Record<string, string> = { lose: "Fat Burner", gain: "Muscle Builder", maintain: "Fitness Keeper", endurance: "Endurance Runner", flexibility: "Flexibility Pro", strength: "Strength Athlete" }; return map[g || ""] || "Fitness Enthusiast"; })()} · Level {Math.max(1, Math.floor(totalActiveDays / 7))}</p>
        </div>

        {/* Streak Banner */}
        {streak > 0 ? (
          <div className="mt-5 relative overflow-hidden rounded-2xl gym-gradient-orange p-4">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary-foreground/10" />
            <div className="absolute right-8 bottom-1 h-12 w-12 rounded-full bg-primary-foreground/5" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/20">
                <span className="text-3xl">🔥</span>
              </div>
              <div>
                <p className="text-2xl font-black text-primary-foreground">{streak} Day Streak!</p>
                <p className="text-[10px] text-primary-foreground/70">Keep going — consistency beats intensity</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl gym-gradient-card p-5 text-center">
            <span className="text-3xl">🚀</span>
            <p className="mt-2 text-sm font-bold">Start your streak!</p>
            <p className="text-[10px] text-muted-foreground mt-1">Use the app daily to build your streak</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {stats.map(stat => (
            <div key={stat.label} className="gym-gradient-card rounded-xl p-3 text-center transition-transform active:scale-95">
              <stat.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 text-base font-bold">{stat.value}</p>
              <p className="text-[8px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* User Info Card */}
        {(userWeight || userHeight || userGoal) && (
          <div className="mt-4 gym-gradient-card rounded-2xl p-4">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" /> My Profile
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                userGender && { label: "Gender", value: userGender.charAt(0).toUpperCase() + userGender.slice(1), emoji: "👤" },
                userHeight && { label: "Height", value: `${userHeight} cm`, emoji: "📏" },
                userWeight && { label: "Weight", value: `${userWeight} kg`, emoji: "⚖️" },
                userTargetWeight && { label: "Target", value: `${userTargetWeight} kg`, emoji: "🎯" },
                userDuration && { label: "Session", value: `${userDuration} min`, emoji: "⏱️" },
                userExperience && { label: "Level", value: userExperience.charAt(0).toUpperCase() + userExperience.slice(1), emoji: "🌱" },
              ].filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2.5">
                  <span className="text-sm">{item!.emoji}</span>
                  <div>
                    <p className="text-[8px] text-muted-foreground">{item!.label}</p>
                    <p className="text-[11px] font-bold">{item!.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {focusParts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {focusParts.map(p => (
                  <span key={p} className="rounded-full bg-primary/15 px-2 py-0.5 text-[8px] font-bold text-primary">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity Calendar */}
        <div className="mt-5 gym-gradient-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Activity Calendar</h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-1 rounded-full bg-secondary active:scale-90 transition-transform">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] font-semibold w-24 text-center">
                {monthNames[calendarMonth.month]} {calendarMonth.year}
              </span>
              <button onClick={nextMonth} className="p-1 rounded-full bg-secondary active:scale-90 transition-transform">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} className="text-center text-[8px] font-bold text-muted-foreground">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="h-8" />;
              const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isActive = activeDays.includes(dateStr);
              const isToday = dateStr === today;
              const isFuture = dateStr > today;

              return (
                <div key={dateStr} className={`flex h-8 items-center justify-center rounded-lg text-[10px] font-semibold transition-all ${
                  isToday ? "ring-2 ring-primary" : ""
                } ${isActive ? "bg-primary text-primary-foreground" : isFuture ? "text-muted-foreground/30" : "text-muted-foreground bg-secondary/30"}`}>
                  {day}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 mt-3 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-primary" />
              <span className="text-[9px] text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-secondary/30" />
              <span className="text-[9px] text-muted-foreground">Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded ring-2 ring-primary" />
              <span className="text-[9px] text-muted-foreground">Today</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        {hasChartData ? (
          <div className="mt-4 gym-gradient-card rounded-2xl p-4">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" /> Weekly Activity
            </h3>
            <p className="text-[10px] text-muted-foreground mb-3">Active days & workout minutes per week</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "11px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number, name: string) => [value, name === "days" ? "Active Days" : "Minutes"]}
                  />
                  <Bar dataKey="days" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="days" />
                  <Bar dataKey="minutes" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} name="minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-primary" />
                <span className="text-[9px] text-muted-foreground">Active Days</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded bg-primary/30" />
                <span className="text-[9px] text-muted-foreground">Minutes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 gym-gradient-card rounded-2xl p-5 text-center">
            <Zap className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-xs font-bold">No activity data yet</p>
            <p className="text-[10px] text-muted-foreground mt-1">Start tracking workouts to see your weekly activity graph</p>
          </div>
        )}

        {/* Consistency Graph */}
        {hasChartData ? (
          <div className="mt-4 gym-gradient-card rounded-2xl p-4">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" /> Consistency Score
            </h3>
            <p className="text-[10px] text-muted-foreground mb-3">% of days active each month</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consistencyData}>
                  <defs>
                    <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={30}
                    domain={[0, 100]} tickFormatter={v => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      fontSize: "11px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value}%`, "Consistency"]}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2.5}
                    fill="url(#consistencyGrad)" dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--card))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-[10px] text-muted-foreground">Average Consistency:</span>
              <span className="text-sm font-black text-primary">
                {Math.round(consistencyData.reduce((s, d) => s + d.percentage, 0) / consistencyData.length)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 gym-gradient-card rounded-2xl p-5 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-2 text-xs font-bold">No consistency data yet</p>
            <p className="text-[10px] text-muted-foreground mt-1">Use the app regularly to see your consistency score</p>
          </div>
        )}

        {/* This Week Bar */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <h3 className="text-sm font-bold">This Week</h3>
          <div className="mt-3 space-y-2.5">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const now = new Date();
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay() + 1 + i);
              const dateStr = startOfWeek.toISOString().split("T")[0];
              const isActive = activeDays.includes(dateStr);
              const isFuture = dateStr > today;
              const val = isActive ? 100 : 0;
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className={`w-8 text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${isActive ? "bg-primary" : "bg-muted-foreground/20"}`}
                      style={{ width: isFuture ? "0%" : `${val}%` }} />
                  </div>
                  <span className="w-10 text-right text-[10px] font-semibold">
                    {isFuture ? "—" : isActive ? "Active" : "Rest"}
                  </span>
                  {isActive && <span className="text-[10px]">✅</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Avatar Picker */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60" onClick={() => setShowAvatarPicker(false)}>
          <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8 animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Choose Your Avatar</h2>
              <button onClick={() => setShowAvatarPicker(false)} className="p-1"><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>
            {avatarCategories.map(cat => (
              <div key={cat} className="mt-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
                <div className="grid grid-cols-4 gap-2">
                  {animalAvatars.filter(a => a.category === cat).map(avatar => (
                    <button key={avatar.id} onClick={() => handleAvatarSelect(avatar.id)}
                      className={`flex flex-col items-center gap-1 rounded-2xl p-2.5 transition-all duration-300 ${bouncingId === avatar.id ? "animate-bounce scale-110" : ""} ${selectedAvatar === avatar.id ? "ring-2 ring-primary bg-primary/10 scale-105" : "gym-gradient-card active:scale-90 hover:scale-105"}`}>
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

export default Profile;
