export type ColorTheme = 'blue' | 'teal' | 'navy';

export interface ThemeColors {
  name: string;
  id: ColorTheme;
  primaryBtn: string;
  primaryBadge: string;
  activeItem: string;
  activeCard: string;
  textAccent: string;
  borderAccent: string;
  focusBorder: string;
  stampHover: string;
  ring: string;
  dotColor: string;
}

export const THEMES: Record<ColorTheme, ThemeColors> = {
  blue: {
    name: 'Clinical Blue',
    id: 'blue',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs',
    primaryBadge: 'bg-blue-50 text-blue-700 border-blue-200/70 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    activeItem: 'bg-blue-600 text-white font-semibold shadow-2xs dark:bg-blue-600 dark:text-white',
    activeCard: 'bg-blue-50/70 border-blue-500/50 ring-1 ring-blue-500/20 dark:bg-blue-950/40 dark:border-blue-500/50 dark:ring-blue-500/30',
    textAccent: 'text-blue-600 dark:text-blue-400',
    borderAccent: 'border-blue-500 dark:border-blue-400',
    focusBorder: 'focus:border-blue-500 dark:focus:border-blue-400',
    stampHover: 'hover:bg-blue-50 hover:text-blue-800 dark:hover:bg-blue-950/60 dark:hover:text-blue-200',
    ring: 'ring-blue-500/30',
    dotColor: '#2563eb',
  },
  teal: {
    name: 'Hospital Teal',
    id: 'teal',
    primaryBtn: 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-xs',
    primaryBadge: 'bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800/60',
    activeItem: 'bg-teal-700 text-white font-semibold shadow-2xs dark:bg-teal-700 dark:text-white',
    activeCard: 'bg-teal-50/70 border-teal-500/50 ring-1 ring-teal-500/20 dark:bg-teal-950/40 dark:border-teal-500/50 dark:ring-teal-500/30',
    textAccent: 'text-teal-600 dark:text-teal-400',
    borderAccent: 'border-teal-500 dark:border-teal-400',
    focusBorder: 'focus:border-teal-500 dark:focus:border-teal-400',
    stampHover: 'hover:bg-teal-50 hover:text-teal-800 dark:hover:bg-teal-950/60 dark:hover:text-teal-200',
    ring: 'ring-teal-500/30',
    dotColor: '#0d9488',
  },
  navy: {
    name: 'Midnight Navy',
    id: 'navy',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-xs',
    primaryBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200/70 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60',
    activeItem: 'bg-indigo-600 text-white font-semibold shadow-2xs dark:bg-indigo-600 dark:text-white',
    activeCard: 'bg-indigo-50/70 border-indigo-500/50 ring-1 ring-indigo-500/20 dark:bg-indigo-950/40 dark:border-indigo-500/50 dark:ring-indigo-500/30',
    textAccent: 'text-indigo-600 dark:text-indigo-400',
    borderAccent: 'border-indigo-500 dark:border-indigo-400',
    focusBorder: 'focus:border-indigo-500 dark:focus:border-indigo-400',
    stampHover: 'hover:bg-indigo-50 hover:text-indigo-800 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-200',
    ring: 'ring-indigo-500/30',
    dotColor: '#4f46e5',
  },
};
