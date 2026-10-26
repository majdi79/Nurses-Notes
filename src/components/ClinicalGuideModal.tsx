import React from 'react';
import { X, AlertTriangle, ShieldCheck, CheckSquare, BookOpen, HeartPulse, Zap, Bandage, Stethoscope, Activity, Syringe, Wind, UserCheck, Flame } from 'lucide-react';
import { DO_NOT_USE_ABBREVIATIONS, CHARTING_FRAMEWORKS } from '../data/clinicalReference';

interface ClinicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalGuideModal: React.FC<ClinicalGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'abbreviations' | 'receiving' | 'pain_fever' | 'cardiac' | 'procedures' | 'pressure' | 'megacode' | 'perioperative' | 'wounds' | 'frameworks' | 'legal'>('receiving');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] sm:max-h-[94vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Documentation Standards & Safety Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('abbreviations')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'abbreviations'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Do Not Use Abbreviations
          </button>
          <button
            onClick={() => setActiveTab('receiving')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'receiving'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Shift Receiving & Handoff</span>
          </button>
          <button
            onClick={() => setActiveTab('pain_fever')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'pain_fever'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Pain & Fever / Sepsis Standards</span>
          </button>
          <button
            onClick={() => setActiveTab('cardiac')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'cardiac'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Cardiac, Chest Pain & Dyspnea</span>
          </button>
          <button
            onClick={() => setActiveTab('procedures')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'procedures'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
            <span>Bedside Procedures & Safety</span>
          </button>
          <button
            onClick={() => setActiveTab('pressure')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pressure'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skin, Positioning & Ventilation
          </button>
          <button
            onClick={() => setActiveTab('megacode')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'megacode'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Mega Code & ACLS</span>
          </button>
          <button
            onClick={() => setActiveTab('perioperative')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'perioperative'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Pre & Post-Op (Aldrete)</span>
          </button>
          <button
            onClick={() => setActiveTab('wounds')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'wounds'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bandage className="w-3.5 h-3.5 text-amber-500" />
            <span>Wound Care & Staging</span>
          </button>
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'frameworks'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            DAR vs SOAP vs SBAR
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'legal'
                ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Legal & Defensive Charting
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-slate-700 dark:text-slate-300">
          {activeTab === 'abbreviations' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs">High-Risk Safety Notice</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    The Joint Commission's Official "Do Not Use" List applies to all orders and medication-related nursing documentation to prevent fatal errors.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-left divide-y divide-slate-200 dark:divide-slate-800">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-2.5">Do Not Use</th>
                      <th className="px-4 py-2.5">Use Instead</th>
                      <th className="px-4 py-2.5">Clinical Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {DO_NOT_USE_ABBREVIATIONS.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50">
                        <td className="px-4 py-2.5 font-mono font-medium text-rose-700 dark:text-rose-400 line-through">
                          {item.dont}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-800 dark:text-emerald-300">
                          {item.do}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 leading-normal">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'receiving' && (
            <div className="space-y-5">
              {/* JCAHO Bedside Handoff Protocol Banner */}
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-sm text-blue-950 dark:text-blue-100">
                      Joint Commission Bedside Shift Handoff (NPSG.02.05.01)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 uppercase tracking-wider">
                    Hospital Standard
                  </span>
                </div>
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  Shift change handoffs must be conducted <strong>face-to-face at the patient's bedside</strong> with the patient and family invited to participate. This standardized handover provides an interactive opportunity for questioning, establishes co-witnessed accountability, and directly prevents adverse sentinel events.
                </p>
              </div>

              {/* Core 5-Point Bedside Shift Receiving Checklist */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 bg-white dark:bg-slate-850">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>The 5-Point Bedside Shift Receiving Safety Checklist</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                      <span>1. Dual Identifiers & Code Status Check</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Co-verify 2 unique patient identifiers (Full Name & DOB) against the barcode wristband. Verbally confirm resuscitation status (<strong>Full Code</strong> vs <strong>DNR / DNI / Comfort Care</strong>) and verify presence of signed POLST/MOLST in chart.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      <span>2. Dual-RN High-Alert Infusion Tracing</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Physically trace every IV line from fluid bag → smart pump channel → patient catheter. Perform independent double-check on high-alert medications (Heparin, Insulin, PCA Narcotics, Vasopressors) comparing pump programming to EHR orders.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      <span>3. Co-Witnessed Arrival Skin Inspection</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Turn patient to inspect high-risk bony prominences (sacrum, coccyx, ischial tuberosities, heels). Immediately document any pre-existing blanchable/non-blanchable erythema or deep tissue injury to prevent improper attribution of hospital-acquired pressure injuries (HAPIs).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-800/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                      <span>4. Drains, Tubes & Output Verification</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      Inspect all active drainage devices: Foley catheter (dependent below bladder, zero loops, urine color/volume), surgical drains (JP/Hemovac negative pressure suction bulbs active), chest tubes (water seal level, absence of air leak), and NG/feeding tubes.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>5. Environmental Safety & Resuscitation Equipment</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Bed locked in lowest position, bed alarm armed and tested, call bell placed directly in patient's dominant hand, and path to commode clear of tripping hazards. Verify operational emergency wall suction (Yankauer connected) and emergency 100% O2 flowmeter with mask at bedside.
                  </p>
                </div>
              </div>

              {/* SBAR & IPASS Shift Handoff Framework */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2.5 bg-white dark:bg-slate-850">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Standardized Shift Handoff Structure (SBAR / IPASS)
                </h4>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shrink-0">
                      S
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Situation:</strong> Patient name, age, room/bed number, code status, attending physician, and primary admission diagnosis.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 shrink-0">
                      B
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Background:</strong> Pertinent medical history, surgical procedures performed, hospital day / post-op day, baseline functional mobility, and allergy profile.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shrink-0">
                      A
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Assessment:</strong> Current vital signs and telemetry rhythm, neurological status, oxygen requirement, pain score and last analgesic given, input/output totals, and response to previous shift interventions.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                      R
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Recommendation / Plan:</strong> Pending morning blood draws, scheduled diagnostic imaging, anticipated physician rounding, physical therapy schedule, medication due times, and discharge planning criteria.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pain_fever' && (
            <div className="space-y-5">
              {/* Pain Assessment & Reassessment Standards Banner */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-bold text-sm text-amber-950 dark:text-amber-100">
                      Joint Commission Pain Documentation & Mandatory Reassessment Standard
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Mandatory Standard
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                  Every patient has the fundamental right to pain assessment and management. When an analgesic or non-pharmacologic intervention is administered, hospital accreditation standards require timely documented reassessment: <strong>15–30 minutes for IV analgesics</strong> and <strong>45–60 minutes for oral analgesics</strong>, including respiratory rate and sedation scoring.
                </p>
              </div>

              {/* Pain Assessment (PQRST & Scales) */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 bg-white dark:bg-slate-850">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Comprehensive Pain Assessment & Scales</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">PQRST Pain Assessment Method:</span>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>P (Provocation/Palliation):</strong> What brings it on? What makes it better or worse?</li>
                      <li>• <strong>Q (Quality):</strong> Sharp, dull, throbbing, burning, aching, shooting, cramping.</li>
                      <li>• <strong>R (Region/Radiation):</strong> Anatomical site, localized vs radiating pathway.</li>
                      <li>• <strong>S (Severity):</strong> Rated on validated scale (0–10 numeric, FACES, CPOT).</li>
                      <li>• <strong>T (Timing):</strong> Constant, intermittent, acute onset vs chronic duration.</li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Validated Pain Scoring Scales:</span>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-300">
                      <li>• <strong>0–10 Numeric Rating Scale (NRS):</strong> For cognitively intact verbal adults.</li>
                      <li>• <strong>Wong-Baker FACES:</strong> Visual representation for pediatric or language barriers.</li>
                      <li>• <strong>CPOT / PAINAD:</strong> Critical-Care Pain Observation Tool or Dementia scale: evaluates facial expression, body tension, ventilator compliance, and vocalization.</li>
                      <li>• <strong>Functional Target:</strong> Always establish patient's acceptable comfort goal (e.g., ≤ 3/10).</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pasero Opioid-Induced Sedation Scale (POSS) */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 bg-white dark:bg-slate-850">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Pasero Opioid-Induced Sedation Scale (POSS)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Sedation precedes respiratory depression</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px]">
                  <div className="p-2 rounded border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="font-bold text-emerald-700 dark:text-emerald-300">S = Sleep</div>
                    <p className="text-[10px] text-emerald-900 dark:text-emerald-200 mt-0.5">Easy to arouse. Acceptable; no action needed.</p>
                  </div>
                  <div className="p-2 rounded border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="font-bold text-emerald-700 dark:text-emerald-300">1 = Awake</div>
                    <p className="text-[10px] text-emerald-900 dark:text-emerald-200 mt-0.5">Alert and oriented. Acceptable; may increase dose if indicated.</p>
                  </div>
                  <div className="p-2 rounded border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="font-bold text-emerald-700 dark:text-emerald-300">2 = Slightly Drowsy</div>
                    <p className="text-[10px] text-emerald-900 dark:text-emerald-200 mt-0.5">Easily aroused. Acceptable; safe to maintain dose.</p>
                  </div>
                  <div className="p-2 rounded border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20">
                    <div className="font-bold text-amber-700 dark:text-amber-300">3 = Unacceptable</div>
                    <p className="text-[10px] text-amber-900 dark:text-amber-200 mt-0.5">Drifts off mid-conversation. Reduce opioid dose 25–50%, notify MD.</p>
                  </div>
                  <div className="p-2 rounded border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20">
                    <div className="font-bold text-rose-700 dark:text-rose-300">4 = Somnolent</div>
                    <p className="text-[10px] text-rose-900 dark:text-rose-200 mt-0.5">Minimal/no response. STOP opioid, call RRT, consider Naloxone 0.4mg.</p>
                  </div>
                </div>
              </div>

              {/* Acute Fever Spike & Sepsis 1-Hour Bundle Banner */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h3 className="font-bold text-sm text-rose-950 dark:text-rose-100">
                      Acute Fever Spike & Sepsis Surveillance Protocol (1-Hour Bundle)
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 uppercase tracking-wide">
                    Surviving Sepsis
                  </span>
                </div>
                <p className="text-xs text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                  Temperature spikes (≥ 38.0°C / 100.4°F) or hypothermia (&lt; 36.0°C / 96.8°F) accompanied by tachycardia, tachypnea, or hypotension are red flags for sepsis. Every minute matters: initiate screening and complete the Surviving Sepsis 1-Hour Bundle.
                </p>
              </div>

              {/* Sepsis Screening & Dual Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-white dark:bg-slate-850 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>SIRS Criteria (≥ 2 Positive):</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    <li>• <strong>Core Temp:</strong> &gt; 38.0°C (100.4°F) or &lt; 36.0°C (96.8°F).</li>
                    <li>• <strong>Heart Rate:</strong> &gt; 90 beats per minute.</li>
                    <li>• <strong>Respiratory Rate:</strong> &gt; 20 breaths per minute or PaCO2 &lt; 32 mmHg.</li>
                    <li>• <strong>WBC:</strong> &gt; 12,000/µL, &lt; 4,000/µL, or &gt; 10% immature band forms.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 bg-white dark:bg-slate-850 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <Activity className="w-3.5 h-3.5 text-rose-500" />
                    <span>qSOFA Bedside Score (≥ 2 High Risk):</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    <li>• <strong>Respiratory Rate:</strong> ≥ 22 breaths per minute (1 pt).</li>
                    <li>• <strong>Altered Mentation:</strong> GCS &lt; 15, acute confusion, or agitation (1 pt).</li>
                    <li>• <strong>Systolic BP:</strong> ≤ 100 mmHg (1 pt).</li>
                    <li>• <em>Note:</em> Score ≥ 2 outside the ICU flags high mortality risk; alert provider STAT.</li>
                  </ul>
                </div>
              </div>

              {/* Surviving Sepsis Campaign 1-Hour Bundle Checklist */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2.5 bg-white dark:bg-slate-850">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Surviving Sepsis 1-Hour Clinical Actions Checklist
                </h4>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shrink-0">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Draw STAT Serum Lactate:</strong> Remeasure within 2–4 hours if initial level is &gt; 2.0 mmol/L to guide fluid response.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 shrink-0">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Obtain Blood Cultures x 2 Sets PRIOR to Antibiotics:</strong> Collect sterilely from 2 distinct anatomical venipuncture sites. Do not delay antibiotic administration past 45–60 min if blood draws are challenging.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Administer Empiric Broad-Spectrum IV Antibiotics:</strong> Infuse immediately upon completion of culture draws per physician orders.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shrink-0">
                      4
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Rapid Crystalloid Resuscitation (30 mL/kg):</strong> Begin rapid infusion for hypotension (MAP &lt; 65 mmHg) or serum lactate ≥ 4.0 mmol/L within 3 hours.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 shrink-0">
                      5
                    </span>
                    <div>
                      <strong className="text-slate-900 dark:text-white">Antipyretic Administration & Cooling Precautions:</strong> Give prescribed Acetaminophen (650–1000 mg PO/IV). Remove heavy blankets, provide light sheet. <em>Caution:</em> Never apply ice packs directly to skin that cause severe shivering, as shivering increases metabolic oxygen consumption by 200–300%.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cardiac' && (
            <div className="space-y-5">
              {/* Acute Chest Pain & 10-Minute ECG Protocol Banner */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h3 className="font-bold text-sm text-rose-950 dark:text-rose-100">
                      Acute Chest Pain (ACS) Evaluation & The 10-Minute ECG Rule
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                    AHA / ACC Guideline
                  </span>
                </div>
                <p className="text-[11px] text-rose-800 dark:text-rose-300">
                  Every patient with acute non-traumatic chest discomfort requires a STAT 12-lead ECG obtained and interpreted within 10 minutes of initial report.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-rose-200/80 dark:border-rose-900/60">
                    <span className="font-bold text-rose-900 dark:text-rose-300 block">P - Provocation / Palliation</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">What provoked it (rest vs exertion)? What relieves or worsens it (rest, nitro, position change)?</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-rose-200/80 dark:border-rose-900/60">
                    <span className="font-bold text-rose-900 dark:text-rose-300 block">Q - Quality & Character</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Crushing pressure, tightness, squeezing, heaviness ("elephant on chest") vs sharp/pleuritic/burning.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-rose-200/80 dark:border-rose-900/60">
                    <span className="font-bold text-rose-900 dark:text-rose-300 block">R - Radiation & Region</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Substernal radiating to left jaw, neck, left shoulder/inner arm, epigastrium, or interscapular back.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-rose-200/80 dark:border-rose-900/60">
                    <span className="font-bold text-rose-900 dark:text-rose-300 block">S & T - Severity & Timing</span>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">0-10 numeric scale. Exact time of onset, continuous vs intermittent, and response to each intervention.</p>
                  </div>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded border border-rose-200 dark:border-rose-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-rose-700 dark:text-rose-300">Critical Nitroglycerin Safety Check:</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    Before administering sublingual Nitroglycerin (0.4 mg q5m up to 3 doses), verify: <strong>1)</strong> SBP &gt; 90-100 mmHg; <strong>2)</strong> Zero PDE-5 inhibitor use (Sildenafil / Vardenafil in past 24 hours, or Tadalafil in past 48 hours) to prevent fatal refractory cardiovascular collapse; <strong>3)</strong> No suspected right ventricular infarction (inferior STEMI with clear lungs &amp; hypotension).
                  </p>
                </div>
              </div>

              {/* Acute Shortness of Breath & Respiratory Distress Triage */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-500" />
                    <span>Acute Shortness of Breath &amp; Respiratory Distress Escalation</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                    Rapid Response Priority
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Immediate Bedside Interventions
                    </h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <li><strong>High Fowler's Position:</strong> Elevate head of bed to 80–90° or orthopneic tripod posture to maximize diaphragmatic excursion and ease work of breathing.</li>
                      <li><strong>Oxygen Escalation:</strong> Apply Non-Rebreather Mask (NRB) at 12–15 L/min with reservoir bag confirmed inflated, or initiate High-Flow Nasal Cannula (HFNC) / BiPAP.</li>
                      <li><strong>Speech Dyspnea Grading:</strong> Document if patient speaks in full sentences, partial phrases, or 1–2 word gasps (severe impending respiratory exhaustion).</li>
                      <li><strong>Activate RRT:</strong> Call Medical Rapid Response Team immediately for RR &gt; 28, SpO2 &lt; 90% despite O2, accessory muscle use, or acute confusion.</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      Etiology &amp; Lung Sound Differentiation
                    </h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <li><strong>Pulmonary Edema (Cardiogenic):</strong> Bilateral diffuse crackles/rales, tachypnea, orthopnea, pink frothy sputum. Interventions: IV loop diuretics (Lasix), vasodilators, BiPAP.</li>
                      <li><strong>Bronchospasm (COPD / Asthma):</strong> Expiratory wheezes, prolonged expiratory phase, hyperinflated chest. Interventions: inhaled beta-agonists (Albuterol), anticholinergics, systemic steroids.</li>
                      <li><strong>Pneumothorax:</strong> Unilateral absent or diminished breath sounds, tracheal deviation, pleuritic chest pain. Prepare for STAT needle decompression / chest tube.</li>
                      <li><strong>STAT Diagnostics:</strong> STAT Portable Chest X-Ray (CXR), STAT Arterial Blood Gas (ABG), 12-lead ECG, troponin, and BNP.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Cardiac Cath Lab / Coronary Angiogram Safety Standards */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <span>Coronary Angiogram / Cath Lab Pre &amp; Post Nursing Protocols</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Vascular Access Safety
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Pre-Catheterization Checklist</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      • Signed informed consent on chart.<br />
                      • Strictly NPO verified (&gt;6h solids).<br />
                      • Contrast/shellfish allergy screening.<br />
                      • Renal labs (Cr/eGFR) &amp; pre-hydration.<br />
                      • <strong>Allen's Test:</strong> verify patent ulnar collateral circulation (&lt;5s refill).<br />
                      • Mark pedal pulses (DP/PT) with skin marker.<br />
                      • <strong>Metformin:</strong> hold morning of and 48 hours post-contrast.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Radial TR Band Decompression</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      • Verify patent hemostasis (radial pulse palpable / pulse ox pleth waveform on thumb).<br />
                      • Maintain air hold for initial 2 hours.<br />
                      • Begin gradual deflation: remove 3–5 mL air every 15 minutes.<br />
                      • If bleeding occurs, reinject 2 mL air and re-check in 30 min.<br />
                      • Keep wrist in neutral position; no pushing or lifting &gt;5 lbs.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Femoral Sheath &amp; Bleed Surveillance</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      • Strict flat supine bedrest (4–6 hours) with leg kept straight.<br />
                      • Neurovascular checks q15m x 4, q30m x 2, q1h x 4.<br />
                      • Palpate groin for hematoma or thrill/bruit.<br />
                      • <strong>Retroperitoneal Bleed Warning:</strong> Unexplained hypotension, tachycardia, pallor, and severe flank or back pain without visible groin bleed. Notify MD STAT.
                    </p>
                  </div>
                </div>
              </div>

              {/* Synchronized Cardioversion & TEE Sedation Safety */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Synchronized Cardioversion &amp; TEE Assist Standards</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    ACLS &amp; Sedation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-amber-700 dark:text-amber-300">Synchronized Cardioversion Essentials:</h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <li><strong>Sync Mode Activated:</strong> Confirm synchronization flags are actively tracking the peak of each R-wave on the monitor to avoid delivering shock during the vulnerable T-wave period (R-on-T induced VFib).</li>
                      <li><strong>Pad Placement:</strong> Anteroposterior (sternum &amp; left infrascapular) or Anterolateral (right upper sternum &amp; left mid-axillary line).</li>
                      <li><strong>Airway Readiness:</strong> Suction canister tested, Bag-Valve-Mask (BVM) connected to 100% O2, and emergency airway equipment at bedside.</li>
                      <li><strong>Post-Shock Care:</strong> 12-lead ECG, assess skin under pads for thermal burns, vital signs q15m, monitor for dysrhythmias.</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-purple-700 dark:text-purple-300">Transesophageal Echocardiogram (TEE) Assist:</h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <li><strong>Pre-Procedure Check:</strong> Verify NPO status (&gt;6–8 hours), remove dentures/partials, check for loose teeth, assess baseline airway.</li>
                      <li><strong>Pharyngeal Topicalization:</strong> Cetacaine spray / lidocaine gargle to numb posterior pharyngeal reflex; position protective bite block between dental arches.</li>
                      <li><strong>Intra-Procedure Monitoring:</strong> Continuous EtCO2 capnography, pulse oximetry, ECG telemetry, automated NIBP q5m.</li>
                      <li><strong>Post-Procedure Gag Reflex Protocol:</strong> Patient remains STRICTLY NPO until pharyngeal topicalization resolves and gag reflex is physically verified with a tongue depressor (typically 60–90 min post-procedure) to prevent aspiration pneumonia.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'procedures' && (
            <div className="space-y-5">
              {/* Universal Protocol / Bedside Time-Out Banner */}
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-sm text-blue-950 dark:text-blue-100">
                    JCAHO Universal Protocol for Bedside Invasive Procedures
                  </h3>
                </div>
                <p className="text-xs text-blue-900/90 dark:text-blue-200 leading-relaxed">
                  The Joint Commission mandates the Universal Protocol for all invasive bedside procedures (Thoracentesis, Paracentesis, Lumbar Puncture, Chest Tube, Bone Marrow Biopsy):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-blue-200/80 dark:border-blue-900/60">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block">1. Pre-Procedure Verification</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Verify signed consent, patient identity (2 IDs), relevant imaging, coagulopathy labs (INR/Platelets), and allergy history.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-blue-200/80 dark:border-blue-900/60">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block">2. Surgical Site Marking</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Licensed practitioner marks the intended site/laterality with patient awake and alert prior to sterile prepping.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-blue-200/80 dark:border-blue-900/60">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block">3. Time-Out Immediately Prior</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Conducted immediately before needle puncture or skin incision. Active verbal agreement by all team members is mandatory.</p>
                  </div>
                </div>
              </div>

              {/* Enteral & NG Tube Placement Standards */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Nasogastric (NG/OG) Tube Verification Standards (ASPEN / AACN)</span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Patient Safety Gold Standard
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">Recommended Placement Checks:</h4>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                      <li><strong>NEX Length:</strong> Measure Nose to Earlobe to Xiphoid process; mark with indelible ink.</li>
                      <li><strong>pH Testing:</strong> Gastric aspirate pH ≤ 5.5 confirms gastric placement (pH &gt; 6 indicates small bowel or respiratory tract).</li>
                      <li><strong>KUB X-Ray:</strong> Gold standard for all small-bore feeding tubes. Tip must be visualized in stomach or duodenum past GE junction.</li>
                      <li><strong>Zero Feeds/Meds:</strong> Never administer medication or feeding before formal radiographic sign-off.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg space-y-1.5">
                    <h4 className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Obsolete & Unsafe Practices:</span>
                    </h4>
                    <ul className="list-disc list-inside text-[11px] text-rose-800 dark:text-rose-300 space-y-1">
                      <li><strong>Auscultation of Air Bolus ("Whoosh Test"):</strong> Strictly discouraged. Air introduced into the pharynx, esophagus, or lung can mimic gastric sounds.</li>
                      <li><strong>Bubbling under Water:</strong> Unreliable; stomach gas can bubble while a bronchially placed tube may not if occluded.</li>
                      <li><strong>Visual Appearance Alone:</strong> Gastric secretions can resemble pleural fluid.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Diagnostic Blood Culture Standard & Vascular Bundles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Blood Culture Protocols */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Syringe className="w-3.5 h-3.5 text-purple-500" />
                    <span>Blood Culture Collection (CLSI Standards)</span>
                  </h4>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>2 Distinct Sites:</strong> Draw 2 separate venipuncture sets from different anatomical sites to differentiate true bacteremia from skin flora contamination.</li>
                    <li><strong>30s CHG Friction:</strong> Scrub with 2% CHG in 70% IPA for 30 seconds; let air dry completely for 60 seconds. Do not re-palpate vein.</li>
                    <li><strong>Volume Matters:</strong> Inoculate 8–10 mL per bottle (20 mL per set). Underfilling causes false negatives; overfilling causes false positives.</li>
                    <li><strong>Order of Draw:</strong> Inoculate Aerobic bottle first, followed by Anaerobic bottle.</li>
                  </ul>
                </div>

                {/* Vascular & Port Safety */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                    <span>Central Line & Port Access Protocols</span>
                  </h4>
                  <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <li><strong>Sterile Non-Coring Huber:</strong> Always use non-coring safety needles at strict 90° for port access. Standard hypodermic needles core and ruin the septum.</li>
                    <li><strong>Pulsatile Flush:</strong> Use push-pause flush technique to create turbulent flow and clear intraluminal fibrin.</li>
                    <li><strong>BioPatch Orientation:</strong> Chlorhexidine sponge placed blue-side up directly against the catheter exit site.</li>
                    <li><strong>Heparin Lock:</strong> Lock port upon de-access with 100 units/mL Heparin sodium solution under positive pressure.</li>
                  </ul>
                </div>
              </div>

              {/* Chest Thoracostomy & Pleural Drainage Systems */}
              <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-lg space-y-2 text-xs">
                <h4 className="font-bold text-sky-950 dark:text-sky-100 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-sky-600" />
                  <span>Pleural Drainage & Chest Tube Safety Rules</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-sky-900 dark:text-sky-200">
                  <div className="bg-white/80 dark:bg-slate-900 p-2 rounded border border-sky-200/60 dark:border-sky-900/60">
                    <strong>Canister Position:</strong> Keep unit upright below chest level at all times to prevent siphoning fluid back into pleural space.
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900 p-2 rounded border border-sky-200/60 dark:border-sky-900/60">
                    <strong>Tidaling vs Air Leak:</strong> Water seal tidaling with respiration confirms patency. Continuous bubbling indicates air leak in patient or system.
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900 p-2 rounded border border-sky-200/60 dark:border-sky-900/60">
                    <strong>Bedside Safety Gear:</strong> Keep 2 rubber-shod Kelly clamps, bottle of sterile water, and petrolatum (Xeroform) gauze at head of bed at all times.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pressure' && (
            <div className="space-y-5">
              {/* Braden Scale Summary */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-850/40 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Braden Scale Risk Stratification</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">6 Subscales: Sensory, Moisture, Activity, Mobility, Nutrition, Friction/Shear</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-rose-200 dark:border-rose-900/60">
                    <span className="font-bold text-rose-700 dark:text-rose-400 block">≤ 9 Score</span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Very High Risk</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Air-loss mattress, q2h turns, silicone barrier, heel boots.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-amber-200 dark:border-amber-900/60">
                    <span className="font-bold text-amber-700 dark:text-amber-400 block">10 – 12 Score</span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">High Risk</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">30° tilt schedule, foam dressings, moisture barrier.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-yellow-200 dark:border-yellow-900/60">
                    <span className="font-bold text-yellow-700 dark:text-yellow-400 block">13 – 14 Score</span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Moderate Risk</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Pressure reduction surface, heel offloading.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-teal-200 dark:border-teal-900/60">
                    <span className="font-bold text-teal-700 dark:text-teal-400 block">15 – 18 Score</span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Mild Risk</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Regular turning, skin hydration, mobility encouragement.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-emerald-200 dark:border-emerald-900/60">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block">19 – 23 Score</span>
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">Low / No Risk</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Standard clinical routine nursing care.</p>
                  </div>
                </div>
              </div>

              {/* NPIAP Pressure Injury Staging */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Pressure Injury Staging (NPIAP Standards)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Stage 1: Non-Blanchable Erythema</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Intact skin with localized area of non-blanchable redness. Presence of blanchable erythema or changes in sensation/temperature may precede.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Stage 2: Partial-Thickness Skin Loss</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Loss of epidermis with exposed viable dermis. Wound bed is viable, pink/red, moist; may also present as an intact or ruptured serum-filled blister.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Stage 3: Full-Thickness Skin Loss</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Full-thickness loss; adipose (fat) is visible in the ulcer. Granulation tissue and epibole (rolled wound edges) often present. Slough/eschar may be visible.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Stage 4: Full-Thickness Skin & Tissue Loss</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Directly palpable or visible fascia, muscle, tendon, ligament, cartilage, or bone. Slough, eschar, undermining, and tunneling often occur.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Deep Tissue Pressure Injury (DTPI)</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Intact or non-intact skin with localized area of persistent, non-blanchable deep red, maroon, or purple discoloration, or epidermal separation revealing a dark wound bed.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Unstageable Pressure Injury</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Full-thickness skin and tissue loss in which the extent of tissue damage within the ulcer cannot be confirmed because it is obscured by slough or eschar.</p>
                  </div>
                </div>
              </div>

              {/* Positioning & Suctioning Clinical Safety Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-teal-900 dark:text-teal-200">Positioning & 30° Tilt Protocol</h4>
                  <ul className="list-disc list-inside text-[11px] text-teal-800 dark:text-teal-300 space-y-1">
                    <li>Maintain 30° lateral tilt with wedge; avoid direct 90° pressure on greater trochanter.</li>
                    <li>Float heels completely off bed using suspension boots or calf pillows.</li>
                    <li>Limit HOB to 30° or lower during rest to reduce sacral shear and friction.</li>
                    <li>Inspect skin over all bony prominences at every scheduled 2-hour turn.</li>
                  </ul>
                </div>

                <div className="p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-lg space-y-1.5">
                  <h4 className="font-bold text-sky-900 dark:text-sky-200">Airway Suctioning Parameters</h4>
                  <ul className="list-disc list-inside text-[11px] text-sky-800 dark:text-sky-300 space-y-1">
                    <li>Pre-oxygenate with 100% FiO2 for 1-2 minutes prior to deep suctioning.</li>
                    <li>Suction pressure: 80–120 mmHg for adults (max 150 mmHg in emergencies).</li>
                    <li>Limit catheter pass duration to &lt; 10–15 seconds to prevent hypoxia.</li>
                    <li>Monitor continuous SpO2 and ECG for vagal bradycardia or arrhythmias.</li>
                  </ul>
                </div>
              </div>

              {/* Mechanical Ventilation & VAP Bundle Standards */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Mechanical Ventilation & VAP Prevention Bundle</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">IHI & CDC Evidence-Based Standards</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">1. Airway & Cuff Pressure</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Maintain cuff pressure at <strong>20–30 cmH2O</strong> using manometer q shift to avoid tracheal ischemia (&gt;30) or micro-aspiration (&lt;20). Document depth at incisors.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">2. VAP Prevention Bundle</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Keep HOB 30°–45° continuously. Chlorhexidine 0.12% oral rinse q12h. Subglottic suctioning. Daily sedation vacation (SAT). DVT & PUD prophylaxis.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">3. Weaning & SBT Criteria</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Rapid Shallow Breathing Index (RSBI = f/Vt) <strong>&lt; 105</strong> indicates extubation readiness. Verify adequate cough, alert sensorium (RASS 0), and stable ABG.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'megacode' && (
            <div className="space-y-5">
              {/* High-Quality CPR Core Standards Banner */}
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
                <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs">AHA / ERC High-Quality CPR & Mega Code Quality Benchmarks</h3>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 mt-0.5">
                    Chest compressions must be <strong>100–120 bpm</strong> at a depth of <strong>5–6 cm (2–2.4 in)</strong> with complete recoil and minimal interruptions (&lt;10s). Switch compressors <strong>every 2 minutes</strong> at rhythm checks to prevent fatigue.
                  </p>
                </div>
              </div>

              {/* Shockable vs Non-Shockable ACLS Pathways */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Shockable: VF / Pulseless VT */}
                <div className="border border-rose-200 dark:border-rose-900/60 rounded-lg p-3.5 bg-rose-50/40 dark:bg-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      Shockable: VFib & Pulseless VT
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 uppercase">
                      Defibrillate STAT
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                    <li><strong>Shock #1:</strong> 120–200J Biphasic (or device max). Resume CPR immediately without pulse check.</li>
                    <li><strong>CPR 2 min:</strong> Establish IV/IO access.</li>
                    <li><strong>Shock #2:</strong> 200J Biphasic. Resume CPR immediately.</li>
                    <li><strong>Epinephrine:</strong> 1 mg IV/IO push (1:10,000) every 3–5 min with 20 mL saline flush and arm elevation.</li>
                    <li><strong>Shock #3:</strong> 200J Biphasic. Resume CPR immediately.</li>
                    <li><strong>Amiodarone:</strong> 1st dose <strong>300 mg</strong> IV/IO push; 2nd dose <strong>150 mg</strong> IV push (or Lidocaine 1–1.5 mg/kg 1st, 0.5–0.75 mg/kg 2nd).</li>
                  </ul>
                </div>

                {/* Non-Shockable: Asystole & PEA */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Non-Shockable: Asystole & PEA
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      CPR & H's / T's
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-slate-700 dark:text-slate-300 space-y-1 leading-relaxed">
                    <li><strong>Do NOT Defibrillate:</strong> Shocks do not restart asystole and delay perfusion.</li>
                    <li><strong>Epinephrine ASAP:</strong> Administer 1 mg IV/IO push immediately upon arrest recognition; repeat q3–5 min.</li>
                    <li><strong>CPR 2 min cycles:</strong> Minimize pauses to &lt;5s for rhythm/pulse checks. Verify asystole in 2 leads.</li>
                    <li><strong>Advanced Airway:</strong> ETT or supraglottic (i-gel) with continuous waveform capnography (ETCO2). 1 breath q6s.</li>
                    <li><strong>Investigate Reversible Causes:</strong> Search aggressively for 5 H's and 5 T's (especially Hypoxia, Hypovolemia, Hyperkalemia).</li>
                  </ul>
                </div>
              </div>

              {/* Reversible Causes: 5 H's & 5 T's Differential Checklist */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reversible Causes: The 5 H's and 5 T's</h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Essential ACLS Differential Checklist</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400">The 5 H's</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                      <li><strong>Hypovolemia:</strong> Rapid crystalloid pressure bolus; check surgical sites.</li>
                      <li><strong>Hypoxia:</strong> 100% FiO2, verify ETT placement via capnography.</li>
                      <li><strong>Hydrogen Ion (Acidosis):</strong> Hyperventilation, Sodium Bicarbonate.</li>
                      <li><strong>Hypo / Hyperkalemia:</strong> STAT ABG/i-STAT, Calcium Gluconate/Chloride, Insulin/D50.</li>
                      <li><strong>Hypothermia:</strong> Active warm blankets, warmed IV fluids.</li>
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">The 5 T's</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                      <li><strong>Tension Pneumothorax:</strong> Emergent needle decompression / finger thoracostomy.</li>
                      <li><strong>Tamponade (Cardiac):</strong> Bedside POCUS, emergent pericardiocentesis.</li>
                      <li><strong>Toxins:</strong> Antidotes (Naloxone, Flumazenil, Digibind, Glucagon).</li>
                      <li><strong>Thrombosis (Pulmonary - PE):</strong> POCUS RV strain, consider tPA / Alteplase.</li>
                      <li><strong>Thrombosis (Coronary - STEMI):</strong> Immediate post-ROSC Cath Lab activation.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Nurse Recorder & Code Documentation Gold Rules */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recorder Nurse: Legal & Clinical Documentation Pearls</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">1. Synchronize Clocks</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Set code recorder time to the exact defibrillator monitor clock. Record exact military time of every rhythm check, shock Joules, and drug push.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">2. Vocalize Timing</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Announce: "30 seconds left in CPR cycle", "Compressor switch", "Epi due in 1 minute". State aloud: "Epinephrine 1 mg given at 14:26."</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">3. Monitor ETCO2 for ROSC</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">CPR goal ETCO2 &gt; 15–20 mmHg. A sudden persistent jump to <strong>&gt; 35–40 mmHg</strong> is the earliest indicator of ROSC before pulse check!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perioperative' && (
            <div className="space-y-5">
              {/* Universal Protocol Banner */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-lg text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs">The Joint Commission Universal Protocol for Preventing Wrong Site, Wrong Procedure, Wrong Person Surgery™</h3>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300 mt-0.5">
                    Universal Protocol requires 3 mandatory phases: <strong>1. Pre-Procedure Verification</strong> (identity, consent, history, diagnostic tests), <strong>2. Surgical Site Marking</strong> (marked at surgical site with surgeon initials, patient awake and involved), and <strong>3. Time-Out</strong> immediately before skin incision.
                  </p>
                </div>
              </div>

              {/* Pre-Op Fasting Guidelines & SCIP Standards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* ASA Fasting (NPO) Guidelines */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">ASA Pre-Operative Fasting Guidelines</span>
                    <span className="text-[10px] font-semibold text-slate-500">Minimum Fasting</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                    <li className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                      <span>Clear liquids (water, pulp-free juice, black coffee):</span>
                      <strong className="text-teal-700 dark:text-teal-400">≥ 2 hours</strong>
                    </li>
                    <li className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                      <span>Breast milk:</span>
                      <strong className="text-teal-700 dark:text-teal-400">≥ 4 hours</strong>
                    </li>
                    <li className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                      <span>Light meal (toast, non-fatty liquid):</span>
                      <strong className="text-teal-700 dark:text-teal-400">≥ 6 hours</strong>
                    </li>
                    <li className="flex justify-between">
                      <span>Full meal with meat / fatty / fried food:</span>
                      <strong className="text-rose-700 dark:text-rose-400">≥ 8 hours</strong>
                    </li>
                  </ul>
                </div>

                {/* SCIP Surgical Infection Prevention Rules */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">SCIP Infection Prevention Core Measures</span>
                    <span className="text-[10px] font-semibold text-slate-500">Accreditation</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <li>• <strong>Prophylactic Antibiotics:</strong> Must infuse within <strong>60 minutes prior to surgical incision</strong> (120 min for Vancomycin or Fluoroquinolones).</li>
                    <li>• <strong>Hair Removal:</strong> Use electric clippers only; never shave with a razor (causes micro-abrasions that elevate SSI rates).</li>
                    <li>• <strong>Perioperative Normothermia:</strong> Maintain core temperature <strong>≥ 36.0°C</strong> to prevent hypothermia-induced bleeding and wound infection.</li>
                    <li>• <strong>VTE Prophylaxis:</strong> SCDs applied prior to induction of anesthesia.</li>
                  </ul>
                </div>
              </div>

              {/* Modified Aldrete Scoring Reference Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Modified Aldrete Scoring System (PACU Phase I Discharge Benchmark)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">Target Score ≥ 9 / 10</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                  <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2">Parameter</th>
                        <th className="px-3 py-2 text-center">Score 2</th>
                        <th className="px-3 py-2 text-center">Score 1</th>
                        <th className="px-3 py-2 text-center">Score 0</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      <tr>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">1. Activity</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Moves all 4 extremities voluntarily or on command</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Moves 2 extremities voluntarily</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Unable to move extremities (0)</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">2. Respiration</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Breathes deeply and coughs freely</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Dyspneic, shallow, or limited breathing</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Apneic or on mechanical support</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">3. Circulation (BP)</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">BP within ±20% of pre-op baseline</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">BP within ±20%–49% of pre-op baseline</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">BP differs ±50% from baseline</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">4. Consciousness</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Fully awake and oriented x4</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Arousable on calling / verbal stimuli</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Non-responsive to verbal stimuli</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold text-slate-900 dark:text-white">5. O2 Saturation</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Maintains SpO2 &gt; 92% on Room Air</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Needs supplemental O2 to maintain &gt; 90%</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">SpO2 &lt; 90% with supplemental O2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PACU Emergence & Surgical Drain Pearls */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">PACU Phase I Emergence & Drain Assessment Pearls</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">1. Laryngospasm & Stridor</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">High-pitched crowing or silent retraction post-extubation. Apply Larson's notch pressure, 100% positive pressure mask ventilation, prepare Succinylcholine if refractory.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">2. Active Drain Management</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Ensure bulb suction (JP / Hemovac) is compressed and patent. Chart color, viscosity, and quantity. Alert surgeon for fresh sanguinous output <strong>&gt; 100 mL/hr</strong>.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">3. Neurovascular 6 P's</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">For orthopedic and vascular cases: Pain (out of proportion), Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia. Document distal pulses q15min.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wounds' && (
            <div className="space-y-5">
              {/* Wound Assessment & Staging Banner */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Bandage className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xs">WOCN & NPUAP Standardized Wound Assessment & Staging Framework</h3>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Document wounds systematically using the <strong>CLOCK METHOD</strong>: 12:00 is oriented toward patient head, 6:00 toward feet. Always record Length (12–6), Width (9–3), and Depth (deepest point) in centimeters. Never reverse staging as a pressure injury heals (a healing Stage 4 is charted as "Healing Stage 4 Pressure Injury", not Stage 2).
                  </p>
                </div>
              </div>

              {/* NPUAP Pressure Injury Staging Reference Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">National Pressure Injury Advisory Panel (NPUAP) Staging Guide</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">Gold Standard</span>
                </div>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                  <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <tr>
                        <th className="px-3 py-2">Stage</th>
                        <th className="px-3 py-2">Depth & Anatomical Tissue Involved</th>
                        <th className="px-3 py-2">Clinical Presentation & Key Identifiers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      <tr>
                        <td className="px-3 py-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">Stage 1</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Intact skin with localized non-blanchable erythema</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Blanching absent on finger pressure. Skin may feel warmer, cooler, firmer, or more painful than surrounding tissue.</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">Stage 2</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Partial-thickness loss of skin with exposed dermis</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Wound bed viable, pink/red, moist. May present as intact or ruptured serum-filled blister. Fat, slough, and granulation absent.</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">Stage 3</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Full-thickness loss of skin; adipose (fat) visible</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Granulation tissue and epibole (rolled edges) often present. Slough/eschar may be visible. Fascia, muscle, tendon, and bone are NOT exposed. Undermining/tunneling may occur.</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-slate-900 dark:text-white whitespace-nowrap">Stage 4</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Full-thickness skin & tissue loss with exposed structures</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Directly exposed or palpable fascia, muscle, tendon, ligament, cartilage, or bone. Slough, eschar, epibole, undermining, and tunneling common. High risk of osteomyelitis.</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">Unstageable</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Full-thickness tissue loss obscured by slough or eschar</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Actual depth cannot be determined until slough/eschar is debrided. Stable (dry, adherent, intact, non-erythematous) eschar on heel should NOT be softened or removed!</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-purple-700 dark:text-purple-400 whitespace-nowrap">DTI (Deep Tissue)</td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-300">Persistent non-blanchable deep red, maroon, or purple</td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">Intact skin with localized discoloration, or epidermal separation revealing a dark wound bed or blood-filled blister. Often evolves rapidly into Stage 3 or 4.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Wound Bed Tissue Composition & Clock Orientation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Wound Bed Composition */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Wound Bed Tissue Types (% Must Total 100%)</span>
                    <span className="text-[10px] font-semibold text-slate-500">Visual Exam</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                    <li>• <strong className="text-rose-600 dark:text-rose-400">Granulation (Beefy Red):</strong> Healthy vascular tissue, moist cobblestone surface. Sign of proliferation and healing.</li>
                    <li>• <strong className="text-amber-600 dark:text-amber-400">Slough (Yellow/Tan/Gray):</strong> Moist, stringy, devitalized fibrinous tissue adhering to bed; harbors bioburden. Requires debridement.</li>
                    <li>• <strong className="text-slate-800 dark:text-slate-200">Eschar (Black/Brown):</strong> Leathery, dry necrotic tissue. Obscures depth.</li>
                    <li>• <strong className="text-pink-600 dark:text-pink-400">Epithelialization (Silvery Pink):</strong> Migrating new skin cells from wound perimeter or hair follicles. Fragile; protect from shearing.</li>
                  </ul>
                </div>

                {/* Clock Method & Drainage Characterization */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Undermining, Tunneling & Exudate</span>
                    <span className="text-[10px] font-semibold text-slate-500">Documentation</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                    <li>• <strong>Undermining:</strong> Tissue erosion beneath wound margins. Chart clock range and depth: <em>"Undermining 2.0 cm from 11:00 to 3:00."</em></li>
                    <li>• <strong>Tunneling (Sinus Tract):</strong> Narrow channel extending in one trajectory. Chart direction and depth: <em>"Tunneling 3.5 cm at 2:00."</em></li>
                    <li>• <strong>Exudate Quantity:</strong> Scant (barely moist), Moderate (saturates 25-75% pad), Heavy (100% saturation / strike-through).</li>
                    <li>• <strong>Exudate Type:</strong> Serous (clear/straw), Sanguinous (fresh blood), Serosanguinous (pink/watery), Purulent (thick yellow/green opaque with odor).</li>
                  </ul>
                </div>
              </div>

              {/* Dressing Selection Matrix & Wound VAC Pearls */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dressing Selection Matrix & Negative Pressure (VAC) Pearls</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">Clinical Protocol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">1. Alginate & Hydrofiber</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">For <strong>moderate-to-heavy drainage</strong> and deep cavities (Aquacel Ag, Kaltostat). Absorbs up to 20x its weight, forms cohesive gel. Always pack loosely (80% capacity) and leave a 2 cm retrieval tail.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">2. Foam & Silicone Borders</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">For <strong>exudate management & protection</strong> (Mepilex Border Sacrum, Allevyn). Wicks moisture while protecting periwound skin from maceration. Can remain in place up to 7 days if intact.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-slate-100">3. Wound VAC (NPWT) Rules</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Standard setting: <strong>-125 mmHg continuous</strong>. Trim black GranuFoam strictly to wound margins (never touch intact skin). Mandatory: <strong>Document sponge count (1 in / 1 out)</strong> on dressing label and chart to prevent retained foreign body.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'frameworks' && (
            <div className="space-y-4">
              {CHARTING_FRAMEWORKS.map((fw, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50/40 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{fw.name}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Best for: {fw.bestFor}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {fw.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                        <span className="font-semibold text-teal-700 dark:text-teal-400">{sec.key}</span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{sec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 leading-relaxed">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 rounded-lg flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-teal-900 dark:text-teal-200 text-xs">Cardinal Rule of Nursing Charting</h4>
                  <p className="text-[11px] text-teal-800 dark:text-teal-300 mt-0.5">
                    "If it wasn't charted, it wasn't done." Documentation must be timely, strictly factual, objective, and contemporaneous.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Be Objective & Non-Judgmental:</strong> Record exact observations, measurements, and quotes. Avoid adjectives like "belligerent", "drunk", or "uncooperative". Instead, chart: "Patient shouted 'Leave me alone', attempted to pull out IV line, oriented to self only."
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Never Chart in Advance:</strong> Pre-charting medications, assessments, or interventions is illegal and fraudulent. Chart only after completion.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Close the Loop on Interventions:</strong> Every PRN pain medication, anti-emetic, insulin dose, or fall intervention requires documented evaluation of patient response (e.g. reassessment within 30–60 minutes).
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Document Provider Communications Completely:</strong> When contacting a provider, always chart: time called, method (phone/secure chat), exact clinical data conveyed, provider name, orders received, and state "orders read back and verified."
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Incident Reports Belong Outside the Chart:</strong> Do NOT mention that an incident report / variance report was filed in the medical record. Chart purely the patient assessment, safety measures, vital signs, and provider notification.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-white">Receiving & Transfer-In Safety Protocol:</strong> On patient arrival, always document 2 patient identifiers, baseline arrival vitals, co-witnessed skin check (essential to establish whether any pressure injuries or hematomas existed prior to arrival), line/drain patency, and provider notification of arrival on unit.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
