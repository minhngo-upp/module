import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Patients.css';

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState('');

  const patients = [
    { id: 'BN001', name: 'Nguyễn Thị Hoa', age: 34, gender: 'Nữ', phone: '0901234567', doctor: 'Dr. Nguyễn Văn A', lastVisit: '10/10/2023', nextVisit: '24/10/2023', status: 'Đang theo dõi' },
    { id: 'BN002', name: 'Trần Văn Nam', age: 45, gender: 'Nam', phone: '0912345678', doctor: 'Dr. Lê Thị B', lastVisit: '12/10/2023', nextVisit: '26/10/2023', status: 'Cần chú ý' },
    { id: 'BN003', name: 'Thái Bình Dương', age: 28, gender: 'Nam', phone: '0987654321', doctor: 'Dr. Nguyễn Văn A', lastVisit: '15/10/2023', nextVisit: '01/11/2023', status: 'Mới khám' },
    { id: 'BN004', name: 'Lê Hoàng Anh', age: 52, gender: 'Nữ', phone: '0909888777', doctor: 'Dr. Lê Thị B', lastVisit: '01/09/2023', nextVisit: 'Quá hạn', status: 'Tạm ngưng' },
    { id: 'BN005', name: 'Phạm Thị Lan', age: 31, gender: 'Nữ', phone: '0933444555', doctor: 'Dr. Nguyễn Văn A', lastVisit: '18/10/2023', nextVisit: '02/11/2023', status: 'Đang theo dõi' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang theo dõi':
        return 'badge-success';
      case 'Cần chú ý':
        return 'badge-danger';
      case 'Mới khám':
        return 'badge-blue';
      case 'Tạm ngưng':
        return 'badge-warning';
      default:
        return '';
    }
  };

  return (
    <div className="patients-page">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Danh sách bệnh nhân</h1>
          <p className="page-subtitle">Quản lý và theo dõi 124 bệnh nhân đang hoạt động trong hệ thống</p>
        </div>
        <button className="btn-primary">+ Thêm bệnh nhân</button>
      </div>

      <div className="card table-card">
        <div className="table-toolbar">
          <div className="search-bar table-search">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              name="patients-search"
              autoComplete="off"
              aria-label="Tìm bệnh nhân theo tên, số điện thoại hoặc mã bệnh nhân"
              placeholder="Tìm theo Tên, SĐT, Mã BN…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <select className="filter-select" aria-label="Lọc theo bác sĩ phụ trách">
              <option value="all">Bác sĩ phụ trách: Tất cả</option>
              <option value="dr1">Dr. Nguyễn Văn A</option>
              <option value="dr2">Dr. Lê Thị B</option>
            </select>

            <button className="btn-secondary icon-text-btn">
              <Filter size={18} aria-hidden="true" />
              <span>Bộ lọc thêm</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ tên</th>
                <th>Tuổi / Giới</th>
                <th>SĐT</th>
                <th>Bác sĩ</th>
                <th>Khám gần nhất</th>
                <th>Tái khám</th>
                <th>Trạng thái</th>
                <th className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="font-medium">{patient.id}</td>
                  <td>
                    <Link to={`/patients/${patient.id}`} className="patient-link">
                      <div className="patient-avatar-sm">{patient.name.charAt(0)}</div>
                      <span>{patient.name}</span>
                    </Link>
                  </td>
                  <td>{patient.age} / {patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.lastVisit}</td>
                  <td className={patient.nextVisit === 'Quá hạn' ? 'text-danger font-medium' : ''}>{patient.nextVisit}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(patient.status)}`}>{patient.status}</span>
                  </td>
                  <td className="text-right actions-cell">
                    <Link className="btn-icon" to={`/patients/${patient.id}`} aria-label={`Xem hồ sơ của ${patient.name}`}>
                      <Eye size={18} aria-hidden="true" />
                    </Link>
                    <button className="btn-icon" type="button" aria-label={`Đặt lịch cho ${patient.name}`}>
                      <CalendarClock size={18} aria-hidden="true" />
                    </button>
                    <button className="btn-icon" type="button" aria-label={`Mở thêm thao tác cho ${patient.name}`}>
                      <MoreVertical size={18} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span className="text-muted text-sm">Hiển thị 1 - 5 trong tổng số 124 bệnh nhân</span>
          <div className="pagination-controls">
            <button className="btn-secondary btn-sm" disabled>Trước</button>
            <button className="btn-primary btn-sm">1</button>
            <button className="btn-secondary btn-sm">2</button>
            <button className="btn-secondary btn-sm">3</button>
            <button className="btn-secondary btn-sm">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}
