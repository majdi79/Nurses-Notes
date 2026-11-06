/**
 * Clinical Bedside Calculators for Working Nurses
 * 100% Client-side mathematical models adhering to nursing standard practice.
 */

/**
 * Mean Arterial Pressure (MAP)
 * Formula: MAP = (SBP + 2 * DBP) / 3
 * Clinical Target: ≥ 65 mmHg for vital organ perfusion
 */
export function calculateMAP(sbp: number, dbp: number): { map: number; status: 'critical_low' | 'low' | 'normal' | 'high'; message: string } {
  if (isNaN(sbp) || isNaN(dbp) || sbp <= 0 || dbp <= 0) {
    return { map: 0, status: 'normal', message: 'Enter valid SBP and DBP' };
  }
  if (sbp <= dbp) {
    return { map: 0, status: 'critical_low', message: 'Invalid hemodynamics: Systolic (SBP) must be greater than Diastolic (DBP)' };
  }
  const map = Math.round(((sbp + 2 * dbp) / 3) * 10) / 10;
  
  if (map < 60) {
    return { map, status: 'critical_low', message: 'Critical Hypotension (MAP < 60 mmHg) · Risk of acute end-organ hypoperfusion' };
  }
  if (map < 65) {
    return { map, status: 'low', message: 'Sub-target (MAP < 65 mmHg) · Below standard sepsis/hemodynamic resuscitation target' };
  }
  if (map > 110) {
    return { map, status: 'high', message: 'Elevated (MAP > 110 mmHg) · Hypertension surveillance' };
  }
  return { map, status: 'normal', message: 'Normal Perfusion Range (MAP 65–105 mmHg)' };
}

/**
 * Temperature Conversion (°C ↔ °F)
 */
export function convertTemp(val: number, from: 'C' | 'F'): { c: number; f: number; isFever: boolean; isHypothermia: boolean } {
  if (isNaN(val)) return { c: 0, f: 0, isFever: false, isHypothermia: false };
  let c: number;
  let f: number;
  if (from === 'C') {
    c = Math.round(val * 10) / 10;
    f = Math.round(((val * 9) / 5 + 32) * 10) / 10;
  } else {
    f = Math.round(val * 10) / 10;
    c = Math.round((((val - 32) * 5) / 9) * 10) / 10;
  }
  return {
    c,
    f,
    isFever: c >= 38.0,
    isHypothermia: c < 36.0,
  };
}

/**
 * IV Gravity Drip Rate (gtts/min)
 * Formula: Rate = (Volume (mL) * Drop Factor (gtts/mL)) / (Time (hours) * 60)
 */
export function calculateIVDripRate(volumeMl: number, hours: number, dropFactor: number): number {
  if (isNaN(volumeMl) || isNaN(hours) || isNaN(dropFactor) || hours <= 0) return 0;
  const totalMinutes = hours * 60;
  return Math.round((volumeMl * dropFactor) / totalMinutes);
}

/**
 * Weight Conversion (lbs ↔ kg)
 */
export function convertWeight(val: number, from: 'lbs' | 'kg'): { lbs: number; kg: number } {
  if (isNaN(val) || val <= 0) return { lbs: 0, kg: 0 };
  if (from === 'lbs') {
    const kg = Math.round((val / 2.20462) * 10) / 10;
    return { lbs: Math.round(val * 10) / 10, kg };
  }
  const lbs = Math.round((val * 2.20462) * 10) / 10;
  return { lbs, kg: Math.round(val * 10) / 10 };
}

/**
 * Body Mass Index (BMI), Ideal Body Weight (IBW), and Adjusted Body Weight (AdjBW)
 * Adheres to WHO/CDC thresholds and Devine clinical formula.
 */
export type BMICategory =
  | 'underweight_severe'
  | 'underweight_moderate'
  | 'underweight_mild'
  | 'normal'
  | 'overweight'
  | 'obesity_class_1'
  | 'obesity_class_2'
  | 'obesity_class_3';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryLabel: string;
  categoryColor: string;
  badgeBg: string;
  badgeBorder: string;
  clinicalInterpretation: string;
  weightKg: number;
  weightLbs: number;
  heightCm: number;
  heightInches: number;
  heightDisplay: string;
  idealBodyWeightKg: number;
  idealBodyWeightLbs: number;
  adjustedBodyWeightKg: number | null;
  adjustedBodyWeightLbs: number | null;
  healthyWeightRangeKg: { min: number; max: number };
  healthyWeightRangeLbs: { min: number; max: number };
  bmiPrime: number;
}

