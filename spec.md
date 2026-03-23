# HealthOS AI — AI Clinical Operating System

## Current State
HealthOS AI is a patient-facing mental health and wellness platform with:
- 12 mental health tools (CBT, ACT, DBT, assessments, journal, sleep analysis, etc.)
- Patient profile (age, gender, profession, goals)
- Sleep intelligence engine with passive detection
- Daily logs, vitals, fitness, nutrition tabs
- Document upload/analysis
- Feedback and wellness stories
- Stripe membership ($20 / 3 months)
- Mobile-optimized UI (hamburger menu + bottom nav)
- Authorization (admin/user roles)
- Blob storage, HTTP outcalls

## Requested Changes (Diff)

### Add
- **Clinical role system**: Doctor, Nurse, Admin (billing), Patient — role selected at login/onboarding
- **Doctor dashboard**: Patient list, SOAP note writer (voice + text), ICD-10 code lookup, prescription drafts, specialty selector (Cardiology, Dermatology, GP, Psychiatry, etc.), confidence scores on AI suggestions, one-click patient summary
- **Nurse dashboard**: Patient vitals entry, follow-up scheduling, task queue
- **Admin/Billing dashboard**: Revenue tracker (daily income, patient trends), billing records, membership overview
- **Patient dashboard**: View prescriptions, reports, follow-up appointments, upload lab documents
- **AI Voice Scribe**: Web Speech API voice-to-structured-note conversion; outputs SOAP format with editable fields and confidence score
- **Predictive analytics**: High-risk patient alerts, follow-up reminder engine, risk score per patient
- **Audit trail**: Every backend write action logged with user principal + timestamp + action description
- **Interoperability UI**: HL7/FHIR integration settings page (connection config, data format display, import/export flows — UI layer for hospital IT wiring)
- **Compliance & Trust page**: HIPAA, AES-256 encryption proof, data residency controls, certifications in progress
- **Offline mode**: Core data cached in localStorage/IndexedDB, app works without internet, syncs on reconnect
- **Positioning layer**: Every dashboard header shows "Time saved / Errors reduced / Revenue increased" KPI strip
- **Security page**: Dedicated /security route with trust signals

### Modify
- Profile setup: add clinical role selection step for new users
- Backend: extend with ClinicalRecord, Prescription, FollowUp, AuditLog, RevenueEntry, PatientNote types
- Navigation: role-aware — doctors see clinical tools, patients see wellness tools, admins see revenue/billing

### Remove
- Nothing removed — all existing patient features preserved

## Implementation Plan
1. Extend Motoko backend with: ClinicalRole type, Patient records, SOAP notes, Prescriptions, FollowUps, AuditLog, RevenueEntries, PredictiveRiskFlags
2. Build role-selection step in onboarding (Doctor / Nurse / Admin / Patient)
3. Build Doctor dashboard: patient list, voice scribe (Web Speech API → SOAP), ICD-10 lookup, prescription drafts, specialty selector, confidence scores
4. Build Nurse dashboard: vitals entry, follow-up scheduling, task list
5. Build Admin/Billing dashboard: revenue chart, billing records, membership stats
6. Build Patient clinical view: prescriptions, reports, follow-ups
7. Predictive analytics engine: risk scoring, high-risk alerts, follow-up reminders
8. Audit trail: log all writes with timestamp/user/action
9. Interoperability UI: HL7/FHIR settings page
10. Compliance/Trust/Security page
11. Offline cache layer: localStorage fallback for critical data
12. KPI positioning strip on all dashboards
