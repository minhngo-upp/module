import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Menus from './pages/Menus';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import NewPatientRecord from './pages/NewPatientRecord';
import Appointments from './pages/Appointments';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="menus" element={<Menus />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/new/:id" element={<NewPatientRecord />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
