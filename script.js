// script.js — Aakruthi 2K26 Cyberpunk Website (Optimized)

// ─── PARTICLES.JS (Canvas-based, auto-animated, no cursor interaction) ──────
(function initParticles() {
  // Skip particles on mobile/touch devices to prevent lag
  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    navigator.maxTouchPoints > 0;
  if (isMobile) return;

  const canvas = document.createElement("canvas");
  canvas.id = "particleCanvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "0",
  });
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext("2d", { alpha: true });

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  // Debounced resize
  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }, 200);
    },
    { passive: true }
  );

  const COLORS = ["#00f0ff", "#ff2d78", "#7b2fff", "#00ff9d", "#ffffff"];
  const PARTICLE_COUNT = 70; // Reduced from 110 for performance
  const CONNECTION_DIST = 120;
  const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST; // Squared — avoids sqrt in loop

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : Math.random() < 0.5 ? -10 : H + 10;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 1.8 + 0.6;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

  function drawConnections() {
    ctx.lineWidth = 0.6;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < CONNECTION_DIST_SQ) {
          const alpha = (1 - Math.sqrt(distSq) / CONNECTION_DIST) * 0.22;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = a.color;
          ctx.shadowColor = a.color;
          ctx.shadowBlur = 3;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  // Pause animation when tab is not visible
  let animId;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.shadowBlur = 0;
    drawConnections();
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    animId = requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      loop();
    }
  });

  loop();
})();

// ─── MAIN ──────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // ─── LOADER ───────────────────────────────────
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
      triggerReveal();
    }, 1400);
  }

  // ─── CUSTOM CURSOR (desktop only) ────────────
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  const isTouchDevice = navigator.maxTouchPoints > 0;

  if (dot && ring && !isTouchDevice) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top = mouseY + "px";
      },
      { passive: true }
    );

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document
      .querySelectorAll("a, button, .event-card, .faq-question, .contact-btn, .filter-btn")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("hover"), { passive: true });
        el.addEventListener("mouseleave", () => ring.classList.remove("hover"), { passive: true });
      });

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    });
  } else if (dot && ring) {
    // Hide cursor elements on touch devices
    dot.style.display = "none";
    ring.style.display = "none";
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

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ─── COUNTDOWN ────────────────────────────────
  const targetDate = new Date("2026-03-12T09:00:00").getTime();
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minEl = document.getElementById("cd-min");
  const secEl = document.getElementById("cd-sec");

  if (daysEl) {
    function updateCountdown() {
      const diff = targetDate - Date.now();
      if (diff <= 0) {
        daysEl.textContent =
          hoursEl.textContent =
          minEl.textContent =
          secEl.textContent =
            "00";
        return;
      }
      daysEl.textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
      hoursEl.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
      minEl.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      secEl.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── SCROLL REVEAL ────────────────────────────
  function triggerReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement?.querySelectorAll(".reveal");
            let idx = 0;
            if (siblings) {
              siblings.forEach((el, j) => {
                if (el === entry.target) idx = j;
              });
            }
            setTimeout(() => entry.target.classList.add("visible"), idx * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  // Hero reveals
  setTimeout(() => {
    document.querySelectorAll("#hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), i * 150 + 300);
    });
  }, 1200);

  // ─── NAVBAR SCROLL EFFECT ─────────────────────
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    // Throttled via rAF to avoid excessive repaints
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            navbar.style.background =
              window.scrollY > 50 ? "rgba(1,0,8,0.98)" : "rgba(1,0,8,0.85)";
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ─── GLITCH TEXT RANDOM TRIGGER ───────────────
  document.querySelectorAll(".glitch").forEach((el) => {
    setInterval(
      () => {
        el.style.animation = "none";
        setTimeout(() => { el.style.animation = ""; }, 50);
      },
      Math.random() * 8000 + 4000
    );
  });

  // ─── DIGITAL NOISE ON CARD HOVER (desktop only) ──
  if (!isTouchDevice) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    document.querySelectorAll(".event-card").forEach((card) => {
      card.addEventListener(
        "mouseenter",
        () => {
          const name = card.querySelector(".event-name");
          if (!name) return;
          const orig = name.textContent;
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
        },
        { passive: true }
      );
    });
  }
});
