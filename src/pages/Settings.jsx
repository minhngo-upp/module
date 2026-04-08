import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  PencilLine,
  PlusCircle,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  UserRoundCog,
  XCircle,
} from 'lucide-react';
import { doctorProfileMock, nurseAccessPatientsMock, nursesMock } from '../mockData';
import './Settings.css';

const requiredProfileFields = ['fullName', 'title', 'specialty'];

function getStatusClass(status) {
  if (status === 'Đang hoạt động') return 'badge-success';
  if (status === 'Tạm khóa') return 'badge-warning';
  return 'badge-blue';
}

function createEmptyNurseDraft() {
  return {
    nurseId: '',
    fullName: '',
    roleLabel: '',
    phone: '',
    status: 'Đang hoạt động',
  };
}

export default function Settings() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [doctorProfileDraft, setDoctorProfileDraft] = useState(doctorProfileMock);
  const [profileMessage, setProfileMessage] = useState('');

  const [nurses, setNurses] = useState(nursesMock);
  const [selectedNurseId, setSelectedNurseId] = useState(nursesMock[0]?.nurseId ?? '');
  const [nurseSearchTerm, setNurseSearchTerm] = useState('');
  const [patientAccessSearchTerm, setPatientAccessSearchTerm] = useState('');
  const [pendingAssignedPatientIds, setPendingAssignedPatientIds] = useState(nursesMock[0]?.assignedPatientIds ?? []);
  const [permissionMessage, setPermissionMessage] = useState('');

  const [isAddingNurse, setIsAddingNurse] = useState(false);
  const [newNurseDraft, setNewNurseDraft] = useState(createEmptyNurseDraft());
  const [nurseMessage, setNurseMessage] = useState('');

  const selectedNurse = useMemo(
    () => nurses.find((nurse) => nurse.nurseId === selectedNurseId) ?? null,
    [nurses, selectedNurseId],
  );

  const filteredNurses = useMemo(() => {
    const normalizedSearch = nurseSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return nurses;

    return nurses.filter((nurse) =>
      [nurse.nurseId, nurse.fullName, nurse.roleLabel].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [nurses, nurseSearchTerm]);

  const filteredPatients = useMemo(() => {
    const normalizedSearch = patientAccessSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return nurseAccessPatientsMock;

    return nurseAccessPatientsMock.filter((patient) =>
      [patient.id, patient.name, patient.status].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [patientAccessSearchTerm]);

  const assignedPatients = useMemo(
    () => filteredPatients.filter((patient) => pendingAssignedPatientIds.includes(patient.id)),
    [filteredPatients, pendingAssignedPatientIds],
  );

  const unassignedPatients = useMemo(
    () => filteredPatients.filter((patient) => !pendingAssignedPatientIds.includes(patient.id)),
    [filteredPatients, pendingAssignedPatientIds],
  );

  const profileErrors = useMemo(
    () => requiredProfileFields.filter((fieldName) => !String(doctorProfileDraft[fieldName] ?? '').trim()),
    [doctorProfileDraft],
  );

  const nurseErrors = useMemo(() => {
    const errors = [];
    if (!newNurseDraft.nurseId.trim()) errors.push('nurseId');
    if (!newNurseDraft.fullName.trim()) errors.push('fullName');
    if (!newNurseDraft.roleLabel.trim()) errors.push('roleLabel');

    if (
      newNurseDraft.nurseId.trim() &&
      nurses.some((nurse) => nurse.nurseId.toLowerCase() === newNurseDraft.nurseId.trim().toLowerCase())
    ) {
      errors.push('duplicateId');
    }

    return errors;
  }, [newNurseDraft, nurses]);

  const togglePatientAccess = (patientId) => {
    setPendingAssignedPatientIds((current) =>
      current.includes(patientId) ? current.filter((id) => id !== patientId) : [...current, patientId],
    );
  };

  const handleSelectNurse = (nurseId) => {
    const nurse = nurses.find((item) => item.nurseId === nurseId);
    setSelectedNurseId(nurseId);
    setPendingAssignedPatientIds(nurse?.assignedPatientIds ?? []);
    setPermissionMessage('');
  };

  const resetNewNurseDraft = () => {
    setNewNurseDraft(createEmptyNurseDraft());
  };

  const handleProfileSave = () => {
    if (profileErrors.length > 0) {
      setProfileMessage('Vui lòng điền đủ họ tên, chức danh và chuyên khoa trước khi lưu.');
      return;
    }

    setProfileMessage('Đã lưu hồ sơ bác sĩ.');
    setIsEditingProfile(false);
  };

  const handleAddNurse = () => {
    if (nurseErrors.length > 0) {
      if (nurseErrors.includes('duplicateId')) {
        setNurseMessage('ID điều dưỡng đã tồn tại. Vui lòng nhập một mã khác.');
        return;
      }

      setNurseMessage('Vui lòng nhập đủ ID điều dưỡng, họ tên và vai trò trước khi lưu.');
      return;
    }

    const createdNurse = {
      ...newNurseDraft,
      nurseId: newNurseDraft.nurseId.trim(),
      fullName: newNurseDraft.fullName.trim(),
      roleLabel: newNurseDraft.roleLabel.trim(),
      phone: newNurseDraft.phone.trim(),
      assignedPatientIds: [],
    };

    setNurses((current) => [createdNurse, ...current]);
    setIsAddingNurse(false);
    resetNewNurseDraft();
    setNurseSearchTerm('');
    setNurseMessage(`Đã thêm điều dưỡng ${createdNurse.fullName}. Có thể gán quyền xem hồ sơ ngay bây giờ.`);
    setSelectedNurseId(createdNurse.nurseId);
    setPendingAssignedPatientIds([]);
    setPermissionMessage('');
  };

  const handlePermissionSave = () => {
    if (!selectedNurse) return;

    setNurses((current) =>
      current.map((nurse) =>
        nurse.nurseId === selectedNurse.nurseId ? { ...nurse, assignedPatientIds: pendingAssignedPatientIds } : nurse,
      ),
    );
    setPermissionMessage(`Đã cập nhật quyền xem hồ sơ cho ${selectedNurse.fullName}.`);
  };

  const clearAllPermissions = () => {
    setPendingAssignedPatientIds([]);
    setPermissionMessage('Đã bỏ toàn bộ quyền xem hồ sơ trong bản nháp hiện tại.');
  };

  return (
    <div className="settings-page">
      <div className="page-header settings-header">
        <div>
          <h1 className="page-title">Cài đặt</h1>
          <p className="page-subtitle">
            Quản lý hồ sơ bác sĩ và điều chỉnh điều dưỡng nào được xem hồ sơ của bệnh nhân nào.
          </p>
        </div>
      </div>

      <section className="settings-grid">
        <article className="card settings-panel doctor-profile-panel">
          <div className="settings-panel-header">
            <div className="section-heading">
              <span className="eyebrow">Hồ sơ bác sĩ</span>
              <h2>Cập nhật thông tin hiển thị và chuyên môn</h2>
            </div>

            <button className="btn-secondary" type="button" onClick={() => setIsEditingProfile((current) => !current)}>
              <PencilLine size={16} className="button-icon-inline" aria-hidden="true" />
              {isEditingProfile ? 'Đang chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
            </button>
          </div>

          <div className="doctor-profile-top">
            <div className="doctor-avatar-card">
              <div className="doctor-avatar-preview">
                {doctorProfileDraft.avatar?.startsWith('http') ? (
                  <img src={doctorProfileDraft.avatar} alt={doctorProfileDraft.fullName} />
                ) : (
                  <span>{doctorProfileDraft.avatar || doctorProfileDraft.fullName.charAt(0)}</span>
                )}
              </div>

              <label className="settings-field">
                <span>Ảnh đại diện hoặc ký tự avatar</span>
                <input
                  type="text"
                  value={doctorProfileDraft.avatar}
                  disabled={!isEditingProfile}
                  onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, avatar: event.target.value }))}
                />
              </label>
            </div>

            <div className="doctor-profile-summary">
              <div className="settings-meta-row">
                <span>Mã bác sĩ</span>
                <strong>{doctorProfileDraft.doctorId}</strong>
              </div>
              <div className="settings-meta-row">
                <span>Trạng thái tài khoản</span>
                <strong>{doctorProfileDraft.accountStatus}</strong>
              </div>
              <div className="settings-meta-row">
                <span>Đơn vị</span>
                <strong>{doctorProfileDraft.departmentLabel}</strong>
              </div>
            </div>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field">
              <span>Họ tên</span>
              <input
                type="text"
                value={doctorProfileDraft.fullName}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, fullName: event.target.value }))}
              />
            </label>

            <label className="settings-field">
              <span>Chức danh</span>
              <input
                type="text"
                value={doctorProfileDraft.title}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, title: event.target.value }))}
              />
            </label>

            <label className="settings-field">
              <span>Chuyên khoa</span>
              <input
                type="text"
                value={doctorProfileDraft.specialty}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, specialty: event.target.value }))}
              />
            </label>

            <label className="settings-field">
              <span>Đơn vị</span>
              <input
                type="text"
                value={doctorProfileDraft.departmentLabel}
                disabled={!isEditingProfile}
                onChange={(event) =>
                  setDoctorProfileDraft((current) => ({ ...current, departmentLabel: event.target.value }))
                }
              />
            </label>

            <label className="settings-field">
              <span>Số điện thoại</span>
              <input
                type="text"
                value={doctorProfileDraft.phone}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>

            <label className="settings-field">
              <span>Email</span>
              <input
                type="email"
                value={doctorProfileDraft.email}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, email: event.target.value }))}
              />
            </label>

            <label className="settings-field settings-field-full">
              <span>Mô tả chuyên môn</span>
              <textarea
                rows="4"
                value={doctorProfileDraft.bio}
                disabled={!isEditingProfile}
                onChange={(event) => setDoctorProfileDraft((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>
          </div>

          <div className="settings-actions">
            <div className={`settings-inline-message ${profileErrors.length > 0 ? 'warning' : 'neutral'}`}>
              {profileMessage || 'Có thể cập nhật hồ sơ hiển thị của bác sĩ ngay tại đây.'}
            </div>

            <button className="btn-primary" type="button" onClick={handleProfileSave} disabled={!isEditingProfile}>
              <Save size={16} className="button-icon-inline" aria-hidden="true" />
              Lưu thay đổi
            </button>
          </div>
        </article>

        <section className="settings-access-grid">
          <article className="card settings-panel nurse-list-panel">
            <div className="settings-panel-header">
              <div className="section-heading">
                <span className="eyebrow">Điều dưỡng</span>
                <h2>Quản lý ID nội bộ và phạm vi được xem</h2>
              </div>

              <button
                className="btn-secondary"
                type="button"
                onClick={() => {
                  setIsAddingNurse((current) => !current);
                  setNurseMessage('');
                  if (isAddingNurse) resetNewNurseDraft();
                }}
              >
                <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
                {isAddingNurse ? 'Đóng form thêm' : 'Thêm điều dưỡng'}
              </button>
            </div>

            {isAddingNurse ? (
              <div className="settings-add-form">
                <div className="settings-add-grid">
                  <label className="settings-field">
                    <span>ID điều dưỡng</span>
                    <input
                      type="text"
                      value={newNurseDraft.nurseId}
                      onChange={(event) =>
                        setNewNurseDraft((current) => ({ ...current, nurseId: event.target.value }))
                      }
                    />
                  </label>

                  <label className="settings-field">
                    <span>Họ tên</span>
                    <input
                      type="text"
                      value={newNurseDraft.fullName}
                      onChange={(event) =>
                        setNewNurseDraft((current) => ({ ...current, fullName: event.target.value }))
                      }
                    />
                  </label>

                  <label className="settings-field">
                    <span>Vai trò</span>
                    <input
                      type="text"
                      value={newNurseDraft.roleLabel}
                      onChange={(event) =>
                        setNewNurseDraft((current) => ({ ...current, roleLabel: event.target.value }))
                      }
                    />
                  </label>

                  <label className="settings-field">
                    <span>Số điện thoại</span>
                    <input
                      type="text"
                      value={newNurseDraft.phone}
                      onChange={(event) =>
                        setNewNurseDraft((current) => ({ ...current, phone: event.target.value }))
                      }
                    />
                  </label>

                  <label className="settings-field settings-field-full">
                    <span>Trạng thái</span>
                    <select
                      className="settings-select"
                      value={newNurseDraft.status}
                      onChange={(event) =>
                        setNewNurseDraft((current) => ({ ...current, status: event.target.value }))
                      }
                    >
                      <option value="Đang hoạt động">Đang hoạt động</option>
                      <option value="Tạm khóa">Tạm khóa</option>
                    </select>
                  </label>
                </div>

                <div className="settings-actions settings-add-actions">
                  <div className={`settings-inline-message ${nurseErrors.length > 0 ? 'warning' : 'neutral'}`}>
                    {nurseMessage || 'Thêm điều dưỡng mới để cấp quyền xem hồ sơ bệnh nhân theo ID nội bộ.'}
                  </div>

                  <div className="settings-actions-group">
                    <button
                      className="btn-secondary"
                      type="button"
                      onClick={() => {
                        resetNewNurseDraft();
                        setIsAddingNurse(false);
                        setNurseMessage('');
                      }}
                    >
                      Hủy
                    </button>
                    <button className="btn-primary" type="button" onClick={handleAddNurse}>
                      <PlusCircle size={16} className="button-icon-inline" aria-hidden="true" />
                      Lưu điều dưỡng
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <label className="settings-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Tìm theo ID điều dưỡng hoặc tên..."
                value={nurseSearchTerm}
                onChange={(event) => setNurseSearchTerm(event.target.value)}
              />
            </label>

            <div className="nurse-list">
              {filteredNurses.map((nurse) => (
                <button
                  key={nurse.nurseId}
                  className={`nurse-list-item ${selectedNurseId === nurse.nurseId ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleSelectNurse(nurse.nurseId)}
                >
                  <div className="nurse-list-item-top">
                    <div className="nurse-avatar">
                      <UserRound size={18} aria-hidden="true" />
                    </div>
                    <div className="nurse-list-copy">
                      <strong>{nurse.fullName}</strong>
                      <span>{nurse.nurseId}</span>
                    </div>
                    <span className={`badge ${getStatusClass(nurse.status)}`}>{nurse.status}</span>
                  </div>

                  <div className="nurse-list-item-bottom">
                    <span>{nurse.roleLabel}</span>
                    <strong>{nurse.assignedPatientIds.length} bệnh nhân được xem</strong>
                  </div>
                </button>
              ))}

              {filteredNurses.length === 0 ? (
                <p className="empty-copy">Không tìm thấy điều dưỡng phù hợp với bộ lọc hiện tại.</p>
              ) : null}
            </div>
          </article>

          <article className="card settings-panel access-panel">
            {selectedNurse ? (
              <>
                <div className="settings-panel-header">
                  <div className="section-heading">
                    <span className="eyebrow">Phân quyền xem hồ sơ</span>
                    <h2>{selectedNurse.fullName}</h2>
                  </div>
                </div>

                <div className="access-overview">
                  <div className="access-overview-card">
                    <span>ID điều dưỡng</span>
                    <strong>{selectedNurse.nurseId}</strong>
                  </div>
                  <div className="access-overview-card">
                    <span>Vai trò</span>
                    <strong>{selectedNurse.roleLabel}</strong>
                  </div>
                  <div className="access-overview-card">
                    <span>Đang được xem</span>
                    <strong>{pendingAssignedPatientIds.length} hồ sơ</strong>
                  </div>
                </div>

                <label className="settings-search patient-search">
                  <Search size={16} aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Tìm bệnh nhân theo mã hoặc tên..."
                    value={patientAccessSearchTerm}
                    onChange={(event) => setPatientAccessSearchTerm(event.target.value)}
                  />
                </label>

                <div className="permission-columns">
                  <section className="permission-column">
                    <div className="permission-column-header">
                      <ShieldCheck size={16} aria-hidden="true" />
                      <strong>Đã được cấp quyền</strong>
                    </div>

                    <div className="permission-list">
                      {assignedPatients.map((patient) => (
                        <label key={patient.id} className="permission-item">
                          <input
                            type="checkbox"
                            checked={pendingAssignedPatientIds.includes(patient.id)}
                            onChange={() => togglePatientAccess(patient.id)}
                          />
                          <div>
                            <strong>{patient.name}</strong>
                            <p>{patient.id} • {patient.status}</p>
                          </div>
                        </label>
                      ))}
                      {assignedPatients.length === 0 ? (
                        <p className="empty-copy">Chưa có bệnh nhân nào được cấp quyền.</p>
                      ) : null}
                    </div>
                  </section>

                  <section className="permission-column">
                    <div className="permission-column-header">
                      <UserRoundCog size={16} aria-hidden="true" />
                      <strong>Chưa được cấp quyền</strong>
                    </div>

                    <div className="permission-list">
                      {unassignedPatients.map((patient) => (
                        <label key={patient.id} className="permission-item">
                          <input
                            type="checkbox"
                            checked={pendingAssignedPatientIds.includes(patient.id)}
                            onChange={() => togglePatientAccess(patient.id)}
                          />
                          <div>
                            <strong>{patient.name}</strong>
                            <p>{patient.id} • {patient.status}</p>
                          </div>
                        </label>
                      ))}
                      {unassignedPatients.length === 0 ? (
                        <p className="empty-copy">Không còn bệnh nhân phù hợp với bộ lọc hiện tại.</p>
                      ) : null}
                    </div>
                  </section>
                </div>

                <div className="settings-actions">
                  <div className={`settings-inline-message ${permissionMessage ? 'success' : 'neutral'}`}>
                    {permissionMessage || 'Có thể chọn nhiều điều dưỡng cho cùng một bệnh nhân và ngược lại.'}
                  </div>

                  <div className="settings-actions-group">
                    <button className="btn-secondary" type="button" onClick={clearAllPermissions}>
                      <XCircle size={16} className="button-icon-inline" aria-hidden="true" />
                      Bỏ tất cả
                    </button>
                    <button className="btn-primary" type="button" onClick={handlePermissionSave}>
                      <CheckCircle2 size={16} className="button-icon-inline" aria-hidden="true" />
                      Lưu phân quyền
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="empty-copy">Chọn một điều dưỡng để bắt đầu điều chỉnh quyền xem hồ sơ bệnh nhân.</p>
            )}
          </article>
        </section>
      </section>
    </div>
  );
}
