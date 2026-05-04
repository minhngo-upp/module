import React, { useMemo, useState } from 'react';
import { CalendarClock, Edit3, Eye, MessageSquare, MoreVertical, Search, Trash2, UserPlus, X } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CreatePatientDrawer from '../components/CreatePatientDrawer';
import { basePatients } from '../data/patients';
import {
  deletePatientDraft,
  draftToPatientListItem,
  ensurePatientDraftFromListItem,
  getDeletedPatientIds,
  getPatientDrafts,
} from '../utils/patientDrafts';
import './Patients.css';

function getInitialPatients() {
  const deletedIds = new Set(getDeletedPatientIds());
  const draftItems = getPatientDrafts().map(draftToPatientListItem);
  const draftIds = new Set(draftItems.map((patient) => patient.id));
  return [
    ...draftItems.filter((patient) => !deletedIds.has(patient.id)),
    ...basePatients.filter((patient) => !draftIds.has(patient.id) && !deletedIds.has(patient.id)),
  ];
}

function getStatusBadge(status) {
  switch (status) {
    case 'Đang theo dõi':
      return 'badge-success';
    case 'Cần chú ý':
      return 'badge-danger';
    case 'Mới khám':
    case 'Mới tiếp nhận':
      return 'badge-blue';
    case 'Tạm ngưng':
    case 'Chưa hoàn thiện hồ sơ':
      return 'badge-warning';
    default:
      return '';
  }
}

