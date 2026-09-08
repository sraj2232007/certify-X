// Shared behaviour across every page: nav toggle, active link highlighting,
// and populating footer socials / contact links from server/data/config.js
// via /api/config, so you only ever edit that one file.

(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll(".nav-link").forEach((a) =>
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
      })
    );
  }

  // Highlight the current page in the nav
  const current = document.body.dataset.page;
  document.querySelectorAll(".nav-link").forEach((a) => {
    if (a.dataset.page === current) a.classList.add("active");
  });

  // Pull config (socials + clubs) from the server and hydrate the DOM
  fetch("/api/config")
    .then((r) => r.json())
    .then((config) => hydrate(config))
    .catch(() => {
      /* Config fetch failed — page still works with static fallback markup */
    });

  function hydrate(config) {
    const emailEls = document.querySelectorAll("[data-social='email']");
    emailEls.forEach((el) => {
      el.href = `mailto:${config.socials.email}`;
      if (el.dataset.showText === "true") el.textContent = config.socials.email;
    });

    setHref("[data-social='x']", config.socials.x);
    setHref("[data-social='instagram']", config.socials.instagram);
    setHref("[data-social='github']", config.socials.github);
    setHref("[data-social='linkedin']", config.socials.linkedin);
    const instagramIcons = document.querySelectorAll(".footer .social-icon[data-social='instagram']");
    instagramIcons.forEach((icon, index) => {
      if (index > 0) icon.remove();
    });
    setSocialIcon(".social-icon[data-social='instagram']", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A4.5 4.5 0 1112 16.5 4.5 4.5 0 0112 7.5zm0 2A2.5 2.5 0 1014.5 12 2.5 2.5 0 0012 9.5zm5.25-3a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/></svg>');
    document.querySelectorAll(".footer .footer-links [data-social='instagram']").forEach((el) => el.closest("li")?.remove());
    setSocialIcon(".social-icon[data-social='linkedin']", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3A2.05 2.05 0 102.7 5.05 2.05 2.05 0 004.75 3zM21 13.85C21 10.1 19 8.35 16.3 8.35a4.1 4.1 0 00-3.35 1.8V8.5H9.5V21H13v-6.2c0-1.63.3-3.2 2.33-3.2 2 0 2.02 1.86 2.02 3.3V21H21v-7.15z"/></svg>');
    document.querySelectorAll(".about-grid .social-icon[data-social='linkedin']").forEach((el) => el.remove());
    document.querySelectorAll(".footer .social-row").forEach((row) => {
      if (!row.querySelector(".social-icon[data-social='linkedin']")) {
        const link = document.createElement("a");
        link.className = "social-icon";
        link.dataset.social = "linkedin";
        link.href = config.socials.linkedin || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", "LinkedIn");
        row.appendChild(link);
        setSocialIcon(".social-icon[data-social='linkedin']", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3A2.05 2.05 0 102.7 5.05 2.05 2.05 0 004.75 3zM21 13.85C21 10.1 19 8.35 16.3 8.35a4.1 4.1 0 00-3.35 1.8V8.5H9.5V21H13v-6.2c0-1.63.3-3.2 2.33-3.2 2 0 2.02 1.86 2.02 3.3V21H21v-7.15z"/></svg>');
      }
    });
    document.querySelectorAll(".contact-card .social-row").forEach((row) => {
      const heading = row.previousElementSibling;
      if (heading && heading.classList.contains("footer-heading")) heading.remove();
      row.remove();
    });

    // Club cards (only present on community.html / home strip)
    const clubGrid = document.querySelector("[data-clubs]");
    if (clubGrid && Array.isArray(config.clubs)) {
      clubGrid.innerHTML = config.clubs
        .map(
          (club) => `
        <a class="club-card accent-${club.accent}" href="${club.href}" target="_blank" rel="noopener noreferrer">
          <div class="club-mark">
            <img src="${escapeHtml(club.logo)}" alt="${escapeHtml(club.name)} logo" onerror="this.hidden=true; this.nextElementSibling.hidden=false" />
            <span hidden>${escapeHtml(club.short)}</span>
          </div>
          <div>
            <div class="club-name">${escapeHtml(club.name)}</div>
            <p class="club-desc">${escapeHtml(club.description)}</p>
          </div>
          <span class="club-go">Visit
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H9M17 7V15"/></svg>
          </span>
        </a>`
        )
        .join("");
      setupClubSearch(clubGrid);
    }
  }

  function setupClubSearch(clubGrid) {
    const search = document.getElementById("club-search");
    if (!search) return;

    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      const cards = [...clubGrid.querySelectorAll(".club-card")];
      let visible = 0;

      cards.forEach((card) => {
        const matches = card.textContent.toLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      clubGrid.querySelector(".club-grid-empty")?.remove();
      if (!visible) {
        const empty = document.createElement("p");
        empty.className = "club-grid-empty";
        empty.textContent = "No clubs found. Try another search.";
        clubGrid.appendChild(empty);
      }

      clubGrid.classList.toggle("is-filtering", query.length > 0);
    });
  }

  function setHref(selector, url) {
    document.querySelectorAll(selector).forEach((el) => {
      if (url) el.href = url;
    });
  }

  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const status = button.nextElementSibling;
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail);
        status.textContent = "Email copied";
      } catch {
        status.textContent = "Copy failed. Use the Email link.";
      }
    });
  });

  function setSocialIcon(selector, icon) {
    document.querySelectorAll(selector).forEach((el) => {
      el.innerHTML = icon;
    });
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }
})();