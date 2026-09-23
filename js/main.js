const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));
}

const modal = document.querySelector("#promoModal");
const closeModal = () => modal?.classList.remove("open");
document.querySelectorAll("[data-modal-close]").forEach(el => el.addEventListener("click", closeModal));
document.querySelectorAll("[data-modal-open]").forEach(el => el.addEventListener("click", () => modal?.classList.add("open")));
if (modal) {
  const seen = sessionStorage.getItem("crownPromoSeen");
  if (!seen) setTimeout(() => modal.classList.add("open"), 1800);
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
}
const promoForm = document.querySelector("#promoForm");
promoForm?.addEventListener("submit", e => {
  e.preventDefault();
  sessionStorage.setItem("crownPromoSeen", "1");
  closeModal();
  showToast("Discount saved — mention your email when you book.");
});
function showToast(message){
  let toast = document.querySelector("#toast");
  if(!toast){ toast=document.createElement("div"); toast.id="toast"; toast.className="toast"; document.body.appendChild(toast); }
  toast.textContent=message; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),3500);
}
window.showToast = showToast;


/* Scroll-reveal animations */
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => revealObserver.observe(el));

/* Interactive statistic counters */
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      const value = Math.floor(target * eased);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    observer.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

/* Set active navigation item */
const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a:not(.btn)").forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPage) link.classList.add("active");
});
