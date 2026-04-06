export const carePlanMockDB = {
  meals: [
    { id: 'm1', name: 'Cháo yến mạch thịt bằm', calories: 320 },
    { id: 'm2', name: 'Cơm mềm cá hấp gừng', calories: 410 },
    { id: 'm3', name: 'Súp bí đỏ ức gà', calories: 280 },
    { id: 'm4', name: 'Sữa chua không đường', calories: 75 },
    { id: 'm5', name: 'Chuối chín', calories: 95 },
    { id: 'm6', name: 'Canh rau ngót thịt nạc', calories: 120 },
    { id: 'm7', name: 'Cá hồi áp chảo phần nhỏ', calories: 260 },
    { id: 'm8', name: 'Bánh mì nguyên cám với trứng', calories: 230 },
  ],
  medicines: [
    { id: 'd1', name: 'Sữa công thức năng lượng cao', usage: '1 chai vào giữa buổi chiều' },
    { id: 'd2', name: 'Vitamin tổng hợp', usage: '1 viên sau ăn sáng' },
    { id: 'd3', name: 'Canxi D3', usage: '1 viên sau ăn trưa' },
    { id: 'd4', name: 'Omega 3', usage: '1 viên sau ăn tối' },
  ],
  exercises: [
    { id: 'e1', name: 'Đi bộ chậm', desc: '10-15 phút sau ăn tối' },
    { id: 'e2', name: 'Bài tập hít thở', desc: '5 phút trước khi ngủ' },
    { id: 'e3', name: 'Kéo giãn khớp nhẹ', desc: '2 hiệp, mỗi hiệp 5 phút' },
  ],
};

