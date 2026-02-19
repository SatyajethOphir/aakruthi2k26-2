// script.js — Aakruthi 2K26 Cyberpunk Website

// ─── PARTICLES.JS (Canvas-based, cursor-reactive) ──────────────────────────
(function initParticles() {
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

  const ctx = canvas.getContext("2d");

  let W = (canvas.width = window.innerWidth);
  let H = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Cursor position
  const mouse = { x: W / 2, y: H / 2 };
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Cyberpunk colour palette
  const COLORS = ["#00f0ff", "#ff2d78", "#7b2fff", "#00ff9d", "#ffffff"];

  const PARTICLE_COUNT = 110;
  const CONNECTION_DIST = 130;
  const CURSOR_REPEL_DIST = 100;
  const CURSOR_ATTRACT_DIST = 200;

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : Math.random() < 0.5 ? -10 : H + 10;
      this.baseVX = (Math.random() - 0.5) * 0.5;
      this.baseVY = (Math.random() - 0.5) * 0.5;
      this.vx = this.baseVX;
      this.vy = this.baseVY;
      this.r = Math.random() * 1.8 + 0.6;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.5 + 0.3;
      this.life = 0;
    }
    update() {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      if (dist < CURSOR_REPEL_DIST) {
        // Repel from cursor
        const force = (CURSOR_REPEL_DIST - dist) / CURSOR_REPEL_DIST;
        this.vx -= (dx / dist) * force * 2.5;
        this.vy -= (dy / dist) * force * 2.5;
      } else if (dist < CURSOR_ATTRACT_DIST) {
        // Gently attract toward cursor
        const force =
          ((dist - CURSOR_REPEL_DIST) /
            (CURSOR_ATTRACT_DIST - CURSOR_REPEL_DIST)) *
          0.04;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }

      // Damping back toward base velocity
      this.vx += (this.baseVX - this.vx) * 0.04;
      this.vy += (this.baseVY - this.vy) * 0.04;

      // Clamp speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 3) {
        this.vx = (this.vx / speed) * 3;
        this.vy = (this.vy / speed) * 3;
      }

      this.x += this.vx;
      this.y += this.vy;
      this.life++;

      // Wrap around edges
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from(
    { length: PARTICLE_COUNT },
    () => new Particle(),
  );

  // Spawn a burst near cursor on click
  document.addEventListener("click", (e) => {
    for (let i = 0; i < 8; i++) {
      const p = new Particle();
      p.x = e.clientX + (Math.random() - 0.5) * 30;
      p.y = e.clientY + (Math.random() - 0.5) * 30;
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = (Math.random() - 0.5) * 4;
      particles.push(p);
      // Keep count stable
      if (particles.length > PARTICLE_COUNT + 30) particles.splice(0, 1);
    }
  });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          const alpha = (1 - d / CONNECTION_DIST) * 0.25;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = a.color;
          ctx.shadowColor = a.color;
          ctx.shadowBlur = 4;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }

  loop();
})();

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
  const targetDate = new Date("2026-03-12T09:00:00").getTime();
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
