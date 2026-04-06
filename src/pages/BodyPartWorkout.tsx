import { ChevronLeft, Play, Clock, Flame, Dumbbell, CheckCircle2, Timer, Minus, Plus, Volume2, Square } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import ProgressRing from "@/components/ProgressRing";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  completed: boolean;
}

const bodyPartData: Record<string, { title: string; emoji: string; exercises: Exercise[] }> = {
  chest: {
    title: "Chest", emoji: "🫁",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10", completed: false },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", completed: false },
      { name: "Decline Bench Press", sets: 3, reps: "10-12", completed: false },
      { name: "Cable Flyes", sets: 3, reps: "12-15", completed: false },
      { name: "Push Ups (Wide)", sets: 3, reps: "15-20", completed: false },
      { name: "Dumbbell Pullover", sets: 3, reps: "12", completed: false },
      { name: "Pec Deck Machine", sets: 3, reps: "12-15", completed: false },
      { name: "Incline Cable Flyes", sets: 3, reps: "12-15", completed: false },
      { name: "Landmine Press", sets: 3, reps: "10-12", completed: false },
      { name: "Svend Press", sets: 3, reps: "12-15", completed: false },
    ],
  },
  back: {
    title: "Back", emoji: "🔙",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8", completed: false },
      { name: "Pull Ups", sets: 4, reps: "8-12", completed: false },
      { name: "Barbell Rows", sets: 3, reps: "10-12", completed: false },
      { name: "Lat Pulldown", sets: 3, reps: "12", completed: false },
      { name: "Seated Cable Row", sets: 3, reps: "12-15", completed: false },
      { name: "T-Bar Row", sets: 3, reps: "10-12", completed: false },
      { name: "Single Arm Dumbbell Row", sets: 3, reps: "10 each", completed: false },
      { name: "Chest-Supported Row", sets: 3, reps: "12", completed: false },
      { name: "Meadows Row", sets: 3, reps: "10 each", completed: false },
      { name: "Rack Pulls", sets: 3, reps: "8-10", completed: false },
      { name: "Straight Arm Pulldown", sets: 3, reps: "12-15", completed: false },
      { name: "Inverted Row", sets: 3, reps: "12-15", completed: false },
    ],
  },
  shoulders: {
    title: "Shoulders", emoji: "🤷",
    exercises: [
      { name: "Overhead Press", sets: 4, reps: "8-10", completed: false },
      { name: "Lateral Raises", sets: 4, reps: "12-15", completed: false },
      { name: "Face Pulls", sets: 3, reps: "15", completed: false },
      { name: "Front Raises", sets: 3, reps: "12", completed: false },
      { name: "Arnold Press", sets: 3, reps: "10-12", completed: false },
      { name: "Reverse Pec Deck", sets: 3, reps: "12-15", completed: false },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15", completed: false },
      { name: "Z Press", sets: 3, reps: "8-10", completed: false },
      { name: "Lu Raises", sets: 3, reps: "10-12", completed: false },
      { name: "Rear Delt Flyes", sets: 3, reps: "15", completed: false },
      { name: "Dumbbell Upright Row", sets: 3, reps: "12", completed: false },
    ],
  },
  arms: {
    title: "Arms", emoji: "💪",
    exercises: [
      { name: "Barbell Curls", sets: 3, reps: "10-12", completed: false },
      { name: "Skull Crushers", sets: 3, reps: "10-12", completed: false },
      { name: "Hammer Curls", sets: 3, reps: "12", completed: false },
      { name: "Tricep Pushdown", sets: 3, reps: "12-15", completed: false },
      { name: "Concentration Curls", sets: 3, reps: "12", completed: false },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", completed: false },
      { name: "Preacher Curls", sets: 3, reps: "10-12", completed: false },
      { name: "Close-Grip Bench Press", sets: 3, reps: "10-12", completed: false },
      { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12", completed: false },
      { name: "Tricep Dips", sets: 3, reps: "12-15", completed: false },
      { name: "Cable Curls (Rope)", sets: 3, reps: "12-15", completed: false },
      { name: "Diamond Push-ups", sets: 3, reps: "15", completed: false },
      { name: "Spider Curls", sets: 3, reps: "12", completed: false },
      { name: "Tricep Kickbacks", sets: 3, reps: "12 each", completed: false },
    ],
  },
  forearms: {
    title: "Forearms", emoji: "🦾",
    exercises: [
      { name: "Wrist Curls", sets: 4, reps: "15-20", completed: false },
      { name: "Reverse Wrist Curls", sets: 3, reps: "15", completed: false },
      { name: "Farmer's Walk", sets: 3, reps: "40m", completed: false },
      { name: "Plate Pinch Hold", sets: 3, reps: "30 sec", completed: false },
      { name: "Towel Pull-ups", sets: 3, reps: "8-10", completed: false },
      { name: "Behind-the-Back Wrist Curls", sets: 3, reps: "15", completed: false },
      { name: "Reverse Barbell Curls", sets: 3, reps: "12", completed: false },
      { name: "Dead Hangs", sets: 3, reps: "45 sec", completed: false },
      { name: "Wrist Roller", sets: 3, reps: "3 rolls", completed: false },
    ],
  },
  legs: {
    title: "Legs", emoji: "🦵",
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: "8-10", completed: false },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12", completed: false },
      { name: "Leg Press", sets: 3, reps: "12", completed: false },
      { name: "Walking Lunges", sets: 3, reps: "12 each", completed: false },
      { name: "Leg Curls", sets: 3, reps: "12-15", completed: false },
      { name: "Leg Extensions", sets: 3, reps: "12-15", completed: false },
      { name: "Calf Raises", sets: 4, reps: "15-20", completed: false },
      { name: "Front Squats", sets: 3, reps: "8-10", completed: false },
      { name: "Hack Squats", sets: 3, reps: "10-12", completed: false },
      { name: "Sissy Squats", sets: 3, reps: "12-15", completed: false },
      { name: "Goblet Squats", sets: 3, reps: "12", completed: false },
      { name: "Step Ups (Weighted)", sets: 3, reps: "10 each", completed: false },
      { name: "Box Jumps", sets: 3, reps: "10", completed: false },
    ],
  },
  core: {
    title: "Core", emoji: "🔥",
    exercises: [
      { name: "Plank", sets: 3, reps: "60 sec", completed: false },
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15", completed: false },
      { name: "Russian Twists", sets: 3, reps: "20", completed: false },
      { name: "Ab Wheel Rollout", sets: 3, reps: "10-12", completed: false },
      { name: "Cable Woodchops", sets: 3, reps: "12 each", completed: false },
      { name: "Bicycle Crunches", sets: 3, reps: "20", completed: false },
      { name: "Dragon Flags", sets: 3, reps: "6-8", completed: false },
      { name: "Pallof Press", sets: 3, reps: "12 each", completed: false },
      { name: "Decline Sit-ups", sets: 3, reps: "15", completed: false },
      { name: "Dead Bug", sets: 3, reps: "10 each", completed: false },
      { name: "V-Ups", sets: 3, reps: "15", completed: false },
      { name: "Toe Touches", sets: 3, reps: "15", completed: false },
    ],
  },
  glutes: {
    title: "Glutes", emoji: "🍑",
    exercises: [
      { name: "Hip Thrusts", sets: 4, reps: "10-12", completed: false },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each", completed: false },
      { name: "Sumo Deadlifts", sets: 3, reps: "10-12", completed: false },
      { name: "Cable Kickbacks", sets: 3, reps: "12 each", completed: false },
      { name: "Glute Bridge", sets: 3, reps: "15", completed: false },
      { name: "Step Ups", sets: 3, reps: "12 each", completed: false },
      { name: "Single Leg Hip Thrust", sets: 3, reps: "10 each", completed: false },
      { name: "Frog Pumps", sets: 3, reps: "20", completed: false },
      { name: "Banded Walks", sets: 3, reps: "15 each", completed: false },
      { name: "Good Mornings", sets: 3, reps: "12", completed: false },
    ],
  },
  calves: {
    title: "Calves", emoji: "🏔️",
    exercises: [
      { name: "Standing Calf Raises", sets: 4, reps: "15-20", completed: false },
      { name: "Seated Calf Raises", sets: 4, reps: "15-20", completed: false },
      { name: "Donkey Calf Raises", sets: 3, reps: "15", completed: false },
      { name: "Single Leg Calf Raise", sets: 3, reps: "12 each", completed: false },
      { name: "Jump Rope", sets: 3, reps: "60 sec", completed: false },
      { name: "Smith Machine Calf Raise", sets: 3, reps: "15-20", completed: false },
      { name: "Leg Press Calf Raise", sets: 3, reps: "15", completed: false },
      { name: "Tibialis Raises", sets: 3, reps: "15", completed: false },
    ],
  },
  neck: {
    title: "Neck", emoji: "🦴",
    exercises: [
      { name: "Neck Flexion (Plate)", sets: 3, reps: "12-15", completed: false },
      { name: "Neck Extension", sets: 3, reps: "12-15", completed: false },
      { name: "Lateral Neck Flexion", sets: 3, reps: "12 each", completed: false },
      { name: "Neck Harness", sets: 3, reps: "15", completed: false },
      { name: "Shrugs", sets: 4, reps: "12-15", completed: false },
      { name: "Neck Curls (Lying)", sets: 3, reps: "15", completed: false },
      { name: "Band Neck Resistance", sets: 3, reps: "12 each", completed: false },
    ],
  },
  traps: {
    title: "Traps", emoji: "🔺",
    exercises: [
      { name: "Barbell Shrugs", sets: 4, reps: "12-15", completed: false },
      { name: "Dumbbell Shrugs", sets: 3, reps: "15", completed: false },
      { name: "Face Pulls", sets: 3, reps: "15", completed: false },
      { name: "Upright Rows", sets: 3, reps: "12", completed: false },
      { name: "Farmer's Walk", sets: 3, reps: "40m", completed: false },
      { name: "Behind-the-Back Shrugs", sets: 3, reps: "12-15", completed: false },
      { name: "Cable Shrugs", sets: 3, reps: "15", completed: false },
      { name: "Rack Pulls (Above Knee)", sets: 3, reps: "8-10", completed: false },
      { name: "Overhead Shrugs", sets: 3, reps: "12", completed: false },
    ],
  },
  lats: {
    title: "Lats", emoji: "🦅",
    exercises: [
      { name: "Wide-Grip Lat Pulldown", sets: 4, reps: "10-12", completed: false },
      { name: "Close-Grip Pulldown", sets: 3, reps: "12", completed: false },
      { name: "Straight Arm Pulldown", sets: 3, reps: "12-15", completed: false },
      { name: "Chin Ups", sets: 3, reps: "8-12", completed: false },
      { name: "Single Arm Cable Row", sets: 3, reps: "12 each", completed: false },
      { name: "Dumbbell Pullover", sets: 3, reps: "12", completed: false },
      { name: "Kayak Row", sets: 3, reps: "10 each", completed: false },
    ],
  },
  obliques: {
    title: "Obliques", emoji: "🔄",
    exercises: [
      { name: "Cable Woodchops", sets: 3, reps: "12 each", completed: false },
      { name: "Russian Twists", sets: 3, reps: "20", completed: false },
      { name: "Side Plank", sets: 3, reps: "45 sec each", completed: false },
      { name: "Bicycle Crunches", sets: 3, reps: "20", completed: false },
      { name: "Hanging Oblique Raises", sets: 3, reps: "10 each", completed: false },
      { name: "Pallof Press", sets: 3, reps: "12 each", completed: false },
      { name: "Windshield Wipers", sets: 3, reps: "10", completed: false },
      { name: "Side Bend (Dumbbell)", sets: 3, reps: "15 each", completed: false },
    ],
  },
  hamstrings: {
    title: "Hamstrings", emoji: "🦵",
    exercises: [
      { name: "Romanian Deadlifts", sets: 4, reps: "10-12", completed: false },
      { name: "Lying Leg Curls", sets: 3, reps: "12-15", completed: false },
      { name: "Seated Leg Curls", sets: 3, reps: "12-15", completed: false },
      { name: "Nordic Curls", sets: 3, reps: "6-8", completed: false },
      { name: "Single Leg Deadlift", sets: 3, reps: "10 each", completed: false },
      { name: "Glute Ham Raise", sets: 3, reps: "10", completed: false },
      { name: "Good Mornings", sets: 3, reps: "12", completed: false },
      { name: "Slider Leg Curls", sets: 3, reps: "12", completed: false },
    ],
  },
  "hip-flexors": {
    title: "Hip Flexors", emoji: "🧘",
    exercises: [
      { name: "Hanging Knee Raises", sets: 3, reps: "12-15", completed: false },
      { name: "Psoas March", sets: 3, reps: "12 each", completed: false },
      { name: "Standing Knee Drive", sets: 3, reps: "15 each", completed: false },
      { name: "Banded Hip Flexion", sets: 3, reps: "12 each", completed: false },
      { name: "Leg Swings", sets: 3, reps: "15 each", completed: false },
      { name: "Mountain Climbers", sets: 3, reps: "20 each", completed: false },
      { name: "Kneeling Lunge Stretch", sets: 3, reps: "30 sec each", completed: false },
    ],
  },
  "rear-delts": {
    title: "Rear Delts", emoji: "🎯",
    exercises: [
      { name: "Face Pulls", sets: 4, reps: "15", completed: false },
      { name: "Reverse Pec Deck", sets: 3, reps: "12-15", completed: false },
      { name: "Bent Over Rear Delt Flyes", sets: 3, reps: "15", completed: false },
      { name: "Cable Rear Delt Flyes", sets: 3, reps: "12-15", completed: false },
      { name: "Band Pull-Aparts", sets: 3, reps: "20", completed: false },
      { name: "Prone Y Raises", sets: 3, reps: "12", completed: false },
      { name: "Rear Delt Row", sets: 3, reps: "12", completed: false },
    ],
  },
  "lower-back": {
    title: "Lower Back", emoji: "🔙",
    exercises: [
      { name: "Back Extension", sets: 3, reps: "12-15", completed: false },
      { name: "Good Mornings", sets: 3, reps: "12", completed: false },
      { name: "Superman Hold", sets: 3, reps: "30 sec", completed: false },
      { name: "Reverse Hyper", sets: 3, reps: "12-15", completed: false },
      { name: "Bird Dog", sets: 3, reps: "10 each", completed: false },
      { name: "Jefferson Curls", sets: 3, reps: "8", completed: false },
      { name: "Cat-Cow Stretch", sets: 3, reps: "15", completed: false },
      { name: "Deadlift (Light)", sets: 3, reps: "12", completed: false },
    ],
  },
};