export const patientDetailMock = {
  id: 'pt_001',
  patientCode: 'BN001',
  fullName: 'PHÙNG THỪA QUAN',
  gender: 'Nam',
  age: 47,
  occupation: 'Công nhân',
  avatar: 'Q',
  assignedDoctor: {
    id: 'dr_001',
    name: 'BS. Nguyễn Hồng Vân',
  },
  nutritionAssessment: {
    mainDiagnosis: 'Nguy cơ suy dinh dưỡng do ăn vào giảm trong bối cảnh đau kéo dài',
    clinicalFocus: 'Ưu tiên cải thiện năng lượng, protein và lượng nước dung nạp mỗi ngày',
    priority: 'Theo dõi sát',
    currentGoal: 'Đảm bảo ăn đủ 3 bữa chính, thêm 1 bữa phụ và đạt tối thiểu 1.8 lít nước/ngày',
    adherence: 'Nhật ký 24 giờ đã có nền dữ liệu nhưng bữa phụ và nước uống còn ghi nhận chưa đều.',
    summary:
      'Bệnh nhân than mệt về chiều, ăn chậm và dễ no, phù hợp cách tiếp cận chia nhỏ bữa và theo dõi dung nạp sát hơn.',
  },
  riskFlags: [
    {
      level: 'high',
      title: 'Khẩu phần hiện tại chưa đạt mục tiêu',
      detail: 'Tổng năng lượng 24 giờ thấp hơn nhu cầu dự kiến khoảng 12%.',
    },
    {
      level: 'medium',
      title: 'Lượng nước uống còn thấp',
      detail: 'Trung bình 1.4 lít/ngày, chưa đạt mốc mục tiêu 1.8 lít.',
    },
    {
      level: 'medium',
      title: 'Triệu chứng tiêu hóa cần tiếp tục theo dõi',
      detail: 'Hiện chưa có tiêu chảy hoặc táo bón, nhưng có cảm giác nhanh no về cuối ngày.',
    },
  ],
  currentState: [
    { label: 'Mục tiêu năng lượng', value: '1.800-1.950 kcal/ngày' },
    { label: 'Protein mục tiêu', value: '78-92 g/ngày' },
    { label: 'Nước uống mục tiêu', value: '1.8-2.0 lít/ngày' },
    { label: 'Mức hoàn thành nhật ký', value: '5/7 ngày đầy đủ' },
  ],
  nextInterventionSummary: {
    title: 'Can thiệp ưu tiên 48 giờ tới',
    items: [
      'Chia nhỏ khẩu phần thành 3 bữa chính và 1 bữa phụ buổi chiều.',
      'Nhắc người bệnh uống nước theo mốc giờ thay vì dồn cuối ngày.',
      'Tăng thực phẩm mềm, dễ tiêu và giàu đạm trong các bữa chính.',
    ],
  },
  basicInfoSections: [
    {
      title: 'Định danh chuyên môn',
      description: 'Những thông tin nền cần cho đánh giá và can thiệp dinh dưỡng.',
      items: [
        { label: 'Họ và tên', value: 'PHÙNG THỪA QUAN' },
        { label: 'Tuổi', value: '47' },
        { label: 'Giới', value: 'Nam' },
        { label: 'Nghề nghiệp', value: 'Công nhân' },
      ],
    },
    {
      title: 'Bối cảnh dinh dưỡng',
      description: 'Thông tin tóm tắt từ hồ sơ và buổi khai thác gần nhất.',
      items: [
        { label: 'Lý do cần hỗ trợ', value: 'Ăn uống kém dần do đau và mệt về chiều' },
        { label: 'Khó khăn chính', value: 'Dễ no, bữa chiều thường ăn thiếu hoặc bỏ bữa phụ' },
        { label: 'Động lực hợp tác', value: 'Sẵn sàng điều chỉnh nếu thực đơn dễ thực hiện tại nhà' },
        { label: 'Người hỗ trợ', value: 'Gia đình có thể cùng nhắc nước uống và chuẩn bị bữa phụ' },
      ],
    },
  ],
  symptoms: [
    { label: 'Triệu chứng tiêu hóa', value: 'Không ghi nhận tiêu chảy hoặc táo bón' },
    { label: 'Dung nạp bữa ăn', value: 'Ăn chậm, nhanh no về chiều' },
    { label: 'Khả năng nhai nuốt', value: 'Bình thường' },
    { label: 'Lưu ý lâm sàng', value: 'Ưu tiên món mềm, dễ tiêu và đậm độ năng lượng cao' },
  ],
  anthropometrics: {
    height: '168 cm',
    currentWeight: '61.2 kg',
    bmi: '21.7',
    usualWeight: '63.0 kg',
    weightChange: '-1.8 kg trong 6 tuần',
    muscleStatus: 'Khối cơ giảm nhẹ',
    edema: 'Không phù',
  },
  dietLogSummary: {
    period: '7 ngày gần nhất',
    completion: '5/7 ngày đầy đủ',
    averageCalories: '1.650 kcal/ngày',
    hydration: '1.4 lít/ngày',
    highlights: [
      'Bữa sáng và bữa trưa khá ổn định, bữa phụ chiều là khoảng trống lớn nhất.',
      'Protein đạt tốt ở bữa trưa, nhưng phân bố đạm giữa các bữa còn lệch.',
      'Nước uống giảm vào những ngày bệnh nhân đau nhiều hoặc làm việc căng thẳng.',
    ],
  },
  interventionPlan: {
    basis: [
      'Dựa trên KP24h, tổng năng lượng ăn vào hiện tại thấp hơn mục tiêu can thiệp.',
      'Tình trạng nhanh no về chiều làm giảm đáng kể lượng ăn ở nửa sau của ngày.',
      'Mục tiêu trước mắt là tăng dung nạp ổn định thay vì tăng thể tích bữa quá nhanh.',
    ],
    goals: [
      'Đạt tối thiểu 90% nhu cầu năng lượng mục tiêu trong 3 ngày liên tiếp.',
      'Bổ sung thêm 1 nguồn đạm mềm ở bữa sáng hoặc bữa phụ chiều.',
      'Nâng lượng nước uống lên tối thiểu 1.8 lít/ngày.',
    ],
    recommendations: [
      'Chia món chính thành khẩu phần vừa, thêm 1 bữa phụ giàu năng lượng lúc 15:30-16:00.',
      'Ưu tiên món mềm, ít dầu mỡ, dễ nhai và dễ tiêu.',
      'Theo dõi phản ứng tiêu hóa sau khi tăng sữa công thức hoặc món bổ sung.',
    ],
    foodsToPrefer: ['Cháo, súp, cá hấp, thịt nạc mềm, sữa chua không đường, trái cây mềm'],
    foodsToLimit: ['Món chiên rán nhiều dầu, nước ngọt có gas, thực phẩm quá cứng hoặc quá cay'],
    caregiverGuidance: [
      'Chuẩn bị sẵn bữa phụ gọn nhẹ để bệnh nhân dễ dùng khi mệt.',
      'Nhắc uống nước theo cốc nhỏ nhiều lần trong ngày.',
      'Theo dõi lượng ăn thực tế thay vì chỉ hỏi cảm giác no.',
    ],
  },
};

