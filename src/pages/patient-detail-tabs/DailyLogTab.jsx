import React, { useState } from 'react';
import { Utensils, Pill, Dumbbell, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

export default function DailyLogTab() {
  const [selectedDate, setSelectedDate] = useState('2023-03-30');

  // Mocks matching the image exactly
  const mockDailyLogs = {
    '2023-03-30': {
      dateDisplay: 'Ngày 30/03',
      totals: { calo: 1900, p: '24%', l: '36%', g: '39%' },
      meals: [
        {
          id: 1,
          type: 'Bữa sáng',
          name: 'Phở bò + Quẩy',
          time: '07:30',
          img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb431?auto=format&fit=crop&w=400&q=80',
          kcal: 650, p: 30, f: 25, c: 75
        },
        {
          id: 2,
          type: 'Bữa trưa',
          name: 'Cơm sườn bì chả',
          time: '12:15',
          img: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=400&q=80',
          kcal: 800, p: 45, f: 35, c: 90
        },
        {
          id: 3,
          type: 'Bữa tối',
          name: 'Salad gà nướng',
          time: '19:00',
          img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
          kcal: 450, p: 40, f: 15, c: 20
        }
      ],
      supplements: [
        { id: 1, name: 'Omega 3', typeIcon: '💊', dose: '1 viên', time: '08:00', status: 'Đã uống' },
        { id: 2, name: 'Metformin 500mg', typeIcon: '💊', dose: '1 viên', time: '19:30', status: 'Chưa xác nhận' }
      ],
      activities: [
        { id: 1, name: 'Chạy bộ', icon: '🏃', duration: '30 phút', kcal: 300 }
      ]
    },
    '2023-03-29': {
      dateDisplay: 'Ngày 29/03',
      totals: { calo: 1800, p: '25%', l: '35%', g: '40%' },
      meals: [], supplements: [], activities: []
    }
  };

  const currentLog = mockDailyLogs[selectedDate] || mockDailyLogs['2023-03-30'];

  // For the calendar slider
  const dates = [
    { value: '2023-03-28', label: 'T3, 28/03' },
    { value: '2023-03-29', label: 'T4, 29/03' },
    { value: '2023-03-30', label: 'T5, 30/03' },
    { value: '2023-03-31', label: 'T6, 31/03' },
    { value: '2023-04-01', label: 'T7, 01/04' },
  ];

  return (
    <div className="tab-pane daily-log-tab">
      
      {/* Date Selector & Macros Summary */}
      <div className="card mb-4 p-4 flex-between" style={{backgroundColor: 'hsl(var(--surface))', border: '1px solid hsl(var(--border))'}}>
         {/* Box chọn ngày */}
         <div className="flex" style={{gap: '1rem', alignItems: 'center'}}>
            <h3 className="font-bold" style={{margin: 0, color: 'hsl(var(--text-muted))'}}>Xem nhật ký:</h3>
            <div style={{display: 'flex', alignItems: 'center', backgroundColor: 'hsl(var(--background))', borderRadius: 'var(--radius-md)', border: '1px solid hsl(var(--border))', padding: '0.25rem'}}>
              <button className="btn-icon" style={{padding: '4px'}}><ChevronLeft size={18}/></button>
              <select 
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 style={{border: 'none', backgroundColor: 'transparent', fontWeight: 600, fontSize: '1rem', padding: '0.25rem 0.5rem', outline: 'none', cursor: 'pointer', appearance: 'none', textAlign: 'center'}}
              >
                 {dates.map(d => (
                   <option key={d.value} value={d.value}>{d.label}</option>
                 ))}
              </select>
              <button className="btn-icon" style={{padding: '4px'}}><ChevronRight size={18}/></button>
            </div>
         </div>

         {/* Box tỉ lệ P:L:G riêng biệt */}
         <div className="daily-totals-box" style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-sm)'}}>
            <div className="flex" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
               <span style={{fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Tổng lượng calo</span>
               <span style={{fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary-dark))'}}>{currentLog.totals.calo} <span style={{fontSize:'0.875rem', fontWeight: 500}}>kcal</span></span>
            </div>
            <div style={{width: '1px', height: '30px', backgroundColor: 'hsl(var(--border))', margin: '0 0.5rem'}}></div>
            <div className="flex" style={{gap: '1rem'}}>
               <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                 <span style={{fontSize: '0.75rem', color: 'hsl(var(--text-muted))'}}>Protein</span>
                 <strong style={{color: '#0284c7'}}>{currentLog.totals.p}</strong>
               </div>
               <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                 <span style={{fontSize: '0.75rem', color: 'hsl(var(--text-muted))'}}>Lipid</span>
                 <strong style={{color: '#a16207'}}>{currentLog.totals.l}</strong>
               </div>
               <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                 <span style={{fontSize: '0.75rem', color: 'hsl(var(--text-muted))'}}>Glucid</span>
                 <strong style={{color: '#15803d'}}>{currentLog.totals.g}</strong>
               </div>
            </div>
         </div>
      </div>

      <div className="log-timeline-container">
        
        {/* Timeline Line */}
        <div className="timeline-spine"></div>

        {/* Date Header matching the image */}
        <div className="timeline-node">
          <div className="node-dot bg-success"></div>
          <div className="node-content w-full" style={{paddingBottom: '1rem', paddingTop: '0.15rem'}}>
             <h2 className="text-success font-bold" style={{fontSize: '1.25rem', margin: 0}}>{currentLog.dateDisplay}</h2>
          </div>
        </div>

        {/* Bữa ăn */}
        <div className="timeline-node">
          <div className="node-icon bg-warning-light text-warning"><Utensils size={16}/></div>
          <div className="node-content w-full">
            <h3 className="section-title text-muted mb-3 font-medium" style={{borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem'}}>Bữa ăn trong ngày</h3>
            
            <div className="meals-sections" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {['Bữa sáng', 'Bữa trưa', 'Bữa tối', 'Bữa ăn thêm'].map(mealType => {
                 const mealsOfType = currentLog.meals.filter(m => m.type === mealType);
                 return (
                    <div key={mealType} className="meal-type-group">
                       <h5 className="mb-2" style={{fontSize: '0.875rem', fontWeight: 600, color: 'hsl(var(--text-main))', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                          <span style={{width: '6px', height: '6px', backgroundColor: 'hsl(var(--primary))', borderRadius: '50%', display: 'inline-block'}}></span>
                          {mealType}
                       </h5>
                       {mealsOfType.length > 0 ? (
                         <div className="meals-grid">
                           {mealsOfType.map(meal => (
                             <div key={meal.id} className="log-meal-card">
                               <div className="meal-img-box">
                                 <img src={meal.img} alt={meal.name} className="meal-img" />
                               </div>
                               <div className="meal-info">
                                 <div className="flex-between mb-3">
                                   <h4 className="font-medium">{meal.name}</h4>
                                   <span className="time-badge">{meal.time}</span>
                                 </div>
                                 
                                 <div className="macros-row">
                                   <div className="macro-box box-kcal">
                                     <strong>{meal.kcal}</strong>
                                     <small>kcal</small>
                                   </div>
                                   <div className="macro-box box-p">
                                     <strong>{meal.p}g</strong>
                                     <small>P</small>
                                   </div>
                                   <div className="macro-box box-f">
                                     <strong>{meal.f}g</strong>
                                     <small>F</small>
                                   </div>
                                   <div className="macro-box box-c">
                                     <strong>{meal.c}g</strong>
                                     <small>C</small>
                                   </div>
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <p className="text-muted text-sm italic ml-4">Chưa ghi nhận</p>
                       )}
                    </div>
                 );
              })}
            </div>
          </div>
        </div>

        {/* Thuốc & TPBS */}
        <div className="timeline-node mt-4">
          <div className="node-icon bg-purple-light text-purple" style={{color: '#9333ea', backgroundColor: '#f3e8ff'}}><Pill size={16}/></div>
          <div className="node-content w-full">
            <h3 className="section-title text-muted mb-3 font-medium">Uống thuốc & TPBS</h3>
            
            <div className="supps-grid">
              {currentLog.supplements.map(sup => (
                <div key={sup.id} className="log-horizontal-card">
                  <div className="icon-box-lg bg-blue-light">{sup.typeIcon}</div>
                  <div className="info-flex">
                     <div>
                       <h4 className="font-medium">{sup.name}</h4>
                       <p className="text-sm text-muted mb-1">{sup.dose} • {sup.time}</p>
                       {sup.status === 'Đã uống' ? (
                          <span className="badge badge-success text-xs" style={{padding: '2px 8px'}}>{sup.status}</span>
                       ) : (
                          <span className="badge badge-warning text-xs" style={{padding: '2px 8px', borderColor: 'orange', color: 'orange', backgroundColor: 'transparent', border: '1px solid'}}>{sup.status}</span>
                       )}
                     </div>
                  </div>
                </div>
              ))}
              {currentLog.supplements.length === 0 && <p className="text-muted">Chưa có dữ liệu thuốc cho ngày này.</p>}
            </div>
          </div>
        </div>

        {/* Vận động */}
        <div className="timeline-node mt-4">
          <div className="node-icon bg-blue-light text-primary"><Dumbbell size={16}/></div>
          <div className="node-content w-full">
            <h3 className="section-title text-muted mb-3 font-medium">Vận động</h3>
            
            <div className="activities-grid">
               {currentLog.activities.map(act => (
                 <div key={act.id} className="log-horizontal-card">
                   <div className="icon-box-lg bg-blue-light bg-blue-light text-primary" style={{fontSize: '1.5rem'}}>{act.icon}</div>
                   <div className="info-flex">
                      <div>
                        <h4 className="font-medium">{act.name}</h4>
                        <p className="text-sm text-muted">{act.duration} • <strong className="text-primary">{act.kcal} kcal</strong></p>
                      </div>
                   </div>
                 </div>
               ))}
               {currentLog.activities.length === 0 && <p className="text-muted">Chưa có dữ liệu vận động cho ngày này.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
