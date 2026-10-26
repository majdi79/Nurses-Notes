import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { TemplateSelector } from './components/TemplateSelector';
import { NoteStudio } from './components/NoteStudio';
import { TemplateEditorModal } from './components/TemplateEditorModal';
import { ClinicalGuideModal } from './components/ClinicalGuideModal';
import { PatientWorklistBar, PatientSlot } from './components/PatientWorklistBar';
import { ClinicalCalculatorsModal } from './components/ClinicalCalculatorsModal';
import { ShiftTimersWidget } from './components/ShiftTimersWidget';
import {
  INITIAL_TEMPLATES,
  NoteTemplate,
  isTemplateProcedure,
  getTemplateProcedureCategory,
  isDefaultTemplateId,
  getInitialTemplateById,
} from './data/templates';
import { compileNoteText, NoteFormatType } from './utils/formatter';
import { ColorTheme } from './utils/theme';
import { FileText, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_CUSTOM = 'nursechart_custom_templates';
const STORAGE_KEY_MODIFIED = 'nursechart_modified_default_templates';
const STORAGE_KEY_FAVS = 'nursechart_favorites';
const STORAGE_KEY_FORMAT = 'nursechart_preferred_format';
const STORAGE_KEY_NIGHT = 'nursechart_night_mode';
const STORAGE_KEY_THEME = 'nursechart_color_theme';
const STORAGE_KEY_SLOTS = 'nursechart_patient_slots';
const STORAGE_KEY_ACTIVE_SLOT = 'nursechart_active_slot_id';

const INITIAL_SLOTS: PatientSlot[] = [
  { id: 'slot_1', bedLabel: 'Bed 301', templateId: 'routine-head-to-toe', fieldValues: {}, manualText: null, format: 'concise', lastUpdated: Date.now() },
  { id: 'slot_2', bedLabel: 'Bed 302', templateId: 'routine-pain-assessment-reassessment', fieldValues: {}, manualText: null, format: 'concise', lastUpdated: Date.now() },
  { id: 'slot_3', bedLabel: 'Bed 303', templateId: 'emergency-fever-febrile-episode', fieldValues: {}, manualText: null, format: 'concise', lastUpdated: Date.now() },
  { id: 'slot_4', bedLabel: 'Bed 304', templateId: 'routine-positioning-turn', fieldValues: {}, manualText: null, format: 'concise', lastUpdated: Date.now() },
];

export default function App() {
  // Load custom templates
  const [customTemplates, setCustomTemplates] = useState<NoteTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load modified versions of default templates
  const [modifiedTemplates, setModifiedTemplates] = useState<Record<string, NoteTemplate>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODIFIED);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Combine initial (with user customizations) + custom templates
  const allTemplates = useMemo(() => {
    const defaultsWithModifications = INITIAL_TEMPLATES.map((tpl) => {
      if (modifiedTemplates[tpl.id]) {
        return { ...modifiedTemplates[tpl.id], isModified: true };
      }
      return tpl;
    });
    return [...customTemplates, ...defaultsWithModifications];
  }, [customTemplates, modifiedTemplates]);

  // Selected template
  const [selectedTemplate, setSelectedTemplate] = useState<NoteTemplate>(() => {
    const initial = INITIAL_TEMPLATES[0];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODIFIED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[initial.id]) {
          return { ...parsed[initial.id], isModified: true };
        }
      }
    } catch {}
    return initial;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : ['routine-head-to-toe', 'routine-ed-admission-receiving', 'routine-positioning-turn'];
    } catch {
      return ['routine-head-to-toe', 'routine-ed-admission-receiving'];
    }
  });

  // Active category & search
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNavView, setActiveNavView] = useState<'templates' | 'procedures' | 'favorites' | 'custom'>('templates');
  const [viewMode, setViewMode] = useState<'all' | 'procedures'>('all');
  const [activeProcedureCategory, setActiveProcedureCategory] = useState<string>('all_procedures');

  // Format type
  const [activeFormat, setActiveFormat] = useState<NoteFormatType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FORMAT);
      return (saved as NoteFormatType) || 'concise';
    } catch {
      return 'concise';
    }
  });

  // Field values for active template
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Direct manual overrides on compiled text
  const [manualText, setManualText] = useState<string | null>(null);

  // Modals
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isTimersOpen, setIsTimersOpen] = useState(false);
  const [activeTimerCount, setActiveTimerCount] = useState(0);

  // Shift Patient Worklist Slots (Privacy-Safe Room/Bed switcher)
  const [patientSlots, setPatientSlots] = useState<PatientSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SLOTS);
      return saved ? JSON.parse(saved) : INITIAL_SLOTS;
    } catch {
      return INITIAL_SLOTS;
    }
  });

  const [activeSlotId, setActiveSlotId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_SLOT);
      return saved || 'slot_1';
    } catch {
      return 'slot_1';
    }
  });

  const isSwitchingSlotRef = useRef(false);

  // Mobile tab ('library' | 'studio')
  const [mobileTab, setMobileTab] = useState<'library' | 'studio'>('library');

  // Sidebar collapse toggle for maximizing note area
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fullscreen Zen mode (maximizes note area to 100% of viewport)
  const [isZenMode, setIsZenMode] = useState(false);

  // Night Shift Mode (Dark Mode)
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NIGHT);
      if (saved !== null) return saved === 'true';
      return false;
    } catch {
      return false;
    }
  });

  // Clinical Color Theme: default 'blue' as requested
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return (saved as ColorTheme) || 'blue';
    } catch {
      return 'blue';
    }
  });

  // Global toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on root document
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NIGHT, String(isNightMode));
      if (isNightMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // storage error ignored
    }
  }, [isNightMode]);

  // Sync color theme
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, colorTheme);
    } catch {
      // storage error ignored
    }
  }, [colorTheme]);

  // Initialize fields when template changes
  useEffect(() => {
    if (isSwitchingSlotRef.current) {
      isSwitchingSlotRef.current = false;
      return;
    }
    const defaults: Record<string, string> = {};
    selectedTemplate.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setFieldValues(defaults);
    setManualText(null);
  }, [selectedTemplate.id]);

  // Save patient slots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(patientSlots));
      localStorage.setItem(STORAGE_KEY_ACTIVE_SLOT, activeSlotId);
    } catch {
      // storage error ignored
    }
  }, [patientSlots, activeSlotId]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch {
      // storage error ignored
    }
  }, [favorites]);

  // Save custom templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customTemplates));
    } catch {
      // storage error ignored
    }
  }, [customTemplates]);

  // Save modified versions of default templates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MODIFIED, JSON.stringify(modifiedTemplates));
    } catch {
      // storage error ignored
    }
  }, [modifiedTemplates]);

  // Save preferred format
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FORMAT, activeFormat);
    } catch {
      // storage error ignored
    }
  }, [activeFormat]);

  // Compute final note text
  const noteOutput = useMemo(() => {
    if (manualText !== null) {
      return manualText;
    }
    return compileNoteText(selectedTemplate, fieldValues, activeFormat);
  }, [selectedTemplate, fieldValues, activeFormat, manualText]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((tpl) => {
      if (activeNavView === 'favorites' && !favorites.includes(tpl.id)) {
        return false;
      }
      if (activeNavView === 'custom' && !tpl.isCustom) {
        return false;
      }

      // If viewing procedures mode or nav view is 'procedures', strictly filter procedures
      if (viewMode === 'procedures' || activeNavView === 'procedures') {
        if (!isTemplateProcedure(tpl)) return false;

        if (activeProcedureCategory !== 'all_procedures') {
          if (getTemplateProcedureCategory(tpl) !== activeProcedureCategory) {
            return false;
          }
        }
      } else {
        // Standard general category filtering
        if (activeCategory !== 'all') {
          if (activeCategory === 'custom') {
            if (!tpl.isCustom) return false;
          } else if (tpl.category !== activeCategory) {
            return false;
          }
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tpl.title.toLowerCase().includes(q);
        const matchesDesc = tpl.description.toLowerCase().includes(q);
        const matchesTags = tpl.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCat = tpl.categoryLabel.toLowerCase().includes(q);
        const matchesProcCat = tpl.procedureCategoryLabel ? tpl.procedureCategoryLabel.toLowerCase().includes(q) : false;
        const matchesBadges = tpl.procedureBadges ? tpl.procedureBadges.some((b) => b.toLowerCase().includes(q)) : false;
        return matchesTitle || matchesDesc || matchesTags || matchesCat || matchesProcCat || matchesBadges;
      }

      return true;
    });
  }, [allTemplates, activeNavView, favorites, activeCategory, searchQuery, viewMode, activeProcedureCategory]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Sync workspace modifications to active patient slot
  const syncCurrentSlot = (changes: Partial<PatientSlot>) => {
    setPatientSlots((prev) =>
      prev.map((s) => (s.id === activeSlotId ? { ...s, ...changes, lastUpdated: Date.now() } : s))
    );
  };

  // Switch active patient slot with state snapshotting
  const handleSelectSlot = (slotId: string) => {
    if (slotId === activeSlotId) return;

    // 1. Snapshot current active note into current slot
    const updatedSlots = patientSlots.map((s) => {
      if (s.id === activeSlotId) {
        return {
          ...s,
          templateId: selectedTemplate.id,
          fieldValues,
          manualText,
          format: activeFormat,
          lastUpdated: Date.now(),
        };
      }
      return s;
    });

    // 2. Load target slot
    const target = updatedSlots.find((s) => s.id === slotId);
    if (target) {
      isSwitchingSlotRef.current = true;
      const targetTemplate = allTemplates.find((t) => t.id === target.templateId) || INITIAL_TEMPLATES[0];
      setSelectedTemplate(targetTemplate);

      if (target.fieldValues && Object.keys(target.fieldValues).length > 0) {
        setFieldValues(target.fieldValues);
      } else {
        const defs: Record<string, string> = {};
        targetTemplate.fields.forEach((f) => {
          defs[f.id] = f.defaultValue;
        });
        setFieldValues(defs);
      }

      setManualText(target.manualText);
      setActiveFormat(target.format || 'concise');
      setToastMessage(`Switched to ${target.bedLabel}`);
      setTimeout(() => setToastMessage(null), 1800);
    }

    setPatientSlots(updatedSlots);
    setActiveSlotId(slotId);
  };

  const handleAddSlot = () => {
    const newNum = patientSlots.length + 1;
    const newSlot: PatientSlot = {
      id: `slot_${Date.now()}`,
      bedLabel: `Bed 30${newNum}`,
      templateId: selectedTemplate.id,
      fieldValues: {},
      manualText: null,
      format: activeFormat,
      lastUpdated: Date.now(),
    };
    setPatientSlots((prev) => [...prev, newSlot]);
    handleSelectSlot(newSlot.id);
  };

  const handleRemoveSlot = (slotId: string) => {
    if (patientSlots.length <= 1) return;
    const remaining = patientSlots.filter((s) => s.id !== slotId);
    setPatientSlots(remaining);
    if (activeSlotId === slotId) {
      handleSelectSlot(remaining[0].id);
    }
  };

  const handleRenameSlot = (slotId: string, newLabel: string) => {
    setPatientSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, bedLabel: newLabel } : s))
    );
  };

  const handleSelectTemplate = (template: NoteTemplate) => {
    setSelectedTemplate(template);
    setManualText(null);
    syncCurrentSlot({ templateId: template.id, manualText: null });
    setMobileTab('studio');
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => {
      const next = { ...prev, [fieldId]: value };
      syncCurrentSlot({ fieldValues: next, manualText: null });
      return next;
    });
    setManualText(null);
  };

  const handleResetDefaults = () => {
    const defaults: Record<string, string> = {};
    selectedTemplate.fields.forEach((f) => {
      defaults[f.id] = f.defaultValue;
    });
    setFieldValues(defaults);
    setManualText(null);
    syncCurrentSlot({ fieldValues: defaults, manualText: null });
    setToastMessage('Note reset to template defaults');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleAppendSnippet = (snippet: string) => {
    const current = noteOutput;
    const updated = `${current}\n\n${snippet}`;
    setManualText(updated);
    syncCurrentSlot({ manualText: updated });
  };

  const handleOpenCreateTemplate = () => {
    setEditingTemplate(null);
    setIsEditorModalOpen(true);
  };

  const handleOpenEditTemplate = (templateToEdit: NoteTemplate) => {
    setEditingTemplate(templateToEdit);
    setIsEditorModalOpen(true);
  };

  const handleSaveTemplate = (updatedTemplate: NoteTemplate) => {
    const isDefault = isDefaultTemplateId(updatedTemplate.id);

    if (isDefault) {
      setModifiedTemplates((prev) => ({
        ...prev,
        [updatedTemplate.id]: { ...updatedTemplate, isModified: true },
      }));
      setToastMessage(`Template "${updatedTemplate.title}" customized & saved!`);
    } else {
      setCustomTemplates((prev) => {
        const existingIdx = prev.findIndex((t) => t.id === updatedTemplate.id);
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = updatedTemplate;
          return next;
        }
        return [updatedTemplate, ...prev];
      });
      setToastMessage(`Custom template "${updatedTemplate.title}" saved!`);
    }

    if (selectedTemplate.id === updatedTemplate.id) {
      setSelectedTemplate({
        ...updatedTemplate,
        isModified: isDefault ? true : updatedTemplate.isModified,
      });
      const newDefaults: Record<string, string> = {};
      updatedTemplate.fields.forEach((f) => {
        newDefaults[f.id] = fieldValues[f.id] ?? f.defaultValue;
      });
      setFieldValues(newDefaults);
      setManualText(null);
    }

    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRestoreTemplate = (templateId: string) => {
    const pristine = getInitialTemplateById(templateId);
    if (!pristine) return;

    setModifiedTemplates((prev) => {
      const next = { ...prev };
      delete next[templateId];
      return next;
    });

    if (selectedTemplate.id === templateId) {
      setSelectedTemplate(pristine);
      const defaults: Record<string, string> = {};
      pristine.fields.forEach((f) => {
        defaults[f.id] = f.defaultValue;
      });
      setFieldValues(defaults);
      setManualText(null);
    }

    setToastMessage(`Restored "${pristine.title}" to default template`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRestoreAllDefaults = () => {
    const count = Object.keys(modifiedTemplates).length;
    if (count === 0) {
      setToastMessage('All templates are already at factory defaults');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }

    if (confirm(`Restore all ${count} customized templates back to hospital defaults? This cannot be undone.`)) {
      setModifiedTemplates({});
      if (isDefaultTemplateId(selectedTemplate.id)) {
        const pristine = getInitialTemplateById(selectedTemplate.id);
        if (pristine) {
          setSelectedTemplate(pristine);
          const defaults: Record<string, string> = {};
          pristine.fields.forEach((f) => {
            defaults[f.id] = f.defaultValue;
          });
          setFieldValues(defaults);
          setManualText(null);
        }
      }
      setToastMessage('All templates restored to system defaults');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    if (confirm('Delete this custom template?')) {
      setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId));
      if (selectedTemplate.id === templateId) {
        setSelectedTemplate(INITIAL_TEMPLATES[0]);
      }
      setToastMessage('Template deleted');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${isNightMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} antialiased overflow-hidden font-sans transition-colors duration-200`}>
      {/* Top Header - hidden in Zen Mode to maximize note area */}
      {!isZenMode && (
        <Header
          onOpenCustomModal={handleOpenCreateTemplate}
          onOpenGuideModal={() => setIsGuideModalOpen(true)}
          onOpenCalculator={() => setIsCalculatorsOpen(true)}
          onOpenTimers={() => setIsTimersOpen(true)}
          activeTimerCount={activeTimerCount}
          activeView={activeNavView}
          onSelectView={(v) => {
            setActiveNavView(v);
            setMobileTab('library');
            if (v === 'procedures') {
              setViewMode('procedures');
              setActiveProcedureCategory('all_procedures');
            } else if (v === 'templates') {
              setViewMode('all');
              setActiveCategory('all');
            } else if (v === 'custom') {
              setViewMode('all');
              setActiveCategory('custom');
            } else if (v === 'favorites') {
              setViewMode('all');
              setActiveCategory('all');
            }
          }}
          customCount={customTemplates.length}
          isNightMode={isNightMode}
          onToggleNightMode={() => setIsNightMode((prev) => !prev)}
          colorTheme={colorTheme}
          onChangeColorTheme={setColorTheme}
        />
      )}

      {/* Multi-Patient Bed / Room Switcher (100% Private, Client-Side) */}
      {!isZenMode && (
        <PatientWorklistBar
          slots={patientSlots}
          activeSlotId={activeSlotId}
          onSelectSlot={handleSelectSlot}
          onAddSlot={handleAddSlot}
          onRemoveSlot={handleRemoveSlot}
          onRenameSlot={handleRenameSlot}
          colorTheme={colorTheme}
        />
      )}

      {/* Mobile Mode Switcher */}
      <div className={`md:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-semibold ${isZenMode ? 'hidden' : ''}`}>
        <button
          onClick={() => setMobileTab('library')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-colors ${
            mobileTab === 'library'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Note Library ({filteredTemplates.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('studio')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-colors ${
            mobileTab === 'studio'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span>Note Studio</span>
        </button>
      </div>

      {/* Main 2-Pane Spacious Layout */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Pane: Template Library & Quick Shortcuts */}
        {!isZenMode && (
          <section
            className={`w-full md:w-80 lg:w-[350px] xl:w-[370px] shrink-0 flex flex-col h-full bg-white dark:bg-slate-900 z-10 transition-colors ${
              isSidebarCollapsed ? 'hidden' : mobileTab !== 'library' ? 'hidden md:flex' : 'flex'
            }`}
          >
            <TemplateSelector
              templates={filteredTemplates}
              allTemplates={allTemplates}
              selectedTemplateId={selectedTemplate.id}
              onSelectTemplate={handleSelectTemplate}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              activeCategory={activeCategory}
              onChangeCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              preferredFormat={activeFormat}
              colorTheme={colorTheme}
              viewMode={viewMode}
              onToggleViewMode={(mode) => {
                setViewMode(mode);
                if (mode === 'procedures') {
                  setActiveNavView('procedures');
                  setActiveProcedureCategory('all_procedures');
                } else {
                  setActiveNavView('templates');
                  setActiveCategory('all');
                }
              }}
              activeProcedureCategory={activeProcedureCategory}
              onChangeProcedureCategory={setActiveProcedureCategory}
              onEditTemplate={handleOpenEditTemplate}
              onRestoreTemplate={handleRestoreTemplate}
              onRestoreAllDefaults={handleRestoreAllDefaults}
              modifiedCount={Object.keys(modifiedTemplates).length}
            />
          </section>
        )}

        {/* Right Pane: Maximized Note Studio */}
        <section
          className={`flex-1 flex flex-col h-full min-w-0 ${
            !isZenMode && mobileTab !== 'studio' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <NoteStudio
            template={selectedTemplate}
            noteText={noteOutput}
            onTextChange={setManualText}
            fieldValues={fieldValues}
            onFieldChange={handleFieldChange}
            onResetDefaults={handleResetDefaults}
            onDeleteCustomTemplate={handleDeleteCustomTemplate}
            onAppendSnippet={handleAppendSnippet}
            activeFormat={activeFormat}
            onChangeFormat={setActiveFormat}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode((prev) => !prev)}
            colorTheme={colorTheme}
            onEditTemplate={handleOpenEditTemplate}
            onRestoreTemplate={handleRestoreTemplate}
            onOpenCalculator={() => setIsCalculatorsOpen(true)}
            onOpenTimers={() => setIsTimersOpen(true)}
            activeTimerCount={activeTimerCount}
          />
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <TemplateEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        template={editingTemplate}
        onSaveTemplate={handleSaveTemplate}
        onRestoreDefault={handleRestoreTemplate}
        colorTheme={colorTheme}
      />

      <ClinicalGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <ClinicalCalculatorsModal
        isOpen={isCalculatorsOpen}
        onClose={() => setIsCalculatorsOpen(false)}
        onInsertSnippet={handleAppendSnippet}
        colorTheme={colorTheme}
        activeBedLabel={patientSlots.find((s) => s.id === activeSlotId)?.bedLabel}
      />

      <ShiftTimersWidget
        isOpen={isTimersOpen}
        onClose={() => setIsTimersOpen(false)}
        colorTheme={colorTheme}
        onTimerCountChange={setActiveTimerCount}
      />
    </div>
  );
}