export const patientOverviewMock = {
  mainDiagnosis: patientDetailMock.nutritionAssessment.mainDiagnosis,
  currentGoal: patientDetailMock.nutritionAssessment.currentGoal,
  adherenceAlerts: patientDetailMock.riskFlags,
  latestMetrics: [
    { label: 'Cân nặng hiện tại', value: patientDetailMock.anthropometrics.currentWeight },
    { label: 'BMI', value: patientDetailMock.anthropometrics.bmi },
    { label: 'Nước uống TB', value: patientDetailMock.dietLogSummary.hydration, status: 'warning' },
    { label: 'Mức hoàn thành nhật ký', value: patientDetailMock.dietLogSummary.completion },
  ],
  activePlans: {
    diet: '3 bữa chính + 1 bữa phụ, ưu tiên món mềm giàu đạm',
    supplement: 'Sữa công thức năng lượng cao vào buổi chiều',
    exercise: 'Đi bộ chậm và kéo giãn nhẹ theo sức chịu đựng',
  },
};

export const anthropometricRecordsMock = [
  { id: 1, date: '12/10', weight: 63.0, bmi: 22.3, source: 'Khám ban đầu' },
  { id: 2, date: '25/10', weight: 62.6, bmi: 22.1, source: 'Tái đánh giá' },
  { id: 3, date: '08/11', weight: 62.0, bmi: 21.9, source: 'Buồng bệnh' },
  { id: 4, date: '20/11', weight: 61.5, bmi: 21.8, source: 'Buồng bệnh' },
  { id: 5, date: '02/12', weight: 61.2, bmi: 21.7, source: 'Đánh giá gần nhất' },
];

export const labReportsMock = [
  {
    id: 'lab_1',
    reportDate: '02/12/2024',
    reportType: 'Sinh hóa máu',
    attachmentUrl: 'sinh-hoa-02-12.pdf',
    group: 'Sinh hóa',
    items: [
      { name: 'Albumin', value: 3.7, unit: 'g/dL', refRange: '3.5-5.2', abnormal: false, note: 'Trong giới hạn' },
      { name: 'Protein toàn phần', value: 6.2, unit: 'g/dL', refRange: '6.4-8.3', abnormal: true, note: 'Hơi thấp' },
      { name: 'Glucose đói', value: 101, unit: 'mg/dL', refRange: '70-99', abnormal: true, note: 'Cần theo dõi' },
    ],
  },
  {
    id: 'lab_2',
    reportDate: '02/12/2024',
    reportType: 'Điện giải đồ',
    attachmentUrl: 'dien-giai-02-12.pdf',
    group: 'Điện giải',
    items: [
      { name: 'Natri', value: 136, unit: 'mmol/L', refRange: '135-145', abnormal: false, note: 'Ổn định' },
      { name: 'Kali', value: 3.6, unit: 'mmol/L', refRange: '3.5-5.1', abnormal: false, note: 'Cận dưới' },
      { name: 'Canxi', value: 8.4, unit: 'mg/dL', refRange: '8.6-10.2', abnormal: true, note: 'Hơi thấp' },
    ],
  },
  {
    id: 'lab_3',
    reportDate: '02/12/2024',
    reportType: 'Công thức máu',
    attachmentUrl: 'cong-thuc-mau-02-12.pdf',
    group: 'Công thức máu',
    items: [
      { name: 'Hemoglobin', value: 12.9, unit: 'g/dL', refRange: '13.5-17.5', abnormal: true, note: 'Thiếu nhẹ' },
      { name: 'Bạch cầu', value: 6.8, unit: 'G/L', refRange: '4.0-10.0', abnormal: false, note: 'Bình thường' },
      { name: 'Tiểu cầu', value: 256, unit: 'G/L', refRange: '150-400', abnormal: false, note: 'Bình thường' },
    ],
  },
];

