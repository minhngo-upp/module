import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, UserPlus, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CreatePatientDrawer.css';

export default function CreatePatientDrawer({ isOpen, onClose, existingPatients, onSuccess }) {
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: '',
    occupation: '',
    assignedDoctor: '',
    status: 'Mới khám',
    visitReason: '',
    contactPerson: '',
    source: '',
    notes: '',
    firstVisitDate: '',
  });

  // State for Next Steps options
  const [nextSteps, setNextSteps] = useState({
    openDetail: false,
    createAppt: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '', phone: '', dob: '', gender: '', occupation: '',
        assignedDoctor: '', status: 'Mới khám', visitReason: '',
        contactPerson: '', source: '', notes: '', firstVisitDate: '',
      });
      setNextSteps({ openDetail: false, createAppt: false });
      setErrors({});
      setDuplicateWarning(false);
    }
  }, [isOpen]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Soft duplicate check on Phone Number
    if (name === 'phone' && value.length >= 9) {
      const isDuplicate = existingPatients.some(p => p.phone && p.phone.trim() === value.trim());
      setDuplicateWarning(isDuplicate);
    } else if (name === 'phone') {
      setDuplicateWarning(false);
    }
  };

  const handleNextStepChange = (step) => {
    setNextSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(formData.phone.replace(/\s+/g,''))) {
      newErrors.phone = 'SĐT chưa đúng định dạng (9-11 số)';
    }
    if (!formData.dob) newErrors.dob = 'Vui lòng chọn ngày sinh / tuổi';
    if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
    if (!formData.assignedDoctor) newErrors.assignedDoctor = 'Vui lòng chọn người phụ trách';
    if (!formData.status) newErrors.status = 'Vui lòng chọn trạng thái';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API call delay
    setTimeout(() => {
      setIsSubmitting(false);

      // Generate a new ID (mock logic: BN + random 3 digits)
      const newId = `BN${Math.floor(Math.random() * 900) + 100}`;
      
      const newPatient = {
        id: newId,
        name: formData.name,
        age: formData.dob ? new Date().getFullYear() - new Date(formData.dob).getFullYear() : 'N/A',
        gender: formData.gender,
        phone: formData.phone,
        doctor: formData.assignedDoctor,
        lastVisit: 'Chưa có',
        nextVisit: formData.firstVisitDate ? new Date(formData.firstVisitDate).toLocaleDateString('vi-VN') : 'Sắp xếp sau',
        status: formData.status,
      };

      // Pass the new patient back to parent to prepend to list and show toast
      onSuccess(newPatient);

      // Handle Next Steps Routing
      if (nextSteps.createAppt) {
        navigate(`/appointments?newPatientId=${newId}`);
      } else if (nextSteps.openDetail) {
        navigate(`/patients/${newId}`);
      } else {
        // If neither, just close
        onClose();
      }
    }, 800);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`drawer-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div 
        className={`patient-drawer ${isOpen ? 'open' : ''}`} 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <div>
            <h2 id="drawer-title" className="drawer-title">Thêm bệnh nhân mới</h2>
            <p className="drawer-subtitle">Tạo hồ sơ ban đầu để bắt đầu theo dõi và lên lịch khám.</p>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Đóng">
            <X size={24} />
          </button>
        </div>

        <div className="drawer-body">
          <form id="create-patient-form" onSubmit={handleSubmit}>
            
            {/* Soft Duplicate Warning */}
            {duplicateWarning && (
              <div className="duplicate-warning-card">
                <AlertTriangle size={20} className="warning-icon" />
                <div className="warning-content">
                  <h4>Cảnh báo: Trùng lặp thông tin</h4>
                  <p>Đã tìm thấy hồ sơ có số điện thoại tương tự trong hệ thống. Bạn có thể kiểm tra danh sách bên dưới hoặc tiếp tục tạo nếu đây là người mới.</p>
                </div>
              </div>
            )}

            {/* SECTION A: Administrative Info */}
            <div className="drawer-section">
              <h3 className="section-title">A. Thông tin hành chính cơ bản</h3>
              
              <div className="form-group">
                <label htmlFor="name">Họ và tên <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Ví dụ: Nguyễn Văn A" 
                  value={formData.name} 
                  onChange={handleChange}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone" 
                    placeholder="Nhập 10 số" 
                    value={formData.phone} 
                    onChange={handleChange}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="dob">Ngày sinh <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="dob" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleChange}
                  />
                  {errors.dob && <span className="error-text">{errors.dob}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Giới tính <span className="required">*</span></label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="occupation">Nghề nghiệp</label>
                  <input 
                    type="text" 
                    id="occupation" 
                    name="occupation" 
                    placeholder="Ví dụ: Nhân viên VP" 
                    value={formData.occupation} 
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="assignedDoctor">Người phụ trách <span className="required">*</span></label>
                  <select id="assignedDoctor" name="assignedDoctor" value={formData.assignedDoctor} onChange={handleChange}>
                    <option value="">-- Chọn bác sĩ --</option>
                    <option value="Dr. Nguyễn Văn A">Dr. Nguyễn Văn A</option>
                    <option value="Dr. Lê Thị B">Dr. Lê Thị B</option>
                    <option value="BS. Nguyễn Hồng Vân">BS. Nguyễn Hồng Vân</option>
                    <option value="CNDD. Thu Hà">CNDD. Thu Hà</option>
                  </select>
                  {errors.assignedDoctor && <span className="error-text">{errors.assignedDoctor}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Trạng thái ban đầu <span className="required">*</span></label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Mới khám">Mới khám</option>
                    <option value="Đang theo dõi">Đang theo dõi</option>
                    <option value="Cần chú ý">Cần chú ý</option>
                  </select>
                  {errors.status && <span className="error-text">{errors.status}</span>}
                </div>
              </div>
            </div>

            {/* SECTION B: Intake Info */}
            <div className="drawer-section">
              <h3 className="section-title">B. Thông tin tiếp nhận ban đầu</h3>
              
              <div className="form-group">
                <label htmlFor="visitReason">Lý do đến khám</label>
                <textarea 
                  id="visitReason" 
                  name="visitReason" 
                  placeholder="Ví dụ: sụt cân, ăn uống kém, cần theo dõi khẩu phần..."
                  value={formData.visitReason}
                  onChange={handleChange}
                />
              </div>

              <div className="two-col-grid">
                <div className="form-group">
                  <label htmlFor="contactPerson">Người hỗ trợ (nếu có)</label>
                  <input 
                    type="text" 
                    id="contactPerson" 
                    name="contactPerson" 
                    placeholder="Tên & SĐT người thân"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="source">Nguồn bệnh nhân</label>
                  <select id="source" name="source" value={formData.source} onChange={handleChange}>
                    <option value="">-- Chọn nguồn --</option>
                    <option value="Tự đến">Tự đến</option>
                    <option value="Tái khám">Tái khám</option>
                    <option value="Từ app">Từ app</option>
                    <option value="Được giới thiệu">Được giới thiệu</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="firstVisitDate">Dự kiến khám ngày (Optional)</label>
                <input 
                  type="date" 
                  id="firstVisitDate" 
                  name="firstVisitDate"
                  value={formData.firstVisitDate}
                  onChange={handleChange}
                  style={{ width: 'auto' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú tiếp nhận</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  rows="2"
                  placeholder="Thông tin ngắn giúp bác sĩ nắm hồ sơ ban đầu"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* SECTION C: Next Steps */}
            <div className="drawer-section">
              <h3 className="section-title">C. Thiết lập bước tiếp theo</h3>
              <p className="text-muted text-sm mb-3">Tuỳ chọn hướng điều hướng sau khi lưu.</p>

              <div 
                className={`checkbox-card ${nextSteps.openDetail ? 'checked' : ''}`}
                onClick={() => handleNextStepChange('openDetail')}
              >
                <input type="checkbox" checked={nextSteps.openDetail} readOnly />
                <div className="checkbox-content">
                  <span className="checkbox-title flex items-center gap-2"><UserPlus size={16}/> Mở hồ sơ chi tiết sau khi lưu</span>
                  <span className="checkbox-desc">Chuyển sang màn hình hồ sơ để bổ sung thông tin chuyên môn.</span>
                </div>
              </div>

              <div 
                className={`checkbox-card ${nextSteps.createAppt ? 'checked' : ''}`}
                onClick={() => handleNextStepChange('createAppt')}
              >
                <input type="checkbox" checked={nextSteps.createAppt} readOnly />
                <div className="checkbox-content">
                  <span className="checkbox-title flex items-center gap-2"><CalendarPlus size={16}/> Tạo lịch khám ngay sau khi lưu</span>
                  <span className="checkbox-desc">Chuyển qua luồng lên lịch hẹn với thông tin bệnh nhân đã được điền sẵn.</span>
                </div>
              </div>
            </div>

          </form>
        </div>

        <div className="drawer-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Huỷ
          </button>
          <button type="button" className="btn-secondary" disabled={isSubmitting}>
            Lưu nháp
          </button>
          <button 
            type="submit" 
            form="create-patient-form" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Tạo bệnh nhân'}
          </button>
        </div>
      </div>
    </>
  );
}
