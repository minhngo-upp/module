import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Activity, FileText, Utensils, Pill, Dumbbell, Clock, MessageSquare, CalendarPlus, CheckCircle2 } from 'lucide-react';
import './PatientDetail.css';

// mock data
import { patientDetailMock } from '../mockData';

// Tab components
import OverviewTab from './patient-detail-tabs/OverviewTab';
import DailyLogTab from './patient-detail-tabs/DailyLogTab';
import ConsultationTab from './patient-detail-tabs/ConsultationTab';
import CarePlanTab from './patient-detail-tabs/CarePlanTab';
import HistoryTab from './patient-detail-tabs/HistoryTab';

export default function PatientDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [toastMsg, setToastMsg] = useState('');

  const patient = patientDetailMock; // Using the mock from PRD

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab showToast={showToast} />;
      case 'daily-log': return <DailyLogTab showToast={showToast} />;
      case 'consultation': return <ConsultationTab showToast={showToast} />;
      case 'care-plan': return <CarePlanTab showToast={showToast} />;
      case 'history': return <HistoryTab showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div className="patient-detail-page relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Lớp 2: Header Hành động chung + Back link */}
      <div className="detail-header-actions mb-4">
        <Link to="/patients" className="back-link">
          <ArrowLeft size={18} />
          <span>Quay lại danh sách</span>
        </Link>
        <div className="actions-right">
          <button className="btn-secondary" onClick={() => showToast('Mở chat với ' + patient.fullName)}>
            <MessageSquare size={16} style={{marginRight: '0.5rem'}}/> Nhắn tin
          </button>
          <button className="btn-primary" onClick={() => showToast('Đã mở form Đặt lịch tái khám!')}>
            <CalendarPlus size={16} style={{marginRight: '0.5rem'}}/> Đặt lịch tái khám
          </button>
        </div>
      </div>

      {/* Lớp 2: Header Hồ sơ Bệnh nhân (Profile Card) */}
      <div className="card profile-card mb-4" style={{borderLeft: '4px solid hsl(var(--primary))'}}>
        <div className="profile-info-main">
          <div className="profile-avatar-lg bg-blue-light text-primary">{patient.avatar}</div>
          <div className="profile-details">
            <h1 className="profile-name" style={{fontSize: '1.75rem', marginBottom: '0.25rem'}}>{patient.fullName}</h1>
            <div className="profile-tags" style={{marginTop: '0.75rem'}}>
              <span className="tag font-bold">Mã BN: {patient.patientCode}</span>
              <span className="tag text-main">{patient.gender}, {patient.age} tuổi</span>
              <span className="tag text-main">{patient.phone}</span>
            </div>
            <p className="profile-doctor mt-2 text-muted"><strong>Bác sĩ phụ trách:</strong> {patient.assignedDoctor.name}</p>
          </div>
        </div>
      </div>

      {/* Lớp 3: Tab Điều hướng */}
      <div className="detail-navigation mb-4">
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><User size={18}/>Hồ sơ Sức khỏe</button>
          <button className={`tab-btn ${activeTab === 'daily-log' ? 'active' : ''}`} onClick={() => setActiveTab('daily-log')}><Utensils size={18}/>Nhật ký Sinh hoạt</button>
          <button className={`tab-btn ${activeTab === 'consultation' ? 'active' : ''}`} onClick={() => setActiveTab('consultation')}><Activity size={18}/>Khám & Ghi chú</button>
          <button className={`tab-btn ${activeTab === 'care-plan' ? 'active' : ''}`} onClick={() => setActiveTab('care-plan')}><Pill size={18}/>Kế hoạch Điều trị</button>
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><Clock size={18}/>Lịch sử</button>
        </nav>
      </div>

      {/* Lớp 4 & 5: Nội dung Tab và Hành động lâm sàng gắn kèm */}
      <div className="detail-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
