const PDFDocument = require("pdfkit");

// Brand tokens (kept in sync with public/css/style.css :root vars)
const COLORS = {
  ink: "#12213A",
  paper: "#F2EEE3",
  gold: "#B8863B",
  goldLight: "#D9B876",
  teal: "#1F8A8A",
  text: "#1A2438"
};

/**
 * Streams a generated certificate PDF straight to the HTTP response.
 * @param {import('express').Response} res
 * @param {object} data - { name, course, org, date, template, signatory }
 */
function streamCertificate(res, data) {
  const {
    name = "Recipient Name",
    course = "Web Development Bootcamp",
    org = "CertifyX",
    date = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
    signatory = "Program Coordinator",
    template = "gold"
  } = data;

  const accent = template === "teal" ? COLORS.teal : COLORS.gold;
  const accentLight = template === "teal" ? "#69C7C7" : COLORS.goldLight;

  const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${sanitizeFilename(name)}-certificate.pdf"`
  );
  doc.pipe(res);

  const pageW = doc.page.width;
  const pageH = doc.page.height;

  // Paper background
  doc.rect(0, 0, pageW, pageH).fill(COLORS.paper);

  // Outer ink border
  doc
    .lineWidth(3)
    .strokeColor(COLORS.ink)
    .rect(24, 24, pageW - 48, pageH - 48)
    .stroke();

  // Inner accent hairline
  doc
    .lineWidth(1)
    .strokeColor(accent)
    .rect(36, 36, pageW - 72, pageH - 72)
    .stroke();

  // Corner ticks (small ceremonial detail instead of generic rounded corners)
  drawCornerTicks(doc, 36, 36, pageW - 36, pageH - 36, accent);

  // Eyebrow / org line
  doc
    .fillColor(COLORS.ink)
    .font("Helvetica")
    .fontSize(12)
    .text(org.toUpperCase(), 0, 76, { align: "center", characterSpacing: 3 });

  // Headline
  doc
    .fillColor(COLORS.ink)
    .font("Times-Bold")
    .fontSize(40)
    .text("Certificate of Completion", 0, 104, { align: "center" });

  // Divider glyph
  doc
    .moveTo(pageW / 2 - 60, 160)
    .lineTo(pageW / 2 + 60, 160)
    .lineWidth(1.5)
    .strokeColor(accent)
    .stroke();

  // "Presented to"
  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor("#5B6478")
    .text("This certificate is proudly presented to", 0, 182, { align: "center" });

  // Recipient name
  doc
    .font("Times-BoldItalic")
    .fontSize(34)
    .fillColor(accent)
    .text(name, 0, 208, { align: "center" });

  // Underline under name
  const nameWidth = doc.widthOfString(name, { font: "Times-BoldItalic", size: 34 });
  const underlineW = Math.min(Math.max(nameWidth + 40, 220), pageW - 200);
  doc
    .moveTo(pageW / 2 - underlineW / 2, 254)
    .lineTo(pageW / 2 + underlineW / 2, 254)
    .lineWidth(0.75)
    .strokeColor("#C9C2AE")
    .stroke();

  // Body copy
  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor(COLORS.text)
    .text(
      `for successfully completing “${course}”, demonstrating consistent effort, curiosity and commitment throughout the program.`,
      120,
      272,
      { align: "center", width: pageW - 240, lineGap: 4 }
    );

  // Footer row: date (left), seal (center), signature (right)
  const footerY = pageH - 120;

  // Date block
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.ink)
    .text(date, 120, footerY, { width: 200 });
  doc
    .moveTo(120, footerY - 6)
    .lineTo(300, footerY - 6)
    .lineWidth(0.75)
    .strokeColor("#C9C2AE")
    .stroke();
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#5B6478")
    .text("DATE ISSUED", 120, footerY + 16, { characterSpacing: 1.5 });

  // Seal (ceremonial circle, drawn — not a generic badge icon)
  const sealCx = pageW / 2;
  const sealCy = footerY - 10;
  drawSeal(doc, sealCx, sealCy, accent, accentLight);

  // Signature block
  const sigX = pageW - 320;
  doc
    .moveTo(sigX, footerY - 6)
    .lineTo(sigX + 180, footerY - 6)
    .lineWidth(0.75)
    .strokeColor("#C9C2AE")
    .stroke();
  doc
    .font("Times-Italic")
    .fontSize(16)
    .fillColor(COLORS.ink)
    .text(signatory, sigX, footerY - 26, { width: 180, align: "center" });
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#5B6478")
    .text("SIGNATORY", sigX, footerY + 16, { width: 180, align: "center", characterSpacing: 1.5 });

  doc.end();
}

function drawCornerTicks(doc, x1, y1, x2, y2, color) {
  const len = 22;
  doc.lineWidth(2).strokeColor(color);
  // top-left
  doc.moveTo(x1, y1 + len).lineTo(x1, y1).lineTo(x1 + len, y1).stroke();
  // top-right
  doc.moveTo(x2 - len, y1).lineTo(x2, y1).lineTo(x2, y1 + len).stroke();
  // bottom-left
  doc.moveTo(x1, y2 - len).lineTo(x1, y2).lineTo(x1 + len, y2).stroke();
  // bottom-right
  doc.moveTo(x2 - len, y2).lineTo(x2, y2).lineTo(x2, y2 - len).stroke();
}

function drawSeal(doc, cx, cy, accent, accentLight) {
  const r = 30;
  doc.save();
  doc.circle(cx, cy, r).fill(accent);
  doc.circle(cx, cy, r - 5).lineWidth(1.2).strokeColor(accentLight).stroke();
  doc
    .font("Times-Bold")
    .fontSize(8.5)
    .fillColor(COLORS.paper)
    .text("CERTIFIED", cx - r, cy - 14, { width: r * 2, align: "center", characterSpacing: 1 });
  drawStar(doc, cx, cy + 6, 7, COLORS.paper);
  doc.restore();
}

// Small 5-point star drawn as a vector path (unicode star glyphs aren't in PDF base14 fonts)
function drawStar(doc, cx, cy, r, color) {
  const points = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.42;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  doc.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) doc.lineTo(points[i][0], points[i][1]);
  doc.closePath().fill(color);
}

function sanitizeFilename(str) {
  return String(str).trim().replace(/[^a-z0-9\-_]+/gi, "-").toLowerCase() || "certificate";
}

module.exports = { streamCertificate };