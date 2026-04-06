import React from 'react';
import CarePlanTab from './CarePlanTab';
import HistoryTab from './HistoryTab';

export default function InterventionFollowUpTab({ patient, showToast }) {
  return (
    <div className="tab-pane stacked-tab">
      <article className="card composite-intro-card">
        <div className="section-heading">
          <span className="eyebrow">Can thiệp & theo dõi</span>
          <h2>Thống nhất kế hoạch điều trị, follow-up và lịch sử phản hồi trong cùng một nơi</h2>
          <p>Người dùng không cần đổi tab giữa lúc lên thực đơn, ghi dặn dò và đọc lại diễn tiến can thiệp.</p>
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
