const { Presensi, User } = require("../models");
const { Op } = require("sequelize"); 
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');
// --- TAMBAHAN MODUL 10: Import Multer & Path ---
const multer = require('multer');
const path = require('path');

const timeZone = "Asia/Jakarta";

// --- TAMBAHAN MODUL 10: Konfigurasi Multer ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pastikan folder 'uploads' ada di root project backend
    },
    filename: (req, file, cb) => {
        // Format nama file: userId-timestamp.extensi
        // Menggunakan req.user.id yang didapat dari middleware auth
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

// Export middleware upload untuk dipakai di router
exports.upload = multer({ storage: storage, fileFilter: fileFilter });


// 1. CHECK-IN (Modul 9 Lokasi + Modul 10 Foto)
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    
    // Ambil data dari Body (Lokasi)
    const { latitude, longitude } = req.body; 
    
    // --- TAMBAHAN MODUL 10: Ambil Path Foto ---
    // Jika ada file terupload, ambil path-nya. Jika tidak, null.
    const buktiFoto = req.file ? req.file.path : null;

    // Logic Validasi Tanggal (Cek Double Checkin)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingRecord = await Presensi.findOne({
      where: {
        userId: userId, 
        checkIn: { [Op.between]: [startOfDay, endOfDay] }
      },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // CREATE RECORD: Simpan Lokasi & Foto
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      // Modul 9: Lokasi
      latitude: latitude || null, 
      longitude: longitude || null,
      // Modul 10: Foto
      buktiFoto: buktiFoto 
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: newRecord.latitude,
      longitude: newRecord.longitude,
      buktiFoto: newRecord.buktiFoto // Sertakan di response
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil! Foto & Lokasi tercatat.`,
      data: formattedData,
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 2. CHECK-OUT (Tidak berubah, tidak butuh foto)
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({ message: "Sesi tidak ditemukan atau sudah checkout." });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: recordToUpdate.latitude,
      longitude: recordToUpdate.longitude
    };

    res.json({ message: `Selamat jalan ${userName}, check-out berhasil!`, data: formattedData });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 3. DELETE PRESENSI
exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const presensiId = req.params.id;
        const recordToDelete = await Presensi.findByPk(presensiId);

        if (!recordToDelete) return res.status(404).json({ message: "Data tidak ditemukan." });
        if (recordToDelete.userId !== userId) return res.status(403).json({ message: "Akses ditolak." });

        await recordToDelete.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error server", error: error.message });
    }
};

// 4. UPDATE PRESENSI
exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validasi gagal.", errors: errors.array() });

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body; 
    
    if (!checkIn && !checkOut) return res.status(400).json({ message: "Body kosong." });
    
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) return res.status(404).json({ message: "Data tidak ditemukan." });

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    await recordToUpdate.save();

    res.json({ message: "Data berhasil diperbarui.", data: recordToUpdate });
  } catch (error) {
    res.status(500).json({ message: "Error server", error: error.message });
  }
};