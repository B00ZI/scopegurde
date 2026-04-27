import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'full';
  label?: string;
}

export function ThemeToggle({ className = '', variant = 'icon', label }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={toggleTheme}
        className={`w-full flex items-center rounded-lg font-sans text-sm font-medium transition-all duration-200 ease-in-out group hover:bg-surface-container/50 text-secondary hover:text-on-surface ${className}`}
      >
        {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
        {label && <span className="whitespace-nowrap">{label}</span>}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-colors shadow-sm bg-surface-container-lowest border border-surface-container-highest ${className}`}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
