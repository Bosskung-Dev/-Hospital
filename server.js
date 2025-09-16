require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ตัวอย่าง transporter ใช้ Gmail SMTP (App Password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,       // your_email@gmail.com
    pass: process.env.SMTP_PASS        // app password หรือรหัสที่อนุญาต
  }
});

// หน้า index (static served)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API: รับข้อความจาก client แล้วส่งอีเมล
app.post('/send-email', async (req, res) => {
  try {
    const { text, subject, to } = req.body;

    if (!text) {
      return res.status(400).json({ ok: false, error: 'No text provided' });
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: to || process.env.DEFAULT_TO,
      subject: subject || 'แจ้งเตือนจากแอปเสียง',
      text: text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    res.json({ ok: true, info });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
