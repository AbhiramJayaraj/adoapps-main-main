import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { Dumbbell, ArrowRight, ArrowLeft, Sparkles, User, Ruler, Weight, Target, Clock, Flame, ChevronDown } from "lucide-react";

interface SurveyData {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  targetWeight: string;
  goal: string;
  workoutDuration: string;
  experienceLevel: string;
  focusBodyParts: string[];
}

const steps = [
  "welcome",
  "name",
  "gender",
  "physique",
  "goal",
  "workout",
  "bodyFocus",
  "summary",
] as const;

type Step = (typeof steps)[number];

const goalOptions = [
  { id: "lose", emoji: "🔥", label: "Lose Weight", desc: "Burn fat & get lean" },
  { id: "gain", emoji: "💪", label: "Build Muscle", desc: "Gain strength & mass" },
  { id: "maintain", emoji: "⚖️", label: "Stay Fit", desc: "Maintain current shape" },
  { id: "endurance", emoji: "🏃", label: "Endurance", desc: "Improve stamina & cardio" },
  { id: "flexibility", emoji: "🧘", label: "Flexibility", desc: "Better mobility & recovery" },
  { id: "strength", emoji: "🏋️", label: "Raw Strength", desc: "Lift heavier, get stronger" },
];

const durationOptions = [
  { id: "15", label: "15 min", desc: "Quick & focused", emoji: "⚡" },
  { id: "30", label: "30 min", desc: "Balanced session", emoji: "🎯" },
  { id: "45", label: "45 min", desc: "Full workout", emoji: "💪" },
  { id: "60", label: "60 min", desc: "Intense training", emoji: "🔥" },
  { id: "90", label: "90+ min", desc: "Beast mode", emoji: "🦁" },
];

const bodyPartOptions = [
  { id: "chest", emoji: "🫁", label: "Chest" },
  { id: "back", emoji: "🔙", label: "Back" },
  { id: "shoulders", emoji: "🤷", label: "Shoulders" },
  { id: "arms", emoji: "💪", label: "Arms" },
  { id: "core", emoji: "🔥", label: "Core" },
  { id: "legs", emoji: "🦵", label: "Legs" },
  { id: "glutes", emoji: "🍑", label: "Glutes" },
  { id: "full-body", emoji: "🏋️", label: "Full Body" },
];

const experienceLevels = [
  { id: "beginner", emoji: "🌱", label: "Beginner", desc: "Just starting out" },
  { id: "intermediate", emoji: "🌿", label: "Intermediate", desc: "6+ months experience" },
  { id: "advanced", emoji: "🌳", label: "Advanced", desc: "2+ years consistent" },
  { id: "athlete", emoji: "⚡", label: "Athlete", desc: "Competition level" },
];

