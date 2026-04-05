import React from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { labReportsMock } from '../../mockData';

export default function LabsTab({ showToast }) {
  return (
    <div className="tab-pane">
      <div className="card mb-4" style={{borderStyle: 'dashed', backgroundColor: 'transparent'}}>
        <div className="card-body" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem'}}>
          <UploadCloud size={48} color="hsl(var(--text-muted))" style={{marginBottom: '1rem'}}/>
          <h3 className="font-bold mb-2">Tải lên kết quả xét nghiệm</h3>
          <p className="text-muted text-sm mb-4">Hỗ trợ PDF, JPG, PNG (Tối đa 10MB)</p>
          <button className="btn-primary" onClick={() => showToast('Mock: Giả lập mở cửa sổ chọn file')}>Chọn tệp</button>
        </div>
      </div>

      <div className="lab-reports-list">
        {labReportsMock.map(report => (
          <div className="card mb-4" key={report.id}>
            <div className="card-header flex-between" style={{backgroundColor: 'hsl(var(--background))'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                 <FileText size={20} className="text-main" />
                 <div>
                    <h3 className="card-title" style={{fontSize: '1rem'}}>{report.reportType} <span className="text-muted text-sm ml-2">({report.reportDate})</span></h3>
                    <a href="#" className="text-primary text-sm">Xem file gốc: {report.attachmentUrl}</a>
                 </div>
              </div>
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
                  {report.items.map((item, i) => (
                    <tr key={i} className={item.abnormal ? 'bg-danger-light' : ''}>
                      <td className="font-medium">{item.name}</td>
                      <td>
                        <span className={item.abnormal ? 'text-danger font-bold' : ''}>
                          {item.value} {item.unit}
                        </span>
                      </td>
                      <td className="text-muted">{item.refRange}</td>
                      <td>
                        {item.abnormal ? (
                          <span className="badge badge-danger"><AlertCircle size={12} style={{marginRight: '4px'}}/> Bất thường</span>
                        ) : (
                          <span className="badge badge-success">Bình thường</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
