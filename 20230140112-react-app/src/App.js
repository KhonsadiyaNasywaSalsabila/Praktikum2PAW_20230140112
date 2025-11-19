import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    // Pastikan Tailwind CSS CDN sudah ditambahkan di public/index.html
    <Router>
      <div>
        {/* Navigasi yang lebih stylish untuk mempermudah akses */}
        <nav className="p-4 bg-white shadow-md border-b flex justify-start space-x-6">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150">Login</Link>
          <Link to="/register" className="text-green-600 hover:text-green-800 font-medium transition duration-150">Register</Link>
          {/* Tambahkan Dashboard di sini juga untuk navigasi cepat */}
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-800 font-medium transition duration-150">Dashboard</Link>
        </nav>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Default route / akan mengarahkan ke Login */}
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;