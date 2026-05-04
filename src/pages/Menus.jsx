import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Database,
  Flame,
  Plus,
  PlusCircle,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import './Dashboard.css';

const menuRangeOptions = [1, 3, 7, 14, 30];


const mealSlots = ['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Bữa phụ'];


const foodDatabase = [
  { id: 'oat-yogurt', name: 'Yến mạch sữa chua', group: 'Tinh bột chậm', calories: 320, protein: '16g', note: 'Bữa sáng no lâu', serving: '1 tô', ingredients: ['Yến mạch', 'Sữa chua không đường', 'Chuối', 'Hạt chia'] },
  { id: 'brown-rice', name: 'Cơm gạo lứt', group: 'Tinh bột chậm', calories: 210, protein: '5g', note: 'Khẩu phần 1 chén', serving: '1 chén', ingredients: ['Gạo lứt', 'Mè rang'] },
  { id: 'chicken-breast', name: 'Ức gà áp chảo', group: 'Đạm nạc', calories: 260, protein: '42g', note: 'Ít dầu, bỏ da', serving: '120g', ingredients: ['Ức gà', 'Dầu olive', 'Tiêu', 'Rau thơm'] },
  { id: 'salmon', name: 'Cá hồi nướng', group: 'Đạm béo tốt', calories: 330, protein: '34g', note: 'Giàu omega-3', serving: '130g', ingredients: ['Cá hồi', 'Chanh', 'Măng tây'] },
  { id: 'tofu-tomato', name: 'Đậu hũ sốt cà', group: 'Đạm thực vật', calories: 240, protein: '18g', note: 'Phù hợp bữa tối nhẹ', serving: '1 phần', ingredients: ['Đậu hũ', 'Cà chua', 'Hành lá'] },
  { id: 'vegetable-soup', name: 'Canh rau xanh', group: 'Rau củ', calories: 90, protein: '4g', note: 'Tăng chất xơ', serving: '1 bát', ingredients: ['Rau cải', 'Bí xanh', 'Nấm'] },
  { id: 'sweet-potato', name: 'Khoai lang hấp', group: 'Tinh bột chậm', calories: 180, protein: '3g', note: 'Thay cơm cho bữa phụ', serving: '150g', ingredients: ['Khoai lang'] },
  { id: 'greek-yogurt', name: 'Sữa chua Hy Lạp', group: 'Bữa phụ', calories: 140, protein: '12g', note: 'Không đường', serving: '1 hũ', ingredients: ['Sữa chua Hy Lạp', 'Hạnh nhân'] },
];


const interventionPatients = [
  { id: 'BN001', name: 'Nguyễn Thị Hoa', goal: 'Giảm cân, tăng tuân thủ' },
  { id: 'BN002', name: 'Trần Văn Nam', goal: 'Kiểm soát mỡ máu' },
  { id: 'BN004', name: 'Lê Hoàng Anh', goal: 'Dinh dưỡng thể thao' },
];


const menuTemplates = [
  {
    id: 'balanced-1500',
    name: 'Thực đơn cân bằng 1.500 kcal',
    description: 'Dành cho bệnh nhân kiểm soát cân nặng, ưu tiên đạm nạc, rau xanh và tinh bột chậm.',
    targetCalories: 1500,
    duration: '7 ngày',
    goal: 'Giảm cân nhẹ',
    days: [
      {
        day: 'Ngày 1',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[0], foodDatabase[7]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[2], foodDatabase[5]] },
          { name: 'Bữa tối', items: [foodDatabase[3], foodDatabase[6]] },
          { name: 'Bữa phụ', items: [foodDatabase[7]] },
        ],
      },
      {
        day: 'Ngày 2',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[6], foodDatabase[7]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[3], foodDatabase[5]] },
          { name: 'Bữa tối', items: [foodDatabase[4], foodDatabase[5]] },
          { name: 'Bữa phụ', items: [foodDatabase[6]] },
        ],
      },
    ],
  },
  {
    id: 'diabetes-1700',
    name: 'Kiểm soát đường huyết 1.700 kcal',
    description: 'Phân bổ carbohydrate ổn định trong ngày, hạn chế đường nhanh và tăng chất xơ hòa tan.',
    targetCalories: 1700,
    duration: '5 ngày',
    goal: 'Đái tháo đường',
    days: [
      {
        day: 'Ngày 1',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[0]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[2], foodDatabase[5]] },
          { name: 'Bữa tối', items: [foodDatabase[4], foodDatabase[5]] },
          { name: 'Bữa phụ', items: [foodDatabase[7]] },
        ],
      },
      {
        day: 'Ngày 2',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[6], foodDatabase[7]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[2]] },
          { name: 'Bữa tối', items: [foodDatabase[3], foodDatabase[5]] },
          { name: 'Bữa phụ', items: [foodDatabase[6]] },
        ],
      },
    ],
  },
  {
    id: 'sport-2200',
    name: 'Tăng cơ thể thao 2.200 kcal',
    description: 'Tăng năng lượng và protein cho người tập luyện đều, chia bữa phụ trước và sau tập.',
    targetCalories: 2200,
    duration: '7 ngày',
    goal: 'Tăng cơ',
    days: [
      {
        day: 'Ngày 1',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[0], foodDatabase[7]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[2], foodDatabase[6]] },
          { name: 'Bữa tối', items: [foodDatabase[3], foodDatabase[5]] },
          { name: 'Bữa phụ', items: [foodDatabase[7]] },
        ],
      },
      {
        day: 'Ngày 2',
        meals: [
          { name: 'Bữa sáng', items: [foodDatabase[0], foodDatabase[6]] },
          { name: 'Bữa trưa', items: [foodDatabase[1], foodDatabase[2], foodDatabase[5]] },
          { name: 'Bữa tối', items: [foodDatabase[3], foodDatabase[7]] },
          { name: 'Bữa phụ', items: [foodDatabase[6], foodDatabase[7]] },
        ],
      },
    ],
  },
];


