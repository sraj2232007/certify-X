// ─────────────────────────────────────────────────────────────
// SITE CONFIG — edit this file to update socials, club links,
// and generator defaults without touching any other code.
// ─────────────────────────────────────────────────────────────

module.exports = {
  siteName: "CertifyX",
  tagline: "Certificates, minted in minutes.",

  // Replace with your real handles / links
  socials: {
    email: "sraj2232007@gmail.com",
    x: "https://x.com/sraj2232007",
    instagram: "https://instagram.com/its_rajsachin999?igsi=MTBlNDdsMXVkdTg3",
    github: "https://github.com/sraj2232007",
      linkedin: "https://www.linkedin.com/in/sraj2232007"
  },

  // Club / community boxes shown on the Community page.
  // "href" is where the box redirects when clicked.
  clubs: [
    {
      id: "enigma",
      name: "Enigma Technical Club",
      short: "ENIGMA",
      logo: "/WhatsApp%20Image%202026-02-10%20at%2011.11.25%20PM.jpeg",
      description: "Campus tech collective for builders — hackathons, workshops and project sprints.",
      href: "/Enigma/",
      accent: "gold"
    },
    {
      id: "ieee",
      name: "IEEE Student Branch",
      short: "IEEE",
      logo: "/WhatsApp%20Image%202026-09-03%20at%202.48.03%20PM.jpeg",
      description: "World's largest technical professional body — talks, papers and chapter events.",
      href: "/IEEE/",
      accent: "teal"
    },
    {
      id: "csi",
      name: "Computer Society of India",
      short: "CSI",
      logo: "/WhatsApp%20Image%202026-09-03%20at%202.43.13%20PM.jpeg",
      description: "National body for computing professionals and students — seminars & certifications.",
      href: "/CSI/index.html",
      accent: "gold"
    },
    {
      id: "sdc",
      name: "Student Development Council",
      short: "SDC",
      logo: "/WhatsApp%20Image%202026-09-03%20at%202.41.21%20PM.jpeg",
      description: "In-house dev cell shipping real products for the campus community.",
      href: "/SDC/",
      accent: "teal"
    }
  ]
};