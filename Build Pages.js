// One-off build helper (not part of the running app) — assembles the
// remaining static pages from a shared nav/footer + page-specific content,
// so every page stays visually consistent without a templating engine.
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "public");

const nav = (active) => `
<header class="nav">
  <div class="container nav-inner">
    <a href="/" class="brand">
      <img src="/images/certifyx-logo.jpeg" alt="CertifyX logo" />
      CertifyX
    </a>
    <nav>
      <ul class="nav-links" id="nav-links">
        <li><a href="/" class="nav-link" data-page="home">Home</a></li>
        <li><a href="/about.html" class="nav-link" data-page="about">About</a></li>
        <li><a href="/community.html" class="nav-link" data-page="community">Community</a></li>
        <li><a href="/contact.html" class="nav-link" data-page="contact">Contact</a></li>
        <li class="nav-cta"><a href="/community.html" class="btn btn-gold">Create certificate</a></li>
      </ul>
    </nav>
    <button class="nav-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
  </div>
</header>`;

const footer = `
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">CertifyX</div>
        <p class="footer-tagline">A lightweight certificate generator built for tech clubs and campus communities.</p>
        <div class="social-row mt-24">
          <a class="social-icon" data-social="email" href="mailto:sraj2232007@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24"><path d="M2 5.5A2.5 2.5 0 014.5 3h15A2.5 2.5 0 0122 5.5v13a2.5 2.5 0 01-2.5 2.5h-15A2.5 2.5 0 012 18.5v-13zm2.2.5l7.8 6.2L19.8 6H4.2zM20 8.3l-7.4 5.9a1 1 0 01-1.2 0L4 8.3v10.2h16V8.3z"/></svg>
          </a>
          <a class="social-icon" data-social="x" href="https://x.com/raj95725" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.3l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z"/></svg>
          </a>
          <a class="social-icon" data-social="instagram" href="https://www.instagram.com/sraj2232007" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2c2.7 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.
          </a>
          <a class="social-icon" data-social="linkedin" href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3A2.05 2.05 0 102.7 5.05 2.05 2.05 0 004.75 3zM21 13.85C21 10.1 19 8.35 16.3 8.35a4.1 4.1 0 00-3.35 1.8V8.5H9.5V21H13v-6.2c0-1.63.3-3.2 2.33-3.2 2 0 2.02 1.86 2.02 3.3V21H21v-7.15z"/></svg>
          </a>
        </div>
      </div>
      <div>
        <div class="footer-heading">SITE</div>
        <ul class="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/community.html">Community</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-heading">CONTACT</div>
        <ul class="footer-links">
          <li><a data-social="email" data-show-text="true" href="mailto:sraj2232007@gmail.com">sraj2232007@gmail.com</a></li>
          <li><a data-social="x" href="https://x.com/raj95725" target="_blank" rel="noopener noreferrer">X / Twitter</a></li>
          <li><a data-social="instagram" href="https://www.instagram.com/sraj2232007" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a data-social="linkedin" href="https://www.linkedin.com/in/sraj2232007" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
        <button class="copy-email-btn" type="button" data-copy-email="sraj2232007@gmail.com">Copy email</button>
        <span class="copy-email-status" role="status" aria-live="polite"></span>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 CertifyX. All rights reserved.</span>
      <span>Built for Enigma Technical Club · IEEE · CSI · SDC</span>
    </div>
  </div>
</footer>`;

