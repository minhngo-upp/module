import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Droplets,
  FlaskConical,
  Salad,
  TrendingUp,
} from 'lucide-react';

const goalMetrics = [
  {
    label: 'Năng lượng',
    actual: '1.650 kcal/ngày',
    target: '1.800-1.950 kcal/ngày',
    delta: 'Thiếu khoảng 12%',
    status: 'Chưa đạt',
    tone: 'danger',
    progress: 88,
  },
  {
    label: 'Protein',
    actual: '82 g/ngày',
    target: '78-92 g/ngày',
    delta: 'Trong khoảng mục tiêu',
    status: 'Đạt',
    tone: 'success',
    progress: 100,
  },
  {
    label: 'Nước uống',
    actual: '1.4 lít/ngày',
    target: '1.8-2.0 lít/ngày',
    delta: 'Thiếu 0.4 lít/ngày',
    status: 'Cần cải thiện',
    tone: 'warning',
    progress: 78,
  },
  {
    label: 'Nhật ký khẩu phần',
    actual: '5/7 ngày',
    target: '7/7 ngày',
    delta: 'Thiếu 2 ngày ghi nhận',
    status: 'Cần cải thiện',
    tone: 'warning',
    progress: 71,
  },
];

const timelineItems = [
  { time: '3 ngày trước', text: 'Ghi nhận ăn chậm và giảm lượng ăn về cuối ngày.' },
  { time: '2 ngày trước', text: 'Nước uống trung bình thấp hơn mục tiêu can thiệp.' },
  { time: 'Hôm nay', text: 'Tiếp tục chưa đạt kcal mục tiêu, cần bổ sung bữa phụ.' },
];

function StatusChip({ children, tone = 'neutral' }) {
  return <span className={`clinical-status-chip status-${tone}`}>{children}</span>;
}

function GoalVsActualMetricCard({ metric }) {
  return (
    <article className="goal-actual-card">
      <div className="goal-actual-top">
        <div>
          <span>{metric.label}</span>
          <strong>{metric.actual}</strong>
        </div>
        <StatusChip tone={metric.tone}>{metric.status}</StatusChip>
      </div>
      <div className="micro-progress" aria-hidden="true">
        <span className={`micro-progress-fill progress-${metric.tone}`} style={{ width: `${metric.progress}%` }} />
      </div>
      <div className="goal-actual-bottom">
        <span>Mục tiêu: {metric.target}</span>
        <strong>{metric.delta}</strong>
      </div>
    </article>
  );
}

function AlertAttentionItem({ risk }) {
  const severityLabel = risk.level === 'high' ? 'Ưu tiên cao' : risk.level === 'medium' ? 'Cần xử lý trong ngày' : 'Tiếp tục theo dõi';

  return (
    <article className={`attention-item attention-${risk.level}`}>
      <div className="attention-icon">
        <AlertTriangle size={17} aria-hidden="true" />
      </div>
      <div>
        <div className="attention-title-row">
          <h3>{risk.title}</h3>
          <StatusChip tone={risk.level === 'high' ? 'danger' : 'warning'}>{severityLabel}</StatusChip>
        </div>
        <p>{risk.detail}</p>
      </div>
    </article>
  );
}

