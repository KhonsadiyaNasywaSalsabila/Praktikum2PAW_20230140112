import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { LogOut, User, Menu, X, LayoutDashboard, CheckSquare, FileText } from 'lucide-react';

function Navbar() {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // Untuk mobile menu
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    handleLogout();
                } else {
                    setUser(decoded);
                }
            } catch (error) {
                handleLogout();
            }
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const NavLink = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link 
                to={to} 
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive 
                    ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
            >
                {Icon && <Icon size={18} />}
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Area */}
                    <Link to="/dashboard" className="flex items-center space-x-2 group">
                        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-2 rounded-lg text-white group-hover:rotate-12 transition-transform duration-300">
                            <CheckSquare size={24} strokeWidth={3} />
                        </div>
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 tracking-tight">
                            Presensi<span className="text-gray-800">App</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    {user ? (
                        <div className="hidden md:flex items-center space-x-2">
                            <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                            <NavLink to="/presensi" icon={CheckSquare} label="Presensi" />
                            {user.role === 'admin' && (
                                <NavLink to="/reports" icon={FileText} label="Laporan" />
                            )}
                            
                            <div className="h-6 w-px bg-gray-300 mx-4"></div>

                            <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                <div className="bg-indigo-100 p-1.5 rounded-full">
                                    <User size={16} className="text-indigo-600" />
                                </div>
                                <div className="flex flex-col leading-tight pr-2">
                                    <span className="text-xs font-bold text-gray-700">{user.nama}</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex space-x-4">
                            <Link to="/login" className="px-5 py-2 text-indigo-600 font-bold hover:bg-indigo-50 rounded-full transition">Login</Link>
                            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition transform hover:-translate-y-0.5">Register</Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600 p-2">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown (Simple implementation) */}
            {isOpen && user && (
                <div className="md:hidden bg-white border-t p-4 space-y-2 animate-fade-in-down">
                    <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-medium">Dashboard</Link>
                    <Link to="/presensi" className="block py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-medium">Presensi</Link>
                    {user.role === 'admin' && <Link to="/reports" className="block py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-medium">Laporan</Link>}
                    <button onClick={handleLogout} className="w-full text-left py-2 px-4 rounded hover:bg-red-50 text-red-600 font-medium">Logout</button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;