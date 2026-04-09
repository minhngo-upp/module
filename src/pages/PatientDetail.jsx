import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
  ScrollText,
} from 'lucide-react';
import './PatientDetail.css';

import { patientDetailMock } from '../mockData';
import OverviewTab from './patient-detail-tabs/OverviewTab';
import AssessmentTab from './patient-detail-tabs/AssessmentTab';
import DailyLogTab from './patient-detail-tabs/DailyLogTab';
import InterventionFollowUpTab from './patient-detail-tabs/InterventionFollowUpTab';

const TABS = [
  { id: 'summary', label: 'Tóm tắt', icon: ScrollText },
  { id: 'assessment', label: 'Đánh giá', icon: Activity },
  { id: 'daily-log', label: 'Nhật ký khẩu phần', icon: ClipboardList },
  { id: 'intervention-followup', label: 'Can thiệp & theo dõi', icon: FileText },
];

export default function PatientDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('summary');
  const [toastMsg, setToastMsg] = useState('');
  const toastTimeoutRef = useRef(null);

  const patient = { ...patientDetailMock, patientCode: id ?? patientDetailMock.patientCode };

  const showToast = (message) => {
    setToastMsg(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMsg(''), 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <OverviewTab patient={patient} onNavigate={setActiveTab} showToast={showToast} />;
      case 'assessment':
        return <AssessmentTab patient={patient} showToast={showToast} />;
      case 'daily-log':
        return <DailyLogTab patient={patient} onNavigate={setActiveTab} />;
      case 'intervention-followup':
        return <InterventionFollowUpTab patient={patient} showToast={showToast} />;
      default:
        return null;
    }
  };

  return (
    <div className="patient-detail-page relative">
      {toastMsg && (
        <div className="toast-notification" role="status" aria-live="polite" aria-atomic="true">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="detail-header-actions">
        <Link to="/patients" className="back-link">
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Quay lại danh sách bệnh nhân</span>
        </Link>

        <div className="actions-right">
          <Link className="btn-secondary" to={`/messages?patientId=${patient.patientCode}`}>
            <MessageSquare size={16} className="button-icon-inline" aria-hidden="true" />
            Nhắn tin
          </Link>
          <button className="btn-primary" type="button" onClick={() => showToast('Đã mở form đặt lịch theo dõi')}>
            <CalendarPlus size={16} className="button-icon-inline" aria-hidden="true" />
            Tạo follow-up
          </button>
        </div>
      </div>

      <section className="patient-hero">
        <div className="card patient-hero-card">
          <div className="profile-info-main">
            <div className="profile-avatar-lg bg-blue-light text-primary">{patient.avatar}</div>

            <div className="profile-details">
              <div className="hero-topline">
                <span className="hero-status-badge">{patient.nutritionAssessment.priority}</span>
                <span className="hero-subtitle">Hồ sơ dinh dưỡng</span>
              </div>
              <h1 className="profile-name-large">{patient.fullName}</h1>
              <p className="hero-diagnosis">{patient.nutritionAssessment.mainDiagnosis}</p>
              <div className="profile-tags profile-tags-wrap">
                <span className="tag">Mã BN: {patient.patientCode}</span>
                <span className="tag">
                  {patient.gender}, {patient.age} tuổi
                </span>
                <span className="tag">{patient.occupation}</span>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="hero-side-item">
              <span>Mục tiêu hiện tại</span>
              <strong>{patient.nutritionAssessment.currentGoal}</strong>
            </div>
            <div className="hero-side-item">
              <span>Người phụ trách</span>
              <strong>{patient.assignedDoctor.name}</strong>
            </div>
          </div>
        </div>
      </section>

      <div className="detail-navigation">
        <nav className="tabs" role="tablist" aria-label="Các nhóm thông tin hồ sơ dinh dưỡng">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={`tab-btn ${selected ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={18} aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="detail-content" id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
        {renderTabContent()}
      </div>
    </div>
  );
}
