require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

/* ================= TRANSPORTER ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= SEND EMAIL ================= */

app.post("/send-email", async (req, res) => {
  console.log("API HIT");

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing fields",
    });
  }

  try {
    /* ===== ADMIN NOTIFICATION ===== */

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Message from ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    /* ===== AUTO REPLY TO CLIENT ===== */

    await transporter.sendMail({
      from: `"Advait Kulkarni" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting me 🙌",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for reaching out!</p>
        <p>I have received your message and will respond shortly.</p>
        <br/>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
        <br/>
        <p>Regards,<br/>Advait Kulkarni</p>
      `,
    });

    console.log("Emails sent successfully");

    res.json({ success: true });

  } catch (err) {
    console.error("MAIL ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});