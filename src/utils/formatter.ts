import { NoteTemplate } from '../data/templates';

export type NoteFormatType = 'dar' | 'soap' | 'concise' | 'narrative';

/**
 * Replace placeholders like {fieldId} with actual field values.
 */
export function compileNoteText(
  template: NoteTemplate,
  values: Record<string, string>,
  format: NoteFormatType
): string {
  const replaceTokens = (text: string): string => {
    return text.replace(/{([a-zA-Z0-9_]+)}/g, (_, key) => {
      if (values[key] !== undefined && values[key].trim() !== '') {
        return values[key];
      }
      // If field definition exists, use its defaultValue or placeholder
      const field = template.fields.find(f => f.id === key);
      return field?.defaultValue || `[${key}]`;
    });
  };

  if (format === 'dar') {
    const d = replaceTokens(template.formats.dar.data);
    const a = replaceTokens(template.formats.dar.action);
    const r = replaceTokens(template.formats.dar.response);
    return `FOCUS / DAR NOTE:\n\nDATA:\n${d}\n\nACTION:\n${a}\n\nRESPONSE:\n${r}`;
  }

  if (format === 'soap') {
    const s = replaceTokens(template.formats.soap.subjective);
    const o = replaceTokens(template.formats.soap.objective);
    const a = replaceTokens(template.formats.soap.assessment);
    const p = replaceTokens(template.formats.soap.plan);
    return `SOAP NOTE:\n\nS (Subjective):\n${s}\n\nO (Objective):\n${o}\n\nA (Assessment):\n${a}\n\nP (Plan):\n${p}`;
  }

  if (format === 'concise') {
    return replaceTokens(template.formats.concise);
  }

  // narrative
  return replaceTokens(template.formats.narrative);
}

/**
 * Returns formatted current military time HH:MM
 */
export function getCurrentMilitaryTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Standard vital sign snippet
 */
export function getStandardVitalsSnippet(): string {
  return `T: 37.0°C (Oral) | HR: 76 bpm (Regular) | BP: 122/78 mmHg | RR: 16 /min (Unlabored) | SpO2: 98% on Room Air | Pain: 0/10`;
}

/**
 * Dual RN verification stamp
 */
export function getDualRNStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Dual-RN verification conducted at ${time} at bedside with [Second RN Name, RN]. Patient identity and clinical orders confirmed.`;
}

/**
 * Provider SBAR read-back stamp
 */
export function getMDReadbackStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Dr. [Provider Name] notified at ${time}. Clinical status and data communicated via SBAR. New telephone orders received, read back, and verified in full.`;
}

/**
 * Joint Commission Standard Pain Reassessment & POSS Stamp
 */
export function getPainReassessmentStamp(): string {
  const time = getCurrentMilitaryTime();
  return `PAIN INTERVENTION REASSESSMENT (${time}):
• Post-Intervention Score: Pain score decreased from [Initial /10] to [Current /10] on numeric scale (acceptable goal achieved).
• Location & Relief: [Surgical site / lumbar / abdominal pain] eased; patient states relief is [adequate / satisfactory].
• Sedation & Safety (POSS): Pasero Opioid-Induced Sedation Scale = [1 - Awake & Alert / 2 - Slightly drowsy, easily aroused]. RR [16 bpm], regular; SpO2 [98% on Room Air]. Zero nausea, dizziness, or pruritus.
• Plan: Continue multimodal analgesia; encourage repositioning and incentive spirometry.`;
}

/**
 * Acute Febrile Spike & Sepsis Surveillance Macro Stamp
 */
