import React from 'react';
import { AlertCircle, FileText, UploadCloud } from 'lucide-react';
import { labReportsMock } from '../../mockData';

function getHighlights(reports) {
  return reports.map((report) => {
    const abnormalCount = report.items.filter((item) => item.abnormal).length;

    return {
      id: report.id,
      title: report.group,
      summary: abnormalCount > 0 ? `${abnormalCount} chỉ số cần chú ý` : 'Ổn định',
    };
  });
}

export default function LabsTab({ showToast }) {
  const highlights = getHighlights(labReportsMock);

  return (
    <div className="tab-pane labs-tab">
      <section className="lab-highlight-grid">
        {highlights.map((highlight) => (
          <article key={highlight.id} className="metric-card">
            <span>{highlight.title}</span>
            <strong>{highlight.summary}</strong>
          </article>
        ))}
      </section>

      <article className="card upload-panel">
        <div className="upload-panel-copy">
          <UploadCloud size={28} aria-hidden="true" />
          <div>
            <h2>Tải lên kết quả xét nghiệm mới</h2>
            <p>Giữ file xét nghiệm ngay tại bệnh án để đối chiếu với kế hoạch can thiệp.</p>
          </div>
        </div>
        <button className="btn-primary" type="button" onClick={() => showToast('Đã mở luồng tải file xét nghiệm')}>
          Chọn tệp
        </button>
      </article>

      <section className="lab-report-list">
        {labReportsMock.map((report) => (
          <article key={report.id} className="card lab-report-card">
            <div className="lab-report-header">
              <div className="lab-report-title">
                <FileText size={18} aria-hidden="true" />
                <div>
                  <h2>{report.reportType}</h2>
                  <p>{report.reportDate}</p>
                </div>
              </div>
              <button className="btn-secondary" type="button" onClick={() => showToast(`Đã mở file ${report.attachmentUrl}`)}>
                Xem file gốc
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Chỉ số</th>
                    <th>Kết quả</th>
                    <th>Khoảng tham chiếu</th>
                    <th>Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {report.items.map((item) => (
                    <tr key={item.name}>
                      <td className="font-medium">{item.name}</td>
                      <td className={item.abnormal ? 'text-danger font-bold' : ''}>
                        {item.value} {item.unit}
                      </td>
                      <td>{item.refRange}</td>
                      <td>
                        {item.abnormal ? (
                          <span className="badge badge-danger">
                            <AlertCircle size={12} className="inline-icon" aria-hidden="true" />
                            {item.note}
                          </span>
                        ) : (
                          <span className="badge badge-success">{item.note}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
