import React, { useState } from 'react';
import { Save, Pill, Utensils, Dumbbell, PlusCircle, X } from 'lucide-react';
import { carePlanMockDB } from '../../mockData';

export default function CarePlanTab({ showToast }) {
  // States
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: [], lunch: [], dinner: [], snack: []
  });
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  // Generic Add Item
  const addItem = (category, subCategory, item) => {
    if (!item) return;
    if (category === 'meals') {
       setSelectedMeals({...selectedMeals, [subCategory]: [...selectedMeals[subCategory], item]});
    } else if (category === 'meds') {
       setSelectedMeds([...selectedMeds, item]);
    } else if (category === 'exercises') {
       setSelectedExercises([...selectedExercises, item]);
    }
  };

  const removeItem = (category, subCategory, index) => {
    if (category === 'meals') {
       const newList = [...selectedMeals[subCategory]];
       newList.splice(index, 1);
       setSelectedMeals({...selectedMeals, [subCategory]: newList});
    } else if (category === 'meds') {
       const newList = [...selectedMeds];
       newList.splice(index, 1);
       setSelectedMeds(newList);
    } else if (category === 'exercises') {
       const newList = [...selectedExercises];
       newList.splice(index, 1);
       setSelectedExercises(newList);
    }
  };

  // Helper render selection block
  const SelectionBlock = ({ title, list, dbItems, onAdd, onRemove }) => {
    const [selectVal, setSelectVal] = useState('');
    return (
      <div className="mb-4 bg-slate-50 p-3 outline outline-1 outline-slate-200 rounded-md">
         <h4 className="font-bold text-main mb-2 tracking-wide text-sm">{title}</h4>
         <div className="flex gap-2 mb-2">
            <select className="flex-1 p-2 border rounded" value={selectVal} onChange={(e) => setSelectVal(e.target.value)}>
               <option value="">-- Chọn một mục --</option>
               {dbItems.map(item => <option key={item.id} value={item.id}>{item.name} {item.calories ? `(${item.calories} kcal)` : ''}</option>)}
            </select>
            <button className="btn-secondary" onClick={() => {
                const item = dbItems.find(i => i.id === selectVal);
                if (item) { onAdd(item); setSelectVal(''); }
            }}>
               <PlusCircle size={16}/>
            </button>
         </div>
         {list.length > 0 && (
           <ul className="space-y-2 mt-3">
              {list.map((item, idx) => (
                 <li key={idx} className="flex justify-between items-center p-2 bg-white border rounded">
                    <span>{item.name} <span className="text-muted text-sm ml-2">{item.desc || item.usage || (item.calories && `${item.calories} kcal`)}</span></span>
                    <button className="text-red-500 hover:bg-red-50 p-1 rounded transition" onClick={() => onRemove(idx)}><X size={16}/></button>
                 </li>
              ))}
           </ul>
         )}
      </div>
    );
  };

  return (
    <div className="care-plan-tab">
      <div className="card">
        <div className="p-4" style={{borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl font-bold">Kế hoạch Điều trị & Phác đồ</h2>
          <button className="btn-primary" onClick={() => showToast('Đã lưu và Gửi phác đồ cho bệnh nhân!')}>
            <Save size={16} className="inline mr-2"/> Lưu và Gửi
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="form-section">
             <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-secondary"><Utensils size={20}/> 1. Hướng dẫn Thực đơn</h3>
             <div className="grid grid-cols-2 gap-4">
                 <SelectionBlock 
                    title="Bữa Sáng" 
                    list={selectedMeals.breakfast} 
                    dbItems={carePlanMockDB.meals} 
                    onAdd={(i) => addItem('meals', 'breakfast', i)} 
                    onRemove={(i) => removeItem('meals', 'breakfast', i)} 
                 />
                 <SelectionBlock 
                    title="Bữa Trưa" 
                    list={selectedMeals.lunch} 
                    dbItems={carePlanMockDB.meals} 
                    onAdd={(i) => addItem('meals', 'lunch', i)} 
                    onRemove={(i) => removeItem('meals', 'lunch', i)} 
                 />
                 <SelectionBlock 
                    title="Bữa Tối" 
                    list={selectedMeals.dinner} 
                    dbItems={carePlanMockDB.meals} 
                    onAdd={(i) => addItem('meals', 'dinner', i)} 
                    onRemove={(i) => removeItem('meals', 'dinner', i)} 
                 />
                 <SelectionBlock 
                    title="Bữa Ăn Thêm (Snack)" 
                    list={selectedMeals.snack} 
                    dbItems={carePlanMockDB.meals} 
                    onAdd={(i) => addItem('meals', 'snack', i)} 
                    onRemove={(i) => removeItem('meals', 'snack', i)} 
                 />
             </div>
          </div>
          
          <div className="form-section">
             <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-green-600"><Pill size={20}/> 2. Thuốc & Giới thiệu TPCN</h3>
             <SelectionBlock 
                title="Đơn thuốc" 
                list={selectedMeds} 
                dbItems={carePlanMockDB.medicines} 
                onAdd={(i) => addItem('meds', null, i)} 
                onRemove={(i) => removeItem('meds', null, i)} 
             />
          </div>
          
          <div className="form-section">
             <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-orange-500"><Dumbbell size={20}/> 3. Kế hoạch Vận động</h3>
             <SelectionBlock 
                title="Bài tập" 
                list={selectedExercises} 
                dbItems={carePlanMockDB.exercises} 
                onAdd={(i) => addItem('exercises', null, i)} 
                onRemove={(i) => removeItem('exercises', null, i)} 
             />
          </div>

          <div className="form-section pt-4" style={{borderTop: '1px solid hsl(var(--border))'}}>
             <h3 className="text-lg font-bold mb-3">Dặn dò thêm</h3>
             <textarea className="w-full" rows="3" placeholder="Các lưu ý đặc biệt, lịch hẹn tái khám..."></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
