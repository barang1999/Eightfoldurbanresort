const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
console.log("📨 Email will be sent from:", process.env.EMAIL_USER);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.send('pong');
});

console.log("✅ /api/bookings route is now active");
app.post('/api/bookings', async (req, res) => {
  const { name, pax, time, phone, email, request, restaurant } = req.body;
  console.log("📩 Booking received:", req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS, // Gmail App password
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVERS.split(','),
      subject: 'New Table Booking',
      text: `
        Restaurant: ${restaurant}
        Name: ${name}
        Pax: ${pax}
        Time: ${time}
        Phone: ${phone}
        Email: ${email}
        Request: ${request}
      `,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 7072;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));