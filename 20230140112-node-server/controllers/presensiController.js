const { Presensi, User } = require("../models");
const { Op } = require("sequelize"); 
const { format } = require("date-fns-tz");
const { validationResult } = require('express-validator');

const timeZone = "Asia/Jakarta";

// 1. CHECK-IN (Fixed to remove 'nama' reference and include location)
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body; 
    
    // Date check logic
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

    // CREATE RECORD: Do not include 'nama' in payload
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: new Date(),
      latitude: latitude || null, 
      longitude: longitude || null
    });

    // FIX HERE: Do not reference 'nama' from newRecord in the response data object
    const formattedData = {
      userId: newRecord.userId,
      // HAPUS LINE INI: nama: newRecord.nama, 
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: newRecord.latitude,
      longitude: newRecord.longitude
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil!`,
      data: formattedData,
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// 2. CHECK-OUT (Fixed response to remove 'nama' reference)
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

    // FIX HERE: Do not reference 'nama' from recordToUpdate
    const formattedData = {
      userId: recordToUpdate.userId,
      // HAPUS LINE INI: nama: recordToUpdate.nama,
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

// 3. DELETE PRESENSI (Logika OK)
exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const presensiId = req.params.id;
        const recordToDelete = await Presensi.findByPk(presensiId);

        if (!recordToDelete) {
            return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
        }
        
        if (recordToDelete.userId !== userId) {
            return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
        }

        await recordToDelete.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// 4. UPDATE PRESENSI (Fixed to remove 'nama' logic)
exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validasi gagal.", errors: errors.array(), });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body; 
    
    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({ message: "Request body tidak berisi data yang valid.", });
    }
    
    const recordToUpdate = await Presensi.findByPk(presensiId);
    
    if (!recordToUpdate) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    // JANGAN GUNAKAN recordToUpdate.nama = ...

    await recordToUpdate.save();

    res.json({ message: "Data presensi berhasil diperbarui.", data: recordToUpdate, });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};