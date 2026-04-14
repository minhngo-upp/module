import React from 'react';
import { AlertTriangle, TrendingDown, ClipboardCheck } from 'lucide-react';
import AnthropometricsTab from './AnthropometricsTab';
import LabsTab from './LabsTab';
import BasicInfoTab from './BasicInfoTab';

function AssessmentQuickImpressionCard({ showToast }) {
  const findings = [
    'Xu hướng giảm cân tiếp diễn',
    'Protein máu hơi thấp',
    'Glucose đói tăng nhẹ',
    'Hemoglobin thấp nhẹ',
  ];
  const nextSteps = [
    'Rà soát lượng đạm thực tế',
    'Chỉnh lại phân bố tinh bột giữa bữa',
    'Tích hợp bất thường xét nghiệm vào kế hoạch',
  ];

  return (
    <article className="minimal-card impression-top-card">
      <div className="impression-top-header">
         <div className="impression-title-block flex items-center justify-between">
           <h2 className="minimal-card-title m-0">Đánh giá ưu tiên hôm nay</h2>
           <span className="alert-severity tag tag-danger inline-flex items-center gap-1 font-bold">
             <AlertTriangle size={14} /> 4 chỉ số cần chú ý
           </span>
         </div>
      </div>
      
      <div className="impression-split-grid mt-4">
         <section className="impression-section">
            <h3 className="impression-subtitle">Điều đáng chú ý</h3>
            <ul className="impression-bullets text-warning-strong">
               {findings.map((item, idx) => (
                 <li key={idx}><TrendingDown size={15} /> <span>{item}</span></li>
               ))}
            </ul>
         </section>
         <section className="impression-section">
            <h3 className="impression-subtitle">Việc cần làm tiếp</h3>
            <ul className="impression-bullets text-primary">
               {nextSteps.map((item, idx) => (
                 <li key={idx}><ClipboardCheck size={15} /> <span>{item}</span></li>
               ))}
            </ul>
            <div className="impression-actions mt-3">
               <button className="btn-primary btn-small w-full justify-center" onClick={() => showToast('Cập nhật kế hoạch')}>Đưa vào kế hoạch</button>
            </div>
         </section>
      </div>
    </article>
  );
}

export default function AssessmentTab({ patient, showToast }) {
  return (
    <div className="tab-pane assessment-review-tab pb-8">
      <div className="clinical-dashboard-layout !grid-cols-1">
        <div className="clinical-dashboard-main single-column-override">
          <AssessmentQuickImpressionCard showToast={showToast} />
          
          <div className="module-divider mt-6 mb-2">
             <h2 className="module-divider-title text-xl font-bold">A. Nhân trắc</h2>
          </div>
          <AnthropometricsTab patient={patient} showToast={showToast} />
          
          <div className="module-divider mt-8 mb-2">
             <h2 className="module-divider-title text-xl font-bold">B. Xét nghiệm</h2>
          </div>
          <LabsTab showToast={showToast} />
          
          <div className="module-divider mt-8 mb-2">
             <h2 className="module-divider-title text-xl font-bold">C. Thông tin nền</h2>
          </div>
          <BasicInfoTab patient={patient} />
        </div>
      </div>
    </div>
  );
}