function cloneMenuTemplate(template) {
  return {
    ...template,
    days: template.days.map((day) => ({
      ...day,
      meals: mealSlots.map((mealName) => {
        const meal = day.meals.find((item) => item.name === mealName) ?? { name: mealName, items: [] };
        return { ...meal, items: [...meal.items] };
      }),
    })),
  };
}


function createMenuDay(index) {
  return {
    day: `Ngày ${index + 1}`,
    meals: mealSlots.map((mealName) => ({ name: mealName, items: [] })),
  };
}


function resizeMenuDays(menu, nextLength) {
  const days = Array.from({ length: nextLength }, (_, index) => {
    const existing = menu.days[index];
    return existing ? { ...existing, day: `Ngày ${index + 1}` } : createMenuDay(index);
  });
  return { ...menu, duration: `${nextLength} ngày`, days };
}


function getMenuCalories(menu) {
  const total = menu.days.reduce(
    (sum, day) => sum + day.meals.reduce((mealSum, meal) => mealSum + meal.items.reduce((itemSum, item) => itemSum + item.calories, 0), 0),
    0,
  );
  return Math.round(total / menu.days.length);
}


function AddMenuDishModal({ isOpen, mealName, foods, searchTerm, selectedFood, onClose, onSearchChange, onSelectFood, onAddDish }) {
  if (!isOpen) return null;

  return (
    <div className="menu-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="menu-modal menu-modal-wide" role="dialog" aria-modal="true" aria-labelledby="menu-add-dish-title" onClick={(event) => event.stopPropagation()}>
        <div className="menu-modal-header">
          <div>
            <span className="dashboard-eyebrow">Thêm món</span>
            <h2 id="menu-add-dish-title">{mealName}</h2>
            <p>Tìm món trong kho data, xem thành phần rồi thêm vào thực đơn mẫu.</p>
          </div>
          <button className="btn-icon" type="button" aria-label="Đóng popup thêm món" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="menu-add-dish-layout">
          <section className="menu-add-dish-results">
            <label className="menu-dish-field">
              <span>Tìm món trong thư viện</span>
              <div className="menu-dish-search-input">
                <Search size={16} aria-hidden="true" />
                <input type="search" placeholder="Nhập tên món cần tìm..." value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} />
              </div>
            </label>
            <div className="menu-dish-result-list">
              {foods.map((food) => (
                <button className={`menu-dish-result-card ${selectedFood?.id === food.id ? 'active' : ''}`} type="button" key={food.id} onClick={() => onSelectFood(food)}>
                  <div>
                    <span>{food.group}</span>
                    <strong>{food.name}</strong>
                    <p>{food.calories} kcal · {food.serving} · {food.protein} đạm</p>
                  </div>
                  {selectedFood?.id === food.id ? <CheckCircle2 size={16} aria-hidden="true" /> : null}
                </button>
              ))}
              {foods.length === 0 ? (
                <div className="menu-dish-empty">
                  <strong>Không tìm thấy món phù hợp</strong>
                  <p>Thử nhập tên món ngắn hơn hoặc upload thực đơn để hệ thống quét thêm món.</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="menu-add-dish-preview">
            {selectedFood ? (
              <>
                <div className="section-heading">
                  <span className="dashboard-eyebrow">Xem trước món</span>
                  <h3>{selectedFood.name}</h3>
                </div>
                <div className="menu-dish-preview-summary">
                  <div><span>Năng lượng</span><strong>{selectedFood.calories} kcal</strong></div>
                  <div><span>Khẩu phần</span><strong>{selectedFood.serving}</strong></div>
                  <div><span>Đạm</span><strong>{selectedFood.protein}</strong></div>
                </div>
                <div className="menu-ingredient-list">
                  {selectedFood.ingredients.map((ingredient) => (
                    <span key={ingredient}>{ingredient}</span>
                  ))}
                </div>
                <label className="menu-dish-field">
                  <span>Ghi chú can thiệp</span>
                  <textarea rows="3" defaultValue={selectedFood.note} />
                </label>
              </>
            ) : (
              <div className="menu-dish-empty menu-dish-empty-preview">
                <strong>Chưa chọn món</strong>
                <p>Chọn một món ở cột trái để kiểm tra thành phần trước khi thêm.</p>
              </div>
            )}
          </section>
        </div>

        <div className="menu-modal-footer">
          <button className="btn-secondary" type="button" onClick={onClose}>Đóng</button>
          <button className="btn-primary" type="button" onClick={onAddDish} disabled={!selectedFood}>
            <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
            Thêm món ăn vào thực đơn
          </button>
        </div>
      </div>
    </div>
  );
}


function MenuTemplateLibrary() {
  const [templates, setTemplates] = useState(() => menuTemplates.map((template) => cloneMenuTemplate(template)));
  const [draftMenu, setDraftMenu] = useState(() => resizeMenuDays(cloneMenuTemplate(menuTemplates[0]), 7));
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedMealName, setSelectedMealName] = useState('Bữa sáng');
  const [selectedPatientId, setSelectedPatientId] = useState(interventionPatients[0].id);
  const [foods, setFoods] = useState(foodDatabase);
  const [addDishState, setAddDishState] = useState({ isOpen: false, searchTerm: '', selectedFood: null });
  const [applyMessage, setApplyMessage] = useState('');
  const selectedPatient = interventionPatients.find((patient) => patient.id === selectedPatientId) ?? interventionPatients[0];
  const selectedDay = draftMenu.days[selectedDayIndex] ?? draftMenu.days[0];
  const currentCalories = getMenuCalories(draftMenu);
  const filteredFoods = foods.filter((food) => {
    const q = addDishState.searchTerm.trim().toLowerCase();
    if (!q) return true;
    return [food.name, food.group, food.note].some((value) => value.toLowerCase().includes(q));
  });

  const handleLoadTemplate = (template) => {
    setDraftMenu(cloneMenuTemplate(template));
    setSelectedDayIndex(0);
    setSelectedMealName('Bữa sáng');
    setApplyMessage('');
  };

  const handleRangeChange = (nextLength) => {
    setDraftMenu((current) => resizeMenuDays(current, nextLength));
    setSelectedDayIndex((current) => Math.min(current, nextLength - 1));
  };

  const handleAddFoodToSelectedMeal = (food) => {
    setDraftMenu((current) => ({
      ...current,
      days: current.days.map((day, dayIndex) =>
        dayIndex === selectedDayIndex
          ? {
              ...day,
              meals: day.meals.map((meal) =>
                meal.name === selectedMealName ? { ...meal, items: [...meal.items, food] } : meal,
              ),
            }
          : day,
      ),
    }));
    setAddDishState({ isOpen: false, searchTerm: '', selectedFood: null });
    setApplyMessage(`Đã thêm ${food.name} vào ${selectedDay.day} · ${selectedMealName.toLowerCase()}.`);
  };

  const handleCreateTemplate = () => {
    const newTemplate = resizeMenuDays({
      id: `custom-${Date.now()}`,
      name: `Thực đơn mẫu mới ${templates.length + 1}`,
      description: 'Bác sĩ tự dựng từ kho món và có thể áp dụng cho bệnh nhân.',
      targetCalories: 1800,
      duration: '3 ngày',
      goal: 'Tùy chỉnh',
      days: [],
    }, 3);
    setTemplates((current) => [newTemplate, ...current]);
    setDraftMenu(newTemplate);
    setSelectedDayIndex(0);
    setSelectedMealName('Bữa sáng');
    setApplyMessage('Đã tạo thực đơn mẫu mới.');
  };

  const handleSaveTemplate = () => {
    setTemplates((current) =>
      current.some((template) => template.id === draftMenu.id)
        ? current.map((template) => (template.id === draftMenu.id ? cloneMenuTemplate(draftMenu) : template))
        : [cloneMenuTemplate(draftMenu), ...current],
    );
    setApplyMessage(`Đã lưu "${draftMenu.name}" vào kho thực đơn mẫu.`);
  };

  const handleDuplicateDay = () => {
    const sourceDay = draftMenu.days[selectedDayIndex];
    setDraftMenu((current) => ({
      ...current,
      days: current.days.map((day, index) =>
        index === selectedDayIndex + 1
          ? { ...day, meals: sourceDay.meals.map((meal) => ({ ...meal, items: [...meal.items] })) }
          : day,
      ),
    }));
  };

  const handleClearDay = () => {
    setDraftMenu((current) => ({
      ...current,
      days: current.days.map((day, index) => (index === selectedDayIndex ? createMenuDay(index) : day)),
    }));
  };

  const handleUploadMenu = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const scannedFood = {
      id: `scan-${Date.now()}`,
      name: 'Món hệ thống quét từ file',
      group: 'Đã quét',
      calories: 285,
      protein: '24g',
      note: `Nguồn: ${file.name}`,
      serving: '1 phần',
      ingredients: ['Gạo', 'Đạm nạc', 'Rau xanh'],
    };
    const scannedTemplate = resizeMenuDays({
      id: `uploaded-${Date.now()}`,
      name: `Thực đơn upload: ${file.name.replace(/\.[^/.]+$/, '')}`,
      description: 'Hệ thống đã quét món ăn từ file upload và tạo mẫu nháp để bác sĩ rà soát.',
      targetCalories: 1800,
      duration: '3 ngày',
      goal: 'Upload',
      days: [{ day: 'Ngày 1', meals: [{ name: 'Bữa trưa', items: [scannedFood] }] }],
    }, 3);
    setFoods((current) => [scannedFood, ...current]);
    setTemplates((current) => [scannedTemplate, ...current]);
    setDraftMenu(scannedTemplate);
    setSelectedDayIndex(0);
    setSelectedMealName('Bữa trưa');
    setApplyMessage(`Đã quét ${file.name} và thêm món vào kho thực đơn.`);
    event.target.value = '';
  };

  const handleApplyToPatient = () => {
    setApplyMessage(`Đã áp dụng "${draftMenu.name}" vào can thiệp của ${selectedPatient.name}.`);
  };

  return (
    <section className="menu-workspace animate-in stagger-2" aria-label="Kho thực đơn mẫu">
      <div className="menu-workspace-header">
        <div>
          <span className="dashboard-eyebrow">Kho thực đơn</span>
          <h2>Quản lý thực đơn mẫu toàn app</h2>
          <p>Tạo nhiều mẫu, chỉnh số ngày, thêm món giống luồng can thiệp và upload file để hệ thống quét món.</p>
        </div>
        <div className="menu-workspace-actions">
          <label className="btn-secondary menu-upload-button">
            <Upload size={16} className="button-icon-inline" aria-hidden="true" />
            Upload thực đơn
            <input type="file" accept=".pdf,.doc,.docx,.xlsx,.jpg,.png" onChange={handleUploadMenu} />
          </label>
          <button className="btn-secondary" type="button" onClick={handleCreateTemplate}>
            <Plus size={16} className="button-icon-inline" aria-hidden="true" />
            Thêm thực đơn
          </button>
          <button className="btn-primary" type="button" onClick={handleSaveTemplate}>
            <Save size={16} className="button-icon-inline" aria-hidden="true" />
            Lưu mẫu
          </button>
        </div>
      </div>

      <div className="menu-builder-grid">
        <aside className="menu-data-panel">
          <div className="menu-panel-heading">
            <Database size={17} aria-hidden="true" />
            <div>
              <h3>Thực đơn mẫu</h3>
              <p>Chọn mẫu để chỉnh hoặc thêm mẫu mới cho toàn app.</p>
            </div>
          </div>
          <div className="menu-template-stack">
            {templates.map((template) => (
              <button className={`menu-template-row ${draftMenu.id === template.id ? 'active' : ''}`} type="button" key={template.id} onClick={() => handleLoadTemplate(template)}>
                <div>
                  <span>{template.goal}</span>
                  <strong>{template.name}</strong>
                  <small>{template.duration} · {getMenuCalories(template)} kcal/ngày</small>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="menu-planner-panel">
          <div className="menu-plan-title">
            <div>
              <label className="menu-title-input">
                <span>Tên thực đơn mẫu</span>
                <input value={draftMenu.name} onChange={(event) => setDraftMenu((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <p>{draftMenu.description}</p>
            </div>
          </div>

          <div className="menu-cycle-toolbar">
            <div className="planner-control-group">
              <span>Chu kỳ mẫu</span>
              <div className="range-chip-group" role="tablist" aria-label="Chọn số ngày cho thực đơn mẫu">
                {menuRangeOptions.map((option) => (
                  <button className={draftMenu.days.length === option ? 'active' : ''} type="button" key={option} onClick={() => handleRangeChange(option)}>
                    {option} ngày
                  </button>
                ))}
              </div>
            </div>
            <div className="planner-toolbar-actions">
              <button className="btn-secondary btn-small" type="button" onClick={handleDuplicateDay}>
                <Copy size={15} className="button-icon-inline" aria-hidden="true" />
                Nhân bản ngày
              </button>
              <button className="btn-secondary btn-small danger-ghost" type="button" onClick={handleClearDay}>
                <Trash2 size={15} className="button-icon-inline" aria-hidden="true" />
                Xóa ngày
              </button>
            </div>
          </div>

          <div className="menu-day-tabs" role="tablist" aria-label="Chọn ngày trong thực đơn">
            {draftMenu.days.map((day, index) => (
              <button className={selectedDayIndex === index ? 'active' : ''} type="button" key={day.day} onClick={() => setSelectedDayIndex(index)}>
                {day.day}
              </button>
            ))}
          </div>

          <div className="menu-day-board">
            {selectedDay.meals.map((meal) => (
              <article className={`menu-builder-meal ${selectedMealName === meal.name ? 'active' : ''}`} key={`${selectedDay.day}-${meal.name}`}>
                <div className="menu-builder-meal-head">
                  <div>
                    <h4>{meal.name}</h4>
                    <p>{meal.items.length > 0 ? `${meal.items.length} món · ${meal.items.reduce((sum, item) => sum + item.calories, 0)} kcal` : 'Chưa có món nào trong bữa này'}</p>
                  </div>
                  <button
                    className="btn-primary btn-small"
                    type="button"
                    onClick={() => {
                      setSelectedMealName(meal.name);
                      setAddDishState({ isOpen: true, searchTerm: '', selectedFood: null });
                    }}
                  >
                    <PlusCircle size={15} className="button-icon-inline" aria-hidden="true" />
                    Thêm món
                  </button>
                </div>
                <div className="menu-builder-foods">
                  {meal.items.map((item, index) => (
                    <div className="menu-builder-food" key={`${meal.name}-${item.id}-${index}`}>
                      <strong>{item.name}</strong>
                      <span>{item.calories} kcal · {item.serving} · {item.protein}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="menu-apply-panel">
          <div className="menu-panel-heading">
            <CheckCircle2 size={17} aria-hidden="true" />
            <div>
              <h3>Áp dụng can thiệp</h3>
              <p>Đưa mẫu đã dựng vào kế hoạch bệnh nhân.</p>
            </div>
          </div>
          <label className="menu-apply-field">
            <span>Bệnh nhân</span>
            <select value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)}>
              {interventionPatients.map((patient) => (
                <option value={patient.id} key={patient.id}>{patient.name} · {patient.id}</option>
              ))}
            </select>
          </label>
          <div className="menu-patient-summary">
            <strong>{selectedPatient.goal}</strong>
            <span>{draftMenu.duration} · {currentCalories} kcal/ngày · {draftMenu.goal}</span>
          </div>
          <button className="btn-primary menu-apply-button" type="button" onClick={handleApplyToPatient}>
            <Send size={16} className="button-icon-inline" aria-hidden="true" />
            Áp dụng vào can thiệp
          </button>
          <Link className="btn-secondary menu-apply-button" to={`/patients/${selectedPatient.id}?tab=intervention-followup`}>
            Mở phần can thiệp
          </Link>
          {applyMessage ? (
            <div className="menu-apply-success" role="status">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>{applyMessage}</span>
            </div>
          ) : null}
        </aside>
      </div>
      <AddMenuDishModal
        foods={filteredFoods}
        isOpen={addDishState.isOpen}
        mealName={`${selectedDay.day} · ${selectedMealName}`}
        onAddDish={() => addDishState.selectedFood && handleAddFoodToSelectedMeal(addDishState.selectedFood)}
        onClose={() => setAddDishState({ isOpen: false, searchTerm: '', selectedFood: null })}
        onSearchChange={(searchTerm) => setAddDishState((current) => ({ ...current, searchTerm }))}
        onSelectFood={(selectedFood) => setAddDishState((current) => ({ ...current, selectedFood }))}
        searchTerm={addDishState.searchTerm}
        selectedFood={addDishState.selectedFood}
      />
    </section>
  );
}




export default MenuTemplateLibrary;
