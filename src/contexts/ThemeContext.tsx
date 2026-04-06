import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: Record<string, string>;
}

const makeTheme = (id: string, name: string, emoji: string, colors: Partial<Record<string, string>>): Theme => ({
  id, name, emoji,
  colors: {
    "--background": "0 0% 7%", "--foreground": "0 0% 96%",
    "--card": "0 0% 11%", "--card-foreground": "0 0% 96%",
    "--primary": "27 96% 54%", "--primary-foreground": "0 0% 100%",
    "--secondary": "0 0% 15%", "--secondary-foreground": "0 0% 96%",
    "--muted": "0 0% 18%", "--muted-foreground": "0 0% 55%",
    "--accent": "27 96% 54%", "--accent-foreground": "0 0% 100%",
    "--destructive": "0 84% 60%", "--destructive-foreground": "0 0% 100%",
    "--border": "0 0% 20%", "--input": "0 0% 20%", "--ring": "27 96% 54%",
    "--gym-green": "142 71% 45%", "--gym-gold": "43 96% 56%",
    ...colors,
  },
});

export const themes: Theme[] = [
  makeTheme("volcanic", "Volcanic Orange", "🌋", {
    "--background": "0 0% 7%", "--card": "0 0% 11%", "--primary": "27 96% 54%",
    "--accent": "27 96% 54%", "--ring": "27 96% 54%",
  }),
  makeTheme("midnight-blue", "Midnight Blue", "🌊", {
    "--background": "222 47% 6%", "--foreground": "210 40% 96%",
    "--card": "222 47% 10%", "--card-foreground": "210 40% 96%",
    "--primary": "217 91% 60%", "--primary-foreground": "0 0% 100%",
    "--secondary": "222 47% 14%", "--secondary-foreground": "210 40% 96%",
    "--muted": "222 47% 18%", "--muted-foreground": "215 20% 55%",
    "--accent": "217 91% 60%", "--accent-foreground": "0 0% 100%",
    "--border": "222 47% 20%", "--input": "222 47% 20%", "--ring": "217 91% 60%",
  }),
  makeTheme("emerald-night", "Emerald Night", "🌿", {
    "--background": "150 20% 6%", "--foreground": "150 10% 96%",
    "--card": "150 20% 10%", "--card-foreground": "150 10% 96%",
    "--primary": "152 69% 50%", "--primary-foreground": "0 0% 100%",
    "--secondary": "150 20% 14%", "--secondary-foreground": "150 10% 96%",
    "--muted": "150 15% 18%", "--muted-foreground": "150 10% 55%",
    "--accent": "152 69% 50%", "--accent-foreground": "0 0% 100%",
    "--border": "150 15% 20%", "--input": "150 15% 20%", "--ring": "152 69% 50%",
    "--gym-green": "152 69% 50%",
  }),
  makeTheme("crimson-fury", "Crimson Fury", "🔥", {
    "--background": "0 20% 6%", "--foreground": "0 10% 96%",
    "--card": "0 20% 10%", "--card-foreground": "0 10% 96%",
    "--primary": "0 72% 51%", "--primary-foreground": "0 0% 100%",
    "--secondary": "0 15% 14%", "--secondary-foreground": "0 10% 96%",
    "--muted": "0 10% 18%", "--muted-foreground": "0 10% 55%",
    "--accent": "0 72% 51%", "--accent-foreground": "0 0% 100%",
    "--border": "0 15% 20%", "--input": "0 15% 20%", "--ring": "0 72% 51%",
  }),
  makeTheme("purple-haze", "Purple Haze", "💜", {
    "--background": "270 30% 6%", "--foreground": "270 10% 96%",
    "--card": "270 25% 10%", "--card-foreground": "270 10% 96%",
    "--primary": "271 76% 53%", "--primary-foreground": "0 0% 100%",
    "--secondary": "270 20% 14%", "--secondary-foreground": "270 10% 96%",
    "--muted": "270 15% 18%", "--muted-foreground": "270 10% 55%",
    "--accent": "271 76% 53%", "--accent-foreground": "0 0% 100%",
    "--border": "270 15% 20%", "--input": "270 15% 20%", "--ring": "271 76% 53%",
  }),
  makeTheme("golden-hour", "Golden Hour", "🌅", {
    "--background": "35 30% 6%", "--foreground": "35 10% 96%",
    "--card": "35 25% 10%", "--card-foreground": "35 10% 96%",
    "--primary": "43 96% 56%", "--primary-foreground": "0 0% 10%",
    "--secondary": "35 20% 14%", "--secondary-foreground": "35 10% 96%",
    "--muted": "35 15% 18%", "--muted-foreground": "35 10% 55%",
    "--accent": "43 96% 56%", "--accent-foreground": "0 0% 10%",
    "--border": "35 15% 20%", "--input": "35 15% 20%", "--ring": "43 96% 56%",
    "--gym-gold": "43 96% 56%",
  }),
  makeTheme("arctic-frost", "Arctic Frost", "❄️", {
    "--background": "200 30% 6%", "--foreground": "200 10% 96%",
    "--card": "200 25% 10%", "--card-foreground": "200 10% 96%",
    "--primary": "195 85% 55%", "--primary-foreground": "0 0% 100%",
    "--secondary": "200 20% 14%", "--secondary-foreground": "200 10% 96%",
    "--muted": "200 15% 18%", "--muted-foreground": "200 10% 55%",
    "--accent": "195 85% 55%", "--accent-foreground": "0 0% 100%",
    "--border": "200 15% 20%", "--input": "200 15% 20%", "--ring": "195 85% 55%",
  }),
  makeTheme("neon-pink", "Neon Pink", "💖", {
    "--background": "330 25% 6%", "--foreground": "330 10% 96%",
    "--card": "330 20% 10%", "--card-foreground": "330 10% 96%",
    "--primary": "330 81% 60%", "--primary-foreground": "0 0% 100%",
    "--secondary": "330 15% 14%", "--secondary-foreground": "330 10% 96%",
    "--muted": "330 10% 18%", "--muted-foreground": "330 10% 55%",
    "--accent": "330 81% 60%", "--accent-foreground": "0 0% 100%",
    "--border": "330 15% 20%", "--input": "330 15% 20%", "--ring": "330 81% 60%",
  }),
  // NEW THEMES
  makeTheme("monochrome", "Black & White", "⚫", {
    "--background": "0 0% 4%", "--foreground": "0 0% 95%",
    "--card": "0 0% 8%", "--card-foreground": "0 0% 95%",
    "--primary": "0 0% 90%", "--primary-foreground": "0 0% 5%",
    "--secondary": "0 0% 12%", "--secondary-foreground": "0 0% 90%",
    "--muted": "0 0% 15%", "--muted-foreground": "0 0% 50%",
    "--accent": "0 0% 90%", "--accent-foreground": "0 0% 5%",
    "--border": "0 0% 18%", "--input": "0 0% 18%", "--ring": "0 0% 90%",
    "--gym-green": "0 0% 70%", "--gym-gold": "0 0% 80%",
  }),
  makeTheme("white-clean", "Clean White", "⬜", {
    "--background": "0 0% 96%", "--foreground": "0 0% 10%",
    "--card": "0 0% 100%", "--card-foreground": "0 0% 10%",
    "--primary": "0 0% 15%", "--primary-foreground": "0 0% 98%",
    "--secondary": "0 0% 92%", "--secondary-foreground": "0 0% 15%",
    "--muted": "0 0% 88%", "--muted-foreground": "0 0% 45%",
    "--accent": "0 0% 15%", "--accent-foreground": "0 0% 98%",
    "--border": "0 0% 85%", "--input": "0 0% 85%", "--ring": "0 0% 15%",
    "--gym-green": "0 0% 30%", "--gym-gold": "0 0% 40%",
  }),
  makeTheme("sunset-rose", "Sunset Rose", "🌹", {
    "--background": "350 25% 6%", "--foreground": "350 10% 96%",
    "--card": "350 20% 10%", "--card-foreground": "350 10% 96%",
    "--primary": "350 80% 55%", "--primary-foreground": "0 0% 100%",
    "--secondary": "350 15% 14%", "--secondary-foreground": "350 10% 96%",
    "--muted": "350 10% 18%", "--muted-foreground": "350 10% 55%",
    "--accent": "350 80% 55%", "--accent-foreground": "0 0% 100%",
    "--border": "350 15% 20%", "--input": "350 15% 20%", "--ring": "350 80% 55%",
  }),
  makeTheme("matrix-green", "Matrix", "🟢", {
    "--background": "120 30% 3%", "--foreground": "120 80% 65%",
    "--card": "120 25% 6%", "--card-foreground": "120 80% 65%",
    "--primary": "120 100% 40%", "--primary-foreground": "0 0% 0%",
    "--secondary": "120 20% 10%", "--secondary-foreground": "120 80% 65%",
    "--muted": "120 15% 12%", "--muted-foreground": "120 30% 40%",
    "--accent": "120 100% 40%", "--accent-foreground": "0 0% 0%",
    "--border": "120 20% 15%", "--input": "120 20% 15%", "--ring": "120 100% 40%",
    "--gym-green": "120 100% 40%", "--gym-gold": "120 80% 50%",
  }),
  makeTheme("cyber-yellow", "Cyber Yellow", "⚡", {
    "--background": "50 20% 5%", "--foreground": "50 10% 95%",
    "--card": "50 15% 9%", "--card-foreground": "50 10% 95%",
    "--primary": "50 100% 50%", "--primary-foreground": "0 0% 5%",
    "--secondary": "50 10% 13%", "--secondary-foreground": "50 10% 95%",
    "--muted": "50 8% 17%", "--muted-foreground": "50 10% 50%",
    "--accent": "50 100% 50%", "--accent-foreground": "0 0% 5%",
    "--border": "50 10% 18%", "--input": "50 10% 18%", "--ring": "50 100% 50%",
    "--gym-green": "142 71% 45%", "--gym-gold": "50 100% 50%",
  }),
  makeTheme("ocean-teal", "Ocean Teal", "🐚", {
    "--background": "180 25% 5%", "--foreground": "180 10% 95%",
    "--card": "180 20% 9%", "--card-foreground": "180 10% 95%",
    "--primary": "175 80% 45%", "--primary-foreground": "0 0% 100%",
    "--secondary": "180 15% 13%", "--secondary-foreground": "180 10% 95%",
    "--muted": "180 10% 17%", "--muted-foreground": "180 10% 50%",
    "--accent": "175 80% 45%", "--accent-foreground": "0 0% 100%",
    "--border": "180 12% 18%", "--input": "180 12% 18%", "--ring": "175 80% 45%",
  }),
  makeTheme("blood-moon", "Blood Moon", "🌑", {
    "--background": "0 30% 4%", "--foreground": "0 5% 90%",
    "--card": "0 25% 8%", "--card-foreground": "0 5% 90%",
    "--primary": "0 90% 40%", "--primary-foreground": "0 0% 100%",
    "--secondary": "0 20% 12%", "--secondary-foreground": "0 5% 90%",
    "--muted": "0 15% 15%", "--muted-foreground": "0 10% 45%",
    "--accent": "0 90% 40%", "--accent-foreground": "0 0% 100%",
    "--border": "0 15% 16%", "--input": "0 15% 16%", "--ring": "0 90% 40%",
  }),
  makeTheme("ios-light", "iPhone Light", "📱", {
    "--background": "0 0% 95%", "--foreground": "0 0% 10%",
    "--card": "0 0% 100%", "--card-foreground": "0 0% 10%",
    "--primary": "211 100% 50%", "--primary-foreground": "0 0% 100%",
    "--secondary": "0 0% 93%", "--secondary-foreground": "0 0% 20%",
    "--muted": "0 0% 90%", "--muted-foreground": "0 0% 45%",
    "--accent": "211 100% 50%", "--accent-foreground": "0 0% 100%",
    "--border": "0 0% 85%", "--input": "0 0% 88%", "--ring": "211 100% 50%",
    "--destructive": "0 100% 59%", "--destructive-foreground": "0 0% 100%",
    "--gym-green": "142 71% 45%", "--gym-gold": "43 96% 56%",
  }),
  makeTheme("ios-dark", "iPhone Dark", "🖤", {
    "--background": "0 0% 0%", "--foreground": "0 0% 98%",
    "--card": "0 0% 11%", "--card-foreground": "0 0% 98%",
    "--primary": "211 100% 50%", "--primary-foreground": "0 0% 100%",
    "--secondary": "0 0% 17%", "--secondary-foreground": "0 0% 95%",
    "--muted": "0 0% 22%", "--muted-foreground": "0 0% 55%",
    "--accent": "211 100% 50%", "--accent-foreground": "0 0% 100%",
    "--border": "0 0% 22%", "--input": "0 0% 17%", "--ring": "211 100% 50%",
    "--destructive": "0 100% 59%", "--destructive-foreground": "0 0% 100%",
    "--gym-green": "142 71% 45%", "--gym-gold": "43 96% 56%",
  }),
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("ado-work-theme");
    return themes.find((t) => t.id === saved) || themes.find((t) => t.id === "monochrome") || themes[0];
  });

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.add("theme-transitioning");
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    setTimeout(() => root.classList.remove("theme-transitioning"), 600);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const setTheme = (id: string) => {
    const theme = themes.find((t) => t.id === id);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem("ado-work-theme", id);
      applyTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
