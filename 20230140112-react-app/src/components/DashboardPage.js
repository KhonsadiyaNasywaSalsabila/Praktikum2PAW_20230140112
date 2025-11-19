import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Zap, Mail } from 'lucide-react'; 
import { jwtDecode } from 'jwt-decode'; 

function DashboardPage() {
  const navigate = useNavigate();
  // State untuk menyimpan data user dari token
  const [userName, setUserName] = useState('Pengguna'); // Diperbaiki di bawah
  const [userRole, setUserRole] = useState('N/A');
  const [userEmail, setUserEmail] = useState('');

  // Fungsi Logout dipindah ke luar useEffect 
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari local storage
    navigate('/login'); // Arahkan kembali ke halaman login
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // FIX UTAMA: Mengambil dari 'nama' (sesuai backend)
      setUserName(decoded.nama || decoded.email || 'Pengguna');
      setUserRole(decoded.role || 'mahasiswa');
      setUserEmail(decoded.email || 'Email Tidak Tersedia');

    } catch (error) {
      console.error('Gagal mendekode token:', error);
      handleLogout(); 
    }
  }, [navigate]); 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-12 rounded-xl shadow-2xl w-full max-w-lg border-t-8 border-indigo-600 transform transition duration-500 hover:scale-[1.01]">        
        <div className="flex flex-col items-center mb-6">
            <Zap className="h-12 w-12 text-indigo-600 mb-2" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 text-center">
                Portal Dashboard
            </h1>
        </div>
        
        <p className="text-xl text-gray-700 mb-8 text-center border-b pb-4">
          {/* Menggunakan userName yang sekarang sudah benar */}
          Selamat Datang, **{userName}**!
        </p>
        
        {/* Detail Kartu Informasi Pengguna */}
        <div className="space-y-4 mb-10 p-5 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-indigo-600" />
                <span className="text-md font-medium text-indigo-700">Nama: {userName}</span>
            </div>
            <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-600" />
                <span className="text-md font-medium text-indigo-700">Email: {userEmail}</span>
            </div>
            <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-indigo-600" />
                <span className="text-md font-bold text-indigo-700">Role: {userRole.toUpperCase()}</span>
            </div>
        </div>
        
        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-6 flex items-center justify-center space-x-2 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition duration-200"
        >
            <LogOut className="h-5 w-5"/>
            <span>Logout dari Sistem</span>
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;