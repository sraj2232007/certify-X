const path = require("path");
const express = require("express");
const cors = require("cors");

const config = require("./config.js");
const certificateRoutes = require("./certificate.js");
const mailerRoutes = require("./mailer.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Expose the editable site config (socials + club links) to the frontend
app.get("/api/config", (req, res) => {
  res.json(config);
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", certificateRoutes);
app.use("/api", mailerRoutes);

// Fallback to home for unknown routes (keeps it simple, no router lib needed)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n  CertifyX running → http://localhost:${PORT}\n`);
});