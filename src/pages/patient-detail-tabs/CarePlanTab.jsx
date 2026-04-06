import React, { useState } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';
import { carePlanMockDB } from '../../mockData';

function SelectionBlock({ title, list, dbItems, onAdd, onRemove }) {
  const [selectVal, setSelectVal] = useState('');

  return (
    <section className="selection-block">
      <div className="selection-block-header">
        <h3>{title}</h3>
      </div>

      <div className="selection-block-controls">
        <select
          className="selection-select"
          value={selectVal}
          onChange={(event) => setSelectVal(event.target.value)}
          aria-label={`Chọn mục cho ${title}`}
        >
          <option value="">Chọn một mục</option>
          {dbItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.calories ? ` (${item.calories} kcal)` : ''}
            </option>
          ))}
        </select>

        <button
          className="btn-secondary btn-square"
          type="button"
          aria-label={`Thêm mục cho ${title}`}
          onClick={() => {
            const item = dbItems.find((candidate) => candidate.id === selectVal);
            if (item) {
              onAdd(item);
              setSelectVal('');
            }
          }}
        >
          <PlusCircle size={16} aria-hidden="true" />
        </button>
      </div>

      {list.length > 0 ? (
        <ul className="selection-list">
          {list.map((item, index) => (
            <li key={`${item.id}-${index}`} className="selection-item">
              <div>
                <strong>{item.name}</strong>
                <p>{item.desc || item.usage || (item.calories && `${item.calories} kcal`)}</p>
              </div>
              <button
                className="btn-icon"
                type="button"
                aria-label={`Xóa ${item.name}`}
                onClick={() => onRemove(index)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-copy">Chưa chọn nội dung cho phần này.</p>
      )}
    </section>
  );
}

export default function CarePlanTab({ patient, showToast }) {
  const [selectedMeals, setSelectedMeals] = useState({ breakfast: [], lunch: [], dinner: [], snack: [] });
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  const addItem = (category, subCategory, item) => {
    if (!item) return;
    if (category === 'meals') {
      setSelectedMeals({ ...selectedMeals, [subCategory]: [...selectedMeals[subCategory], item] });
      return;
    }
    if (category === 'meds') {
      setSelectedMeds([...selectedMeds, item]);
      return;
    }
    setSelectedExercises([...selectedExercises, item]);
  };

  const removeItem = (category, subCategory, index) => {
    if (category === 'meals') {
      const nextItems = [...selectedMeals[subCategory]];
      nextItems.splice(index, 1);
      setSelectedMeals({ ...selectedMeals, [subCategory]: nextItems });
      return;
    }

    if (category === 'meds') {
      const nextItems = [...selectedMeds];
      nextItems.splice(index, 1);
      setSelectedMeds(nextItems);
      return;
    }

    const nextItems = [...selectedExercises];
    nextItems.splice(index, 1);
    setSelectedExercises(nextItems);
  };

  return (
    <div className="tab-pane care-plan-tab">
      <section className="care-plan-layout">
        <div className="care-plan-main">
          <article className="card care-plan-panel">
            <div className="care-plan-header">
              <div className="section-heading">
                <span className="eyebrow">Kế hoạch can thiệp</span>
                <h2>Xây dựng phác đồ theo đúng căn cứ từ hồ sơ dinh dưỡng</h2>
              </div>
              <button
                className="btn-primary"
                type="button"
                onClick={() => showToast('Đã lưu và gửi kế hoạch can thiệp cho bệnh nhân')}
              >
                <Save size={16} className="button-icon-inline" aria-hidden="true" />
                Lưu kế hoạch
              </button>
            </div>

            <div className="care-plan-rationale">
              <section className="care-plan-copy-block">
                <h3>Căn cứ can thiệp</h3>
                <ul className="detail-list">
                  {patient.interventionPlan.basis.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="care-plan-copy-block">
                <h3>Mục tiêu trong ngắn hạn</h3>
                <ul className="detail-list">
                  {patient.interventionPlan.goals.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>

          <article className="card care-plan-panel">
            <div className="section-heading">
              <span className="eyebrow">Thực đơn và hỗ trợ</span>
              <h2>Điều chỉnh thành phần bữa ăn, bổ sung và vận động</h2>
            </div>

            <div className="selection-grid">
              <SelectionBlock
                title="Bữa sáng"
                list={selectedMeals.breakfast}
                dbItems={carePlanMockDB.meals}
                onAdd={(item) => addItem('meals', 'breakfast', item)}
                onRemove={(index) => removeItem('meals', 'breakfast', index)}
              />
              <SelectionBlock
                title="Bữa trưa"
                list={selectedMeals.lunch}
                dbItems={carePlanMockDB.meals}
                onAdd={(item) => addItem('meals', 'lunch', item)}
                onRemove={(index) => removeItem('meals', 'lunch', index)}
              />
              <SelectionBlock
                title="Bữa tối"
                list={selectedMeals.dinner}
                dbItems={carePlanMockDB.meals}
                onAdd={(item) => addItem('meals', 'dinner', item)}
                onRemove={(index) => removeItem('meals', 'dinner', index)}
              />
              <SelectionBlock
                title="Bữa phụ"
                list={selectedMeals.snack}
                dbItems={carePlanMockDB.meals}
                onAdd={(item) => addItem('meals', 'snack', item)}
                onRemove={(index) => removeItem('meals', 'snack', index)}
              />
            </div>

            <div className="selection-grid selection-grid-secondary">
              <SelectionBlock
                title="Bổ sung dinh dưỡng"
                list={selectedMeds}
                dbItems={carePlanMockDB.medicines}
                onAdd={(item) => addItem('meds', null, item)}
                onRemove={(index) => removeItem('meds', null, index)}
              />
              <SelectionBlock
                title="Vận động gợi ý"
                list={selectedExercises}
                dbItems={carePlanMockDB.exercises}
                onAdd={(item) => addItem('exercises', null, item)}
                onRemove={(index) => removeItem('exercises', null, index)}
              />
            </div>
          </article>
        </div>

        <aside className="care-plan-side">
          <article className="card care-plan-panel">
            <div className="section-heading">
              <span className="eyebrow">Khuyến nghị</span>
              <h2>Nội dung cần nhấn mạnh với bệnh nhân và người nhà</h2>
            </div>

            <div className="care-plan-aside-group">
              <h3>Nên ưu tiên</h3>
              <ul className="detail-list">
                {patient.interventionPlan.foodsToPrefer.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="care-plan-aside-group">
              <h3>Cần hạn chế</h3>
              <ul className="detail-list">
                {patient.interventionPlan.foodsToLimit.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="care-plan-aside-group">
              <h3>Hướng dẫn cho người nhà</h3>
              <ul className="detail-list">
                {patient.interventionPlan.caregiverGuidance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="care-plan-aside-group">
              <h3>Ghi chú thêm</h3>
              <textarea
                className="care-plan-note"
                rows="5"
                placeholder="Ghi chú thêm cho đợt can thiệp này..."
                defaultValue={patient.interventionPlan.recommendations.join('\n')}
              />
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
