import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Check,
  CheckCircle2,
  FileText,
  ImageOff,
  MessageSquarePlus,
  Pencil,
  PlusCircle,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { carePlanMockDB } from '../mockData';
import { getPatientDraft, savePatientDraft } from '../utils/patientDrafts';
import './NewPatientRecord.css';

const doctors = ['BS. Nguyễn Văn A', 'BS. Trần Minh Châu', 'CNDD. Lê Thu Hà', 'BS. Nguyễn Hồng Vân'];

const mealsByType = carePlanMockDB.meals.reduce((acc, meal) => {
  meal.mealTypes.forEach((mealType) => {
    acc[mealType] = [...(acc[mealType] ?? []), meal];
  });
  return acc;
}, {});

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Bữa sáng' },
  { key: 'lunch', label: 'Bữa trưa' },
  { key: 'snack', label: 'Bữa phụ' },
  { key: 'dinner', label: 'Bữa tối' },
];

const steps = [
  {
    id: 'basic',
    title: 'Thông tin cơ bản',
    description: 'Map vào header hồ sơ bệnh nhân. Chỉ giữ thông tin định danh và mục tiêu hiện tại.',
  },
  {
    id: 'snapshot',
    title: 'Snapshot lâm sàng',
    description: 'Định nghĩa nhanh mức theo dõi, vấn đề chính và ưu tiên trong ngày.',
  },
  {
    id: 'summary',
    title: 'Tóm tắt lâm sàng',
    description: 'Tóm tắt ngắn để bác sĩ khác đọc được bối cảnh trong 30 giây.',
  },
  {
    id: 'assessment',
    title: 'Đánh giá',
    description: 'Nhân trắc, bối cảnh dinh dưỡng, triệu chứng và xét nghiệm nhập tay.',
  },
  {
    id: 'mealLog',
    title: 'Nhật ký',
    description: 'Nhập ngày ăn điển hình ban đầu, không phải food logging phức tạp.',
  },
  {
    id: 'intervention',
    title: 'Can thiệp & theo dõi',
    description: 'Chốt chu kỳ, mục tiêu ưu tiên, cảnh báo vận hành và lần theo dõi tiếp theo.',
  },
];

