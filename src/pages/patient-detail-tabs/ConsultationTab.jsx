import React, { useState } from 'react';
import { Save, FileText } from 'lucide-react';

export default function ConsultationTab({ showToast }) {
  const [viewMode, setViewMode] = useState('edit');

  return (
    <div className="consultation-tab">
      <div className="card mb-4">
        <div className="p-4" style={{borderBottom: '1px solid hsl(var(--border))', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} className="text-primary"/> Ghi chú Khám & Thảo luận
          </h2>
          <div className="flex gap-2">
             <button className="btn-secondary" onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}>
                {viewMode === 'edit' ? 'Chế độ Xem' : 'Chế độ Sửa'}
             </button>
             <button className="btn-primary" onClick={() => showToast('Đã lưu ghi chú khám!')}>
               <Save size={16} className="inline mr-2"/> Lưu ghi chú
             </button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          <div className="form-group">
              <label className="font-bold text-main block mb-2">Lý do khám / Vấn đề hiện tại (Tóm tắt)</label>
              <textarea className="w-full" rows="2" placeholder="VD: Tái khám tiểu đường thai kỳ tháng thứ 6..."></textarea>
          </div>
          
          <div className="form-group">
              <label className="font-bold text-main block mb-2">Nhận định chuyên môn của Bác sĩ</label>
              <textarea className="w-full" rows="3" placeholder="Ghi chú các quan sát lâm sàng và phân tích thêm dựa trên hồ sơ..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group bg-blue-50 p-4 rounded-md" style={{border: '1px solid #BFDBFE'}}>
                <label className="font-bold text-blue-800 block mb-2">Chẩn đoán chính</label>
                <textarea className="w-full" rows="2" placeholder="Ví dụ: Đái tháo đường thai kỳ..."></textarea>
            </div>
            
            <div className="form-group bg-slate-50 p-4 rounded-md" style={{border: '1px solid #e2e8f0'}}>
                <label className="font-bold text-main block mb-2">Vấn đề chính cần xử lý</label>
                <textarea className="w-full" rows="2" placeholder="Ví dụ: Tối ưu lượng tinh bột buổi chiều..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
