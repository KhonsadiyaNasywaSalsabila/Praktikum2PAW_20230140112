import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Image as ImageIcon } from "lucide-react"; // Import Icon tambahan

// URL Backend
const API_URL = "http://localhost:3001/api/reports"; 
const BASE_URL = "http://localhost:3001/"; // URL Dasar untuk akses folder uploads

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State Filter (Sesuai kode Anda)
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  // --- STATE MODAL FOTO (TAMBAHAN MODUL 10) ---
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            nama: searchTerm,
            tanggalMulai: startDate,
            tanggalSelesai: endDate
        }
      };

      setError(null);
      const response = await axios.get(`${API_URL}/daily`, config);
      setReports(response.data.data);
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
         setError("Akses Ditolak: Halaman ini khusus untuk Admin.");
      } else if (err.response && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError("Gagal mengambil data laporan.");
      }
      setReports([]); 
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            Laporan Presensi Harian
          </h1>
    
          {/* Form Filter (Kode Anda) */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tanggal Mulai</label>
                <input 
                    type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tanggal Selesai</label>
                <input 
                    type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="flex-grow">
                <label className="text-sm text-gray-600 mb-1">Cari Nama</label>
                <input 
                    type="text" placeholder="Nama mahasiswa..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <button type="submit" className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition">
              Terapkan Filter
            </button>
          </form>
    
          {error && <div className="bg-red-100 text-red-700 p-4 mb-6 rounded shadow-sm">{error}</div>}
    
          {!error && (
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama User</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Masuk</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jam Pulang</th>
                    
                    {/* --- 1. TAMBAH KOLOM JUDUL DI SINI --- */}
                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti Foto</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length > 0 ? (
                    reports.map((presensi) => (
                      <tr key={presensi.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {presensi.user ? presensi.user.nama : "User Tidak Dikenal"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(presensi.checkIn).toLocaleDateString("id-ID", {
                                weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          {new Date(presensi.checkIn).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                          {presensi.checkOut
                            ? new Date(presensi.checkOut).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })
                            : "-"}
                        </td>
                        
                        {/* --- 2. TAMBAH KOLOM DATA (THUMBNAIL) DI SINI --- */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            {presensi.buktiFoto ? (
                                <img 
                                    // Fix: Replace backslash (\) windows ke forward slash (/)
                                    src={`${BASE_URL}${presensi.buktiFoto.replace(/\\/g, '/')}`} 
                                    alt="Bukti" 
                                    className="h-12 w-12 object-cover rounded-md border border-gray-300 cursor-pointer hover:scale-110 transition-transform mx-auto shadow-sm"
                                    onClick={() => setSelectedImage(`${BASE_URL}${presensi.buktiFoto.replace(/\\/g, '/')}`)}
                                />
                            ) : (
                                <span className="text-gray-400 text-xs italic flex justify-center items-center gap-1">
                                    <ImageIcon size={16}/> No Image
                                </span>
                            )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500 italic">
                        Tidak ada data ditemukan pada rentang tanggal ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- 3. TAMBAH MODAL POPUP DI SINI (LUAR TABEL) --- */}
        {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 animate-fade-in backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                <div className="relative bg-white p-2 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition shadow-lg z-10"
                    >
                        <X size={20} />
                    </button>
                    
                    <img 
                        src={selectedImage} 
                        alt="Bukti Full" 
                        className="max-w-full max-h-[85vh] rounded-md block mx-auto"
                    />
                    <div className="text-center mt-3 text-gray-600 font-medium text-sm">
                        Bukti Kehadiran (Klik di luar untuk menutup)
                    </div>
                </div>
            </div>
        )}

    </div>
  );
}

export default ReportPage;