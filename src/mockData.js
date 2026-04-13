export const carePlanMockDB = {
  meals: [
    {
      id: 'm1',
      name: 'Cháo yến mạch thịt bằm',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80',
      calories: 320,
      servingLabel: '1 tô',
      mealTypes: ['breakfast', 'dinner'],
      ingredients: [
        { ingredientId: 'i1', name: 'Yến mạch', quantity: 60, unit: 'g', calories: 228 },
        { ingredientId: 'i2', name: 'Thịt nạc xay', quantity: 70, unit: 'g', calories: 78 },
        { ingredientId: 'i3', name: 'Cà rốt', quantity: 30, unit: 'g', calories: 14 },
      ],
    },
    {
      id: 'm2',
      name: 'Cơm mềm cá hấp gừng',
      image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=80',
      calories: 410,
      servingLabel: '1 phần',
      mealTypes: ['lunch', 'dinner'],
      ingredients: [
        { ingredientId: 'i4', name: 'Cơm trắng', quantity: 180, unit: 'g', calories: 234 },
        { ingredientId: 'i5', name: 'Cá phi lê', quantity: 120, unit: 'g', calories: 132 },
        { ingredientId: 'i6', name: 'Bông cải luộc', quantity: 80, unit: 'g', calories: 22 },
      ],
    },
    {
      id: 'm3',
      name: 'Súp bí đỏ ức gà',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80',
      calories: 280,
      servingLabel: '1 tô',
      mealTypes: ['dinner', 'snack'],
      ingredients: [
        { ingredientId: 'i7', name: 'Bí đỏ', quantity: 180, unit: 'g', calories: 64 },
        { ingredientId: 'i8', name: 'Ức gà', quantity: 90, unit: 'g', calories: 140 },
        { ingredientId: 'i9', name: 'Sữa tươi không đường', quantity: 100, unit: 'ml', calories: 76 },
      ],
    },
    {
      id: 'm4',
      name: 'Sữa chua không đường',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
      calories: 75,
      servingLabel: '1 hộp',
      mealTypes: ['snack'],
      ingredients: [{ ingredientId: 'i10', name: 'Sữa chua không đường', quantity: 1, unit: 'hộp', calories: 75 }],
    },
    {
      id: 'm5',
      name: 'Chuối chín',
      image: 'https://images.unsplash.com/photo-1574226516831-e1dff420e37f?auto=format&fit=crop&w=900&q=80',
      calories: 95,
      servingLabel: '1 quả',
      mealTypes: ['snack'],
      ingredients: [{ ingredientId: 'i11', name: 'Chuối chín', quantity: 1, unit: 'quả', calories: 95 }],
    },
    {
      id: 'm6',
      name: 'Canh rau ngót thịt nạc',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=900&q=80',
      calories: 120,
      servingLabel: '1 bát',
      mealTypes: ['lunch', 'dinner'],
      ingredients: [
        { ingredientId: 'i12', name: 'Rau ngót', quantity: 120, unit: 'g', calories: 49 },
        { ingredientId: 'i13', name: 'Thịt nạc', quantity: 60, unit: 'g', calories: 67 },
      ],
    },
    {
      id: 'm7',
      name: 'Cá hồi áp chảo phần nhỏ',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80',
      calories: 260,
      servingLabel: '1 miếng',
      mealTypes: ['lunch', 'dinner'],
      ingredients: [
        { ingredientId: 'i14', name: 'Cá hồi', quantity: 120, unit: 'g', calories: 233 },
        { ingredientId: 'i15', name: 'Dầu olive', quantity: 5, unit: 'ml', calories: 45 },
      ],
    },
    {
      id: 'm8',
      name: 'Bánh mì nguyên cám với trứng',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80',
      calories: 230,
      servingLabel: '1 phần',
      mealTypes: ['breakfast', 'snack'],
      ingredients: [
        { ingredientId: 'i16', name: 'Bánh mì nguyên cám', quantity: 2, unit: 'lát', calories: 140 },
        { ingredientId: 'i17', name: 'Trứng gà', quantity: 1, unit: 'quả', calories: 90 },
      ],
    },
    {
      id: 'm9',
      name: 'Sữa công thức năng lượng cao',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
      calories: 220,
      servingLabel: '1 chai',
      mealTypes: ['snack'],
      ingredients: [{ ingredientId: 'i18', name: 'Sữa công thức', quantity: 1, unit: 'chai', calories: 220 }],
    },
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
  fullName: 'PHUNG THUA QUAN',
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
  mealPlanRange: {
    startDate: '2024-12-02',
    durationDays: 7,
    viewMode: 'week',
  },
  mealPlanDays: [
    {
      date: '2024-12-02',
      label: 'T2, 02/12',
      status: 'ready',
      notes: 'Ngày mẫu tuần 1',
      totals: { calories: 1710, targetCalories: 1850, filledMeals: 4 },
      meals: [
        {
          mealType: 'breakfast',
          title: 'Bữa sáng',
          items: [
            {
              dishId: 'm1',
              dishName: 'Cháo yến mạch thịt bằm',
              serving: '1 tô',
              calories: 320,
              ingredients: [
                { ingredientId: 'i1', name: 'Yến mạch', quantity: 60, unit: 'g', calories: 228 },
                { ingredientId: 'i2', name: 'Thịt nạc xay', quantity: 70, unit: 'g', calories: 78 },
                { ingredientId: 'i3', name: 'Cà rốt', quantity: 30, unit: 'g', calories: 14 },
              ],
              isCustomized: false,
            },
          ],
        },
        {
          mealType: 'lunch',
          title: 'Bữa trưa',
          items: [
            {
              dishId: 'm2',
              dishName: 'Cơm mềm cá hấp gừng',
              serving: '1 phan',
              calories: 410,
              ingredients: [
                { ingredientId: 'i4', name: 'Cơm trắng', quantity: 180, unit: 'g', calories: 234 },
                { ingredientId: 'i5', name: 'Cá phi lê', quantity: 120, unit: 'g', calories: 132 },
                { ingredientId: 'i6', name: 'Bông cải luộc', quantity: 80, unit: 'g', calories: 22 },
              ],
              isCustomized: false,
            },
            {
              dishId: 'm6',
              dishName: 'Canh rau ngót thịt nạc',
              serving: '1 bat',
              calories: 120,
              ingredients: [
                { ingredientId: 'i12', name: 'Rau ngót', quantity: 120, unit: 'g', calories: 49 },
                { ingredientId: 'i13', name: 'Thịt nạc', quantity: 60, unit: 'g', calories: 67 },
              ],
              isCustomized: false,
            },
          ],
        },
        {
          mealType: 'dinner',
          title: 'Bữa tối',
          items: [
            {
              dishId: 'm3',
              dishName: 'Súp bí đỏ ức gà',
              serving: '1 to',
              calories: 280,
              ingredients: [
                { ingredientId: 'i7', name: 'Bí đỏ', quantity: 180, unit: 'g', calories: 64 },
                { ingredientId: 'i8', name: 'Ức gà', quantity: 90, unit: 'g', calories: 140 },
                { ingredientId: 'i9', name: 'Sữa tươi không đường', quantity: 100, unit: 'ml', calories: 76 },
              ],
              isCustomized: false,
            },
          ],
        },
        {
          mealType: 'snack',
          title: 'Bữa phụ',
          items: [
            {
              dishId: 'm9',
              dishName: 'Sữa công thức năng lượng cao',
              serving: '1 chai',
              calories: 220,
              ingredients: [{ ingredientId: 'i18', name: 'Sữa công thức', quantity: 1, unit: 'chai', calories: 220 }],
              isCustomized: false,
            },
            {
              dishId: 'm5',
              dishName: 'Chuối chín',
              serving: '1 qua',
              calories: 95,
              ingredients: [{ ingredientId: 'i11', name: 'Chuối chín', quantity: 1, unit: 'qua', calories: 95 }],
              isCustomized: false,
            },
          ],
        },
      ],
    },
    {
      date: '2024-12-03',
      label: 'T3, 03/12',
      status: 'warning',
      notes: 'Thiếu bữa phụ chiều',
      totals: { calories: 1460, targetCalories: 1850, filledMeals: 3 },
      meals: [
        {
          mealType: 'breakfast',
          title: 'Bữa sáng',
          items: [
            {
              dishId: 'm8',
              dishName: 'Bánh mì nguyên cám với trứng',
              serving: '1 phan',
              calories: 230,
              ingredients: [
                { ingredientId: 'i16', name: 'Bánh mì nguyên cám', quantity: 2, unit: 'lat', calories: 140 },
                { ingredientId: 'i17', name: 'Trứng gà', quantity: 1, unit: 'qua', calories: 90 },
              ],
              isCustomized: false,
            },
          ],
        },
        {
          mealType: 'lunch',
          title: 'Bữa trưa',
          items: [
            {
              dishId: 'm7',
              dishName: 'Cá hồi áp chảo phần nhỏ',
              serving: '1 mieng',
              calories: 260,
              ingredients: [
                { ingredientId: 'i14', name: 'Cá hồi', quantity: 120, unit: 'g', calories: 233 },
                { ingredientId: 'i15', name: 'Dầu olive', quantity: 5, unit: 'ml', calories: 45 },
              ],
              isCustomized: false,
            },
            {
              dishId: 'm6',
              dishName: 'Canh rau ngót thịt nạc',
              serving: '1 bat',
              calories: 120,
              ingredients: [
                { ingredientId: 'i12', name: 'Rau ngót', quantity: 120, unit: 'g', calories: 49 },
                { ingredientId: 'i13', name: 'Thịt nạc', quantity: 60, unit: 'g', calories: 67 },
              ],
              isCustomized: false,
            },
          ],
        },
        {
          mealType: 'dinner',
          title: 'Bữa tối',
          items: [
            {
              dishId: 'm3',
              dishName: 'Súp bí đỏ ức gà',
              serving: '1 to',
              calories: 280,
              ingredients: [
                { ingredientId: 'i7', name: 'Bí đỏ', quantity: 200, unit: 'g', calories: 72 },
                { ingredientId: 'i8', name: 'Ức gà', quantity: 100, unit: 'g', calories: 156 },
                { ingredientId: 'i9', name: 'Sữa tươi không đường', quantity: 100, unit: 'ml', calories: 76 },
              ],
              isCustomized: true,
            },
          ],
        },
        { mealType: 'snack', title: 'Bữa phụ', items: [] },
      ],
    },
    {
      date: '2024-12-04',
      label: 'T4, 04/12',
      status: 'draft',
      notes: 'Chưa xếp bữa tối',
      totals: { calories: 980, targetCalories: 1850, filledMeals: 2 },
      meals: [
        { mealType: 'breakfast', title: 'Bữa sáng', items: [] },
        {
          mealType: 'lunch',
          title: 'Bữa trưa',
          items: [
            {
              dishId: 'm2',
              dishName: 'Cơm mềm cá hấp gừng',
              serving: '1 phan',
              calories: 410,
              ingredients: [
                { ingredientId: 'i4', name: 'Cơm trắng', quantity: 180, unit: 'g', calories: 234 },
                { ingredientId: 'i5', name: 'Cá phi lê', quantity: 120, unit: 'g', calories: 132 },
                { ingredientId: 'i6', name: 'Bông cải luộc', quantity: 80, unit: 'g', calories: 22 },
              ],
              isCustomized: false,
            },
          ],
        },
        { mealType: 'dinner', title: 'Bữa tối', items: [] },
        {
          mealType: 'snack',
          title: 'Bữa phụ',
          items: [
            {
              dishId: 'm4',
              dishName: 'Sữa chua không đường',
              serving: '1 hop',
              calories: 75,
              ingredients: [{ ingredientId: 'i10', name: 'Sữa chua không đường', quantity: 1, unit: 'hop', calories: 75 }],
              isCustomized: false,
            },
          ],
        },
      ],
    },
    {
      date: '2024-12-05',
      label: 'T5, 05/12',
      status: 'ready',
      notes: 'Đã nhân bản từ ngày mẫu',
      totals: { calories: 1785, targetCalories: 1850, filledMeals: 4 },
      meals: [],
    },
    {
      date: '2024-12-06',
      label: 'T6, 06/12',
      status: 'ready',
      notes: 'Theo phương án tuần 1',
      totals: { calories: 1810, targetCalories: 1850, filledMeals: 4 },
      meals: [],
    },
    {
      date: '2024-12-07',
      label: 'T7, 07/12',
      status: 'review',
      notes: 'kcal hơi cao so với mục tiêu',
      totals: { calories: 1960, targetCalories: 1850, filledMeals: 4 },
      meals: [],
    },
    {
      date: '2024-12-08',
      label: 'CN, 08/12',
      status: 'draft',
      notes: 'Chưa có thực đơn',
      totals: { calories: 0, targetCalories: 1850, filledMeals: 0 },
      meals: [],
    },
  ],
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
        name: 'Chao thit bam va sua chua',
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
        name: 'Com mem, ca hap, canh rau ngot',
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
        name: 'Sua cong thuc va chuoi chin',
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
        name: 'Sup bi do uc ga',
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
        name: 'Banh mi nguyen cam va trung',
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
        name: 'Com, thit nac rim, canh bi',
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
        name: 'Chao ca va rau mem',
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
      { type: 'Bữa sáng', img: '', name: 'Chao thit bam va sua chua', cals: 410, macros: '56C/21P/10F', missing: false },
      { type: 'Bữa trưa', img: '', name: 'Com mem, ca hap, canh rau ngot', cals: 630, macros: '77C/33P/18F', missing: false },
      { type: 'Bữa phụ chiều', img: '', name: 'Sua cong thuc va chuoi chin', cals: 220, macros: '34C/10P/4F', missing: false },
    ],
  },
  {
    date: '01/12/2024',
    status: 'thiếu bữa phụ',
    meals: [
      { type: 'Bữa sáng', img: '', name: 'Banh mi nguyen cam va trung', cals: 360, macros: '38C/18P/14F', missing: false },
      { type: 'Bữa trưa', img: '', name: 'Com, thit nac rim, canh bi', cals: 640, macros: '84C/30P/17F', missing: false },
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
    channel: 'Nhac tai buong benh',
    owner: 'CNDD Thu Ha',
    summary: 'Đã hướng dẫn chia nhỏ nước uống theo mốc giờ và ghi nhận bệnh nhân hợp tác tốt.',
    status: 'Đang theo dõi',
  },
];

