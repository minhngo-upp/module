import React, { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy, ImageOff, PlusCircle, Repeat, Save, Search, Trash2, X } from 'lucide-react';
import { carePlanMockDB } from '../../mockData';

const RANGE_OPTIONS = [
  { value: 1, label: '1 ngày' },
  { value: 3, label: '3 ngày' },
  { value: 7, label: '7 ngày' },
  { value: 14, label: '14 ngày' },
  { value: 30, label: '30 ngày' },
];

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Bữa sáng' },
  { key: 'lunch', label: 'Bữa trưa' },
  { key: 'dinner', label: 'Bữa tối' },
  { key: 'snack', label: 'Bữa phụ' },
];

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function isoFromDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(dateString, dayOffset) {
  const next = new Date(`${dateString}T00:00:00`);
  next.setDate(next.getDate() + dayOffset);
  return isoFromDate(next);
}

function createEmptyDay(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const weekday = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return {
    date: dateString,
    label: `${weekday}, ${day}/${month}`,
    status: 'draft',
    notes: 'Chưa có thực đơn',
    totals: { calories: 0, targetCalories: 1850, filledMeals: 0 },
    meals: MEAL_TYPES.map((meal) => ({ mealType: meal.key, title: meal.label, items: [] })),
  };
}

function getLibraryDish(dishId) {
  return carePlanMockDB.meals.find((dish) => dish.id === dishId);
}

function hydrateDish(dish) {
  const libraryDish = getLibraryDish(dish.dishId);
  return {
    ...dish,
    dishName: dish.dishName ?? libraryDish?.name ?? 'Món ăn',
    image: dish.image ?? libraryDish?.image ?? '',
    serving: dish.serving ?? libraryDish?.servingLabel ?? '',
    ingredients: cloneData(dish.ingredients ?? libraryDish?.ingredients ?? []),
    calories:
      dish.calories ??
      cloneData(dish.ingredients ?? libraryDish?.ingredients ?? []).reduce((sum, ingredient) => sum + Number(ingredient.calories || 0), 0),
  };
}

function createDraftDishFromLibrary(libraryDish) {
  return hydrateDish({
    dishId: libraryDish.id,
    dishName: libraryDish.name,
    image: libraryDish.image,
    serving: libraryDish.servingLabel,
    calories: libraryDish.calories,
    ingredients: cloneData(libraryDish.ingredients),
    isCustomized: false,
  });
}

function hydrateDay(day) {
  return {
    ...day,
    meals: (day.meals ?? []).map((meal) => ({
      ...meal,
      items: (meal.items ?? []).map((dish) => hydrateDish(dish)),
    })),
  };
}

function recalculateDay(day) {
  const calories = day.meals.reduce(
    (daySum, meal) => daySum + meal.items.reduce((mealSum, item) => mealSum + Number(item.calories || 0), 0),
    0,
  );
  const filledMeals = day.meals.filter((meal) => meal.items.length > 0).length;
  const targetCalories = day.totals?.targetCalories ?? 1850;
  const delta = targetCalories ? Math.abs(calories - targetCalories) : 0;

  let status = 'draft';
  let notes = 'Chưa có thực đơn';

  if (filledMeals === 0) {
    status = 'draft';
    notes = 'Chưa có thực đơn';
  } else if (filledMeals < 4) {
    status = 'warning';
    notes = 'Thiếu ít nhất 1 bữa';
  } else if (delta > 180) {
    status = 'review';
    notes = 'Lệch kcal so với mục tiêu';
  } else {
    status = 'ready';
    notes = 'Đã đủ các bữa chính';
  }

  return {
    ...day,
    status,
    notes,
    totals: {
      ...day.totals,
      calories,
      targetCalories,
      filledMeals,
    },
  };
}

