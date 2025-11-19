import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Dihapus: Validasi if (!name || !email || !password).
    // Kita mengandalkan validasi required dari tag HTML dan validasi dari backend.
    
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name: name,
        email: email,
        password: password,
        role: role,
      });

      setSuccess(response.data.message || 'Registrasi berhasil! Anda akan diarahkan ke Login.');
      
      // Navigasi ke /login setelah sukses
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      // Tangani error dari server (misalnya: 409 Conflict, 400 Bad Request)
      // Jika error.response ada, gunakan pesan dari backend
      const errorMessage = err.response 
        ? err.response.data.message || 'Gagal registrasi. Periksa input Anda.'
        : 'Koneksi ke server gagal. Pastikan backend berjalan.';
        
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-green-500">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Daftar Akun Baru
        </h2>

        {success && (
          <p className="text-green-600 font-medium text-sm mb-4 p-2 bg-green-50 rounded-lg text-center">{success}</p>
        )}
        {error && (
          <p className="text-red-600 font-medium text-sm mb-4 p-2 bg-red-50 rounded-lg text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role Akun</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 appearance-none transition duration-150"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200 transform hover:scale-[1.01]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Sudah punya akun? 
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium ml-1 transition duration-150">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;