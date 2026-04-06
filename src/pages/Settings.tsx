import { ChevronLeft, Palette, LogIn, Mail, ExternalLink, Trash2, Upload, FileText, X, User, Save } from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { themes, useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";

interface ImportedMealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  quantity: string;
}

interface ImportedMeal {
  name: string;
  time: string;
  items: ImportedMealItem[];
}

interface ImportedDietPlan {
  id: string;
  label: string;
  importedAt: string;
  meals: ImportedMeal[];
}

const parseDietText = (text: string): ImportedMeal[] => {
  const meals: ImportedMeal[] = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  let currentMeal: ImportedMeal | null = null;

  for (const line of lines) {
    // Detect meal headers like "Breakfast", "Lunch:", "Dinner - 7:00 PM", "Meal 1"
    const mealHeaderMatch = line.match(/^(breakfast|lunch|dinner|snack|pre[- ]?workout|post[- ]?workout|mid[- ]?morning|afternoon|evening|meal\s*\d+|brunch)/i);
    if (mealHeaderMatch) {
      if (currentMeal) meals.push(currentMeal);
      const timeMatch = line.match(/(\d{1,2}[:.]\d{2}\s*(am|pm)?)/i);
      currentMeal = {
        name: mealHeaderMatch[0].charAt(0).toUpperCase() + mealHeaderMatch[0].slice(1),
        time: timeMatch ? timeMatch[1] : "",
        items: [],
      };
      // Check if there are items on the same line after the header
      const afterHeader = line.slice(mealHeaderMatch[0].length).replace(/^[\s:—-]+/, "").trim();
      if (afterHeader && afterHeader.length > 2) {
        currentMeal.items.push(parseItemLine(afterHeader));
      }
      continue;
    }

    // If no meal started yet, create a default one
    if (!currentMeal) {
      currentMeal = { name: "Meal", time: "", items: [] };
    }

    // Parse food items - any line with text
    if (line.length > 1) {
      currentMeal.items.push(parseItemLine(line));
    }
  }
  if (currentMeal && currentMeal.items.length > 0) meals.push(currentMeal);

  // If no meals were found, treat entire text as one meal
  if (meals.length === 0 && lines.length > 0) {
    const singleMeal: ImportedMeal = { name: "Imported Meal", time: "", items: [] };
    for (const line of lines) {
      singleMeal.items.push(parseItemLine(line));
    }
    meals.push(singleMeal);
  }

  return meals;
};

const parseItemLine = (line: string): ImportedMealItem => {
  // Try to extract calories: "Chicken Breast 200cal" or "200 calories" or "200 kcal"
  const calMatch = line.match(/(\d+)\s*(cal|kcal|calories)/i);
  const proteinMatch = line.match(/(\d+)\s*g?\s*protein|protein[:\s]*(\d+)/i);
  const carbMatch = line.match(/(\d+)\s*g?\s*carb|carb[s]?[:\s]*(\d+)/i);
  const fatMatch = line.match(/(\d+)\s*g?\s*fat|fat[:\s]*(\d+)/i);
  const qtyMatch = line.match(/(\d+\s*(g|ml|oz|cup|tbsp|tsp|pcs?|slice|piece|serving|scoop|bowl)s?)/i);

  // Clean name by removing macro/calorie info
  let name = line
    .replace(/[-–•*]\s*/, "")
    .replace(/\d+\s*(cal|kcal|calories)/gi, "")
    .replace(/\d+\s*g?\s*(protein|carb|carbs|fat)/gi, "")
    .replace(/protein[:\s]*\d+/gi, "")
    .replace(/carb[s]?[:\s]*\d+/gi, "")
    .replace(/fat[:\s]*\d+/gi, "")
    .replace(/[P|C|F][:\s]*\d+g?/g, "")
    .replace(/\d+\s*(g|ml|oz|cup|tbsp|tsp|pcs?|slice|piece|serving|scoop|bowl)s?/gi, "")
    .replace(/[,|/]+\s*$/g, "")
    .trim();

  if (!name) name = "Food Item";

  const foodEmojis: Record<string, string> = {
    chicken: "🍗", rice: "🍚", egg: "🍳", fish: "🐟", salmon: "🐟", bread: "🍞",
    milk: "🥛", yogurt: "🥛", banana: "🍌", apple: "🍎", salad: "🥗", beef: "🥩",
    steak: "🥩", potato: "🥔", oat: "🥣", shake: "🥤", protein: "🥤", fruit: "🍓",
    vegetable: "🥦", broccoli: "🥦", pasta: "🍝", nut: "🥜", almond: "🥜",
    avocado: "🥑", cheese: "🧀", toast: "🍞", smoothie: "🥤", water: "💧",
  };
  
  let emoji = "🍽️";
  const lowerName = name.toLowerCase();
  for (const [key, val] of Object.entries(foodEmojis)) {
    if (lowerName.includes(key)) { emoji = val; break; }
  }

  return {
    name,
    calories: calMatch ? parseInt(calMatch[1]) : 0,
    protein: proteinMatch ? parseInt(proteinMatch[1] || proteinMatch[2]) : 0,
    carbs: carbMatch ? parseInt(carbMatch[1] || carbMatch[2]) : 0,
    fat: fatMatch ? parseInt(fatMatch[1] || fatMatch[2]) : 0,
    emoji,
    quantity: qtyMatch ? qtyMatch[1] : "",
  };
};

