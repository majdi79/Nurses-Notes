import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  Copy,
  Check,
  X,
  Filter,
  Layers,
  Stethoscope,
  Syringe,
  Bandage,
  Wind,
  Activity,
  AlertTriangle,
  Sparkles,
  Scale,
  AlertCircle,
  UserCheck,
  Bed,
  RotateCcw,
  ShieldAlert,
  Droplets,
  Pipette,
  HeartPulse,
  ClipboardCheck,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ListFilter,
  BookmarkCheck,
  Tag,
  Zap,
  Edit3,
  Flame,
} from 'lucide-react';
import {
  NoteTemplate,
  CATEGORIES,
  PROCEDURE_CATEGORIES,
  ProcedureCategoryDef,
  isTemplateProcedure,
  getTemplateProcedureCategory,
} from '../data/templates';
import { NoteFormatType, compileNoteText } from '../utils/formatter';
import { ColorTheme, THEMES } from '../utils/theme';

interface TemplateSelectorProps {
  templates: NoteTemplate[];
  allTemplates?: NoteTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (template: NoteTemplate) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  activeCategory: string;
  onChangeCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  preferredFormat: NoteFormatType;
  colorTheme?: ColorTheme;
  viewMode?: 'all' | 'procedures';
  onToggleViewMode?: (mode: 'all' | 'procedures') => void;
  activeProcedureCategory?: string;
  onChangeProcedureCategory?: (catId: string) => void;
  onEditTemplate?: (template: NoteTemplate) => void;
  onRestoreTemplate?: (templateId: string) => void;
  onRestoreAllDefaults?: () => void;
  modifiedCount?: number;
}

// Icon mapper for general categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all: <Layers className="w-3 h-3" />,
  routine: <Stethoscope className="w-3 h-3 text-blue-500" />,
  vascular: <Syringe className="w-3 h-3 text-violet-500" />,
  wound: <Bandage className="w-3 h-3 text-amber-500" />,
  respiratory: <Wind className="w-3 h-3 text-sky-500" />,
  gigu: <Activity className="w-3 h-3 text-emerald-500" />,
  emergency: <AlertTriangle className="w-3 h-3 text-rose-500" />,
  custom: <Sparkles className="w-3 h-3 text-indigo-500" />,
};

