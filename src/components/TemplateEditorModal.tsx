import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  RotateCcw,
  Check,
  Tag,
  Stethoscope,
  Sparkles,
  Eye,
  Settings2,
  Layers,
  FileSpreadsheet,
  Target,
  AlignLeft,
  ListChecks,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FolderTree,
} from 'lucide-react';
import {
  NoteTemplate,
  VariableField,
  CATEGORIES,
  PROCEDURE_CATEGORIES,
  isDefaultTemplateId,
  getInitialTemplateById,
} from '../data/templates';
import { compileNoteText, NoteFormatType } from '../utils/formatter';
import { ColorTheme, THEMES } from '../utils/theme';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: NoteTemplate | null; // null = create new template, object = edit existing template
  onSaveTemplate: (template: NoteTemplate) => void;
  onRestoreDefault?: (templateId: string) => void;
  colorTheme?: ColorTheme;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  template,
  onSaveTemplate,
  onRestoreDefault,
  colorTheme = 'blue',
}) => {
  const theme = THEMES[colorTheme];
  const isEditing = Boolean(template);
  const isDefault = template ? isDefaultTemplateId(template.id) : false;
  const isModified = template?.isModified ?? false;

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState<'details' | 'fields' | 'formats' | 'preview'>('details');

  // Active Format Sub-Tab in Formats Editor
  const [activeFormatSubTab, setActiveFormatSubTab] = useState<'concise' | 'dar' | 'soap' | 'narrative'>('concise');

  // Preview format selection
  const [previewFormat, setPreviewFormat] = useState<NoteFormatType>('concise');

  // Basic Details State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoteTemplate['category']>('routine');
  const [categoryLabel, setCategoryLabel] = useState('Routine & Assessments');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isProcedure, setIsProcedure] = useState(false);
  const [procedureCategory, setProcedureCategory] = useState<NoteTemplate['procedureCategory']>('vascular');
  const [procedureBadgesInput, setProcedureBadgesInput] = useState('');

  // Fields State
  const [fields, setFields] = useState<VariableField[]>([]);

  // Formats State
  const [conciseText, setConciseText] = useState('');
  const [darData, setDarData] = useState('');
  const [darAction, setDarAction] = useState('');
  const [darResponse, setDarResponse] = useState('');
  const [soapSubjective, setSoapSubjective] = useState('');
  const [soapObjective, setSoapObjective] = useState('');
  const [soapAssessment, setSoapAssessment] = useState('');
  const [soapPlan, setSoapPlan] = useState('');
  const [narrativeText, setNarrativeText] = useState('');

  // UI feedback & active field/textarea tracking
  const [activeTextareaId, setActiveTextareaId] = useState<string | null>(null);
  const [insertedVariableNotice, setInsertedVariableNotice] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newOptionInputs, setNewOptionInputs] = useState<Record<number, string>>({});

  // Reset or initialize state when template changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (template) {
      // Editing existing template
      setTitle(template.title);
      setCategory(template.category);
      setCategoryLabel(template.categoryLabel);
      setDescription(template.description);
      setTagsInput(template.tags ? template.tags.join(', ') : '');
      setIsProcedure(Boolean(template.isProcedure));
      setProcedureCategory(template.procedureCategory || 'vascular');
      setProcedureBadgesInput(template.procedureBadges ? template.procedureBadges.join(', ') : '');

      // Deep clone fields
      setFields(JSON.parse(JSON.stringify(template.fields || [])));

      // Formats
      setConciseText(template.formats.concise || '');
      setDarData(template.formats.dar?.data || '');
      setDarAction(template.formats.dar?.action || '');
      setDarResponse(template.formats.dar?.response || '');
      setSoapSubjective(template.formats.soap?.subjective || '');
      setSoapObjective(template.formats.soap?.objective || '');
      setSoapAssessment(template.formats.soap?.assessment || '');
      setSoapPlan(template.formats.soap?.plan || '');
      setNarrativeText(template.formats.narrative || '');
    } else {
      // Creating new template from scratch
      setTitle('');
      setCategory('routine');
      setCategoryLabel('Routine & Assessments');
      setDescription('');
      setTagsInput('bedside, assessment');
      setIsProcedure(false);
      setProcedureCategory('vascular');
      setProcedureBadgesInput('');

      setFields([
        { id: 'time', label: 'Time of Procedure / Care', defaultValue: '08:00', type: 'text' },
        {
          id: 'procedureDetails',
          label: 'Procedure or Clinical Care Completed',
          defaultValue: 'Clinical assessment and interventions executed according to unit protocol.',
          type: 'text',
        },
        {
          id: 'patientTolerance',
          label: 'Patient Tolerance & Hemodynamics',
          defaultValue: 'Patient remained calm, alert, and cooperative; vital signs remained at baseline throughout.',
          type: 'text',
          options: [
            'Patient remained calm, alert, and cooperative; vital signs remained at baseline throughout.',
            'Patient reported mild discomfort; comforted with repositioning and reassurance.',
            'Procedure tolerated well with zero adverse events or hemodynamics instability.',
          ],
        },
      ]);

      setConciseText('CLINICAL NOTE ({time}):\n• Care Performed: {procedureDetails}\n• Patient Response: {patientTolerance}');
      setDarData('Patient assessed at {time}. Baseline parameters verified.');
      setDarAction('{procedureDetails}. Standard safety protocols and aseptic technique maintained.');
      setDarResponse('{patientTolerance}. Ongoing plan of care continued.');
      setSoapSubjective('Patient reports comfortable baseline and agrees with plan of care.');
      setSoapObjective('At {time}: {procedureDetails}.');
      setSoapAssessment('Care completed successfully; patient parameters remain within expected clinical parameters.');
      setSoapPlan('Maintain scheduled monitoring protocol and document changes.');
      setNarrativeText('At {time}, responded to patient bedside. {procedureDetails}. {patientTolerance}. Standard safety protocol active.');
    }

    setActiveTab('details');
    setValidationError(null);
    setNewOptionInputs({});
  }, [isOpen, template]);

  if (!isOpen) return null;

  // Handle Category Change
  const handleCategoryChange = (newCat: NoteTemplate['category']) => {
    setCategory(newCat);
    const catObj = CATEGORIES.find((c) => c.id === newCat);
    if (catObj) {
      setCategoryLabel(catObj.label);
    }
  };

  // Field manipulation
  const handleAddField = () => {
    const nextIdx = fields.length + 1;
    const newId = `field_${nextIdx}`;
    setFields([
      ...fields,
      {
        id: newId,
        label: `Variable Field ${nextIdx}`,
        defaultValue: 'Normal finding',
        type: 'text',
        options: [],
      },
    ]);
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, key: keyof VariableField, val: any) => {
    const updated = [...fields];
    if (key === 'id') {
      // Clean up variable ID: letters, numbers, underscore only
      val = (val as string).replace(/[^a-zA-Z0-9_]/g, '');
    }
    updated[index] = { ...updated[index], [key]: val };
    setFields(updated);
  };

  // Options manipulation for select fields
  const handleAddOption = (fieldIdx: number) => {
    const optVal = (newOptionInputs[fieldIdx] || '').trim();
    if (!optVal) return;

    const updated = [...fields];
    const currentOptions = updated[fieldIdx].options ? [...updated[fieldIdx].options!] : [];
    if (!currentOptions.includes(optVal)) {
      currentOptions.push(optVal);
      updated[fieldIdx].options = currentOptions;
      setFields(updated);
    }
    setNewOptionInputs({ ...newOptionInputs, [fieldIdx]: '' });
  };

  const handleRemoveOption = (fieldIdx: number, optionIdx: number) => {
    const updated = [...fields];
    if (updated[fieldIdx].options) {
      updated[fieldIdx].options = updated[fieldIdx].options!.filter((_, i) => i !== optionIdx);
      setFields(updated);
    }
  };

  // Insert variable into active textarea
  const handleInsertVariable = (fieldId: string) => {
    const varTag = `{${fieldId}}`;
    const targetId = activeTextareaId || 'conciseText';
    const element = document.getElementById(targetId) as HTMLTextAreaElement | null;

    if (element) {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      const currentVal = element.value;
      const updatedVal = currentVal.substring(0, start) + varTag + currentVal.substring(end);

      // Update appropriate state
      if (targetId === 'conciseText') setConciseText(updatedVal);
      else if (targetId === 'darData') setDarData(updatedVal);
      else if (targetId === 'darAction') setDarAction(updatedVal);
      else if (targetId === 'darResponse') setDarResponse(updatedVal);
      else if (targetId === 'soapSubjective') setSoapSubjective(updatedVal);
      else if (targetId === 'soapObjective') setSoapObjective(updatedVal);
      else if (targetId === 'soapAssessment') setSoapAssessment(updatedVal);
      else if (targetId === 'soapPlan') setSoapPlan(updatedVal);
      else if (targetId === 'narrativeText') setNarrativeText(updatedVal);

      // Restore focus and cursor position after insert
      setTimeout(() => {
        element.focus();
        element.setSelectionRange(start + varTag.length, start + varTag.length);
      }, 0);
    } else {
      // Fallback
      if (activeFormatSubTab === 'concise') setConciseText((prev) => `${prev} ${varTag}`);
      else if (activeFormatSubTab === 'dar') setDarAction((prev) => `${prev} ${varTag}`);
      else if (activeFormatSubTab === 'soap') setSoapObjective((prev) => `${prev} ${varTag}`);
      else if (activeFormatSubTab === 'narrative') setNarrativeText((prev) => `${prev} ${varTag}`);
    }

    setInsertedVariableNotice(`Inserted {${fieldId}}`);
    setTimeout(() => setInsertedVariableNotice(null), 1800);
  };

  // Restore to system default
  const handleRestoreToFactory = () => {
    if (!template || !isDefault) return;
    const pristine = getInitialTemplateById(template.id);
    if (!pristine) return;

    if (confirm(`Reset "${template.title}" back to the original hospital system default? All your custom modifications to this template will be reverted.`)) {
      if (onRestoreDefault) {
        onRestoreDefault(template.id);
      }
      onClose();
    }
  };

  // Compile active draft template for preview
  const draftTemplate: NoteTemplate = {
    id: template ? template.id : `custom_${Date.now()}`,
    title: title.trim() || 'Untitled Note Template',
    category,
    categoryLabel,
    description: description.trim() || 'Custom nursing template.',
    tags: tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    isCustom: template ? template.isCustom : true,
    isModified: isDefault ? true : template?.isModified,
    isProcedure,
    procedureCategory: isProcedure ? procedureCategory : undefined,
    procedureCategoryLabel: isProcedure
      ? PROCEDURE_CATEGORIES.find((p) => p.id === procedureCategory)?.label
      : undefined,
    procedureBadges: procedureBadgesInput
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean),
    fields: fields.filter((f) => f.id.trim() !== ''),
    formats: {
      concise: conciseText,
      dar: {
        data: darData,
        action: darAction,
        response: darResponse,
      },
      soap: {
        subjective: soapSubjective,
        objective: soapObjective,
        assessment: soapAssessment,
        plan: soapPlan,
      },
      narrative: narrativeText,
    },
  };

  // Default field values for preview compilation
  const previewFieldValues: Record<string, string> = {};
  fields.forEach((f) => {
    previewFieldValues[f.id] = f.defaultValue || `[${f.label}]`;
  });

  const previewCompiledText = compileNoteText(draftTemplate, previewFieldValues, previewFormat);

  // Submit and save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Template title is required.');
      setActiveTab('details');
      return;
    }

    // Validate fields have IDs
    const emptyField = fields.find((f) => !f.id.trim());
    if (emptyField) {
      setValidationError('All variable fields must have a unique identifier (ID).');
      setActiveTab('fields');
      return;
    }

    // Check duplicate field IDs
    const fieldIds = fields.map((f) => f.id.trim().toLowerCase());
    const hasDuplicates = new Set(fieldIds).size !== fieldIds.length;
    if (hasDuplicates) {
      setValidationError('Variable field IDs must be unique.');
      setActiveTab('fields');
      return;
    }

    // Ensure at least one format is filled
    if (!conciseText.trim() && !darData.trim() && !soapObjective.trim() && !narrativeText.trim()) {
      setValidationError('Please configure at least one format template (Concise, DAR, SOAP, or Narrative).');
      setActiveTab('formats');
      return;
    }

    // Complete saving
    onSaveTemplate(draftTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] sm:max-h-[94vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDefault ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isDefault ? <Settings2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {isEditing ? `Edit Template: ${template?.title}` : 'Create Custom Note Template'}
                </h2>
                {isDefault && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/60">
                    System Default
                  </span>
                )}
                {isModified && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-700/60">
                    Customized
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isDefault
                  ? 'Customize phrasing, default values, and formats. You can restore hospital defaults anytime.'
                  : 'Design custom documentation templates tailored for your clinical specialty or unit.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDefault && isModified && onRestoreDefault && (
              <button
                type="button"
                onClick={handleRestoreToFactory}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 border border-amber-300/70 dark:border-amber-700/60 rounded-md transition-colors"
                title="Revert this template back to factory hospital standard"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Default</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 py-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-blue-500" />
              <span>1. Basic Info & Category</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeTab === 'fields'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>2. Variable Fields ({fields.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('formats')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeTab === 'formats'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-500" />
              <span>3. Format Phrasing (DAR, SOAP, Concise)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>4. Live EHR Preview</span>
            </button>
          </div>

          {insertedVariableNotice && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              <span>{insertedVariableNotice}</span>
            </div>
          )}
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-rose-50 dark:bg-rose-950/70 border-b border-rose-200 dark:border-rose-900 px-5 py-2 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button
              onClick={() => setValidationError(null)}
              className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: BASIC INFO & CATEGORY */}
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Template Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Transesophageal ECHO (TEE) Assist or Wound Debridement Note"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Clinical Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="routine">Routine & Assessments</option>
                    <option value="vascular">Vascular & Infusions</option>
                    <option value="wound">Wound & Skin Care</option>
                    <option value="respiratory">Respiratory & Suctioning</option>
                    <option value="gigu">GI & Genitourinary</option>
                    <option value="emergency">Situational & Emergent</option>
                    <option value="custom">My Custom Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bedside Procedure Classification
                  </label>
                  <div className="flex items-center gap-3 pt-1.5">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200">
                      <input
                        type="checkbox"
                        checked={isProcedure}
                        onChange={(e) => setIsProcedure(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Mark as Bedside Clinical Procedure</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Procedure Details (when isProcedure is true) */}
              {isProcedure && (
                <div className="p-3.5 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-teal-900 dark:text-teal-200 mb-1">
                      Procedure Category Group
                    </label>
                    <select
                      value={procedureCategory}
                      onChange={(e) => setProcedureCategory(e.target.value as any)}
                      className="w-full text-xs px-3 py-1.5 border border-teal-300 dark:border-teal-700 rounded-lg focus:outline-none focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="vascular">Vascular Access & Infusion Procedures</option>
                      <option value="respiratory">Airway, Suctioning & Pleural</option>
                      <option value="gigu">GI, Enteral & Genitourinary</option>
                      <option value="wound">Wound, Packing & Drain Procedures</option>
                      <option value="periop">Perioperative & PACU Recovery</option>
                      <option value="emergency">Emergency & Resuscitation (ACLS)</option>
                      <option value="bedside">Bedside Invasive Procedure Assist</option>
                      <option value="cardiac">Cardiac & Interventional Procedures</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-teal-900 dark:text-teal-200 mb-1">
                      Procedure Badges (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sterile, ACLS, Time-Out, 5-Lead Telemetry"
                      value={procedureBadgesInput}
                      onChange={(e) => setProcedureBadgesInput(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Description & Usage Guidelines
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide a concise summary of when nurses should chart with this template..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Search Tags & Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. cardioversion, shock, sedation, pacing, rhythm"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('fields')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  Continue to Variable Fields →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VARIABLE FIELDS */}
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200/70 dark:border-blue-800/60 text-xs">
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-200">
                    Template Variable Inputs ({fields.length})
                  </h4>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Each field creates an interactive input control in Note Studio. Reference them in format texts using{' '}
                    <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">{'{fieldId}'}</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shrink-0 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variable Field</span>
                </button>
              </div>

              {/* Field Cards */}
              <div className="space-y-3">
                {fields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-750 space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                          {`{${field.id || 'id'}}`}
                        </span>
                      </div>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField(idx)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md transition-colors"
                          title="Remove this variable field"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Variable ID (alphanumeric)
                        </label>
                        <input
                          type="text"
                          required
                          value={field.id}
                          onChange={(e) => handleUpdateField(idx, 'id', e.target.value)}
                          placeholder="e.g. pulseOx"
                          className="w-full text-xs font-mono px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Display Label in Studio
                        </label>
                        <input
                          type="text"
                          required
                          value={field.label}
                          onChange={(e) => handleUpdateField(idx, 'label', e.target.value)}
                          placeholder="e.g. Oxygen Saturation & Delivery"
                          className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-blue-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Default Initial Value
                      </label>
                      <textarea
                        rows={2}
                        value={field.defaultValue}
                        onChange={(e) => handleUpdateField(idx, 'defaultValue', e.target.value)}
                        placeholder="Default text populated when selecting this template..."
                        className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Pre-configured Dropdown Options */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Dropdown Options for Quick Selection ({(field.options || []).length})
                        </span>
                      </div>

                      {field.options && field.options.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {field.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className="flex items-center justify-between gap-2 p-1.5 text-xs bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                            >
                              <span className="truncate text-slate-800 dark:text-slate-200 text-[11px]">{opt}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(idx, optIdx)}
                                className="text-slate-400 hover:text-rose-500 shrink-0 p-0.5"
                                title="Remove option"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Type an alternative clinical option and press Add..."
                          value={newOptionInputs[idx] || ''}
                          onChange={(e) => setNewOptionInputs({ ...newOptionInputs, [idx]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOption(idx);
                            }
                          }}
                          className="flex-1 text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddOption(idx)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('formats')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  Continue to Format Phrasing →
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FORMAT TEMPLATES (CONCISE, DAR, SOAP, NARRATIVE) */}
          {activeTab === 'formats' && (
            <div className="space-y-4">
              {/* Variable Quick-Insert Toolbar */}
              <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3 text-blue-500" />
                    <span>Click to Insert Variable Tag at Cursor:</span>
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    Auto-inserts into active textarea
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
                  {fields.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleInsertVariable(f.id)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
                      title={`Insert {${f.id}} (${f.label})`}
                    >
                      <span>{`{${f.id}}`}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Tabs for the 4 Formats */}
              <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveFormatSubTab('concise')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activeFormatSubTab === 'concise'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Concise EHR (SmartPhrase)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormatSubTab('dar')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activeFormatSubTab === 'dar'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>DAR (Focus)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormatSubTab('soap')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activeFormatSubTab === 'soap'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>SOAP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormatSubTab('narrative')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
                    activeFormatSubTab === 'narrative'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Narrative Prose</span>
                </button>
              </div>

              {/* Sub-Tab 1: Concise Format */}
              {activeFormatSubTab === 'concise' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Concise EHR Bulleted Note Template
                    </label>
                    <span className="text-[11px] text-slate-400">Bulleted, high-density EHR format</span>
                  </div>
                  <textarea
                    id="conciseText"
                    rows={8}
                    value={conciseText}
                    onFocus={() => setActiveTextareaId('conciseText')}
                    onChange={(e) => setConciseText(e.target.value)}
                    placeholder="e.g. PROCEDURE NOTE ({time}):\n• Procedure: {procedure}\n• Pre-Rhythm: {preRhythm}\n• Tolerance: {tolerance}"
                    className="w-full text-xs font-mono p-3 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed shadow-inner"
                  />
                </div>
              )}

              {/* Sub-Tab 2: DAR Format */}
              {activeFormatSubTab === 'dar' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Data (D) - Subjective & Objective Assessment
                    </label>
                    <textarea
                      id="darData"
                      rows={3}
                      value={darData}
                      onFocus={() => setActiveTextareaId('darData')}
                      onChange={(e) => setDarData(e.target.value)}
                      placeholder="Clinical situation and baseline data before action..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Action (A) - Nursing & Collaborative Interventions
                    </label>
                    <textarea
                      id="darAction"
                      rows={3}
                      value={darAction}
                      onFocus={() => setActiveTextareaId('darAction')}
                      onChange={(e) => setDarAction(e.target.value)}
                      placeholder="Nursing interventions, procedure steps, sterile technique, medications..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Response (R) - Patient Reaction & Evaluation
                    </label>
                    <textarea
                      id="darResponse"
                      rows={3}
                      value={darResponse}
                      onFocus={() => setActiveTextareaId('darResponse')}
                      onChange={(e) => setDarResponse(e.target.value)}
                      placeholder="Post-procedure patient status, vitals, tolerance, site condition..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Tab 3: SOAP Format */}
              {activeFormatSubTab === 'soap' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Subjective (S)
                    </label>
                    <textarea
                      id="soapSubjective"
                      rows={3}
                      value={soapSubjective}
                      onFocus={() => setActiveTextareaId('soapSubjective')}
                      onChange={(e) => setSoapSubjective(e.target.value)}
                      placeholder="Patient statements, symptoms, reported pain..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Objective (O)
                    </label>
                    <textarea
                      id="soapObjective"
                      rows={3}
                      value={soapObjective}
                      onFocus={() => setActiveTextareaId('soapObjective')}
                      onChange={(e) => setSoapObjective(e.target.value)}
                      placeholder="Vital signs, lab values, wound measurements, procedure details..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Assessment (A)
                    </label>
                    <textarea
                      id="soapAssessment"
                      rows={3}
                      value={soapAssessment}
                      onFocus={() => setActiveTextareaId('soapAssessment')}
                      onChange={(e) => setSoapAssessment(e.target.value)}
                      placeholder="Nursing assessment, response to therapy, stability..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Plan (P)
                    </label>
                    <textarea
                      id="soapPlan"
                      rows={3}
                      value={soapPlan}
                      onFocus={() => setActiveTextareaId('soapPlan')}
                      onChange={(e) => setSoapPlan(e.target.value)}
                      placeholder="Continued care plan, dressing change schedule, physician notifications..."
                      className="w-full text-xs font-mono p-2.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Sub-Tab 4: Narrative Format */}
              {activeFormatSubTab === 'narrative' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Chronological Narrative Prose
                    </label>
                    <span className="text-[11px] text-slate-400">Continuous clinical paragraph</span>
                  </div>
                  <textarea
                    id="narrativeText"
                    rows={8}
                    value={narrativeText}
                    onFocus={() => setActiveTextareaId('narrativeText')}
                    onChange={(e) => setNarrativeText(e.target.value)}
                    placeholder="At {time}, bedside care performed. {procedureDetails}. {patientTolerance}..."
                    className="w-full text-xs font-mono p-3 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:border-blue-500 leading-relaxed shadow-inner"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('fields')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  ← Back to Fields
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                >
                  Preview Output in EHR →
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Live EHR Note Simulation
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Inspecting compiled output with current variable default values.
                  </p>
                </div>

                {/* Format switcher in preview */}
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewFormat('concise')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      previewFormat === 'concise'
                        ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Concise
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFormat('dar')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      previewFormat === 'dar'
                        ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    DAR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFormat('soap')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      previewFormat === 'soap'
                        ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    SOAP
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewFormat('narrative')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      previewFormat === 'narrative'
                        ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Narrative
                  </button>
                </div>
              </div>

              {/* Note Preview Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap select-all shadow-inner max-h-80 overflow-y-auto">
                {previewCompiledText || (
                  <span className="text-slate-400 italic">
                    Note format is currently empty. Switch back to tab 3 to add template text.
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>
                  Length: <strong>{previewCompiledText.split(/\s+/).filter(Boolean).length}</strong> words ·{' '}
                  <strong>{previewCompiledText.length}</strong> characters
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Ready for Epic / Cerner / Meditech clipboard paste
                </span>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div>
              {isDefault && isModified && onRestoreDefault && (
                <button
                  type="button"
                  onClick={handleRestoreToFactory}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors border border-amber-300 dark:border-amber-800/60"
                  title="Revert all customizations back to factory standard"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Default</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{isEditing ? 'Save Template Changes' : 'Create Note Template'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