export function getFeverSepsisStamp(): string {
  const time = getCurrentMilitaryTime();
  return `FEVER SPIKE & SEPSIS SCREEN (${time}):
• Temp Spike & Vitals: Temp [38.8°C / 101.8°F] (Oral/Core) | HR [112 bpm sinus tach] | BP [106/64 mmHg] | RR [22 bpm] | SpO2 [96%]. Diaphoretic with rigors.
• Sepsis Screen (SIRS/qSOFA): SIRS positive (Temp >38.0°C, HR >90, RR >20). qSOFA = [1]. Suspected infectious source: [Pulmonary / Urinary tract / Surgical wound / Central or peripheral line / Undetermined].
• STAT Diagnostics: Blood cultures x 2 sets drawn sterilely from 2 distinct venipuncture sites PRIOR to antibiotic delivery. STAT serum lactate, CBC with diff, CMP, and UA sent.
• Interventions & Antipyretic: Administered [Acetaminophen 650-1000 mg PO/IV] per orders. Extra blankets removed, light sheet applied, IV hydration initiated.
• Provider & Follow-up: Dr. [Physician Name] notified via SBAR; repeat core temperature and hemodynamic recheck in 45-60 min.`;
}

/**
 * Scheduled Position Turn Stamp
 */
export function getPositioningTurnStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Turned & repositioned at ${time} to [Right/Left 30° lateral tilt / Supine 30°]. Sacrum and trochanters offloaded. Bilateral heels floated with suspension boots. Skin inspected over bony prominences: intact, non-tender, no non-blanchable erythema. Patient resting comfortably.`;
}

/**
 * Skin & Pressure Area Prophylaxis Stamp
 */
export function getSkinCareStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Skin and pressure area care provided at ${time}. Sacral/perineal skin cleansed, dried, and barrier protectant cream applied. Bony prominences inspected: skin intact without breakdown or deep tissue injury. Low air loss mattress functional.`;
}

/**
 * Suctioning Clearance Stamp
 */
export function getSuctionStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Oropharyngeal suctioning performed at ${time} via [Yankauer / 12Fr catheter]. Moderate [clear/tenacious/yellowish] secretions evacuated. Breath sounds clear to auscultation. SpO2 [98%] on [Room Air / Prescribed O2]. Patient breathing easily.`;
}

/**
 * Shift Change Bedside Handoff & Assumption of Care Stamp
 */
export function getShiftChangeReceivingStamp(): string {
  const time = getCurrentMilitaryTime();
  return `SHIFT RECEIVING & BEDSIDE HANDOFF (${time}):
• Handoff: Bedside SBAR report conducted with off-going RN. 2 patient identifiers (Name & DOB), allergy band [NKDA], and Code Status [Full Code / DNR] confirmed.
• Clinical Baseline: Alert & oriented x 4. Telemetry: [NSR / A-Fib, HR 74]. SpO2 [98%] on [Room Air / 2L NC]. Pain: [0/10].
• Lines & Pumps: PIV [20G Right forearm] patent, dressing intact. IV fluids [0.9% NS @ 75 mL/hr] rate verified at smart pump with off-going RN.
• Tubes & Drains: [Foley draining clear amber / JP drain active to bulb / None]. Surgical dressings clean, dry, intact.
• Bedside Safety: Bed locked in lowest position, bed alarm armed, call bell in hand, fall precautions active. Wall suction & 100% O2 setup verified functional.
• Shift Plan: Morning labs scheduled (08:00), PT/OT evaluation, attending rounds, medication administration. Care assumed for shift.`;
}

/**
 * Patient Receiving & Handoff Stamp
 */
export function getReceivingHandoffStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Patient received on unit at ${time} via [Stretcher / Wheelchair] from [ED / PACU / ICU]. Bedside SBAR handoff received from transferring RN. Patient identity (2 identifiers), allergy band, and code status verified. Baseline vitals obtained and arrival skin check completed. Call bell within reach; physician notified of arrival.`;
}

/**
 * Mechanical Ventilation & Airway Check Stamp
 */
export function getVentCheckStamp(): string {
  const time = getCurrentMilitaryTime();
  return `Ventilator Check at ${time}: Mode [PRVC / AC] | Set Vt [450 mL] | Rate [14 bpm] | PEEP [+8 cmH2O] | FiO2 [40%]. Total rate [16], PIP [22 cmH2O], Exhaled Vt [460 mL]. ETT [7.5 mm] secured at [22 cm] at teeth, cuff pressure [24 cmH2O]. Patient synchronous, bilateral breath sounds present, closed inline suction patent.`;
}

