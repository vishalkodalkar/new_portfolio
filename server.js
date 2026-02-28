require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= API ROUTE FIRST ================= */
app.post("/send-email", async (req, res) => {
  console.log("API HIT ✅");

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing fields",
    });
  }

  try {

    /* ========= ADMIN EMAIL ========= */
    const adminMail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      html: `
        <h3>${name}</h3>
        <p>${email}</p>
        <p>${message}</p>
      `,
    });

    console.log("Admin mail sent:", adminMail.messageId);

    /* ========= AUTO REPLY ========= */
    const replyMail = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting me 🙌",
      html: `
        <h3>Hello ${name}</h3>
        <p>I received your message successfully.</p>
        <p>I will reply soon.</p>
      `,
    });

    console.log("Reply mail sent:", replyMail.messageId);

    return res.json({ success: true });

  } catch (error) {
    console.error("MAIL ERROR ❌:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/* ================= STATIC FILES ================= */
app.use(express.static(path.join(__dirname)));

/* ================= HOME ROUTE ================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});