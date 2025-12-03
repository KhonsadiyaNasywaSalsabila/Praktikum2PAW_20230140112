// src/components/ReportPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Sesuaikan port backend Anda (biasanya 3001 berdasarkan server.js Anda)
const API_URL = "http://localhost:3001/api/reports"; 

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State untuk filter
  const [searchTerm, setSearchTerm] = useState("");
  // Default tanggal hari ini (Format YYYY-MM-DD) agar query tidak kosong saat load awal
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Mengirim parameter query ke backend sesuai routes/reports.js
        params: {
            nama: searchTerm,
            tanggalMulai: startDate,
            tanggalSelesai: endDate
        }
      };

      setError(null);
      // Panggil API GET /daily
      const response = await axios.get(`${API_URL}/daily`, config);
      setReports(response.data.data);
      
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
         setError("Akses Ditolak: Halaman ini khusus untuk Admin.");
      } else if (err.response && err.response.data.message) {
         setError(err.response.data.message); // Tampilkan pesan validasi backend
      } else {
         setError("Gagal mengambil data laporan.");
      }
      setReports([]); // Kosongkan tabel jika error
    }
  };

  // Panggil fetchReports saat komponen dimuat
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]); 

  // Handle submit form pencarian
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            Laporan Presensi Harian
          </h1>
    
          {/* Form Filter & Pencarian */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-end">
            
            {/* Filter Tanggal Mulai */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tanggal Mulai</label>
                <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filter Tanggal Selesai */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Tanggal Selesai</label>
                <input 
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Input Pencarian Nama */}
            <div className="flex-grow">
                <label className="text-sm text-gray-600 mb-1">Cari Nama</label>
                <input
                  type="text"
                  placeholder="Nama mahasiswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
            >
              Terapkan Filter
            </button>
          </form>
    
          {/* Tampilan Error */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
                <p>{error}</p>
            </div>
          )}
    
          {/* Tabel Data */}
          {!error && (
            <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Check-In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waktu Check-Out
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length > 0 ? (
                    reports.map((presensi) => (
                      <tr key={presensi.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {/* Sesuai soal: Nama diambil dari relasi User */}
                          {presensi.user ? presensi.user.nama : "User Tidak Dikenal"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(presensi.checkIn).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                            dateStyle: "medium", 
                            timeStyle: "medium"
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {presensi.checkOut
                            ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                                timeZone: "Asia/Jakarta",
                                dateStyle: "medium", 
                                timeStyle: "medium"
                              })
                            : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Belum Checkout</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic">
                        Tidak ada data ditemukan pada rentang tanggal dan nama ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
}

export default ReportPage;