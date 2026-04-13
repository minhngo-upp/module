import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  FileText,
  MessageSquare,
  ScrollText,
  AlertTriangle,
  X,
  Send,
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

function PatientRiskBadge({ level }) {
  return (
    <span className="patient-risk-badge">
      <AlertTriangle size={14} aria-hidden="true" />
      {level}
    </span>
  );
}

function PatientClinicalSnapshot({ patient }) {
  const snapshotItems = [
    { label: 'Mức độ theo dõi', value: patient.nutritionAssessment.priority },
    { label: 'Vấn đề chính', value: patient.nutritionAssessment.mainDiagnosis },
    { label: 'Ưu tiên hôm nay', value: 'Tăng năng lượng khẩu phần và cải thiện nước uống' },
    { label: 'Cập nhật gần nhất', value: 'Hôm nay, 08:30' },
  ];

  return (
    <div className="clinical-snapshot-strip" aria-label="Tóm tắt lâm sàng nhanh">
      {snapshotItems.map((item) => (
        <div className="clinical-snapshot-item" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const toastTimeoutRef = useRef(null);
  const detailContentRef = useRef(null);

  const patient = { ...patientDetailMock, patientCode: id ?? patientDetailMock.patientCode };

  const showToast = (message) => {
    setToastMsg(message);
    window.clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(
    () => () => {
      window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!detailContentRef.current) return;

    detailContentRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [activeTab]);

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
        <button className="back-link btn-link" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Quay lại</span>
        </button>

        <div className="actions-right">
          <button className="btn-primary" type="button" onClick={() => showToast('Đã mở form đặt lịch theo dõi')}>
            <CalendarPlus size={16} className="button-icon-inline" aria-hidden="true" />
            Tạo follow-up
          </button>
          <button className="btn-secondary" type="button" onClick={() => showToast('Đã tự động gửi tin nhắn nhắc nhở')}>
            <AlertTriangle size={16} className="button-icon-inline" aria-hidden="true" />
             Gửi nhắc nhở
          </button>
          <button className="btn-secondary" type="button" onClick={() => setIsChatOpen(true)}>
            <MessageSquare size={16} className="button-icon-inline" aria-hidden="true" />
            Nhắn tin
          </button>
        </div>
      </div>

      <section className="patient-hero">
        <div className="card patient-hero-card">
          <div className="profile-info-main">
            <div className="profile-avatar-lg bg-blue-light text-primary">{patient.avatar}</div>

            <div className="profile-details">
              <div className="hero-topline">
                <PatientRiskBadge level={patient.nutritionAssessment.priority} />
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
                <span className="tag tag-danger inline-flex items-center gap-1">
                  <AlertTriangle size={14} /> Cảnh báo: Không tuân thủ
                </span>
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

          <PatientClinicalSnapshot patient={patient} />
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

      <div
        className="detail-content"
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        ref={detailContentRef}
      >
        {renderTabContent()}
      </div>

      {isChatOpen && (
        <div className="mini-chatbox">
          <div className="mini-chatbox-header">
            <div className="flex items-center gap-2">
              <div className="chat-avatar">{patient.avatar}</div>
              <strong>{patient.fullName}</strong>
            </div>
            <button className="btn-icon" onClick={() => setIsChatOpen(false)} aria-label="Đóng tin nhắn">
              <X size={18} />
            </button>
          </div>
          <div className="mini-chatbox-body">
            <div className="chat-message received">
              <p>Chào bác sĩ, hôm nay tôi lỡ ăn một cái bánh ngọt thì có sao không ạ?</p>
              <span className="chat-time">10:42</span>
            </div>
          </div>
          <div className="mini-chatbox-footer">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && chatInput) { 
                  showToast('Đã gửi tin nhắn'); 
                  setChatInput(''); 
                } 
              }}
            />
            <button 
              className="btn-icon text-primary" 
              onClick={() => { 
                if (chatInput) { showToast('Đã gửi tin nhắn'); setChatInput(''); } 
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
