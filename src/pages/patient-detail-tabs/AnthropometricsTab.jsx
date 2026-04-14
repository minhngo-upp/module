import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { anthropometricRecordsMock } from '../../mockData';

function MetricTile({ label, value, tone = 'neutral' }) {
  return (
    <div className={`assessment-metric-tile tone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function AnthropometricsTab({ patient }) {
  const [metricType, setMetricType] = useState('weight');
  const { anthropometrics } = patient;

  return (
    <div className="anthropometric-unified-module">
      <div className="assessment-metric-strip" aria-label="Chỉ số nhân trắc chính">
        <MetricTile label="Chiều cao" value={anthropometrics.height} />
        <MetricTile label="Cân nặng hiện tại" value={anthropometrics.currentWeight} />
        <MetricTile label="BMI" value={anthropometrics.bmi} />
        <MetricTile label="Biến động gần đây" value={anthropometrics.weightChange} tone="warning" />
      </div>

      <div className="anthropometric-review-grid">
        <div className="anthropometric-chart-panel">
          <div className="assessment-panel-toolbar">
            <div>
              <h3>Xu hướng theo thời gian</h3>
              <p>-1.8 kg trong 6 tuần, cần tránh giảm thêm trong giai đoạn hiện tại.</p>
            </div>
            <label className="assessment-select-label">
              <span>Chỉ số</span>
              <select value={metricType} onChange={(event) => setMetricType(event.target.value)}>
                <option value="weight">Cân nặng</option>
                <option value="bmi">BMI</option>
              </select>
            </label>
          </div>

          <div className="anthropometric-chart-frame">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anthropometricRecordsMock} margin={{ top: 10, right: 12, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--text-muted))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--text-muted))' }} axisLine={false} tickLine={false} />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey={metricType}
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <aside className="anthropometric-insight-panel">
          <span className="eyebrow">Ý nghĩa lâm sàng</span>
          <h3>Xu hướng đi xuống cần can thiệp sớm</h3>
          <p>Cân nặng giảm đều từ mốc khám ban đầu. BMI còn trong vùng chấp nhận được, nhưng xu hướng giảm cần ưu tiên bảo vệ lượng ăn vào và khối cơ.</p>
          <div className="anthropometric-reference-list">
            <div>
              <span>Cân nặng thường lệ</span>
              <strong>{anthropometrics.usualWeight}</strong>
            </div>
            <div>
              <span>Khối cơ</span>
              <strong>{anthropometrics.muscleStatus}</strong>
            </div>
            <div>
              <span>Phù</span>
              <strong>{anthropometrics.edema}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