export default function Patients() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patientsList, setPatientsList] = useState(getInitialPatients);
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => searchParams.get('create') === '1');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const closeCreateDrawer = () => {
    setIsDrawerOpen(false);
    if (searchParams.get('create')) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('create');
      setSearchParams(nextParams, { replace: true });
    }
  };

  const filteredPatients = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return patientsList.filter((patient) => {
      const matchesSearch =
        !normalizedSearch ||
        [patient.id, patient.name, patient.phone, patient.doctor, patient.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch));
      const matchesDoctor = doctorFilter === 'all' || patient.doctor === doctorFilter;
      const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;

      return matchesSearch && matchesDoctor && matchesStatus;
    });
  }, [doctorFilter, patientsList, searchTerm, statusFilter]);

  const doctorOptions = useMemo(
    () => [...new Set(patientsList.map((patient) => patient.doctor).filter(Boolean))],
    [patientsList],
  );

  const statusOptions = useMemo(
    () => [...new Set(patientsList.map((patient) => patient.status).filter(Boolean))],
    [patientsList],
  );

  const patientSummary = useMemo(() => {
    const needsAttention = patientsList.filter((patient) => patient.status === 'Cần chú ý').length;
    const overdue = patientsList.filter((patient) => patient.nextVisit === 'Quá hạn').length;
    const active = patientsList.filter((patient) => patient.status === 'Đang theo dõi').length;

    return [
      { label: 'Cần chú ý', value: needsAttention, tone: 'danger' },
      { label: 'Quá hạn tái khám', value: overdue, tone: 'warning' },
      { label: 'Đang theo dõi', value: active, tone: 'success' },
      { label: 'Kết quả bộ lọc', value: filteredPatients.length, tone: 'neutral' },
    ];
  }, [filteredPatients.length, patientsList]);

  const handleAddPatient = (newPatient) => {
    setPatientsList((current) => [newPatient, ...current.filter((patient) => patient.id !== newPatient.id)]);
    setToastMessage(newPatient.status === 'Chưa hoàn thiện hồ sơ' ? 'Đã lưu hồ sơ nháp' : 'Đã tạo bệnh nhân thành công');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEditPatient = (patient) => {
    const draft = ensurePatientDraftFromListItem(patient);
    setOpenActionMenuId(null);
    navigate(`/patients/new/${draft.patientCode}`);
  };

  const handleDeletePatient = () => {
    if (!deleteTarget) return;
    deletePatientDraft(deleteTarget.id);
    setPatientsList((current) => current.filter((patient) => patient.id !== deleteTarget.id));
    setDeleteTarget(null);
    setToastMessage(`Đã xoá hồ sơ ${deleteTarget.name}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="patients-page">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Danh sách bệnh nhân</h1>
          <p className="page-subtitle">Quản lý và theo dõi {patientsList.length} bệnh nhân đang hoạt động trong hệ thống</p>
        </div>
        <button className="btn-primary" type="button" onClick={() => setIsDrawerOpen(true)}>
          <UserPlus size={18} className="button-icon-inline" aria-hidden="true" />
          Thêm bệnh nhân
        </button>
      </div>

      <section className="patients-clinical-summary" aria-label="Tóm tắt danh sách bệnh nhân">
        {patientSummary.map((item) => (
          <div className={`patients-summary-card summary-${item.tone}`} key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-bar table-search">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              name="patients-search"
              autoComplete="off"
              aria-label="Tìm bệnh nhân theo tên hoặc mã bệnh nhân"
              placeholder="Tìm theo tên, mã BN..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <select
              className="filter-select"
              aria-label="Lọc theo bác sĩ phụ trách"
              value={doctorFilter}
              onChange={(event) => setDoctorFilter(event.target.value)}
            >
              <option value="all">Bác sĩ phụ trách: Tất cả</option>
              {doctorOptions.map((doctor) => (
                <option value={doctor} key={doctor}>{doctor}</option>
              ))}
            </select>

            <select
              className="filter-select"
              aria-label="Lọc theo trạng thái hồ sơ"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Trạng thái: Tất cả</option>
              {statusOptions.map((status) => (
                <option value={status} key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <colgroup>
              <col className="patient-code-col" />
              <col className="patient-name-col" />
              <col className="patient-doctor-col" />
              <col className="patient-date-col" />
              <col className="patient-date-col" />
              <col className="patient-status-col" />
              <col className="patient-actions-col" />
            </colgroup>
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ tên</th>
                <th>Bác sĩ</th>
                <th>Khám gần nhất</th>
                <th>Tái khám</th>
                <th>Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr className={patient.status === 'Cần chú ý' ? 'patient-row-attention' : ''} key={patient.id}>
                  <td className="font-medium">{patient.id}</td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="patient-link">
                      <div className="patient-avatar-sm">{patient.name.charAt(0)}</div>
                      <span>{patient.name}</span>
                    </Link>
                  </td>
                  <td>{patient.doctor}</td>
                  <td>{patient.lastVisit}</td>
                  <td className={patient.nextVisit === 'Quá hạn' ? 'text-danger font-medium' : ''}>{patient.nextVisit}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(patient.status)}`}>{patient.status}</span>
                  </td>
                  <td className="text-right actions-cell">
                    <div className="action-buttons">
                      <Link className="btn-icon" to={`/patients/${patient.id}`} aria-label={`Xem hồ sơ của ${patient.name}`}>
                        <Eye size={18} aria-hidden="true" />
                      </Link>
                      <Link className="btn-icon" to={`/messages?patientId=${patient.id}`} aria-label={`Nhắn tin với ${patient.name}`}>
                        <MessageSquare size={18} aria-hidden="true" />
                      </Link>
                      <Link className="btn-icon" to={`/appointments?create=1&patientId=${patient.id}`} aria-label={`Đặt lịch cho ${patient.name}`}>
                        <CalendarClock size={18} aria-hidden="true" />
                      </Link>
                      <button
                        className={`btn-icon ${openActionMenuId === patient.id ? 'active' : ''}`}
                        type="button"
                        aria-label={`Mở thêm thao tác cho ${patient.name}`}
                        aria-expanded={openActionMenuId === patient.id}
                        onClick={() => setOpenActionMenuId((current) => (current === patient.id ? null : patient.id))}
                      >
                        <MoreVertical size={18} aria-hidden="true" />
                      </button>
                      {openActionMenuId === patient.id ? (
                        <div className="patient-row-action-menu" role="menu" aria-label={`Thao tác với ${patient.name}`}>
                          <button type="button" role="menuitem" onClick={() => handleEditPatient(patient)}>
                            <Edit3 size={16} aria-hidden="true" />
                            Chỉnh sửa hồ sơ
                          </button>
                          <button
                            className="danger-menu-item"
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setDeleteTarget(patient);
                              setOpenActionMenuId(null);
                            }}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            Xoá hồ sơ
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 ? (
                <tr>
                  <td className="empty-table-state" colSpan="7">
                    Không có bệnh nhân phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="text-muted text-sm">Hiển thị 1 - {filteredPatients.length} trong tổng số {patientsList.length} bệnh nhân</span>
          <div className="pagination-controls">
            <button className="btn-secondary btn-sm" type="button" disabled>Trước</button>
            <button className="btn-primary btn-sm" type="button">1</button>
            <button className="btn-secondary btn-sm" type="button" disabled>Sau</button>
          </div>
        </div>
      </div>

      {isDrawerOpen ? (
        <CreatePatientDrawer
          isOpen={isDrawerOpen}
          onClose={closeCreateDrawer}
          existingPatients={patientsList}
          onSuccess={handleAddPatient}
        />
      ) : null}

      {deleteTarget ? (
        <div className="patient-confirm-backdrop" role="presentation" onClick={() => setDeleteTarget(null)}>
          <section
            className="patient-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-patient-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-dialog-header">
              <div>
                <span className="eyebrow">Xoá hồ sơ</span>
                <h2 id="delete-patient-title">Xoá {deleteTarget.name}?</h2>
              </div>
              <button className="btn-icon" type="button" aria-label="Đóng xác nhận xoá" onClick={() => setDeleteTarget(null)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p>Hồ sơ sẽ được ẩn khỏi danh sách bệnh nhân. Với hồ sơ nháp, dữ liệu nhập tay cũng sẽ bị xoá khỏi trình duyệt này.</p>
            <div className="confirm-patient-summary">
              <strong>{deleteTarget.id}</strong>
              <span>{deleteTarget.phone} · {deleteTarget.doctor}</span>
            </div>
            <div className="confirm-dialog-actions">
              <button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>Huỷ</button>
              <button className="btn-danger" type="button" onClick={handleDeletePatient}>
                <Trash2 size={16} className="button-icon-inline" aria-hidden="true" />
                Xoá hồ sơ
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {toastMessage && (
        <div className="success-toast show">
          <CheckIcon />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
