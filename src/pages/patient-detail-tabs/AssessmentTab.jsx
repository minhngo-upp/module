import React from 'react';
import { AlertTriangle, ArrowRight, ClipboardCheck, FlaskConical, Ruler, TrendingDown } from 'lucide-react';
import BasicInfoTab from './BasicInfoTab';
import AnthropometricsTab from './AnthropometricsTab';
import LabsTab from './LabsTab';

function AssessmentQuickImpressionCard({ showToast }) {
  const findings = [
    'Cân nặng giảm dần trong 6 tuần gần đây, cần tránh giảm thêm trong giai đoạn hiện tại.',
    'Protein toàn phần hơi thấp, gợi ý cần củng cố lượng đạm thực tế.',
    'Glucose đói tăng nhẹ, tiếp tục theo dõi phân bố bữa ăn và năng lượng.',
    'Hemoglobin thấp nhẹ, cần rà soát nguy cơ thiếu máu và khẩu phần hỗ trợ.',
  ];
  const nextSteps = ['Rà soát lượng đạm thực tế', 'Theo dõi lại đường huyết', 'Gắn bất thường xét nghiệm vào kế hoạch can thiệp'];

  return (
    <article className="card assessment-impression-card">
      <div className="assessment-impression-header">
        <div>
          <span className="eyebrow">Kết luận nhanh</span>
          <h2>Đánh giá ưu tiên hôm nay</h2>
          <p>Diễn giải nhanh dữ liệu nhân trắc và xét nghiệm liên quan trực tiếp đến can thiệp dinh dưỡng.</p>
        </div>
        <span className="assessment-priority-badge">
          <AlertTriangle size={15} aria-hidden="true" />
          4 chỉ số cần chú ý
        </span>
      </div>

      <div className="assessment-impression-grid">
        <section>
          <h3>Điều đáng chú ý</h3>
          <ul>
            {findings.map((item) => (
              <li key={item}>
                <TrendingDown size={15} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Việc cần làm tiếp</h3>
          <ul>
            {nextSteps.map((item) => (
              <li key={item}>
                <ClipboardCheck size={15} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="assessment-impression-actions">
            <button className="btn-primary btn-small" type="button" onClick={() => showToast('Đã gắn ghi chú vào kế hoạch can thiệp')}>
              Gắn vào kế hoạch
            </button>
            <button className="btn-secondary btn-small" type="button" onClick={() => showToast('Đã tạo nhắc follow-up xét nghiệm')}>
              Tạo follow-up xét nghiệm
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}

export default function AssessmentTab({ patient, showToast }) {
  return (
    <div className="tab-pane stacked-tab assessment-review-tab">
      <AssessmentQuickImpressionCard showToast={showToast} />

      <article className="card composite-intro-card assessment-nav-card">
        <div className="section-heading">
          <span className="eyebrow">Clinical review</span>
          <h2>Đọc nhanh từ bối cảnh, nhân trắc đến xét nghiệm</h2>
          <p>Ưu tiên xu hướng, bất thường có ý nghĩa dinh dưỡng và hành động tiếp theo thay vì chỉ liệt kê số liệu.</p>
        </div>
        <div className="section-anchor-nav" aria-label="Các phần trong tab đánh giá">
          <a href="#assessment-anthropometrics"><Ruler size={14} aria-hidden="true" /> Nhân trắc <ArrowRight size={13} aria-hidden="true" /></a>
          <a href="#assessment-labs"><FlaskConical size={14} aria-hidden="true" /> Xét nghiệm <ArrowRight size={13} aria-hidden="true" /></a>
          <a href="#assessment-basic">Thông tin nền <ArrowRight size={13} aria-hidden="true" /></a>
        </div>
      </article>

      <section id="assessment-anthropometrics" className="composite-section">
        <AnthropometricsTab patient={patient} showToast={showToast} />
      </section>

      <section id="assessment-labs" className="composite-section">
        <LabsTab showToast={showToast} />
      </section>

      <section id="assessment-basic" className="composite-section">
        <BasicInfoTab patient={patient} />
      </section>
    </div>
  );
}
