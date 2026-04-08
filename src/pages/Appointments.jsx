import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, XCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import './Appointments.css';

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('calendar');

  const pendingAppointments = [
    { id: 1, patient: 'Trần Văn Nam', type: 'Tái khám', date: 'Hôm nay', time: '14:00 - 14:30', reason: 'Theo dõi mỡ máu' },
    { id: 2, patient: 'Lê Hoàng Anh', type: 'Khám mới', date: 'Ngày mai', time: '09:00 - 09:45', reason: 'Tư vấn dinh dưỡng thể thao' },
  ];

  const scheduleDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const timeslots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div className="appointments-page">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Quản lý lịch khám</h1>
          <p className="page-subtitle">Xem, xác nhận và thiết lập khung giờ làm việc theo tuần</p>
        </div>
        <div className="actions-right">
          <button className={`btn-secondary ${activeTab === 'calendar' ? 'active-outline' : ''}`} type="button" onClick={() => setActiveTab('calendar')}>
            <CalendarIcon size={18} className="button-icon-inline" aria-hidden="true" /> Lịch tuần
          </button>
          <button className={`btn-secondary ${activeTab === 'setup' ? 'active-outline' : ''}`} type="button" onClick={() => setActiveTab('setup')}>
            <Settings size={18} className="button-icon-inline" aria-hidden="true" /> Thiết lập ca khám
          </button>
          <button className="btn-primary" type="button">
            <Plus size={18} className="button-icon-inline" aria-hidden="true" /> Tạo lịch hẹn mới
          </button>
        </div>
      </div>

      <div className="appointments-layout">
        <div className="appointments-sidebar">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chờ xác nhận ({pendingAppointments.length})</h3>
            </div>
            <div className="card-body p-0">
              <ul className="pending-list">
                {pendingAppointments.map((appointment) => (
                  <li className="pending-item" key={appointment.id}>
                    <div className="pending-info">
                      <h4>{appointment.patient}</h4>
                      <div className="pending-meta">
                        <span className="badge badge-warning">{appointment.type}</span>
                        <span className="meta-time">
                          <Clock size={14} aria-hidden="true" /> {appointment.date}, {appointment.time}
                        </span>
                      </div>
                      <p className="pending-reason">{appointment.reason}</p>
                    </div>
                    <div className="pending-actions">
                      <button className="btn-icon text-success" type="button" aria-label={`Xác nhận lịch của ${appointment.patient}`}>
                        <CheckCircle2 size={24} aria-hidden="true" />
                      </button>
                      <button className="btn-icon text-danger" type="button" aria-label={`Từ chối hoặc dời lại lịch của ${appointment.patient}`}>
                        <XCircle size={24} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <div className="mini-calendar">
                <div className="mini-cal-header flex-between mb-2">
                  <button className="btn-icon" type="button" aria-label="Tháng trước">
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <strong>Tháng 10/2023</strong>
                  <button className="btn-icon" type="button" aria-label="Tháng sau">
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="mini-cal-grid">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                    <div className="mini-cal-day label" key={day}>{day}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, index) => (
                    <div className={`mini-cal-day ${index + 1 === 18 ? 'active text-primary font-bold' : ''}`} key={index}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="appointments-main card">
          {activeTab === 'calendar' ? (
            <div className="calendar-view">
              <div className="calendar-header flex-between">
                <h2>Tuần này (16/10 - 22/10)</h2>
                <div className="calendar-filters">
                  <select className="filter-select" aria-label="Lọc loại lịch khám">
                    <option>Tất cả loại lịch</option>
                    <option>Khám mới</option>
                    <option>Tái khám</option>
                  </select>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-timeline">
                  <div className="time-header"></div>
                  {timeslots.map((time) => (
                    <div className="time-cell" key={time}>{time}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {scheduleDays.map((day, index) => (
                    <div className="day-column" key={day}>
                      <div className="day-header">
                        {day}
                        <br />
                        <small>{16 + index}/10</small>
                      </div>
                      <div className="day-slots">
                        {day === 'Thứ 3' && (
                          <div className="appointment-card confirmed" style={{ top: '60px', height: '100px' }}>
                            <strong>Lê Thị Thu</strong>
                            <br />
                            Khám định kỳ
                          </div>
                        )}
                        {day === 'Thứ 4' && (
                          <div className="appointment-card pending" style={{ top: '120px', height: '60px' }}>
                            <strong>Chờ xác nhận</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="setup-view">
              <div className="setup-header">
                <h2>Thiết lập ca làm việc</h2>
                <p className="text-muted">Định cấu hình các ca khám khả dụng để bệnh nhân có thể đặt lịch trên ứng dụng.</p>
              </div>

              <div className="setup-body">
                <div className="setup-section">
                  <h3>1. Cấu hình thời lượng khám</h3>
                  <div className="duration-options">
                    <label className="radio-label">
                      <input type="radio" name="duration" defaultChecked />
                      <span>30 phút (Khám tiêu chuẩn)</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="duration" />
                      <span>45 phút (Phân tích chuyên sâu)</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="duration" />
                      <span>60 phút (Khám mới & lập phác đồ)</span>
                    </label>
                  </div>
                </div>

                <div className="setup-section mt-4">
                  <h3>2. Thời gian khả dụng theo ngày</h3>
                  <div className="availability-grid">
                    {scheduleDays.map((day, index) => (
                      <div className="availability-row" key={day}>
                        <div className="day-toggle">
                          <input type="checkbox" id={`day-${index}`} defaultChecked={index < 5} />
                          <label htmlFor={`day-${index}`}>{day}</label>
                        </div>
                        <div className="time-inputs">
                          <input type="time" defaultValue="08:00" disabled={index >= 5} aria-label={`Giờ bắt đầu buổi sáng ${day}`} />
                          <span>đến</span>
                          <input type="time" defaultValue="11:30" disabled={index >= 5} aria-label={`Giờ kết thúc buổi sáng ${day}`} />
                          <span className="time-range-divider">-</span>
                          <input type="time" defaultValue="13:30" disabled={index >= 5} aria-label={`Giờ bắt đầu buổi chiều ${day}`} />
                          <span>đến</span>
                          <input type="time" defaultValue="17:00" disabled={index >= 5} aria-label={`Giờ kết thúc buổi chiều ${day}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="setup-footer mt-4">
                  <button className="btn-primary" type="button">Lưu cấu hình làm việc</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