export function calculateBMI(params: {
  weightVal: number;
  weightUnit: 'kg' | 'lbs';
  heightMode: 'cm' | 'ft_in';
  heightCm?: number;
  heightFeet?: number;
  heightInches?: number;
  sex?: 'male' | 'female';
}): BMIResult {
  const { weightVal, weightUnit, heightMode, heightCm = 0, heightFeet = 0, heightInches = 0, sex = 'male' } = params;

  // Convert weight to kg and lbs
  let weightKg = 0;
  let weightLbs = 0;
  if (!isNaN(weightVal) && weightVal > 0) {
    if (weightUnit === 'kg') {
      weightKg = Math.round(weightVal * 10) / 10;
      weightLbs = Math.round(weightVal * 2.20462 * 10) / 10;
    } else {
      weightLbs = Math.round(weightVal * 10) / 10;
      weightKg = Math.round((weightVal / 2.20462) * 10) / 10;
    }
  }

  // Convert height to cm, meters, and inches
  let totalCm = 0;
  let totalInches = 0;
  let heightDisplay = '';

  if (heightMode === 'cm') {
    totalCm = !isNaN(heightCm) && heightCm > 0 ? heightCm : 0;
    totalInches = Math.round((totalCm / 2.54) * 10) / 10;
    const feet = Math.floor(totalInches / 12);
    const inchesRemainder = Math.round(totalInches % 12);
    heightDisplay = `${totalCm} cm (${feet}'${inchesRemainder}")`;
  } else {
    const feet = !isNaN(heightFeet) && heightFeet >= 0 ? heightFeet : 0;
    const inch = !isNaN(heightInches) && heightInches >= 0 ? heightInches : 0;
    totalInches = feet * 12 + inch;
    totalCm = Math.round(totalInches * 2.54 * 10) / 10;
    heightDisplay = `${feet}'${inch}" (${totalCm} cm)`;
  }

  const heightMeters = totalCm / 100;

  if (weightKg <= 0 || heightMeters <= 0) {
    return {
      bmi: 0,
      category: 'normal',
      categoryLabel: 'Awaiting Height & Weight',
      categoryColor: 'text-slate-500',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeBorder: 'border-slate-300 dark:border-slate-700',
      clinicalInterpretation: 'Enter valid patient height and weight to calculate bedside BMI and dosing body weights.',
      weightKg: 0,
      weightLbs: 0,
      heightCm: 0,
      heightInches: 0,
      heightDisplay: '0 cm',
      idealBodyWeightKg: 0,
      idealBodyWeightLbs: 0,
      adjustedBodyWeightKg: null,
      adjustedBodyWeightLbs: null,
      healthyWeightRangeKg: { min: 0, max: 0 },
      healthyWeightRangeLbs: { min: 0, max: 0 },
      bmiPrime: 0,
    };
  }

  const rawBmi = weightKg / (heightMeters * heightMeters);
  const bmi = Math.round(rawBmi * 10) / 10;
  const bmiPrime = Math.round((bmi / 25.0) * 100) / 100;

  // WHO / CDC Category
  let category: BMICategory = 'normal';
  let categoryLabel = 'Normal Weight';
  let categoryColor = 'text-emerald-700 dark:text-emerald-300';
  let badgeBg = 'bg-emerald-50 dark:bg-emerald-950/50';
  let badgeBorder = 'border-emerald-300 dark:border-emerald-700';
  let clinicalInterpretation = 'Healthy adult weight range (BMI 18.5 – 24.9). Standard clinical and metabolic risk.';

  if (bmi < 16.0) {
    category = 'underweight_severe';
    categoryLabel = 'Severe Underweight (Severe Thinness)';
    categoryColor = 'text-sky-700 dark:text-sky-300';
    badgeBg = 'bg-sky-50 dark:bg-sky-950/60';
    badgeBorder = 'border-sky-300 dark:border-sky-700';
    clinicalInterpretation = 'Severe malnutrition risk. High risk of electrolyte imbalance, refeeding syndrome, and impaired skin integrity.';
  } else if (bmi < 17.0) {
    category = 'underweight_moderate';
    categoryLabel = 'Moderate Underweight';
    categoryColor = 'text-sky-700 dark:text-sky-300';
    badgeBg = 'bg-sky-50 dark:bg-sky-950/60';
    badgeBorder = 'border-sky-300 dark:border-sky-700';
    clinicalInterpretation = 'Moderate underweight. Assess nutritional intake, MUST score, and Braden pressure injury risk.';
  } else if (bmi < 18.5) {
    category = 'underweight_mild';
    categoryLabel = 'Mild Underweight';
    categoryColor = 'text-sky-600 dark:text-sky-400';
    badgeBg = 'bg-sky-50 dark:bg-sky-950/50';
    badgeBorder = 'border-sky-200 dark:border-sky-800';
    clinicalInterpretation = 'Mild underweight. Evaluate clinical nutrition and unintentional weight loss history.';
  } else if (bmi < 25.0) {
    category = 'normal';
    categoryLabel = 'Normal Weight';
    categoryColor = 'text-emerald-700 dark:text-emerald-300';
    badgeBg = 'bg-emerald-50 dark:bg-emerald-950/50';
    badgeBorder = 'border-emerald-300 dark:border-emerald-700';
    clinicalInterpretation = 'Healthy adult weight range (BMI 18.5 – 24.9). Standard physiological and metabolic baseline.';
  } else if (bmi < 30.0) {
    category = 'overweight';
    categoryLabel = 'Overweight (Pre-obese)';
    categoryColor = 'text-amber-700 dark:text-amber-300';
    badgeBg = 'bg-amber-50 dark:bg-amber-950/50';
    badgeBorder = 'border-amber-300 dark:border-amber-700';
    clinicalInterpretation = 'Overweight range (BMI 25.0 – 29.9). Screen for hypertension, glucose intolerance, and obstructive sleep apnea.';
  } else if (bmi < 35.0) {
    category = 'obesity_class_1';
    categoryLabel = 'Obesity Class I';
    categoryColor = 'text-orange-700 dark:text-orange-300';
    badgeBg = 'bg-orange-50 dark:bg-orange-950/50';
    badgeBorder = 'border-orange-300 dark:border-orange-700';
    clinicalInterpretation = 'Obesity Class I (BMI 30.0 – 34.9). Consider Adjusted Body Weight (AdjBW) for hydrophilic medication dosing.';
  } else if (bmi < 40.0) {
    category = 'obesity_class_2';
    categoryLabel = 'Obesity Class II (Severe)';
    categoryColor = 'text-rose-700 dark:text-rose-300';
    badgeBg = 'bg-rose-50 dark:bg-rose-950/50';
    badgeBorder = 'border-rose-300 dark:border-rose-700';
    clinicalInterpretation = 'Obesity Class II (BMI 35.0 – 39.9). Higher airway difficulty, DVT prophylaxis, and specialized bariatric equipment recommended.';
  } else {
    category = 'obesity_class_3';
    categoryLabel = 'Obesity Class III (Morbid)';
    categoryColor = 'text-purple-700 dark:text-purple-300';
    badgeBg = 'bg-purple-50 dark:bg-purple-950/50';
    badgeBorder = 'border-purple-300 dark:border-purple-700';
    clinicalInterpretation = 'Obesity Class III (BMI ≥ 40.0). High airway/intubation risk, specialized dosing protocols, and bariatric pressure ulcer prevention mandatory.';
  }

  // Ideal Body Weight (Devine Formula)
  // Men: 50 kg + 2.3 kg per inch over 5 feet (60 inches)
  // Women: 45.5 kg + 2.3 kg per inch over 5 feet
  const baseIbw = sex === 'female' ? 45.5 : 50.0;
  const inchesOver60 = Math.max(0, totalInches - 60);
  const idealBodyWeightKg = Math.round((baseIbw + 2.3 * inchesOver60) * 10) / 10;
  const idealBodyWeightLbs = Math.round(idealBodyWeightKg * 2.20462 * 10) / 10;

  // Adjusted Body Weight (AdjBW) - clinical threshold when actual weight > 120% of IBW
  let adjustedBodyWeightKg: number | null = null;
  let adjustedBodyWeightLbs: number | null = null;
  if (weightKg > idealBodyWeightKg * 1.2 || bmi >= 30.0) {
    adjustedBodyWeightKg = Math.round((idealBodyWeightKg + 0.4 * (weightKg - idealBodyWeightKg)) * 10) / 10;
    adjustedBodyWeightLbs = Math.round(adjustedBodyWeightKg * 2.20462 * 10) / 10;
  }

  // Healthy Weight Range for this height (BMI 18.5 - 24.9)
  const minHealthyKg = Math.round(18.5 * heightMeters * heightMeters * 10) / 10;
  const maxHealthyKg = Math.round(24.9 * heightMeters * heightMeters * 10) / 10;
  const minHealthyLbs = Math.round(minHealthyKg * 2.20462 * 10) / 10;
  const maxHealthyLbs = Math.round(maxHealthyKg * 2.20462 * 10) / 10;

  return {
    bmi,
    category,
    categoryLabel,
    categoryColor,
    badgeBg,
    badgeBorder,
    clinicalInterpretation,
    weightKg,
    weightLbs,
    heightCm: Math.round(totalCm * 10) / 10,
    heightInches: Math.round(totalInches * 10) / 10,
    heightDisplay,
    idealBodyWeightKg,
    idealBodyWeightLbs,
    adjustedBodyWeightKg,
    adjustedBodyWeightLbs,
    healthyWeightRangeKg: { min: minHealthyKg, max: maxHealthyKg },
    healthyWeightRangeLbs: { min: minHealthyLbs, max: maxHealthyLbs },
    bmiPrime,
  };
}

