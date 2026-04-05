import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { anthropometricRecordsMock } from '../../mockData';

export default function AnthropometricsTab({ showToast }) {
  const [metricType, setMetricType] = useState('weight'); // 'weight' or 'bmi'

  return (
    <div className="tab-pane">
      <div className="card mb-4">
        <div className="card-header flex-between">
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <h3 className="card-title">Biểu đồ Xu hướng</h3>
            <select 
              className="filter-select" 
              value={metricType} 
              onChange={(e) => setMetricType(e.target.value)}
              style={{padding: '0.25rem 0.5rem', minWidth: '150px'}}
            >
              <option value="weight">Cân nặng (kg)</option>
              <option value="bmi">BMI</option>
            </select>
          </div>
          <button className="btn-secondary" onClick={() => showToast('Chức năng Nhập tay đang trống')}>Thêm chỉ số</button>
        </div>
        <div className="card-body">
          <div className="chart-container" style={{height: 300}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anthropometricRecordsMock} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <RechartsTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey={metricType} 
                  name={metricType === 'weight' ? 'Cân nặng (kg)' : 'Chỉ số BMI'}
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  dot={{r: 5}} 
                  activeDot={{r: 8}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
         <div className="card-header">
           <h3 className="card-title">Lịch sử Đo lường</h3>
         </div>
         <div className="table-responsive">
           <table className="data-table">
              <thead>
                <tr>
                  <th>Ngày đo</th>
                  <th>Cân nặng (kg)</th>
                  <th>BMI</th>
                  <th>Nguồn dữ liệu</th>
                </tr>
              </thead>
              <tbody>
                {anthropometricRecordsMock.slice().reverse().map(record => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.date}</td>
                    <td>{record.weight}</td>
                    <td>{record.bmi}</td>
                    <td><span className="badge" style={{border: '1px solid currentColor', background:'transparent', color: 'hsl(var(--text-muted))'}}>{record.source}</span></td>
                  </tr>
                ))}
              </tbody>
           </table>
         </div>
      </div>
    </div>
  );
}
