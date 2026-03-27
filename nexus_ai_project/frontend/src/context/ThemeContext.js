'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark'); // 'light' | 'dark' | 'system'
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('nexus_theme');
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setTheme(stored);
    }
  }, []);

  // Resolve system theme and apply
  useEffect(() => {
    const applyTheme = () => {
      let resolved = theme;
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setResolvedTheme(resolved);

      const root = document.documentElement;
      if (resolved === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setThemeValue = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('nexus_theme', newTheme);
  };

  // Cycle: dark → light → system → dark
  const cycleTheme = () => {
    const order = ['dark', 'light', 'system'];
    const current = order.indexOf(theme);
    const next = order[(current + 1) % order.length];
    setThemeValue(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeValue, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
