require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* ================= MAIL TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY ✅");
  }
});


/* ================= SEND EMAIL ================= */

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing fields",
    });
  }

  try {

    /* ===== ADMIN EMAIL ===== */
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Portfolio Message from ${name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });

    /* ===== AUTO REPLY ===== */
    await transporter.sendMail({
      from: `"Advait Kulkarni" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for contacting me 🙌",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thanks for reaching out!</p>
        <p>I received your message and will reply soon.</p>
        <br/>
        <p><b>Your Message:</b></p>
        <p>${message}</p>
        <br/>
        <p>— Advait Kulkarni</p>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
});