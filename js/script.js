// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", !expanded);
        navMenu.classList.toggle("active");
    });

    hamburger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            hamburger.click();
        }
    });

    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        });
    });
}

// ============================================
// LOTTIE ANIMATIONS FOR ABOUT SECTION
// ============================================

if (typeof lottie !== 'undefined') {
    const cloudAnimation = document.getElementById('cloud-animation');
    const devopsAnimation = document.getElementById('devops-animation');

    if (cloudAnimation) {
        lottie.loadAnimation({
            container: cloudAnimation,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/cloud.json'
        });
    }

    if (devopsAnimation) {
        lottie.loadAnimation({
            container: devopsAnimation,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/animations/devops.json'
        });
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ACTIVE SECTION HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);
window.addEventListener('load', highlightActiveSection);

// ============================================
// CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
let formMessageTimeout;

function showFormMessage(message, type) {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;

  clearTimeout(formMessageTimeout);

  formMessageTimeout = setTimeout(() => {
      formMessage.className = "form-message";
      formMessage.textContent = "";
  }, 5000);
}

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    
    // Basic validation
    if (!name || !email || !message) {
        showFormMessage("Please fill in all fields.", "error");
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFormMessage("Please enter a valid email address.", "error");
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;
    
    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            }
        });
        
        if (response.ok) {
            showFormMessage("Thank you! Your message has been sent successfully.", "success");
            contactForm.reset();
        } else {
            const data = await response.json();
            if (data.errors) {
                showFormMessage("There was an error sending your message. Please try again.", "error");
            } else {
                showFormMessage("There was an error sending your message. Please try again.", "error");
            }
        }
    } catch (error) {
        showFormMessage("There was an error sending your message. Please try again.", "error");
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
    });
}

// ============================================
// CARD HOVER EFFECTS (Optional enhancement)
// ============================================

// Add subtle animation to skill cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards and project cards
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

/* Accessible theme toggle (simple, persistent) */
(function () {
    // ID expected in HTML: <button id="theme-toggle"><span id="theme-icon">☀️</span></button>
    const toggle = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!toggle || !icon) return;

    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');

    function setTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
        if (t === 'dark') {
            icon.textContent = '🌙';
            toggle.setAttribute('aria-pressed', 'true');
        } else {
            icon.textContent = '☀️';
            toggle.setAttribute('aria-pressed', 'false');
        }
    }

    setTheme(initial);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    toggle.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            toggle.click();
        }
    });
})();

// =========================
// Active nav + Scroll reveal
// =========================
(function () {
    // Guard - only run if DOM present
    if (typeof window === 'undefined') return;

    // Active nav on scroll
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    function updateActiveNav() {
        // Use a point a bit lower than the top of viewport for better detection
        const scanY = window.scrollY + window.innerHeight / 6;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const matches = scanY >= top && scanY < bottom;
            navLinks.forEach(link => {
                const href = (link.getAttribute('href') || '').replace(/^#/, '');
                if (href === id && matches) link.classList.add('active');
                else if (href === id && !matches) link.classList.remove('active');
            });
        });
    }

    // Debounce-like passive update tied to scroll/resize
    let ticking = false;
    function requestUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    // initial run
    document.addEventListener('DOMContentLoaded', updateActiveNav);

    // Scroll reveal: auto-attach .reveal to common elements (no HTML edits required)
    const autoRevealSelectors = [
        '.section-title',
        '.hero-inner',
        '.skills-grid',
        '.projects-grid',
        '.project-card',
        '.skill-card',
        '.about-content',
        '.contact-container'
    ];

    // Add 'reveal' class to elements that match (if not already present)
    function addRevealClasses() {
        autoRevealSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                if (!el.classList.contains('reveal')) el.classList.add('reveal');
            });
        });
    }

    // IntersectionObserver for reveal
    function setupRevealObserver() {
        const reveals = Array.from(document.querySelectorAll('.reveal'));
        if (!reveals.length) return;

        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        reveals.forEach(el => obs.observe(el));
    }

    document.addEventListener('DOMContentLoaded', () => {
        addRevealClasses();
        setupRevealObserver();
        updateActiveNav();
    });

    // Ensure updates after any AJAX / dynamic content changes
    window.__triggerRevealUpdate = function() {
        addRevealClasses();
        setupRevealObserver();
        updateActiveNav();
    };

})();


