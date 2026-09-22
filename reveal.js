// Scroll-reveal expects elements to start with the "reveal" class (hidden
// state) and adds "is-visible" (revealed state) the first time each one
// enters the viewport; both classes' actual CSS live in style.css, not here.
//
// The sidebar nav is real, static markup (not injected here); this module
// only toggles which of its links carries "is-active" as sections scroll
// through view.

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setupReveal(reducedMotion) {
  const sections = document.querySelectorAll("main > section");

  if (reducedMotion || typeof IntersectionObserver === "undefined") {
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

function setupActiveNav() {
  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll('.side-nav a[href^="#"]');

  if (!sections.length || !navLinks.length || typeof IntersectionObserver === "undefined") {
    return;
  }

  const linkByHash = new Map();
  navLinks.forEach((link) => linkByHash.set(link.getAttribute("href"), link));

  // A tall band around the vertical center of the viewport: whichever
  // section is crossing it counts as "current," which reads better than
  // triggering the moment a section's top edge merely appears.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = linkByHash.get(`#${entry.target.id}`);
        if (!link) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

export function initReveal() {
  try {
    const reducedMotion = prefersReducedMotion();
    setupReveal(reducedMotion);
    setupActiveNav();
  } catch (err) {
    console.warn("reveal.js: failed to initialize scroll reveal/nav.", err);
  }
}
