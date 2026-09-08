# CertifyX — Certificate Generator

A Node.js + Express website that generates print-ready certificate PDFs, with a
live canvas preview, interactive navigation, and a community section linking
out to your campus tech clubs.

## What's inside

```
certmint/
├── server/
│   ├── server.js              Express app entry point
│   ├── routes/certificate.js  POST /api/generate → streams a PDF
│   ├── utils/generateCertificate.js   PDF drawing logic (pdfkit)
│   └── data/config.js         ← EDIT THIS for socials + club links
├── public/
│   ├── index.html              Home
│   ├── about.html               About
│   ├── generate.html            Certificate generator + live preview
│   ├── community.html           Club boxes (Enigma, IEEE, CSI, SDC)
│   ├── contact.html             Contact form (opens mail client)
│   ├── css/style.css           Design system (colors, nav, footer)
│   ├── css/pages.css           Page-specific layouts
│   ├── js/main.js              Nav toggle + pulls config.js into the footer/clubs
│   └── images/logo.svg         ← REPLACE with your real logo
└── scripts/
    └── build-pages.js          Rebuilds about/generate/community/contact.html
                                 from shared nav+footer (run again after editing it)
```

## Run it

```bash
npm install
npm start
```

Open http://localhost:3000

For auto-reload during development: `npm run dev` (uses nodemon).

## Customize

**1. Your logo**
Replace `public/images/logo.svg` with your own logo file. If you'd rather use
a PNG/JPG, swap the `<img src="/images/logo.svg">` reference in the nav (in
`index.html` and `scripts/build-pages.js`) to point at your new filename, then
run `node scripts/build-pages.js` to regenerate the other pages.

**2. Socials (email / X / Instagram) and club links**
Edit `server/data/config.js` — this is the single source of truth. The footer,
and the four club boxes on the Home and Community pages, are all hydrated from
this file automatically via `/api/config`, so you only edit it in one place.

```js
socials: {
  email: "you@yourdomain.com",
  x: "https://x.com/your_handle",
  instagram: "https://instagram.com/your_handle",
  ...
},
clubs: [
  { id: "enigma", name: "Enigma Technical Club", short: "ENIGMA",
    description: "...", href: "https://...", accent: "gold" },
  ...
]
```

**3. Certificate design**
`server/utils/generateCertificate.js` draws the downloaded PDF (pdfkit).
`public/js/generate.js` draws the matching live canvas preview. They're kept
in sync manually — if you change one, mirror the change in the other.

**4. Colors / fonts**
All design tokens live at the top of `public/css/style.css` under `:root`
(`--ink`, `--paper`, `--gold`, `--teal`, `--font-display`, `--font-ui`).

**5. Adding a page**
Add a new HTML file to `public/`, and add a matching `<li><a class="nav-link">`
entry to the nav block (in `index.html` and in `scripts/build-pages.js`'s
`nav()` function) so it appears in the navigation everywhere.

## How certificate generation works

1. On `generate.html`, typing into the form redraws an HTML `<canvas>` live
   (`public/js/generate.js`) — this is instant and needs no server round-trip.
2. On submit, the form fields are POSTed as JSON to `POST /api/generate`.
3. The server (`server/utils/generateCertificate.js`) draws the same layout
   with `pdfkit` at print resolution (A4 landscape) and streams it back as a
   downloadable PDF — no temp files, nothing saved on disk.

## Notes

- No database — nothing is persisted server-side. Each request is stateless.
- The contact form uses a `mailto:` link rather than sending email from the
  server; wire it up to a real mail service (Nodemailer, Resend, etc.) if you
  want submissions to land in an inbox instead.