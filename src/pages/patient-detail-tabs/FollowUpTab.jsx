import React from 'react';
import { PhoneCall, MessageCircle, Check } from 'lucide-react';

export default function FollowUpTab({ showToast }) {
  return (
    <div className="follow-up-tab">
      <div className="card">
        <div className="p-4" style={{borderBottom: '1px solid hsl(var(--border))'}}>
          <h2 className="text-xl font-bold">Quản lý Theo dõi (Follow-up)</h2>
          <p className="text-muted text-sm mt-1">Ghi nhận các liên hệ với bệnh nhân trong vòng 24-72h sau khám.</p>
        </div>
        
        <div className="p-4">
          <div className="bg-slate-50 p-4 rounded-md mb-6" style={{border: '1px solid #e2e8f0'}}>
             <h3 className="font-bold text-main mb-2">Tạo Follow-up mới</h3>
             <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                   <label className="block text-sm font-medium mb-1">Phương thức liên lạc</label>
                   <select className="w-full p-2 border rounded">
                      <option>Gọi điện thoại</option>
                      <option>Nhắn tin Zalo/App</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Trạng thái bệnh nhân</label>
                   <select className="w-full p-2 border rounded">
                      <option>Tuân thủ tốt</option>
                      <option>Gặp khó khăn với thực đơn</option>
                      <option>Tác dụng phụ của thuốc</option>
                   </select>
                </div>
             </div>
             <textarea className="w-full mb-3" rows="2" placeholder="Ghi nhận phản hồi chi tiết từ bệnh nhân..."></textarea>
             <div className="flex gap-2">
                <button className="btn-primary" onClick={() => showToast('Đã lưu Follow-up!')}>Lưu Follow-up</button>
                <button className="btn-secondary" onClick={() => showToast('Đã đánh dấu cần bác sĩ xử lý thêm!')}>Cần bác sĩ xử lý thêm</button>
             </div>
          </div>

          <h3 className="font-bold text-lg mb-4">Lịch sử Follow-up</h3>
          <div className="space-y-4">
             <div className="p-4 border rounded-md" style={{borderLeft: '4px solid #16a34a'}}>
                <div className="flex justify-between mb-2">
                   <div className="font-bold flex items-center gap-2"><PhoneCall size={16}/> Gọi điện thoại (Điều dưỡng Lan)</div>
                   <span className="text-muted text-sm">22/03/2026 - 14:30</span>
                </div>
                <p className="text-sm">Bệnh nhân báo ăn theo thực đơn hơi đói vào buổi chiều. Gợi ý thêm bữa phụ nhẹ (1 trái táo).</p>
                <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 inline-block px-2 py-1 rounded">Xử lý xong</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