/* =========================================================================
   IV DRUG INFUSION & DOSING CALCULATIONS
   ========================================================================= */

export type DrugMassUnit = 'mg' | 'mcg' | 'units' | 'mEq' | 'g';
export type InfusionDoseRateUnit =
  | 'mcg/kg/min'
  | 'mcg/min'
  | 'mcg/kg/hr'
  | 'mcg/hr'
  | 'mg/min'
  | 'mg/kg/hr'
  | 'mg/hr'
  | 'units/kg/hr'
  | 'units/hr'
  | 'units/min';

export interface IVDrugPreset {
  id: string;
  name: string;
  defaultDrugAmount: number;
  drugUnit: DrugMassUnit;
  defaultBagVolumeMl: number;
  diluent: string;
  defaultDesiredDose: number;
  doseUnit: InfusionDoseRateUnit;
  requiresWeight: boolean;
  typicalRange: string;
  defaultMinDose: number;
  defaultMaxDose: number;
  defaultStep: number;
  titrationGoal: string;
  routeLine: string;
  isHighAlert: boolean;
  clinicalNotes: string;
}

export const STANDARD_IV_DRUG_PRESETS: IVDrugPreset[] = [
  {
    id: 'norepinephrine',
    name: 'Norepinephrine (Levophed)',
    defaultDrugAmount: 4,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W',
    defaultDesiredDose: 0.08,
    doseUnit: 'mcg/kg/min',
    requiresWeight: true,
    typicalRange: '0.02 – 0.30 mcg/kg/min (titrate for MAP ≥ 65)',
    defaultMinDose: 0.02,
    defaultMaxDose: 0.30,
    defaultStep: 0.02,
    titrationGoal: 'Titrate q2-5m by 0.02 mcg/kg/min to maintain MAP ≥ 65 mmHg',
    routeLine: 'Dedicated Central Venous Catheter lumen preferred',
    isHighAlert: true,
    clinicalNotes: 'First-line vasopressor for septic shock. Central line preferred. Extravasation antidote: Phentolamine.',
  },
  {
    id: 'epinephrine',
    name: 'Epinephrine Infusion',
    defaultDrugAmount: 4,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'NS or D5W',
    defaultDesiredDose: 0.05,
    doseUnit: 'mcg/kg/min',
    requiresWeight: true,
    typicalRange: '0.01 – 0.50 mcg/kg/min',
    defaultMinDose: 0.01,
    defaultMaxDose: 0.20,
    defaultStep: 0.02,
    titrationGoal: 'Titrate q5-10m for hemodynamic stability and MAP ≥ 65 mmHg',
    routeLine: 'Central line preferred (large bore peripheral if emergent)',
    isHighAlert: true,
    clinicalNotes: 'Inotrope and vasopressor for refractory shock or post-resuscitation hemodynamic support.',
  },
  {
    id: 'dopamine',
    name: 'Dopamine',
    defaultDrugAmount: 400,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W',
    defaultDesiredDose: 5,
    doseUnit: 'mcg/kg/min',
    requiresWeight: true,
    typicalRange: '2 – 20 mcg/kg/min',
    defaultMinDose: 2,
    defaultMaxDose: 20,
    defaultStep: 2,
    titrationGoal: 'Titrate q10m for MAP ≥ 65 and adequate perfusion/urine output',
    routeLine: 'Central line strongly recommended (vesicant risk)',
    isHighAlert: true,
    clinicalNotes: 'Monitor continuous ECG for tachyarrhythmias. Vesicant: ensure patent venous access.',
  },
  {
    id: 'dobutamine',
    name: 'Dobutamine',
    defaultDrugAmount: 250,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W',
    defaultDesiredDose: 5,
    doseUnit: 'mcg/kg/min',
    requiresWeight: true,
    typicalRange: '2.5 – 20 mcg/kg/min',
    defaultMinDose: 2.5,
    defaultMaxDose: 20,
    defaultStep: 2.5,
    titrationGoal: 'Titrate q10-15m for cardiac index > 2.2 L/min/m² or ScvO2 ≥ 70%',
    routeLine: 'Peripheral or central IV access (compatible with standard tubing)',
    isHighAlert: true,
    clinicalNotes: 'Inotrope for cardiogenic shock and low cardiac output failure. Monitor for hypotension.',
  },
  {
    id: 'propofol',
    name: 'Propofol (Diprivan)',
    defaultDrugAmount: 1000,
    drugUnit: 'mg',
    defaultBagVolumeMl: 100,
    diluent: 'Premixed Emulsion (10 mg/mL)',
    defaultDesiredDose: 20,
    doseUnit: 'mcg/kg/min',
    requiresWeight: true,
    typicalRange: '5 – 50 mcg/kg/min (ICU sedation)',
    defaultMinDose: 5,
    defaultMaxDose: 50,
    defaultStep: 5,
    titrationGoal: 'Titrate q5m to maintain target RASS -1 to -2 (light sedation)',
    routeLine: 'Dedicated line (do not piggyback other medications)',
    isHighAlert: true,
    clinicalNotes: 'Lipid emulsion: change tubing q12h. Monitor triglyceride levels & Propofol Infusion Syndrome (PRIS).',
  },
  {
    id: 'heparin',
    name: 'Heparin Sodium Infusion',
    defaultDrugAmount: 25000,
    drugUnit: 'units',
    defaultBagVolumeMl: 250,
    diluent: 'D5W (100 units/mL)',
    defaultDesiredDose: 18,
    doseUnit: 'units/kg/hr',
    requiresWeight: true,
    typicalRange: '12 – 25 units/kg/hr (titrate per anti-Xa / aPTT)',
    defaultMinDose: 12,
    defaultMaxDose: 25,
    defaultStep: 2,
    titrationGoal: 'Titrate per facility weight-based protocol to target anti-Xa 0.3-0.7 IU/mL',
    routeLine: 'Dedicated IV pump line (mandatory Dual-RN check)',
    isHighAlert: true,
    clinicalNotes: 'High-Alert: Mandatory Dual-RN verification on smart pump. Monitor platelets for HIT.',
  },
  {
    id: 'insulin_regular',
    name: 'Regular Insulin (Novolin/Humulin R)',
    defaultDrugAmount: 100,
    drugUnit: 'units',
    defaultBagVolumeMl: 100,
    diluent: '0.9% NS (1 unit/mL)',
    defaultDesiredDose: 4,
    doseUnit: 'units/hr',
    requiresWeight: false,
    typicalRange: '0.5 – 10 units/hr (DKA/hyperglycemia protocol)',
    defaultMinDose: 0.5,
    defaultMaxDose: 10,
    defaultStep: 0.5,
    titrationGoal: 'Titrate hourly per blood glucose protocol to target BG 140–180 mg/dL',
    routeLine: 'Dedicated peripheral or central line (waste 20 mL before connecting)',
    isHighAlert: true,
    clinicalNotes: 'High-Alert: Dual-RN verification. Point-of-care blood glucose checked hourly. Monitor potassium.',
  },
  {
    id: 'nicardipine',
    name: 'Nicardipine (Cardene)',
    defaultDrugAmount: 25,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W or NS (0.1 mg/mL)',
    defaultDesiredDose: 5,
    doseUnit: 'mg/hr',
    requiresWeight: false,
    typicalRange: '2.5 – 15 mg/hr (titrate q5-15m by 2.5 mg/hr)',
    defaultMinDose: 2.5,
    defaultMaxDose: 15,
    defaultStep: 2.5,
    titrationGoal: 'Titrate q5-15m by 2.5 mg/hr to target SBP 140–160 mmHg (or order-specific)',
    routeLine: 'Peripheral IV (change peripheral site q12h to prevent phlebitis)',
    isHighAlert: false,
    clinicalNotes: 'Dihydropyridine calcium channel blocker for acute hypertensive emergency and stroke BP control.',
  },
  {
    id: 'nitroglycerin',
    name: 'Nitroglycerin (NTG)',
    defaultDrugAmount: 50,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W or NS (200 mcg/mL)',
    defaultDesiredDose: 20,
    doseUnit: 'mcg/min',
    requiresWeight: false,
    typicalRange: '5 – 100 mcg/min (titrate q3-5m for chest pain/SBP)',
    defaultMinDose: 5,
    defaultMaxDose: 100,
    defaultStep: 10,
    titrationGoal: 'Titrate q3-5m by 5-10 mcg/min for CP 0/10 while maintaining SBP > 90 mmHg',
    routeLine: 'Dedicated non-PVC infusion tubing (polyolefin/glass compatible)',
    isHighAlert: false,
    clinicalNotes: 'Requires non-PVC glass/polyolefin tubing. Contraindicated with PDE-5 inhibitors (e.g. Sildenafil).',
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone Infusion',
    defaultDrugAmount: 450,
    drugUnit: 'mg',
    defaultBagVolumeMl: 250,
    diluent: 'D5W (1.8 mg/mL)',
    defaultDesiredDose: 1,
    doseUnit: 'mg/hr',
    requiresWeight: false,
    typicalRange: '1 mg/min x 6h (33.3 mL/hr), then 0.5 mg/min x 18h (16.7 mL/hr)',
    defaultMinDose: 0.5,
    defaultMaxDose: 1.0,
    defaultStep: 0.25,
    titrationGoal: 'Maintain NSR / ventricular rate control; transition from 1 mg/min to 0.5 mg/min',
    routeLine: 'In-line 0.22 micron filter mandatory; central line preferred if >2 hours',
    isHighAlert: true,
    clinicalNotes: 'In-line 0.22 micron filter mandatory. Central line preferred for infusions >2 hours. Monitor QTc.',
  },
  {
    id: 'vasopressin',
    name: 'Vasopressin (Pitressin)',
    defaultDrugAmount: 20,
    drugUnit: 'units',
    defaultBagVolumeMl: 100,
    diluent: 'NS or D5W (0.2 units/mL)',
    defaultDesiredDose: 0.03,
    doseUnit: 'units/min',
    requiresWeight: false,
    typicalRange: 'Fixed rate 0.03 units/min (9 mL/hr) for septic shock',
    defaultMinDose: 0.01,
    defaultMaxDose: 0.04,
    defaultStep: 0.01,
    titrationGoal: 'Maintain fixed 0.03 units/min (adjunct vasopressor; do not titrate for BP swings)',
    routeLine: 'Dedicated central line access preferred',
    isHighAlert: true,
    clinicalNotes: 'Fixed-dose adjunct vasopressor. Do NOT titrate for routine BP fluctuations.',
  },
];