/**
 * MUST (Malnutrition Universal Screening Tool) Concise Stamp
 */
export function getMUSTStamp(): string {
  const time = getCurrentMilitaryTime();
  return `MUST Nutritional Screen (${time}): BMI >20 (Score 0) | Unplanned wt loss <5% (Score 0) | Acute disease effect nil (Score 0). Overall MUST Score: 0 (Low Risk). Routine diet maintained; weekly rescreen scheduled.`;
}

/**
 * Early Warning Score (EWS / NEWS2) Concise Stamp
 */
export function getEWSStamp(): string {
  const time = getCurrentMilitaryTime();
  return `EWS / NEWS2 Check (${time}): RR 16 (0) | SpO2 98% RA (0) | BP 122/76 (0) | HR 74 (0) | Alert (0) | Temp 36.8°C (0). Total EWS = 0 (Low Risk). Ward vitals frequency q4-6h maintained. Zero single red trigger.`;
}

/**
 * Mega Code / Code Blue ACLS Resuscitation Stamp
 */
export function getMegaCodeStamp(): string {
  const time = getCurrentMilitaryTime();
  return `CODE BLUE / MEGA CODE RESUSCITATION LOG (${time}):
• Arrest Recognition: Pulseless, apneic at ${time}. Code Blue activated. CPR started immediately (rate 100-120 bpm, depth 5-6 cm, compressor switched q2min).
• Airway & Ventilation: 100% O2 BVM -> ETT #7.5 placed at 22 cm teeth. Position confirmed via continuous waveform capnography (ETCO2 24 mmHg) & bilateral breath sounds.
• Rhythm & Shocks: Initial rhythm [VF / pVT / Asystole / PEA]. [Biphasic Defibrillation 200J delivered x ( ) / Shock not indicated]. Immediate CPR resumed.
• ACLS Meds: Epinephrine 1 mg IV push q3-5min x [ ] doses. [Amiodarone 300 mg / 150 mg IV push / Normal Saline bolus]. Lines patent with 20 mL flushes.
• H's & T's Evaluated: Hypoxia, Hypovolemia, Acidosis, Hypo/Hyperkalemia, Tension PTX, Tamponade, Toxins, Thrombosis.
• Outcome: [ROSC achieved at (time) with palpable central pulse, BP ( / ), and ETCO2 >40 mmHg / Post-arrest care initiated / Resuscitation ongoing].`;
}

/**
 * Pre-Operative Verification & Holding Stamp
 */
export function getPreOpStamp(): string {
  const time = getCurrentMilitaryTime();
  return `PRE-OP SURGICAL CHECK (${time}):
• Identity & Consent: 2 IDs verified, surgical & anesthesia consent signed & in chart.
• Universal Protocol: Operative site marked by surgeon with patient confirmation.
• NPO & Status: NPO >8h verified. Dentures/glasses removed & secured. Allergy band checked.
• Access & Baseline: 18G/20G PIV patent. Vitals stable. Pre-op SCIP antibiotic on-call / infusing.
• Handoff: SBAR verbal handoff completed with OR circulating team. Transferred to OR.`;
}

/**
 * PACU / Post-Operative Recovery & Aldrete Stamp
 */
export function getPostOpPACUStamp(): string {
  const time = getCurrentMilitaryTime();
  return `PACU / POST-OP RECOVERY CHECK (${time}):
• Arrival & Airway: Received from OR via stretcher. Airway patent, SpO2 ≥95%.
• Aldrete Score: [9/10] (Activity 2, Resp 2, Circ 2, Conscious 2, O2 Sat 1-2). Temp: [36.8°C].
• Surgical Site: Incision dressing clean, dry, intact. Surgical drains ([JP/Hemovac]) patent & bulb compressed.
• Pain & PONV: Pain score [2/10] managed with multimodal analgesia. Zero PONV / antiemetic given.
• Disposition: Met Phase I discharge criteria. SBAR handoff given to floor/discharge unit.`;
}

