import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun } from "lucide-react";
import React, { useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const { toast } = useToast();

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // Check for stored theme or system preference
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply dark mode class to html element
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    // Ensure body and html background colors are updated immediately
    if (newTheme === 'dark') {
      document.documentElement.style.backgroundColor = '#0a0a0a'; // neutral-950
      document.body.style.backgroundColor = '#0a0a0a'; // neutral-950
    } else {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    }
    
    localStorage.setItem('theme', newTheme);
    
    // Show toast notification
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`,
      description: `The site is now in ${newTheme} mode.`,
      duration: 2000
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      aria-label="Toggle theme" 
      onClick={toggleTheme}
      className="h-9 w-9 rounded-md text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;