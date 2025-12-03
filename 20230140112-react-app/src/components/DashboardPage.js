import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { User, Mail, Shield, ArrowRight, Calendar, Clock } from 'lucide-react';

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: '', email: '', role: '' });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Timer untuk jam
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser({
        nama: decoded.nama || 'Pengguna',
        email: decoded.email || '-',
        role: decoded.role || 'mahasiswa'
      });
    } catch (error) {
      navigate('/login');
    }
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    // Background full screen dengan gradient mesh
    <div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center p-4">
      {/* Dekorasi Background Blob */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* Kolom Kiri: Welcome Message */}
        <div className="flex flex-col justify-center space-y-6">
            <div>
                <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Portal Presensi</h2>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user.nama}!</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    Selamat datang kembali. Jangan lupa untuk melakukan presensi hari ini agar kehadiranmu tercatat.
                </p>
            </div>

            {/* Widget Jam Kecil */}
            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm inline-flex items-center space-x-4 w-fit">
                <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Hari ini</p>
                    <p className="text-sm font-semibold text-gray-800">
                        {currentDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="h-8 w-px bg-gray-300 mx-2"></div>
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                    <Clock size={20} />
                </div>
                <p className="text-xl font-mono font-bold text-gray-800">
                    {currentDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            <button 
                onClick={() => navigate('/presensi')}
                className="group w-full sm:w-auto flex items-center justify-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
                <span>Mulai Presensi</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Kolom Kanan: Info Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition duration-500">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                <div className="absolute -bottom-10 left-8 p-1 bg-white rounded-full">
                    <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-white shadow-md">
                        {user.nama.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
            
            <div className="pt-12 px-8 pb-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 mr-4">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Nama Lengkap</p>
                            <p className="font-semibold text-gray-800">{user.nama}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600 mr-4">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Alamat Email</p>
                            <p className="font-semibold text-gray-800">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-pink-600 mr-4">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Hak Akses</p>
                            <span className="inline-block mt-1 px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full border border-pink-200">
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;