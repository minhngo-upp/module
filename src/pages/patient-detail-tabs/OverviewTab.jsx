import React from 'react';
import { Utensils, Pill, Dumbbell, AlertTriangle, Activity } from 'lucide-react';
import { patientOverviewMock } from '../../mockData';

export default function OverviewTab({ showToast }) {
  const { mainDiagnosis, currentGoal, adherenceAlerts, latestMetrics, activePlans } = patientOverviewMock;

  return (
    <div className="tab-pane">
      <div className="overview-grid">
        {/* Khối A: Tình trạng & Mục tiêu */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Mục tiêu & Tình trạng</h3></div>
          <div className="card-body">
            <div className="info-group">
              <label>Chẩn đoán chính</label>
              <p className="font-bold text-main">{mainDiagnosis}</p>
            </div>
            <div className="info-group">
              <label>Mục tiêu hiện tại</label>
              <p>{currentGoal}</p>
            </div>
            <div className="info-group mb-0">
              <label>Cảnh báo tuân thủ (Tuần qua)</label>
              <ul className="alert-list">
                {adherenceAlerts.map((alert, i) => (
                  <li key={i} className={alert.level === 'high' ? 'text-danger' : 'text-warning'}>
                    <AlertTriangle size={14} style={{marginRight: '6px', verticalAlign: 'middle'}}/>
                    {alert.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Khối B: Chỉ số gần nhất */}
        <div className="card">
          <div className="card-header"><h3 className="card-title">Chỉ số gần nhất</h3></div>
          <div className="card-body">
            <div className="latest-vitals">
              {latestMetrics.map((metric, i) => (
                <div className="vital-item" key={i}>
                  <span className="vital-label">{metric.label}</span>
                  <span className={`vital-value ${metric.status === 'warning' ? 'text-danger' : ''}`}>
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Khối Thông tin Người bệnh tự điền (ABCDEF) */}
      <div className="card mt-4 mb-4">
        <div className="card-header"><h3 className="card-title">Thông tin Hồ sơ (Thu thập trước khám - ABCEF)</h3></div>
        <div className="p-4" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
          <div className="space-y-4">
            <div className="form-group">
                <label className="font-bold text-main block mb-1">A. Anthropometry (Nhân trắc)</label>
                <div className="p-3 bg-slate-50 border rounded text-sm text-muted">
                  Cân nặng 62.5kg, Chiều cao 160cm, BMI 24.5. Phù nề nhẹ ở chân.
                </div>
            </div>
            <div className="form-group">
                <label className="font-bold text-main block mb-1">B. Biochemistry (Sinh hóa)</label>
                <div className="p-3 bg-slate-50 border rounded text-sm text-muted">
                  Đường huyết đói 95 mg/dL. HbA1c 5.9%. Chưa có chỉ số mới xét nghiệm tháng này.
                </div>
            </div>
            <div className="form-group">
                <label className="font-bold text-main block mb-1">C. Clinical (Khám lâm sàng)</label>
                <div className="p-3 bg-slate-50 border rounded text-sm text-muted">
                  Da khô, móng tay dễ gãy nứt. Hay mệt mỏi vào buổi chiều.
                </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="form-group">
                <label className="font-bold text-main block mb-1">E. Environmental (Môi trường)</label>
                <div className="p-3 bg-slate-50 border rounded text-sm text-muted">
                  Ăn chủ yếu ở công ty, hay gọi đồ ngoài ăn trưa. Tối nấu ăn ở nhà cùng chồng.
                </div>
            </div>
            <div className="form-group">
                <label className="font-bold text-main block mb-1">F. Feeling (Tâm lý / Động lực)</label>
                <div className="p-3 bg-slate-50 border rounded text-sm text-muted">
                  Sợ tiểu đường nặng ảnh hưởng thai nhi nên rất muốn tuân thủ, nhưng thấy thực đơn trước khó ăn.
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Khối C: Kế hoạch lâm sàng hiện tại */}
      <div className="card mt-4 mb-4">
        <div className="card-header flex-between">
          <h3 className="card-title">Kế hoạch lâm sàng hiện tại</h3>
          <button className="btn-primary" onClick={() => showToast('Đang mở form tạo Visit Record...')}>
            <Activity size={16} style={{marginRight: '6px'}}/> Tạo Visit Record
          </button>
        </div>
        <div className="card-body">
          <div className="plan-summary">
            {activePlans.diet && (
              <div className="plan-item">
                <h4><Utensils size={16}/> Thực đơn</h4>
                <p>{activePlans.diet}</p>
                <span className="badge badge-success">Đang áp dụng</span>
              </div>
            )}
            {activePlans.supplement && (
              <div className="plan-item">
                <h4><Pill size={16}/> Thuốc / Bổ sung</h4>
                <p>{activePlans.supplement}</p>
                <span className="badge badge-success">Đang áp dụng</span>
              </div>
            )}
            {activePlans.exercise && (
              <div className="plan-item">
                <h4><Dumbbell size={16}/> Vận động</h4>
                <p>{activePlans.exercise}</p>
                <span className="badge badge-warning">Tuân thủ kém</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
