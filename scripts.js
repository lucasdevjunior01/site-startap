/* ========================================
   AciolyTech - Site Profissional
   Script de Interatividade
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ===== VARS =====
  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section[id]");
  const fadeElements = document.querySelectorAll(".fade-in");
  const statNumbers = document.querySelectorAll(".stat-number");
  const contactForm = document.getElementById("contactForm");

  // ===== NAVBAR SCROLL EFFECT =====
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // ===== MOBILE MENU TOGGLE =====
  const toggleMenu = () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active")
      ? "hidden"
      : "";
  };

  const closeMenu = () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", toggleMenu);

  // Close menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("active")) {
        closeMenu();
      }
    });
  });

  // Close menu on window resize (if going back to desktop)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const handleActiveLink = () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleActiveLink);

  // ===== SCROLL REVEAL (FADE-IN) =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-delay") || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  fadeElements.forEach((el) => revealObserver.observe(el));

  // ===== COUNTER ANIMATION (STATS) =====
  let countersStarted = false;

  const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const duration = 2000; // ms
      const step = Math.ceil(target / (duration / 16)); // ~60fps
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          return;
        }
        counter.textContent = current;
        requestAnimationFrame(updateCounter);
      };

      updateCounter();
    });
  };

  // Observe stats section to trigger counter
  const statsSection = document.querySelector(".stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(statsSection);
  }

  // ===== FORM HANDLING =====
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("formName").value.trim();
      const email = document.getElementById("formEmail").value.trim();
      const subject = document.getElementById("formSubject").value.trim();
      const message = document.getElementById("formMessage").value.trim();

      if (!name || !email || !message) {
        showFormMessage("Por favor, preencha todos os campos obrigatórios.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showFormMessage("Por favor, insira um email válido.", "error");
        return;
      }

      // Simulate sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showFormMessage(
          "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.",
          "success"
        );
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showFormMessage = (text, type) => {
    // Remove existing messages
    const existing = contactForm.querySelector(".form-message");
    if (existing) existing.remove();

    const msg = document.createElement("div");
    msg.className = `form-message form-message-${type}`;
    msg.textContent = text;
    msg.style.cssText = `
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
      ${
        type === "success"
          ? "background: rgba(100,255,218,0.1); color: var(--accent); border: 1px solid rgba(100,255,218,0.2);"
          : "background: rgba(255,107,107,0.1); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.2);"
      }
    `;

    contactForm.prepend(msg);

    setTimeout(() => msg.remove(), 5000);
  };

  // ===== PARTICLES CANVAS (HERO BACKGROUND) =====
  const canvas = document.getElementById("particlesCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId = null;
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Move
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 218, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            const opacity = (1 - distance / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (1 - dist / 100) * 0.3;
          p.x += dx * force;
          p.y += dy * force;
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    const initParticles = () => {
      resizeCanvas();
      createParticles();
      if (animationId) cancelAnimationFrame(animationId);
      drawParticles();
    };

    // Mouse tracking for particle interaction
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
      mouseX = -1000;
      mouseY = -1000;
    });

    // Handle resize
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 250);
    });

    initParticles();
  }

  // ===== KEYBOARD SUPPORT (CLOSE MENU WITH ESC) =====
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
    }
  });

  console.log(
    "%c AciolyTech %c Desenvolvimento de Software ",
    "background: #64ffda; color: #0a192f; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;",
    "background: #0a192f; color: #64ffda; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;"
  );
});

