import React from 'react';
import { AlertTriangle, ArrowRight, CalendarClock, ClipboardList, Droplets, FlaskConical, Salad } from 'lucide-react';

function RiskCard({ risk }) {
  return (
    <article className={`risk-card risk-${risk.level}`}>
      <div className="risk-card-icon">
        <AlertTriangle size={16} aria-hidden="true" />
      </div>
      <div>
        <h3>{risk.title}</h3>
        <p>{risk.detail}</p>
      </div>
    </article>
  );
}

function QuickAction({ icon, title, description, onClick }) {
  const Icon = icon;

  return (
    <button className="quick-action-card" type="button" onClick={onClick}>
      <div className="quick-action-icon">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="quick-action-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <ArrowRight size={16} aria-hidden="true" />
    </button>
  );
}

export default function OverviewTab({ patient, onNavigate, showToast }) {
  const { nutritionAssessment, riskFlags, currentState, nextInterventionSummary, dietLogSummary } = patient;

  return (
    <div className="tab-pane patient-summary-tab">
      <section className="summary-layout">
        <div className="summary-main">
          <article className="card summary-panel summary-intro">
            <div className="section-heading">
              <span className="eyebrow">Tóm tắt lâm sàng</span>
              <h2>{nutritionAssessment.mainDiagnosis}</h2>
              <p>{nutritionAssessment.summary}</p>
            </div>

            <div className="summary-kpis">
              {currentState.map((item) => (
                <div key={item.label} className="summary-kpi">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="card summary-panel">
            <div className="section-heading">
              <span className="eyebrow">Cờ cần chú ý</span>
              <h2>Điểm cần theo dõi ngay trong ca làm việc này</h2>
            </div>
            <div className="risk-grid">
              {riskFlags.map((risk) => (
                <RiskCard key={risk.title} risk={risk} />
              ))}
            </div>
          </article>

          <article className="card summary-panel">
            <div className="section-heading">
              <span className="eyebrow">Tình trạng hiện tại</span>
              <h2>Khả năng bám mục tiêu dinh dưỡng trong 7 ngày gần nhất</h2>
              <p>{nutritionAssessment.adherence}</p>
            </div>

            <div className="status-grid">
              <div className="status-block">
                <div className="status-icon">
                  <Salad size={18} aria-hidden="true" />
                </div>
                <div>
                  <strong>Nhật ký khẩu phần</strong>
                  <p>{dietLogSummary.completion}</p>
                </div>
              </div>
              <div className="status-block">
                <div className="status-icon">
                  <Droplets size={18} aria-hidden="true" />
                </div>
                <div>
                  <strong>Lượng nước trung bình</strong>
                  <p>{dietLogSummary.hydration}</p>
                </div>
              </div>
              <div className="status-block">
                <div className="status-icon">
                  <FlaskConical size={18} aria-hidden="true" />
                </div>
                <div>
                  <strong>Điểm cần theo dõi xét nghiệm</strong>
                  <p>Protein toàn phần, glucose đói, canxi</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        <aside className="summary-side">
          <article className="card summary-panel">
            <div className="section-heading">
              <span className="eyebrow">Hành động nhanh</span>
              <h2>Đi tới đúng thao tác trong một lần nhấn</h2>
            </div>

            <div className="quick-actions">
              <QuickAction
                icon={ClipboardList}
                title="Mở nhật ký khẩu phần"
                description="Xem bữa ăn, nước uống và hoạt động gần nhất"
                onClick={() => onNavigate('daily-log')}
              />
              <QuickAction
                icon={Salad}
                title="Mở kế hoạch can thiệp"
                description="Điều chỉnh khuyến nghị và thực đơn hiện tại"
                onClick={() => onNavigate('intervention-followup')}
              />
              <QuickAction
                icon={CalendarClock}
                title="Ghi follow-up"
                description="Chuyển sang theo dõi và lịch sử can thiệp"
                onClick={() => {
                  onNavigate('intervention-followup');
                  showToast('Đã chuyển tới khu vực theo dõi và lịch sử');
                }}
              />
              <QuickAction
                icon={FlaskConical}
                title="Xem xét nghiệm"
                description="Đọc nhanh các chỉ số ảnh hưởng đến can thiệp"
                onClick={() => onNavigate('assessment')}
              />
            </div>
          </article>

          <article className="card summary-panel intervention-preview">
            <div className="section-heading">
              <span className="eyebrow">Can thiệp tiếp theo</span>
              <h2>{nextInterventionSummary.title}</h2>
            </div>

            <ul className="detail-list">
              {nextInterventionSummary.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
}