const Welcome = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<SurveyData>({
    name: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "",
    workoutDuration: "",
    experienceLevel: "",
    focusBodyParts: [],
  });

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex) / (steps.length - 1)) * 100;

  const canContinue = () => {
    switch (currentStep) {
      case "welcome": return true;
      case "name": return data.name.trim().length >= 1;
      case "gender": return data.gender !== "";
      case "physique": return data.weight !== "" && data.height !== "";
      case "goal": return data.goal !== "";
      case "workout": return data.workoutDuration !== "" && data.experienceLevel !== "";
      case "bodyFocus": return data.focusBodyParts.length > 0;
      case "summary": return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === "summary") {
      // Save all data
      localStorage.setItem("ado-user-name", data.name.trim());
      localStorage.setItem("ado-user-gender", data.gender);
      localStorage.setItem("ado-user-age", data.age);
      localStorage.setItem("ado-user-height", data.height);
      localStorage.setItem("ado-user-weight", data.weight);
      localStorage.setItem("ado-user-target-weight", data.targetWeight);
      localStorage.setItem("ado-user-goal", data.goal);
      localStorage.setItem("ado-user-workout-duration", data.workoutDuration);
      localStorage.setItem("ado-user-experience", data.experienceLevel);
      localStorage.setItem("ado-user-focus-parts", JSON.stringify(data.focusBodyParts));
      localStorage.setItem("ado-onboarded", "true");
      navigate("/", { replace: true });
      return;
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleBodyPart = (id: string) => {
    setData(prev => ({
      ...prev,
      focusBodyParts: prev.focusBodyParts.includes(id)
        ? prev.focusBodyParts.filter(p => p !== id)
        : [...prev.focusBodyParts, id],
    }));
  };

  return (
    <MobileLayout hideNav>
      <div ref={scrollRef} className="flex min-h-[100dvh] flex-col px-5 animate-fade-in overflow-y-auto">
        {/* Progress bar */}
        {currentStep !== "welcome" && (
          <div className="sticky top-0 z-10 bg-background pt-4 pb-2">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={handleBack} className="rounded-full border border-border p-2 transition-transform active:scale-90">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-foreground transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{stepIndex}/{steps.length - 1}</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center py-8">
          {/* WELCOME */}
          {currentStep === "welcome" && (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-foreground mb-6">
                <Dumbbell className="h-12 w-12 text-background" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Ado Work</h1>
              <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                Your personal fitness companion. Let's set up your profile.
              </p>
              <div className="mt-8 space-y-2.5 w-full max-w-xs">
                {[
                  { emoji: "🏋️", text: "Track workouts & body parts" },
                  { emoji: "🥗", text: "Personalized diet plans" },
                  { emoji: "📊", text: "Activity graphs & streaks" },
                  { emoji: "😴", text: "Sleep & recovery tracking" },
                  { emoji: "🎯", text: "Goal-based training programs" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-all hover:bg-secondary/30">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-xs font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAME */}
          {currentStep === "name" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <Sparkles className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">What's your name?</h1>
              <p className="mt-1 text-xs text-muted-foreground">We'll personalize your experience</p>
              <input
                type="text"
                placeholder="Enter your name..."
                value={data.name}
                onChange={e => setData({ ...data, name: e.target.value })}
                onKeyDown={e => e.key === "Enter" && canContinue() && handleNext()}
                autoFocus
                maxLength={30}
                className="mt-6 w-full max-w-xs rounded-2xl border border-border bg-secondary/30 px-5 py-4 text-center text-lg font-bold text-foreground placeholder:text-muted-foreground outline-none ring-2 ring-transparent focus:ring-foreground transition-all"
              />
            </div>
          )}

          {/* GENDER */}
          {currentStep === "gender" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <User className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">About you</h1>
              <p className="mt-1 text-xs text-muted-foreground">This helps us customize your plan</p>

              <div className="mt-6 w-full max-w-xs space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { id: "male", emoji: "👨", label: "Male" },
                      { id: "female", emoji: "👩", label: "Female" },
                      { id: "other", emoji: "🧑", label: "Other" },
                    ].map(g => (
                      <button
                        key={g.id}
                        onClick={() => setData({ ...data, gender: g.id })}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 transition-all active:scale-95 ${
                          data.gender === g.id
                            ? "border-foreground bg-foreground/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className="text-2xl">{g.emoji}</span>
                        <span className="text-xs font-bold">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={data.age}
                    onChange={e => setData({ ...data, age: e.target.value })}
                    min={10}
                    max={100}
                    className="mt-2 w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-center text-lg font-bold text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PHYSIQUE */}
          {currentStep === "physique" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <Ruler className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">Your physique</h1>
              <p className="mt-1 text-xs text-muted-foreground">We'll calculate your ideal plan</p>

              <div className="mt-6 w-full max-w-xs space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Height (cm)</label>
                  <div className="mt-2 relative">
                    <input
                      type="number"
                      placeholder="170"
                      value={data.height}
                      onChange={e => setData({ ...data, height: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-center text-2xl font-black text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">cm</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Weight (kg)</label>
                  <div className="mt-2 relative">
                    <input
                      type="number"
                      placeholder="70"
                      value={data.weight}
                      onChange={e => setData({ ...data, weight: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-center text-2xl font-black text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Weight (kg)</label>
                  <div className="mt-2 relative">
                    <input
                      type="number"
                      placeholder="65"
                      value={data.targetWeight}
                      onChange={e => setData({ ...data, targetWeight: e.target.value })}
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3.5 text-center text-2xl font-black text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">kg</span>
                  </div>
                  {data.weight && data.targetWeight && (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {Number(data.targetWeight) < Number(data.weight)
                        ? `🔥 ${Number(data.weight) - Number(data.targetWeight)} kg to lose`
                        : Number(data.targetWeight) > Number(data.weight)
                        ? `💪 ${Number(data.targetWeight) - Number(data.weight)} kg to gain`
                        : "⚖️ Maintain your current weight"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* GOAL */}
          {currentStep === "goal" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <Target className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">What's your goal?</h1>
              <p className="mt-1 text-xs text-muted-foreground">Pick what drives you most</p>

              <div className="mt-6 w-full max-w-xs space-y-2">
                {goalOptions.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setData({ ...data, goal: g.id })}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 transition-all active:scale-[0.98] ${
                      data.goal === g.id
                        ? "border-foreground bg-foreground/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold">{g.label}</p>
                      <p className="text-[10px] text-muted-foreground">{g.desc}</p>
                    </div>
                    {data.goal === g.id && (
                      <div className="h-5 w-5 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-background text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* WORKOUT PREFERENCES */}
          {currentStep === "workout" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">Workout style</h1>
              <p className="mt-1 text-xs text-muted-foreground">How do you like to train?</p>

              <div className="mt-6 w-full max-w-xs space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session Duration</label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {durationOptions.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setData({ ...data, workoutDuration: d.id })}
                        className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all active:scale-95 ${
                          data.workoutDuration === d.id
                            ? "border-foreground bg-foreground/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className="text-lg">{d.emoji}</span>
                        <span className="text-xs font-bold">{d.label}</span>
                        <span className="text-[8px] text-muted-foreground">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Experience Level</label>
                  <div className="mt-2 space-y-2">
                    {experienceLevels.map(l => (
                      <button
                        key={l.id}
                        onClick={() => setData({ ...data, experienceLevel: l.id })}
                        className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 transition-all active:scale-[0.98] ${
                          data.experienceLevel === l.id
                            ? "border-foreground bg-foreground/10"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span className="text-xl">{l.emoji}</span>
                        <div className="text-left">
                          <p className="text-xs font-bold">{l.label}</p>
                          <p className="text-[9px] text-muted-foreground">{l.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BODY FOCUS */}
          {currentStep === "bodyFocus" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border mb-5">
                <Flame className="h-8 w-8 text-foreground" />
              </div>
              <h1 className="text-xl font-black">Focus areas</h1>
              <p className="mt-1 text-xs text-muted-foreground">Select body parts to prioritize (multiple)</p>

              <div className="mt-6 w-full max-w-xs grid grid-cols-2 gap-2.5">
                {bodyPartOptions.map(bp => (
                  <button
                    key={bp.id}
                    onClick={() => toggleBodyPart(bp.id)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all active:scale-95 ${
                      data.focusBodyParts.includes(bp.id)
                        ? "border-foreground bg-foreground/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <span className="text-3xl">{bp.emoji}</span>
                    <span className="text-xs font-bold">{bp.label}</span>
                    {data.focusBodyParts.includes(bp.id) && (
                      <div className="h-4 w-4 rounded-full bg-foreground flex items-center justify-center">
                        <span className="text-background text-[8px]">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SUMMARY */}
          {currentStep === "summary" && (
            <div className="flex flex-col items-center text-center w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-foreground mb-5">
                <Dumbbell className="h-8 w-8 text-background" />
              </div>
              <h1 className="text-xl font-black">You're all set, {data.name}! 🎉</h1>
              <p className="mt-1 text-xs text-muted-foreground">Here's your profile summary</p>

              <div className="mt-6 w-full max-w-xs space-y-2">
                {[
                  { label: "Gender", value: data.gender || "—", emoji: "👤" },
                  { label: "Age", value: data.age ? `${data.age} years` : "—", emoji: "🎂" },
                  { label: "Height", value: data.height ? `${data.height} cm` : "—", emoji: "📏" },
                  { label: "Weight", value: data.weight ? `${data.weight} kg` : "—", emoji: "⚖️" },
                  { label: "Target", value: data.targetWeight ? `${data.targetWeight} kg` : "—", emoji: "🎯" },
                  { label: "Goal", value: goalOptions.find(g => g.id === data.goal)?.label || "—", emoji: goalOptions.find(g => g.id === data.goal)?.emoji || "🎯" },
                  { label: "Duration", value: data.workoutDuration ? `${data.workoutDuration} min` : "—", emoji: "⏱️" },
                  { label: "Level", value: experienceLevels.find(l => l.id === data.experienceLevel)?.label || "—", emoji: experienceLevels.find(l => l.id === data.experienceLevel)?.emoji || "🌱" },
                  { label: "Focus", value: data.focusBodyParts.map(p => bodyPartOptions.find(b => b.id === p)?.label).join(", ") || "—", emoji: "💪" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.emoji}</span>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom button */}
        <div className="sticky bottom-0 bg-background pb-8 pt-3">
          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-bold text-background transition-transform active:scale-95 disabled:opacity-30 disabled:scale-100"
          >
            {currentStep === "welcome"
              ? "Get Started"
              : currentStep === "summary"
              ? "Let's Go! 🚀"
              : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
          {currentStep === "physique" && !data.targetWeight && (
            <button onClick={handleNext} className="mt-2 w-full text-center text-[10px] text-muted-foreground font-semibold">
              Skip target weight →
            </button>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Welcome;
