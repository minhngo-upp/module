const PATIENT_DRAFTS_KEY = 'mealClinicPatientDrafts';
const DELETED_PATIENTS_KEY = 'mealClinicDeletedPatientIds';

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function formatNowLabel() {
  return new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function normalizeMealItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [{ dishName: value, calories: 0 }];
}

function formatMealSummary(value) {
  const items = normalizeMealItems(value);
  if (items.length === 0) return '';
  return items.map((item) => item.dishName).filter(Boolean).join(', ');
}

export function getPatientDrafts() {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(PATIENT_DRAFTS_KEY), []);
}

export function getPatientDraft(patientCode) {
  return getPatientDrafts().find((draft) => draft.patientCode === patientCode) ?? null;
}

export function getDeletedPatientIds() {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(DELETED_PATIENTS_KEY), []);
}

export function markPatientDeleted(patientCode) {
  if (typeof window === 'undefined' || !patientCode) return;
  const deletedIds = new Set(getDeletedPatientIds());
  deletedIds.add(patientCode);
  window.localStorage.setItem(DELETED_PATIENTS_KEY, JSON.stringify([...deletedIds]));
}

export function deletePatientDraft(patientCode) {
  if (typeof window === 'undefined' || !patientCode) return;
  const nextDrafts = getPatientDrafts().filter((draft) => draft.patientCode !== patientCode);
  window.localStorage.setItem(PATIENT_DRAFTS_KEY, JSON.stringify(nextDrafts));
  markPatientDeleted(patientCode);
}

export function savePatientDraft(nextDraft) {
  if (typeof window === 'undefined') return nextDraft;
  const withTimestamp = { ...nextDraft, updatedAt: new Date().toISOString() };
  const drafts = getPatientDrafts();
  const nextDrafts = drafts.some((draft) => draft.patientCode === withTimestamp.patientCode)
    ? drafts.map((draft) => (draft.patientCode === withTimestamp.patientCode ? withTimestamp : draft))
    : [withTimestamp, ...drafts];
  window.localStorage.setItem(PATIENT_DRAFTS_KEY, JSON.stringify(nextDrafts));
  window.localStorage.setItem(
    DELETED_PATIENTS_KEY,
    JSON.stringify(getDeletedPatientIds().filter((patientCode) => patientCode !== withTimestamp.patientCode)),
  );
  return withTimestamp;
}

