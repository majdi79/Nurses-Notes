import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Bell, AlertTriangle, Check, Volume2, X } from 'lucide-react';
import { ColorTheme, THEMES } from '../utils/theme';

export interface ShiftTimer {
  id: string;
  label: string;
  targetTimestamp: number;
  totalDurationSec: number;
  notified?: boolean;
}

const STORAGE_KEY_TIMERS = 'nursechart_shift_timers';

/**
 * Play gentle, hospital-friendly soft two-tone audio chime using Web Audio API
 */
export function playBedsideChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First gentle tone (E5 ~ 659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Second gentle tone (B5 ~ 987 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.2);
    gain2.gain.setValueAtTime(0.08, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.65);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

interface ShiftTimersWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  colorTheme?: ColorTheme;
  onTimerCountChange?: (count: number) => void;
}

export const ShiftTimersWidget: React.FC<ShiftTimersWidgetProps> = ({
  isOpen,
  onClose,
  colorTheme = 'blue',
  onTimerCountChange,
}) => {
  const theme = THEMES[colorTheme];
  const [timers, setTimers] = useState<ShiftTimer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TIMERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customLabel, setCustomLabel] = useState('');
  const [customMinutes, setCustomMinutes] = useState('30');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Save timers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TIMERS, JSON.stringify(timers));
    } catch {}
    if (onTimerCountChange) {
      const activeCount = timers.filter((t) => t.targetTimestamp > Date.now()).length;
      onTimerCountChange(activeCount);
    }
  }, [timers, onTimerCountChange]);

  // Interval ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Check for newly expired timers to ring chime
      setTimers((prev) =>
        prev.map((t) => {
          if (t.targetTimestamp <= now && !t.notified) {
            playBedsideChime();
            return { ...t, notified: true };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTimer = (label: string, minutes: number) => {
    const totalDurationSec = minutes * 60;
    const targetTimestamp = Date.now() + totalDurationSec * 1000;
    const newTimer: ShiftTimer = {
      id: `timer_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label,
      targetTimestamp,
      totalDurationSec,
      notified: false,
    };
    setTimers((prev) => [newTimer, ...prev]);
    playBedsideChime();
  };

  const removeTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const addSnooze = (id: string, extraMinutes: number) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newTarget = Date.now() + extraMinutes * 60 * 1000;
          return {
            ...t,
            targetTimestamp: newTarget,
            totalDurationSec: extraMinutes * 60,
            notified: false,
          };
        }
        return t;
      })
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${theme.primaryBtn} flex items-center justify-center`}>
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Bedside Shift Timers & Reminders
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Joint Commission pain rechecks, turn schedules, and lab surveillance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets Ribbon */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1-Click Standard Bedside Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => addTimer('Pain Recheck (IV)', 30)}
                className="p-2 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">IV Pain Recheck</span>
                <span className="text-[10px] opacity-80">30 min standard</span>
              </button>

              <button
                type="button"
                onClick={() => addTimer('Pain Recheck (Oral)', 60)}
                className="p-2 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">Oral Pain Recheck</span>
                <span className="text-[10px] opacity-80">60 min standard</span>
              </button>

              <button
                type="button"
                onClick={() => addTimer('Patient Turn & Skin', 120)}
                className="p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">Turn & Reposition</span>
                <span className="text-[10px] opacity-80">q2h pressure relief</span>
              </button>

              <button
                type="button"
                onClick={() => addTimer('Neuro / Vitals Check', 60)}
                className="p-2 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 hover:bg-blue-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">Neuro / Vitals</span>
                <span className="text-[10px] opacity-80">q1h monitoring</span>
              </button>

              <button
                type="button"
                onClick={() => addTimer('Repeat Lactate / Sepsis', 120)}
                className="p-2 rounded-lg border border-rose-200 dark:border-rose-800/60 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 hover:bg-rose-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">Repeat Sepsis Lactate</span>
                <span className="text-[10px] opacity-80">2-hour redraw</span>
              </button>

              <button
                type="button"
                onClick={() => addTimer('Foley Voiding Trial', 360)}
                className="p-2 rounded-lg border border-purple-200 dark:border-purple-800/60 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 hover:bg-purple-100 transition-colors flex flex-col items-start"
              >
                <span className="font-bold">Voiding Trial Check</span>
                <span className="text-[10px] opacity-80">6-hour cutoff</span>
              </button>
            </div>
          </div>

          {/* Custom Timer Input */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Create Custom Reminder:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Bed 12 - IVPB Vancomycin Infusion End"
                className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="number"
                min="1"
                max="720"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-16 px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-center focus:outline-none"
                placeholder="min"
              />
              <button
                type="button"
                onClick={() => {
                  if (customLabel.trim()) {
                    addTimer(customLabel.trim(), parseInt(customMinutes) || 15);
                    setCustomLabel('');
                  }
                }}
                disabled={!customLabel.trim()}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  customLabel.trim() ? theme.primaryBtn : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start</span>
              </button>
            </div>
          </div>

          {/* Active Timers List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Active Timers ({timers.length})
              </span>
              {timers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTimers([])}
                  className="text-[11px] text-rose-500 hover:text-rose-700 dark:hover:text-rose-400"
                >
                  Clear All
                </button>
              )}
            </div>

            {timers.length === 0 ? (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                No active bedside timers. Click any standard preset above to start.
              </div>
            ) : (
              <div className="space-y-2">
                {timers.map((t) => {
                  const remainingSec = Math.max(0, Math.floor((t.targetTimestamp - currentTime) / 1000));
                  const isExpired = remainingSec === 0;
                  const mins = Math.floor(remainingSec / 60);
                  const secs = remainingSec % 60;
                  const timeFormatted = `${mins}:${String(secs).padStart(2, '0')}`;
                  const progressPct = Math.max(0, Math.min(100, 100 - (remainingSec / (t.totalDurationSec || 1)) * 100));

                  return (
                    <div
                      key={t.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isExpired
                          ? 'border-rose-400 dark:border-rose-600 bg-rose-50 dark:bg-rose-950/60 animate-pulse text-rose-950 dark:text-rose-100'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {isExpired ? (
                            <Bell className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                          )}
                          <span className="font-semibold text-xs truncate">{t.label}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`font-mono text-sm font-bold ${
                              isExpired ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {isExpired ? 'DUE NOW!' : timeFormatted}
                          </span>

                          {isExpired ? (
                            <button
                              type="button"
                              onClick={() => addSnooze(t.id, 10)}
                              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 hover:bg-rose-300 transition-colors"
                              title="Snooze for 10 minutes"
                            >
                              +10m
                            </button>
                          ) : null}

                          <button
                            type="button"
                            onClick={() => removeTimer(t.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                            title="Remove timer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {!isExpired && (
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full transition-all duration-1000 ${theme.primaryBtn}`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Gentle bedside alert chime enabled</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
