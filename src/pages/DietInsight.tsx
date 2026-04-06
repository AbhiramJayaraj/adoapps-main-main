import { ChevronLeft, ChevronDown, Lightbulb, TrendingUp, Droplets, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import MobileLayout from "@/components/MobileLayout";

const getDietLog = (): { date: string; calories: number; protein: number; carbs: number; fat: number; fiber: number }[] => {
  const saved = localStorage.getItem("ado-diet-log");
  return saved ? JSON.parse(saved) : [];
};

const DietInsight = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<"week" | "month">("week");

  const dietLog = useMemo(() => getDietLog(), []);
  const hasData = dietLog.length > 0;

  // Build chart data from real logs or show empty
  const chartData = useMemo(() => {
    if (!hasData) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return days.map(d => ({ day: d, value: 0 }));
    }

    const now = new Date();
    const rangeDays = timeRange === "week" ? 7 : 30;
    const data: { day: string; value: number }[] = [];

    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLog = dietLog.filter(l => l.date === dateStr);
      const totalCal = dayLog.reduce((s, l) => s + l.calories, 0);
      const label = timeRange === "week"
        ? d.toLocaleDateString("en", { weekday: "short" })
        : `${d.getDate()}`;
      data.push({ day: label, value: totalCal });
    }
    return data;
  }, [dietLog, hasData, timeRange]);

  const weeklyTotal = chartData.reduce((s, d) => s + d.value, 0);
  const activeDays = chartData.filter(d => d.value > 0).length;
  const avgPerDay = activeDays > 0 ? Math.round(weeklyTotal / activeDays) : 0;

  // Macros from real data
  const totalMacros = useMemo(() => {
    if (!hasData) return { protein: 0, carbs: 0, fat: 0, fiber: 0, calories: 0 };
    const now = new Date();
    const rangeDays = timeRange === "week" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - rangeDays);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    return dietLog
      .filter(l => l.date >= cutoffStr)
      .reduce((acc, l) => ({
        protein: acc.protein + (l.protein || 0),
        carbs: acc.carbs + (l.carbs || 0),
        fat: acc.fat + (l.fat || 0),
        fiber: acc.fiber + (l.fiber || 0),
        calories: acc.calories + (l.calories || 0),
      }), { protein: 0, carbs: 0, fat: 0, fiber: 0, calories: 0 });
  }, [dietLog, hasData, timeRange]);

  const totalMacroGrams = totalMacros.protein + totalMacros.carbs + totalMacros.fat + totalMacros.fiber;
  const macros = [
    { name: "Protein", value: totalMacros.protein, pct: totalMacroGrams > 0 ? (totalMacros.protein / totalMacroGrams) * 100 : 0 },
    { name: "Carbs", value: totalMacros.carbs, pct: totalMacroGrams > 0 ? (totalMacros.carbs / totalMacroGrams) * 100 : 0 },
    { name: "Fats", value: totalMacros.fat, pct: totalMacroGrams > 0 ? (totalMacros.fat / totalMacroGrams) * 100 : 0 },
    { name: "Fiber", value: totalMacros.fiber, pct: totalMacroGrams > 0 ? (totalMacros.fiber / totalMacroGrams) * 100 : 0 },
  ];

  // User targets from onboarding
  const userGoal = localStorage.getItem("ado-user-goal") || "";
  const userWeight = parseInt(localStorage.getItem("ado-user-weight") || "70");
  const baseTarget = userWeight * 30;
  const goalAdjust: Record<string, number> = { lose: -500, gain: 300, maintain: 0, endurance: 200, flexibility: -200, strength: 400 };
  const dailyTarget = baseTarget + (goalAdjust[userGoal] || 0);
  const weeklyTarget = dailyTarget * (timeRange === "week" ? 7 : 30);

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Diet Insight</h1>
          <div className="w-6" />
        </div>

        {/* Time Range Toggle */}
        <div className="mt-4 flex rounded-xl bg-secondary p-1">
          {(["week", "month"] as const).map(r => (
            <button key={r} onClick={() => setTimeRange(r)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                timeRange === r ? "bg-foreground text-background" : "text-muted-foreground"
              }`}>
              {r === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* Chart Section */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground">
              Calories Consumption Analysis
            </h2>
          </div>

          {hasData ? (
            <>
              <div className="mt-3 flex gap-6">
                <div>
                  <p className="text-lg font-bold">{weeklyTotal.toLocaleString()} Kcal</p>
                  <p className="text-[10px] text-muted-foreground">{timeRange === "week" ? "Weekly" : "Monthly"} Total</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{avgPerDay.toLocaleString()} Kcal</p>
                  <p className="text-[10px] text-muted-foreground">Average Per Day</p>
                </div>
              </div>

              <div className="mt-3 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} axisLine={false} tickLine={false} />
                    <ReferenceLine y={dailyTarget} stroke="hsl(var(--destructive))" strokeDasharray="6 4" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5}
                      fill="url(#colorValue)" dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded bg-primary" />
                  <span className="text-[9px] text-muted-foreground">Calories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-0.5 w-4 border-t-2 border-dashed border-destructive" />
                  <span className="text-[9px] text-muted-foreground">Daily Target ({dailyTarget})</span>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-border p-8 text-center">
              <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-3 text-sm font-bold">No diet data yet</p>
              <p className="mt-1 text-[10px] text-muted-foreground max-w-[200px] mx-auto">
                Start tracking your meals in the Diet Tracker to see your consumption analysis here
              </p>
              <button onClick={() => navigate("/diet")}
                className="mt-4 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold text-background active:scale-95 transition-transform">
                Start Tracking
              </button>
            </div>
          )}
        </div>

        {/* Macronutrients Breakdown */}
        <div className="mt-5 rounded-2xl border border-border p-4">
          <h3 className="text-sm font-bold">Macronutrients Breakdown</h3>

          {hasData ? (
            <>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <span className="text-lg">🍽</span>
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{totalMacros.calories.toLocaleString()}</span>
                    <span className="text-muted-foreground"> of {weeklyTarget.toLocaleString()}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">Calories Consumed</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {macros.map((macro) => (
                  <div key={macro.name} className="flex items-center gap-3">
                    <span className="w-14 text-xs text-muted-foreground">{macro.name}</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-700"
                        style={{ width: `${Math.min(100, macro.pct)}%` }}
                      />
                    </div>
                    <span className="w-16 text-right text-[10px] font-semibold">{macro.value}g ({macro.pct.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-4 py-6 text-center">
              <Flame className="mx-auto h-8 w-8 text-muted-foreground/30" />
              <p className="mt-2 text-xs text-muted-foreground">No macro data available</p>
            </div>
          )}
        </div>

        {/* Daily Target Card */}
        <div className="mt-4 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <span className="text-lg">🎯</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Your Daily Target</p>
              <p className="text-[10px] text-muted-foreground">Based on {userWeight}kg · {userGoal || "general"} goal</p>
            </div>
            <p className="text-lg font-black">{dailyTarget.toLocaleString()}</p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-foreground transition-all duration-700"
              style={{ width: `${hasData ? Math.min(100, (avgPerDay / dailyTarget) * 100) : 0}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground">{hasData ? avgPerDay : 0} avg/day</span>
            <span className="text-[9px] text-muted-foreground">{dailyTarget} target</span>
          </div>
        </div>

        {/* Hydration Reminder */}
        <div className="mt-4 rounded-2xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-xs font-bold">Stay Hydrated</p>
              <p className="text-[10px] text-muted-foreground">Aim for {Math.round(userWeight * 0.035 * 10) / 10}L water daily</p>
            </div>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary p-3 pb-6">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
          <p className="text-[10px] text-muted-foreground">
            <span className="font-semibold text-foreground">Pro Tip: </span>
            {hasData
              ? avgPerDay > dailyTarget
                ? "You're exceeding your daily target. Try reducing portion sizes or swapping high-calorie snacks."
                : avgPerDay < dailyTarget * 0.7
                ? "You're under-eating. Make sure you're getting enough fuel for your workouts."
                : "Great job staying close to your target! Consistency is key."
              : "People who track their meals are very likely to achieve desired results. Start logging today!"}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DietInsight;
