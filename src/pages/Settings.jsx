import React, { useState } from 'react';
import { doctorProfileMock, nurseAccessPatientsMock, nursesMock } from '../mockData';
import './Settings.css';

import DoctorProfileWorkspace from '../components/settings/DoctorProfileWorkspace';
import NurseManagementWorkspace from '../components/settings/NurseManagementWorkspace';

export default function Settings() {
  // In a real app, this would be managed by Redux/Context/API queries
  const [doctorProfile, setDoctorProfile] = useState(doctorProfileMock);

  return (
    <div className="settings-page">
      <div className="page-header settings-header mb-2">
        <div>
          <h1 className="page-title">Cài đặt</h1>
          <p className="page-subtitle">
            Môi trường quản lý hồ sơ bác sĩ và hệ thống phân quyền điều dưỡng theo dõi bệnh nhân.
          </p>
        </div>
      </div>

      <section className="settings-grid">
        {/* Vùng không gian chỉnh sửa Hồ sơ bác sĩ (View Mode/Edit Mode) */}
        <DoctorProfileWorkspace 
          profile={doctorProfile} 
          onSave={setDoctorProfile} 
        />

        {/* Vùng không gian quản lý Điều dưỡng và Cấp quyền (Kèm Dual list, Filters, Dirty State) */}
        <NurseManagementWorkspace 
          initialNurses={nursesMock} 
          allPatients={nurseAccessPatientsMock} 
        />
      </section>
    </div>
  );
}
