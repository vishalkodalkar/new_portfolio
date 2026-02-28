const axios = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();
const express = require("express");
 const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

 
 

//* ================= SEND EMAIL (Brevo API) ================= */

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
    /* ===== ADMIN NOTIFICATION ===== */
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Portfolio Website",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: process.env.EMAIL_USER,
            name: "Admin",
          },
        ],
        subject: `📩 New Message from ${name}`,
        htmlContent: `
          <h2>New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    /* ===== AUTO REPLY TO CLIENT ===== */
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Advait Kulkarni",
          email: process.env.EMAIL_USER,
        },
        to: [
          {
            email: email,
            name: name,
          },
        ],
        subject: "Thank you for contacting me 🙌",
        htmlContent: `
          <h3>Hello ${name},</h3>
          <p>Thank you for reaching out!</p>
          <p>I have received your message and will respond shortly.</p>
          <br/>
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
          <br/>
          <p>Regards,<br/>Advait Kulkarni</p>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Emails sent successfully ✅");

    res.json({ success: true });

  } catch (error) {
    console.error("BREVO ERROR ❌:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Email sending failed",
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