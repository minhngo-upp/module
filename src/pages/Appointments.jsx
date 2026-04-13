import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Search,
  Settings,
  X,
  XCircle,
} from 'lucide-react';
import './Appointments.css';

const patients = [
  { id: 'BN001', name: 'Trần Văn Nam', phone: '0901 223 445', status: 'Đang theo dõi' },
  { id: 'BN002', name: 'Lê Hoàng Anh', phone: '0912 556 778', status: 'Khám mới' },
  { id: 'BN003', name: 'Nguyễn Văn Bình', phone: '0934 778 889', status: 'Tái khám' },
  { id: 'BN004', name: 'Lê Thị Thu', phone: '0988 456 123', status: 'Đang theo dõi' },
  { id: 'BN005', name: 'Phạm Văn Đông', phone: '0977 612 345', status: 'Tái khám' },
];

const providers = ['Dr. Nguyễn Văn A', 'BS. Trần Minh Châu', 'CNDD. Lê Thu Hà'];
const visitGoals = ['Theo dõi mỡ máu', 'Tư vấn dinh dưỡng thể thao', 'Theo dõi đường huyết', 'Đái tháo đường thai kỳ', 'Cập nhật thực đơn', 'Follow-up giảm cân', 'Khác'];
const appointmentTypes = ['Khám mới', 'Tái khám', 'Follow-up'];
const visitMethods = ['Tại phòng khám', 'Online', 'Gọi điện / tư vấn nhanh'];
const filters = ['Tất cả', 'Khám mới', 'Tái khám', 'Follow-up', 'Chờ xác nhận', 'Đã xác nhận'];

const scheduleDays = [
  { key: 'mon', label: 'Thứ 2', date: '02/12', isoDate: '2024-12-02' },
  { key: 'tue', label: 'Thứ 3', date: '03/12', isoDate: '2024-12-03', isToday: true },
  { key: 'wed', label: 'Thứ 4', date: '04/12', isoDate: '2024-12-04' },
  { key: 'thu', label: 'Thứ 5', date: '05/12', isoDate: '2024-12-05' },
  { key: 'fri', label: 'Thứ 6', date: '06/12', isoDate: '2024-12-06' },
  { key: 'sat', label: 'Thứ 7', date: '07/12', isoDate: '2024-12-07' },
  { key: 'sun', label: 'CN', date: '08/12', isoDate: '2024-12-08', unavailable: true },
];

const timeSlots = [
  { time: '08:00', label: '08:00' },
  { time: '09:00', label: '09:00' },
  { time: '10:00', label: '10:00' },
  { time: '11:00', label: '11:00' },
  { time: '12:00', label: '12:00', unavailable: true, reason: 'Nghỉ trưa' },
  { time: '13:00', label: '13:00' },
  { time: '14:00', label: '14:00' },
  { time: '15:00', label: '15:00' },
  { time: '16:00', label: '16:00' },
];

const initialAppointments = [
  { id: 'apt-1', patient: 'Phạm Văn Đông', patientId: 'BN005', type: 'Tái khám', status: 'Đã xác nhận', statusTone: 'success', dayKey: 'mon', date: '2024-12-02', startTime: '08:00', endTime: '08:30', note: 'Giảm cân, theo dõi mỡ máu', provider: 'Dr. Nguyễn Văn A' },
  { id: 'apt-2', patient: 'Lê Thị Thu', patientId: 'BN004', type: 'Khám mới', status: 'Chờ check-in', statusTone: 'info', dayKey: 'tue', date: '2024-12-03', startTime: '09:00', endTime: '09:30', note: 'Đái tháo đường thai kỳ', provider: 'BS. Trần Minh Châu', upcoming: true },
  { id: 'apt-3', patient: 'Nguyễn Văn Bình', patientId: 'BN003', type: 'Tái khám', status: 'Đã hoàn thành', statusTone: 'success', dayKey: 'tue', date: '2024-12-03', startTime: '10:00', endTime: '10:30', note: 'Theo dõi đường huyết', provider: 'Dr. Nguyễn Văn A' },
  { id: 'apt-4', patient: 'Mai Thu Trang', patientId: 'BN008', type: 'Follow-up', status: 'Đã xác nhận', statusTone: 'success', dayKey: 'thu', date: '2024-12-05', startTime: '15:00', endTime: '15:30', note: 'Cập nhật thực đơn', provider: 'CNDD. Lê Thu Hà' },
  { id: 'apt-p1', patient: 'Trần Văn Nam', patientId: 'BN001', type: 'Tái khám', status: 'Chờ xác nhận', statusTone: 'warning', dayKey: 'fri', date: '2024-12-06', startTime: '14:00', endTime: '14:30', note: 'Theo dõi mỡ máu', provider: 'Dr. Nguyễn Văn A', priority: 'Hôm nay' },
  { id: 'apt-p2', patient: 'Lê Hoàng Anh', patientId: 'BN002', type: 'Khám mới', status: 'Chờ xác nhận', statusTone: 'warning', dayKey: 'sat', date: '2024-12-07', startTime: '09:00', endTime: '09:45', note: 'Dinh dưỡng thể thao', provider: 'BS. Trần Minh Châu', priority: 'Ngày mai' },
];

