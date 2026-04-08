import React, { useState } from 'react';
import { AlertCircle, ChevronDown, FileText, UploadCloud } from 'lucide-react';
import { labReportsMock } from '../../mockData';

function getHighlights(reports) {
  const totalReports = reports.length;
  const abnormalItems = reports.flatMap((report) => report.items.filter((item) => item.abnormal));
  const stableReports = reports.filter((report) => report.items.every((item) => !item.abnormal)).length;

  return {
    totalReports,
    abnormalCount: abnormalItems.length,
    stableReports,
    abnormalItems,
  };
}

function getReportStatus(report) {
  const abnormalCount = report.items.filter((item) => item.abnormal).length;

  if (abnormalCount === 0) {
    return {
      label: 'Ổn định',
      tone: 'success',
    };
  }

  return {
    label: `${abnormalCount} chỉ số cần chú ý`,
    tone: 'danger',
  };
}

function getPreviewItems(report) {
  const abnormalItems = report.items.filter((item) => item.abnormal);
  if (abnormalItems.length >= 2) {
    return abnormalItems.slice(0, 2);
  }

  return report.items.slice(0, Math.min(2, report.items.length));
}

export default function LabsTab({ showToast }) {
  const [expandedReports, setExpandedReports] = useState(() =>
    Object.fromEntries(labReportsMock.map((report, index) => [report.id, index === 0])),
  );
  const highlights = getHighlights(labReportsMock);

  const toggleReport = (reportId) => {
    setExpandedReports((current) => ({ ...current, [reportId]: !current[reportId] }));
  };

  return (
    <div className="tab-pane labs-tab">
      <section className="lab-summary-shell">
        <article className="card lab-summary-card">
          <div className="section-heading">
            <span className="eyebrow">Tổng quan xét nghiệm</span>
            <h2>Đọc nhanh các chỉ số ảnh hưởng đến kế hoạch dinh dưỡng</h2>
            <p>Tập trung ưu tiên vào các giá trị lệch chuẩn trước, sau đó đối chiếu với mục tiêu can thiệp hiện tại.</p>
          </div>

          <div className="lab-summary-grid">
            <div className="metric-card">
              <span>Số phiếu đang có</span>
              <strong>{highlights.totalReports}</strong>
            </div>
            <div className="metric-card">
              <span>Chỉ số cần chú ý</span>
              <strong>{highlights.abnormalCount}</strong>
            </div>
            <div className="metric-card">
              <span>Phiếu ổn định</span>
              <strong>{highlights.stableReports}</strong>
            </div>
          </div>

          {highlights.abnormalItems.length > 0 ? (
            <div className="lab-alert-strip">
              <AlertCircle size={18} aria-hidden="true" />
              <div>
                <strong>Cần ưu tiên rà soát:</strong>
                <span>{highlights.abnormalItems.map((item) => item.name).join(' • ')}</span>
              </div>
            </div>
          ) : null}
        </article>

        <article className="card upload-panel">
          <div className="upload-panel-copy">
            <UploadCloud size={28} aria-hidden="true" />
            <div>
              <h2>Tải lên kết quả xét nghiệm mới</h2>
              <p>Giữ file xét nghiệm ngay tại bệnh án để đối chiếu nhanh với tình trạng lâm sàng và kế hoạch can thiệp.</p>
            </div>
          </div>
          <button className="btn-primary" type="button" onClick={() => showToast('Đã mở luồng tải file xét nghiệm')}>
            Chọn tệp
          </button>
        </article>
      </section>

      <section className="lab-report-list">
        {labReportsMock.map((report) => {
          const reportStatus = getReportStatus(report);
          const isExpanded = !!expandedReports[report.id];
          const visibleItems = isExpanded ? report.items : getPreviewItems(report);

          return (
            <article key={report.id} className={`card lab-report-card lab-report-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
              <div className="lab-report-header">
                <div className="lab-report-title-block">
                  <div className="lab-report-icon">
                    <FileText size={18} aria-hidden="true" />
                  </div>
                  <div className="lab-report-title">
                    <div className="lab-report-title-row">
                      <h2>{report.reportType}</h2>
                      <span className={`badge badge-${reportStatus.tone}`}>{reportStatus.label}</span>
                      <p className="lab-report-date">{report.reportDate}</p>
                    </div>
                  </div>
                </div>

                <div className="lab-report-actions">
                  <button className="btn-secondary" type="button" onClick={() => showToast(`Đã mở file ${report.attachmentUrl}`)}>
                    Xem file gốc
                  </button>
                </div>
              </div>

              <div className={`lab-collapse-region ${isExpanded ? 'expanded' : 'collapsed'}`} id={`lab-panel-${report.id}`}>
                <div className="lab-collapse-inner">
                  <div className="lab-report-table-shell">
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
                        {visibleItems.map((item) => (
                          <tr key={item.name} className={item.abnormal ? 'lab-row-abnormal' : ''}>
                            <td>
                              <div className="lab-value-block">
                                <strong>{item.name}</strong>
                                {item.abnormal ? <span className="lab-inline-note">Cần đối chiếu với can thiệp hiện tại</span> : null}
                              </div>
                            </td>
                            <td className={item.abnormal ? 'text-danger font-bold' : ''}>
                              {item.value} {item.unit}
                            </td>
                            <td>{item.refRange}</td>
                            <td>
                              <span className={`badge ${item.abnormal ? 'badge-danger' : 'badge-success'}`}>
                                {item.abnormal ? <AlertCircle size={12} className="inline-icon" aria-hidden="true" /> : null}
                                {item.note}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lab-report-footer">
                <button
                  className={`lab-expand-link ${isExpanded ? 'expanded' : ''}`}
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`lab-panel-${report.id}`}
                  onClick={() => toggleReport(report.id)}
                >
                  <span>{isExpanded ? 'Thu gọn phiếu xét nghiệm' : 'Xem tất cả chỉ số'}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
