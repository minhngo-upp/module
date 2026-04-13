import React from 'react';
import { AlertCircle, FileText, Target, Activity, ExternalLink, CalendarClock, Stethoscope, Utensils, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientActionPanel({ patient }) {
  if (!patient) return null;

  return (
    <div className="chat-context-panel hidden-md">
      <div className="context-header">
        <h4>Bối cảnh & Hành động</h4>
      </div>
      
      <div className="context-body">
        
        {/* A: Objectives */}
        <div className="context-section">
          <h5><Target size={14} className="inline-icon text-primary" /> Mục tiêu hiện tại</h5>
          <div className="context-card insight-card">
            <p className="text-sm">{patient.contextGoal || 'Chưa thiết lập mục tiêu'}</p>
          </div>
        </div>

        {/* B: Cảnh báo / Điểm cần chú ý */}
        <div className="context-section">
          <h5><AlertCircle size={14} className="inline-icon text-danger" /> Điểm chú ý hôm nay</h5>
          <div className="context-card alert-card">
            <p className="text-sm font-medium text-danger">{patient.contextAlert || 'Không có cảnh báo đặc biệt'}</p>
          </div>
        </div>

        {/* C: Dữ liệu mới nhất (Rich Data) */}
        <div className="context-section">
          <h5><Activity size={14} className="inline-icon text-success" /> Dữ liệu mới nhất</h5>
          <button className="context-data-btn">
            <FileText size={18} className="text-muted" />
            <div className="flex-1 text-left overflow-hidden">
               <span className="block text-sm font-semibold truncate text-main">{patient.latestReport || 'Chưa có tài liệu'}</span>
               <span className="block text-xs text-muted truncate mt-1">Cập nhật lúc 09:15 hôm nay</span>
            </div>
            <ChevronRight size={14} className="text-muted" />
          </button>
        </div>

        {/* Quick Actions Grid (Refined for Workflow) */}
        <div className="context-section pt-4 border-t">
          <h5>Mở lối tắt</h5>
          
          <div className="quick-action-grid">
            <Link to={`/patients/${patient.id}`} className="quick-action-btn">
              <ExternalLink size={16} />
              <span>Hồ sơ gốc</span>
            </Link>
            
            <button className="quick-action-btn">
              <CalendarClock size={16} />
              <span>Follow-up</span>
            </button>
            
            <button className="quick-action-btn">
              <Utensils size={16} />
              <span>Nhật ký bữa ăn</span>
            </button>
            
            <button className="quick-action-btn">
              <Stethoscope size={16} />
              <span>Lịch khám</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
