import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  ClipboardList,
  Edit3,
  FileText,
  MessageSquare,
  ScrollText,
  Trash2,
  X,
} from 'lucide-react';
import './PatientDetail.css';

import { findBasePatient } from '../data/patients';
import { patientDetailMock } from '../mockData';
import {
  buildPatientDetailFromDraft,
  deletePatientDraft,
  ensurePatientDraftFromDetail,
  getDeletedPatientIds,
  getPatientDraft,
} from '../utils/patientDrafts';
import OverviewTab from './patient-detail-tabs/OverviewTab';
import AssessmentTab from './patient-detail-tabs/AssessmentTab';
import DailyLogTab from './patient-detail-tabs/DailyLogTab';
import InterventionFollowUpTab from './patient-detail-tabs/InterventionFollowUpTab';

const TABS = [
  { id: 'summary', label: 'Tóm tắt', icon: ScrollText },
  { id: 'assessment', label: 'Đánh giá', icon: Activity },
  { id: 'daily-log', label: 'Nhật ký', icon: ClipboardList },
  { id: 'intervention-followup', label: 'Can thiệp & theo dõi', icon: FileText },
];

function getValidTab(tabId) {
  return TABS.some((tab) => tab.id === tabId) ? tabId : 'summary';
}

// Clinical snapshot block moved directly into header layout

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => getValidTab(searchParams.get('tab')));
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimeoutRef = useRef(null);
  const detailContentRef = useRef(null);

  const draftPatient = getPatientDraft(id);
  const basePatient = findBasePatient(id);
  const fallbackPatient = basePatient
    ? {
        ...patientDetailMock,
        patientCode: basePatient.id,
        fullName: basePatient.name,
        gender: basePatient.gender,
        age: basePatient.age,
        phone: basePatient.phone,
        occupation: basePatient.occupation,
        avatar: basePatient.name.charAt(0).toUpperCase(),
        assignedDoctor: {
          ...patientDetailMock.assignedDoctor,
          name: basePatient.doctor,
        },
      }
    : { ...patientDetailMock, patientCode: id ?? patientDetailMock.patientCode };
  const patient = buildPatientDetailFromDraft(
    draftPatient,
    fallbackPatient,
  );

  const handleSelectTab = (tabId) => {
    const nextTab = getValidTab(tabId);
    setActiveTab(nextTab);
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === 'summary') nextParams.delete('tab');
    else nextParams.set('tab', nextTab);
    setSearchParams(nextParams, { replace: true });
  };

  const handleEditPatient = () => {
    const draft = ensurePatientDraftFromDetail(patient);
    navigate(`/patients/new/${draft.patientCode}`);
  };

  const handleDeletePatient = () => {
    deletePatientDraft(patient.patientCode);
    navigate('/patients');
  };

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
    if (id && getDeletedPatientIds().includes(id)) navigate('/patients');
  }, [id, navigate]);

  useEffect(() => {
    setActiveTab(getValidTab(searchParams.get('tab')));
  }, [searchParams]);

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
        return <OverviewTab patient={patient} onNavigate={handleSelectTab} showToast={showToast} />;
      case 'assessment':
        return <AssessmentTab patient={patient} showToast={showToast} />;
      case 'daily-log':
        return <DailyLogTab patient={patient} onNavigate={handleSelectTab} />;
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
          <button className="btn-secondary" type="button" onClick={handleEditPatient}>
            <Edit3 size={16} className="button-icon-inline" aria-hidden="true" />
            Chỉnh sửa
          </button>
          <Link className="btn-secondary" to={`/messages?patientId=${patient.patientCode}`}>
            <MessageSquare size={16} className="button-icon-inline" aria-hidden="true" />
            Nhắn tin
          </Link>
          <Link className="btn-primary" to={`/appointments?create=1&patientId=${patient.patientCode}`}>
            <CalendarPlus size={16} className="button-icon-inline" aria-hidden="true" />
            Tạo theo dõi
          </Link>
          <button className="btn-secondary danger-action" type="button" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 size={16} className="button-icon-inline" aria-hidden="true" />
            Xoá
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
            <strong className="snapshot-value">{patient.nutritionAssessment.mainDiagnosis}</strong>
          </div>
          <div className="snapshot-separator"></div>
          <div className="snapshot-item">
            <span className="snapshot-label">Ưu tiên hôm nay</span>
            <strong className="snapshot-value">Tăng năng lượng khẩu phần và nước uống</strong>
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
                onClick={() => handleSelectTab(tab.id)}
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

      {isDeleteOpen ? (
        <div className="patient-confirm-backdrop" role="presentation" onClick={() => setIsDeleteOpen(false)}>
          <section
            className="patient-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-detail-patient-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-dialog-header">
              <div>
                <span className="eyebrow">Xoá hồ sơ</span>
                <h2 id="delete-detail-patient-title">Xoá {patient.fullName}?</h2>
              </div>
              <button className="btn-icon" type="button" aria-label="Đóng xác nhận xoá" onClick={() => setIsDeleteOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p>Hồ sơ sẽ được ẩn khỏi danh sách bệnh nhân. Nếu đây là hồ sơ nhập tay, dữ liệu nháp trên trình duyệt này cũng sẽ bị xoá.</p>
            <div className="confirm-patient-summary">
              <strong>{patient.patientCode}</strong>
              <span>{patient.age} tuổi · {patient.gender} · {patient.assignedDoctor.name}</span>
            </div>
            <div className="confirm-dialog-actions">
              <button className="btn-secondary" type="button" onClick={() => setIsDeleteOpen(false)}>Huỷ</button>
              <button className="btn-danger" type="button" onClick={handleDeletePatient}>
                <Trash2 size={16} className="button-icon-inline" aria-hidden="true" />
                Xoá hồ sơ
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