// Beep sound using Web Audio API
const playBeep = (frequency = 880, duration = 200, count = 3) => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    let time = ctx.currentTime;
    for (let i = 0; i < count; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration / 1000);
      osc.start(time);
      osc.stop(time + duration / 1000);
      time += (duration + 100) / 1000;
    }
  } catch (e) { /* audio not available */ }
};

const REST_PRESETS = [30, 45, 60, 90, 120];

const BodyPartWorkout = () => {
  const navigate = useNavigate();
  const { part } = useParams<{ part: string }>();
  const data = bodyPartData[part || "chest"];
  const [exercises, setExercises] = useState<Exercise[]>(data?.exercises || []);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [interval, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const [restDuration, setRestDuration] = useState(60);
  const [restRemaining, setRestRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const restIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, []);

  if (!data) {
    return (
      <MobileLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <p className="text-muted-foreground">Body part not found</p>
        </div>
      </MobileLayout>
    );
  }

  const completedCount = exercises.filter((e) => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  const toggleExercise = (index: number) => {
    setExercises((prev) => prev.map((e, i) => (i === index ? { ...e, completed: !e.completed } : e)));
  };

  const startWorkout = () => {
    setIsActive(true);
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    setIntervalId(id);
  };

  const stopWorkout = () => {
    setIsActive(false);
    if (interval) clearInterval(interval);
    stopRest();
  };

  const startRest = () => {
    setIsResting(true);
    setRestRemaining(restDuration);
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    restIntervalRef.current = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          clearInterval(restIntervalRef.current!);
          restIntervalRef.current = null;
          setIsResting(false);
          playBeep(880, 200, 3);
          return 0;
        }
        if (prev === 4) playBeep(660, 100, 1);
        return prev - 1;
      });
    }, 1000);
  };

  const stopRest = () => {
    setIsResting(false);
    setRestRemaining(0);
    if (restIntervalRef.current) {
      clearInterval(restIntervalRef.current);
      restIntervalRef.current = null;
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const restProgress = restDuration > 0 ? ((restDuration - restRemaining) / restDuration) * 100 : 0;

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">{data.emoji} {data.title} Workout</h1>
          <div className="w-6" />
        </div>

        <div className="mt-4 gym-gradient-card rounded-2xl p-5">
          <div className="flex items-center gap-5">
            <ProgressRing progress={progress} size={80} strokeWidth={5} />
            <div className="flex-1">
              <h3 className="text-sm font-bold">{data.title} Day</h3>
              <p className="mt-1 text-2xl font-bold gym-text-gradient">{completedCount}/{exercises.length}</p>
              <p className="text-[10px] text-muted-foreground">exercises done</p>
            </div>
          </div>
          <div className="mt-3 flex gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold">{formatTime(timer)}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold">{Math.round(timer * 0.15)} Cal</span>
            </div>
          </div>
        </div>

        {/* Rest Timer Card */}
        <div className={`mt-3 rounded-2xl p-4 transition-all duration-500 ${isResting ? "gym-gradient-orange" : "gym-gradient-card"}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Timer className={`h-4 w-4 ${isResting ? "text-primary-foreground" : "text-primary"}`} />
              <span className={`text-xs font-bold ${isResting ? "text-primary-foreground" : ""}`}>Rest Timer</span>
            </div>
            <div className="flex items-center gap-1">
              <Volume2 className={`h-3 w-3 ${isResting ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
              <span className={`text-[9px] ${isResting ? "text-primary-foreground/60" : "text-muted-foreground"}`}>Sound on</span>
            </div>
          </div>

          {isResting ? (
            <div className="text-center">
              <div className="relative mx-auto w-24 h-24 mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary-foreground) / 0.2)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - restProgress / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-primary-foreground">{restRemaining}s</span>
                </div>
              </div>
              <button onClick={stopRest}
                className="flex mx-auto items-center gap-2 rounded-xl bg-primary-foreground/20 px-6 py-2 text-xs font-bold text-primary-foreground active:scale-95 transition-transform">
                <Square className="h-3 w-3" /> Skip Rest
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center gap-3 mb-3">
                <button onClick={() => setRestDuration(d => Math.max(10, d - 15))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary active:scale-90 transition-transform">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-2xl font-black w-16 text-center">{restDuration}s</span>
                <button onClick={() => setRestDuration(d => Math.min(300, d + 15))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary active:scale-90 transition-transform">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex gap-1.5 justify-center mb-3">
                {REST_PRESETS.map(p => (
                  <button key={p} onClick={() => setRestDuration(p)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                      restDuration === p ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                    {p}s
                  </button>
                ))}
              </div>
              <button onClick={startRest}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/15 py-2.5 text-xs font-bold text-primary active:scale-95 transition-transform">
                <Timer className="h-3.5 w-3.5" /> Start Rest
              </button>
            </div>
          )}
        </div>

        <button
          onClick={isActive ? stopWorkout : startWorkout}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-transform active:scale-95 ${
            isActive ? "bg-destructive text-destructive-foreground" : "gym-gradient-orange text-primary-foreground"
          }`}
        >
          <Play className="h-4 w-4" />
          {isActive ? "End Workout" : "Start Workout"}
        </button>

        <div className="mt-4 space-y-2 pb-4">
          {exercises.map((exercise, index) => (
            <button
              key={index}
              onClick={() => toggleExercise(index)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 transition-all active:scale-[0.98] ${
                exercise.completed ? "bg-primary/10 border border-primary/30" : "bg-secondary"
              }`}
            >
              {exercise.completed ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              ) : (
                <div className="h-5 w-5 shrink-0 rounded-full border-2 border-muted-foreground" />
              )}
              <div className="flex-1 text-left">
                <p className={`text-xs font-semibold ${exercise.completed ? "text-primary" : ""}`}>{exercise.name}</p>
                <p className="text-[10px] text-muted-foreground">{exercise.sets} sets × {exercise.reps}</p>
              </div>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default BodyPartWorkout;
