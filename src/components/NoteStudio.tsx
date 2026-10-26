import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Copy,
  Check,
  RotateCcw,
  Clock,
  Activity,
  Sliders,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  Sparkles,
  PhoneCall,
  CheckCircle,
  FileCheck2,
  Trash2,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  ListChecks,
  Target,
  FileSpreadsheet,
  AlignLeft,
  Scale,
  AlertTriangle,
  HeartPulse,
  RotateCw,
  ShieldCheck,
  Wind,
  Cpu,
  UserCheck,
  ClipboardCheck,
  Bandage,
  Syringe,
  Tag,
  Edit3,
  Flame,
  Calculator,
  AlertCircle,
  CornerDownRight,
} from 'lucide-react';
import { NoteTemplate, isTemplateProcedure, getTemplateProcedureCategory } from '../data/templates';
import {
  NoteFormatType,
  getCurrentMilitaryTime,
  getStandardVitalsSnippet,
  getDualRNStamp,
  getMDReadbackStamp,
  getPainReassessmentStamp,
  getPositioningTurnStamp,
  getSkinCareStamp,
  getSuctionStamp,
  getShiftChangeReceivingStamp,
  getReceivingHandoffStamp,
  getVentCheckStamp,
  getMUSTStamp,
  getEWSStamp,
  getMegaCodeStamp,
  getPreOpStamp,
  getPostOpPACUStamp,
  getWoundAssessmentStamp,
  getWoundVACPackingStamp,
  getUniversalTimeOutStamp,
  getNGTubePlacementStamp,
  getBloodCultureStamp,
  getBedsideInvasiveAssistStamp,
  getChestPainPQRSTStamp,
  getAcuteDyspneaStamp,
  getPostAngioCathStamp,
  getCardioversionStamp,
  getTEEAssistStamp,
  getFeverSepsisStamp,
} from '../utils/formatter';
import { ColorTheme, THEMES } from '../utils/theme';

interface NoteStudioProps {
  template: NoteTemplate;
  noteText: string;
  onTextChange: (newText: string) => void;
  fieldValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  onResetDefaults: () => void;
  onDeleteCustomTemplate?: (templateId: string) => void;
  onAppendSnippet: (snippet: string) => void;
  activeFormat: NoteFormatType;
  onChangeFormat: (format: NoteFormatType) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  colorTheme?: ColorTheme;
  onEditTemplate?: (template: NoteTemplate) => void;
  onRestoreTemplate?: (templateId: string) => void;
  onOpenCalculator?: () => void;
  onOpenTimers?: () => void;
  activeTimerCount?: number;
}