/**
 * Calculate Infusion Pump Rate (mL/hr) from Desired Dose
 */
export function calculateInfusionRate(params: {
  drugAmount: number;
  drugUnit: DrugMassUnit;
  bagVolumeMl: number;
  desiredDose: number;
  doseUnit: InfusionDoseRateUnit;
  patientWeightKg: number;
}): {
  rateMlHr: number;
  concentrationPerMl: number;
  concentrationDisplay: string;
  hourlyDoseDisplay: string;
} {
  const { drugAmount, drugUnit, bagVolumeMl, desiredDose, doseUnit, patientWeightKg } = params;

  if (
    isNaN(drugAmount) ||
    isNaN(bagVolumeMl) ||
    isNaN(desiredDose) ||
    drugAmount <= 0 ||
    bagVolumeMl <= 0 ||
    desiredDose < 0
  ) {
    return {
      rateMlHr: 0,
      concentrationPerMl: 0,
      concentrationDisplay: '0',
      hourlyDoseDisplay: '0',
    };
  }

  const weight = isNaN(patientWeightKg) || patientWeightKg <= 0 ? 1 : patientWeightKg;

  // Compute Concentration normalized to base units
  // For 'mg', 'mcg', 'g' -> normalize to mcg/mL
  // For 'units' -> units/mL
  // For 'mEq' -> mEq/mL
  let concentrationMcgPerMl = 0;
  let concentrationUnitsPerMl = 0;
  let concentrationMgPerMl = 0;

  if (drugUnit === 'mg') {
    concentrationMgPerMl = drugAmount / bagVolumeMl;
    concentrationMcgPerMl = (drugAmount * 1000) / bagVolumeMl;
  } else if (drugUnit === 'mcg') {
    concentrationMcgPerMl = drugAmount / bagVolumeMl;
    concentrationMgPerMl = drugAmount / 1000 / bagVolumeMl;
  } else if (drugUnit === 'g') {
    concentrationMgPerMl = (drugAmount * 1000) / bagVolumeMl;
    concentrationMcgPerMl = (drugAmount * 1000000) / bagVolumeMl;
  } else if (drugUnit === 'units') {
    concentrationUnitsPerMl = drugAmount / bagVolumeMl;
  }

  let rateMlHr = 0;
  let hourlyDoseDisplay = '';
  let concentrationDisplay = '';

  switch (doseUnit) {
    case 'mcg/kg/min': {
      const mcgPerHour = desiredDose * weight * 60;
      rateMlHr = concentrationMcgPerMl > 0 ? mcgPerHour / concentrationMcgPerMl : 0;
      hourlyDoseDisplay = `${Math.round(mcgPerHour * 10) / 10} mcg/hr (${Math.round((mcgPerHour / 1000) * 100) / 100} mg/hr)`;
      concentrationDisplay = `${Math.round(concentrationMcgPerMl * 100) / 100} mcg/mL`;
      break;
    }
    case 'mcg/min': {
      const mcgPerHour = desiredDose * 60;
      rateMlHr = concentrationMcgPerMl > 0 ? mcgPerHour / concentrationMcgPerMl : 0;
      hourlyDoseDisplay = `${Math.round(mcgPerHour * 10) / 10} mcg/hr`;
      concentrationDisplay = `${Math.round(concentrationMcgPerMl * 100) / 100} mcg/mL`;
      break;
    }
    case 'mcg/kg/hr': {
      const mcgPerHour = desiredDose * weight;
      rateMlHr = concentrationMcgPerMl > 0 ? mcgPerHour / concentrationMcgPerMl : 0;
      hourlyDoseDisplay = `${Math.round(mcgPerHour * 10) / 10} mcg/hr`;
      concentrationDisplay = `${Math.round(concentrationMcgPerMl * 100) / 100} mcg/mL`;
      break;
    }
    case 'mcg/hr': {
      rateMlHr = concentrationMcgPerMl > 0 ? desiredDose / concentrationMcgPerMl : 0;
      hourlyDoseDisplay = `${desiredDose} mcg/hr`;
      concentrationDisplay = `${Math.round(concentrationMcgPerMl * 100) / 100} mcg/mL`;
      break;
    }
    case 'mg/min': {
      const mgPerHour = desiredDose * 60;
      rateMlHr = concentrationMgPerMl > 0 ? mgPerHour / concentrationMgPerMl : 0;
      hourlyDoseDisplay = `${Math.round(mgPerHour * 100) / 100} mg/hr`;
      concentrationDisplay = `${Math.round(concentrationMgPerMl * 1000) / 1000} mg/mL`;
      break;
    }
    case 'mg/kg/hr': {
      const mgPerHour = desiredDose * weight;
      rateMlHr = concentrationMgPerMl > 0 ? mgPerHour / concentrationMgPerMl : 0;
      hourlyDoseDisplay = `${Math.round(mgPerHour * 100) / 100} mg/hr`;
      concentrationDisplay = `${Math.round(concentrationMgPerMl * 1000) / 1000} mg/mL`;
      break;
    }
    case 'mg/hr': {
      rateMlHr = concentrationMgPerMl > 0 ? desiredDose / concentrationMgPerMl : 0;
      hourlyDoseDisplay = `${desiredDose} mg/hr`;
      concentrationDisplay = `${Math.round(concentrationMgPerMl * 1000) / 1000} mg/mL`;
      break;
    }
    case 'units/kg/hr': {
      const unitsPerHour = desiredDose * weight;
      rateMlHr = concentrationUnitsPerMl > 0 ? unitsPerHour / concentrationUnitsPerMl : 0;
      hourlyDoseDisplay = `${Math.round(unitsPerHour * 10) / 10} units/hr`;
      concentrationDisplay = `${Math.round(concentrationUnitsPerMl * 100) / 100} units/mL`;
      break;
    }
    case 'units/hr': {
      rateMlHr = concentrationUnitsPerMl > 0 ? desiredDose / concentrationUnitsPerMl : 0;
      hourlyDoseDisplay = `${desiredDose} units/hr`;
      concentrationDisplay = `${Math.round(concentrationUnitsPerMl * 100) / 100} units/mL`;
      break;
    }
    case 'units/min': {
      const unitsPerHour = desiredDose * 60;
      rateMlHr = concentrationUnitsPerMl > 0 ? unitsPerHour / concentrationUnitsPerMl : 0;
      hourlyDoseDisplay = `${Math.round(unitsPerHour * 10) / 10} units/hr`;
      concentrationDisplay = `${Math.round(concentrationUnitsPerMl * 100) / 100} units/mL`;
      break;
    }
  }

  return {
    rateMlHr: Math.round(rateMlHr * 10) / 10,
    concentrationPerMl: concentrationMcgPerMl || concentrationUnitsPerMl || concentrationMgPerMl,
    concentrationDisplay,
    hourlyDoseDisplay,
  };
}

