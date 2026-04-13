import React from 'react';
import CarePlanTab from './CarePlanTab';
import HistoryTab from './HistoryTab';

export default function InterventionFollowUpTab({ patient, showToast }) {
  return (
    <div className="tab-pane stacked-tab">
      <article className="card composite-intro-card">
        <div className="section-heading">
          <span className="eyebrow">Can thiệp & theo dõi</span>
          <h2>Workspace từ lập thực đơn đến follow-up sau can thiệp</h2>
          <p>Đi theo một luồng: rà soát chu kỳ, xử lý ngày còn thiếu, lưu kế hoạch, rồi tạo follow-up theo phản hồi thực tế.</p>
        </div>
        <div className="intervention-flow-hints" aria-label="Luồng làm việc can thiệp">
          <span>Lập kế hoạch</span>
          <span>Rà soát sẵn sàng</span>
          <span>Lưu kế hoạch</span>
          <span>Theo dõi phản hồi</span>
        </div>
        <div className="section-anchor-nav" aria-label="Các phần trong tab can thiệp và theo dõi">
          <a href="#intervention-plan">Kế hoạch can thiệp</a>
          <a href="#intervention-history">Theo dõi và lịch sử</a>
        </div>
      </article>

      <section id="intervention-plan" className="composite-section">
        <CarePlanTab patient={patient} showToast={showToast} />
      </section>

      <section id="intervention-history" className="composite-section">
        <HistoryTab showToast={showToast} />
      </section>
    </div>
  );
}