const Settings = () => {
  const navigate = useNavigate();
  const { currentTheme, setTheme } = useTheme();
  const { toast } = useToast();
  const [section, setSection] = useState<"themes" | "login" | "support" | "profile" | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [importLabel, setImportLabel] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile edit state
  const [profileName, setProfileName] = useState(() => localStorage.getItem("ado-user-name") || "");
  const [profileGender, setProfileGender] = useState(() => localStorage.getItem("ado-user-gender") || "");
  const [profileAge, setProfileAge] = useState(() => localStorage.getItem("ado-user-age") || "");
  const [profileHeight, setProfileHeight] = useState(() => localStorage.getItem("ado-user-height") || "");
  const [profileWeight, setProfileWeight] = useState(() => localStorage.getItem("ado-user-weight") || "");
  const [profileTargetWeight, setProfileTargetWeight] = useState(() => localStorage.getItem("ado-user-target-weight") || "");
  const [profileGoal, setProfileGoal] = useState(() => localStorage.getItem("ado-user-goal") || "");
  const [profileDuration, setProfileDuration] = useState(() => localStorage.getItem("ado-user-workout-duration") || "");
  const [profileExperience, setProfileExperience] = useState(() => localStorage.getItem("ado-user-experience") || "");

  const handleSaveProfile = () => {
    localStorage.setItem("ado-user-name", profileName.trim());
    localStorage.setItem("ado-user-gender", profileGender);
    localStorage.setItem("ado-user-age", profileAge);
    localStorage.setItem("ado-user-height", profileHeight);
    localStorage.setItem("ado-user-weight", profileWeight);
    localStorage.setItem("ado-user-target-weight", profileTargetWeight);
    localStorage.setItem("ado-user-goal", profileGoal);
    localStorage.setItem("ado-user-workout-duration", profileDuration);
    localStorage.setItem("ado-user-experience", profileExperience);
    toast({ title: "Profile Updated! ✅", description: "Your changes have been saved." });
  };

  const handleClearAppData = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast({ title: "Data Cleared", description: "All app data has been removed. Reloading..." });
    setTimeout(() => window.location.replace("/"), 1000);
  };

  const handleGoogleLogin = () => {
    toast({ title: "Google Login", description: "Connect your Google account to sync progress across devices." });
  };
  const handleFacebookLogin = () => {
    toast({ title: "Facebook Login", description: "Connect your Facebook account to sync progress across devices." });
  };

  const toggleSection = (s: typeof section) => setSection(section === s ? null : s);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (file.type === "application/json") {
        try {
          const json = JSON.parse(text);
          // Try to extract meaningful text from JSON
          setImportText(JSON.stringify(json, null, 2));
        } catch {
          setImportText(text);
        }
      } else {
        setImportText(text);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportDiet = () => {
    if (!importText.trim()) {
      toast({ title: "No data", description: "Please paste or upload your diet data first." });
      return;
    }

    const meals = parseDietText(importText);
    if (meals.length === 0) {
      toast({ title: "Could not parse", description: "Unable to understand the diet data. Try a different format." });
      return;
    }

    const existing: ImportedDietPlan[] = JSON.parse(localStorage.getItem("ado-imported-diets") || "[]");
    const newPlan: ImportedDietPlan = {
      id: Date.now().toString(),
      label: importLabel.trim() || `Import ${existing.length + 1}`,
      importedAt: new Date().toISOString(),
      meals,
    };
    existing.push(newPlan);
    localStorage.setItem("ado-imported-diets", JSON.stringify(existing));

    toast({ title: "Diet Imported! 🎉", description: `"${newPlan.label}" with ${meals.length} meals added to your Diet Plan.` });
    setImportText("");
    setImportLabel("");
    setShowImportModal(false);
  };

  const importedCount = JSON.parse(localStorage.getItem("ado-imported-diets") || "[]").length;

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">Settings</h1>
          <div className="w-6" />
        </div>

        {/* Edit Profile */}
        <button onClick={() => toggleSection("profile")} className="mt-4 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><User className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Edit Profile</p>
            <p className="text-[10px] text-muted-foreground">{profileName || "Update your info"}</p>
          </div>
        </button>

        {section === "profile" && (
          <div className="mt-3 space-y-3 animate-fade-in gym-gradient-card rounded-2xl p-4">
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Name</label>
              <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} placeholder="Your name"
                className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Gender</label>
                <select value={profileGender} onChange={e => setProfileGender(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground outline-none">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Age</label>
                <input type="number" value={profileAge} onChange={e => setProfileAge(e.target.value)} placeholder="25"
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Height (cm)</label>
                <input type="number" value={profileHeight} onChange={e => setProfileHeight(e.target.value)} placeholder="170"
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Weight (kg)</label>
                <input type="number" value={profileWeight} onChange={e => setProfileWeight(e.target.value)} placeholder="70"
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target (kg)</label>
                <input type="number" value={profileTargetWeight} onChange={e => setProfileTargetWeight(e.target.value)} placeholder="65"
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fitness Goal</label>
              <select value={profileGoal} onChange={e => setProfileGoal(e.target.value)}
                className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground outline-none">
                <option value="">Select</option>
                <option value="lose">🔥 Lose Weight</option>
                <option value="gain">💪 Build Muscle</option>
                <option value="maintain">⚖️ Stay Fit</option>
                <option value="endurance">🏃 Endurance</option>
                <option value="flexibility">🧘 Flexibility</option>
                <option value="strength">🏋️ Raw Strength</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Session (min)</label>
                <select value={profileDuration} onChange={e => setProfileDuration(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground outline-none">
                  <option value="">Select</option>
                  <option value="15">15 min</option>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="90">90+ min</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Experience</label>
                <select value={profileExperience} onChange={e => setProfileExperience(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-foreground outline-none">
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>
            </div>
            <button onClick={handleSaveProfile} className="flex w-full items-center justify-center gap-2 rounded-xl gym-gradient-orange py-3 text-sm font-bold text-primary-foreground active:scale-95 transition-transform">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        )}

        {/* Theme Section */}
        <button onClick={() => toggleSection("themes")} className="mt-4 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><Palette className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Themes</p>
            <p className="text-[10px] text-muted-foreground">Current: {currentTheme.name}</p>
          </div>
        </button>

        {section === "themes" && (
          <div className="mt-3 grid grid-cols-2 gap-2 animate-fade-in">
            {themes.map((theme) => {
              const isActive = currentTheme.id === theme.id;
              const primaryColor = `hsl(${theme.colors["--primary"]})`;
              const bgColor = `hsl(${theme.colors["--background"]})`;
              const cardColor = `hsl(${theme.colors["--card"]})`;
              return (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl p-3 transition-all duration-300 active:scale-90 ${
                    isActive ? "ring-2 ring-primary scale-[1.02]" : "gym-gradient-card hover:scale-[1.02]"
                  }`}
                  style={isActive ? { background: `linear-gradient(145deg, ${cardColor}, ${bgColor})` } : {}}
                >
                  {isActive && (
                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: primaryColor, color: `hsl(${theme.colors["--primary-foreground"]})` }}>✓</div>
                  )}
                  <div className="flex gap-1.5">
                    <div className="h-7 w-7 rounded-lg" style={{ background: primaryColor }} />
                    <div className="h-7 w-7 rounded-lg" style={{ background: bgColor, border: `1px solid hsl(${theme.colors["--border"]})` }} />
                    <div className="h-7 w-7 rounded-lg" style={{ background: cardColor }} />
                  </div>
                  <span className="text-lg">{theme.emoji}</span>
                  <span className="text-[9px] font-semibold text-foreground">{theme.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Import Diet Data */}
        <button onClick={() => setShowImportModal(true)} className="mt-3 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><Upload className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Import Diet Data</p>
            <p className="text-[10px] text-muted-foreground">
              {importedCount > 0 ? `${importedCount} plan${importedCount > 1 ? "s" : ""} imported` : "Import from other apps"}
            </p>
          </div>
        </button>

        {/* Login Section */}
        <button onClick={() => toggleSection("login")} className="mt-3 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><LogIn className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Login & Accounts</p>
            <p className="text-[10px] text-muted-foreground">Sign in to sync your progress</p>
          </div>
        </button>

        {section === "login" && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <button onClick={handleGoogleLogin} className="flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-all active:scale-95">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Sign in with Google</p>
                <p className="text-[10px] text-muted-foreground">Use your Google account</p>
              </div>
            </button>
            <button onClick={handleFacebookLogin} className="flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-all active:scale-95">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold">Sign in with Facebook</p>
                <p className="text-[10px] text-muted-foreground">Use your Facebook account</p>
              </div>
            </button>
            <div className="gym-gradient-card rounded-2xl p-4">
              <p className="text-xs font-bold text-center">Don't have an account?</p>
              <div className="mt-3 flex gap-2">
                <button onClick={handleGoogleLogin} className="flex-1 rounded-xl gym-gradient-orange py-2.5 text-xs font-bold text-primary-foreground active:scale-95 transition-transform">Sign Up with Google</button>
                <button onClick={handleFacebookLogin} className="flex-1 rounded-xl bg-[#1877F2] py-2.5 text-xs font-bold text-white active:scale-95 transition-transform">Sign Up with Facebook</button>
              </div>
            </div>
          </div>
        )}

        {/* Support Section */}
        <button onClick={() => toggleSection("support")} className="mt-3 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20"><Mail className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold">Support</p>
            <p className="text-[10px] text-muted-foreground">Get help or report issues</p>
          </div>
        </button>

        {section === "support" && (
          <div className="mt-3 space-y-3 animate-fade-in">
            <div className="gym-gradient-card rounded-2xl p-5">
              <p className="text-sm font-bold mb-1">Contact Us</p>
              <p className="text-[10px] text-muted-foreground mb-3">Have questions or need help? Reach out to us!</p>
              <a href="mailto:mainlyakhil@gmail.com" className="flex items-center gap-3 rounded-xl bg-primary/10 p-3 transition-all active:scale-95">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20"><Mail className="h-5 w-5 text-primary" /></div>
                <div className="flex-1">
                  <p className="text-xs font-bold">mainlyakhil@gmail.com</p>
                  <p className="text-[9px] text-muted-foreground">Tap to send email</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
            <div className="gym-gradient-card rounded-2xl p-5">
              <p className="text-sm font-bold mb-2">FAQ</p>
              <div className="space-y-2">
                {[
                  { q: "How do I change themes?", a: "Go to Settings → Themes and pick your favorite." },
                  { q: "Is my data saved?", a: "Currently all data is stored locally on your device." },
                  { q: "Can I sync across devices?", a: "Sign in with Google or Facebook to sync (coming soon)." },
                ].map((faq, i) => (
                  <details key={i} className="group">
                    <summary className="text-xs font-semibold cursor-pointer list-none flex items-center justify-between py-1.5">
                      {faq.q}
                      <ChevronLeft className="h-3 w-3 text-muted-foreground -rotate-90 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-[10px] text-muted-foreground pl-1 pb-1">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Clear App Data */}
        <button onClick={() => setShowClearConfirm(true)} className="mt-3 flex w-full items-center gap-3 rounded-2xl gym-gradient-card p-4 transition-transform active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/20"><Trash2 className="h-5 w-5 text-destructive" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-destructive">Clear App Data</p>
            <p className="text-[10px] text-muted-foreground">Delete all saved data & reset app</p>
          </div>
        </button>

        {/* Clear Confirm Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in" onClick={() => setShowClearConfirm(false)}>
            <div className="mx-6 w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold">Are you sure?</p>
              <p className="mt-1 text-xs text-muted-foreground">This will permanently delete all your progress, settings, and saved data. This action cannot be undone.</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 rounded-xl bg-secondary py-2.5 text-xs font-bold text-secondary-foreground active:scale-95 transition-transform">Cancel</button>
                <button onClick={handleClearAppData} className="flex-1 rounded-xl bg-destructive py-2.5 text-xs font-bold text-destructive-foreground active:scale-95 transition-transform">Clear All Data</button>
              </div>
            </div>
          </div>
        )}

        {/* Import Diet Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60" onClick={() => setShowImportModal(false)}>
            <div onClick={e => e.stopPropagation()} className="w-full max-w-md rounded-t-3xl bg-card p-5 pb-8 animate-fade-in max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">📥 Import Diet Data</h2>
                <button onClick={() => setShowImportModal(false)} className="p-1"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">Paste diet data from any app, or upload a text/JSON file. The app will parse meals, calories, and macros automatically.</p>

              {/* Label */}
              <div className="mt-4">
                <label className="text-[10px] font-bold text-muted-foreground">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. MyFitnessPal Export, Coach's Plan..."
                  value={importLabel}
                  onChange={e => setImportLabel(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>

              {/* Text Area */}
              <div className="mt-3">
                <label className="text-[10px] font-bold text-muted-foreground">Diet Data</label>
                <textarea
                  placeholder={`Paste your diet plan here...\n\nExample:\nBreakfast - 7:00 AM\nEgg Whites 150cal 22g protein\nWhole Wheat Toast 80cal\n\nLunch - 1:00 PM\nGrilled Chicken 200cal 38g protein\nBrown Rice 130cal`}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  rows={8}
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none resize-none"
                />
              </div>

              {/* File Upload */}
              <input ref={fileInputRef} type="file" accept=".txt,.json,.csv" className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-foreground active:scale-95 transition-transform">
                <FileText className="h-3.5 w-3.5" /> Upload File (.txt, .json, .csv)
              </button>

              {/* Import Button */}
              <button onClick={handleImportDiet} className="mt-4 w-full rounded-xl gym-gradient-orange py-3 text-sm font-bold text-primary-foreground active:scale-95 transition-transform">
                Import Diet Plan
              </button>

              {/* Format Tips */}
              <div className="mt-4 rounded-xl bg-secondary/50 p-3">
                <p className="text-[10px] font-bold mb-1">💡 Supported formats:</p>
                <ul className="text-[9px] text-muted-foreground space-y-0.5">
                  <li>• Plain text with meal names (Breakfast, Lunch, etc.)</li>
                  <li>• Foods with calories: "Chicken 200cal"</li>
                  <li>• Macros: "38g protein 0g carbs 4g fat"</li>
                  <li>• Exports from MyFitnessPal, Cronometer, etc.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Settings;
