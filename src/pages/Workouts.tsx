import { ChevronLeft, Search, Dumbbell, Timer, Flame, ChevronRight, Play } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";

interface Exercise {
  name: string;
  illustration: string;
  sets: string;
}

interface Workout {
  id: string;
  name: string;
  category: string;
  duration: string;
  calories: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Expert";
  exercises: Exercise[];
  image: string;
}

const workouts: Workout[] = [
  // === STRENGTH ===
  { id: "1", name: "Upper Body Blast", category: "Strength", duration: "35 min", calories: 280, difficulty: "Medium", image: "💪",
    exercises: [
      { name: "Push Ups", illustration: "🧍‍♂️➡️🫳", sets: "3×15" },
      { name: "Dumbbell Press", illustration: "🏋️⬆️", sets: "4×12" },
      { name: "Shoulder Press", illustration: "🙆‍♂️⬆️", sets: "3×10" },
      { name: "Bicep Curls", illustration: "💪🔄", sets: "3×12" },
      { name: "Tricep Dips", illustration: "🪑⬇️⬆️", sets: "3×10" },
    ] },
  { id: "2", name: "Leg Day Crusher", category: "Strength", duration: "40 min", calories: 350, difficulty: "Hard", image: "🦵",
    exercises: [
      { name: "Squats", illustration: "🧍⬇️⬆️", sets: "4×12" },
      { name: "Lunges", illustration: "🚶‍♂️⬇️", sets: "3×10 each" },
      { name: "Leg Press", illustration: "🦵⬆️💨", sets: "4×10" },
      { name: "Calf Raises", illustration: "🦶⬆️", sets: "4×20" },
      { name: "Deadlifts", illustration: "🏋️‍♂️⬆️", sets: "4×8" },
      { name: "Box Jumps", illustration: "📦⬆️🦘", sets: "3×10" },
    ] },
  { id: "6", name: "Full Body Power", category: "Strength", duration: "45 min", calories: 420, difficulty: "Hard", image: "⚡",
    exercises: [
      { name: "Deadlifts", illustration: "🏋️‍♂️⬆️", sets: "5×5" },
      { name: "Bench Press", illustration: "🛏️🏋️", sets: "4×8" },
      { name: "Pull Ups", illustration: "🔩⬆️🧍", sets: "4×8" },
      { name: "Squats", illustration: "🧍⬇️⬆️", sets: "4×10" },
      { name: "Overhead Press", illustration: "🙆⬆️🏋️", sets: "3×10" },
      { name: "Barbell Rows", illustration: "🏋️🔙", sets: "4×10" },
    ] },
  { id: "7", name: "Arm Sculptor", category: "Strength", duration: "30 min", calories: 220, difficulty: "Medium", image: "💪",
    exercises: [
      { name: "Hammer Curls", illustration: "🔨💪", sets: "3×12" },
      { name: "Skull Crushers", illustration: "💀⬇️⬆️", sets: "3×10" },
      { name: "Cable Curls", illustration: "🔌💪", sets: "3×12" },
      { name: "Dips", illustration: "🪑⬇️⬆️", sets: "3×10" },
      { name: "Concentration Curls", illustration: "🧘💪", sets: "3×10" },
    ] },
  { id: "9", name: "Chest & Triceps", category: "Strength", duration: "40 min", calories: 310, difficulty: "Medium", image: "🏋️",
    exercises: [
      { name: "Flat Bench Press", illustration: "🛏️🏋️⬆️", sets: "4×10" },
      { name: "Incline DB Press", illustration: "📐🏋️", sets: "3×12" },
      { name: "Cable Flyes", illustration: "🔌↔️", sets: "3×12" },
      { name: "Close Grip Bench", illustration: "🤏🏋️", sets: "3×10" },
      { name: "Tricep Pushdown", illustration: "⬇️💪", sets: "3×12" },
      { name: "Overhead Extension", illustration: "⬆️💪🔙", sets: "3×10" },
    ] },
  { id: "10", name: "Back & Biceps", category: "Strength", duration: "45 min", calories: 340, difficulty: "Medium", image: "🦾",
    exercises: [
      { name: "Barbell Row", illustration: "🏋️🔙", sets: "4×10" },
      { name: "Lat Pulldown", illustration: "⬇️🔩", sets: "3×12" },
      { name: "Seated Row", illustration: "🪑🔙", sets: "3×12" },
      { name: "Barbell Curl", illustration: "🏋️💪", sets: "3×10" },
      { name: "Hammer Curl", illustration: "🔨💪", sets: "3×12" },
      { name: "Face Pull", illustration: "🔌😊", sets: "3×15" },
    ] },
  { id: "11", name: "Shoulder Shredder", category: "Strength", duration: "35 min", calories: 260, difficulty: "Hard", image: "🎯",
    exercises: [
      { name: "Military Press", illustration: "🎖️⬆️", sets: "4×8" },
      { name: "Arnold Press", illustration: "🔄⬆️", sets: "3×10" },
      { name: "Lateral Raise", illustration: "↔️⬆️", sets: "4×12" },
      { name: "Rear Delt Fly", illustration: "🔙↔️", sets: "3×12" },
      { name: "Upright Row", illustration: "⬆️🏋️", sets: "3×10" },
      { name: "Shrugs", illustration: "🤷⬆️", sets: "4×15" },
    ] },
  { id: "15", name: "Glute Activator", category: "Strength", duration: "30 min", calories: 250, difficulty: "Medium", image: "🍑",
    exercises: [
      { name: "Hip Thrusts", illustration: "🍑⬆️", sets: "4×12" },
      { name: "Bulgarian Splits", illustration: "🪑🦵", sets: "3×10 each" },
      { name: "Glute Bridge", illustration: "🌉🍑", sets: "4×15" },
      { name: "Cable Kickbacks", illustration: "🔌🦵🔙", sets: "3×12" },
      { name: "Sumo Squats", illustration: "🧍↔️⬇️", sets: "3×12" },
    ] },
  { id: "18", name: "Kettlebell Flow", category: "Strength", duration: "25 min", calories: 350, difficulty: "Medium", image: "⚙️",
    exercises: [
      { name: "KB Swing", illustration: "⚙️🔄", sets: "4×15" },
      { name: "Turkish Get Up", illustration: "🇹🇷⬆️", sets: "3×3 each" },
      { name: "Goblet Squat", illustration: "🏆⬇️", sets: "3×12" },
      { name: "KB Clean & Press", illustration: "⚙️⬆️", sets: "3×8 each" },
      { name: "Farmer Walk", illustration: "🧑‍🌾🚶", sets: "3×40s" },
    ] },

  // === POWERLIFTING ===
  { id: "21", name: "Squat Specialization", category: "Powerlifting", duration: "50 min", calories: 480, difficulty: "Expert", image: "🏋️‍♂️",
    exercises: [
      { name: "Back Squat", illustration: "🏋️⬇️⬆️", sets: "5×3 @85%" },
      { name: "Pause Squat", illustration: "⏸️🏋️", sets: "3×5 @70%" },
      { name: "Front Squat", illustration: "🏋️‍♀️⬇️", sets: "3×8" },
      { name: "Box Squat", illustration: "📦🏋️", sets: "3×5" },
      { name: "Good Mornings", illustration: "🌅🏋️", sets: "3×10" },
      { name: "Leg Press", illustration: "🦵⬆️", sets: "3×12" },
    ] },
  { id: "22", name: "Bench Press Day", category: "Powerlifting", duration: "50 min", calories: 400, difficulty: "Expert", image: "🛏️",
    exercises: [
      { name: "Competition Bench", illustration: "🛏️🏋️", sets: "5×3 @85%" },
      { name: "Paused Bench", illustration: "⏸️🛏️", sets: "3×5 @70%" },
      { name: "Close Grip Bench", illustration: "🤏🏋️", sets: "3×8" },
      { name: "Incline Press", illustration: "📐🏋️", sets: "3×10" },
      { name: "DB Flyes", illustration: "↔️🏋️", sets: "3×12" },
      { name: "Tricep Dips", illustration: "🪑⬇️⬆️", sets: "3×10" },
    ] },
  { id: "23", name: "Deadlift Domination", category: "Powerlifting", duration: "55 min", calories: 520, difficulty: "Expert", image: "🏗️",
    exercises: [
      { name: "Conventional Deadlift", illustration: "🏋️‍♂️⬆️", sets: "5×3 @85%" },
      { name: "Deficit Deadlift", illustration: "📏🏋️", sets: "3×5" },
      { name: "Romanian Deadlift", illustration: "🇷🇴🏋️", sets: "3×10" },
      { name: "Barbell Row", illustration: "🏋️🔙", sets: "4×8" },
      { name: "Pull Ups", illustration: "🔩⬆️", sets: "4×8" },
      { name: "Back Extension", illustration: "🔙⬆️", sets: "3×15" },
    ] },

  // === CARDIO ===
  { id: "4", name: "Cardio HIIT", category: "Cardio", duration: "25 min", calories: 400, difficulty: "Hard", image: "🏃",
    exercises: [
      { name: "Burpees", illustration: "🧍⬇️🫳⬆️🦘", sets: "4×10" },
      { name: "Jump Squats", illustration: "🧍⬇️⬆️🦘", sets: "4×12" },
      { name: "High Knees", illustration: "🦵⬆️🏃", sets: "3×30s" },
      { name: "Sprint Intervals", illustration: "🏃💨💨", sets: "5×20s" },
      { name: "Jump Rope", illustration: "🤸🔄", sets: "3×60s" },
    ] },
  { id: "12", name: "Sprint Intervals", category: "Cardio", duration: "20 min", calories: 380, difficulty: "Hard", image: "🏃‍♂️",
    exercises: [
      { name: "400m Sprint", illustration: "🏃💨💨💨", sets: "4 rounds" },
      { name: "200m Recovery", illustration: "🚶‍♂️", sets: "4 rounds" },
      { name: "100m All-Out", illustration: "🏃‍♂️⚡", sets: "3 rounds" },
      { name: "Hill Sprints", illustration: "⛰️🏃", sets: "5×30s" },
      { name: "Cooldown Walk", illustration: "🚶☀️", sets: "5 min" },
    ] },
  { id: "13", name: "Tabata Burn", category: "Cardio", duration: "16 min", calories: 320, difficulty: "Hard", image: "⏱️",
    exercises: [
      { name: "Burpees 20s/10s", illustration: "🧍⬇️⬆️🦘", sets: "8 rounds" },
      { name: "Mountain Climbers", illustration: "🏔️🏃", sets: "8 rounds" },
      { name: "Jump Squats", illustration: "🧍⬇️🦘", sets: "8 rounds" },
      { name: "Plank Jacks", illustration: "🫳↔️", sets: "8 rounds" },
      { name: "High Knees", illustration: "🦵⬆️🏃", sets: "8 rounds" },
    ] },
  { id: "19", name: "Boxing Cardio", category: "Cardio", duration: "30 min", calories: 450, difficulty: "Hard", image: "🥊",
    exercises: [
      { name: "Jab-Cross Combo", illustration: "👊👊", sets: "3×3min" },
      { name: "Hook Uppercut", illustration: "🪝⬆️👊", sets: "3×3min" },
      { name: "Speed Bag", illustration: "🥊🔄🔄", sets: "3×2min" },
      { name: "Heavy Bag Rounds", illustration: "🎒👊💥", sets: "3×3min" },
      { name: "Jump Rope", illustration: "🤸🔄", sets: "3×2min" },
    ] },
  { id: "24", name: "Stairmaster Grind", category: "Cardio", duration: "30 min", calories: 350, difficulty: "Medium", image: "🪜",
    exercises: [
      { name: "Steady Climb", illustration: "🪜⬆️", sets: "10 min" },
      { name: "Double Steps", illustration: "🪜⬆️⬆️", sets: "5 min" },
      { name: "Side Steps", illustration: "🪜↔️", sets: "4 min" },
      { name: "Sprint Climb", illustration: "🪜🏃", sets: "3×60s" },
      { name: "Cooldown", illustration: "🪜🚶", sets: "5 min" },
    ] },
  { id: "25", name: "Rowing Machine HIIT", category: "Cardio", duration: "20 min", calories: 360, difficulty: "Hard", image: "🚣",
    exercises: [
      { name: "500m Sprint", illustration: "🚣💨", sets: "4 rounds" },
      { name: "1min Recovery", illustration: "🚣🧘", sets: "4 rounds" },
      { name: "250m All-Out", illustration: "🚣⚡", sets: "6 rounds" },
      { name: "2km Steady State", illustration: "🚣📏", sets: "1 round" },
    ] },

  // === HIIT ===
  { id: "26", name: "20-Min EMOM", category: "HIIT", duration: "20 min", calories: 340, difficulty: "Hard", image: "⏰",
    exercises: [
      { name: "Min 1: 10 Burpees", illustration: "🧍⬇️⬆️", sets: "10 rounds" },
      { name: "Min 2: 15 KB Swings", illustration: "⚙️🔄", sets: "10 rounds" },
      { name: "Min 3: 20 Air Squats", illustration: "🧍⬇️", sets: "Ongoing" },
      { name: "Min 4: 10 Push Ups", illustration: "🫳⬆️", sets: "Ongoing" },
    ] },
  { id: "27", name: "Death by Burpees", category: "HIIT", duration: "15 min", calories: 380, difficulty: "Expert", image: "💀",
    exercises: [
      { name: "Min 1: 1 Burpee", illustration: "💀1️⃣", sets: "Escalating" },
      { name: "Min 2: 2 Burpees", illustration: "💀2️⃣", sets: "Escalating" },
      { name: "Continue until fail", illustration: "💀⬆️", sets: "AMRAP" },
      { name: "Finisher: Plank Hold", illustration: "🫳━━", sets: "2 min" },
    ] },
  { id: "28", name: "Metabolic Mayhem", category: "HIIT", duration: "25 min", calories: 420, difficulty: "Hard", image: "🌋",
    exercises: [
      { name: "Thrusters", illustration: "🏋️⬆️", sets: "4×12" },
      { name: "Box Jumps", illustration: "📦🦘", sets: "4×10" },
      { name: "Battle Ropes", illustration: "🔗🌊", sets: "4×30s" },
      { name: "Sled Push", illustration: "🛷💨", sets: "4×20m" },
      { name: "Wall Balls", illustration: "🏀⬆️", sets: "4×15" },
      { name: "Assault Bike", illustration: "🚴⚡", sets: "4×30s" },
    ] },
  { id: "29", name: "Chipper WOD", category: "HIIT", duration: "30 min", calories: 500, difficulty: "Expert", image: "🪵",
    exercises: [
      { name: "50 Double Unders", illustration: "🤸🔄🔄", sets: "1 round" },
      { name: "40 Wall Balls", illustration: "🏀⬆️🧱", sets: "1 round" },
      { name: "30 Box Jumps", illustration: "📦🦘", sets: "1 round" },
      { name: "20 Power Cleans", illustration: "🏋️⚡", sets: "1 round" },
      { name: "10 Muscle Ups", illustration: "🔩💪⬆️", sets: "1 round" },
    ] },

  // === CORE ===
  { id: "3", name: "Core Destroyer", category: "Core", duration: "20 min", calories: 180, difficulty: "Medium", image: "🔥",
    exercises: [
      { name: "Plank", illustration: "🫳━━━", sets: "3×60s" },
      { name: "Crunches", illustration: "🧘⬆️", sets: "3×20" },
      { name: "Russian Twists", illustration: "🔄🧘", sets: "3×15 each" },
      { name: "Leg Raises", illustration: "🦵⬆️", sets: "3×15" },
      { name: "Mountain Climbers", illustration: "🏔️🏃", sets: "3×30s" },
    ] },
  { id: "16", name: "Abs & Obliques", category: "Core", duration: "15 min", calories: 150, difficulty: "Medium", image: "🎯",
    exercises: [
      { name: "Bicycle Crunches", illustration: "🚴🧘", sets: "3×20" },
      { name: "Side Plank", illustration: "🫳↕️", sets: "3×30s" },
      { name: "V-Ups", illustration: "🧘V⬆️", sets: "3×12" },
      { name: "Woodchops", illustration: "🪓↗️", sets: "3×12 each" },
      { name: "Dead Bug", illustration: "🐛🔄", sets: "3×10" },
    ] },
  { id: "30", name: "Iron Core", category: "Core", duration: "25 min", calories: 200, difficulty: "Hard", image: "🔩",
    exercises: [
      { name: "Ab Wheel Rollout", illustration: "🔄⬆️", sets: "4×10" },
      { name: "Dragon Flags", illustration: "🐉🏴", sets: "3×6" },
      { name: "Hanging Leg Raise", illustration: "🔩🦵⬆️", sets: "4×12" },
      { name: "Pallof Press", illustration: "🔌➡️", sets: "3×10 each" },
      { name: "Farmer Carry", illustration: "🧑‍🌾🚶", sets: "3×40m" },
      { name: "Suitcase Deadlift", illustration: "💼🏋️", sets: "3×10 each" },
    ] },

  // === FLEXIBILITY ===
  { id: "5", name: "Morning Stretch", category: "Flexibility", duration: "15 min", calories: 80, difficulty: "Easy", image: "🧘",
    exercises: [
      { name: "Hamstring Stretch", illustration: "🦵↔️", sets: "2×30s" },
      { name: "Quad Stretch", illustration: "🦵🔙", sets: "2×30s" },
      { name: "Cat-Cow", illustration: "🐱↔️🐄", sets: "10 reps" },
      { name: "Child's Pose", illustration: "🧒🫳", sets: "60s" },
      { name: "Sun Salutation", illustration: "☀️🙏", sets: "5 flows" },
    ] },
  { id: "8", name: "Yoga Flow", category: "Flexibility", duration: "30 min", calories: 120, difficulty: "Easy", image: "🧘",
    exercises: [
      { name: "Downward Dog", illustration: "🐕⬇️", sets: "5 breaths" },
      { name: "Warrior I", illustration: "⚔️🧍", sets: "5 breaths" },
      { name: "Warrior II", illustration: "⚔️↔️", sets: "5 breaths" },
      { name: "Tree Pose", illustration: "🌳🧍", sets: "30s each" },
      { name: "Cobra", illustration: "🐍⬆️", sets: "5 breaths" },
      { name: "Pigeon Pose", illustration: "🐦🧘", sets: "60s each" },
    ] },
  { id: "14", name: "Mobility Flow", category: "Flexibility", duration: "25 min", calories: 90, difficulty: "Easy", image: "🤸",
    exercises: [
      { name: "Hip 90/90", illustration: "🦵↔️", sets: "2 min" },
      { name: "World's Greatest Stretch", illustration: "🌍🧘", sets: "5 each" },
      { name: "Thoracic Rotation", illustration: "🔄🧍", sets: "10 each" },
      { name: "Ankle Circles", illustration: "🦶🔄", sets: "10 each" },
      { name: "Shoulder Dislocates", illustration: "🙆🔄", sets: "15 reps" },
    ] },
  { id: "20", name: "Recovery Day", category: "Flexibility", duration: "20 min", calories: 60, difficulty: "Easy", image: "🧊",
    exercises: [
      { name: "Foam Rolling", illustration: "🧽🔄", sets: "10 min" },
      { name: "Static Stretches", illustration: "🧘↔️", sets: "5 min" },
      { name: "Deep Breathing", illustration: "🌬️😌", sets: "3 min" },
      { name: "Light Walking", illustration: "🚶☀️", sets: "5 min" },
      { name: "Meditation", illustration: "🧘🕉️", sets: "5 min" },
    ] },

  // === BODYWEIGHT / CALISTHENICS ===
  { id: "17", name: "Calisthenics Basics", category: "Calisthenics", duration: "35 min", calories: 300, difficulty: "Medium", image: "🤸‍♂️",
    exercises: [
      { name: "Pull Ups", illustration: "🔩⬆️🧍", sets: "4×8" },
      { name: "Dips", illustration: "🪑⬇️⬆️", sets: "4×10" },
      { name: "Push Ups", illustration: "🫳⬆️", sets: "3×20" },
      { name: "Pistol Squats", illustration: "🦵🧍", sets: "3×6 each" },
      { name: "L-Sit Hold", illustration: "L🧍", sets: "3×15s" },
    ] },
  { id: "31", name: "Advanced Calisthenics", category: "Calisthenics", duration: "45 min", calories: 380, difficulty: "Expert", image: "🏆",
    exercises: [
      { name: "Muscle Ups", illustration: "🔩💪⬆️", sets: "5×3" },
      { name: "Handstand Push Ups", illustration: "🤸⬇️⬆️", sets: "4×5" },
      { name: "Front Lever Holds", illustration: "🔩━━🧍", sets: "5×10s" },
      { name: "Planche Lean", illustration: "🫳⬆️💨", sets: "4×15s" },
      { name: "Archer Pull Ups", illustration: "🏹🔩", sets: "3×5 each" },
      { name: "Pistol Squats", illustration: "🦵🧍", sets: "3×8 each" },
    ] },
  { id: "32", name: "Street Workout", category: "Calisthenics", duration: "40 min", calories: 340, difficulty: "Hard", image: "🏙️",
    exercises: [
      { name: "Bar Dips", illustration: "🪑⬇️⬆️", sets: "4×12" },
      { name: "Typewriter Pull Ups", illustration: "🔩↔️", sets: "3×5 each" },
      { name: "Clap Push Ups", illustration: "👏🫳", sets: "4×8" },
      { name: "Skin the Cat", illustration: "🐱🔄🔩", sets: "3×5" },
      { name: "Human Flag Prep", illustration: "🏴🧍↔️", sets: "3×10s" },
    ] },

  // === FUNCTIONAL ===
  { id: "33", name: "Functional Fitness", category: "Functional", duration: "35 min", calories: 360, difficulty: "Medium", image: "🔧",
    exercises: [
      { name: "Medicine Ball Slam", illustration: "🏀⬇️💥", sets: "4×12" },
      { name: "TRX Row", illustration: "🔗🔙", sets: "3×12" },
      { name: "Sled Push", illustration: "🛷💨", sets: "4×20m" },
      { name: "Tire Flips", illustration: "🛞🔄", sets: "3×8" },
      { name: "Rope Climb", illustration: "🧵⬆️", sets: "3×1" },
      { name: "Sandbag Carry", illustration: "🛄🚶", sets: "3×30m" },
    ] },
  { id: "34", name: "Athletic Performance", category: "Functional", duration: "40 min", calories: 400, difficulty: "Hard", image: "🏅",
    exercises: [
      { name: "Power Cleans", illustration: "🏋️⚡", sets: "5×3" },
      { name: "Box Jumps", illustration: "📦🦘", sets: "4×8" },
      { name: "Broad Jumps", illustration: "🦘➡️", sets: "4×6" },
      { name: "Agility Ladder", illustration: "🪜🏃", sets: "4×30s" },
      { name: "Med Ball Throws", illustration: "🏀💨", sets: "4×10" },
      { name: "Sprint Drills", illustration: "🏃⚡", sets: "5×20m" },
    ] },
  { id: "35", name: "Farmers & Carries", category: "Functional", duration: "25 min", calories: 280, difficulty: "Medium", image: "🧑‍🌾",
    exercises: [
      { name: "Farmer Walk", illustration: "🧑‍🌾🚶", sets: "4×40m" },
      { name: "Overhead Carry", illustration: "⬆️🚶", sets: "3×30m" },
      { name: "Suitcase Carry", illustration: "💼🚶", sets: "3×30m each" },
      { name: "Bear Hug Carry", illustration: "🐻🤗🚶", sets: "3×30m" },
      { name: "Yoke Walk", illustration: "🏗️🚶", sets: "3×20m" },
    ] },

  // === OLYMPIC ===
  { id: "36", name: "Olympic Lifting Intro", category: "Olympic", duration: "45 min", calories: 400, difficulty: "Hard", image: "🥇",
    exercises: [
      { name: "Clean & Jerk", illustration: "🏋️⬆️💨", sets: "5×2" },
      { name: "Snatch", illustration: "🏋️‍♀️⚡⬆️", sets: "5×2" },
      { name: "Clean Pulls", illustration: "🏋️⬆️", sets: "3×5" },
      { name: "Overhead Squat", illustration: "⬆️🧍⬇️", sets: "3×5" },
      { name: "Hang Clean", illustration: "🏋️🔄", sets: "4×3" },
    ] },
  { id: "37", name: "Snatch Complex", category: "Olympic", duration: "40 min", calories: 380, difficulty: "Expert", image: "⚡",
    exercises: [
      { name: "Muscle Snatch", illustration: "💪⚡⬆️", sets: "4×3" },
      { name: "Power Snatch", illustration: "⚡🏋️", sets: "5×2" },
      { name: "Snatch Balance", illustration: "⚖️⬇️", sets: "3×3" },
      { name: "Overhead Squat", illustration: "⬆️⬇️", sets: "3×5" },
      { name: "Snatch Grip DL", illustration: "🏋️↔️⬆️", sets: "3×5" },
    ] },

  // === ENDURANCE ===
  { id: "38", name: "Endurance Builder", category: "Endurance", duration: "45 min", calories: 500, difficulty: "Hard", image: "🏔️",
    exercises: [
      { name: "5km Run", illustration: "🏃📏", sets: "1 round" },
      { name: "100 Push Ups", illustration: "🫳×💯", sets: "Sets to fail" },
      { name: "100 Squats", illustration: "🧍×💯", sets: "Sets to fail" },
      { name: "50 Pull Ups", illustration: "🔩×5️⃣0️⃣", sets: "Sets to fail" },
      { name: "1km Cooldown", illustration: "🚶📏", sets: "1 round" },
    ] },
  { id: "39", name: "Murph Challenge", category: "Endurance", duration: "60 min", calories: 700, difficulty: "Expert", image: "🎖️",
    exercises: [
      { name: "1 Mile Run", illustration: "🏃💨", sets: "1 round" },
      { name: "100 Pull Ups", illustration: "🔩×💯", sets: "Partition" },
      { name: "200 Push Ups", illustration: "🫳×2️⃣💯", sets: "Partition" },
      { name: "300 Air Squats", illustration: "🧍×3️⃣💯", sets: "Partition" },
      { name: "1 Mile Run", illustration: "🏃💨", sets: "1 round" },
    ] },

  // === REHAB / PREHAB ===
  { id: "40", name: "Shoulder Rehab", category: "Rehab", duration: "20 min", calories: 80, difficulty: "Easy", image: "🩺",
    exercises: [
      { name: "Band Pull-Aparts", illustration: "🔗↔️", sets: "3×15" },
      { name: "External Rotation", illustration: "🔄↗️", sets: "3×12" },
      { name: "Face Pulls (Light)", illustration: "🔌😊", sets: "3×15" },
      { name: "Wall Slides", illustration: "🧱⬆️⬇️", sets: "3×10" },
      { name: "YTWL Raises", illustration: "Y T W L", sets: "2×8 each" },
    ] },
  { id: "41", name: "Knee Stability", category: "Rehab", duration: "15 min", calories: 60, difficulty: "Easy", image: "🦿",
    exercises: [
      { name: "Terminal Knee Extension", illustration: "🔗🦵", sets: "3×15" },
      { name: "Clamshells", illustration: "🐚🦵", sets: "3×15" },
      { name: "Single Leg Balance", illustration: "🧍🦵", sets: "3×30s" },
      { name: "Step Downs", illustration: "📦⬇️", sets: "3×10" },
      { name: "Wall Sit", illustration: "🧱🧍⬇️", sets: "3×30s" },
    ] },
];

