import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import DietTracker from "./pages/DietTracker";
import DietInsight from "./pages/DietInsight";
import WorkoutTracker from "./pages/WorkoutTracker";
import Profile from "./pages/Profile";
import Plans from "./pages/Plans";
import Workouts from "./pages/Workouts";
import Community from "./pages/Community";
import DietPlan from "./pages/DietPlan";
import BodyPartWorkout from "./pages/BodyPartWorkout";
import BodySelector from "./pages/BodySelector";
import Settings from "./pages/Settings";
import GrowthStatus from "./pages/GrowthStatus";
import SleepSchedule from "./pages/SleepSchedule";
import Install from "./pages/Install";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const isOnboarded = localStorage.getItem("ado-onboarded") === "true";
  if (!isOnboarded) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={<RequireOnboarding><Index /></RequireOnboarding>} />
            <Route path="/diet" element={<RequireOnboarding><DietTracker /></RequireOnboarding>} />
            <Route path="/diet-insight" element={<RequireOnboarding><DietInsight /></RequireOnboarding>} />
            <Route path="/workout" element={<RequireOnboarding><WorkoutTracker /></RequireOnboarding>} />
            <Route path="/profile" element={<RequireOnboarding><Profile /></RequireOnboarding>} />
            <Route path="/plans" element={<RequireOnboarding><Plans /></RequireOnboarding>} />
            <Route path="/workouts" element={<RequireOnboarding><Workouts /></RequireOnboarding>} />
            <Route path="/community" element={<RequireOnboarding><Community /></RequireOnboarding>} />
            <Route path="/body/:part" element={<RequireOnboarding><BodyPartWorkout /></RequireOnboarding>} />
            <Route path="/diet-plan" element={<RequireOnboarding><DietPlan /></RequireOnboarding>} />
            <Route path="/body-selector" element={<RequireOnboarding><BodySelector /></RequireOnboarding>} />
            <Route path="/settings" element={<RequireOnboarding><Settings /></RequireOnboarding>} />
            <Route path="/growth" element={<RequireOnboarding><GrowthStatus /></RequireOnboarding>} />
            <Route path="/sleep" element={<RequireOnboarding><SleepSchedule /></RequireOnboarding>} />
            <Route path="/install" element={<RequireOnboarding><Install /></RequireOnboarding>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
