import React, { useState } from 'react';
import {
  FileText,
  PlusCircle,
  BookOpen,
  ShieldCheck,
  Moon,
  Sun,
  Palette,
  ChevronDown,
  HeartPulse,
  LayoutGrid,
  Star,
  BookmarkCheck,
  Stethoscope,
  Calculator,
  Clock,
} from 'lucide-react';
import { ColorTheme, THEMES } from '../utils/theme';

interface HeaderProps {
  onOpenCustomModal: () => void;
  onOpenGuideModal: () => void;
  onOpenCalculator?: () => void;
  onOpenTimers?: () => void;
  activeTimerCount?: number;
  activeView: 'templates' | 'procedures' | 'favorites' | 'custom';
  onSelectView: (view: 'templates' | 'procedures' | 'favorites' | 'custom') => void;
  customCount: number;
  isNightMode: boolean;
  onToggleNightMode: () => void;
  colorTheme: ColorTheme;
  onChangeColorTheme: (theme: ColorTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCustomModal,
  onOpenGuideModal,
  onOpenCalculator,
  onOpenTimers,
  activeTimerCount = 0,
  activeView,
  onSelectView,
  customCount,
  isNightMode,
  onToggleNightMode,
  colorTheme,
  onChangeColorTheme,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const currentTheme = THEMES[colorTheme];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-2xs">
      {/* 1. Large Displays (xl: >= 1280px): Single Sleek Row (Exact Match to Desktop Reference) */}
      <div className="hidden xl:block max-w-[1920px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 h-12">
          {/* Zone 1: Single text wordmark with medical icon */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className={`w-7 h-7 rounded-lg ${currentTheme.primaryBtn} flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-white/20`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-white" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('templates');
              }}
              className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <span>NurseChart</span>
            </a>
            <span className="inline-flex items-center text-[11px] text-slate-500 dark:text-slate-400 gap-1 ml-1.5 pl-2.5 border-l border-slate-200 dark:border-slate-800">
              <ShieldCheck className={`w-3 h-3 ${currentTheme.textAccent}`} />
              <span>100% Client-Side · EHR Ready</span>
            </span>
          </div>

          {/* Zone 2: Concise single-line nav links with attractive icons */}
          <nav className="flex items-center gap-3 lg:gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onSelectView('templates')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs sm:text-sm inline-flex items-center gap-1.5 ${
                activeView === 'templates'
                  ? `border-current ${currentTheme.textAccent} font-semibold`
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Notes</span>
            </button>
            <button
              onClick={() => onSelectView('procedures')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs sm:text-sm inline-flex items-center gap-1.5 ${
                activeView === 'procedures'
                  ? `border-current ${currentTheme.textAccent} font-semibold`
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bedside and specialized procedure nursing documentation"
            >
              <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
              <span>Procedure Notes</span>
            </button>
            <button
              onClick={() => onSelectView('favorites')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs sm:text-sm inline-flex items-center gap-1.5 ${
                activeView === 'favorites'
                  ? `border-current ${currentTheme.textAccent} font-semibold`
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
              <span>Starred Notes</span>
            </button>
            <button
              onClick={() => onSelectView('custom')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 text-xs sm:text-sm inline-flex items-center gap-1.5 ${
                activeView === 'custom'
                  ? `border-current ${currentTheme.textAccent} font-semibold`
                  : 'border-transparent hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>My Notes ({customCount})</span>
            </button>
            <button
              onClick={onOpenGuideModal}
              className="whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Clinical Guide</span>
            </button>
          </nav>

          {/* Zone 3: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors border border-blue-200/80 dark:border-blue-800/80 whitespace-nowrap"
                title="Bedside IV Drug Calculator & Clinical Math: Continuous infusions, smart pump verifications, push draw-up, MAP, and drip rates"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">IV Drug Calc</span>
              </button>
            )}

            {onOpenTimers && (
              <button
                type="button"
                onClick={onOpenTimers}
                className="relative flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
                title="Bedside Shift Timers: Pain rechecks, patient turns, neuro checks"
              >
                <Clock className={`w-3.5 h-3.5 ${activeTimerCount > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-500'}`} />
                <span className="text-[11px]">Timers</span>
                {activeTimerCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center -ml-0.5 shadow-2xs">
                    {activeTimerCount}
                  </span>
                )}
              </button>
            )}

            {/* Color Theme Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
                title="Change color theme (Blue, Teal, Navy)"
              >
                <Palette className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentTheme.dotColor }}
                />
                <span className="text-[11px] font-semibold">{currentTheme.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isThemeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                      Color Theme
                    </div>
                    {(Object.keys(THEMES) as ColorTheme[]).map((themeKey) => {
                      const t = THEMES[themeKey];
                      const isSelected = colorTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          onClick={() => {
                            onChangeColorTheme(themeKey);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-700/80 font-bold text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                              style={{ backgroundColor: t.dotColor }}
                            />
                            <span>{t.name}</span>
                          </div>
                          {isSelected && <span className="text-[10px] text-teal-600 dark:text-teal-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Night Shift Mode Toggle */}
            <button
              type="button"
              onClick={onToggleNightMode}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all border whitespace-nowrap ${
                isNightMode
                  ? 'bg-indigo-950/80 text-amber-300 border-indigo-700/60 shadow-xs hover:bg-indigo-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isNightMode ? 'Switch to Day Shift Mode' : 'Switch to Night Shift Mode (Darker theme for night rounds)'}
            >
              {isNightMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span className="text-[11px]">Night Shift</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-[11px]">Day Shift</span>
                </>
              )}
            </button>

            {/* New Template Primary Action */}
            <button
              onClick={onOpenCustomModal}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${currentTheme.primaryBtn}`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Reduced Screen Sizes (< 1280px: Laptops, Tablets, Split-Screen, Mobile):
          Guarantees that ALL referenced header elements (Brand, Navigation, Tools, Actions)
          are ALWAYS viewed and never clipped or hidden */}
      <div className="xl:hidden max-w-[1920px] mx-auto">
        {/* Top Tier: Brand & All Action Buttons */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 h-11 border-b border-slate-100 dark:border-slate-800/80">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${currentTheme.primaryBtn} flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-white/20 shrink-0`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-white" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectView('templates');
              }}
              className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              NurseChart
            </a>
            <span className="hidden sm:inline-flex items-center text-[10px] text-slate-500 dark:text-slate-400 gap-1 pl-2 border-l border-slate-200 dark:border-slate-800 shrink-0">
              <ShieldCheck className={`w-2.5 h-2.5 ${currentTheme.textAccent}`} />
              <span>EHR Ready</span>
            </span>
          </div>

          {/* Quick Actions Strip (smooth horizontal scroll if screen is very narrow so nothing ever clips) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 min-w-0">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors border border-blue-200/80 dark:border-blue-800/80 whitespace-nowrap shrink-0"
                title="Bedside IV Drug Calculator & Clinical Math"
              >
                <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">IV Drug Calc</span>
              </button>
            )}

            {onOpenTimers && (
              <button
                type="button"
                onClick={onOpenTimers}
                className="relative flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
                title="Bedside Shift Timers"
              >
                <Clock className={`w-3.5 h-3.5 ${activeTimerCount > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-500'} shrink-0`} />
                <span className="text-[11px]">Timers</span>
                {activeTimerCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center -ml-0.5 shadow-2xs">
                    {activeTimerCount}
                  </span>
                )}
              </button>
            )}

            {/* Color Theme Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
                title="Change color theme"
              >
                <Palette className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: currentTheme.dotColor }}
                />
                <span className="hidden sm:inline text-[11px] font-semibold">{currentTheme.name}</span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {isThemeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                      Color Theme
                    </div>
                    {(Object.keys(THEMES) as ColorTheme[]).map((themeKey) => {
                      const t = THEMES[themeKey];
                      const isSelected = colorTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          onClick={() => {
                            onChangeColorTheme(themeKey);
                            setIsThemeMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-700/80 font-bold text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                              style={{ backgroundColor: t.dotColor }}
                            />
                            <span>{t.name}</span>
                          </div>
                          {isSelected && <span className="text-[10px] text-teal-600 dark:text-teal-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Night Shift Mode Toggle */}
            <button
              type="button"
              onClick={onToggleNightMode}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-xs font-semibold transition-all border whitespace-nowrap shrink-0 ${
                isNightMode
                  ? 'bg-indigo-950/80 text-amber-300 border-indigo-700/60 shadow-xs hover:bg-indigo-900'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isNightMode ? 'Switch to Day Shift Mode' : 'Switch to Night Shift Mode'}
            >
              {isNightMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 fill-amber-300 text-amber-300 shrink-0" />
                  <span className="text-[11px]">Night</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-[11px]">Day</span>
                </>
              )}
            </button>

            {/* New Template Primary Action */}
            <button
              onClick={onOpenCustomModal}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${currentTheme.primaryBtn}`}
              title="Create a new custom documentation template"
            >
              <PlusCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11px] sm:text-xs">New Template</span>
            </button>
          </div>
        </div>

        {/* Bottom Tier: All 5 Navigation Links (Always viewed, smoothly scrollable on reduced screens!) */}
        <nav className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 overflow-x-auto scrollbar-none bg-slate-50/70 dark:bg-slate-850/60 border-b border-slate-200/70 dark:border-slate-800">
          <button
            onClick={() => onSelectView('templates')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors text-xs inline-flex items-center gap-1.5 font-medium ${
              activeView === 'templates'
                ? `bg-white dark:bg-slate-700 ${currentTheme.textAccent} font-bold shadow-2xs ring-1 ring-slate-200/80 dark:ring-slate-600`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Notes</span>
          </button>

          <button
            onClick={() => onSelectView('procedures')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors text-xs inline-flex items-center gap-1.5 font-medium ${
              activeView === 'procedures'
                ? `bg-white dark:bg-slate-700 ${currentTheme.textAccent} font-bold shadow-2xs ring-1 ring-slate-200/80 dark:ring-slate-600`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
            }`}
            title="Bedside and specialized procedure nursing documentation"
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
            <span>Procedure Notes</span>
          </button>

          <button
            onClick={() => onSelectView('favorites')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors text-xs inline-flex items-center gap-1.5 font-medium ${
              activeView === 'favorites'
                ? `bg-white dark:bg-slate-700 ${currentTheme.textAccent} font-bold shadow-2xs ring-1 ring-slate-200/80 dark:ring-slate-600`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span>Starred Notes</span>
          </button>

          <button
            onClick={() => onSelectView('custom')}
            className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors text-xs inline-flex items-center gap-1.5 font-medium ${
              activeView === 'custom'
                ? `bg-white dark:bg-slate-700 ${currentTheme.textAccent} font-bold shadow-2xs ring-1 ring-slate-200/80 dark:ring-slate-600`
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>My Notes ({customCount})</span>
          </button>

          <button
            onClick={onOpenGuideModal}
            className="whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800 inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>Clinical Guide</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
