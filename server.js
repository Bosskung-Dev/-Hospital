const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-email', (req, res) => {
  const { text, to } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ success: false, error: 'No text provided' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to || process.env.EMAIL_USER,
    subject: 'ข้อความจากเว็บ',
    text: text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('❌ ส่งอีเมลล้มเหลว:', err);
      res.status(500).json({ success: false, error: err.toString() }); // <-- แปลงเป็น string
    } else {
      console.log('✅ ส่งสำเร็จ:', info.response);
      res.json({ success: true, response: info.response });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