/**
 * Comprehensive Wound Assessment & Staging Stamp
 */
export function getWoundAssessmentStamp(): string {
  const time = getCurrentMilitaryTime();
  return `WOUND ASSESSMENT & CARE (${time}):
• Site & Stage: [Sacral Pressure Injury Stage 3 / Surgical Incision / Stasis Ulcer].
• Size & Depth: L: [ ] cm x W: [ ] cm x D: [ ] cm | Undermining/Tunneling: [None / ( ) cm at ( ) o'clock].
• Bed Tissue: [ ]% Granulation (beefy red) | [ ]% Slough (yellow) | [ ]% Eschar (black) | Odor: [None].
• Exudate & Periwound: [Scant/Moderate] [Serosanguinous/Serous/Purulent]. Periwound [Intact/Macerated/Erythematous].
• Intervention: Cleansed with [0.9% Normal Saline / Vashe]. Dressing applied: [Aquacel Ag / Mepilex Border]. Tolerated well (Pain: 0-10).`;
}

/**
 * Complex Wound Packing & VAC / NPWT Stamp
 */
export function getWoundVACPackingStamp(): string {
  const time = getCurrentMilitaryTime();
  return `WOUND PACKING & VAC / NPWT CHECK (${time}):
• Cavity / Wound Site: [Abdominal wound / Sacral stage 4 cavity / Fasciotomy].
• Cleansing & Barrier: Irrigated with [Sterile Normal Saline], Cavilon barrier film applied to periwound skin.
• Packing / VAC Sponge: [GranuFoam black reticulated sponge / Silver alginate ribbon packed loosely]. Count: [1 in / 1 out confirmed].
• Negative Pressure: [Continuous -125 mmHg]. Airtight seal intact, sponge fully collapsed, zero leak alarm.
• Canister / Drainage: [ ] mL [serosanguinous] fluid in canister. Patient comfortable, site pressure offloaded.`;
}

/**
 * Universal Bedside Procedure Time-Out Stamp (JCAHO Standard)
 */
export function getUniversalTimeOutStamp(): string {
  const time = getCurrentMilitaryTime();
  return `UNIVERSAL PROTOCOL / TIME-OUT (${time}):
• Identity & Consent: 2 patient identifiers confirmed at bedside. Signed informed consent verified on chart.
• Procedure & Site: [Procedure Name] agreed upon by patient, operator Dr. [MD Name], and assisting RN. Anatomical site [Right / Left / Midline] verified and marked if applicable.
• Safety Checks: Allergies verified [NKDA]. Coagulation/platelets reviewed. Fire risk & local anesthetic dosage confirmed. Sterile field verified intact.`;
}

/**
 * Nasogastric / Enteral Tube Placement Verification Stamp
 */
export function getNGTubePlacementStamp(): string {
  const time = getCurrentMilitaryTime();
  return `NG/OG TUBE VERIFICATION (${time}):
• Tube Specs: [Salem Sump 16Fr / Dobhoff 10Fr] inserted via [Right/Left] naris, secured at [55 cm] mark at nostril.
• Aspirate & pH: Gastric aspirate obtained (cloudy green); pH test strip = [3.5] (verified < 5.5).
• Radiographic Confirmation: Portable KUB X-ray ordered & verified; tip confirmed in gastric body below diaphragm. Zero feeds/meds instilled prior to official X-ray verification.`;
}

/**
 * Blood Culture Sterile Dual-Site Venipuncture Stamp
 */
