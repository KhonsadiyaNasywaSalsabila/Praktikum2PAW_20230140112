
const { Presensi } = require('../models');
const { Op } = require('sequelize'); 
const { validationResult } = require('express-validator');

exports.getDailyReport = async (req, res) => {
  
  // 1. Validasi (masih sama, mengecek tanggal)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Query parameter tidak valid",
      errors: errors.array(),
    });
  }

  try {
    // 2. Ambil SEMUA query parameter
    const { tanggalMulai, tanggalSelesai, nama } = req.query; // <--- TAMBAHKAN 'nama'

    // 3. Setup rentang tanggal (masih sama)
    const startDate = new Date(tanggalMulai);
    startDate.setHours(0, 0, 0, 0); 

    const endDate = new Date(tanggalSelesai);
    endDate.setHours(23, 59, 59, 999);

    // 4. --- MODIFIKASI BAGIAN INI ---
    // Buat 'where' clause dasar dengan filter tanggal
    const whereClause = {
      checkIn: {
        [Op.between]: [startDate, endDate]
      }
    };

    // 5. JIKA ADA query 'nama', tambahkan ke 'where' clause
    if (nama) {
      whereClause.nama = {
        [Op.like]: `%${nama}%` // <--- INI KODE YANG BENAR
      };
    }
    // -------------------------------

    // 6. Cari data menggunakan whereClause yang sudah dinamis
    const reports = await Presensi.findAll({
      where: whereClause,
      order: [['checkIn', 'ASC']]
    });

    if (reports.length === 0) {
      return res.status(404).json({
        message: 'Tidak ada data presensi ditemukan pada rentang tanggal dan filter nama tersebut.',
      });
    }

    res.status(200).json({
      message: `Menampilkan ${reports.length} data laporan`,
      data: reports,
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};