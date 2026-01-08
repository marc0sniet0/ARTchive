  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  const searchBtn = document.getElementById("searchBtn");
  const search = document.getElementById("search");
  const searchInput = document.getElementById("searchInput");

  // Menú móvil
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  // Buscador desplegable
  searchBtn.addEventListener("click", () => {
    const isHidden = search.hasAttribute("hidden");

    if (isHidden) {
      search.removeAttribute("hidden");
      searchBtn.setAttribute("aria-expanded", "true");
      setTimeout(() => searchInput.focus(), 0);
    } else {
      search.setAttribute("hidden", "");
      searchBtn.setAttribute("aria-expanded", "false");
      searchInput.value = "";
    }
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!search.hasAttribute("hidden")) {
      search.setAttribute("hidden", "");
      searchBtn.setAttribute("aria-expanded", "false");
      searchInput.value = "";
    }
    nav.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  });

