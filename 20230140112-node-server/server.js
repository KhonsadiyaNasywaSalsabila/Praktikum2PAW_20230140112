const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

// 1. Definisikan Port
const PORT = 3001;

// Impor Router Anda
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');
const ruteBuku = require("./routes/books");


// =========================================================
// 2. Konfigurasi CORS
// =========================================================

const allowedOrigins = [
    'http://localhost:3000', // Port default React
    'http://localhost:3002', // Port yang mungkin digunakan React
];

const corsOptions = {
    origin: function (origin, callback) {
        // Izinkan jika tidak ada origin (Postman) atau ada di daftar yang diizinkan
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS Policy: ' + origin));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};


// =========================================================
// 3. Terapkan Middleware Global (POSISI SANGAT KRITIS)
// =========================================================

// Middleware CORS (Harus di awal)
app.use(cors(corsOptions)); 

// Middleware Body Parser JSON (HARUS di sini, sebelum route apapun)
app.use(express.json());

// Middleware logging request (Morgan)
app.use(morgan("dev"));

// Middleware kustom untuk logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    // BARIS TAMBAHAN: Log req.body untuk debugging Body Parser
    if (req.method === 'POST' && req.url.includes('/api/auth/register')) {
        console.log('REQUEST BODY:', req.body); 
    }
    next();
});

// 4. Definisikan Root Route API
// =========================================================

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Home Page for API. Server is running.",
        status: "Online",
        version: "1.0"
    });
});

// 5. Terapkan Router
// =========================================================

// SEMUA ROUTE HARUS DITEMPATKAN SETELAH app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);


// 6. Error Handling Middleware
// =========================================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'Something broke!',
        details: err.message
    });
});


// 7. Mulai Server
// =========================================================

app.listen(PORT, () => {
    console.log(`🚀 Express server running at http://localhost:${PORT}/`);
});