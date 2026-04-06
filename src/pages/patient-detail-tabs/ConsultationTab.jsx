import React, { useState } from 'react';
import { Save, FileText } from 'lucide-react';

export default function ConsultationTab({ showToast }) {
  const [viewMode, setViewMode] = useState('edit');

  return (
    <div className="consultation-tab">
      <div className="card mb-4">
        <div className="p-4 card-top-bar">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText size={24} className="text-primary" aria-hidden="true" /> Ghi chú khám & thảo luận
          </h2>
          <div className="flex gap-2">
            <button className="btn-secondary" type="button" onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}>
              {viewMode === 'edit' ? 'Chế độ xem' : 'Chế độ sửa'}
            </button>
            <button className="btn-primary" type="button" onClick={() => showToast('Đã lưu ghi chú khám')}>
              <Save size={16} className="inline mr-2" aria-hidden="true" /> Lưu ghi chú
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="form-group">
            <label className="font-bold text-main block mb-2">Lý do khám / vấn đề hiện tại (tóm tắt)</label>
            <textarea className="w-full" rows="2" placeholder="Ví dụ: Tái khám tiểu đường thai kỳ tháng thứ 6…"></textarea>
          </div>

          <div className="form-group">
            <label className="font-bold text-main block mb-2">Nhận định chuyên môn của bác sĩ</label>
            <textarea className="w-full" rows="3" placeholder="Ghi chú các quan sát lâm sàng và phân tích thêm dựa trên hồ sơ…"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group bg-blue-50 p-4 rounded-md consultation-box-blue">
              <label className="font-bold text-blue-800 block mb-2">Chẩn đoán chính</label>
              <textarea className="w-full" rows="2" placeholder="Ví dụ: Đái tháo đường thai kỳ…"></textarea>
            </div>

            <div className="form-group bg-slate-50 p-4 rounded-md consultation-box-slate">
              <label className="font-bold text-main block mb-2">Vấn đề chính cần xử lý</label>
              <textarea className="w-full" rows="2" placeholder="Ví dụ: Tối ưu lượng tinh bột buổi chiều…"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
