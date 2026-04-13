import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, FileText, MoreHorizontal, UploadCloud } from 'lucide-react';
import { labReportsMock } from '../../mockData';

const labClinicalMeta = {
  'Protein toàn phần': {
    severity: 'priority',
    delta: 'Giảm từ 6.5 g/dL lần trước',
    interpretation: 'Cần rà soát lượng đạm thực tế và khả năng dung nạp hiện tại.',
  },
  'Glucose đói': {
    severity: 'watch',
    delta: 'Tăng từ 97 mg/dL lần trước',
    interpretation: 'Ưu tiên phân bố tinh bột đều giữa các bữa và tránh dồn năng lượng một lần.',
  },
  Canxi: {
    severity: 'watch',
    delta: 'Giảm từ 8.7 mg/dL lần trước',
    interpretation: 'Đối chiếu với lượng sữa/chế phẩm và tình trạng dung nạp.',
  },
  Hemoglobin: {
    severity: 'priority',
    delta: 'Không đổi so với lần trước',
    interpretation: 'Cân nhắc theo dõi khẩu phần giàu sắt/đạm và phối hợp bác sĩ nếu cần.',
  },
};

const reportInterpretations = {
  'Sinh hóa máu': 'Ưu tiên chú ý đạm và đường huyết vì ảnh hưởng trực tiếp đến phân bố bữa ăn.',
  'Điện giải đồ': 'Canxi hơi thấp, các điện giải còn lại chưa có dấu rối loạn đáng kể.',
  'Công thức máu': 'Hemoglobin thấp nhẹ, cần theo dõi thêm nguy cơ thiếu máu và khẩu phần hỗ trợ.',
};

const reportReviewStatus = {
  'Sinh hóa máu': 'Chưa rà soát',
  'Điện giải đồ': 'Đã đối chiếu',
  'Công thức máu': 'Đã ghi nhận vào kế hoạch',
};

function getSeverity(item) {
  if (!item.abnormal) return { label: 'Ổn định', tone: 'success', level: 'stable' };
  const meta = labClinicalMeta[item.name];
  if (meta?.severity === 'priority') return { label: 'Ưu tiên rà soát', tone: 'danger', level: 'priority' };
  return { label: 'Cần theo dõi', tone: 'warning', level: 'watch' };
}

function getHighlights(reports) {
  const totalReports = reports.length;
  const abnormalItems = reports.flatMap((report) => report.items.filter((item) => item.abnormal));
  const stableReports = reports.filter((report) => report.items.every((item) => !item.abnormal)).length;
  return { totalReports, abnormalCount: abnormalItems.length, stableReports, abnormalItems };
}

function LabSeverityBadge({ severity }) {
  return <span className={`lab-severity-badge severity-${severity.tone}`}>{severity.label}</span>;
}

function LabDeltaIndicator({ item }) {
  const delta = labClinicalMeta[item.name]?.delta ?? 'Không có thay đổi đáng kể';
  return <span className="lab-delta-indicator">So với lần trước: {delta}</span>;
}

function ClinicalInterpretationLine({ reportType }) {
  return (
    <div className="clinical-interpretation-line">
      <AlertCircle size={15} aria-hidden="true" />
      <span>{reportInterpretations[reportType] ?? 'Đối chiếu kết quả với mục tiêu can thiệp hiện tại.'}</span>
    </div>
  );
}

function LabSourceMeta({ report }) {
  return (
    <div className="lab-source-meta">
      <span>Ngày xét nghiệm: <strong>{report.reportDate}</strong></span>
      <span>Nguồn: <strong>{report.attachmentUrl}</strong></span>
      <span>Trạng thái: <strong>{reportReviewStatus[report.reportType]}</strong></span>
    </div>
  );
}

