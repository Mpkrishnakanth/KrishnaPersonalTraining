// Replace this with your Google Calendar appointment schedule or Calendly URL before launch.
const BOOKING_URL = "https://calendly.com/mpkrishnakanth/30min";

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

const bookingButton = document.getElementById("bookingButton");
const bookingNote = document.getElementById("bookingNote");
if (bookingButton) {
  bookingButton.addEventListener("click", () => {
    if (BOOKING_URL) {
      window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    } else if (bookingNote) {
      bookingNote.textContent = "Add your Google Calendar or Calendly booking URL in script.js to activate this button.";
      bookingNote.classList.add("notice-active");
    }
  });
}

const leadForm = document.getElementById("leadForm");
const formStatus = document.getElementById("formStatus");
if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent = "Your form is ready for a form backend. Connect Formspree, Netlify Forms, or another provider before publishing.";
  });
}
