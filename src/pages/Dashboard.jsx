import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MessageSquare,
  PlusCircle,
  Send,
  TrendingUp,
  UserPlus,
  Users,
  Utensils,
} from 'lucide-react';
import './Dashboard.css';

const nextActions = [
  {
    category: 'Khẩn cấp',
    title: '3 bệnh nhân cần xử lý',
    description: 'Ưu tiên nhắc cập nhật nhật ký khẩu phần và rà soát chỉ số bất thường.',
    meta: '2 ca bỏ bữa · 1 ca xét nghiệm lệch',
    tone: 'danger',
    to: '/patients',
  },
  {
    category: 'Sắp diễn ra',
    title: '10:30 - Nguyễn Văn Bình',
    description: 'Tái khám, đang chờ xác nhận trước giờ tư vấn.',
    meta: 'Còn 45 phút',
    tone: 'warning',
    to: '/appointments',
  },
  {
    category: 'Chờ can thiệp',
    title: '2 thực đơn cần hoàn thiện',
    description: 'Thiếu bữa phụ hoặc chưa khớp mục tiêu kcal.',
    meta: 'Cần duyệt trong hôm nay',
    tone: 'mint',
    to: '/patients/BN001',
  },
];

const kpiStats = [
  {
    label: 'Bệnh nhân theo dõi',
    value: '124',
    description: 'Đang quản lý trong hệ thống',
    trend: '+6 hồ sơ trong tuần',
    icon: Users,
    tone: 'neutral',
    to: '/patients',
  },
  {
    label: 'Lịch hôm nay',
    value: '8',
    description: 'Bao gồm khám mới và tái khám',
    trend: '3 ca trong 2 giờ tới',
    icon: Calendar,
    tone: 'green',
    to: '/appointments',
  },
  {
    label: 'Cần xử lý',
    value: '3',
    description: '2 ca bỏ bữa, 1 ca chỉ số bất thường',
    trend: 'Ưu tiên xử lý trước 11:00',
    icon: AlertCircle,
    tone: 'danger',
    emphasis: true,
    to: '/patients',
  },
  {
    label: 'Tuân thủ',
    value: '68%',
    description: 'Dưới mục tiêu 80%',
    trend: 'Cần cải thiện',
    icon: TrendingUp,
    tone: 'warning',
    to: '/patients',
  },
];

const quickActions = [
  { label: 'Thêm bệnh nhân mới', icon: UserPlus, to: '/patients' },
  { label: 'Tạo lịch khám', icon: Calendar, to: '/appointments' },
  { label: 'Duyệt thực đơn', icon: Utensils, to: '/patients/BN001' },
  { label: 'Gửi nhắc nhật ký', icon: Send, to: '/messages' },
  { label: 'Bệnh nhân bỏ theo dõi', icon: ClipboardList, to: '/patients' },
];

const priorityPatients = [
  {
    id: 'BN001',
    name: 'Nguyễn Thị Hoa',
    issue: 'Không ghi bữa ăn 3 ngày liên tiếp',
    priority: 'Báo động đỏ',
    priorityTone: 'danger',
    adherence: '45%',
    stage: 'Monitoring',
    updatedAt: '2 giờ trước',
  },
  {
    id: 'BN002',
    name: 'Trần Văn Nam',
    issue: 'Đường huyết tăng cao (120 mg/dL)',
    priority: 'Báo động đỏ',
    priorityTone: 'danger',
    adherence: '55%',
    stage: 'Intervention',
    updatedAt: '1 giờ trước',
  },
  {
    id: 'BN004',
    name: 'Lê Hoàng Anh',
    issue: 'Ngừng dùng thuốc bổ sung canxi',
    priority: 'Cần theo dõi',
    priorityTone: 'warning',
    adherence: '85%',
    stage: 'Tái khám',
    updatedAt: 'Hôm qua',
  },
  {
    id: 'BN008',
    name: 'Mai Thu Trang',
    issue: 'Thiếu bữa phụ trong kế hoạch 7 ngày',
    priority: 'Cần theo dõi',
    priorityTone: 'warning',
    adherence: '72%',
    stage: 'Diagnosis',
    updatedAt: '3 giờ trước',
  },
];

