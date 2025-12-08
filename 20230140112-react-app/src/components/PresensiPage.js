import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, LogIn, LogOut, AlertCircle, CheckCircle, Camera, RefreshCcw } from 'lucide-react';
import Webcam from 'react-webcam'; // Import Webcam

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
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
  
  // State Lokasi
  const [coords, setCoords] = useState(null); 
  const [locationError, setLocationError] = useState('');

  // State Kamera
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  const navigate = useNavigate();

  // 1. Jam Realtime
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Ambil Lokasi
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => setLocationError("Gagal mendeteksi lokasi. Izinkan akses GPS.")
        );
    } else {
        setLocationError("Browser tidak mendukung Geolocation.");
    }
  }, []);

  // 3. Fungsi Capture Foto
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return null; }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleAction = async (type) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Validasi Khusus Check-In: Wajib Lokasi & Foto
    if (type === 'in') {
        if (!coords) {
            setStatus('error');
            setMessage("Lokasi belum ditemukan.");
            return;
        }
        if (!image) {
            setStatus('error');
            setMessage("Wajib ambil foto selfie dulu!");
            return;
        }
    }

    setMessage(''); setStatus('idle');

    try {
      const endpoint = type === 'in' ? '/check-in' : '/check-out';
      
      let response;

      if (type === 'in') {
          // --- LOGIKA FORM DATA (Modul 10) ---
          // Ubah base64 image ke Blob
          const blob = await (await fetch(image)).blob();
          
          const formData = new FormData();
          formData.append('latitude', coords.lat);
          formData.append('longitude', coords.lng);
          formData.append('image', blob, 'selfie.jpg'); // Key 'image' harus sama dengan middleware backend

          response = await axios.post(`${API_URL}${endpoint}`, formData, {
              headers: { 
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data' // Penting untuk upload file
              }
          });
      } else {
          // Check-Out (Biasa, JSON)
          response = await axios.post(`${API_URL}${endpoint}`, {}, {
              headers: { Authorization: `Bearer ${token}` }
          });
      }
      
      setMessage(response.data.message);
      setStatus('success');
      // Reset foto setelah sukses
      if(type === 'in') setImage(null);

    } catch (err) {
      setStatus('error');
      setMessage(err.response ? err.response.data.message : "Gagal memproses presensi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">Presensi Lengkap</h2>
            <p className="text-gray-500 mt-1">Lokasi + Selfie</p>
        </div>

        {/* --- 1. PETA (Leaflet) --- */}
        <div className="mb-4 rounded-xl overflow-hidden shadow-sm border h-48 relative z-0">
            {coords ? (
                <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <Marker position={[coords.lat, coords.lng]}><Popup>Anda di sini</Popup></Marker>
                </MapContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    <MapPin className="mr-2"/> {locationError || "Mencari Lokasi..."}
                </div>
            )}
        </div>

        {/* --- 2. KAMERA (Webcam) --- */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-sm border bg-black h-64 flex items-center justify-center relative">
            {image ? (
                <img src={image} alt="Selfie" className="w-full h-full object-cover" />
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{ facingMode: "user" }}
                />
            )}
            
            {/* Tombol Kamera Overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                {!image ? (
                    <button onClick={capture} className="bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:scale-110 transition">
                        <Camera size={28} />
                    </button>
                ) : (
                    <button onClick={() => setImage(null)} className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:scale-110 transition">
                        <RefreshCcw size={28} />
                    </button>
                )}
            </div>
        </div>

        {/* Status Notification */}
        {message && (
             <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {status === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                 {message}
             </div>
        )}

        {/* Tombol Check-In / Out */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAction('in')}
            className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex justify-center items-center gap-2"
            disabled={!coords || !image} // Disable jika belum ada lokasi/foto
          >
            <LogIn size={18}/> Check-In
          </button>
          <button
            onClick={() => handleAction('out')}
            className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex justify-center items-center gap-2"
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