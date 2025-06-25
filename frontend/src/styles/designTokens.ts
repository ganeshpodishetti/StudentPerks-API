// Design tokens for consistent styling across the application

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const lineHeights = {
  tight: '1.25',
  normal: '1.5',
  relaxed: '1.75',
} as const;

export const shadows = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Component-specific design tokens
export const components = {
  card: {
    base: 'rounded-xl border shadow-sm bg-white dark:bg-neutral-800',
    padding: 'p-6',
    header: 'pb-4 border-b border-neutral-200 dark:border-neutral-700',
    content: 'pt-4',
  },
  button: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    sizes: {
      xs: 'h-7 px-2 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-9 px-4',
      lg: 'h-10 px-6',
      xl: 'h-11 px-8',
    },
    variants: {
      default: 'bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200',
      destructive: 'bg-red-500 text-neutral-50 hover:bg-red-600 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-800',
      outline: 'border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700',
      secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-50 dark:hover:bg-neutral-600',
      ghost: 'hover:bg-neutral-100 dark:hover:bg-neutral-700',
    },
  },
  input: {
    base: 'flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-400',
  },
  badge: {
    base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    variants: {
      default: 'bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900',
      secondary: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-50',
      destructive: 'bg-red-500 text-neutral-50 dark:bg-red-900 dark:text-neutral-50',
      success: 'bg-green-500 text-neutral-50 dark:bg-green-900 dark:text-neutral-50',
      warning: 'bg-yellow-500 text-neutral-900 dark:bg-yellow-900 dark:text-neutral-50',
    },
  },
  skeleton: {
    base: 'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700',
  },
} as const;

// Animation tokens
export const animations = {
  durations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easings: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type FontSizeToken = keyof typeof fontSizes;
export type ShadowToken = keyof typeof shadows;
