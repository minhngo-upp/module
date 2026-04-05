import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        {/* Placeholders for other routes */}
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<div className="page-header"><h1 className="page-title">Cài đặt hệ thống</h1></div>} />
      </Route>
    </Routes>
  );
}

export default App;
