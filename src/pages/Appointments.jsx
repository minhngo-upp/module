import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, CheckCircle2, XCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import './Appointments.css';

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'setup'
  
  // Mocks
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
          <h1 className="page-title">Quản lý Lịch khám</h1>
          <p className="page-subtitle">Xem, xác nhận và thiết lập thời gian biểu của bạn</p>
        </div>
        <div className="actions-right">
          <button 
            className={`btn-secondary ${activeTab === 'calendar' ? 'active-outline' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={18} style={{marginRight: '0.5rem'}}/> Lịch tuần
          </button>
          <button 
            className={`btn-secondary ${activeTab === 'setup' ? 'active-outline' : ''}`}
            onClick={() => setActiveTab('setup')}
          >
            <Settings size={18} style={{marginRight: '0.5rem'}}/> Thiết lập ca khám
          </button>
          <button className="btn-primary">
            <Plus size={18} style={{marginRight: '0.5rem'}}/> Tạo lịch hẹn mới
          </button>
        </div>
      </div>

      <div className="appointments-layout">
        {/* Left Sidebar for Pending / Quick Info */}
        <div className="appointments-sidebar">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Chờ xác nhận ({pendingAppointments.length})</h3>
            </div>
            <div className="card-body p-0">
              <ul className="pending-list">
                {pendingAppointments.map(app => (
                  <li className="pending-item" key={app.id}>
                    <div className="pending-info">
                      <h4>{app.patient}</h4>
                      <div className="pending-meta">
                        <span className="badge badge-warning">{app.type}</span>
                        <span className="meta-time"><Clock size={14}/> {app.date}, {app.time}</span>
                      </div>
                      <p className="pending-reason">{app.reason}</p>
                    </div>
                    <div className="pending-actions">
                      <button className="btn-icon text-success" title="Xác nhận"><CheckCircle2 size={24}/></button>
                      <button className="btn-icon text-danger" title="Từ chối/Dời lại"><XCircle size={24}/></button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Mini Calendar placeholder */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="mini-calendar">
                {/* Just a mockup for visual completeness */}
                <div className="mini-cal-header flex-between mb-2">
                  <ChevronLeft size={16}/>
                  <strong>Tháng 10 2023</strong>
                  <ChevronRight size={16}/>
                </div>
                <div className="mini-cal-grid">
                  {['T2','T3','T4','T5','T6','T7','CN'].map((d,i) => <div className="mini-cal-day label" key={i}>{d}</div>)}
                  {Array.from({length: 31}).map((_, i) => (
                    <div className={`mini-cal-day ${i+1 === 18 ? 'active text-primary font-bold' : ''}`} key={i}>
                      {i+1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="appointments-main card">
          {activeTab === 'calendar' ? (
            <div className="calendar-view">
              <div className="calendar-header flex-between">
                <h2>Tuần này (16/10 - 22/10)</h2>
                <div className="calendar-filters">
                  <select className="filter-select">
                    <option>Tất cả loại lịch</option>
                    <option>Khám mới</option>
                    <option>Tái khám</option>
                  </select>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-timeline">
                   <div className="time-header"></div>
                   {timeslots.map(t => <div className="time-cell" key={t}>{t}</div>)}
                </div>
                <div className="calendar-days">
                  {scheduleDays.map((day, idx) => (
                    <div className="day-column" key={day}>
                      <div className="day-header">{day} <br/><small>{16 + idx}/10</small></div>
                      <div className="day-slots">
                        {/* Mocking some appointments */}
                        {day === 'Thứ 3' && (
                          <div className="appointment-card confirmed" style={{top: '60px', height: '100px'}}>
                            <strong>Lê Thị Thu</strong><br/>Khám định kỳ
                          </div>
                        )}
                        {day === 'Thứ 4' && (
                          <div className="appointment-card pending" style={{top: '120px', height: '60px'}}>
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
                <p className="text-muted">Định cấu hình các ca khám khả dụng để bệnh nhân có thể đặt trên Mobile App.</p>
              </div>
              
              <div className="setup-body">
                <div className="setup-section">
                  <h3>1. Cấu hình thời lượng khám</h3>
                  <div className="duration-options">
                    <label className="radio-label">
                      <input type="radio" name="duration" defaultChecked />
                      <span>30 Phút (Khám tiêu chuẩn)</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="duration" />
                      <span>45 Phút (Phân tích chuyên sâu)</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="duration" />
                      <span>60 Phút (Khám mới & Lập phác đồ)</span>
                    </label>
                  </div>
                </div>

                <div className="setup-section mt-4">
                  <h3>2. Thời gian khả dụng theo ngày</h3>
                  <div className="availability-grid">
                    {scheduleDays.map((day, idx) => (
                      <div className="availability-row" key={idx}>
                        <div className="day-toggle">
                          <input type="checkbox" id={`day-${idx}`} defaultChecked={idx < 5} />
                          <label htmlFor={`day-${idx}`}>{day}</label>
                        </div>
                        <div className="time-inputs">
                          <input type="time" defaultValue="08:00" disabled={idx >= 5} />
                          <span>đến</span>
                          <input type="time" defaultValue="11:30" disabled={idx >= 5} />
                          
                          <span style={{margin: '0 1rem'}}>-</span>
                          
                          <input type="time" defaultValue="13:30" disabled={idx >= 5} />
                          <span>đến</span>
                          <input type="time" defaultValue="17:00" disabled={idx >= 5} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="setup-footer mt-4">
                  <button className="btn-primary">Lưu cấu hình làm việc</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
