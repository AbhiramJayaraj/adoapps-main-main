import { ChevronLeft, Lightbulb, Share2, Copy, Check, RefreshCw, Users, TrendingUp, Heart, Bookmark, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";
import { useToast } from "@/hooks/use-toast";

interface Tip {
  id: number;
  title: string;
  content: string;
  category: string;
  liked: boolean;
  saved: boolean;
}

const allTips: Tip[] = [
  { id: 1, title: "Progressive Overload", content: "Gradually increase weight, reps, or sets each week. This is the #1 principle for muscle growth.", category: "💪 Muscle", liked: false, saved: false },
  { id: 2, title: "Protein Timing", content: "Consume 20-40g of protein within 2 hours post-workout for optimal recovery.", category: "🍗 Nutrition", liked: false, saved: false },
  { id: 3, title: "Sleep for Gains", content: "Aim for 7-9 hours of quality sleep. Growth hormone peaks during deep sleep.", category: "😴 Recovery", liked: false, saved: false },
  { id: 4, title: "Compound Movements First", content: "Start workouts with compound lifts. They recruit multiple muscle groups.", category: "💪 Muscle", liked: false, saved: false },
  { id: 5, title: "Hydration Matters", content: "Drink at least 3-4 liters of water daily. Even 2% dehydration reduces strength by 10%.", category: "🍗 Nutrition", liked: false, saved: false },
  { id: 6, title: "Mind-Muscle Connection", content: "Focus on feeling the target muscle contract during each rep.", category: "💪 Muscle", liked: false, saved: false },
  { id: 7, title: "Creatine Supplementation", content: "Take 3-5g of creatine monohydrate daily. Most researched supplement.", category: "🍗 Nutrition", liked: false, saved: false },
  { id: 8, title: "Deload Weeks", content: "Every 4-6 weeks, reduce training volume by 40-60%.", category: "😴 Recovery", liked: false, saved: false },
  { id: 9, title: "Track Your Lifts", content: "Keep a workout log. Data-driven training leads to 30% faster progress.", category: "📊 Strategy", liked: false, saved: false },
  { id: 10, title: "Eat in Surplus", content: "To build muscle, eat 300-500 calories above maintenance.", category: "🍗 Nutrition", liked: false, saved: false },
  { id: 11, title: "Warm Up Properly", content: "5-10 min warmup reduces injury risk by 50%.", category: "📊 Strategy", liked: false, saved: false },
  { id: 12, title: "Rest Between Sets", content: "Strength: 2-5 min. Hypertrophy: 60-90 sec. Endurance: 30-60 sec.", category: "📊 Strategy", liked: false, saved: false },
];

const mindBoostQuotes = [
  { quote: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { quote: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown" },
  { quote: "Strength does not come from the body. It comes from the will.", author: "Gandhi" },
  { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
  { quote: "Don't limit your challenges. Challenge your limits.", author: "Jerry Dunn" },
  { quote: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
  { quote: "The hard days are what make you stronger.", author: "Aly Raisman" },
  { quote: "Fall down seven times, stand up eight.", author: "Japanese Proverb" },
  { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { quote: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { quote: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { quote: "Great things never came from comfort zones.", author: "Ben Francia" },
  { quote: "If it doesn't challenge you, it won't change you.", author: "Fred DeVito" },
  { quote: "The difference between try and triumph is a little umph.", author: "Marvin Phillips" },
  { quote: "Champions keep playing until they get it right.", author: "Billie Jean King" },
  { quote: "You don't have to be extreme, just consistent.", author: "Unknown" },
  { quote: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { quote: "The only person you are destined to become is the person you decide to be.", author: "Emerson" },
  { quote: "Iron sharpens iron. Surround yourself with warriors.", author: "Unknown" },
  { quote: "Be stronger than your excuses.", author: "Unknown" },
  { quote: "The resistance that you fight physically in the gym and the resistance that you fight in life can only build a strong character.", author: "Arnold Schwarzenegger" },
  { quote: "Today I will do what others won't, so tomorrow I can do what others can't.", author: "Jerry Rice" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "No pain, no gain. Shut up and train.", author: "Unknown" },
  { quote: "When you feel like quitting, remember why you started.", author: "Unknown" },
  { quote: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill" },
  { quote: "Your only limit is you.", author: "Unknown" },
  { quote: "Beast mode: activated.", author: "Unknown" },
  { quote: "Sweat is fat crying.", author: "Unknown" },
  { quote: "Hustle for that muscle.", author: "Unknown" },
];

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tips, setTips] = useState<Tip[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedInvite] = useState("ADOWORK-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return mindBoostQuotes[dayOfYear % mindBoostQuotes.length];
  };

  const [dailyQuote, setDailyQuote] = useState(getDailyQuote());

  const getDailyTips = useCallback(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const shuffled = [...allTips].sort((a, b) => ((a.id * seed) % 100) - ((b.id * seed) % 100));
    return shuffled.slice(0, 6);
  }, []);

  useEffect(() => { setTips(getDailyTips()); }, [getDailyTips]);

  const refreshTips = () => {
    setTips([...allTips].sort(() => Math.random() - 0.5).slice(0, 6));
    setDailyQuote(mindBoostQuotes[Math.floor(Math.random() * mindBoostQuotes.length)]);
    toast({ title: "Content refreshed!" });
  };

  const toggleLike = (id: number) => setTips(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked } : t));
  const toggleSave = (id: number) => setTips(prev => prev.map(t => t.id === id ? { ...t, saved: !t.saved } : t));

  const copyInvite = () => {
    navigator.clipboard.writeText(`Join me on Ado Work! Code: ${savedInvite}\nhttps://adowork.app/invite/${savedInvite}`);
    setCopied(true);
    toast({ title: "Invite link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareInvite = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Join Ado Work!", text: `Join me on Ado Work! Code: ${savedInvite}`, url: `https://adowork.app/invite/${savedInvite}` });
    } else copyInvite();
  };

  const categories = ["All", "💪 Muscle", "🍗 Nutrition", "😴 Recovery", "📊 Strategy"];
  const filteredTips = selectedCategory === "All" ? tips : tips.filter(t => t.category === selectedCategory);

  return (
    <MobileLayout>
      <div className="animate-fade-in px-4 pt-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-bold">Community</h1>
          <button onClick={refreshTips} className="p-1"><RefreshCw className="h-4 w-4 text-muted-foreground" /></button>
        </div>

        {/* Mind Boost Quote */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-gym-gold" />
            <h3 className="text-xs font-bold text-gym-gold">Mind Boost — Daily Quote</h3>
          </div>
          <p className="text-sm font-bold italic leading-relaxed">"{dailyQuote.quote}"</p>
          <p className="mt-2 text-[10px] text-muted-foreground">— {dailyQuote.author}</p>
        </div>

        {/* Invite Card */}
        <div className="mt-4 gym-gradient-orange rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-foreground" />
            <h3 className="text-sm font-bold text-primary-foreground">Challenge Your Friends</h3>
          </div>
          <p className="mt-1 text-[10px] text-primary-foreground/80">Share your invite link and compare workout progress!</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-background/20 px-3 py-2">
            <code className="flex-1 text-[10px] font-mono font-bold text-primary-foreground">{savedInvite}</code>
            <button onClick={copyInvite} className="p-1">
              {copied ? <Check className="h-4 w-4 text-primary-foreground" /> : <Copy className="h-4 w-4 text-primary-foreground" />}
            </button>
          </div>
          <button onClick={shareInvite} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-background py-2.5 text-xs font-bold text-primary active:scale-95 transition-transform">
            <Share2 className="h-3.5 w-3.5" /> Share Invite Link
          </button>
        </div>

        {/* Leaderboard */}
        <div className="mt-4 gym-gradient-card rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold">Friends Leaderboard</h3>
          </div>
          <div className="mt-3 space-y-2">
            {[{ name: "You", workouts: 6, streak: 3 }, { name: "Invite friends to compare!", workouts: 0, streak: 0 }].map((f, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-xl p-2.5 ${i === 0 ? "bg-primary/10 border border-primary/20" : "bg-secondary"}`}>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{f.name}</p>
                  {f.workouts > 0 && <p className="text-[10px] text-muted-foreground">{f.workouts} workouts · {f.streak} day streak</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tips */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-gym-gold" />
            <h2 className="text-sm font-bold">Daily Fitness Tips</h2>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold transition-all active:scale-90 ${selectedCategory === cat ? "gym-gradient-orange text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-3 pb-4">
            {filteredTips.map(tip => (
              <div key={tip.id} className="gym-gradient-card rounded-2xl p-4 transition-all">
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">{tip.category}</span>
                <h3 className="mt-0.5 text-sm font-bold">{tip.title}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{tip.content}</p>
                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                  <button onClick={() => toggleLike(tip.id)} className="flex items-center gap-1 active:scale-90 transition-transform">
                    <Heart className={`h-3.5 w-3.5 transition-colors ${tip.liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
                    <span className="text-[10px] text-muted-foreground">{tip.liked ? "Liked" : "Like"}</span>
                  </button>
                  <button onClick={() => toggleSave(tip.id)} className="flex items-center gap-1 active:scale-90 transition-transform">
                    <Bookmark className={`h-3.5 w-3.5 transition-colors ${tip.saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    <span className="text-[10px] text-muted-foreground">{tip.saved ? "Saved" : "Save"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Community;