/**
 * Reverse Infusion Calculator (Smart Pump verification at handoff: mL/hr -> Dose delivered)
 */
export function calculateDoseFromRate(params: {
  drugAmount: number;
  drugUnit: DrugMassUnit;
  bagVolumeMl: number;
  rateMlHr: number;
  doseUnit: InfusionDoseRateUnit;
  patientWeightKg: number;
}): number {
  const { drugAmount, drugUnit, bagVolumeMl, rateMlHr, doseUnit, patientWeightKg } = params;
  if (
    isNaN(drugAmount) ||
    isNaN(bagVolumeMl) ||
    isNaN(rateMlHr) ||
    drugAmount <= 0 ||
    bagVolumeMl <= 0 ||
    rateMlHr <= 0
  ) {
    return 0;
  }
  const weight = isNaN(patientWeightKg) || patientWeightKg <= 0 ? 1 : patientWeightKg;

  let concentrationMcgPerMl = 0;
  let concentrationUnitsPerMl = 0;
  let concentrationMgPerMl = 0;

  if (drugUnit === 'mg') {
    concentrationMgPerMl = drugAmount / bagVolumeMl;
    concentrationMcgPerMl = (drugAmount * 1000) / bagVolumeMl;
  } else if (drugUnit === 'mcg') {
    concentrationMcgPerMl = drugAmount / bagVolumeMl;
    concentrationMgPerMl = drugAmount / 1000 / bagVolumeMl;
  } else if (drugUnit === 'g') {
    concentrationMgPerMl = (drugAmount * 1000) / bagVolumeMl;
    concentrationMcgPerMl = (drugAmount * 1000000) / bagVolumeMl;
  } else if (drugUnit === 'units') {
    concentrationUnitsPerMl = drugAmount / bagVolumeMl;
  }

  let dose = 0;
  switch (doseUnit) {
    case 'mcg/kg/min': {
      const mcgPerHour = rateMlHr * concentrationMcgPerMl;
      dose = mcgPerHour / 60 / weight;
      break;
    }
    case 'mcg/min': {
      const mcgPerHour = rateMlHr * concentrationMcgPerMl;
      dose = mcgPerHour / 60;
      break;
    }
    case 'mcg/kg/hr': {
      const mcgPerHour = rateMlHr * concentrationMcgPerMl;
      dose = mcgPerHour / weight;
      break;
    }
    case 'mcg/hr': {
      dose = rateMlHr * concentrationMcgPerMl;
      break;
    }
    case 'mg/min': {
      const mgPerHour = rateMlHr * concentrationMgPerMl;
      dose = mgPerHour / 60;
      break;
    }
    case 'mg/kg/hr': {
      const mgPerHour = rateMlHr * concentrationMgPerMl;
      dose = mgPerHour / weight;
      break;
    }
    case 'mg/hr': {
      dose = rateMlHr * concentrationMgPerMl;
      break;
    }
    case 'units/kg/hr': {
      const unitsPerHour = rateMlHr * concentrationUnitsPerMl;
      dose = unitsPerHour / weight;
      break;
    }
    case 'units/hr': {
      dose = rateMlHr * concentrationUnitsPerMl;
      break;
    }
    case 'units/min': {
      const unitsPerHour = rateMlHr * concentrationUnitsPerMl;
      dose = unitsPerHour / 60;
      break;
    }
  }

  return Math.round(dose * 100) / 100;
}

