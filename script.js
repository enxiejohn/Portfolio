// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// ---------- Highlight the nav link for the section in view ----------
const links = [...nav.querySelectorAll("a")];
const sections = links
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

// ---------- Scroll reveal ----------
// Add the class "reveal" to anything else you want to animate in.
const revealTargets = document.querySelectorAll(
  ".skill-group, .project, .entry, .cert-list li, .contact-panel"
);
const counts = new Map();
revealTargets.forEach((el) => {
  const n = counts.get(el.parentElement) || 0;
  counts.set(el.parentElement, n + 1);
  el.style.setProperty("--d", Math.min(n, 4) * 80 + "ms"); // small stagger
  el.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal, .section").forEach((el) => revealObserver.observe(el));

// ---------- Contact form ----------
// This opens the visitor's email app with the message filled in.
// To receive messages directly in your inbox instead, use a form service
// such as Formspree or Web3Forms and send the form data to their URL here.
const form = document.getElementById("contact-form");

if (form) {
  const status = document.getElementById("form-status");
  const fields = [...form.querySelectorAll("input, textarea")];
  const emailLink = document.querySelector('.info-list a[href^="mailto:"]');

  const errors = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    subject: "Please add a subject.",
    message: "Please write a message.",
  };

  const setStatus = (text, type = "") => {
    status.textContent = text;
    status.className = "form-status" + (type ? " " + type : "");
  };

  const setInvalid = (input, bad) => {
    const field = input.closest(".field");
    field.classList.remove("invalid");
    if (bad) {
      void field.offsetWidth; // restart the shake animation
      field.classList.add("invalid");
      field.querySelector(".field__error").textContent = errors[input.name];
    }
    input.setAttribute("aria-invalid", bad);
  };

  fields.forEach((f) =>
    f.addEventListener("input", () => {
      if (f.checkValidity()) setInvalid(f, false);
    })
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let firstBad = null;
    fields.forEach((f) => {
      const bad = !f.checkValidity();
      setInvalid(f, bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      firstBad.focus();
      setStatus("");
      return;
    }

    const to = emailLink ? emailLink.getAttribute("href").replace("mailto:", "") : "";
    if (!to || to === "you@example.com") {
      setStatus("Add your real email address in index.html first.", "error");
      return;
    }

    const data = new FormData(form);
    const body = `${data.get("message")}\n\n${data.get("name")} (${data.get("email")})`;
    const url =
      `mailto:${to}?subject=${encodeURIComponent(data.get("subject"))}` +
      `&body=${encodeURIComponent(body)}`;

    setStatus("Opening your email app…", "ok");
    window.location.href = url;
  });

  form.addEventListener("reset", () => {
    fields.forEach((f) => setInvalid(f, false));
    setStatus("");
  });
}