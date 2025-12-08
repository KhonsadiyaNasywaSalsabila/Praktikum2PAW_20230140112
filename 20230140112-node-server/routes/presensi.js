// routes/presensi.js

const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
const { body } = require('express-validator'); // <-- HANYA IMPORT 'body'

router.use(addUserData);
router.post('/check-in', [addUserData, presensiController.upload.single('image')], presensiController.CheckIn);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.delete("/:id", presensiController.deletePresensi);

// Aturan validasi untuk UPDATE presensi
const validatePresensiUpdate = [
  body('checkIn')
    .optional() 
    .isISO8601()
    .withMessage('Format checkIn harus tanggal ISO8601 yang valid'),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Format checkOut harus tanggal ISO8601 yang valid')
];

// Rute untuk UPDATE presensi
router.put(
  "/:id", 
  validatePresensiUpdate, // <-- Menggunakan validator yang benar
  presensiController.updatePresensi
);


module.exports = router;