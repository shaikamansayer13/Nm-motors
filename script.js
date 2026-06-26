/* ==========================================================================
   NM MOTORS RUNTIME ENGINE - UPGRADED VERSION
   ========================================================================== */

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const glow = document.querySelector(".cursor-glow");
const heroImage = document.querySelector(".hero-image");
const root = document.documentElement;

/* ==========================================================================
   HEADER SCROLL EFFECT
   ========================================================================== */

window.addEventListener(
  "scroll",
  () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 30);
    }
  },
  { passive: true },
);

/* ==========================================================================
   CURSOR GLOW
   ========================================================================== */

document.addEventListener("pointermove", (e) => {
  if (!glow) return;

  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

/* ==========================================================================
   MOBILE MENU
   ========================================================================== */

function toggleMenu(force) {
  if (!mobileMenu || !menuButton) return;

  const open =
    typeof force === "boolean" ? force : !mobileMenu.classList.contains("open");

  mobileMenu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);

  menuButton.setAttribute("aria-expanded", open);
  mobileMenu.setAttribute("aria-hidden", !open);

  const spans = menuButton.querySelectorAll("span");

  if (spans.length >= 2) {
    spans[0].style.transform = open ? "translateY(4.5px) rotate(45deg)" : "";

    spans[1].style.transform = open ? "translateY(-4.5px) rotate(-45deg)" : "";
  }
}

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => toggleMenu());

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    if (href === "#") return;

    const target = document.querySelector(href);

    if (target) {
      e.preventDefault();

      toggleMenu(false);

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

/* ==========================================================================
   PAGE LOADER
   ========================================================================== */

const loader = document.querySelector(".page-loader");

if (loader) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      loader.classList.add("done");
    }, 1200);
  });
}

/* ==========================================================================
   SCROLL PROGRESS + HERO PARALLAX
   ========================================================================== */

let ticking = false;

function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  root.style.setProperty("--scroll-progress", progress.toFixed(4));

  if (heroImage && window.scrollY > 0 && window.scrollY < window.innerHeight) {
    heroImage.style.transform = `
      translate3d(0, ${window.scrollY * 0.09}px, 0)
      scale(1.03)
    `;
  } else if (heroImage && window.scrollY === 0) {
    heroImage.style.transform = "";
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true },
);

updateScrollEffects();

/* ==========================================================================
   PREMIUM REVEAL ANIMATION
   ========================================================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
  },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

/* ==========================================================================
   SERVICE CARD 3D EFFECT
   ========================================================================== */

if (window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      const rotateY = (x / bounds.width - 0.5) * 6;

      const rotateX = (y / bounds.height - 0.5) * -6;

      card.style.setProperty("--spot-x", `${x}px`);
      card.style.setProperty("--spot-y", `${y}px`);

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
      `;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

/* ==========================================================================
   MAGNETIC BUTTONS
   ========================================================================== */

document.querySelectorAll(".button-primary, .header-call").forEach((button) => {
  button.addEventListener("pointermove", (e) => {
    const bounds = button.getBoundingClientRect();

    const x = (e.clientX - bounds.left - bounds.width / 2) * 0.12;

    const y = (e.clientY - bounds.top - bounds.height / 2) * 0.12;

    button.style.transform = `
        translate3d(${x}px, ${y}px, 0)
      `;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

/* ==========================================================================
   HERO COUNTERS - PREMIUM SLOW VERSION
   ========================================================================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || "";

      const duration = 4000;
      const start = performance.now();

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);

        const value = Math.floor(progress * target);

        counter.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(animate);

      counterObserver.unobserve(counter);
    });
  },
  {
    threshold: 0.5,
  },
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

/* ==========================================================================
   HERO CONTENT ENTRANCE
   ========================================================================== */

window.addEventListener("load", () => {
  document
    .querySelectorAll(".hero .eyebrow, .hero h1, .hero-lede, .hero-actions")
    .forEach((element, index) => {
      setTimeout(
        () => {
          element.classList.add("visible");
        },
        200 + index * 180,
      );
    });
});

/* ==========================================================================
   FLOATING WHATSAPP ATTENTION
   ========================================================================== */

const whatsapp = document.querySelector(".floating-whatsapp");

if (whatsapp) {
  setInterval(() => {
    whatsapp.classList.add("pulse");

    setTimeout(() => {
      whatsapp.classList.remove("pulse");
    }, 1000);
  }, 6000);
}

/* ==========================================================================
   INFINITE MARQUEE
   ========================================================================== */

const marqueeTrack = document.querySelector(".marquee-track");

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}