// Icon mapper for procedure categories
const PROCEDURE_ICONS: Record<string, React.ReactNode> = {
  all: <Layers className="w-3.5 h-3.5" />,
  all_procedures: <Layers className="w-3.5 h-3.5" />,
  vascular: <Syringe className="w-3.5 h-3.5 text-violet-500" />,
  respiratory: <Wind className="w-3.5 h-3.5 text-sky-500" />,
  gigu: <Activity className="w-3.5 h-3.5 text-emerald-500" />,
  wound: <Bandage className="w-3.5 h-3.5 text-amber-500" />,
  periop: <ClipboardCheck className="w-3.5 h-3.5 text-teal-500" />,
  emergency: <HeartPulse className="w-3.5 h-3.5 text-rose-500" />,
  bedside: <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />,
  cardiac: <HeartPulse className="w-3.5 h-3.5 text-rose-600" />,
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  allTemplates = [],
  selectedTemplateId,
  onSelectTemplate,
  favorites,
  onToggleFavorite,
  activeCategory,
  onChangeCategory,
  searchQuery,
  onSearchChange,
  preferredFormat,
  colorTheme = 'blue',
  viewMode = 'all',
  onToggleViewMode,
  activeProcedureCategory = 'all_procedures',
  onChangeProcedureCategory,
  onEditTemplate,
  onRestoreTemplate,
  onRestoreAllDefaults,
  modifiedCount = 0,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [groupByCategory, setGroupByCategory] = useState(true);

  const theme = THEMES[colorTheme];

  const handleQuickCopy = (template: NoteTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVals: Record<string, string> = {};
    template.fields.forEach((f) => {
      defaultVals[f.id] = f.defaultValue;
    });
    const text = compileNoteText(template, defaultVals, preferredFormat);
    navigator.clipboard.writeText(text);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Compute total procedures count
  const totalProceduresCount = useMemo(() => {
    const list = allTemplates.length > 0 ? allTemplates : templates;
    return list.filter((t) => isTemplateProcedure(t)).length;
  }, [allTemplates, templates]);

  // Group templates by procedure category when in procedure mode
  const groupedProcedures = useMemo(() => {
    if (viewMode !== 'procedures' || !groupByCategory) {
      return null;
    }

    const groups: { category: ProcedureCategoryDef; templates: NoteTemplate[] }[] = [];

    PROCEDURE_CATEGORIES.forEach((catDef) => {
      if (catDef.id === 'all_procedures') return;

      // If activeProcedureCategory is specific, only include that category
      if (activeProcedureCategory !== 'all_procedures' && activeProcedureCategory !== catDef.id) {
        return;
      }

      const matching = templates.filter((tpl) => {
        if (!isTemplateProcedure(tpl)) return false;
        return getTemplateProcedureCategory(tpl) === catDef.id;
      });

      if (matching.length > 0) {
        groups.push({
          category: catDef,
          templates: matching,
        });
      }
    });

    return groups;
  }, [viewMode, groupByCategory, templates, activeProcedureCategory]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top View Mode Switcher: "All Notes" vs "Categorized Procedures" */}
      <div className="p-2 sm:p-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => onToggleViewMode && onToggleViewMode('all')}
            className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>All Notes</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleViewMode && onToggleViewMode('procedures')}
            className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              viewMode === 'procedures'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
            <span className="truncate">Procedure Notes</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                viewMode === 'procedures'
                  ? 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300'
                  : 'bg-slate-300/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {totalProceduresCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar & Mode-Specific Category Chips */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              viewMode === 'procedures'
                ? 'Search procedures (e.g. NG tube, PIV, chest tube, foley, time-out)...'
                : 'Search templates (e.g. foley, vent, skin, ews)...'
            }
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none ${theme.focusBorder} focus:bg-white dark:focus:bg-slate-800 transition-colors`}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Categories Section */}
        {viewMode === 'procedures' ? (
          /* PROCEDURE CATEGORIES SELECTOR */
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[10px] uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-teal-500" />
                Procedure Categories:
              </span>
              <button
                type="button"
                onClick={() => setGroupByCategory(!groupByCategory)}
                className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                title="Toggle between grouped sections and flat list"
              >
                <ListFilter className="w-2.5 h-2.5" />
                <span>{groupByCategory ? 'Grouped View' : 'Flat List'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {PROCEDURE_CATEGORIES.map((cat) => {
                const isActive = activeProcedureCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onChangeProcedureCategory && onChangeProcedureCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-medium transition-colors ${
                      isActive
                        ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{PROCEDURE_ICONS[cat.iconType] || <Layers className="w-3 h-3" />}</span>
                    <span>{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* STANDARD GENERAL CATEGORIES */
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onChangeCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'text-white dark:text-slate-900' : ''}>
                      {CATEGORY_ICONS[cat.id] || <Layers className="w-3 h-3" />}
                    </span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Topic Shortcuts */}
            <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[9px] mr-0.5">
                Topics:
              </span>
              {[
                { label: 'Shift Receiving', query: 'receiving', icon: <UserCheck className="w-2.5 h-2.5 text-blue-600" /> },
                { label: 'Pain & Analgesia', query: 'pain', icon: <HeartPulse className="w-2.5 h-2.5 text-amber-500" /> },
                { label: 'Fever Spike', query: 'fever', icon: <Flame className="w-2.5 h-2.5 text-rose-500" /> },
                { label: 'Chest Pain (PQRST)', query: 'chest pain', icon: <HeartPulse className="w-2.5 h-2.5 text-rose-600" /> },
                { label: 'Acute Dyspnea', query: 'dyspnea', icon: <Wind className="w-2.5 h-2.5 text-sky-500" /> },
                { label: 'Cardioversion', query: 'cardioversion', icon: <Zap className="w-2.5 h-2.5 text-amber-500" /> },
                { label: 'TEE Assist', query: 'tee', icon: <Stethoscope className="w-2.5 h-2.5 text-purple-500" /> },
                { label: 'Post-Cath / TR Band', query: 'angiogram', icon: <Activity className="w-2.5 h-2.5 text-rose-500" /> },
                { label: 'Mega Code (ACLS)', query: 'mega code', icon: <HeartPulse className="w-2.5 h-2.5 text-rose-500" /> },
                { label: 'Bedside Time-Out', query: 'time-out', icon: <ShieldCheck className="w-2.5 h-2.5 text-blue-500" /> },
                { label: 'NG / OG Tube', query: 'ng tube', icon: <Activity className="w-2.5 h-2.5 text-emerald-500" /> },
                { label: 'Blood Cultures', query: 'blood culture', icon: <Syringe className="w-2.5 h-2.5 text-purple-500" /> },
                { label: 'Chest Tube', query: 'chest tube', icon: <Wind className="w-2.5 h-2.5 text-sky-500" /> },
                { label: 'Port-a-Cath', query: 'port-a-cath', icon: <Droplets className="w-2.5 h-2.5 text-indigo-500" /> },
                { label: 'Wound & VAC', query: 'vac', icon: <Bandage className="w-2.5 h-2.5 text-amber-500" /> },
                { label: 'Pre-Op Checklist', query: 'pre-op', icon: <ClipboardCheck className="w-2.5 h-2.5 text-teal-500" /> },
                { label: 'PACU Aldrete', query: 'pacu', icon: <Activity className="w-2.5 h-2.5 text-cyan-500" /> },
                { label: 'Foley', query: 'foley', icon: <Pipette className="w-2.5 h-2.5 text-emerald-500" /> },
              ].map((topic) => {
                const isCurrent = searchQuery.toLowerCase() === topic.query.toLowerCase();
                return (
                  <button
                    key={topic.label}
                    type="button"
                    onClick={() => {
                      if (isCurrent) {
                        onSearchChange('');
                      } else {
                        onSearchChange(topic.query);
                        onChangeCategory('all');
                      }
                    }}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                      isCurrent
                        ? theme.activeItem
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Template List Counter & Meta */}
      <div className="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 min-w-0">
          <Filter className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">
            Showing <strong className="font-semibold text-slate-800 dark:text-slate-200">{templates.length}</strong> {viewMode === 'procedures' ? 'procedure' : 'note'}
            {templates.length === 1 ? '' : 's'}
          </span>
        </div>
        {modifiedCount > 0 && onRestoreAllDefaults ? (
          <button
            type="button"
            onClick={onRestoreAllDefaults}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 bg-amber-100/90 dark:bg-amber-950/70 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300/80 dark:border-amber-800/80 transition-colors shrink-0 shadow-2xs"
            title="Restore all customized templates back to factory default"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>{modifiedCount} edited · Restore All</span>
          </button>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-[10px] shrink-0">1-click copy</span>
        )}
      </div>

      {/* Templates Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-1.5 space-y-1">
        {templates.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No matching templates found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search terms or selecting another category.
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                if (viewMode === 'procedures' && onChangeProcedureCategory) {
                  onChangeProcedureCategory('all_procedures');
                } else {
                  onChangeCategory('all');
                }
              }}
              className={`mt-3 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${theme.primaryBadge}`}
            >
              Reset Filters
            </button>
          </div>
        ) : groupedProcedures && groupedProcedures.length > 0 ? (
          /* GROUPED PROCEDURE CATEGORIES VIEW */
          <div className="space-y-3 pb-4">
            {groupedProcedures.map(({ category, templates: groupTemplates }) => {
              const isCollapsed = !!collapsedCategories[category.id];
              return (
                <div
                  key={category.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 overflow-hidden"
                >
                  {/* Category Section Header */}
                  <button
                    type="button"
                    onClick={() => toggleCategoryCollapse(category.id)}
                    className="w-full flex items-center justify-between p-2.5 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                        {PROCEDURE_ICONS[category.iconType] || <Stethoscope className="w-3 h-3 text-teal-500" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {category.label}
                          </h4>
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-full">
                            {groupTemplates.length}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 ml-2">
                      {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Category Template Items */}
                  {!isCollapsed && (
                    <div className="p-1.5 space-y-1 bg-white dark:bg-slate-900">
                      {groupTemplates.map((tpl) => renderTemplateCard(tpl))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* STANDARD FLAT LIST VIEW */
          templates.map((tpl) => renderTemplateCard(tpl))
        )}
      </div>
    </div>
  );

  // Template Card Render Helper
  function renderTemplateCard(tpl: NoteTemplate) {
    const isSelected = tpl.id === selectedTemplateId;
    const isFav = favorites.includes(tpl.id);
    const isCopied = copiedId === tpl.id;
    const isProc = isTemplateProcedure(tpl);
    const procCategory = getTemplateProcedureCategory(tpl);

    return (
      <div
        key={tpl.id}
        onClick={() => onSelectTemplate(tpl)}
        className={`group relative p-2.5 rounded-lg cursor-pointer transition-all border ${
          isSelected
            ? theme.activeCard
            : 'bg-white dark:bg-slate-900 border-transparent hover:border-slate-200 dark:hover:border-slate-700/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60 dark:border-slate-700/60">
              {isProc ? (
                PROCEDURE_ICONS[procCategory] || <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
              ) : (
                CATEGORY_ICONS[tpl.category] || <Layers className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3
                  className={`text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:${theme.textAccent} transition-colors truncate`}
                >
                  {tpl.title}
                </h3>
              </div>

              {/* Metadata line with procedure badges */}
              <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                {isProc && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/50">
                    <Stethoscope className="w-2.5 h-2.5" />
                    Procedure
                  </span>
                )}
                <span>{tpl.categoryLabel}</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <span className="font-mono tabular-nums">{tpl.fields.length} fields</span>
                {tpl.isCustom ? (
                  <>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span className={`${theme.textAccent} font-medium`}>Custom</span>
                  </>
                ) : tpl.isModified ? (
                  <>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                      ·
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                      Customized
                    </span>
                  </>
                ) : null}
              </div>

              {/* Procedure Badges if available */}
              {tpl.procedureBadges && tpl.procedureBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {tpl.procedureBadges.slice(0, 3).map((badge, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <Tag className="w-2 h-2 text-slate-400" />
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {tpl.description}
              </p>
            </div>
          </div>

          {/* Actions: Edit, Restore, Favorite Star & Quick Copy */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            {onEditTemplate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTemplate(tpl);
                }}
                title="Edit this note template, custom variables, or phrasing"
                className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            {tpl.isModified && onRestoreTemplate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Restore "${tpl.title}" back to system default?`)) {
                    onRestoreTemplate(tpl.id);
                  }
                }}
                title="Restore this template back to factory hospital default"
                className="p-1.5 rounded-md text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => onToggleFavorite(tpl.id, e)}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-md transition-colors ${
                isFav
                  ? 'text-amber-500 hover:text-amber-600'
                  : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              type="button"
              onClick={(e) => handleQuickCopy(tpl, e)}
              title="Quick Copy with default values"
              className={`p-1.5 rounded-md transition-colors ${
                isCopied
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
