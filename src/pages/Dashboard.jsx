import React from 'react';
import { Users, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: 'Bệnh nhân đang theo dõi', value: '124', icon: Users, color: 'blue' },
    { title: 'Lịch khám hôm nay', value: '8', icon: Calendar, color: 'success' },
    { title: 'Báo động đỏ cần xử lý', value: '3', icon: AlertCircle, color: 'danger' },
    { title: 'Tuân thủ thực đơn trên 80%', value: '68%', icon: TrendingUp, color: 'warning' },
  ];

  const priorityPatients = [
    { id: 'BN001', name: 'Nguyễn Thị Hoa', issue: 'Không ghi bữa ăn 3 ngày liên tiếp', tag: 'Báo động đỏ' },
    { id: 'BN002', name: 'Trần Văn Nam', issue: 'Đường huyết tăng cao (120 mg/dL)', tag: 'Báo động đỏ' },
    { id: 'BN003', name: 'Lê Hoàng Anh', issue: 'Ngừng dùng thuốc bổ sung calcium', tag: 'Cần theo dõi' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Tổng quan hệ thống</h1>
        <p className="page-subtitle">Chào mừng Dr. Nguyễn, hôm nay bạn có 8 lịch hẹn cần theo dõi.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="card stat-card" key={stat.title}>
              <div className={`stat-icon-wrapper bg-${stat.color}-light text-${stat.color}`}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="card priority-section">
          <div className="card-header">
            <h3 className="card-title">Bệnh nhân cần chú ý hôm nay</h3>
            <button className="btn-secondary">Xem tất cả</button>
          </div>
          <div className="card-body">
            <ul className="priority-list">
              {priorityPatients.map((patient) => (
                <li className="priority-item" key={patient.id}>
                  <div className="priority-avatar">{patient.name.charAt(0)}</div>
                  <div className="priority-details">
                    <h4 className="priority-name">
                      {patient.name} <span className="text-muted">({patient.id})</span>
                    </h4>
                    <p className="priority-issue">{patient.issue}</p>
                  </div>
                  <div className={`badge ${patient.tag === 'Báo động đỏ' ? 'badge-danger' : 'badge-warning'}`}>
                    {patient.tag}
                  </div>
                  <button className="btn-primary priority-cta">Xem hồ sơ</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card schedule-section">
          <div className="card-header">
            <h3 className="card-title">Lịch khám hôm nay (8)</h3>
          </div>
          <div className="card-body">
            <div className="schedule-timeline">
              <div className="schedule-item">
                <div className="schedule-time">08:00</div>
                <div className="schedule-info border-l-success">
                  <h4>Phạm Văn Đồng (Tái khám)</h4>
                  <p>Mục tiêu: Giảm cân, theo dõi mỡ máu</p>
                </div>
              </div>
              <div className="schedule-item">
                <div className="schedule-time">09:00</div>
                <div className="schedule-info border-l-warning">
                  <h4>Lê Thị Thu (Khám mới)</h4>
                  <p>Mục tiêu: Đái tháo đường thai kỳ</p>
                </div>
              </div>
              <div className="schedule-item current">
                <div className="schedule-time">10:30</div>
                <div className="schedule-info border-l-blue">
                  <h4>Nguyễn Văn Bình (Tái khám)</h4>
                  <p>Đang chờ xác nhận</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
