/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── ACTIVE NAV LINK on SCROLL ─── */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

/* ─── TYPING ANIMATION ─── */
const typedEl = document.getElementById('typedText');
const phrases = [
  'Cybersecurity Enthusiast',
  'Full Stack Developer',
  'Python Developer',
  'ML Engineer',
  'MCA Graduate',
  'Problem Solver'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 55 : 110;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

/* ─── SKILL FILTER ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    skillCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        // Trigger reflow then re-add animation
        card.offsetHeight;
        card.style.animation = 'fadeIn .4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── INTERSECTION OBSERVER (Reveal on Scroll) ─── */
const revealElements = document.querySelectorAll(
  '.section-header, .about-left, .about-right, .strength-card, ' +
  '.skill-card, .project-card, .edu-card, .timeline-card, ' +
  '.contact-card, .contact-form-wrap'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

/* ─── STAGGERED REVEAL (Cards) ─── */
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.05}s`;
});

/* ================= CONTACT FORM BACKEND ================= */

async function handleFormSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById("send-message-btn");
  const success = document.getElementById("formSuccess");

  btn.innerHTML = "Sending...";
  btn.disabled = true;

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const response = await fetch("https://my-portfolio-po65.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      success.textContent = "✅ Message sent successfully!";
      success.style.color = "#10b981";
      success.classList.add("visible");
      document.getElementById("contactForm").reset();
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error("Send Error:", error);

    success.textContent =
      "❌ Failed to send message. Try again later.";
    success.style.color = "#ef4444";
    success.classList.add("visible");
  }

  btn.innerHTML =
    '<i class="fas fa-paper-plane"></i> Send Message';
  btn.disabled = false;
}

/* ─── FADE IN KEYFRAME INJECTION ─── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95) translateY(6px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(styleSheet);
