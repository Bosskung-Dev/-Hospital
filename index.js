require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API: รับข้อความจาก frontend แล้วส่งอีเมล
app.post('/send-email', (req, res) => {
    const { text, to } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'No text provided' });
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to || process.env.EMAIL_USER, // ถ้าไม่ได้ส่ง to ให้ส่งไปที่ EMAIL_USER
        subject: 'ข้อความจากเว็บ',
        text: text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('❌ ส่งอีเมลล้มเหลว:', err);
            res.status(500).json({ error: err.toString() });
        } else {
            console.log('✅ ส่งสำเร็จ:', info.response);
            res.json({ success: true, response: info.response });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