const stepSections = {
  basic: [
    {
      title: 'Định danh bệnh nhân',
      description: 'Thông tin đủ để nhận diện và mở hồ sơ.',
      fields: [
        { name: 'fullName', label: 'Họ và tên', required: true, placeholder: 'Nguyễn Văn A' },
        { name: 'phone', label: 'Số điện thoại', placeholder: '090...' },
        { name: 'age', label: 'Tuổi', required: true, type: 'number', placeholder: '47' },
        { name: 'birthDate', label: 'Ngày sinh', type: 'date' },
        { name: 'gender', label: 'Giới tính', required: true, type: 'select', options: ['Nam', 'Nữ', 'Khác'] },
        { name: 'occupation', label: 'Nghề nghiệp', placeholder: 'Công nhân, giáo viên...' },
      ],
    },
    {
      title: 'Theo dõi hiện tại',
      description: 'Dùng để hiển thị ngay trong header hồ sơ.',
      fields: [
        { name: 'assignedDoctor', label: 'Bác sĩ phụ trách', required: true, type: 'select', options: doctors },
        {
          name: 'currentGoal',
          label: 'Mục tiêu hiện tại',
          required: true,
          type: 'textarea',
          placeholder: 'Ví dụ: đạt 90% nhu cầu năng lượng trong 3 ngày liên tiếp.',
          wide: true,
        },
      ],
    },
  ],
  snapshot: [
    {
      title: 'Tóm tắt lâm sàng nhanh',
      description: '4 dòng đọc nhanh ở đầu hồ sơ chi tiết.',
      fields: [
        { name: 'priority', label: 'Mức độ theo dõi', required: true, type: 'select', options: ['Theo dõi sát', 'Theo dõi định kỳ', 'Ổn định'] },
        {
          name: 'mainConcern',
          label: 'Vấn đề chính',
          required: true,
          type: 'textarea',
          placeholder: 'Ví dụ: nguy cơ suy dinh dưỡng do ăn vào giảm kéo dài.',
          wide: true,
        },
        {
          name: 'todayPriority',
          label: 'Ưu tiên hôm nay',
          type: 'textarea',
          placeholder: 'Ví dụ: tăng năng lượng khẩu phần và cải thiện nước uống.',
          wide: true,
        },
        { name: 'lastUpdated', label: 'Cập nhật gần nhất', placeholder: 'Hôm nay, 08:30' },
      ],
    },
  ],
  summary: [
    {
      title: 'Nội dung cho tab Tóm tắt',
      description: 'Viết ngắn, ưu tiên thông tin giúp ra quyết định.',
      fields: [
        {
          name: 'clinicalSummary',
          label: 'Tóm tắt lâm sàng',
          required: true,
          type: 'textarea',
          placeholder: 'Tóm tắt ngắn gọn tình trạng dinh dưỡng hiện tại.',
          wide: true,
        },
        { name: 'mainProblem', label: 'Vấn đề chính', type: 'textarea', wide: true },
        {
          name: 'treatmentGoals',
          label: 'Mục tiêu điều trị',
          required: true,
          type: 'textarea',
          placeholder: 'Ví dụ: 1.800-1.950 kcal/ngày; 78-92g protein/ngày.',
          wide: true,
        },
        {
          name: 'currentAchievement',
          label: 'Mức đạt hiện tại',
          type: 'textarea',
          placeholder: 'Ví dụ: năng lượng còn thiếu khoảng 12%, nước uống 1.4L/ngày.',
          wide: true,
        },
      ],
    },
  ],
  assessment: [
    {
      title: 'Nhân trắc',
      description: 'BMI sẽ tự tính khi có chiều cao và cân nặng.',
      defaultOpen: true,
      fields: [
        { name: 'height', label: 'Chiều cao', required: true, placeholder: '168 cm' },
        { name: 'currentWeight', label: 'Cân nặng hiện tại', required: true, placeholder: '61.2 kg' },
        { name: 'bmi', label: 'BMI', placeholder: 'Tự tính nếu đủ dữ liệu' },
        { name: 'recentChange', label: 'Biến động gần đây', placeholder: '-1.8 kg trong 6 tuần' },
        { name: 'usualWeight', label: 'Cân nặng thường lệ' },
        { name: 'muscleStatus', label: 'Khối cơ' },
        { name: 'edema', label: 'Phù' },
      ],
    },
    {
      title: 'Bối cảnh dinh dưỡng',
      description: 'Những yếu tố giúp giải thích vì sao bệnh nhân cần hỗ trợ.',
      fields: [
        { name: 'supportReason', label: 'Lý do cần hỗ trợ', type: 'textarea', wide: true },
        { name: 'mainDifficulty', label: 'Khó khăn chính', type: 'textarea', wide: true },
        { name: 'motivation', label: 'Động lực hợp tác' },
        { name: 'caregiver', label: 'Người hỗ trợ' },
      ],
    },
    {
      title: 'Triệu chứng & dung nạp',
      description: 'Chỉ nhập những gì có ý nghĩa với can thiệp dinh dưỡng.',
      fields: [
        { name: 'digestiveSymptoms', label: 'Triệu chứng tiêu hóa' },
        { name: 'mealTolerance', label: 'Dung nạp bữa ăn' },
        { name: 'chewingSwallowing', label: 'Khả năng nhai nuốt' },
        { name: 'clinicalNote', label: 'Lưu ý lâm sàng', type: 'textarea', wide: true },
      ],
    },
    {
      title: 'Xét nghiệm nhập tay',
      description: 'Chỉ nhập phiếu hoặc chỉ số cần chú ý, chưa cần lab engine phức tạp.',
      fields: [
        { name: 'labName', label: 'Tên phiếu xét nghiệm' },
        { name: 'labDate', label: 'Ngày xét nghiệm', type: 'date' },
        { name: 'labIndicator', label: 'Chỉ số cần chú ý', type: 'textarea', wide: true },
        { name: 'labMeaning', label: 'Ý nghĩa lâm sàng ngắn', type: 'textarea', wide: true },
      ],
    },
  ],
  mealLog: [
    {
      title: 'Tổng quan dinh dưỡng',
      description: 'Nhập nhanh các chỉ số chính của ngày ăn điển hình.',
      defaultOpen: true,
      fields: [
        { name: 'calories', label: 'Năng lượng cả ngày', placeholder: '1710 kcal' },
        { name: 'protein', label: 'Protein', placeholder: '82 g' },
        { name: 'fat', label: 'Chất béo', placeholder: '58 g' },
        { name: 'carbs', label: 'Glucid', placeholder: '205 g' },
        { name: 'water', label: 'Nước uống', placeholder: '1.5 L' },
      ],
    },
    {
      title: 'Bữa ăn',
      description: 'Chọn nhiều món trong cùng một bữa, chỉnh khẩu phần và nguyên liệu khi cần.',
      type: 'mealEditor',
      fields: [],
    },
    {
      title: 'Sức khỏe',
      description: 'Thông tin hỗ trợ giải thích dung nạp, tuân thủ và mức độ hoạt động.',
      fields: [
        { name: 'supplements', label: 'Thực phẩm bổ sung', type: 'textarea' },
        { name: 'activity', label: 'Vận động', type: 'textarea' },
      ],
    },
  ],
  intervention: [
    {
      title: 'Kế hoạch tiếp theo',
      description: 'Định nghĩa rõ việc cần làm sau khi hoàn tất hồ sơ.',
      fields: [
        { name: 'cycle', label: 'Chu kỳ can thiệp', required: true, type: 'select', options: ['1 ngày', '3 ngày', '7 ngày', '14 ngày', '30 ngày'] },
        { name: 'priorityGoal', label: 'Mục tiêu ưu tiên', type: 'textarea', wide: true },
        { name: 'operationalWarning', label: 'Cảnh báo vận hành', type: 'textarea', wide: true },
        { name: 'followUpSuggestion', label: 'Gợi ý theo dõi', type: 'textarea', wide: true },
        { name: 'clinicalNote', label: 'Ghi chú chuyên môn', type: 'textarea', wide: true },
        { name: 'nextMonitoring', label: 'Theo dõi tiếp theo trong 48h hoặc 7 ngày', type: 'textarea', wide: true },
      ],
    },
  ],
};