export function getBloodCultureStamp(): string {
  const time = getCurrentMilitaryTime();
  return `BLOOD CULTURE COLLECTION (${time}):
• Indication: Febrile spike (Temp [38.8°C]), rigors, tachycardia. Blood culture x 2 sets ordered.
• Sites & Prep: Set 1 drawn from [Left AC vein]; Set 2 drawn from [Right cephalic vein]. Skin prepped with 2% CHG 30s friction scrub, allowed 60s air dry.
• Volume & Bottle: 10 mL inoculated into Aerobic bottle first, followed by 10 mL into Anaerobic bottle per set (total 40 mL). Labeled at bedside with time, site, initials; sent STAT to lab.`;
}

/**
 * Bedside Invasive Procedure Assist Stamp
 */
export function getBedsideInvasiveAssistStamp(): string {
  const time = getCurrentMilitaryTime();
  return `BEDSIDE INVASIVE PROCEDURE ASSIST (${time}):
• Procedure: Assisted Dr. [Physician Name] with [Thoracentesis / Paracentesis / Lumbar Puncture / Bone Marrow].
• Time-Out: Universal Protocol Time-Out conducted. Sterile drape & field maintained. 1% Lidocaine local anesthesia ( [ ] mL ) infiltrated.
• Fluid / Specimen: [ ] mL [straw-colored serous / clear CSF / amber ascitic] fluid collected and labeled at bedside for diagnostic labs.
• Post-Care: Catheter removed, puncture site sterile pressure dressing applied: clean, dry, zero active leaking. Post-procedure vitals stable.`;
}

/**
 * Acute Chest Pain (ACS / PQRST) Evaluation Macro Stamp
 */
export function getChestPainPQRSTStamp(): string {
  const time = getCurrentMilitaryTime();
  return `ACUTE CHEST PAIN EVALUATION (${time}):
• PQRST: Provoked by [exertion / rest]; Quality: [crushing substernal pressure / squeezing / burning]; Radiation: [radiating to left jaw, neck, inner left arm]; Severity: [8/10]; Timing: [onset 15 min ago, constant]. Associated: diaphoresis, mild nausea, dyspnea.
• STAT Diagnostics: 12-lead ECG completed within 10 min: [ST depression / T-wave inversion / no acute ST elevation]. Serial high-sensitivity Troponin I, CK-MB, BMP, CBC drawn STAT. Continuous 5-lead telemetry active.
• Immediate Interventions: Bedrest, O2 per nasal cannula at [2 L/min] keeping SpO2 >94%. Chewable Aspirin [324 mg] PO administered. Sublingual Nitroglycerin [0.4 mg] x [1] administered after verifying SBP >100 mmHg and no PDE5 inhibitors.
• Escalation & Provider: Dr. [Physician Name] notified STAT via SBAR; verbal orders received and read back. Pain reassessed 5 min post-NTG: reduced to [2/10], SBP [118/74 mmHg].`;
}

/**
 * Acute Shortness of Breath & Respiratory Distress Escalation Stamp
 */
export function getAcuteDyspneaStamp(): string {
  const time = getCurrentMilitaryTime();
  return `ACUTE SHORTNESS OF BREATH / RESPIRATORY DISTRESS (${time}):
• Assessment: Sudden severe dyspnea, orthopnea, 1-2 word speech dyspnea. RR [32 bpm], SpO2 [84% on room air], HR [116 bpm sinus tach], BP [158/92 mmHg]. Work of breathing: prominent accessory muscle use, intercostal retractions, anxious, diaphoretic. Auscultation: [diffuse bilateral crackles in bases / coarse expiratory wheezes throughout].
• Immediate Actions: Patient placed immediately in High Fowler's position (90°). Oxygen escalated to [Non-Rebreather Mask at 15 L/min with bag inflated] raising SpO2 to [93%]. Continuous SpO2 & telemetry on.
• STAT Escalation: Rapid Response Team (RRT) / Primary MD [Physician Name] paged STAT. STAT portable Chest X-Ray and STAT Arterial Blood Gas (ABG) ordered.
• Interventions & Meds: IV access patent. Administered [IV Furosemide (Lasix) 40 mg IV push / Albuterol 2.5 mg + Ipratropium 0.5 mg nebulizer] per STAT orders.
• Response: Patient breathing more easily, RR decreased to [22 bpm], SpO2 stable at [96%], pending CXR and lab results.`;
}

