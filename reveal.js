// Scroll-reveal expects elements to start with the "reveal" class (hidden
// state) and adds "is-visible" (revealed state) the first time each one
// enters the viewport; both classes' actual CSS live in style.css, not here.

const NAV_LINKS = [
  { href: "#autonomy", label: "autonomy" },
  { href: "#data-science", label: "data science" },
  { href: "#ai-engineering", label: "ai engineering" },
  { href: "#about", label: "about" },
  { href: "mailto:sang_bui@mines.edu", label: "email" },
  { href: "https://linkedin.com/in/buisang", label: "linkedin" },
];

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupReveal(reducedMotion) {
  const sections = document.querySelectorAll("main > section");

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
    // No motion to opt into (or no observer support): just show everything.
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
}

function buildNav() {
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Section");

  NAV_LINKS.forEach(({ href, label }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (href.startsWith("http")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    nav.appendChild(link);
  });

  document.body.appendChild(nav);
  return nav;
}

function setupStickyNav(reducedMotion) {
  const hero = document.querySelector(".hero");
  if (!hero) {
    console.warn("reveal.js: no .hero element found, skipping sticky nav.");
    return;
  }

  const nav = buildNav();

  if (reducedMotion) {
    // Simpler path: just show the nav, no fade/scroll-driven transition.
    nav.classList.add("is-visible");
    return;
  }

  const threshold = hero.offsetHeight || window.innerHeight * 0.6;
  let visible = false;

  function onScroll() {
    const shouldShow = window.scrollY > threshold;
    if (shouldShow !== visible) {
      visible = shouldShow;
      nav.classList.toggle("is-visible", visible);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

export function initReveal() {
  try {
    const reducedMotion = prefersReducedMotion();
    setupReveal(reducedMotion);
    setupStickyNav(reducedMotion);
  } catch (err) {
    console.warn("reveal.js: failed to initialize scroll reveal/nav.", err);
  }
}