function QuickActionItem({ icon, title, description, onClick }) {
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

function TimestampMetaRow() {
  const items = [
    ['Cập nhật gần nhất', 'Hôm nay, 08:30'],
    ['Follow-up gần nhất', '2 ngày trước'],
    ['Nhật ký gần nhất', 'T2, 02/12'],
    ['Xét nghiệm gần nhất', '10/10/2023'],
  ];

  return (
    <div className="timestamp-meta-row">
      {items.map(([label, value]) => (
        <span key={label}>
          <strong>{label}:</strong> {value}
        </span>
      ))}
    </div>
  );
}

function NextInterventionPlanCard({ plan, onNavigate, showToast }) {
  return (
    <article className="card summary-panel intervention-preview decision-plan-card">
      <div className="section-heading with-row">
        <div>
          <span className="eyebrow">Ưu tiên</span>
          <h2>{plan.title}</h2>
        </div>
        <StatusChip tone="warning">48 giờ tới</StatusChip>
      </div>

      <ul className="decision-checklist">
        {plan.items.map((item) => (
          <li key={item}>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="decision-plan-actions">
        <button className="btn-primary btn-small" type="button" onClick={() => onNavigate('intervention-followup')}>
          Cập nhật kế hoạch
        </button>
        <button className="btn-secondary btn-small" type="button" onClick={() => showToast('Đã mở form tạo follow-up')}>
          Tạo follow-up
        </button>
      </div>
    </article>
  );
}

function PatientTimelineCard() {
  return (
    <article className="card summary-panel timeline-card">
      <div className="section-heading">
        <span className="eyebrow">Diễn biến gần đây</span>
        <h2>Tín hiệu trong 3 ngày gần nhất</h2>
      </div>
      <ol className="mini-timeline">
        {timelineItems.map((item) => (
          <li key={item.time}>
            <strong>{item.time}</strong>
            <span>{item.text}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default function OverviewTab({ patient, onNavigate, showToast }) {
  const { nutritionAssessment, riskFlags, nextInterventionSummary, dietLogSummary } = patient;

  return (
    <div className="tab-pane patient-summary-tab">
      <section className="summary-layout">
        <div className="summary-main">
          <article className="card summary-panel clinical-summary-card">
            <div className="section-heading">
              <span className="eyebrow">Tóm tắt lâm sàng</span>
              <h2>{nutritionAssessment.mainDiagnosis}</h2>
              <p>{nutritionAssessment.summary}</p>
            </div>

            <TimestampMetaRow />

            <div className="clinical-summary-layers">
              <div className="clinical-layer primary">
                <span>Vấn đề chính</span>
                <strong>Ăn vào giảm kéo dài, nhanh no về chiều và nguy cơ không đạt nhu cầu năng lượng.</strong>
              </div>
              <div className="clinical-layer">
                <span>Mục tiêu điều trị</span>
                <strong>1.800-1.950 kcal/ngày · 78-92 g protein/ngày · 1.8-2.0 lít nước/ngày</strong>
              </div>
              <div className="clinical-layer">
                <span>Mức đạt hiện tại</span>
                <strong>Năng lượng còn thiếu 12%, nước uống 1.4 lít/ngày, nhật ký đạt 5/7 ngày.</strong>
              </div>
            </div>

            <div className="goal-actual-grid">
              {goalMetrics.map((metric) => (
                <GoalVsActualMetricCard metric={metric} key={metric.label} />
              ))}
            </div>
          </article>

          <article className="card summary-panel">
            <div className="section-heading">
              <span className="eyebrow">Có cần chú ý</span>
              <h2>Các điểm cần xử lý trong ca làm việc này</h2>
            </div>
            <div className="attention-list">
              {riskFlags.map((risk) => (
                <AlertAttentionItem risk={risk} key={risk.title} />
              ))}
            </div>
          </article>

          <article className="card summary-panel">
            <div className="section-heading">
              <span className="eyebrow">Mức đạt hiện tại</span>
              <h2>Khả năng bám mục tiêu dinh dưỡng trong 7 ngày gần nhất</h2>
              <p>{nutritionAssessment.adherence}</p>
            </div>

            <div className="status-grid">
              <div className="status-block">
                <div className="status-icon"><Salad size={18} aria-hidden="true" /></div>
                <div><strong>Nhật ký khẩu phần</strong><p>{dietLogSummary.completion}</p></div>
              </div>
              <div className="status-block">
                <div className="status-icon"><Droplets size={18} aria-hidden="true" /></div>
                <div><strong>Lượng nước trung bình</strong><p>{dietLogSummary.hydration}</p></div>
              </div>
              <div className="status-block">
                <div className="status-icon"><FlaskConical size={18} aria-hidden="true" /></div>
                <div><strong>Xét nghiệm cần xem</strong><p>Protein toàn phần, glucose đói, canxi</p></div>
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
              <QuickActionItem icon={ClipboardList} title="Xem khẩu phần 3 ngày gần nhất" description="Kiểm tra bữa ăn, nước uống và khoảng trống bữa phụ" onClick={() => onNavigate('daily-log')} />
              <QuickActionItem icon={Salad} title="Điều chỉnh kế hoạch can thiệp" description="Cập nhật thực đơn, khẩu phần và mục tiêu kcal" onClick={() => onNavigate('intervention-followup')} />
              <QuickActionItem icon={CalendarClock} title="Tạo follow-up trong 48 giờ" description="Theo dõi đáp ứng sau khi tăng năng lượng khẩu phần" onClick={() => { onNavigate('intervention-followup'); showToast('Đã chuyển tới khu vực theo dõi và lịch sử'); }} />
              <QuickActionItem icon={FlaskConical} title="Xem nhanh xét nghiệm liên quan" description="Protein toàn phần, glucose đói và calci" onClick={() => onNavigate('assessment')} />
              <QuickActionItem icon={TrendingUp} title="So sánh mục tiêu và thực tế" description="Rà soát phần thiếu năng lượng, nước và nhật ký" onClick={() => onNavigate('daily-log')} />
            </div>
          </article>

          <NextInterventionPlanCard plan={nextInterventionSummary} onNavigate={onNavigate} showToast={showToast} />
          <PatientTimelineCard />
        </aside>
      </section>
    </div>
  );
}
