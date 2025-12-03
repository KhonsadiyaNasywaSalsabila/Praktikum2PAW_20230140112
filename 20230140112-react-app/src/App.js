import React from 'react';
import 'leaflet/dist/leaflet.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Hapus Link dari sini
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import AttendancePage from './components/PresensiPage';
import ReportPage from './components/ReportPage';   
import Navbar from './components/Navbar'; // Pastikan import Navbar

function App() {
  return (
    <Router>
      <div>
        {/* Navbar diletakkan di dalam Router agar fungsi useLocation bekerja */}
        <Navbar /> 
        
        {/* HAPUS BAGIAN <nav> MANUAL DISINI KARENA SUDAH ADA DI NAVBAR.JS */}
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/presensi" element={<AttendancePage />} /> 
          <Route path="/reports" element={<ReportPage />} />
          
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;