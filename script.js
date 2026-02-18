// script.js — Aakruthi 2K26 Cyberpunk Website

document.addEventListener("DOMContentLoaded", () => {
  // ─── LOADER ───────────────────────────────────
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
    // Trigger reveal animations after load
    triggerReveal();
  }, 1400);

  // ─── CUSTOM CURSOR ────────────────────────────
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  if (dot && ring) {
    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect
    const hoverEls = document.querySelectorAll(
      "a, button, .event-card, .faq-question, .contact-btn, .filter-btn",
    );
    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  }

  // ─── HAMBURGER MENU ───────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("active");
      mobileMenu.classList.toggle("active", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close on backdrop click
    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ─── COUNTDOWN ────────────────────────────────
  const targetDate = new Date("2026-03-20T09:00:00").getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minEl = document.getElementById("cd-min");
  const secEl = document.getElementById("cd-sec");

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minEl) minEl.textContent = "00";
      if (secEl) secEl.textContent = "00";
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minEl) minEl.textContent = String(m).padStart(2, "0");
    if (secEl) secEl.textContent = String(s).padStart(2, "0");
  }

  if (daysEl) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── SCROLL REVEAL ────────────────────────────
  function triggerReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger delay based on position in parent
            const siblings =
              entry.target.parentElement?.querySelectorAll(".reveal");
            let idx = 0;
            if (siblings) {
              siblings.forEach((el, j) => {
                if (el === entry.target) idx = j;
              });
            }
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, idx * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // Immediate reveal for above-fold content
  setTimeout(() => {
    document.querySelectorAll("#hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 150 + 300);
    });
  }, 1200);

  // ─── NAVBAR SCROLL EFFECT ─────────────────────
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.background =
        window.scrollY > 50 ? "rgba(1,0,8,0.98)" : "rgba(1,0,8,0.85)";
    });
  }

  // ─── GLITCH TEXT RANDOM TRIGGER ───────────────
  const glitchEls = document.querySelectorAll(".glitch");
  glitchEls.forEach((el) => {
    setInterval(
      () => {
        el.style.animation = "none";
        setTimeout(() => {
          el.style.animation = "";
        }, 50);
      },
      Math.random() * 8000 + 4000,
    );
  });

  // ─── RANDOM DIGITAL NOISE ON CARDS ───────────
  document.querySelectorAll(".event-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const name = card.querySelector(".event-name");
      if (name) {
        const orig = name.textContent;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        let iter = 0;
        const interval = setInterval(() => {
          name.textContent = orig
            .split("")
            .map((c, i) => {
              if (c === " ") return " ";
              if (i < iter) return orig[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          iter += 1.5;
          if (iter >= orig.length) {
            name.textContent = orig;
            clearInterval(interval);
          }
        }, 30);
      }
    });
  });
});
