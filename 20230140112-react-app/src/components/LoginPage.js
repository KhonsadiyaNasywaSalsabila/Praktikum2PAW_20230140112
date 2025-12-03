import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true); // Mulai loading
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password
            });
            // Simpan token
            localStorage.setItem('token', response.data.token);
            // Redirect ke dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response ? err.response.data.message : 'Login gagal. Cek koneksi server.');
        } finally {
            setIsLoading(false); // Selesai loading
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] relative overflow-hidden flex items-center justify-center p-4">
            {/* Dekorasi Background (Senada dengan Dashboard) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Kartu Login Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/50 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm">
                        <LogIn size={28} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang</h2>
                    <p className="text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
                </div>

                {/* Notifikasi Error */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {/* Tombol Login Gradient */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            <>
                                <span>Masuk Sekarang</span>
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;