const todaySchedule = [
  {
    time: '08:00',
    patientId: 'BN005',
    patientName: 'Phạm Văn Đông',
    visitType: 'Tái khám',
    status: 'Đã xác nhận',
    statusTone: 'success',
    focus: 'Giảm cân, theo dõi mỡ máu',
  },
  {
    time: '09:00',
    patientId: 'BN006',
    patientName: 'Lê Thị Thu',
    visitType: 'Khám mới',
    status: 'Chờ xác nhận',
    statusTone: 'warning',
    focus: 'Đái tháo đường thai kỳ',
  },
  {
    time: '10:30',
    patientId: 'BN007',
    patientName: 'Nguyễn Văn Bình',
    visitType: 'Tái khám',
    status: 'Chờ xác nhận',
    statusTone: 'warning',
    focus: 'Đang chờ xác nhận trước tư vấn',
    upcoming: true,
  },
  {
    time: '13:30',
    patientId: 'BN009',
    patientName: 'Đỗ Minh Quân',
    visitType: 'Follow-up',
    status: 'Đã check-in',
    statusTone: 'success',
    focus: 'Cập nhật thực đơn tuần 2',
  },
];

function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

function StageBadge({ children }) {
  return <span className="stage-badge">{children}</span>;
}

function MetricMetaRow({ items }) {
  return (
    <div className="metric-meta-row">
      {items.map((item) => (
        <span key={item.label}>
          <strong>{item.label}:</strong> {item.value}
        </span>
      ))}
    </div>
  );
}

function DashboardWelcomeCard() {
  return (
    <section className="dashboard-welcome-card">
      <span className="dashboard-eyebrow">The Meal Clinic</span>
      <h1>Điều phối dinh dưỡng hôm nay</h1>
      <p>Hôm nay có 3 ca cần xử lý, 8 lịch khám và 2 thực đơn cần hoàn thiện.</p>

      <div className="dashboard-welcome-actions">
        <Link className="btn-primary" to="/patients">
          Xem ca cần xử lý
          <ArrowRight size={16} className="button-icon-inline" aria-hidden="true" />
        </Link>
        <Link className="btn-secondary" to="/appointments">
          Xem lịch hôm nay
        </Link>
        <Link className="btn-secondary" to="/patients/BN001">
          Tạo thực đơn
        </Link>
      </div>
    </section>
  );
}

function NextActionsCard() {
  return (
    <section className="next-actions-card" aria-label="Việc cần làm tiếp theo">
      <div className="section-header compact">
        <div>
          <span className="dashboard-eyebrow">Hàng đợi xử lý</span>
          <h2>Việc cần làm tiếp theo</h2>
        </div>
        <Clock3 size={20} aria-hidden="true" />
      </div>

      <div className="next-action-list">
        {nextActions.map((action) => (
          <Link className={`next-action-item next-action-${action.tone}`} to={action.to} key={action.title}>
            <span className="action-strip" aria-hidden="true" />
            <div className="next-action-copy">
              <span className="next-action-category">{action.category}</span>
              <strong>{action.title}</strong>
              <p>{action.description}</p>
              <small>{action.meta}</small>
            </div>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function KPIStatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <Link className={`kpi-card kpi-${stat.tone} ${stat.emphasis ? 'emphasis' : ''}`} to={stat.to}>
      <div className="kpi-icon">
        <Icon size={20} aria-hidden="true" />
      </div>
      <div className="kpi-copy">
        <span>{stat.label}</span>
        <strong>{stat.value}</strong>
        <p>{stat.description}</p>
        <small>{stat.trend}</small>
      </div>
    </Link>
  );
}

function QuickActionsRow() {
  return (
    <section className="quick-actions-row" aria-label="Thao tác nhanh">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link className="quick-action" to={action.to} key={action.label}>
            <Icon size={16} aria-hidden="true" />
            <span>{action.label}</span>
          </Link>
        );
      })}
    </section>
  );
}

