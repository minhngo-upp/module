import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { anthropometricRecordsMock } from '../../mockData';

export default function AnthropometricsTab({ patient, showToast }) {
  const [metricType, setMetricType] = useState('weight');
  const { anthropometrics } = patient;

  return (
    <div className="module-container">
      {/* 4 metrics row */}
      <section className="compact-metrics-grid mb-6">
        <div className="compact-metric-card">
          <span className="metric-label">Chiều cao</span>
          <strong className="metric-actual">{anthropometrics.height}</strong>
        </div>
        <div className="compact-metric-card">
          <span className="metric-label">Cân nặng hiện tại</span>
          <strong className="metric-actual">{anthropometrics.currentWeight}</strong>
        </div>
        <div className="compact-metric-card">
          <span className="metric-label">BMI</span>
          <strong className="metric-actual">{anthropometrics.bmi}</strong>
        </div>
        <div className="compact-metric-card">
          <span className="metric-label">Biến động gần đây</span>
          <strong className="metric-actual text-danger">{anthropometrics.weightChange}</strong>
        </div>
      </section>

      {/* Chart and Insight panel using 8:4 Grid */}
      <div className="chart-insight-layout clinical-dashboard-layout">
        <div className="minimal-card chart-area">
          <div className="chart-toolbar flex justify-between items-center mb-4">
             <select className="filter-select settings-select" value={metricType} onChange={(e) => setMetricType(e.target.value)}>
                <option value="weight">Xu hướng Cân nặng</option>
                <option value="bmi">Xu hướng BMI</option>
             </select>
          </div>
          <div className="chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anthropometricRecordsMock} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                 <XAxis dataKey="date" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                 <YAxis tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                 <RechartsTooltip />
                 <Line type="monotone" dataKey={metricType} stroke="hsl(var(--primary))" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <aside className="minimal-card insight-area">
          <h2 className="minimal-card-title">Ý nghĩa lâm sàng</h2>
          <div className="insight-text-block text-sm">
            <p className="mb-2">Cân nặng giảm đều kể từ mốc khám ban đầu.</p>
            <p className="mb-2">BMI vẫn trong ngưỡng chấp nhận được, nhưng xu hướng đi xuống cần can thiệp sớm.</p>
            <p className="font-bold text-primary mt-4">Ưu tiên bảo vệ khối lượng ăn và duy trì khối cơ.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
