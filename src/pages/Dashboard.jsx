import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, AlertCircle, TrendingUp, ArrowRight, MessageSquare } from 'lucide-react';
import './Dashboard.css';

const stats = [
  {
    title: 'Bệnh nhân đang theo dõi',
    value: '124',
    icon: Users,
    color: 'blue',
    description: 'Mở danh sách bệnh nhân đang được quản lý.',
    to: '/patients',
  },
  {
    title: 'Lịch khám hôm nay',
    value: '8',
    icon: Calendar,
    color: 'success',
    description: 'Xem các ca khám và follow-up trong ngày.',
    to: '/appointments',
  },
  {
    title: 'Báo động đỏ cần xử lý',
    value: '3',
    icon: AlertCircle,
    color: 'danger',
    description: 'Đi tới nhóm bệnh nhân cần ưu tiên xử lý ngay.',
    to: '/patients',
  },
  {
    title: 'Tuân thủ thực đơn trên 80%',
    value: '68%',
    icon: TrendingUp,
    color: 'warning',
    description: 'Rà soát nhật ký khẩu phần và mức bám kế hoạch.',
    to: '/patients',
  },
];

const priorityPatients = [
  { id: 'BN001', name: 'Nguyễn Thị Hoa', issue: 'Không ghi bữa ăn 3 ngày liên tiếp', tag: 'Báo động đỏ' },
  { id: 'BN002', name: 'Trần Văn Nam', issue: 'Đường huyết tăng cao (120 mg/dL)', tag: 'Báo động đỏ' },
  { id: 'BN004', name: 'Lê Hoàng Anh', issue: 'Ngừng dùng thuốc bổ sung canxi', tag: 'Cần theo dõi' },
];

const todaySchedule = [
  {
    time: '08:00',
    patientId: 'BN005',
    patientName: 'Phạm Văn Đồng',
    visitType: 'Tái khám',
    note: 'Mục tiêu: Giảm cân, theo dõi mỡ máu',
    color: 'success',
  },
  {
    time: '09:00',
    patientId: 'BN006',
    patientName: 'Lê Thị Thu',
    visitType: 'Khám mới',
    note: 'Mục tiêu: Đái tháo đường thai kỳ',
    color: 'warning',
  },
  {
    time: '10:30',
    patientId: 'BN007',
    patientName: 'Nguyễn Văn Bình',
    visitType: 'Tái khám',
    note: 'Đang chờ xác nhận',
    color: 'blue',
    current: true,
  },
];

function getBadgeClass(tag) {
  return tag === 'Báo động đỏ' ? 'badge-danger' : 'badge-warning';
}

export default function Dashboard() {
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
            <Link className="card stat-card stat-card-link" key={stat.title} to={stat.to} aria-label={stat.description}>
              <div className={`stat-icon-wrapper bg-${stat.color}-light text-${stat.color}`}>
                <Icon size={24} aria-hidden="true" />
              </div>
              <div className="stat-info">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-description">{stat.description}</p>
                <span className="stat-cta">
                  Mở chi tiết
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="card priority-section">
          <div className="card-header">
            <h3 className="card-title">Bệnh nhân cần chú ý hôm nay</h3>
            <Link className="btn-secondary" to="/patients">Xem tất cả</Link>
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
                  <div className={`badge ${getBadgeClass(patient.tag)}`}>{patient.tag}</div>
                  <div className="priority-actions">
                    <Link className="btn-icon" to={`/messages?patientId=${patient.id}`} aria-label={`Nhắn tin với ${patient.name}`}>
                      <MessageSquare size={18} aria-hidden="true" />
                    </Link>
                    <Link className="btn-primary priority-cta" to={`/patients/${patient.id}`}>
                      Xem hồ sơ
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card schedule-section">
          <div className="card-header">
            <h3 className="card-title">Lịch khám hôm nay ({todaySchedule.length})</h3>
            <Link className="btn-secondary" to="/appointments">Mở lịch khám</Link>
          </div>
          <div className="card-body">
            <div className="schedule-timeline">
              {todaySchedule.map((item) => (
                <Link
                  key={`${item.time}-${item.patientId}`}
                  className={`schedule-item ${item.current ? 'current' : ''}`}
                  to={`/patients/${item.patientId}`}
                  aria-label={`Mở hồ sơ của ${item.patientName}`}
                >
                  <div className="schedule-time">{item.time}</div>
                  <div className={`schedule-info border-l-${item.color}`}>
                    <div className="schedule-info-top">
                      <h4>
                        {item.patientName} ({item.visitType})
                      </h4>
                    </div>
                    <p>{item.note}</p>
                    <span className="schedule-open-link">
                      Mở hồ sơ
                      <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
