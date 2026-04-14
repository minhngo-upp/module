import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Salad,
  Droplets,
  ClipboardList
} from 'lucide-react';

export default function OverviewTab({ patient, onNavigate, showToast }) {
  const { nutritionAssessment, riskFlags, nextInterventionSummary, dietLogSummary } = patient;

  // Map the goal metrics into an array
  const metrics = [
    { label: 'Năng lượng', actual: '1.650 kcal', target: '1.800 kcal', status: 'Chưa đạt', tone: 'danger', progress: 88 },
    { label: 'Protein', actual: '82 g', target: '78 g', status: 'Đạt', tone: 'success', progress: 100 },
    { label: 'Nước uống', actual: '1.4 lít', target: '1.8 lít', status: 'Cần cải thiện', tone: 'warning', progress: 78 },
    { label: 'Nhật ký', actual: '5 ngày', target: '7 ngày', status: 'Cần cải thiện', tone: 'warning', progress: 71 },
  ];

  // Map timeline
  const timelineItems = [
    { time: 'Hôm nay', text: 'Tiếp tục chưa đạt kcal mục tiêu, cần thêm bữa phụ.' },
    { time: '2 ngày trước', text: 'Nước uống trung bình thấp hơn mục tiêu.' },
    { time: '3 ngày trước', text: 'Ghi nhận ăn chậm và dễ no về cuối ngày.' },
  ];

  return (
    <div className="tab-pane">
      <div className="clinical-dashboard-layout">
        
        {/* LEFT COLUMN: 8 Columns */}
        <div className="clinical-dashboard-main">
          
          {/* Section A: Tóm tắt lâm sàng (minimal card) */}
          <section className="minimal-card clinical-summary-section">
            <h2 className="minimal-card-title">Tóm tắt lâm sàng</h2>
            <p className="clinical-summary-text">{nutritionAssessment.summary}</p>
            
            <div className="clinical-summary-rows">
              <div className="summary-row">
                <span className="summary-row-label">Vấn đề chính</span>
                <strong className="summary-row-value">{nutritionAssessment.mainDiagnosis}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-row-label">Mục tiêu</span>
                <strong className="summary-row-value">{nutritionAssessment.currentGoal}</strong>
              </div>
              <div className="summary-row">
                <span className="summary-row-label">Thực tế</span>
                <strong className="summary-row-value">Năng lượng thiếu 12%, nước uống 1.4 lít/ngày, nhật ký 5/7 ngày.</strong>
              </div>
            </div>
          </section>

          {/* Section B: 4 Compact Metric Cards */}
          <section className="compact-metrics-grid">
            {metrics.map((m, idx) => (
              <div className="compact-metric-card" key={idx}>
                <div className="metric-header">
                  <span className="metric-label">{m.label}</span>
                  <span className={`metric-status text-${m.tone}`}>{m.status}</span>
                </div>
                <div className="metric-body">
                  <strong className="metric-actual">{m.actual}</strong>
                  <span className="metric-target">/ {m.target}</span>
                </div>
                <div className="metric-progress-track">
                  <div className={`metric-progress-fill bg-${m.tone}`} style={{ width: `${m.progress}%` }}></div>
                </div>
              </div>
            ))}
          </section>

          {/* Section C: Có cần chú ý */}
          <section className="minimal-card alerts-section">
            <h2 className="minimal-card-title">Có cần chú ý</h2>
            <div className="alerts-list">
              {riskFlags.slice(0, 3).map((risk, idx) => {
                const isHigh = risk.level === 'high';
                return (
                  <div className={`alert-clean-item ${isHigh ? 'alert-high' : ''}`} key={idx}>
                    <AlertTriangle size={16} className={isHigh ? 'text-danger' : 'text-warning'} />
                    <div className="alert-content">
                      <div className="alert-title-row">
                         <strong>{risk.title}</strong>
                         <span className={`alert-severity tag ${isHigh ? 'tag-danger' : 'tag-warning'}`}>
                           {isHigh ? 'Ưu tiên cao' : 'Theo dõi tiếp'}
                         </span>
                      </div>
                      <p className="alert-detail">{risk.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: 4 Columns */}
        <aside className="clinical-dashboard-side">
          
          {/* Block 1: Ưu tiên 48 giờ tới */}
          <section className="minimal-card next-actions-section">
             <h2 className="minimal-card-title">Ưu tiên 48 giờ tới</h2>
             <ul className="next-actions-bullets">
               {nextInterventionSummary.items.slice(0, 3).map((item, idx) => (
                 <li key={idx}>
                   <CheckCircle2 size={16} className="text-primary" />
                   <span>{item}</span>
                 </li>
               ))}
             </ul>
             <div className="next-actions-buttons">
                <button className="btn-primary w-full" onClick={() => onNavigate('intervention-followup')}>Cập nhật kế hoạch</button>
                <button className="btn-secondary w-full" onClick={() => showToast('Đã mở form đặt lịch theo dõi')}>Tạo follow-up</button>
             </div>
          </section>

          {/* Block 2: Diễn biến gần đây */}
          <section className="minimal-card timeline-section">
             <h2 className="minimal-card-title">Diễn biến gần đây</h2>
             <div className="clean-timeline">
               {timelineItems.map((item, idx) => (
                 <div className="timeline-item" key={idx}>
                    <span className="timeline-time">{item.time}</span>
                    <p className="timeline-text">{item.text}</p>
                 </div>
               ))}
             </div>
          </section>
        </aside>

      </div>
    </div>
  );
}
