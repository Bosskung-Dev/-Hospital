require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// ให้ Express serve static files จากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// ตรวจสอบ Environment Variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️  EMAIL_USER or EMAIL_PASS not set in environment variables');
}

// ตั้งค่า Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your_email@gmail.com
    pass: process.env.EMAIL_PASS    // App password ของ Gmail
  }
});

// หน้า index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: รับข้อความจาก client แล้วส่งอีเมล
app.post('/send-email', async (req, res) => {
  try {
    const { text, subject, to } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, error: 'No text provided' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to || process.env.DEFAULT_TO,          // ถ้า client ไม่ส่งค่า to
      subject: subject || 'แจ้งเตือนจากแอปเสียง',
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    res.json({ ok: true, info });
  } catch (err) {
    console.error('❌ Error sending email:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

