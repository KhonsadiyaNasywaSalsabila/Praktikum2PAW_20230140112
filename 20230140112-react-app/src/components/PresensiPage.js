import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, LogIn, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

// --- IMPORT UNTUK PETA LEAFLET ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Icon Leaflet di React (Agar marker muncul)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = "http://localhost:3001/api/presensi"; 

function AttendancePage() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [time, setTime] = useState(new Date());
  
  // --- STATE LOKASI BARU ---
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [locationError, setLocationError] = useState('');
  // -------------------------

  const navigate = useNavigate();

  // 1. Update Jam Realtime
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Ambil Lokasi Pengguna saat Halaman Dimuat (Geolocation API)
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationError(''); // Bersihkan error jika sukses
            },
            (error) => {
                console.error("Geolocation Error:", error);
                // Menampilkan error jika user menolak izin lokasi
                setLocationError("Gagal mendeteksi lokasi. Mohon izinkan akses lokasi.");
            }
        );
    } else {
        setLocationError("Browser Anda tidak mendukung Geolocation.");
    }
  }, []); // Hanya berjalan saat mount

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleAction = async (type) => {
    const config = getAuthConfig();
    if (!config) return;

    // Validasi: Wajib ada lokasi sebelum Check-In
    if (type === 'in' && !coords) {
        setStatus('error');
        setMessage("Lokasi belum ditemukan. Mohon izinkan akses lokasi di browser.");
        return;
    }

    setMessage('');
    setStatus('idle');

    try {
      const endpoint = type === 'in' ? '/check-in' : '/check-out';
      
      // Kirim data lokasi di body request hanya saat Check-In (Modul 9)
      const bodyData = type === 'in' ? {
          latitude: coords.lat,
          longitude: coords.lng
      } : {}; 

      const response = await axios.post(`${API_URL}${endpoint}`, bodyData, config);
      
      setMessage(response.data.message);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setMessage(err.response ? err.response.data.message : `Gagal melakukan ${type === 'in' ? 'Check-In' : 'Check-Out'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Presensi Lokasi</h2>
            <p className="text-gray-500 mt-2">Catat kehadiran & lokasimu</p>
        </div>

        {/* Clock Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="text-4xl font-mono font-bold text-gray-800 mb-1">
                {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <p className="text-gray-500 font-medium text-sm">
                {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>

        {/* --- MAP VISUALIZATION (LEAFLET) --- */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-gray-200">
            {coords ? (
                <MapContainer 
                    center={[coords.lat, coords.lng]} 
                    zoom={15} 
                    style={{ height: '250px', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={[coords.lat, coords.lng]}>
                        <Popup>Lokasi Presensi Anda</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div className="h-48 bg-gray-200 flex flex-col items-center justify-center text-gray-500 text-sm p-4 text-center">
                    <MapPin className="mb-2 h-6 w-6 text-indigo-500"/>
                    {locationError || "Sedang memuat lokasi..."}
                </div>
            )}
        </div>
        {/* ------------------------------------------------------------ */}

        {/* Status Notification */}
        {message && (
             <div className={`mb-4 p-3 rounded-xl text-sm flex items-start space-x-3 shadow-sm border ${
                 status === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
             }`}>
                 {status === 'success' ? <CheckCircle size={18} className="flex-shrink-0 mt-0.5"/> : <AlertCircle size={18} className="flex-shrink-0 mt-0.5"/>}
                 <span className="font-medium">{message}</span>
             </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAction('in')}
            className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-md"
            disabled={!coords} // Disable jika lokasi belum ditemukan
          >
            <LogIn size={18}/> Check-In
          </button>
          <button
            onClick={() => handleAction('out')}
            className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex justify-center items-center gap-2 shadow-md"
          >
            <LogOut size={18}/> Check-Out
          </button>
        </div>
        
        <button onClick={() => navigate('/dashboard')} className="w-full mt-6 text-center text-sm text-gray-500 hover:text-indigo-600">
            &larr; Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;