export const visitRecordsMock = [
  {
    id: 'vr_1',
    visitDate: '02/12/2024',
    doctor: 'BS. Nguyen Hong Van',
    visitType: 'Đánh giá dinh dưỡng',
    summary:
      'Tổng năng lượng hiện tại thấp hơn mục tiêu, bệnh nhân ăn chậm và nhanh no. Chỉ định ưu tiên món mềm, tăng bữa phụ chiều và theo dõi lượng nước.',
  },
  {
    id: 'vr_2',
    visitDate: '29/11/2024',
    doctor: 'CNDD Thu Ha',
    visitType: 'Khai thác khẩu phần 24 giờ',
    summary:
      'Bữa sáng và bữa trưa tạm ổn, bữa tối ăn muộn và thiếu bữa phụ. Người nhà sẵn sàng hỗ trợ chuẩn bị món mềm.',
  },
];

export const doctorProfileMock = {
  doctorId: 'BS001',
  fullName: 'Dr. Nguyễn Văn A',
  avatar: 'A',
  title: 'Trưởng khoa Dinh dưỡng',
  specialty: 'Dinh dưỡng lâm sàng',
  departmentLabel: 'Khoa Dinh dưỡng',
  phone: '0908 123 456',
  email: 'nguyenvana@mealclinic.vn',
  bio: 'Phụ trách xây dựng phác đồ dinh dưỡng nội trú và theo dõi các ca cần can thiệp chuyên sâu.',
  accountStatus: 'Đang hoạt động',
};