const requiredFields = [
  ['basic', 'fullName', 'Họ tên'],
  ['basic', 'age', 'Tuổi'],
  ['basic', 'gender', 'Giới tính'],
  ['basic', 'assignedDoctor', 'Bác sĩ phụ trách'],
  ['basic', 'currentGoal', 'Mục tiêu hiện tại'],
  ['snapshot', 'priority', 'Mức độ theo dõi'],
  ['snapshot', 'mainConcern', 'Vấn đề chính'],
  ['summary', 'clinicalSummary', 'Tóm tắt lâm sàng'],
  ['summary', 'treatmentGoals', 'Mục tiêu điều trị'],
  ['assessment', 'height', 'Chiều cao'],
  ['assessment', 'currentWeight', 'Cân nặng hiện tại'],
  ['intervention', 'cycle', 'Chu kỳ can thiệp'],
];

function parseMeasurement(value) {
  if (!value) return null;
  const match = String(value).replace(',', '.').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function calculateBmi(heightValue, weightValue) {
  const height = parseMeasurement(heightValue);
  const weight = parseMeasurement(weightValue);
  if (!height || !weight) return '';
  const heightInMeters = height > 3 ? height / 100 : height;
  if (heightInMeters <= 0) return '';
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeMealItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [{
    dishId: `legacy-${String(value).slice(0, 24)}`,
    dishName: value,
    image: '',
    serving: '',
    calories: 0,
    ingredients: [],
    isCustomized: true,
    isLegacy: true,
  }];
}

function createDraftDishFromLibrary(libraryDish) {
  return {
    dishId: libraryDish.id,
    dishName: libraryDish.name,
    image: libraryDish.image,
    serving: libraryDish.servingLabel,
    calories: libraryDish.calories,
    ingredients: cloneData(libraryDish.ingredients),
    isCustomized: false,
  };
}

function getMealCalories(items) {
  return normalizeMealItems(items).reduce((sum, item) => sum + Number(item.calories || 0), 0);
}

function getMissingRequiredFields(draft) {
  return requiredFields
    .filter(([group, field]) => !draft?.[group]?.[field])
    .map(([, , label]) => label);
}

function Field({ config, value, onChange, error }) {
  const inputId = `${config.name}-field`;
  return (
    <label className={`onboarding-field ${config.wide ? 'wide' : ''}`} htmlFor={inputId}>
      <span>{config.label}{config.required ? <em>*</em> : null}</span>
      {config.type === 'textarea' ? (
        <textarea id={inputId} rows="3" placeholder={config.placeholder} value={value ?? ''} onChange={(event) => onChange(config.name, event.target.value)} />
      ) : config.type === 'select' ? (
        <select id={inputId} value={value ?? ''} onChange={(event) => onChange(config.name, event.target.value)}>
          <option value="">Chọn</option>
          {config.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input id={inputId} type={config.type ?? 'text'} placeholder={config.placeholder} value={value ?? ''} onChange={(event) => onChange(config.name, event.target.value)} />
      )}
      {error ? <small>{error}</small> : null}
    </label>
  );
}

function DishIngredientEditor({ dish, onServingChange, onIngredientChange }) {
  return (
    <div className="meal-dish-editor">
      <div className="meal-dish-editor-hero">
        {dish.image ? (
          <img src={dish.image} alt={dish.dishName} />
        ) : (
          <div className="meal-dish-image-fallback" aria-hidden="true">
            <ImageOff size={22} />
          </div>
        )}
        <div>
          <span className="eyebrow">Công thức</span>
          <h3>{dish.dishName}</h3>
          <p>{dish.calories} kcal · {dish.ingredients.length} nguyên liệu</p>
        </div>
      </div>

      <label className="onboarding-field meal-serving-field">
        <span>Khẩu phần</span>
        <input type="text" value={dish.serving ?? ''} onChange={(event) => onServingChange(event.target.value)} />
      </label>

      <div className="meal-ingredient-list">
        {dish.ingredients.length > 0 ? (
          dish.ingredients.map((ingredient, index) => (
            <div key={ingredient.ingredientId ?? `${dish.dishId}-${index}`} className="meal-ingredient-row">
              <div>
                <strong>{ingredient.name}</strong>
                <p>{ingredient.calories} kcal</p>
              </div>
              <label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={ingredient.quantity}
                  onChange={(event) => onIngredientChange(index, event.target.value)}
                />
                <span>{ingredient.unit}</span>
              </label>
            </div>
          ))
        ) : (
          <p className="meal-empty-note">Món nhập từ dữ liệu cũ chưa có công thức chi tiết.</p>
        )}
      </div>
    </div>
  );
}

function MealDishModal({
  addDishState,
  editingDish,
  selectedMealLabel,
  filteredDishes,
  onSearchChange,
  onSelectDish,
  onAddDish,
  onCloseAdd,
  onCloseEdit,
  onAddServingChange,
  onAddIngredientChange,
  onEditServingChange,
  onEditIngredientChange,
}) {
  const isAdding = Boolean(addDishState.mealType);
  const isEditing = Boolean(editingDish);
  if (!isAdding && !isEditing) return null;

  return (
    <div className="meal-modal-backdrop" role="presentation" onClick={isAdding ? onCloseAdd : onCloseEdit}>
      <div className={`meal-modal ${isAdding ? 'wide' : ''}`} role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="meal-modal-header">
          <div>
            <span className="eyebrow">{isAdding ? 'Thêm món' : 'Sửa món'}</span>
            <h2>{isAdding ? selectedMealLabel : editingDish.dishName}</h2>
            {isAdding ? <p>Chọn món từ database, chỉnh khẩu phần hoặc nguyên liệu trước khi thêm vào bữa.</p> : null}
          </div>
          <button className="btn-icon" type="button" aria-label="Đóng" onClick={isAdding ? onCloseAdd : onCloseEdit}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {isAdding ? (
          <div className="meal-add-layout">
            <section className="meal-library-panel">
              <label className="onboarding-field meal-search-field">
                <span>Tìm món trong database</span>
                <div className="meal-search-input">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Nhập tên món..."
                    value={addDishState.searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                  />
                </div>
              </label>

              <div className="meal-library-list" role="list" aria-label={`Món ăn cho ${selectedMealLabel}`}>
                {filteredDishes.length > 0 ? (
                  filteredDishes.map((dish) => (
                    <button
                      key={dish.id}
                      className={`meal-library-card ${addDishState.selectedDishId === dish.id ? 'active' : ''}`}
                      type="button"
                      onClick={() => onSelectDish(dish)}
                    >
                      {dish.image ? <img src={dish.image} alt={dish.name} /> : <span className="meal-dish-image-fallback"><ImageOff size={18} /></span>}
                      <span>
                        <strong>{dish.name}</strong>
                        <small>{dish.servingLabel} · {dish.calories} kcal</small>
                      </span>
                      {addDishState.selectedDishId === dish.id ? <Check size={16} aria-hidden="true" /> : null}
                    </button>
                  ))
                ) : (
                  <p className="meal-empty-note">Không tìm thấy món phù hợp.</p>
                )}
              </div>
            </section>

            <section className="meal-draft-panel">
              {addDishState.draftDish ? (
                <DishIngredientEditor dish={addDishState.draftDish} onServingChange={onAddServingChange} onIngredientChange={onAddIngredientChange} />
              ) : (
                <div className="meal-empty-preview">
                  <Search size={22} aria-hidden="true" />
                  <strong>Chọn một món để xem công thức</strong>
                  <p>Công thức và khối lượng nguyên liệu sẽ hiện ở đây để chỉnh trước khi thêm.</p>
                </div>
              )}
            </section>
          </div>
        ) : (
          <DishIngredientEditor dish={editingDish} onServingChange={onEditServingChange} onIngredientChange={onEditIngredientChange} />
        )}

        <div className="meal-modal-footer">
          <button className="btn-secondary" type="button" onClick={isAdding ? onCloseAdd : onCloseEdit}>
            Đóng
          </button>
          {isAdding ? (
            <button className="btn-primary" type="button" onClick={onAddDish} disabled={!addDishState.draftDish}>
              <PlusCircle size={16} aria-hidden="true" />
              Thêm vào bữa
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MealLogEditor({ values, onStartAddDish, onEditDish, onRemoveDish }) {
  const totalDishCount = MEAL_TYPES.reduce((sum, mealType) => sum + normalizeMealItems(values[mealType.key]).length, 0);
  const totalCalories = MEAL_TYPES.reduce((sum, mealType) => sum + getMealCalories(values[mealType.key]), 0);

  return (
    <div className="meal-log-editor">
      <div className="meal-log-editor-summary">
        <div>
          <span>Tổng món đã chọn</span>
          <strong>{totalDishCount}</strong>
        </div>
        <div>
          <span>Năng lượng từ món</span>
          <strong>{totalCalories} kcal</strong>
        </div>
      </div>

      <div className="meal-log-slots">
        {MEAL_TYPES.map((mealType) => {
          const items = normalizeMealItems(values[mealType.key]);
          const mealCalories = getMealCalories(items);
          return (
            <section key={mealType.key} className="meal-log-slot">
              <div className="meal-log-slot-header">
                <div>
                  <h3>{mealType.label}</h3>
                  <p>{items.length} món · {mealCalories} kcal</p>
                </div>
                <button className="btn-secondary btn-small" type="button" onClick={() => onStartAddDish(mealType.key)}>
                  <PlusCircle size={15} aria-hidden="true" />
                  Thêm món
                </button>
              </div>

              {items.length > 0 ? (
                <div className="meal-log-dish-list">
                  {items.map((dish, index) => (
                    <article key={`${dish.dishId}-${index}`} className="meal-log-dish-card">
                      {dish.image ? <img src={dish.image} alt={dish.dishName} /> : <div className="meal-dish-image-fallback" aria-hidden="true"><ImageOff size={18} /></div>}
                      <div>
                        <strong>{dish.dishName}</strong>
                        <p>{dish.serving || 'Chưa nhập khẩu phần'} · {dish.calories || 0} kcal</p>
                        {dish.isCustomized ? <span>Đã chỉnh công thức</span> : null}
                      </div>
                      <div className="meal-log-dish-actions">
                        <button className="btn-icon" type="button" aria-label={`Sửa ${dish.dishName}`} onClick={() => onEditDish(mealType.key, index)}>
                          <Pencil size={16} aria-hidden="true" />
                        </button>
                        <button className="btn-icon danger-ghost" type="button" aria-label={`Xóa ${dish.dishName}`} onClick={() => onRemoveDish(mealType.key, index)}>
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <button className="meal-log-empty-slot" type="button" onClick={() => onStartAddDish(mealType.key)}>
                  <PlusCircle size={16} aria-hidden="true" />
                  Chọn món cho {mealType.label.toLowerCase()}
                </button>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function StepSection({ groupId, section, values, errors, onChange, mealEditorProps }) {
  const sectionBody = (
    <>
      <div className="onboarding-subsection-heading">
        <div>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>
      </div>
      <div className="onboarding-field-grid">
        {section.fields.map((field) => (
          <Field
            key={field.name}
            config={field}
            value={values[field.name]}
            onChange={onChange}
            error={errors[`${groupId}.${field.name}`]}
          />
        ))}
      </div>
    </>
  );

  if (groupId === 'assessment' || groupId === 'mealLog') {
    return (
      <details className="onboarding-subsection collapsible" open={Boolean(section.defaultOpen)}>
        <summary>
          <span>{section.title}</span>
          <small>{section.description}</small>
        </summary>
        <div className="onboarding-subsection-body">
          {section.type === 'mealEditor' ? (
            <MealLogEditor values={values} {...mealEditorProps} />
          ) : (
            <div className="onboarding-field-grid">
              {section.fields.map((field) => (
                <Field
                  key={field.name}
                  config={field}
                  value={values[field.name]}
                  onChange={onChange}
                  error={errors[`${groupId}.${field.name}`]}
                />
              ))}
            </div>
          )}
        </div>
      </details>
    );
  }

  return <section className="onboarding-subsection">{sectionBody}</section>;
}

function getCompletionPercent(draft) {
  const filled = requiredFields.filter(([group, field]) => Boolean(draft?.[group]?.[field])).length;
  return Math.round((filled / requiredFields.length) * 100);
}

export default function NewPatientRecordPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(() => getPatientDraft(id));
  const [activeStepIndex, setActiveStepIndex] = useState(() => getPatientDraft(id)?.lastStepIndex ?? 0);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [addDishState, setAddDishState] = useState({
    mealType: '',
    searchTerm: '',
    selectedDishId: '',
    draftDish: null,
  });
  const [editingDishRef, setEditingDishRef] = useState(null);

  useEffect(() => {
    if (!draft) navigate('/patients');
  }, [draft, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const activeStep = steps[activeStepIndex];
  const progress = useMemo(() => getCompletionPercent(draft), [draft]);
  const missingRequiredFields = useMemo(() => getMissingRequiredFields(draft), [draft]);
  const selectedMealLabel = MEAL_TYPES.find((item) => item.key === addDishState.mealType)?.label ?? '';
  const filteredLibraryDishes = useMemo(() => {
    if (!addDishState.mealType) return [];
    const normalizedSearch = addDishState.searchTerm.trim().toLowerCase();
    return (mealsByType[addDishState.mealType] ?? []).filter((meal) => {
      if (!normalizedSearch) return true;
      return meal.name.toLowerCase().includes(normalizedSearch);
    });
  }, [addDishState.mealType, addDishState.searchTerm]);
  const editingDish = editingDishRef && draft
    ? normalizeMealItems(draft.mealLog?.[editingDishRef.mealType])[editingDishRef.dishIndex] ?? null
    : null;

  if (!draft) return null;

  const updateField = (group, field, value) => {
    setDraft((current) => {
      const nextGroup = {
        ...current[group],
        [field]: value,
      };

      if (group === 'assessment' && (field === 'height' || field === 'currentWeight')) {
        const nextHeight = field === 'height' ? value : nextGroup.height;
        const nextWeight = field === 'currentWeight' ? value : nextGroup.currentWeight;
        const nextBmi = calculateBmi(nextHeight, nextWeight);
        if (nextBmi) nextGroup.bmi = nextBmi;
      }

      return {
        ...current,
        [group]: nextGroup,
      };
    });
    setIsDirty(true);
    const errorKey = `${group}.${field}`;
    if (errors[errorKey]) setErrors((current) => ({ ...current, [errorKey]: '' }));
  };

  const updateMealItems = (mealType, updater) => {
    setDraft((current) => {
      const currentItems = normalizeMealItems(current.mealLog[mealType]);
      const nextItems = updater(cloneData(currentItems));
      return {
        ...current,
        mealLog: {
          ...current.mealLog,
          [mealType]: nextItems,
        },
      };
    });
    setIsDirty(true);
  };

  const openAddDishModal = (mealType) => {
    setAddDishState({
      mealType,
      searchTerm: '',
      selectedDishId: '',
      draftDish: null,
    });
  };

  const closeAddDishModal = () => {
    setAddDishState({
      mealType: '',
      searchTerm: '',
      selectedDishId: '',
      draftDish: null,
    });
  };

  const selectDishForAdd = (libraryDish) => {
    setAddDishState((current) => ({
      ...current,
      selectedDishId: libraryDish.id,
      draftDish: createDraftDishFromLibrary(libraryDish),
    }));
  };

  const updateAddDishServing = (nextServing) => {
    setAddDishState((current) => {
      if (!current.draftDish) return current;
      return {
        ...current,
        draftDish: {
          ...current.draftDish,
          serving: nextServing,
          isCustomized: true,
        },
      };
    });
  };

  const updateAddDishIngredientQuantity = (ingredientIndex, nextQuantityRaw) => {
    setAddDishState((current) => {
      if (!current.draftDish) return current;
      const nextQuantity = Math.max(0, Number(nextQuantityRaw || 0));
      const ingredients = cloneData(current.draftDish.ingredients);
      const ingredient = ingredients[ingredientIndex];
      const currentQuantity = Number(ingredient.quantity) || 1;
      const caloriesPerUnit = Number(ingredient.calories || 0) / currentQuantity;
      ingredient.quantity = nextQuantity;
      ingredient.calories = Math.round(caloriesPerUnit * nextQuantity);

      return {
        ...current,
        draftDish: {
          ...current.draftDish,
          ingredients,
          calories: ingredients.reduce((sum, item) => sum + Number(item.calories || 0), 0),
          isCustomized: true,
        },
      };
    });
  };

  const addDishToMeal = () => {
    if (!addDishState.mealType || !addDishState.draftDish) return;
    updateMealItems(addDishState.mealType, (items) => [...items, cloneData(addDishState.draftDish)]);
    setToast(`Đã thêm món vào ${selectedMealLabel || 'bữa ăn'}`);
    window.setTimeout(() => setToast(''), 2500);
    setAddDishState((current) => ({
      ...current,
      searchTerm: '',
      selectedDishId: '',
      draftDish: null,
    }));
  };

  const removeDishFromMeal = (mealType, dishIndex) => {
    updateMealItems(mealType, (items) => items.filter((_, index) => index !== dishIndex));
    if (editingDishRef?.mealType === mealType && editingDishRef?.dishIndex === dishIndex) setEditingDishRef(null);
  };

  const updateEditingDish = (updater) => {
    if (!editingDishRef) return;
    updateMealItems(editingDishRef.mealType, (items) => items.map((dish, index) => (
      index === editingDishRef.dishIndex ? updater(dish) : dish
    )));
  };

  const updateEditingServing = (nextServing) => {
    updateEditingDish((dish) => ({
      ...dish,
      serving: nextServing,
      isCustomized: true,
    }));
  };

  const updateEditingIngredientQuantity = (ingredientIndex, nextQuantityRaw) => {
    updateEditingDish((dish) => {
      const nextQuantity = Math.max(0, Number(nextQuantityRaw || 0));
      const ingredients = cloneData(dish.ingredients ?? []);
      const ingredient = ingredients[ingredientIndex];
      const currentQuantity = Number(ingredient.quantity) || 1;
      const caloriesPerUnit = Number(ingredient.calories || 0) / currentQuantity;
      ingredient.quantity = nextQuantity;
      ingredient.calories = Math.round(caloriesPerUnit * nextQuantity);

      return {
        ...dish,
        ingredients,
        calories: ingredients.reduce((sum, item) => sum + Number(item.calories || 0), 0),
        isCustomized: true,
      };
    });
  };

  const validateStep = () => {
    const nextErrors = {};
    stepSections[activeStep.id].forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && !draft[activeStep.id][field.name]) {
          nextErrors[`${activeStep.id}.${field.name}`] = 'Trường bắt buộc';
        }
      });
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveDraftAtStep = (stepIndex = activeStepIndex, status = 'Chưa hoàn thiện hồ sơ') => {
    const savedDraft = savePatientDraft({ ...draft, lastStepIndex: stepIndex, completionStatus: status });
    setDraft(savedDraft);
    setIsDirty(false);
    return savedDraft;
  };

  const handleSaveDraft = () => {
    saveDraftAtStep();
    setToast('Đã lưu nháp hồ sơ');
    window.setTimeout(() => setToast(''), 2500);
  };

  const goNext = () => {
    if (!validateStep()) return;
    const nextStepIndex = Math.min(activeStepIndex + 1, steps.length - 1);
    saveDraftAtStep(nextStepIndex);
    setActiveStepIndex(nextStepIndex);
  };

  const goToStep = (nextStepIndex) => {
    if (isDirty) saveDraftAtStep(nextStepIndex);
    setActiveStepIndex(nextStepIndex);
  };

  const finishProfile = (nextAction = 'profile') => {
    if (!validateStep()) return;
    const completedDraft = savePatientDraft({ ...draft, lastStepIndex: steps.length - 1, completionStatus: 'Hoàn tất hồ sơ' });
    setDraft(completedDraft);
    setIsDirty(false);

    if (nextAction === 'appointment') {
      navigate(`/appointments?patientId=${completedDraft.patientCode}`);
      return;
    }

    navigate(`/patients/${completedDraft.patientCode}${nextAction === 'followUp' ? '?action=follow-up' : ''}`);
  };

  return (
    <div className="new-patient-page">
      {toast ? (
        <div className="toast-notification onboarding-toast" role="status" aria-live="polite">
          <CheckCircle2 size={18} aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <div className="new-patient-header">
        <Link className="back-link btn-link" to="/patients">
          <ArrowLeft size={18} aria-hidden="true" />
          Quay lại danh sách
        </Link>
        <div>
          <span className="eyebrow">Hồ sơ bệnh nhân mới</span>
          <h1>{draft.basic.fullName || 'Bệnh nhân mới'} <span>{draft.patientCode}</span></h1>
          <p>Nhập tay từng phần, có thể lưu nháp và quay lại hoàn thiện sau.</p>
        </div>
      </div>

      <section className="new-patient-layout">
        <aside className="patient-onboarding-sidebar">
          <div className="draft-progress-card">
            <div className="progress-card-topline">
              <span>Hoàn thành</span>
              <strong>{progress}%</strong>
            </div>
            <div className="micro-progress" aria-hidden="true">
              <span className="micro-progress-fill progress-success" style={{ width: `${progress}%` }} />
            </div>
            <p>{activeStepIndex + 1}/6 bước · Lưu nháp ở mọi bước</p>
            <div className="missing-required-card">
              <span>Còn thiếu</span>
              {missingRequiredFields.length > 0 ? (
                <ul>
                  {missingRequiredFields.slice(0, 4).map((field) => <li key={field}>{field}</li>)}
                </ul>
              ) : (
                <strong>Đủ trường bắt buộc</strong>
              )}
            </div>
          </div>

          <nav className="patient-stepper" aria-label="Các bước nhập hồ sơ">
            {steps.map((step, index) => (
              <button key={step.id} className={index === activeStepIndex ? 'active' : ''} type="button" onClick={() => goToStep(index)}>
                <span>{index + 1}</span>
                <strong>{step.title}</strong>
                <small>{step.description}</small>
              </button>
            ))}
          </nav>
        </aside>

        <main className="patient-onboarding-main">
          <article className="onboarding-form-card">
            <div className="onboarding-form-heading">
              <span className="eyebrow">Bước {activeStepIndex + 1}/6</span>
              <h2>{activeStep.title}</h2>
              <p>{activeStep.description}</p>
            </div>

            <div className={`onboarding-step-content step-${activeStep.id}`}>
              {stepSections[activeStep.id].map((section) => (
                <StepSection
                  key={section.title}
                  groupId={activeStep.id}
                  section={section}
                  values={draft[activeStep.id]}
                  errors={errors}
                  onChange={(name, value) => updateField(activeStep.id, name, value)}
                  mealEditorProps={{
                    onStartAddDish: openAddDishModal,
                    onEditDish: (mealType, dishIndex) => setEditingDishRef({ mealType, dishIndex }),
                    onRemoveDish: removeDishFromMeal,
                  }}
                />
              ))}
            </div>
          </article>
        </main>
      </section>

      <MealDishModal
        addDishState={addDishState}
        editingDish={editingDish}
        selectedMealLabel={selectedMealLabel}
        filteredDishes={filteredLibraryDishes}
        onSearchChange={(value) => setAddDishState((current) => ({ ...current, searchTerm: value }))}
        onSelectDish={selectDishForAdd}
        onAddDish={addDishToMeal}
        onCloseAdd={closeAddDishModal}
        onCloseEdit={() => setEditingDishRef(null)}
        onAddServingChange={updateAddDishServing}
        onAddIngredientChange={updateAddDishIngredientQuantity}
        onEditServingChange={updateEditingServing}
        onEditIngredientChange={updateEditingIngredientQuantity}
      />

      <footer className="sticky-form-footer">
        <button className="btn-secondary" type="button" onClick={handleSaveDraft}>
          <Save size={16} aria-hidden="true" />
          Lưu nháp
        </button>
        <div className="sticky-footer-actions">
          <button className="btn-secondary" type="button" onClick={() => goToStep(Math.max(activeStepIndex - 1, 0))} disabled={activeStepIndex === 0}>
            Quay lại
          </button>
          {activeStepIndex < steps.length - 1 ? (
            <button className="btn-primary" type="button" onClick={goNext}>
              Lưu & tiếp tục
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ) : (
            <>
              <button className="btn-secondary" type="button" onClick={() => finishProfile('followUp')}>
                <MessageSquarePlus size={16} aria-hidden="true" />
                Hoàn tất và tạo theo dõi
              </button>
              <button className="btn-secondary" type="button" onClick={() => finishProfile('appointment')}>
                <CalendarPlus size={16} aria-hidden="true" />
                Hoàn tất & tạo lịch khám
              </button>
              <button className="btn-primary" type="button" onClick={() => finishProfile('profile')}>
                <FileText size={16} aria-hidden="true" />
                Hoàn tất hồ sơ
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
