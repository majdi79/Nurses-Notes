import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Calculator,
  HeartPulse,
  Flame,
  Droplets,
  Scale,
  Check,
  Plus,
  Syringe,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  Info,
  Printer,
  FileCheck2,
  Copy,
  Table,
  CheckCircle2,
  Sliders,
  FileText,
  Layers,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  calculateMAP,
  convertTemp,
  calculateIVDripRate,
  convertWeight,
  calculateInfusionRate,
  calculateDoseFromRate,
  calculateIVPushVolume,
  calculateIntermittentIVPBRate,
  generateTitrationLadder,
  formatPrintReadyAdminSheetText,
  formatMultiDrugPrintReadyAdminSheetText,
  STANDARD_IV_DRUG_PRESETS,
  IVDrugPreset,
  DrugMassUnit,
  InfusionDoseRateUnit,
  SelectedIVDrugItem,
} from '../utils/clinicalCalc';
import { ColorTheme, THEMES } from '../utils/theme';

interface ClinicalCalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet: (snippet: string) => void;
  colorTheme?: ColorTheme;
  activeBedLabel?: string;
}

export const ClinicalCalculatorsModal: React.FC<ClinicalCalculatorsModalProps> = ({
  isOpen,
  onClose,
  onInsertSnippet,
  colorTheme = 'blue',
  activeBedLabel = 'Bed 301',
}) => {
  const theme = THEMES[colorTheme];
  const [activeTab, setActiveTab] = useState<'iv_drug' | 'map' | 'drip' | 'temp' | 'weight'>('iv_drug');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // =========================================================================
  // IV DRUG CALCULATOR STATE
  // =========================================================================
  const [ivDrugSubMode, setIvDrugSubMode] = useState<'titration_ladder' | 'infusion' | 'push' | 'reverse' | 'ivpb'>('titration_ladder');

  // Multi-Drug Selection State for Single-Sheet A4 Printing
  const [selectedDrugs, setSelectedDrugs] = useState<SelectedIVDrugItem[]>([
    {
      id: 'init_norepinephrine',
      presetId: 'norepinephrine',
      drugName: 'Norepinephrine (Levophed)',
      drugAmount: 4,
      drugUnit: 'mg',
      bagVolumeMl: 250,
      diluent: 'D5W',
      minDose: 0.02,
      maxDose: 0.30,
      stepDose: 0.02,
      doseUnit: 'mcg/kg/min',
      titrationGoal: 'Titrate q2-5m by 0.02 mcg/kg/min to maintain MAP ≥ 65 mmHg',
      routeLine: 'Dedicated Central Venous Catheter lumen preferred',
      isHighAlert: true,
    },
  ]);
  const [activeDrugIndex, setActiveDrugIndex] = useState<number>(0);

  // Selected drug preset or custom for single-dose mode
  const [selectedPresetId, setSelectedPresetId] = useState<string>('norepinephrine');
  const [drugName, setDrugName] = useState('Norepinephrine (Levophed)');
  const [drugAmount, setDrugAmount] = useState('4');
  const [drugUnit, setDrugUnit] = useState<DrugMassUnit>('mg');
  const [bagVolumeMl, setBagVolumeMl] = useState('250');
  const [diluentName, setDiluentName] = useState('D5W');
  const [desiredDose, setDesiredDose] = useState('0.08');
  const [doseUnit, setDoseUnit] = useState<InfusionDoseRateUnit>('mcg/kg/min');
  const [patientWeightKg, setPatientWeightKg] = useState('50');
  const [isHighAlert, setIsHighAlert] = useState(true);
  const [includeDualRN, setIncludeDualRN] = useState(true);

  // Patient & Display Metadata
  const [patientName, setPatientName] = useState('Patient Name');
  const [patientCpr, setPatientCpr] = useState('');
  const [patientBed, setPatientBed] = useState(activeBedLabel || 'Bed 301');
  const [showPaperPreview, setShowPaperPreview] = useState(false);
  const [copiedTableToast, setCopiedTableToast] = useState<string | null>(null);

  // Sheet Mode: ICU Master (10-drug layout as per attached picture) vs Selected Patient Infusions
  const [sheetPrintMode, setSheetPrintMode] = useState<'icu_master' | 'selected_only'>('icu_master');

  // Master Sheet Drug Amounts & Volumes (matching screenshot defaults with 100% dynamic calculations)
  const [masterNorAmount, setMasterNorAmount] = useState('16');
  const [masterNorVol, setMasterNorVol] = useState('50');
  const [masterEpiAmount, setMasterEpiAmount] = useState('10');
  const [masterEpiVol, setMasterEpiVol] = useState('50');
  const [masterDopaAmount, setMasterDopaAmount] = useState('800');
  const [masterDopaVol, setMasterDopaVol] = useState('250');
  const [masterDobuAmount, setMasterDobuAmount] = useState('1000');
  const [masterDobuVol, setMasterDobuVol] = useState('500');
  const [masterNtgAmount, setMasterNtgAmount] = useState('50');
  const [masterNtgVol, setMasterNtgVol] = useState('500');
  const [masterLabAmount, setMasterLabAmount] = useState('200');
  const [masterLabVol, setMasterLabVol] = useState('200');
  const [masterRemiAmount, setMasterRemiAmount] = useState('15');
  const [masterRemiVol, setMasterRemiVol] = useState('60');
  const [masterNimbexAmount, setMasterNimbexAmount] = useState('100');
  const [masterNimbexVol, setMasterNimbexVol] = useState('100');
  const [masterHepAmount, setMasterHepAmount] = useState('25000');
  const [masterHepVol, setMasterHepVol] = useState('50');
  const [showMasterConfigTuner, setShowMasterConfigTuner] = useState(false);

  // Active drug helper
  const activeDrug = selectedDrugs[activeDrugIndex] || selectedDrugs[0];

  const updateActiveDrug = (updates: Partial<SelectedIVDrugItem>) => {
    setSelectedDrugs((prev) =>
      prev.map((d, i) => (i === activeDrugIndex ? { ...d, ...updates } : d))
    );
  };

  const handleTogglePreset = (preset: IVDrugPreset) => {
    const existingIndex = selectedDrugs.findIndex((d) => d.presetId === preset.id);
    if (existingIndex >= 0) {
      if (selectedDrugs.length > 1) {
        const next = selectedDrugs.filter((_, i) => i !== existingIndex);
        setSelectedDrugs(next);
        setActiveDrugIndex(0);
        setCopiedTableToast(`Removed ${preset.name.split(' ')[0]} from A4 sheet (${next.length} remaining)`);
        setTimeout(() => setCopiedTableToast(null), 2000);
      } else {
        setActiveDrugIndex(0);
      }
    } else {
      if (selectedDrugs.length >= 4) {
        setCopiedTableToast('Note: 4 infusions maximum recommended to fit cleanly on one A4 sheet.');
        setTimeout(() => setCopiedTableToast(null), 3000);
      }
      const newDrug: SelectedIVDrugItem = {
        id: `drug_${preset.id}_${Date.now()}`,
        presetId: preset.id,
        drugName: preset.name,
        drugAmount: preset.defaultDrugAmount,
        drugUnit: preset.drugUnit,
        bagVolumeMl: preset.defaultBagVolumeMl,
        diluent: preset.diluent,
        minDose: preset.defaultMinDose,
        maxDose: preset.defaultMaxDose,
        stepDose: preset.defaultStep,
        doseUnit: preset.doseUnit,
        titrationGoal: preset.titrationGoal,
        routeLine: preset.routeLine,
        isHighAlert: preset.isHighAlert,
      };
      const next = [...selectedDrugs, newDrug];
      setSelectedDrugs(next);
      setActiveDrugIndex(next.length - 1);
      setCopiedTableToast(`Added ${preset.name.split(' ')[0]} to A4 sheet (${next.length} total)`);
      setTimeout(() => setCopiedTableToast(null), 2000);
    }
  };

  const handleApplyICUPack = (packType: 'septic' | 'sedation' | 'cardiac' | 'reset') => {
    if (packType === 'reset') {
      const p = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'norepinephrine')!;
      setSelectedDrugs([
        {
          id: `drug_${p.id}_${Date.now()}`,
          presetId: p.id,
          drugName: p.name,
          drugAmount: p.defaultDrugAmount,
          drugUnit: p.drugUnit,
          bagVolumeMl: p.defaultBagVolumeMl,
          diluent: p.diluent,
          minDose: p.defaultMinDose,
          maxDose: p.defaultMaxDose,
          stepDose: p.defaultStep,
          doseUnit: p.doseUnit,
          titrationGoal: p.titrationGoal,
          routeLine: p.routeLine,
          isHighAlert: p.isHighAlert,
        },
      ]);
      setActiveDrugIndex(0);
      setCopiedTableToast('Reset to single Norepinephrine infusion');
      setTimeout(() => setCopiedTableToast(null), 2000);
    } else if (packType === 'septic') {
      const p1 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'norepinephrine')!;
      const p2 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'vasopressin')!;
      setSelectedDrugs([
        {
          id: `drug_${p1.id}_${Date.now()}`,
          presetId: p1.id,
          drugName: p1.name,
          drugAmount: p1.defaultDrugAmount,
          drugUnit: p1.drugUnit,
          bagVolumeMl: p1.defaultBagVolumeMl,
          diluent: p1.diluent,
          minDose: p1.defaultMinDose,
          maxDose: p1.defaultMaxDose,
          stepDose: p1.defaultStep,
          doseUnit: p1.doseUnit,
          titrationGoal: p1.titrationGoal,
          routeLine: p1.routeLine,
          isHighAlert: p1.isHighAlert,
        },
        {
          id: `drug_${p2.id}_${Date.now() + 1}`,
          presetId: p2.id,
          drugName: p2.name,
          drugAmount: p2.defaultDrugAmount,
          drugUnit: p2.drugUnit,
          bagVolumeMl: p2.defaultBagVolumeMl,
          diluent: p2.diluent,
          minDose: p2.defaultMinDose,
          maxDose: p2.defaultMaxDose,
          stepDose: p2.defaultStep,
          doseUnit: p2.doseUnit,
          titrationGoal: p2.titrationGoal,
          routeLine: p2.routeLine,
          isHighAlert: p2.isHighAlert,
        },
      ]);
      setActiveDrugIndex(0);
      setCopiedTableToast('Loaded Septic Shock Pack (Levophed + Vasopressin) on A4 Sheet');
      setTimeout(() => setCopiedTableToast(null), 2200);
    } else if (packType === 'sedation') {
      const p1 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'propofol')!;
      const p2 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'norepinephrine')!;
      setSelectedDrugs([
        {
          id: `drug_${p1.id}_${Date.now()}`,
          presetId: p1.id,
          drugName: p1.name,
          drugAmount: p1.defaultDrugAmount,
          drugUnit: p1.drugUnit,
          bagVolumeMl: p1.defaultBagVolumeMl,
          diluent: p1.diluent,
          minDose: p1.defaultMinDose,
          maxDose: p1.defaultMaxDose,
          stepDose: p1.defaultStep,
          doseUnit: p1.doseUnit,
          titrationGoal: p1.titrationGoal,
          routeLine: p1.routeLine,
          isHighAlert: p1.isHighAlert,
        },
        {
          id: `drug_${p2.id}_${Date.now() + 1}`,
          presetId: p2.id,
          drugName: p2.name,
          drugAmount: p2.defaultDrugAmount,
          drugUnit: p2.drugUnit,
          bagVolumeMl: p2.defaultBagVolumeMl,
          diluent: p2.diluent,
          minDose: p2.defaultMinDose,
          maxDose: p2.defaultMaxDose,
          stepDose: p2.defaultStep,
          doseUnit: p2.doseUnit,
          titrationGoal: p2.titrationGoal,
          routeLine: p2.routeLine,
          isHighAlert: p2.isHighAlert,
        },
      ]);
      setActiveDrugIndex(0);
      setCopiedTableToast('Loaded Sedation & Hemodynamic Pack (Propofol + Levophed) on A4 Sheet');
      setTimeout(() => setCopiedTableToast(null), 2200);
    } else if (packType === 'cardiac') {
      const p1 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'norepinephrine')!;
      const p2 = STANDARD_IV_DRUG_PRESETS.find((x) => x.id === 'dobutamine')!;
      setSelectedDrugs([
        {
          id: `drug_${p1.id}_${Date.now()}`,
          presetId: p1.id,
          drugName: p1.name,
          drugAmount: p1.defaultDrugAmount,
          drugUnit: p1.drugUnit,
          bagVolumeMl: p1.defaultBagVolumeMl,
          diluent: p1.diluent,
          minDose: p1.defaultMinDose,
          maxDose: p1.defaultMaxDose,
          stepDose: p1.defaultStep,
          doseUnit: p1.doseUnit,
          titrationGoal: p1.titrationGoal,
          routeLine: p1.routeLine,
          isHighAlert: p1.isHighAlert,
        },
        {
          id: `drug_${p2.id}_${Date.now() + 1}`,
          presetId: p2.id,
          drugName: p2.name,
          drugAmount: p2.defaultDrugAmount,
          drugUnit: p2.drugUnit,
          bagVolumeMl: p2.defaultBagVolumeMl,
          diluent: p2.diluent,
          minDose: p2.defaultMinDose,
          maxDose: p2.defaultMaxDose,
          stepDose: p2.defaultStep,
          doseUnit: p2.doseUnit,
          titrationGoal: p2.titrationGoal,
          routeLine: p2.routeLine,
          isHighAlert: p2.isHighAlert,
        },
      ]);
      setActiveDrugIndex(0);
      setCopiedTableToast('Loaded Inotrope / Cardiac Pack (Levophed + Dobutamine) on A4 Sheet');
      setTimeout(() => setCopiedTableToast(null), 2200);
    }
  };

  const handleAddCustomDrug = () => {
    const newDrug: SelectedIVDrugItem = {
      id: `custom_${Date.now()}`,
      drugName: 'Custom Infusion',
      drugAmount: 100,
      drugUnit: 'mg',
      bagVolumeMl: 250,
      diluent: '0.9% NS',
      minDose: 1,
      maxDose: 10,
      stepDose: 1,
      doseUnit: 'mg/hr',
      titrationGoal: 'Titrate to clinical objective per order',
      routeLine: 'Dedicated IV line',
      isHighAlert: false,
    };
    const next = [...selectedDrugs, newDrug];
    setSelectedDrugs(next);
    setActiveDrugIndex(next.length - 1);
  };

  const handleRemoveDrug = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedDrugs.length <= 1) return;
    const next = selectedDrugs.filter((d) => d.id !== id);
    setSelectedDrugs(next);
    setActiveDrugIndex(0);
  };

  // Reverse Calculator State (mL/hr -> Dose)
  const [reverseRateMlHr, setReverseRateMlHr] = useState('15');

  // IV Push State
  const [pushDrugName, setPushDrugName] = useState('Morphine Sulfate');
  const [pushDesiredDose, setPushDesiredDose] = useState('4');
  const [pushDoseOnHand, setPushDoseOnHand] = useState('10');
  const [pushDoseUnit, setPushDoseUnit] = useState('mg');
  const [pushVolumeOnHandMl, setPushVolumeOnHandMl] = useState('1');
  const [pushAdminTime, setPushAdminTime] = useState('2 minutes');

  // Intermittent IVPB State
  const [ivpbDrugName, setIvpbDrugName] = useState('Vancomycin');
  const [ivpbDose, setIvpbDose] = useState('1000 mg');
  const [ivpbBagVolumeMl, setIvpbBagVolumeMl] = useState('250');
  const [ivpbMinutes, setIvpbMinutes] = useState('60');

  // =========================================================================
  // OTHER CALCULATORS STATE
  // =========================================================================
  // MAP State
  const [sbp, setSbp] = useState('118');
  const [dbp, setDbp] = useState('74');

  // Temp State
  const [tempVal, setTempVal] = useState('38.2');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  // IV Drip State
  const [volumeMl, setVolumeMl] = useState('1000');
  const [hours, setHours] = useState('8');
  const [dropFactor, setDropFactor] = useState('15');

  // Weight State
  const [weightVal, setWeightVal] = useState('165');
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');

  if (!isOpen) return null;

  // Handlers for single-infusion preset selection
  const handleSelectPreset = (preset: IVDrugPreset) => {
    setSelectedPresetId(preset.id);
    setDrugName(preset.name);
    setDrugAmount(String(preset.defaultDrugAmount));
    setDrugUnit(preset.drugUnit);
    setBagVolumeMl(String(preset.defaultBagVolumeMl));
    setDiluentName(preset.diluent);
    setDesiredDose(String(preset.defaultDesiredDose));
    setDoseUnit(preset.doseUnit);
    setIsHighAlert(preset.isHighAlert);
  };

  // Calculations
  const infusionResult = calculateInfusionRate({
    drugAmount: parseFloat(drugAmount),
    drugUnit,
    bagVolumeMl: parseFloat(bagVolumeMl),
    desiredDose: parseFloat(desiredDose),
    doseUnit,
    patientWeightKg: parseFloat(patientWeightKg),
  });

  const reverseDoseResult = calculateDoseFromRate({
    drugAmount: parseFloat(drugAmount),
    drugUnit,
    bagVolumeMl: parseFloat(bagVolumeMl),
    rateMlHr: parseFloat(reverseRateMlHr),
    doseUnit,
    patientWeightKg: parseFloat(patientWeightKg),
  });

  const ivPushResult = calculateIVPushVolume({
    desiredDose: parseFloat(pushDesiredDose),
    doseOnHand: parseFloat(pushDoseOnHand),
    volumeOnHandMl: parseFloat(pushVolumeOnHandMl),
  });

  const ivpbRateResult = calculateIntermittentIVPBRate(
    parseFloat(ivpbBagVolumeMl),
    parseFloat(ivpbMinutes)
  );

  const mapResult = calculateMAP(parseFloat(sbp), parseFloat(dbp));
  const tempResult = convertTemp(parseFloat(tempVal), tempUnit);
  const dripRateResult = calculateIVDripRate(parseFloat(volumeMl), parseFloat(hours), parseFloat(dropFactor));
  const weightResult = convertWeight(parseFloat(weightVal), weightUnit);

  const handleInsert = (snippet: string) => {
    onInsertSnippet(snippet);
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 1800);
  };

  const handlePrintAdminSheet = () => {
    document.body.classList.add('printing-iv-sheet');
    const cleanup = () => {
      document.body.classList.remove('printing-iv-sheet');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    try {
      window.print();
    } catch {
      // fallback
    }
    setTimeout(() => {
      document.body.classList.remove('printing-iv-sheet');
    }, 2000);
  };

  const getIcuMasterSheetText = () => {
    const ptWt = parseFloat(patientWeightKg) || 50;
    return `================================================================================
INSTANT INFUSION CALCULATOR · ICU MASTER BEDSIDE TITRATION SHEET (A4)
Patient: ${patientName || 'N/A'} | CPR/MRN: ${patientCpr || 'N/A'} | Weight: ${ptWt} kg (${Math.round(ptWt * 2.20462)} lbs) | Bed: ${patientBed}
Date: ${new Date().toLocaleDateString('en-GB')} | Time: ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
================================================================================

[1] NOR EPINEPHRINE (16 mg in 50 mL = 320 mcg/mL) · Non-weight based (mcg/min)
Dose (mcg/min): 0.5 | 1.0 | 2.0 | 3.0 | 4.0 | 5.0 | 6.0 | 7.0 | 8.0 | 9.0 | 10  | 12  | 15  | 20  | 25  | 30
Rate (mL/hr)  : 0.1 | 0.2 | 0.4 | 0.6 | 0.8 | 0.9 | 1.1 | 1.3 | 1.5 | 1.7 | 1.9 | 2.3 | 2.8 | 3.8 | 4.7 | 5.6

[2] EPINEPHRINE (10 mg in 50 mL = 200 mcg/mL) · Weight-adjusted (${ptWt} kg)
Dose (mcg/kg/min): 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7  | 0.8  | 0.9  | 1.0
Rate (mL/hr)     : ${((0.1*ptWt*60)/200).toFixed(1)} | ${((0.2*ptWt*60)/200).toFixed(1)} | ${((0.3*ptWt*60)/200).toFixed(1)} | ${((0.4*ptWt*60)/200).toFixed(1)} | ${((0.5*ptWt*60)/200).toFixed(1)} | ${((0.6*ptWt*60)/200).toFixed(1)} | ${((0.7*ptWt*60)/200).toFixed(1)} | ${((0.8*ptWt*60)/200).toFixed(1)} | ${((0.9*ptWt*60)/200).toFixed(1)} | ${((1.0*ptWt*60)/200).toFixed(1)}

[3] DOPAMINE (800 mg in 250 mL = 3200 mcg/mL) · Weight-adjusted (${ptWt} kg)
Dose (mcg/kg/min): 1.0 | 2.5 | 5.0 | 7.5  | 10.0 | 12.5 | 15.0 | 17.5 | 20.0
Rate (mL/hr)     : ${((1.0*ptWt*60)/3200).toFixed(1)} | ${((2.5*ptWt*60)/3200).toFixed(1)} | ${((5.0*ptWt*60)/3200).toFixed(1)} | ${((7.5*ptWt*60)/3200).toFixed(1)} | ${((10.0*ptWt*60)/3200).toFixed(1)} | ${((12.5*ptWt*60)/3200).toFixed(1)} | ${((15.0*ptWt*60)/3200).toFixed(1)} | ${((17.5*ptWt*60)/3200).toFixed(1)} | ${((20.0*ptWt*60)/3200).toFixed(1)}

[4] DOBUTAMINE (1000 mg in 500 mL = 2000 mcg/mL) · Weight-adjusted (${ptWt} kg)
Dose (mcg/kg/min): 1.0 | 2.5 | 5.0 | 7.5  | 10.0 | 12.5 | 15.0 | 17.5 | 20.0
Rate (mL/hr)     : ${((1.0*ptWt*60)/2000).toFixed(1)} | ${((2.5*ptWt*60)/2000).toFixed(1)} | ${((5.0*ptWt*60)/2000).toFixed(1)} | ${((7.5*ptWt*60)/2000).toFixed(1)} | ${((10.0*ptWt*60)/2000).toFixed(1)} | ${((12.5*ptWt*60)/2000).toFixed(1)} | ${((15.0*ptWt*60)/2000).toFixed(1)} | ${((17.5*ptWt*60)/2000).toFixed(1)} | ${((20.0*ptWt*60)/2000).toFixed(1)}

[5] NITROGLYCERIN (50 mg in 500 mL = 100 mcg/mL) · Non-weight based (mcg/min)
Dose (mcg/min): 5   | 10  | 15  | 20  | 25  | 30  | 35  | 40  | 45  | 50
Rate (mL/hr)  : 3.0 | 6.0 | 9.0 | 12.0| 15.0| 18.0| 21.0| 24.0| 27.0| 30.0

[6] LABETALOL (200 mg in 200 mL = 1 mg/mL) · Non-weight based (mg/min)
Dose (mg/min): 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0
Rate (mL/hr) : 30  | 60  | 90  | 120 | 150 | 180

[7] REMIFENTANIL (15 mg in 60 mL = 250 mcg/mL) · Weight-adjusted (${ptWt} kg)
Dose (mcg/kg/min): 0.05 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.8 | 1.0 | 1.5 | 2.0
Rate (mL/hr)     : ${((0.05*ptWt*60)/250).toFixed(1)} | ${((0.1*ptWt*60)/250).toFixed(1)} | ${((0.2*ptWt*60)/250).toFixed(1)} | ${((0.3*ptWt*60)/250).toFixed(1)} | ${((0.4*ptWt*60)/250).toFixed(1)} | ${((0.5*ptWt*60)/250).toFixed(1)} | ${((0.8*ptWt*60)/250).toFixed(1)} | ${((1.0*ptWt*60)/250).toFixed(1)} | ${((1.5*ptWt*60)/250).toFixed(1)} | ${((2.0*ptWt*60)/250).toFixed(1)}

[8] NIMBEX (100 mg in 100 mL = 1 mg/mL) · Weight-adjusted (${ptWt} kg)
Dose (mg/kg/hr): 0.10 | 0.15 | 0.20 | 0.25 | 0.30 | 0.35 | 0.40
Rate (mL/hr)   : ${((0.10*ptWt)/1).toFixed(1)} | ${((0.15*ptWt)/1).toFixed(1)} | ${((0.20*ptWt)/1).toFixed(1)} | ${((0.25*ptWt)/1).toFixed(1)} | ${((0.30*ptWt)/1).toFixed(1)} | ${((0.35*ptWt)/1).toFixed(1)} | ${((0.40*ptWt)/1).toFixed(1)}

[9] HEPARIN SODIUM (25000 Units in 50 mL = 500 U/mL) · Daily kUnits
Daily Dose (kU): 10  | 14  | 18  | 20  | 22  | 24  | 28  | 32  | 36  | 40  | 48  | 52
Continuous Rate: 0.8 | 1.2 | 1.5 | 1.7 | 1.8 | 2.0 | 2.3 | 2.7 | 3.0 | 3.3 | 4.0 | 4.3 mL/hr

[10] PROTOCOL INFUSIONS
- Regular Insulin (50 IU in 50 mL NS): 1 IU = 1 mL/hr (titrate per sliding scale protocol)
- Amiodarone (1000 mg in 500 mL D5W): 22 mL/hr (1 mg/min) x 6h -> 11 mL/hr (0.5 mg/min) x 18h
- Omeprazole (80 mg in 500 mL NS): 50 mL/hr continuous (8 mg/hr)
- Lasix / Furosemide (250 mg in 50 mL NS): 2 to 8 mL/hr continuous (10 to 40 mg/hr)
================================================================================
Mandatory Dual-RN verification on smart pump configuration, drug bag label, and line tracing.`;
  };

  const handleCopyAdminSheetText = async () => {
    const text =
      sheetPrintMode === 'icu_master'
        ? getIcuMasterSheetText()
        : formatMultiDrugPrintReadyAdminSheetText({
            drugs: selectedDrugs,
            patientWeightKg: parseFloat(patientWeightKg) || 50,
            bedLabel: patientBed,
          });
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTableToast(
        sheetPrintMode === 'icu_master'
          ? 'Copied 10-Drug ICU Master Infusion Sheet to clipboard!'
          : `Copied ${selectedDrugs.length} Infusion Record(s) to clipboard!`
      );
      setTimeout(() => setCopiedTableToast(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleInsertTitrationTable = () => {
    const text =
      sheetPrintMode === 'icu_master'
        ? getIcuMasterSheetText()
        : formatMultiDrugPrintReadyAdminSheetText({
            drugs: selectedDrugs,
            patientWeightKg: parseFloat(patientWeightKg) || 50,
            bedLabel: patientBed,
          });
    handleInsert(text);
  };

  // Reusable Helper to render horizontal dose + pump rate strip
  const renderHorizontalTitrationCard = (config: {
    title: string;
    category: string;
    categoryColor?: string;
    formulation: string;
    notes?: string;
    rows: Array<{
      doseLabel: string;
      rateLabel: string;
      items: Array<{ dose: number | string; rate: number | string }>;
    }>;
  }) => {
    return (
      <div className="border border-slate-300 rounded overflow-hidden bg-white text-[8px] leading-tight print-avoid-break shadow-2xs">
        {/* Header bar */}
        <div className="bg-slate-100 px-1.5 py-0.5 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className={`text-[6.5px] font-black uppercase px-1 py-0.2 rounded ${config.categoryColor || 'bg-slate-200 text-slate-800'}`}>
              {config.category}
            </span>
            <span className="font-black text-slate-950 text-[8.5px] uppercase tracking-wide">
              {config.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[7.5px]">
            <span className="font-bold text-slate-800">{config.formulation}</span>
            {config.notes && <span className="text-slate-500 font-sans hidden sm:inline print:inline">· {config.notes}</span>}
          </div>
        </div>

        {/* Titration Rows */}
        {config.rows.map((row, rIdx) => (
          <div key={rIdx} className={rIdx > 0 ? 'border-t border-slate-200' : ''}>
            <table className="w-full border-collapse text-center">
              <tbody>
                {/* Dose Row */}
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 text-slate-700 font-bold text-[7px] uppercase px-1 py-0.5 border-r border-slate-300 whitespace-nowrap text-left w-12">
                    {row.doseLabel}
                  </td>
                  {row.items.map((item, iIdx) => (
                    <td key={iIdx} className="font-mono font-semibold text-slate-800 border-r border-slate-200 px-0.5 py-0.5 text-[7px] last:border-r-0">
                      {item.dose}
                    </td>
                  ))}
                </tr>
                {/* Rate Row */}
                <tr className="bg-blue-50/50">
                  <td className="bg-blue-100/90 text-blue-950 font-black text-[7px] uppercase px-1 py-0.5 border-r border-slate-300 whitespace-nowrap text-left w-12">
                    {row.rateLabel}
                  </td>
                  {row.items.map((item, iIdx) => (
                    <td key={iIdx} className="font-mono font-black text-blue-950 bg-blue-50/70 border-r border-slate-200 px-0.5 py-0.5 text-[7.5px] last:border-r-0">
                      {item.rate}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const renderA4AdminSheetContent = () => {
    const ptWeight = parseFloat(patientWeightKg) || 50;

    // Concentrations & Math for ICU Master Infusions (matching attached screenshot)
    const norAmt = parseFloat(masterNorAmount) || 16;
    const norVol = parseFloat(masterNorVol) || 50;
    const norConc = (norAmt * 1000) / norVol; // 320 mcg/mL

    const epiAmt = parseFloat(masterEpiAmount) || 10;
    const epiVol = parseFloat(masterEpiVol) || 50;
    const epiConc = (epiAmt * 1000) / epiVol; // 200 mcg/mL

    const dopaAmt = parseFloat(masterDopaAmount) || 800;
    const dopaVol = parseFloat(masterDopaVol) || 250;
    const dopaConc = (dopaAmt * 1000) / dopaVol; // 3200 mcg/mL

    const dobuAmt = parseFloat(masterDobuAmount) || 1000;
    const dobuVol = parseFloat(masterDobuVol) || 500;
    const dobuConc = (dobuAmt * 1000) / dobuVol; // 2000 mcg/mL

    const ntgAmt = parseFloat(masterNtgAmount) || 50;
    const ntgVol = parseFloat(masterNtgVol) || 500;
    const ntgConc = (ntgAmt * 1000) / ntgVol; // 100 mcg/mL

    const labAmt = parseFloat(masterLabAmount) || 200;
    const labVol = parseFloat(masterLabVol) || 200;
    const labConc = labAmt / labVol; // 1 mg/mL

    const remiAmt = parseFloat(masterRemiAmount) || 15;
    const remiVol = parseFloat(masterRemiVol) || 60;
    const remiConc = (remiAmt * 1000) / remiVol; // 250 mcg/mL

    const nimbexAmt = parseFloat(masterNimbexAmount) || 100;
    const nimbexVol = parseFloat(masterNimbexVol) || 100;
    const nimbexConc = nimbexAmt / nimbexVol; // 1 mg/mL

    const hepAmt = parseFloat(masterHepAmount) || 25000;
    const hepVol = parseFloat(masterHepVol) || 50;
    const hepConc = hepAmt / hepVol; // 500 U/mL

    // Dynamic Dose Steps Arrays
    const norDoses1 = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const norDoses2 = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const epiDoses = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const dopaDoses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const dobuDoses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const ntgDoses = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25, 30, 35, 40, 45, 50];
    const labDoses = [0.5, 1, 1.5, 2, 2.5, 3];
    const remiDoses = [0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 2.0];
    const nimbexDoses = [0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40];
    const hepDoses = [10, 14, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 40, 44, 48, 52];

    const todayStr = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy matching 25/10/2026
    const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
      <div className="font-sans text-xs space-y-1.5 max-w-full text-slate-950">
        {/* Document Header (Matches Screenshot Instant Infusion Calculator) */}
        <div className="border-b-2 border-slate-900 pb-1 flex items-start justify-between">
          <div>
            <div className="text-[7.5px] uppercase font-bold tracking-widest text-slate-600">
              Intensive Care & Emergency Nursing Service · Critical Titration Protocol
            </div>
            <h1 className="text-base font-black tracking-tight text-slate-950 uppercase flex items-center gap-2">
              <span>Instant Infusion Calculator</span>
              <span className="text-[8px] font-bold px-1.5 py-0.2 bg-slate-900 text-white rounded">
                {sheetPrintMode === 'icu_master' ? 'ICU Bedside Master (A4)' : `Selected MAR (${selectedDrugs.length} Infusions)`}
              </span>
            </h1>
            <div className="text-[8px] text-slate-600 font-medium">
              Weight-Adjusted Smart Pump Titration Reference & Single-Sheet Administration Record
            </div>
          </div>
          <div className="text-right text-[8.5px] text-slate-700 leading-tight">
            <div><strong>Date:</strong> {todayStr}</div>
            <div><strong>Time:</strong> {timeStr}</div>
            <div className="font-mono text-[7.5px] text-slate-500">REF: ICU-A4-{sheetPrintMode.toUpperCase()}</div>
          </div>
        </div>

        {/* Patient Demographics Bar (Matching Name, Weight [50] Kg, CPR, Date/Time from Screenshot) */}
        <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-100 border border-slate-300 rounded text-[9px] leading-tight items-center">
          <div>
            <span className="text-slate-500 font-bold uppercase text-[7px] block">Name:</span>
            <span className="font-bold text-slate-950 text-[10px]">
              {patientName ? patientName : '____________________'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[7px] block">Weight:</span>
            <span className="font-black text-blue-950 font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-300 inline-block shadow-2xs">
              {ptWeight} Kg
            </span>
            <span className="text-[7.5px] text-slate-500 ml-1">
              ({Math.round(ptWeight * 2.20462)} lbs)
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[7px] block">CPR / MRN:</span>
            <span className="font-bold font-mono text-slate-950 text-[10px]">
              {patientCpr ? patientCpr : '____________________'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold uppercase text-[7px] block">Location / Bed:</span>
            <span className="font-bold text-slate-950 text-[10px]">
              {patientBed || activeBedLabel || 'ICU Bed 301'}
            </span>
          </div>
        </div>

        {/* =========================================================================
            MODE 1: ICU MASTER INFUSION SHEET (2 COLUMNS AS PER ATTACHED SCREENSHOT)
           ========================================================================= */}
        {sheetPrintMode === 'icu_master' ? (
          <div className="grid grid-cols-2 gap-1.5">
            {/* LEFT COLUMN: INOTROPES & VASOPRESSORS */}
            <div className="space-y-1.5">
              <div className="px-1 py-0.5 bg-rose-50 border-l-3 border-rose-600 rounded-r text-[7.5px] font-black uppercase text-rose-950 tracking-wider">
                Inotropes & Vasopressors
              </div>

              {/* 1. Nor Epinephrine */}
              {renderHorizontalTitrationCard({
                title: 'Nor Epinephrine',
                category: 'Inotropes',
                categoryColor: 'bg-rose-100 text-rose-900',
                formulation: `${norAmt} mg in ${norVol} mL (${Math.round(norConc)} µg/mL)`,
                notes: 'Target MAP ≥ 65 mmHg',
                rows: [
                  {
                    doseLabel: 'Dose µg/m',
                    rateLabel: 'mL/hr',
                    items: norDoses1.map((d) => ({
                      dose: d,
                      rate: ((d * 60) / norConc).toFixed(1),
                    })),
                  },
                  {
                    doseLabel: 'Dose µg/m',
                    rateLabel: 'mL/hr',
                    items: norDoses2.map((d) => ({
                      dose: d,
                      rate: ((d * 60) / norConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 2. Epinephrine */}
              {renderHorizontalTitrationCard({
                title: 'Epinephrine',
                category: 'Inotropes',
                categoryColor: 'bg-rose-100 text-rose-900',
                formulation: `${epiAmt} mg in ${epiVol} mL (${Math.round(epiConc)} µg/mL)`,
                notes: `Weight-adjusted (${ptWeight} kg)`,
                rows: [
                  {
                    doseLabel: 'µg/kg/m',
                    rateLabel: 'mL/hr',
                    items: epiDoses.map((d) => ({
                      dose: d,
                      rate: ((d * ptWeight * 60) / epiConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 3. Dopamine */}
              {renderHorizontalTitrationCard({
                title: 'Dopamine',
                category: 'Inotropes',
                categoryColor: 'bg-rose-100 text-rose-900',
                formulation: `${dopaAmt} mg in ${dopaVol} mL (${Math.round(dopaConc)} µg/mL)`,
                notes: `Vesicant · Central Line · (${ptWeight} kg)`,
                rows: [
                  {
                    doseLabel: 'µg/kg/m',
                    rateLabel: 'mL/hr',
                    items: dopaDoses.map((d) => ({
                      dose: d,
                      rate: ((d * ptWeight * 60) / dopaConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 4. Dobutamine */}
              {renderHorizontalTitrationCard({
                title: 'Dobutamine',
                category: 'Inotropes',
                categoryColor: 'bg-rose-100 text-rose-900',
                formulation: `${dobuAmt} mg in ${dobuVol} mL (${Math.round(dobuConc)} µg/mL)`,
                notes: `Cardiogenic Shock · (${ptWeight} kg)`,
                rows: [
                  {
                    doseLabel: 'µg/kg/m',
                    rateLabel: 'mL/hr',
                    items: dobuDoses.map((d) => ({
                      dose: d,
                      rate: ((d * ptWeight * 60) / dobuConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 5. Nitroglycerin (NTG) */}
              {renderHorizontalTitrationCard({
                title: 'NTG (Nitroglycerin)',
                category: 'Vasodilator',
                categoryColor: 'bg-amber-100 text-amber-900',
                formulation: `${ntgAmt} mg in ${ntgVol} mL (${Math.round(ntgConc)} µg/mL)`,
                notes: 'ACS / Heart Failure',
                rows: [
                  {
                    doseLabel: 'Dose µg/m',
                    rateLabel: 'mL/hr',
                    items: ntgDoses.map((d) => ({
                      dose: d,
                      rate: ((d * 60) / ntgConc).toFixed(1),
                    })),
                  },
                ],
              })}
            </div>

            {/* RIGHT COLUMN: MORE, SEDATIVES, ANTICOAGULATION & FIXED INFUSIONS */}
            <div className="space-y-1.5">
              <div className="px-1 py-0.5 bg-blue-50 border-l-3 border-blue-600 rounded-r text-[7.5px] font-black uppercase text-blue-950 tracking-wider">
                Antihypertensive, Sedation & ICU Regimens
              </div>

              {/* 1. Labetalol */}
              {renderHorizontalTitrationCard({
                title: 'Labetalol',
                category: 'More',
                categoryColor: 'bg-indigo-100 text-indigo-900',
                formulation: `${labAmt} mg in ${labVol} mL (${Math.round(labConc)} mg/mL)`,
                notes: 'Hypertensive Emergency / Aortic Dissection',
                rows: [
                  {
                    doseLabel: 'mg/min',
                    rateLabel: 'mL/hr',
                    items: labDoses.map((d) => ({
                      dose: d,
                      rate: ((d * 60) / labConc).toFixed(0),
                    })),
                  },
                ],
              })}

              {/* 2. Remifentanil */}
              {renderHorizontalTitrationCard({
                title: 'Remifentanil',
                category: 'Sedatives',
                categoryColor: 'bg-purple-100 text-purple-900',
                formulation: `${remiAmt} mg in ${remiVol} mL (${Math.round(remiConc)} µg/mL)`,
                notes: `Short-acting Opioid · (${ptWeight} kg)`,
                rows: [
                  {
                    doseLabel: 'µg/kg/m',
                    rateLabel: 'mL/hr',
                    items: remiDoses.map((d) => ({
                      dose: d,
                      rate: ((d * ptWeight * 60) / remiConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 3. Nimbex (Cisatracurium) */}
              {renderHorizontalTitrationCard({
                title: 'Nimbex (Cisatracurium)',
                category: 'Sedatives',
                categoryColor: 'bg-purple-100 text-purple-900',
                formulation: `${nimbexAmt} mg in ${nimbexVol} mL (${Math.round(nimbexConc)} mg/mL)`,
                notes: `Paralytic · Train-of-Four · (${ptWeight} kg)`,
                rows: [
                  {
                    doseLabel: 'mg/kg/hr',
                    rateLabel: 'mL/hr',
                    items: nimbexDoses.map((d) => ({
                      dose: d,
                      rate: ((d * ptWeight) / nimbexConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 4. Heparin */}
              {renderHorizontalTitrationCard({
                title: 'Heparin Sodium',
                category: 'Misc',
                categoryColor: 'bg-emerald-100 text-emerald-900',
                formulation: `${hepAmt} Units in ${hepVol} mL (${Math.round(hepConc)} U/mL)`,
                notes: 'Titrate per Anti-Xa / aPTT',
                rows: [
                  {
                    doseLabel: 'kU/24hr',
                    rateLabel: 'mL/hr',
                    items: hepDoses.map((d) => ({
                      dose: `${d}k`,
                      rate: (((d * 1000) / 24) / hepConc).toFixed(1),
                    })),
                  },
                ],
              })}

              {/* 5. Fixed ICU Protocol Infusions Card (Insulin, Amiodarone, Omeprazole, Lasix) */}
              <div className="border border-slate-300 rounded overflow-hidden bg-white text-[8px] leading-tight print-avoid-break shadow-2xs">
                <div className="bg-slate-100 px-1.5 py-0.5 border-b border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[6.5px] font-black uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-900">
                      Fixed Infusions
                    </span>
                    <span className="font-black text-slate-950 text-[8.5px] uppercase tracking-wide">
                      ICU Standard Protocol Continuous Infusions
                    </span>
                  </div>
                  <span className="font-mono text-[7px] text-slate-500">Bedside Reference</span>
                </div>
                <table className="w-full border-collapse text-left text-[7.5px]">
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="bg-slate-50 font-bold px-1.5 py-0.5 text-slate-800 border-r border-slate-300 w-32">
                        Insulin Infusion (50 IU / 50 mL NS)
                      </td>
                      <td className="px-1.5 py-0.5 font-mono font-bold text-blue-900 border-r border-slate-200 w-20">
                        1 IU = 1 mL/hr
                      </td>
                      <td className="px-1.5 py-0.5 text-slate-600">
                        Titrate hourly per sliding scale protocol. Target BG 140–180 mg/dL.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="bg-slate-50 font-bold px-1.5 py-0.5 text-slate-800 border-r border-slate-300">
                        Amiodarone (1000 mg / 500 mL D5W)
                      </td>
                      <td className="px-1.5 py-0.5 font-mono font-bold text-blue-900 border-r border-slate-200">
                        22 → 11 mL/hr
                      </td>
                      <td className="px-1.5 py-0.5 text-slate-600">
                        Load 22 mL/hr (1 mg/min) x 6h → Maint 11 mL/hr (0.5 mg/min) x 18h.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="bg-slate-50 font-bold px-1.5 py-0.5 text-slate-800 border-r border-slate-300">
                        Omeprazole (80 mg / 500 mL NS)
                      </td>
                      <td className="px-1.5 py-0.5 font-mono font-bold text-blue-900 border-r border-slate-200">
                        50 mL/hr
                      </td>
                      <td className="px-1.5 py-0.5 text-slate-600">
                        Continuous 8 mg/hr IV infusion for upper GI bleeding / post-endoscopy.
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-slate-50 font-bold px-1.5 py-0.5 text-slate-800 border-r border-slate-300">
                        Lasix / Furosemide (250 mg / 50 mL NS)
                      </td>
                      <td className="px-1.5 py-0.5 font-mono font-bold text-blue-900 border-r border-slate-200">
                        2 – 8 mL/hr
                      </td>
                      <td className="px-1.5 py-0.5 text-slate-600">
                        Continuous 10 – 40 mg/hr infusion. Titrate for target urine output.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
              MODE 2: SELECTED PATIENT INFUSIONS MAR (USING HORIZONTAL STRIP CARDS)
             ========================================================================= */
          <div className={`grid gap-1.5 ${selectedDrugs.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {selectedDrugs.map((drug, dIdx) => {
              const ladder = generateTitrationLadder({
                drugAmount: drug.drugAmount,
                drugUnit: drug.drugUnit,
                bagVolumeMl: drug.bagVolumeMl,
                minDose: drug.minDose,
                maxDose: drug.maxDose,
                stepDose: drug.stepDose,
                doseUnit: drug.doseUnit,
                patientWeightKg: ptWeight,
              });

              // Format steps into horizontal strips
              const steps = ladder.steps;
              const rows: Array<{
                doseLabel: string;
                rateLabel: string;
                items: Array<{ dose: number | string; rate: number | string }>;
              }> = [];

              if (steps.length <= 14) {
                rows.push({
                  doseLabel: `${drug.doseUnit.split('/')[0]}`,
                  rateLabel: 'mL/hr',
                  items: steps.map((s) => ({ dose: s.dose, rate: s.rateMlHr })),
                });
              } else {
                const mid = Math.ceil(steps.length / 2);
                rows.push({
                  doseLabel: `${drug.doseUnit.split('/')[0]}`,
                  rateLabel: 'mL/hr',
                  items: steps.slice(0, mid).map((s) => ({ dose: s.dose, rate: s.rateMlHr })),
                });
                rows.push({
                  doseLabel: `${drug.doseUnit.split('/')[0]}`,
                  rateLabel: 'mL/hr',
                  items: steps.slice(mid).map((s) => ({ dose: s.dose, rate: s.rateMlHr })),
                });
              }

              return (
                <div key={drug.id || dIdx}>
                  {renderHorizontalTitrationCard({
                    title: `${dIdx + 1}. ${drug.drugName}`,
                    category: drug.isHighAlert ? 'High-Alert' : 'Active Infusion',
                    categoryColor: drug.isHighAlert ? 'bg-rose-100 text-rose-900' : 'bg-blue-100 text-blue-900',
                    formulation: `${drug.drugAmount} ${drug.drugUnit} / ${drug.bagVolumeMl} mL ${drug.diluent} (${ladder.concentrationDisplay})`,
                    notes: drug.titrationGoal || `Range: ${drug.minDose}–${drug.maxDose} ${drug.doseUnit}`,
                    rows,
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Pre-Administration Safeguards Checklist */}
        <div className="border border-slate-300 rounded p-1 bg-slate-50 text-[8px] leading-snug">
          <div className="font-bold text-slate-900 mb-0.5 uppercase tracking-wide text-[7px] flex items-center justify-between">
            <span>Pre-Administration Verification Checklist (Per Hospital ICU Policy)</span>
            <span className="font-mono text-slate-500 font-normal">Dual-Nurse Bedside Check Required</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-slate-700 text-[7.5px]">
            <div>[  ] 1. Verified 2 Patient Identifiers against active eMAR order</div>
            <div>[  ] 2. All dedicated infusion lines labeled & line-traced to patient catheter</div>
            <div>[  ] 3. Smart pump drug library selected; soft/hard guardrails active</div>
            <div>[  ] 4. Venous access patency & blood return confirmed; no infiltration</div>
          </div>
        </div>

        {/* Dual RN Signatures Block */}
        <div className="grid grid-cols-2 gap-4 border-t-2 border-slate-900 pt-1 text-[8.5px] leading-tight">
          <div>
            <div className="font-bold text-slate-900">Primary Administering Nurse:</div>
            <div className="border-b border-slate-500 mt-2 mb-0.5"></div>
            <div className="flex justify-between text-slate-600 text-[7px]">
              <span>Signature / RN License #</span>
              <span>Date: ____________  Time: ________</span>
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900">Independent Dual-RN Verification Co-Signer:</div>
            <div className="border-b border-slate-500 mt-2 mb-0.5"></div>
            <div className="flex justify-between text-slate-600 text-[7px]">
              <span>Signature / RN License #</span>
              <span>Date: ____________  Time: ________</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[7px] text-slate-400 pt-0.5 font-mono">
          Instant Infusion Calculator (A4 Master) · Valid for bedside clinical titration reference · Must fit on 1 Single A4 Sheet
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh] sm:max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${theme.primaryBtn} flex items-center justify-center shadow-xs`}>
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Bedside Clinical & IV Drug Calculators</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Print Ready · EHR
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Min–Max titration charts, print-ready bedside administration sheets, smart pump verification & clinical math
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('iv_drug')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'iv_drug'
                ? `border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-bold`
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Syringe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>IV Drug & Infusion</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'map'
                ? `border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-bold`
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>MAP (Mean Arterial)</span>
          </button>
          <button
            onClick={() => setActiveTab('drip')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'drip'
                ? `border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-bold`
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Gravity Drip Rate</span>
          </button>
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'temp'
                ? `border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-bold`
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>°C ↔ °F Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'weight'
                ? `border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300 font-bold`
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-500" />
            <span>Weight (lbs/kg)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* =========================================================================
              TAB 0: IV DRUG CALCULATOR
             ========================================================================= */}
          {activeTab === 'iv_drug' && (
            <div className="space-y-4">
              {/* Sub-mode navigation pills */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setIvDrugSubMode('titration_ladder')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    ivDrugSubMode === 'titration_ladder'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Generate step-by-step Min to Max titration table with smart pump rates and print-ready bedside administration sheet"
                >
                  <Printer className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span>Min–Max Titration & Print Sheet</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-black uppercase tracking-wider">
                    Print Ready
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setIvDrugSubMode('infusion')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    ivDrugSubMode === 'infusion'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Syringe className="w-3 h-3 text-blue-500" />
                  <span>Single Dose (mL/hr)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIvDrugSubMode('reverse')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    ivDrugSubMode === 'reverse'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Verify dose delivered based on current smart pump rate"
                >
                  <RotateCcw className="w-3 h-3 text-indigo-500" />
                  <span>Verify Pump (Rate → Dose)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIvDrugSubMode('push')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    ivDrugSubMode === 'push'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>IV Push & Vial Draw-Up</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIvDrugSubMode('ivpb')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    ivDrugSubMode === 'ivpb'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>Intermittent IVPB</span>
                </button>
              </div>

              {/* =====================================================================
                  SUBMODE 0: MULTI-DRUG MIN-MAX TITRATION & SINGLE SHEET A4 PRINT
                 ===================================================================== */}
              {ivDrugSubMode === 'titration_ladder' && (
                <div className="space-y-4">
                  {/* Preset Multi-Selection Ribbon */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>Select Infusions for A4 Single-Sheet MAR:</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 text-[10px] font-extrabold">
                          {selectedDrugs.length} Selected (Max 4 for 1 A4 Page)
                        </span>
                      </span>
                      <span className="text-[10px] text-slate-400">Click any preset to toggle onto sheet</span>
                    </div>

                    {/* Preset Chips with Toggle Checkboxes */}
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {STANDARD_IV_DRUG_PRESETS.map((preset) => {
                        const isSelected = selectedDrugs.some((d) => d.presetId === preset.id);
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleTogglePreset(preset)}
                            className={`px-2 py-1 rounded-md border font-medium transition-all flex items-center gap-1 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-200 font-bold shadow-2xs ring-1 ring-blue-500/40'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                            title={`Click to ${isSelected ? 'remove from' : 'add to'} A4 sheet (${preset.typicalRange})`}
                          >
                            <span className={`w-3 h-3 rounded flex items-center justify-center text-[9px] ${isSelected ? 'bg-blue-600 text-white font-bold' : 'border border-slate-300 dark:border-slate-600'}`}>
                              {isSelected ? '✓' : ''}
                            </span>
                            <span>{preset.name.split(' ')[0]}</span>
                            {preset.isHighAlert && <span className="text-rose-500 font-bold">*</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Clinical ICU Bundles */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] pt-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Quick Regimens:</span>
                      <button
                        type="button"
                        onClick={() => handleApplyICUPack('septic')}
                        className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium transition-colors"
                      >
                        ⚡ Septic Shock (Levophed + Vaso)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyICUPack('sedation')}
                        className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium transition-colors"
                      >
                        ⚡ Sedation (Propofol + Levophed)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyICUPack('cardiac')}
                        className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium transition-colors"
                      >
                        ⚡ Inotropes (Levophed + Dobutamine)
                      </button>
                      <button
                        type="button"
                        onClick={handleAddCustomDrug}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
                      >
                        + Add Custom Infusion
                      </button>
                      {selectedDrugs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleApplyICUPack('reset')}
                          className="px-2 py-0.5 rounded text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline text-[10px] ml-auto"
                        >
                          Reset to 1 Drug
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Selected Drug Tabs (Selector for tuning individual drug parameters) */}
                  <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 px-1">
                      Active Drug Configurator ({selectedDrugs.length} in A4 Sheet Queue):
                    </div>
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                      {selectedDrugs.map((drug, index) => {
                        const isActive = index === activeDrugIndex;
                        return (
                          <div
                            key={drug.id || index}
                            onClick={() => setActiveDrugIndex(index)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
                              isActive
                                ? 'bg-white dark:bg-slate-700 text-blue-800 dark:text-blue-200 shadow-2xs font-bold border border-blue-300 dark:border-blue-600'
                                : 'bg-slate-200/60 dark:bg-slate-750 text-slate-700 dark:text-slate-300 hover:bg-white/80'
                            }`}
                          >
                            <span>#{index + 1} {drug.drugName.split(' ')[0]}</span>
                            {drug.isHighAlert && <span className="text-rose-500 text-[10px]">*</span>}
                            {selectedDrugs.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveDrug(drug.id, e)}
                                className="w-3.5 h-3.5 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-[10px] text-slate-500"
                                title="Remove from A4 sheet"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}
                      <button
                        type="button"
                        onClick={handleAddCustomDrug}
                        className="px-2 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 border border-dashed border-slate-300 dark:border-slate-600 whitespace-nowrap"
                      >
                        + Add Drug
                      </button>
                    </div>
                  </div>

                  {/* Active Drug Configuration Form */}
                  <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-blue-500" />
                        <span>Configuring #{activeDrugIndex + 1}: {activeDrug.drugName}</span>
                      </span>
                      {activeDrug.isHighAlert && (
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                          ISMP High-Alert Medication
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Medication & Brand Name
                        </label>
                        <input
                          type="text"
                          value={activeDrug.drugName}
                          onChange={(e) => updateActiveDrug({ drugName: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Amount in Bag
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={activeDrug.drugAmount}
                              onChange={(e) => updateActiveDrug({ drugAmount: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                            />
                            <select
                              value={activeDrug.drugUnit}
                              onChange={(e) => updateActiveDrug({ drugUnit: e.target.value as DrugMassUnit })}
                              className="px-1.5 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                            >
                              <option value="mg">mg</option>
                              <option value="mcg">mcg</option>
                              <option value="units">units</option>
                              <option value="g">g</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Bag Vol (mL) & Diluent
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={activeDrug.bagVolumeMl}
                              onChange={(e) => updateActiveDrug({ bagVolumeMl: parseFloat(e.target.value) || 0 })}
                              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                            />
                            <input
                              type="text"
                              value={activeDrug.diluent}
                              onChange={(e) => updateActiveDrug({ diluent: e.target.value })}
                              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Min - Max Ordered Range & Step */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Min Ordered Dose
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={activeDrug.minDose}
                          onChange={(e) => updateActiveDrug({ minDose: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Max Ordered Dose
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={activeDrug.maxDose}
                          onChange={(e) => updateActiveDrug({ maxDose: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Titration Step
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={activeDrug.stepDose}
                          onChange={(e) => updateActiveDrug({ stepDose: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Dose Unit
                        </label>
                        <select
                          value={activeDrug.doseUnit}
                          onChange={(e) => updateActiveDrug({ doseUnit: e.target.value as InfusionDoseRateUnit })}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        >
                          <option value="mcg/kg/min">mcg/kg/min</option>
                          <option value="mcg/min">mcg/min</option>
                          <option value="mcg/kg/hr">mcg/kg/hr</option>
                          <option value="mcg/hr">mcg/hr</option>
                          <option value="mg/kg/hr">mg/kg/hr</option>
                          <option value="mg/hr">mg/hr</option>
                          <option value="units/kg/hr">units/kg/hr</option>
                          <option value="units/hr">units/hr</option>
                          <option value="units/min">units/min</option>
                        </select>
                      </div>
                    </div>

                    {/* Patient Context & Line/Target */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-semibold text-slate-700 dark:text-slate-300">
                            Patient Weight (kg)
                          </label>
                          <span className="text-[10px] text-slate-400">
                            ≈ {Math.round((parseFloat(patientWeightKg) || 0) * 2.20462)} lbs
                          </span>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={patientWeightKg}
                          onChange={(e) => setPatientWeightKg(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Room / Bed Label
                        </label>
                        <input
                          type="text"
                          value={patientBed}
                          onChange={(e) => setPatientBed(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Titration Target / Objective
                        </label>
                        <input
                          type="text"
                          value={activeDrug.titrationGoal}
                          onChange={(e) => updateActiveDrug({ titrationGoal: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mode Switcher: ICU Master Infusion Sheet (10 Drugs) vs Selected MAR */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setSheetPrintMode('icu_master')}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        sheetPrintMode === 'icu_master'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ ICU Master Infusion Sheet (10 Drugs · Single A4)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSheetPrintMode('selected_only')}
                      className={`flex-1 py-1.5 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        sheetPrintMode === 'selected_only'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>📋 Selected Patient Infusions MAR ({selectedDrugs.length} Active)</span>
                    </button>
                  </div>

                  {/* Patient & Print Sheet Header Details Bar */}
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>Patient & Print Sheet Header Details:</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Auto-printed on A4 sheet header</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Patient Name</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Patient Weight (kg)</label>
                        <div className="flex gap-1 items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={patientWeightKg}
                            onChange={(e) => setPatientWeightKg(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-blue-900 dark:text-blue-300"
                          />
                          <div className="flex gap-0.5 shrink-0">
                            {[50, 60, 70, 80].map((wt) => (
                              <button
                                key={wt}
                                type="button"
                                onClick={() => setPatientWeightKg(String(wt))}
                                className={`px-1.5 py-1 text-[10px] font-bold rounded border ${
                                  patientWeightKg === String(wt)
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {wt}k
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">CPR / MRN</label>
                        <input
                          type="text"
                          value={patientCpr}
                          onChange={(e) => setPatientCpr(e.target.value)}
                          placeholder="e.g. CPR-987654"
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">Room / Bed</label>
                        <input
                          type="text"
                          value={patientBed}
                          onChange={(e) => setPatientBed(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Optional Master Formulations Tuner */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setShowMasterConfigTuner(!showMasterConfigTuner)}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>{showMasterConfigTuner ? 'Hide Master Drug Concentrations' : 'Customize Master Drug Bag Concentrations (Nor 16/50, Epi 10/50, etc.)'}</span>
                      </button>
                      <span className="text-[10px] text-slate-500">
                        All rates computed live for Pt Weight: <strong>{patientWeightKg} kg</strong>
                      </span>
                    </div>
                    {showMasterConfigTuner && (
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-300">Nor Epi:</span>
                          <div className="flex gap-1 text-[10px] font-mono">
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterNorAmount} onChange={(e) => setMasterNorAmount(e.target.value)} title="mg" />
                            <span className="self-center">mg /</span>
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterNorVol} onChange={(e) => setMasterNorVol(e.target.value)} title="mL" />
                            <span className="self-center">mL</span>
                          </div>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-300">Epinephrine:</span>
                          <div className="flex gap-1 text-[10px] font-mono">
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterEpiAmount} onChange={(e) => setMasterEpiAmount(e.target.value)} />
                            <span className="self-center">mg /</span>
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterEpiVol} onChange={(e) => setMasterEpiVol(e.target.value)} />
                            <span className="self-center">mL</span>
                          </div>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-300">Dopamine:</span>
                          <div className="flex gap-1 text-[10px] font-mono">
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterDopaAmount} onChange={(e) => setMasterDopaAmount(e.target.value)} />
                            <span className="self-center">mg /</span>
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterDopaVol} onChange={(e) => setMasterDopaVol(e.target.value)} />
                            <span className="self-center">mL</span>
                          </div>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-300">Dobutamine:</span>
                          <div className="flex gap-1 text-[10px] font-mono">
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterDobuAmount} onChange={(e) => setMasterDobuAmount(e.target.value)} />
                            <span className="self-center">mg /</span>
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterDobuVol} onChange={(e) => setMasterDobuVol(e.target.value)} />
                            <span className="self-center">mL</span>
                          </div>
                        </div>
                        <div>
                          <span className="block font-bold text-slate-700 dark:text-slate-300">NTG:</span>
                          <div className="flex gap-1 text-[10px] font-mono">
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterNtgAmount} onChange={(e) => setMasterNtgAmount(e.target.value)} />
                            <span className="self-center">mg /</span>
                            <input className="w-1/2 p-1 rounded bg-white dark:bg-slate-700 border" value={masterNtgVol} onChange={(e) => setMasterNtgVol(e.target.value)} />
                            <span className="self-center">mL</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bedside Action Bar: Print A4 Sheet, Preview, Copy & Insert */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={handlePrintAdminSheet}
                        className={`py-2 px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors ${theme.primaryBtn}`}
                        title="Print all calculations on one single A4 sheet"
                      >
                        <Printer className="w-4 h-4 text-white" />
                        <span>Print A4 Sheet ({sheetPrintMode === 'icu_master' ? '10-Drug ICU Master' : `${selectedDrugs.length} Selected Infusions`})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowPaperPreview(!showPaperPreview)}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                          showPaperPreview
                            ? 'bg-blue-100 dark:bg-blue-900/60 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                        title="Toggle full printed A4 paper MAR layout preview"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-500" />
                        <span>{showPaperPreview ? 'Hide A4 Paper Preview' : 'Preview A4 Paper Sheet'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAdminSheetText}
                        className="py-2 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-colors"
                        title="Copy text record to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy All (Text)</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleInsertTitrationTable}
                      className="py-2 px-3.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                      title="Insert charts into active patient note"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Inserted into Note!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Insert All to Note</span>
                        </>
                      )}
                    </button>
                  </div>

                  {copiedTableToast && (
                    <div className="p-2 rounded-lg bg-slate-900 text-white text-xs font-medium flex items-center gap-2 animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{copiedTableToast}</span>
                    </div>
                  )}

                  {/* On-Screen Interactive Multi-Drug Display */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1">
                      <span className="flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-blue-500" />
                        <span>Titration Step Ladders ({selectedDrugs.length} Active Infusion{selectedDrugs.length > 1 ? 's' : ''}):</span>
                      </span>
                      <span className="text-[10px] font-normal text-slate-500">
                        Bedside pump rates computed for Pt Wt: {patientWeightKg} kg
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {selectedDrugs.map((drug, dIndex) => {
                        const ladder = generateTitrationLadder({
                          drugAmount: drug.drugAmount,
                          drugUnit: drug.drugUnit,
                          bagVolumeMl: drug.bagVolumeMl,
                          minDose: drug.minDose,
                          maxDose: drug.maxDose,
                          stepDose: drug.stepDose,
                          doseUnit: drug.doseUnit,
                          patientWeightKg: parseFloat(patientWeightKg) || 70,
                        });

                        return (
                          <div
                            key={drug.id || dIndex}
                            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs"
                          >
                            <div className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 dark:text-white">
                                  #{dIndex + 1}. {drug.drugName}
                                </span>
                                {drug.isHighAlert && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold uppercase">
                                    High-Alert
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-mono">
                                <span className="text-slate-500">{ladder.concentrationDisplay}</span>
                                <span className="text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                                  {ladder.minRateMlHr} – {ladder.maxRateMlHr} mL/hr
                                </span>
                              </div>
                            </div>

                            <div className="overflow-x-auto max-h-48 overflow-y-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                                  <tr>
                                    <th className="py-1.5 px-3 w-10 text-center">#</th>
                                    <th className="py-1.5 px-3">Ordered Dose</th>
                                    <th className="py-1.5 px-3 bg-blue-50/80 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 font-extrabold">
                                      Smart Pump Rate (mL/hr)
                                    </th>
                                    <th className="py-1.5 px-3">Hourly Drug Delivery</th>
                                    <th className="py-1.5 px-3 text-center">Bedside Check</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                                  {ladder.steps.map((step) => (
                                    <tr
                                      key={step.stepNumber}
                                      className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                        step.isMin
                                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                                          : step.isMax
                                          ? 'bg-amber-50/40 dark:bg-amber-950/20'
                                          : ''
                                      }`}
                                    >
                                      <td className="py-1.5 px-3 text-center font-mono text-slate-400 font-semibold">
                                        {step.stepNumber}
                                      </td>
                                      <td className="py-1.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                                        <span>{step.dose} {drug.doseUnit}</span>
                                        {step.isMin && (
                                          <span className="ml-1.5 text-[8.5px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                                            Min
                                          </span>
                                        )}
                                        {step.isMax && (
                                          <span className="ml-1.5 text-[8.5px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold uppercase">
                                            Max
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-1.5 px-3 font-mono font-black text-blue-900 dark:text-blue-200 bg-blue-50/50 dark:bg-blue-950/40">
                                        {step.rateMlHr} <span className="text-[10px] font-normal text-blue-600 dark:text-blue-300">mL/hr</span>
                                      </td>
                                      <td className="py-1.5 px-3 font-mono text-slate-600 dark:text-slate-300 text-[10px]">
                                        {step.hourlyDeliveryDisplay}
                                      </td>
                                      <td className="py-1.5 px-3 text-center">
                                        <input
                                          type="checkbox"
                                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Print-Ready Multi-Drug Paper Document (Single Sheet A4 Format Preview) */}
                  {showPaperPreview && (
                    <div
                      id="printable-iv-admin-sheet"
                      className="block p-5 bg-white text-slate-950 border-2 border-slate-300 rounded-xl shadow-lg font-sans text-xs space-y-2 max-w-full"
                    >
                      {renderA4AdminSheetContent()}
                    </div>
                  )}
                </div>
              )}

              {/* SUBMODE A: CONTINUOUS INFUSION */}
              {ivDrugSubMode === 'infusion' && (
                <div className="space-y-4">
                  {/* Preset Drugs Ribbon */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Standard Hospital Infusion Presets:</span>
                      <span className="text-[10px] font-normal text-slate-400">Click to auto-populate concentration</span>
                    </span>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {STANDARD_IV_DRUG_PRESETS.map((preset) => {
                        const isSel = selectedPresetId === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`px-2 py-1 rounded-md border font-medium transition-all ${
                              isSel
                                ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-800 dark:text-blue-200 font-bold shadow-2xs ring-1 ring-blue-500/30'
                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span>{preset.name.split(' ')[0]}</span>
                            {preset.isHighAlert && <span className="text-rose-500 ml-0.5 font-bold">*</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* High Alert Warning Banner if applicable */}
                  {isHighAlert && (
                    <div className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-2 text-rose-900 dark:text-rose-200 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>High-Alert Medication Alert:</strong> Mandatory independent Dual-RN verification on smart pump configuration, drug bag labeling, line tracing, and patient identity.
                      </div>
                    </div>
                  )}

                  {/* Input Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Drug Name & Formulation
                      </label>
                      <input
                        type="text"
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Norepinephrine"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Amount in Bag
                        </label>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            value={drugAmount}
                            onChange={(e) => setDrugAmount(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                          />
                          <select
                            value={drugUnit}
                            onChange={(e) => setDrugUnit(e.target.value as DrugMassUnit)}
                            className="px-1.5 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                          >
                            <option value="mg">mg</option>
                            <option value="mcg">mcg</option>
                            <option value="units">units</option>
                            <option value="g">g</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Bag Vol (mL)
                        </label>
                        <input
                          type="number"
                          value={bagVolumeMl}
                          onChange={(e) => setBagVolumeMl(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                          placeholder="250"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Desired Dose
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={desiredDose}
                          onChange={(e) => setDesiredDose(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Dose Unit
                        </label>
                        <select
                          value={doseUnit}
                          onChange={(e) => setDoseUnit(e.target.value as InfusionDoseRateUnit)}
                          className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        >
                          <option value="mcg/kg/min">mcg/kg/min</option>
                          <option value="mcg/min">mcg/min</option>
                          <option value="mcg/kg/hr">mcg/kg/hr</option>
                          <option value="mcg/hr">mcg/hr</option>
                          <option value="mg/kg/hr">mg/kg/hr</option>
                          <option value="mg/hr">mg/hr</option>
                          <option value="units/kg/hr">units/kg/hr</option>
                          <option value="units/hr">units/hr</option>
                          <option value="units/min">units/min</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-semibold text-slate-700 dark:text-slate-300">
                          Patient Weight (kg)
                        </label>
                        <span className="text-[10px] text-slate-400">
                          ≈ {Math.round((parseFloat(patientWeightKg) || 0) * 2.20462)} lbs
                        </span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={patientWeightKg}
                        onChange={(e) => setPatientWeightKg(e.target.value)}
                        disabled={!doseUnit.includes('/kg/')}
                        className={`w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono ${
                          !doseUnit.includes('/kg/') ? 'opacity-50 cursor-not-allowed' : 'text-slate-900 dark:text-white'
                        }`}
                        placeholder="70"
                      />
                    </div>
                  </div>

                  {/* Infusion Calculation Result Card */}
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/60 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                      Smart Pump Infusion Rate
                    </div>

                    <div className="text-4xl font-extrabold font-mono tracking-tight text-blue-900 dark:text-white">
                      {infusionResult.rateMlHr} <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">mL / hr</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs pt-1 border-t border-blue-200/80 dark:border-blue-800/60 w-full max-w-md">
                      <div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-300 block font-semibold">
                          Final Concentration:
                        </span>
                        <span className="font-mono font-bold">{infusionResult.concentrationDisplay}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-blue-600 dark:text-blue-300 block font-semibold">
                          Total Hourly Delivery:
                        </span>
                        <span className="font-mono font-bold">{infusionResult.hourlyDoseDisplay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dual-RN Checkbox */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <input
                      type="checkbox"
                      id="dual_rn_toggle"
                      checked={includeDualRN}
                      onChange={(e) => setIncludeDualRN(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="dual_rn_toggle" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                      Include Dual-RN bedside verification confirmation in note snippet
                    </label>
                  </div>

                  {/* Insert Snippet Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const weightClause = doseUnit.includes('/kg/') ? `Pt weight: ${patientWeightKg} kg. ` : '';
                      const dualClause = includeDualRN ? 'Dual-RN smart pump independent double-check verified at bedside.' : '';
                      handleInsert(
                        `IV INFUSION: ${drugName} ${drugAmount} ${drugUnit} in ${bagVolumeMl} mL ${diluentName} (${infusionResult.concentrationDisplay}). Infusing @ ${desiredDose} ${doseUnit} (${infusionResult.rateMlHr} mL/hr via smart pump). ${weightClause}${dualClause}`
                      );
                    }}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Inserted IV Infusion Note into Clinical Chart!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Insert Infusion Note ({drugName} @ {infusionResult.rateMlHr} mL/hr)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* SUBMODE B: REVERSE VERIFICATION (mL/hr -> Dose) */}
              {ivDrugSubMode === 'reverse' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Bedside Shift Handoff Verification:</strong> Read the current rate running on the smart pump (mL/hr) to verify the exact clinical dose being delivered to the patient.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Active Smart Pump Rate (mL/hr)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={reverseRateMlHr}
                        onChange={(e) => setReverseRateMlHr(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                        placeholder="15.0"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Target Dose Unit to Verify
                      </label>
                      <select
                        value={doseUnit}
                        onChange={(e) => setDoseUnit(e.target.value as InfusionDoseRateUnit)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      >
                        <option value="mcg/kg/min">mcg/kg/min</option>
                        <option value="mcg/min">mcg/min</option>
                        <option value="mcg/kg/hr">mcg/kg/hr</option>
                        <option value="mcg/hr">mcg/hr</option>
                        <option value="mg/kg/hr">mg/kg/hr</option>
                        <option value="mg/hr">mg/hr</option>
                        <option value="units/kg/hr">units/kg/hr</option>
                        <option value="units/hr">units/hr</option>
                        <option value="units/min">units/min</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Bag Formulation ({drugAmount} {drugUnit} in {bagVolumeMl} mL)
                      </label>
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                        {drugName}: {infusionResult.concentrationDisplay}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Patient Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={patientWeightKg}
                        onChange={(e) => setPatientWeightKg(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Reverse Result Card */}
                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                      Calculated Dose Delivered at Bedside
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-indigo-900 dark:text-white">
                      {reverseDoseResult} <span className="text-lg font-normal">{doseUnit}</span>
                    </div>
                    <div className="text-xs opacity-80">
                      At {reverseRateMlHr} mL/hr with concentration {infusionResult.concentrationDisplay}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleInsert(
                        `IV PUMP VERIFICATION: ${drugName} verified infusing @ ${reverseRateMlHr} mL/hr via smart pump, delivering ${reverseDoseResult} ${doseUnit}. Line labeled, site patent, zero extravasation.`
                      )
                    }
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Inserted Verification Note!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Insert Pump Verification Note ({reverseDoseResult} {doseUnit})</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* SUBMODE C: IV PUSH & VIAL DRAW-UP */}
              {ivDrugSubMode === 'push' && (
                <div className="space-y-4">
                  {/* Common Presets for IV Push */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Common IV Push Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setPushDrugName('Morphine Sulfate');
                          setPushDesiredDose('4');
                          setPushDoseOnHand('10');
                          setPushDoseUnit('mg');
                          setPushVolumeOnHandMl('1');
                          setPushAdminTime('slowly over 2 minutes');
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      >
                        Morphine 4 mg (10 mg/mL)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPushDrugName('Furosemide (Lasix)');
                          setPushDesiredDose('40');
                          setPushDoseOnHand('10');
                          setPushDoseUnit('mg');
                          setPushVolumeOnHandMl('1');
                          setPushAdminTime('slowly over 2 minutes (max 20 mg/min)');
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      >
                        Lasix 40 mg (10 mg/mL)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPushDrugName('Hydromorphone (Dilaudid)');
                          setPushDesiredDose('0.5');
                          setPushDoseOnHand('2');
                          setPushDoseUnit('mg');
                          setPushVolumeOnHandMl('1');
                          setPushAdminTime('slowly over 2–3 minutes');
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      >
                        Dilaudid 0.5 mg (2 mg/mL)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPushDrugName('Ondansetron (Zofran)');
                          setPushDesiredDose('4');
                          setPushDoseOnHand('2');
                          setPushDoseUnit('mg');
                          setPushVolumeOnHandMl('1');
                          setPushAdminTime('over 2 minutes');
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                      >
                        Zofran 4 mg (2 mg/mL)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Drug Name
                      </label>
                      <input
                        type="text"
                        value={pushDrugName}
                        onChange={(e) => setPushDrugName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Prescribed Desired Dose
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={pushDesiredDose}
                          onChange={(e) => setPushDesiredDose(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                        />
                        <select
                          value={pushDoseUnit}
                          onChange={(e) => setPushDoseUnit(e.target.value)}
                          className="px-2 py-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                        >
                          <option value="mg">mg</option>
                          <option value="mcg">mcg</option>
                          <option value="g">g</option>
                          <option value="units">units</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Concentration on Hand (in Vial)
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.01"
                          value={pushDoseOnHand}
                          onChange={(e) => setPushDoseOnHand(e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        />
                        <span className="text-slate-400 font-semibold">{pushDoseUnit} /</span>
                        <input
                          type="number"
                          step="0.1"
                          value={pushVolumeOnHandMl}
                          onChange={(e) => setPushVolumeOnHandMl(e.target.value)}
                          className="w-1/2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        />
                        <span className="text-slate-400 font-semibold">mL</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Injection Push Rate
                      </label>
                      <input
                        type="text"
                        value={pushAdminTime}
                        onChange={(e) => setPushAdminTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. slowly over 2 minutes"
                      />
                    </div>
                  </div>

                  {/* Push Result Card */}
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Volume to Draw Up into Syringe
                    </div>
                    <div className="text-4xl font-extrabold font-mono text-emerald-900 dark:text-white">
                      {ivPushResult.volumeToAdministerMl} <span className="text-xl font-normal">mL</span>
                    </div>
                    <div className="text-xs text-emerald-800 dark:text-emerald-200">
                      Formula: ({pushDesiredDose} {pushDoseUnit} ÷ {pushDoseOnHand} {pushDoseUnit}) × {pushVolumeOnHandMl} mL = {ivPushResult.volumeToAdministerMl} mL
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleInsert(
                        `IV PUSH: Administered ${pushDrugName} ${pushDesiredDose} ${pushDoseUnit} IV push (${ivPushResult.volumeToAdministerMl} mL drawn from ${pushDoseOnHand} ${pushDoseUnit}/${pushVolumeOnHandMl} mL vial) ${pushAdminTime} via patent IV. Flushed with 5 mL NS. Tolerated well without adverse reaction.`
                      )
                    }
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Inserted IV Push Note!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Insert IV Push Note ({pushDrugName}: {ivPushResult.volumeToAdministerMl} mL)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* SUBMODE D: INTERMITTENT IVPB */}
              {ivDrugSubMode === 'ivpb' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Piggyback Medication & Dose
                      </label>
                      <input
                        type="text"
                        value={ivpbDrugName}
                        onChange={(e) => setIvpbDrugName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        placeholder="e.g. Vancomycin 1000 mg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Dose Form / Label
                      </label>
                      <input
                        type="text"
                        value={ivpbDose}
                        onChange={(e) => setIvpbDose(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        placeholder="1000 mg"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Bag Total Volume (mL)
                      </label>
                      <input
                        type="number"
                        value={ivpbBagVolumeMl}
                        onChange={(e) => setIvpbBagVolumeMl(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                        placeholder="250"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Infusion Duration (Minutes)
                      </label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={ivpbMinutes}
                          onChange={(e) => setIvpbMinutes(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
                          placeholder="60"
                        />
                        <button
                          type="button"
                          onClick={() => setIvpbMinutes('60')}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]"
                        >
                          1h
                        </button>
                        <button
                          type="button"
                          onClick={() => setIvpbMinutes('90')}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]"
                        >
                          90m
                        </button>
                        <button
                          type="button"
                          onClick={() => setIvpbMinutes('120')}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[11px]"
                        >
                          2h
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* IVPB Result Card */}
                  <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/60 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 flex flex-col items-center justify-center text-center space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                      Smart Pump Rate for IVPB
                    </div>
                    <div className="text-4xl font-extrabold font-mono text-sky-900 dark:text-white">
                      {ivpbRateResult} <span className="text-xl font-normal">mL / hr</span>
                    </div>
                    <div className="text-xs text-sky-800 dark:text-sky-200">
                      Formula: ({ivpbBagVolumeMl} mL ÷ {ivpbMinutes} min) × 60 = {ivpbRateResult} mL/hr
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleInsert(
                        `IV PIGGYBACK: Initiated ${ivpbDrugName} (${ivpbDose}) in ${ivpbBagVolumeMl} mL infused over ${ivpbMinutes} minutes @ ${ivpbRateResult} mL/hr via primary line secondary port. PIV site patent, dressing clean and dry.`
                      )
                    }
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Inserted IVPB Note!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Insert IVPB Note ({ivpbDrugName} @ {ivpbRateResult} mL/hr)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 1: MAP (MEAN ARTERIAL PRESSURE)
             ========================================================================= */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Systolic BP (SBP mmHg)
                  </label>
                  <input
                    type="number"
                    value={sbp}
                    onChange={(e) => setSbp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Diastolic BP (DBP mmHg)
                  </label>
                  <input
                    type="number"
                    value={dbp}
                    onChange={(e) => setDbp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    placeholder="80"
                  />
                </div>
              </div>

              {/* MAP Result Card */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 transition-colors ${
                  mapResult.status === 'critical_low'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : mapResult.status === 'low'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  Calculated Mean Arterial Pressure
                </div>
                <div className="text-3xl font-extrabold font-mono">
                  {mapResult.map} <span className="text-lg font-normal">mmHg</span>
                </div>
                <div className="text-xs font-medium">
                  {mapResult.message}
                </div>
                <div className="text-[10px] opacity-75 pt-1">
                  Formula: (SBP + 2×DBP) ÷ 3 · Target: ≥ 65 mmHg for adequate organ perfusion
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInsert(`BP: ${sbp}/${dbp} mmHg (MAP: ${mapResult.map} mmHg)`)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inserted into Note!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert into Clinical Note (BP & MAP)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              TAB 2: GRAVITY DRIP RATE
             ========================================================================= */}
          {activeTab === 'drip' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Volume (mL)
                  </label>
                  <input
                    type="number"
                    value={volumeMl}
                    onChange={(e) => setVolumeMl(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time (Hours)
                  </label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tubing Factor
                  </label>
                  <select
                    value={dropFactor}
                    onChange={(e) => setDropFactor(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="10">10 gtts/mL (Macro)</option>
                    <option value="15">15 gtts/mL (Standard)</option>
                    <option value="20">20 gtts/mL (Macro)</option>
                    <option value="60">60 gtts/mL (Micro/Ped)</option>
                  </select>
                </div>
              </div>

              {/* Drip Result */}
              <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 flex flex-col items-center justify-center text-center space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                  Gravity Drip Infusion Rate
                </div>
                <div className="text-3xl font-extrabold font-mono">
                  {dripRateResult} <span className="text-lg font-normal">gtts / min</span>
                </div>
                <div className="text-xs">
                  Equivalent to {Math.round(parseFloat(volumeMl) / (parseFloat(hours) || 1))} mL/hr infusion rate
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleInsert(
                    `IV Infusion: ${volumeMl} mL over ${hours}h @ ${dripRateResult} gtts/min (${Math.round(
                      parseFloat(volumeMl) / (parseFloat(hours) || 1)
                    )} mL/hr)`
                  )
                }
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inserted into Note!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Drip Rate into Note ({dripRateResult} gtts/min)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              TAB 3: TEMPERATURE CONVERSION
             ========================================================================= */}
          {activeTab === 'temp' && (
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Temperature Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={tempVal}
                    onChange={(e) => setTempVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    placeholder="38.0"
                  />
                </div>
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setTempUnit('C')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      tempUnit === 'C'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    °Celsius
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempUnit('F')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      tempUnit === 'F'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    °Fahrenheit
                  </button>
                </div>
              </div>

              {/* Conversion Result */}
              <div
                className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-1.5 transition-colors ${
                  tempResult.isFever
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : tempResult.isHypothermia
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono">
                    {tempResult.c}°C
                  </span>
                  <span className="text-xl text-slate-400">↔</span>
                  <span className="text-2xl font-bold font-mono">
                    {tempResult.f}°F
                  </span>
                </div>
                <div className="text-xs font-medium">
                  {tempResult.isFever
                    ? '🔥 Febrile Spike (≥ 38.0°C / 100.4°F) · Trigger sepsis & culture review'
                    : tempResult.isHypothermia
                    ? '❄️ Hypothermic (< 36.0°C / 96.8°F) · Sepsis or hypothermia alert'
                    : 'Normothermic Range (36.5°C – 37.5°C / 97.7°F – 99.5°F)'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInsert(`Temp: ${tempResult.c}°C (${tempResult.f}°F)`)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inserted into Note!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Temp into Note ({tempResult.c}°C / {tempResult.f}°F)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* =========================================================================
              TAB 4: WEIGHT CONVERSION
             ========================================================================= */}
          {activeTab === 'weight' && (
            <div className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Weight Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightVal}
                    onChange={(e) => setWeightVal(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                    placeholder="150"
                  />
                </div>
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      weightUnit === 'lbs'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Pounds (lbs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      weightUnit === 'kg'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                </div>
              </div>

              {/* Weight Result */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex flex-col items-center justify-center text-center space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold font-mono">
                    {weightResult.kg} kg
                  </span>
                  <span className="text-xl text-slate-400">↔</span>
                  <span className="text-2xl font-bold font-mono">
                    {weightResult.lbs} lbs
                  </span>
                </div>
                <div className="text-xs">
                  Crucial for weight-based medication dosing (mg/kg) & heparin/fluid protocols
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInsert(`Weight: ${weightResult.kg} kg (${weightResult.lbs} lbs)`)}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${theme.primaryBtn}`}
              >
                {copiedSnippet ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Inserted into Note!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Weight into Note ({weightResult.kg} kg / {weightResult.lbs} lbs)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Always independently double-check calculations with hospital smart pumps and pharmacy orders</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Printable IV Portal for direct physical A4 printing without container clipping */}
      {typeof document !== 'undefined' &&
        createPortal(
          <div id="printable-iv-portal" className="bg-white text-slate-950">
            {renderA4AdminSheetContent()}
          </div>,
          document.body
        )}
    </div>
  );
};