export const nurseAccessPatientsMock = [
  { id: 'BN001', name: 'Nguyễn Thị Hoa', status: 'Đang theo dõi' },
  { id: 'BN002', name: 'Trần Văn Nam', status: 'Cần chú ý' },
  { id: 'BN003', name: 'Thái Bình Dương', status: 'Mới khám' },
  { id: 'BN004', name: 'Lê Hoàng Anh', status: 'Tạm ngưng' },
  { id: 'BN005', name: 'Phạm Thị Lan', status: 'Đang theo dõi' },
  { id: 'BN006', name: 'Vũ Minh Khánh', status: 'Đang theo dõi' },
  { id: 'BN007', name: 'Đỗ Quỳnh Mai', status: 'Cần chú ý' },
];

export const nursesMock = [
  {
    nurseId: 'DD001',
    fullName: 'Điều dưỡng Lan',
    roleLabel: 'Điều dưỡng theo dõi buồng bệnh',
    phone: '0912 456 001',
    status: 'Đang hoạt động',
    assignedPatientIds: ['BN001', 'BN003', 'BN006'],
  },
  {
    nurseId: 'DD002',
    fullName: 'Điều dưỡng Hương',
    roleLabel: 'Điều dưỡng hỗ trợ khẩu phần',
    phone: '0912 456 002',
    status: 'Đang hoạt động',
    assignedPatientIds: ['BN002', 'BN005'],
  },
  {
    nurseId: 'DD003',
    fullName: 'Điều dưỡng Minh',
    roleLabel: 'Điều dưỡng điều phối chăm sóc',
    phone: '0912 456 003',
    status: 'Tạm khóa',
    assignedPatientIds: ['BN004'],
  },
];