/**
 * IV Push & Vial Draw-Up Calculator
 * Formula: Volume (mL) = (Desired Dose / Dose on Hand) * Volume on Hand (mL)
 */
export function calculateIVPushVolume(params: {
  desiredDose: number;
  doseOnHand: number;
  volumeOnHandMl: number;
}): { volumeToAdministerMl: number } {
  const { desiredDose, doseOnHand, volumeOnHandMl } = params;
  if (
    isNaN(desiredDose) ||
    isNaN(doseOnHand) ||
    isNaN(volumeOnHandMl) ||
    desiredDose <= 0 ||
    doseOnHand <= 0 ||
    volumeOnHandMl <= 0
  ) {
    return { volumeToAdministerMl: 0 };
  }
  const volume = (desiredDose / doseOnHand) * volumeOnHandMl;
  return { volumeToAdministerMl: Math.round(volume * 100) / 100 };
}

/**
 * Intermittent IVPB Infusion Rate (mL/hr)
 * Formula: Rate (mL/hr) = (Bag Volume mL / Infusion Time in Minutes) * 60
 */
export function calculateIntermittentIVPBRate(bagVolumeMl: number, infusionMinutes: number): number {
  if (isNaN(bagVolumeMl) || isNaN(infusionMinutes) || bagVolumeMl <= 0 || infusionMinutes <= 0) {
    return 0;
  }
  return Math.round((bagVolumeMl / infusionMinutes) * 60 * 10) / 10;
}

