// Mock Data Contract based on PRD + SRS

export const carePlanMockDB = {
  meals: [
    { id: 'm1', name: 'Phở bò chín (ít bánh)', calories: 350 },
    { id: 'm2', name: 'Cơm gạo lứt (1 chén)', calories: 150 },
    { id: 'm3', name: 'Ức gà luộc (100g)', calories: 165 },
    { id: 'm4', name: 'Salad cá ngừ', calories: 250 },
    { id: 'm5', name: 'Sữa chua không đường', calories: 60 },
    { id: 'm6', name: 'Táo mỹ (1 quả)', calories: 95 },
    { id: 'm7', name: 'Chuối già (1 quả)', calories: 105 },
    { id: 'm8', name: 'Bánh mì đen (2 lát) & Trứng', calories: 210 },
    { id: 'm9', name: 'Súp măng tây', calories: 120 }
  ],
  medicines: [
    { id: 'd1', name: 'Metformin 500mg', usage: '1 viên sau ăn tối' },
    { id: 'd2', name: 'Vitamin Tổng hợp', usage: '1 viên sáng' },
    { id: 'd3', name: 'Sắt nước', usage: '1 ống sáng trước ăn 30p' },
    { id: 'd4', name: 'Canxi D3', usage: '1 viên sau ăn sáng' }
  ],
  exercises: [
    { id: 'e1', name: 'Đi bộ nhanh', desc: '30 phút, nhịp tim 100-110bpm' },
    { id: 'e2', name: 'Đạp xe trong nhà', desc: '20 phút' },
    { id: 'e3', name: 'Yoga nhẹ nhàng', desc: '15 phút mỗi sáng' },
    { id: 'e4', name: 'Bơi lội', desc: '45 phút (nhẹ)' }
  ]
};

export const patientDetailMock = {
  id: "pt_001",
  patientCode: "BN001",
  fullName: "Nguyễn Thị Hoa",
  gender: "Nữ",
  age: 34,
  phone: "0901234567",
  avatar: "H",
  assignedDoctor: {
    id: "dr_001",
    name: "Dr. Nguyễn Văn A"
  }
};

export const patientOverviewMock = {
  mainDiagnosis: "Đái tháo đường thai kỳ",
  currentGoal: "Ổn định đường huyết, kiểm soát cân nặng thai kỳ",
  adherenceAlerts: [
    {
      level: "high", // red
      message: "3 ngày không nhập dữ liệu bữa ăn"
    },
    {
      level: "medium", // orange/warning
      message: "Vận động dưới ngưỡng (2/5 ngày)"
    }
  ],
  latestMetrics: [
    { label: "Cân nặng", value: "62.5 kg" },
    { label: "BMI", value: "24.5" },
    { label: "Đường huyết (đói)", value: "95 mg/dL", status: "warning" },
    { label: "Huyết áp", value: "110/70 mmHg" },
  ],
  activePlans: {
    diet: "1800 kcal (50% Carb, 20% Protein, 30% Fat)",
    supplement: "Canxi (1 viên/sáng), Sắt (1 viên/trưa)",
    exercise: "Đi bộ nhẹ nhàng 30 phút/ngày"
  }
};

export const anthropometricRecordsMock = [
  { id: 1, date: "10/08", weight: 60.2, bmi: 23.5, source: "Cân điện tử" },
  { id: 2, date: "25/08", weight: 61.0, bmi: 23.8, source: "Cân điện tử" },
  { id: 3, date: "10/09", weight: 61.8, bmi: 24.1, source: "Nhập tay" },
  { id: 4, date: "25/09", weight: 62.1, bmi: 24.3, source: "Phòng khám" },
  { id: 5, date: "10/10", weight: 62.5, bmi: 24.5, source: "Phòng khám" },
];

export const labReportsMock = [
  {
    id: "lab_1",
    reportDate: "16/10/2023",
    reportType: "Xét nghiệm sinh hóa máu",
    attachmentUrl: "report_16_10.pdf",
    items: [
      { name: "Glucose đói", value: 95, unit: "mg/dL", refRange: "70-100", abnormal: false },
      { name: "HbA1c", value: 6.2, unit: "%", refRange: "4.0-5.6", abnormal: true },
      { name: "Cholesterol toàn phần", value: 210, unit: "mg/dL", refRange: "< 200", abnormal: true },
    ]
  }
];

export const mealLogsDaysMock = [
  {
    date: "18/10/2023",
    status: " thiếu dữ liệu", // Custom mock status
    meals: [
      { type: "Bữa sáng (08:00)", img: "", name: "Phở bò (1 bát bổ sung rau)", cals: 450, macros: "50C/20P/15F", missing: false },
      { type: "Bữa trưa", img: "", name: "", cals: 0, missing: true },
    ]
  },
  {
    date: "17/10/2023",
    status: "đủ dữ liệu",
    meals: [
      { type: "Bữa sáng", img: "", name: "Bún chả", cals: 500, macros: "60C/20P/20F", missing: false },
      { type: "Bữa trưa", img: "", name: "Cơm cá kho", cals: 600, macros: "70C/25P/15F", missing: false },
      { type: "Bữa tối", img: "", name: "Salad gà", cals: 300, macros: "20C/30P/10F", missing: false },
    ]
  }
];

export const visitRecordsMock = [
  {
    id: "vr_1",
    visitDate: "10/10/2023",
    doctor: "Dr. Nguyễn Văn A",
    visitType: "Tái khám định kỳ",
    summary: "Đường huyết có cải thiện, tuy nhiên cân nặng tiếp tục tăng. Cần kiểm soát Carb."
  },
  {
    id: "vr_2",
    visitDate: "10/09/2023",
    doctor: "Dr. Nguyễn Văn A",
    visitType: "Khám mới",
    summary: "Đái tháo đường thai kỳ tháng thứ 5. Setup thực đơn ban đầu."
  }
];
