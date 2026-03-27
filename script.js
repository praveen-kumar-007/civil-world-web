const preloader = document.getElementById("preloader");
window.addEventListener("load", () => {
  if (preloader) {
    preloader.classList.add("hide");
  }
});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  const mobileMenuLinks = mobileMenu.querySelectorAll("a");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("show");
    mobileMenu.hidden = isOpen;
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("show");
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("civilWorldTheme");
if (savedTheme === "night") {
  document.body.classList.add("theme-night");
}
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("theme-night");
    localStorage.setItem("civilWorldTheme", document.body.classList.contains("theme-night") ? "night" : "day");
  });
}

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll(".counter");
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 80));

    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = String(target.toLocaleString());
      } else {
        counter.textContent = String(current.toLocaleString());
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
}

const statsSection = document.getElementById("highlights");
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters();
        }
      });
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(statsSection);
}

const slides = document.querySelectorAll(".slide");
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  showSlide(currentSlide);
}

if (slides.length && prevButton && nextButton) {
  prevButton.addEventListener("click", () => moveSlide(-1));
  nextButton.addEventListener("click", () => moveSlide(1));
  setInterval(() => moveSlide(1), 5000);
}

const faqButtons = document.querySelectorAll(".faq-question");
faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;
    if (!answer) return;

    faqButtons.forEach((otherButton) => {
      if (otherButton !== button && otherButton.nextElementSibling) {
        otherButton.setAttribute("aria-expanded", "false");
        otherButton.nextElementSibling.style.maxHeight = "0px";
      }
    });

    button.setAttribute("aria-expanded", String(!isExpanded));
    answer.style.maxHeight = isExpanded ? "0px" : `${answer.scrollHeight}px`;
  });
});

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      formStatus.textContent = "Please fill all required fields correctly.";
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent("Civil World - Course Enquiry");
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    formStatus.textContent = "Message prepared. Opening your email app...";
    window.location.href = `mailto:civilworld.edu@example.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

const newsletterForm = document.getElementById("newsletterForm");
const newsletterStatus = document.getElementById("newsletterStatus");
if (newsletterForm && newsletterStatus) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = newsletterForm.querySelector("input[name='newsletterEmail']");
    if (!emailInput || !emailInput.value) {
      newsletterStatus.textContent = "Please enter a valid email.";
      return;
    }

    localStorage.setItem("civilWorldSubscriber", emailInput.value.trim());
    newsletterStatus.textContent = "Thanks for subscribing. Weekly updates are enabled for you.";
    newsletterForm.reset();
  });
}

const typedText = document.getElementById("typedText");
if (typedText) {
  const words = ["clarity", "strategy", "confidence", "high scores"];
  let wordIndex = 0;
  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    typedText.textContent = words[wordIndex];
  }, 1800);
}

const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(100, ratio)}%`;
  }

  if (backToTop) {
    if (window.scrollY > 360) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
});

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const openVideo = document.getElementById("openVideo");
const closeVideo = document.getElementById("closeVideo");
const videoModal = document.getElementById("videoModal");
if (openVideo && closeVideo && videoModal) {
  openVideo.addEventListener("click", () => {
    videoModal.hidden = false;
  });
  closeVideo.addEventListener("click", () => {
    videoModal.hidden = true;
  });
  videoModal.addEventListener("click", (event) => {
    if (event.target === videoModal) {
      videoModal.hidden = true;
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-btn");
const resourceItems = document.querySelectorAll(".resource-item");
if (filterButtons.length && resourceItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      resourceItems.forEach((item) => {
        const itemTopic = item.dataset.topic;
        const shouldShow = topic === "all" || topic === itemTopic;
        item.classList.toggle("hide", !shouldShow);
      });
    });
  });
}

const galleryImages = document.querySelectorAll(".gallery-grid img");
galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    const largeImage = document.createElement("img");
    largeImage.src = image.src;
    largeImage.alt = image.alt;
    lightbox.appendChild(largeImage);
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", () => lightbox.remove());
  });
});

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}