const categories = ["All", "Strength", "Powerlifting", "Cardio", "HIIT", "Core", "Flexibility", "Calisthenics", "Functional", "Olympic", "Endurance", "Rehab"];

const difficultyColor: Record<string, string> = {
  Easy: "text-gym-green bg-gym-green/15",
  Medium: "text-gym-gold bg-gym-gold/15",
  Hard: "text-destructive bg-destructive/15",
  Expert: "text-purple-400 bg-purple-400/15",
};

const Workouts = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = workouts.filter((w) => {
    const matchCat = selectedCategory === "All" || w.category === selectedCategory;
    const matchSearch = w.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">Workouts</h1>
          <div className="w-6" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search workouts..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 ${selectedCategory === cat ? "gym-gradient-orange text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}>
              {cat}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground">{filtered.length} workouts found</p>

        <div className="mt-2 space-y-3 pb-4">
          {filtered.map((workout) => {
            const isExpanded = expandedId === workout.id;
            return (
              <div key={workout.id} className="gym-gradient-card rounded-2xl overflow-hidden transition-all">
                <button onClick={() => setExpandedId(isExpanded ? null : workout.id)} className="flex w-full items-center gap-3 p-4 text-left">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">{workout.image}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">{workout.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${difficultyColor[workout.difficulty]}`}>{workout.difficulty}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3">
                      <div className="flex items-center gap-1"><Timer className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">{workout.duration}</span></div>
                      <div className="flex items-center gap-1"><Flame className="h-3 w-3 text-primary" /><span className="text-[10px] text-muted-foreground">{workout.calories} cal</span></div>
                      <div className="flex items-center gap-1"><Dumbbell className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">{workout.exercises.length} ex</span></div>
                    </div>
                    <span className="text-[9px] text-primary/70 font-medium">{workout.category}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 animate-fade-in">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Exercises</p>
                    <div className="mt-2 space-y-2">
                      {workout.exercises.map((ex, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-2.5">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">{ex.illustration.slice(0, 4)}</div>
                          <div className="flex-1">
                            <p className="text-xs font-bold">{ex.name}</p>
                            <p className="text-[9px] text-muted-foreground">{ex.sets}</p>
                          </div>
                          <span className="text-[10px] text-primary font-semibold">{ex.illustration}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate("/workout")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl gym-gradient-orange py-2.5 text-xs font-bold text-primary-foreground active:scale-95 transition-transform">
                      <Play className="h-3.5 w-3.5" /> Start Workout
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Workouts;
