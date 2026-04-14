import React from 'react';
import { AlertTriangle, ArrowRight, ClipboardCheck } from 'lucide-react';
import AnthropometricsTab from './AnthropometricsTab';
import LabsTab from './LabsTab';
import BasicInfoTab from './BasicInfoTab';

function QuickClinicalImpression({ showToast }) {
  const findings = [
    'Cân nặng tiếp tục giảm so với mốc khám ban đầu.',
    'Protein toàn phần hơi thấp, cần đối chiếu lượng đạm thực tế.',
    'Glucose đói tăng nhẹ, nên rà soát phân bố tinh bột giữa các bữa.',
    'Hemoglobin thấp nhẹ, cần theo dõi nguy cơ thiếu máu.',
  ];

  const nextActions = [
    'Rà soát lượng đạm và khả năng dung nạp.',
    'Gắn bất thường xét nghiệm vào kế hoạch can thiệp.',
    'Ưu tiên follow-up sau khi điều chỉnh khẩu phần.',
  ];

  return (
    <article className="assessment-impression-compact">
      <div className="assessment-impression-copy">
        <div className="assessment-impression-title-row">
          <div>
            <span className="eyebrow">Kết luận nhanh</span>
            <h2>Đánh giá ưu tiên hôm nay</h2>
          </div>
          <span className="assessment-alert-pill">
            <AlertTriangle size={15} aria-hidden="true" />
            4 chỉ số cần chú ý
          </span>
        </div>

        <div className="assessment-impression-grid-minimal">
          <section>
            <h3>Điều đáng chú ý</h3>
            <ul>
              {findings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="assessment-next-action-box">
            <h3>Việc cần làm tiếp</h3>
            <ul>
              {nextActions.map((item) => (
                <li key={item}>
                  <ClipboardCheck size={15} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary btn-small" type="button" onClick={() => showToast('Đã chuyển nhận định vào kế hoạch can thiệp')}>
              Đưa vào kế hoạch
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </section>
        </div>
      </div>
    </article>
  );
}

function AssessmentModule({ eyebrow, title, description, children }) {
  return (
    <section className="assessment-module-clean">
      <div className="assessment-module-heading">
        <span className="eyebrow">{eyebrow}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AssessmentTab({ patient, showToast }) {
  return (
    <div className="tab-pane assessment-review-tab assessment-minimal-workspace">
      <QuickClinicalImpression showToast={showToast} />

      <AssessmentModule
        eyebrow="A. Nhân trắc"
        title="Xu hướng cơ thể"
        description="Đọc nhanh cân nặng, BMI và biến động gần đây trước khi đi vào chi tiết."
      >
        <AnthropometricsTab patient={patient} />
      </AssessmentModule>

      <AssessmentModule
        eyebrow="B. Xét nghiệm"
        title="Chỉ số cần ưu tiên rà soát"
        description="Hiển thị bất thường quan trọng trước, bảng đầy đủ chỉ mở khi cần đối chiếu."
      >
        <LabsTab showToast={showToast} />
      </AssessmentModule>

      <AssessmentModule
        eyebrow="C. Thông tin nền"
        title="Bối cảnh hỗ trợ diễn giải"
        description="Thông tin tần suất thấp hơn được đặt cuối trang để không cạnh tranh với nhân trắc và xét nghiệm."
      >
        <BasicInfoTab patient={patient} />
      </AssessmentModule>
    </div>
  );
}
