export interface ReferenceItem {
  title: string;
  category: string;
  content: string;
  rules?: { do: string; dont: string; reason: string }[];
}

export const DO_NOT_USE_ABBREVIATIONS = [
  {
    dont: 'U, u (unit)',
    do: 'Write "unit"',
    reason: 'Mistaken for "0" (zero), the number "4" (four), or "cc"',
  },
  {
    dont: 'IU (International Unit)',
    do: 'Write "International Unit"',
    reason: 'Mistaken for IV (intravenous) or the number 10 (ten)',
  },
  {
    dont: 'Q.D., QD, q.d., qd (daily)',
    do: 'Write "daily"',
    reason: 'Mistaken for each other, Q.O.D., or "qid"',
  },
  {
    dont: 'Q.O.D., QOD, q.o.d., qod',
    do: 'Write "every other day"',
    reason: 'Period after the O is mistaken for I and the O is mistaken for D ("qid")',
  },
  {
    dont: 'Trailing zero (X.0 mg)',
    do: 'Write "X mg" (e.g. 5 mg)',
    reason: 'Decimal point is missed, leading to 10-fold overdose (5.0 mg read as 50 mg)',
  },
  {
    dont: 'Lack of leading zero (.X mg)',
    do: 'Write "0.X mg" (e.g. 0.5 mg)',
    reason: 'Decimal point is missed, leading to 10-fold overdose (.5 mg read as 5 mg)',
  },
  {
    dont: 'MS, MSO4, MgSO4',
    do: 'Write "morphine sulfate" or "magnesium sulfate"',
    reason: 'Can mean either morphine sulfate or magnesium sulfate; high-risk fatal confusion',
  },
];

export const CHARTING_FRAMEWORKS = [
  {
    name: 'DAR / Focus Charting',
    bestFor: 'Targeted events, acute changes, specific interventions, and response documentation.',
    sections: [
      { key: 'D (Data)', desc: 'Subjective and objective information reflecting the focus problem, vital signs, or observed symptoms.' },
      { key: 'A (Action)', desc: 'Immediate nursing interventions, treatments administered, provider notifications, or diagnostic tests run.' },
      { key: 'R (Response)', desc: 'Patient evaluation, symptom resolution, vitals recovery, and tolerance of intervention.' },
    ],
  },
  {
    name: 'SOAP / SOAPIE',
    bestFor: 'Multidisciplinary progress notes, admission baseline assessments, and holistic clinical problem tracking.',
    sections: [
      { key: 'S (Subjective)', desc: 'What the patient, family, or caregiver reports in their own words (symptoms, complaints).' },
      { key: 'O (Objective)', desc: 'Observable, measurable clinical data (vital signs, physical exam findings, lab/rad results).' },
      { key: 'A (Assessment)', desc: 'Nursing diagnosis, analysis of clinical progress, or stability evaluation.' },
      { key: 'P (Plan)', desc: 'Short- and long-term nursing actions, upcoming tests, reassessments, and consultation.' },
    ],
  },
  {
    name: 'SBAR Communication',
    bestFor: 'Escalations, provider phone calls, rapid response calls, and shift-to-shift handoff.',
    sections: [
      { key: 'S (Situation)', desc: 'Who you are, unit/bed, patient name, and immediate critical reason for the call.' },
      { key: 'B (Background)', desc: 'Admitting diagnosis, relevant clinical history, baseline status, and pertinent medications.' },
      { key: 'A (Assessment)', desc: 'Current vital signs, physical exam changes, critical lab results, and your clinical concern.' },
      { key: 'R (Recommendation)', desc: 'What specific action or order you require (e.g., bedside exam, transfer, medication order).' },
    ],
  },
];
