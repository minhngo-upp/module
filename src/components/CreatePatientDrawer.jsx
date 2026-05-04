import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  createInitialPatientDraft,
  draftToPatientListItem,
  generatePatientCode,
  savePatientDraft,
} from '../utils/patientDrafts';
import './CreatePatientDrawer.css';

const initialForm = {
  fullName: '',
  phone: '',
  age: '',
  birthDate: '',
  gender: '',
  occupation: '',
  assignedDoctor: '',
  status: 'Mới tiếp nhận',
};

const doctors = ['BS. Nguyễn Văn A', 'BS. Trần Minh Châu', 'CNDD. Lê Thu Hà', 'BS. Nguyễn Hồng Vân'];

function getBirthYearFromInput(formData) {
  if (formData.birthDate) return new Date(formData.birthDate).getFullYear();
  const age = Number(formData.age);
  return Number.isFinite(age) && age > 0 ? new Date().getFullYear() - age : null;
}

export default function CreatePatientDrawer({ isOpen, onClose, existingPatients, onSuccess }) {
  const navigate = useNavigate();
  const patientCode = useMemo(() => generatePatientCode(existingPatients), [existingPatients]);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const duplicateCandidate = useMemo(() => {
    const phone = formData.phone.trim();
    const name = formData.fullName.trim().toLowerCase();
    const birthYear = getBirthYearFromInput(formData);

    return existingPatients.find((patient) => {
      const samePhone = phone.length >= 9 && patient.phone?.trim() === phone;
      const sameName = name && patient.name?.trim().toLowerCase() === name;
      const patientBirthYear = patient.age && Number(patient.age) ? new Date().getFullYear() - Number(patient.age) : null;
      const nearBirthYear = birthYear && patientBirthYear && Math.abs(patientBirthYear - birthYear) <= 1;
      return samePhone || (sameName && nearBirthYear);
    });
  }, [existingPatients, formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '', duplicate: '' }));
    if (['phone', 'fullName', 'age', 'birthDate'].includes(name)) setAllowDuplicate(false);
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Vui lòng nhập họ và tên';
    if (!formData.phone.trim()) nextErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.age && !formData.birthDate) nextErrors.age = 'Vui lòng nhập tuổi hoặc ngày sinh';
    if (!formData.gender) nextErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.assignedDoctor) nextErrors.assignedDoctor = 'Vui lòng chọn bác sĩ phụ trách';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createDraft = (shouldNavigate) => {
    if (!validateForm()) return;
    if (duplicateCandidate && !allowDuplicate) {
      setErrors((current) => ({
        ...current,
        duplicate: 'Vui lòng kiểm tra hồ sơ trùng hoặc chọn vẫn tạo bệnh nhân mới.',
      }));
      return;
    }

    setIsSubmitting(true);
    const age = formData.age || (formData.birthDate ? new Date().getFullYear() - new Date(formData.birthDate).getFullYear() : '');
    const draft = savePatientDraft(createInitialPatientDraft({ ...formData, patientCode, age }));
    onSuccess(draftToPatientListItem(draft));
    setIsSubmitting(false);

    if (shouldNavigate) {
      navigate(`/patients/new/${draft.patientCode}`);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} aria-hidden="true" />

      <div className={`patient-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <div className="drawer-header">
          <div>
            <h2 id="drawer-title" className="drawer-title">Thêm bệnh nhân mới</h2>
            <p className="drawer-subtitle">Tạo hồ sơ ban đầu để bắt đầu theo dõi</p>
          </div>
          <button className="drawer-close-btn" type="button" onClick={onClose} aria-label="Đóng">
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-intake-note">
            <strong>Tiếp nhận nhanh</strong>
            <span>Chỉ nhập thông tin tối thiểu. Phần lâm sàng sẽ hoàn thiện ở màn kế tiếp.</span>
          </div>

          {duplicateCandidate ? (
            <div className="duplicate-warning-card">
              <AlertTriangle size={19} className="warning-icon" aria-hidden="true" />
              <div className="warning-content">
                <h4>Có thể trùng hồ sơ</h4>
                <p>Tìm thấy {duplicateCandidate.name} ({duplicateCandidate.id}) có thông tin gần giống.</p>
                <div className="duplicate-actions">
                  <button className="btn-secondary btn-small" type="button" onClick={() => navigate(`/patients/${duplicateCandidate.id}`)}>
                    <Eye size={15} aria-hidden="true" />
                    Xem hồ sơ hiện có
                  </button>
                  <button className="btn-secondary btn-small" type="button" onClick={() => setAllowDuplicate(true)}>
                    Vẫn tạo bệnh nhân mới
                  </button>
                </div>
                {errors.duplicate ? <span className="error-text">{errors.duplicate}</span> : null}
              </div>
            </div>
          ) : null}

          <form
            id="create-patient-form"
            className="drawer-minimal-form"
            onSubmit={(event) => {
              event.preventDefault();
              createDraft(true);
            }}
          >
            <div className="drawer-field-section">
              <span className="drawer-field-section-title">Định danh nhanh</span>

              <div className="form-group">
                <label htmlFor="patientCode">Mã bệnh nhân</label>
                <input id="patientCode" type="text" value={patientCode} readOnly />
              </div>

              <div className="form-group">
                <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
                <input id="fullName" name="fullName" type="text" placeholder="Ví dụ: Nguyễn Văn A" value={formData.fullName} onChange={handleChange} />
                {errors.fullName ? <span className="error-text">{errors.fullName}</span> : null}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                <input id="phone" name="phone" type="text" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} />
                {errors.phone ? <span className="error-text">{errors.phone}</span> : null}
              </div>
            </div>

            <div className="drawer-field-section">
              <span className="drawer-field-section-title">Thông tin nền</span>

              <div className="two-col-grid compact">
                <div className="form-group">
                  <label htmlFor="age">Tuổi <span className="required">*</span></label>
                  <input id="age" name="age" type="number" min="0" placeholder="47" value={formData.age} onChange={handleChange} />
                  {errors.age ? <span className="error-text">{errors.age}</span> : null}
                </div>
                <div className="form-group">
                  <label htmlFor="birthDate">Hoặc ngày sinh</label>
                  <input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Giới tính <span className="required">*</span></label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {errors.gender ? <span className="error-text">{errors.gender}</span> : null}
                </div>
                <div className="form-group">
                  <label htmlFor="occupation">Nghề nghiệp</label>
                  <input id="occupation" name="occupation" type="text" placeholder="Ví dụ: Công nhân" value={formData.occupation} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="drawer-field-section">
              <span className="drawer-field-section-title">Theo dõi ban đầu</span>

              <div className="form-group">
                <label htmlFor="assignedDoctor">Bác sĩ phụ trách <span className="required">*</span></label>
                <select id="assignedDoctor" name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange}>
                  <option value="">Chọn bác sĩ / chuyên viên</option>
                  {doctors.map((doctor) => <option key={doctor} value={doctor}>{doctor}</option>)}
                </select>
                {errors.assignedDoctor ? <span className="error-text">{errors.assignedDoctor}</span> : null}
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái ban đầu</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="Mới tiếp nhận">Mới tiếp nhận</option>
                  <option value="Đang theo dõi">Đang theo dõi</option>
                  <option value="Cần chú ý">Cần chú ý</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Huỷ</button>
          <button type="button" className="btn-secondary" onClick={() => createDraft(false)} disabled={isSubmitting}>Lưu nháp</button>
          <button type="submit" form="create-patient-form" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Đang tạo...' : 'Tạo bệnh nhân'}
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
