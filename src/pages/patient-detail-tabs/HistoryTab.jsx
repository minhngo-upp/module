import React from 'react';
import { CalendarClock, User } from 'lucide-react';
import { visitRecordsMock } from '../../mockData';

export default function HistoryTab({ showToast }) {
  return (
    <div className="tab-pane">
       <div className="card">
         <div className="card-header flex-between">
           <h3 className="card-title">Lịch sử Khám (Timeline)</h3>
         </div>
         <div className="card-body">
           <div className="timeline-container" style={{position: 'relative', paddingLeft: '2rem', borderLeft: '2px solid hsl(var(--border))', marginLeft: '1rem'}}>
              {visitRecordsMock.map((record, i) => (
                 <div key={record.id} style={{position: 'relative', marginBottom: '2rem'}}>
                    <div style={{
                       position: 'absolute', 
                       left: '-2.4rem', 
                       top: '0', 
                       width: '16px', 
                       height: '16px', 
                       borderRadius: '50%', 
                       backgroundColor: i === 0 ? 'hsl(var(--primary))' : 'hsl(var(--text-muted))',
                       border: '3px solid hsl(var(--surface))'
                    }}></div>
                    <div style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                      <span className="font-bold text-lg" style={{color: i === 0 ? 'hsl(var(--primary))' : 'inherit'}}>{record.visitDate}</span>
                      <span className="badge badge-blue">{record.visitType}</span>
                    </div>
                    <div style={{padding: '1rem', backgroundColor: 'hsl(var(--background))', borderRadius: '4px', border: '1px solid hsl(var(--border))'}}>
                       <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'hsl(var(--text-muted))', fontSize: '0.875rem'}}>
                         <User size={14}/> <span>Người phụ trách: {record.doctor}</span>
                       </div>
                       <p style={{marginBottom: '1rem'}}>{record.summary}</p>
                       <button className="btn-secondary btn-sm" onClick={() => showToast('Mở chi tiết báo cáo Visit Record')}>Xem chi tiết</button>
                    </div>
                 </div>
              ))}
           </div>
         </div>
       </div>
    </div>
  );
}