export function generatePatientCode(existingPatients = []) {
  const existingCodes = [
    ...existingPatients.map((patient) => patient.id ?? patient.patientCode).filter(Boolean),
    ...getPatientDrafts().map((draft) => draft.patientCode),
    ...getDeletedPatientIds(),
  ];

  const maxNumber = existingCodes.reduce((max, code) => {
    const match = String(code).match(/BN(\d+)/i);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  return `BN${String(maxNumber + 1).padStart(3, '0')}`;
}

export function createInitialPatientDraft(record) {
  return {
    patientCode: record.patientCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastStepIndex: 0,
    status: record.status,
    completionStatus: 'Chưa hoàn thiện hồ sơ',
    basic: {
      fullName: record.fullName,
      phone: record.phone,
      age: record.age,
      birthDate: record.birthDate,
      gender: record.gender,
      occupation: record.occupation,
      assignedDoctor: record.assignedDoctor,
      currentGoal: '',
    },
    snapshot: {
      priority: record.status === 'Cần chú ý' ? 'Theo dõi sát' : 'Theo dõi định kỳ',
      mainConcern: '',
      todayPriority: '',
      lastUpdated: formatNowLabel(),
    },
    summary: {
      clinicalSummary: '',
      mainProblem: '',
      treatmentGoals: '',
      currentAchievement: '',
    },
    assessment: {
      height: '',
      currentWeight: '',
      bmi: '',
      recentChange: '',
      usualWeight: '',
      muscleStatus: '',
      edema: '',
      supportReason: '',
      mainDifficulty: '',
      motivation: '',
      caregiver: '',
      digestiveSymptoms: '',
      mealTolerance: '',
      chewingSwallowing: '',
      clinicalNote: '',
      labName: '',
      labDate: '',
      labIndicator: '',
      labMeaning: '',
    },
    mealLog: {
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
      water: '',
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
      supplements: '',
      activity: '',
    },
    intervention: {
      cycle: '7 ngày',
      priorityGoal: '',
      operationalWarning: '',
      followUpSuggestion: '',
      clinicalNote: '',
      nextMonitoring: '',
    },
  };
}

export function ensurePatientDraftFromListItem(patient) {
  const patientCode = patient.id ?? patient.patientCode;
  const existingDraft = getPatientDraft(patientCode);
  if (existingDraft) return existingDraft;

  return savePatientDraft(createInitialPatientDraft({
    patientCode,
    fullName: patient.name ?? patient.fullName ?? '',
    phone: patient.phone ?? '',
    age: patient.age === 'N/A' ? '' : patient.age,
    birthDate: patient.birthDate ?? '',
    gender: patient.gender ?? '',
    occupation: patient.occupation ?? '',
    assignedDoctor: patient.doctor ?? patient.assignedDoctor?.name ?? '',
    status: patient.status ?? 'Đang theo dõi',
  }));
}

export function ensurePatientDraftFromDetail(patient) {
  const existingDraft = getPatientDraft(patient.patientCode);
  if (existingDraft) return existingDraft;

  const draft = createInitialPatientDraft({
    patientCode: patient.patientCode,
    fullName: patient.fullName,
    phone: patient.phone ?? '',
    age: patient.age,
    birthDate: '',
    gender: patient.gender,
    occupation: patient.occupation,
    assignedDoctor: patient.assignedDoctor?.name ?? '',
    status: patient.nutritionAssessment?.priority === 'Theo dõi sát' ? 'Cần chú ý' : 'Đang theo dõi',
  });

  return savePatientDraft({
    ...draft,
    basic: {
      ...draft.basic,
      currentGoal: patient.nutritionAssessment?.currentGoal ?? '',
    },
    snapshot: {
      ...draft.snapshot,
      priority: patient.nutritionAssessment?.priority ?? draft.snapshot.priority,
      mainConcern: patient.nutritionAssessment?.mainDiagnosis ?? '',
      todayPriority: patient.nutritionAssessment?.clinicalFocus ?? '',
    },
    summary: {
      ...draft.summary,
      clinicalSummary: patient.nutritionAssessment?.summary ?? '',
      mainProblem: patient.nutritionAssessment?.mainDiagnosis ?? '',
      treatmentGoals: patient.currentState?.[0]?.value ?? '',
      currentAchievement: patient.currentState?.[1]?.value ?? '',
    },
  });
}

export function draftToPatientListItem(draft) {
  return {
    id: draft.patientCode,
    name: draft.basic.fullName,
    age: draft.basic.age || 'N/A',
    gender: draft.basic.gender || 'Chưa nhập',
    phone: draft.basic.phone,
    doctor: draft.basic.assignedDoctor,
    lastVisit: 'Chưa có',
    nextVisit: 'Sắp xếp sau',
    status: draft.completionStatus === 'Hoàn tất hồ sơ' ? draft.status : 'Chưa hoàn thiện hồ sơ',
  };
}

export function buildPatientDetailFromDraft(draft, fallback) {
  if (!draft) return fallback;

  const fullName = draft.basic.fullName || fallback.fullName;
  const nutritionGoal = draft.basic.currentGoal || fallback.nutritionAssessment.currentGoal;
  const mainConcern = draft.snapshot.mainConcern || draft.summary.mainProblem || fallback.nutritionAssessment.mainDiagnosis;
  const todayPriority = draft.snapshot.todayPriority || fallback.nutritionAssessment.clinicalFocus;
  const treatmentGoals = draft.summary.treatmentGoals || fallback.currentState?.[0]?.value;
  const currentAchievement = draft.summary.currentAchievement || fallback.currentState?.[3]?.value;
  const breakfastSummary = formatMealSummary(draft.mealLog.breakfast);
  const snackSummary = formatMealSummary(draft.mealLog.snack);

  return {
    ...fallback,
    patientCode: draft.patientCode,
    fullName,
    gender: draft.basic.gender || fallback.gender,
    age: draft.basic.age || fallback.age,
    occupation: draft.basic.occupation || fallback.occupation,
    avatar: fullName.charAt(0).toUpperCase(),
    assignedDoctor: {
      id: 'draft_doctor',
      name: draft.basic.assignedDoctor || fallback.assignedDoctor.name,
    },
    nutritionAssessment: {
      ...fallback.nutritionAssessment,
      mainDiagnosis: mainConcern,
      clinicalFocus: todayPriority,
      priority: draft.snapshot.priority || fallback.nutritionAssessment.priority,
      currentGoal: nutritionGoal,
      summary: draft.summary.clinicalSummary || fallback.nutritionAssessment.summary,
    },
    riskFlags: draft.snapshot.mainConcern
      ? [
          {
            title: draft.snapshot.priority || 'Theo dõi định kỳ',
            description: draft.snapshot.mainConcern,
            tone: draft.snapshot.priority === 'Theo dõi sát' ? 'danger' : 'warning',
          },
        ]
      : fallback.riskFlags,
    currentState: [
      { label: 'Mục tiêu điều trị', value: treatmentGoals },
      { label: 'Mức đạt hiện tại', value: currentAchievement },
      { label: 'Nước uống', value: draft.mealLog.water || fallback.currentState?.[2]?.value },
      { label: 'Chu kỳ can thiệp', value: draft.intervention.cycle || '7 ngày' },
    ],
    basicInfoSections: [
      {
        title: 'Định danh chuyên môn',
        description: 'Những thông tin nền cần cho đánh giá và can thiệp dinh dưỡng.',
        items: [
          { label: 'Họ và tên', value: fullName },
          { label: 'Tuổi', value: draft.basic.age || fallback.age },
          { label: 'Giới', value: draft.basic.gender || fallback.gender },
          { label: 'Nghề nghiệp', value: draft.basic.occupation || fallback.occupation },
        ],
      },
      {
        title: 'Bối cảnh dinh dưỡng',
        description: 'Thông tin tóm tắt từ hồ sơ nhập tay.',
        items: [
          { label: 'Lý do cần hỗ trợ', value: draft.assessment.supportReason || 'Chưa nhập' },
          { label: 'Khó khăn chính', value: draft.assessment.mainDifficulty || 'Chưa nhập' },
          { label: 'Động lực hợp tác', value: draft.assessment.motivation || 'Chưa nhập' },
          { label: 'Người hỗ trợ', value: draft.assessment.caregiver || 'Chưa nhập' },
        ],
      },
    ],
    symptoms: [
      { label: 'Triệu chứng tiêu hóa', value: draft.assessment.digestiveSymptoms || 'Chưa nhập' },
      { label: 'Dung nạp bữa ăn', value: draft.assessment.mealTolerance || 'Chưa nhập' },
      { label: 'Khả năng nhai nuốt', value: draft.assessment.chewingSwallowing || 'Chưa nhập' },
      { label: 'Lưu ý lâm sàng', value: draft.assessment.clinicalNote || 'Chưa nhập' },
    ],
    anthropometrics: {
      ...fallback.anthropometrics,
      height: draft.assessment.height || fallback.anthropometrics.height,
      currentWeight: draft.assessment.currentWeight || fallback.anthropometrics.currentWeight,
      bmi: draft.assessment.bmi || fallback.anthropometrics.bmi,
      usualWeight: draft.assessment.usualWeight || fallback.anthropometrics.usualWeight,
      weightChange: draft.assessment.recentChange || fallback.anthropometrics.weightChange,
      muscleStatus: draft.assessment.muscleStatus || fallback.anthropometrics.muscleStatus,
      edema: draft.assessment.edema || fallback.anthropometrics.edema,
    },
    dietLogSummary: {
      ...fallback.dietLogSummary,
      averageCalories: draft.mealLog.calories ? `${draft.mealLog.calories} kcal/ngày` : fallback.dietLogSummary.averageCalories,
      hydration: draft.mealLog.water || fallback.dietLogSummary.hydration,
      highlights: [
        breakfastSummary ? `Bữa sáng: ${breakfastSummary}` : fallback.dietLogSummary.highlights?.[0],
        snackSummary ? `Bữa phụ: ${snackSummary}` : fallback.dietLogSummary.highlights?.[1],
        draft.mealLog.activity || fallback.dietLogSummary.highlights?.[2],
      ].filter(Boolean),
    },
    interventionPlan: {
      ...fallback.interventionPlan,
      goals: [
        draft.intervention.priorityGoal || fallback.interventionPlan.goals?.[0],
        draft.intervention.operationalWarning || fallback.interventionPlan.goals?.[1],
        draft.intervention.nextMonitoring || fallback.interventionPlan.goals?.[2],
      ].filter(Boolean),
      recommendations: [
        draft.intervention.followUpSuggestion || fallback.interventionPlan.recommendations?.[0],
        draft.intervention.clinicalNote || fallback.interventionPlan.recommendations?.[1],
        fallback.interventionPlan.recommendations?.[2],
      ].filter(Boolean),
    },
  };
}
