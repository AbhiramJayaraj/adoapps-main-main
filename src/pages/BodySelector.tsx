import { ChevronLeft, Dumbbell, ChevronRight, Zap } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";

const bodyParts = [
  { id: "chest", label: "Chest" }, { id: "shoulders", label: "Shoulders" },
  { id: "arms", label: "Arms" }, { id: "forearms", label: "Forearms" },
  { id: "back", label: "Back" }, { id: "lats", label: "Lats" },
  { id: "core", label: "Core" }, { id: "obliques", label: "Obliques" },
  { id: "glutes", label: "Glutes" }, { id: "hip-flexors", label: "Hip Flexors" },
  { id: "hamstrings", label: "Hamstrings" }, { id: "legs", label: "Quads" },
  { id: "calves", label: "Calves" }, { id: "neck", label: "Neck" },
  { id: "traps", label: "Traps" }, { id: "rear-delts", label: "Rear Delts" },
  { id: "lower-back", label: "Lower Back" },
];

const equipmentList = [
  { id: "none", emoji: "🤸", label: "No Equipment", desc: "Bodyweight only" },
  { id: "dumbbells", emoji: "🏋️", label: "Dumbbells", desc: "Adjustable weights" },
  { id: "barbell", emoji: "🏋️‍♂️", label: "Barbell", desc: "Olympic bar + plates" },
  { id: "bands", emoji: "🔗", label: "Resistance Bands", desc: "Elastic training" },
  { id: "kettlebell", emoji: "⚙️", label: "Kettlebell", desc: "Swing & press" },
  { id: "pullup-bar", emoji: "🔩", label: "Pull-up Bar", desc: "Doorframe mount" },
  { id: "machine", emoji: "🏗️", label: "Gym Machines", desc: "Full gym access" },
  { id: "cables", emoji: "🔌", label: "Cables", desc: "Cable station" },
];

interface NoEquipWorkout {
  id: string; name: string; bodyPart: string; duration: string; reps: string;
  color: string; emoji: string; description: string; steps: string[];
}

