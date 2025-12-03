// routes/reports.js
const express = require('express');
const { query } = require('express-validator'); 
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');

// Validasi input agar tidak error saat diproses database
const validateReportQuery = [
  query('tanggalMulai')
    .notEmpty().withMessage('Tanggal Mulai harus diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
    
  query('tanggalSelesai')
    .notEmpty().withMessage('Tanggal Selesai harus diisi')
    .isISO8601().withMessage('Format tanggal tidak valid (YYYY-MM-DD)'),
    
  query('nama')
    .optional()
    .isString().trim()
];

// Endpoint: GET /api/reports/daily
// Sesuai instruksi UCP[cite: 111]: Dilindungi middleware isAdmin
router.get(
  '/daily', 
  addUserData, 
  isAdmin, 
  validateReportQuery, 
  reportController.getDailyReport
);

module.exports = router;