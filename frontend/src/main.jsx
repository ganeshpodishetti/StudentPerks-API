import { Toaster } from "@/components/ui/toaster"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AppProviders } from './providers/AppProviders'

// Apply dark mode from localStorage to ensure consistent styling
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
  document.documentElement.style.backgroundColor = '#0a0a0a'; // neutral-950
  document.body.style.backgroundColor = '#0a0a0a'; // neutral-950
  
  // Also set backgrounds of any other relevant containers
  setTimeout(() => {
    const allContainers = document.querySelectorAll('.container, main, #root');
    allContainers.forEach(container => {
      container.style.backgroundColor = '#0a0a0a';
    });
  }, 0);
  
  if (!storedTheme) localStorage.setItem('theme', 'dark');
} else {
  document.documentElement.classList.remove('dark');
  document.documentElement.style.backgroundColor = '';
  document.body.style.backgroundColor = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
      <Toaster />
    </AppProviders>
  </StrictMode>
)
