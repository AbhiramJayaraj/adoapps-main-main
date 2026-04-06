import { ChevronLeft, TrendingUp, Clock, Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";

const bodyPartProgress = [
  { part: "Chest", progress: 72, sessions: 14 },
  { part: "Back", progress: 65, sessions: 11 },
  { part: "Shoulders", progress: 58, sessions: 9 },
  { part: "Arms", progress: 80, sessions: 18 },
  { part: "Legs", progress: 45, sessions: 7 },
  { part: "Core", progress: 70, sessions: 13 },
];

const weeklyProgress = [
  { week: "W1", workouts: 3 },
  { week: "W2", workouts: 4 },
  { week: "W3", workouts: 5 },
  { week: "W4", workouts: 3 },
  { week: "W5", workouts: 6 },
  { week: "W6", workouts: 4 },
  { week: "W7", workouts: 5 },
  { week: "W8", workouts: 7 },
];

const getLevelInfo = (xp: number) => {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const titles = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite", "Beast", "Legend", "Titan", "Immortal", "God Mode"];
  return { level, progress, title: titles[Math.min(level - 1, titles.length - 1)] };
};

const GrowthStatus = () => {
  const navigate = useNavigate();
  const xp = 340;
  const { level, progress, title } = getLevelInfo(xp);
  const todayWorkoutMinutes = 45;

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Growth Status</h1>
          <div className="w-6" />
        </div>

        {/* Level Card */}
        <div className="mt-4 gym-gradient-orange rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/70">Your Level</p>
              <p className="text-2xl font-black text-primary-foreground">Level {level}</p>
              <p className="text-xs font-semibold text-primary-foreground/80">{title}</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-primary-foreground/70">
              <span>{progress} XP</span>
              <span>100 XP to next level</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-primary-foreground/20">
              <div className="h-full rounded-full bg-primary-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="gym-gradient-card rounded-2xl p-3 text-center">
            <Clock className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-xl font-bold">{todayWorkoutMinutes}</p>
            <p className="text-[10px] text-muted-foreground">Minutes Today</p>
          </div>
          <div className="gym-gradient-card rounded-2xl p-3 text-center">
            <Flame className="mx-auto h-5 w-5 text-destructive" />
            <p className="mt-1 text-xl font-bold">320</p>
            <p className="text-[10px] text-muted-foreground">Calories Today</p>
          </div>
        </div>

        {/* Human Body Representation */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-3">Body Progress Map</h3>
          <div className="flex items-center gap-4">
            {/* Simplified human body SVG */}
            <div className="relative w-24 shrink-0">
              <svg viewBox="0 0 100 200" className="w-full">
                {/* Head */}
                <circle cx="50" cy="22" r="14" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity={0.8} />
                {/* Neck */}
                <line x1="50" y1="36" x2="50" y2="44" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
                {/* Shoulders */}
                <path d="M 25 55 Q 50 44 75 55" fill="none" stroke={`hsl(${bodyPartProgress[2].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="3" />
                {/* Chest */}
                <ellipse cx="50" cy="70" rx="22" ry="16" fill="none" stroke={`hsl(${bodyPartProgress[0].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="2.5" opacity={bodyPartProgress[0].progress / 100} />
                <ellipse cx="50" cy="70" rx="22" ry="16" fill={`hsl(var(--primary))`} opacity={bodyPartProgress[0].progress / 400} />
                {/* Core */}
                <rect x="35" y="86" width="30" height="25" rx="4" fill="none" stroke={`hsl(${bodyPartProgress[5].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="2" opacity={bodyPartProgress[5].progress / 100} />
                <rect x="35" y="86" width="30" height="25" rx="4" fill={`hsl(var(--primary))`} opacity={bodyPartProgress[5].progress / 400} />
                {/* Arms */}
                <line x1="25" y1="55" x2="12" y2="95" stroke={`hsl(${bodyPartProgress[3].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="4" strokeLinecap="round" opacity={bodyPartProgress[3].progress / 100 + 0.3} />
                <line x1="75" y1="55" x2="88" y2="95" stroke={`hsl(${bodyPartProgress[3].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="4" strokeLinecap="round" opacity={bodyPartProgress[3].progress / 100 + 0.3} />
                {/* Legs */}
                <line x1="40" y1="111" x2="32" y2="170" stroke={`hsl(${bodyPartProgress[4].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="5" strokeLinecap="round" opacity={bodyPartProgress[4].progress / 100 + 0.3} />
                <line x1="60" y1="111" x2="68" y2="170" stroke={`hsl(${bodyPartProgress[4].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="5" strokeLinecap="round" opacity={bodyPartProgress[4].progress / 100 + 0.3} />
                {/* Back indicator */}
                <line x1="50" y1="50" x2="50" y2="86" stroke={`hsl(${bodyPartProgress[1].progress > 50 ? 'var(--primary)' : 'var(--muted-foreground)'})`} strokeWidth="2" strokeDasharray="3,3" opacity={bodyPartProgress[1].progress / 100 + 0.3} />
              </svg>
            </div>

            {/* Body Part Stats */}
            <div className="flex-1 space-y-1.5">
              {bodyPartProgress.map((bp) => (
                <div key={bp.part} className="flex items-center gap-2">
                  <span className="w-16 text-[10px] font-semibold">{bp.part}</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${bp.progress}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-[10px] font-bold text-primary">{bp.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-2">Muscle Balance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={bodyPartProgress.map(b => ({ subject: b.part, A: b.progress }))}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <Radar name="Progress" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Progress */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4 pb-6 mb-4">
          <h3 className="text-sm font-bold mb-2">Weekly Progress</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyProgress}>
              <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 11 }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MobileLayout>
  );
};

export default GrowthStatus;
