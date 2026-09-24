/* =========================
   CROWN CUTS — EMAILJS CONFIG
========================= */

const CROWN_EMAILJS = {
  publicKey: "f9iNhMxuaooaYZXoH",
  serviceId: "service_qjyjftg",

  // EmailJS templates
  promoTemplateId: "template_f6dsyrl",
  bookingTemplateId: "template_cnak8f5",
};

window.CROWN_EMAILJS = CROWN_EMAILJS;

/* =========================
   LOAD EMAILJS
========================= */

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector(
      'script[src*="@emailjs/browser"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.emailjs) {
          resolve(window.emailjs);
        } else {
          reject(new Error("EmailJS loaded but is unavailable."));
        }
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Unable to load EmailJS."));
      });

      return;
    }

    // Load EmailJS
    const script = document.createElement("script");

    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";

    script.async = true;

    script.onload = () => {
      if (!window.emailjs) {
        reject(new Error("EmailJS SDK is unavailable."));
        return;
      }

      resolve(window.emailjs);
    };

    script.onerror = () => {
      reject(new Error("Unable to load EmailJS."));
    };

    document.head.appendChild(script);
  });
}

/* =========================
   INITIALIZE EMAILJS
========================= */

async function initializeEmailJS() {
  try {
    const emailjsInstance = await loadEmailJS();

    emailjsInstance.init({
      publicKey: CROWN_EMAILJS.publicKey,
    });

    return emailjsInstance;
  } catch (error) {
    console.warn("EmailJS initialization failed:", error);
    return null;
  }
}

/* =========================
   NAVIGATION
========================= */

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));

  navLinks
    .querySelectorAll("a")
    .forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open")),
    );
}

/* =========================
   PROMO MODAL
========================= */

const modal = document.querySelector("#promoModal");

const closeModal = () => {
  modal?.classList.remove("open");
};

document
  .querySelectorAll("[data-modal-close]")
  .forEach((el) => el.addEventListener("click", closeModal));

document
  .querySelectorAll("[data-modal-open]")
  .forEach((el) =>
    el.addEventListener("click", () => modal?.classList.add("open")),
  );

/* =========================
   SHOW PROMO ON FIRST VISIT
========================= */

if (modal) {
  const seen = sessionStorage.getItem("crownPromoSeen");

  if (!seen) {
    setTimeout(() => {
      modal.classList.add("open");
    }, 1800);
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/* =========================
   PROMO FORM — 10% DISCOUNT
========================= */

const promoForm = document.querySelector("#promoForm");

promoForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailInput = promoForm.querySelector('input[type="email"]');

  const email = emailInput?.value.trim().toLowerCase();

  if (!email) {
    showToast("Please enter your email address.");
    return;
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.");
    return;
  }

  const submitButton = promoForm.querySelector('button[type="submit"]');

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
  }

  try {
    const emailjsInstance = await initializeEmailJS();

    if (!emailjsInstance) {
      throw new Error("EmailJS is not available.");
    }

    /*
      Send the 10% Welcome email.

      The EmailJS Welcome template uses:
      {{email}}

      Therefore we send exactly:
      {
        email: customer email
      }
    */

    await emailjsInstance.send(
      CROWN_EMAILJS.serviceId,
      CROWN_EMAILJS.promoTemplateId,
      {
        email: email,
      },
    );

    /*
      Save the customer's first-visit discount.

      booking.js will use this information
      when the customer enters CROWN10.
    */

    localStorage.setItem(
      "crownFirstVisitDiscount",
      JSON.stringify({
        email: email,
        discount: 10,
        coupon: "CROWN10",
      }),
    );

    // Remember that the popup was completed
    sessionStorage.setItem("crownPromoSeen", "1");

    closeModal();

    showToast("Your 10% discount has been sent to your email.");
  } catch (error) {
    console.error("Promo EmailJS error:", error);

    showToast("We couldn't send the discount email. Please try again.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Get My Discount";
    }
  }
});

/* =========================
   TOAST
========================= */

function showToast(message) {
  let toast = document.querySelector("#toast");

  if (!toast) {
    toast = document.createElement("div");

    toast.id = "toast";
    toast.className = "toast";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

window.showToast = showToast;

/* =========================
   SCROLL-REVEAL ANIMATIONS
========================= */

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  },
);

document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right")
  .forEach((el) => revealObserver.observe(el));

/* =========================
   INTERACTIVE STATISTIC COUNTERS
========================= */

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      const target = Number(el.dataset.target || 0);

      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";

      const duration = 1300;

      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        const value = Math.floor(target * eased);

        el.textContent = prefix + value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);

      observer.unobserve(el);
    });
  },
  {
    threshold: 0.6,
  },
);

document
  .querySelectorAll(".counter")
  .forEach((el) => counterObserver.observe(el));

/* =========================
   ACTIVE NAVIGATION
========================= */

const currentPage = location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a:not(.btn)").forEach((link) => {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("active");
  }
});