const noEquipWorkouts: NoEquipWorkout[] = [
  { id: "1", name: "Push-Up Variations", bodyPart: "chest", duration: "15 min", reps: "4×15", color: "from-red-500/20 to-orange-500/20", emoji: "💪", description: "Diamond, wide, decline, archer push-ups", steps: ["10 Wide Push-ups", "10 Diamond Push-ups", "8 Decline Push-ups", "6 Archer Push-ups (each)"] },
  { id: "2", name: "Pistol Squat Flow", bodyPart: "legs", duration: "20 min", reps: "3×8 each", color: "from-blue-500/20 to-cyan-500/20", emoji: "🦵", description: "Single-leg strength builder", steps: ["Assisted Pistol Squats 3×8", "Bulgarian Split Squats 3×10", "Jump Squats 3×12", "Wall Sit 3×45s"] },
  { id: "3", name: "Plank Universe", bodyPart: "core", duration: "12 min", reps: "5 rounds", color: "from-yellow-500/20 to-amber-500/20", emoji: "🔥", description: "Every plank variation you need", steps: ["Front Plank 60s", "Side Plank 30s each", "Plank Shoulder Taps 20", "Plank Jacks 15", "Up-Down Plank 10"] },
  { id: "4", name: "Handstand Prep", bodyPart: "shoulders", duration: "18 min", reps: "4 rounds", color: "from-purple-500/20 to-pink-500/20", emoji: "🤸", description: "Build shoulder strength for handstands", steps: ["Pike Push-ups 3×10", "Wall Walks 3×5", "Shoulder Taps (Wall) 3×10", "L-Sit Hold 3×20s"] },
  { id: "5", name: "Superman Series", bodyPart: "back", duration: "15 min", reps: "4 rounds", color: "from-green-500/20 to-emerald-500/20", emoji: "🦸", description: "Strengthen your posterior chain", steps: ["Superman Hold 4×30s", "Reverse Snow Angels 3×12", "Prone Y Raises 3×15", "Bird Dog 3×10 each"] },
  { id: "6", name: "Burpee Blitz", bodyPart: "full", duration: "10 min", reps: "AMRAP", color: "from-red-600/20 to-rose-500/20", emoji: "💥", description: "Maximum calorie burn, no equipment", steps: ["Burpees ×10", "Mountain Climbers ×20", "High Knees ×30", "Rest 30s", "Repeat 4 rounds"] },
  { id: "7", name: "Tricep Destroyer", bodyPart: "arms", duration: "12 min", reps: "4 rounds", color: "from-indigo-500/20 to-violet-500/20", emoji: "💎", description: "Bodyweight tricep isolation", steps: ["Close-Grip Push-ups 3×15", "Bench Dips 3×12", "Diamond Push-ups 3×10", "Tricep Plank 3×30s"] },
  { id: "8", name: "Calf Raises Circuit", bodyPart: "calves", duration: "10 min", reps: "5×20", color: "from-teal-500/20 to-sky-500/20", emoji: "🏔️", description: "Single & double leg raises", steps: ["Double Calf Raises 5×20", "Single Leg Raises 3×15 each", "Jump Rope (Imaginary) 3×30s", "Toe Walks 2×30s"] },
  { id: "9", name: "Glute Bridge Flow", bodyPart: "glutes", duration: "15 min", reps: "4 rounds", color: "from-pink-500/20 to-fuchsia-500/20", emoji: "🍑", description: "Build and activate your glutes", steps: ["Glute Bridges 4×15", "Single Leg Bridges 3×10 each", "Donkey Kicks 3×15 each", "Fire Hydrants 3×12 each"] },
  { id: "10", name: "Neck Resistance", bodyPart: "neck", duration: "8 min", reps: "3 rounds", color: "from-stone-500/20 to-zinc-500/20", emoji: "🦴", description: "Self-resisted neck strengthening", steps: ["Neck Flexion (Hand Resist) 3×10", "Neck Extension 3×10", "Lateral Flexion 3×10 each", "Neck Circles 2×10"] },
  { id: "11", name: "Bear Crawl HIIT", bodyPart: "full", duration: "14 min", reps: "4 rounds", color: "from-orange-500/20 to-yellow-500/20", emoji: "🐻", description: "Full body animal flow workout", steps: ["Bear Crawl 30s", "Crab Walk 30s", "Frog Jumps ×10", "Inchworms ×8", "Duck Walk 20s"] },
  { id: "12", name: "Wall Workout", bodyPart: "full", duration: "16 min", reps: "3 rounds", color: "from-cyan-500/20 to-blue-500/20", emoji: "🧱", description: "Only need a wall for full body burn", steps: ["Wall Sit 60s", "Wall Push-ups 3×15", "Wall Angels 3×12", "Single Leg Wall Sit 3×20s each"] },
  { id: "13", name: "Nordic Hamstring Flow", bodyPart: "hamstrings", duration: "15 min", reps: "4 rounds", color: "from-emerald-500/20 to-green-500/20", emoji: "🦵", description: "Bodyweight hamstring strength", steps: ["Nordic Curls (Assisted) 3×5", "Single Leg RDL 3×10 each", "Glute-Ham Walk Out 3×8", "Good Morning Stretch 3×15"] },
  { id: "14", name: "Lower Back Relief", bodyPart: "lower-back", duration: "12 min", reps: "3 rounds", color: "from-amber-500/20 to-orange-500/20", emoji: "🔙", description: "Strengthen and mobilize", steps: ["Cat-Cow 2×15", "Bird Dog 3×10 each", "Superman Hold 3×30s", "Pelvic Tilts 3×15"] },
  { id: "15", name: "Hip Flexor Unlock", bodyPart: "hip-flexors", duration: "10 min", reps: "3 rounds", color: "from-violet-500/20 to-purple-500/20", emoji: "🧘", description: "Open tight hip flexors", steps: ["Kneeling Lunge Stretch 2×30s each", "Leg Swings 3×15 each", "Couch Stretch 2×45s each", "Psoas March 3×12 each"] },
  { id: "16", name: "Lat Pulldown Mimics", bodyPart: "lats", duration: "12 min", reps: "4 rounds", color: "from-sky-500/20 to-indigo-500/20", emoji: "🦅", description: "Bodyweight lat activation", steps: ["Lying Pulldowns 3×12", "Towel Rows 3×10", "Prone Y-T-W 3×8 each", "Superman Lat Pulls 3×15"] },
  { id: "17", name: "Oblique Burner", bodyPart: "obliques", duration: "10 min", reps: "3 rounds", color: "from-rose-500/20 to-pink-500/20", emoji: "🔄", description: "Target your side abs", steps: ["Side Plank Dips 3×12 each", "Russian Twists 3×20", "Bicycle Crunches 3×20", "Windshield Wipers 3×10"] },
  { id: "18", name: "Trap Builder", bodyPart: "traps", duration: "10 min", reps: "4 rounds", color: "from-zinc-500/20 to-stone-500/20", emoji: "🔺", description: "Bodyweight trap activation", steps: ["Prone Shrugs 3×15", "Wall Handstand Shrugs 3×8", "Scapular Push-ups 3×12", "Band Pull-aparts 3×15"] },
  { id: "19", name: "Rear Delt Sculptor", bodyPart: "rear-delts", duration: "10 min", reps: "3 rounds", color: "from-fuchsia-500/20 to-purple-500/20", emoji: "🎯", description: "Isolate rear delts without weights", steps: ["Prone Y Raises 3×15", "Reverse Snow Angels 3×12", "Band Face Pulls 3×15", "Prone T Raises 3×12"] },
  { id: "20", name: "Forearm Fortress", bodyPart: "forearms", duration: "10 min", reps: "3 rounds", color: "from-amber-500/20 to-yellow-500/20", emoji: "🦾", description: "Grip and forearm endurance", steps: ["Dead Hangs 3×30s", "Finger Push-ups 3×8", "Towel Wringing 3×20s", "Wrist Rotations 3×15"] },
];

// ============= POSE SYSTEM =============
// Each pose is a set of SVG paths for the body in different positions
interface Pose {
  name: string;
  head: { cx: number; cy: number; tilt?: number }; // tilt in degrees
  face: { leftEye: { x: number; y: number }; rightEye: { x: number; y: number }; mouth: string; brow?: string };
  neck: { x: number; y: number; w: number; h: number };
  torso: string;
  leftArm: string;
  rightArm: string;
  leftForearm: string;
  rightForearm: string;
  leftHand: { cx: number; cy: number };
  rightHand: { cx: number; cy: number };
  leftLeg: string;
  rightLeg: string;
  leftCalf: string;
  rightCalf: string;
  leftFoot: { cx: number; cy: number };
  rightFoot: { cx: number; cy: number };
}

