import React from 'react';
import BasicInfoTab from './BasicInfoTab';
import AnthropometricsTab from './AnthropometricsTab';
import LabsTab from './LabsTab';

export default function AssessmentTab({ patient, showToast }) {
  return (
    <div className="tab-pane stacked-tab">
      <article className="card composite-intro-card">
        <div className="section-heading">
          <span className="eyebrow">Đánh giá</span>
          <h2>Gom toàn bộ dữ liệu nền, nhân trắc và xét nghiệm vào một luồng đọc liên tục</h2>
          <p>Đi từ bối cảnh bệnh nhân, triệu chứng hiện tại, tới các chỉ số cơ thể và xét nghiệm liên quan đến can thiệp dinh dưỡng.</p>
        </div>
        <div className="section-anchor-nav" aria-label="Các phần trong tab đánh giá">
          <a href="#assessment-basic">Thông tin cơ bản</a>
          <a href="#assessment-anthropometrics">Nhân trắc</a>
          <a href="#assessment-labs">Xét nghiệm</a>
        </div>
      </article>

      <section id="assessment-basic" className="composite-section">
        <BasicInfoTab patient={patient} />
      </section>

      <section id="assessment-anthropometrics" className="composite-section">
        <AnthropometricsTab patient={patient} showToast={showToast} />
      </section>

      <section id="assessment-labs" className="composite-section">
        <LabsTab showToast={showToast} />
      </section>
    </div>
  );
}
