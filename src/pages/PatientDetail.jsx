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

// Clinical snapshot block moved directly into header layout

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
          <button className="btn-secondary" type="button" onClick={() => setIsChatOpen(true)}>
            <MessageSquare size={16} className="button-icon-inline" aria-hidden="true" />
            Nhắn tin
          </button>
          <button className="btn-primary" type="button" onClick={() => showToast('Đã mở form đặt lịch theo dõi')}>
            <CalendarPlus size={16} className="button-icon-inline" aria-hidden="true" />
            Tạo follow-up
          </button>
        </div>
      </div>

      <section className="patient-minimal-header-wrapper">
        <div className="patient-minimal-header">
          <div className="patient-minimal-avatar">{patient.avatar}</div>
          <div className="patient-minimal-info">
            <div className="patient-minimal-name-row">
              <h1 className="patient-name-display">{patient.fullName}</h1>
              <span className="patient-meta-display">Mã BN: {patient.patientCode} • {patient.age} tuổi, {patient.gender} • {patient.occupation} • BS: {patient.assignedDoctor.name}</span>
            </div>
            <p className="patient-goal-display">Mục tiêu hiện tại: {patient.nutritionAssessment.currentGoal}</p>
          </div>
        </div>

        <div className="clinical-snapshot-bar">
          <div className="snapshot-item">
            <span className="snapshot-label">Mức độ theo dõi</span>
            <strong className="snapshot-value text-danger">{patient.nutritionAssessment.priority}</strong>
          </div>
          <div className="snapshot-separator"></div>
          <div className="snapshot-item">
            <span className="snapshot-label">Vấn đề chính</span>
            <strong className="snapshot-value truncate">{patient.nutritionAssessment.mainDiagnosis}</strong>
          </div>
          <div className="snapshot-separator"></div>
          <div className="snapshot-item">
            <span className="snapshot-label">Ưu tiên hôm nay</span>
            <strong className="snapshot-value truncate">Tăng năng lượng khẩu phần và nước uống</strong>
          </div>
          <div className="snapshot-separator"></div>
          <div className="snapshot-item">
            <span className="snapshot-label">Cập nhật gần nhất</span>
            <strong className="snapshot-value">Hôm nay, 08:30</strong>
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
