/* Hybrid Lab V2: keyboard-friendly mobile navigation and accessible project filtering.
   No analytics or external network requests. */
(() => {
  "use strict";

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  const year = document.getElementById("current-year");

  if (year) year.textContent = String(new Date().getFullYear());

  if (toggle && nav) {
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
    const setOpen = (open, returnFocus = false) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      const portuguese = document.documentElement.lang === "pt-BR";
      toggle.setAttribute("aria-label", open
        ? (portuguese ? "Fechar menu" : "Close navigation")
        : (portuguese ? "Abrir menu" : "Open navigation"));
      if (returnFocus && open === false) toggle.focus();
    };

    toggle.addEventListener("click", () => {
      const next = !isOpen();
      setOpen(next);
      if (next) nav.querySelector("a")?.focus();
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && isOpen()) setOpen(false, true);
    });

    document.addEventListener("click", event => {
      if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 961px)").matches && isOpen()) setOpen(false);
    });
  }

  const filters = Array.from(document.querySelectorAll(".filter-button[data-filter]"));
  const cards = Array.from(document.querySelectorAll(".project-card[data-category]"));
  const counter = document.getElementById("project-count");

  if (filters.length && cards.length) {
    // Only categories declared on the buttons may be selected.
    const validFilters = new Set(filters.map(button => button.dataset.filter));

    function applyFilter(selected) {
      if (!validFilters.has(selected)) return;

      filters.forEach(button => {
        const active = button.dataset.filter === selected;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      let visible = 0;
      cards.forEach(card => {
        const categories = (card.dataset.category || "").trim().split(/\s+/);
        const show = selected === "all" || categories.includes(selected);
        // CSS must respect the HTML hidden attribute.
        card.hidden = !show;
        if (show) visible += 1;
      });
      if (counter) counter.textContent = String(visible);
    }

    filters.forEach(button => {
      button.addEventListener("click", () => applyFilter(button.dataset.filter));
    });
    applyFilter("all");
  }
})();
