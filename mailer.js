const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

function createTransporter(smtp) {
  return nodemailer.createTransport({
    host: smtp.host,
    port: Number.parseInt(smtp.port, 10) || 587,
    secure: Number.parseInt(smtp.port, 10) === 465,
    auth: { user: smtp.user, pass: smtp.pass },
    tls: { rejectUnauthorized: false }
  });
}

router.post("/test-smtp", async (req, res) => {
  const { smtp } = req.body || {};
  if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
    return res.status(400).json({ error: "host, user and pass are required" });
  }

  try {
    await createTransporter(smtp).verify();
    res.json({ ok: true, message: "SMTP connection successful" });
  } catch (error) {
    console.error("Test error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/send-email", async (req, res) => {
  const { smtp, to, subject, html, attachmentBase64, filename } = req.body || {};
  if (!smtp || !to || !subject || !attachmentBase64) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await createTransporter(smtp).sendMail({
      from: smtp.fromName ? `"${smtp.fromName}" <${smtp.user}>` : smtp.user,
      to,
      subject,
      html,
      priority: "high",
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High"
      },
      attachments: [{
        filename: filename || "certificate.png",
        content: attachmentBase64,
        encoding: "base64",
        contentType: "image/png"
      }]
    });
    res.json({ ok: true });
  } catch (error) {
    console.error("Send error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;