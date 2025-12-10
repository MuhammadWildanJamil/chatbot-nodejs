// 1. Import library yang dibutuhkan
const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. Konfigurasi
dotenv.config(); // Memuat variabel dari file .env
const app = express();
const port = process.env.PORT || 3000;

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Middleware
app.use(express.json()); // Untuk mem-parsing body request JSON
app.use(express.static('public')); // Untuk menyajikan file statis dari folder 'public'

// 4. API Endpoint untuk Chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        // Pilih model Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Hasilkan konten berdasarkan pesan pengguna
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        // Kirim balasan dari AI ke frontend
        res.json({ reply: text });

    } catch (error) {
        console.error('Error di endpoint /api/chat:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});

// 5. Jalankan Server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