/* =========================================================================
   TITRATION LADDER & PRINT-READY PATIENT ADMINISTRATION SHEET
   ========================================================================= */

export interface TitrationLadderStep {
  stepNumber: number;
  dose: number;
  doseDisplay: string;
  rateMlHr: number;
  hourlyDeliveryDisplay: string;
  isMin: boolean;
  isMax: boolean;
}

export interface TitrationLadderResult {
  steps: TitrationLadderStep[];
  minRateMlHr: number;
  maxRateMlHr: number;
  concentrationDisplay: string;
  doseUnit: InfusionDoseRateUnit;
}

/**
 * Generate a step-by-step titration ladder from Min Dose to Max Dose
 * with corresponding smart pump rates (mL/hr) and hourly delivery amounts.
 */
export function generateTitrationLadder(params: {
  drugAmount: number;
  drugUnit: DrugMassUnit;
  bagVolumeMl: number;
  minDose: number;
  maxDose: number;
  stepDose?: number;
  doseUnit: InfusionDoseRateUnit;
  patientWeightKg: number;
}): TitrationLadderResult {
  const { drugAmount, drugUnit, bagVolumeMl, minDose, maxDose, stepDose, doseUnit, patientWeightKg } = params;

  if (
    isNaN(drugAmount) ||
    isNaN(bagVolumeMl) ||
    isNaN(minDose) ||
    isNaN(maxDose) ||
    drugAmount <= 0 ||
    bagVolumeMl <= 0 ||
    minDose < 0 ||
    maxDose <= 0
  ) {
    return {
      steps: [],
      minRateMlHr: 0,
      maxRateMlHr: 0,
      concentrationDisplay: '0',
      doseUnit,
    };
  }

  const low = Math.min(minDose, maxDose);
  const high = Math.max(minDose, maxDose);

  // Determine titration step
  let step = stepDose && !isNaN(stepDose) && stepDose > 0 ? stepDose : 0;
  const span = high - low;

  if (step === 0 || span / step > 16 || span / step < 1) {
    // Automatically determine clinically rational increments
    if (span <= 0.1) {
      step = 0.01;
    } else if (span <= 0.5) {
      step = 0.02;
    } else if (span <= 1.5) {
      step = 0.1;
    } else if (span <= 5) {
      step = 0.5;
    } else if (span <= 20) {
      step = 2;
    } else if (span <= 50) {
      step = 5;
    } else {
      step = 10;
    }
  }

  const doses: number[] = [];
  const precision = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 2 : 1;
  const mult = Math.pow(10, precision);

  let cur = low;
  while (Math.round(cur * mult) / mult < Math.round(high * mult) / mult) {
    doses.push(Math.round(cur * mult) / mult);
    cur += step;
  }
  // Ensure the high boundary is always explicitly present
  const highRounded = Math.round(high * mult) / mult;
  if (!doses.includes(highRounded)) {
    doses.push(highRounded);
  }

  const steps: TitrationLadderStep[] = doses.map((d, index) => {
    const calc = calculateInfusionRate({
      drugAmount,
      drugUnit,
      bagVolumeMl,
      desiredDose: d,
      doseUnit,
      patientWeightKg,
    });
    return {
      stepNumber: index + 1,
      dose: d,
      doseDisplay: `${d} ${doseUnit}`,
      rateMlHr: calc.rateMlHr,
      hourlyDeliveryDisplay: calc.hourlyDoseDisplay,
      isMin: index === 0,
      isMax: index === doses.length - 1,
    };
  });

  const firstStep = steps[0];
  const lastStep = steps[steps.length - 1];

  const sampleCalc = calculateInfusionRate({
    drugAmount,
    drugUnit,
    bagVolumeMl,
    desiredDose: low,
    doseUnit,
    patientWeightKg,
  });

  return {
    steps,
    minRateMlHr: firstStep ? firstStep.rateMlHr : 0,
    maxRateMlHr: lastStep ? lastStep.rateMlHr : 0,
    concentrationDisplay: sampleCalc.concentrationDisplay,
    doseUnit,
  };
}

/**
 * Format a complete clinical Bedside IV Medication Administration & Titration Record
 * for printing and copying directly into patient EHR documentation.
 */