export const dailyLogEntriesMock = {
  '2024-12-02': {
    dateDisplay: 'Ngày 02/12',
    totals: { calories: 1710, protein: '82 g', fat: '58 g', carbs: '205 g' },
    insight: 'Bữa phụ chiều còn nhẹ, tổng nước uống mới đạt khoảng 1.5 lít.',
    meals: [
      {
        id: 1,
        type: 'Bữa sáng',
        name: 'Cháo thịt bằm và sữa chua',
        time: '07:15',
        img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
        kcal: 410,
        protein: 21,
        fat: 10,
        carbs: 56,
      },
      {
        id: 2,
        type: 'Bữa trưa',
        name: 'Cơm mềm, cá hấp, canh rau ngót',
        time: '11:45',
        img: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
        kcal: 630,
        protein: 33,
        fat: 18,
        carbs: 77,
      },
      {
        id: 3,
        type: 'Bữa phụ chiều',
        name: 'Sữa công thức và chuối chín',
        time: '15:40',
        img: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=800&q=80',
        kcal: 220,
        protein: 10,
        fat: 4,
        carbs: 34,
      },
      {
        id: 4,
        type: 'Bữa tối',
        name: 'Súp bí đỏ ức gà',
        time: '18:45',
        img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
        kcal: 450,
        protein: 18,
        fat: 12,
        carbs: 38,
      },
    ],
    supplements: [
      { id: 1, name: 'Vitamin tổng hợp', dose: '1 viên', time: '08:00', status: 'Đã dùng' },
      { id: 2, name: 'Canxi D3', dose: '1 viên', time: '13:00', status: 'Đã dùng' },
    ],
    activities: [{ id: 1, name: 'Đi bộ chậm', duration: '12 phút', note: 'Sau ăn tối, dung nạp tốt' }],
  },
  '2024-12-01': {
    dateDisplay: 'Ngày 01/12',
    totals: { calories: 1540, protein: '68 g', fat: '49 g', carbs: '192 g' },
    insight: 'Bỏ bữa phụ chiều, lượng nước uống giảm do đau nhiều hơn.',
    meals: [
      {
        id: 1,
        type: 'Bữa sáng',
        name: 'Bánh mì nguyên cám và trứng',
        time: '07:30',
        img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
        kcal: 360,
        protein: 18,
        fat: 14,
        carbs: 38,
      },
      {
        id: 2,
        type: 'Bữa trưa',
        name: 'Cơm, thịt nạc rim, canh bí',
        time: '11:50',
        img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=800&q=80',
        kcal: 640,
        protein: 30,
        fat: 17,
        carbs: 84,
      },
      {
        id: 3,
        type: 'Bữa tối',
        name: 'Cháo cá và rau mềm',
        time: '18:30',
        img: 'https://images.unsplash.com/photo-1604152135912-04a579a5d3f9?auto=format&fit=crop&w=800&q=80',
        kcal: 540,
        protein: 20,
        fat: 18,
        carbs: 70,
      },
    ],
    supplements: [{ id: 1, name: 'Vitamin tổng hợp', dose: '1 viên', time: '08:10', status: 'Đã dùng' }],
    activities: [],
  },
};

export const mealLogsDaysMock = [
  {
    date: '02/12/2024',
    status: 'đủ dữ liệu',
    meals: [
      { type: 'Bữa sáng', img: '', name: 'Cháo thịt bằm và sữa chua', cals: 410, macros: '56C/21P/10F', missing: false },
      { type: 'Bữa trưa', img: '', name: 'Cơm mềm, cá hấp, canh rau ngót', cals: 630, macros: '77C/33P/18F', missing: false },
      { type: 'Bữa phụ chiều', img: '', name: 'Sữa công thức và chuối chín', cals: 220, macros: '34C/10P/4F', missing: false },
    ],
  },
  {
    date: '01/12/2024',
    status: 'thiếu bữa phụ',
    meals: [
      { type: 'Bữa sáng', img: '', name: 'Bánh mì nguyên cám và trứng', cals: 360, macros: '38C/18P/14F', missing: false },
      { type: 'Bữa trưa', img: '', name: 'Cơm, thịt nạc rim, canh bí', cals: 640, macros: '84C/30P/17F', missing: false },
      { type: 'Bữa phụ chiều', img: '', name: '', cals: 0, macros: '', missing: true },
    ],
  },
];

export const followUpsMock = [
  {
    id: 'fu_1',
    dateTime: '03/12/2024 - 09:00',
    channel: 'Gọi điện',
    owner: 'Điều dưỡng Lan',
    summary: 'Bệnh nhân báo bữa phụ chiều dễ thực hiện hơn nếu chuẩn bị sẵn sữa và trái cây.',
    status: 'Đã xử lý',
  },
  {
    id: 'fu_2',
    dateTime: '02/12/2024 - 16:30',
    channel: 'Nhắc tại buồng bệnh',
    owner: 'CNDD Thu Hà',
    summary: 'Đã hướng dẫn chia nhỏ nước uống theo mốc giờ và ghi nhận bệnh nhân hợp tác tốt.',
    status: 'Đang theo dõi',
  },
];

export const visitRecordsMock = [
  {
    id: 'vr_1',
    visitDate: '02/12/2024',
    doctor: 'BS. Nguyễn Hồng Vân',
    visitType: 'Đánh giá dinh dưỡng',
    summary:
      'Tổng năng lượng hiện tại thấp hơn mục tiêu, bệnh nhân ăn chậm và nhanh no. Chỉ định ưu tiên món mềm, tăng bữa phụ chiều và theo dõi lượng nước.',
  },
  {
    id: 'vr_2',
    visitDate: '29/11/2024',
    doctor: 'CNDD Thu Hà',
    visitType: 'Khai thác khẩu phần 24 giờ',
    summary:
      'Bữa sáng và bữa trưa tạm ổn, bữa tối ăn muộn và thiếu bữa phụ. Người nhà sẵn sàng hỗ trợ chuẩn bị món mềm.',
  },
];