const poses: Pose[] = [
  {
    name: "Relaxed",
    head: { cx: 100, cy: 28 },
    face: { leftEye: { x: 95, y: 24 }, rightEye: { x: 105, y: 24 }, mouth: "M96 33 Q100 36 104 33", brow: "M92 21 L98 20.5 M102 20.5 L108 21" },
    neck: { x: 91, y: 46, w: 18, h: 14 },
    torso: "M80 66 L120 66 L124 170 L76 170 Z",
    leftArm: "M42 90 Q36 106 36 120 Q38 134 44 138 L54 138 Q58 128 56 114 Q54 102 50 90 Z",
    rightArm: "M150 90 Q156 106 156 120 Q154 134 148 138 L138 138 Q134 128 136 114 Q138 102 142 90 Z",
    leftForearm: "M44 142 Q40 160 38 178 L50 178 Q52 164 52 146 Z",
    rightForearm: "M148 142 Q152 160 154 178 L142 178 Q140 164 140 146 Z",
    leftHand: { cx: 44, cy: 186 }, rightHand: { cx: 148, cy: 186 },
    leftLeg: "M76 172 Q74 210 74 248 L92 248 Q94 220 92 200 Q88 180 86 172 Z",
    rightLeg: "M108 172 Q106 210 106 248 L124 248 Q126 220 124 200 Q120 180 114 172 Z",
    leftCalf: "M76 252 Q74 274 76 300 L92 300 Q94 280 92 256 Z",
    rightCalf: "M108 252 Q106 274 108 300 L124 300 Q126 280 124 256 Z",
    leftFoot: { cx: 84, cy: 308 }, rightFoot: { cx: 116, cy: 308 },
  },
  {
    name: "Double Bicep",
    head: { cx: 100, cy: 26, tilt: -2 },
    face: { leftEye: { x: 95, y: 22 }, rightEye: { x: 105, y: 22 }, mouth: "M95 31 Q100 34 105 31", brow: "M91 18 L98 16.5 M102 16.5 L109 18" },
    neck: { x: 91, y: 44, w: 18, h: 14 },
    torso: "M78 64 L122 64 L126 170 L74 170 Z",
    leftArm: "M40 80 Q28 74 22 60 Q18 50 20 44 L30 42 Q34 52 36 60 Q40 70 48 78 Z",
    rightArm: "M152 80 Q164 74 170 60 Q174 50 172 44 L162 42 Q158 52 156 60 Q152 70 144 78 Z",
    leftForearm: "M20 44 Q16 32 20 20 L32 18 Q30 30 30 42 Z",
    rightForearm: "M172 44 Q176 32 172 20 L160 18 Q162 30 162 42 Z",
    leftHand: { cx: 26, cy: 14 }, rightHand: { cx: 166, cy: 14 },
    leftLeg: "M74 172 Q72 210 72 248 L90 248 Q92 220 90 200 Q86 180 84 172 Z",
    rightLeg: "M110 172 Q108 210 108 248 L126 248 Q128 220 126 200 Q122 180 116 172 Z",
    leftCalf: "M74 252 Q72 274 74 300 L90 300 Q92 280 90 256 Z",
    rightCalf: "M110 252 Q108 274 110 300 L126 300 Q128 280 126 256 Z",
    leftFoot: { cx: 82, cy: 308 }, rightFoot: { cx: 118, cy: 308 },
  },
  {
    name: "Side Chest",
    head: { cx: 98, cy: 28, tilt: 5 },
    face: { leftEye: { x: 93, y: 24 }, rightEye: { x: 103, y: 24 }, mouth: "M94 34 Q98 36 102 34", brow: "M90 21 L96 20.5 M100 20.5 L106 21" },
    neck: { x: 89, y: 46, w: 18, h: 14 },
    torso: "M76 66 L120 66 L124 170 L72 170 Z",
    leftArm: "M38 84 Q30 78 26 68 Q24 58 28 52 L38 54 Q36 62 38 70 Q42 78 48 82 Z",
    rightArm: "M148 84 Q140 78 134 90 Q130 102 132 112 L142 114 Q140 104 142 94 Q146 86 152 82 Z",
    leftForearm: "M28 52 Q22 44 26 34 L36 32 Q34 42 38 54 Z",
    rightForearm: "M132 112 Q126 120 122 132 L134 134 Q136 124 142 114 Z",
    leftHand: { cx: 30, cy: 28 }, rightHand: { cx: 128, cy: 140 },
    leftLeg: "M72 172 Q70 210 70 248 L88 248 Q90 220 88 200 Q84 180 82 172 Z",
    rightLeg: "M108 172 Q106 210 106 248 L124 248 Q126 220 124 200 Q120 180 114 172 Z",
    leftCalf: "M72 252 Q70 274 72 300 L88 300 Q90 280 88 256 Z",
    rightCalf: "M108 252 Q106 274 108 300 L128 300 Q130 280 126 256 Z",
    leftFoot: { cx: 80, cy: 308 }, rightFoot: { cx: 116, cy: 308 },
  },
  {
    name: "Most Muscular",
    head: { cx: 100, cy: 30, tilt: -3 },
    face: { leftEye: { x: 95, y: 26 }, rightEye: { x: 105, y: 26 }, mouth: "M95 35 Q100 38 105 35", brow: "M91 22 L98 20.5 M102 20.5 L109 22" },
    neck: { x: 91, y: 48, w: 18, h: 12 },
    torso: "M76 66 L124 66 L128 172 L72 172 Z",
    leftArm: "M40 82 Q30 90 26 100 Q24 108 28 116 L38 114 Q36 106 38 98 Q42 90 50 84 Z",
    rightArm: "M152 82 Q162 90 166 100 Q168 108 164 116 L154 114 Q156 106 154 98 Q150 90 142 84 Z",
    leftForearm: "M28 116 Q32 126 40 134 L50 130 Q42 124 38 114 Z",
    rightForearm: "M164 116 Q160 126 152 134 L142 130 Q150 124 154 114 Z",
    leftHand: { cx: 46, cy: 140 }, rightHand: { cx: 146, cy: 140 },
    leftLeg: "M72 174 Q68 212 68 250 L88 250 Q90 222 88 202 Q84 182 82 174 Z",
    rightLeg: "M112 174 Q110 212 110 250 L130 250 Q132 222 130 202 Q126 182 118 174 Z",
    leftCalf: "M70 254 Q68 276 70 302 L88 302 Q90 282 88 258 Z",
    rightCalf: "M112 254 Q110 276 112 302 L130 302 Q132 282 130 258 Z",
    leftFoot: { cx: 80, cy: 310 }, rightFoot: { cx: 122, cy: 310 },
  },
  {
    name: "Lat Spread",
    head: { cx: 100, cy: 28 },
    face: { leftEye: { x: 95, y: 24 }, rightEye: { x: 105, y: 24 }, mouth: "M96 34 Q100 37 104 34", brow: "M91 20 L98 19 M102 19 L109 20" },
    neck: { x: 91, y: 46, w: 18, h: 14 },
    torso: "M72 66 L128 66 L132 170 L68 170 Z",
    leftArm: "M34 82 Q24 92 18 106 Q14 118 18 128 L30 126 Q28 116 30 106 Q34 94 44 84 Z",
    rightArm: "M158 82 Q168 92 174 106 Q178 118 174 128 L162 126 Q164 116 162 106 Q158 94 148 84 Z",
    leftForearm: "M18 128 Q16 142 22 154 L34 150 Q30 140 30 126 Z",
    rightForearm: "M174 128 Q176 142 170 154 L158 150 Q162 140 162 126 Z",
    leftHand: { cx: 28, cy: 160 }, rightHand: { cx: 164, cy: 160 },
    leftLeg: "M68 172 Q66 210 66 248 L86 248 Q88 220 86 200 Q82 180 78 172 Z",
    rightLeg: "M114 172 Q112 210 112 248 L132 248 Q134 220 132 200 Q128 180 122 172 Z",
    leftCalf: "M68 252 Q66 274 68 300 L86 300 Q88 280 86 256 Z",
    rightCalf: "M114 252 Q112 274 114 300 L132 300 Q134 280 132 256 Z",
    leftFoot: { cx: 77, cy: 308 }, rightFoot: { cx: 123, cy: 308 },
  },
  {
    name: "Side Tricep",
    head: { cx: 100, cy: 28, tilt: 3 },
    face: { leftEye: { x: 95, y: 24 }, rightEye: { x: 105, y: 24 }, mouth: "M96 33 Q100 35 104 33", brow: "M92 21 L97 20 M103 20 L108 21" },
    neck: { x: 91, y: 46, w: 18, h: 14 },
    torso: "M78 66 L122 66 L126 170 L74 170 Z",
    leftArm: "M42 84 Q34 92 30 104 Q28 114 32 122 L42 120 Q40 112 42 104 Q46 94 52 86 Z",
    rightArm: "M150 84 Q158 78 164 68 Q168 58 166 50 L156 48 Q158 58 154 66 Q150 74 142 82 Z",
    leftForearm: "M32 122 Q28 134 30 146 L42 146 Q42 136 42 120 Z",
    rightForearm: "M166 50 Q170 40 168 30 L156 28 Q158 38 156 48 Z",
    leftHand: { cx: 36, cy: 154 }, rightHand: { cx: 162, cy: 24 },
    leftLeg: "M74 172 Q72 210 72 248 L90 248 Q92 220 90 200 Q86 180 84 172 Z",
    rightLeg: "M110 172 Q108 210 108 248 L126 248 Q128 220 126 200 Q122 180 116 172 Z",
    leftCalf: "M74 252 Q72 274 74 300 L90 300 Q92 280 90 256 Z",
    rightCalf: "M110 252 Q108 274 110 300 L126 300 Q128 280 126 256 Z",
    leftFoot: { cx: 82, cy: 308 }, rightFoot: { cx: 118, cy: 308 },
  },
  {
    name: "Abs & Thigh",
    head: { cx: 100, cy: 28, tilt: -4 },
    face: { leftEye: { x: 95, y: 24 }, rightEye: { x: 105, y: 24 }, mouth: "M95 33 Q100 36 105 33", brow: "M91 20 L97 18 M103 18 L109 20" },
    neck: { x: 91, y: 46, w: 18, h: 14 },
    torso: "M78 66 L122 66 L126 170 L74 170 Z",
    leftArm: "M42 84 Q28 78 20 66 Q16 56 20 48 L30 50 Q28 58 32 66 Q38 76 48 82 Z",
    rightArm: "M150 84 Q164 78 172 66 Q176 56 172 48 L162 50 Q164 58 160 66 Q154 76 144 82 Z",
    leftForearm: "M20 48 Q16 38 20 28 L30 26 Q28 36 30 50 Z",
    rightForearm: "M172 48 Q176 38 172 28 L162 26 Q164 36 162 50 Z",
    leftHand: { cx: 24, cy: 22 }, rightHand: { cx: 168, cy: 22 },
    leftLeg: "M74 172 Q66 210 62 248 L80 248 Q84 220 84 200 Q82 180 80 172 Z",
    rightLeg: "M120 172 Q118 210 118 248 L136 248 Q138 220 136 200 Q132 180 126 172 Z",
    leftCalf: "M64 252 Q62 274 64 300 L80 300 Q82 280 80 256 Z",
    rightCalf: "M120 252 Q118 274 120 300 L136 300 Q138 280 136 256 Z",
    leftFoot: { cx: 72, cy: 308 }, rightFoot: { cx: 128, cy: 308 },
  },
  {
    name: "Victory",
    head: { cx: 100, cy: 28, tilt: 2 },
    face: { leftEye: { x: 95, y: 24 }, rightEye: { x: 105, y: 24 }, mouth: "M95 33 Q100 37 105 33", brow: "M92 20 L98 19 M102 19 L108 20" },
    neck: { x: 91, y: 46, w: 18, h: 14 },
    torso: "M78 66 L122 66 L126 170 L74 170 Z",
    leftArm: "M42 82 Q30 70 24 54 Q20 40 24 30 L34 32 Q32 42 34 52 Q38 66 48 78 Z",
    rightArm: "M150 82 Q162 70 168 54 Q172 40 168 30 L158 32 Q160 42 158 52 Q154 66 144 78 Z",
    leftForearm: "M24 30 Q20 18 24 8 L34 6 Q32 16 34 32 Z",
    rightForearm: "M168 30 Q172 18 168 8 L158 6 Q160 16 158 32 Z",
    leftHand: { cx: 28, cy: 4 }, rightHand: { cx: 164, cy: 4 },
    leftLeg: "M74 172 Q72 210 72 248 L90 248 Q92 220 90 200 Q86 180 84 172 Z",
    rightLeg: "M110 172 Q108 210 108 248 L126 248 Q128 220 126 200 Q122 180 116 172 Z",
    leftCalf: "M74 252 Q72 274 74 300 L90 300 Q92 280 90 256 Z",
    rightCalf: "M110 252 Q108 274 110 300 L126 300 Q128 280 126 256 Z",
    leftFoot: { cx: 82, cy: 308 }, rightFoot: { cx: 118, cy: 308 },
  },
];

