import { ChevronLeft, Plus, Play, CheckCircle2, Clock, Flame, Dumbbell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import ProgressRing from "@/components/ProgressRing";
import { WorkoutCamera } from "@/components/WorkoutCamera";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

const defaultExercises: Exercise[] = [
  { name: "Push Ups", sets: 3, reps: 15, completed: false },
  { name: "Squats", sets: 4, reps: 12, completed: false },
  { name: "Plank", sets: 3, reps: 60, completed: false },
  { name: "Lunges", sets: 3, reps: 12, completed: false },
  { name: "Burpees", sets: 3, reps: 10, completed: false },
];

const WorkoutTracker = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const completedCount = exercises.filter((e) => e.completed).length;
  const progress = (completedCount / exercises.length) * 100;

  const toggleExercise = (index: number) => {
    setExercises((prev) =>
      prev.map((e, i) => (i === index ? { ...e, completed: !e.completed } : e))
    );
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    setTimerInterval(interval);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    if (timerInterval) clearInterval(timerInterval);
  };

  const addExercise = () => {
    const name = prompt("Exercise name:");
    if (name) {
      setExercises((prev) => [...prev, { name, sets: 3, reps: 12, completed: false }]);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Workout Tracker</h1>
          <div className="w-6" />
        </div>

        {/* Progress Card */}
        <div className="mt-5 gym-gradient-card rounded-2xl p-5">
          <div className="flex items-center gap-5">
            <ProgressRing progress={progress} size={90} strokeWidth={6} />
            <div className="flex-1">
              <h3 className="text-sm font-bold">Today's Progress</h3>
              <p className="mt-1 text-2xl font-bold gym-text-gradient">
                {completedCount}/{exercises.length}
              </p>
              <p className="text-[10px] text-muted-foreground">exercises completed</p>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
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
        
        {/* Live AI Camera Setup */}
        <WorkoutCamera isActive={isWorkoutActive} />

        {/* Start/Stop Button */}
        <button
          onClick={isWorkoutActive ? stopWorkout : startWorkout}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-transform active:scale-95 ${
            isWorkoutActive
              ? "bg-destructive text-destructive-foreground"
              : "gym-gradient-orange text-primary-foreground"
          }`}
        >
          <Play className="h-4 w-4" />
          {isWorkoutActive ? "End Workout" : "Start Workout"}
        </button>

        {/* Exercises */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Exercises</h2>
            <button
              onClick={addExercise}
              className="flex items-center gap-1 text-[10px] font-semibold text-primary"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>

          <div className="mt-3 space-y-2 pb-4">
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
                  <p className={`text-xs font-semibold ${exercise.completed ? "text-primary" : ""}`}>
                    {exercise.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WorkoutTracker;
