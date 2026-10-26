export interface VariableField {
  id: string;
  label: string;
  defaultValue: string;
  options?: string[];
  type?: 'text' | 'select' | 'number';
}

export interface NoteFormatContent {
  dar: {
    data: string;
    action: string;
    response: string;
  };
  soap: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  narrative: string;
  concise: string;
}

export interface NoteTemplate {
  id: string;
  title: string;
  category: 'routine' | 'vascular' | 'wound' | 'respiratory' | 'gigu' | 'emergency' | 'custom';
  categoryLabel: string;
  description: string;
  tags: string[];
  isCustom?: boolean;
  isModified?: boolean;
  isProcedure?: boolean;
  procedureCategory?: 'vascular' | 'respiratory' | 'gigu' | 'wound' | 'periop' | 'emergency' | 'bedside' | 'cardiac';
  procedureCategoryLabel?: string;
  procedureBadges?: string[];
  fields: VariableField[];
  formats: NoteFormatContent;
}

export const CATEGORIES = [
  { id: 'all', label: 'All Templates' },
  { id: 'routine', label: 'Routine & Assessments' },
  { id: 'vascular', label: 'Vascular & Infusions' },
  { id: 'wound', label: 'Wound & Skin Care' },
  { id: 'respiratory', label: 'Respiratory & Suctioning' },
  { id: 'gigu', label: 'GI & Genitourinary' },
  { id: 'emergency', label: 'Situational & Emergent' },
  { id: 'custom', label: 'My Custom Notes' },
] as const;

export interface ProcedureCategoryDef {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  iconType: 'all' | 'vascular' | 'respiratory' | 'gigu' | 'wound' | 'periop' | 'emergency' | 'bedside' | 'cardiac';
}

export const PROCEDURE_CATEGORIES: ProcedureCategoryDef[] = [
  {
    id: 'all_procedures',
    label: 'All Bedside Procedures',
    shortLabel: 'All Procedures',
    description: 'Complete categorized index of sterile and bedside clinical nursing procedures',
    iconType: 'all',
  },
  {
    id: 'vascular',
    label: 'Vascular Access & Infusion Procedures',
    shortLabel: 'Vascular & Lines',
    description: 'PIV starts/removals, CVAD/PICC sterile dressings, port access, blood transfusions & blood cultures',
    iconType: 'vascular',
  },
  {
    id: 'respiratory',
    label: 'Airway, Suctioning & Pleural Procedures',
    shortLabel: 'Airway & Suctioning',
    description: 'Tracheostomy care, closed inline suction, chest tube setup, VAP bundles & vent weaning protocols',
    iconType: 'respiratory',
  },
  {
    id: 'gigu',
    label: 'GI, Enteral & Genitourinary Procedures',
    shortLabel: 'GI & GU Tubes',
    description: 'Nasogastric (NG/OG) insertion & verification, Foley catheter sterile insertion & voiding trials',
    iconType: 'gigu',
  },
  {
    id: 'wound',
    label: 'Wound, Packing & Drain Procedures',
    shortLabel: 'Wound & Surgical Care',
    description: 'Comprehensive staging, negative pressure VAC, cavity ribbon packing & surgical JP/Hemovac drains',
    iconType: 'wound',
  },
  {
    id: 'periop',
    label: 'Perioperative & Recovery Procedures',
    shortLabel: 'Perioperative & PACU',
    description: 'Universal Protocol pre-op safety verification checklists and PACU Phase I Aldrete recovery scoring',
    iconType: 'periop',
  },
  {
    id: 'emergency',
    label: 'Emergency & Resuscitation Procedures',
    shortLabel: 'Emergency & ACLS',
    description: 'Mega Code resuscitation logs, post-ROSC targeted temperature management & rapid escalation',
    iconType: 'emergency',
  },
  {
    id: 'bedside',
    label: 'Bedside Invasive Procedure Assist',
    shortLabel: 'Bedside Invasive Assist',
    description: 'Thoracentesis, paracentesis, lumbar puncture assists, JCAHO Time-Out & sterile specimen custody',
    iconType: 'bedside',
  },
  {
    id: 'cardiac',
    label: 'Cardiac & Interventional Procedures',
    shortLabel: 'Cardiac & Interventional',
    description: 'Synchronized cardioversion assist, TEE assist, pre/post coronary angiogram & cath recovery',
    iconType: 'cardiac',
  },
];

export function isTemplateProcedure(tpl: NoteTemplate): boolean {
  if (tpl.isProcedure !== undefined) return tpl.isProcedure;
  const procedureIds = [
    'vascular-piv-insertion',
    'vascular-piv-removal',
    'vascular-cvad-dressing',
    'vascular-blood-transfusion',
    'wound-surgical-dressing',
    'wound-drain-care',
    'wound-comprehensive-assessment',
    'wound-complex-packing-vac',
    'resp-trach-care',
    'resp-oral-suctioning',
    'resp-endotracheal-suctioning',
    'resp-nasopharyngeal-suctioning',
    'resp-inline-vent-suction',
    'resp-mech-vent-care-vap',
    'resp-vent-weaning-sbt',
    'gigu-foley-insertion',
    'gigu-foley-removal',
    'emergency-mega-code-acls',
    'emergency-post-cardiac-arrest-rosc',
    'perioperative-preop-checklist',
    'perioperative-postop-pacu',
    'gigu-ng-tube-insertion',
    'bedside-invasive-procedure-assist',
    'vascular-blood-cultures',
    'resp-chest-tube-management',
    'vascular-portacath-access',
    'cardiac-cardioversion-assist',
    'cardiac-tee-assist',
    'cardiac-pre-angiogram',
    'cardiac-post-angiogram',
    'cardiac-acute-chest-pain',
    'resp-acute-dyspnea',
  ];
  return procedureIds.includes(tpl.id) || tpl.tags.some((t) => t.toLowerCase().includes('procedure'));
}

export function getTemplateProcedureCategory(tpl: NoteTemplate): 'vascular' | 'respiratory' | 'gigu' | 'wound' | 'periop' | 'emergency' | 'bedside' | 'cardiac' {
  if (tpl.procedureCategory) return tpl.procedureCategory;
  if (tpl.id.startsWith('cardiac-') || tpl.id.includes('cardioversion') || tpl.id.includes('tee-') || tpl.id.includes('angiogram') || tpl.id.includes('chest-pain')) return 'cardiac';
  if (tpl.id.startsWith('vascular-') || tpl.id.includes('blood-culture') || tpl.id.includes('portacath')) return 'vascular';
  if (tpl.id.startsWith('resp-') || tpl.id.includes('suction') || tpl.id.includes('trach') || tpl.id.includes('vent') || tpl.id.includes('chest-tube') || tpl.id.includes('dyspnea')) return 'respiratory';
  if (tpl.id.startsWith('gigu-') || tpl.id.includes('foley') || tpl.id.includes('ng-tube')) return 'gigu';
  if (tpl.id.startsWith('wound-') || tpl.id.includes('packing') || tpl.id.includes('vac') || tpl.id.includes('drain')) return 'wound';
  if (tpl.id.startsWith('perioperative-') || tpl.id.includes('preop') || tpl.id.includes('pacu') || tpl.id.includes('postop')) return 'periop';
  if (tpl.id.startsWith('emergency-') || tpl.id.includes('mega-code') || tpl.id.includes('rosc')) return 'emergency';
  return 'bedside';
}


export const INITIAL_TEMPLATES: NoteTemplate[] = [
  // 1. ROUTINE: Shift Head-to-Toe Assessment
  {
    id: 'routine-head-to-toe',
    title: 'Adult Comprehensive Shift Assessment',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Systematic head-to-toe baseline physical assessment for routine shift documentation.',
    tags: ['assessment', 'shift note', 'routine', 'head-to-toe', 'med-surg'],
    fields: [
      { id: 'time', label: 'Shift Time', defaultValue: '07:30', options: ['07:30', '11:00', '15:30', '19:30', '23:00', '03:30'] },
      { id: 'neuro', label: 'Neurological', defaultValue: 'Alert, oriented x 4. PERRLA 3mm. Speech clear. Motor strength 5/5 bilaterally.', options: ['Alert, oriented x 4. PERRLA 3mm. Speech clear. Motor strength 5/5 bilaterally.', 'Alert, oriented x 3 (confused to date). Follows commands.', 'Lethargic, arousable to verbal stimuli. PERRL 3mm brisk.'] },
      { id: 'cardiac', label: 'Cardiovascular', defaultValue: 'S1/S2 regular, no murmurs. Peripheral pulses 2+ radial and pedal bilaterally. Cap refill < 2 sec. No peripheral edema.', options: ['S1/S2 regular, no murmurs. Peripheral pulses 2+ radial and pedal bilaterally. Cap refill < 2 sec. No peripheral edema.', 'Telemetry shows NSR. Pulses 2+ bilaterally. 1+ pitting edema to lower extremities bilaterally.', 'Sinus tachycardia. Pulses 2+. Denies chest tightness.'] },
      { id: 'resp', label: 'Respiratory', defaultValue: 'Lungs clear to auscultation bilaterally in all fields. Breathing unlabored on room air. SpO2 98%.', options: ['Lungs clear to auscultation bilaterally in all fields. Breathing unlabored on room air. SpO2 98%.', 'Diminished breath sounds at bilateral bases. SpO2 96% on 2L NC. Non-productive cough.', 'Fine inspiratory crackles to lower lobes. SpO2 94% on room air.'] },
      { id: 'gigu', label: 'GI / GU', defaultValue: 'Abdomen soft, non-distended, non-tender. Normoactive bowel sounds x 4 quadrants. Tolerating regular diet. Voiding clear yellow urine without dysuria.', options: ['Abdomen soft, non-distended, non-tender. Normoactive bowel sounds x 4 quadrants. Tolerating regular diet. Voiding clear yellow urine without dysuria.', 'Abdomen soft, mild tenderness to lower quadrants. Bowel sounds hypoactive. Last BM yesterday. Voiding via Foley catheter draining clear amber.', 'NPO with NG tube to low intermittent suction. Bowel sounds sluggish.'] },
      { id: 'skin', label: 'Integumentary', defaultValue: 'Skin warm, dry, intact throughout. Braden score 19 (low risk). Surgical dressing dry and intact.', options: ['Skin warm, dry, intact throughout. Braden score 19 (low risk).', 'Skin intact. Mild erythema over sacrum, blanchable. Barrier cream applied.', 'Integument intact, pale, dry. Moisture-associated skin care maintained.'] },
      { id: 'pain', label: 'Pain Score', defaultValue: '0/10, denies pain', options: ['0/10, denies pain', '2/10 dull ache, acceptable to patient', '4/10 incision pain, medication offered'] },
      { id: 'safety', label: 'Safety & Precautions', defaultValue: 'Call light within reach, bed in lowest position, 2 upper side rails up, clutter-free path.', options: ['Call light within reach, bed in lowest position, 2 upper side rails up, clutter-free path.', 'Fall precautions maintained, yellow wristband on, bed alarm active.', 'Bed alarm active, non-skid socks on, assist x 1 for ambulation.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed patient at {time}. Neuro: {neuro}. CV: {cardiac}. Resp: {resp}. GI/GU: {gigu}. Skin: {skin}. Reported pain: {pain}.',
        action: 'Maintained fall precautions. {safety}. Encouraged incentive spirometry and hydration as tolerated. Repositioned for comfort.',
        response: 'Patient verbalized understanding of care plan and safety measures. Resting comfortably without acute distress.',
      },
      soap: {
        subjective: 'Patient denies acute discomfort. Reports rested night. Current pain rating: {pain}.',
        objective: 'Assessment at {time}: Neuro: {neuro}. CV: {cardiac}. Pulmonary: {resp}. GI/GU: {gigu}. Integumentary: {skin}. Safety status: {safety}.',
        assessment: 'Stable clinical baseline. Hemodynamically stable, lungs clear, no acute neurological or physiological deficits noted.',
        plan: 'Continue shift care routine, monitor vitals q4h, reinforce bedside safety, assist with ADLs as needed, administer scheduled medications.',
      },
      narrative: 'At {time}, comprehensive baseline shift assessment performed. Neurological: {neuro}. Cardiovascular: {cardiac}. Respiratory: {resp}. GI/GU: {gigu}. Integumentary: {skin}. Pain assessed at {pain}. {safety}. Patient resting comfortably in no acute distress; plan of care reviewed.',
      concise: 'ASSESSMENT ({time}):\n• Neuro: {neuro}\n• CV: {cardiac}\n• Resp: {resp}\n• GI/GU: {gigu}\n• Skin: {skin}\n• Pain: {pain}\n• Safety: {safety}. Tolerating care, NAD.',
    },
  },

  // ROUTINE: Pain Assessment, Analgesia & Reassessment
  {
    id: 'routine-pain-assessment-reassessment',
    title: 'Pain Assessment, Analgesia & Reassessment',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Joint Commission compliant documentation for comprehensive pain evaluation (PQRST), analgesic administration, POSS sedation scoring, and mandatory post-intervention reassessment.',
    tags: ['pain', 'analgesia', 'pqrst', 'reassessment', 'opioid', 'poss', 'joint commission', 'sedation', 'comfort'],
    fields: [
      { id: 'time', label: 'Initial Evaluation Time', defaultValue: '10:00', options: ['08:00', '10:00', '14:00', '18:30', '22:00', '02:30'] },
      { id: 'pqrst', label: 'Pain Characteristics & PQRST', defaultValue: 'Right lower quadrant surgical incision site. Described as sharp, throbbing, constant pain aggravated by deep coughing or movement; rated 7/10 on 0-10 numeric scale. Goal is ≤ 3/10.', options: ['Right lower quadrant surgical incision site. Described as sharp, throbbing, constant pain aggravated by deep coughing or movement; rated 7/10 on 0-10 numeric scale. Goal is ≤ 3/10.', 'Lumbar spine midline pain described as dull, aching, radiating down posterior right thigh; rated 6/10. Aggravated by sitting.', 'Epigastric burning discomfort radiating to chest; rated 5/10. Mild nausea associated. Goal is ≤ 2/10.', 'Diffuse bilateral knee osteoarthritis aching pain rated 6/10 with weight-bearing. Goal is ≤ 3/10 to facilitate physical therapy.'] },
      { id: 'baselineVitals', label: 'Baseline Vitals & Physical Signs', defaultValue: 'BP: 144/88 mmHg | HR: 96 bpm | RR: 20 bpm unlabored | SpO2: 97% on room air. Patient guarded, grimacing with movement, restless in bed.', options: ['BP: 144/88 mmHg | HR: 96 bpm | RR: 20 bpm unlabored | SpO2: 97% on room air. Patient guarded, grimacing with movement, restless in bed.', 'BP: 132/80 mmHg | HR: 84 bpm | RR: 18 bpm | SpO2: 98% on room air. Diaphoretic, protective splinting noted.', 'BP: 150/92 mmHg | HR: 102 bpm sinus tach | RR: 22 bpm | SpO2: 96%. Facial tension, vocal groaning with position shift.'] },
      { id: 'intervention', label: 'Analgesic & Non-Pharm Intervention', defaultValue: 'Administered Morphine 2 mg IV push over 2 min per order after verifying allergy band (NKDA) and vitals. Repositioned with support pillows; splinting pillow provided for coughing.', options: ['Administered Morphine 2 mg IV push over 2 min per order after verifying allergy band (NKDA) and vitals. Repositioned with support pillows; splinting pillow provided for coughing.', 'Administered Hydromorphone (Dilaudid) 0.5 mg IV push over 3 min. Bedside repositioning and cold pack applied to surgical incision.', 'Administered Oxycodone 5 mg PO with 60 mL water. Repositioned to 30-degree semi-Fowler position with warm blanket applied.', 'Administered Ketorolac (Toradol) 15 mg IV push. Verified normal renal function and absence of active bleeding.', 'Administered IV Acetaminophen (Ofirmev) 1000 mg IV piggyback over 15 min. Guided slow deep breathing relaxation exercises.'] },
      { id: 'reassessmentTime', label: 'Reassessment Time & Window', defaultValue: '10:30 (30 min post-IV administration)', options: ['10:30 (30 min post-IV administration)', '11:00 (60 min post-oral administration)', '14:30 (30 min post-IV administration)', '15:00 (60 min post-oral administration)', '19:00 (30 min post-IV administration)', '19:30 (60 min post-oral administration)'] },
      { id: 'postScore', label: 'Post-Intervention Score & Relief', defaultValue: 'Pain score decreased from 7/10 to 2/10 on numeric scale. Patient verbalizes satisfactory relief, stating pain is manageable and allowing easy deep breathing.', options: ['Pain score decreased from 7/10 to 2/10 on numeric scale. Patient verbalizes satisfactory relief, stating pain is manageable and allowing easy deep breathing.', 'Pain decreased from 6/10 to 1/10. Patient resting comfortably, facial muscles relaxed, breathing unlabored.', 'Pain decreased from 7/10 to 4/10. Patient states partial relief; additional non-pharmacologic heat pack offered and accepted.', 'Pain unchanged at 7/10. Provider contacted for additional analgesic orders.'] },
      { id: 'possScore', label: 'POSS Sedation & Respiratory Safety', defaultValue: 'POSS score: 1 (Awake and alert). RR: 16 bpm, deep and unlabored. SpO2: 98% on room air. Zero nausea, vomiting, dizziness, or pruritus.', options: ['POSS score: 1 (Awake and alert). RR: 16 bpm, deep and unlabored. SpO2: 98% on room air. Zero nausea, vomiting, dizziness, or pruritus.', 'POSS score: 2 (Slightly drowsy, easily aroused). RR: 14 bpm regular. SpO2: 97% on room air. Tolerating well.', 'POSS score: S (Sleep, easy to arouse). Respirations 14 bpm, quiet and regular. SpO2: 98%.', 'POSS score: 3 (Frequently drowsy, drifts off during conversation). Opioids held, respiratory rate 10 bpm, provider notified.'] },
      { id: 'plan', label: 'Ongoing Pain Management Plan', defaultValue: 'Continue multimodal analgesia schedule. Reassess pain with routine vitals, prior to PT ambulation, and PRN. Call light within reach; safety rails up.', options: ['Continue multimodal analgesia schedule. Reassess pain with routine vitals, prior to PT ambulation, and PRN. Call light within reach; safety rails up.', 'Maintain scheduled oral analgesics with PRN breakthrough coverage. Encourage proactive notification before pain exceeds 3/10.', 'Coordinate pain medication administration 30-45 minutes prior to scheduled Physical Therapy session.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, comprehensive pain evaluation performed: {pqrst}. Baseline vitals and physical signs: {baselineVitals}.',
        action: '{intervention}. Patient educated on reporting breakthrough discomfort early. Bed locked in low position, call bell within reach.',
        response: 'Mandatory reassessment completed at {reassessmentTime}: {postScore}. Sedation and respiratory safety: {possScore}. {plan}.',
      },
      soap: {
        subjective: 'Patient reports acute discomfort: {pqrst}. Desired functional pain target is ≤ 3/10.',
        objective: 'Initial exam at {time}: {baselineVitals}. Analgesic intervention: {intervention}. Reassessment at {reassessmentTime}: Score: {postScore}. Sedation & pulmonary safety: {possScore}.',
        assessment: 'Acute pain successfully managed with prescribed intervention. Functional comfort achieved with safe Pasero sedation score and zero respiratory depression.',
        plan: '{plan}',
      },
      narrative: 'At {time}, patient evaluated for acute pain: {pqrst}. Baseline vital signs: {baselineVitals}. Interventions: {intervention}. Reassessment conducted at {reassessmentTime}: {postScore}. Sedation monitored via Pasero Opioid-Induced Sedation Scale: {possScore}. Patient resting comfortably in safe environment. {plan}.',
      concise: 'PAIN ASSESSMENT & REASSESSMENT ({time} → {reassessmentTime}):\n• Evaluation: {pqrst}\n• Baseline Vitals: {baselineVitals}\n• Intervention: {intervention}\n• Reassessment ({reassessmentTime}): {postScore}\n• POSS / Sedation: {possScore}\n• Plan: {plan}',
    },
  },

  // 2. VASCULAR: Peripheral IV Insertion
  {
    id: 'vascular-piv-insertion',
    title: 'Peripheral IV (PIV) Insertion',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    description: 'Procedure documentation for establishing new peripheral intravenous access.',
    tags: ['PIV', 'IV start', 'cannulation', 'vascular access', 'saline lock'],
    fields: [
      { id: 'time', label: 'Time of Insertion', defaultValue: '08:15', options: ['08:15', '09:30', '13:00', '16:45', '20:15'] },
      { id: 'gauge', label: 'Catheter Gauge', defaultValue: '20G', options: ['18G', '20G', '22G', '24G'] },
      { id: 'site', label: 'Anatomical Site', defaultValue: 'Right forearm', options: ['Right forearm', 'Left forearm', 'Right antecubital fossa', 'Left antecubital fossa', 'Right dorsal hand', 'Left dorsal hand'] },
      { id: 'attempts', label: 'Attempts', defaultValue: '1st attempt', options: ['1st attempt', '2nd attempt'] },
      { id: 'prep', label: 'Skin Prep Antiseptic', defaultValue: 'Chlorhexidine gluconate (CHG) 2% with 70% IPA with 30-sec friction scrub and air dry', options: ['Chlorhexidine gluconate (CHG) 2% with 70% IPA with 30-sec friction scrub and air dry', 'Povidone-iodine scrub (CHG allergy) allowed to dry completely'] },
      { id: 'patency', label: 'Flashback & Flush', defaultValue: 'Prompt venous blood flashback observed. Flushed smoothly with 10 mL normal saline without resistance, leakage, or swelling.', options: ['Prompt venous blood flashback observed. Flushed smoothly with 10 mL normal saline without resistance, leakage, or swelling.', 'Brisk blood return obtained, flushed with 5 mL NS easily, saline locked.'] },
      { id: 'dressing', label: 'Dressing & Securement', defaultValue: 'Sterile transparent occlusive dressing (Tegaderm) with integrated securement device applied. Site labeled with date, time, and nurse initials.', options: ['Sterile transparent occlusive dressing (Tegaderm) with integrated securement device applied. Site labeled with date, time, and nurse initials.', 'Sterile occlusive dressing and Statlock applied; labeled per facility protocol.'] },
      { id: 'tolerance', label: 'Patient Tolerance', defaultValue: 'Patient tolerated procedure well without complication or vasovagal symptoms.', options: ['Patient tolerated procedure well without complication or vasovagal symptoms.', 'Patient tolerated with mild transient discomfort, denied dizziness.'] },
    ],
    formats: {
      dar: {
        data: 'Physician order verified for IV therapy. Skin at {site} inspected and found intact, free of bruising or phlebitis.',
        action: 'At {time}, performed hand hygiene. Cleaned {site} with {prep}. Successfully cannulated vein on {attempts} using a {gauge} angiocatheter. {patency}. {dressing}.',
        response: '{tolerance}. Site clean, dry, intact without redness or edema.',
      },
      soap: {
        subjective: 'Patient consented to peripheral IV insertion; reported understanding purpose of IV access.',
        objective: 'At {time}, {gauge} catheter inserted at {site} on {attempts}. Prepped with {prep}. {patency}. {dressing}.',
        assessment: 'Successful peripheral venous access established; site patent and non-compromised.',
        plan: 'Maintain saline lock. Assess site q4h and prior to each infusion for patency, tenderness, erythema, or infiltration.',
      },
      narrative: 'At {time}, order verified for peripheral IV placement. Patient prepped using aseptic technique and {prep}. Cannulated vein at {site} with {gauge} catheter on {attempts}. {patency}. Secured with {dressing}. {tolerance}. Site patent, without sign of hematoma or infiltration.',
      concise: 'PIV INSERTION ({time}):\n• Catheter: {gauge} @ {site} ({attempts})\n• Prep: {prep}\n• Patency: {patency}\n• Dressing: {dressing}\n• Tolerance: {tolerance}',
    },
  },

  // 3. VASCULAR: Peripheral IV Discontinuation
  {
    id: 'vascular-piv-removal',
    title: 'Peripheral IV (PIV) Discontinuation',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    description: 'Documentation for discontinuing and removing a peripheral IV line.',
    tags: ['PIV removal', 'IV discontinued', 'line DC', 'hemostasis'],
    fields: [
      { id: 'time', label: 'Removal Time', defaultValue: '10:00', options: ['10:00', '14:30', '17:00', '21:00'] },
      { id: 'site', label: 'Catheter Site', defaultValue: 'Right forearm', options: ['Right forearm', 'Left forearm', 'Right antecubital', 'Left antecubital', 'Right hand dorsum', 'Left hand dorsum'] },
      { id: 'reason', label: 'Reason for Discontinuation', defaultValue: 'No longer required per provider order / discharge prep', options: ['No longer required per provider order / discharge prep', 'Sluggish flow / loss of blood return', 'Erythema and mild tenderness at catheter insertion site', 'Routine site rotation protocol', 'Infiltration noted with cool edema'] },
      { id: 'integrity', label: 'Catheter Tip Status', defaultValue: 'Catheter removed intact; length verified with catheter hub intact.', options: ['Catheter removed intact; length verified with catheter hub intact.', 'Intact catheter inspected, tip complete and undamaged.'] },
      { id: 'hemostasis', label: 'Hemostasis & Site Condition', defaultValue: 'Direct manual pressure held for 2 minutes until complete hemostasis achieved. Sterile adhesive bandage applied. Site free of hematoma.', options: ['Direct manual pressure held for 2 minutes until complete hemostasis achieved. Sterile adhesive bandage applied. Site free of hematoma.', 'Pressure maintained for 5 minutes (patient on anticoagulation); hemostasis achieved; 2x2 gauze and Coban wrap applied.'] },
    ],
    formats: {
      dar: {
        data: 'Peripheral IV at {site} evaluated. Reason for removal: {reason}.',
        action: 'At {time}, dressing removed gently. Catheter withdrawn parallel to skin. {integrity}. {hemostasis}.',
        response: 'Bleeding controlled, site clean and dry. Patient educated to keep dressing dry and report tenderness or bruising.',
      },
      soap: {
        subjective: 'Patient informed of PIV discontinuation; voiced agreement.',
        objective: 'At {time}, PIV at {site} removed. Reason: {reason}. {integrity}. {hemostasis}.',
        assessment: 'PIV successfully discontinued without complication. Hemostasis achieved.',
        plan: 'Monitor puncture site for delayed bleeding or signs of phlebitis. Educate patient on site care.',
      },
      narrative: 'At {time}, peripheral IV catheter at {site} discontinued due to: {reason}. {integrity}. {hemostasis}. Patient instructed on post-removal precautions; tolerated without difficulty.',
      concise: 'PIV DISCONTINUED ({time}):\n• Site: {site}\n• Indication: {reason}\n• Tip: {integrity}\n• Hemostasis: {hemostasis}',
    },
  },

  // 4. VASCULAR: Central Line / PICC Dressing Change
  {
    id: 'vascular-cvad-dressing',
    title: 'Central Line / PICC Dressing & Cap Change',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    description: 'Sterile dressing change, biopatch application, and needleless connector change for CVAD/PICC.',
    tags: ['PICC', 'central line', 'CVAD', 'dressing change', 'sterile', 'biopatch'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '09:00', options: ['09:00', '13:30', '18:00'] },
      { id: 'lineType', label: 'Line Type & Location', defaultValue: 'Right basilic PICC line (dual lumen)', options: ['Right basilic PICC line (dual lumen)', 'Left cephalic PICC line (single lumen)', 'Right internal jugular (IJ) triple lumen catheter', 'Right subclavian central catheter', 'Left internal jugular central catheter'] },
      { id: 'appearance', label: 'Site Appearance', defaultValue: 'Insertion site clean, pink, dry, intact. No redness, swelling, drainage, tenderness, or cord-like induration noted.', options: ['Insertion site clean, pink, dry, intact. No redness, swelling, drainage, tenderness, or cord-like induration noted.', 'Site clean, no drainage or erythema. Suture/anchor secure.', 'Mild pinpoint crusting at puncture site, no purulent discharge or warmth.'] },
      { id: 'externalLen', label: 'External Catheter Length', defaultValue: 'External measurement unchanged at 3 cm from skin to hub.', options: ['External measurement unchanged at 3 cm from skin to hub.', 'External length 2 cm, consistent with baseline insertion record.', 'External measurement 4 cm, marked and verified with prior shift.'] },
      { id: 'prep', label: 'Skin Antiseptic', defaultValue: 'Chlorhexidine gluconate (CHG) with back-and-forth scrub for 30 seconds and allowed to fully air dry for 2 minutes.', options: ['Chlorhexidine gluconate (CHG) with back-and-forth scrub for 30 seconds and allowed to fully air dry for 2 minutes.', 'Povidone-iodine allowed 2-minute contact air dry (CHG allergy).'] },
      { id: 'dressing', label: 'Dressing Applied', defaultValue: 'CHG-impregnated sponge (Biopatch blue-side-up) placed around catheter. Covered with sterile transparent occlusive dressing. Securement device changed.', options: ['CHG-impregnated sponge (Biopatch blue-side-up) placed around catheter. Covered with sterile transparent occlusive dressing. Securement device changed.', 'CHG gel transparent dressing (Tegaderm CHG) applied smoothly without wrinkles.', 'Sterile gauze dressing changed due to diaphoresis (due for 48h change).'] },
      { id: 'flush', label: 'Lumen Flush & Cap Change', defaultValue: 'All needleless caps replaced using aseptic scrub-the-hub technique. Each lumen aspirates brisk blood return and flushes smoothly with 10 mL NS (pulsatile push-pause) and locked per protocol.', options: ['All needleless caps replaced using aseptic scrub-the-hub technique. Each lumen aspirates brisk blood return and flushes smoothly with 10 mL NS (pulsatile push-pause) and locked per protocol.', 'Needleless connectors replaced. Lumens patent, flushed with 10 mL NS followed by heparin lock (100 units/mL).', 'Caps replaced. Brisk blood return on both ports; flushed without resistance.'] },
    ],
    formats: {
      dar: {
        data: 'Routine sterile CVAD dressing and cap change indicated for {lineType}. Mask donned by nurse and patient instructed to turn head away.',
        action: 'At {time}, old dressing removed. {appearance}. Measured: {externalLen}. Skin prepped with {prep}. Applied {dressing}. {flush}. Dressing labeled with date, time, and initials.',
        response: 'Procedure tolerated well. Line patent and dressing completely occlusive. Patient denies pain or discomfort.',
      },
      soap: {
        subjective: 'Patient denies tenderness, pain, or burning sensations at central venous access site.',
        objective: 'At {time}: {lineType}. Site: {appearance}. {externalLen}. Sterile prep: {prep}. {dressing}. {flush}.',
        assessment: 'Central venous access device clean, patent, intact, and without signs of infection or catheter migration.',
        plan: 'Next dressing change due in 7 days or PRN if loose/soiled. Monitor site daily for phlebitis or erythema.',
      },
      narrative: 'At {time}, sterile dressing and cap change performed on {lineType} using strict aseptic technique. Masks worn. Insertion site inspected: {appearance}. {externalLen}. Area cleansed with {prep}. {dressing}. {flush}. Tolerated well without complications.',
      concise: 'CVAD DRESSING & CAP CHANGE ({time}):\n• Device: {lineType}\n• Site: {appearance}\n• Length: {externalLen}\n• Skin Prep: {prep}\n• Dressing: {dressing}\n• Lumens/Caps: {flush}\n• Patient tolerance: Good, NAD.',
    },
  },

  // 5. VASCULAR: Blood Transfusion
  {
    id: 'vascular-blood-transfusion',
    title: 'Blood Product Transfusion (PRBC / Platelets)',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    description: 'Protocol-guided documentation for verification, baseline vitals, initiation, 15-minute vitals, and completion.',
    tags: ['transfusion', 'blood', 'PRBC', 'dual sign-off', 'vitals'],
    fields: [
      { id: 'time', label: 'Start Time', defaultValue: '10:00', options: ['10:00', '13:30', '18:15', '22:00'] },
      { id: 'product', label: 'Blood Product & Unit #', defaultValue: '1 Unit Packed Red Blood Cells (PRBC), Unit # W123456789, Blood type O-pos', options: ['1 Unit Packed Red Blood Cells (PRBC), Unit # W123456789, Blood type O-pos', '1 Unit PRBC, Unit # W987654321, Blood type A-pos', '1 Single-donor Platelet unit, Unit # P55443322', '2 Units Fresh Frozen Plasma (FFP)'] },
      { id: 'dualRN', label: 'Second RN Verification', defaultValue: 'Bedside dual verification completed with Sarah Jenkins, RN. Patient ID, blood band #, unit #, product type, expiration date, and ABO/Rh compatibility matched 100%.', options: ['Bedside dual verification completed with Sarah Jenkins, RN. Patient ID, blood band #, unit #, product type, expiration date, and ABO/Rh compatibility matched 100%.', 'Dual nurse verification completed at bedside with second licensed RN. All identifiers and blood slips cross-matched.'] },
      { id: 'preVitals', label: 'Pre-Transfusion Vitals', defaultValue: 'T: 36.8°C | HR: 78 | BP: 122/74 | RR: 16 | SpO2: 98% on RA', options: ['T: 36.8°C | HR: 78 | BP: 122/74 | RR: 16 | SpO2: 98% on RA', 'T: 37.1°C | HR: 84 | BP: 130/80 | RR: 18 | SpO2: 97% on RA', 'T: 36.6°C | HR: 70 | BP: 118/70 | RR: 14 | SpO2: 99% on RA'] },
      { id: 'rate', label: 'Initial & Titrated Infusion Rate', defaultValue: 'Started at 60 mL/hr for first 15 minutes. Titrated to 125 mL/hr to complete over 2.5 hours.', options: ['Started at 60 mL/hr for first 15 minutes. Titrated to 125 mL/hr to complete over 2.5 hours.', 'Started at 50 mL/hr x 15 min, increased to 150 mL/hr per order.', 'Infused over 3 hours at 110 mL/hr.'] },
      { id: 'fifteenVitals', label: '15-Minute Vitals', defaultValue: 'T: 36.9°C | HR: 80 | BP: 124/76 | RR: 16 | SpO2: 98%. Patient denies fever, chills, pruritus, back pain, dyspnea, or rash.', options: ['T: 36.9°C | HR: 80 | BP: 124/76 | RR: 16 | SpO2: 98%. Patient denies fever, chills, pruritus, back pain, dyspnea, or rash.', 'T: 37.0°C | HR: 82 | BP: 126/78 | RR: 18 | SpO2: 97%. No adverse reaction noted.'] },
      { id: 'tolerance', label: 'Adverse Symptoms', defaultValue: 'No evidence of transfusion-related reaction (acute hemolytic, febrile, allergic, or TRALI).', options: ['No evidence of transfusion-related reaction (acute hemolytic, febrile, allergic, or TRALI).', 'Patient resting quietly, denies headache, shortness of breath, flank pain, or urticaria.'] },
    ],
    formats: {
      dar: {
        data: 'Informed consent confirmed in chart for transfusion of {product}. PIV 20G in right forearm patent and flushes easily with 0.9% NS. Pre-vitals: {preVitals}.',
        action: 'At {time}, {dualRN}. Transfusion initiated via blood administration Y-tubing with 170-micron filter and dedicated NS line. {rate}. 15-minute vitals obtained: {fifteenVitals}.',
        response: 'Nurse remained at bedside for initial 15 minutes. {tolerance}. Patient educated on reporting chills, back pain, shortness of breath, or itching immediately.',
      },
      soap: {
        subjective: 'Patient denies history of transfusion reactions; verbalizes understanding of reason for blood administration and call light usage.',
        objective: 'At {time}: {product}. {dualRN}. Baseline vitals: {preVitals}. Infusion: {rate}. 15-min vitals: {fifteenVitals}. Site intact, no infiltration.',
        assessment: 'Transfusion proceeding safely without acute hemodynamic or allergic adverse response.',
        plan: 'Obtain vital signs hourly until completion, post-transfusion vitals, flush line with NS, dispose of empty bag in biohazard container.',
      },
      narrative: 'At {time}, transfusion initiated for {product}. Verified patient consent. {dualRN}. Baseline vitals: {preVitals}. Administered via dedicated 20G IV with filtered blood tubing. {rate}. Continuous bedside observation for first 15 minutes. 15-min vitals: {fifteenVitals}. {tolerance}. Call bell within reach.',
      concise: 'BLOOD TRANSFUSION ({time}):\n• Product: {product}\n• Verification: {dualRN}\n• Pre-Vitals: {preVitals}\n• Rate: {rate}\n• 15-Min Vitals: {fifteenVitals}\n• Reaction signs: {tolerance}',
    },
  },

  // 6. WOUND: Surgical Dressing Change
  {
    id: 'wound-surgical-dressing',
    title: 'Surgical Wound Dressing Change',
    category: 'wound',
    categoryLabel: 'Wound & Surgical',
    description: 'Documentation for incision assessment, cleansing, and dressing re-application.',
    tags: ['wound care', 'dressing change', 'incision', 'staples', 'surgical'],
    fields: [
      { id: 'time', label: 'Time of Care', defaultValue: '11:15', options: ['11:15', '14:00', '16:30', '20:00'] },
      { id: 'location', label: 'Wound Location', defaultValue: 'Midline abdominal incision', options: ['Midline abdominal incision', 'Right lower quadrant laparoscopic incisions', 'Right knee midline incision', 'Left hip surgical incision', 'Sacral stage 3 pressure injury'] },
      { id: 'appearance', label: 'Incision Appearance & Margins', defaultValue: 'Wound edges well-approximated with 18 surgical staples intact. No erythema, warmth, maceration, or dehiscence.', options: ['Wound edges well-approximated with 18 surgical staples intact. No erythema, warmth, maceration, or dehiscence.', 'Edges approximated with Dermabond and Steri-Strips intact. Periwound skin intact and pale pink.', 'Approximated with running sutures. Mild pink margin < 0.5 cm, non-tender, warm without induration.'] },
      { id: 'drainage', label: 'Drainage / Exudate', defaultValue: 'Scant serosanguinous drainage noted on old dressing. No purulent exudate or foul odor.', options: ['Scant serosanguinous drainage noted on old dressing. No purulent exudate or foul odor.', 'Old dressing dry with no drainage present.', 'Small amount of serous drainage on inner gauze pad; no odor.', 'Moderate sanguinous drainage, zero strike-through.'] },
      { id: 'cleansing', label: 'Cleansing Agent', defaultValue: 'Cleansed with sterile normal saline from top to bottom, center outward; patted dry with sterile gauze.', options: ['Cleansed with sterile normal saline from top to bottom, center outward; patted dry with sterile gauze.', 'Cleansed with ChloraPrep swabstick and allowed to dry 2 minutes.', 'Gently washed with antimicrobial skin cleanser and sterile water.'] },
      { id: 'newDressing', label: 'New Dressing Applied', defaultValue: 'Covered with sterile non-adherent Telfa pad, dry 4x4 gauze sponges, and secured with paper tape.', options: ['Covered with sterile non-adherent Telfa pad, dry 4x4 gauze sponges, and secured with paper tape.', 'Applied bordered foam dressing (Mepilex Border) dated and initialed.', 'Covered with sterile island dressing; edges sealed smoothly.'] },
      { id: 'painTolerance', label: 'Pain & Tolerance', defaultValue: 'Pre-medicated with ordered oral analgesic 30 min prior. Tolerated with minimal discomfort (pain rated 2/10).', options: ['Pre-medicated with ordered oral analgesic 30 min prior. Tolerated with minimal discomfort (pain rated 2/10).', 'Tolerated procedure well; reported zero pain during dressing change.', 'Mild discomfort during old dressing removal; settled quickly post-application.'] },
    ],
    formats: {
      dar: {
        data: 'Old dressing over {location} removed. Evaluated drainage: {drainage}. Incision: {appearance}.',
        action: 'At {time}, performed wound care using aseptic technique. {cleansing}. {newDressing}. {painTolerance}.',
        response: 'Dressing clean, dry, and occlusive. Patient states feeling comfortable. Incision clean without complication.',
      },
      soap: {
        subjective: 'Patient reports surgical site is healing well; pain rated {painTolerance}.',
        objective: 'At {time}: {location}. Old dressing: {drainage}. Incision: {appearance}. Cleaned: {cleansing}. Applied: {newDressing}.',
        assessment: 'Surgical wound healing primarily without signs of infection, separation, or excessive drainage.',
        plan: 'Continue daily dressing changes per order, monitor for signs of localized infection (erythema, warmth, purulent drainage), educate on abdominal splinting.',
      },
      narrative: 'At {time}, surgical dressing change completed on {location}. Old dressing removed displaying {drainage}. Incision inspected: {appearance}. Area cleansed with {cleansing}. {newDressing}. {painTolerance}. Patient verbalized comfort.',
      concise: 'WOUND CARE ({time}):\n• Location: {location}\n• Appearance: {appearance}\n• Old Dressing: {drainage}\n• Cleansing: {cleansing}\n• New Dressing: {newDressing}\n• Tolerance: {painTolerance}',
    },
  },

  // 7. WOUND: Surgical Drain Care (Jackson-Pratt / Hemovac)
  {
    id: 'wound-drain-care',
    title: 'Surgical Drain Care (JP / Hemovac)',
    category: 'wound',
    categoryLabel: 'Wound & Surgical',
    description: 'Documentation for stripping, emptying, measuring, and re-activating negative suction on closed wound drains.',
    tags: ['JP drain', 'Jackson-Pratt', 'Hemovac', 'drain output', 'suction'],
    fields: [
      { id: 'time', label: 'Time of Care', defaultValue: '08:00', options: ['08:00', '12:00', '16:00', '20:00'] },
      { id: 'drainID', label: 'Drain Identifier & Site', defaultValue: 'JP Drain #1 (Right lower quadrant abdomen)', options: ['JP Drain #1 (Right lower quadrant abdomen)', 'JP Drain #2 (Left flank)', 'Hemovac drain (Right total knee)', 'JP Drain (Right breast / axilla)'] },
      { id: 'outputAmt', label: 'Output Amount & Color', defaultValue: '45 mL serosanguinous fluid', options: ['45 mL serosanguinous fluid', '20 mL clear serous fluid', '85 mL dark sanguinous fluid', '15 mL serosanguinous fluid'] },
      { id: 'siteCondition', label: 'Insertion Site & Suture', defaultValue: 'Drain insertion site clean and dry. Anchoring suture intact. Split-gauze drain sponge clean and intact.', options: ['Drain insertion site clean and dry. Anchoring suture intact. Split-gauze drain sponge clean and intact.', 'Site intact, mild redness < 2mm around puncture hole, no purulence or leakage.', 'Dressing dry, drain tubing securely pinned to gown.'] },
      { id: 'patency', label: 'Stripping & Re-suction', defaultValue: 'Tubing gently milked toward bulb. Bulb compressed and plug securely sealed, maintaining full negative suction.', options: ['Tubing gently milked toward bulb. Bulb compressed and plug securely sealed, maintaining full negative suction.', 'Bulb fully collapsed and active suction restored without air leak.', 'Hemovac compressed flat and capped to ensure continuous suction.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed {drainID}. Suction bulb found expanded with fluid collection.',
        action: 'At {time}, emptied {drainID}. Measured {outputAmt}. Inspected site: {siteCondition}. {patency}. Recorded output in I&O flowsheet.',
        response: 'Suction maintained effectively. Patient denied pain during drain care. Tubing pinned to gown below insertion level.',
      },
      soap: {
        subjective: 'Patient reports drain site feels comfortable, no pulling or catching.',
        objective: 'At {time}: {drainID}. Emptied {outputAmt}. Site: {siteCondition}. Status: {patency}. Output logged in EHR.',
        assessment: 'Surgical drain patent, functional, and actively evacuating fluid under sealed negative pressure.',
        plan: 'Continue drain monitoring and emptying q8h and PRN. Notify surgeon if output exceeds 100 mL/hr or turns bright red.',
      },
      narrative: 'At {time}, {drainID} assessed and emptied. Measured {outputAmt}. Tubing was milked and bulb re-primed to active suction. Insertion site: {siteCondition}. {patency}. Recorded in flowsheet; patient resting comfortably.',
      concise: 'DRAIN CARE ({time}):\n• Device: {drainID}\n• Output: {outputAmt}\n• Site: {siteCondition}\n• Suction: {patency}',
    },
  },

  // 8. RESPIRATORY: Tracheostomy Care & Suctioning
  {
    id: 'resp-trach-care',
    title: 'Tracheostomy Care & Suctioning',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Airway',
    description: 'Documentation for sterile tracheal suctioning, inner cannula cleaning/change, stoma care, and tie replacement.',
    tags: ['tracheostomy', 'trach care', 'suctioning', 'airway', 'respiratory'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '10:30', options: ['06:30', '10:30', '14:30', '18:30', '22:30'] },
      { id: 'sizeType', label: 'Trach Size & Type', defaultValue: 'Shiley #6 cuffed tracheostomy tube', options: ['Shiley #6 cuffed tracheostomy tube', 'Shiley #8 cuffless tracheostomy tube', 'Bivona #7 tight-to-shaft tracheostomy tube', 'Jackson #6 metal cannula'] },
      { id: 'suctioning', label: 'Suctioning Passes & Secretions', defaultValue: 'Pre-oxygenated with 100% O2 for 1 minute. Sterile inline suction catheter passed twice to carina depth. Yielded moderate thick, white/clear secretions.', options: ['Pre-oxygenated with 100% O2 for 1 minute. Sterile inline suction catheter passed twice to carina depth. Yielded moderate thick, white/clear secretions.', 'Passed sterile 12Fr catheter x 3 passes with intermittent suction < 10 sec. Scant thin clear secretions obtained.', 'Suctioned x 2 passes. Moderate tenacious yellowish secretions cleared.'] },
      { id: 'cannula', label: 'Inner Cannula Change', defaultValue: 'Disposable inner cannula removed and replaced with new sterile Shiley #6 cannula; locked securely.', options: ['Disposable inner cannula removed and replaced with new sterile Shiley #6 cannula; locked securely.', 'Reusable inner cannula cleaned with hydrogen peroxide/saline, rinsed, and re-locked in place.', 'Inner cannula inspected, clear, flushed, and repositioned.'] },
      { id: 'stoma', label: 'Stoma & Skin Assessment', defaultValue: 'Stoma site clean, pink, dry, intact without maceration, erythema, or granulation tissue. Cleaned with normal saline. Fresh sterile pre-cut drain sponge placed.', options: ['Stoma site clean, pink, dry, intact without maceration, erythema, or granulation tissue. Cleaned with normal saline. Fresh sterile pre-cut drain sponge placed.', 'Mild pink stoma borders, no purulent drainage. Cleansed with sterile NS and barrier film applied before fresh sponge.', 'Stoma intact; skin dry; fresh antimicrobial foam trach pad positioned.'] },
      { id: 'ties', label: 'Trach Collar / Ties', defaultValue: 'Trach collar / Velcro ties changed with 2nd staff member stabilizing flange. Secured allowing 1 finger breadth between neck and tie.', options: ['Trach collar / Velcro ties changed with 2nd staff member stabilizing flange. Secured allowing 1 finger breadth between neck and tie.', 'Ties inspected and adjusted; 1 finger breadth verified, flange stable.', 'New cotton twill tape secured with square knots; skin underneath intact.'] },
      { id: 'postResp', label: 'Post-Procedure Auscultation', defaultValue: 'Breath sounds clear bilaterally post-suctioning. SpO2 99% on trach collar with 35% humidified FiO2. Unlabored respiratory effort.', options: ['Breath sounds clear bilaterally post-suctioning. SpO2 99% on trach collar with 35% humidified FiO2. Unlabored respiratory effort.', 'Coarse upper airway sounds resolved; SpO2 stable at 97% on prescribed O2.', 'Bilateral breath sounds improved, no respiratory distress observed.'] },
    ],
    formats: {
      dar: {
        data: 'Patient exhibited coarse rhonchi on auscultation and coughing against trach. SpO2 95% on humidified trach collar.',
        action: 'At {time}, performed trach care and sterile suctioning for {sizeType}. {suctioning}. {cannula}. {stoma}. {ties}.',
        response: '{postResp}. Patient tolerated well without bradycardia, desaturation, or mucosal bleeding.',
      },
      soap: {
        subjective: 'Patient signaled satisfaction with airway clearance and improved breathing comfort via communication board.',
        objective: 'At {time}: {sizeType}. Suction: {suctioning}. {cannula}. {stoma}. {ties}. Post-vitals: {postResp}.',
        assessment: 'Airway cleared and patent; trach tube properly positioned, secured, and stoma free of infection.',
        plan: 'Continue trach care q shift and PRN suctioning. Maintain emergency replacement trach tubes (same size and one size smaller) at bedside.',
      },
      narrative: 'At {time}, routine trach care and suctioning performed on {sizeType}. {suctioning}. {cannula}. {stoma}. {ties}. Auscultation revealed {postResp}. Patient in no acute distress.',
      concise: 'TRACH CARE & SUCTION ({time}):\n• Tube: {sizeType}\n• Suction: {suctioning}\n• Cannula: {cannula}\n• Stoma: {stoma}\n• Ties: {ties}\n• Outcome: {postResp}',
    },
  },

  // 9. GIGU: Foley Catheter Insertion
  {
    id: 'gigu-foley-insertion',
    title: 'Indwelling Foley Catheter Insertion',
    category: 'gigu',
    categoryLabel: 'GI & Genitourinary',
    description: 'Sterile documentation of urinary catheter placement, balloon inflation, and initial urine output.',
    tags: ['foley', 'urinary catheter', 'insertion', 'sterile technique', 'retention'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '12:00', options: ['08:00', '12:00', '16:00', '21:00'] },
      { id: 'indication', label: 'Clinical Indication', defaultValue: 'Acute urinary retention (bladder scan showed 680 mL)', options: ['Acute urinary retention (bladder scan showed 680 mL)', 'Strict hourly I&O monitoring in critically ill patient', 'Perioperative bladder decompression for prolonged surgery', 'Stage 4 sacral pressure injury healing in incontinent patient'] },
      { id: 'sizeType', label: 'Catheter Size & Balloon', defaultValue: '16 French, 2-way Foley catheter with 10 mL balloon', options: ['16 French, 2-way Foley catheter with 10 mL balloon', '14 French, 2-way Foley catheter with 10 mL balloon', '18 French Coude tip catheter with 10 mL balloon', '16 French temperature-sensing Foley catheter'] },
      { id: 'procedure', label: 'Technique & Insertion', defaultValue: 'Sterile technique maintained throughout. Periurethral area prepped with antiseptic swabsticks. Catheter lubricated with sterile water-soluble jelly and advanced smoothly without resistance.', options: ['Sterile technique maintained throughout. Periurethral area prepped with antiseptic swabsticks. Catheter lubricated with sterile water-soluble jelly and advanced smoothly without resistance.', 'Strict aseptic field maintained. Urethral meatus cleansed. Advanced to bifurcation before balloon inflation.'] },
      { id: 'return', label: 'Immediate Urine Return', defaultValue: 'Immediate return of clear, yellow urine observed. Balloon inflated with 10 mL sterile water. Catheter pulled back gently until snug against bladder neck.', options: ['Immediate return of clear, yellow urine observed. Balloon inflated with 10 mL sterile water. Catheter pulled back gently until snug against bladder neck.', 'Prompt return of 550 mL amber urine. 10 mL sterile water instilled in balloon; zero patient pain upon inflation.', 'Return of slightly cloudy golden urine. Balloon inflated with 10 mL sterile water without resistance.'] },
      { id: 'securement', label: 'Securement & Bag Placement', defaultValue: 'Catheter secured to anterior thigh using StatLock securement device allowing slack. Drainage bag hung below bladder level on bed frame, free of kinks or floor contact.', options: ['Catheter secured to anterior thigh using StatLock securement device allowing slack. Drainage bag hung below bladder level on bed frame, free of kinks or floor contact.', 'Secured to upper thigh with adhesive holder. Gravity drainage tubing unobstructed and dependent.'] },
      { id: 'tolerance', label: 'Patient Tolerance', defaultValue: 'Patient tolerated procedure well, expressing relief from bladder distension. Denies pain.', options: ['Patient tolerated procedure well, expressing relief from bladder distension. Denies pain.', 'Procedure tolerated with minor discomfort during passage; immediate relief of retention pain.'] },
    ],
    formats: {
      dar: {
        data: 'Physician order verified for urinary catheterization due to {indication}. Informed patient and positioned appropriately.',
        action: 'At {time}, {procedure}. Inserted {sizeType}. {return}. {securement}.',
        response: '{tolerance}. Initial urine drained and logged in EHR.',
      },
      soap: {
        subjective: 'Patient reports feeling severe bladder pressure prior to insertion; reports significant relief following drainage.',
        objective: 'At {time}: Inserted {sizeType} for {indication}. Technique: {procedure}. Output: {return}. Securement: {securement}.',
        assessment: 'Catheter successfully placed under sterile conditions. Bladder decompression achieved; no hematuria or bypass.',
        plan: 'Maintain closed drainage system. Perform routine catheter hygiene q shift. Re-evaluate daily for catheter necessity to prevent CAUTI.',
      },
      narrative: 'At {time}, order verified for indwelling catheterization for {indication}. Using strict sterile technique, inserted {sizeType}. {procedure}. {return}. {securement}. {tolerance}.',
      concise: 'FOLEY INSERTION ({time}):\n• Indication: {indication}\n• Size: {sizeType}\n• Technique: {procedure}\n• Return: {return}\n• Securement: {securement}\n• Tolerance: {tolerance}',
    },
  },

  // 10. GIGU: Foley Catheter Removal & Voiding Trial
  {
    id: 'gigu-foley-removal',
    title: 'Indwelling Foley Catheter Removal',
    category: 'gigu',
    categoryLabel: 'GI & Genitourinary',
    description: 'Documentation for balloon deflation, atraumatic removal, and voiding trial instructions.',
    tags: ['foley removal', 'DC foley', 'voiding trial', 'CAUTI prevention'],
    fields: [
      { id: 'time', label: 'Removal Time', defaultValue: '06:00', options: ['06:00', '10:00', '14:00', '20:00'] },
      { id: 'deflateAmt', label: 'Balloon Fluid Volume Deflated', defaultValue: '10 mL sterile water withdrawn via syringe (matching balloon volume on insertion)', options: ['10 mL sterile water withdrawn via syringe (matching balloon volume on insertion)', '9.5 mL clear sterile water aspirated smoothly with luer-lock syringe.'] },
      { id: 'removal', label: 'Removal & Integrity', defaultValue: 'Catheter gently withdrawn with steady traction. Intact catheter tip confirmed. Patient experienced no pain or resistance.', options: ['Catheter gently withdrawn with steady traction. Intact catheter tip confirmed. Patient experienced no pain or resistance.', 'Withdrawn smoothly and intact. Perineal area cleansed and dried.'] },
      { id: 'planTrial', label: 'Voiding Trial Protocol', defaultValue: 'Patient placed on 6-hour voiding trial. Due to void by 12:00. Instructed to notify staff upon first urge to urinate. Bladder scan ordered if no void by cutoff.', options: ['Patient placed on 6-hour voiding trial. Due to void by 12:00. Instructed to notify staff upon first urge to urinate. Bladder scan ordered if no void by cutoff.', 'Placed on voiding trial (due in 6 hrs). Encouraged oral fluids. Notify RN immediately for dysuria or fullness.'] },
    ],
    formats: {
      dar: {
        data: 'Order reviewed for Foley catheter discontinuation. Drainage bag measured and emptied prior to removal.',
        action: 'At {time}, balloon deflated completely: {deflateAmt}. {removal}. {planTrial}.',
        response: 'Patient verbalized understanding of voiding trial instructions and agreed to use call bell for assist to commode/urinal.',
      },
      soap: {
        subjective: 'Patient reports understanding that catheter is being removed and will notify nurse when feeling the urge to void.',
        objective: 'At {time}: Foley removed. Deflated: {deflateAmt}. Inspection: {removal}. Voiding trial active: {planTrial}.',
        assessment: 'Catheter successfully removed atraumatically. Patient hemodynamically stable.',
        plan: 'Monitor for spontaneous voiding within 6 hours. Perform bladder scan if no void by deadline or if patient experiences discomfort.',
      },
      narrative: 'At {time}, order verified for removal of indwelling catheter. Balloon deflated with {deflateAmt}. {removal}. Perineal hygiene provided. {planTrial}. Tolerated without distress.',
      concise: 'FOLEY REMOVAL ({time}):\n• Deflation: {deflateAmt}\n• Inspection: {removal}\n• Protocol: {planTrial}\n• Tolerance: Good, NAD.',
    },
  },

  // 11. EMERGENCY: Inpatient Fall Incident Note
  {
    id: 'emergency-fall-incident',
    title: 'Inpatient Fall & Post-Fall Assessment',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Comprehensive documentation of witnessed or unwitnessed fall, head-to-toe injury exam, and physician notification.',
    tags: ['fall', 'incident', 'safety', 'neuro checks', 'post-fall huddle'],
    fields: [
      { id: 'time', label: 'Fall Discovery Time', defaultValue: '14:20', options: ['02:15', '07:45', '14:20', '19:10', '23:30'] },
      { id: 'witnessed', label: 'Witness Status & Location', defaultValue: 'Unwitnessed fall. Patient found sitting on floor next to bedside commode.', options: ['Unwitnessed fall. Patient found sitting on floor next to bedside commode.', 'Witnessed by staff member; patient knees buckled while transferring from wheelchair to bed.', 'Unwitnessed fall. Bed alarm sounded; nurse entered room to find patient on knees beside bed.'] },
      { id: 'headStrike', label: 'Head Strike & Loss of Consciousness', defaultValue: 'Patient denies hitting head. Denies loss of consciousness. No evidence of cranial trauma, contusion, or laceration.', options: ['Patient denies hitting head. Denies loss of consciousness. No evidence of cranial trauma, contusion, or laceration.', 'Possible head strike against nightstand reported. No visible laceration or hematoma. Neuro checks initiated immediately.', 'Patient denies striking head or losing consciousness. Eye pupils equal and reactive.'] },
      { id: 'injuries', label: 'Physical Exam & Injury Assessment', defaultValue: 'Full physical assessment performed on floor. Extremities non-tender, full ROM, no deformity, bleeding, or bruising noted. Denies hip or back pain.', options: ['Full physical assessment performed on floor. Extremities non-tender, full ROM, no deformity, bleeding, or bruising noted. Denies hip or back pain.', 'Skin intact, no bleeding. Mild tenderness to left elbow without deformity or swelling. Ice pack applied.', 'No acute deformities, distal pulses intact in all four extremities. Denies neck pain.'] },
      { id: 'vitals', label: 'Post-Fall Vital Signs', defaultValue: 'BP: 132/80 | HR: 82 | RR: 18 | SpO2: 97% on RA | Temp: 36.9°C | Blood glucose: 114 mg/dL', options: ['BP: 132/80 | HR: 82 | RR: 18 | SpO2: 97% on RA | Temp: 36.9°C | Blood glucose: 114 mg/dL', 'BP: 108/68 | HR: 90 | RR: 16 | SpO2: 98% on RA | Glucose: 98 mg/dL', 'BP: 148/86 | HR: 76 | RR: 20 | SpO2: 96% on RA'] },
      { id: 'providerNotification', label: 'Provider & Family Notification', defaultValue: 'Dr. Robert Chen (Attending) notified at 14:30. Situation, assessment, and vitals communicated. Ordered post-fall neuro checks q1h x 4 and x-ray of left elbow.', options: ['Dr. Robert Chen (Attending) notified at 14:30. Situation, assessment, and vitals communicated. Ordered post-fall neuro checks q1h x 4 and x-ray of left elbow.', 'Dr. Martinez notified via telephone at 14:35; informed of fall and stable assessment. Orders received for serial neuro checks.', 'On-call provider notified. Orders received. Family/emergency contact notified of incident.'] },
      { id: 'safeTransfer', label: 'Transfer & Safety Modifications', defaultValue: 'Assisted safely back to bed using mechanical lift with 2 staff members. Bed placed in lowest position, bed alarm armed, non-skid footwear verified, call light placed in hand.', options: ['Assisted safely back to bed using mechanical lift with 2 staff members. Bed placed in lowest position, bed alarm armed, non-skid footwear verified, call light placed in hand.', 'Assisted to bed via 2-person assist. Bed alarm activated, room decluttered, 1:1 observation maintained pending re-evaluation.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, {witnessed}. {headStrike}. Physical exam: {injuries}. Post-fall vitals: {vitals}.',
        action: '{safeTransfer}. {providerNotification}. Post-fall safety huddle conducted with charge nurse. Incident report completed.',
        response: 'Patient resting in bed, comfortable and oriented. Neuro checks ongoing per orders. Call bell within reach.',
      },
      soap: {
        subjective: 'Patient states: "I tried to get up to use the commode and lost my balance." Denies hitting head or severe pain.',
        objective: 'At {time}: Found on floor. {witnessed}. {headStrike}. Exam: {injuries}. Vitals: {vitals}. Safety: {safeTransfer}.',
        assessment: 'Patient sustained inpatient fall without immediate signs of fracture, head injury, or neuro deficits. Fall risk remains high.',
        plan: '{providerNotification}. Continue post-fall neuro checks, frequent rounding q1h, keep bed alarm activated, assist x 2 with all transfers.',
      },
      narrative: 'At {time}, {witnessed}. Immediate assessment completed: {headStrike}. {injuries}. Vitals recorded: {vitals}. {safeTransfer}. {providerNotification}. Post-fall safety huddle held and hospital incident management report submitted. Patient denies acute distress.',
      concise: 'FALL EVENT ({time}):\n• Status: {witnessed}\n• Head Strike: {headStrike}\n• Exam: {injuries}\n• Vitals: {vitals}\n• Actions: {safeTransfer}\n• Provider: {providerNotification}\n• Plan: Ongoing neuro checks & strict fall precautions.',
    },
  },

  // 12. EMERGENCY: Rapid Response Team (RRT) Activation
  {
    id: 'emergency-rrt-activation',
    title: 'Rapid Response Team (RRT) Activation',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Documentation for clinical deterioration, RRT call, team arrival, acute interventions, and disposition.',
    tags: ['rapid response', 'RRT', 'deterioration', 'critical care', 'code'],
    fields: [
      { id: 'time', label: 'Activation Time', defaultValue: '16:05', options: ['04:20', '09:15', '16:05', '21:40'] },
      { id: 'trigger', label: 'Triggering Clinical Criteria', defaultValue: 'Acute respiratory distress with SpO2 dropping to 86% on 2L NC, respiratory rate 32, tachypneic with accessory muscle use.', options: ['Acute respiratory distress with SpO2 dropping to 86% on 2L NC, respiratory rate 32, tachypneic with accessory muscle use.', 'Sudden neurological change: acute right-sided facial droop and slurred speech (Code Stroke alert).', 'Acute hypotension: BP 78/44 mmHg, HR 128 sinus tachycardia, diaphoresis, altered sensorium.', 'Unresponsive to verbal stimuli with shallow respirations.'] },
      { id: 'rrtArrival', label: 'RRT Arrival & Responders', defaultValue: 'RRT called at 16:05. Team arrived at bedside at 16:07 (ICU RN, Respiratory Therapist, Hospitalist Dr. Patel).', options: ['RRT called at 16:05. Team arrived at bedside at 16:07 (ICU RN, Respiratory Therapist, Hospitalist Dr. Patel).', 'RRT arrived at 16:08 including ICU charge nurse, RT, and code team physician.', 'Team at bedside within 2 minutes of activation with emergency airway box.'] },
      { id: 'interventions', label: 'Acute Interventions Performed', defaultValue: 'Placed on 100% Non-Rebreather mask. 12-lead ECG completed. STAT ABG drawn. IV access patent. 500 mL normal saline bolus initiated.', options: ['Placed on 100% Non-Rebreather mask. 12-lead ECG completed. STAT ABG drawn. IV access patent. 500 mL normal saline bolus initiated.', 'Placed on high-flow nasal cannula (HFNC) 40L at 60% FiO2. STAT portable chest X-ray and labs drawn. Nebulizer duplex administered.', 'STAT CT Head non-contrast ordered and transported with ICU nurse. Point of care glucose verified 110 mg/dL.', 'Airway suctioned, IV Narcan 0.4 mg administered IV push with prompt return of responsiveness.'] },
      { id: 'outcome', label: 'Patient Response & Disposition', defaultValue: 'SpO2 recovered to 96% on NRB mask, respiratory rate slowed to 20/min. Patient transferred to Medical Intensive Care Unit (MICU) bed 12 for ongoing continuous monitoring.', options: ['SpO2 recovered to 96% on NRB mask, respiratory rate slowed to 20/min. Patient transferred to Medical Intensive Care Unit (MICU) bed 12 for ongoing continuous monitoring.', 'Patient stabilized; blood pressure improved to 104/62 after fluid bolus. Patient remains on Step-down unit with increased monitoring q1h.', 'Transferred to Cath Lab for emergent cardiac catheterization.', 'Transferred to Neuro ICU for acute ischemic stroke protocol.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, patient developed acute clinical deterioration: {trigger}. Vital signs: BP 142/90, HR 118, RR 32, SpO2 86%.',
        action: 'Rapid Response Team called immediately. {rrtArrival}. Bedside interventions: {interventions}. SBAR handover communicated to team.',
        response: '{outcome}. Full handoff report provided to receiving nurse. Charting updated.',
      },
      soap: {
        subjective: 'Patient experienced sudden shortness of breath; nodded when asked if having difficulty breathing.',
        objective: 'At {time}: {trigger}. {rrtArrival}. Orders and actions: {interventions}. Outcome: {outcome}.',
        assessment: 'Acute physiological decompensation successfully managed by multidisciplinary Rapid Response Team.',
        plan: 'Transfer to higher level of care as indicated. Complete transport handover and update family.',
      },
      narrative: 'At {time}, Rapid Response Team activated due to: {trigger}. {rrtArrival}. Team initiated {interventions}. Clinical status stabilized: {outcome}. Transport completed with continuous monitoring.',
      concise: 'RRT EVENT ({time}):\n• Trigger: {trigger}\n• Response: {rrtArrival}\n• Interventions: {interventions}\n• Disposition: {outcome}',
    },
  },

  // 13. EMERGENCY: Critical Value & Provider SBAR Notification
  {
    id: 'emergency-provider-sbar',
    title: 'Critical Lab & Physician SBAR Notification',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Documentation for reporting critical lab/diagnostic results with read-back verification and provider orders.',
    tags: ['critical lab', 'SBAR', 'physician notification', 'read-back', 'telephone order'],
    fields: [
      { id: 'time', label: 'Notification Time', defaultValue: '15:10', options: ['07:15', '11:45', '15:10', '19:20', '23:50'] },
      { id: 'provider', label: 'Provider Name & Role', defaultValue: 'Dr. Kevin Vance (Attending Physician)', options: ['Dr. Kevin Vance (Attending Physician)', 'Dr. Sarah Lin (On-Call Resident)', 'Dr. David Marcus (Hospitalist NP)'] },
      { id: 'criticalData', label: 'Critical Finding / Lab Value', defaultValue: 'Critical Potassium 6.2 mEq/L (hemolysis excluded, verified by laboratory tech Mark at 15:02)', options: ['Critical Potassium 6.2 mEq/L (hemolysis excluded, verified by laboratory tech Mark at 15:02)', 'Critical Hemoglobin 6.4 g/dL (down from 8.8 g/dL yesterday)', 'Critical Blood Glucose 42 mg/dL with mild diaphoresis', 'Critical INR 5.8 (patient on Coumadin)'] },
      { id: 'assessment', label: 'Current Clinical Status & Vitals', defaultValue: 'Patient alert and oriented x 4. Denies chest pain or palpitations. Continuous telemetry shows NSR with normal T-waves. Vitals: BP 128/76, HR 72, RR 16.', options: ['Patient alert and oriented x 4. Denies chest pain or palpitations. Continuous telemetry shows NSR with normal T-waves. Vitals: BP 128/76, HR 72, RR 16.', 'Patient pale, fatigued, BP 102/64, HR 96. No active bleeding noted.', 'Diaphoretic, oriented x 3, speech intact. Glucose gel administered immediately.'] },
      { id: 'orders', label: 'New Orders Received & Read-Back', defaultValue: 'STAT 12-lead ECG, 10 units regular insulin IV with 1 amp D50W, Calcium gluconate 1g IV over 10 min, and repeat potassium in 2 hours. Order read back and confirmed with Dr. Vance.', options: ['STAT 12-lead ECG, 10 units regular insulin IV with 1 amp D50W, Calcium gluconate 1g IV over 10 min, and repeat potassium in 2 hours. Order read back and confirmed with Dr. Vance.', 'Type & Crossmatch 2 units PRBCs, transfuse unit #1 STAT. Consent verified. Order read back and verified.', 'Hold Coumadin, administer Vitamin K 2.5 mg PO, repeat INR in morning. Order read back and confirmed.'] },
    ],
    formats: {
      dar: {
        data: 'Received critical alert from laboratory: {criticalData}. Assessed patient status: {assessment}.',
        action: 'At {time}, contacted {provider}. SBAR communication delivered. Received orders: {orders}.',
        response: 'Orders entered and implemented immediately. Telemetry monitored continuously. Patient resting comfortably.',
      },
      soap: {
        subjective: 'Patient notified of critical lab result; denies acute complaints or palpitations.',
        objective: 'At {time}: {criticalData}. Baseline status: {assessment}. Notified: {provider}. Orders received: {orders}.',
        assessment: 'Critical laboratory finding addressed promptly with provider; medical treatment underway.',
        plan: 'Administer ordered medications, obtain follow-up diagnostic/lab tests as scheduled, monitor cardiac rhythm.',
      },
      narrative: 'At {time}, {provider} notified of {criticalData}. Current status: {assessment}. Telephone orders received: {orders}. Order was read back and verified in full. Interventions initiated.',
      concise: 'SBAR PROVIDER NOTIFICATION ({time}):\n• Finding: {criticalData}\n• Contacted: {provider}\n• Status: {assessment}\n• Orders Received & Read-Back: {orders}',
    },
  },

  // EMERGENCY: Acute Febrile Episode & Sepsis Surveillance
  {
    id: 'emergency-fever-febrile-episode',
    title: 'Acute Febrile Episode & Sepsis Surveillance',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Documentation for acute temperature spike (>38.0°C / 100.4°F), rigors, infectious source exam, sepsis screening (SIRS/qSOFA), blood cultures before antibiotics, and antipyretic delivery.',
    tags: ['fever', 'pyrexia', 'febrile', 'sepsis', 'sirs', 'qsofa', 'blood cultures', 'antipyretic', 'chills', 'rigors'],
    fields: [
      { id: 'time', label: 'Spike Discovery Time', defaultValue: '13:45', options: ['03:30', '09:15', '13:45', '18:20', '22:10'] },
      { id: 'tempVitals', label: 'Temperature & Hemodynamics', defaultValue: 'Temp: 39.1°C (102.4°F) oral | HR: 114 bpm sinus tachycardia | BP: 104/64 mmHg | RR: 22 bpm | SpO2: 96% on room air. Marked rigors, teeth chattering, and warm, diaphoretic skin noted.', options: ['Temp: 39.1°C (102.4°F) oral | HR: 114 bpm sinus tachycardia | BP: 104/64 mmHg | RR: 22 bpm | SpO2: 96% on room air. Marked rigors, teeth chattering, and warm, diaphoretic skin noted.', 'Temp: 38.6°C (101.5°F) core | HR: 102 bpm | BP: 112/68 mmHg | RR: 20 bpm | SpO2: 97% on room air. Flushed facies, mild chills.', 'Temp: 39.4°C (103.0°F) axillary | HR: 124 bpm | BP: 92/56 mmHg (MAP 68) | RR: 24 bpm | SpO2: 94%. Profuse sweating, lethargic.'] },
      { id: 'sourceExam', label: 'Physical Exam & Infectious Source', defaultValue: 'Respiratory: coarse crackles left lower base, productive yellow sputum. Abdomen: soft, non-tender. Foley: draining clear amber urine without foul odor. PIV site in left forearm clean, no erythema or cord. Surgical wound clean and dry.', options: ['Respiratory: coarse crackles left lower base, productive yellow sputum. Abdomen: soft, non-tender. Foley: draining clear amber urine without foul odor. PIV site in left forearm clean, no erythema or cord. Surgical wound clean and dry.', 'GU: Foley catheter draining cloudy amber urine with visible sediment and foul odor. Suprapubic area mildly tender to palpation.', 'Integumentary: Surgical incision site with 3 cm expanding erythematous margin, indurated, tender, purulent exudate along midline.', 'Vascular: Right internal jugular central line dressing intact; no erythema, purulence, or tenderness at catheter exit site.', 'Non-localizing: Head-to-toe exam reveals no clear focal source of infection; suspected systemic bacteremia / neutropenic fever.'] },
      { id: 'sepsisScreen', label: 'Sepsis Screen (SIRS / qSOFA)', defaultValue: 'SIRS positive (Temp 39.1°C >38.0°C, HR 114 >90, RR 22 >20). qSOFA = 1 (Tachypnea RR ≥22, SBP >100, GCS 15). Hospital Sepsis Protocol initiated.', options: ['SIRS positive (Temp 39.1°C >38.0°C, HR 114 >90, RR 22 >20). qSOFA = 1 (Tachypnea RR ≥22, SBP >100, GCS 15). Hospital Sepsis Protocol initiated.', 'SIRS positive (Temp 38.6°C, HR 102). qSOFA = 0. Close vital sign surveillance maintained.', 'Severe Sepsis Alert: SIRS positive with hypotension (SBP 92/56, MAP 68). Rapid Response Team and primary MD alerted for fluid resuscitation.'] },
      { id: 'diagnostics', label: 'STAT Cultures & Labs', defaultValue: 'STAT blood cultures x 2 sets drawn from 2 separate peripheral venipuncture sites (Left AC and Right cephalic) PRIOR to antibiotic initiation. STAT serum lactate, CBC with diff, CMP, and urinalysis sent to lab.', options: ['STAT blood cultures x 2 sets drawn from 2 separate peripheral venipuncture sites (Left AC and Right cephalic) PRIOR to antibiotic initiation. STAT serum lactate, CBC with diff, CMP, and urinalysis sent to lab.', 'Blood cultures x 2 sets drawn (1 peripheral, 1 from PICC line lumen). STAT lactate 1.9 mmol/L, sputum culture and CXR ordered.', 'Urinalysis with reflex microscopy and culture obtained. Blood cultures x 2 collected with 2% CHG 30-sec scrub.'] },
      { id: 'interventions', label: 'Antipyretics & Interventions', defaultValue: 'Administered Acetaminophen 1000 mg IV piggyback over 15 min per provider order. Heavy blankets replaced with single cotton sheet; cool damp washcloth applied to forehead. 0.9% Normal Saline IV bolus 500 mL initiated.', options: ['Administered Acetaminophen 1000 mg IV piggyback over 15 min per provider order. Heavy blankets replaced with single cotton sheet; cool damp washcloth applied to forehead. 0.9% Normal Saline IV bolus 500 mL initiated.', 'Administered Acetaminophen 650 mg PO with oral fluids. Non-pharmacologic cooling measures applied; shivering avoided.', 'Administered Cefepime 2g IV piggyback following blood culture collection. Acetaminophen 1000 mg PO given for comfort.', 'IV Vancomycin and Piperacillin-Tazobactam started after blood and urine cultures drawn. 1000 mL crystalloid bolus running.'] },
      { id: 'providerSBAR', label: 'Provider SBAR Communication', defaultValue: 'Dr. Rachel Adams (Attending Physician) notified at 13:52 via SBAR. Clinical data, temperature spike, and sepsis screen findings reported. Orders for blood cultures x 2, IV antibiotics, and fluid support verified and read back.', options: ['Dr. Rachel Adams (Attending Physician) notified at 13:52 via SBAR. Clinical data, temperature spike, and sepsis screen findings reported. Orders for blood cultures x 2, IV antibiotics, and fluid support verified and read back.', 'Hospitalist on duty notified via telephone; SBAR delivered. Orders received for broad-spectrum IV antimicrobials following culture collection.', 'Mid-level provider notified. Verbal order for antipyretics, STAT sepsis lab bundle, and repeat vitals verified.'] },
      { id: 'reassessment', label: 'Reassessment & Response', defaultValue: 'Reassessed at 14:45 (60 min post-antipyretic): Temp decreased to 37.8°C (100.0°F). HR: 88 bpm regular, BP: 114/70 mmHg, RR: 18 bpm, SpO2: 98%. Rigors subsided; skin warm and dry. Patient reports feeling significantly more comfortable.', options: ['Reassessed at 14:45 (60 min post-antipyretic): Temp decreased to 37.8°C (100.0°F). HR: 88 bpm regular, BP: 114/70 mmHg, RR: 18 bpm, SpO2: 98%. Rigors subsided; skin warm and dry. Patient reports feeling significantly more comfortable.', 'Temp 38.1°C at 45 min post-intervention. HR 94 bpm, BP stable. Patient resting without rigors.', 'Temp decreased to 37.4°C. Hemodynamics stable throughout. Awaiting blood culture and lab reports.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, patient experienced acute febrile spike: {tempVitals}. Physical source evaluation: {sourceExam}. Sepsis surveillance: {sepsisScreen}.',
        action: '{providerSBAR}. {diagnostics}. {interventions}. Continuous hemodynamic and pulse oximetry monitoring maintained.',
        response: '{reassessment}. Laboratory and culture results tracked in EHR.',
      },
      soap: {
        subjective: 'Patient reports sudden shaking chills, shivering, feeling hot, and generalized malaise. Denies acute chest pain.',
        objective: 'At {time}: {tempVitals}. Physical exam: {sourceExam}. Sepsis screen: {sepsisScreen}. Diagnostic workup: {diagnostics}. Treatment: {interventions}. Contacted provider: {providerSBAR}. Reassessment: {reassessment}.',
        assessment: 'Acute febrile episode with positive SIRS criteria; active workup for infectious source underway. Defervescence achieved with antipyretic therapy and IV hydration; hemodynamics stable.',
        plan: 'Monitor vital signs and core temperature q2-4h. Follow up on blood culture, sputum, and urine results. Administer prescribed empiric antibiotic regimen on schedule. Maintain fluid balance.',
      },
      narrative: 'At {time}, patient developed acute fever spike with rigors: {tempVitals}. Physical assessment for infectious focus: {sourceExam}. Sepsis screening: {sepsisScreen}. {providerSBAR}. STAT workup initiated: {diagnostics}. Antipyretic therapy and environmental cooling provided: {interventions}. Follow-up evaluation at {reassessment}. Patient resting comfortably.',
      concise: 'ACUTE FEBRILE EPISODE & SEPSIS SCREEN ({time}):\n• Temp & Vitals: {tempVitals}\n• Source Exam: {sourceExam}\n• Sepsis Screen: {sepsisScreen}\n• Provider SBAR: {providerSBAR}\n• Diagnostics: {diagnostics}\n• Interventions: {interventions}\n• Reassessment: {reassessment}',
    },
  },

  // 14. ROUTINE: Patient Discharge to Home
  {
    id: 'routine-discharge-home',
    title: 'Patient Discharge to Home / Facility',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Documentation of patient discharge instructions, medication review, prescriptions, and departure.',
    tags: ['discharge', 'departure', 'education', 'home care', 'prescriptions'],
    fields: [
      { id: 'time', label: 'Discharge Time', defaultValue: '13:30', options: ['11:00', '13:30', '16:00', '18:30'] },
      { id: 'transport', label: 'Accompaniment & Transportation', defaultValue: 'Discharged via wheelchair accompanied by spouse to private vehicle.', options: ['Discharged via wheelchair accompanied by spouse to private vehicle.', 'Discharged ambulatory with daughter assisting to private car.', 'Discharged via non-emergent medical transport (BLS ambulance) to skilled nursing facility.'] },
      { id: 'meds', label: 'Medication Reconciliation & Scripts', defaultValue: 'Medication reconciliation reviewed line-by-line with patient and spouse. Written prescriptions provided. New medications, side effects, and discontinued home medications emphasized.', options: ['Medication reconciliation reviewed line-by-line with patient and spouse. Written prescriptions provided. New medications, side effects, and discontinued home medications emphasized.', 'After-visit summary and medication list reviewed. Prescriptions sent electronically to patient retail pharmacy.'] },
      { id: 'education', label: 'Discharge Instructions & Red Flags', defaultValue: 'Post-discharge wound care, activity restrictions, and diet reviewed. Red flag warning symptoms (fever > 38.0°C, uncontrolled pain, shortness of breath, redness) reviewed.', options: ['Post-discharge wound care, activity restrictions, and diet reviewed. Red flag warning symptoms (fever > 38.0°C, uncontrolled pain, shortness of breath, redness) reviewed.', 'Activity precautions, lifting limits (< 10 lbs), and hydration instructions provided. Return-to-ED precautions discussed.'] },
      { id: 'followUp', label: 'Follow-up Appointments', defaultValue: 'Follow-up appointment confirmed with Dr. Miller on Friday at 10:00 AM. Written copy provided.', options: ['Follow-up appointment confirmed with Dr. Miller on Friday at 10:00 AM. Written copy provided.', 'Patient instructed to call surgeon office within 48 hours for 1-week staple removal appointment.', 'Follow-up with PCP within 5-7 business days scheduled.'] },
      { id: 'statusAtExit', label: 'Patient Status at Departure', defaultValue: 'IV discontinued intact. Belongings and valuables returned. Patient verbalized clear understanding with zero questions. Left unit in stable condition.', options: ['IV discontinued intact. Belongings and valuables returned. Patient verbalized clear understanding with zero questions. Left unit in stable condition.', 'Hemodynamically stable, pain 1/10, all belongings accounted for. Escorted safely to curbside.'] },
    ],
    formats: {
      dar: {
        data: 'Physician discharge order confirmed. Patient assessed and prepped for safe discharge.',
        action: 'At {time}, {meds}. {education}. {followUp}. {transport}.',
        response: '{statusAtExit}. All discharge packet papers signed and placed in chart.',
      },
      soap: {
        subjective: 'Patient expresses readiness for discharge home; states understanding of all instructions and medications.',
        objective: 'At {time}: {meds}. {education}. Follow-up: {followUp}. Departure: {transport}. {statusAtExit}.',
        assessment: 'Patient discharged in stable condition; demonstrated teach-back comprehension of discharge plan.',
        plan: 'Discharge complete. Chart closed and bed placed into environmental services terminal cleaning queue.',
      },
      narrative: 'At {time}, patient discharged. {meds}. {education}. {followUp}. {statusAtExit}. Transported via {transport}.',
      concise: 'DISCHARGE NOTE ({time}):\n• Meds/Scripts: {meds}\n• Education: {education}\n• Follow-up: {followUp}\n• Exit Status: {statusAtExit}\n• Transport: {transport}',
    },
  },

  // 15. ROUTINE: Bedridden Patient Comprehensive Care
  {
    id: 'routine-bedridden-care',
    title: 'Bedridden Patient Comprehensive Care & ADLs',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Documentation for total-care / bed-bound patients: bed bath, oral/eye hygiene, incontinence care, PROM, and safety.',
    tags: ['bedridden', 'total care', 'bed bound', 'adl', 'hygiene', 'prom', 'incontinence', 'safety'],
    fields: [
      { id: 'time', label: 'Time of Care', defaultValue: '09:00', options: ['07:30', '09:00', '13:30', '17:00', '21:00'] },
      { id: 'hygiene', label: 'Bath & Linen Care', defaultValue: 'Complete bed bath provided with warm water and pH-neutral cleanser. Skin dried and emollient lotion applied. Fresh bed linens placed free of wrinkles or dampness.', options: ['Complete bed bath provided with warm water and pH-neutral cleanser. Skin dried and emollient lotion applied. Fresh bed linens placed free of wrinkles or dampness.', 'Assisted sponge bath completed; back massage given; clean gown and fitted sheets changed.'] },
      { id: 'oralCare', label: 'Oral & Eye Care', defaultValue: 'Oral cavity cleansed with chlorhexidine swab and suction toothbrush. Lips lubricated with water-soluble moisturizer. Natural tears eye drops instilled to bilateral eyes.', options: ['Oral cavity cleansed with chlorhexidine swab and suction toothbrush. Lips lubricated with water-soluble moisturizer. Natural tears eye drops instilled to bilateral eyes.', 'Gentle mouth care performed with soft sponge swabs; oral mucosa pink and moist; dentures cleaned and placed.', 'Suction oral hygiene completed; secretional pooling cleared from buccal spaces.'] },
      { id: 'prom', label: 'Range of Motion (PROM) & Alignment', defaultValue: 'Passive Range of Motion (PROM) exercises performed to all 4 extremities (10 repetitions each joint). Bilateral foot drop boots applied; bilateral hand rolls repositioned.', options: ['Passive Range of Motion (PROM) exercises performed to all 4 extremities (10 repetitions each joint). Bilateral foot drop boots applied; bilateral hand rolls repositioned.', 'Gentle passive flexion and extension performed to upper and lower extremities. No contracture resistance or joint pain noted.', 'PROM completed by nursing staff and Physical Therapy; resting hand splints re-secured.'] },
      { id: 'incontinence', label: 'Incontinence & Perineal Hygiene', defaultValue: 'Perineal care provided with warm water and no-rinse skin cleanser. Sacral/perineal area cleansed, dried, and thick dimethicone/zinc barrier cream applied. Clean absorbent breathable pad positioned.', options: ['Perineal care provided with warm water and no-rinse skin cleanser. Sacral/perineal area cleansed, dried, and thick dimethicone/zinc barrier cream applied. Clean absorbent breathable pad positioned.', 'Incontinence brief changed. Skin clean and intact without moisture-associated skin damage (MASD). Barrier film applied.', 'Foley catheter tubing unobstructed and secured; perineal area cleansed around meatus.'] },
      { id: 'aspiration', label: 'HOB & Aspiration Precautions', defaultValue: 'Head of bed elevated to 30-45 degrees. Aspiration precautions maintained. Emergency bedside suction verified functional.', options: ['Head of bed elevated to 30-45 degrees. Aspiration precautions maintained. Emergency bedside suction verified functional.', 'HOB maintained at 30 degrees during rest, 45 degrees for enteral tube feeding. Oral suction at bedside.', 'HOB elevated 45 degrees; swallow precautions strictly observed.'] },
      { id: 'safety', label: 'Bedside Safety & Fall Measures', defaultValue: 'Bed placed in lowest position, bed alarm armed, 2 upper side rails raised, call bell affixed within patient reach.', options: ['Bed placed in lowest position, bed alarm armed, 2 upper side rails raised, call bell affixed within patient reach.', 'Low bed position verified, floor mat placed at bedside, non-skid footwear applied, bed alarm active.', 'Bed locked in lowest position, side rails padded, frequent comfort rounding maintained.'] },
    ],
    formats: {
      dar: {
        data: 'Patient is totally dependent for all activities of daily living (ADLs) and bed-bound. Baseline vital signs stable.',
        action: 'At {time}, {hygiene}. {oralCare}. {prom}. {incontinence}. {aspiration}. {safety}.',
        response: 'Patient appeared relaxed and comfortable following morning care. Skin clean and dry. No signs of distress or skin tears.',
      },
      soap: {
        subjective: 'Patient non-verbal / unable to communicate verbally; nodded comfortably and showed no non-verbal facial grimacing during care.',
        objective: 'At {time}: {hygiene}. {oralCare}. {prom}. {incontinence}. Safety status: {aspiration}. {safety}.',
        assessment: 'Patient receiving total nursing care. Skin intact, airway protected, joints mobile with PROM, safety measures intact.',
        plan: 'Continue q2h repositioning, skin inspections, scheduled hygiene and PROM, enteral nutrition safety, and strict pressure relief.',
      },
      narrative: 'At {time}, total bedridden patient care provided. {hygiene}. {oralCare}. {prom}. {incontinence}. {aspiration}. {safety}. Patient tolerated care comfortably with no adverse events.',
      concise: 'BEDRIDDEN CARE NOTE ({time}):\n• Hygiene: {hygiene}\n• Oral/Eye: {oralCare}\n• PROM/Contracture: {prom}\n• Perineal/Skin: {incontinence}\n• HOB: {aspiration}\n• Safety: {safety}\n• Status: Clean, comfortable, NAD.',
    },
  },

  // 16. ROUTINE: Patient Positioning & Turn Schedule
  {
    id: 'routine-positioning-turn',
    title: 'Patient Positioning & Turn Schedule (q2h)',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Documentation of scheduled body turns, 30-degree lateral tilt, offloading pressure points, and floating heels.',
    tags: ['positioning', 'turn schedule', 'q2h turn', 'pressure relief', 'heel float', 'tilt', 'wedge'],
    fields: [
      { id: 'time', label: 'Turn Time', defaultValue: '10:00', options: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00'] },
      { id: 'turnPosition', label: 'Position Achieved', defaultValue: 'Repositioned from supine to right 30-degree lateral tilt with high-density foam wedge supporting lumbar/back.', options: ['Repositioned from supine to right 30-degree lateral tilt with high-density foam wedge supporting lumbar/back.', 'Repositioned from right lateral tilt to left 30-degree lateral tilt using positioning wedge.', 'Repositioned from lateral tilt to supine with HOB elevated 30 degrees and knee gatch slightly flexed.', 'Repositioned to semi-Fowler position (30 degrees) with spine in neutral alignment.'] },
      { id: 'bonyOffloading', label: 'Pressure Point Offloading', defaultValue: 'Sacrum, coccyx, and greater trochanter completely offloaded. Pillows placed between knees and medial malleoli to eliminate bone-on-bone friction.', options: ['Sacrum, coccyx, and greater trochanter completely offloaded. Pillows placed between knees and medial malleoli to eliminate bone-on-bone friction.', 'Ischial tuberosities and sacrum offloaded. Support cushion placed under dependent arm.', 'Back and pelvis supported at 30-degree angle; direct pressure on greater trochanter avoided.'] },
      { id: 'heels', label: 'Heel Elevation / Suspension', defaultValue: 'Bilateral heels suspended and completely floated off mattress surface using pre-formed heel lift suspension boots.', options: ['Bilateral heels suspended and completely floated off mattress surface using pre-formed heel lift suspension boots.', 'Pillows placed lengthwise under bilateral calves, ensuring heels remain completely suspended without mattress contact.', 'Padded heel protectors verified on bilateral lower extremities, zero pressure on Achilles tendons.'] },
      { id: 'skinInspection', label: 'Skin Check During Turn', defaultValue: 'Skin over sacrum, coccyx, scapulae, and bilateral hips inspected: intact, pink, blanchable, no redness or breakdown.', options: ['Skin over sacrum, coccyx, scapulae, and bilateral hips inspected: intact, pink, blanchable, no redness or breakdown.', 'Integument over sacrum intact; faint non-tender blanchable erythema resolving after relief of pressure.', 'Skin over bony prominences intact without moisture, bruising, or shear injury.'] },
      { id: 'supportSurface', label: 'Support Surface & Alignment', defaultValue: 'Alternating pressure low air loss mattress overlay functional. Spine maintained in straight anatomical alignment. Linens pulled taut without wrinkles.', options: ['Alternating pressure low air loss mattress overlay functional. Spine maintained in straight anatomical alignment. Linens pulled taut without wrinkles.', 'Pressure-reducing foam mattress intact. Draw sheet smoothed flat. Extremities supported in physiological flexion.'] },
      { id: 'comfort', label: 'Comfort & Call Bell', defaultValue: 'Patient states comfortable in new position; denies musculoskeletal ache. Call bell placed within easy reach; bed in lowest position.', options: ['Patient states comfortable in new position; denies musculoskeletal ache. Call bell placed within easy reach; bed in lowest position.', 'Patient resting calmly without signs of discomfort. Bed alarm activated; 2 upper side rails up.'] },
    ],
    formats: {
      dar: {
        data: 'Scheduled 2-hour repositioning due for bed-bound patient on pressure ulcer prevention protocol.',
        action: 'At {time}, assisted patient with turn. {turnPosition}. {bonyOffloading}. {heels}. {supportSurface}. Inspected: {skinInspection}.',
        response: '{comfort}. Next turn scheduled in 2 hours per protocol.',
      },
      soap: {
        subjective: 'Patient reports feeling well supported in current position; denies pressure discomfort or numbness.',
        objective: 'At {time}: {turnPosition}. {bonyOffloading}. {heels}. Skin: {skinInspection}. Surface: {supportSurface}.',
        assessment: 'Repositioning successful; pressure points effectively redistributed and offloaded. Skin barrier intact.',
        plan: 'Continue alternating turns q2h (left lateral 30°, supine 30°, right lateral 30°), keep heels floated, maintain skin dry.',
      },
      narrative: 'At {time}, scheduled turn completed. {turnPosition}. {bonyOffloading}. {heels}. Skin inspected during repositioning: {skinInspection}. {supportSurface}. {comfort}.',
      concise: 'POSITIONING / TURN NOTE ({time}):\n• Position: {turnPosition}\n• Offloading: {bonyOffloading}\n• Heels: {heels}\n• Skin Check: {skinInspection}\n• Bed/Alignment: {supportSurface}\n• Patient Status: {comfort}',
    },
  },

  // 17. WOUND: Skin and Pressure Area Care
  {
    id: 'wound-skin-pressure-care',
    title: 'Skin & Pressure Area Assessment & Prophylaxis',
    category: 'wound',
    categoryLabel: 'Wound & Skin Care',
    description: 'Comprehensive skin assessment, Braden score evaluation, pressure injury prophylaxis, and barrier treatment.',
    tags: ['skin care', 'pressure area', 'braden scale', 'pressure injury', 'barrier cream', 'mepilex', 'sacrum', 'moisture'],
    fields: [
      { id: 'time', label: 'Assessment Time', defaultValue: '08:30', options: ['08:30', '12:00', '16:30', '20:30'] },
      { id: 'bradenScore', label: 'Braden Scale Score & Risk', defaultValue: 'Braden score: 13 (Moderate Risk) — Sensory: 3, Moisture: 2, Activity: 1, Mobility: 2, Nutrition: 3, Friction/Shear: 2.', options: ['Braden score: 13 (Moderate Risk) — Sensory: 3, Moisture: 2, Activity: 1, Mobility: 2, Nutrition: 3, Friction/Shear: 2.', 'Braden score: 11 (High Risk) — Sensory: 2, Moisture: 2, Activity: 1, Mobility: 2, Nutrition: 2, Friction/Shear: 2.', 'Braden score: 17 (Low Risk) — Sensory: 4, Moisture: 3, Activity: 2, Mobility: 3, Nutrition: 3, Friction/Shear: 2.'] },
      { id: 'bonyProminences', label: 'Bony Prominences Exam', defaultValue: 'Sacrum, coccyx, bilateral ischia, greater trochanters, and bilateral heels inspected. Intact skin throughout with no non-blanchable erythema, deep tissue pressure injury (DTPI), or skin breakdown.', options: ['Sacrum, coccyx, bilateral ischia, greater trochanters, and bilateral heels inspected. Intact skin throughout with no non-blanchable erythema, deep tissue pressure injury (DTPI), or skin breakdown.', 'Sacrum displays 2x2 cm area of faint blanchable erythema with warm skin; no open skin or induration.', 'Bilateral heels inspected: soft, intact, pale pink, non-tender, cap refill < 3 sec. Sacral skin intact.'] },
      { id: 'moistureFolds', label: 'Skin Folds & Moisture Status', defaultValue: 'Skin folds (inguinal, inframammary, gluteal cleft) clean, dry, and intact. No maceration, erythema, or moisture-associated skin damage (MASD).', options: ['Skin folds (inguinal, inframammary, gluteal cleft) clean, dry, and intact. No maceration, erythema, or moisture-associated skin damage (MASD).', 'Mild erythema under gluteal cleft secondary to moisture. Cleansed gently, patted dry, and InterDry moisture-wicking fabric placed.', 'Skin folds intact and dry. Moisture barrier paste applied to perianal region.'] },
      { id: 'prophylaxis', label: 'Prophylactic Dressings & Barrier', defaultValue: 'Prophylactic 5-layer silicone bordered foam dressing (Mepilex Border Sacrum) dated and applied smoothly to sacrum. Dimethicone skin protectant applied to surrounding periwound skin.', options: ['Prophylactic 5-layer silicone bordered foam dressing (Mepilex Border Sacrum) dated and applied smoothly to sacrum. Dimethicone skin protectant applied to surrounding periwound skin.', 'Existing sacral silicone foam dressing lifted, underlying skin assessed intact, and dressing reapplied smoothly.', 'Barrier cream with zinc oxide applied to perineum; foam heel boots repositioned on bilateral lower extremities.'] },
      { id: 'surfaceIntervention', label: 'Support Surface & Education', defaultValue: 'Low air-loss alternating-pressure mattress in use and functioning. Friction-reducing slide sheet utilized for boosting to prevent shearing forces. Patient educated on avoiding dragging during micro-moves.', options: ['Low air-loss alternating-pressure mattress in use and functioning. Friction-reducing slide sheet utilized for boosting to prevent shearing forces. Patient educated on avoiding dragging during micro-moves.', 'Dynamic air mattress active. Heel float suspension maintained. Family educated on reporting any new tender or red spots.'] },
    ],
    formats: {
      dar: {
        data: 'Full body skin assessment performed. {bradenScore}. Bony prominences: {bonyProminences}. Skin folds: {moistureFolds}.',
        action: 'At {time}, initiated pressure ulcer prevention protocol. {prophylaxis}. {surfaceIntervention}. Scheduled q2h turn protocol maintained.',
        response: 'Skin remains intact without pressure injury or breakdown. Patient voiced comfort and understanding of repositioning importance.',
      },
      soap: {
        subjective: 'Patient denies localized itching, burning, soreness, or pressure pain over sacrum, hips, or heels.',
        objective: 'At {time}: {bradenScore}. Prominences: {bonyProminences}. Folds: {moistureFolds}. Interventions: {prophylaxis}. Bed surface: {surfaceIntervention}.',
        assessment: 'High risk for pressure-related skin breakdown secondary to immobility. Skin currently intact; preventive interventions active.',
        plan: 'Reassess Braden score every 24 hours. Perform daily skin inspections, keep skin dry and moisturized, offload heels continuously, turn q2h.',
      },
      narrative: 'At {time}, comprehensive skin and pressure area assessment completed. {bradenScore}. Bony prominences: {bonyProminences}. Skin folds: {moistureFolds}. Applied {prophylaxis}. {surfaceIntervention}. Patient resting comfortably.',
      concise: 'SKIN & PRESSURE CARE ({time}):\n• Risk: {bradenScore}\n• Bony Prominences: {bonyProminences}\n• Moisture/Folds: {moistureFolds}\n• Prophylaxis: {prophylaxis}\n• Surface/Shear: {surfaceIntervention}\n• Status: Intact, no breakdown.',
    },
  },

  // 18. RESPIRATORY: Oral & Oropharyngeal Suctioning
  {
    id: 'resp-oral-suctioning',
    title: 'Oral & Oropharyngeal Suctioning (Yankauer)',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Documentation for oral and oropharyngeal secretion removal, mouth care, and airway patency using a Yankauer suction catheter.',
    tags: ['suctioning', 'oral suction', 'yankauer', 'oropharyngeal', 'secretions', 'airway', 'aspiration'],
    fields: [
      { id: 'time', label: 'Suction Time', defaultValue: '08:45', options: ['08:45', '11:15', '14:30', '18:00', '22:15'] },
      { id: 'indication', label: 'Indication for Suctioning', defaultValue: 'Audible pooled upper airway secretions, weak voluntary cough, unable to expectorate saliva.', options: ['Audible pooled upper airway secretions, weak voluntary cough, unable to expectorate saliva.', 'Gurgling respirations, drooling, high risk for aspiration prior to oral intake.', 'Frequent coughing with copious oral secretions in non-intubated stroke patient.', 'Pre-extubation oral clearance and hygiene.'] },
      { id: 'device', label: 'Equipment & Suction Pressure', defaultValue: 'Sterile Yankauer suction tip connected to wall suction regulated at 100-120 mmHg. Catheter sheath in place.', options: ['Sterile Yankauer suction tip connected to wall suction regulated at 100-120 mmHg. Catheter sheath in place.', 'Yankauer suction catheter regulated at 80-100 mmHg continuous suction.', 'Clean Yankauer wand with suction tubing rinsed with sterile water post-procedure.'] },
      { id: 'secretions', label: 'Aspirated Secretion Characteristics', defaultValue: 'Approximately 20 mL of thick, tenacious, clear-to-white secretions suctioned from sublingual space and posterior pharynx.', options: ['Approximately 20 mL of thick, tenacious, clear-to-white secretions suctioned from sublingual space and posterior pharynx.', 'Moderate amount (15 mL) of frothy, thin, clear saliva evacuated. No blood noted.', 'Copious tenacious yellowish secretions suctioned from buccal cavities.', 'Scant thin secretions removed; airway cleared.'] },
      { id: 'mouthCare', label: 'Oral Care Provided', defaultValue: 'Mouth swabbed with antiseptic oral rinse and suction sponge. Teeth brushed gently. Tongue and buccal mucosa inspected (intact, moist). Water-soluble lip balm applied.', options: ['Mouth swabbed with antiseptic oral rinse and suction sponge. Teeth brushed gently. Tongue and buccal mucosa inspected (intact, moist). Water-soluble lip balm applied.', 'Chlorhexidine 0.12% oral rinse applied via swab. Buccal mucosa pink and intact; lips moisturized.', 'Oral cavity rinsed with sterile water swab; tongue clear; no trauma or bleeding.'] },
      { id: 'postStatus', label: 'Post-Procedure Airway & Vitals', defaultValue: 'Breath sounds clear to auscultation without upper airway gurgling. SpO2 98% on room air, RR 16, unlabored. Patient expressed relief.', options: ['Breath sounds clear to auscultation without upper airway gurgling. SpO2 98% on room air, RR 16, unlabored. Patient expressed relief.', 'Upper airway rattling cleared. SpO2 maintained at 96% on 2L NC. Patient resting quietly.', 'Airway patent, breathing relaxed. No gagging, vomiting, or oral mucosal injury.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed patient for airway clearance. {indication}. Baseline SpO2 94% with audible gurgling.',
        action: 'At {time}, performed oropharyngeal suctioning. {device}. Evacuated: {secretions}. {mouthCare}. Tubing flushed with sterile water.',
        response: '{postStatus}. Suction catheter stored cleanly in designated bedside sheath. Patient resting comfortably.',
      },
      soap: {
        subjective: 'Patient signaled relief after suctioning; nodded when asked if breathing felt easier.',
        objective: 'At {time}: {indication}. {device}. Output: {secretions}. Oral care: {mouthCare}. Post-vitals: {postStatus}.',
        assessment: 'Ineffective airway clearance resolved with oropharyngeal suctioning; airway patent; oral mucosa intact.',
        plan: 'Provide oral suctioning PRN and before/after meals or medication administration. Maintain suction setup at bedside.',
      },
      narrative: 'At {time}, oral suctioning performed due to {indication}. {device}. {secretions}. Completed oral hygiene: {mouthCare}. {postStatus}. Procedure tolerated without complication.',
      concise: 'ORAL SUCTIONING ({time}):\n• Indication: {indication}\n• Equipment: {device}\n• Secretions: {secretions}\n• Oral Care: {mouthCare}\n• Outcome: {postStatus}',
    },
  },

  // 19. RESPIRATORY: Deep Endotracheal / Inline Tracheal Suctioning
  {
    id: 'resp-endotracheal-suctioning',
    title: 'Deep Endotracheal / Inline Tracheal Suctioning',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Sterile closed inline suctioning via endotracheal or tracheostomy tube with pre-oxygenation and hemodynamic monitoring.',
    tags: ['suctioning', 'endotracheal', 'inline suction', 'deep suction', 'ventilator', 'trach', 'secretions'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '10:15', options: ['06:30', '10:15', '14:00', '18:30', '22:00'] },
      { id: 'airwayType', label: 'Airway Type & Tube Size', defaultValue: 'Size 7.5 Oral Endotracheal Tube (ETT) secured at 22 cm at teeth', options: ['Size 7.5 Oral Endotracheal Tube (ETT) secured at 22 cm at teeth', 'Size 8.0 Oral Endotracheal Tube (ETT) secured at 23 cm at teeth', 'Size 7.0 Tracheostomy tube with closed inline catheter', 'Size 8.0 Cuffed Tracheostomy tube with inline suction'] },
      { id: 'preOxygenation', label: 'Pre-Oxygenation & Baseline Vitals', defaultValue: 'Pre-oxygenated with 100% FiO2 for 2 minutes via ventilator suction button. Baseline: HR 78 NSR, BP 124/76, SpO2 97%.', options: ['Pre-oxygenated with 100% FiO2 for 2 minutes via ventilator suction button. Baseline: HR 78 NSR, BP 124/76, SpO2 97%.', 'Pre-oxygenated with 100% O2 for 1 minute. Baseline vitals: HR 86, SpO2 95% on prescribed settings.', 'Hyperoxygenated with 100% O2 via ventilator. Vitals stable; no cardiac ectopy.'] },
      { id: 'technique', label: 'Suction Passes & Suction Pressure', defaultValue: 'Closed in-line suction catheter advanced gently to carina and withdrawn 1-2 cm. Intermittent suction applied at 100 mmHg while rotating catheter out over 8-10 seconds x 2 passes.', options: ['Closed in-line suction catheter advanced gently to carina and withdrawn 1-2 cm. Intermittent suction applied at 100 mmHg while rotating catheter out over 8-10 seconds x 2 passes.', 'Sterile 14Fr catheter advanced to resistance, pulled back 1 cm; suction applied < 10 sec x 1 pass.', 'Closed inline suction x 2 passes allowing 30-sec recovery between passes. Suction set at 120 mmHg.'] },
      { id: 'secretions', label: 'Secretions Aspirated', defaultValue: 'Evacuated 15 mL of thick, pale yellow secretions. Zero bloody tingeing or purulence noted. Catheter sleeve fully retracted and locked.', options: ['Evacuated 15 mL of thick, pale yellow secretions. Zero bloody tingeing or purulence noted. Catheter sleeve fully retracted and locked.', 'Cleared 10 mL of thin, white/clear secretions. Catheter flushed with sterile saline bullet.', 'Moderate thick tenacious secretions cleared; ventilator high peak pressure alarm resolved.'] },
      { id: 'postAuscultation', label: 'Post-Suction Auscultation & Vitals', defaultValue: 'Bilateral breath sounds improved with decreased coarse rhonchi. SpO2 99%, HR 80 NSR without bradycardia. FiO2 returned to baseline (40%). Ventilator peak inspiratory pressures normalized.', options: ['Bilateral breath sounds improved with decreased coarse rhonchi. SpO2 99%, HR 80 NSR without bradycardia. FiO2 returned to baseline (40%). Ventilator peak inspiratory pressures normalized.', 'Lungs clear bilaterally post-suctioning; SpO2 stable at 98%; patient settled without tachypnea.', 'Airway cleared; SpO2 97%; telemetry showed no arrhythmias or desaturations during pass.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed artificial airway for {airwayType}. Coarse rhonchi on auscultation, high peak inspiratory pressure alarm triggered. SpO2 93%.',
        action: 'At {time}, {preOxygenation}. Performed deep suctioning: {technique}. Aspirated: {secretions}. Inline catheter rinsed with sterile saline.',
        response: '{postAuscultation}. Patient tolerated well without bronchospasm, vagal bradycardia, or hypoxia.',
      },
      soap: {
        subjective: 'Intubated/mechanically ventilated patient; unable to speak. Nodded comfortably post-procedure.',
        objective: 'At {time}: {airwayType}. {preOxygenation}. Interventions: {technique}. Secretions: {secretions}. Post-status: {postAuscultation}.',
        assessment: 'Endotracheal airway cleared of tenacious secretions; improved alveolar ventilation and normal peak pressures.',
        plan: 'Continue inline suctioning PRN based on clinical cues (rhonchi, coughing against vent, elevated peak pressures). Maintain ETT depth.',
      },
      narrative: 'At {time}, inline suctioning performed on {airwayType}. {preOxygenation}. {technique}. {secretions}. Post-procedure assessment revealed {postAuscultation}. No complications noted.',
      concise: 'ENDOTRACHEAL SUCTIONING ({time}):\n• Airway: {airwayType}\n• Pre-O2: {preOxygenation}\n• Technique: {technique}\n• Secretions: {secretions}\n• Outcome: {postAuscultation}',
    },
  },

  // 20. RESPIRATORY: Nasopharyngeal (NP) Airway Suctioning
  {
    id: 'resp-nasopharyngeal-suctioning',
    title: 'Nasopharyngeal (NP) Airway Suctioning',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Sterile catheter suctioning via nasopharyngeal route for patients unable to clear deeper airway secretions.',
    tags: ['suctioning', 'nasopharyngeal', 'NP suction', 'nasal trumpet', 'airway', 'secretions'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '09:30', options: ['07:00', '09:30', '13:00', '16:30', '21:00'] },
      { id: 'indication', label: 'Clinical Indication', defaultValue: 'Ineffective cough with retained secretions in pharynx/larynx, rhonchi on auscultation, unable to expectorate.', options: ['Ineffective cough with retained secretions in pharynx/larynx, rhonchi on auscultation, unable to expectorate.', 'Decreased sensorium with rattling upper airway secretions; oral suctioning inadequate to clear pharynx.', 'Post-stroke dysphagia with pooled pharyngeal secretions; desaturation to 92% on room air.'] },
      { id: 'routeDevice', label: 'Catheter & Route', defaultValue: 'Sterile 12 French suction catheter with water-soluble lubricant passed gently through right nasal trumpet (nasopharyngeal airway) along floor of nose.', options: ['Sterile 12 French suction catheter with water-soluble lubricant passed gently through right nasal trumpet (nasopharyngeal airway) along floor of nose.', 'Sterile 10 French catheter well-lubricated with sterile jelly inserted gently into left nares without resistance.', 'Sterile 12 French catheter introduced through patent right nasal trumpet without force.'] },
      { id: 'technique', label: 'Suction Technique & Pressure', defaultValue: 'Advanced 12 cm until cough stimulated. Intermittent wall suction at 100 mmHg applied while gently rotating and withdrawing catheter over 8 seconds. Single pass performed.', options: ['Advanced 12 cm until cough stimulated. Intermittent wall suction at 100 mmHg applied while gently rotating and withdrawing catheter over 8 seconds. Single pass performed.', 'Intermittent suction applied on withdrawal (< 10 seconds). Catheter flushed with sterile water.', 'Suction applied intermittently x 2 passes with 1-minute oxygen recovery between passes.'] },
      { id: 'secretions', label: 'Secretions Obtained', defaultValue: 'Approximately 10 mL of thick, white/frothy secretions cleared. No evidence of epistaxis, blood, or tissue trauma.', options: ['Approximately 10 mL of thick, white/frothy secretions cleared. No evidence of epistaxis, blood, or tissue trauma.', 'Moderate amount (15 mL) of tenacious yellowish mucous evacuated. Nares clear and intact.', 'Scant thin secretions obtained; airway patent.'] },
      { id: 'tolerance', label: 'Patient Tolerance & Breath Sounds', defaultValue: 'Patient stimulated to cough effectively. Breath sounds improved bilaterally with clearing of coarse rhonchi. SpO2 97% on 2L NC. Denied nasal pain.', options: ['Patient stimulated to cough effectively. Breath sounds improved bilaterally with clearing of coarse rhonchi. SpO2 97% on 2L NC. Denied nasal pain.', 'Tolerated well with mild transient tearing; no epistaxis; respiratory rate settled from 26 to 18; unlabored.', 'Airway cleared; SpO2 improved to 98% on prescribed O2; resting comfortably.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed patient with retained airway secretions: {indication}. SpO2 92% on room air.',
        action: 'At {time}, prepped patient. {routeDevice}. {technique}. Evacuated: {secretions}. Flushed catheter with sterile water.',
        response: '{tolerance}. Breathing quiet and comfortable.',
      },
      soap: {
        subjective: 'Patient nodded understanding prior to procedure; indicated breathing was much easier following suctioning.',
        objective: 'At {time}: {indication}. Route: {routeDevice}. Technique: {technique}. Secretions: {secretions}. Post-vitals: {tolerance}.',
        assessment: 'Pharyngeal airway cleared of obstructive secretions; oxygenation and respiratory comfort restored.',
        plan: 'Monitor respiratory status q2h. Suction via NP route PRN only if oral clearance insufficient. Maintain patent nasal trumpet.',
      },
      narrative: 'At {time}, nasopharyngeal suctioning performed for {indication}. {routeDevice}. {technique}. {secretions}. {tolerance}. Procedure completed without complications.',
      concise: 'NP SUCTIONING ({time}):\n• Indication: {indication}\n• Route: {routeDevice}\n• Technique: {technique}\n• Secretions: {secretions}\n• Outcome: {tolerance}',
    },
  },

  // 21. ROUTINE: Shift Change Bedside Handoff & Receiving Note
  {
    id: 'routine-shift-receiving-handoff',
    title: 'Shift Change Bedside Handoff & Receiving Note',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Standard bedside shift-to-shift handover and assumption of care note: dual-RN safety checks, 2-identifier verification, code status, lines/pumps, drains, and shift priorities.',
    tags: ['receiving', 'shift receiving', 'handoff', 'assumption of care', 'bedside report', 'shift change', 'SBAR', 'dual RN', 'shift report'],
    fields: [
      { id: 'time', label: 'Shift Change Time', defaultValue: '07:15', options: ['07:00', '07:15', '07:30', '15:00', '15:15', '19:00', '19:15', '19:30', '23:00'] },
      { id: 'handoffSourceRN', label: 'Bedside Handoff, Dual RN & Identifiers', defaultValue: 'Bedside SBAR handover conducted with off-going RN Sarah Jenkins, BSN, RN. Patient identity confirmed via 2 unique identifiers (Full Name & DOB) against hospital barcode wristband. Allergy band verified (NKDA). Code status confirmed: Full Code.', options: [
        'Bedside SBAR handover conducted with off-going RN Sarah Jenkins, BSN, RN. Patient identity confirmed via 2 unique identifiers (Full Name & DOB) against hospital barcode wristband. Allergy band verified (NKDA). Code status confirmed: Full Code.',
        'Bedside handover conducted with night shift RN. Patient identity verified. Code status confirmed: DNR / DNI with signed advance directive active in chart. Allergy band verified NKDA.',
        'Bedside shift transition completed at change of shift with off-going nurse. 2 identifiers confirmed. Resuscitation goals and family contacts reviewed.'
      ]},
      { id: 'primaryDiagnosisEvents', label: 'Primary Diagnosis, Hospital Day & Previous Shift Events', defaultValue: 'Admitted for Acute Exacerbation of Heart Failure (Hospital Day #3) under Hospitalist Dr. Reynolds. Patient rested comfortably overnight; received scheduled diuresis; denied nocturnal orthopnea or paroxysmal dyspnea. Zero acute events or rapid response triggers reported.', options: [
        'Admitted for Acute Exacerbation of Heart Failure (Hospital Day #3) under Hospitalist Dr. Reynolds. Patient rested comfortably overnight; received scheduled diuresis; denied nocturnal orthopnea or paroxysmal dyspnea. Zero acute events or rapid response triggers reported.',
        'Post-op Day #1 status-post Right Total Knee Arthroplasty. Pain well-controlled overnight; PT ambulated in hallway yesterday evening. Surgical site dry without bleeding.',
        'Admitted for Community-Acquired Pneumonia and Sepsis (Hospital Day #2). Completed IV antibiotic infusion at 04:00; afebrile overnight. Oxygen requirements stable on 2L NC.',
        'Admitted for Syncope and telemetry monitoring. Telemetry reviewed: sinus rhythm without pauses, ectopy, or ventricular arrhythmias overnight.'
      ]},
      { id: 'clinicalBaselineVitals', label: 'Clinical Baseline, Neuro, Telemetry & Vitals', defaultValue: 'Alert and oriented x 4, speech clear, PERRL 3mm brisk, follows commands. Telemetry confirms Normal Sinus Rhythm (HR 74 bpm). Breath sounds clear bilaterally, unlabored on room air (SpO2 98%). Vitals: BP 122/76 mmHg, HR 74 bpm, RR 16 bpm, Temp 36.8°C. Pain rated 0/10.', options: [
        'Alert and oriented x 4, speech clear, PERRL 3mm brisk, follows commands. Telemetry confirms Normal Sinus Rhythm (HR 74 bpm). Breath sounds clear bilaterally, unlabored on room air (SpO2 98%). Vitals: BP 122/76 mmHg, HR 74 bpm, RR 16 bpm, Temp 36.8°C. Pain rated 0/10.',
        'Alert, oriented x 3 (oriented to person, place, month). Baseline mild cognitive impairment unchanged. Sinus rhythm with occasional PACs. SpO2 96% on 2L NC. Vitals: BP 136/82, HR 82, RR 18. Pain 2/10 dull backache.',
        'Drowsy but easily arousable to voice, oriented x 4. Telemetry: Atrial Fibrillation with controlled ventricular response (HR 70-85). Lungs clear, abdomen soft. Vitals stable.'
      ]},
      { id: 'linesInfusionsPumps', label: 'Vascular Access, Infusions & Dual-RN Pump Verification', defaultValue: 'Right forearm 20-gauge peripheral IV inspected at bedside: patent, flushes freely without resistance, site clean and intact with dated transparent dressing. Maintenance IV 0.9% Normal Saline infusing at 75 mL/hr; infusion rate, volume to be infused, and pump programming co-verified with off-going RN.', options: [
        'Right forearm 20-gauge peripheral IV inspected at bedside: patent, flushes freely without resistance, site clean and intact with dated transparent dressing. Maintenance IV 0.9% Normal Saline infusing at 75 mL/hr; infusion rate, volume to be infused, and pump programming co-verified with off-going RN.',
        'Left upper arm double-lumen PICC line: dressing clean, dry, intact with chlorhexidine biopatch dated 2 days ago. Both lumens patent; saline locked. Zero active infusions.',
        'Right subclavian triple lumen central line: Lumen #1 infusing Norepinephrine at 0.04 mcg/kg/min; Lumen #2 maintenance fluids. Dual-RN independent double-check of drug concentration and smart pump rate completed.',
        'Two peripheral IVs (18G LAC, 20G right wrist) patent and saline locked. Blood return verified on both sites.'
      ]},
      { id: 'drainsWoundsOutputs', label: 'Drains, Tubes, Urinary Output & Surgical Dressings', defaultValue: 'Foley catheter patent, secured with Statlock to right thigh, tubing dependent without dependent loops; draining clear amber urine (cumulative night shift output: 750 mL). Midline abdominal surgical dressing dry, intact, zero strike-through. JP drain #1 active to negative pressure bulb suction with 15 mL serosanguinous output.', options: [
        'Foley catheter patent, secured with Statlock to right thigh, tubing dependent without dependent loops; draining clear amber urine (cumulative night shift output: 750 mL). Midline abdominal surgical dressing dry, intact, zero strike-through. JP drain #1 active to negative pressure bulb suction with 15 mL serosanguinous output.',
        'Zero indwelling catheters or surgical drains. Voiding independently without dysuria; last void at 06:15. Skin over sacrum and bony prominences inspected and intact.',
        'Nasogastric tube (Salem Sump 16Fr) connected to low intermittent wall suction; draining scant greenish-brown gastric contents; tube secured at 55 cm mark at right nostril.',
        'Chest tube to left pleural space: 20 cmH2O continuous suction, zero active air leak in water seal chamber, 45 mL serosanguinous output logged over 12 hours.'
      ]},
      { id: 'safetyEnvironment', label: 'Bedside Environmental Safety & Emergency Equipment', defaultValue: 'Bed locked in lowest position. Bed alarm armed and tested. Yellow fall-risk wristband and non-skid socks verified. Call bell positioned directly in patient right hand. Suction canister with Yankauer and flowmeter verified functional at bedside. Emergency 100% O2 mask and flowmeter confirmed intact.', options: [
        'Bed locked in lowest position. Bed alarm armed and tested. Yellow fall-risk wristband and non-skid socks verified. Call bell positioned directly in patient right hand. Suction canister with Yankauer and flowmeter verified functional at bedside. Emergency 100% O2 mask and flowmeter confirmed intact.',
        'Safety checks 100% compliant: Bed in low position, 2 upper side rails elevated, call bell accessible, room uncluttered, wall suction and oxygen checked.',
        'High fall risk precautions active: Bed alarm on, wireless chair alarm functional, mobility aid (walker) at bedside, non-skid footwear verified.'
      ]},
      { id: 'shiftPrioritiesPlan', label: 'Shift Priorities, Pending Labs & Anticipated Disposition', defaultValue: 'Shift priorities established: morning routine blood draws (CBC, BMP, Magnesium) scheduled for 08:00; Physical Therapy evaluation scheduled for 10:30; interdisciplinary clinical team rounds with Hospitalist at 11:00; repeat diuresis dose due at 12:00. Care assumed for shift.', options: [
        'Shift priorities established: morning routine blood draws (CBC, BMP, Magnesium) scheduled for 08:00; Physical Therapy evaluation scheduled for 10:30; interdisciplinary clinical team rounds with Hospitalist at 11:00; repeat diuresis dose due at 12:00. Care assumed for shift.',
        'Shift plan: Transport to CT Chest at 09:30; monitor cardiac enzyme troponin trending; discuss discharge planning with case manager; educate on home medications.',
        'Night shift plan: Administer evening medications at 21:00; repeat morning fasting glucose at 06:00; maintain nocturnal turn schedule q2h; promote uninterrupted sleep hygiene.',
        'Surgical prep plan: Patient NPO after midnight for scheduled OR procedure; pre-op checklist to be initiated at 06:00.'
      ]},
    ],
    formats: {
      dar: {
        data: 'At {time}, participated in bedside shift handover for patient. {handoffSourceRN}. Clinical summary: {primaryDiagnosisEvents}. Baseline assessment: {clinicalBaselineVitals}. Access: {linesInfusionsPumps}. Tubes/drains: {drainsWoundsOutputs}.',
        action: 'Verified bedside equipment: {safetyEnvironment}. Confirmed pump settings with dual-nurse verification. Established shift care plan: {shiftPrioritiesPlan}.',
        response: 'Patient confirmed identity, expressed understanding of shift goals, and reported comfortable baseline without acute complaints. Care safely assumed for the shift.',
      },
      soap: {
        subjective: 'Patient participated in bedside shift report; states feeling rested and comfortable. Denies acute pain, nausea, or shortness of breath. Agrees with daily clinical care goals.',
        objective: 'At {time}: {handoffSourceRN}. Baseline clinical status: {primaryDiagnosisEvents}. Physical exam & vitals: {clinicalBaselineVitals}. Access & pumps: {linesInfusionsPumps}. Drains & site: {drainsWoundsOutputs}. Safety equipment: {safetyEnvironment}. Planned interventions: {shiftPrioritiesPlan}.',
        assessment: 'Patient safely received at shift change; baseline stability verified; resuscitation status, active lines, infusions, and safety precautions confirmed without discrepancy.',
        plan: 'Assume primary nursing care for shift. Execute shift priorities: {shiftPrioritiesPlan}. Continue scheduled monitoring, safety rounding, and collaborative multidisciplinary plan.',
      },
      narrative: 'At {time}, co-conducted bedside shift handover with off-going RN. {handoffSourceRN}. {primaryDiagnosisEvents}. Clinical baseline assessment: {clinicalBaselineVitals}. Vascular access, active infusions, and pump rates independently verified: {linesInfusionsPumps}. Tubes, catheters, and surgical sites inspected: {drainsWoundsOutputs}. Bedside environmental safety check completed: {safetyEnvironment}. Shift goals and scheduled items reviewed: {shiftPrioritiesPlan}. Patient comfortable, call light in reach, care assumed.',
      concise: 'SHIFT RECEIVING & HANDOFF NOTE ({time}):\n• Handoff & Code Status: {handoffSourceRN}\n• Diagnosis & Summary: {primaryDiagnosisEvents}\n• Vitals & Telemetry: {clinicalBaselineVitals}\n• Lines & Infusion Rates: {linesInfusionsPumps}\n• Tubes, Drains & Dressings: {drainsWoundsOutputs}\n• Bedside Safety & Environment: {safetyEnvironment}\n• Shift Plan & Priorities: {shiftPrioritiesPlan}\n• Status: Care assumed, NAD.',
    },
  },

  // 22. ROUTINE: Unit Admission & ED Patient Receiving Note
  {
    id: 'routine-ed-admission-receiving',
    title: 'Unit Admission & ED Patient Receiving Note',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Comprehensive intake and bedside handoff documentation for receiving a patient from the Emergency Department or direct admission.',
    tags: ['receiving', 'admission', 'transfer in', 'ED transfer', 'handoff', 'intake', 'bedside report'],
    fields: [
      { id: 'time', label: 'Time Received on Unit', defaultValue: '14:30', options: ['08:00', '11:15', '14:30', '19:45', '23:30', '03:15'] },
      { id: 'transferSource', label: 'Transfer Mode & Source', defaultValue: 'Received to room via stretcher from Emergency Department accompanied by ED transport and ED RN.', options: ['Received to room via stretcher from Emergency Department accompanied by ED transport and ED RN.', 'Received to room via wheelchair accompanied by family and admission escort.', 'Received via EMS stretcher from outside hospital transfer; transport report received.'] },
      { id: 'handoff', label: 'Bedside Handoff & Identifiers', defaultValue: 'Bedside SBAR handoff report received from ED RN. Patient identity confirmed with 2 unique identifiers (Name, DOB) against hospital ID band. Code status confirmed: Full Code. Allergy band verified: NKDA.', options: ['Bedside SBAR handoff report received from ED RN. Patient identity confirmed with 2 unique identifiers (Name, DOB) against hospital ID band. Code status confirmed: Full Code. Allergy band verified: NKDA.', 'Full verbal SBAR handoff completed at bedside. Patient identity and allergy status verified. Code status confirmed: DNR/DNI with active POLST in chart.'] },
      { id: 'vitals', label: 'Arrival Baseline Vitals', defaultValue: 'BP: 128/76 | HR: 82 NSR | RR: 18 | SpO2: 97% on room air | Temp: 37.0°C | Pain: 2/10', options: ['BP: 128/76 | HR: 82 NSR | RR: 18 | SpO2: 97% on room air | Temp: 37.0°C | Pain: 2/10', 'BP: 110/68 | HR: 74 | RR: 16 | SpO2: 98% on 2L NC | Temp: 36.8°C | Pain: 0/10', 'BP: 142/84 | HR: 90 | RR: 20 | SpO2: 95% on room air | Temp: 37.4°C | Pain: 4/10'] },
      { id: 'linesTubes', label: 'Vascular Access, Lines & Fluids', defaultValue: '20G PIV in right forearm patent, flushes easily, intact transparent dressing. Infusing 0.9% Normal Saline at 75 mL/hr via primary pump.', options: ['20G PIV in right forearm patent, flushes easily, intact transparent dressing. Infusing 0.9% Normal Saline at 75 mL/hr via primary pump.', '18G PIV in left antecubital patent, saline locked. Foley catheter draining clear amber urine.', 'Two peripheral IVs (20G right forearm, 22G left hand) intact and patent. Telemetry placed: Sinus rhythm.'] },
      { id: 'skinCheck', label: 'Arrival Skin & Pressure Assessment', defaultValue: 'Co-witnessed arrival skin check completed with transferring staff: skin warm, dry, and intact throughout. No hospital-acquired pressure injuries, tears, or deep tissue injury. Braden score assessed at 17.', options: ['Co-witnessed arrival skin check completed with transferring staff: skin warm, dry, and intact throughout. No hospital-acquired pressure injuries, tears, or deep tissue injury. Braden score assessed at 17.', 'Skin inspected: Stage 1 blanchable erythema noted over coccyx; baseline documented. Heel protectors placed. Braden score 14.', 'Skin intact; old surgical scar to midline abdomen clean and dry. No bruising or breakdown.'] },
      { id: 'safetyBelongings', label: 'Safety, Belongings & Orders', defaultValue: 'Belongings inventory logged. Yellow fall-risk wristband and non-skid socks placed. Bed in lowest position with bed alarm active. Call bell placed in patient hand. Attending physician notified of unit arrival.', options: ['Belongings inventory logged. Yellow fall-risk wristband and non-skid socks placed. Bed in lowest position with bed alarm active. Call bell placed in patient hand. Attending physician notified of unit arrival.', 'Orientation to room and call system completed. Bed locked in low position. Physician admission orders reviewed and implemented.', 'Patient accompanied by spouse. Valuables sent home. Fall precautions active; call bell within reach.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, {transferSource}. {handoff}. Baseline arrival vitals: {vitals}. Access: {linesTubes}. Skin: {skinCheck}.',
        action: 'Assisted patient comfortably into hospital bed. Placed telemetry. {safetyBelongings}. Admission order reconciliation underway.',
        response: 'Patient settled comfortably in room. Denies acute distress. Verbalized understanding of call bell usage and safety rules.',
      },
      soap: {
        subjective: 'Patient reports feeling fatigued from ED stay; expresses satisfaction with arriving in inpatient room. Pain rated {vitals}.',
        objective: 'At {time}: {transferSource}. Bedside handoff: {handoff}. Arrival vitals: {vitals}. Lines: {linesTubes}. Skin on arrival: {skinCheck}. Safety: {safetyBelongings}.',
        assessment: 'Patient received and safely admitted to inpatient unit; clinical baseline established without acute decompensation.',
        plan: 'Complete electronic admission database, medication reconciliation, initiate ordered IV fluids/medications, monitor vitals q4h.',
      },
      narrative: 'At {time}, {transferSource}. {handoff}. Baseline vitals recorded: {vitals}. Lines and monitoring verified: {linesTubes}. Arrival skin check: {skinCheck}. {safetyBelongings}. Patient resting comfortably in no acute distress.',
      concise: 'RECEIVING / ADMISSION NOTE ({time}):\n• Source: {transferSource}\n• Handoff/ID: {handoff}\n• Arrival Vitals: {vitals}\n• Lines/Fluids: {linesTubes}\n• Skin Check: {skinCheck}\n• Safety/Orders: {safetyBelongings}',
    },
  },

  // 22. ROUTINE: Post-Operative / PACU Patient Receiving Note
  {
    id: 'routine-pacu-postop-receiving',
    title: 'Post-Operative / PACU Patient Receiving Note',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Documentation for receiving a post-surgical patient transferred from the Post-Anesthesia Care Unit (PACU) or Operating Room.',
    tags: ['receiving', 'post-op', 'PACU transfer', 'surgical receiving', 'drain', 'incision', 'aldrete', 'recovery'],
    fields: [
      { id: 'time', label: 'Arrival Time', defaultValue: '15:15', options: ['10:30', '13:00', '15:15', '17:45', '20:30'] },
      { id: 'surgicalHandoff', label: 'Procedure & PACU Handoff', defaultValue: 'Received from PACU via gurney accompanied by PACU RN. Procedure: Laparoscopic cholecystectomy under general anesthesia. Aldrete discharge recovery score: 9/10.', options: ['Received from PACU via gurney accompanied by PACU RN. Procedure: Laparoscopic cholecystectomy under general anesthesia. Aldrete discharge recovery score: 9/10.', 'Received from PACU via stretcher. Procedure: Right total knee arthroplasty under spinal anesthesia with peripheral nerve block. Aldrete score: 10/10.', 'Received from PACU following open umbilical hernia repair. General anesthesia reversed without incident.'] },
      { id: 'airwaySedation', label: 'Airway & Sedation Level', defaultValue: 'Airway patent, breathing spontaneous and unlabored on 2L nasal cannula. Arousable to voice, oriented x 4, drowsy but easily re-oriented.', options: ['Airway patent, breathing spontaneous and unlabored on 2L nasal cannula. Arousable to voice, oriented x 4, drowsy but easily re-oriented.', 'Awake, alert, oriented x 4. Denies shortness of breath. SpO2 99% on room air.', 'Lethargic secondary to perioperative analgesia; easily arousable, follows commands, airway intact.'] },
      { id: 'arrivalVitals', label: 'Arrival Vitals, Pain & Nausea', defaultValue: 'BP: 122/74 | HR: 76 | RR: 16 | SpO2: 98% on 2L NC | Temp: 36.8°C. Pain rated 3/10 at incision site; denies nausea.', options: ['BP: 122/74 | HR: 76 | RR: 16 | SpO2: 98% on 2L NC | Temp: 36.8°C. Pain rated 3/10 at incision site; denies nausea.', 'BP: 134/80 | HR: 84 | RR: 18 | SpO2: 97% on room air | Temp: 37.0°C. Pain rated 4/10; mild nausea reported, anti-emetic ordered.', 'BP: 114/70 | HR: 68 | RR: 14 | SpO2: 99% on 2L NC. Surgical site pain well-controlled (1/10).'] },
      { id: 'surgicalSite', label: 'Dressings, Incisions & Drains', defaultValue: 'Surgical dressings clean, dry, and intact with zero strike-through bleeding. JP drain #1 in right upper quadrant active to bulb suction with 15 mL serosanguinous output.', options: ['Surgical dressings clean, dry, and intact with zero strike-through bleeding. JP drain #1 in right upper quadrant active to bulb suction with 15 mL serosanguinous output.', 'Knee compression dressing dry and intact. Hemovac drain active with 40 mL bloody drainage. Pedal pulses 2+ bilaterally.', 'Incisional Steri-Strips dry, flat, and intact. No drains present. Peri-incisional skin clean.'] },
      { id: 'linesFluids', label: 'IV Lines, Fluids & Output', defaultValue: '18G PIV in left forearm patent; infusing Plasmalyte at 100 mL/hr. Foley catheter draining clear yellow urine (120 mL in bag).', options: ['18G PIV in left forearm patent; infusing Plasmalyte at 100 mL/hr. Foley catheter draining clear yellow urine (120 mL in bag).', '20G PIV in right forearm patent with maintenance D5 1/2 NS at 75 mL/hr. Voiding trial pending post-anesthesia.', '20G PIV patent, saline locked. PCA pump connected and verified per dual-RN sign-off.'] },
      { id: 'postopOrders', label: 'Post-Op Orders & Safety Equipment', defaultValue: 'Post-op orders reviewed. Sequential Compression Devices (SCDs) applied to bilateral lower extremities and operating. Incentive spirometer placed at bedside (taught 10 breaths/hr). Call bell in reach.', options: ['Post-op orders reviewed. Sequential Compression Devices (SCDs) applied to bilateral lower extremities and operating. Incentive spirometer placed at bedside (taught 10 breaths/hr). Call bell in reach.', 'Post-op orders confirmed. Ice pack applied to surgical site per order. Bed alarm armed; side rails x 2 raised. Attending surgeon notified of arrival.', 'Post-op vitals protocol initiated (q15m x 4, q30m x 2, q1h x 4). Warm blanket provided.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, {surgicalHandoff}. Airway/neuro: {airwaySedation}. Arrival vitals: {arrivalVitals}. Surgical site: {surgicalSite}. Lines/fluids: {linesFluids}.',
        action: 'Transferred safely from gurney to bed using slide board x 3 staff. {postopOrders}. Initiated post-operative vital sign protocol.',
        response: 'Patient resting comfortably in semi-Fowler position. Surgical dressing remains dry. Pain managed effectively.',
      },
      soap: {
        subjective: 'Patient states incision feels sore (rated {arrivalVitals}); denies nausea, chills, or difficulty breathing.',
        objective: 'At {time}: {surgicalHandoff}. Neuro/Airway: {airwaySedation}. Vitals: {arrivalVitals}. Wound/Drains: {surgicalSite}. Access: {linesFluids}. Devices: {postopOrders}.',
        assessment: 'Patient received post-operatively from PACU; stable hemodynamics, wound intact without hemorrhage, recovering per expected clinical pathway.',
        plan: 'Continue post-op vital signs protocol, pulmonary hygiene (IS q1h while awake), monitor drain output, administer scheduled and PRN analgesics.',
      },
      narrative: 'At {time}, {surgicalHandoff}. Patient transferred to bed safely. Status: {airwaySedation}. Arrival vitals: {arrivalVitals}. Surgical site verified: {surgicalSite}. Access and fluids: {linesFluids}. {postopOrders}. Patient settled comfortably.',
      concise: 'POST-OP PACU RECEIVING NOTE ({time}):\n• Handoff: {surgicalHandoff}\n• Neuro/Airway: {airwaySedation}\n• Vitals/Pain: {arrivalVitals}\n• Surgical Site/Drains: {surgicalSite}\n• Lines/Fluids: {linesFluids}\n• Post-Op Care: {postopOrders}',
    },
  },

  // 23. ROUTINE: ICU Step-Down / Transfer-In Receiving Note
  {
    id: 'routine-icu-stepdown-receiving',
    title: 'ICU Step-Down / Transfer-In Receiving Note',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Documentation for patients stepping down from the Intensive Care Unit (ICU) to Progressive Care or Med-Surg.',
    tags: ['receiving', 'stepdown', 'ICU transfer', 'transfer in', 'intermediate care', 'telemetry'],
    fields: [
      { id: 'time', label: 'Transfer Arrival Time', defaultValue: '11:00', options: ['07:30', '11:00', '15:00', '19:30'] },
      { id: 'icuHandoff', label: 'ICU Source & Step-Down Criteria', defaultValue: 'Received via inpatient bed from Medical ICU accompanied by ICU nurse. Patient meets step-down criteria following stabilization of acute condition. All vasoactive infusions successfully weaned and stopped > 12 hours ago.', options: ['Received via inpatient bed from Medical ICU accompanied by ICU nurse. Patient meets step-down criteria following stabilization of acute condition. All vasoactive infusions successfully weaned and stopped > 12 hours ago.', 'Received from Surgical ICU following extubation and 24 hours of stable pulmonary status. SBAR handoff received.', 'Received from Neuro ICU; neurological status stable and non-fluctuating; intracranial monitoring lines discontinued prior to transfer.'] },
      { id: 'clinicalBaseline', label: 'Neuro, Pulmonary & Cardiac Baseline', defaultValue: 'Alert, oriented x 4. Follows commands. Lungs clear to auscultation bilaterally on room air. Telemetry transferred and active: Sinus rhythm with normal intervals, HR 76.', options: ['Alert, oriented x 4. Follows commands. Lungs clear to auscultation bilaterally on room air. Telemetry transferred and active: Sinus rhythm with normal intervals, HR 76.', 'Alert, oriented x 3. SpO2 96% on 2L NC. Telemetry shows controlled Atrial Fibrillation with ventricular rate 72-84.', 'Neurologically intact, motor strength 5/5 bilaterally. Breath sounds clear, unlabored on room air.'] },
      { id: 'vitals', label: 'Arrival Vital Signs', defaultValue: 'BP: 122/74 | HR: 76 | RR: 16 | SpO2: 98% on room air | Temp: 36.9°C | Blood glucose: 118 mg/dL', options: ['BP: 122/74 | HR: 76 | RR: 16 | SpO2: 98% on room air | Temp: 36.9°C | Blood glucose: 118 mg/dL', 'BP: 116/70 | HR: 80 | RR: 18 | SpO2: 97% on 2L NC | Temp: 37.1°C', 'BP: 130/78 | HR: 72 | RR: 16 | SpO2: 99% on RA | Temp: 36.7°C'] },
      { id: 'linesDrains', label: 'Lines, Catheters & Drains', defaultValue: 'Right internal jugular (IJ) triple lumen catheter intact with sterile CHG dressing dated yesterday; all lumens patent and flushed. 20G PIV left forearm patent. Foley catheter removed prior to transfer; voiding independently.', options: ['Right internal jugular (IJ) triple lumen catheter intact with sterile CHG dressing dated yesterday; all lumens patent and flushed. 20G PIV left forearm patent. Foley catheter removed prior to transfer; voiding independently.', 'Single lumen PICC in right arm patent with biopatch dressing intact. No active central line infusions.', 'Peripheral IV in right forearm patent. All arterial and central lines discontinued in ICU.'] },
      { id: 'skinCheck', label: 'Skin Assessment on Transfer', defaultValue: 'Transfer skin check completed with ICU RN: skin intact throughout without hospital-acquired pressure injuries. Braden score 16. Barrier cream maintained to sacrum.', options: ['Transfer skin check completed with ICU RN: skin intact throughout without hospital-acquired pressure injuries. Braden score 16. Barrier cream maintained to sacrum.', 'Skin intact; sacral prophylactic silicone foam dressing clean, dry, and in place.', 'Skin intact, dry, no redness over bony prominences. Heels floated.'] },
      { id: 'ordersSafety', label: 'Transfer Orders & Safety', defaultValue: 'Step-down transfer orders reviewed and active. Receiving hospitalist notified of patient arrival. Bed locked in low position, bed alarm armed, call bell placed in hand. Fall precautions maintained.', options: ['Step-down transfer orders reviewed and active. Receiving hospitalist notified of patient arrival. Bed locked in low position, bed alarm armed, call bell placed in hand. Fall precautions maintained.', 'Transfer medication reconciliation confirmed. Diet resumed as ordered. Call light within reach.', 'Step-down protocols initiated; vital signs schedule set to q4h; safety check complete.'] },
    ],
    formats: {
      dar: {
        data: 'At {time}, {icuHandoff}. Baseline status: {clinicalBaseline}. Vitals: {vitals}. Lines: {linesDrains}. Skin: {skinCheck}.',
        action: 'Bedside report received. Connected to central telemetry monitoring. {ordersSafety}. Reconciled transfer orders.',
        response: 'Patient verbalized satisfaction with transfer to step-down. Resting comfortably without acute complaints.',
      },
      soap: {
        subjective: 'Patient states feeling much better compared to ICU admission; expresses readiness to continue recovery on step-down unit.',
        objective: 'At {time}: {icuHandoff}. Neuro/Resp/CV: {clinicalBaseline}. Vitals: {vitals}. Lines/Drains: {linesDrains}. Skin: {skinCheck}. Safety: {ordersSafety}.',
        assessment: 'Patient successfully transitioned from ICU to step-down level of care; hemodynamically stable off critical infusions.',
        plan: 'Continue continuous telemetry monitoring, step-down vital signs q4h, progressive ambulation, and advance oral intake per orders.',
      },
      narrative: 'At {time}, {icuHandoff}. Clinical assessment: {clinicalBaseline}. Arrival vitals: {vitals}. Access and lines verified: {linesDrains}. Skin verified: {skinCheck}. {ordersSafety}. Patient in stable condition.',
      concise: 'ICU STEP-DOWN RECEIVING NOTE ({time}):\n• Transfer: {icuHandoff}\n• Baseline: {clinicalBaseline}\n• Vitals: {vitals}\n• Lines/Drains: {linesDrains}\n• Skin Check: {skinCheck}\n• Orders/Safety: {ordersSafety}',
    },
  },

  // 24. RESPIRATORY: Mechanical Ventilation Assessment & Settings Note
  {
    id: 'resp-mech-vent-assessment',
    title: 'Mechanical Ventilation Assessment & Settings Note',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Comprehensive routine assessment for mechanically ventilated patients: artificial airway, cuff pressure, mode & settings, mechanics, synchrony, and sedation.',
    tags: ['mechanical ventilation', 'ventilator', 'vent check', 'intubated', 'airway', 'cuff pressure', 'respiratory', 'ICU', 'RASS'],
    fields: [
      { id: 'time', label: 'Assessment Time', defaultValue: '08:00', options: ['04:00', '08:00', '12:00', '16:00', '20:00', '00:00'] },
      { id: 'airway', label: 'Airway, Depth & Cuff Pressure', defaultValue: 'Size 7.5 mm oral ETT secured with commercial anchor at 22 cm at central incisors. Skin under anchor intact. Cuff pressure measured via manometer at 24 cmH2O (target 20-30 cmH2O). Pilot balloon intact.', options: ['Size 7.5 mm oral ETT secured with commercial anchor at 22 cm at central incisors. Skin under anchor intact. Cuff pressure measured via manometer at 24 cmH2O (target 20-30 cmH2O). Pilot balloon intact.', 'Size 8.0 mm oral ETT secured at 23 cm at teeth. Cuff pressure verified at 25 cmH2O without audible leak.', 'Size 8.0 cuffed tracheostomy tube in place, flange secure, cuff pressure 22 cmH2O.'] },
      { id: 'ventSettings', label: 'Ventilator Mode & Prescribed Settings', defaultValue: 'Mode: PRVC / Assist-Control | Set Vt: 450 mL | Set Rate: 14 bpm | PEEP: +8 cmH2O | FiO2: 40%', options: ['Mode: PRVC / Assist-Control | Set Vt: 450 mL | Set Rate: 14 bpm | PEEP: +8 cmH2O | FiO2: 40%', 'Mode: Volume Control (AC/VC) | Set Vt: 420 mL | Set Rate: 16 bpm | PEEP: +5 cmH2O | FiO2: 35%', 'Mode: Pressure Support / CPAP | PS: 10 cmH2O | PEEP: +5 cmH2O | FiO2: 30% | Flow trigger: 2.0 L/min', 'Mode: Pressure Control (AC/PC) | Insp Pressure: 18 cmH2O | Rate: 16 | PEEP: +10 cmH2O | FiO2: 50%'] },
      { id: 'mechanics', label: 'Pulmonary Mechanics & Synchrony', defaultValue: 'Total rate: 16 bpm | Exhaled Vt: 460 mL | Minute Vent: 7.4 L/min | Peak Inspiratory Pressure (PIP): 22 cmH2O | Pplat: 18 cmH2O. Patient synchronous with ventilator, no bucking or tachypnea.', options: ['Total rate: 16 bpm | Exhaled Vt: 460 mL | Minute Vent: 7.4 L/min | Peak Inspiratory Pressure (PIP): 22 cmH2O | Pplat: 18 cmH2O. Patient synchronous with ventilator, no bucking or tachypnea.', 'Total rate: 18 bpm | Exhaled Vt: 430 mL | PIP: 26 cmH2O. Good chest excursion bilaterally; breathing in synchrony with delivered breaths.', 'Spontaneous rate 18 bpm on pressure support; exhaled volumes consistent at 400-450 mL; PIP 16 cmH2O.'] },
      { id: 'auscultation', label: 'Chest Auscultation & Secretions', defaultValue: 'Bilateral chest rise symmetrical. Breath sounds present in all lung fields with scattered coarse rhonchi cleared following inline suctioning. SpO2 98%.', options: ['Bilateral chest rise symmetrical. Breath sounds present in all lung fields with scattered coarse rhonchi cleared following inline suctioning. SpO2 98%.', 'Bilateral breath sounds clear throughout, unlabored ventilator synchrony. SpO2 99%.', 'Diminished breath sounds at bilateral bases with fine end-inspiratory crackles. Inline suction catheter patent.'] },
      { id: 'sedationRASS', label: 'Sedation (RASS), Delirium & Pain', defaultValue: 'RASS score: -1 (drowsy, opens eyes and makes sustained eye contact to voice). CAM-ICU: Negative for delirium. CPOT pain score: 0/8. Propofol infusing at 20 mcg/kg/min.', options: ['RASS score: -1 (drowsy, opens eyes and makes sustained eye contact to voice). CAM-ICU: Negative for delirium. CPOT pain score: 0/8. Propofol infusing at 20 mcg/kg/min.', 'RASS score: 0 (alert and calm, follows simple commands). CPOT score 0/8. Sedation weaned; comfortable.', 'RASS score: -2 (light sedation, briefly awakens to eye contact to voice < 10 sec). Dexmedetomidine at 0.7 mcg/kg/hr.'] },
      { id: 'safetyVAP', label: 'VAP Bundle & Bedside Emergency Equipment', defaultValue: 'Head of bed elevated to 35 degrees. Closed inline suction system in place. Emergency resuscitation bag (Ambu bag) with PEEP valve, mask, and functional suction setup verified at bedside.', options: ['Head of bed elevated to 35 degrees. Closed inline suction system in place. Emergency resuscitation bag (Ambu bag) with PEEP valve, mask, and functional suction setup verified at bedside.', 'HOB maintained at 40 degrees. Subglottic suction active. Bedside emergency airway equipment (same-size ETT, stylet, bag-valve mask) confirmed present.', 'VAP bundle compliant: HOB > 30°, chlorhexidine oral care, peptic ulcer prophylaxis, DVT boots active.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed intubated patient on mechanical ventilation at {time}. Airway: {airway}. Settings: {ventSettings}. Mechanics: {mechanics}. Auscultation: {auscultation}. Sedation/comfort: {sedationRASS}.',
        action: 'Maintained ventilator circuit integrity without breaks. Verified {safetyVAP}. Assessed cuff pressure with manometer. Closed inline suction maintained.',
        response: 'Patient remains stable and synchronous on mechanical ventilation. Oxygenation maintained without ventilator alarm triggers.',
      },
      soap: {
        subjective: 'Patient intubated; non-verbal. Nods appropriately to questions; denies acute pain or dyspnea via hand gestures (CPOT 0/8).',
        objective: 'At {time}: {airway}. Ventilator: {ventSettings}. Mechanics: {mechanics}. Lungs: {auscultation}. Sedation: {sedationRASS}. Safety: {safetyVAP}.',
        assessment: 'Mechanically ventilated patient with stable gas exchange, acceptable peak airway pressures, and good patient-ventilator synchrony.',
        plan: 'Continue ventilator management, q4h cuff pressure checks, VAP bundle compliance, maintain sedation at light target (RASS -1 to 0), evaluate for morning weaning trial.',
      },
      narrative: 'At {time}, comprehensive mechanical ventilation assessment performed. Airway: {airway}. Ventilator settings: {ventSettings}. Pulmonary mechanics: {mechanics}. Lung sounds: {auscultation}. Sedation and analgesia: {sedationRASS}. {safetyVAP}. Patient stable and comfortable.',
      concise: 'VENTILATOR ASSESSMENT ({time}):\n• Airway & Cuff: {airway}\n• Mode/Settings: {ventSettings}\n• Mechanics: {mechanics}\n• Lungs/SpO2: {auscultation}\n• Sedation/RASS: {sedationRASS}\n• VAP/Safety: {safetyVAP}',
    },
  },

  // 25. RESPIRATORY: Ventilator Care & VAP Prevention Bundle
  {
    id: 'resp-mech-vent-care-vap',
    title: 'Ventilator Care & VAP Prevention Bundle',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Documentation of VAP prevention bundle: oral decontamination with chlorhexidine, subglottic aspiration, ETT repositioning, and circuit management.',
    tags: ['ventilator care', 'VAP bundle', 'oral care', 'chlorhexidine', 'subglottic', 'reposition ETT', 'ICU', 'mechanical ventilation'],
    fields: [
      { id: 'time', label: 'Care Time', defaultValue: '10:00', options: ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00'] },
      { id: 'oralHygiene', label: 'Chlorhexidine & Oral Decontamination', defaultValue: 'Comprehensive oral care performed: teeth and tongue brushed with suction toothbrush. Buccal mucosa, gingiva, and palate swabbed with chlorhexidine gluconate 0.12% oral rinse. Water-soluble moisturizer applied to lips.', options: ['Comprehensive oral care performed: teeth and tongue brushed with suction toothbrush. Buccal mucosa, gingiva, and palate swabbed with chlorhexidine gluconate 0.12% oral rinse. Water-soluble moisturizer applied to lips.', 'Suction oral hygiene completed with hydrogen peroxide oral solution; rinsed thoroughly; mouth and tongue clean and moist.', 'Chlorhexidine 0.12% swab decontamination completed; oral cavity clear of pooled saliva; lip barrier cream applied.'] },
      { id: 'subglottic', label: 'Subglottic Secretion Evacuation', defaultValue: 'Continuous subglottic aspiration lumen checked; evacuated 10 mL of pooled subglottic secretions from above ETT cuff. Lumen flushed with 5 mL sterile air per protocol.', options: ['Continuous subglottic aspiration lumen checked; evacuated 10 mL of pooled subglottic secretions from above ETT cuff. Lumen flushed with 5 mL sterile air per protocol.', 'Subglottic suction applied using 10 mL syringe: 6 mL clear-amber secretional fluid evacuated; zero resistance.', 'Subglottic drainage line patent and functioning without obstruction.'] },
      { id: 'ettReposition', label: 'ETT Repositioning & Skin Check', defaultValue: 'ETT repositioned from right oral commissure to left oral commissure to prevent tongue/lip pressure necrosis. Oral mucosa inspected: pink, intact, no ulceration. Tube secured at 22 cm at teeth with commercial holder.', options: ['ETT repositioned from right oral commissure to left oral commissure to prevent tongue/lip pressure necrosis. Oral mucosa inspected: pink, intact, no ulceration. Tube secured at 22 cm at teeth with commercial holder.', 'ETT rotated from left to right side of mouth; anchor strap replaced; depth re-verified at 23 cm at central incisors.', 'ETT securement verified stable at 22 cm; commercial anchor pad clean and dry; skin underneath intact.'] },
      { id: 'circuitCare', label: 'Circuit Humidification & Condensate', defaultValue: 'Heated wire breathing circuit inspected; humidification active at 37°C. Tubing free of condensation buildup; water traps positioned dependent away from patient airway.', options: ['Heated wire breathing circuit inspected; humidification active at 37°C. Tubing free of condensation buildup; water traps positioned dependent away from patient airway.', 'Closed in-line suction catheter replaced per 72-hour routine schedule; dated and labeled. Circuit intact.', 'HME filter inspected and clean; no excessive moisture or secretional buildup.'] },
      { id: 'bundleChecks', label: 'VAP Bundle Ancillary Elements', defaultValue: 'Head of bed maintained at 35-45 degrees. Peptic ulcer disease prophylaxis active (Pantoprazole IV). DVT mechanical prophylaxis active (SCDs functioning bilaterally). Daily sedation vacation evaluated.', options: ['Head of bed maintained at 35-45 degrees. Peptic ulcer disease prophylaxis active (Pantoprazole IV). DVT mechanical prophylaxis active (SCDs functioning bilaterally). Daily sedation vacation evaluated.', 'HOB confirmed at 30 degrees. Subglottic suctioning active. DVT pharmacologic & mechanical prophylaxis confirmed.'] },
      { id: 'tolerance', label: 'Patient Tolerance & Stability', defaultValue: 'Patient tolerated all ventilator bundle interventions comfortably without gagging, coughing against vent, or oxygen desaturation. SpO2 maintained at 98%.', options: ['Patient tolerated all ventilator bundle interventions comfortably without gagging, coughing against vent, or oxygen desaturation. SpO2 maintained at 98%.', 'Procedure tolerated well with 2nd nurse stabilizing ETT during anchor adjustment. Hemodynamics stable throughout.', 'Resting comfortably post-care. Airway patent, breath sounds bilaterally clear.'] },
    ],
    formats: {
      dar: {
        data: 'Scheduled VAP prevention bundle care due for intubated patient. Baseline SpO2 97%, cuff pressure 24 cmH2O.',
        action: 'At {time}, performed bundle interventions: {oralHygiene}. {subglottic}. {ettReposition}. {circuitCare}. Maintained {bundleChecks}.',
        response: '{tolerance}. ETT position and securement verified.',
      },
      soap: {
        subjective: 'Patient calm and resting; acknowledges care provided with head nod; shows no signs of agitation or discomfort.',
        objective: 'At {time}: {oralHygiene}. Subglottic suction: {subglottic}. ETT care: {ettReposition}. Circuit: {circuitCare}. Bundle compliance: {bundleChecks}.',
        assessment: 'VAP prevention bundle implemented successfully; artificial airway and oral cavity clean, intact, and protected from micro-aspiration.',
        plan: 'Repeat chlorhexidine oral care q12h, suction mouth and subglottic port q4h and PRN, maintain HOB > 30 degrees continuously.',
      },
      narrative: 'At {time}, ventilator care and VAP bundle protocol completed. {oralHygiene}. {subglottic}. {ettReposition}. {circuitCare}. {bundleChecks}. {tolerance}.',
      concise: 'VENTILATOR CARE & VAP BUNDLE ({time}):\n• Oral Decontamination: {oralHygiene}\n• Subglottic Suction: {subglottic}\n• ETT Reposition/Anchor: {ettReposition}\n• Circuit/Humidifier: {circuitCare}\n• VAP Elements: {bundleChecks}\n• Outcome: {tolerance}',
    },
  },

  // 26. RESPIRATORY: Mechanical Ventilation In-Line Suctioning Note
  {
    id: 'resp-inline-vent-suction',
    title: 'Mechanical Ventilation In-Line Suctioning Note',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Sterile closed-circuit inline endotracheal suctioning on mechanical ventilation with pre-oxygenation, secretion characterization, and airway mechanics monitoring.',
    tags: ['suctioning', 'inline suction', 'closed suction', 'mechanical ventilation', 'ventilator', 'PIP alarm', 'secretions', 'endotracheal'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '11:30', options: ['07:15', '11:30', '15:45', '19:30', '23:15', '03:45'] },
      { id: 'indication', label: 'Indication & Alarms Triggered', defaultValue: 'High peak inspiratory pressure (PIP) alarm triggered at 36 cmH2O, rhonchi auscultated over main bronchi, visible secretions in endotracheal tube adapter.', options: ['High peak inspiratory pressure (PIP) alarm triggered at 36 cmH2O, rhonchi auscultated over main bronchi, visible secretions in endotracheal tube adapter.', 'Desaturation from 98% to 92% on ventilator with audible tracheal secretions and coughing against vent.', 'Sawtooth pattern on ventilator flow-time waveform indicating endotracheal secretional buildup.', 'Routine morning clearance of accumulated endotracheal secretions.'] },
      { id: 'preO2', label: 'Pre-Oxygenation & Baseline Vitals', defaultValue: '100% FiO2 delivered via ventilator suction control button for 2 minutes prior to pass. Baseline: HR 82 NSR, BP 124/76, SpO2 96%.', options: ['100% FiO2 delivered via ventilator suction control button for 2 minutes prior to pass. Baseline: HR 82 NSR, BP 124/76, SpO2 96%.', 'Pre-oxygenated with 100% O2 for 1.5 minutes. Baseline HR 76 regular, SpO2 94% on prescribed ventilator settings.', 'Hyperoxygenated via ventilator without interrupting PEEP. Baseline vitals stable.'] },
      { id: 'technique', label: 'Closed In-Line Technique & Passes', defaultValue: 'Closed in-line 14Fr catheter advanced without disconnecting circuit to carina depth and withdrawn 1 cm. Suction applied intermittently at 100-120 mmHg while withdrawing over 8 seconds. 2 passes performed with 30s recovery between passes.', options: ['Closed in-line 14Fr catheter advanced without disconnecting circuit to carina depth and withdrawn 1 cm. Suction applied intermittently at 100-120 mmHg while withdrawing over 8 seconds. 2 passes performed with 30s recovery between passes.', 'Closed inline suction x 1 pass of 8 seconds with vacuum at 100 mmHg; catheter fully retracted into protective sleeve and locked.', 'Two gentle suction passes performed (< 10 seconds each) maintaining continuous PEEP and closed system.'] },
      { id: 'secretions', label: 'Aspirated Secretions Character', defaultValue: 'Evacuated approximately 15 mL of thick, tenacious, pale yellow secretions. Zero hemoptysis, blood tingeing, or foul odor noted. Catheter flushed clean with sterile saline bullet.', options: ['Evacuated approximately 15 mL of thick, tenacious, pale yellow secretions. Zero hemoptysis, blood tingeing, or foul odor noted. Catheter flushed clean with sterile saline bullet.', '10 mL of thin, white-to-clear secretions cleared. Catheter irrigation completed.', '20 mL of copious tenacious yellowish-green mucous cleared from airway; catheter flushed.', 'Scant clear secretions cleared; airway patent.'] },
      { id: 'postMechanics', label: 'Post-Suction Mechanics & Lung Sounds', defaultValue: 'Peak Inspiratory Pressure decreased from 36 to 22 cmH2O. SpO2 recovered to 99%, HR 80 NSR without bradycardia or ectopy. Breath sounds cleared bilaterally. FiO2 returned to baseline (40%).', options: ['Peak Inspiratory Pressure decreased from 36 to 22 cmH2O. SpO2 recovered to 99%, HR 80 NSR without bradycardia or ectopy. Breath sounds cleared bilaterally. FiO2 returned to baseline (40%).', 'High pressure alarm resolved; PIP normalized to 24 cmH2O; SpO2 98%; coarse upper airway sounds cleared.', 'Lung sounds clear throughout; tidal volumes restored to baseline target; patient settled comfortably.'] },
      { id: 'tolerance', label: 'Tolerance & Complication Check', defaultValue: 'Procedure tolerated well without vagal bradycardia, bronchospasm, accidental extubation, or loss of lung recruitment.', options: ['Procedure tolerated well without vagal bradycardia, bronchospasm, accidental extubation, or loss of lung recruitment.', 'Patient showed brief transient cough during pass; settled promptly with good synchrony.', 'Zero cardiac dysrhythmias observed on telemetry; patient calm and comfortable.'] },
    ],
    formats: {
      dar: {
        data: 'Assessed intubated patient: {indication}. Baseline SpO2 and hemodynamics: {preO2}.',
        action: 'At {time}, performed closed in-line suctioning: {technique}. Aspirated: {secretions}. Flushed inline catheter with sterile saline flush.',
        response: '{postMechanics}. {tolerance}. Catheter locked in protective sleeve.',
      },
      soap: {
        subjective: 'Patient signaled relief and nodded that airway felt clear following suctioning; denies pain or air hunger.',
        objective: 'At {time}: {indication}. {preO2}. Interventions: {technique}. Secretions: {secretions}. Post-mechanics: {postMechanics}.',
        assessment: 'Endotracheal secretional obstruction cleared; airway resistance reduced; normal peak inspiratory pressures and oxygenation restored.',
        plan: 'Maintain closed in-line suction setup. Suction PRN for secretional indications. Reassess lung sounds and airway pressures q2h.',
      },
      narrative: 'At {time}, closed inline suctioning performed for {indication}. {preO2}. {technique}. {secretions}. Post-procedure: {postMechanics}. {tolerance}.',
      concise: 'VENT IN-LINE SUCTIONING ({time}):\n• Indication: {indication}\n• Pre-O2: {preO2}\n• Technique: {technique}\n• Secretions: {secretions}\n• Post-Mechanics: {postMechanics}\n• Outcome: {tolerance}',
    },
  },

  // 27. RESPIRATORY: Ventilator Weaning & Spontaneous Breathing Trial (SBT)
  {
    id: 'resp-vent-weaning-sbt',
    title: 'Ventilator Weaning & Spontaneous Breathing Trial (SBT)',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    description: 'Documentation of Spontaneous Awakening Trial (SAT), Spontaneous Breathing Trial (SBT), Rapid Shallow Breathing Index (RSBI), and weaning tolerance.',
    tags: ['ventilator weaning', 'SBT', 'SAT', 'spontaneous breathing', 'RSBI', 'extubation readiness', 'ICU', 'mechanical ventilation'],
    fields: [
      { id: 'time', label: 'Trial Start Time', defaultValue: '09:00', options: ['07:30', '09:00', '13:30', '17:00'] },
      { id: 'satTrial', label: 'Spontaneous Awakening Trial (SAT)', defaultValue: 'Sedation infusion (Propofol) paused for SAT. Patient awakened, opened eyes to voice, followed simple commands (gripped hands, gave thumbs up). RASS: 0. Cleared safety screen for SBT.', options: ['Sedation infusion (Propofol) paused for SAT. Patient awakened, opened eyes to voice, followed simple commands (gripped hands, gave thumbs up). RASS: 0. Cleared safety screen for SBT.', 'Pre-trial sedation vacation completed: patient alert, calm, non-agitated, oriented, passes safety screen.', 'Dexmedetomidine maintained at low dose (0.2 mcg/kg/hr); patient calm, cooperative, and follows commands.'] },
      { id: 'sbtSettings', label: 'SBT Settings & Mode', defaultValue: 'Ventilator placed in Spontaneous / Pressure Support mode: PS 5 cmH2O, PEEP +5 cmH2O, FiO2 30% for 30-minute weaning evaluation.', options: ['Ventilator placed in Spontaneous / Pressure Support mode: PS 5 cmH2O, PEEP +5 cmH2O, FiO2 30% for 30-minute weaning evaluation.', 'Placed on CPAP with 0 PS and 5 PEEP on FiO2 35% for 30-minute spontaneous breathing trial.', 'Placed on T-piece with 35% humidified oxygen blow-by for 30-minute trial.'] },
      { id: 'weaningParams', label: 'Spontaneous Parameters & RSBI', defaultValue: 'Minute ventilation: 7.2 L/min | Spontaneous respiratory rate: 18 bpm | Spontaneous tidal volume: 430 mL | Rapid Shallow Breathing Index (RSBI = f/Vt): 42 (target < 105 indicating weaning readiness).', options: ['Minute ventilation: 7.2 L/min | Spontaneous respiratory rate: 18 bpm | Spontaneous tidal volume: 430 mL | Rapid Shallow Breathing Index (RSBI = f/Vt): 42 (target < 105 indicating weaning readiness).', 'Spontaneous rate 16 bpm, Vt 480 mL, RSBI: 33. Strong spontaneous cough and negative inspiratory force (NIF) -28 cmH2O.', 'Spontaneous rate 20 bpm, Vt 380 mL, RSBI: 52. Breathing quiet, unlabored without intercostal retractions.'] },
      { id: 'gasExchange', label: 'Hemodynamics & Arterial Blood Gas', defaultValue: 'Vitals: BP 126/78, HR 78 NSR, RR 18, SpO2 98%. Post-trial ABG: pH 7.42, PaCO2 38 mmHg, PaO2 94 mmHg, HCO3 24 mEq/L, SaO2 98% on FiO2 30%.', options: ['Vitals: BP 126/78, HR 78 NSR, RR 18, SpO2 98%. Post-trial ABG: pH 7.42, PaCO2 38 mmHg, PaO2 94 mmHg, HCO3 24 mEq/L, SaO2 98% on FiO2 30%.', 'Hemodynamically stable: BP 130/82, HR 82, RR 16, SpO2 99%. No cardiac ectopy on telemetry.', 'ABG within normal limits: pH 7.39, PaCO2 41, PaO2 88 on 30% FiO2.'] },
      { id: 'outcomePlan', label: 'SBT Outcome & Extubation Plan', defaultValue: 'SBT completed successfully (30 minutes) meeting all extubation criteria. Patient remained calm without tachypnea, diaphoresis, or accessory muscle use. Physician and Respiratory Therapy notified; extubation scheduled for 10:00.', options: ['SBT completed successfully (30 minutes) meeting all extubation criteria. Patient remained calm without tachypnea, diaphoresis, or accessory muscle use. Physician and Respiratory Therapy notified; extubation scheduled for 10:00.', 'Successful 30-minute trial; patient returned to resting assist-control mode pending physician bedside extubation evaluation.', 'SBT tolerated well; patient demonstrated strong cough, head lift > 5 seconds, and minimal secretions. Extubation order received.'] },
    ],
    formats: {
      dar: {
        data: 'Evaluated patient for ventilator weaning readiness. SAT: {satTrial}. Initiated SBT at {time}: {sbtSettings}.',
        action: 'Monitored bedside mechanics and gas exchange throughout trial: {weaningParams}. Obtained {gasExchange}. Evaluated tolerance criteria.',
        response: '{outcomePlan}. Patient comfortable throughout trial without respiratory distress.',
      },
      soap: {
        subjective: 'Patient nodded affirmatively when asked if breathing felt comfortable during spontaneous breathing trial; denied shortness of breath or fatigue.',
        objective: 'At {time}: {satTrial}. Trial settings: {sbtSettings}. Mechanics/RSBI: {weaningParams}. Gas exchange: {gasExchange}. Outcome: {outcomePlan}.',
        assessment: 'Patient successfully passed Spontaneous Awakening and Breathing Trials; demonstrates physiological readiness for planned extubation.',
        plan: 'Proceed with planned extubation protocol per physician orders: gather suction equipment, supplemental O2 setup, and emergency re-intubation tray.',
      },
      narrative: 'At {time}, ventilator weaning protocol initiated. {satTrial}. {sbtSettings}. Weaning parameters recorded: {weaningParams}. {gasExchange}. {outcomePlan}.',
      concise: 'VENTILATOR SBT WEANING ({time}):\n• SAT Sedation Vacation: {satTrial}\n• SBT Settings: {sbtSettings}\n• Mechanics / RSBI: {weaningParams}\n• Vitals & ABG: {gasExchange}\n• Outcome & Plan: {outcomePlan}',
    },
  },

  // 28. ROUTINE: MUST (Malnutrition Universal Screening Tool)
  {
    id: 'routine-must-nutrition-screening',
    title: 'MUST Nutritional Risk Screening Note',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    description: 'Very concise 5-step screening for malnutrition: BMI score, % unplanned weight loss, acute disease factor, overall score, and clinical action plan.',
    tags: ['MUST', 'nutrition', 'malnutrition', 'BMI', 'weight loss', 'dietitian', 'screening', 'concise'],
    fields: [
      { id: 'time', label: 'Screening Time', defaultValue: '09:30', options: ['07:30', '09:30', '13:00', '17:30', '21:00'] },
      { id: 'bmi', label: 'Step 1: BMI & Weight', defaultValue: 'Wt: 68.5 kg | Ht: 172 cm | BMI: 23.1 kg/m² (Score 0: BMI >20)', options: ['Wt: 68.5 kg | Ht: 172 cm | BMI: 23.1 kg/m² (Score 0: BMI >20)', 'Wt: 53.0 kg | Ht: 168 cm | BMI: 18.8 kg/m² (Score 1: BMI 18.5-20)', 'Wt: 47.0 kg | Ht: 165 cm | BMI: 17.3 kg/m² (Score 2: BMI <18.5)', 'Wt: 74.0 kg | Ht: 162 cm | BMI: 28.2 kg/m² (Score 0: BMI >20)'] },
      { id: 'wtLoss', label: 'Step 2: Unplanned Weight Loss (3-6 mo)', defaultValue: 'No unplanned weight loss reported (<5% loss, Score 0)', options: ['No unplanned weight loss reported (<5% loss, Score 0)', 'Unplanned loss 3 kg (~5-10% loss, Score 1)', 'Unplanned loss >6 kg (>10% loss, Score 2)', 'Weight stable; intake adequate (Score 0)'] },
      { id: 'acuteEffect', label: 'Step 3: Acute Disease Effect', defaultValue: 'Nil acute disease nutritional impact; oral intake normal (Score 0)', options: ['Nil acute disease nutritional impact; oral intake normal (Score 0)', 'Acutely ill & no/minimal nutritional intake for >5 days (Score 2)', 'Post-op NPO with gradual resumption of oral fluids (Score 0)'] },
      { id: 'totalScore', label: 'Step 4: Overall MUST Score & Risk Category', defaultValue: 'MUST Score: 0 (LOW RISK)', options: ['MUST Score: 0 (LOW RISK)', 'MUST Score: 1 (MEDIUM RISK)', 'MUST Score: 2+ (HIGH RISK)'] },
      { id: 'actionPlan', label: 'Step 5: Clinical Action Plan & Referral', defaultValue: 'Routine clinical ward care. Repeat MUST screening in 7 days or upon clinical change.', options: ['Routine clinical ward care. Repeat MUST screening in 7 days or upon clinical change.', 'Document food & fluid intake on 3-day calorie chart. Provide high-calorie snack options. Re-evaluate MUST in 3 days.', 'Urgent Dietitian referral submitted. Prescribed oral nutritional supplements (ONS 2x/day). 3-day calorie count chart active. Weekly weight monitoring initiated.', 'Enteral nutrition support initiated per clinical dietitian orders. Strict I&O and daily weights.'] },
    ],
    formats: {
      dar: {
        data: 'Completed Malnutrition Universal Screening Tool (MUST) at {time}. {bmi}. {wtLoss}. {acuteEffect}. Overall: {totalScore}.',
        action: '{actionPlan}. Patient and bedside nursing team notified of nutritional plan.',
        response: 'Patient acknowledged dietary instructions. Calorie/fluid tracking established where indicated.',
      },
      soap: {
        subjective: 'Patient reports current appetite and food intake. Weight history: {wtLoss}.',
        objective: 'At {time}: {bmi}. Acute illness impact: {acuteEffect}. Total score: {totalScore}.',
        assessment: '{totalScore} for malnutrition per Universal Screening Tool criteria.',
        plan: '{actionPlan}',
      },
      narrative: 'At {time}, MUST nutritional screening completed. {bmi}. Weight loss: {wtLoss}. Acute illness score: {acuteEffect}. Overall evaluation: {totalScore}. Action plan: {actionPlan}.',
      concise: 'MUST SCREENING ({time}):\n• BMI & Wt: {bmi}\n• Weight Loss: {wtLoss}\n• Acute Illness Factor: {acuteEffect}\n• MUST Total Score: {totalScore}\n• Action Plan: {actionPlan}',
    },
  },

  // 29. EMERGENCY / SITUATIONAL: Early Warning Score (EWS / NEWS2)
  {
    id: 'emergency-ews-news2-escalation',
    title: 'Early Warning Score (EWS / NEWS2) & Escalation Note',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Very concise track-and-trigger deterioration note: vital signs breakdown, aggregate EWS/NEWS2 score, single red triggers, and escalation pathway.',
    tags: ['EWS', 'NEWS2', 'early warning score', 'deterioration', 'vitals', 'escalation', 'MET', 'RRT', 'concise'],
    fields: [
      { id: 'time', label: 'Scoring Time', defaultValue: '10:00', options: ['06:00', '10:00', '14:00', '18:00', '22:00', '02:00'] },
      { id: 'vitalsBreakdown', label: 'Vital Signs & Component Scores', defaultValue: 'RR 16 (0) | SpO2 98% RA (0) | Systolic BP 124/76 (0) | HR 72 (0) | Alert (0) | Temp 36.8°C (0)', options: ['RR 16 (0) | SpO2 98% RA (0) | Systolic BP 124/76 (0) | HR 72 (0) | Alert (0) | Temp 36.8°C (0)', 'RR 22 (2) | SpO2 94% on 2L NC (1+2=3) | BP 102/64 (1) | HR 106 (1) | Alert (0) | Temp 38.2°C (1)', 'RR 26 (3) | SpO2 90% on 4L NC (3+2=5) | BP 88/52 (3) | HR 128 (2) | Confused/Voice (3) | Temp 39.2°C (2)', 'RR 18 (0) | SpO2 96% RA (0) | BP 138/84 (0) | HR 84 (0) | Alert (0) | Temp 37.1°C (0)'] },
      { id: 'totalScore', label: 'Total EWS / NEWS2 Score & Risk', defaultValue: 'Aggregate EWS: 0 (LOW RISK — Routine monitoring)', options: ['Aggregate EWS: 0 (LOW RISK — Routine monitoring)', 'Aggregate EWS: 2 (LOW RISK — Routine ward frequency)', 'Aggregate EWS: 5 (MEDIUM RISK — Urgent ward medical review triggered)', 'Aggregate EWS: 7+ (HIGH RISK — Critical care / MET emergency response triggered)', 'Aggregate EWS: 3 (Low-Medium Risk — Single red parameter trigger)'] },
      { id: 'redTrigger', label: 'Single Extreme Parameter (Score 3 / Red)', defaultValue: 'No single parameter scored 3 (No Red trigger)', options: ['No single parameter scored 3 (No Red trigger)', 'Red Trigger: Respiration Rate ≥25 breaths/min', 'Red Trigger: Oxygen saturation ≤91% on room air', 'Red Trigger: Systolic BP ≤90 mmHg', 'Red Trigger: New onset acute confusion / CVPU (Score 3)'] },
      { id: 'escalationPath', label: 'Clinical Escalation & Interventions Initiated', defaultValue: 'Observation frequency maintained at standard 4-6 hourly ward monitoring. Patient stable.', options: ['Observation frequency maintained at standard 4-6 hourly ward monitoring. Patient stable.', 'Nurse-in-charge and ward medical officer notified. Monitoring frequency increased to q1h. Supplemental O2 titrated to maintain SpO2 94-98%. Sepsis screening commenced.', 'Rapid Response Team (RRT / Medical Emergency Team) summoned to bedside. Continuous cardiac and SpO2 monitoring applied. High-flow oxygen started via NRB mask. IV access confirmed and 500 mL warm crystalloid bolus infused.', 'Attending physician notified at bedside; SBAR handoff provided. Urgent STAT arterial blood gas, ECG, and blood cultures ordered.'] },
      { id: 'providerResponse', label: 'Provider Assessment & Outcome Plan', defaultValue: 'Clinical baseline stable. No physician escalation required at this time.', options: ['Clinical baseline stable. No physician escalation required at this time.', 'Dr. evaluated patient at bedside at {time}. Reconciled fluids and medications; continue q1h EWS monitoring.', 'RRT arrived within 5 minutes. Initial resuscitation administered; patient stabilized with repeat EWS reduced to 4. Care remains on ward under close monitoring.', 'Transfer to Intensive Care Unit / High Dependency Unit accepted by Critical Care team. Bedside transfer prep underway.'] },
    ],
    formats: {
      dar: {
        data: 'Early Warning Score calculated at {time}. {vitalsBreakdown}. Aggregate: {totalScore}. Red parameter: {redTrigger}.',
        action: '{escalationPath}. Interventions documented in flow sheet.',
        response: '{providerResponse}. Repeat EWS scheduled per escalation protocol.',
      },
      soap: {
        subjective: 'Patient assessed for clinical signs of physiological deterioration. Denies acute symptoms / reports increased fatigue.',
        objective: 'At {time}: {vitalsBreakdown}. Aggregate: {totalScore}. Extreme trigger: {redTrigger}.',
        assessment: 'Patient status scored as {totalScore}; clinical escalation algorithm implemented.',
        plan: '{escalationPath}. {providerResponse}',
      },
      narrative: 'At {time}, patient evaluated with Early Warning Score (EWS/NEWS2). Component vitals: {vitalsBreakdown}. Total score: {totalScore}. Extreme score: {redTrigger}. Escalation: {escalationPath}. Outcome: {providerResponse}.',
      concise: 'EWS / NEWS2 NOTE ({time}):\n• Vitals & Sub-scores: {vitalsBreakdown}\n• Aggregate EWS: {totalScore}\n• Red Score Trigger: {redTrigger}\n• Escalation: {escalationPath}\n• Provider Response / Plan: {providerResponse}',
    },
  },

  // 30. EMERGENCY: Adult Mega Code / Code Blue Resuscitation Flowsheet
  {
    id: 'emergency-mega-code-acls',
    title: 'Adult Mega Code & Code Blue Resuscitation Record',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Comprehensive ACLS Mega Code documentation: arrest onset, CPR cycles, rhythm checks, defibrillation Joules, intubation/capnography, epinephrine/amiodarone timing, H\'s & T\'s evaluation, and ROSC/disposition.',
    tags: ['mega code', 'code blue', 'cardiac arrest', 'ACLS', 'resuscitation', 'CPR', 'defibrillation', 'epinephrine', 'amiodarone', 'ROSC', 'recorder'],
    fields: [
      { id: 'time', label: 'Arrest Recognition Time', defaultValue: '14:22', options: ['06:14', '10:35', '14:22', '18:50', '22:15', '03:40'] },
      { id: 'initialRhythm', label: 'Arrest Recognition & Initial Rhythm', defaultValue: 'Patient found unresponsive, pulseless (no carotid pulse <10s) and apneic at 14:22. Code Blue activated immediately overhead. Initial monitor rhythm: Ventricular Fibrillation (VFib) [Shockable rhythm].', options: [
        'Patient found unresponsive, pulseless (no carotid pulse <10s) and apneic at 14:22. Code Blue activated immediately overhead. Initial monitor rhythm: Ventricular Fibrillation (VFib) [Shockable rhythm].',
        'Sudden collapse witnessed at bedside. Carotid pulse absent, agonal gasps noted. Code Blue called. Initial rhythm on defibrillator pads: Pulseless Ventricular Tachycardia (pVT) rate 210 bpm [Shockable rhythm].',
        'Unresponsive on telemetry alarm. Carotid pulse absent, apneic. Overhead Code Blue sounded. Initial rhythm: Asystole verified in 2 leads (Lead II and paddle view) [Non-shockable rhythm].',
        'Patient slumped in chair, unresponsive. No carotid pulse palpable. Immediate Code Blue sounded. Monitor shows Pulseless Electrical Activity (PEA) with narrow QRS rate 38 bpm [Non-shockable rhythm].'
      ]},
      { id: 'cprAirway', label: 'CPR Quality, Device & Airway Management', defaultValue: 'High-quality CPR initiated immediately on cardiac backboard (depth 5–6 cm, rate 110 bpm, allowing full chest recoil, minimal pauses <5 sec). Compressors rotated every 2 min. Bag-Valve-Mask 100% O2 -> ETT #7.5 placed at 22 cm at incisors by Dr. Vance. Position verified by continuous waveform capnography (ETCO2 24 mmHg) & equal bilateral breath sounds. Continuous CPR with 1 breath every 6 seconds maintained.', options: [
        'High-quality CPR initiated immediately on cardiac backboard (depth 5–6 cm, rate 110 bpm, allowing full chest recoil, minimal pauses <5 sec). Compressors rotated every 2 min. Bag-Valve-Mask 100% O2 -> ETT #7.5 placed at 22 cm at incisors by Dr. Vance. Position verified by continuous waveform capnography (ETCO2 24 mmHg) & equal bilateral breath sounds. Continuous CPR with 1 breath every 6 seconds maintained.',
        'Manual CPR initiated immediately; mechanical compression device (LUCAS) deployed without CPR interruption. Supraglottic airway (i-gel size 4) placed with 100% O2. Waveform capnography confirms placement (ETCO2 28 mmHg). 1 breath q6s without pause.',
        'Manual CPR initiated with audiovisual feedback pad (depth >2 inches, rate 112 bpm). Bag-Valve-Mask with oral airway and high-flow O2 maintained 30:2 ratio prior to successful intubation with 8.0 ETT at 23 cm lips. Bilateral chest rise and capnography confirmed.'
      ]},
      { id: 'defibShocks', label: 'Rhythm Checks & Defibrillation Shocks', defaultValue: 'Rhythm analysis q2min: Shock #1 delivered at 14:24 (200J Biphasic, coarse VFib); Shock #2 delivered at 14:28 (200J Biphasic, refractory VF); Shock #3 delivered at 14:32 (200J Biphasic, VFib). Visual all-clear verified prior to every discharge; CPR resumed instantly after shock without pulse check.', options: [
        'Rhythm analysis q2min: Shock #1 delivered at 14:24 (200J Biphasic, coarse VFib); Shock #2 delivered at 14:28 (200J Biphasic, refractory VF); Shock #3 delivered at 14:32 (200J Biphasic, VFib). Visual all-clear verified prior to every discharge; CPR resumed instantly after shock without pulse check.',
        'Non-shockable rhythm (PEA / Asystole). Defibrillation not indicated. CPR resumed immediately following brief (<5s) rhythm and pulse checks every 2 minutes.',
        'Shock #1 delivered at 14:24 (150J Biphasic, pulseless VT). Rhythm check at 14:26 converted to sinus tachycardia with palpable pulse.',
        'Shock #1 delivered at 14:24 (200J Biphasic VF). Shock #2 delivered at 14:28 (200J Biphasic VF). Shock #3 at 14:32 (200J) converted rhythm to wide complex PEA rate 40 bpm.'
      ]},
      { id: 'medications', label: 'ACLS Pharmacopeia Administered (IV/IO & Flushes)', defaultValue: 'Vascular access: 18G left antecubital + Right proximal humeral IO patent. Epinephrine 1 mg IV push given at 14:26, 14:30, 14:34 (Total: 3 mg) with 20 mL saline flushes. Amiodarone 300 mg IV push given at 14:29; second dose Amiodarone 150 mg IV push given at 14:33. Normal Saline 1,000 mL pressure-bolus infused.', options: [
        'Vascular access: 18G left antecubital + Right proximal humeral IO patent. Epinephrine 1 mg IV push given at 14:26, 14:30, 14:34 (Total: 3 mg) with 20 mL saline flushes. Amiodarone 300 mg IV push given at 14:29; second dose Amiodarone 150 mg IV push given at 14:33. Normal Saline 1,000 mL pressure-bolus infused.',
        'Vascular access: Right tibial IO. Epinephrine 1 mg IO push administered at 14:24, 14:28, 14:32, 14:36 (Total: 4 mg). Sodium Bicarbonate 50 mEq IV push given at 14:30 for severe metabolic acidosis. Calcium Chloride 1g IV push given at 14:35 for suspected hyperkalemia.',
        'Vascular access: 16G right forearm. Epinephrine 1 mg IV push given at 14:25, 14:29. Lidocaine 100 mg (1.5 mg/kg) IV push given at 14:27; second dose Lidocaine 50 mg (0.75 mg/kg) IV push at 14:31. Magnesium Sulfate 2g IV push over 2 min given for polymorphic VT/Torsades.',
        'Vascular access: 20G left wrist. Epinephrine 1 mg IV push given at 14:23, 14:27. IV Narcan 2 mg IV push given for suspected opioid overdose.'
      ]},
      { id: 'hsAndTs', label: 'Reversible Causes Evaluated (H\'s & T\'s Differential)', defaultValue: 'Code Leader reviewed 5 H\'s & 5 T\'s: Bedside POCUS performed during rhythm checks confirmed no pericardial tamponade and equal bilateral lung sliding (tension pneumothorax ruled out). Point-of-care Potassium 4.6 mEq/L, POC Glucose 138 mg/dL, core temp 36.8°C. STAT ABG sent. Acute coronary thrombosis (STEMI) suspected as primary etiology.', options: [
        'Code Leader reviewed 5 H\'s & 5 T\'s: Bedside POCUS performed during rhythm checks confirmed no pericardial tamponade and equal bilateral lung sliding (tension pneumothorax ruled out). Point-of-care Potassium 4.6 mEq/L, POC Glucose 138 mg/dL, core temp 36.8°C. STAT ABG sent. Acute coronary thrombosis (STEMI) suspected as primary etiology.',
        'Bedside ultrasound revealed massive right ventricular dilation with severe septal flattening concerning for massive Pulmonary Embolism (PE). Systemic thrombolytic therapy (Alteplase 50 mg IV push) administered per Code Leader order.',
        'Point-of-care testing revealed severe profound hypoglycemia (Glucose 24 mg/dL). Dextrose 50% (D50W) 1 ampule (25g) IV push administered immediately.',
        'Evaluation of H\'s & T\'s: History of end-stage renal disease missing dialysis. Marked hyperkalemia suspected; Empiric Calcium Gluconate 3g, Insulin/D50, and Sodium Bicarbonate administered.'
      ]},
      { id: 'outcomeROSC', label: 'Resuscitation Outcome & ROSC Status', defaultValue: 'ROSC (Return of Spontaneous Circulation) achieved at 14:36 (14 minutes total CPR duration). Abrupt sustained rise in ETCO2 from 22 to 46 mmHg. Carotid and femoral pulses strong and palpable. Post-arrest vitals: BP 114/72 mmHg, HR 84 bpm sinus rhythm, SpO2 97% on FiO2 50%. Post-ROSC 12-lead ECG showed ST-elevation in leads II, III, aVF. Norepinephrine infusion initiated at 6 mcg/min for MAP >65. Emergent transfer to Cardiac Catheterization Laboratory initiated.', options: [
        'ROSC (Return of Spontaneous Circulation) achieved at 14:36 (14 minutes total CPR duration). Abrupt sustained rise in ETCO2 from 22 to 46 mmHg. Carotid and femoral pulses strong and palpable. Post-arrest vitals: BP 114/72 mmHg, HR 84 bpm sinus rhythm, SpO2 97% on FiO2 50%. Post-ROSC 12-lead ECG showed ST-elevation in leads II, III, aVF. Norepinephrine infusion initiated at 6 mcg/min for MAP >65. Emergent transfer to Cardiac Catheterization Laboratory initiated.',
        'ROSC achieved at 14:30 after 8 minutes of CPR. Spontaneous carotid pulse and breathing restored. BP 128/80, HR 92. Post-cardiac arrest targeted temperature management (TTM) initiated. Patient transported directly to Medical Intensive Care Unit (MICU) bed 6.',
        'ACLS resuscitation continued for 32 minutes without return of spontaneous circulation. Patient remained in refractory asystole despite multiple rounds of CPR, Epinephrine, and airway management. Code Leader Dr. Vance pronounced time of death at 14:54. Attending physician, nursing staff, and chaplain present to support family at bedside.',
        'ROSC achieved intermittently at 14:31 with recurrent VF arrest at 14:34. CPR resumed. Second sustained ROSC achieved at 14:42. Arterial line placed; patient transported to CCU on Amiodarone and Levophed infusions.'
      ]},
      { id: 'teamRoles', label: 'Code Team Responders & Assigned Roles', defaultValue: 'Code Leader: Dr. Kevin Vance (Attending Physician) | Airway: Dr. Sarah Lin (Anesthesia) & Mark RT | Chest Compressors: RN James & RN Elena (rotated q2min) | Medication Nurse: RN David | Defibrillator Operator: RN Chloe | Recorder / Documentation Nurse: RN Taylor.', options: [
        'Code Leader: Dr. Kevin Vance (Attending Physician) | Airway: Dr. Sarah Lin (Anesthesia) & Mark RT | Chest Compressors: RN James & RN Elena (rotated q2min) | Medication Nurse: RN David | Defibrillator Operator: RN Chloe | Recorder / Documentation Nurse: RN Taylor.',
        'Code Leader: Dr. Chen (Hospitalist) | Airway: Respiratory Therapist Sarah | Compressors: ICU RN Mike & ED RN Lisa | Medication RN: RN Amanda | Defibrillator: RN Marcus | Recorder: RN Taylor.',
        'Code Leader: Dr. Patel (Critical Care Fellow) | Airway: Dr. Adams (Anesthesia) | Compressors: Mechanical LUCAS device + RN backup | Medication RN: RN Johnson | Recorder: RN Taylor.'
      ]},
    ],
    formats: {
      dar: {
        data: 'At {time}, Code Blue activated: {initialRhythm}. {teamRoles}.',
        action: 'High-quality CPR initiated immediately on backboard. {cprAirway}. {defibShocks}. Medications administered: {medications}. Differential evaluated: {hsAndTs}.',
        response: '{outcomeROSC}. Post-resuscitation care and transfers documented per ACLS protocol.',
      },
      soap: {
        subjective: 'Cardiopulmonary arrest witnessed/recognized at bedside; patient unresponsive, apneic, pulseless.',
        objective: 'At {time}: {initialRhythm}. Responders: {teamRoles}. CPR & Airway: {cprAirway}. Defibrillation: {defibShocks}. Resuscitation Meds: {medications}. Differential Diagnosis: {hsAndTs}.',
        assessment: 'Cardiopulmonary arrest managed in strict accordance with AHA/ACLS Mega Code algorithms.',
        plan: '{outcomeROSC}',
      },
      narrative: 'At {time}, patient was identified in acute cardiopulmonary arrest. {initialRhythm}. Overhead Code Blue was sounded. Code team assembled: {teamRoles}. Immediate high-quality chest compressions and airway management initiated: {cprAirway}. Rhythm analysis and defibrillation completed: {defibShocks}. Resuscitation medications administered with saline flushes: {medications}. Reversible etiologies evaluated: {hsAndTs}. Resuscitation outcome: {outcomeROSC}. All actions recorded contemporaneously on code flowsheet.',
      concise: 'MEGA CODE / CODE BLUE RESUSCITATION RECORD ({time}):\n• Arrest Identified: {initialRhythm}\n• Team Roles: {teamRoles}\n• CPR & Airway: {cprAirway}\n• Defibrillation & Rhythm Checks: {defibShocks}\n• ACLS Medications: {medications}\n• Reversible Causes (H\'s & T\'s): {hsAndTs}\n• Outcome & ROSC: {outcomeROSC}',
    },
  },

  // 31. EMERGENCY: Post-Cardiac Arrest / Post-ROSC Intensive Care Note
  {
    id: 'emergency-post-cardiac-arrest-rosc',
    title: 'Post-Cardiac Arrest / Post-ROSC Intensive Care Note',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    description: 'Post-resuscitation bundle documentation: targeted temperature management (TTM), hemodynamic optimization (MAP ≥65), lung-protective ventilation, neuro exam, and disposition.',
    tags: ['post-ROSC', 'cardiac arrest', 'TTM', 'targeted temperature', 'hypothermia', 'vasopressor', 'ICU', 'ROSC', 'neuroprognostication'],
    fields: [
      { id: 'time', label: 'Post-ROSC Time', defaultValue: '15:00', options: ['07:00', '11:30', '15:00', '19:15', '23:30', '03:45'] },
      { id: 'hemodynamics', label: 'Hemodynamic Status & Pressors', defaultValue: 'Arterial line placed (right radial). Blood pressure 108/64 mmHg (MAP 78 mmHg), HR 82 bpm sinus. Norepinephrine infusion running at 8 mcg/min, titrated to maintain MAP ≥65 mmHg. Central venous access confirmed.', options: [
        'Arterial line placed (right radial). Blood pressure 108/64 mmHg (MAP 78 mmHg), HR 82 bpm sinus. Norepinephrine infusion running at 8 mcg/min, titrated to maintain MAP ≥65 mmHg. Central venous access confirmed.',
        'BP 122/76 mmHg (MAP 91 mmHg) without vasopressor support. Peripheral pulses 2+ bilaterally, cap refill 2 seconds. Urine output via Foley monitored q1h.',
        'Refractory post-arrest hypotension: Norepinephrine at 16 mcg/min plus Vasopressin at 0.04 units/min. Target MAP ≥65 maintained. Lactate clearing from 6.8 to 4.2 mmol/L.'
      ]},
      { id: 'temperature', label: 'Targeted Temperature Management (TTM)', defaultValue: 'Targeted Temperature Management (TTM) protocol initiated: Target core body temperature set to 36.0°C (36°C normothermia protocol) via closed-loop surface cooling pads with continuous esophageal temperature probe. Strict shivering protocol active.', options: [
        'Targeted Temperature Management (TTM) protocol initiated: Target core body temperature set to 36.0°C (36°C normothermia protocol) via closed-loop surface cooling pads with continuous esophageal temperature probe. Strict shivering protocol active.',
        'Targeted Temperature Management (TTM) initiated for comatose VF arrest: Induced hypothermia target 33.0°C via endovascular cooling catheter. Core temperature currently 34.2°C and descending. Target duration: 24 hours followed by rewarming at 0.25°C/hr.',
        'Normothermia targeted (36.5°C–37.5°C); active fever prevention protocol implemented. Scheduled acetaminophen and surface cooling blanket on standby for temp >37.5°C.'
      ]},
      { id: 'ventilation', label: 'Mechanical Ventilation & Gas Exchange', defaultValue: 'Sedated and mechanically ventilated: Mode PRVC/AC, Set Vt 440 mL (6 mL/kg PBW), Rate 14 bpm, PEEP +8 cmH2O, FiO2 40%. SpO2 96% (titrated to avoid hyperoxia >98%). Post-ROSC ABG: pH 7.34, PaCO2 40, PaO2 88, HCO3 21, Base Deficit -3. Waveform capnography ETCO2 36 mmHg.', options: [
        'Sedated and mechanically ventilated: Mode PRVC/AC, Set Vt 440 mL (6 mL/kg PBW), Rate 14 bpm, PEEP +8 cmH2O, FiO2 40%. SpO2 96% (titrated to avoid hyperoxia >98%). Post-ROSC ABG: pH 7.34, PaCO2 40, PaO2 88, HCO3 21, Base Deficit -3. Waveform capnography ETCO2 36 mmHg.',
        'Volume Control AC: Vt 420 mL, Rate 16 bpm, PEEP +10 cmH2O, FiO2 50%. SpO2 95%, PaCO2 maintained at 38–42 to avoid cerebral vasoconstriction. Suctioned minimal thin secretions.',
        'Mechanical ventilation on SIMV mode: synchronous with ventilator. Weaning parameters deferred during post-cardiac arrest cooling phase.'
      ]},
      { id: 'neuroStatus', label: 'Neurological Assessment & Sedation', defaultValue: 'Comatose post-arrest: RASS -5 on continuous Propofol (30 mcg/kg/min) and Fentanyl (50 mcg/hr). Pupils 3 mm, equal and sluggishly reactive to light. Corneal reflexes intact bilaterally. No spontaneous posturing or seizure activity noted. Continuous EEG leads applied for seizure surveillance.', options: [
        'Comatose post-arrest: RASS -5 on continuous Propofol (30 mcg/kg/min) and Fentanyl (50 mcg/hr). Pupils 3 mm, equal and sluggishly reactive to light. Corneal reflexes intact bilaterally. No spontaneous posturing or seizure activity noted. Continuous EEG leads applied for seizure surveillance.',
        'Patient arousable to verbal stimuli post-ROSC: Opens eyes spontaneously, follows simple commands (squeezes hands, wiggles toes). RASS -1. Pupils 3mm brisk and round. Oriented to person.',
        'Deeply comatose, non-responsive to noxious stimuli. GCS 3T. Pupils 4mm fixed and dilated. Continuous video-EEG ordered to rule out non-convulsive status epilepticus. Neuroprognostication scheduled at 72 hours post-arrest.'
      ]},
      { id: 'diagnostics', label: 'Diagnostics, Labs & Disposition', defaultValue: 'Post-ROSC 12-lead ECG obtained and reviewed with interventional cardiology. STAT labs drawn: Troponin-I, CBC, CMP, Coags, Type & Screen, Lactate. Bedside echo completed. Patient prepped for urgent transfer to Cardiac Catheterization Suite for primary percutaneous coronary intervention.', options: [
        'Post-ROSC 12-lead ECG obtained and reviewed with interventional cardiology. STAT labs drawn: Troponin-I, CBC, CMP, Coags, Type & Screen, Lactate. Bedside echo completed. Patient prepped for urgent transfer to Cardiac Catheterization Suite for primary percutaneous coronary intervention.',
        'Non-contrast Head CT and CT Pulmonary Angiogram completed; transported safely with ICU nurse, respiratory therapist, and transport monitor. Admitted to Cardiovascular ICU bed 2.',
        'Bedside portable chest radiograph confirmed ETT tip 3 cm above carina and right subclavian central line in distal SVC. Labs sent; critical care attending at bedside.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Post-ROSC assessment at {time}. {hemodynamics}. {neuroStatus}.',
        action: 'Initiated post-cardiac arrest bundle: {temperature}. {ventilation}. Diagnostic workup: {diagnostics}.',
        response: 'Target MAP ≥65 mmHg maintained. Core temperature on target. Ongoing intensive care monitoring documented in flowsheet.',
      },
      soap: {
        subjective: 'Patient unresponsive post-cardiac arrest / unable to provide history.',
        objective: 'At {time}: {hemodynamics}. Neuro: {neuroStatus}. Cooling: {temperature}. Ventilator: {ventilation}. Labs & Imaging: {diagnostics}.',
        assessment: 'Post-cardiac arrest syndrome requiring multi-organ critical care support and neuroprotection.',
        plan: 'Maintain TTM cooling protocol x 24h, titrate vasopressors for MAP ≥65, avoid hypoxemia and hyperoxia, continuous ICU monitoring.',
      },
      narrative: 'At {time}, comprehensive post-cardiac arrest management initiated following successful resuscitation. Hemodynamic profile: {hemodynamics}. Targeted temperature management initiated: {temperature}. Ventilator parameters adjusted for lung protection and normocapnia: {ventilation}. Neurological status: {neuroStatus}. Diagnostic and therapeutic workup completed: {diagnostics}. Patient maintained in ICU with continuous critical care nursing care.',
      concise: 'POST-ROSC CARE NOTE ({time}):\n• Hemodynamics & Pressors: {hemodynamics}\n• Targeted Temp Management (TTM): {temperature}\n• Mechanical Ventilation: {ventilation}\n• Neurological Assessment: {neuroStatus}\n• Diagnostics & Disposition: {diagnostics}',
    },
  },

  // 32. PERIOPERATIVE: Pre-Operative Verification & Holding Checklist
  {
    id: 'perioperative-preop-checklist',
    title: 'Pre-Operative Verification & Holding Safety Checklist',
    category: 'routine',
    categoryLabel: 'Routine & Ward',
    description: 'Holding area documentation: Universal Protocol identity and surgical consent verification, site marking, NPO compliance, pre-op checklist, baseline vitals, PIV access, and OR handoff.',
    tags: ['pre-op', 'perioperative', 'pre-operative', 'surgical', 'holding area', 'OR', 'consent', 'site marking', 'universal protocol', 'NPO', 'CHG', 'SCIP antibiotic'],
    fields: [
      { id: 'time', label: 'Pre-Op Time', defaultValue: '06:45', options: ['06:15', '06:45', '07:30', '10:00', '12:30', '14:15'] },
      { id: 'procedureConsent', label: 'Procedure & Informed Consent', defaultValue: 'Scheduled for [Procedure Name, e.g., Laparoscopic Cholecystectomy]. Operative informed consent signed, timed, dated, and verified on chart. Patient verbalizes understanding of risks, benefits, and alternatives in own words.', options: [
        'Scheduled for [Procedure Name, e.g., Laparoscopic Cholecystectomy]. Operative informed consent signed, timed, dated, and verified on chart. Patient verbalizes understanding of risks, benefits, and alternatives in own words.',
        'Scheduled for [Right Total Knee Arthroplasty]. Signed informed consent and anesthesia consent on electronic chart; operating surgeon discussed procedure with patient and family.',
        'Urgent surgical consent verified: [Appendectomy]. Patient alert and oriented x4, consent obtained and placed in medical record. Blood product consent signed and verified on file.'
      ]},
      { id: 'siteMarkingPrep', label: 'Surgical Site Marking & Skin Prep', defaultValue: 'Surgical site verified with patient and operating surgeon. Surgical site clearly marked with surgeon initials at intended site. Pre-op CHG (chlorhexidine gluconate) skin prep completed; skin clean, dry, and intact with zero abrasions.', options: [
        'Surgical site verified with patient and operating surgeon. Surgical site clearly marked with surgeon initials at intended site. Pre-op CHG (chlorhexidine gluconate) skin prep completed; skin clean, dry, and intact with zero abrasions.',
        'Bilateral/laterality verification completed: Left operative extremity marked by surgeon with patient active participation. Hair clipped at operative margin per protocol (no razors). CHG skin prep documented.',
        'Non-lateral procedure (midline laparotomy); site marking not indicated per protocol. Pre-op CHG body wash verified night before and morning of surgery. Abdominal skin intact.'
      ]},
      { id: 'npoStatus', label: 'NPO Status & GI Compliance', defaultValue: 'Strict NPO confirmed: No solid food since 22:00 last evening (>8 hours); no clear liquids since 04:00 (>2 hours) per ASA guidelines. Dentures/partials removed. No gum or tobacco.', options: [
        'Strict NPO confirmed: No solid food since 22:00 last evening (>8 hours); no clear liquids since 04:00 (>2 hours) per ASA guidelines. Dentures/partials removed. No gum or tobacco.',
        'NPO verified: Solid food stopped >10 hours prior. Clear water sip taken at 05:30 with morning cardiac medication (Metoprolol 25mg) per anesthesia orders. Dentures removed and secured.',
        'NPO violation denied: Patient confirms last meal 12 hours ago. Voided prior to transfer; bladder empty. Removable dental appliances secured.'
      ]},
      { id: 'vascularVitals', label: 'Vascular Access & Baseline Vitals', defaultValue: 'Patent 18G PIV in left forearm infusing Lactated Ringer\'s at 75 mL/hr; brisk blood return, site clean without erythema/edema. Baseline vitals: BP 124/78 mmHg, HR 72 bpm regular, RR 16 bpm, SpO2 99% on Room Air, Temp 36.8°C.', options: [
        'Patent 18G PIV in left forearm infusing Lactated Ringer\'s at 75 mL/hr; brisk blood return, site clean without erythema/edema. Baseline vitals: BP 124/78 mmHg, HR 72 bpm regular, RR 16 bpm, SpO2 99% on Room Air, Temp 36.8°C.',
        'Patent 20G PIV in right wrist, flushing smoothly without resistance. Vitals stable: BP 132/82 mmHg, HR 78 bpm, RR 18 bpm, SpO2 98% on Room Air, Temp 37.0°C. Type & Screen verified current.',
        'Right internal jugular CVC patent with brisk aspirate; peripheral 18G PIV right antecubital verified. Baseline vitals: BP 118/72 mmHg (MAP 87), HR 68 bpm, RR 14 bpm, SpO2 100% on RA, Temp 36.6°C.'
      ]},
      { id: 'premedsValuables', label: 'Pre-Op Meds, Valuables & Handoff', defaultValue: 'Pre-op prophylactic antibiotic (Cefazolin 2g IV) hung on-call to OR (infusion within 60 min of incision). Allergy band verified (NKDA). All jewelry, dentures, and glasses removed and locked in hospital safe / surrendered to family. Circulating RN and Anesthesiologist bedside handoff completed. Patient transferred to OR table via stretcher.', options: [
        'Pre-op prophylactic antibiotic (Cefazolin 2g IV) hung on-call to OR (infusion within 60 min of incision). Allergy band verified (NKDA). All jewelry, dentures, and glasses removed and locked in hospital safe / surrendered to family. Circulating RN and Anesthesiologist bedside handoff completed. Patient transferred to OR table via stretcher.',
        'Pre-op SCIP antibiotic (Vancomycin 1g IV) initiated at 06:15 per protocol. Valuables released to family member. Anti-embolic TED hose and sequential compression devices (SCDs) applied. SBAR verbal handoff given to OR circulating nurse.',
        'Anesthesia preoperative evaluation completed. Premedication Midazolam 2 mg IV administered per anesthesia orders. Bed rails up x4, call light within reach. Transferred safely into OR suite.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Pre-operative evaluation at {time}. {procedureConsent}. {npoStatus}. {vascularVitals}.',
        action: '{siteMarkingPrep}. {premedsValuables}.',
        response: 'Patient expresses readiness for surgical suite; questions answered. Baseline vitals stable. Safe transfer to OR completed with documentation verified.',
      },
      soap: {
        subjective: 'Patient states: "I am ready for my surgery and understand the plan." Denies recent fever, illness, or NPO violations.',
        objective: 'At {time}: {procedureConsent}. NPO: {npoStatus}. Site & Prep: {siteMarkingPrep}. Access & Vitals: {vascularVitals}. Meds & Prep: {premedsValuables}.',
        assessment: 'Pre-operative verification and surgical safety checklist complete. Patient physiologically stable and cleared for operative suite.',
        plan: 'Transport to Operating Room, handoff to Circulating RN and Anesthesia Provider, maintain SCIP compliance.',
      },
      narrative: 'At {time}, comprehensive pre-operative nursing assessment and surgical safety verification completed in holding area. {procedureConsent}. Patient NPO compliance confirmed: {npoStatus}. Surgical site marking and skin preparation: {siteMarkingPrep}. Vascular access and physiological status: {vascularVitals}. Pre-operative medications and transfer preparation: {premedsValuables}. Verbal bedside handoff conducted with OR surgical team.',
      concise: 'PRE-OPERATIVE HOLDING & SURGICAL SAFETY NOTE ({time}):\n• Procedure & Consent: {procedureConsent}\n• NPO Verification: {npoStatus}\n• Site Marking & Prep: {siteMarkingPrep}\n• Vascular Access & Vitals: {vascularVitals}\n• Pre-Op Meds, Valuables & Handoff: {premedsValuables}',
    },
  },

  // 33. PERIOPERATIVE: PACU Post-Operative Recovery & Aldrete Score
  {
    id: 'perioperative-postop-pacu',
    title: 'PACU Post-Operative Recovery & Aldrete Score Note',
    category: 'routine',
    categoryLabel: 'Routine & Ward',
    description: 'Post-Anesthesia Care Unit (PACU) Phase I recovery documentation: arrival handoff, Modified Aldrete scoring, surgical incision/drain assessment, airway emergence, multimodal pain/PONV management, and floor transfer readiness.',
    tags: ['post-op', 'pacu', 'recovery', 'aldrete', 'post-operative', 'surgical', 'incision', 'drain', 'ponv', 'emergence', 'phase 1'],
    fields: [
      { id: 'time', label: 'PACU Time', defaultValue: '11:30', options: ['09:15', '11:30', '13:45', '15:20', '17:00', '19:30'] },
      { id: 'surgeryAnesthesia', label: 'Surgical Handoff & Anesthetic Method', defaultValue: 'Patient received in PACU Phase I from OR via stretcher in stable condition. Bedside SBAR handoff from CRNA and Circulating RN. Procedure completed: [Laparoscopic Cholecystectomy] under General Endotracheal Anesthesia (GETA). ETT extubated in OR, airway patent.', options: [
        'Patient received in PACU Phase I from OR via stretcher in stable condition. Bedside SBAR handoff from CRNA and Circulating RN. Procedure completed: [Laparoscopic Cholecystectomy] under General Endotracheal Anesthesia (GETA). ETT extubated in OR, airway patent.',
        'Arrived PACU from OR 4 following [Right Total Hip Arthroplasty] under Spinal Anesthesia with light IV sedation (Propofol). Airway clear, oxygen via nasal cannula 2 L/min. SBAR handoff received from anesthesia team.',
        'Received from OR following [Exploratory Laparotomy and Bowel Resection] under GETA. Intubated on transport monitor, extubated uneventfully 15 min post-PACU arrival. Anesthesia and circulating nurse handoff complete.'
      ]},
      { id: 'aldreteScore', label: 'Modified Aldrete Score & Physiologic Status', defaultValue: 'Modified Aldrete Score: 9/10 upon evaluation (Activity: 2 - moves 4 extremities voluntarily; Respiration: 2 - deep breaths & coughs freely; Circulation/BP: 2 - BP within 20% of pre-op baseline [126/78 mmHg]; Consciousness: 2 - fully awake & oriented x4; O2 Saturation: 1 - maintains SpO2 98% on 2L NC). Normal thermal regulation (Temp 36.7°C via Bair Hugger warm blanket).', options: [
        'Modified Aldrete Score: 9/10 upon evaluation (Activity: 2 - moves 4 extremities voluntarily; Respiration: 2 - deep breaths & coughs freely; Circulation/BP: 2 - BP within 20% of pre-op baseline [126/78 mmHg]; Consciousness: 2 - fully awake & oriented x4; O2 Saturation: 1 - maintains SpO2 98% on 2L NC). Normal thermal regulation (Temp 36.7°C via Bair Hugger warm blanket).',
        'Modified Aldrete Score: 10/10 (Activity 2, Respiration 2, Circulation 2, Consciousness 2, O2 Saturation 2 on Room Air). Vitals stable: BP 118/74 mmHg, HR 76 bpm, RR 14 bpm, SpO2 99% on RA, Temp 36.9°C. Motor and sensory blockade from spinal anesthesia fully resolved.',
        'Modified Aldrete Score: 8/10 at arrival (Activity 1 - moves 2 extremities, Respiration 2 - regular 16 bpm, Circulation 2 - BP 130/84 mmHg, Consciousness 1 - arousable on calling, O2 Sat 2 - SpO2 97% on 3L NC). Improving to 9/10 at 45 minutes.'
      ]},
      { id: 'operativeSiteDrains', label: 'Surgical Site, Dressing & Drain Assessment', defaultValue: 'Surgical incision dressed with sterile gauze and Tegaderm: dressing dry, clean, and intact with zero active bleeding or strike-through. Jackson-Pratt (JP) drain #1 in right upper quadrant on active bulb suction, drained 15 mL serosanguinous fluid. Surrounding skin intact without erythema.', options: [
        'Surgical incision dressed with sterile gauze and Tegaderm: dressing dry, clean, and intact with zero active bleeding or strike-through. Jackson-Pratt (JP) drain #1 in right upper quadrant on active bulb suction, drained 15 mL serosanguinous fluid. Surrounding skin intact without erythema.',
        'Operative dressing over right hip dry and intact; Aquacel surgical dressing intact with no drainage visible. Hemovac drain on bulb suction with 25 mL dark bloody output. Distal pulses (DP/PT) 2+ bilaterally, right foot warm with cap refill <2 sec, motor/sensory intact.',
        'Laparoscopic port sites (4) closed with Dermabond skin adhesive and Steri-Strips; dressings dry and intact without bleeding. Abdomen soft, non-distended. Zero surgical drains present.'
      ]},
      { id: 'painPONV', label: 'Multimodal Pain Control & PONV Management', defaultValue: 'Pain reported at 3/10 (aching, surgical site). Multimodal analgesia administered: IV Hydromorphone 0.5 mg and IV Acetaminophen 1000 mg per PACU orders. Reassessed 30 min later with pain reduced to 1/10. No postoperative nausea or vomiting (PONV); Ondansetron 4 mg IV administered proactively in OR.', options: [
        'Pain reported at 3/10 (aching, surgical site). Multimodal analgesia administered: IV Hydromorphone 0.5 mg and IV Acetaminophen 1000 mg per PACU orders. Reassessed 30 min later with pain reduced to 1/10. No postoperative nausea or vomiting (PONV); Ondansetron 4 mg IV administered proactively in OR.',
        'Pain score 4/10 upon emergence. Administered Fentanyl 50 mcg IV push x1 with good relief (score lowered to 2/10). Mild nausea reported; Ondansetron 4 mg IV administered with prompt symptom resolution. Tolerating ice chips in small amounts.',
        'Pain controlled on PCA pump (Morphine 1 mg demand, 6-min lockout); patient demonstrated understanding of self-administration button. Pain level 2/10. Zero nausea or retching.'
      ]},
      { id: 'dispositionPlan', label: 'Recovery Course & Transfer / Discharge Readiness', defaultValue: 'Patient met all PACU Phase I discharge criteria: Aldrete score ≥9 sustained for >30 minutes, hemodynamically stable, pain and nausea controlled, surgical site dry. Bedside SBAR handoff given to Surgical Telemetry receiving nurse. Transferred safely via stretcher with side rails up x2 and call light in hand.', options: [
        'Patient met all PACU Phase I discharge criteria: Aldrete score ≥9 sustained for >30 minutes, hemodynamically stable, pain and nausea controlled, surgical site dry. Bedside SBAR handoff given to Surgical Telemetry receiving nurse. Transferred safely via stretcher with side rails up x2 and call light in hand.',
        'PACU Phase I discharge criteria achieved. Patient transferred to Phase II Day Surgery discharge lounge for oral fluid trial, ambulation, and post-op home care education with family member.',
        'Report called to Step-Down Unit RN. IV fluids running, JP drain secured, incentive spirometer at bedside. Transferred without event.'
      ]},
    ],
    formats: {
      dar: {
        data: 'PACU Phase I recovery at {time}. {surgeryAnesthesia}. {aldreteScore}.',
        action: '{operativeSiteDrains}. {painPONV}.',
        response: '{dispositionPlan}. Patient resting comfortably, vital signs stable.',
      },
      soap: {
        subjective: 'Patient states: "My pain is under control and I feel awake now." Denies dizziness or nausea.',
        objective: 'At {time}: {surgeryAnesthesia}. Aldrete Score: {aldreteScore}. Incision/Drains: {operativeSiteDrains}. Analgesia: {painPONV}.',
        assessment: 'Post-operative surgical and anesthetic recovery Phase I; physiological stability demonstrated by Aldrete score ≥9.',
        plan: '{dispositionPlan}. Continue post-op vitals protocol, encourage incentive spirometry, monitor drain output.',
      },
      narrative: 'At {time}, post-operative nursing care provided in PACU Phase I. Surgical handoff received: {surgeryAnesthesia}. Systematic recovery assessment completed with Modified Aldrete score documented: {aldreteScore}. Operative site and surgical drains inspected: {operativeSiteDrains}. Analgesic and antiemetic regimen administered: {painPONV}. Patient monitored continuously for anesthetic recovery and transferred per protocol: {dispositionPlan}.',
      concise: 'PACU POST-OPERATIVE RECOVERY NOTE ({time}):\n• Handoff & Anesthesia: {surgeryAnesthesia}\n• Modified Aldrete Score: {aldreteScore}\n• Surgical Site & Drains: {operativeSiteDrains}\n• Pain & PONV Management: {painPONV}\n• Disposition & Transfer: {dispositionPlan}',
    },
  },

  // 34. WOUND: Comprehensive Wound Assessment & Pressure Injury Staging Note
  {
    id: 'wound-comprehensive-assessment',
    title: 'Comprehensive Wound Assessment & Pressure Injury Staging Note',
    category: 'wound',
    categoryLabel: 'Wound & Surgical',
    description: 'Standardized WOCN/NPUAP documentation for acute and chronic wounds: anatomical location, staging (Stage 1-4, Unstageable, DTI), measurements (L x W x D cm), tunneling & undermining clock positions, wound bed tissue composition, exudate, periwound condition, and culture.',
    tags: ['wound assessment', 'wound care', 'pressure injury', 'staging', 'NPUAP', 'WOCN', 'tunneling', 'undermining', 'slough', 'granulation', 'diabetic ulcer', 'venous ulcer', 'dressing'],
    fields: [
      { id: 'time', label: 'Assessment Time', defaultValue: '10:00', options: ['07:30', '10:00', '13:30', '16:00', '19:30', '22:00'] },
      { id: 'woundTypeLocation', label: 'Wound Classification & Anatomical Location', defaultValue: 'Sacral Stage 3 pressure injury (hospital-acquired / present on admission). Full-thickness skin loss with subcutaneous fat visible.', options: [
        'Sacral Stage 3 pressure injury (hospital-acquired / present on admission). Full-thickness skin loss with subcutaneous fat visible.',
        'Left ischial tuberosity Stage 4 pressure injury with exposed muscle and underlying bony prominence palpable.',
        'Right lower extremity venous stasis ulcer over medial malleolus with irregular shallow borders.',
        'Right great toe plantar neuropathic diabetic foot ulcer surrounded by hyperkeratotic callus rim.',
        'Dehisced midline laparotomy abdominal surgical wound healing by secondary intention.',
        'Right trochanteric Deep Tissue Injury (DTI) with persistent non-blanchable deep purple/maroon intact discoloration.'
      ]},
      { id: 'dimensionsTunneling', label: 'Measurements (L x W x D), Tunneling & Undermining', defaultValue: 'Dimensions: 4.2 cm length x 3.0 cm width x 1.5 cm depth. Undermining: 1.8 cm from 11:00 to 2:00 clock position. Tunneling: 2.5 cm at 1:00 clock position. Zero exposed bone or orthopedic hardware.', options: [
        'Dimensions: 4.2 cm length x 3.0 cm width x 1.5 cm depth. Undermining: 1.8 cm from 11:00 to 2:00 clock position. Tunneling: 2.5 cm at 1:00 clock position. Zero exposed bone or orthopedic hardware.',
        'Dimensions: 2.5 cm length x 2.0 cm width x 0.4 cm depth. No tunneling or undermining identified. Entire wound base clearly visualized.',
        'Dimensions: 6.0 cm length x 4.5 cm width x 2.8 cm depth. Extensive undermining: 3.0 cm from 1:00 to 6:00. Tunneling: 4.0 cm at 12:00 heading cephalad.',
        'Dimensions: 1.5 cm length x 1.2 cm width x shallow 0.1 cm depth. Partial thickness skin loss with exposed pink dermis. No tunneling.'
      ]},
      { id: 'woundBedTissue', label: 'Wound Bed Tissue Composition & Odor', defaultValue: 'Wound bed composition: 70% viable beefy-red granulation tissue, 30% moist yellow stringy slough adhering to base. Zero necrotic black eschar. No foul odor noted after cleansing.', options: [
        'Wound bed composition: 70% viable beefy-red granulation tissue, 30% moist yellow stringy slough adhering to base. Zero necrotic black eschar. No foul odor noted after cleansing.',
        'Wound bed composition: 90% healthy pink/red granulation tissue with advancing epithelial edges at 3:00 to 9:00 perimeter. 10% soft yellow slough. No odor.',
        'Wound bed: 100% covered by dark brown/black dry, adherent, leathery eschar; true depth unstageable until debrided. Periwound free of fluctuance or crepitus.',
        'Wound bed: 50% yellow devitalized slough, 50% dusky granulation tissue. Mild sweet/musty odor prior to irrigation, resolved after saline wash.'
      ]},
      { id: 'exudatePeriwound', label: 'Exudate Characteristics & Periwound Condition', defaultValue: 'Exudate: Moderate amount of serosanguinous drainage, saturating 50% of inner contact layer. Periwound skin: 1.5 cm border of erythema, mild warmth, non-fluctuant. Skin edges intact without maceration.', options: [
        'Exudate: Moderate amount of serosanguinous drainage, saturating 50% of inner contact layer. Periwound skin: 1.5 cm border of erythema, mild warmth, non-fluctuant. Skin edges intact without maceration.',
        'Exudate: Heavy purulent yellowish-tan exudate with strike-through to outer foam dressing. Periwound skin: macerated, whitish, boggy tissue extending 2 cm around wound margins. Barrier film indicated.',
        'Exudate: Scant serous fluid; inner dressing lightly moist. Periwound skin intact, supple, pink, and healthy with zero erythema, induration, or breakdown.',
        'Exudate: Sanguinous light drainage. Periwound intact, dry, no signs of cellulitis or satellite fungal lesions.'
      ]},
      { id: 'interventionPlan', label: 'Cleansing, Dressing & Collaborative Plan', defaultValue: 'Irrigated with sterile normal saline under low pressure. Cavilon barrier film applied to periwound skin. Hydrofiber with silver (Aquacel Ag) applied to wound bed, covered with bordered silicone foam dressing (Mepilex Border). Pain rated 1/10. Weekly wound measurements scheduled. High-protein nutritional support ordered.', options: [
        'Irrigated with sterile normal saline under low pressure. Cavilon barrier film applied to periwound skin. Hydrofiber with silver (Aquacel Ag) applied to wound bed, covered with bordered silicone foam dressing (Mepilex Border). Pain rated 1/10. Weekly wound measurements scheduled. High-protein nutritional support ordered.',
        'Cleansed with hypochlorous acid wound solution (Vashe) x 5 minutes soak. Periwound protected with dimethicone barrier film. Wound photos captured and uploaded to electronic health record. Ordered weekly formal measurement.',
        'Irrigated with sterile water; wound swab culture obtained via Levine technique post-cleansing from viable tissue. WOCN consultation requested for sharp debridement. Offloading air mattress verified functional.',
        'Cleaned with 0.9% NS, Medihoney gel applied to slough areas, covered with non-adherent contact layer and 4x4 gauze. Pressure relief repositioning q2h maintained.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Wound assessment at {time}: {woundTypeLocation}. Measurements: {dimensionsTunneling}. Tissue bed: {woundBedTissue}. Exudate & periwound: {exudatePeriwound}.',
        action: 'Performed wound care using aseptic technique: {interventionPlan}.',
        response: 'Dressing clean, dry, and intact with date/time/initials. Patient tolerated without acute pain. Pressure injury offloaded.',
      },
      soap: {
        subjective: 'Patient reports wound feels comfortable; denies sharp or radiating pain at site (rated 1/10). Tolerates dressing change well.',
        objective: 'At {time}: {woundTypeLocation}. {dimensionsTunneling}. Bed: {woundBedTissue}. Exudate/Periwound: {exudatePeriwound}. Interventions: {interventionPlan}.',
        assessment: 'Chronic wound exhibiting active granulation tissue; no signs of invasive systemic infection, ongoing healing trajectory supported.',
        plan: 'Continue prescribed topical regimen, maintain strict pressure offloading (q2h turn, heel suspension), optimize nutrition (protein 1.5 g/kg/day), rescreen weekly.',
      },
      narrative: 'At {time}, comprehensive wound assessment and dressing procedure performed. Wound classified: {woundTypeLocation}. Exact wound metrics documented: {dimensionsTunneling}. Wound bed status: {woundBedTissue}. Drainage and surrounding skin: {exudatePeriwound}. Wound hygiene and dressing application completed: {interventionPlan}. Dressing intact and secure.',
      concise: 'WOUND ASSESSMENT & STAGING NOTE ({time}):\n• Location & Stage: {woundTypeLocation}\n• Dimensions (L x W x D): {dimensionsTunneling}\n• Wound Bed Tissue: {woundBedTissue}\n• Exudate & Periwound: {exudatePeriwound}\n• Cleansing & Dressing: {interventionPlan}',
    },
  },

  // 35. WOUND: Complex Wound Care: Packing & Negative Pressure Therapy (VAC)
  {
    id: 'wound-complex-packing-vac',
    title: 'Complex Wound Care: Packing & Negative Pressure Therapy (VAC)',
    category: 'wound',
    categoryLabel: 'Wound & Surgical',
    description: 'Documentation for complex wound dressings, cavity ribbon/strip packing (counts verified), antimicrobial applications, and Negative Pressure Wound Therapy (NPWT / Wound VAC) placement and canister tracking.',
    tags: ['wound VAC', 'NPWT', 'packing', 'cavity packing', 'negative pressure', 'aquacel', 'alginate', 'sponge count', 'wound care', 'dressing'],
    fields: [
      { id: 'time', label: 'Care Time', defaultValue: '14:00', options: ['06:30', '10:00', '14:00', '17:30', '21:00'] },
      { id: 'woundLocationType', label: 'Wound Description & Preparation', defaultValue: 'Open abdominal laparotomy wound with depth / subcutaneous cavity. Pre-medicated with ordered oral analgesic 30 minutes prior to procedure; pain rated 1/10 during old dressing removal.', options: [
        'Open abdominal laparotomy wound with depth / subcutaneous cavity. Pre-medicated with ordered oral analgesic 30 minutes prior to procedure; pain rated 1/10 during old dressing removal.',
        'Stage 4 sacral pressure injury cavity with undermining. Pre-medicated with ordered analgesic; old dressing removed atraumatically with saline moistening. Denies acute pain.',
        'Left lower extremity fasciotomy wound undergoing ongoing Negative Pressure Wound Therapy (NPWT). Tolerated dressing change well.',
        'Dehisced sternotomy surgical wound with clean margins and granulating base. Suture line intact.'
      ]},
      { id: 'irrigationPretreatment', label: 'Irrigation, Cleansing & Skin Barrier', defaultValue: 'Cleansed by irrigating with 250 mL sterile 0.9% Normal Saline until run-off clear. Loose slough gently wiped with sterile moist gauze. Periwound skin cleansed, dried thoroughly, and protected with Cavilon skin barrier prep film.', options: [
        'Cleansed by irrigating with 250 mL sterile 0.9% Normal Saline until run-off clear. Loose slough gently wiped with sterile moist gauze. Periwound skin cleansed, dried thoroughly, and protected with Cavilon skin barrier prep film.',
        'Soaked for 10 minutes with hypochlorous acid (Vashe) soaked gauze. Cleansed gently center-to-periphery. Peri-wound skin dried and hydrocolloid skin barriers applied around margins to protect skin from maceration.',
        'Irrigated with warm sterile saline under gentle pulsatile flush. Surrounding skin prepped with alcohol-free skin barrier wiped and allowed to dry completely.'
      ]},
      { id: 'packingNPWT', label: 'Packing Material or NPWT Foam & Sponge Count', defaultValue: 'Wound VAC (KCI NPWT) applied using sterile technique: GranuFoam (black reticulated foam) trimmed custom to wound margins avoiding contact with intact skin. SensaT.R.A.C. pad positioned over foam center. Vacuum activated at continuous -125 mmHg: foam contracted firmly, airtight seal verified with zero audible air leaks. Sponge count: 1 in / 1 out.', options: [
        'Wound VAC (KCI NPWT) applied using sterile technique: GranuFoam (black reticulated foam) trimmed custom to wound margins avoiding contact with intact skin. SensaT.R.A.C. pad positioned over foam center. Vacuum activated at continuous -125 mmHg: foam contracted firmly, airtight seal verified with zero audible air leaks. Sponge count: 1 in / 1 out.',
        'Cavity loosely packed with antimicrobial silver calcium alginate ribbon (Aquacel Ag Extra), leaving 2 cm tail at wound surface for retrieval. Total packing count: 1 continuous 12-inch ribbon inserted (prior 1 ribbon removed and accounted for in full). Cavity packed to 80% capacity to avoid excessive tissue pressure.',
        'Iodoform packing strip (1/4 inch) impregnated with medical grade honey (Medihoney) packed gently into deep sinus tract to 3 cm depth. Packing count: 1 strip inserted, 1 strip removed. Labeled count on outer dressing.',
        'White polyvinyl alcohol (PVA) foam placed over exposed deep structure, covered with black GranuFoam. NPWT connected to canister and set to continuous -100 mmHg. Sponge collapsed instantly; leak meter 0.0 L/min.'
      ]},
      { id: 'outerCoverDressing', label: 'Secondary Dressing & Securement', defaultValue: 'Covered with transparent occlusive polyurethane drape extending 3-5 cm beyond wound borders, ensuring wrinkle-free seal. Bridging technique applied away from groin/perineum to prevent contamination.', options: [
        'Covered with transparent occlusive polyurethane drape extending 3-5 cm beyond wound borders, ensuring wrinkle-free seal. Bridging technique applied away from groin/perineum to prevent contamination.',
        'Covered with sterile 4x4 gauze sponges, ABD moisture-wicking pad, and secured with Hypafix stretch tape / paper tape. Labeled with date, military time, and nurse initials.',
        'Covered with silicone bordered foam dressing (Mepilex Border Sacrum) dated and initialed. Outer dressing intact, flat, and edges sealed.'
      ]},
      { id: 'toleranceCanister', label: 'Canister Output, Alarms & Patient Status', defaultValue: 'VAC canister inspected: 25 mL serosanguinous drainage collected. Zero vacuum leak alarms, canister unclogged and patent. Patient placed in position of comfort with sacral pressure offloaded via low-air-loss mattress. Call bell in hand.', options: [
        'VAC canister inspected: 25 mL serosanguinous drainage collected. Zero vacuum leak alarms, canister unclogged and patent. Patient placed in position of comfort with sacral pressure offloaded via low-air-loss mattress. Call bell in hand.',
        'NPWT system checked 30 min post-application: canister sealed, suction maintained at continuous -125 mmHg, zero alarms. Patient denies pain or suction discomfort.',
        'Dressing secure and dry. Instructed patient on keeping dressing clean and dry and avoiding direct pressure on packed site. Next scheduled dressing change in 48 hours or PRN.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Complex wound care at {time}. {woundLocationType}. Baseline site evaluated, old dressing removed.',
        action: 'Performed sterile care: {irrigationPretreatment}. Applied {packingNPWT}. Secured with {outerCoverDressing}.',
        response: '{toleranceCanister}. Procedure tolerated well. Dressing labeled.',
      },
      soap: {
        subjective: 'Patient reports feeling comfortable during and after dressing change; pre-medication provided adequate relief.',
        objective: 'At {time}: {woundLocationType}. Prep: {irrigationPretreatment}. Packing/VAC: {packingNPWT}. Dressing: {outerCoverDressing}. Monitoring: {toleranceCanister}.',
        assessment: 'Complex cavity wound receiving negative pressure / therapeutic packing; wound bed clean, dressing airtight and functioning properly.',
        plan: 'Check NPWT seal and canister output q4h, change dressing q48-72h per orders, maintain count documentation on outer dressing.',
      },
      narrative: 'At {time}, complex wound procedure completed. {woundLocationType}. Site prepped: {irrigationPretreatment}. Therapeutic material applied: {packingNPWT}. Secondary dressing secured: {outerCoverDressing}. Post-procedure verification: {toleranceCanister}. Patient resting comfortably.',
      concise: 'COMPLEX WOUND PACKING / VAC NOTE ({time}):\n• Wound & Pre-Med: {woundLocationType}\n• Cleansing & Prep: {irrigationPretreatment}\n• Packing / VAC & Count: {packingNPWT}\n• Secondary Dressing: {outerCoverDressing}\n• Canister / Response: {toleranceCanister}',
    },
  },

  // 36. PROCEDURE (GI/GU): Nasogastric (NG) / Orogastric (OG) Tube Insertion & Placement Verification
  {
    id: 'gigu-ng-tube-insertion',
    title: 'Nasogastric (NG) / Orogastric (OG) Tube Insertion & Verification',
    category: 'gigu',
    categoryLabel: 'GI & Genitourinary',
    isProcedure: true,
    procedureCategory: 'gigu',
    procedureCategoryLabel: 'GI, Enteral & GU Tubes',
    procedureBadges: ['NEX Measurement', 'pH Aspirate Check', 'KUB X-Ray Protocol', 'Anti-Reflux Valve'],
    description: 'Procedure documentation for bedside insertion of nasogastric/orogastric tubes: NEX length measurement, insertion technique, tolerance, gastric aspirate pH testing (<5.5), radiographic confirmation protocol, securement, and suction setup.',
    tags: ['NG tube', 'nasogastric', 'Salem sump', 'Dobhoff', 'tube insertion', 'placement verification', 'pH test', 'KUB x-ray', 'enteral', 'decompression', 'procedure'],
    fields: [
      { id: 'time', label: 'Insertion Time', defaultValue: '08:30', options: ['07:15', '08:30', '11:45', '14:20', '17:00', '21:30'] },
      { id: 'indicationType', label: 'Indication & Tube Type/Size', defaultValue: 'Gastric decompression for small bowel obstruction with intractable vomiting. Salem Sump 16Fr double-lumen radiopaque tube.', options: [
        'Gastric decompression for small bowel obstruction with intractable vomiting. Salem Sump 16Fr double-lumen radiopaque tube.',
        'Enteral nutrition support & medication administration. Small-bore Dobhoff 10Fr feeding tube with weighted tip and internal stylet/guidewire.',
        'Postoperative stomach decompression following abdominal laparotomy. Salem Sump 14Fr tube.',
        'Acute gastrointestinal bleeding gastric lavage and monitoring. Salem Sump 18Fr large-bore tube.'
      ]},
      { id: 'measurementNares', label: 'Naris & NEX Measurement', defaultValue: 'Right naris assessed: patent, mucosa intact without septal deviation. NEX (Nose to Earlobe to Xiphoid process) measured and marked with indelible ink at 55 cm.', options: [
        'Right naris assessed: patent, mucosa intact without septal deviation. NEX (Nose to Earlobe to Xiphoid process) measured and marked with indelible ink at 55 cm.',
        'Left naris assessed: patent, clear of obstruction. NEX measured and marked at 52 cm.',
        'Orogastric route selected due to basilar skull / facial trauma precautions. Measured from corner of mouth to earlobe to xiphoid marked at 50 cm.'
      ]},
      { id: 'insertionTolerance', label: 'Technique & Patient Tolerance', defaultValue: 'Patient placed in High Fowler position (90°). Distal 4 inches lubricated with water-soluble surgical lubricant. Tube advanced gently along nasal floor. Patient instructed to tuck chin to chest and swallow sips of water via straw. Tube advanced synchronously with swallowing to 55 cm mark. Zero coughing, choking, dyspnea, or cyanosis observed. Patient tolerated with mild gagging only.', options: [
        'Patient placed in High Fowler position (90°). Distal 4 inches lubricated with water-soluble surgical lubricant. Tube advanced gently along nasal floor. Patient instructed to tuck chin to chest and swallow sips of water via straw. Tube advanced synchronously with swallowing to 55 cm mark. Zero coughing, choking, dyspnea, or cyanosis observed. Patient tolerated with mild gagging only.',
        'Patient upright; tip lubricated. Advanced with patient swallowing ice chips. Smooth passage into stomach without resistance or epistaxis. Speaking clearly post-insertion; SpO2 99% on room air.',
        'Intubated patient in ICU: Head elevated 30°. Passed smoothly into esophagus with gentle forward pressure while observing capnography / laryngoscopy. No airway compromise.'
      ]},
      { id: 'verificationSafety', label: 'Placement Verification & Radiography', defaultValue: 'Placement confirmed: 25 mL cloudy greenish gastric aspirate easily withdrawn via 60 mL catheter-tip syringe. Gastric pH verified via indicator strip at 3.5 (verified gastric range <5.5). STAT portable abdominal KUB X-ray ordered. Tube clamped and capped. Zero fluids, flushes, or medications instilled pending official radiologist interpretation.', options: [
        'Placement confirmed: 25 mL cloudy greenish gastric aspirate easily withdrawn via 60 mL catheter-tip syringe. Gastric pH verified via indicator strip at 3.5 (verified gastric range <5.5). STAT portable abdominal KUB X-ray ordered. Tube clamped and capped. Zero fluids, flushes, or medications instilled pending official radiologist interpretation.',
        'Gastric fluid aspirated (tan/bile-tinged, pH 4.0). Portable chest/abdominal X-ray performed at bedside; radiologist confirmed tube tip in gastric antrum past GE junction. Stylet removed smoothly and discarded. Cleared for enteral feedings.',
        'Aspirate obtained: pH 3.0. X-ray confirmation pending. Auscultation of air bolus avoided per safety standards. Tube clamped.'
      ]},
      { id: 'securementSuction', label: 'Securement & Suction / Gravity Setup', defaultValue: 'Secured to nasal bridge using hypoallergenic Hollister tube attachment device without pressure or necrosis on nasal ala. Blue air vent pigtail positioned upright above stomach level with anti-reflux valve in place. Connected to low intermittent wall suction (LIS) at 30-40 mmHg; returning greenish gastric contents.', options: [
        'Secured to nasal bridge using hypoallergenic Hollister tube attachment device without pressure or necrosis on nasal ala. Blue air vent pigtail positioned upright above stomach level with anti-reflux valve in place. Connected to low intermittent wall suction (LIS) at 30-40 mmHg; returning greenish gastric contents.',
        'Secured to cheek and nasal bridge with split tape. Connected to gravity drainage bag positioned below stomach level.',
        'Feeding tube secured with commercial nasal bridle / tape device. Clamped and flushed with 30 mL sterile water following radiologist clearance.'
      ]},
    ],
    formats: {
      dar: {
        data: 'NG tube insertion at {time}: {indicationType}. Naris & measurement: {measurementNares}.',
        action: 'Inserted using aseptic technique: {insertionTolerance}. Verified: {verificationSafety}. Secured: {securementSuction}.',
        response: 'Tube secured firmly at marked centimeter mark. Patient comfortable, breathing easily without respiratory distress. Radiologist verification awaited.',
      },
      soap: {
        subjective: 'Patient reports mild throat irritation during tube passage; denies severe pain, shortness of breath, or chest discomfort.',
        objective: 'At {time}: {indicationType}. {measurementNares}. Technique: {insertionTolerance}. Verification: {verificationSafety}. Securement: {securementSuction}.',
        assessment: 'Nasogastric tube successfully placed to predetermined mark; preliminary gastric aspirate pH indicates gastric positioning. Awaiting radiologic clearance.',
        plan: 'Obtain STAT KUB X-ray read, withhold all flushes/feeds until X-ray sign-off, verify mark at nares q4h, monitor suction output and electrolyte panel.',
      },
      narrative: 'At {time}, nasogastric tube insertion procedure performed. Indication: {indicationType}. {measurementNares}. Insertion completed: {insertionTolerance}. Safety verification: {verificationSafety}. Final securement: {securementSuction}. Patient resting comfortably.',
      concise: 'NG/OG TUBE INSERTION & VERIFICATION NOTE ({time}):\n• Tube & Indication: {indicationType}\n• NEX Measurement & Naris: {measurementNares}\n• Technique & Tolerance: {insertionTolerance}\n• pH & Radiologic Verification: {verificationSafety}\n• Securement & Suction: {securementSuction}',
    },
  },

  // 37. PROCEDURE (BEDSIDE): Bedside Invasive Procedure Assist & Universal Protocol Time-Out
  {
    id: 'bedside-invasive-procedure-assist',
    title: 'Bedside Invasive Procedure Assist & Universal Time-Out',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    isProcedure: true,
    procedureCategory: 'bedside',
    procedureCategoryLabel: 'Bedside Invasive & Assist',
    procedureBadges: ['Universal Time-Out', 'Sterile Field Assist', 'Local Anesthetic Tracking', 'Specimen Custody'],
    description: 'Standardized nursing assist documentation for bedside invasive procedures (Thoracentesis, Paracentesis, Lumbar Puncture, Bone Marrow Biopsy): pre-procedure consent verification, JCAHO Universal Protocol Time-Out, sterile field maintenance, local anesthetic tracking, evacuated volumes, specimen chain of custody, and post-procedure recovery.',
    tags: ['bedside procedure', 'invasive procedure', 'time-out', 'universal protocol', 'paracentesis', 'thoracentesis', 'lumbar puncture', 'sterile assist', 'specimen'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '10:30', options: ['08:45', '10:30', '13:15', '15:45', '19:00'] },
      { id: 'procedurePhysician', label: 'Procedure & Operating Physician', defaultValue: 'Ultrasound-guided Bedside Diagnostic & Therapeutic Paracentesis assisted with Dr. [Physician Name]. Informed consent signed and verified on chart. Baseline vitals: BP 118/74, HR 76, RR 16, SpO2 99% on RA.', options: [
        'Ultrasound-guided Bedside Diagnostic & Therapeutic Paracentesis assisted with Dr. [Physician Name]. Informed consent signed and verified on chart. Baseline vitals: BP 118/74, HR 76, RR 16, SpO2 99% on RA.',
        'Bedside Diagnostic & Therapeutic Thoracentesis assisted with Pulmonology / Dr. [Physician Name]. Signed operative consent in chart. Baseline vitals: BP 132/80, HR 84, RR 20, SpO2 95% on 2L NC.',
        'Bedside Diagnostic Lumbar Puncture (LP) assisted with Neurology / Dr. [Physician Name]. Patient consent verified. Baseline neuro check intact.',
        'Bedside Bone Marrow Aspiration & Biopsy assisted with Hematology/Oncology / Dr. [Physician Name]. Pre-procedure consent verified.'
      ]},
      { id: 'timeOutUniversal', label: 'Universal Protocol Time-Out', defaultValue: 'Universal Protocol Bedside Time-Out executed immediately prior to local anesthetic infiltration: 2 patient identifiers verified, procedure confirmed, correct anatomical site (left lower quadrant abdomen) marked and verified, allergies (NKDA) confirmed, coagulopathies reviewed (Platelets 138k, INR 1.1). Entire procedural team actively voiced agreement to proceed.', options: [
        'Universal Protocol Bedside Time-Out executed immediately prior to local anesthetic infiltration: 2 patient identifiers verified, procedure confirmed, correct anatomical site (left lower quadrant abdomen) marked and verified, allergies (NKDA) confirmed, coagulopathies reviewed (Platelets 138k, INR 1.1). Entire procedural team actively voiced agreement to proceed.',
        'Bedside Time-Out performed with physician, bedside RN, and patient: 2 patient identifiers, correct procedure (Right Thoracentesis), correct anatomical site marked at 8th intercostal space posterior axillary line, consent verified, pre-op coag studies confirmed acceptable.',
        'Time-Out completed: Patient identity, procedure (Lumbar Puncture L3-L4 interspace), lack of contraindications, and sterile PPE compliance confirmed by all personnel.'
      ]},
      { id: 'sterilePrepAnesthetic', label: 'Sterile Field & Local Anesthesia', defaultValue: 'Sterile field established; clinician donned sterile gown, cap, mask with face shield, and sterile gloves. Skin prepped with 2% CHG with 70% IPA friction scrub x 30 sec and air-dried. Local anesthetic infiltrated: 10 mL 1% Lidocaine without epinephrine. Zero adverse or allergic reaction observed.', options: [
        'Sterile field established; clinician donned sterile gown, cap, mask with face shield, and sterile gloves. Skin prepped with 2% CHG with 70% IPA friction scrub x 30 sec and air-dried. Local anesthetic infiltrated: 10 mL 1% Lidocaine without epinephrine. Zero adverse or allergic reaction observed.',
        'Sterile drape applied. 2% ChloraPrep scrub completed. Local infiltration of 12 mL 1% Lidocaine. Anesthesia achieved prior to needle entry.',
        'Skin prepped with sterile Betadine (iodine allergy checked). Local infiltration with 8 mL 2% Lidocaine into subcutaneous tissue and periosteum.'
      ]},
      { id: 'techniqueEvacuation', label: 'Catheter Placement & Fluid Evacuation', defaultValue: 'Real-time ultrasound guidance utilized. 14G Caldwell paracentesis catheter introduced into peritoneal cavity. 3,800 mL clear straw-colored ascitic fluid evacuated into vacuum canisters. 60 mL diagnostic fluid aliquoted into sterile containers for cell count, albumin, total protein, cytology, and culture. Post-paracentesis IV Albumin 25% (25g) infused per large-volume protocol.', options: [
        'Real-time ultrasound guidance utilized. 14G Caldwell paracentesis catheter introduced into peritoneal cavity. 3,800 mL clear straw-colored ascitic fluid evacuated into vacuum canisters. 60 mL diagnostic fluid aliquoted into sterile containers for cell count, albumin, total protein, cytology, and culture. Post-paracentesis IV Albumin 25% (25g) infused per large-volume protocol.',
        'Ultrasound guidance utilized: 8Fr catheter introduced into right posterior pleural space. 1,100 mL amber serous fluid removed via gravity drainage. Fluid sent for LDH, protein, pH, cell count, and microbiology. Procedure stopped per 1.5L safety limit.',
        '20G Quincke spinal needle inserted at L3-L4. Opening pressure measured at 14 cmH2O (normal). 12 mL clear, colorless CSF collected in 4 sequentially numbered tubes (Tubes 1-4) for cell count, protein, glucose, and cultures. Needle withdrawn smoothly.',
        'Bone marrow aspirate (5 mL) and core biopsy (1.5 cm) obtained from posterior superior iliac spine; slides prepared at bedside.'
      ]},
      { id: 'postProcedureSite', label: 'Site Care, Specimen Custody & Vitals', defaultValue: 'Catheter removed at procedure conclusion; direct pressure held for 5 minutes. Sterile occlusive pressure dressing applied. Puncture site clean, dry, zero active leaking or hematoma. All specimen containers labeled at patient bedside in presence of patient and dispatched STAT to laboratory. Post-procedure vitals: BP 114/70, HR 78, RR 16, SpO2 99%. Patient denies dizziness or acute pain (rated 1/10). Bedside call bell within reach.', options: [
        'Catheter removed at procedure conclusion; direct pressure held for 5 minutes. Sterile occlusive pressure dressing applied. Puncture site clean, dry, zero active leaking or hematoma. All specimen containers labeled at patient bedside in presence of patient and dispatched STAT to laboratory. Post-procedure vitals: BP 114/70, HR 78, RR 16, SpO2 99%. Patient denies dizziness or acute pain (rated 1/10). Bedside call bell within reach.',
        'Sterile occlusive pressure dressing placed over thoracic puncture site. Post-procedure upright chest X-ray ordered to rule out pneumothorax. Vitals stable: BP 128/76, HR 82, SpO2 98% on 2L NC. Breath sounds present bilaterally.',
        'Spinal puncture site dressed with sterile adhesive bandage. Instructed to maintain flat supine bed rest for 1-2 hours to prevent post-dural puncture headache. Neurological status intact, vitals baseline.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Bedside invasive procedure assist at {time}: {procedurePhysician}. Pre-procedure check completed.',
        action: 'Assisted sterile procedure: {timeOutUniversal}. {sterilePrepAnesthetic}. {techniqueEvacuation}. Site dressed: {postProcedureSite}.',
        response: 'Procedure completed successfully. Specimens labeled at bedside and sent to lab. Patient hemodynamically stable without complication.',
      },
      soap: {
        subjective: 'Patient reports feeling well post-procedure; denies dizziness, shortness of breath, palpitations, or severe procedural pain.',
        objective: 'At {time}: {procedurePhysician}. Universal Time-Out: {timeOutUniversal}. Prep & Lidocaine: {sterilePrepAnesthetic}. Procedure output: {techniqueEvacuation}. Post-procedure care: {postProcedureSite}.',
        assessment: 'Bedside invasive procedure tolerated without acute complication or hemodynamic instability; puncture site intact with sterile dressing.',
        plan: 'Monitor vitals q15min x 1h then q1h x 2h, observe puncture site for bleeding or fluid strike-through, review follow-up diagnostic imaging and laboratory results.',
      },
      narrative: 'At {time}, assisted with bedside invasive procedure. {procedurePhysician}. Standardized Universal Protocol Time-Out executed: {timeOutUniversal}. Sterile field established and local anesthesia delivered: {sterilePrepAnesthetic}. Procedural technique and evacuation: {techniqueEvacuation}. Post-procedural nursing care: {postProcedureSite}. Patient resting comfortably.',
      concise: 'BEDSIDE INVASIVE PROCEDURE ASSIST & TIME-OUT ({time}):\n• Procedure & Operator: {procedurePhysician}\n• Universal Protocol Time-Out: {timeOutUniversal}\n• Prep & Local Anesthesia: {sterilePrepAnesthetic}\n• Evacuation / Specimens: {techniqueEvacuation}\n• Post-Procedure Care & Vitals: {postProcedureSite}',
    },
  },

  // 38. PROCEDURE (VASCULAR): Blood Culture Collection (Dual-Site Sterile Venipuncture)
  {
    id: 'vascular-blood-cultures',
    title: 'Blood Culture Sterile Collection (Dual-Site Venipuncture)',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    isProcedure: true,
    procedureCategory: 'vascular',
    procedureCategoryLabel: 'Vascular Access & Infusions',
    procedureBadges: ['2 Distinct Sites', '30s CHG Friction Scrub', '8-10 mL / Bottle', 'CLSI Protocol'],
    description: 'Standardized CDC/CLSI diagnostic procedure note for blood culture collection: indications, 2 distinct venipuncture sites, chlorhexidine friction scrubbing, bottle septa disinfection, volume tracking (8-10 mL/bottle), order of draw, and bedside labeling.',
    tags: ['blood culture', 'venipuncture', 'bacteremia', 'sepsis workup', 'sterile draw', 'microbiology', 'procedure', 'CLSI standard'],
    fields: [
      { id: 'time', label: 'Draw Time', defaultValue: '14:15', options: ['06:30', '09:00', '14:15', '18:45', '22:30', '02:00'] },
      { id: 'indicationVitals', label: 'Indication & Temperature', defaultValue: 'Diagnostic blood cultures x 2 sets ordered for febrile spike (Temp 38.9°C oral), rigors, heart rate 108 bpm, and suspected systemic bacteremia prior to starting broad-spectrum antibiotics.', options: [
        'Diagnostic blood cultures x 2 sets ordered for febrile spike (Temp 38.9°C oral), rigors, heart rate 108 bpm, and suspected systemic bacteremia prior to starting broad-spectrum antibiotics.',
        'Sepsis resuscitation protocol bundle: Blood cultures x 2 drawn prior to administration of empiric IV vancomycin and cefepime.',
        'Evaluation of suspected central line-associated bloodstream infection (CLABSI): 1 set from CVAD and 1 set from peripheral venipuncture.',
        'Follow-up blood cultures to document clearance of Staphylococcus aureus bacteremia.'
      ]},
      { id: 'sitesTechnique', label: 'Venipuncture Sites & Skin Antisepsis', defaultValue: 'Collected from 2 distinct anatomical peripheral venipuncture sites 15 minutes apart. Set 1: Left median cubital vein. Set 2: Right cephalic forearm vein. Each venipuncture site prepped with 2% Chlorhexidine Gluconate (CHG) in 70% IPA using vigorous friction scrub in crosshatch pattern for 30 seconds and allowed to air dry completely for 60 seconds. Vein not palpated after prep.', options: [
        'Collected from 2 distinct anatomical peripheral venipuncture sites 15 minutes apart. Set 1: Left median cubital vein. Set 2: Right cephalic forearm vein. Each venipuncture site prepped with 2% Chlorhexidine Gluconate (CHG) in 70% IPA using vigorous friction scrub in crosshatch pattern for 30 seconds and allowed to air dry completely for 60 seconds. Vein not palpated after prep.',
        'Set 1 collected from Right antecubital vein via sterile venipuncture. Set 2 drawn simultaneously from Left forearm vein by second RN using identical sterile technique.',
        'Set 1 drawn from PICC line catheter hub after 30s hub scrub; Set 2 drawn from peripheral Left median basilic vein.'
      ]},
      { id: 'bottleInoculation', label: 'Inoculation Technique & Volume', defaultValue: 'Bottle septa disinfected with separate 70% isopropyl alcohol wipes and allowed to air dry. Sterile butterfly needle with safety vacutainer holder used. 10 mL inoculated into Aerobic bottle first, followed by 10 mL inoculated into Anaerobic bottle for Set 1 (20 mL total); identical 10 mL/bottle drawn for Set 2 (20 mL total). Total volume: 40 mL peripheral blood collected.', options: [
        'Bottle septa disinfected with separate 70% isopropyl alcohol wipes and allowed to air dry. Sterile butterfly needle with safety vacutainer holder used. 10 mL inoculated into Aerobic bottle first, followed by 10 mL inoculated into Anaerobic bottle for Set 1 (20 mL total); identical 10 mL/bottle drawn for Set 2 (20 mL total). Total volume: 40 mL peripheral blood collected.',
        '8-10 mL blood inoculated into each bottle (Aerobic first, Anaerobic second). Bottle rubber stoppers protected from environmental contamination. Accurate blood fill lines confirmed.',
        'Pediatric blood culture bottle utilized: 3 mL blood inoculated using sterile micro-collection butterfly without overfilling.'
      ]},
      { id: 'labelingTransport', label: 'Bedside Labeling & Transport', defaultValue: 'All 4 culture bottles labeled immediately at patient bedside with 2 patient identifiers, military draw time, specific anatomical site, and nurse initials. Bottles dispatched STAT to microbiology laboratory for continuous incubator monitoring. Direct pressure held at venipuncture sites for 3 minutes; adhesive spot bandages placed. Hemostasis achieved.', options: [
        'All 4 culture bottles labeled immediately at patient bedside with 2 patient identifiers, military draw time, specific anatomical site, and nurse initials. Bottles dispatched STAT to microbiology laboratory for continuous incubator monitoring. Direct pressure held at venipuncture sites for 3 minutes; adhesive spot bandages placed. Hemostasis achieved.',
        'Labeled in electronic EHR at bedside with barcode scanner. Hand-delivered immediately to hospital lab. Puncture sites inspected: clean, dry, zero hematoma.',
        'Culture bottles labeled and bagged in biohazard pouch. STAT lab courier notified. Patient tolerated without lightheadedness.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Blood culture collection at {time}: {indicationVitals}. Dual distinct sites selected.',
        action: 'Performed sterile venipunctures: {sitesTechnique}. Inoculated: {bottleInoculation}. Labeled & transported: {labelingTransport}.',
        response: 'Sites clean with hemostasis achieved. Specimen chain of custody verified. Broad-spectrum antimicrobial therapy initiated per orders.',
      },
      soap: {
        subjective: 'Patient reports feeling chilled; denies dizziness or vasovagal symptoms during venipunctures. Tolerated procedure well.',
        objective: 'At {time}: {indicationVitals}. Sites & Prep: {sitesTechnique}. Volume: {bottleInoculation}. Specimen: {labelingTransport}.',
        assessment: 'Diagnostic blood cultures obtained via strict sterile technique to rule out bacteremia prior to antibiotic administration.',
        plan: 'Administer ordered IV antibiotics immediately post-draw, monitor temperature curve and hemodynamics, follow preliminary Gram stain results at 24-48h.',
      },
      narrative: 'At {time}, sterile blood culture collection performed. Indication: {indicationVitals}. Antisepsis and sites: {sitesTechnique}. Blood volume and order of inoculation: {bottleInoculation}. Bedside verification and dispatch: {labelingTransport}. Hemostasis verified at all puncture sites.',
      concise: 'BLOOD CULTURE STERILE COLLECTION NOTE ({time}):\n• Indication & Vitals: {indicationVitals}\n• Sites & CHG Antisepsis: {sitesTechnique}\n• Volume & Bottle Inoculation: {bottleInoculation}\n• Labeling & Lab Dispatch: {labelingTransport}',
    },
  },

  // 39. PROCEDURE (RESPIRATORY): Chest Tube Insertion Assist & Pleural Drainage System Care
  {
    id: 'resp-chest-tube-management',
    title: 'Chest Tube Insertion Assist & Pleural Drainage System Care',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    isProcedure: true,
    procedureCategory: 'respiratory',
    procedureCategoryLabel: 'Airway & Respiratory Procedures',
    procedureBadges: ['Pleural Drainage', 'Water Seal & Suction', 'Air Leak Assessment', 'Emergency Safety Gear'],
    description: 'Procedure documentation for assisting with chest tube thoracostomy insertion and managing pleural drainage systems (Atrium/Oasis): water seal level, suction pressure (-20 cmH2O), air leak evaluation, drainage volume, crepitus assessment, and bedside emergency safety equipment.',
    tags: ['chest tube', 'thoracostomy', 'pleural drainage', 'water seal', 'pneumothorax', 'hemothorax', 'air leak', 'crepitus', 'procedure'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '11:00', options: ['07:30', '11:00', '13:45', '16:30', '20:15'] },
      { id: 'indicationTubeSize', label: 'Indication & Tube Insertion Assist', defaultValue: 'Assisted Cardiothoracic Surgery / Dr. [Physician Name] with emergency bedside placement of Left 28Fr chest thoracostomy tube for acute traumatic hemopneumothorax. Universal Protocol Time-Out conducted. Sterile field maintained throughout.', options: [
        'Assisted Cardiothoracic Surgery / Dr. [Physician Name] with emergency bedside placement of Left 28Fr chest thoracostomy tube for acute traumatic hemopneumothorax. Universal Protocol Time-Out conducted. Sterile field maintained throughout.',
        'Assisted Pulmonology with Left 14Fr pigtail catheter chest drain placement for large spontaneous pneumothorax under ultrasound guidance. Consent verified.',
        'Routine shift assessment and drainage system maintenance of existing Right 32Fr chest tube post-thoracotomy.'
      ]},
      { id: 'drainageSetup', label: 'Pleural Drainage Unit Setup & Suction', defaultValue: 'Connected to Atrium Oasis dry-suction water-seal chest drain unit. Water seal chamber filled with sterile water to 2 cm indicator. Suction regulator dial set to ordered -20 cmH2O and connected to wall suction; suction indicator accordion expanded fully.', options: [
        'Connected to Atrium Oasis dry-suction water-seal chest drain unit. Water seal chamber filled with sterile water to 2 cm indicator. Suction regulator dial set to ordered -20 cmH2O and connected to wall suction; suction indicator accordion expanded fully.',
        'Drainage unit placed to water seal only (no wall suction) per physician orders. Water seal maintained at 2 cm line.',
        'Connected to mobile digital chest drainage system (Thopaz) set to continuous -15 cmH2O with real-time digital air leak logging.'
      ]},
      { id: 'waterSealAirLeak', label: 'Water Seal Tidaling & Air Leak Grade', defaultValue: 'Water seal chamber assessed: gentle respiratory tidaling (fluctuation of 2-4 cm) observed with spontaneous respirations. Air leak meter demonstrates Grade 1 intermittent air leak with forced exhalation, no continuous bubbling. Tidaling confirms pleural communication and tube patency.', options: [
        'Water seal chamber assessed: gentle respiratory tidaling (fluctuation of 2-4 cm) observed with spontaneous respirations. Air leak meter demonstrates Grade 1 intermittent air leak with forced exhalation, no continuous bubbling. Tidaling confirms pleural communication and tube patency.',
        'Water seal tidaling active with positive pressure ventilation. Zero bubbling in air leak chamber with coughing or exhalation (air leak resolved).',
        'Continuous vigorous Grade 5 air leak bubbling noted across chambers 1-5; physician notified; checked all connections from insertion site to canister.'
      ]},
      { id: 'drainageDressing', label: 'Drainage Characteristics & Insertion Dressing', defaultValue: 'Evacuated 220 mL dark sanguinous fluid in first 30 minutes; marked on collection canister with date, military time, and initials. Chest tube sutured securely with 0-silk retention sutures. Insertion site dressed with Xeroform petroleum gauze, split drain sponge, and covered with occlusive Hypafix tape. Surrounding chest wall palpated: zero subcutaneous crepitus or emphysema.', options: [
        'Evacuated 220 mL dark sanguinous fluid in first 30 minutes; marked on collection canister with date, military time, and initials. Chest tube sutured securely with 0-silk retention sutures. Insertion site dressed with Xeroform petroleum gauze, split drain sponge, and covered with occlusive Hypafix tape. Surrounding chest wall palpated: zero subcutaneous crepitus or emphysema.',
        'Drainage: 45 mL serosanguinous fluid over 4 hours. Dressing clean, dry, and intact. Mild localized tenderness, zero crepitus.',
        'Drainage: Scant serous fluid (<10 mL/hr). Dressing clean and sealed. Sutures intact.'
      ]},
      { id: 'patientSafetyBedside', label: 'Recovery & Bedside Emergency Equipment', defaultValue: 'Post-procedure portable chest X-ray completed: tube position verified in mid-pleural space with improved lung re-expansion. Vitals: BP 124/76, HR 82, RR 18, SpO2 98% on 2L NC. Breath sounds present bilaterally. Emergency equipment verified at bedside: 2 padded Kelly clamps, bottle of sterile water, and sterile occlusive petrolatum dressing. Tubing coiled straight without dependent loops.', options: [
        'Post-procedure portable chest X-ray completed: tube position verified in mid-pleural space with improved lung re-expansion. Vitals: BP 124/76, HR 82, RR 18, SpO2 98% on 2L NC. Breath sounds present bilaterally. Emergency equipment verified at bedside: 2 padded Kelly clamps, bottle of sterile water, and sterile occlusive petrolatum dressing. Tubing coiled straight without dependent loops.',
        'Patient in semi-Fowler position (30°). Pain controlled with ordered IV analgesia (pain rated 2/10). Bedside clamps and sterile water present. Chest drain canister upright below chest level.',
        'Chest drain canister secured to floor stand below thoracic cavity level. Emergency vaseline gauze taped to head of bed.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Chest tube procedure/care at {time}: {indicationTubeSize}. Baseline pulmonary status evaluated.',
        action: 'System managed: {drainageSetup}. Chamber inspected: {waterSealAirLeak}. Drainage & site: {drainageDressing}. Safety checks: {patientSafetyBedside}.',
        response: 'Drainage system functioning properly with airtight seal. Lung expansion verified. Emergency safety equipment at bedside.',
      },
      soap: {
        subjective: 'Patient reports improved ease of breathing following chest tube placement; surgical site discomfort rated 2/10, managed with ordered analgesia.',
        objective: 'At {time}: {indicationTubeSize}. Drainage Setup: {drainageSetup}. Water Seal / Leak: {waterSealAirLeak}. Drainage & Site: {drainageDressing}. Safety & X-Ray: {patientSafetyBedside}.',
        assessment: 'Chest thoracostomy drainage unit patent and actively evacuating pleural air/fluid; hemodynamically stable without respiratory distress.',
        plan: 'Assess water seal and air leak q2h, record hourly drainage output, maintain canister below chest level, keep emergency clamps/sterile water at bedside.',
      },
      narrative: 'At {time}, chest tube thoracostomy care completed. {indicationTubeSize}. Drainage unit configured: {drainageSetup}. Water seal chamber evaluated: {waterSealAirLeak}. Drainage volume and dressing integrity: {drainageDressing}. Patient status and emergency readiness: {patientSafetyBedside}.',
      concise: 'CHEST TUBE MANAGEMENT & DRAINAGE NOTE ({time}):\n• Indication & Tube: {indicationTubeSize}\n• System Setup & Suction: {drainageSetup}\n• Water Seal & Air Leak: {waterSealAirLeak}\n• Drainage & Dressing: {drainageDressing}\n• Safety Equipment & X-Ray: {patientSafetyBedside}',
    },
  },

  // 40. PROCEDURE (VASCULAR): Implanted Venous Port (Port-a-Cath) Sterile Access & De-Access
  {
    id: 'vascular-portacath-access',
    title: 'Implanted Venous Port (Port-a-Cath) Access & De-Access',
    category: 'vascular',
    categoryLabel: 'Vascular & Infusions',
    isProcedure: true,
    procedureCategory: 'vascular',
    procedureCategoryLabel: 'Vascular Access & Infusions',
    procedureBadges: ['Sterile Non-Coring Huber', '90° Angle Access', 'Brisk Blood Return', 'Heparin Lock Flush'],
    description: 'Procedure documentation for sterile access, blood sampling, infusion verification, and heparin lock de-access of totally implanted subcutaneous venous access ports (Port-a-Cath / PowerPort), including mask compliance, non-coring needle gauge, flush resistance, BioPatch, and transparent dressing.',
    tags: ['port-a-cath', 'powerport', 'implanted port', 'Huber needle', 'vascular access', 'chemotherapy port', 'heparin lock', 'sterile procedure'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '09:15', options: ['07:30', '09:15', '12:00', '15:30', '18:45'] },
      { id: 'indicationLocation', label: 'Port Location & Pre-Procedure Prep', defaultValue: 'Right upper anterior chest wall subcutaneous implanted venous port accessed for scheduled outpatient intravenous chemotherapy infusion and blood laboratory draws. Port reservoir and septum palpated cleanly: zero erythema, warmth, tenderness, or skin erosion. Patient donned surgical mask and turned head away; nurse donned mask and sterile gloves.', options: [
        'Right upper anterior chest wall subcutaneous implanted venous port accessed for scheduled outpatient intravenous chemotherapy infusion and blood laboratory draws. Port reservoir and septum palpated cleanly: zero erythema, warmth, tenderness, or skin erosion. Patient donned surgical mask and turned head away; nurse donned mask and sterile gloves.',
        'Left infraclavicular PowerPort accessed for STAT contrast CT imaging and hydration. Septum easily localized.',
        'De-accessing right chest wall implanted port following completion of IV antibiotic cycle. Port site intact.'
      ]},
      { id: 'skinPrepAccess', label: 'CHG Skin Prep & Non-Coring Needle Access', defaultValue: 'Skin over port prepped with 2% CHG with 70% IPA applicator using vigorous 30-second friction scrub and allowed to air dry for 2 full minutes. Port stabilized firmly between non-dominant thumb and forefinger. Accessed at strict 90-degree angle with sterile 20-gauge 1.0-inch non-coring safety Huber needle (PowerLoc) until needle gently contacted posterior titanium base plate. Zero needle tilting or rocking.', options: [
        'Skin over port prepped with 2% CHG with 70% IPA applicator using vigorous 30-second friction scrub and allowed to air dry for 2 full minutes. Port stabilized firmly between non-dominant thumb and forefinger. Accessed at strict 90-degree angle with sterile 20-gauge 1.0-inch non-coring safety Huber needle (PowerLoc) until needle gently contacted posterior titanium base plate. Zero needle tilting or rocking.',
        'Prepped with ChloraPrep x 30s friction and dried. Accessed with 22-gauge 0.75-inch safety non-coring needle perpendicularly into center of septum until base plate reached.',
        'Site prepped with povidone-iodine scrub (CHG allergy) allowed to dry 3 minutes. Accessed with 19-gauge power-injectable non-coring needle.'
      ]},
      { id: 'patencyAspirationFlush', label: 'Aspiration, Flush & Blood Sampling', defaultValue: 'Brisk, free-flowing dark venous blood return aspirated with 10 mL syringe effortlessly. Initial 5 mL waste discarded per facility lab protocol; ordered blood specimens drawn without hemolysis. Flushed smoothly with 20 mL preservative-free 0.9% Normal Saline using turbulent pulsatile push-pause technique with zero resistance, leakage, or subcutaneous swelling.', options: [
        'Brisk, free-flowing dark venous blood return aspirated with 10 mL syringe effortlessly. Initial 5 mL waste discarded per facility lab protocol; ordered blood specimens drawn without hemolysis. Flushed smoothly with 20 mL preservative-free 0.9% Normal Saline using turbulent pulsatile push-pause technique with zero resistance, leakage, or subcutaneous swelling.',
        'Immediate brisk blood return obtained. Flushed smoothly with 10 mL NS. IV infusion connected and running freely via gravity / pump without alarms.',
        'De-access procedure: Flushed with 20 mL sterile NS followed by 5 mL Heparin sodium lock solution (100 units/mL).'
      ]},
      { id: 'dressingHeparinDeaccess', label: 'Securement, Dressing or Heparin Lock', defaultValue: 'Chlorhexidine gluconate impregnated sponge (BioPatch) placed blue-side up beneath needle wings. Stabilized with sterile transparent occlusive dressing (Tegaderm 3M) dated and initialed. When de-accessing: port locked with 5 mL Heparin sodium lock solution (100 units/mL) clamped under positive pressure while simultaneously withdrawing Huber needle with safety shield locked. Spot bandage applied.', options: [
        'Chlorhexidine gluconate impregnated sponge (BioPatch) placed blue-side up beneath needle wings. Stabilized with sterile transparent occlusive dressing (Tegaderm 3M) dated and initialed. When de-accessing: port locked with 5 mL Heparin sodium lock solution (100 units/mL) clamped under positive pressure while simultaneously withdrawing Huber needle with safety shield locked. Spot bandage applied.',
        'Sterile transparent occlusive dressing applied over Huber needle and wings. Extension set clamped and labeled with date, gauge, and nurse initials.',
        'De-access completed: Heparin lock 500 units instilled. Port needle withdrawn smoothly while stabilizing base. Site held with sterile gauze; adhesive bandage applied.'
      ]},
      { id: 'patientTolerance', label: 'Patient Tolerance & Education', defaultValue: 'Patient tolerated port access comfortably without acute pain (pain rated 1/10). Re-educated on notifying RN immediately for any chest tightness, burning sensation, or dressing looseness during infusion.', options: [
        'Patient tolerated port access comfortably without acute pain (pain rated 1/10). Re-educated on notifying RN immediately for any chest tightness, burning sensation, or dressing looseness during infusion.',
        'Patient experienced minimal discomfort upon needle puncture; denies shortness of breath or dizziness. Infusion running smoothly.',
        'Port de-accessed without complication. Patient verbalized understanding of keeping site clean and dry for 24 hours.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Port-a-Cath access/care at {time}: {indicationLocation}. Site inspected.',
        action: 'Sterile access performed: {skinPrepAccess}. Patency verified: {patencyAspirationFlush}. Dressing / lock: {dressingHeparinDeaccess}.',
        response: '{patientTolerance}. Blood return confirmed, infusion patent without infiltration.',
      },
      soap: {
        subjective: 'Patient reports port feels comfortable; denies pain, swelling, or burning around reservoir.',
        objective: 'At {time}: {indicationLocation}. Prep & Access: {skinPrepAccess}. Patency: {patencyAspirationFlush}. Securement: {dressingHeparinDeaccess}. Tolerance: {patientTolerance}.',
        assessment: 'Implanted venous access port accessed under sterile technique; brisk blood return verified, no signs of local infection or mechanical occlusion.',
        plan: 'Maintain sterile dressing, flush with NS between medications, instil Heparin lock (100 units/mL) upon de-access per protocol.',
      },
      narrative: 'At {time}, implanted venous access port procedure completed. {indicationLocation}. Sterile preparation and non-coring access: {skinPrepAccess}. Venous blood aspiration and pulsatile flush: {patencyAspirationFlush}. Dressing application and securement: {dressingHeparinDeaccess}. {patientTolerance}.',
      concise: 'IMPLANTED PORT (PORT-A-CATH) ACCESS NOTE ({time}):\n• Location & Indication: {indicationLocation}\n• Prep & Huber Needle: {skinPrepAccess}\n• Patency & Blood Return: {patencyAspirationFlush}\n• Dressing / Heparin Lock: {dressingHeparinDeaccess}\n• Tolerance & Response: {patientTolerance}',
    },
  },

  // 41. CARDIAC: Synchronized Cardioversion Assist
  {
    id: 'cardiac-cardioversion-assist',
    title: 'Synchronized Cardioversion Assist & Rhythm Conversion',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    isProcedure: true,
    procedureCategory: 'cardiac',
    procedureCategoryLabel: 'Cardiac & Interventional',
    procedureBadges: ['Cardiac Assist', 'ACLS Synchronized', 'Procedural Sedation'],
    description: 'Documentation for elective or urgent synchronized electrical cardioversion, pad placement, sync mode verification, procedural sedation, energy delivery, and post-rhythm recovery.',
    tags: ['cardiac', 'cardioversion', 'synchronized', 'defibrillator', 'afib', 'flutter', 'sedation', 'rhythm', 'procedure'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '10:15', type: 'text' },
      { id: 'indicationRhythm', label: 'Indication & Pre-Procedure Rhythm', defaultValue: 'Symptomatic Atrial Fibrillation with rapid ventricular response (RVR) at 164 bpm. Patient reports palpitations and lightheadedness; BP 98/62 mmHg. Attending Physician: Dr. Martinez.', options: [
        'Symptomatic Atrial Fibrillation with rapid ventricular response (RVR) at 164 bpm. Patient reports palpitations and lightheadedness; BP 98/62 mmHg. Attending Physician: Dr. Martinez.',
        'Atrial Flutter with 2:1 AV block at 150 bpm, refractory to IV rate control agents. Physician: Dr. Chen.',
        'Monomorphic Ventricular Tachycardia (VT) with palpable femoral/radial pulses at 178 bpm, mentating, BP 92/58 mmHg. Emergency cardioversion indicated.',
        'Supraventricular Tachycardia (SVT) at 192 bpm unresponsive to Valsalva maneuvers and IV Adenosine x 2 doses.'
      ]},
      { id: 'prepSafety', label: 'Defibrillator Setup, Sync Mode & Airway Readiness', defaultValue: 'Multifunction hands-free defibrillator pads placed in anteroposterior configuration (anterior sternum and left infrascapular). Defibrillator switched to SYNCHRONIZED mode; sync markers confirmed actively flagging every QRS/R-wave on ECG monitor. Wall suction tested and functional; bag-valve-mask (BVM) with 100% O2 flow and emergency airway cart stationed at bedside.', options: [
        'Multifunction hands-free defibrillator pads placed in anteroposterior configuration (anterior sternum and left infrascapular). Defibrillator switched to SYNCHRONIZED mode; sync markers confirmed actively flagging every QRS/R-wave on ECG monitor. Wall suction tested and functional; bag-valve-mask (BVM) with 100% O2 flow and emergency airway cart stationed at bedside.',
        'Multifunction pads placed in anterolateral position (right upper sternal border and left anterior axillary line 5th ICS). SYNCHRONIZED mode confirmed with sync dots on all R waves. BVM, oral airway, and suction ready at bedside.',
        'Anteroposterior pad placement. Defibrillator synchronized mode verified with audible R-wave beep. Supplemental O2 delivered via nasal cannula at 3 L/min; removed during shock discharge.'
      ]},
      { id: 'sedationDelivered', label: 'Procedural Sedation & Time-Out', defaultValue: 'Universal Protocol Time-Out conducted with procedural team. Moderate procedural sedation administered by Dr. Martinez: IV Midazolam 2 mg and IV Fentanyl 50 mcg over 2 minutes. Patient achieved Ramsay Sedation Score 4 (eyes closed, responds promptly to verbal command). Spontaneous respirations maintained; baseline SpO2 99%.', options: [
        'Universal Protocol Time-Out conducted with procedural team. Moderate procedural sedation administered by Dr. Martinez: IV Midazolam 2 mg and IV Fentanyl 50 mcg over 2 minutes. Patient achieved Ramsay Sedation Score 4 (eyes closed, responds promptly to verbal command). Spontaneous respirations maintained; baseline SpO2 99%.',
        'Time-Out completed. Anesthesia provider administered IV Etomidate 10 mg; patient reached adequate depth of sedation with loss of eyelash reflex. Bag-valve-mask ventilatory assistance ready.',
        'Universal Time-Out verified. IV Propofol 50 mg administered by credentialed physician; patient asleep, breathing spontaneously with supplemental O2 via simple mask.',
        'Patient hemodynamically unstable; synchronized cardioversion executed immediately without delay for full sedation per ACLS protocol with physician order.'
      ]},
      { id: 'shockDeliveryEnergy', label: 'Shock Delivery, Energy & Rhythm Conversion', defaultValue: 'All clear called and visual 360-degree sweep confirmed. Shock #1 delivered at 100 Joules biphasic synchronized on R-wave. Defibrillator discharged without artifact. Rhythm immediately converted to Normal Sinus Rhythm (NSR) at 74 bpm with distinct P waves and narrow QRS complexes.', options: [
        'All clear called and visual 360-degree sweep confirmed. Shock #1 delivered at 100 Joules biphasic synchronized on R-wave. Defibrillator discharged without artifact. Rhythm immediately converted to Normal Sinus Rhythm (NSR) at 74 bpm with distinct P waves and narrow QRS complexes.',
        'All clear verified. Shock #1 delivered at 100 Joules; rhythm persisted in AFib. Sync mode re-engaged; Shock #2 delivered at 200 Joules biphasic, successfully converting rhythm to Normal Sinus Rhythm at 80 bpm.',
        'Clearance verified. Shock #1 delivered at 50 Joules biphasic for Atrial Flutter; immediate conversion to Sinus Bradycardia at 58 bpm, hemodynamically stable.',
        'Synchronized shock delivered at 150 Joules biphasic. Rhythm converted to Sinus Tachycardia at 102 bpm; palpable strong radial pulses.'
      ]},
      { id: 'postCareTolerance', label: 'Post-Shock Vitals, Recovery & Skin Assessment', defaultValue: 'Post-procedure vitals stable: BP 122/74 mmHg, HR 74 bpm sinus rhythm, SpO2 98% on 2 L NC, RR 16 bpm. Airway patent without stridor or apnea. Patient aroused readily, oriented x 4, denies chest discomfort or recall of shock. Multifunction pads removed; skin underneath inspected: clean, intact without erythema, blistering, or electrical burns. Post-procedure 12-lead ECG completed.', options: [
        'Post-procedure vitals stable: BP 122/74 mmHg, HR 74 bpm sinus rhythm, SpO2 98% on 2 L NC, RR 16 bpm. Airway patent without stridor or apnea. Patient aroused readily, oriented x 4, denies chest discomfort or recall of shock. Multifunction pads removed; skin underneath inspected: clean, intact without erythema, blistering, or electrical burns. Post-procedure 12-lead ECG completed.',
        'Vital signs q5m x 4: BP 118/70, HR 82 NSR, SpO2 99% on room air. Sedation score returned to Ramsay 2 (cooperative, oriented). Skin under pads pale, intact. Post-cardioversion 12-lead ECG confirmed sinus rhythm.',
        'Patient recovered to baseline cognitive function. Denies palpitations or lightheadedness. Continuous telemetry monitored. Oral intake withheld until fully alert and swallow screen passed.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Synchronized cardioversion assist at {time}: {indicationRhythm}. Defibrillator setup: {prepSafety}.',
        action: 'Procedural sedation and time-out: {sedationDelivered}. Energy discharge: {shockDeliveryEnergy}.',
        response: '{postCareTolerance}. Continuous cardiac telemetry active; 12-lead ECG documented.',
      },
      soap: {
        subjective: 'Patient reports feeling palpitations prior to procedure; following cardioversion, states palpitations have resolved and denies chest pain or discomfort.',
        objective: 'At {time}: {indicationRhythm}. Setup & sync mode: {prepSafety}. Sedation: {sedationDelivered}. Energy delivery & rhythm response: {shockDeliveryEnergy}. Post-procedure assessment: {postCareTolerance}.',
        assessment: 'Successful synchronized electrical cardioversion with immediate conversion to sinus rhythm; hemodynamic stability restored without procedural complications.',
        plan: 'Continuous telemetry monitoring, post-procedure vitals q15m x 4 then q1h, follow up repeat 12-lead ECG, maintain IV access, restart maintenance anticoagulation/antiarrhythmic as ordered.',
      },
      narrative: 'At {time}, assisted physician with synchronized cardioversion. {indicationRhythm}. Pre-procedure safety setup: {prepSafety}. Procedural sedation and verification: {sedationDelivered}. Shock delivery: {shockDeliveryEnergy}. Recovery and evaluation: {postCareTolerance}.',
      concise: 'SYNCHRONIZED CARDIOVERSION ASSIST ({time}):\n• Indication & Rhythm: {indicationRhythm}\n• Sync Setup & Airway Safety: {prepSafety}\n• Sedation & Time-Out: {sedationDelivered}\n• Energy Delivery & Conversion: {shockDeliveryEnergy}\n• Post-Shock Recovery & Skin: {postCareTolerance}',
    },
  },

  // 42. CARDIAC: Transesophageal Echocardiogram (TEE) Assist
  {
    id: 'cardiac-tee-assist',
    title: 'Transesophageal Echocardiogram (TEE) Assist & Moderate Sedation',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    isProcedure: true,
    procedureCategory: 'cardiac',
    procedureCategoryLabel: 'Cardiac & Interventional',
    procedureBadges: ['Cardiac Imaging', 'Moderate Sedation', 'Pharyngeal Safety'],
    description: 'Nursing documentation for assisting during transesophageal echocardiography, pharyngeal topicalization, bite block placement, sedation monitoring, and post-procedure gag reflex recovery.',
    tags: ['cardiac', 'tee', 'echocardiogram', 'ultrasound', 'sedation', 'swallow', 'npo', 'procedure'],
    fields: [
      { id: 'time', label: 'Procedure Time', defaultValue: '11:00', type: 'text' },
      { id: 'indicationPreCheck', label: 'Indication, NPO Status & Dentition Exam', defaultValue: 'Evaluation of left atrial appendage (LAA) thrombus prior to planned cardioversion. Verified NPO since 00:00 (>8 hours). Pre-procedure oral cavity inspected: zero loose teeth or dentures; partial plates removed and secured. Baseline Mallampati Class II airway. Attending Cardiologist: Dr. Chen.', options: [
        'Evaluation of left atrial appendage (LAA) thrombus prior to planned cardioversion. Verified NPO since 00:00 (>8 hours). Pre-procedure oral cavity inspected: zero loose teeth or dentures; partial plates removed and secured. Baseline Mallampati Class II airway. Attending Cardiologist: Dr. Chen.',
        'Evaluation for suspected infective endocarditis with aortic/mitral valve vegetation and regurgitant flow. NPO verified >6 hours. Dentures removed; baseline dentition intact.',
        'Evaluation of prosthetic mitral valve function and paravalvular leak. NPO verified since midnight. Oral exam negative for loose dentition.',
        'Cryptogenic stroke workup to rule out patent foramen ovale (PFO) / cardiac source of embolus with agitated saline contrast bubble study. NPO status confirmed.'
      ]},
      { id: 'timeOutPrep', label: 'Universal Time-Out, Pharyngeal Spray & Bite Block', defaultValue: 'Universal Protocol Time-Out conducted. Pharyngeal mucosa anesthetized with topical Cetacaine spray (1-second burst directed at posterior pharynx) followed by 2% viscous lidocaine gargle. Soft plastic protective bite block placed between dental arches and secured snugly with elastic head strap.', options: [
        'Universal Protocol Time-Out conducted. Pharyngeal mucosa anesthetized with topical Cetacaine spray (1-second burst directed at posterior pharynx) followed by 2% viscous lidocaine gargle. Soft plastic protective bite block placed between dental arches and secured snugly with elastic head strap.',
        'Time-Out completed. Pharynx numbed using 4% lidocaine aerosolized spray x 2 applications. Bite block inserted with patent central lumen for probe passage; secured comfortably.',
        'Universal Time-Out verified. 10% lidocaine pump spray applied to posterior pharyngeal wall; patient reported sensation of pharyngeal numbness and difficulty swallowing. Bite block positioned.'
      ]},
      { id: 'sedationMonitoring', label: 'Procedural Sedation & Continuous Monitoring', defaultValue: 'Moderate procedural sedation administered per physician order: IV Midazolam 2.5 mg and IV Fentanyl 50 mcg titrated slowly. Supplemental O2 delivered via nasal cannula with end-tidal CO2 (EtCO2) sampling at 3 L/min. Continuous ECG telemetry, SpO2 (98-100%), EtCO2 (34-38 mmHg), and automated blood pressure q5m monitored.', options: [
        'Moderate procedural sedation administered per physician order: IV Midazolam 2.5 mg and IV Fentanyl 50 mcg titrated slowly. Supplemental O2 delivered via nasal cannula with end-tidal CO2 (EtCO2) sampling at 3 L/min. Continuous ECG telemetry, SpO2 (98-100%), EtCO2 (34-38 mmHg), and automated blood pressure q5m monitored.',
        'Sedation administered by anesthesia provider: IV Propofol infusion titrated to Ramsay Sedation Score 3-4. Airway maintained patent with jaw thrust; SpO2 99% on 4 L NC.',
        'IV Midazolam 2 mg administered. Patient relaxed and cooperative, responding to verbal prompts. Hemodynamics remained stable throughout: BP 124/76 to 118/72 mmHg, HR 70-78 bpm NSR.'
      ]},
      { id: 'probeToleranceFindings', label: 'Probe Insertion, Tolerance & Removal', defaultValue: 'Multiplane TEE ultrasound probe lubricated generously with sterile water-soluble gel. Probe introduced into posterior pharynx and passed smoothly into esophagus upon guided deglutition. Patient tolerated probe passage without coughing, gagging, or vagal bradycardia. Comprehensive 2D/Doppler imaging completed. Probe safely withdrawn at 11:22; tip inspected: clean, zero bloody secretions or mucosal trauma.', options: [
        'Multiplane TEE ultrasound probe lubricated generously with sterile water-soluble gel. Probe introduced into posterior pharynx and passed smoothly into esophagus upon guided deglutition. Patient tolerated probe passage without coughing, gagging, or vagal bradycardia. Comprehensive 2D/Doppler imaging completed. Probe safely withdrawn at 11:22; tip inspected: clean, zero bloody secretions or mucosal trauma.',
        'TEE probe advanced into mid-esophagus without resistance. Agitated saline bubble study performed via right forearm PIV. Zero desaturations or dysrhythmias. Probe gently removed; bite block removed. Oral cavity suctioned of clear secretions.',
        'Probe advanced under direct visualization; diagnostic transgastric and mid-esophageal views acquired. Patient tolerated 18-minute scan duration comfortably. Probe removed smoothly with zero tissue trauma.'
      ]},
      { id: 'postCareGagReflex', label: 'Post-Sedation Recovery, Aldrete & NPO Gag Reflex', defaultValue: 'Patient positioned in Semi-Fowler\'s recovery position. Sedation score returned to baseline (Ramsay 2; alert and oriented x 4). Post-procedure Aldrete score 10/10. Vitals stable: BP 126/78 mmHg, HR 72 bpm NSR, SpO2 98% on room air, RR 16 bpm. STRICTLY NPO MAINTAINED until pharyngeal gag reflex verified with tongue depressor (anticipated in 60-90 minutes). Denies neck pain, dysphagia, or hemoptysis.', options: [
        'Patient positioned in Semi-Fowler\'s recovery position. Sedation score returned to baseline (Ramsay 2; alert and oriented x 4). Post-procedure Aldrete score 10/10. Vitals stable: BP 126/78 mmHg, HR 72 bpm NSR, SpO2 98% on room air, RR 16 bpm. STRICTLY NPO MAINTAINED until pharyngeal gag reflex verified with tongue depressor (anticipated in 60-90 minutes). Denies neck pain, dysphagia, or hemoptysis.',
        'Patient recovered in PACU/procedure recovery. Vitals q15m stable. Strictly NPO status maintained. Patient instructed not to eat or drink anything until gag reflex assessed by RN. Dentures re-inserted upon full alert recovery.',
        'Post-procedure gag reflex verified active at 12:45 using sterile tongue blade; small sips of water tolerated without coughing or choking. Mild throat scratchiness noted, no active bleeding. Discharged to unit.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Transesophageal Echocardiogram assist at {time}: {indicationPreCheck}. Pharyngeal prep: {timeOutPrep}.',
        action: 'Sedation and monitoring: {sedationMonitoring}. Probe execution: {probeToleranceFindings}.',
        response: '{postCareGagReflex}. Post-sedation recovery monitored; gag reflex protocol enforced.',
      },
      soap: {
        subjective: 'Patient reports pharyngeal numbness from spray; denies chest pain, shortness of breath, or esophageal distress.',
        objective: 'At {time}: {indicationPreCheck}. Universal Time-Out & Pharyngeal Prep: {timeOutPrep}. Sedation: {sedationMonitoring}. Probe Tolerance: {probeToleranceFindings}. Recovery: {postCareGagReflex}.',
        assessment: 'Diagnostic TEE completed without procedural trauma or desaturation; patient recovering from moderate sedation with stable hemodynamics.',
        plan: 'Maintain strict NPO until pharyngeal anesthesia wears off and gag reflex is confirmed; post-procedure vital signs q15m x 4; report findings to attending physician.',
      },
      narrative: 'At {time}, assisted with diagnostic transesophageal echocardiogram. {indicationPreCheck}. Time-Out and topical anesthesia: {timeOutPrep}. Procedural sedation: {sedationMonitoring}. Ultrasound probe passage and tolerance: {probeToleranceFindings}. Post-procedure recovery and gag reflex status: {postCareGagReflex}.',
      concise: 'TEE ASSIST NOTE ({time}):\n• Indication & Pre-Check: {indicationPreCheck}\n• Time-Out & Pharyngeal Prep: {timeOutPrep}\n• Sedation & Hemodynamics: {sedationMonitoring}\n• Probe Passage & Scan: {probeToleranceFindings}\n• Post-Care & Gag Reflex: {postCareGagReflex}',
    },
  },

  // 43. CARDIAC: Pre-Coronary Angiogram Care
  {
    id: 'cardiac-pre-angiogram',
    title: 'Pre-Coronary Angiogram & Cath Lab Verification Checklist',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    isProcedure: true,
    procedureCategory: 'cardiac',
    procedureCategoryLabel: 'Cardiac & Interventional',
    procedureBadges: ['Cath Lab Prep', "Allen's Test Baseline", 'Contrast Safety'],
    description: 'Pre-procedure nursing checklist and documentation for coronary angiography / cardiac catheterization, including consent, NPO status, renal function, contrast allergy, Allen\'s test, and baseline neurovascular pulses.',
    tags: ['cardiac', 'angiogram', 'cath-lab', 'pre-op', 'contrast', 'allen-test', 'renal', 'procedure'],
    fields: [
      { id: 'time', label: 'Preparation Time', defaultValue: '07:30', type: 'text' },
      { id: 'indicationConsentNPO', label: 'Clinical Indication, Consent & NPO Status', defaultValue: 'Elective coronary angiography / left heart catheterization for unstable angina and ischemic ECG changes. Procedural informed consent verified signed and witnessed in medical record. Strictly NPO verified since 00:00 (>7 hours). Attending Interventionalist: Dr. Kowalski.', options: [
        'Elective coronary angiography / left heart catheterization for unstable angina and ischemic ECG changes. Procedural informed consent verified signed and witnessed in medical record. Strictly NPO verified since 00:00 (>7 hours). Attending Interventionalist: Dr. Kowalski.',
        'Urgent coronary angiogram for NSTEMI with peak troponin elevation. Consent obtained and placed in chart. NPO verified >6 hours.',
        'Pre-operative cardiac clearance catheterization prior to scheduled aortic valve replacement. Consent verified; NPO since midnight.',
        'Emergent catheterization activation (STEMI pathway) for ST elevations in inferior leads. Emergent consent verified per institutional protocol.'
      ]},
      { id: 'allergyRenalCheck', label: 'Radiocontrast Allergy & Baseline Renal Labs', defaultValue: 'Screened for allergies: zero known allergy to iodinated radiocontrast media, shellfish, iodine, or latex. Renal function panel reviewed: BUN 15 mg/dL, Serum Creatinine 0.88 mg/dL, eGFR >60 mL/min/1.73m2. Pre-hydration running: IV 0.9% Normal Saline infusing at 100 mL/hr per protocol to reduce contrast nephropathy risk.', options: [
        'Screened for allergies: zero known allergy to iodinated radiocontrast media, shellfish, iodine, or latex. Renal function panel reviewed: BUN 15 mg/dL, Serum Creatinine 0.88 mg/dL, eGFR >60 mL/min/1.73m2. Pre-hydration running: IV 0.9% Normal Saline infusing at 100 mL/hr per protocol to reduce contrast nephropathy risk.',
        'History of mild contrast reaction (urticaria); pre-medication steroid and antihistamine protocol completed: Prednisone 50 mg PO at 13h, 7h, and 1h pre-procedure, and Diphenhydramine 50 mg IV administered. Creatinine 1.1 mg/dL.',
        'Chronic kidney disease Stage 3: baseline Creatinine 1.6 mg/dL, eGFR 42 mL/min. Pre-hydration protocol running with IV isotonic sodium bicarbonate at 150 mL/hr. Contrast volume conservation noted on Cath Lab order.',
        'Renal labs verified within normal limits (BUN 12, Cr 0.79). No radiocontrast allergies reported. IV hydration established.'
      ]},
      { id: 'anticoagulantMetforminStatus', label: 'Anticoagulant, Antiplatelet & Metformin Status', defaultValue: 'Metformin held morning of procedure; patient instructed to withhold medication for 48 hours post-procedure until repeat renal labs confirmed stable. Aspirin 81 mg and Clopidogrel 600 mg loading dose administered at 06:00 as ordered. Morning PT 12.0s, INR 1.0, aPTT 28s. Warfarin/DOAC held per protocol.', options: [
        'Metformin held morning of procedure; patient instructed to withhold medication for 48 hours post-procedure until repeat renal labs confirmed stable. Aspirin 81 mg and Clopidogrel 600 mg loading dose administered at 06:00 as ordered. Morning PT 12.0s, INR 1.0, aPTT 28s. Warfarin/DOAC held per protocol.',
        'Patient not on oral hypoglycemics or Metformin. Eliquis (Apixaban) held for 48 hours prior to procedure. Platelet count 240,000/mcL. Antiplatelet therapy verified.',
        'Warfarin held x 5 days; morning POC INR 1.1 (within target <1.5 for femoral/radial access). Aspirin 324 mg given pre-procedure.',
        'Heparin infusion discontinued 2 hours prior to Cath Lab transfer per protocol. PTT drawn and reported.'
      ]},
      { id: 'baselineNeurovascularExam', label: "Baseline Pulses & Allen's / Barbeau Test", defaultValue: "Modified Allen's test positive bilaterally: ulnar collateral circulation confirmed with rapid palmar reperfusion in <4 seconds upon release. Baseline radial pulses strong (+2/2) bilaterally. Bilateral dorsalis pedis and posterior tibial pulses palpable (+2/2) and marked with indelible surgical marker. Extremities warm, dry, capillary refill <2 seconds. Sensation and motor function fully intact.", options: [
        "Modified Allen's test positive bilaterally: ulnar collateral circulation confirmed with rapid palmar reperfusion in <4 seconds upon release. Baseline radial pulses strong (+2/2) bilaterally. Bilateral dorsalis pedis and posterior tibial pulses palpable (+2/2) and marked with indelible surgical marker. Extremities warm, dry, capillary refill <2 seconds. Sensation and motor function fully intact.",
        "Right radial artery planned access: Allen's test demonstrated brisk refill at 3 seconds. Right radial pulse palpable +2/2. Both feet warm and pink; pedal pulses +2/2 bilaterally and marked.",
        "Femoral access anticipated: Bilateral femoral, popliteal, dorsalis pedis, and posterior tibial pulses assessed, graded +2/2, and marked with skin marker. Allen's test also verified normal as radial backup.",
        "Allen's test verified patent ulnar collateral blood flow in right wrist. Bilateral upper and lower extremity baseline neurovascular exam intact."
      ]},
      { id: 'prepLinesTransfer', label: 'Access Site Prep, Pre-Op Checklist & Cath Transfer', defaultValue: '20-gauge peripheral IV patent in left forearm (non-procedure arm) with NS infusing. Right wrist and bilateral inguinal regions prepped and clipped per protocol. Patient voided 280 mL clear urine. Dentures, hearing aids, jewelry, and glasses removed and safely stored. Pre-cath checklist 100% verified. Transferred to Cardiac Cath Lab via stretcher on portable telemetry accompanied by RN.', options: [
        '20-gauge peripheral IV patent in left forearm (non-procedure arm) with NS infusing. Right wrist and bilateral inguinal regions prepped and clipped per protocol. Patient voided 280 mL clear urine. Dentures, hearing aids, jewelry, and glasses removed and safely stored. Pre-cath checklist 100% verified. Transferred to Cardiac Cath Lab via stretcher on portable telemetry accompanied by RN.',
        '18G peripheral IV confirmed patent in left antecubital fossa. Pre-procedure 12-lead ECG completed and placed in paper chart. Patient voided prior to transfer. Transported via gurney with continuous telemetry.',
        'Bilateral groins shaved with surgical clippers and prepped. Checklist complete; patient verbalizes understanding of procedure and expected recovery bedrest.',
        'Cath Lab transfer initiated. Baseline vitals: BP 132/78 mmHg, HR 68 bpm NSR, RR 16 bpm, SpO2 99% on room air. SBAR handoff provided to Cath Lab receiving nurse.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Pre-coronary angiogram preparation at {time}: {indicationConsentNPO}. Contrast allergy & renal review: {allergyRenalCheck}. Metformin/anticoagulant: {anticoagulantMetforminStatus}.',
        action: 'Baseline neurovascular assessment and Allen\'s test: {baselineNeurovascularExam}. Line placement and prep: {prepLinesTransfer}.',
        response: 'Pre-cath checklist complete without discrepancies. Patient transferred to Cath Lab in stable condition.',
      },
      soap: {
        subjective: 'Patient verbalizes understanding of coronary angiography procedure, confirms NPO status since midnight, and denies chest pain or shortness of breath currently.',
        objective: 'At {time}: {indicationConsentNPO}. Allergies & Renal: {allergyRenalCheck}. Med status: {anticoagulantMetforminStatus}. Baseline Neurovascular: {baselineNeurovascularExam}. Lines & Transfer: {prepLinesTransfer}.',
        assessment: 'Patient prepared for cardiac catheterization; informed consent on file, baseline neurovascular exam documented, contrast allergy and renal clearance verified.',
        plan: 'Transfer to Cardiac Cath Lab with telemetry monitoring; deliver comprehensive SBAR handoff to procedure nurse; resume post-cath recovery protocol upon return.',
      },
      narrative: 'At {time}, completed pre-procedure cardiac catheterization preparation. {indicationConsentNPO}. Contrast allergy and renal evaluation: {allergyRenalCheck}. Medication hold and anticoagulant review: {anticoagulantMetforminStatus}. Baseline vascular pulses and Allen\'s collateral circulation test: {baselineNeurovascularExam}. Final checklist and transfer: {prepLinesTransfer}.',
      concise: 'PRE-ANGIOGRAM CATH LAB CHECKLIST ({time}):\n• Indication & Consent/NPO: {indicationConsentNPO}\n• Contrast Allergy & Renal Labs: {allergyRenalCheck}\n• Anticoagulant & Metformin Status: {anticoagulantMetforminStatus}\n• Baseline Pulses & Allen\'s Test: {baselineNeurovascularExam}\n• Pre-Op Lines & Transfer: {prepLinesTransfer}',
    },
  },

  // 44. CARDIAC: Post-Coronary Angiogram Care & TR Band Recovery
  {
    id: 'cardiac-post-angiogram',
    title: 'Post-Coronary Angiogram Care & TR Band Recovery Protocol',
    category: 'routine',
    categoryLabel: 'Routine & Assessments',
    isProcedure: true,
    procedureCategory: 'cardiac',
    procedureCategoryLabel: 'Cardiac & Interventional',
    procedureBadges: ['Cath Recovery', 'TR Band Protocol', 'Neurovascular Q15M'],
    description: 'Post-cardiac catheterization nursing care, radial TR Band patent hemostasis protocol, femoral sheath/closure device site surveillance, distal neurovascular pulse checks, and post-contrast hydration.',
    tags: ['cardiac', 'angiogram', 'cath-lab', 'tr-band', 'femoral', 'hematoma', 'neurovascular', 'procedure'],
    fields: [
      { id: 'time', label: 'Post-Procedure Time', defaultValue: '12:00', type: 'text' },
      { id: 'accessSiteClosure', label: 'Access Site, Hemostatic Device & Dressing', defaultValue: 'Right radial artery access site. Terumo TR Band compression device in place with 14 mL air instilled upon arrival from Cath Lab. Insertion puncture site clean, dry, zero active bleeding, hematoma, or ecchymosis. Surrounding tissue soft and non-tender.', options: [
        'Right radial artery access site. Terumo TR Band compression device in place with 14 mL air instilled upon arrival from Cath Lab. Insertion puncture site clean, dry, zero active bleeding, hematoma, or ecchymosis. Surrounding tissue soft and non-tender.',
        'Right femoral artery access site: Angio-Seal vascular closure device deployed in Cath Lab. Sterile transparent pressure dressing intact over right groin; site flat, soft, non-tender, zero hematoma or bruit.',
        'Right radial artery: PreludeSYNC compression device with 12 mL air in cuff. Site dressing dry and intact; zero bleeding or swelling noted.',
        'Left femoral artery: manual compression held x 20 minutes following sheath pull. Sterile pressure dressing in place with 5-lb sandbag applied for 1 hour. Site dry without hematoma.'
      ]},
      { id: 'neurovascularChecks', label: 'Distal Neurovascular Checks of Access Limb', defaultValue: 'Right upper extremity neurovascular checks: Right radial and ulnar pulses palpable (+2/2) with continuous Barbeau plethysmography confirming patent hemostasis. Right hand and fingers warm, pink, capillary refill <2 seconds. Sensation and active motor flexion/extension intact; denies numbness, tingling, or pain.', options: [
        'Right upper extremity neurovascular checks: Right radial and ulnar pulses palpable (+2/2) with continuous Barbeau plethysmography confirming patent hemostasis. Right hand and fingers warm, pink, capillary refill <2 seconds. Sensation and active motor flexion/extension intact; denies numbness, tingling, or pain.',
        'Right lower extremity neurovascular checks: Right dorsalis pedis and posterior tibial pulses strong (+2/2) palpable at marked sites. Right foot warm, pink, brisk capillary refill <2 seconds. Sensation intact; denies paresthesias or calf pain.',
        'Distal extremity warm and well-perfused. Palpable distal pulse +2/2. Capillary refill 1.5 seconds. Patient can wiggle fingers/toes without deficit.',
        'Radial pulse palpable distal to TR band. Thumb and finger oximetry confirms adequate perfusion index (SpO2 99% with crisp pleth waveform).'
      ]},
      { id: 'hemostasisProtocolBedrest', label: 'Scheduled Decompression Protocol & Positioning', defaultValue: 'TR Band patent hemostasis protocol active: scheduled to withdraw 3 mL air every 15 minutes starting at 14:00 (after initial 2-hour hold) provided zero bleeding occurs. Right wrist immobilized in neutral position; patient educated not to flex wrist or push/pull with right arm.', options: [
        'TR Band patent hemostasis protocol active: scheduled to withdraw 3 mL air every 15 minutes starting at 14:00 (after initial 2-hour hold) provided zero bleeding occurs. Right wrist immobilized in neutral position; patient educated not to flex wrist or push/pull with right arm.',
        'Strict flat supine bedrest maintained with right leg immobilized straight for 4 hours (until 16:00). Head of bed maintained at <=30 degrees. Patient educated not to bend affected knee or raise head.',
        'TR Band deflation completed per protocol: 3 mL air removed q15m x 4 with zero oozing; device removed at 14:30. Adhesive spot bandage applied. Wrist movement permitted without strenuous lifting.',
        'Femoral bedrest protocol in progress: strict supine positioning x 6 hours. Call light within reach; instructed to notify RN immediately for any warm wet sensation or sudden flank/back pain.'
      ]},
      { id: 'vitalSignsMonitoring', label: 'Vitals Monitoring & Complication Surveillance', defaultValue: 'Post-procedure vitals and site checks completed: q15m x 4 (1st hour), scheduled for q30m x 2, then q1h x 4. Current vitals: BP 124/76 mmHg, HR 68 bpm NSR, RR 16 bpm, SpO2 99% on room air. Zero signs of retroperitoneal bleeding (denies back pain, flank pain, or unexplained hypotension). Zero vagal episodes.', options: [
        'Post-procedure vitals and site checks completed: q15m x 4 (1st hour), scheduled for q30m x 2, then q1h x 4. Current vitals: BP 124/76 mmHg, HR 68 bpm NSR, RR 16 bpm, SpO2 99% on room air. Zero signs of retroperitoneal bleeding (denies back pain, flank pain, or unexplained hypotension). Zero vagal episodes.',
        'Vitals stable: BP 118/72 mmHg, HR 72 bpm, SpO2 98%. Puncture site inspected q15m: remains flat and soft without expansile mass or bruit on auscultation.',
        'Post-cath vitals q15m stable. Patient denies chest pain, palpitations, or shortness of breath. Telemetry shows normal sinus rhythm without ischemic ST shifts.'
      ]},
      { id: 'hydrationRenalClearance', label: 'Post-Contrast Hydration & Urine Output', defaultValue: 'IV 0.9% Normal Saline infusing at 125 mL/hr to promote radiocontrast renal excretion. Encouraged oral fluid intake; patient consumed 350 mL water. Voided 400 mL clear amber urine at 13:15. Urine output monitored (>30 mL/hr target). Patient re-educated on holding Metformin for 48 hours.', options: [
        'IV 0.9% Normal Saline infusing at 125 mL/hr to promote radiocontrast renal excretion. Encouraged oral fluid intake; patient consumed 350 mL water. Voided 400 mL clear amber urine at 13:15. Urine output monitored (>30 mL/hr target). Patient re-educated on holding Metformin for 48 hours.',
        'Post-procedure hydration ongoing: IV fluids running at 100 mL/hr. Patient drinking oral fluids freely. Spontaneous void of 300 mL clear yellow urine documented.',
        'Intravenous hydration maintained. Intake & Output monitored closely. Patient educated on reporting decreased urination or cloudy urine over next 48 hours.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Post-coronary angiogram recovery at {time}: {accessSiteClosure}. Neurovascular baseline: {neurovascularChecks}.',
        action: 'Hemostasis management & positioning: {hemostasisProtocolBedrest}. Hydration and renal flush: {hydrationRenalClearance}.',
        response: '{vitalSignsMonitoring}. Puncture site stable, distal pulses palpable, no bleeding or hematoma.',
      },
      soap: {
        subjective: 'Patient reports feeling comfortable in bed; denies chest pain, groin/wrist pain, shortness of breath, dizziness, or back/flank pain.',
        objective: 'At {time}: {accessSiteClosure}. Distal neurovascular: {neurovascularChecks}. Decompression/Bedrest: {hemostasisProtocolBedrest}. Vitals & Complication Screen: {vitalSignsMonitoring}. Renal hydration: {hydrationRenalClearance}.',
        assessment: 'Post-cardiac catheterization recovery proceeding normally; patent hemostasis established at access site with intact distal neurovascular perfusion and stable hemodynamics.',
        plan: 'Continue scheduled post-cath vitals and site checks (q15m, q30m, q1h); execute TR Band air release protocol or complete femoral bedrest; encourage fluids; verify discharge criteria.',
      },
      narrative: 'At {time}, received patient following coronary angiography. {accessSiteClosure}. Distal limb perfusion and neurovascular checks: {neurovascularChecks}. Hemostasis decompression protocol and immobilization: {hemostasisProtocolBedrest}. Vital signs and complication surveillance: {vitalSignsMonitoring}. Post-contrast hydration and urine output: {hydrationRenalClearance}.',
      concise: 'POST-ANGIOGRAM RECOVERY & TR BAND NOTE ({time}):\n• Access Site & Dressing: {accessSiteClosure}\n• Distal Neurovascular Checks: {neurovascularChecks}\n• Decompression / Bedrest Protocol: {hemostasisProtocolBedrest}\n• Vitals & Bleeding Surveillance: {vitalSignsMonitoring}\n• Hydration & Urine Output: {hydrationRenalClearance}',
    },
  },

  // 45. CARDIAC: Acute Chest Pain / ACS Evaluation
  {
    id: 'cardiac-acute-chest-pain',
    title: 'Acute Chest Pain / ACS Evaluation & Rapid Response Protocol',
    category: 'emergency',
    categoryLabel: 'Situational & Emergent',
    isProcedure: true,
    procedureCategory: 'cardiac',
    procedureCategoryLabel: 'Cardiac & Interventional',
    procedureBadges: ['STAT 10-Min ECG', 'PQRST Assessment', 'AHA ACS Protocol'],
    description: 'Comprehensive nursing evaluation for acute chest pain, standardized PQRST assessment, STAT 10-minute 12-lead ECG, cardiac biomarkers, MONA/nitroglycerin protocol, and rapid provider escalation.',
    tags: ['cardiac', 'chest-pain', 'acs', 'stemi', 'pqrst', 'ecg', 'troponin', 'nitroglycerin', 'emergency'],
    fields: [
      { id: 'time', label: 'Pain Onset / Assessment Time', defaultValue: '14:15', type: 'text' },
      { id: 'pqrstAssessment', label: 'Standardized PQRST Pain Assessment', defaultValue: 'Provoked at rest while sitting in chair; denies physical exertion or trauma. Quality described as deep crushing substernal pressure, squeezing sensation like a "heavy weight on chest". Radiating across anterior chest to left jaw, neck, and down inner aspect of left arm. Severity rated 8/10 on 0-10 numeric scale. Timing: acute onset 15 minutes ago, continuous and non-pleuritic.', options: [
        'Provoked at rest while sitting in chair; denies physical exertion or trauma. Quality described as deep crushing substernal pressure, squeezing sensation like a "heavy weight on chest". Radiating across anterior chest to left jaw, neck, and down inner aspect of left arm. Severity rated 8/10 on 0-10 numeric scale. Timing: acute onset 15 minutes ago, continuous and non-pleuritic.',
        'Provoked after ambulating in hallway. Quality described as sharp retrosternal tightness and burning; radiates to left shoulder. Severity 7/10. Timing: sudden onset 10 min ago, constant, partially relieved by resting.',
        'Severe tearing/ripping chest pain radiating directly through to interscapular back region. Severity 10/10. Abrupt onset 5 min ago. (Screened for aortic dissection: bilateral arm BPs obtained).',
        'Substernal heaviness and epigastric fullness rated 6/10; radiates to throat. Unrelieved by position change or oral antacid.'
      ]},
      { id: 'associatedSymptomsVitals', label: 'Associated Symptoms & Initial Vitals', defaultValue: 'Patient visibly anxious, pale, and diaphoretic with cool clammy skin. Reports concurrent shortness of breath and mild nausea; denies vomiting or syncope. Initial vital signs: BP 156/94 mmHg, HR 106 bpm sinus tachycardia, RR 22 bpm, SpO2 93% on room air, Temp 36.9°C.', options: [
        'Patient visibly anxious, pale, and diaphoretic with cool clammy skin. Reports concurrent shortness of breath and mild nausea; denies vomiting or syncope. Initial vital signs: BP 156/94 mmHg, HR 106 bpm sinus tachycardia, RR 22 bpm, SpO2 93% on room air, Temp 36.9°C.',
        'Patient diaphoretic, dizzy, and short of breath. Denies nausea. Vital signs: BP 142/88 mmHg, HR 98 bpm, RR 20 bpm, SpO2 94% on room air.',
        'Severe diaphoresis with greyish skin pallor. Vitals: BP 96/60 mmHg, HR 112 bpm sinus tach, RR 24 bpm, SpO2 91% on room air.',
        'Patient oriented x 4, anxious. Vitals: BP 168/102 mmHg, HR 88 bpm regular, RR 18 bpm, SpO2 96% on room air.'
      ]},
      { id: 'statDiagnostics10Min', label: 'STAT 10-Min 12-Lead ECG & Biomarker Labs', defaultValue: 'STAT 12-lead ECG completed within 6 minutes of symptom onset: shows 2 mm ST-segment depression and T-wave inversion in leads V4-V6; zero ST elevation noted. Continuous 5-lead telemetry active. STAT cardiac panel drawn from right arm: high-sensitivity Troponin I, CK-MB, BMP, CBC, and PT/INR dispatched to lab STAT with priority label.', options: [
        'STAT 12-lead ECG completed within 6 minutes of symptom onset: shows 2 mm ST-segment depression and T-wave inversion in leads V4-V6; zero ST elevation noted. Continuous 5-lead telemetry active. STAT cardiac panel drawn from right arm: high-sensitivity Troponin I, CK-MB, BMP, CBC, and PT/INR dispatched to lab STAT with priority label.',
        'STAT 12-lead ECG completed at 7 minutes: reveals 3 mm ST elevation in inferior leads II, III, and aVF with reciprocal ST depression in leads I and aVL (consistent with acute inferior STEMI). Cath Lab STEMI alert initiated immediately.',
        'STAT 12-lead ECG completed at 5 minutes: normal sinus rhythm with non-specific ST-T wave changes; no acute ST elevation or depression. Telemetry ongoing. Serial troponin protocol initiated.',
        'STAT 12-lead ECG acquired and handed directly to ED physician: reveals new-onset Left Bundle Branch Block (LBBB). Cardiac enzymes drawn.'
      ]},
      { id: 'interventionsMedications', label: 'Immediate Interventions & Protocol Medications', defaultValue: 'Patient maintained on strict bedrest in Semi-Fowler\'s position. Supplemental O2 applied via nasal cannula at 2 L/min, maintaining SpO2 at 97%. Administered chewable Aspirin 324 mg PO (chewed and swallowed). Verified SBP >100 mmHg and zero PDE5 inhibitor use in past 48 hours; administered Sublingual Nitroglycerin 0.4 mg tablet x 1 at 14:20.', options: [
        'Patient maintained on strict bedrest in Semi-Fowler\'s position. Supplemental O2 applied via nasal cannula at 2 L/min, maintaining SpO2 at 97%. Administered chewable Aspirin 324 mg PO (chewed and swallowed). Verified SBP >100 mmHg and zero PDE5 inhibitor use in past 48 hours; administered Sublingual Nitroglycerin 0.4 mg tablet x 1 at 14:20.',
        'Oxygen applied per nasal cannula at 2 L/min. Aspirin 324 mg chewed. Sublingual Nitroglycerin 0.4 mg given; repeated 5 min later for persistent pain (dose 2 of 3). Blood pressure monitored closely (SBP remained >110 mmHg).',
        'Strict bedrest. IV line 18G verified patent in left forearm. Aspirin 324 mg administered. Nitroglycerin held due to borderline SBP (96 mmHg) and suspected inferior/RV involvement.',
        'Aspirin 324 mg administered. Sublingual NTG 0.4 mg x 1 provided partial relief. Morphine sulfate 2 mg IV push administered for persistent severe ischemic pain per physician order.'
      ]},
      { id: 'providerCommunicationSBAR', label: 'Provider Escalation (SBAR) & Pain Reassessment', defaultValue: 'Attending Cardiologist Dr. Vance notified STAT via SBAR at 14:22: reported PQRST pain characteristics, ECG ischemic ST depressions, and vital signs. Verbal orders received, read back, and confirmed for serial troponins q3h and IV Heparin protocol. Reassessed at 14:26 (5 min post-NTG): chest pressure decreased from 8/10 to 2/10; BP 128/78 mmHg, HR 86 bpm. Repeat 12-lead ECG ordered.', options: [
        'Attending Cardiologist Dr. Vance notified STAT via SBAR at 14:22: reported PQRST pain characteristics, ECG ischemic ST depressions, and vital signs. Verbal orders received, read back, and confirmed for serial troponins q3h and IV Heparin protocol. Reassessed at 14:26 (5 min post-NTG): chest pressure decreased from 8/10 to 2/10; BP 128/78 mmHg, HR 86 bpm. Repeat 12-lead ECG ordered.',
        'Rapid Response Team (RRT) and Dr. Patel notified STAT. SBAR delivered. Reassessed pain: reduced to 0/10 following second dose of sublingual nitro. BP 122/74 mmHg. Patient scheduled for emergent cardiac catheterization.',
        'Cardiology on-call notified. Repeat ECG ordered for 15 minutes. Pain reassessment at 14:35: pain returned to 5/10; second dose of NTG administered; MD updated.',
        'STEMI alert activated. Interventional Cardiology team en route to Cath Lab. Patient stable on bedrest; IV Heparin bolus administered per protocol.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Acute chest pain event at {time}: {pqrstAssessment}. Associated symptoms & vitals: {associatedSymptomsVitals}.',
        action: 'STAT diagnostics: {statDiagnostics10Min}. Bedside interventions & medications: {interventionsMedications}. Provider escalation: {providerCommunicationSBAR}.',
        response: 'Pain score reduced following interventions. Telemetry continuous; serial troponin protocol active.',
      },
      soap: {
        subjective: 'Patient states acute chest discomfort: {pqrstAssessment}. Denies prior history of similar pain.',
        objective: 'At {time}: {associatedSymptomsVitals}. STAT Diagnostics: {statDiagnostics10Min}. Medications & Bedside Actions: {interventionsMedications}. SBAR Communication: {providerCommunicationSBAR}.',
        assessment: 'Acute Coronary Syndrome (ACS) / unstable ischemic chest pain; responsive to initial antianginal therapy, requiring close serial cardiac enzyme tracking and telemetry monitoring.',
        plan: 'Maintain continuous cardiac telemetry; execute serial 12-lead ECGs and troponin draws at 0, 3, and 6 hours; keep emergency medications and defibrillator immediately available; update provider.',
      },
      narrative: 'At {time}, patient reported sudden acute chest pain. {pqrstAssessment}. Initial assessment and vital signs: {associatedSymptomsVitals}. STAT diagnostic evaluation within 10 minutes: {statDiagnostics10Min}. Immediate nursing actions and pharmacotherapy: {interventionsMedications}. Provider communication via SBAR and pain reassessment: {providerCommunicationSBAR}.',
      concise: 'ACUTE CHEST PAIN / ACS EVALUATION NOTE ({time}):\n• PQRST Characterization: {pqrstAssessment}\n• Associated Signs & Vitals: {associatedSymptomsVitals}\n• STAT 10-Min ECG & Labs: {statDiagnostics10Min}\n• Interventions & Meds (MONA): {interventionsMedications}\n• SBAR Escalation & Reassessment: {providerCommunicationSBAR}',
    },
  },

  // 46. RESPIRATORY: Acute Shortness of Breath & Distress Escalation
  {
    id: 'resp-acute-dyspnea',
    title: 'Acute Shortness of Breath & Respiratory Distress Escalation',
    category: 'respiratory',
    categoryLabel: 'Respiratory & Suctioning',
    isProcedure: true,
    procedureCategory: 'respiratory',
    procedureCategoryLabel: 'Airway, Suctioning & Pleural',
    procedureBadges: ['Rapid Response', 'High-Flow O2', 'ABG / CXR STAT'],
    description: 'Protocol-driven nursing documentation for acute dyspnea, acute respiratory distress, severe hypoxia, High Fowler\'s positioning, high-flow oxygen/NRB escalation, Rapid Response activation, and STAT diagnostics.',
    tags: ['respiratory', 'dyspnea', 'shortness-of-breath', 'hypoxia', 'nrb', 'pulmonary-edema', 'rapid-response', 'emergency'],
    fields: [
      { id: 'time', label: 'Onset / Escalation Time', defaultValue: '15:30', type: 'text' },
      { id: 'presentingDistress', label: 'Presenting Complaint & Speech Dyspnea', defaultValue: 'Patient rang call bell in acute respiratory distress complaining of sudden severe breathlessness, air hunger, and inability to catch breath. Speech severely compromised: able to utter only 1-2 word broken phrases between gasps. Patient visibly panicked and restless.', options: [
        'Patient rang call bell in acute respiratory distress complaining of sudden severe breathlessness, air hunger, and inability to catch breath. Speech severely compromised: able to utter only 1-2 word broken phrases between gasps. Patient visibly panicked and restless.',
        'Patient found in severe respiratory distress during routine rounds; gasping for air, unable to speak full sentences, clutching chest and throat.',
        'Sudden onset breathlessness following transfer back to bed; patient reports choking sensation, acute orthopnea, and inability to lie flat.',
        'Acute worsening of chronic dyspnea: patient reports progressive chest tightness over past hour, now acute with audible wheezing and exhaustion.'
      ]},
      { id: 'physicalWorkOfBreathing', label: 'Work of Breathing, Posture & Vital Signs', defaultValue: 'Patient upright in orthopneic tripod position leaning over bedside table. Severe respiratory distress evident: prominent sternocleidomastoid retractions, intercostal indrawing, and abdominal paradox. Skin pale, cool, and diaphoretic with perioral cyanosis. Vitals: RR 34 bpm rapid and shallow, SpO2 83% on room air, HR 124 bpm sinus tachycardia, BP 168/98 mmHg, Temp 37.1°C.', options: [
        'Patient upright in orthopneic tripod position leaning over bedside table. Severe respiratory distress evident: prominent sternocleidomastoid retractions, intercostal indrawing, and abdominal paradox. Skin pale, cool, and diaphoretic with perioral cyanosis. Vitals: RR 34 bpm rapid and shallow, SpO2 83% on room air, HR 124 bpm sinus tachycardia, BP 168/98 mmHg, Temp 37.1°C.',
        'Tripod positioning with nasal flaring and supraclavicular retractions. RR 36 bpm, SpO2 81% on 2 L NC, HR 118 bpm, BP 154/90 mmHg. Patient agitated and confused.',
        'Severe work of breathing: tachypneic at 30 bpm, SpO2 86% on room air, HR 110 bpm, BP 178/104 mmHg. Bilateral lower extremity 3+ pitting edema noted.',
        'Rapid shallow breathing at 32 bpm; SpO2 85% on room air. Extremities dusky; capillary refill delayed at 4 seconds.'
      ]},
      { id: 'lungSoundsAuscultation', label: 'Lung Auscultation & Sputum Production', defaultValue: 'Bilateral chest auscultation reveals diffuse coarse crackles (rales) extending from lung bases bilaterally through bilateral mid-zones, with faint end-expiratory wheezes. Cough is weakly productive of scant frothy pink-tinged sputum suggestive of acute pulmonary edema.', options: [
        'Bilateral chest auscultation reveals diffuse coarse crackles (rales) extending from lung bases bilaterally through bilateral mid-zones, with faint end-expiratory wheezes. Cough is weakly productive of scant frothy pink-tinged sputum suggestive of acute pulmonary edema.',
        'Bilateral loud inspiratory and expiratory musical wheezes throughout all lung fields with prolonged expiratory phase. Breath sounds distant; poor air movement in bases.',
        'Markedly diminished breath sounds over right hemithorax with hyperresonance to percussion (suspected pneumothorax). Left lung clear with compensatory tachypnea.',
        'Coarse rhonchi and crackles throughout right lower and middle lobes. Non-productive harsh cough. Denies hemoptysis.'
      ]},
      { id: 'immediateBedsideAction', label: 'Positioning, Oxygen Escalation & RRT Activation', defaultValue: 'Head of bed raised immediately to 90-degree High Fowler\'s position. Oxygen escalated from room air to Non-Rebreather Mask (NRB) at 15 L/min with reservoir bag confirmed fully inflated; SpO2 responded upward to 92% within 3 minutes. Continuous pulse oximetry, 5-lead telemetry, and automated BP q3m initiated. Medical Rapid Response Team (RRT) and primary MD Dr. Reynolds paged STAT.', options: [
        'Head of bed raised immediately to 90-degree High Fowler\'s position. Oxygen escalated from room air to Non-Rebreather Mask (NRB) at 15 L/min with reservoir bag confirmed fully inflated; SpO2 responded upward to 92% within 3 minutes. Continuous pulse oximetry, 5-lead telemetry, and automated BP q3m initiated. Medical Rapid Response Team (RRT) and primary MD Dr. Reynolds paged STAT.',
        'Placed in upright sitting position with legs dangling over side of bed. O2 initiated via High Flow Nasal Cannula (HFNC) at 40 L/min, FiO2 60%; SpO2 climbed to 94%. Code Sepsis / Rapid Response called.',
        'Elevated head of bed to High Fowler\'s. Non-invasive positive pressure ventilation (BiPAP) requested: IPAP 12, EPAP 6, FiO2 50%. RRT at bedside.',
        'Positioned upright. Oxygen applied via Venturi mask at 40% (10 L/min). Primary care team paged STAT. Respiratory Therapy at bedside.'
      ]},
      { id: 'statMedsDiagnosticsResponse', label: 'STAT Diagnostics, Emergency Medications & Response', defaultValue: 'STAT portable Chest X-Ray and STAT Arterial Blood Gas (ABG) drawn from right radial artery by RT. Patent 18G PIV confirmed. Administered Furosemide (Lasix) 40 mg IV push over 2 minutes and sublingual Nitroglycerin 0.4 mg per STAT RRT order. Within 20 min post-diuresis: patient voided 500 mL urine; RR decreased to 22 bpm; SpO2 stabilized at 96% on NRB; work of breathing significantly eased. Transfer to Stepdown/ICU initiated.', options: [
        'STAT portable Chest X-Ray and STAT Arterial Blood Gas (ABG) drawn from right radial artery by RT. Patent 18G PIV confirmed. Administered Furosemide (Lasix) 40 mg IV push over 2 minutes and sublingual Nitroglycerin 0.4 mg per STAT RRT order. Within 20 min post-diuresis: patient voided 500 mL urine; RR decreased to 22 bpm; SpO2 stabilized at 96% on NRB; work of breathing significantly eased. Transfer to Stepdown/ICU initiated.',
        'Administered continuous nebulized Albuterol 5 mg + Ipratropium 0.5 mg and Methylprednisolone 125 mg IV. Wheezing loosened, peak flow improved; SpO2 95% on 4 L NC.',
        'STAT ABG results: pH 7.28, PaCO2 56 mmHg, PaO2 62 mmHg, HCO3 26 mEq/L (acute respiratory acidosis with hypoxemia). BiPAP initiated with immediate improvement in ventilatory parameters.',
        'STAT CXR revealed bilateral bat-wing perihilar alveolar infiltrates and cardiomegaly. Lasix 80 mg IV administered. Escalated to intensive care monitoring.'
      ]},
    ],
    formats: {
      dar: {
        data: 'Acute respiratory distress event at {time}: {presentingDistress}. Physical exam & work of breathing: {physicalWorkOfBreathing}. Auscultation: {lungSoundsAuscultation}.',
        action: 'High Fowler\'s positioning and high-flow oxygen: {immediateBedsideAction}. Emergency diagnostics and pharmacotherapy: {statMedsDiagnosticsResponse}.',
        response: 'SpO2 improved and work of breathing eased following interventions. Continuous monitoring active; transfer coordinated.',
      },
      soap: {
        subjective: 'Patient reports sudden severe shortness of breath: {presentingDistress}.',
        objective: 'At {time}: {physicalWorkOfBreathing}. Auscultation: {lungSoundsAuscultation}. Interventions & O2: {immediateBedsideAction}. STAT Diagnostics & Meds: {statMedsDiagnosticsResponse}.',
        assessment: 'Acute respiratory distress with severe hypoxemia secondary to suspected acute pulmonary congestion / broncho-constriction; responsive to upright positioning, high-flow oxygen, and acute pharmacotherapy.',
        plan: 'Maintain high-flow O2/BiPAP; monitor ABG and CXR results; continue continuous pulse oximetry and telemetry; coordinate seamless transfer to higher level of care.',
      },
      narrative: 'At {time}, responded to acute respiratory distress. {presentingDistress}. Physical examination and work of breathing: {physicalWorkOfBreathing}. Chest auscultation: {lungSoundsAuscultation}. Immediate bedside actions, positioning, and oxygen escalation: {immediateBedsideAction}. STAT diagnostic workup and medication administration: {statMedsDiagnosticsResponse}.',
      concise: 'ACUTE DYSPNEA / RESPIRATORY DISTRESS NOTE ({time}):\n• Presentation & Speech Dyspnea: {presentingDistress}\n• Work of Breathing & Vitals: {physicalWorkOfBreathing}\n• Lung Sounds & Sputum: {lungSoundsAuscultation}\n• Immediate Positioning & O2 Escalation: {immediateBedsideAction}\n• STAT Diagnostics & Response: {statMedsDiagnosticsResponse}',
    },
  },
];

export function isDefaultTemplateId(id: string): boolean {
  return INITIAL_TEMPLATES.some((t) => t.id === id);
}

export function getInitialTemplateById(id: string): NoteTemplate | undefined {
  const found = INITIAL_TEMPLATES.find((t) => t.id === id);
  if (!found) return undefined;
  return JSON.parse(JSON.stringify(found));
}
