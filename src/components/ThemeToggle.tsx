import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-16 h-8 rounded-full p-1 transition-all duration-500 ease-out",
        "bg-gradient-to-r shadow-soft hover:shadow-hover",
        theme === 'light' 
          ? "from-amber-light to-peach-light" 
          : "from-lavender to-sky"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          "absolute top-1 w-6 h-6 rounded-full bg-card shadow-md",
          "flex items-center justify-center",
          "transition-all duration-500 ease-out",
          theme === 'light' ? "left-1" : "left-9"
        )}
      >
        {theme === 'light' ? (
          <Sun className="w-4 h-4 text-amber-600 animate-scale-in" />
        ) : (
          <Moon className="w-4 h-4 text-lavender animate-scale-in" />
        )}
      </div>
    </button>
  );
}