const initialFormState = {
  patientId: '',
  patientSearch: '',
  type: 'Tái khám',
  date: '2024-12-03',
  startTime: '09:30',
  endTime: '10:00',
  provider: 'Dr. Nguyễn Văn A',
  method: 'Tại phòng khám',
  goal: 'Theo dõi mỡ máu',
  status: 'Chờ xác nhận',
  note: '',
  reminderOneDay: true,
  reminderTwoHours: true,
};

function getStatusTone(status) {
  if (status === 'Chờ xác nhận') return 'warning';
  if (status === 'Đã xác nhận' || status === 'Đã hoàn thành') return 'success';
  if (status === 'Chờ check-in') return 'info';
  if (status === 'Đã hủy' || status === 'Trễ hẹn') return 'danger';
  return 'neutral';
}

function addMinutes(time, minutes) {
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function timeToMinutes(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

function getDayByDate(date) {
  return scheduleDays.find((day) => day.isoDate === date);
}

function getDayLabel(date) {
  const day = getDayByDate(date);
  return day ? `${day.label}, ${day.date}` : date;
}

function getSuggestedSlots(date, appointments) {
  const day = getDayByDate(date);
  if (!day || day.unavailable) return [];
  return timeSlots
    .filter((slot) => !slot.unavailable)
    .filter((slot) => !appointments.some((appointment) => appointment.date === date && appointment.startTime === slot.time))
    .slice(0, 3)
    .map((slot) => `${slot.time}-${addMinutes(slot.time, 30)}`);
}

function buildFormFromSlot(day, slot) {
  return { ...initialFormState, date: day.isoDate, startTime: slot.time, endTime: addMinutes(slot.time, 30) };
}

function AppointmentStatusBadge({ children, tone = 'neutral' }) {
  return <span className={`appointment-status status-${tone}`}>{children}</span>;
}

function AppointmentTypeChip({ children }) {
  return <span className="appointment-type-chip">{children}</span>;
}

function SuccessToast({ message }) {
  if (!message) return null;
  return (
    <div className="appointment-toast" role="status" aria-live="polite">
      <CheckCircle2 size={18} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

function AppointmentManagementHeader({ activeTab, setActiveTab, onCreate }) {
  return (
    <div className="appointments-header">
      <div>
        <h1 className="page-title">Quản lý lịch khám</h1>
        <p className="page-subtitle">Tuần này có 5 lịch khám, 2 lịch chờ xác nhận và 3 khung giờ còn trống.</p>
      </div>
      <div className="appointments-header-actions">
        <button className={`btn-secondary ${activeTab === 'calendar' ? 'active-outline' : ''}`} type="button" onClick={() => setActiveTab('calendar')}>
          <CalendarIcon size={18} className="button-icon-inline" aria-hidden="true" />
          Lịch tuần
        </button>
        <button className={`btn-secondary ${activeTab === 'setup' ? 'active-outline' : ''}`} type="button" onClick={() => setActiveTab('setup')}>
          <Settings size={18} className="button-icon-inline" aria-hidden="true" />
          Thiết lập ca khám
        </button>
        <button className="btn-primary" type="button" onClick={onCreate}>
          <Plus size={18} className="button-icon-inline" aria-hidden="true" />
          Tạo lịch hẹn mới
        </button>
      </div>
    </div>
  );
}

function AppointmentSummaryStrip({ appointments }) {
  const pendingCount = appointments.filter((appointment) => appointment.status === 'Chờ xác nhận').length;
  const todayCount = appointments.filter((appointment) => appointment.date === '2024-12-03').length;
  const usedSlots = new Set(appointments.map((appointment) => `${appointment.date}-${appointment.startTime}`));
  const openSlots = scheduleDays
    .filter((day) => !day.unavailable)
    .flatMap((day) => timeSlots.filter((slot) => !slot.unavailable).map((slot) => `${day.isoDate}-${slot.time}`))
    .filter((key) => !usedSlots.has(key)).length;
  const summaryItems = [
    { label: 'Chờ xác nhận', value: pendingCount, description: 'Cần xử lý trước giờ khám', tone: 'warning' },
    { label: 'Tổng lịch tuần này', value: appointments.length, description: 'Khám mới, tái khám, follow-up', tone: 'neutral' },
    { label: 'Lịch hôm nay', value: todayCount, description: '1 ca sắp diễn ra', tone: 'success' },
    { label: 'Khung giờ trống', value: openSlots, description: 'Có thể nhận lịch mới', tone: 'mint' },
  ];

  return (
    <section className="appointment-summary-strip" aria-label="Tóm tắt lịch khám trong tuần">
      {summaryItems.map((item) => (
        <article className={`appointment-summary-card summary-${item.tone}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.description}</p>
        </article>
      ))}
    </section>
  );
}

function PendingAppointmentItem({ appointment, isActive, onActivate }) {
  return (
    <li className={`pending-appointment-item ${isActive ? 'active' : ''}`} onMouseEnter={() => onActivate(appointment.id)} onFocus={() => onActivate(appointment.id)}>
      <div className="pending-appointment-top">
        <div>
          <h3>{appointment.patient}</h3>
          <div className="pending-inline-meta">
            <AppointmentTypeChip>{appointment.type}</AppointmentTypeChip>
            <AppointmentStatusBadge tone={appointment.statusTone}>{appointment.priority || 'Chờ xử lý'}</AppointmentStatusBadge>
          </div>
        </div>
        <Clock size={17} aria-hidden="true" />
      </div>
      <p className="pending-time">{getDayLabel(appointment.date)}, {appointment.startTime} - {appointment.endTime}</p>
      <p className="pending-reason">{appointment.note}</p>
      <div className="pending-actions">
        <button className="btn-secondary btn-small" type="button" onClick={() => onActivate(appointment.id)}>
          <CheckCircle2 size={15} className="button-icon-inline" aria-hidden="true" />
          Xác nhận
        </button>
        <button className="btn-secondary btn-small reject-action" type="button" onClick={() => onActivate(appointment.id)}>
          <XCircle size={15} className="button-icon-inline" aria-hidden="true" />
          Từ chối
        </button>
      </div>
    </li>
  );
}

function PendingAppointmentsCard({ appointments, activeAppointmentId, setActiveAppointmentId }) {
  const pendingAppointments = appointments.filter((appointment) => appointment.status === 'Chờ xác nhận');
  return (
    <section className="card pending-card">
      <div className="appointments-card-header">
        <span className="appointments-eyebrow">Ưu tiên xử lý</span>
        <h2>Chờ xác nhận ({pendingAppointments.length})</h2>
        <p>Xác nhận hoặc từ chối nhanh các lịch chưa được duyệt.</p>
      </div>
      <ul className="pending-appointments-list">
        {pendingAppointments.map((appointment) => (
          <PendingAppointmentItem appointment={appointment} isActive={activeAppointmentId === appointment.id} key={appointment.id} onActivate={setActiveAppointmentId} />
        ))}
      </ul>
    </section>
  );
}

function MiniMonthCalendar({ appointments }) {
  const appointmentDateCounts = appointments.reduce((acc, appointment) => {
    const dayNumber = Number(appointment.date.split('-')[2]);
    const tone = appointment.status === 'Chờ xác nhận' ? 'warning' : 'success';
    acc[dayNumber] = [...(acc[dayNumber] ?? []), tone];
    return acc;
  }, {});
  const miniCalendarDays = Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    return { day, active: day === 3, markers: [...new Set(appointmentDateCounts[day] ?? [])] };
  });

  return (
    <section className="card mini-month-card">
      <div className="mini-month-header">
        <button className="btn-icon" type="button" aria-label="Tháng trước"><ChevronLeft size={16} aria-hidden="true" /></button>
        <div>
          <strong>Tháng 12/2024</strong>
          <span>Ngày có lịch được đánh dấu màu</span>
        </div>
        <button className="btn-icon" type="button" aria-label="Tháng sau"><ChevronRight size={16} aria-hidden="true" /></button>
      </div>
      <div className="mini-month-grid">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => <div className="mini-month-day label" key={day}>{day}</div>)}
        {miniCalendarDays.map((item) => (
          <button className={`mini-month-day ${item.active ? 'active' : ''}`} type="button" key={item.day}>
            <span>{item.day}</span>
            {item.markers.length > 0 ? <span className="mini-markers" aria-hidden="true">{item.markers.map((marker) => <i className={`marker-${marker}`} key={marker} />)}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function CalendarFilterBar() {
  return (
    <div className="calendar-filter-bar">
      <div className="calendar-filter-chips" aria-label="Bộ lọc nhanh">
        {filters.map((filter) => (
          <button className={filter === 'Tất cả' ? 'filter-chip active' : 'filter-chip'} type="button" key={filter}>{filter}</button>
        ))}
      </div>
      <label className="filter-select-label">
        <Filter size={15} aria-hidden="true" />
        <select className="filter-select" aria-label="Lọc loại lịch khám">
          {filters.map((filter) => <option key={filter}>{filter}</option>)}
        </select>
      </label>
    </div>
  );
}

function WeeklyCalendarEvent({ event, isActive, onActivate }) {
  return (
    <button
      className={`weekly-event event-${event.statusTone} ${event.upcoming ? 'upcoming' : ''} ${isActive ? 'active' : ''}`}
      type="button"
      onMouseEnter={() => onActivate(event.id)}
      onFocus={() => onActivate(event.id)}
      onClick={() => onActivate(event.id)}
    >
      <strong>{event.patient}</strong>
      <span>{event.type}</span>
      <p>{event.note}</p>
      <AppointmentStatusBadge tone={event.statusTone}>{event.status}</AppointmentStatusBadge>
    </button>
  );
}

function AvailabilitySlot({ day, slot, event, activeAppointmentId, selectedSlot, setActiveAppointmentId, onCreateFromSlot }) {
  const isUnavailable = slot.unavailable || day.unavailable;
  const isOpen = !isUnavailable && !event;
  const isSelected = selectedSlot?.date === day.isoDate && selectedSlot?.startTime === slot.time;

  return (
    <div className={`calendar-slot ${isUnavailable ? 'unavailable' : ''} ${isOpen ? 'available' : ''} ${isSelected ? 'selected' : ''}`}>
      {isUnavailable ? <span className="slot-label">{slot.reason || 'Không khả dụng'}</span> : null}
      {isOpen ? (
        <button className="slot-open-button" type="button" onClick={() => onCreateFromSlot(day, slot)}>
          <Plus size={13} aria-hidden="true" />
          Trống
        </button>
      ) : null}
      {event ? <WeeklyCalendarEvent event={event} isActive={activeAppointmentId === event.id} onActivate={setActiveAppointmentId} /> : null}
    </div>
  );
}

function WeeklyCalendarGrid({ appointments, activeAppointmentId, selectedSlot, setActiveAppointmentId, onCreateFromSlot }) {
  return (
    <section className="appointments-main card">
      <div className="weekly-calendar-header">
        <div>
          <span className="appointments-eyebrow">Lịch tuần</span>
          <h2>Tuần này (02/12 - 08/12)</h2>
          <p>Slot trống, nghỉ trưa và lịch chờ xác nhận được thể hiện trực tiếp trên grid.</p>
        </div>
        <CalendarFilterBar />
      </div>
      <div className="weekly-calendar-grid" role="grid" aria-label="Lịch khám theo tuần">
        <div className="time-column">
          <div className="calendar-corner" />
          {timeSlots.map((slot) => <div className={`time-cell ${slot.unavailable ? 'unavailable' : ''}`} key={slot.time}>{slot.label}</div>)}
        </div>
        <div className="calendar-day-columns">
          {scheduleDays.map((day) => {
            const hasConfirmed = appointments.some((item) => item.dayKey === day.key && item.status !== 'Chờ xác nhận');
            const hasPending = appointments.some((item) => item.dayKey === day.key && item.status === 'Chờ xác nhận');
            return (
              <div className={`calendar-day-column ${day.isToday ? 'today' : ''} ${day.unavailable ? 'day-unavailable' : ''}`} key={day.key}>
                <div className="calendar-day-header">
                  <strong>{day.label}</strong>
                  <span>{day.date}</span>
                  <div className="day-status-markers" aria-hidden="true">
                    {hasConfirmed ? <i className="marker-success" /> : null}
                    {hasPending ? <i className="marker-warning" /> : null}
                    {day.unavailable ? <i className="marker-neutral" /> : null}
                  </div>
                </div>
                {timeSlots.map((slot) => {
                  const event = appointments.find((item) => item.dayKey === day.key && item.startTime === slot.time);
                  return (
                    <AvailabilitySlot
                      activeAppointmentId={activeAppointmentId}
                      day={day}
                      event={event}
                      key={`${day.key}-${slot.time}`}
                      onCreateFromSlot={onCreateFromSlot}
                      selectedSlot={selectedSlot}
                      setActiveAppointmentId={setActiveAppointmentId}
                      slot={slot}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PatientSummaryCard({ patient, onChangePatient }) {
  return (
    <div className="patient-summary-card">
      <div className="patient-summary-avatar">{patient.name.charAt(0)}</div>
      <div>
        <h3>{patient.name}</h3>
        <p>{patient.id} · {patient.phone}</p>
        <AppointmentStatusBadge tone="success">{patient.status}</AppointmentStatusBadge>
      </div>
      <button className="btn-secondary btn-small" type="button" onClick={onChangePatient}>Đổi bệnh nhân</button>
    </div>
  );
}

function PatientSearchSelect({ form, setForm, error }) {
  const selectedPatient = patients.find((patient) => patient.id === form.patientId);
  const search = form.patientSearch.trim().toLowerCase();
  const filteredPatients = patients.filter((patient) => [patient.name, patient.phone, patient.id].some((value) => value.toLowerCase().includes(search)));

  if (selectedPatient) {
    return <PatientSummaryCard patient={selectedPatient} onChangePatient={() => setForm((current) => ({ ...current, patientId: '', patientSearch: '' }))} />;
  }

  return (
    <div className="patient-search-select">
      <label className="drawer-field">
        <span>Chọn bệnh nhân</span>
        <div className="drawer-search-input">
          <Search size={16} aria-hidden="true" />
          <input
            value={form.patientSearch}
            onChange={(event) => setForm((current) => ({ ...current, patientSearch: event.target.value }))}
            placeholder="Tìm bệnh nhân theo tên, SĐT, mã BN..."
            aria-invalid={Boolean(error)}
          />
        </div>
      </label>
      {error ? <p className="field-error">{error}</p> : null}
      <button className="inline-add-patient" type="button">+ Thêm bệnh nhân mới</button>
      <div className="patient-result-list">
        {filteredPatients.map((patient) => (
          <button className="patient-result-item" type="button" key={patient.id} onClick={() => setForm((current) => ({ ...current, patientId: patient.id, patientSearch: patient.name }))}>
            <span>{patient.name}</span>
            <small>{patient.id} · {patient.phone}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function AppointmentTypeSelect({ value, onChange }) {
  return (
    <div className="segmented-control" role="radiogroup" aria-label="Loại lịch">
      {appointmentTypes.map((type) => <button className={value === type ? 'active' : ''} type="button" key={type} onClick={() => onChange(type)}>{type}</button>)}
    </div>
  );
}

function AppointmentStatusSelector({ value, onChange }) {
  return (
    <div className="status-selector" role="radiogroup" aria-label="Trạng thái lịch">
      {['Chờ xác nhận', 'Đã xác nhận'].map((status) => (
        <button className={value === status ? 'active' : ''} type="button" key={status} onClick={() => onChange(status)}>
          <span>{status}</span>
          <small>{status === 'Chờ xác nhận' ? 'Thêm vào danh sách pending' : 'Hiển thị là lịch đã duyệt'}</small>
        </button>
      ))}
    </div>
  );
}

function DateTimeFields({ form, setForm, errors }) {
  const handleStartChange = (value) => setForm((current) => ({ ...current, startTime: value, endTime: addMinutes(value, 30) }));
  return (
    <div className="drawer-form-grid">
      <label className="drawer-field">
        <span>Ngày khám</span>
        <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} aria-invalid={Boolean(errors.date)} />
        {errors.date ? <p className="field-error">{errors.date}</p> : null}
      </label>
      <label className="drawer-field">
        <span>Giờ bắt đầu</span>
        <input type="time" value={form.startTime} onChange={(event) => handleStartChange(event.target.value)} aria-invalid={Boolean(errors.startTime)} />
        {errors.startTime ? <p className="field-error">{errors.startTime}</p> : null}
      </label>
      <label className="drawer-field">
        <span>Giờ kết thúc</span>
        <input type="time" value={form.endTime} onChange={(event) => setForm((current) => ({ ...current, endTime: event.target.value }))} aria-invalid={Boolean(errors.endTime)} />
        {errors.endTime ? <p className="field-error">{errors.endTime}</p> : null}
      </label>
    </div>
  );
}

function ProviderSelect({ value, onChange, error }) {
  return (
    <label className="drawer-field">
      <span>Bác sĩ / chuyên viên phụ trách</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)}>
        {providers.map((provider) => <option key={provider}>{provider}</option>)}
      </select>
      {error ? <p className="field-error">{error}</p> : null}
    </label>
  );
}

function VisitGoalSelect({ form, setForm }) {
  return (
    <div className="drawer-form-grid two-columns">
      <label className="drawer-field">
        <span>Hình thức khám</span>
        <select value={form.method} onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))}>
          {visitMethods.map((method) => <option key={method}>{method}</option>)}
        </select>
      </label>
      <label className="drawer-field">
        <span>Mục tiêu buổi khám</span>
        <select value={form.goal} onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value }))}>
          {visitGoals.map((goal) => <option key={goal}>{goal}</option>)}
        </select>
      </label>
    </div>
  );
}

function ReminderOptions({ form, setForm }) {
  return (
    <div className="reminder-options">
      <label><input type="checkbox" checked={form.reminderOneDay} onChange={(event) => setForm((current) => ({ ...current, reminderOneDay: event.target.checked }))} /><span>Gửi nhắc trước 1 ngày</span></label>
      <label><input type="checkbox" checked={form.reminderTwoHours} onChange={(event) => setForm((current) => ({ ...current, reminderTwoHours: event.target.checked }))} /><span>Gửi nhắc trước 2 giờ</span></label>
    </div>
  );
}

function AppointmentConflictAlert({ conflict, suggestions, onPickSuggestion }) {
  if (!conflict) return null;
  return (
    <div className="appointment-conflict-alert" role="alert">
      <AlertCircle size={18} aria-hidden="true" />
      <div>
        <strong>{conflict}</strong>
        {suggestions.length > 0 ? (
          <div className="suggested-slots">
            <span>Gợi ý slot khác:</span>
            {suggestions.map((slot) => <button type="button" key={slot} onClick={() => onPickSuggestion(slot)}>{slot}</button>)}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DrawerFooterActions({ isSubmitting, onClose }) {
  return (
    <div className="drawer-footer-actions">
      <button className="btn-secondary" type="button" onClick={onClose} disabled={isSubmitting}>Huỷ</button>
      <button className="btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo lịch hẹn'}</button>
    </div>
  );
}

function validateAppointment(form, appointments) {
  const errors = {};
  let conflict = '';
  if (!form.patientId) errors.patientId = 'Vui lòng chọn bệnh nhân.';
  if (!form.type) errors.type = 'Vui lòng chọn loại lịch.';
  if (!form.date) errors.date = 'Vui lòng chọn ngày khám.';
  if (!form.startTime) errors.startTime = 'Vui lòng chọn giờ bắt đầu.';
  if (!form.endTime) errors.endTime = 'Vui lòng chọn giờ kết thúc.';
  if (!form.provider) errors.provider = 'Vui lòng chọn bác sĩ phụ trách.';
  if (form.startTime && form.endTime && timeToMinutes(form.endTime) <= timeToMinutes(form.startTime)) errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.';

  const day = getDayByDate(form.date);
  const slot = timeSlots.find((item) => item.time === form.startTime);
  if (!day) conflict = 'Ngày này không nằm trong tuần đang xem.';
  else if (day.unavailable) conflict = 'Ngày này không khả dụng để đặt lịch.';
  else if (!slot || slot.unavailable || form.startTime === '12:00') conflict = 'Không thể đặt lịch vào giờ nghỉ trưa hoặc khung không mở lịch.';
  else if (appointments.some((appointment) => appointment.date === form.date && appointment.startTime === form.startTime)) conflict = `Bác sĩ đã kín lịch từ ${form.startTime}-${form.endTime}.`;
  return { errors, conflict };
}

function CreateAppointmentDrawer({ isOpen, form, setForm, appointments, errors, conflict, isSubmitting, onClose, onSubmit }) {
  const drawerRef = useRef(null);
  const selectedPatient = patients.find((patient) => patient.id === form.patientId);
  const suggestions = getSuggestedSlots(form.date, appointments);

  useEffect(() => {
    if (!isOpen) return undefined;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const drawerNode = drawerRef.current;
    const focusableElements = drawerNode ? Array.from(drawerNode.querySelectorAll(focusableSelector)) : [];
    focusableElements[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSuggestion = (slot) => {
    const [startTime, endTime] = slot.split('-');
    setForm((current) => ({ ...current, startTime, endTime }));
  };

  return (
    <div className="appointment-drawer-layer" role="presentation" onMouseDown={onClose}>
      <form className="appointment-drawer" role="dialog" aria-modal="true" aria-labelledby="create-appointment-title" ref={drawerRef} onMouseDown={(event) => event.stopPropagation()} onSubmit={onSubmit}>
        <header className="appointment-drawer-header">
          <div>
            <h2 id="create-appointment-title">Tạo lịch hẹn mới</h2>
            <p>Thiết lập lịch khám cho bệnh nhân</p>
          </div>
          <button className="btn-icon" type="button" aria-label="Đóng drawer tạo lịch hẹn" onClick={onClose}><X size={18} aria-hidden="true" /></button>
        </header>

        <div className="appointment-drawer-body">
          <section className="drawer-form-section">
            <div className="drawer-section-heading"><span>A</span><div><h3>Thông tin bệnh nhân</h3><p>Chọn hồ sơ cần tạo lịch khám.</p></div></div>
            <PatientSearchSelect form={form} setForm={setForm} error={errors.patientId} />
          </section>
          <section className="drawer-form-section">
            <div className="drawer-section-heading"><span>B</span><div><h3>Thông tin lịch hẹn</h3><p>Thiết lập ngày giờ, phụ trách và mục tiêu buổi khám.</p></div></div>
            <label className="drawer-field">
              <span>Loại lịch</span>
              <AppointmentTypeSelect value={form.type} onChange={(value) => setForm((current) => ({ ...current, type: value }))} />
              {errors.type ? <p className="field-error">{errors.type}</p> : null}
            </label>
            <DateTimeFields form={form} setForm={setForm} errors={errors} />
            <ProviderSelect value={form.provider} onChange={(value) => setForm((current) => ({ ...current, provider: value }))} error={errors.provider} />
            <VisitGoalSelect form={form} setForm={setForm} />
            <AppointmentConflictAlert conflict={conflict} suggestions={suggestions} onPickSuggestion={handleSuggestion} />
          </section>
          <section className="drawer-form-section">
            <div className="drawer-section-heading"><span>C</span><div><h3>Trạng thái lịch</h3><p>Chọn cách lịch xuất hiện trong danh sách điều phối.</p></div></div>
            <AppointmentStatusSelector value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} />
          </section>
          <section className="drawer-form-section">
            <div className="drawer-section-heading"><span>D</span><div><h3>Ghi chú và nhắc lịch</h3><p>Thêm ghi chú ngắn để điều phối và nhắc bệnh nhân.</p></div></div>
            <label className="drawer-field">
              <span>Ghi chú</span>
              <textarea rows="4" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} placeholder="Ghi chú cho buổi khám, ví dụ: mang kết quả xét nghiệm gần nhất." />
            </label>
            <ReminderOptions form={form} setForm={setForm} />
          </section>
          {selectedPatient ? <p className="drawer-context-note">Lịch sẽ được tạo cho <strong>{selectedPatient.name}</strong> vào <strong>{getDayLabel(form.date)}, {form.startTime}-{form.endTime}</strong>.</p> : null}
        </div>
        <DrawerFooterActions isSubmitting={isSubmitting} onClose={onClose} />
      </form>
    </div>
  );
}

function SetupView() {
  return (
    <section className="appointments-main card setup-view">
      <div className="setup-header">
        <span className="appointments-eyebrow">Thiết lập ca khám</span>
        <h2>Khung giờ làm việc của bác sĩ</h2>
        <p className="text-muted">Dùng để giới hạn khung giờ bệnh nhân hoặc điều phối viên có thể đặt lịch.</p>
      </div>
      <div className="setup-body">
        <div className="setup-section">
          <h3>Thời lượng khám</h3>
          <div className="duration-options">
            {['30 phút - Khám tiêu chuẩn', '45 phút - Phân tích chuyên sâu', '60 phút - Khám mới và lập phác đồ'].map((label, index) => (
              <label className="radio-label" key={label}>
                <input type="radio" name="duration" defaultChecked={index === 0} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="setup-section">
          <h3>Khung giờ cố định</h3>
          <div className="availability-grid">
            {scheduleDays.map((day, index) => (
              <div className="availability-row" key={day.key}>
                <div className="day-toggle">
                  <input type="checkbox" id={`day-${index}`} defaultChecked={index < 5} />
                  <label htmlFor={`day-${index}`}>{day.label}</label>
                </div>
                <div className="time-inputs">
                  <input type="time" defaultValue="08:00" disabled={index >= 5} aria-label={`Giờ bắt đầu buổi sáng ${day.label}`} />
                  <span>đến</span>
                  <input type="time" defaultValue="11:30" disabled={index >= 5} aria-label={`Giờ kết thúc buổi sáng ${day.label}`} />
                  <span className="time-range-divider">-</span>
                  <input type="time" defaultValue="13:30" disabled={index >= 5} aria-label={`Giờ bắt đầu buổi chiều ${day.label}`} />
                  <span>đến</span>
                  <input type="time" defaultValue="17:00" disabled={index >= 5} aria-label={`Giờ kết thúc buổi chiều ${day.label}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="setup-footer">
          <button className="btn-primary" type="button">Lưu cấu hình làm việc</button>
        </div>
      </div>
    </section>
  );
}

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeAppointmentId, setActiveAppointmentId] = useState('apt-p1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [conflict, setConflict] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setErrors({});
    setConflict('');
  };

  const openCreateDrawer = (nextForm = initialFormState, slotContext = null) => {
    setActiveTab('calendar');
    setForm(nextForm);
    setSelectedSlot(slotContext);
    setErrors({});
    setConflict('');
    setIsDrawerOpen(true);
  };

  const handleCreateFromSlot = (day, slot) => {
    openCreateDrawer(buildFormFromSlot(day, slot), { date: day.isoDate, startTime: slot.time });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateAppointment(form, appointments);
    setErrors(validation.errors);
    setConflict(validation.conflict);
    if (Object.keys(validation.errors).length > 0 || validation.conflict) return;

    const selectedPatient = patients.find((patient) => patient.id === form.patientId);
    const day = getDayByDate(form.date);
    const appointment = {
      id: `apt-new-${Date.now()}`,
      patient: selectedPatient.name,
      patientId: selectedPatient.id,
      type: form.type,
      status: form.status,
      statusTone: getStatusTone(form.status),
      dayKey: day.key,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      note: form.goal === 'Khác' ? form.note || 'Ghi chú buổi khám' : form.goal,
      provider: form.provider,
      priority: form.date === '2024-12-03' ? 'Hôm nay' : 'Chờ xử lý',
    };

    setIsSubmitting(true);
    window.setTimeout(() => {
      setAppointments((current) => [...current, appointment]);
      setActiveAppointmentId(appointment.id);
      setIsSubmitting(false);
      setToastMessage(form.status === 'Chờ xác nhận' ? 'Đã tạo lịch và thêm vào mục chờ xác nhận' : 'Đã tạo lịch hẹn thành công');
      closeDrawer();
      window.setTimeout(() => setToastMessage(''), 3200);
    }, 450);
  };

  return (
    <div className="appointments-page">
      <AppointmentManagementHeader activeTab={activeTab} setActiveTab={setActiveTab} onCreate={() => openCreateDrawer()} />
      <AppointmentSummaryStrip appointments={appointments} />
      <div className="appointments-layout">
        <aside className="appointments-sidebar">
          <PendingAppointmentsCard appointments={appointments} activeAppointmentId={activeAppointmentId} setActiveAppointmentId={setActiveAppointmentId} />
          <MiniMonthCalendar appointments={appointments} />
        </aside>
        {activeTab === 'calendar' ? (
          <WeeklyCalendarGrid
            activeAppointmentId={activeAppointmentId}
            appointments={appointments}
            onCreateFromSlot={handleCreateFromSlot}
            selectedSlot={selectedSlot}
            setActiveAppointmentId={setActiveAppointmentId}
          />
        ) : (
          <SetupView />
        )}
      </div>
      <CreateAppointmentDrawer
        appointments={appointments}
        conflict={conflict}
        errors={errors}
        form={form}
        isOpen={isDrawerOpen}
        isSubmitting={isSubmitting}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
        setForm={setForm}
      />
      <SuccessToast message={toastMessage} />
    </div>
  );
}
