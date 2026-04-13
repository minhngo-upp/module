import React, { useMemo, useState } from 'react';
import { PencilLine, Save, X } from 'lucide-react';

const requiredFields = ['fullName', 'title', 'specialty'];

export default function DoctorProfileWorkspace({ profile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [message, setMessage] = useState('');

  const errors = useMemo(() => 
    requiredFields.filter(f => !String(draft[f] ?? '').trim()),
  [draft]);

  const handleCancel = () => {
    setDraft(profile); // Reset to original
    setMessage('');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (errors.length > 0) {
      setMessage('Vui lòng điền đủ họ tên, chức danh và chuyên khoa.');
      return;
    }
    onSave(draft);
    setMessage('Đã lưu hồ sơ bác sĩ thành công.');
    setIsEditing(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <article className="card settings-panel doctor-profile-panel">
      <div className="settings-panel-header">
        <div className="section-heading">
          <span className="eyebrow">Hồ sơ bác sĩ</span>
          <h2>Cập nhật thông tin hiển thị và chuyên môn</h2>
        </div>

        {!isEditing && (
          <button className="btn-secondary" type="button" onClick={() => setIsEditing(true)}>
            <PencilLine size={16} className="button-icon-inline" aria-hidden="true" />
            Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="doctor-profile-view-mode">
          <div className="view-grid">
            <div className="view-avatar">
              {profile.avatar?.startsWith('http') ? (
                <img src={profile.avatar} alt="Avatar" />
              ) : (
                <span>{profile.avatar || profile.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="view-details">
              <h3>{profile.fullName}</h3>
              <p className="text-muted">{profile.title} • {profile.specialty}</p>
              
              <div className="view-meta-grid">
                <div><span>Mã BS:</span> <strong>{profile.doctorId}</strong></div>
                <div><span>Trạng thái:</span> <strong className="text-success">{profile.accountStatus}</strong></div>
                <div><span>SĐT:</span> <strong>{profile.phone}</strong></div>
                <div><span>Email:</span> <strong>{profile.email}</strong></div>
                <div><span>Đơn vị:</span> <strong>{profile.departmentLabel}</strong></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="doctor-profile-top">
            <div className="doctor-avatar-card">
              <div className="doctor-avatar-preview">
                {draft.avatar?.startsWith('http') ? (
                  <img src={draft.avatar} alt="Avatar" />
                ) : (
                  <span>{draft.avatar || draft.fullName.charAt(0)}</span>
                )}
              </div>
              <label className="settings-field">
                <span>Ảnh đại diện (Text hoặc Link)</span>
                <input
                  type="text"
                  value={draft.avatar}
                  onChange={(e) => setDraft({ ...draft, avatar: e.target.value })}
                />
              </label>
            </div>

            <div className="doctor-profile-summary">
              <div className="settings-meta-row"><span>Mã bác sĩ</span><strong>{draft.doctorId}</strong></div>
              <div className="settings-meta-row"><span>Trạng thái</span><strong>{draft.accountStatus}</strong></div>
            </div>
          </div>

          <div className="settings-form-grid">
            <label className="settings-field"><span>Họ tên</span>
              <input type="text" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
            </label>
            <label className="settings-field"><span>Chức danh</span>
              <input type="text" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </label>
            <label className="settings-field"><span>Chuyên khoa</span>
              <input type="text" value={draft.specialty} onChange={(e) => setDraft({ ...draft, specialty: e.target.value })} />
            </label>
            <label className="settings-field"><span>Đơn vị</span>
              <input type="text" value={draft.departmentLabel} onChange={(e) => setDraft({ ...draft, departmentLabel: e.target.value })} />
            </label>
            <label className="settings-field"><span>Số điện thoại</span>
              <input type="text" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </label>
            <label className="settings-field"><span>Email</span>
              <input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
            </label>
            <label className="settings-field settings-field-full"><span>Mô tả chuyên môn</span>
              <textarea rows="3" value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
            </label>
          </div>
        </>
      )}

      {(isEditing || message) && (
        <div className="settings-actions">
          <div className={`settings-inline-message ${errors.length > 0 && isEditing ? 'warning' : 'success'}`} style={{ opacity: message || isEditing ? 1 : 0 }}>
            {message || 'Bạn đang ở chế độ chỉnh sửa. Nhớ lưu lại khi hoàn tất!'}
          </div>

          {isEditing && (
            <div className="settings-actions-group">
              <button className="btn-secondary" type="button" onClick={handleCancel}>
                <X size={16} className="button-icon-inline" />
                Huỷ
              </button>
              <button className="btn-primary" type="button" onClick={handleSave}>
                <Save size={16} className="button-icon-inline" />
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
