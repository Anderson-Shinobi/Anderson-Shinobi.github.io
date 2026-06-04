(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");

  if (!navToggle || !nav) return;

  navToggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
})();
