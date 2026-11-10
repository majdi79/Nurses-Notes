import { NoteTemplate } from './templates';

/**
 * CRITICAL CARE UNIT (CCU) • Clinical documentation guide
 * Standard clinical note templates for Critical Care Unit documentation.
 * All empty spaces (__________) are preserved with brackets so they are easily modifiable by nurses in the editor.
 */

export const CCU_TEMPLATES: NoteTemplate[] = [
  // 1. MECHANICALLY VENTILATED / CRITICALLY ILL PATIENT - DETAILED NOTE
  {
    id: 'ccu-mech-vent-detailed',
    title: 'Critical Care: Mechanically Ventilated / Critically Ill Patient (Detailed Note)',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Comprehensive assessment of intubated mechanically ventilated patient covering ETT, ventilator parameters, sedation, hemodynamics, lines, infusions, and drains.',
    tags: ['critical care', 'ccu', 'ventilator', 'ett', 'critically ill', 'sedation', 'icu', 'hemodynamics', 'lines', 'drains'],
    isProcedure: true,
    procedureCategory: 'respiratory',
    procedureCategoryLabel: 'Airway & Ventilation',
    fields: [
      { id: 'ettSize', label: 'ETT Size', defaultValue: '7.5', options: ['7.0', '7.5', '8.0', '8.5'] },
      { id: 'ettDepth', label: 'ETT Lip Level (cm)', defaultValue: '22', options: ['20', '21', '22', '23', '24'] },
      { id: 'gcs', label: 'Conscious Level / GCS', defaultValue: '10T/15', options: ['15/15', '11T/15', '10T/15', '8T/15', '6T/15', '3T/15'] },
      { id: 'sedationScore', label: 'Sedation Score (RASS)', defaultValue: '-2 (Light sedation)', options: ['0 (Alert and calm)', '-1 (Drowsy)', '-2 (Light sedation)', '-3 (Moderate sedation)', '-4 (Deep sedation)'] },
      { id: 'ventMode', label: 'Ventilator Mode', defaultValue: 'SIMV / PRVC', options: ['SIMV / PRVC', 'AC / VC', 'AC / PC', 'Pressure Support (PSV)', 'CPAP / PS'] },
      { id: 'fio2', label: 'FiO2 (%)', defaultValue: '40', options: ['30', '35', '40', '45', '50', '60', '70', '100'] },
      { id: 'peep', label: 'PEEP (cmH2O)', defaultValue: '8', options: ['5', '8', '10', '12', '14'] },
      { id: 'rr', label: 'Respiratory Rate (RR)', defaultValue: '16', options: ['12', '14', '16', '18', '20', '24'] },
      { id: 'tvps', label: 'TV / PS', defaultValue: 'TV 450 mL (6-8 mL/kg PBW)', options: ['TV 420 mL', 'TV 450 mL', 'TV 480 mL', 'PS 10 cmH2O', 'PS 12 cmH2O'] },
      { id: 'spo2', label: 'SpO2 (%)', defaultValue: '98', options: ['95', '96', '97', '98', '99', '100'] },
      { id: 'rhythm', label: 'Cardiac Rhythm', defaultValue: 'Sinus rhythm', options: ['Sinus rhythm', 'Sinus tachycardia', 'Atrial fibrillation with controlled VR', 'Paced rhythm'] },
      { id: 'hr', label: 'Heart Rate (HR)', defaultValue: '78', options: ['68', '74', '78', '84', '92', '105'] },
      { id: 'bp', label: 'Blood Pressure (BP)', defaultValue: '124/68', options: ['110/65', '120/70', '124/68', '135/75', '140/80'] },
      { id: 'map', label: 'MAP (mmHg)', defaultValue: '86', options: ['68', '74', '80', '86', '92'] },
      { id: 'lines', label: 'IV / Arterial / Central Lines', defaultValue: 'Right internal jugular CVC patent; left radial arterial line with good waveform and zeroed', options: ['Right internal jugular CVC patent; left radial arterial line with good waveform and zeroed', 'Triple lumen CVC right subclavian; 20G PIV left forearm patent', 'Right femoral CVC patent; 18G PIV right antecubital'] },
      { id: 'infusions', label: 'Active Infusions', defaultValue: 'Norepinephrine 0.04 mcg/kg/min; Propofol 15 mcg/kg/min running as prescribed', options: ['Norepinephrine 0.04 mcg/kg/min; Propofol 15 mcg/kg/min running as prescribed', 'Propofol 20 mcg/kg/min; Fentanyl 50 mcg/hr running as prescribed', 'Maintenance 0.9% NS @ 75 mL/hr running as prescribed', 'None running at present'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
MECHANICALLY VENTILATED / CRITICALLY ILL PATIENT - DETAILED NOTE

Patient received in bed, mechanically ventilated via ETT size [____] fixed at [____] cm. Conscious level/GCS [____]/15; sedation score [__________] if applicable. Head-to-toe assessment completed. Ventilator mode [__________], FiO2 [____]%, PEEP [____], RR [____], TV/PS [__________] as prescribed. SpO2 [____]%. Bilateral air entry [__________]; suction performed as clinically indicated with response [__________]. ETT position/fixation checked and secure. Ventilator circuit/connections checked, patent, supported and free from kinking/tension. HOB maintained at 30-45 degrees unless contraindicated. Oral/airway care provided as indicated.

Cardiac rhythm [__________], HR [____], BP [____]/[____], MAP [____]. Peripheral perfusion/pulses [__________]. IV/arterial/central lines assessed: [__________]. Dressings clean/dry/intact [or document findings]. Infusions [__________] running as prescribed. Drains/CBD/NGT/other devices [__________] checked, secured and patent as applicable. Intake/output documented.`,

      concise: `CRITICAL CARE (CCU) • MECHANICALLY VENTILATED / CRITICALLY ILL PATIENT:
• Airway & Tube: Mechanically ventilated via ETT size [____] fixed at [____] cm at teeth/lip. Fixation secure, circuit supported, free from kinking/tension. HOB 30-45°. Oral/airway care provided.
• Neurological & Sedation: Conscious level/GCS [____]/15; sedation score [__________] if applicable. Head-to-toe assessment completed.
• Ventilator Settings: Mode [__________] | FiO2 [____]% | PEEP [____] cmH2O | RR [____] /min | TV/PS [__________] as prescribed.
• Pulmonary Status: SpO2 [____]%. Bilateral air entry [__________]; suction performed as clinically indicated with response [__________].
• Hemodynamics: Rhythm [__________] | HR [____] bpm | BP [____]/[____] mmHg | MAP [____] mmHg. Peripheral perfusion/pulses [__________].
• Vascular Lines & Infusions: IV/arterial/central lines assessed: [__________]. Dressings clean/dry/intact [or document findings]. Infusions [__________] running as prescribed.
• Tubes, Drains & Elimination: Drains/CBD/NGT/other devices [__________] checked, secured, and patent as applicable. Intake/output documented.`,

      dar: {
        data: `Patient received in bed, mechanically ventilated via ETT size [____] fixed at [____] cm. Conscious level/GCS [____]/15; sedation score [__________]. Vent parameters: Mode [__________], FiO2 [____]%, PEEP [____], RR [____], TV/PS [__________]. SpO2 [____]%. Air entry [__________]. Hemodynamics: Rhythm [__________], HR [____], BP [____]/[____], MAP [____]. Peripheral pulses/perfusion [__________]. Lines: [__________]. Infusions: [__________]. Drains/tubes: [__________].`,
        action: `Head-to-toe assessment completed. ETT position/fixation verified and secure. Ventilator circuit/connections inspected: patent, supported, and free of kinking/tension. HOB maintained at 30-45 degrees. Oral and airway care provided as indicated. Suction performed as clinically indicated. Dressings assessed: clean/dry/intact [or document findings]. Infusions verified against orders. Drains, CBD, and NGT secured and checked for patency. Intake and output logged.`,
        response: `Suction performed with response [__________]. Patient tolerating mechanical ventilation with synchronized respiratory effort. Hemodynamics stable within ordered parameters.`,
      },

      soap: {
        subjective: `Patient intubated and mechanically ventilated. Conscious level/GCS [____]/15; sedation score [__________] if applicable. Unable to provide verbal subjective report; non-verbal comfort assessed.`,
        objective: `Airway: ETT size [____] fixed at [____] cm. Ventilator mode [__________], FiO2 [____]%, PEEP [____], RR [____], TV/PS [__________]. SpO2 [____]%. Bilateral air entry [__________]; suction response [__________]. ETT secure; circuit supported; HOB 30-45°. Cardiac rhythm [__________], HR [____], BP [____]/[____], MAP [____]. Pulses/perfusion [__________]. Lines: [__________]. Dressings: clean/dry/intact [or document findings]. Infusions [__________] running per order. Drains/CBD/NGT: [__________] patent.`,
        assessment: `Critically ill mechanically ventilated patient. Airway patent and secure; ventilatory support adequate; hemodynamics stable; lines and monitoring devices patent and free of complications.`,
        plan: `Continue mechanical ventilation with lung-protective protocol; maintain HOB 30-45° for VAP prevention; perform oral care q2-4h; titrate ordered infusions; monitor continuous vitals, MAP, and I&O.`,
      },
    },
  },

  // 2. REPOSITIONING DOCUMENTATION
  {
    id: 'ccu-repositioning-doc',
    title: 'Critical Care: Repositioning Documentation',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Repositioning documentation including pre-assessment, 30° lateral/supine turn, HOB elevation, body alignment, heel offloading, and 9-point skin inspection.',
    tags: ['critical care', 'ccu', 'repositioning', 'turning', 'skin assessment', 'pressure injury', 'heels'],
    isProcedure: true,
    procedureCategory: 'bedside',
    procedureCategoryLabel: 'Bedside Care & Skin',
    fields: [
      { id: 'position', label: 'Repositioned To', defaultValue: 'right 30° lateral', options: ['right 30° lateral', 'left 30° lateral', 'supine position'] },
      { id: 'hob', label: 'Head of Bed (°)', defaultValue: '30', options: ['30', '45', '15', 'Flat (contraindicated for HOB elevation)'] },
      { id: 'skinCondition', label: 'Skin Condition', defaultValue: 'intact, clean, and dry throughout', options: ['intact, clean, and dry throughout', 'intact with mild blanchable erythema over sacrum', 'intact, barrier cream applied to perineum'] },
      { id: 'abnormalFinding', label: 'Abnormal Findings', defaultValue: 'none noted', options: ['none noted', 'mild non-blanchable erythema over left greater trochanter', 'moisture-associated skin damage to perineal fold'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Repositioning Documentation

Patient assessed prior to repositioning. Current position and skin/pressure areas checked. Patient repositioned to right 30° lateral / left 30° lateral / supine position according to the individualized repositioning schedule and clinical condition. Head of bed maintained at [____]° as clinically appropriate. Proper body alignment maintained. Appropriate lifting/turning technique used to minimize friction and shear; patient not dragged across the bed. Pillows/positioning aids placed appropriately to support the head/neck, back, upper and lower limbs and to prevent direct pressure between bony prominences. Heels completely offloaded from the mattress when indicated.

Skin assessed during repositioning, including occiput, ears, shoulders/scapulae, elbows, sacrum/coccyx, greater trochanters, ischial areas, knees, ankles/malleoli and heels as applicable. Skin condition: [__________]. No new non-blanchable redness, discoloration, moisture-associated skin damage or skin breakdown noted / abnormal finding: [__________].`,

      concise: `CRITICAL CARE (CCU) • REPOSITIONING & SKIN ASSESSMENT:
• Position Change: Pre-turn assessment completed. Repositioned to [right 30° lateral / left 30° lateral / supine position] per turning schedule.
• Bed & Alignment: Head of bed maintained at [____]°. Proper body alignment ensured; lift/slide technique used without dragging to minimize friction and shear.
• Supports & Offloading: Pillows/positioning aids placed at head/neck, back, upper/lower limbs to prevent pressure between bony prominences. Heels completely offloaded from mattress.
• 9-Point Skin Check: Occiput, ears, shoulders/scapulae, elbows, sacrum/coccyx, greater trochanters, ischial areas, knees, ankles/malleoli, and heels assessed.
• Skin Status: Condition: [__________]. No new non-blanchable redness, discoloration, MASD, or breakdown noted / abnormal finding: [__________].`,

      dar: {
        data: `Patient due for scheduled turn per individualized CCU care plan. Baseline skin and pressure points assessed.`,
        action: `Repositioned patient to [right 30° lateral / left 30° lateral / supine position]. HOB maintained at [____]°. Proper body alignment established using lift/slide technique to eliminate shear. Pillows and supports placed to protect bony prominences; heels fully floated. Comprehensive skin assessment completed on all 9 pressure areas.`,
        response: `Skin condition: [__________]. Abnormal findings: [__________]. Patient resting comfortably with devices and lines secure.`,
      },

      soap: {
        subjective: `Patient assisted with scheduled repositioning. Verbalizes comfort / non-verbal signs of ease observed.`,
        objective: `Turned to [right 30° lateral / left 30° lateral / supine position]. HOB elevated [____]°. Pillows positioned between knees/ankles and behind back. Heels offloaded. Skin exam of occiput, ears, scapulae, elbows, sacrum/coccyx, trochanters, ischium, knees, malleoli, and heels: [__________]. Abnormal findings: [__________].`,
        assessment: `Patient safely turned and positioned with pressure injury prevention protocol in place. Hemodynamics and skin perfusion preserved.`,
        plan: `Continue 2-hourly repositioning schedule alternating lateral tilts and supine; maintain heel offloading and skin barrier care.`,
      },
    },
  },

  // 3. SUCTIONING: ORAL / ENDOTRACHEAL / TRACHEOSTOMY
  {
    id: 'ccu-suctioning-airway',
    title: 'Critical Care: Suctioning (Oral / Endotracheal / Tracheostomy)',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Airway suctioning documentation covering route (oral/ETT/trach), secretion color, amount, consistency, tolerance, and SpO2 maintenance.',
    tags: ['critical care', 'ccu', 'suctioning', 'ett', 'trach', 'oral suction', 'secretions', 'airway'],
    isProcedure: true,
    procedureCategory: 'respiratory',
    procedureCategoryLabel: 'Airway & Suctioning',
    fields: [
      { id: 'route', label: 'Suction Route', defaultValue: 'endotracheal', options: ['oral', 'endotracheal', 'tracheostomy'] },
      { id: 'color', label: 'Secretions Color', defaultValue: 'white / clear', options: ['white / clear', 'yellowish', 'tenacious yellowish-green', 'blood-tinged'] },
      { id: 'amount', label: 'Secretions Amount', defaultValue: 'moderate', options: ['scant', 'small', 'moderate', 'large'] },
      { id: 'consistency', label: 'Consistency', defaultValue: 'thin', options: ['thin', 'thick', 'tenacious', 'mucoid'] },
      { id: 'spo2', label: 'SpO2 Maintained (%)', defaultValue: '98', options: ['95', '96', '97', '98', '99', '100'] },
      { id: 'changes', label: 'Changes Noted', defaultValue: 'none; breath sounds cleared post-suctioning', options: ['none; breath sounds cleared post-suctioning', 'transient drop to 94%, recovered to 98% within 1 min', 'cough stimulated, airway cleared'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Suctioning Documentation

Suctioning: Oral / endotracheal / tracheostomy suctioning performed as indicated. Secretions noted: color [__________], amount (scant / small / moderate / large) [__________], consistency (thin / thick) [__________]. Patient tolerated the procedure well. SpO₂ maintained at [____]% / changes noted: [__________]`,

      concise: `CRITICAL CARE (CCU) • AIRWAY SUCTIONING NOTE:
• Procedure & Route: [Oral / endotracheal / tracheostomy] suctioning performed as clinically indicated.
• Secretion Characteristics: Color: [__________] | Amount: [scant / small / moderate / large] [__________] | Consistency: [thin / thick] [__________].
• Tolerance & Oxygenation: Patient tolerated the procedure well. SpO₂ maintained at [____]% / changes noted: [__________].
• Airway Status: Airway cleared, breath sounds reassessed bilaterally.`,

      dar: {
        data: `Indication for suctioning assessed: audible rhonchi / secretions noted in airway circuit. Baseline SpO2 verified.`,
        action: `Performed [Oral / endotracheal / tracheostomy] suctioning using aseptic technique. Evacuated secretions: color [__________], amount [__________], consistency [__________].`,
        response: `Patient tolerated procedure well. SpO₂ maintained at [____]%. Changes noted: [__________]. Breath sounds improved.`,
      },

      soap: {
        subjective: `Patient indicated need for suctioning / required airway clearance for retained secretions.`,
        objective: `Suctioning performed via [Oral / endotracheal / tracheostomy] route. Secretions: color [__________], volume [__________], consistency [__________]. SpO2 post-procedure [____]%.`,
        assessment: `Airway effectively cleared of secretions with stable oxygenation and no acute bronchospasm.`,
        plan: `Continue inline suctioning as clinically indicated; maintain humidification and monitor breath sounds.`,
      },
    },
  },

  // 4. POSITIONING — COMPREHENSIVE BEDSIDE ENTRY
  {
    id: 'ccu-positioning-comprehensive',
    title: 'Critical Care: Positioning — Comprehensive Bedside Entry',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Extensive bedside turn record with pre/post vitals, comfort/pain, 6 anatomical pressure sites, device checks, and tolerance.',
    tags: ['critical care', 'ccu', 'positioning', 'comprehensive', 'skin check', 'devices', 'vitals', 'turning'],
    isProcedure: true,
    procedureCategory: 'bedside',
    procedureCategoryLabel: 'Bedside Care & Skin',
    fields: [
      { id: 'time', label: 'Assessment Time (hrs)', defaultValue: '08:00', options: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'] },
      { id: 'initialPos', label: 'Initial Position', defaultValue: 'supine', options: ['supine', 'right 30° lateral', 'left 30° lateral'] },
      { id: 'comfortPre', label: 'Comfort / Pain Pre-turn', defaultValue: 'comfortable, pain 0/10', options: ['comfortable, pain 0/10', 'mild back ache, pain 2/10', 'calm, sedated RASS -2'] },
      { id: 'spo2Pre', label: 'Pre SpO2 (%)', defaultValue: '98', options: ['96', '97', '98', '99'] },
      { id: 'hrPre', label: 'Pre HR (bpm)', defaultValue: '76', options: ['68', '72', '76', '82', '88'] },
      { id: 'bpPre', label: 'Pre BP (mmHg)', defaultValue: '122/70', options: ['118/68', '122/70', '130/74', '138/80'] },
      { id: 'newPos', label: 'Repositioned To', defaultValue: 'right 30° lateral', options: ['right 30° lateral', 'left 30° lateral', 'supine'] },
      { id: 'hob', label: 'HOB Elevated (°)', defaultValue: '30', options: ['30', '45', '15'] },
      { id: 'heelOffload', label: 'Heel Offloading Method', defaultValue: 'pillow under calf / heel suspension boots', options: ['pillow under calf / heel suspension boots', 'heel elevation boots', 'air mattress heel cavity'] },
      { id: 'spo2Post', label: 'Post SpO2 (%)', defaultValue: '98', options: ['96', '97', '98', '99'] },
      { id: 'hrPost', label: 'Post HR (bpm)', defaultValue: '78', options: ['70', '74', '78', '84'] },
      { id: 'bpPost', label: 'Post BP (mmHg)', defaultValue: '124/72', options: ['120/70', '124/72', '128/76'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Positioning — Comprehensive Bedside Entry

At [____] hrs patient assessed before turn; initial position [__________], comfort/pain [__________], SpO₂ [____]%, HR [____], BP [____]/[____]. Repositioned to [__________] (supine/right 30° lateral/left 30° lateral/other clinically appropriate position). Head of bed elevated [____]° as clinically appropriate. Head/neck/spine and limbs aligned; pillows/positioning supports placed at [__________] to protect bony prominences and avoid pressure between knees/ankles. Heels fully offloaded when indicated using [__________]. Lift/slide technique used to reduce friction and shear; patient not dragged. Skin assessed at accessible pressure areas: occiput/ears [__________], scapulae/elbows [__________], sacrum/coccyx [__________], hips/trochanters [__________], knees/malleoli [__________], heels [__________]. Moisture/redness/non- blanchable discoloration/skin breakdown: [__________]. Skin under/around medical devices checked: [__________]. IV/CVC/arterial lines, urinary catheter, drains and oxygen/ETT/ventilator circuit secured and checked before/after turning as applicable: [__________]. After turn SpO₂ [____]%, HR [____], BP [____]/[____]; breathing/comfort [__________]. Patient tolerated [__________].`,

      concise: `CRITICAL CARE (CCU) • COMPREHENSIVE BEDSIDE POSITIONING ENTRY:
• Pre-Turn Baseline ([____] hrs): Initial position [__________] | Comfort/pain [__________] | SpO2 [____]% | HR [____] | BP [____]/[____].
• New Position: Repositioned to [__________] (supine / right 30° lateral / left 30° lateral). HOB elevated [____]°.
• Alignment & Offloading: Limbs and spine aligned; pillows/supports placed at [__________]. Heels fully offloaded using [__________]. Lift/slide technique utilized without dragging.
• Skin Assessment: Occiput/ears [__________], scapulae/elbows [__________], sacrum/coccyx [__________], hips/trochanters [__________], knees/malleoli [__________], heels [__________]. Moisture/redness/breakdown: [__________]. Under devices: [__________].
• Line & Circuit Security: IV/CVC/art-lines, urinary catheter, drains, ETT/circuit secured and verified before & after turn: [__________].
• Post-Turn Vitals & Tolerance: SpO2 [____]% | HR [____] | BP [____]/[____] | Breathing/comfort: [__________]. Patient tolerated [__________].`,

      dar: {
        data: `At [____] hrs, pre-turn status: Position: [__________], comfort/pain [__________], SpO2 [____]%, HR [____], BP [____]/[____]. Skin and devices checked.`,
        action: `Repositioned to [__________] with HOB elevated [____]°. Spine/limbs aligned; positioning supports placed at [__________]. Heels floated with [__________]. Skin checked across all accessible pressure sites: occiput/ears, scapulae, sacrum/coccyx, hips, knees, heels. Lines, drains, and airway circuit checked and secured before and after turn.`,
        response: `Post-turn vitals: SpO2 [____]%, HR [____], BP [____]/[____]. Breathing/comfort: [__________]. Patient tolerated [__________].`,
      },

      soap: {
        subjective: `Patient evaluated for scheduled repositioning. Pain and comfort reported as [__________] prior to turn and [__________] after turn.`,
        objective: `Turn completed at [____] hrs from [__________] to [__________]. HOB [____]°. Pre-vitals: SpO2 [____]%, HR [____], BP [____]/[____]. Post-vitals: SpO2 [____]%, HR [____], BP [____]/[____]. Skin check: [__________]. Under devices: [__________]. Lines and circuit secure: [__________].`,
        assessment: `Patient turned without friction or hemodynamic compromise. Skin intact; pressure points offloaded; attached lines and circuits patent.`,
        plan: `Maintain ordered positioning schedule; reassess pressure areas at next scheduled turn.`,
      },
    },
  },

  // 5. PRESSURE INJURY PATIENT
  {
    id: 'ccu-pressure-injury-patient',
    title: 'Critical Care: Pressure Injury Patient Assessment & Care',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Pressure injury documentation including anatomical location, staging, dimensions, exudate, Braden/PUSH scores, offloading, wound care, and escalation.',
    tags: ['critical care', 'ccu', 'pressure injury', 'braden', 'push score', 'staging', 'wound care', 'offloading'],
    isProcedure: true,
    procedureCategory: 'wound',
    procedureCategoryLabel: 'Wound & Skin Staging',
    fields: [
      { id: 'location', label: 'Anatomical Location', defaultValue: 'sacrum', options: ['sacrum', 'coccyx', 'right ischial tuberosity', 'left ischial tuberosity', 'right heel', 'left heel', 'greater trochanter'] },
      { id: 'stage', label: 'Pressure Injury Stage', defaultValue: 'Stage 2', options: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Unstageable (slough/eschar)', 'Deep Tissue Pressure Injury (DTPI)'] },
      { id: 'dimensions', label: 'Dimensions (L x W x D cm)', defaultValue: '2.0 x 1.5 x 0.2', options: ['1.0 x 1.0 x 0.1', '2.0 x 1.5 x 0.2', '3.5 x 2.0 x 0.5', 'not measured (Stage 1 / DTPI intact)'] },
      { id: 'woundBed', label: 'Wound Bed', defaultValue: 'pink, 100% viable granulation tissue', options: ['pink, 100% viable granulation tissue', '70% pink granulation, 30% yellow slough', 'non-blanchable intact erythema', 'dark purple/maroon intact skin'] },
      { id: 'exudate', label: 'Exudate', defaultValue: 'scant serous', options: ['none', 'scant serous', 'moderate serosanguinous', 'small purulent'] },
      { id: 'surroundingSkin', label: 'Surrounding Skin', defaultValue: 'intact, pink, no maceration', options: ['intact, pink, no maceration', 'erythematous, warm, non-indurated', 'mild periwound maceration'] },
      { id: 'braden', label: 'Braden Score', defaultValue: '12 (High risk)', options: ['10 (Very high risk)', '12 (High risk)', '14 (Moderate risk)', '16 (Mild risk)'] },
      { id: 'dressing', label: 'Dressing Applied', defaultValue: 'cleansed with sterile NS, hydrocolloid / foam dressing applied', options: ['cleansed with sterile NS, hydrocolloid / foam dressing applied', 'cleansed with NS, barrier film and bordered silicone foam applied', 'cleansed with NS, hydrogel with secondary foam dressing applied'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
PRESSURE INJURY PATIENT

Skin assessment completed. Existing pressure injury located at [__________] (exact anatomical/bony prominence), Stage [_____]. Wound size [____] x [____] x [____] cm [if measured], wound bed [__________], exudate [__________], surrounding skin [__________]. Braden score [____]; reassessed this shift. Direct pressure over affected area avoided. Patient repositioned to [__________] according to individualized care plan. Appropriate offloading/pressure- relieving device [__________] used; heels offloaded as indicated. Skin kept clean and dry; moisture/friction/shear prevention measures maintained. Dressing/wound care performed as ordered using [__________]; patient tolerated [__________]. PUSH assessment score [____] / updated as required. Patient/family education provided regarding repositioning, skin care and pressure injury prevention as applicable. New/deteriorating findings [__________]; Dr./in-charge/wound team informed at [____]; advice/order [__________]. Reassessment/response [__________]. Pressure injury status included in SBAR/handover.`,

      concise: `CRITICAL CARE (CCU) • PRESSURE INJURY ASSESSMENT & MANAGEMENT:
• Location & Stage: Located at [__________] (anatomical prominence) | Stage: [_____].
• Wound Characteristics: Size: [____] x [____] x [____] cm [if measured] | Bed: [__________] | Exudate: [__________] | Periwound: [__________].
• Clinical Scores: Braden score [____] (reassessed this shift) | PUSH assessment score: [____].
• Offloading & Positioning: Repositioned to [__________] avoiding direct pressure over injury. Offloading device: [__________] used; heels offloaded.
• Wound Care: Performed as ordered using [__________]; patient tolerated [__________]. Skin kept clean and dry.
• Escalation & Handover: New/deteriorating findings: [__________]. Dr./in-charge/wound team informed at [____]; advice/order: [__________]. Response: [__________]. Handed over in SBAR.`,

      dar: {
        data: `Skin assessment completed. Existing pressure injury at [__________], Stage [_____]. Size: [____] x [____] x [____] cm. Wound bed: [__________], exudate: [__________], periwound: [__________]. Braden score: [____]. PUSH score: [____].`,
        action: `Repositioned to [__________] with offloading device [__________] to relieve direct pressure. Heels floated. Wound cleansed and dressed per order using [__________]. Patient/family educated on pressure injury prevention. Physician/wound team contacted at [____] regarding [__________].`,
        response: `Dressing intact; patient tolerated procedure [__________]. Advice/orders received: [__________]. Status updated in SBAR report.`,
      },

      soap: {
        subjective: `Patient reports pain/discomfort at pressure injury site: [__________]. Verbalizes understanding of offloading.`,
        objective: `Pressure injury at [__________], Stage [_____]. Measurements: [____] x [____] x [____] cm. Base: [__________]. Drainage: [__________]. Periwound: [__________]. Braden: [____]. PUSH: [____]. Dressing applied: [__________]. Offloading: [__________]. Provider notified at [____].`,
        assessment: `Stage [_____] pressure injury under active protocol management; offloading maintained without signs of secondary infection.`,
        plan: `Maintain strict turning schedule; protect wound from pressure/shear; change dressing per order; monitor PUSH score.`,
      },
    },
  },

  // 6. POSITIONING FOR BEDRIDDEN WITH LIMITED MOBILITY
  {
    id: 'ccu-positioning-limited-mobility',
    title: 'Critical Care: Positioning For Bedridden With Limited Mobility',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Documentation for partially bedridden patients requiring assistance with daily activities, position changes, skin checks, and fall prevention.',
    tags: ['critical care', 'ccu', 'bedridden', 'limited mobility', 'positioning', 'fall prevention', 'skin check'],
    fields: [
      { id: 'assessment', label: 'Skin & Pressure Assessment', defaultValue: 'skin intact over all bony prominences, no erythema or breakdown', options: ['skin intact over all bony prominences, no erythema or breakdown', 'mild blanchable redness over sacrum, barrier cream applied', 'dry skin, moisturizer applied to lower limbs'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Positioning For Bedridden With Limited Mobility:

Patient is partially bedridden with limited mobility, requiring assistance with daily activities. Able to change position in bed with minimal assistance. Repositioning encouraged and assisted as needed. Skin and pressure areas assessed ([write the assessment]). Fall prevention measures maintained.`,

      concise: `CRITICAL CARE (CCU) • BEDRIDDEN WITH LIMITED MOBILITY NOTE:
• Mobility Status: Partially bedridden with limited mobility; requires assistance with daily activities.
• Bed Mobility: Able to change position in bed with minimal assistance; repositioning encouraged and assisted as needed.
• Skin & Pressure Assessment: [write the assessment].
• Safety & Fall Precautions: Fall prevention measures maintained; call bell within reach; bed in lowest position.`,

      dar: {
        data: `Patient partially bedridden with restricted physical mobility. Requires assistance with ADLs and turns.`,
        action: `Assisted patient with repositioning in bed. Assessed skin and pressure areas: [write the assessment]. Maintained comprehensive fall prevention measures.`,
        response: `Patient comfortable, positioned safely in bed with call bell in hand.`,
      },

      soap: {
        subjective: `Patient verbalizes need for assistance with position changes; reports feeling comfortable.`,
        objective: `Partially bedridden; changes position with minimal assist. Skin assessment: [write the assessment]. Bed in lowest position, side rails up x 2.`,
        assessment: `Impaired physical mobility; skin intact; low-to-moderate fall risk managed with environmental safeguards.`,
        plan: `Encourage active turning q2h; assist with hygiene and ADLs; continue fall precautions.`,
      },
    },
  },

  // 7. PATIENT REFUSED REPOSITIONING
  {
    id: 'ccu-refused-repositioning',
    title: 'Critical Care: Patient Refused Repositioning',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Documentation when a patient declines scheduled repositioning, reasons stated, risks explained, skin assessment as tolerated, and escalation.',
    tags: ['critical care', 'ccu', 'refusal', 'repositioning', 'declined turn', 'skin risk', 'escalation'],
    fields: [
      { id: 'time', label: 'Time Offered (hrs)', defaultValue: '10:00', options: ['08:00', '10:00', '12:00', '14:00', '16:00', '20:00', '22:00'] },
      { id: 'reason', label: 'Reason for Declining', defaultValue: 'fatigue and wanting to sleep', options: ['fatigue and wanting to sleep', 'acute pain when turning onto side', 'preference to remain supine for family visit', 'general discomfort'] },
      { id: 'skinTolerated', label: 'Skin Assessed as Tolerated', defaultValue: 'sacrum and heels inspected; intact, no redness noted', options: ['sacrum and heels inspected; intact, no redness noted', 'bony prominences palpated; no localized warmth or induration', 'visual inspection of accessible areas unremarkable'] },
      { id: 'escalation', label: 'In-Charge / Physician Notification', defaultValue: 'charge nurse informed; will re-attempt turning in 1 hour', options: ['charge nurse informed; will re-attempt turning in 1 hour', 'attending physician notified during rounds; pain regimen adjusted', 'notified in-charge RN; patient monitoring continued'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
PATIENT REFUSED REPOSITIONING

Repositioning offered at [____] and importance of regular position change/pressure injury prevention explained. Patient declined repositioning due to [__________]. Risks explained and patient verbalized understanding [if applicable]. Skin/pressure areas assessed as tolerated: [__________]. Comfort measures provided. Will continue to encourage/reassess. In-charge/physician informed if clinically indicated: [__________].`,

      concise: `CRITICAL CARE (CCU) • PATIENT REFUSAL OF REPOSITIONING:
• Offer & Education: Repositioning offered at [____] hrs; clinical necessity of regular position changes and pressure injury prevention reinforced.
• Declination & Rationale: Patient declined repositioning due to: [__________].
• Risk Communication: Risks of skin breakdown, pressure injury, and atelectasis explained; patient verbalized understanding [if applicable].
• Skin Check as Tolerated: Skin/pressure areas assessed: [__________].
• Comfort & Follow-up: Comfort measures provided. Will continue to encourage and reassess. In-charge/physician informed: [__________].`,

      dar: {
        data: `Scheduled repositioning due at [____] hrs. Patient alert and oriented; states desire not to be turned due to [__________].`,
        action: `Educated patient on physiological importance of regular position changes and risks of pressure ulceration. Offered alternative positions and comfort aids. Assessed skin/pressure points as tolerated: [__________]. Notified in-charge/physician: [__________].`,
        response: `Patient acknowledges risks and maintains refusal. Resting comfortably; will re-attempt turn in 1 hour.`,
      },

      soap: {
        subjective: `Patient states: "I do not want to turn right now because [__________]." Verbalizes comprehension of pressure injury risks.`,
        objective: `Repositioning offered at [____] hrs and declined. Skin assessment as tolerated: [__________]. Pillows adjusted for comfort in current position. Charge RN/MD informed: [__________].`,
        assessment: `Patient exercising autonomy in declining repositioning; educated on risks; no acute skin breakdown noted at accessible sites.`,
        plan: `Re-approach patient for turning in 60 minutes; provide ordered analgesia if pain contributed to refusal; reassess skin.`,
      },
    },
  },

  // 8. DESATURATION / INSTABILITY DURING REPOSITIONING
  {
    id: 'ccu-desaturation-instability',
    title: 'Critical Care: Desaturation / Instability During Repositioning',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Acute event note for oxygen desaturation, hemodynamic instability, or distress during repositioning, circuit checks, and emergency interventions.',
    tags: ['critical care', 'ccu', 'desaturation', 'hypoxemia', 'instability', 'turning', 'ventilator', 'emergency'],
    isProcedure: true,
    procedureCategory: 'emergency',
    procedureCategoryLabel: 'Acute Instability & Rescue',
    fields: [
      { id: 'time', label: 'Time Initiated', defaultValue: '09:15', options: ['07:30', '09:15', '11:45', '14:20', '18:10', '23:30'] },
      { id: 'spo2Pre', label: 'Initial SpO2 (%)', defaultValue: '98', options: ['95', '96', '97', '98', '99'] },
      { id: 'spo2Drop', label: 'Desaturation SpO2 (%)', defaultValue: '84', options: ['80', '82', '84', '86', '88'] },
      { id: 'bpPre', label: 'Initial BP', defaultValue: '124/70', options: ['120/70', '124/70', '130/78'] },
      { id: 'bpChange', label: 'Altered BP', defaultValue: '92/54', options: ['88/50', '92/54', '165/95', '100/60'] },
      { id: 'symptom', label: 'Developed Symptoms', defaultValue: 'tachycardia and ventilator dyssynchrony', options: ['tachycardia and ventilator dyssynchrony', 'coughing and acute bronchospasm', 'diaphoresis and agitation'] },
      { id: 'intervention', label: 'Intervention Provided', defaultValue: 'patient returned to supine; 100% O2 administered for 2 min; circuit drained of condensation; inline suction performed', options: ['patient returned to supine; 100% O2 administered for 2 min; circuit drained of condensation; inline suction performed', 'returned to previous position; HOB adjusted to 30°; ETT depth confirmed at 22 cm; manual ventilation with 100% O2'] },
      { id: 'spo2Recovered', label: 'Recovered SpO2 (%)', defaultValue: '97', options: ['95', '96', '97', '98', '99'] },
      { id: 'bpRecovered', label: 'Recovered BP', defaultValue: '120/68 mmHg', options: ['118/66 mmHg', '120/68 mmHg', '126/72 mmHg'] },
      { id: 'condition', label: 'Final Patient Condition', defaultValue: 'settled, breathing comfortably, vitals stabilized', options: ['settled, breathing comfortably, vitals stabilized', 'calm, synchronizing with ventilator, resting'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Desaturation / Instability During Repositioning

Repositioning initiated at [____] with airway/lines/devices secured. During turning, SpO2 decreased from [____]% to [____]% / BP changed from [__________] to [__________] / patient developed [__________]. Repositioning stopped/position adjusted and patient reassessed. ETT/airway, ventilator circuit and connections checked as applicable. Intervention provided: [__________]. Dr./in-charge/RT informed at [____]; advice/order [__________]. Following intervention, SpO2 [____]%, BP [__________], patient condition [__________]. Continued close monitoring.`,

      concise: `CRITICAL CARE (CCU) • DESATURATION / INSTABILITY DURING TURNING:
• Event Onset: Repositioning initiated at [____] with all lines and airway secured.
• Acute Deterioration: SpO2 dropped from [____]% to [____]% | BP shifted from [__________] to [__________] | Developed: [__________].
• Immediate Action: Repositioning halted immediately; position adjusted. ETT position, circuit, and connections inspected and verified patent.
• Interventions: [__________].
• Notifications: Dr./in-charge/RT notified at [____]; advice/order: [__________].
• Post-Intervention Status: SpO2 recovered to [____]% | BP stabilized at [__________] | Patient condition: [__________]. Close surveillance ongoing.`,

      dar: {
        data: `At [____], during patient turning, acute instability occurred: SpO2 dropped from [____]% to [____]%; BP shifted from [__________] to [__________]; patient manifested [__________].`,
        action: `Repositioning halted immediately. Patient returned to stable posture. Inspected ETT lip level, ventilator circuit connections, and lines. Delivered interventions: [__________]. Alerted Physician, In-Charge RN, and Respiratory Therapy at [____].`,
        response: `Following intervention, SpO2 climbed to [____]%, BP normalized to [__________], and patient became [__________]. Continued intensive monitoring.`,
      },

      soap: {
        subjective: `Patient experienced acute desaturation / distress during position change; settled post-intervention.`,
        objective: `Turn attempted at [____]. SpO2 declined from [____]% to [____]%; BP changed from [__________] to [__________]. Developed: [__________]. Interventions: [__________]. Post-event vitals: SpO2 [____]%, BP [__________]. Team notified at [____].`,
        assessment: `Transient positional hypoxemia / hemodynamic instability during repositioning; resolved following prompt posture adjustment and ventilatory intervention.`,
        plan: `Maintain close monitoring; coordinate future position changes with 2+ staff and RT present; pre-oxygenate prior to next turn.`,
      },
    },
  },

  // 9. CARDIAC-MONITORED PATIENT — NO PAIN
  {
    id: 'ccu-cardiac-monitored-no-pain',
    title: 'Critical Care: Cardiac-Monitored Patient — No Pain',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Routine shift assessment for telemetry/cardiac monitored patient without chest pain: rhythm, vitals, IV access, and fall risk.',
    tags: ['critical care', 'ccu', 'cardiac', 'telemetry', 'no pain', 'vitals', 'rhythm', 'monitoring'],
    fields: [
      { id: 'time', label: 'Time Received (hrs)', defaultValue: '07:30', options: ['07:30', '11:00', '15:30', '19:30', '23:00'] },
      { id: 'rhythm', label: 'Cardiac Rhythm', defaultValue: 'Normal sinus rhythm', options: ['Normal sinus rhythm', 'Sinus bradycardia', 'Atrial fibrillation with controlled VR', 'Atrial flutter', 'First-degree AV block'] },
      { id: 'hr', label: 'Heart Rate (bpm)', defaultValue: '72', options: ['62', '68', '72', '78', '84', '90'] },
      { id: 'bp', label: 'Blood Pressure (mmHg)', defaultValue: '124/76', options: ['116/70', '124/76', '132/80', '140/84'] },
      { id: 'rr', label: 'Respiratory Rate (/min)', defaultValue: '16', options: ['14', '16', '18', '20'] },
      { id: 'spo2', label: 'SpO2 (%)', defaultValue: '98', options: ['96', '97', '98', '99', '100'] },
      { id: 'o2Delivery', label: 'Oxygen Delivery', defaultValue: 'room air', options: ['room air', '2 L/min via nasal cannula', '3 L/min via nasal cannula'] },
      { id: 'temp', label: 'Temperature (°C)', defaultValue: '36.8', options: ['36.5', '36.8', '37.0', '37.2'] },
      { id: 'ivAccess', label: 'IV Access / Site', defaultValue: '20G PIV right forearm, patent and flushes well with NS', options: ['20G PIV right forearm, patent and flushes well with NS', '18G PIV left antecubital patent, saline locked', 'Right subclavian CVC clean, dry, and intact'] },
      { id: 'fallRisk', label: 'Fall Risk Status', defaultValue: 'low risk, fall precautions maintained', options: ['low risk, fall precautions maintained', 'moderate risk, yellow wristband in place, bed alarm armed', 'high risk, assist x 2 with ambulation'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Cardiac-Monitored Patient — No Pain

Patient received at [____] hrs, awake/alert [__________], oriented. Connected to continuous cardiac monitoring; rhythm [__________], heart rate [____] bpm, BP [____]/[____] mmHg, RR [____]/min, SpO₂ [____]% on [__________], temperature [____]°C. Patient denies chest pain, palpitations, dizziness, dyspnea or other symptoms at time of assessment / reports [__________]. Pain score [____]/10. IV access/site [__________]. (fall [__________])`,

      concise: `CRITICAL CARE (CCU) • CARDIAC-MONITORED BASELINE (NO PAIN):
• Status at [____] hrs: Awake, alert [__________], fully oriented.
• Cardiac & Vitals: Continuous telemetry: [__________] | HR: [____] bpm | BP: [____]/[____] mmHg | RR: [____] /min | SpO2: [____]% on [__________] | Temp: [____]°C.
• Symptom Screen: Denies chest pain, palpitations, dizziness, dyspnea, or discomfort / reports: [__________]. Pain score: [____]/10.
• Lines & Safety: IV access/site: [__________]. Fall risk: (fall [__________]). Bed low, call bell in reach.`,

      dar: {
        data: `Patient received at [____] hrs on continuous cardiac telemetry. Baseline vitals: Rhythm [__________], HR [____], BP [____]/[____], RR [____], SpO2 [____]% on [__________], Temp [____]°C.`,
        action: `Completed cardiac assessment. Verified continuous ECG telemetry leads and signal quality. Inspected IV access: [__________]. Implemented fall precautions: (fall [__________]).`,
        response: `Patient denies chest pain or cardiac symptoms. Resting quietly in bed without distress.`,
      },

      soap: {
        subjective: `Patient denies chest tightness, palpitations, dizziness, or shortness of breath. Current pain score: [____]/10.`,
        objective: `Telemetry displays [__________]. HR [____] bpm, BP [____]/[____] mmHg, RR [____] /min, SpO2 [____]% on [__________], Temp [____]°C. IV access: [__________]. Fall assessment: (fall [__________]).`,
        assessment: `Hemodynamically stable on continuous telemetry without acute arrhythmias or active chest discomfort.`,
        plan: `Maintain telemetry monitoring; recheck vitals per CCU routine; educate patient to report any chest pain or palpitations immediately.`,
      },
    },
  },

  // 10. CARDIAC-MONITORED PATIENT — WITH PAIN
  {
    id: 'ccu-cardiac-monitored-pain',
    title: 'Critical Care: Cardiac-Monitored Patient — With Pain',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Acute chest/cardiac pain note: PQRST evaluation, 12-lead ECG, physician notification, medications, repeat assessment, and handover.',
    tags: ['critical care', 'ccu', 'cardiac', 'chest pain', 'pqrst', '12-lead ecg', 'telemetry', 'analgesia'],
    isProcedure: true,
    procedureCategory: 'emergency',
    procedureCategoryLabel: 'Acute Chest Pain & Cardiac',
    fields: [
      { id: 'time', label: 'Time of Pain Report', defaultValue: '10:15', options: ['08:30', '10:15', '13:40', '16:20', '21:05', '02:40'] },
      { id: 'location', label: 'Pain Location', defaultValue: 'substernal chest', options: ['substernal chest', 'precordial chest', 'epigastric / central chest', 'left retrosternal'] },
      { id: 'score', label: 'Pain Score (/10)', defaultValue: '7', options: ['5', '6', '7', '8', '9', '10'] },
      { id: 'character', label: 'Character / Quality', defaultValue: 'heaviness / pressure / crushing', options: ['heaviness / pressure / crushing', 'sharp / stabbing', 'tightness / squeezing', 'burning ache'] },
      { id: 'radiation', label: 'Radiation', defaultValue: 'left shoulder and jaw', options: ['left shoulder and jaw', 'left arm down to fingers', 'radiation to back / interscapular', 'none (localized)'] },
      { id: 'assocSymptoms', label: 'Associated Symptoms', defaultValue: 'mild dyspnea and diaphoresis, denies nausea or dizziness', options: ['mild dyspnea and diaphoresis, denies nausea or dizziness', 'diaphoresis, nausea, and shortness of breath', 'anxiety and palpitations'] },
      { id: 'ecgTime', label: '12-Lead ECG Time', defaultValue: '10:20', options: ['10:20', '13:45', '16:25', '21:10'] },
      { id: 'mdNotifiedTime', label: 'Physician Notified Time', defaultValue: '10:22', options: ['10:22', '13:48', '16:28', '21:12'] },
      { id: 'medAdmin', label: 'Intervention / Medication', defaultValue: 'Sublingual Nitroglycerin 0.4 mg and Aspirin 300 mg chewed', options: ['Sublingual Nitroglycerin 0.4 mg and Aspirin 300 mg chewed', 'Morphine 2 mg IV push and SL Nitroglycerin 0.4 mg', 'Supplemental O2 4L NC and SL Nitroglycerin 0.4 mg'] },
      { id: 'repeatTime', label: 'Repeat Assessment Time', defaultValue: '10:35', options: ['10:35', '14:00', '16:40', '21:25'] },
      { id: 'repeatScore', label: 'Repeat Pain Score (/10)', defaultValue: '1', options: ['0', '1', '2', '3', '4'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Cardiac-Monitored Patient — With Pain

At [____] hrs patient reported pain at [__________], onset [__________], duration [__________], score [____]/10, character [__________], radiation [__________], aggravating/relieving factors [__________]. Associated symptoms (e.g., dyspnea, diaphoresis, nausea, dizziness): [__________]. Vital signs BP [____]/[____], HR [____], RR [____], SpO₂ [____]%, rhythm [__________]. Patient assessed promptly; 12-lead ECG performed if indicated/ordered at [____] hrs, findings communicated [__________]. physician notified at [____] hrs; orders/advice [__________]. Prescribed intervention/medication [__________] administered at [____] hrs with monitoring for response/adverse effects. Repeat assessment at [____] hrs: pain [____]/10, BP [____]/[____], HR [____], SpO₂ [____]%, rhythm [__________]; associated symptoms [__________]. Further escalation/intervention [__________]. Patient education [__________]; close monitoring continued and handover updated.`,

      concise: `CRITICAL CARE (CCU) • ACUTE CARDIAC PAIN EPISODE:
• Pain Report ([____] hrs): Location: [__________] | Onset: [__________] | Duration: [__________] | Score: [____]/10 | Character: [__________] | Radiation: [__________] | Aggravating/relieving: [__________].
• Associated Symptoms: [__________].
• Initial Vitals & Rhythm: BP: [____]/[____] | HR: [____] | RR: [____] | SpO2: [____]% | Rhythm: [__________].
• Diagnostics & MD Alert: 12-lead ECG performed at [____] hrs; findings: [__________]. Physician notified at [____] hrs; orders: [__________].
• Acute Medication: [__________] administered at [____] hrs under close hemodynamic surveillance.
• Reassessment ([____] hrs): Pain: [____]/10 | BP: [____]/[____] | HR: [____] | SpO2: [____]% | Rhythm: [__________] | Associated symptoms: [__________].
• Escalation & Handover: [__________]. Patient educated: [__________]. Close monitoring continued and handover updated.`,

      dar: {
        data: `At [____] hrs, acute chest pain reported: Location [__________], onset [__________], duration [__________], score [____]/10, quality [__________], radiating to [__________]. Associated with: [__________]. Initial vitals: BP [____]/[____], HR [____], RR [____], SpO2 [____]%, rhythm [__________].`,
        action: `Bed rest enforced. Performed STAT 12-lead ECG at [____] hrs; communicated findings [__________]. Contacted physician at [____] hrs. Administered prescribed intervention/medication [__________] at [____] hrs. Reassessed at [____] hrs.`,
        response: `Repeat pain score decreased to [____]/10. Repeat vitals: BP [____]/[____], HR [____], SpO2 [____]%, rhythm [__________]. Associated symptoms resolved/improved: [__________]. Handover updated.`,
      },

      soap: {
        subjective: `Patient reports acute chest discomfort at [____] hrs: [__________], severity [____]/10, described as [__________], radiating to [__________]. Associated symptoms: [__________].`,
        objective: `Initial exam: BP [____]/[____], HR [____], RR [____], SpO2 [____]%, rhythm [__________]. 12-lead ECG at [____] hrs showed [__________]. MD paged at [____] hrs. Administered [__________]. Reassessment at [____] hrs: Pain [____]/10, BP [____]/[____], HR [____], SpO2 [____]%.`,
        assessment: `Acute chest pain episode; successfully managed with prescribed anti-ischemic/analgesic therapy and responsive without hemodynamic deterioration.`,
        plan: `Serial cardiac biomarkers and repeat 12-lead ECG per protocol; continuous telemetry; maintain IV access and notify provider of any recurrent pain.`,
      },
    },
  },

  // 11. LINES — PERIPHERAL IV
  {
    id: 'ccu-lines-piv',
    title: 'Critical Care: Lines — Peripheral IV',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Peripheral IV cannula site assessment for pain, erythema, swelling, leakage, infiltration, phlebitis, patency, running infusions, and tubing integrity.',
    tags: ['critical care', 'ccu', 'piv', 'peripheral iv', 'lines', 'patency', 'infusions', 'phlebitis'],
    fields: [
      { id: 'site', label: 'Cannula Location', defaultValue: 'right forearm (20G)', options: ['right forearm (20G)', 'left forearm (20G)', 'right antecubital fossa (18G)', 'left antecubital fossa (18G)', 'right dorsal hand (22G)'] },
      { id: 'siteAssessment', label: 'Site Assessment', defaultValue: 'clean, dry, intact; no pain, redness, warmth, swelling, leakage, or infiltration', options: ['clean, dry, intact; no pain, redness, warmth, swelling, leakage, or infiltration', 'dressing dry, mild tenderness without erythema', 'slight redness at puncture site, monitored closely'] },
      { id: 'infusion', label: 'Infusion / Medication', defaultValue: '0.9% Normal Saline', options: ['0.9% Normal Saline', 'Potassium Chloride in D5 1/2NS', 'Saline lock flush only', 'Maintenance IV fluids'] },
      { id: 'rate', label: 'Ordered Rate', defaultValue: '75 mL/hr', options: ['50 mL/hr', '75 mL/hr', '100 mL/hr', '125 mL/hr', 'saline locked (PRN flush)'] },
      { id: 'tubing', label: 'Tubing & Connections', defaultValue: 'secure, labeled, within expiration date, free of air bubbles', options: ['secure, labeled, within expiration date, free of air bubbles', 'tubing changed today, labeled with date and nurse initials', 'smart pump guardrails active'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Lines — Peripheral IV

Peripheral IV cannula at [__________]. Site assessed for pain, redness, warmth, swelling, leakage, infiltration, phlebitis and dressing integrity: [__________]. Cannula secured and patent as assessed; infusion/medication [__________] at ordered rate [__________]; line/tubing and connections checked [__________].`,

      concise: `CRITICAL CARE (CCU) • PERIPHERAL IV ASSESSMENT:
• Cannula Site: [__________].
• Inspection: Assessed for pain, redness, warmth, swelling, leakage, infiltration, phlebitis, and dressing integrity: [__________].
• Patency: Cannula secured and patent as assessed.
• Infusion: [__________] running at ordered rate of [__________].
• Connections: Line, tubing, and connections checked: [__________].`,

      dar: {
        data: `Peripheral venous line evaluated at [__________].`,
        action: `Assessed insertion site for signs of phlebitis, erythema, swelling, or extravasation: [__________]. Flushed with NS to verify patency. Verified running infusion [__________] at rate [__________]. Inspected tubing and connections [__________].`,
        response: `PIV is patent, dressing occlusive, infusion delivering accurately via smart pump without patient discomfort.`,
      },

      soap: {
        subjective: `Patient denies pain, burning, or tenderness at peripheral IV cannula site.`,
        objective: `PIV at [__________]. Site: [__________]. Patent with smooth flush. Running [__________] @ [__________]. Tubing checked: [__________].`,
        assessment: `Functioning peripheral intravenous access; zero signs of phlebitis, infection, or infiltration.`,
        plan: `Routine PIV site check q4h; change dressing and tubing per hospital policy or PRN.`,
      },
    },
  },

  // 12. LINES — CENTRAL VENOUS CATHETER
  {
    id: 'ccu-lines-cvc',
    title: 'Critical Care: Lines — Central Venous Catheter',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Central Venous Catheter (CVC) type/site, lumens, dressing integrity, infection signs, clamps/caps, lumen patency, running infusions, and rates.',
    tags: ['critical care', 'ccu', 'cvc', 'central line', 'lines', 'lumens', 'patency', 'infusions'],
    fields: [
      { id: 'typeSite', label: 'CVC Type & Site', defaultValue: 'Triple lumen catheter, right internal jugular (RIJ)', options: ['Triple lumen catheter, right internal jugular (RIJ)', 'Dual lumen PICC, right basilic vein', 'Triple lumen catheter, right subclavian', 'Quadruple lumen CVC, right internal jugular'] },
      { id: 'lumens', label: 'Number of Lumens', defaultValue: '3', options: ['1', '2', '3', '4'] },
      { id: 'dressingStatus', label: 'Dressing Assessment', defaultValue: 'clean, dry, intact with chlorhexidine biopatch in place', options: ['clean, dry, intact with chlorhexidine biopatch in place', 'clean and dry, transparent occlusive dressing intact', 'dressing intact, scheduled for 7-day change'] },
      { id: 'findings', label: 'Site Infection Findings', defaultValue: 'zero erythema, tenderness, discharge, bleeding or swelling noted', options: ['zero erythema, tenderness, discharge, bleeding or swelling noted', 'trace crusting at puncture site, no redness or warmth', 'mild bruising at insertion site, non-tender'] },
      { id: 'infusions', label: 'Infusions Running', defaultValue: 'Norepinephrine & Vasopressin', options: ['Norepinephrine & Vasopressin', 'Total Parenteral Nutrition (TPN) with dedicated line', 'Maintenance IV fluids and scheduled IVPB antibiotics', 'None; heparin locked'] },
      { id: 'lumenDetails', label: 'Lumens & Rates', defaultValue: 'Medial: Norepinephrine @ 0.06 mcg/kg/min; Distal: CVP monitoring; Proximal: Maintenance fluids @ 50 mL/hr', options: ['Medial: Norepinephrine @ 0.06 mcg/kg/min; Distal: CVP monitoring; Proximal: Maintenance fluids @ 50 mL/hr', 'Distal: Blood sampling / fluids; Proximal: Sedation infusion', 'All lumens patent, flushed and saline/heparin locked'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Lines — Central Venous Catheter

CVC type/site [__________], lumens [____]. Site/dressing assessed: clean/dry/intact or finding [__________]; erythema, tenderness, discharge, bleeding or swelling [__________]. line secured, clamps/caps/connections checked, lumen patency assessed as appropriate [__________]. Infusions [__________] via lumen [__________], rates [__________].`,

      concise: `CRITICAL CARE (CCU) • CENTRAL VENOUS CATHETER (CVC) ASSESSMENT:
• Device & Site: CVC type/site: [__________] | Lumens: [____].
• Site & Dressing: Dressing assessed: clean/dry/intact [or finding: [__________]]. Erythema, tenderness, discharge, bleeding or swelling: [__________].
• Line Security & Patency: Line secured, clamps/caps/connections checked; lumen patency assessed: [__________].
• Active Infusions: Infusions [__________] running via lumen [__________] at rate(s) [__________].`,

      dar: {
        data: `Central venous line in situ at [__________] with [____] lumens.`,
        action: `Evaluated insertion site and dressing: clean, dry, intact [__________]. Verified absence of erythema, drainage, or induration [__________]. Line secured to skin; clamps and caps checked. Assessed patency of each lumen. Verified active infusions: [__________] running via lumen [__________] at rate [__________].`,
        response: `Central line fully patent, sterile dressing occlusive, infusions running smoothly per protocol.`,
      },

      soap: {
        subjective: `Patient denies neck, shoulder, or chest wall discomfort at CVC insertion site.`,
        objective: `CVC: [__________], [____] lumens. Dressing: [__________]. Infection signs: [__________]. Patency: [__________]. Infusions: [__________] via lumen [__________] at rate [__________].`,
        assessment: `Central line patent and stable without clinical evidence of CLABSI, catheter displacement, or thrombosis.`,
        plan: `Maintain strict sterile barrier precautions during line access; perform scrub-the-hub technique; daily review of line necessity.`,
      },
    },
  },

  // 13. DRAIN CARE
  {
    id: 'ccu-drain-care',
    title: 'Critical Care: Drain Care',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Surgical drain assessment, insertion site, dressing, patency, output volume/color/consistency, tubing integrity, I&O logging, and patient tolerance.',
    tags: ['critical care', 'ccu', 'drain care', 'surgical drain', 'output', 'dressing', 'patency'],
    isProcedure: true,
    procedureCategory: 'wound',
    procedureCategoryLabel: 'Surgical Drains & Tubes',
    fields: [
      { id: 'siteStatus', label: 'Insertion Site & Dressing', defaultValue: 'clean, dry, and intact; no redness, swelling, or leakage', options: ['clean, dry, and intact; no redness, swelling, or leakage', 'dressing clean, mild serous stain < 1 cm', 'dressing changed, split gauze secure'] },
      { id: 'amount', label: 'Drainage Amount (mL)', defaultValue: '35', options: ['15', '25', '35', '50', '80', '120'] },
      { id: 'color', label: 'Drainage Color', defaultValue: 'serosanguinous', options: ['serosanguinous', 'serous (straw-colored)', 'sanguinous (dark red)', 'hemoserous'] },
      { id: 'consistency', label: 'Consistency', defaultValue: 'thin', options: ['thin', 'moderately thick', 'viscous'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Drain Care:

Drain assessed and maintained in place as ordered. Insertion site checked for redness, swelling, leakage or signs of infection. Dressing clean, dry and intact / [__________]. Drain secured, patent and functioning properly. Drainage noted: amount [____] mL, color [__________], consistency [__________]. No kinking, blockage or dislodgement noted. Drainage output monitored and documented in the intake and output chart. Patient tolerated drain care well.`,

      concise: `CRITICAL CARE (CCU) • SURGICAL DRAIN CARE NOTE:
• Device & Site: Drain assessed and maintained in place per orders. Insertion site inspected for erythema, edema, leakage, or infection.
• Dressing & Security: Dressing clean, dry, and intact [__________]. Drain secured, patent, and functioning properly.
• Drainage Characteristics: Amount: [____] mL | Color: [__________] | Consistency: [__________].
• Line & Flow: No kinking, blockage, or dislodgement noted; active suction restored.
• Output & Tolerance: Output documented in I&O flow record. Patient tolerated drain care well.`,

      dar: {
        data: `Surgical drain collection bulb inspected. Indicated for scheduled emptying and output measurement.`,
        action: `Assessed insertion site for infection or leakage: [__________]. Dressing confirmed clean, dry, intact. Emptied drain: measured [____] mL of [__________] fluid, [__________] consistency. Sealed under negative suction. Documented volume in intake/output flowsheet.`,
        response: `Drain patent and functioning. Tubing secured to prevent traction. Patient tolerated drain care well.`,
      },

      soap: {
        subjective: `Patient reports drain site is comfortable without pulling or sharp pain.`,
        objective: `Drain insertion site: [__________]. Dressing clean and intact. Measured output: [____] mL of [__________] drainage ([__________]). Suction re-established.`,
        assessment: `Surgical drain patent, evacuating expected postoperative fluid under active sealed suction.`,
        plan: `Monitor drain output q8h; notify surgical team if drainage exceeds 100 mL/hr or turns frank red; maintain bulb suction.`,
      },
    },
  },

  // 14. BED BATH
  {
    id: 'ccu-bed-bath',
    title: 'Critical Care: Bed Bath',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Complete assisted bed bath, hair/oral/perineal/back/foot/eye care, CBD care, bony prominence inspection, Braden score, clean linens, and repositioning.',
    tags: ['critical care', 'ccu', 'bed bath', 'hygiene', 'cbd care', 'catheter care', 'braden', 'skin check', 'turning'],
    isProcedure: true,
    procedureCategory: 'bedside',
    procedureCategoryLabel: 'Bedside Care & Skin',
    fields: [
      { id: 'skinCondition', label: 'Skin Condition Documented', defaultValue: 'intact, clean, and well-moisturized throughout', options: ['intact, clean, and well-moisturized throughout', 'intact, mild blanchable erythema over sacrum', 'intact, dry skin to lower extremities with barrier cream applied'] },
      { id: 'bradenScore', label: 'Braden Score', defaultValue: '13', options: ['11', '12', '13', '14', '15', '16'] },
      { id: 'hob', label: 'Head of Bed (°)', defaultValue: '30-45', options: ['30-45', '30', '45'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Bed Bath

Complete bed bath provided with full assistance, including hair shampooing, oral hygiene, perineal care, back care, foot care , eye care and skin moisturizing. Patient’s level of consciousness, cooperation, and ability to participate in hygiene care assessed. Privacy and dignity maintained throughout the procedure. CBD care performed using aseptic technique, and catheter insertion site assessed for redness, swelling, discharge, or other signs of infection. Full skin assessment performed, including inspection of bony prominences (sacrum, coccyx, heels, elbows, hips, and greater trochanters) for redness, pressure injuries, or skin breakdown. Skin condition documented([--------]), and Braden Scale reassessed according to policy. Clean bed linens and patient gown changed. Patient repositioned using appropriate moving and handling techniques, with pressure areas offloaded and pillows provided for support. Head of bed elevated as clinically appropriate.`,

      concise: `CRITICAL CARE (CCU) • COMPLETE BED BATH & HYGIENE CARE:
• Hygiene Care Provided: Complete bed bath provided with full assistance: hair shampooing, oral hygiene, perineal care, back care, foot care, eye care, and skin moisturizing.
• Dignity & Cooperation: Privacy and dignity maintained; patient level of consciousness and cooperation assessed.
• Catheter (CBD) Care: Performed using aseptic technique; meatus assessed: no redness, swelling, or discharge noted.
• Full Skin & Pressure Check: Bony prominences inspected (sacrum, coccyx, heels, elbows, hips, greater trochanters). Skin condition documented: ([--------]).
• Braden Reassessment: Braden score reassessed according to policy: [____].
• Linens & Repositioning: Fresh bed linens and gown applied. Repositioned with moving/handling technique; pressure areas offloaded with pillows; HOB elevated as appropriate.`,

      dar: {
        data: `Patient fully dependent for hygiene and activities of daily living. Scheduled for morning hygiene care and skin inspection.`,
        action: `Provided complete assisted bed bath including hair, oral, eye, perineal, back, and foot care. Performed aseptic catheter (CBD) care. Inspected all bony prominences for pressure injuries. Changed bed linens. Repositioned patient with pressure offloading and elevated HOB.`,
        response: `Skin condition documented as ([--------]). Braden score reassessed. Patient clean, comfortable, and resting in fresh linens.`,
      },

      soap: {
        subjective: `Patient assisted with full hygiene care; non-verbal and verbal comfort confirmed.`,
        objective: `Full bed bath provided. CBD care completed without signs of infection. Skin inspection of sacrum, coccyx, trochanters, elbows, heels: ([--------]). Braden score: [____]. Clean gown and linens applied. Repositioned with pillows.`,
        assessment: `Hygiene completed safely with dignity preserved; catheter secure; skin intact with pressure injury prevention measures maintained.`,
        plan: `Continue daily assisted hygiene care, q2h repositioning, and routine CBD care per hospital infection control bundle.`,
      },
    },
  },

  // 15. CCU ADMISSION NOTE FOR VENTILATOR PATIENT
  {
    id: 'ccu-admission-ventilator-patient',
    title: 'Critical Care: Admission Note for Ventilator Patient (Comprehensive)',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Comprehensive critical care admission record for ventilated patients received from AE: vent settings, neuro, transfer to bed, monitoring, lines/infusions, clinical scores, and doctor notification.',
    tags: ['critical care', 'ccu', 'admission', 'ventilator', 'ett', 'critical care', 'morse fall', 'must', 'aews', 'braden'],
    isProcedure: true,
    procedureCategory: 'respiratory',
    procedureCategoryLabel: 'Critical Care Admission',
    fields: [
      { id: 'patientName', label: 'Patient Name', defaultValue: 'Mr. [X]', options: ['Mr. [X]', 'Ms. [X]'] },
      { id: 'ventMode', label: 'Ventilator Mode', defaultValue: 'SIMV / PRVC', options: ['SIMV / PRVC', 'AC / VC', 'AC / PC', 'Pressure Support (PSV)'] },
      { id: 'fio2', label: 'FiO2 (%)', defaultValue: '45', options: ['35', '40', '45', '50', '60', '100'] },
      { id: 'tv', label: 'Tidal Volume (TV)', defaultValue: '450 mL', options: ['400 mL', '420 mL', '450 mL', '480 mL', '500 mL'] },
      { id: 'rr', label: 'Respiratory Rate (RR)', defaultValue: '16', options: ['12', '14', '16', '18', '20'] },
      { id: 'peep', label: 'PEEP', defaultValue: '8', options: ['5', '8', '10', '12'] },
      { id: 'ps', label: 'Pressure Support (PS)', defaultValue: '10', options: ['8', '10', '12', '14'] },
      { id: 'spo2', label: 'SpO2 (%)', defaultValue: '98', options: ['95', '96', '97', '98', '99', '100'] },
      { id: 'gcs', label: 'GCS Score', defaultValue: '8T/15', options: ['15/15', '11T/15', '10T/15', '8T/15', '6T/15', '3T/15'] },
      { id: 'rhythm', label: 'Cardiac Rhythm', defaultValue: 'Sinus rhythm', options: ['Sinus rhythm', 'Sinus tachycardia', 'Atrial fibrillation', 'Paced rhythm'] },
      { id: 'hr', label: 'Heart Rate', defaultValue: '82', options: ['72', '78', '82', '88', '96', '110'] },
      { id: 'bp', label: 'Blood Pressure', defaultValue: '126/72', options: ['110/65', '120/70', '126/72', '138/80'] },
      { id: 'temp', label: 'Temperature (°C)', defaultValue: '37.0', options: ['36.6', '36.8', '37.0', '37.4', '38.2'] },
      { id: 'pulseStatus', label: 'Peripheral Pulse', defaultValue: 'present', options: ['present', 'absent'] },
      { id: 'ettSize', label: 'ETT Size', defaultValue: '7.5', options: ['7.0', '7.5', '8.0', '8.5'] },
      { id: 'ettLip', label: 'ET Tube Lip Level (cm)', defaultValue: '22', options: ['20', '21', '22', '23', '24'] },
      { id: 'bradenScore', label: 'Braden Assessment Score', defaultValue: '12 (High risk)', options: ['10 (Very high risk)', '12 (High risk)', '14 (Moderate risk)'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
CCU Admission Note for Ventilator patient

Patient: Mr. [X] Received From: Accident & Emergency (AE) Mode of Transfer: Stretcher, accompanied by Doctor, Staff Nurse, Medical Service Aid, and Respiratory Therapist with portable ventilator &Cardiac monitor.

Ventilator Settings:
* Mode [....]
* FiO₂: […]
* Tidal Volume (TV): […]
* Respiratory Rate (RR): […]
* PEEP: […]
* Pressure Support (PS): […]
* SpO₂: […]

Neurological Status:
* Patient conscious but sedated / unconscious
* GCS score [.....]

Transfer of Pt to CCU bed
Pt safely transferred to CCU bed .Unit orientation not given as patient is fully dependent and sedated/unconscious

Monitoring & Devices:
* Cardiac monitor connected [.....] rhythm
* HR: […], BP: […], Temp: […] peripheral pulse [absent/present]
* Endotracheal tube size [.....] connected to bedside ventilator; settings reassessed by respiratory therapist. No respiratory distress oserved.
* ET tube lip level: […] cm
* Air entry bilaterally equal and good
* NGT {size […]} and CBD [size […]} in situ
* All lines secured as per hospital guidelines

Infusions and site observation
IV infusions [........] via [right/left femoral/subclavian/jugular/peripheral] line .No bleeding, infiltration, or phlebitis noted.

Investigations & Assessments:
* ECG done – shows […]
* Morse Fall Assessment: Score […] ([.....] risk) → Fall prevention guidelines implemented
* MUST Score: […][[....] Risk]
* AEWS Score: […]{[...] Risk}
* Comprehensive skin and head-to-toe assessment done {[e.g. noted lower limb edema, abrasions, rashes, hematoma, etc.]}
* Pressure injury noted in [......] region (Length […], Width […], exudate [..], Stage […], PUSH tool score […]). Air mattress applied.
* Patient kept in [.....] position with head-end elevation at 45°(30° for non-ventilated pts){[Lt lateral, Supine, Rt lateral]} Bony prominences protected and heels off loaded. All attached devices checked and secured.
* Braden Assessment: Score […] ([... risk])

Notifications:
* Senior on-call doctor notified of admission
Advice: Continue same treatment or new orders if any.

Additional documentation
* Admission weight not checked as patient is bedbound
* Identification band kept on side rails as both hands are edematous {[if indicated]}
* Present history, past history, social history &Family history: [__________]
* Health education aspect to the family: [__________]

Additional documentation for acute stroke pts
* Level of consciousness: [__________]
* GCS: [____/15]
* Oriented/Disoriented: [__________]
* Speech or language: [__________]
* Facial symmetry: [__________]
* Pupils and reaction: [__________]
* Limb strength: [__________]
* Sensation: [__________]

Additional documentation for Psychiatric pts
* Level of consciousness: [__________]
* Oriented/Disoriented: [__________]
* Behaviour: [__________]
* Speech: [__________]
* Hallucinated or not: [__________]
* Cooperation with care: [__________]`,

      concise: `CRITICAL CARE (CCU) • VENTILATOR PATIENT ADMISSION NOTE:
• Reception & Handover: Received from Accident & Emergency (AE) via stretcher accompanied by MD, RN, MSA, and RT with portable vent & monitor. Transferred safely to CCU bed.
• Ventilator Settings: Mode: [....] | FiO2: […] | TV: […] | RR: […] | PEEP: […] | PS: […] | SpO2: […].
• Neurological: Patient [conscious but sedated / unconscious] | GCS score: [.....].
• Hemodynamics: Rhythm: [.....] | HR: […] | BP: […] | Temp: […] | Peripheral pulses: [absent/present].
• Airway & Lines: ETT size [.....] @ lip level […] cm; air entry bilaterally equal. NGT {size […]} and CBD [size […]} in situ. IV infusions [........] via [right/left femoral/subclavian/jugular/peripheral] line; zero phlebitis/bleeding.
• Clinical Scores & Assessments: ECG: […] | Morse Fall: […] | MUST: […] | AEWS: […] | Braden: […] | Pressure injury: [......] (Air mattress applied).
• Positioning & Safety: Kept in [.....] position with HOB 45°; bony prominences protected; heels offloaded; attached devices secured.
• Provider Notification: Senior on-call doctor notified of admission. Advice: Continue same treatment or new orders if any.
• Additional Documentation: Weight not checked (bedbound); ID band verified; stroke & psychiatric assessments documented as indicated.`,

      dar: {
        data: `Patient received in CCU from AE on transport ventilator and cardiac monitor. ETT in situ, sedated. Baseline parameters: Vent mode [....], FiO2 […], TV […], PEEP […], SpO2 […]. Hemodynamics: Rhythm [.....], HR […], BP […], Temp […]. Attached devices: NGT, CBD, IV infusions.`,
        action: `Safely transferred to CCU bed with multidisciplinary team. Connected to bedside CCU ventilator and hemodynamic monitor. Confirmed ETT lip level at […] cm and equal bilateral air entry. Checked lines, NGT, and CBD. Completed clinical scores: Morse Fall, MUST, AEWS, and Braden. Positioned with HOB at 45° with heel offloading and air mattress. Notified senior on-call doctor of admission.`,
        response: `Ventilator synchrony achieved without distress. Hemodynamics monitored. Doctor advice received: Continue same treatment or new orders if any. Family oriented.`,
      },

      soap: {
        subjective: `Patient received from AE, intubated and sedated; unable to provide history. Accompanying team provided comprehensive transfer report.`,
        objective: `Ventilator: Mode [....], FiO2 […], TV […], RR […], PEEP […], PS […], SpO2 […]. Neuro: GCS [.....]. Vitals: HR […], BP […], Temp […], pulses [absent/present]. Airway: ETT size [.....] at […] cm lip level. Devices: NGT, CBD, IV infusions [........]. Scores: Morse […], MUST […], AEWS […], Braden […]. Pressure injury: [......]. HOB 45°. MD notified.`,
        assessment: `Intubated, mechanically ventilated critical care admission. Acutely ill, requiring continuous hemodynamic, ventilatory, and neurological surveillance.`,
        plan: `Adhere to CCU ventilator bundle; continuous vital signs, arterial line, and telemetry monitoring; serial ABGs; pressure ulcer prevention; execute admission orders.`,
      },
    },
  },

  // 16. ADDITIONAL DOCUMENTATION FOR ACUTE STROKE PTS
  {
    id: 'ccu-acute-stroke-documentation',
    title: 'Critical Care: Additional Documentation for Acute Stroke Pts',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Targeted neurological documentation for acute stroke patients: LOC, GCS, orientation, speech, facial symmetry, pupils, limb strength, and sensation.',
    tags: ['critical care', 'ccu', 'stroke', 'acute stroke', 'neuro', 'gcs', 'facial symmetry', 'pupils', 'limb strength', 'sensation'],
    fields: [
      { id: 'loc', label: 'Level of Consciousness', defaultValue: 'Alert', options: ['Alert', 'Lethargic', 'Obtunded', 'Stuporous', 'Comatose'] },
      { id: 'gcs', label: 'GCS (/15)', defaultValue: '14/15 (E4 V4 M6)', options: ['15/15', '14/15 (E4 V4 M6)', '13/15', '11/15', '9/15', '7/15'] },
      { id: 'orientation', label: 'Orientation', defaultValue: 'Oriented to person and place; disoriented to exact date', options: ['Oriented x 4 (person, place, time, situation)', 'Oriented to person and place; disoriented to exact date', 'Disoriented / confused'] },
      { id: 'speech', label: 'Speech or Language', defaultValue: 'Mild expressive dysphasia, speech intelligible', options: ['Clear and fluent without aphasia', 'Mild expressive dysphasia, speech intelligible', 'Slurred speech (dysarthria)', 'Global aphasia / non-verbal'] },
      { id: 'facialSymmetry', label: 'Facial Symmetry', defaultValue: 'Right-sided facial droop / flattening of nasolabial fold', options: ['Symmetric bilaterally on smiling and eye closure', 'Right-sided facial droop / flattening of nasolabial fold', 'Left-sided facial droop'] },
      { id: 'pupils', label: 'Pupils and Reaction', defaultValue: 'Equal, round, reactive to light (PERRL 3mm brisk bilaterally)', options: ['Equal, round, reactive to light (PERRL 3mm brisk bilaterally)', 'Right 4mm sluggish, Left 3mm brisk', 'Bilateral 2mm constricted, reactive'] },
      { id: 'limbStrength', label: 'Limb Strength', defaultValue: 'Right upper extremity 3/5, Right lower 4/5; Left upper and lower 5/5', options: ['5/5 full strength in all 4 extremities', 'Right upper extremity 3/5, Right lower 4/5; Left upper and lower 5/5', 'Left-sided hemiparesis (Upper 2/5, Lower 3/5)', 'Flaccid right hemiplegia 0/5'] },
      { id: 'sensation', label: 'Sensation', defaultValue: 'Decreased light touch sensation over right arm and leg', options: ['Intact bilaterally to light touch and pinprick', 'Decreased light touch sensation over right arm and leg', 'Absent sensation on left hemibody', 'Intact bilaterally'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Additional documentation for acute stroke pts

* Level of consciousness: [__________]
* GCS: [____/15]
* Oriented/Disoriented: [__________]
* Speech or language: [__________]
* Facial symmetry: [__________]
* Pupils and reaction: [__________]
* Limb strength: [__________]
* Sensation: [__________]`,

      concise: `CRITICAL CARE (CCU) • ACUTE STROKE NEUROLOGICAL ASSESSMENT:
• Level of Consciousness: [__________]
• GCS Score: [____/15]
• Orientation: [__________]
• Speech & Language: [__________]
• Cranial Nerves / Face: Facial symmetry: [__________] | Pupils & reaction: [__________]
• Motor & Sensory: Limb strength: [__________] | Sensation: [__________]
• Swallow & Safety: Bedside swallow screen maintained; aspiration precautions active.`,

      dar: {
        data: `Patient undergoing acute stroke neuro checks in CCU. Initial neurological parameters evaluated.`,
        action: `Assessed level of consciousness, GCS, orientation, speech, facial symmetry, pupils, motor limb strength, and sensory perception.`,
        response: `Neuro assessment documented: LOC [__________], GCS [____/15], Speech [__________], Face [__________], Motor [__________]. Neurological baseline communicated in handover.`,
      },

      soap: {
        subjective: `Patient communicates symptoms via [speech / gestures]. Reports sensory changes or weakness: [__________].`,
        objective: `LOC: [__________]. GCS: [____/15]. Orientation: [__________]. Speech: [__________]. Face: [__________]. Pupils: [__________]. Motor: [__________]. Sensation: [__________].`,
        assessment: `Acute stroke presentation with focal neurological deficits; neurological stability monitored against baseline NIHSS.`,
        plan: `Neuro checks q1h; maintain permissive hypertension parameters as ordered; maintain aspiration precautions; report acute changes STAT.`,
      },
    },
  },

  // 17. ADDITIONAL DOCUMENTATION FOR PSYCHIATRIC PTS
  {
    id: 'ccu-psychiatric-patient-documentation',
    title: 'Critical Care: Additional Documentation for Psychiatric Pts',
    category: 'ccu',
    categoryLabel: 'Critical Care (CCU)',
    description: 'Critical Care (CCU): Targeted psychiatric assessment: LOC, orientation, behavior, speech, hallucination screen, and cooperation with care.',
    tags: ['critical care', 'ccu', 'psychiatric', 'mental health', 'behavior', 'speech', 'hallucinations', 'cooperation'],
    fields: [
      { id: 'loc', label: 'Level of Consciousness', defaultValue: 'Alert', options: ['Alert', 'Lethargic', 'Hyper-alert / hypervigilant', 'Fluctuating'] },
      { id: 'orientation', label: 'Oriented / Disoriented', defaultValue: 'Oriented to person and place, disoriented to time', options: ['Oriented x 4', 'Oriented to person and place, disoriented to time', 'Disoriented to all spheres'] },
      { id: 'behaviour', label: 'Behaviour', defaultValue: 'Calm and cooperative in bed, occasionally restless', options: ['Calm and cooperative in bed, occasionally restless', 'Agitated, attempting to pull lines', 'Withdrawn, flat affect, minimal eye contact', 'Guarded, suspicious of staff'] },
      { id: 'speech', label: 'Speech', defaultValue: 'Normal rate and tone, coherent', options: ['Normal rate and tone, coherent', 'Rapid, pressured speech', 'Slow, monotone, hesitant', 'Loud, demanding, tangential'] },
      { id: 'hallucinations', label: 'Hallucinated or Not', defaultValue: 'Denies visual or auditory hallucinations; not responding to internal stimuli', options: ['Denies visual or auditory hallucinations; not responding to internal stimuli', 'Appears to respond to unseen stimuli; auditory hallucinations reported', 'Paranoid ideation without overt hallucinations'] },
      { id: 'cooperation', label: 'Cooperation with Care', defaultValue: 'Cooperative with nursing assessments and oral medications', options: ['Cooperative with nursing assessments and oral medications', 'Intermittently cooperative; requires re-direction', 'Refusing medications and procedures', 'Requires 1:1 constant observation for safety'] },
    ],
    formats: {
      narrative: `CRITICAL CARE UNIT (CCU)
Additional documentation for Psychiatric pts

* Level of consciousness: [__________]
* Oriented/Disoriented: [__________]
* Behaviour: [__________]
* Speech: [__________]
* Hallucinated or not: [__________]
* Cooperation with care: [__________]`,

      concise: `CRITICAL CARE (CCU) • PSYCHIATRIC & BEHAVIORAL ASSESSMENT:
• Level of Consciousness: [__________]
• Orientation: [__________]
• Behaviour: [__________]
• Speech: [__________]
• Perceptual Disturbances: Hallucinated or not: [__________]
• Cooperation: Cooperation with care: [__________]
• Safety Precautions: Bedside safety environment maintained; zero self-harm or aggressive ideation voiced.`,

      dar: {
        data: `Psychiatric / behavioral assessment conducted during CCU shift.`,
        action: `Evaluated LOC, orientation, behavioral presentation, speech patterns, hallucination presence, and level of cooperation with medical interventions.`,
        response: `Patient assessed as [__________]. Behaviour: [__________]. Co-operating with care [__________]. Safe environment maintained.`,
      },

      soap: {
        subjective: `Patient verbalizes mood and perceptions: [__________]. Denies suicidal/homicidal ideation.`,
        objective: `LOC: [__________]. Orientation: [__________]. Behavior: [__________]. Speech: [__________]. Hallucinations: [__________]. Cooperation: [__________].`,
        assessment: `Psychiatric and behavioral status evaluated in critical care setting; safety maintained without acute agitation or self-harm risk.`,
        plan: `Continue supportive reassurance; maintain safe CCU environment; administer ordered psychotropic/anxiolytic medications; notify psychiatric consultation team as indicated.`,
      },
    },
  },
];