function buildDays(baseDays, startDate, durationDays) {
  const byDate = new Map(baseDays.map((day) => [day.date, hydrateDay(cloneData(day))]));
  const days = [];

  for (let index = 0; index < durationDays; index += 1) {
    const date = addDays(startDate, index);
    const existing = byDate.get(date);
    days.push(recalculateDay(existing ?? createEmptyDay(date)));
  }

  return days;
}

function PlannerToolbar({ rangeDays, startDate, setRangeDays, setStartDate, metrics, onDuplicateDay, onApplyRange, onRepeatWeekly, onClearDay }) {
  return (
    <article className="card planner-toolbar-card">
      <div className="planner-toolbar-top">
        <div className="section-heading">
          <span className="eyebrow">Kế hoạch thực đơn</span>
          <h2>Lập thực đơn từ 1 ngày đến 1 tháng cho bệnh nhân</h2>
          <p>Chọn chu kỳ, chỉnh theo từng ngày, sau đó nhân bản hoặc lặp lại để tăng tốc độ thao tác.</p>
        </div>

        <div className="planner-toolbar-actions">
          <button className="btn-secondary" type="button" onClick={onDuplicateDay}>
            <Copy size={16} className="button-icon-inline" aria-hidden="true" />
            Nhân bản ngày
          </button>
          <button className="btn-secondary" type="button" onClick={onRepeatWeekly}>
            <Repeat size={16} className="button-icon-inline" aria-hidden="true" />
            Lặp theo tuần
          </button>
          <button className="btn-secondary" type="button" onClick={onApplyRange}>
            <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
            Áp dụng cho khoảng ngày
          </button>
          <button className="btn-secondary danger-ghost" type="button" onClick={onClearDay}>
            <Trash2 size={16} className="button-icon-inline" aria-hidden="true" />
            Xóa ngày
          </button>
        </div>
      </div>

      <div className="planner-toolbar-bottom">
        <div className="planner-control-group">
          <span>Chu kỳ</span>
          <div className="range-chip-group" role="tablist" aria-label="Chọn phạm vi lập thực đơn">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`range-chip ${rangeDays === option.value ? 'active' : ''}`}
                type="button"
                onClick={() => setRangeDays(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <label className="planner-control-group planner-date-control">
          <span>Ngày bắt đầu</span>
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <div className="planner-metrics">
          <div className="planner-metric">
            <span>Ngày đã có thực đơn</span>
            <strong>{metrics.readyDays}/{metrics.totalDays}</strong>
          </div>
          <div className="planner-metric">
            <span>Ngày còn trống</span>
            <strong>{metrics.emptyDays}</strong>
          </div>
          <div className="planner-metric">
            <span>Kcal trung bình</span>
            <strong>{metrics.avgCalories} kcal</strong>
          </div>
        </div>
      </div>
    </article>
  );
}

function DayRail({ days, selectedDate, onSelect }) {
  return (
    <article className="card planner-rail-card">
      <div className="section-heading">
        <span className="eyebrow">Lịch thực đơn</span>
        <h2>Danh sách ngày trong chu kỳ</h2>
      </div>

      <div className="planner-day-rail">
        {days.map((day) => (
          <button
            key={day.date}
            className={`planner-day-card ${selectedDate === day.date ? 'active' : ''}`}
            type="button"
            onClick={() => onSelect(day.date)}
          >
            <div className="planner-day-card-top">
              <strong>{day.label}</strong>
              <span className={`day-status-badge status-${day.status}`}>{day.status}</span>
            </div>
            <div className="planner-day-card-meta">
              <span>{day.totals.calories} kcal</span>
              <span>{day.totals.filledMeals}/4 bữa</span>
            </div>
            <p>{day.notes}</p>
          </button>
        ))}
      </div>
    </article>
  );
}

function DishEditor({ dish, onServingChange, onIngredientChange }) {
  return (
    <div className="dish-editor">
      {dish.image ? <img className="dish-editor-image" src={dish.image} alt={dish.dishName} /> : null}

      <div className="dish-editor-summary">
        <div className="dish-editor-summary-item">
          <span>Món</span>
          <strong>{dish.dishName}</strong>
        </div>
        <div className="dish-editor-summary-item">
          <span>Năng lượng</span>
          <strong>{dish.calories} kcal</strong>
        </div>
        <div className="dish-editor-summary-item">
          <span>Nguyên liệu</span>
          <strong>{dish.ingredients.length} thành phần</strong>
        </div>
      </div>

      <label className="dish-field">
        <span>Khẩu phần</span>
        <input type="text" value={dish.serving} onChange={(event) => onServingChange(event.target.value)} />
      </label>

      <div className="ingredient-editor-list">
        {dish.ingredients.map((ingredient, index) => (
          <div key={ingredient.ingredientId ?? `${dish.dishId}-${index}`} className="ingredient-editor-row">
            <div>
              <strong>{ingredient.name}</strong>
              <p>{ingredient.calories} kcal</p>
            </div>
            <div className="ingredient-input-group">
              <input
                type="number"
                min="0"
                step="1"
                value={ingredient.quantity}
                onChange={(event) => onIngredientChange(index, event.target.value)}
              />
              <span>{ingredient.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DishEditModal({ dish, onClose, onServingChange, onIngredientChange }) {
  if (!dish) return null;

  return (
    <div className="planner-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="planner-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-edit-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="planner-modal-header">
          <div>
            <span className="eyebrow">Sửa món</span>
            <h2 id="dish-edit-modal-title">{dish.dishName}</h2>
          </div>
          <button className="btn-icon" type="button" aria-label="Đóng popup sửa món" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <DishEditor dish={dish} onServingChange={onServingChange} onIngredientChange={onIngredientChange} />

        <div className="planner-modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function AddDishModal({
  mealLabel,
  searchTerm,
  onSearchChange,
  selectedDishId,
  filteredDishes,
  draftDish,
  onSelectDish,
  onServingChange,
  onIngredientChange,
  onAddDish,
  onClose,
}) {
  if (!mealLabel) return null;

  return (
    <div className="planner-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="planner-modal planner-modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-dish-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="planner-modal-header">
          <div>
            <span className="eyebrow">Thêm món</span>
            <h2 id="add-dish-modal-title">{mealLabel}</h2>
            <p className="planner-modal-description">
              Tìm món, xem nguyên liệu, chỉnh nếu cần rồi thêm trực tiếp vào thực đơn.
            </p>
          </div>
          <button className="btn-icon" type="button" aria-label="Đóng popup thêm món" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="add-dish-layout">
          <section className="add-dish-results">
            <label className="dish-field add-dish-search">
              <span>Tìm món trong thư viện</span>
              <div className="add-dish-search-input">
                <Search size={16} aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Nhập tên món cần tìm..."
                  value={searchTerm}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </div>
            </label>

            <div className="add-dish-result-list" role="list" aria-label={`Danh sách món cho ${mealLabel}`}>
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => {
                  const isActive = selectedDishId === dish.id;
                  return (
                    <button
                      key={dish.id}
                      className={`add-dish-result-card ${isActive ? 'active' : ''}`}
                      type="button"
                      onClick={() => onSelectDish(dish)}
                    >
                      <div className="add-dish-result-media">
                        {dish.image ? (
                          <img className="add-dish-result-image" src={dish.image} alt={dish.name} />
                        ) : (
                          <div className="dish-card-image-fallback add-dish-result-fallback" aria-hidden="true">
                            <ImageOff size={18} />
                          </div>
                        )}
                      </div>
                      <div className="add-dish-result-copy">
                        <div className="add-dish-result-topline">
                          <strong>{dish.name}</strong>
                          {isActive ? <Check size={16} aria-hidden="true" /> : null}
                        </div>
                        <p>
                          {dish.calories} kcal • {dish.servingLabel} • {dish.ingredients.length} nguyên liệu
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="add-dish-empty">
                  <strong>Không tìm thấy món phù hợp</strong>
                  <p>Thử nhập tên món ngắn hơn hoặc đổi sang một bữa khác.</p>
                </div>
              )}
            </div>
          </section>

          <section className="add-dish-preview">
            {draftDish ? (
              <>
                <div className="section-heading">
                  <span className="eyebrow">Xem trước món</span>
                  <h3>{draftDish.dishName}</h3>
                </div>

                <DishEditor dish={draftDish} onServingChange={onServingChange} onIngredientChange={onIngredientChange} />
              </>
            ) : (
              <div className="add-dish-empty add-dish-empty-preview">
                <strong>Chưa chọn món</strong>
                <p>Nhập tên món, chọn một món ở cột trái rồi chỉnh nguyên liệu trước khi thêm vào thực đơn.</p>
              </div>
            )}
          </section>
        </div>

        <div className="planner-modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-primary" type="button" onClick={onAddDish} disabled={!draftDish}>
            <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
            Thêm món ăn vào thực đơn
          </button>
        </div>
      </div>
    </div>
  );
}

function DishCard({ dish, onEdit, onMoveUp, onMoveDown, onRemove }) {
  return (
    <article className="dish-card">
      <div className="dish-card-main">
        <div className="dish-card-copy">
          <div className="dish-card-topline">
            <strong>{dish.dishName}</strong>
            <span className={`dish-custom-badge ${dish.isCustomized ? 'customized' : ''}`}>
              {dish.isCustomized ? 'Đã chỉnh riêng' : 'Mặc định'}
            </span>
          </div>

          <div className="dish-card-details">
            <div className="dish-card-media">
              {dish.image ? (
                <img className="dish-card-image" src={dish.image} alt={dish.dishName} />
              ) : (
                <div className="dish-card-image-fallback" aria-hidden="true">
                  <ImageOff size={20} />
                </div>
              )}
            </div>

            <div className="dish-card-meta">
              <p className="dish-card-description">
                {dish.calories} kcal • {dish.serving} • {dish.ingredients.length} nguyên liệu
              </p>
              <div className="dish-card-meta-grid">
                <div className="dish-meta-chip">
                  <span>Khẩu phần</span>
                  <strong>{dish.serving}</strong>
                </div>
                <div className="dish-meta-chip">
                  <span>Năng lượng</span>
                  <strong>{dish.calories} kcal</strong>
                </div>
                <div className="dish-meta-chip">
                  <span>Nguyên liệu</span>
                  <strong>{dish.ingredients.length} thành phần</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dish-card-actions">
          <button className="btn-icon" type="button" aria-label={`Di chuyển ${dish.dishName} lên`} onClick={onMoveUp}>
            <ChevronUp size={16} aria-hidden="true" />
          </button>
          <button className="btn-icon" type="button" aria-label={`Di chuyển ${dish.dishName} xuống`} onClick={onMoveDown}>
            <ChevronDown size={16} aria-hidden="true" />
          </button>
          <button className="btn-secondary btn-small" type="button" onClick={onEdit}>
            Sửa món
          </button>
          <button className="btn-icon danger-ghost" type="button" aria-label={`Xóa ${dish.dishName}`} onClick={onRemove}>
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

function MealSlotCard({ meal, onStartAddDish, onOpenDishEditor, onMoveDish, onRemoveDish }) {
  return (
    <section className="meal-slot-card">
      <div className="meal-slot-header">
        <div>
          <h3>{meal.title}</h3>
          <p>{meal.items.length > 0 ? `${meal.items.length} món đã chọn` : 'Chưa có món nào trong bữa này'}</p>
        </div>
        <button className="btn-secondary btn-small" type="button" onClick={() => onStartAddDish(meal.mealType)}>
          <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
          Thêm món
        </button>
      </div>

      {meal.items.length > 0 ? (
        <div className="dish-list">
          {meal.items.map((dish, dishIndex) => (
            <DishCard
              key={`${dish.dishId}-${dishIndex}`}
              dish={dish}
              onEdit={() => onOpenDishEditor(meal.mealType, dishIndex)}
              onMoveUp={() => onMoveDish(meal.mealType, dishIndex, -1)}
              onMoveDown={() => onMoveDish(meal.mealType, dishIndex, 1)}
              onRemove={() => onRemoveDish(meal.mealType, dishIndex)}
            />
          ))}
        </div>
      ) : (
        <p className="empty-copy">Thêm món từ thư viện để hoàn thiện bữa này.</p>
      )}
    </section>
  );
}

function DayPlanEditor({
  day,
  patient,
  onStartAddDish,
  onOpenDishEditor,
  onMoveDish,
  onRemoveDish,
}) {
  const summaryWarnings = [];
  const statusLabels = {
    draft: 'Chưa hoàn thiện',
    warning: 'Thiếu bữa',
    review: 'Cần rà soát',
    ready: 'Ổn định',
  };
  if (day.totals.filledMeals < 4) summaryWarnings.push('Thiếu bữa');
  if (day.totals.calories < day.totals.targetCalories - 150) summaryWarnings.push('Chưa đạt kcal mục tiêu');
  if (day.status === 'review') summaryWarnings.push('Cần rà soát lại');

  return (
    <article className="card planner-editor-card">
      <div className="planner-editor-header">
        <div className="section-heading">
          <span className="eyebrow">Chi tiết ngày</span>
          <h2>{day.label}</h2>
          <p>{day.notes}</p>
        </div>

        <div className="planner-editor-kpis">
          <div className="planner-editor-kpi">
            <span>Tổng kcal</span>
            <strong>{day.totals.calories}</strong>
            <small>Năng lượng hiện tại</small>
          </div>
          <div className="planner-editor-kpi">
            <span>Mục tiêu</span>
            <strong>{day.totals.targetCalories}</strong>
            <small>Mốc cần đạt</small>
          </div>
          <div className="planner-editor-kpi">
            <span>Trạng thái</span>
            <strong>{statusLabels[day.status] ?? day.status}</strong>
            <small>{day.totals.filledMeals}/4 bữa đã lên món</small>
          </div>
        </div>
      </div>

      <div className="planner-summary-strip">
        <div className="planner-summary-pill">
          <strong>{patient.interventionPlan.goals[0]}</strong>
        </div>
        <div className="planner-summary-pill muted">
          <span>Cảnh báo:</span>
          <strong>{summaryWarnings.length > 0 ? summaryWarnings.join(' • ') : 'Không có'}</strong>
        </div>
      </div>

      <div className="meal-slot-list">
        {day.meals.map((meal) => (
          <MealSlotCard
            key={meal.mealType}
            meal={meal}
            onStartAddDish={onStartAddDish}
            onOpenDishEditor={onOpenDishEditor}
            onMoveDish={onMoveDish}
            onRemoveDish={onRemoveDish}
          />
        ))}
      </div>
    </article>
  );
}

function PlanSummaryPanel({ days, patient }) {
  const metrics = useMemo(() => {
    const emptyDays = days.filter((day) => day.totals.filledMeals === 0).length;
    const warningDays = days.filter((day) => day.status === 'warning').length;
    const reviewDays = days.filter((day) => day.status === 'review').length;
    const customizedDays = days.filter((day) => day.meals.some((meal) => meal.items.some((item) => item.isCustomized))).length;
    return { emptyDays, warningDays, reviewDays, customizedDays };
  }, [days]);

  return (
    <aside className="planner-summary-panel">
      <article className="card planner-side-card">
        <div className="section-heading">
          <span className="eyebrow">Tóm tắt chu kỳ</span>
          <h2>Rà soát nhanh trước khi lưu</h2>
        </div>

        <div className="planner-side-stats">
          <div>
            <span>Ngày còn trống</span>
            <strong>{metrics.emptyDays}</strong>
          </div>
          <div>
            <span>Ngày thiếu bữa</span>
            <strong>{metrics.warningDays}</strong>
          </div>
          <div>
            <span>Ngày cần rà soát kcal</span>
            <strong>{metrics.reviewDays}</strong>
          </div>
          <div>
            <span>Ngày đã chỉnh riêng</span>
            <strong>{metrics.customizedDays}</strong>
          </div>
        </div>
      </article>

      <article className="card planner-side-card">
        <div className="section-heading">
          <span className="eyebrow">Khuyến nghị</span>
          <h2>Nội dung cần nhắc bệnh nhân</h2>
        </div>

        <ul className="detail-list">
          {patient.interventionPlan.recommendations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <article className="card planner-side-card">
        <div className="section-heading">
          <span className="eyebrow">Hỗ trợ dinh dưỡng</span>
          <h2>Bổ sung và vận động đi kèm kế hoạch</h2>
        </div>

        <div className="support-list">
          {carePlanMockDB.medicines.slice(0, 2).map((item) => (
            <div key={item.id} className="support-row">
              <strong>{item.name}</strong>
              <p>{item.usage}</p>
            </div>
          ))}
          {carePlanMockDB.exercises.slice(0, 2).map((item) => (
            <div key={item.id} className="support-row">
              <strong>{item.name}</strong>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </article>
    </aside>
  );
}

export default function CarePlanTab({ patient, showToast }) {
  const [rangeDays, setRangeDays] = useState(patient.mealPlanRange.durationDays);
  const [startDate, setStartDate] = useState(patient.mealPlanRange.startDate);
  const [days, setDays] = useState(() => buildDays(patient.mealPlanDays, patient.mealPlanRange.startDate, patient.mealPlanRange.durationDays));
  const [selectedDate, setSelectedDate] = useState(patient.mealPlanRange.startDate);
  const [draftSelections, setDraftSelections] = useState({});
  const [addDishState, setAddDishState] = useState({
    mealType: '',
    searchTerm: '',
    selectedDishId: '',
    draftDish: null,
  });
  const [editingDishRef, setEditingDishRef] = useState(null);

  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0];
  const editingDish =
    editingDishRef && selectedDay?.date === editingDishRef.date
      ? selectedDay.meals.find((meal) => meal.mealType === editingDishRef.mealType)?.items[editingDishRef.dishIndex] ?? null
      : null;
  const selectedMealLabel = MEAL_TYPES.find((item) => item.key === addDishState.mealType)?.label ?? '';
  const filteredLibraryDishes = useMemo(() => {
    if (!addDishState.mealType) return [];

    const normalizedSearch = addDishState.searchTerm.trim().toLowerCase();
    return carePlanMockDB.meals.filter((item) => {
      if (!item.mealTypes.includes(addDishState.mealType)) return false;
      if (!normalizedSearch) return true;
      return item.name.toLowerCase().includes(normalizedSearch);
    });
  }, [addDishState.mealType, addDishState.searchTerm]);

  const plannerMetrics = useMemo(() => {
    const readyDays = days.filter((day) => day.totals.filledMeals > 0).length;
    const emptyDays = days.filter((day) => day.totals.filledMeals === 0).length;
    const totalCalories = days.reduce((sum, day) => sum + day.totals.calories, 0);
    return {
      readyDays,
      emptyDays,
      totalDays: days.length,
      avgCalories: days.length > 0 ? Math.round(totalCalories / days.length) : 0,
    };
  }, [days]);

  const updateCurrentDay = (updater) => {
    setDays((currentDays) =>
      currentDays.map((day) => {
        if (day.date !== selectedDate) return day;
        const updated = updater(cloneData(day));
        return recalculateDay(updated);
      }),
    );
  };

  const addDishToMealLegacy = (mealType) => {
    const draftDishId = draftSelections[mealType];
    if (!draftDishId) return;

    const libraryDish = getLibraryDish(draftDishId);
    if (!libraryDish) return;

    updateCurrentDay((day) => {
      const meal = day.meals.find((item) => item.mealType === mealType);
      meal.items.push(hydrateDish({
        dishId: libraryDish.id,
        dishName: libraryDish.name,
        image: libraryDish.image,
        serving: libraryDish.servingLabel,
        calories: libraryDish.calories,
        ingredients: cloneData(libraryDish.ingredients),
        isCustomized: false,
      }));
      return day;
    });

    setDraftSelections((current) => ({ ...current, [mealType]: '' }));
    showToast(`Đã thêm món vào ${MEAL_TYPES.find((item) => item.key === mealType)?.label ?? 'bữa ăn'}`);
  };

  void addDishToMealLegacy;

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

    updateCurrentDay((day) => {
      const meal = day.meals.find((item) => item.mealType === addDishState.mealType);
      meal.items.push(cloneData(addDishState.draftDish));
      return day;
    });

    showToast(`Đã thêm món vào ${selectedMealLabel || 'bữa ăn'}`);
    setAddDishState((current) => ({
      ...current,
      searchTerm: '',
      selectedDishId: '',
      draftDish: null,
    }));
  };

  const moveDish = (mealType, dishIndex, direction) => {
    updateCurrentDay((day) => {
      const meal = day.meals.find((item) => item.mealType === mealType);
      const nextIndex = dishIndex + direction;
      if (!meal || nextIndex < 0 || nextIndex >= meal.items.length) return day;
      const items = [...meal.items];
      [items[dishIndex], items[nextIndex]] = [items[nextIndex], items[dishIndex]];
      meal.items = items;
      return day;
    });
  };

  const removeDish = (mealType, dishIndex) => {
    updateCurrentDay((day) => {
      const meal = day.meals.find((item) => item.mealType === mealType);
      meal.items.splice(dishIndex, 1);
      return day;
    });
  };

  const updateServing = (mealType, dishIndex, nextServing) => {
    updateCurrentDay((day) => {
      const dish = day.meals.find((item) => item.mealType === mealType).items[dishIndex];
      dish.serving = nextServing;
      dish.isCustomized = true;
      return day;
    });
  };

  const updateIngredientQuantity = (mealType, dishIndex, ingredientIndex, nextQuantityRaw) => {
    const nextQuantity = Math.max(0, Number(nextQuantityRaw || 0));
    updateCurrentDay((day) => {
      const dish = day.meals.find((item) => item.mealType === mealType).items[dishIndex];
      const ingredient = dish.ingredients[ingredientIndex];
      const currentQuantity = Number(ingredient.quantity) || 1;
      const caloriesPerUnit = Number(ingredient.calories) / currentQuantity;
      ingredient.quantity = nextQuantity;
      ingredient.calories = Math.round(caloriesPerUnit * nextQuantity);
      dish.calories = dish.ingredients.reduce((sum, current) => sum + Number(current.calories || 0), 0);
      dish.isCustomized = true;
      return day;
    });
  };

  const copyMeals = (sourceDay) => sourceDay.meals.map((meal) => ({ ...meal, items: cloneData(meal.items) }));

  const duplicateCurrentDay = () => {
    const currentIndex = days.findIndex((day) => day.date === selectedDate);
    if (currentIndex === -1 || currentIndex === days.length - 1) return;

    const source = days[currentIndex];
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === currentIndex + 1
          ? recalculateDay({ ...day, meals: copyMeals(source), notes: `Nhân bản từ ${source.label}` })
          : day,
      ),
    );
    showToast('Đã nhân bản thực đơn sang ngày tiếp theo');
  };

  const applyCurrentDayToRange = () => {
    const source = days.find((day) => day.date === selectedDate);
    if (!source) return;
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.date === selectedDate ? day : recalculateDay({ ...day, meals: copyMeals(source), notes: `Áp dụng từ ${source.label}` }),
      ),
    );
    showToast('Đã áp dụng ngày hiện tại cho toàn bộ chu kỳ đang xem');
  };

  const repeatWeekly = () => {
    const source = days.find((day) => day.date === selectedDate);
    if (!source) return;
    const weekday = new Date(`${source.date}T00:00:00`).getDay();
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.date === selectedDate || new Date(`${day.date}T00:00:00`).getDay() !== weekday
          ? day
          : recalculateDay({ ...day, meals: copyMeals(source), notes: `Lặp lại theo ${source.label}` }),
      ),
    );
    showToast('Đã lặp lại thực đơn theo chu kỳ tuần');
  };

  const clearCurrentDay = () => {
    setDays((currentDays) => currentDays.map((day) => (day.date === selectedDate ? recalculateDay(createEmptyDay(day.date)) : day)));
    setEditingDishRef(null);
    showToast('Đã xóa thực đơn của ngày đang chọn');
  };

  const savePlan = () => {
    showToast(`Đã lưu kế hoạch ${rangeDays} ngày bắt đầu từ ${startDate}`);
  };

  const resetPlannerWindow = (nextStartDate, nextRangeDays) => {
    const nextDays = buildDays(patient.mealPlanDays, nextStartDate, nextRangeDays);
    setDays(nextDays);
    setSelectedDate((current) => (nextDays.some((day) => day.date === current) ? current : nextDays[0]?.date ?? nextStartDate));
  };

  return (
    <div className="tab-pane care-plan-tab">
      <div className="planner-shell">
        <PlannerToolbar
          rangeDays={rangeDays}
          startDate={startDate}
          setRangeDays={(nextRangeDays) => {
            setRangeDays(nextRangeDays);
            resetPlannerWindow(startDate, nextRangeDays);
          }}
          setStartDate={(nextStartDate) => {
            setStartDate(nextStartDate);
            resetPlannerWindow(nextStartDate, rangeDays);
          }}
          metrics={plannerMetrics}
          onDuplicateDay={duplicateCurrentDay}
          onApplyRange={applyCurrentDayToRange}
          onRepeatWeekly={repeatWeekly}
          onClearDay={clearCurrentDay}
        />

        <section className="planner-workspace">
          <DayRail days={days} selectedDate={selectedDate} onSelect={setSelectedDate} />

          {selectedDay ? (
            <DayPlanEditor
              day={selectedDay}
              patient={patient}
              onStartAddDish={openAddDishModal}
              onOpenDishEditor={(mealType, dishIndex) => setEditingDishRef({ date: selectedDay.date, mealType, dishIndex })}
              onMoveDish={moveDish}
              onRemoveDish={removeDish}
            />
          ) : null}

          <PlanSummaryPanel days={days} patient={patient} />
        </section>

        <div className="planner-save-row">
          <button className="btn-primary" type="button" onClick={savePlan}>
            <Save size={16} className="button-icon-inline" aria-hidden="true" />
            Lưu kế hoạch
          </button>
        </div>

        <DishEditModal
          dish={editingDish}
          onClose={() => setEditingDishRef(null)}
          onServingChange={(value) => {
            if (!editingDishRef) return;
            updateServing(editingDishRef.mealType, editingDishRef.dishIndex, value);
          }}
          onIngredientChange={(ingredientIndex, value) => {
            if (!editingDishRef) return;
            updateIngredientQuantity(editingDishRef.mealType, editingDishRef.dishIndex, ingredientIndex, value);
          }}
        />

        <AddDishModal
          mealLabel={selectedMealLabel}
          searchTerm={addDishState.searchTerm}
          onSearchChange={(value) =>
            setAddDishState((current) => ({
              ...current,
              searchTerm: value,
            }))
          }
          selectedDishId={addDishState.selectedDishId}
          filteredDishes={filteredLibraryDishes}
          draftDish={addDishState.draftDish}
          onSelectDish={selectDishForAdd}
          onServingChange={updateAddDishServing}
          onIngredientChange={updateAddDishIngredientQuantity}
          onAddDish={addDishToMeal}
          onClose={closeAddDishModal}
        />
      </div>
    </div>
  );
}