export const messageConversationsMock = [
  {
    id: 'BN001',
    name: 'Nguyễn Thị Hoa',
    lastMsg: 'Bác sĩ cho hỏi em ăn phở thay bún được không?',
    time: '10:30',
    waitingTime: 'Chờ 2h',
    priority: 'Trung bình',
    patientStatus: 'Đang theo dõi',
    assignedDoctor: 'BS. Nguyễn Văn A',
    unread: 2,
    pinned: true,
    label: 'Dinh dưỡng',
    contextGoal: 'Tăng mức dung nạp bữa chiều và nhắc ghi nhật ký nước uống',
    contextAlert: 'Chưa log đủ bữa tối trong 2 ngày gần nhất',
    latestReport: 'Sinh hóa máu (02/12)',
    messages: [
      { id: 101, sender: 'doctor', text: 'Chào chị Hoa, tuần này chị thấy đường huyết ổn định chứ?', time: '09:00' },
      { id: 102, sender: 'patient', text: 'Chào bác sĩ, sáng nay em đo là 95 mg/dL. Hơi mệt xíu ạ.', time: '09:12' },
      { id: 103, sender: 'doctor', text: 'Mức đường huyết đó là ổn định nhé. Chị nhớ uống đủ nước.', time: '09:15' },
      { id: 104, sender: 'patient', text: 'Bác sĩ cho hỏi em ăn phở thay bún được không?', time: '10:30' },
      { id: 105, sender: 'internal', text: 'Chỉ định điều dưỡng nhắc bệnh nhân thay thế bằng phở gạo lứt nếu có.', time: '10:45', author: 'BS. Nguyễn Văn A' },
    ],
  },
  {
    id: 'BN002',
    name: 'Trần Văn Nam',
    lastMsg: 'Dạ tôi đã cập nhật xét nghiệm máu.',
    time: 'Hôm qua',
    waitingTime: '',
    priority: 'Thấp',
    patientStatus: 'Cần chú ý',
    assignedDoctor: 'BS. Lê Thị B',
    unread: 0,
    pinned: false,
    label: 'Hành chính',
    contextGoal: 'Hoàn thành lịch tái khám và bổ sung kết quả xét nghiệm mới',
    contextAlert: 'Cần rà soát lại glucose đói và protein toàn phần',
    latestReport: 'Điện giải đồ (02/12)',
    messages: [
      { id: 201, sender: 'patient', text: 'Dạ tôi vừa gửi thêm kết quả xét nghiệm máu mới.', time: '15:10' },
      { id: 202, sender: 'doctor', text: 'Tôi đã nhận được. Chiều nay tôi sẽ xem lại và phản hồi.', time: '15:24' },
      { id: 203, sender: 'patient', text: 'Dạ tôi đã cập nhật xét nghiệm máu.', time: 'Hôm qua' },
    ],
  },
  {
    id: 'BN004',
    name: 'Lê Hoàng Anh',
    lastMsg: 'Tôi bị chóng mặt khi tập HIIT.',
    time: 'Thứ 3',
    waitingTime: 'Chờ từ Thứ 3',
    priority: 'Cao',
    patientStatus: 'Tạm ngưng',
    assignedDoctor: 'BS. Lê Thị B',
    unread: 1,
    pinned: false,
    label: 'Cảnh báo',
    contextGoal: 'Giảm cường độ vận động và kiểm tra lại bữa phụ trước tập',
    contextAlert: 'Có dấu hiệu chóng mặt khi vận động cường độ cao',
    latestReport: 'Nhật ký khẩu phần tuần này',
    messages: [
      { id: 301, sender: 'doctor', text: 'Anh mô tả rõ hơn thời điểm bị chóng mặt giúp tôi nhé.', time: '08:20' },
      { id: 302, sender: 'patient', text: 'Tôi bị chóng mặt khi tập HIIT, kèm thêm buồn nôn.', time: 'Thứ 3' },
    ],
  },
];