function PriorityPatientItem({ patient }) {
  return (
    <li className="priority-patient-item">
      <div className="priority-patient-left">
        <div className="priority-avatar">{patient.name.charAt(0)}</div>
        <div>
          <h3>{patient.name}</h3>
          <span>{patient.id}</span>
        </div>
      </div>

      <div className="priority-patient-center">
        <p className={patient.priorityTone === 'danger' ? 'alert-text' : ''}>{patient.issue}</p>
        <MetricMetaRow
          items={[
            { label: 'Tuân thủ', value: patient.adherence },
            { label: 'Giai đoạn', value: patient.stage },
            { label: 'Cập nhật', value: patient.updatedAt },
          ]}
        />
      </div>

      <div className="priority-patient-right">
        <div className="priority-badges">
          <StatusBadge tone={patient.priorityTone}>{patient.priority}</StatusBadge>
          <StageBadge>{patient.stage}</StageBadge>
        </div>
        <div className="priority-actions">
          <Link className="btn-icon" to={`/messages?patientId=${patient.id}`} aria-label={`Nhắn tin với ${patient.name}`}>
            <MessageSquare size={17} aria-hidden="true" />
          </Link>
          <Link className="btn-primary priority-cta" to={`/patients/${patient.id}`}>
            Xem hồ sơ
          </Link>
        </div>
      </div>
    </li>
  );
}

function PriorityPatientList() {
  return (
    <section className="card dashboard-panel priority-section">
      <div className="section-header">
        <div>
          <h2>Bệnh nhân ưu tiên hôm nay</h2>
          <p>Các hồ sơ cần bác sĩ chú ý trước.</p>
        </div>
        <Link className="btn-secondary" to="/patients">Xem tất cả</Link>
      </div>

      <ul className="priority-patient-list">
        {priorityPatients.map((patient) => (
          <PriorityPatientItem patient={patient} key={patient.id} />
        ))}
      </ul>
    </section>
  );
}

function TodayScheduleItem({ item }) {
  return (
    <Link className={`today-schedule-item ${item.upcoming ? 'upcoming' : ''}`} to={`/patients/${item.patientId}`}>
      <div className="schedule-time-block">
        <strong>{item.time}</strong>
        {item.upcoming ? <span>Sắp tới</span> : null}
      </div>

      <div className="schedule-main">
        <h3>{item.patientName}</h3>
        <p>{item.focus}</p>
        <span className="open-profile-link">Mở hồ sơ</span>
      </div>

      <div className="schedule-status">
        <span className="visit-type">{item.visitType}</span>
        <StatusBadge tone={item.statusTone}>{item.status}</StatusBadge>
      </div>
    </Link>
  );
}

function TodayScheduleCard() {
  return (
    <section className="card dashboard-panel schedule-section">
      <div className="section-header">
        <div>
          <h2>Lịch hôm nay</h2>
          <p>Các ca khám và theo dõi trong ngày.</p>
        </div>
        <Link className="btn-secondary" to="/appointments">Mở lịch</Link>
      </div>

      <div className="today-schedule-list">
        {todaySchedule.map((item) => (
          <TodayScheduleItem item={item} key={`${item.time}-${item.patientId}`} />
        ))}
      </div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-top-zone">
        <DashboardWelcomeCard />
        <NextActionsCard />
      </div>

      <div className="kpi-grid">
        {kpiStats.map((stat) => (
          <KPIStatCard stat={stat} key={stat.label} />
        ))}
      </div>

      <QuickActionsRow />

      <div className="dashboard-content-zone">
        <PriorityPatientList />
        <TodayScheduleCard />
      </div>
    </div>
  );
}
