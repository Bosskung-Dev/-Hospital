require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // serve index.html จากโฟลเดอร์ public

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { message } = req.body;

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: 'recipient@example.com', // เปลี่ยนเป็นเมลที่ต้องการส่ง
        subject: 'ข้อความจากเว็บ',
        text: message
    }, (err, info) => {
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
    console.log(`Server running at http://localhost:${PORT}`);
});
