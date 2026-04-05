import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CalendarClock } from 'lucide-react';
import './Patients.css';
import { useNavigate } from 'react-router-dom';

export default function Patients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const patients = [
    { id: 'BN001', name: 'Nguyễn Thị Hoa', age: 34, gender: 'Nữ', phone: '0901234567', doctor: 'Dr. Nguyễn Văn A', lastVisit: '10/10/2023', nextVisit: '24/10/2023', status: 'Đang theo dõi' },
    { id: 'BN002', name: 'Trần Văn Nam', age: 45, gender: 'Nam', phone: '0912345678', doctor: 'Dr. Lê Thị B', lastVisit: '12/10/2023', nextVisit: '26/10/2023', status: 'Cần chú ý' },
    { id: 'BN003', name: 'Thái Bình Dương', age: 28, gender: 'Nam', phone: '0987654321', doctor: 'Dr. Nguyễn Văn A', lastVisit: '15/10/2023', nextVisit: '01/11/2023', status: 'Mới khám' },
    { id: 'BN004', name: 'Lê Hoàng Anh', age: 52, gender: 'Nữ', phone: '0909888777', doctor: 'Dr. Lê Thị B', lastVisit: '01/09/2023', nextVisit: 'Quá hạn', status: 'Tạm ngưng' },
    { id: 'BN005', name: 'Phạm Thị Lan', age: 31, gender: 'Nữ', phone: '0933444555', doctor: 'Dr. Nguyễn Văn A', lastVisit: '18/10/2023', nextVisit: '02/11/2023', status: 'Đang theo dõi' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Đang theo dõi': return 'badge-success';
      case 'Cần chú ý': return 'badge-danger';
      case 'Mới khám': return 'badge-blue';
      case 'Tạm ngưng': return 'badge-warning';
      default: return '';
    }
  };

  return (
    <div className="patients-page">
      <div className="page-header flex-between">
        <div>
          <h1 className="page-title">Danh sách Bệnh nhân</h1>
          <p className="page-subtitle">Quản lý và thống kê 124 bệnh nhân trong danh sách</p>
        </div>
        <button className="btn-primary">+ Thêm bệnh nhân</button>
      </div>

      <div className="card table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-bar table-search">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm theo Tên, SĐT, Mã BN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="toolbar-actions">
            <select className="filter-select">
              <option value="all">Bác sĩ phụ trách: Tất cả</option>
              <option value="dr1">Dr. Nguyễn Văn A</option>
              <option value="dr2">Dr. Lê Thị B</option>
            </select>
            
            <button className="btn-secondary icon-text-btn">
              <Filter size={18} />
              <span>Bộ lọc thêm</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã BN</th>
                <th>Họ Tên</th>
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
              {patients.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/patients/${p.id}`)} className="cursor-pointer">
                  <td className="font-medium">{p.id}</td>
                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar-sm">{p.name.charAt(0)}</div>
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.age} / {p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.doctor}</td>
                  <td>{p.lastVisit}</td>
                  <td className={p.nextVisit === 'Quá hạn' ? 'text-danger font-medium' : ''}>{p.nextVisit}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(p.status)}`}>{p.status}</span>
                  </td>
                  <td className="text-right actions-cell">
                    <button className="btn-icon" title="Xem hồ sơ" onClick={(e) => { e.stopPropagation(); navigate(`/patients/${p.id}`); }}>
                      <Eye size={18} />
                    </button>
                    <button className="btn-icon" title="Đặt lịch" onClick={(e) => e.stopPropagation()}>
                      <CalendarClock size={18} />
                    </button>
                    <button className="btn-icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="pagination">
          <span className="text-muted text-sm">Hiển thị 1 - 5 trong số 124 bệnh nhân</span>
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
