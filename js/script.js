const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const searchBtn = document.getElementById("searchBtn");
const search = document.getElementById("search");
const searchInput = document.getElementById("searchInput");

let autocompleteInitialized = false;

/* MENÚ HAMBURGUESA */
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

/* BUSCADOR (LUPA) */

searchBtn.addEventListener("click", () => {
  const isHidden = search.hasAttribute("hidden");

  if (isHidden) {
    // Mostrar buscador
    search.removeAttribute("hidden");
    search.classList.add("is-open");
    searchBtn.setAttribute("aria-expanded", "true");

    // Inicializar autocomplete solo una vez
    if (!autocompleteInitialized) {
      initAutocomplete();
      autocompleteInitialized = true;
    }

    setTimeout(() => searchInput.focus(), 0);
  } else {
    // Ocultar buscador
    search.setAttribute("hidden", "");
    search.classList.remove("is-open");
    searchBtn.setAttribute("aria-expanded", "false");
    searchInput.value = "";
  }
});

/* -----------------------------
   CERRAR TODO CON ESCAPE
----------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  // Cerrar buscador
  if (!search.hasAttribute("hidden")) {
    search.setAttribute("hidden", "");
    search.classList.remove("is-open");
    searchBtn.setAttribute("aria-expanded", "false");
    searchInput.value = "";
  }

  // Cerrar menú
  nav.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
});

/* -----------------------------
   AUTOCOMPLETE + REDIRECCIÓN
----------------------------- */
function initAutocomplete() {
  const availableTags = [
    // POP ART
    "Whaam!",
    "Drowning Girl",
    "Look Mickey",
    "Crying Girl",
    "Marilyn",
    "Campbell's Soup",
    "Brillo Box",
    "Flowers",
    "LOVE",
    "Flag",

    // MINIMALISMO
    "Untitled (Donald Judd)",
    "Stack",
    "Untitled (to you, Heiner, with admiration and affection)",
    "monument for V. Tatlin",
    "Untitled (Agnes Martin)",
    "The Tree",
    "Wall Drawing",
    "Wall Drawing #65",
    "Equivalent VIII",
    "144 Tin Square",
    "Untitled (L-Beams)",
    "Untitled (Robert Ryman)",
    "A Wall for Apricots",
    "Die Fahne Hoch!",
    "Harran II",
    "Red Blue Green",
    "Blue Green",
    "Accession II",

    // ARTE URBANO
    "Girl with Balloon",
    "Love is in the Air",
    "Obey Giant",
    "Marianne",
    "We the Youth",
    "Nobody likes me",
    "Don’t Shoot",
    "Chuuuuttt!",

    // VANGUARDIAS
    "The Old Guitarist",
    "Bathers by a River",
    "Boîte-en-valise",
    "Nude Descending a Staircase",
    "Improvisation",
    "Black Square",
    "Composition with Red Blue and Yellow",
    "Unique Forms of Continuity in Space",
    "Dynamic Hieroglyphic of the Bal Tabarin",
    "Twittering Machine",
    "Merz",
    "Rayograph",
    "The Song of Love",
    "Seated Woman",
    "Street, Dresden",
    "Futurist Manifesto",
    "Proun",
    "Construction",

    // ARTE CONCEPTUAL
    "Have Me Feed Me Hug Me Love Me Need Me",
    "Untitled (5-Part Progression)",
    "3-Way Fibonacci Progression",
    "Wall Drawing #128 (Ten Thousand Random Not Straight Lines)",
    "Untitled (C-4)",
    "Statement",
    "Achrome",
    'Today Series, "Tuesday"',
    "Seated in a Bathtub",
    "Artist's Shit",
    "Fat Chair",

    // ARTE DIGITAL
    "Clown Torture",
    "Thaw",
    "Family of robot: Baby",
    "TV Buddha",
    "Cross-Hatchings",
    "Reasons for Knocking at an Empty House",
    "Caribs’ Leap",
    "Delphine",
    "A31: Tennessee Entrance Hall",
    "Apotheosis of Homer",
    "C-4",
    "Blue Tilt",
    "Lovely Andrea",
    "Annemiek",
    "Beyrouth",
    "Rapture",
    "Tears for Eros",
    "Horizontal China Times",
    "The Long Road to Mazatlán",
    "Disappearance at Sea II",
  ];

  const urls = {
    // POP ART
    "Whaam!": "./PopArt.html?obra=0",
    "Drowning Girl": "./PopArt.html?obra=1",
    "Look Mickey": "./PopArt.html?obra=2",
    "Crying Girl": "./PopArt.html?obra=3",
    Marilyn: "./PopArt.html?obra=4",
    "Campbell's Soup": "./PopArt.html?obra=5",
    "Brillo Box": "./PopArt.html?obra=6",
    Flowers: "./PopArt.html?obra=7",
    LOVE: "./PopArt.html?obra=8",
    Flag: "./PopArt.html?obra=9",

    // MINIMALISMO
    "Untitled (Donald Judd)": "./SalaMinimalismo.html?obra=0",
    Stack: "./SalaMinimalismo.html?obra=1",
    "Untitled (to you, Heiner, with admiration and affection)":
      "./SalaMinimalismo.html?obra=2",
    "monument for V. Tatlin": "./SalaMinimalismo.html?obra=3",
    "Untitled (Agnes Martin)": "./SalaMinimalismo.html?obra=4",
    "The Tree": "./SalaMinimalismo.html?obra=5",
    "Wall Drawing": "./SalaMinimalismo.html?obra=6",
    "Wall Drawing #65": "./SalaMinimalismo.html?obra=7",
    "Equivalent VIII": "./SalaMinimalismo.html?obra=8",
    "144 Tin Square": "./SalaMinimalismo.html?obra=9",
    "Untitled (L-Beams)": "./SalaMinimalismo.html?obra=10",
    "Untitled (Robert Ryman)": "./SalaMinimalismo.html?obra=11",
    "A Wall for Apricots": "./SalaMinimalismo.html?obra=12",
    "Die Fahne Hoch!": "./SalaMinimalismo.html?obra=13",
    "Harran II": "./SalaMinimalismo.html?obra=14",
    "Red Blue Green": "./SalaMinimalismo.html?obra=15",
    "Blue Green": "./SalaMinimalismo.html?obra=16",
    "Accession II": "./SalaMinimalismo.html?obra=17",

    // ARTE URBANO
    "Girl with Balloon": "./SalaUrbano.html?obra=0",
    "Love is in the Air": "./SalaUrbano.html?obra=1",
    "Obey Giant": "./SalaUrbano.html?obra=2",
    Marianne: "./SalaUrbano.html?obra=3",
    "We the Youth": "./SalaUrbano.html?obra=4",
    "Nobody likes me": "./SalaUrbano.html?obra=5",
    "Don’t Shoot": "./SalaUrbano.html?obra=6",
    "Chuuuuttt!": "./SalaUrbano.html?obra=7",

    // VANGUARDIAS
    "The Old Guitarist": "./SalaVanguardias.html?obra=0",
    "Bathers by a River": "./SalaVanguardias.html?obra=1",
    "Boîte-en-valise": "./SalaVanguardias.html?obra=2",
    "Nude Descending a Staircase": "./SalaVanguardias.html?obra=3",
    Improvisation: "./SalaVanguardias.html?obra=4",
    "Black Square": "./SalaVanguardias.html?obra=5",
    "Composition with Red Blue and Yellow": "./SalaVanguardias.html?obra=6",
    "Unique Forms of Continuity in Space": "./SalaVanguardias.html?obra=7",
    "Dynamic Hieroglyphic of the Bal Tabarin": "./SalaVanguardias.html?obra=8",
    "Twittering Machine": "./SalaVanguardias.html?obra=9",
    Merz: "./SalaVanguardias.html?obra=10",
    Rayograph: "./SalaVanguardias.html?obra=11",
    "The Song of Love": "./SalaVanguardias.html?obra=12",
    "Seated Woman": "./SalaVanguardias.html?obra=13",
    "Street, Dresden": "./SalaVanguardias.html?obra=14",
    "Futurist Manifesto": "./SalaVanguardias.html?obra=15",
    Proun: "./SalaVanguardias.html?obra=16",
    Construction: "./SalaVanguardias.html?obra=17",

    // ARTE CONCEPTUAL
    "Have Me Feed Me Hug Me Love Me Need Me": "./SalaConceptual.html?obra=0",
    "Untitled (5-Part Progression)": "./SalaConceptual.html?obra=1",
    "3-Way Fibonacci Progression": "./SalaConceptual.html?obra=2",
    "Wall Drawing #128 (Ten Thousand Random Not Straight Lines)":
      "./SalaConceptual.html?obra=3",
    "Untitled (C-4)": "./SalaConceptual.html?obra=4",
    Statement: "./SalaConceptual.html?obra=5",
    Achrome: "./SalaConceptual.html?obra=6",
    'Today Series, "Tuesday"': "./SalaConceptual.html?obra=7",
    "Seated in a Bathtub": "./SalaConceptual.html?obra=8",
    "Artist's Shit": "./SalaConceptual.html?obra=9",
    "Fat Chair": "./SalaConceptual.html?obra=10",

    // ARTE DIGITAL
    "Clown Torture": "./SalaDigital.html?obra=0",
    Thaw: "./SalaDigital.html?obra=1",
    "Family of robot: Baby": "./SalaDigital.html?obra=2",
    "TV Buddha": "./SalaDigital.html?obra=3",
    "Cross-Hatchings": "./SalaDigital.html?obra=4",
    "Reasons for Knocking at an Empty House": "./SalaDigital.html?obra=5",
    "Caribs’ Leap": "./SalaDigital.html?obra=6",
    Delphine: "./SalaDigital.html?obra=7",
    "A31: Tennessee Entrance Hall": "./SalaDigital.html?obra=8",
    "Apotheosis of Homer": "./SalaDigital.html?obra=9",
    "C-4": "./SalaDigital.html?obra=10",
    "Blue Tilt": "./SalaDigital.html?obra=11",
    "Lovely Andrea": "./SalaDigital.html?obra=12",
    Annemiek: "./SalaDigital.html?obra=13",
    Beyrouth: "./SalaDigital.html?obra=14",
    Rapture: "./SalaDigital.html?obra=15",
    "Tears for Eros": "./SalaDigital.html?obra=16",
    "Horizontal China Times": "./SalaDigital.html?obra=17",
    "The Long Road to Mazatlán": "./SalaDigital.html?obra=18",
    "Disappearance at Sea II": "./SalaDigital.html?obra=19",
  };

  $("#searchInput").autocomplete({
    source: availableTags,
    minLength: 1,
    delay: 0,
    select: function (event, ui) {
      const value = ui.item.value;
      if (urls[value]) {
        window.location.href = urls[value];
      } else {
        alert("No hay página asignada para: " + value);
      }
    },
  });
}
