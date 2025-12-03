// controllers/reportController.js
const { Presensi, User } = require('../models');
const { Op } = require('sequelize'); 
const { validationResult } = require('express-validator');

exports.getDailyReport = async (req, res) => {
  // 1. Validasi Input (Cek apakah format tanggal valid)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Parameter filter tidak valid",
      errors: errors.array(),
    });
  }

  try {
    // 2. Ambil parameter dari Query URL
    // Frontend akan mengirim: ?tanggalMulai=...&tanggalSelesai=...&nama=...
    const { tanggalMulai, tanggalSelesai, nama } = req.query;

    // 3. Setup Filter Tanggal (Wajib ada sesuai validasi)
    const startDate = new Date(tanggalMulai);
    startDate.setHours(0, 0, 0, 0); 

    const endDate = new Date(tanggalSelesai);
    endDate.setHours(23, 59, 59, 999);

    // Filter untuk tabel PRESENSI (Berdasarkan Waktu)
    const presensiWhereClause = {
      checkIn: {
        [Op.between]: [startDate, endDate]
      }
    };

    // 4. Setup Filter Nama (Relasi ke tabel USER)
    // Sesuai instruksi UCP poin 19: "Kolom nama dari tabel presensi harus dihapus"
    // Jadi kita mencari nama di tabel User.
    const userIncludeOption = {
        model: User,
        as: 'user', // Pastikan alias ini sesuai di models/index.js (biasanya 'user' atau 'User')
        attributes: ['nama', 'email'], // Ambil data yg diperlukan saja
    };

    // Jika user mengetik nama di pencarian, filter ditambahkan ke userIncludeOption
    if (nama) {
        userIncludeOption.where = {
            nama: {
                [Op.like]: `%${nama}%` // Query LIKE untuk pencarian partial
            }
        };
    }

    // 5. Eksekusi Query
    const reports = await Presensi.findAll({
      where: presensiWhereClause, // Filter Tanggal di Presensi
      include: [userIncludeOption], // Filter Nama di User
      order: [['checkIn', 'ASC']]
    });

    res.status(200).json({
      message: `Menampilkan ${reports.length} data laporan`,
      data: reports,
    });

  } catch (error) {
    console.error("Error Report:", error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};