export const NoteStudio: React.FC<NoteStudioProps> = ({
  template,
  noteText,
  onTextChange,
  fieldValues,
  onFieldChange,
  onResetDefaults,
  onDeleteCustomTemplate,
  onAppendSnippet,
  activeFormat,
  onChangeFormat,
  isSidebarCollapsed = false,
  onToggleSidebar,
  isZenMode = false,
  onToggleZenMode,
  colorTheme = 'blue',
  onEditTemplate,
  onRestoreTemplate,
  onOpenCalculator,
  onOpenTimers,
  activeTimerCount = 0,
}) => {
  const [copied, setCopied] = useState(false);
  const [stampFeedback, setStampFeedback] = useState<string | null>(null);
  const [placeholderWarning, setPlaceholderWarning] = useState<string | null>(null);
  const [isAdvancedFieldsOpen, setIsAdvancedFieldsOpen] = useState(false);
  const [isQuickOptionsOpen, setIsQuickOptionsOpen] = useState(false);
  const [noteFontSize, setNoteFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const theme = THEMES[colorTheme];

  // Quality scan for bracketed placeholders e.g. [Score 0-10], [Physician Name], [ ]
  const placeholders = useMemo(() => {
    const matches: { text: string; index: number; length: number }[] = [];
    const regex = /\[([^\]]+)\]/g;
    let match;
    while ((match = regex.exec(noteText)) !== null) {
      matches.push({
        text: match[0],
        index: match.index,
        length: match[0].length,
      });
    }
    return matches;
  }, [noteText]);

  // Jump to next placeholder and highlight it in textarea
  const handleJumpToNextPlaceholder = () => {
    if (!textareaRef.current || placeholders.length === 0) return;
    const currentCursor = textareaRef.current.selectionEnd;
    const nextMatch = placeholders.find((p) => p.index > currentCursor) || placeholders[0];
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(nextMatch.index, nextMatch.index + nextMatch.length);
    setStampFeedback(`Selected ${nextMatch.text}`);
    setTimeout(() => setStampFeedback(null), 1500);
  };

  // Strip brackets from placeholders
  const handleStripBrackets = () => {
    const cleaned = noteText.replace(/\[([^\]]+)\]/g, '$1');
    onTextChange(cleaned);
    setStampFeedback('Removed bracket symbols');
    setTimeout(() => setStampFeedback(null), 1800);
  };

  // Quick action: copy to clipboard with friendly placeholder check
  const handleCopy = async () => {
    if (placeholders.length > 0) {
      setPlaceholderWarning(
        `Note copied! ⚠️ ${placeholders.length} placeholder${
          placeholders.length > 1 ? 's' : ''
        } remain: ${placeholders.slice(0, 2).map((p) => p.text).join(', ')}${
          placeholders.length > 2 ? '...' : ''
        }`
      );
      setTimeout(() => setPlaceholderWarning(null), 4500);
    }

    try {
      await navigator.clipboard.writeText(noteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = noteText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleApplyStamp = (label: string, snippet: string) => {
    onAppendSnippet(snippet);
    setStampFeedback(label);
    setTimeout(() => setStampFeedback(null), 1800);
  };

  const handleInsertTime = () => {
    const curTime = getCurrentMilitaryTime();
    if (template.fields.some((f) => f.id === 'time')) {
      onFieldChange('time', curTime);
    } else {
      onAppendSnippet(`[Time: ${curTime}]`);
    }
    setStampFeedback('Current time added');
    setTimeout(() => setStampFeedback(null), 1800);
  };

  const handlePrint = () => {
    document.body.classList.add('printing-note');
    const cleanup = () => {
      document.body.classList.remove('printing-note');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    try {
      window.print();
    } catch {
      // fallback
    }
    setTimeout(() => {
      document.body.classList.remove('printing-note');
    }, 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([noteText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `nursing_note_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const wordCount = noteText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = noteText.length;

  // Filter fields with options for quick tweak
  const quickFields = template.fields.filter((f) => f.options && f.options.length > 0);

  // Font size class
  const fontClass =
    noteFontSize === 'sm'
      ? 'text-xs'
      : noteFontSize === 'lg'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Top Studio Bar (Sleek, Compact, High-Efficiency) */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xs shrink-0 transition-colors">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Template Info & Sidebar Toggle */}
          <div className="flex items-center gap-2 min-w-0">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors shrink-0"
                title={isSidebarCollapsed ? 'Show template library' : 'Collapse template library for wider note area'}
              >
                {isSidebarCollapsed ? (
                  <>
                    <PanelLeftOpen className={`w-4 h-4 ${theme.textAccent}`} />
                    <span className={`text-[11px] font-semibold ${theme.textAccent}`}>Templates</span>
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-[11px]">Hide</span>
                  </>
                )}
              </button>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${theme.primaryBadge}`}>
                  {template.categoryLabel}
                </span>
                {template.isModified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/60 shrink-0">
                    <Edit3 className="w-2.5 h-2.5" />
                    Customized
                  </span>
                )}
                {isTemplateProcedure(template) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60 shrink-0">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Bedside Procedure
                  </span>
                )}
                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {template.title}
                </h1>
              </div>

              {template.procedureBadges && template.procedureBadges.length > 0 && (
                <div className="hidden sm:flex items-center gap-1 mt-0.5">
                  {template.procedureBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <Tag className="w-2 h-2 text-slate-400" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Primary Copy Button & Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Primary Action Button: Large High-Contrast Copy */}
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-all ${
                copied
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/30'
                  : theme.primaryBtn
              }`}
              title="Copy formatted note to clipboard ready for EHR paste"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Note for EHR</span>
                </>
              )}
            </button>

            {/* Print Note Action Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors shrink-0"
              title="Print clinical note formatted for physical chart, handoff or audit"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 dark:text-slate-400" />
              <span className="hidden sm:inline">Print Note</span>
              <span className="sm:hidden">Print</span>
            </button>

            {/* Font Size Adjuster */}
            <div className="hidden sm:flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setNoteFontSize('sm')}
                className={`px-1.5 py-0.5 rounded ${
                  noteFontSize === 'sm'
                    ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Smaller note font"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setNoteFontSize('base')}
                className={`px-1.5 py-0.5 rounded ${
                  noteFontSize === 'base'
                    ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Default note font"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setNoteFontSize('lg')}
                className={`px-1.5 py-0.5 rounded ${
                  noteFontSize === 'lg'
                    ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
                title="Larger note font for COW / tablet reading"
              >
                A+
              </button>
            </div>

            {/* Edit Template */}
            {onEditTemplate && (
              <button
                type="button"
                onClick={() => onEditTemplate(template)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs"
                title="Edit template phrasing, custom fields, and format options"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                <span className="hidden md:inline">Edit Template</span>
              </button>
            )}

            {/* Restore to Default */}
            {template.isModified && onRestoreTemplate && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Restore "${template.title}" back to system default? Any customized variables and phrasing will be reset.`)) {
                    onRestoreTemplate(template.id);
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 bg-amber-100/90 dark:bg-amber-950/70 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300/80 dark:border-amber-800/80 shadow-2xs"
                title="Restore this template back to factory hospital standard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Restore Default</span>
              </button>
            )}

            {/* Reset to defaults */}
            <button
              onClick={onResetDefaults}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset note back to template defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen / Zen View */}
            {onToggleZenMode && (
              <button
                type="button"
                onClick={onToggleZenMode}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title={isZenMode ? 'Exit full screen note view' : 'Maximize note area (Zen View)'}
              >
                {isZenMode ? <Minimize2 className={`w-3.5 h-3.5 ${theme.textAccent}`} /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Custom delete button */}
            {template.isCustom && onDeleteCustomTemplate && (
              <button
                onClick={() => onDeleteCustomTemplate(template.id)}
                className="p-1.5 text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                title="Delete this custom template"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Format Tabs + Quick Controls Ribbon */}
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Format Selector Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/90 rounded-md text-[11px] sm:text-xs">
            <button
              onClick={() => onChangeFormat('concise')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium rounded whitespace-nowrap transition-colors ${
                activeFormat === 'concise'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5 text-blue-500" />
              <span>Concise EHR</span>
            </button>
            <button
              onClick={() => onChangeFormat('dar')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium rounded whitespace-nowrap transition-colors ${
                activeFormat === 'dar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span>DAR (Focus)</span>
            </button>
            <button
              onClick={() => onChangeFormat('soap')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium rounded whitespace-nowrap transition-colors ${
                activeFormat === 'soap'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
              <span>SOAP</span>
            </button>
            <button
              onClick={() => onChangeFormat('narrative')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium rounded whitespace-nowrap transition-colors ${
                activeFormat === 'narrative'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Narrative Prose</span>
            </button>
          </div>

          {/* Quick Option & Variable Toggles */}
          <div className="flex items-center gap-1.5">
            {quickFields.length > 0 && (
              <button
                type="button"
                onClick={() => setIsQuickOptionsOpen(!isQuickOptionsOpen)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                  isQuickOptionsOpen
                    ? theme.activeItem
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Toggle quick preset options"
              >
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>Quick Options ({quickFields.length})</span>
                {isQuickOptionsOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAdvancedFieldsOpen(!isAdvancedFieldsOpen)}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded transition-colors ${
                isAdvancedFieldsOpen
                  ? theme.activeItem
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Customize all variables"
            >
              <Sliders className="w-3 h-3" />
              <span>Variables ({template.fields.length})</span>
              {isAdvancedFieldsOpen ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Quick Tweak Drawer (Compact & Non-Intrusive) */}
        {isQuickOptionsOpen && quickFields.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850/90 dark:bg-slate-800/90 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 space-y-2 animate-fade-in max-h-40 overflow-y-auto">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                Click any option to instantly update the note:
              </span>
              <button
                type="button"
                onClick={() => setIsQuickOptionsOpen(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-[10px]"
              >
                Close ✕
              </button>
            </div>
            <div className="space-y-1.5">
              {quickFields.slice(0, 5).map((field) => {
                const currentVal = fieldValues[field.id] || field.defaultValue;
                return (
                  <div key={field.id} className="flex flex-wrap items-center gap-1 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-400 font-medium text-[10px] w-28 truncate shrink-0">
                      {field.label}:
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {field.options?.map((opt, i) => {
                        const isSel = currentVal === opt;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onFieldChange(field.id, opt)}
                            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors border ${
                              isSel
                                ? theme.activeItem
                                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            {opt.length > 32 ? `${opt.slice(0, 30)}…` : opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expandable Full Customizer Drawer */}
        {isAdvancedFieldsOpen && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-800/95 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700 space-y-2.5 animate-fade-in max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                All Template Variables & Custom Text
              </span>
              <button
                type="button"
                onClick={() => setIsAdvancedFieldsOpen(false)}
                className="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white text-[10px]"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {template.fields.map((field) => {
                const val = fieldValues[field.id] !== undefined ? fieldValues[field.id] : field.defaultValue;
                return (
                  <div key={field.id} className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200/80 dark:border-slate-700 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                        {field.label}
                      </label>
                      <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500">
                        {`{${field.id}}`}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={val}
                      onChange={(e) => onFieldChange(field.id, e.target.value)}
                      className={`w-full text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:bg-white dark:focus:bg-slate-900 focus:outline-none ${theme.focusBorder}`}
                    />

                    {field.options && field.options.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {field.options.map((opt, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => onFieldChange(field.id, opt)}
                            className={`text-[9px] px-1 py-0.5 rounded border transition-colors ${
                              val === opt
                                ? theme.activeItem
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            {opt.length > 25 ? `${opt.slice(0, 23)}…` : opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Body: Maximized Note Workspace (Full Height, Glare-Free Dark in Night Mode) */}
      <div className="flex-1 p-2 sm:p-2.5 lg:p-3 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden w-full h-full min-h-0 transition-colors">
          {/* Note Toolbar with Quick Macro Stamps */}
          <div className="bg-slate-50/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
            {/* Quick Macro Stamp Buttons */}
            <div className="flex flex-wrap items-center gap-1 text-xs">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                + Stamps:
              </span>
              {onOpenCalculator && (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60"
                  title="Open IV Drug Calculator (Continuous Infusions, Reverse Pump Check, Push Draw-Up)"
                >
                  <Calculator className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>IV Drug Calc</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleInsertTime}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Insert current military time"
              >
                <Clock className="w-3 h-3 text-blue-500" />
                <span>Time ({getCurrentMilitaryTime()})</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Vitals added', getStandardVitalsSnippet())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append standard vitals block"
              >
                <Activity className="w-3 h-3 text-rose-500" />
                <span>Vitals</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Shift receiving added', getShiftChangeReceivingStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append Shift Change Bedside Handoff & Receiving block"
              >
                <UserCheck className="w-3 h-3 text-blue-500" />
                <span>Shift Receiving</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Receiving handoff added', getReceivingHandoffStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append receiving handoff block"
              >
                <UserCheck className="w-3 h-3 text-indigo-500" />
                <span>Receiving Handoff</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Turn log added', getPositioningTurnStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append turn and repositioning log"
              >
                <RotateCw className="w-3 h-3 text-amber-500" />
                <span>Turn Log</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Skin care added', getSkinCareStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append skin care and barrier check"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Skin Care</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Suction added', getSuctionStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append suctioning procedure"
              >
                <Wind className="w-3 h-3 text-cyan-500" />
                <span>Suctioning</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Vent check added', getVentCheckStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append mechanical ventilation check"
              >
                <Cpu className="w-3 h-3 text-purple-500" />
                <span>Vent Check</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('MUST added', getMUSTStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append MUST nutritional screening score"
              >
                <Scale className="w-3 h-3 text-lime-600" />
                <span>MUST</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('EWS added', getEWSStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append EWS / NEWS2 early warning score check"
              >
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <span>EWS</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Mega Code added', getMegaCodeStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/60`}
                title="Append Code Blue / Mega Code resuscitation log"
              >
                <HeartPulse className="w-3 h-3 text-rose-600 fill-rose-500/20" />
                <span>Mega Code</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Pre-Op check added', getPreOpStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-blue-50 dark:hover:bg-blue-950/50`}
                title="Append pre-operative verification and surgical checklist"
              >
                <ClipboardCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Pre-Op</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('PACU post-op added', getPostOpPACUStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-teal-50 dark:hover:bg-teal-950/50`}
                title="Append PACU Phase I post-operative recovery check"
              >
                <Activity className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>PACU Post-Op</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Wound check added', getWoundAssessmentStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-amber-950/50`}
                title="Append standardized wound assessment and dressing check"
              >
                <Bandage className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>Wound Check</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Wound VAC added', getWoundVACPackingStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-purple-50 dark:hover:bg-purple-950/50`}
                title="Append complex wound packing and negative pressure (VAC) check"
              >
                <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Wound VAC</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Time-Out added', getUniversalTimeOutStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/50`}
                title="Append Universal Protocol Bedside Time-Out verification"
              >
                <ShieldCheck className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>Time-Out</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Dual-RN check added', getDualRNStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/50`}
                title="Append Dual RN verification stamp"
              >
                <UserCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Dual-RN</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('NG check added', getNGTubePlacementStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-emerald-50 dark:hover:bg-emerald-950/50`}
                title="Append Nasogastric (NG) tube aspirate and radiologic verification"
              >
                <Activity className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>NG Check</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Blood Culture added', getBloodCultureStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-purple-50 dark:hover:bg-purple-950/50`}
                title="Append Blood Culture dual-site collection verification"
              >
                <Syringe className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Blood Culture</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Sterile assist added', getBedsideInvasiveAssistStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-blue-50 dark:hover:bg-blue-950/50`}
                title="Append Bedside Invasive Procedure Assist verification"
              >
                <ShieldCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Sterile Assist</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Chest Pain assessment added', getChestPainPQRSTStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/60"
                title="Append STAT Acute Chest Pain PQRST and 10-minute ECG evaluation"
              >
                <HeartPulse className="w-3 h-3 text-rose-600 fill-rose-500/20" />
                <span>+ Chest Pain</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Dyspnea assessment added', getAcuteDyspneaStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-sky-50 dark:hover:bg-sky-950/60"
                title="Append STAT Acute Dyspnea and Respiratory Distress escalation stamp"
              >
                <Wind className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>+ Dyspnea</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Post-Cath check added', getPostAngioCathStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-rose-50 dark:hover:bg-rose-950/50"
                title="Append Post-Angiogram & TR Band / Femoral recovery check"
              >
                <Activity className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                <span>+ Post-Cath</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Cardioversion log added', getCardioversionStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-amber-50 dark:hover:bg-amber-950/50"
                title="Append Synchronized Cardioversion assist and rhythm conversion verification"
              >
                <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>+ Cardiovert</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('TEE assist added', getTEEAssistStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-medium hover:bg-purple-50 dark:hover:bg-purple-950/50"
                title="Append TEE assist, moderate sedation and NPO gag reflex verification"
              >
                <CheckCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>+ TEE Assist</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('MD Read-back added', getMDReadbackStamp())}
                className={`px-2 py-0.5 bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] ${theme.stampHover}`}
                title="Append MD readback confirmation"
              >
                <PhoneCall className="w-3 h-3 text-blue-500" />
                <span>MD Read-Back</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Pain reassessment added', getPainReassessmentStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/60"
                title="Append Joint Commission standard Pain Reassessment and POSS score"
              >
                <HeartPulse className="w-3 h-3 text-amber-600 fill-amber-500/20" />
                <span>+ Pain Recheck</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyStamp('Fever & Sepsis screen added', getFeverSepsisStamp())}
                className="px-2 py-0.5 bg-white dark:bg-slate-800/90 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 rounded transition-colors flex items-center gap-1 shadow-2xs text-[11px] font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/60"
                title="Append Acute Fever Spike, Blood Culture, and Sepsis Surveillance screen"
              >
                <Flame className="w-3 h-3 text-rose-600 fill-rose-500/20" />
                <span>+ Fever & Sepsis</span>
              </button>
            </div>

            {stampFeedback && (
              <span className={`text-[11px] font-semibold ${theme.textAccent} animate-fade-in`}>
                ✓ {stampFeedback}
              </span>
            )}
          </div>

          {/* Clinical Quality & Placeholder Inspector Bar */}
          <div className="bg-slate-50 dark:bg-slate-850 px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 transition-colors">
            <div className="flex items-center gap-2 flex-wrap">
              {placeholders.length > 0 ? (
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>
                    {placeholders.length} Unfilled Placeholder{placeholders.length > 1 ? 's' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={handleJumpToNextPlaceholder}
                    className="ml-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold text-[10px] inline-flex items-center gap-1 transition-colors border border-amber-300 dark:border-amber-800 shadow-2xs"
                    title="Jump to and highlight the next [placeholder] in the note"
                  >
                    <span>Jump to Next [ ]</span>
                    <CornerDownRight className="w-2.5 h-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStripBrackets}
                    className="px-2 py-0.5 rounded bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium transition-colors border border-slate-300 dark:border-slate-700"
                    title="Strip bracket symbols [ ] from placeholders"
                  >
                    Remove Brackets
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>EHR Quality Check: All placeholders completed</span>
                </div>
              )}
            </div>

            {/* Bedside Quick Tools in Quality Bar */}
            <div className="flex items-center gap-2">
              {onOpenCalculator && (
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-medium transition-colors shadow-2xs"
                  title="Bedside Clinical Math: MAP, IV Drip Rate, Temp & Weight conversions"
                >
                  <Calculator className="w-3 h-3 text-blue-500" />
                  <span>Clinical Math</span>
                </button>
              )}

              {onOpenTimers && (
                <button
                  type="button"
                  onClick={onOpenTimers}
                  className="relative flex items-center gap-1 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px] font-medium transition-colors shadow-2xs"
                  title="Bedside Shift Timers: Pain rechecks, patient turns, neuro checks"
                >
                  <Clock className={`w-3 h-3 ${activeTimerCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
                  <span>Timers</span>
                  {activeTimerCount > 0 && (
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center -ml-0.5">
                      {activeTimerCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Friendly Placeholder Warning Toast Banner */}
          {placeholderWarning && (
            <div className="bg-amber-100/90 dark:bg-amber-950/80 border-b border-amber-300 dark:border-amber-800 px-4 py-1.5 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{placeholderWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setPlaceholderWarning(null)}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-950 font-bold text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* Maximized Editable Clinical Note Pad */}
          <div className="flex-1 relative flex flex-col min-h-0 bg-white dark:bg-slate-900 transition-colors">
            <textarea
              ref={textareaRef}
              value={noteText}
              onChange={(e) => onTextChange(e.target.value)}
              className={`w-full flex-1 h-full min-h-0 p-4 sm:p-5 font-mono ${fontClass} text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 resize-none focus:outline-none leading-relaxed select-text tracking-wide transition-colors`}
              placeholder="Your clinical note will appear here..."
              spellCheck={false}
            />
          </div>

          {/* Note Footer Utilities & Real-Time Metrics */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-medium text-slate-600 dark:text-slate-300">Ready for Epic, Cerner, Meditech & PointClickCare</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-mono tabular-nums">{wordCount} words</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="font-mono tabular-nums">{charCount} characters</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                title="Print or export to PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                title="Save as .txt file"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Save .txt</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Clinical Note Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="printable-note-portal" className="p-8 font-sans text-slate-900 bg-white">
            <div className="border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                    NurseChart · Bedside Clinical Documentation
                  </div>
                  <h1 className="text-base font-extrabold text-slate-950 uppercase tracking-tight">
                    {template.title}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Category: {template.categoryLabel} · Format: {activeFormat.toUpperCase()}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-700 leading-tight">
                  <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                  <div><strong>Time:</strong> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">REF: NC-{template.id.slice(0, 8)}</div>
                </div>
              </div>
            </div>

            <div className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed border border-slate-300 p-4 rounded bg-slate-50/50 min-h-[350px] text-slate-950">
              {noteText}
            </div>

            <div className="mt-8 pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
              <div>
                <p className="font-bold text-slate-900">Documenting Nurse Verification:</p>
                <div className="border-b border-slate-600 mt-6 mb-1"></div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Signature / RN License #</span>
                  <span>Date: _________ Time: _______</span>
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900">Dual-RN Co-Signer / Witness (if required):</p>
                <div className="border-b border-slate-600 mt-6 mb-1"></div>
                <div className="flex justify-between text-[10px] text-slate-600">
                  <span>Co-Signature / Title</span>
                  <span>Date: _________ Time: _______</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
