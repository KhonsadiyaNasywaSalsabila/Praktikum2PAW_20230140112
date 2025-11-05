// routes/reports.js

const express = require('express');
const { query } = require('express-validator'); // <-- Import 'query'
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// --- 1. DEFINISIKAN VALIDATOR DI SINI (SEBELUM DIGUNAKAN) ---
const validateDateRange = [
  query('tanggalMulai')
    .notEmpty().withMessage('Query parameter tanggalMulai tidak boleh kosong')
    .isDate().withMessage('Format tanggalMulai harus valid (Contoh: YYYY-MM-DD)'),
    
  query('tanggalSelesai')
    .notEmpty().withMessage('Query parameter tanggalSelesai tidak boleh kosong')
    .isDate().withMessage('Format tanggalSelesai harus valid (Contoh: YYYY-MM-DD)'),
    
  // Tambahkan validasi opsional untuk 'nama'
  query('nama')
    .optional()
    .isString().withMessage('Nama harus berupa teks')
    .trim()
];

// --- 2. TERAPKAN VALIDATOR KE RUTE ---
router.get(
  '/daily', 
  [addUserData, isAdmin], // Middleware permission Anda
  validateDateRange,      // <--- TAMBAHKAN VALIDATOR DI SINI
  reportController.getDailyReport
);

// --- 3. EXPORT ROUTER DI BAGIAN PALING AKHIR ---
module.exports = router;