export function formatPrintReadyAdminSheetText(params: {
  drugName: string;
  drugAmount: number;
  drugUnit: DrugMassUnit;
  bagVolumeMl: number;
  diluent: string;
  doseUnit: InfusionDoseRateUnit;
  minDose: number;
  maxDose: number;
  stepDose?: number;
  patientWeightKg: number;
  bedLabel?: string;
  titrationGoal?: string;
  routeLine?: string;
  isHighAlert?: boolean;
}): string {
  const ladder = generateTitrationLadder(params);
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = new Date().toISOString().slice(0, 10);
  const isWeightBased = params.doseUnit.includes('/kg/');

  const lines: string[] = [
    '========================================================================',
    '       BEDSIDE IV MEDICATION ADMINISTRATION & TITRATION RECORD          ',
    '========================================================================',
    `Patient Location: ${params.bedLabel || 'Bedside Unit'}       Date: ${dateStr}   Time: ${now}`,
    `Patient Weight: ${params.patientWeightKg} kg (${Math.round(params.patientWeightKg * 2.20462)} lbs) ${
      isWeightBased ? '[WEIGHT-BASED CALCULATION]' : '[FIXED DOSE]'
    }`,
    `Medication: ${params.drugName} ${params.isHighAlert ? '*** HIGH-ALERT MEDICATION ***' : ''}`,
    `Bag Formulation: ${params.drugAmount} ${params.drugUnit} in ${params.bagVolumeMl} mL ${params.diluent} (${ladder.concentrationDisplay})`,
    `Ordered Range: ${params.minDose} – ${params.maxDose} ${params.doseUnit}`,
    `Smart Pump Rate Range: ${ladder.minRateMlHr} – ${ladder.maxRateMlHr} mL/hr`,
    `Route / Access: ${params.routeLine || 'Dedicated IV line'}`,
    `Titration Goal: ${params.titrationGoal || 'Titrate to clinical objective per order'}`,
    '------------------------------------------------------------------------',
    'STEP | ORDERED DOSE         | PUMP RATE (mL/hr) | HOURLY DELIVERY   | RN SIGN',
    '------------------------------------------------------------------------',
  ];

  ladder.steps.forEach((s) => {
    const stepStr = String(s.stepNumber).padStart(4, ' ');
    const doseStr = s.doseDisplay.padEnd(20, ' ');
    const rateStr = `${s.rateMlHr} mL/hr`.padEnd(17, ' ');
    const hourlyStr = s.hourlyDeliveryDisplay.padEnd(17, ' ');
    const flag = s.isMin ? ' [MIN]' : s.isMax ? ' [MAX]' : '';
    lines.push(`${stepStr} | ${doseStr} | ${rateStr} | ${hourlyStr} | [   ]${flag}`);
  });

  lines.push(
    '------------------------------------------------------------------------',
    'CRITICAL SAFETY SAFEGUARDS & DUAL-RN INDEPENDENT VERIFICATION:',
    '[ ] Patient identity verified with 2 identifiers against eMAR order',
    '[ ] Dedicated infusion line labeled; verified patent with blood return',
    '[ ] Smart pump drug library guardrails selected & rate cross-checked',
    '',
    'Primary Administering RN: _____________________  Initials: _____  Time: ____',
    'Dual-RN Independent Co-Signer: ________________  Initials: _____  Time: ____',
    '========================================================================'
  );

  return lines.join('\n');
}

export interface SelectedIVDrugItem {
  id: string;
  presetId?: string;
  drugName: string;
  drugAmount: number;
  drugUnit: DrugMassUnit;
  bagVolumeMl: number;
  diluent: string;
  minDose: number;
  maxDose: number;
  stepDose: number;
  doseUnit: InfusionDoseRateUnit;
  titrationGoal: string;
  routeLine: string;
  isHighAlert: boolean;
}

/**
 * Format a multi-drug IV Medication Administration & Titration Record
 * for printing and copying all selected concurrent infusions into patient EHR documentation.
 */
export function formatMultiDrugPrintReadyAdminSheetText(params: {
  drugs: SelectedIVDrugItem[];
  patientWeightKg: number;
  bedLabel?: string;
}): string {
  const { drugs, patientWeightKg, bedLabel } = params;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = new Date().toISOString().slice(0, 10);

  const lines: string[] = [
    '========================================================================',
    '    BEDSIDE IV MEDICATION ADMINISTRATION RECORD · MULTI-INFUSION SHEET   ',
    '========================================================================',
    `Patient Location: ${bedLabel || 'Bedside Unit'}       Date: ${dateStr}   Time: ${now}`,
    `Patient Weight: ${patientWeightKg} kg (${Math.round(patientWeightKg * 2.20462)} lbs) · Active Infusions: ${drugs.length}`,
    '========================================================================',
  ];

  drugs.forEach((drug, idx) => {
    const ladder = generateTitrationLadder({
      drugAmount: drug.drugAmount,
      drugUnit: drug.drugUnit,
      bagVolumeMl: drug.bagVolumeMl,
      minDose: drug.minDose,
      maxDose: drug.maxDose,
      stepDose: drug.stepDose,
      doseUnit: drug.doseUnit,
      patientWeightKg,
    });

    lines.push(
      '',
      `[INFUSION #${idx + 1}] ${drug.drugName} ${drug.isHighAlert ? '*** HIGH-ALERT ***' : ''}`,
      `Bag: ${drug.drugAmount} ${drug.drugUnit} in ${drug.bagVolumeMl} mL ${drug.diluent} (${ladder.concentrationDisplay})`,
      `Ordered Span: ${drug.minDose} – ${drug.maxDose} ${drug.doseUnit}  ==>  Pump Rate: ${ladder.minRateMlHr} – ${ladder.maxRateMlHr} mL/hr`,
      `Route: ${drug.routeLine || 'Dedicated IV Lumen'} | Goal: ${drug.titrationGoal || 'Per protocol'}`,
      '------------------------------------------------------------------------',
      'STEP | DOSE                | PUMP RATE (mL/hr) | HOURLY DELIVERY | SIGN',
      '------------------------------------------------------------------------'
    );

    ladder.steps.forEach((s) => {
      const stepStr = String(s.stepNumber).padStart(4, ' ');
      const doseStr = s.doseDisplay.padEnd(19, ' ');
      const rateStr = `${s.rateMlHr} mL/hr`.padEnd(17, ' ');
      const hourlyStr = s.hourlyDeliveryDisplay.padEnd(15, ' ');
      const flag = s.isMin ? ' [MIN]' : s.isMax ? ' [MAX]' : '';
      lines.push(`${stepStr} | ${doseStr} | ${rateStr} | ${hourlyStr} | [  ]${flag}`);
    });
  });

  lines.push(
    '',
    '------------------------------------------------------------------------',
    'CRITICAL SAFETY SAFEGUARDS & DUAL-RN INDEPENDENT VERIFICATION:',
    '[ ] Patient identity verified with 2 identifiers against eMAR order',
    '[ ] All dedicated infusion lines labeled & line-traced to patient catheter',
    '[ ] Smart pump drug library guardrails selected & rate cross-checked',
    '',
    'Primary Administering RN: _____________________  Initials: _____  Time: ____',
    'Dual-RN Independent Co-Signer: ________________  Initials: _____  Time: ____',
    '========================================================================'
  );

  return lines.join('\n');
}


