const express = require("express");
const router = express.Router();
const { streamCertificate } = require("./generatecertificate.js");

// POST /api/generate  { name, course, org, date, signatory, template }
router.post("/generate", (req, res) => {
  const { name, course } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Recipient name is required." });
  }
  if (!course || !course.trim()) {
    return res.status(400).json({ error: "Course / event name is required." });
  }

  try {
    streamCertificate(res, req.body);
  } catch (err) {
    console.error("Certificate generation failed:", err);
    res.status(500).json({ error: "Could not generate certificate. Please try again." });
  }
});

module.exports = router;