function page({ title, description, bodyPage, extraCss = "", content, extraScripts = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="icon" type="image/jpeg" href="/images/certifyx-logo.jpeg" />
<link rel="stylesheet" href="/css/style.css" />
<link rel="stylesheet" href="/css/pages.css" />
${extraCss}
</head>
<body data-page="${bodyPage}">
${nav(bodyPage)}
<main>
${content}
</main>
${footer}
<script src="/js/main.js"></script>
${extraScripts}
</body>
</html>
`;
}

// ===== ABOUT =====
const aboutContent = `
  <section class="page-hero container">
    <span class="eyebrow">About</span>
    <h1 class="mt-16">A small tool, built for club events</h1>
    <p class="lede mt-16">CertMint started as an internal tool to stop hand-editing the same certificate template every event season. Now it's open for any club on campus to use.</p>
  </section>

  <section class="container section">
    <div class="about-grid">
      <div>
        <h2>Why it exists</h2>
        <p class="mt-16">Every workshop, hackathon or seminar ends the same way: a spreadsheet of names and a designer stuck editing fifty certificates one by one. CertMint replaces that with a form, a live preview, and a one-click PDF.</p>
        <p class="mt-16">It's deliberately small — one clear job, done well, rather than a bloated events platform.</p>
      </div>
      <div>
        <h2>How it's built</h2>
        <ul class="timeline mt-24">
          <li><span class="t-year">UI</span><span>Static HTML/CSS/JS pages served by Express — no build step required.</span></li>
          <li><span class="t-year">API</span><span>A single <code>/api/generate</code> endpoint renders each certificate as a PDF with pdfkit.</span></li>
          <li><span class="t-year">Config</span><span>Club links and socials live in one file, <code>server/data/config.js</code>.</span></li>
        </ul>
      </div>
    </div>
  </section>

  <section class="container section-tight" style="border-top:1px solid var(--line);">
    <div class="center" style="max-width:560px;margin:0 auto;">
      <h2>Ready to try it?</h2>
      <p class="lede center mt-16" style="margin-left:auto;margin-right:auto;">Generate your first certificate in under a minute.</p>
      <a href="/community.html" class="btn btn-primary mt-24">Go to community</a>
    </div>
  </section>
`;

fs.writeFileSync(
  path.join(OUT, "about.html"),
  page({
    title: "About — CertifyX",
    description: "Why CertifyX exists and how it's built.",
    bodyPage: "about",
    content: aboutContent
  })
);

// ===== COMMUNITY =====
const communityContent = `
  <section class="page-hero container">
    <span class="eyebrow">Community</span>
    <h1 class="mt-16">Join our community</h1>
    <p class="lede mt-16">Connect with other club members and stay updated on the latest events and announcements.</p>
  </section>

  <section class="container section">
    <div class="community-grid">
      <div>
        <h2>Enigma Technical Club</h2>
        <p class="mt-16">The Enigma Technical Club is a student-led organization dedicated to promoting technical skills and innovation among its members.</p>
      </div>
      <div>
        <h2>IEEE</h2>
        <p class="mt-16">IEEE is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity.</p>
      </div>
      <div>
        <h2>Computer Society of India</h2>
        <p class="mt-16">The Computer Society of India is a professional society for computer science and engineering professionals in India.</p>
      </div>
      <div>
        <h2>Student Development Club</h2>
        <p class="mt-16"> Student Development Council focuses on providing opportunities for students to develop their leadership and interpersonal skills.</p>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(
  path.join(OUT, "community.html"),
  page({
    title: "Community — CertifyX",
    description: "Enigma Technical Club, IEEE, Computer Society of India and SDC.",
    bodyPage: "community",
    content: communityContent
  })
);
// ===== CONTACT =====
const contactContent = `
  <section class="page-hero container">
    <span class="eyebrow">Contact</span>
    <h1 class="mt-16">Get in touch</h1>
    <p class="lede mt-16">Questions, bugs, or want your club added to the community page? Reach out below.</p>
  </section>

  <section class="container section">
    <div class="contact-grid">
      <div>
        <h2>Send a message</h2>
        <p class="mt-16">This form opens your email client with the message pre-filled — no data is stored on the server.</p>
        <form class="mt-32" id="contact-form">
          <div class="field">
            <label for="c-name">Your name</label>
            <input id="c-name" type="text" required />
          </div>
          <div class="field">
            <label for="c-email">Your email</label>
            <input id="c-email" type="email" required />
          </div>
          <div class="field">
            <label for="c-message">Message</label>
            <input id="c-message" type="text" placeholder="How can we help?" required />
          </div>
          <button type="submit" class="btn btn-primary">Send message</button>
        </form>
      </div>

      <div class="contact-card">
        <div class="footer-heading">DIRECT</div>
        <ul class="footer-links">
          <li><a data-social="email" data-show-text="true" href="mailto:sraj2232007@gmail.com">Email</a></li>
        </ul>
        <div class="footer-heading">SOCIAL</div>
        <div class="social-row">
          <a class="social-icon" data-social="x" href="https://x.com/raj95725" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-7.2L4.5 22H1.3l8.1-9.3L1 2h7.2l5 6.6L18.9 2zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20z"/></svg>
          </a>
          <a class="social-icon" data-social="instagram" href="https://www.instagram.com/sraj2232007" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2c2.7 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 015.44 2.53c.64-.25 1.37-.42 2.
          <li><a href="/community.html">See all partner clubs →</a></li>
        </ul>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(
  path.join(OUT, "contact.html"),
  page({
    title: "Contact — CertifyX",
    description: "Get in touch with the CertifyX team.",
    bodyPage: "contact",
    content: contactContent,
    extraScripts: `<script>
document.getElementById('contact-form').addEventListener('submit', function(e){
  e.preventDefault();
  var name = document.getElementById('c-name').value;
  var email = document.getElementById('c-email').value;
  var msg = document.getElementById('c-message').value;
  var subject = encodeURIComponent('Message from ' + name);
  var body = encodeURIComponent(msg + '\\n\\n— ' + name + ' (' + email + ')');
  window.location.href = 'mailto:hello@certifyx.dev?subject=' + subject + '&body=' + body;
});
</script>`
  })
);

console.log("Built: about.html, community.html, contact.html");