/**
 * Post-Angiogram / Cardiac Catheterization & TR Band Stamp
 */
export function getPostAngioCathStamp(): string {
  const time = getCurrentMilitaryTime();
  return `POST-ANGIOGRAM & CATH LAB RECOVERY (${time}):
• Sheath/Puncture Site: [Right radial artery TR Band with 14 mL air / Right femoral artery Angio-Seal closure]. Site dressing clean, dry, intact without hematoma, swelling, ecchymosis, or active bleed. Surrounding skin soft, non-tender.
• Neurovascular Checks: Ipsilateral radial/dorsalis pedis pulse [strong +2/2 palpable], capillary refill [< 2 seconds], right extremity warm, pink, sensation and motor intact without numbness or paresthesias.
• Protocol & Positioning: TR Band scheduled decompression initiated per protocol (remove 3 mL q15m if patent hemostasis). If femoral: strict flat supine bedrest with affected leg straight maintained x [4-6 hours].
• Vitals & Hydration: Vitals q15m x 4 stable. IV NS infusing at [100 mL/hr] to promote radiocontrast renal clearance. Encouraging oral fluids; urine output monitored (>30 mL/hr).`;
}

/**
 * Synchronized Cardioversion Assist Stamp
 */
export function getCardioversionStamp(): string {
  const time = getCurrentMilitaryTime();
  return `SYNCHRONIZED CARDIOVERSION ASSIST (${time}):
• Indication & Baseline: Assisted Dr. [Physician Name] with elective/emergent synchronized cardioversion for [Atrial Fibrillation with RVR / Atrial Flutter / Monomorphic VT with pulse]. Baseline rhythm confirmed; rate [162 bpm].
• Setup & Sedation: Defibrillator in SYNCHRONIZED mode; sync markers confirmed tracking R-waves. Multifunction pads placed [anteroposterior / anterolateral]. Bag-valve-mask, suction, and emergency airway ready at bedside. IV sedation administered by provider: [Etomidate / Propofol / Midazolam] with adequate sedation depth achieved.
• Delivery & Response: Shock 1 delivered at [100 Joules biphasic] synchronized on R-wave. Rhythm converted immediately to [Normal Sinus Rhythm at 78 bpm]. Post-shock BP [124/76 mmHg], SpO2 [98% on 2L NC].
• Recovery: Airway patent, spontaneous respirations adequate. Patient aroused easily, oriented x 4, denies chest pain or burn at pad sites. Skin intact under pads.`;
}

/**
 * Transesophageal Echocardiogram (TEE) Assist Stamp
 */
export function getTEEAssistStamp(): string {
  const time = getCurrentMilitaryTime();
  return `TRANSESOPHAGEAL ECHOCARDIOGRAM (TEE) ASSIST (${time}):
• Indication & Pre-Check: Assisted Dr. [Physician Name] with diagnostic TEE to [evaluate left atrial appendage thrombus prior to cardioversion / assess mitral valve vegetation]. NPO verified >6h. Dentures/partials removed, baseline loose teeth checked (none).
• Anesthesia & Sedation: Pharynx anesthetized with topical [Cetacaine spray 1-second burst / 2% viscous lidocaine gargle]. Moderate sedation administered per protocol: [Midazolam 2 mg IV + Fentanyl 50 mcg IV]. Soft bite block positioned.
• Procedure & Tolerance: TEE probe lubricated and advanced smoothly with patient swallowing assist. Probe tolerated well; telemetry, continuous SpO2, and automated NIBP q5m monitored. Zero dysrhythmias or desaturations observed. Probe safely removed at [completion time].
• Post-Procedure Care: Patient recovered to Aldrete score 10/10. Strictly NPO maintained until gag reflex verified with tongue depressor (anticipated [1-2 hours]). Denies throat pain, dysphagia, or hemoptysis.`;
}







