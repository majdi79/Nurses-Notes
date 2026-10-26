import React, { useState } from 'react';
import { Bed, Plus, Edit2, Check, X, User } from 'lucide-react';
import { NoteFormatType } from '../utils/formatter';
import { ColorTheme, THEMES } from '../utils/theme';

export interface PatientSlot {
  id: string;
  bedLabel: string;
  templateId: string;
  fieldValues: Record<string, string>;
  manualText: string | null;
  format: NoteFormatType;
  lastUpdated: number;
}

interface PatientWorklistBarProps {
  slots: PatientSlot[];
  activeSlotId: string;
  onSelectSlot: (slotId: string) => void;
  onAddSlot: () => void;
  onRemoveSlot: (slotId: string) => void;
  onRenameSlot: (slotId: string, newLabel: string) => void;
  colorTheme?: ColorTheme;
}

export const PatientWorklistBar: React.FC<PatientWorklistBarProps> = ({
  slots,
  activeSlotId,
  onSelectSlot,
  onAddSlot,
  onRemoveSlot,
  onRenameSlot,
  colorTheme = 'blue',
}) => {
  const theme = THEMES[colorTheme];
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const handleStartRename = (slot: PatientSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSlotId(slot.id);
    setEditingLabel(slot.bedLabel);
  };

  const handleSaveRename = (slotId: string) => {
    if (editingLabel.trim()) {
      onRenameSlot(slotId, editingLabel.trim());
    }
    setEditingSlotId(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none transition-colors">
      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1 shrink-0">
        <Bed className="w-3.5 h-3.5 text-blue-500" />
        <span className="hidden sm:inline">Shift Patients:</span>
      </div>

      <div className="flex items-center gap-1.5 min-w-0">
        {slots.map((slot) => {
          const isActive = slot.id === activeSlotId;
          const isEditing = editingSlotId === slot.id;
          const hasDraft = slot.manualText !== null && slot.manualText.trim().length > 0;

          return (
            <div
              key={slot.id}
              onClick={() => onSelectSlot(slot.id)}
              className={`group flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer border transition-all whitespace-nowrap shrink-0 shadow-2xs ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-blue-500/80 dark:border-blue-500 ring-1 ring-blue-500/20'
                  : 'bg-white/80 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEditing ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveRename(slot.id);
                      if (e.key === 'Escape') setEditingSlotId(null);
                    }}
                    autoFocus
                    className="w-20 px-1 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 border border-blue-500 rounded text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveRename(slot.id)}
                    className="text-emerald-600 hover:text-emerald-700 p-0.5"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSlotId(null)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <User className={`w-3 h-3 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                    <span className="truncate max-w-[100px]">{slot.bedLabel}</span>
                    {hasDraft && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Has active draft" />
                    )}
                  </div>

                  {/* Inline Action Icons */}
                  <div className="flex items-center gap-0.5 ml-1 opacity-70 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(slot, e)}
                      className="p-0.5 hover:text-blue-500 rounded"
                      title="Rename room/bed label"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    {slots.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${slot.bedLabel}" from active shift list?`)) {
                            onRemoveSlot(slot.id);
                          }
                        }}
                        className="p-0.5 hover:text-rose-500 rounded"
                        title="Remove patient slot"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {slots.length < 8 && (
          <button
            type="button"
            onClick={onAddSlot}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            title="Add another patient / bed slot for this shift"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">Add Bed</span>
          </button>
        )}
      </div>
    </div>
  );
};
