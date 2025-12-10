
const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');


dotenv.config(); 
const app = express();
const port = process.env.PORT || 3000;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Middleware
app.use(express.json()); 
app.use(express.static('public')); 

// 4. API Endpoint untuk Chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        
        res.json({ reply: text });

    } catch (error) {
        console.error('Error di endpoint /api/chat:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
});


app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
