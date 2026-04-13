import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { anthropometricRecordsMock } from '../../mockData';

export default function AnthropometricsTab({ patient, showToast }) {
  const [metricType, setMetricType] = useState('weight');
  const { anthropometrics } = patient;
  const latestRecord = anthropometricRecordsMock[anthropometricRecordsMock.length - 1];
  const firstRecord = anthropometricRecordsMock[0];
  const latestDelta = latestRecord.weight - anthropometricRecordsMock[anthropometricRecordsMock.length - 2].weight;

  return (
    <div className="tab-pane anthropometrics-tab">
      <section className="metric-grid">
        <div className="metric-card">
          <span>Chiều cao</span>
          <strong>{anthropometrics.height}</strong>
        </div>
        <div className="metric-card">
          <span>Cân nặng hiện tại</span>
          <strong>{anthropometrics.currentWeight}</strong>
        </div>
        <div className="metric-card">
          <span>BMI</span>
          <strong>{anthropometrics.bmi}</strong>
        </div>
        <div className="metric-card">
          <span>Biến động gần đây</span>
          <strong>{anthropometrics.weightChange}</strong>
        </div>
      </section>

      <article className="card anthropometric-trend-summary">
        <div>
          <span className="eyebrow">Xu hướng nhân trắc</span>
          <h2>Giảm {Math.abs(latestRecord.weight - firstRecord.weight).toFixed(1)} kg từ mốc khám ban đầu</h2>
          <p>BMI vẫn trong vùng chấp nhận được, nhưng xu hướng giảm liên tục cần can thiệp sớm để bảo vệ khối cơ và tránh giảm tiếp.</p>
        </div>
        <div className="trend-delta-badge">
          <span>So với lần trước</span>
          <strong>{latestDelta.toFixed(1)} kg</strong>
          <small>Đánh giá gần nhất</small>
        </div>
      </article>

      <section className="chart-layout">
        <article className="card chart-panel">
          <div className="chart-toolbar">
            <div className="section-heading">
              <span className="eyebrow">Nhân trắc</span>
              <h2>Xu hướng thay đổi theo từng mốc đánh giá</h2>
            </div>

            <div className="chart-toolbar-actions">
              <select
                className="filter-select"
                value={metricType}
                onChange={(event) => setMetricType(event.target.value)}
                aria-label="Chọn loại chỉ số để xem biểu đồ"
              >
                <option value="weight">Cân nặng</option>
                <option value="bmi">BMI</option>
              </select>
              <button className="btn-secondary" type="button" onClick={() => showToast('Đã mở luồng nhập chỉ số nhân trắc')}>
                Thêm mốc đo
              </button>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anthropometricRecordsMock} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey={metricType}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="card chart-side-panel">
          <div className="section-heading">
            <span className="eyebrow">Đọc nhanh</span>
            <h2>Ý nghĩa lâm sàng cần chú ý</h2>
          </div>

          <ul className="detail-list">
            <li>Cân nặng giảm dần, cần bảo vệ khối cơ và tránh giảm thêm trong đợt điều trị này.</li>
            <li>BMI vẫn trong vùng chấp nhận được nhưng xu hướng đi xuống cần được can thiệp sớm.</li>
            <li>Ưu tiên tăng đạm phân bố đều trong ngày thay vì dồn vào một bữa.</li>
          </ul>

          <div className="mini-stat-stack">
            <div>
              <span>Khối cơ</span>
              <strong>{anthropometrics.muscleStatus}</strong>
            </div>
            <div>
              <span>Phù</span>
              <strong>{anthropometrics.edema}</strong>
            </div>
            <div>
              <span>Cân nặng thường lệ</span>
              <strong>{anthropometrics.usualWeight}</strong>
            </div>
          </div>
        </aside>
      </section>

      <article className="card table-panel">
        <div className="section-heading">
          <span className="eyebrow">Lịch sử đo</span>
          <h2>Danh sách các mốc nhân trắc gần nhất</h2>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ngày đo</th>
                <th>Cân nặng</th>
                <th>BMI</th>
                <th>So với lần trước</th>
                <th>Nguồn dữ liệu</th>
              </tr>
            </thead>
            <tbody>
              {anthropometricRecordsMock
                .slice()
                .reverse()
                .map((record) => {
                  const previousRecord = anthropometricRecordsMock[anthropometricRecordsMock.findIndex((item) => item.id === record.id) - 1];
                  const delta = previousRecord ? record.weight - previousRecord.weight : 0;
                  return (
                  <tr key={record.id}>
                    <td className="font-medium">{record.date}</td>
                    <td>{record.weight} kg</td>
                    <td>{record.bmi}</td>
                    <td className={delta < 0 ? 'text-danger font-bold' : ''}>{previousRecord ? `${delta.toFixed(1)} kg` : 'Mốc đầu'}</td>
                    <td>{record.source}</td>
                  </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