const BodySelector = () => {
  const navigate = useNavigate();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [step, setStep] = useState<"body" | "equipment" | "noequip">("body");
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);
  const [animatingPart, setAnimatingPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [poseIndex, setPoseIndex] = useState(0);

  // Cycle poses — just swap index; CSS transition handles the smoothness
  useEffect(() => {
    if (selectedPart || step !== "body") return;
    const timer = setInterval(() => {
      setPoseIndex(prev => (prev + 1) % poses.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedPart, step]);

  const handlePartClick = useCallback((id: string) => {
    setAnimatingPart(id);
    setBouncingId(id);
    setTimeout(() => {
      setSelectedPart(id);
      setBouncingId(null);
      setTimeout(() => {
        setAnimatingPart(null);
        setStep("equipment");
      }, 400);
    }, 300);
  }, []);

  const handleEquipmentClick = (id: string) => {
    setBouncingId(id);
    setTimeout(() => {
      setBouncingId(null);
      if (id === "none") { setStep("noequip"); } else {
        navigate(`/body/${selectedPart}`);
      }
    }, 300);
  };

  const suggestedEquip = selectedPart
    ? selectedPart === "legs" || selectedPart === "glutes" || selectedPart === "hamstrings" || selectedPart === "hip-flexors" ? ["none", "barbell", "bands", "kettlebell"]
      : selectedPart === "back" || selectedPart === "lats" || selectedPart === "lower-back" ? ["pullup-bar", "dumbbells", "barbell", "cables"]
        : selectedPart === "chest" ? ["none", "dumbbells", "barbell", "cables"]
          : ["none", "dumbbells", "bands", "kettlebell"]
    : [];

  const filteredNoEquip = selectedPart
    ? noEquipWorkouts.filter(w => w.bodyPart === selectedPart || w.bodyPart === "full")
    : noEquipWorkouts;

  // SVG styling helpers
  const partState = (id: string) => {
    if (animatingPart === id || bouncingId === id) return "active";
    if (selectedPart === id) return "selected";
    if (hoveredPart === id) return "hovered";
    return "idle";
  };

  const fillFor = (id: string) => {
    const s = partState(id);
    if (s === "active") return "hsl(var(--primary) / 0.6)";
    if (s === "selected") return "hsl(var(--primary) / 0.35)";
    if (s === "hovered") return "hsl(var(--primary) / 0.2)";
    return "hsl(var(--muted) / 0.5)";
  };

  const strokeFor = (id: string) => {
    const s = partState(id);
    if (s === "active") return "hsl(var(--primary))";
    if (s === "selected") return "hsl(var(--primary) / 0.8)";
    if (s === "hovered") return "hsl(var(--primary) / 0.6)";
    return "hsl(var(--primary) / 0.2)";
  };

  const strokeW = (id: string) => {
    const s = partState(id);
    return s === "active" ? 2.5 : s === "selected" ? 2 : s === "hovered" ? 1.5 : 0.8;
  };

  const glowFilter = (id: string) => {
    const s = partState(id);
    if (s === "active") return "drop-shadow(0 0 8px hsl(var(--primary) / 0.7))";
    if (s === "selected") return "drop-shadow(0 0 5px hsl(var(--primary) / 0.4))";
    return "none";
  };

  const partProps = (id: string) => ({
    onClick: () => handlePartClick(id),
    onMouseEnter: () => setHoveredPart(id),
    onMouseLeave: () => setHoveredPart(null),
    style: {
      cursor: "pointer",
      fill: fillFor(id),
      stroke: strokeFor(id),
      strokeWidth: strokeW(id),
      transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      filter: glowFilter(id),
    } as React.CSSProperties,
  });

  // Label line data
  const labelData: { id: string; label: string; cx: number; cy: number; lx: number; ly: number; align: "left" | "right" }[] = [
    { id: "neck", label: "Neck", cx: 100, cy: 58, lx: 160, ly: 50, align: "right" },
    { id: "traps", label: "Traps", cx: 100, cy: 72, lx: 160, ly: 68, align: "right" },
    { id: "shoulders", label: "Shoulders", cx: 60, cy: 88, lx: 10, ly: 80, align: "left" },
    { id: "chest", label: "Chest", cx: 100, cy: 102, lx: 160, ly: 100, align: "right" },
    { id: "arms", label: "Arms", cx: 44, cy: 118, lx: 4, ly: 114, align: "left" },
    { id: "back", label: "Back", cx: 100, cy: 110, lx: 160, ly: 118, align: "right" },
    { id: "lats", label: "Lats", cx: 72, cy: 118, lx: 10, ly: 132, align: "left" },
    { id: "core", label: "Core", cx: 100, cy: 140, lx: 160, ly: 138, align: "right" },
    { id: "obliques", label: "Obliques", cx: 78, cy: 138, lx: 10, ly: 150, align: "left" },
    { id: "forearms", label: "Forearms", cx: 40, cy: 154, lx: 4, ly: 168, align: "left" },
    { id: "lower-back", label: "Lower Back", cx: 100, cy: 158, lx: 160, ly: 156, align: "right" },
    { id: "hip-flexors", label: "Hip Flexors", cx: 90, cy: 178, lx: 10, ly: 182, align: "left" },
    { id: "glutes", label: "Glutes", cx: 100, cy: 192, lx: 160, ly: 176, align: "right" },
    { id: "legs", label: "Quads", cx: 86, cy: 230, lx: 10, ly: 224, align: "left" },
    { id: "hamstrings", label: "Hamstrings", cx: 114, cy: 230, lx: 170, ly: 218, align: "right" },
    { id: "calves", label: "Calves", cx: 84, cy: 298, lx: 10, ly: 296, align: "left" },
    { id: "rear-delts", label: "Rear Delts", cx: 140, cy: 88, lx: 170, ly: 86, align: "right" },
  ];

  const activeLabel = labelData.find(l => l.id === (hoveredPart || selectedPart || animatingPart));
  const pose = poses[poseIndex];

  const T = "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  const BodyModel = () => (
    <svg viewBox="0 0 200 320" className="w-full h-full">
      <defs>
        <radialGradient id="bodyAura" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="160" rx="90" ry="155" fill="url(#bodyAura)" />

      {/* Head with tilt */}
      <g style={{ transition: T, transform: `rotate(${pose.head.tilt || 0}deg)`, transformOrigin: `${pose.head.cx}px ${pose.head.cy + 18}px` }}>
        <ellipse cx={pose.head.cx} cy={pose.head.cy} rx="14" ry="18"
          fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1.2"
          style={{ transition: T }} />
        {/* Eyes — small filled circles */}
        <circle cx={pose.face.leftEye.x} cy={pose.face.leftEye.y} r="1.2"
          fill="hsl(var(--primary) / 0.5)" style={{ transition: T }}>
          <animate attributeName="r" values="1.2;0.4;1.2" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <circle cx={pose.face.rightEye.x} cy={pose.face.rightEye.y} r="1.2"
          fill="hsl(var(--primary) / 0.5)" style={{ transition: T }}>
          <animate attributeName="r" values="1.2;0.4;1.2" dur="3.5s" repeatCount="indefinite" />
        </circle>
        {/* Eyebrows */}
        {pose.face.brow && (
          <path d={pose.face.brow} fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.8" strokeLinecap="round"
            style={{ transition: T }} />
        )}
        {/* Mouth */}
        <path d={pose.face.mouth} fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.7" strokeLinecap="round"
          style={{ transition: T }} />
        {/* Nose hint */}
        <line x1={pose.head.cx} y1={pose.head.cy - 1} x2={pose.head.cx} y2={pose.head.cy + 3}
          stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.5" style={{ transition: T }} />
        {/* Jaw line */}
        <path d={`M${pose.head.cx - 10} ${pose.head.cy + 6} Q${pose.head.cx} ${pose.head.cy + 16} ${pose.head.cx + 10} ${pose.head.cy + 6}`}
          fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.5" style={{ transition: T }} />
      </g>

      {/* Neck */}
      <rect x={pose.neck.x} y={pose.neck.y} width={pose.neck.w} height={pose.neck.h} rx="4"
        {...partProps("neck")} style={{ ...partProps("neck").style, transition: T }} />

      {/* Traps */}
      <path d={`M${pose.neck.x - 13} ${pose.neck.y + pose.neck.h + 6} L${pose.neck.x} ${pose.neck.y + 2} L${pose.neck.x + pose.neck.w} ${pose.neck.y + 2} L${pose.neck.x + pose.neck.w + 13} ${pose.neck.y + pose.neck.h + 6} Z`}
        {...partProps("traps")} style={{ ...partProps("traps").style, transition: T }} />

      {/* Shoulders */}
      <ellipse cx={pose.neck.x - 18} cy={pose.neck.y + pose.neck.h + 14} rx="18" ry="12"
        {...partProps("shoulders")} style={{ ...partProps("shoulders").style, transition: T }} />
      <ellipse cx={pose.neck.x + pose.neck.w + 18} cy={pose.neck.y + pose.neck.h + 14} rx="18" ry="12"
        {...partProps("shoulders")} style={{ ...partProps("shoulders").style, transition: T }} />

      {/* Rear Delts */}
      <path d={`M${pose.neck.x - 32} ${pose.neck.y + pose.neck.h + 10} Q${pose.neck.x - 24} ${pose.neck.y + pose.neck.h + 2} ${pose.neck.x - 16} ${pose.neck.y + pose.neck.h + 10}`}
        fill="none" {...partProps("rear-delts")} style={{ ...partProps("rear-delts").style, transition: T }} />
      <path d={`M${pose.neck.x + pose.neck.w + 16} ${pose.neck.y + pose.neck.h + 10} Q${pose.neck.x + pose.neck.w + 24} ${pose.neck.y + pose.neck.h + 2} ${pose.neck.x + pose.neck.w + 32} ${pose.neck.y + pose.neck.h + 10}`}
        fill="none" {...partProps("rear-delts")} style={{ ...partProps("rear-delts").style, transition: T }} />

      {/* Chest */}
      <path d="M82 82 L98 82 L96 110 Q88 116 82 108 Z"
        {...partProps("chest")} style={{ ...partProps("chest").style, transition: T }} />
      <path d="M102 82 L118 82 L118 108 Q112 116 104 110 Z"
        {...partProps("chest")} style={{ ...partProps("chest").style, transition: T }} />
      <line x1="100" y1="82" x2="100" y2="112" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.5" />

      {/* Back hitbox */}
      <rect x="84" y="84" width="32" height="24" rx="4" opacity="0" {...partProps("back")} />

      {/* Lats */}
      <path d="M72 92 L80 92 L80 140 L76 150 L70 138 Z"
        {...partProps("lats")} style={{ ...partProps("lats").style, transition: T }} />
      <path d="M120 92 L128 92 L130 138 L124 150 L120 140 Z"
        {...partProps("lats")} style={{ ...partProps("lats").style, transition: T }} />

      {/* Arms */}
      <path d={pose.leftArm} {...partProps("arms")}
        style={{ ...partProps("arms").style, transition: T }} />
      <path d={pose.rightArm} {...partProps("arms")}
        style={{ ...partProps("arms").style, transition: T }} />

      {/* Forearms */}
      <path d={pose.leftForearm} {...partProps("forearms")}
        style={{ ...partProps("forearms").style, transition: T }} />
      <path d={pose.rightForearm} {...partProps("forearms")}
        style={{ ...partProps("forearms").style, transition: T }} />

      {/* Hands */}
      <ellipse cx={pose.leftHand.cx} cy={pose.leftHand.cy} rx="6" ry="7"
        fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.6" style={{ transition: T }} />
      <ellipse cx={pose.rightHand.cx} cy={pose.rightHand.cy} rx="6" ry="7"
        fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.6" style={{ transition: T }} />

      {/* Core */}
      <rect x="86" y="116" width="28" height="40" rx="4" {...partProps("core")} />
      <line x1="100" y1="118" x2="100" y2="154" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.5" />
      <line x1="88" y1="128" x2="112" y2="128" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.4" />
      <line x1="88" y1="138" x2="112" y2="138" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.4" />
      <line x1="88" y1="148" x2="112" y2="148" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.4" />

      {/* Obliques */}
      <path d="M78 116 L86 116 L84 158 L76 148 Z" {...partProps("obliques")} />
      <path d="M114 116 L122 116 L124 148 L116 158 Z" {...partProps("obliques")} />

      {/* Lower Back */}
      <rect x="88" y="150" width="24" height="14" rx="3" {...partProps("lower-back")} />

      {/* Hip Flexors */}
      <ellipse cx="88" cy="174" rx="9" ry="6" {...partProps("hip-flexors")} />
      <ellipse cx="112" cy="174" rx="9" ry="6" {...partProps("hip-flexors")} />

      {/* Glutes */}
      <ellipse cx="90" cy="186" rx="14" ry="10" {...partProps("glutes")} />
      <ellipse cx="110" cy="186" rx="14" ry="10" {...partProps("glutes")} />

      {/* Quads */}
      <path d={pose.leftLeg} {...partProps("legs")}
        style={{ ...partProps("legs").style, transition: T }} />
      <path d={pose.rightLeg} {...partProps("legs")}
        style={{ ...partProps("legs").style, transition: T }} />

      {/* Hamstrings */}
      <path d="M74 200 L72 198 L70 236 L74 248 L78 236 Z" {...partProps("hamstrings")} />
      <path d="M126 200 L128 198 L130 236 L126 248 L122 236 Z" {...partProps("hamstrings")} />

      {/* Calves */}
      <path d={pose.leftCalf} {...partProps("calves")}
        style={{ ...partProps("calves").style, transition: T }} />
      <path d={pose.rightCalf} {...partProps("calves")}
        style={{ ...partProps("calves").style, transition: T }} />

      {/* Feet */}
      <ellipse cx={pose.leftFoot.cx} cy={pose.leftFoot.cy} rx="11" ry="5"
        fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.6" style={{ transition: T }} />
      <ellipse cx={pose.rightFoot.cx} cy={pose.rightFoot.cy} rx="11" ry="5"
        fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.6" style={{ transition: T }} />

      {/* Label with connector line */}
      {activeLabel && (
        <g>
          <line x1={activeLabel.cx} y1={activeLabel.cy} x2={activeLabel.lx} y2={activeLabel.ly}
            stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="3,2" opacity="0.7">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </line>
          <circle cx={activeLabel.cx} cy={activeLabel.cy} r="3" fill="hsl(var(--primary))" opacity="0.9">
            <animate attributeName="r" values="3;4;3" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <rect
            x={activeLabel.align === "left" ? activeLabel.lx - 4 : activeLabel.lx - 2}
            y={activeLabel.ly - 8} width={activeLabel.label.length * 6.5 + 10} height="16" rx="4"
            fill="hsl(var(--primary))" opacity="0.9" />
          <text x={activeLabel.align === "left" ? activeLabel.lx + 1 : activeLabel.lx + 3} y={activeLabel.ly + 3}
            fill="hsl(var(--primary-foreground))" fontSize="8" fontWeight="700" fontFamily="Inter, sans-serif">
            {activeLabel.label}
          </text>
        </g>
      )}

      {/* Pose name indicator */}
      {!selectedPart && !hoveredPart && (
        <text x="100" y="340" textAnchor="middle" fill="hsl(var(--muted-foreground))"
          fontSize="7" fontWeight="600" fontFamily="Inter, sans-serif"
          style={{ opacity: 0.6, transition: "opacity 0.5s ease" }}>
          {pose.name} Pose
        </text>
      )}
    </svg>
  );

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => step === "body" ? navigate(-1) : step === "noequip" ? setStep("equipment") : setStep("body")} className="p-1 transition-transform active:scale-90">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">
            {step === "body" ? "Select Body Part" : step === "equipment" ? "Choose Equipment" : "No Equipment Workouts"}
          </h1>
          <div className="w-6" />
        </div>

        {/* STEP 1 */}
        {step === "body" && (
          <div className="mt-4 animate-fade-in">
            <p className="text-center text-xs text-muted-foreground mb-2">Tap a muscle group to target</p>
            <div className="relative mx-auto" style={{ maxWidth: 300, height: 420 }}>
              <BodyModel />
            </div>

            <div className="mt-2 grid grid-cols-4 gap-1.5 pb-4">
              {bodyParts.map(part => (
                <button key={part.id} onClick={() => handlePartClick(part.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-[9px] font-semibold transition-all duration-300 ${
                    bouncingId === part.id ? "animate-bounce scale-110" : "active:scale-90"
                  } ${selectedPart === part.id ? "bg-primary/20 ring-1 ring-primary text-primary" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  <Dumbbell className="h-3 w-3" />{part.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Equipment */}
        {step === "equipment" && (
          <div className="mt-4 animate-fade-in">
            <div className="gym-gradient-card rounded-2xl p-4 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Target</p>
              <p className="text-lg font-bold mt-1">{bodyParts.find(b => b.id === selectedPart)?.label}</p>
            </div>

            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">⭐ Suggested</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {equipmentList.filter(e => suggestedEquip.includes(e.id)).map(eq => (
                <button key={eq.id} onClick={() => handleEquipmentClick(eq.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 ring-1 ring-primary/30 bg-primary/10 transition-all duration-200 ${
                    bouncingId === eq.id ? "animate-bounce scale-105" : "active:scale-95"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-3xl">{eq.emoji}</div>
                  <p className="text-xs font-bold text-center">{eq.label}</p>
                  <p className="text-[9px] text-muted-foreground text-center">{eq.desc}</p>
                </button>
              ))}
            </div>

            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">All Equipment</h3>
            <div className="grid grid-cols-2 gap-2 pb-4">
              {equipmentList.filter(e => !suggestedEquip.includes(e.id)).map(eq => (
                <button key={eq.id} onClick={() => handleEquipmentClick(eq.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl gym-gradient-card p-4 transition-all duration-200 ${
                    bouncingId === eq.id ? "animate-bounce scale-105" : "active:scale-95 hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-3xl">{eq.emoji}</div>
                  <p className="text-xs font-bold text-center">{eq.label}</p>
                  <p className="text-[9px] text-muted-foreground text-center">{eq.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: No Equipment */}
        {step === "noequip" && (
          <div className="mt-4 animate-fade-in">
            <div className="gym-gradient-orange rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary-foreground" />
                <div>
                  <p className="text-sm font-bold text-primary-foreground">Bodyweight Only 💪</p>
                  <p className="text-[10px] text-primary-foreground/70">No gym? No problem.</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 pb-4">
              {filteredNoEquip.map(workout => (
                <div key={workout.id} className="rounded-2xl overflow-hidden gym-gradient-card">
                  <button onClick={() => setExpandedWorkout(expandedWorkout === workout.id ? null : workout.id)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-all active:scale-[0.98]"
                  >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${workout.color} text-3xl`}>{workout.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold">{workout.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{workout.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] font-semibold text-primary">{workout.duration}</span>
                        <span className="text-[9px] text-muted-foreground">{workout.reps}</span>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedWorkout === workout.id ? "rotate-90" : ""}`} />
                  </button>
                  {expandedWorkout === workout.id && (
                    <div className="border-t border-border px-4 pb-4 pt-3 animate-fade-in">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Exercises</p>
                      {workout.steps.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 mb-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-[9px] font-bold text-primary">{i + 1}</span>
                          <span className="text-xs">{s}</span>
                        </div>
                      ))}
                      <button onClick={() => {
                        const routeMap: Record<string, string> = {
                          "lats": "back", "obliques": "core", "hip-flexors": "legs",
                          "hamstrings": "legs", "rear-delts": "shoulders", "lower-back": "back",
                        };
                        navigate(`/body/${routeMap[selectedPart || ""] || selectedPart || "chest"}`);
                      }}
                        className="mt-3 w-full rounded-xl gym-gradient-orange py-2.5 text-xs font-bold text-primary-foreground active:scale-95 transition-transform"
                      >Start Workout 🔥</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default BodySelector;
