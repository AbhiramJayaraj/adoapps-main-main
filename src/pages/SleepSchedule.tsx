import { ChevronLeft, Moon, Sun, Plus, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";

interface SleepEntry {
  id: string;
  bedtime: string;
  wakeTime: string;
  label: string;
  enabled: boolean;
}

const calculateDuration = (bed: string, wake: string) => {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const getSleepQuality = (bed: string, wake: string) => {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let mins = (wh * 60 + wm) - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  if (mins >= 420 && mins <= 540) return { label: "Optimal", color: "text-gym-green" };
  if (mins >= 360) return { label: "Good", color: "text-primary" };
  return { label: "Poor", color: "text-destructive" };
};

const SleepSchedule = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem("ado-sleep-schedule");
    return saved ? JSON.parse(saved) : [
      { id: "1", bedtime: "22:30", wakeTime: "06:30", label: "Weekday", enabled: true },
      { id: "2", bedtime: "23:00", wakeTime: "07:30", label: "Weekend", enabled: true },
    ];
  });
  const [newBed, setNewBed] = useState("22:00");
  const [newWake, setNewWake] = useState("06:00");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    localStorage.setItem("ado-sleep-schedule", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!newLabel.trim()) return;
    setEntries(prev => [...prev, { id: Date.now().toString(), bedtime: newBed, wakeTime: newWake, label: newLabel, enabled: true }]);
    setNewLabel("");
    toast({ title: "Sleep schedule added!", description: `${newLabel}: ${newBed} → ${newWake}` });
  };

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold">Sleep Schedule</h1>
          <div className="w-6" />
        </div>

        {/* Sleep Goal Card */}
        <div className="mt-4 gym-gradient-orange rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Moon className="h-6 w-6 text-primary-foreground" />
            <div>
              <p className="text-sm font-bold text-primary-foreground">Sleep Goal: 7-9 hours</p>
              <p className="text-[10px] text-primary-foreground/80">Quality sleep boosts muscle recovery by 60%</p>
            </div>
          </div>
        </div>

        {/* Add Sleep Schedule */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <h3 className="text-xs font-bold mb-3">Add Schedule</h3>
          <input
            type="text"
            placeholder="Schedule name..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="mt-2 flex gap-2">
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Moon className="h-3 w-3" /> Bedtime</p>
              <input type="time" value={newBed} onChange={(e) => setNewBed(e.target.value)} className="w-full rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground outline-none" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Sun className="h-3 w-3" /> Wake Up</p>
              <input type="time" value={newWake} onChange={(e) => setNewWake(e.target.value)} className="w-full rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground outline-none" />
            </div>
          </div>
          <button onClick={addEntry} className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl gym-gradient-orange py-2.5 text-xs font-bold text-primary-foreground active:scale-95 transition-transform">
            <Plus className="h-3.5 w-3.5" /> Add Schedule
          </button>
        </div>

        {/* Schedule List */}
        <div className="mt-4 space-y-2 pb-4">
          {entries.map((entry) => {
            const quality = getSleepQuality(entry.bedtime, entry.wakeTime);
            return (
              <div key={entry.id} className="gym-gradient-card rounded-2xl p-4 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold">{entry.label}</h3>
                      <span className={`text-[10px] font-bold ${quality.color}`}>{quality.label}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Moon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold">{entry.bedtime}</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-1.5">
                        <Sun className="h-3.5 w-3.5 text-gym-gold" />
                        <span className="text-xs font-semibold">{entry.wakeTime}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Duration: {calculateDuration(entry.bedtime, entry.wakeTime)}</span>
                    </div>
                  </div>
                  <button onClick={() => setEntries(prev => prev.filter(e => e.id !== entry.id))} className="p-1">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default SleepSchedule;