function LabActionMenu({ report, showToast }) {
  return (
    <div className="lab-action-menu">
      <button className="btn-secondary btn-small" type="button" onClick={() => showToast(`Đã mở file ${report.attachmentUrl}`)}>
        Xem file gốc
      </button>
      <button className="btn-secondary btn-small" type="button" onClick={() => showToast('Đã gắn chỉ số vào kế hoạch can thiệp')}>
        Gắn vào kế hoạch
      </button>
      <button className="btn-icon" type="button" aria-label={`Mở thêm thao tác cho ${report.reportType}`} onClick={() => showToast('Đã mở menu thao tác xét nghiệm')}>
        <MoreHorizontal size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function PriorityLabIndicatorsCard({ abnormalItems }) {
  return (
    <article className="card priority-lab-card">
      <div className="section-heading">
        <span className="eyebrow">Ưu tiên rà soát</span>
        <h2>Chỉ số có tác động đến can thiệp hiện tại</h2>
      </div>
      <div className="priority-lab-list">
        {abnormalItems.map((item) => {
          const severity = getSeverity(item);
          return (
            <div className="priority-lab-item" key={item.name}>
              <div>
                <strong>{item.name}</strong>
                <span>{item.value} {item.unit} · {labClinicalMeta[item.name]?.delta}</span>
              </div>
              <LabSeverityBadge severity={severity} />
            </div>
          );
        })}
      </div>
    </article>
  );
}

function LabResultRow({ item }) {
  const severity = getSeverity(item);
  const interpretation = labClinicalMeta[item.name]?.interpretation;

  return (
    <tr className={item.abnormal ? 'lab-row-abnormal' : ''}>
      <td>
        <div className="lab-value-block">
          <strong>{item.name}</strong>
          <LabDeltaIndicator item={item} />
          {interpretation ? <span className="lab-inline-note">Ý nghĩa lâm sàng: {interpretation}</span> : null}
        </div>
      </td>
      <td className={item.abnormal ? 'text-danger font-bold' : ''}>{item.value} {item.unit}</td>
      <td>{item.refRange}</td>
      <td><LabSeverityBadge severity={severity} /></td>
    </tr>
  );
}

function LabPanelCard({ report, showAttentionOnly, isExpanded, onToggle, showToast }) {
  const visibleItems = showAttentionOnly ? report.items.filter((item) => item.abnormal) : report.items;
  const abnormalCount = report.items.filter((item) => item.abnormal).length;
  const reportSeverity = abnormalCount > 0 ? { label: `${abnormalCount} chỉ số cần chú ý`, tone: abnormalCount > 1 ? 'danger' : 'warning' } : { label: 'Ổn định', tone: 'success' };
  const shouldShowTable = isExpanded || abnormalCount > 0;

  return (
    <article className={`card lab-report-card lab-report-panel ${shouldShowTable ? 'expanded' : 'collapsed'}`}>
      <div className="lab-report-header">
        <div className="lab-report-title-block">
          <div className="lab-report-icon"><FileText size={18} aria-hidden="true" /></div>
          <div className="lab-report-title">
            <div className="lab-report-title-row">
              <h2>{report.reportType}</h2>
              <LabSeverityBadge severity={reportSeverity} />
              <p className="lab-report-date">{report.reportDate}</p>
            </div>
            <LabSourceMeta report={report} />
          </div>
        </div>
        <LabActionMenu report={report} showToast={showToast} />
      </div>

      <ClinicalInterpretationLine reportType={report.reportType} />

      {shouldShowTable ? (
        <div className="lab-report-table-shell">
          {visibleItems.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table lab-data-table">
                <thead>
                  <tr>
                    <th>Chỉ số</th>
                    <th>Kết quả</th>
                    <th>Khoảng tham chiếu</th>
                    <th>Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item) => <LabResultRow item={item} key={item.name} />)}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-copy">Không có chỉ số cần chú ý trong phiếu này.</p>
          )}
        </div>
      ) : null}

      <div className="lab-report-footer">
        <button className={`lab-expand-link ${shouldShowTable ? 'expanded' : ''}`} type="button" aria-expanded={shouldShowTable} onClick={() => onToggle(report.id)}>
          <span>{shouldShowTable ? 'Thu gọn phiếu xét nghiệm' : 'Xem tất cả chỉ số'}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function LabsTab({ showToast }) {
  const [expandedReports, setExpandedReports] = useState(() => Object.fromEntries(labReportsMock.map((report) => [report.id, false])));
  const [showAttentionOnly, setShowAttentionOnly] = useState(true);
  const highlights = useMemo(() => getHighlights(labReportsMock), []);

  const toggleReport = (reportId) => setExpandedReports((current) => ({ ...current, [reportId]: !current[reportId] }));

  return (
    <div className="tab-pane labs-tab">
      <section className="lab-summary-shell">
        <article className="card lab-summary-card lab-overview-card">
          <div className="section-heading">
            <span className="eyebrow">Tổng quan xét nghiệm</span>
            <h2>Đọc nhanh các chỉ số ảnh hưởng đến kế hoạch dinh dưỡng</h2>
            <p>Tập trung vào giá trị lệch chuẩn, xu hướng so với lần trước và ý nghĩa với can thiệp hiện tại.</p>
          </div>

          <div className="lab-summary-grid">
            <div className="metric-card"><span>Số phiếu đang có</span><strong>{highlights.totalReports}</strong></div>
            <div className="metric-card metric-card-warning"><span>Chỉ số cần chú ý</span><strong>{highlights.abnormalCount}</strong></div>
            <div className="metric-card"><span>Phiếu ổn định</span><strong>{highlights.stableReports}</strong></div>
          </div>

          <div className="lab-filter-bar" aria-label="Bộ lọc xét nghiệm">
            <button className={!showAttentionOnly ? 'active' : ''} type="button" onClick={() => setShowAttentionOnly(false)}>Tất cả chỉ số</button>
            <button className={showAttentionOnly ? 'active' : ''} type="button" onClick={() => setShowAttentionOnly(true)}>Chỉ xem chỉ số cần chú ý</button>
            <button type="button" onClick={() => showToast('Đã đánh dấu các phiếu là đã rà soát')}>Đánh dấu đã rà soát</button>
          </div>
        </article>

        <PriorityLabIndicatorsCard abnormalItems={highlights.abnormalItems} />

        <article className="card upload-panel">
          <div className="upload-panel-copy">
            <UploadCloud size={28} aria-hidden="true" />
            <div>
              <h2>Tải lên kết quả xét nghiệm mới</h2>
              <p>Giữ file xét nghiệm tại bệnh án để đối chiếu nhanh với tình trạng lâm sàng và kế hoạch can thiệp.</p>
            </div>
          </div>
          <button className="btn-primary upload-cta-btn" type="button" onClick={() => showToast('Đã mở luồng tải file xét nghiệm')}>
            <UploadCloud size={16} className="button-icon-inline" aria-hidden="true" />
            Chọn tệp xét nghiệm
          </button>
        </article>
      </section>

      <section className="lab-report-list">
        {labReportsMock.map((report) => (
          <LabPanelCard
            isExpanded={!!expandedReports[report.id]}
            key={report.id}
            onToggle={toggleReport}
            report={report}
            showAttentionOnly={showAttentionOnly}
            showToast={showToast}
          />
        ))}
      </section>
    </div>
  );
}
