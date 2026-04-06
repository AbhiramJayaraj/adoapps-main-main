import { ChevronLeft, Bell, MoreVertical, UtensilsCrossed, BarChart3, ChevronDown, Plus, Heart, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";

const days = [
  { date: 2, day: "MON", month: "MAR" },
  { date: 3, day: "TUE", month: "MAR" },
  { date: 4, day: "WED", month: "MAR" },
  { date: 5, day: "THU", month: "MAR" },
  { date: 6, day: "FRI", month: "MAR" },
  { date: 7, day: "SAT", month: "MAR" },
  { date: 8, day: "SUN", month: "MAR" },
];

const meals = [
  { name: "Meal 1", time: "09:00 AM", kcal: 0 },
  { name: "Meal 2", time: "12:00 PM", kcal: 0 },
  { name: "Meal 3", time: "05:00 PM", kcal: 0 },
  { name: "Meal 4", time: "08:00 PM", kcal: 0 },
];

const DietTracker = () => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(8);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [mealFoods, setMealFoods] = useState<Record<number, string[]>>({});

  const addFood = (mealIndex: number) => {
    const food = prompt("Enter food name:");
    if (food) {
      setMealFoods((prev) => ({
        ...prev,
        [mealIndex]: [...(prev[mealIndex] || []), food],
      }));
    }
  };

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Diet Tracker</h1>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Date Picker */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {days.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDay(d.date)}
              className={`flex min-w-[52px] flex-col items-center rounded-xl px-2 py-2 text-[10px] transition-all ${
                selectedDay === d.date
                  ? "gym-gradient-orange text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <span className="font-medium">{d.month}</span>
              <span className="my-0.5 text-lg font-bold">{d.date}</span>
              <span>{d.day}</span>
            </button>
          ))}
        </div>

        {/* Calorie Summary */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">0 out of 2784.65</p>
                <p className="text-[10px] text-muted-foreground">Calories Consumed</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/diet-insight")}
              className="rounded-full bg-primary/20 p-2"
            >
              <BarChart3 className="h-4 w-4 text-primary" />
            </button>
          </div>
          <div className="mt-2 flex justify-center">
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Meals */}
        <div className="mt-4 space-y-3 pb-4">
          {meals.map((meal, index) => (
            <div key={index} className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-bold">{meal.name}</h3>
                  <span className="text-[10px] text-muted-foreground">{meal.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {(mealFoods[index]?.length || 0) > 0
                      ? `${mealFoods[index].length * 150} Kcal`
                      : `${meal.kcal} Kcal`}
                  </span>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Food list */}
              {mealFoods[index]?.map((food, fi) => (
                <div key={fi} className="mt-2 flex items-center justify-between rounded-lg bg-secondary px-3 py-2">
                  <span className="text-xs">{food}</span>
                  <span className="text-[10px] text-muted-foreground">~150 Kcal</span>
                </div>
              ))}

              <div className="mt-2 flex items-center justify-between">
                <button
                  onClick={() => addFood(index)}
                  className="flex items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-[10px] font-semibold text-primary transition-colors active:bg-primary/10"
                >
                  <Plus className="h-3 w-3" /> Add Food
                </button>
                <button
                  onClick={() => setExpandedMeal(expandedMeal === index ? null : index)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground"
                >
                  <ImageIcon className="h-3 w-3" /> Add Image & More
                  <ChevronDown className={`h-3 w-3 transition-transform ${expandedMeal === index ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DietTracker;
