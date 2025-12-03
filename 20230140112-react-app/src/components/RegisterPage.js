import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
    // STATE: Menggunakan 'name' (sesuai backend)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('mahasiswa');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            // LOGIKA: Sama persis dengan kode kamu, mengirim 'name'
            const response = await axios.post('http://localhost:3001/api/auth/register', {
                name: name, 
                email: email,
                password: password,
                role: role
            });
            
            setSuccess(response.data.message || 'Registrasi berhasil! Mengalihkan...');
            
            // Redirect otomatis setelah 1.5 detik
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (err) {
            setError(err.response ? err.response.data.message : 'Registrasi gagal. Cek input Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center p-4">
            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50 relative z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun Baru</h2>
                    <p className="text-gray-500 mt-2">Mulai perjalanan presensi digitalmu</p>
                </div>

                {/* Notifikasi Error/Success */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <p className="text-sm text-green-700 font-medium">{success}</p>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Input Nama (variable: name) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder-gray-400"
                                placeholder="Min. 6 karakter"
                                required
                            />
                        </div>
                    </div>

                    {/* Input Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Peran Akun</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ShieldCheck className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-all bg-white"
                            >
                                <option value="mahasiswa">Mahasiswa</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Register */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold bg-gray-900 hover:bg-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-5 w-5" />
                                <span>Daftar Akun</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;