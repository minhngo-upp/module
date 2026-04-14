import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { labReportsMock } from '../../mockData';

const labClinicalMeta = {
  'Protein toàn phần': {
    severity: 'danger',
    label: 'Ưu tiên rà soát',
    delta: 'Giảm từ 6.5 g/dL lần trước',
    interpretation: 'Rà soát lượng đạm thực tế và khả năng dung nạp.',
  },
  'Glucose đói': {
    severity: 'warning',
    label: 'Cần theo dõi',
    delta: 'Tăng từ 97 mg/dL lần trước',
    interpretation: 'Ưu tiên phân bố tinh bột đều giữa các bữa.',
  },
  Canxi: {
    severity: 'warning',
    label: 'Cần theo dõi',
    delta: 'Giảm từ 8.7 mg/dL lần trước',
    interpretation: 'Đối chiếu với lượng sữa/chế phẩm và tình trạng dung nạp.',
  },
  Hemoglobin: {
    severity: 'danger',
    label: 'Ưu tiên rà soát',
    delta: 'Không đổi so với lần trước',
    interpretation: 'Theo dõi khẩu phần giàu sắt/đạm và phối hợp bác sĩ nếu cần.',
  },
};

const reportInterpretations = {
  'Sinh hóa máu': 'Ưu tiên chú ý đạm và đường huyết vì ảnh hưởng trực tiếp đến phân bố bữa ăn.',
  'Điện giải đồ': 'Canxi hơi thấp; các điện giải còn lại chưa có dấu rối loạn đáng kể.',
  'Công thức máu': 'Hemoglobin thấp nhẹ, cần theo dõi thêm nguy cơ thiếu máu và khẩu phần hỗ trợ.',
};

const reportReviewStatus = {
  'Sinh hóa máu': 'Chưa rà soát',
  'Điện giải đồ': 'Đã đối chiếu',
  'Công thức máu': 'Đã ghi nhận vào kế hoạch',
};

function LabSeverityBadge({ meta, fallback }) {
  return <span className={`lab-severity-pill tone-${meta?.severity ?? 'success'}`}>{meta?.label ?? fallback}</span>;
}

function LabResultRow({ item }) {
  const meta = labClinicalMeta[item.name];

  return (
    <div className={`lab-result-clean-row ${item.abnormal ? 'abnormal' : 'stable'}`}>
      <div className="lab-result-name">
        <strong>{item.name}</strong>
        {meta ? <span>{meta.delta}</span> : <span>Không có thay đổi đáng chú ý</span>}
      </div>
      <div className="lab-result-value">
        <strong>{item.value} {item.unit}</strong>
        <span>Tham chiếu: {item.refRange}</span>
      </div>
      <div className="lab-result-meaning">
        <LabSeverityBadge meta={meta} fallback={item.note} />
        <p>{meta?.interpretation ?? 'Trong giới hạn, chưa cần ưu tiên can thiệp.'}</p>
      </div>
    </div>
  );
}

function LabPanelCard({ report, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const abnormalItems = report.items.filter((item) => item.abnormal);
  const visibleItems = showAll ? report.items : abnormalItems;
  const abnormalCount = abnormalItems.length;
  const reviewStatus = reportReviewStatus[report.reportType];

  return (
    <article className={`lab-panel-minimal ${isOpen ? 'open' : ''}`}>
      <button className="lab-panel-minimal-header" type="button" onClick={() => setIsOpen((current) => !current)}>
        <span className="lab-panel-toggle" aria-hidden="true">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
        <span className="lab-panel-title-group">
          <strong>{report.reportType}</strong>
          <small>{report.reportDate} · {report.attachmentUrl}</small>
        </span>
        <span className={`lab-review-status ${reviewStatus === 'Chưa rà soát' ? 'pending' : 'done'}`}>{reviewStatus}</span>
        <span className={`lab-count-pill ${abnormalCount > 0 ? 'has-alert' : 'stable'}`}>
          {abnormalCount > 0 ? `${abnormalCount} cần chú ý` : 'Ổn định'}
        </span>
      </button>

      {isOpen ? (
        <div className="lab-panel-minimal-body">
          <div className="lab-interpretation-strip">
            <FileText size={16} aria-hidden="true" />
            <span>{reportInterpretations[report.reportType]}</span>
          </div>

          <div className="lab-result-clean-list">
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => <LabResultRow key={item.name} item={item} />)
            ) : (
              <div className="lab-empty-stable">Không có chỉ số bất thường trong phiếu này.</div>
            )}
          </div>

          {abnormalCount > 0 ? (
            <button className="lab-expand-minimal-btn" type="button" onClick={() => setShowAll((current) => !current)}>
              {showAll ? 'Thu gọn về chỉ số cần chú ý' : 'Xem tất cả chỉ số'}
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default function LabsTab() {
  const totalReports = labReportsMock.length;
  const abnormalTotal = labReportsMock.flatMap((report) => report.items.filter((item) => item.abnormal)).length;
  const reviewedReports = labReportsMock.filter((report) => reportReviewStatus[report.reportType] !== 'Chưa rà soát').length;

  return (
    <div className="labs-minimal-module">
      <div className="lab-summary-minimal-row" aria-label="Tóm tắt xét nghiệm">
        <div>
          <span>Tổng số phiếu</span>
          <strong>{totalReports}</strong>
        </div>
        <div className="alert">
          <span>Chỉ số cần chú ý</span>
          <strong>{abnormalTotal}</strong>
        </div>
        <div>
          <span>Đã rà soát</span>
          <strong>{reviewedReports}/{totalReports}</strong>
        </div>
      </div>

      <div className="lab-panels-minimal-list">
        {labReportsMock.map((report) => (
          <LabPanelCard key={report.id} report={report} defaultOpen={report.items.some((item) => item.abnormal)} />
        ))}
      </div>
    </div>
  );
}
