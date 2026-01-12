const HARVARD_KEY = "459d34a0-e80d-4b45-b246-23df92116c0c";
const HARVARD_OBJECT_BASE = "https://api.harvardartmuseums.org/object";
const AIC_BASE = "https://api.artic.edu/api/v1";

const CONTINUE_URL = "./SalaDigital.html";
const EXIT_URL = "./index.html";

const section = document.getElementById("gallery");
const sticky  = document.getElementById("sticky");
const track   = document.getElementById("track");

const loadingLayer = document.getElementById("loadingLayer");
const loadingTitle = document.getElementById("loadingTitle");
const loadingSub   = document.getElementById("loadingSub");

const endActions = document.getElementById("endActions");
const btnContinue = document.getElementById("btnContinue");
const btnExit = document.getElementById("btnExit");

const $modalOverlay = $("#modalOverlay");
const $modalClose = $("#modalClose");
const $mCloseBtn = $("#mCloseBtn");
const $mImg = $("#mImg");
const $mTitle = $("#mTitle");
const $mMeta = $("#mMeta");
const $mFacts = $("#mFacts");
const $mAic = $("#mAic");
const $mHarvard = $("#mHarvard");

let lastFocusedEl = null;

const usedAicIds = new Set();
const usedImageIds = new Set();

const MOVEMENT_LABEL = "Arte urbano";
const MOVEMENT_SEARCH_HINTS = ["street art", "graffiti", "stencil", "mural", "urban art"];

const CURATED_STREET_ART = [
  { artist: "Banksy", title: "Girl with Balloon", year: "2002", alt: ["Girl With Balloon"] },
  { artist: "Banksy", title: "Love is in the Air", year: "", alt: ["Flower Thrower", "Rage, the Flower Thrower", "Love Is In The Air"] },

  { artist: "Shepard Fairey", title: "Obey Giant", year: "", alt: ["OBEY", "Obey"] },
  { artist: "Shepard Fairey", title: "Marianne", year: "2015", alt: ["Marianne (Paris)", "Marianne 2015"] },

  { artist: "Keith Haring", title: "We the Youth", year: "1987", alt: ["We The Youth"] },

  { artist: "Iheart", title: "Nobody likes me", year: "2014", alt: ["Nobody Likes Me"] },

  { artist: "Bambi", title: "Don’t Shoot", year: "2015", alt: ["Don't Shoot", "Dont Shoot"] },

  { artist: "Jef Aérosol", title: "Chuuuuttt!", year: "2012", alt: ["Chuuuuttt", "Chuuuttt!", "Chuuttt!"] },
];

let WORKS = [];

function safe(v, fallback = "—") { return (v && String(v).trim().length) ? String(v).trim() : fallback; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function normalize(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^\w\s'-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v && String(v).trim().length) return String(v).trim();
  }
  return "";
}
function joinNonEmpty(vals, sep = " · ") {
  return vals.filter(v => v && String(v).trim().length).join(sep);
}
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

function buildWantedTitles(item){
  const arr = [];
  if (item?.title) arr.push(item.title);
  if (Array.isArray(item?.alt)) arr.push(...item.alt);
  return arr.map(normalize).filter(Boolean);
}

function buildSearchQuery(item) {
  const hints = MOVEMENT_SEARCH_HINTS.join(" ");
  return `${item.title} ${item.artist} ${hints}`;
}

async function aicSearchMany(item, limit = 12) {
  const q = buildSearchQuery(item);
  const url =
    `${AIC_BASE}/artworks/search` +
    `?q=${encodeURIComponent(q)}` +
    `&limit=${limit}` +
    `&fields=id,title,artist_title,date_display,image_id,medium_display,style_title,classification_titles,place_of_origin,term_titles,subject_titles`;

  const json = await fetchJSON(url);
  return json?.data || [];
}

function aicImageUrl(imageId, w = 1600) {
  if (!imageId) return "";
  return `https://www.artic.edu/iiif/2/${imageId}/full/${w},/0/default.jpg`;
}
function aicArtworkLink(id) {
  if (!id) return "";
  return `https://www.artic.edu/artworks/${id}`;
}

function scoreCandidate(candidate, item) {
  const wantA = normalize(item.artist);
  const wantTitles = buildWantedTitles(item);

  const t = normalize(candidate?.title);
  const a = normalize(candidate?.artist_title);

  const style = normalize(candidate?.style_title);
  const terms = Array.isArray(candidate?.term_titles) ? normalize(candidate.term_titles.join(" ")) : "";
  const subjects = Array.isArray(candidate?.subject_titles) ? normalize(candidate.subject_titles.join(" ")) : "";

  let score = 0;

  if (candidate?.image_id) score += 7;

  if (a && wantA && a.includes(wantA)) score += 10;

  let titleMatch = false;
  for (const w of wantTitles){
    if (t === w || t.includes(w) || w.includes(t)) { titleMatch = true; break; }
  }
  if (titleMatch) score += 10;

  const blob = `${style} ${terms} ${subjects}`;
  const streetSignals = ["street", "graffiti", "stencil", "mural", "urban"];
  for (const s of streetSignals) {
    if (blob.includes(s)) score += 2;
  }
  
  return score;
}

function pickBestNonDuplicate(candidates, item) {
  const ranked = [...candidates]
    .filter(c => c?.image_id)
    .map(c => ({ c, s: scoreCandidate(c, item) }))
    .sort((x, y) => y.s - x.s)
    .map(x => x.c);

  for (const c of ranked) {
    if (usedAicIds.has(c.id)) continue;
    if (usedImageIds.has(c.image_id)) continue;
    return c;
  }
  return null;
}

async function harvardSearchOne(item) {
  if (!HARVARD_KEY) return null;

  const q = `("${item.title}" OR title:"${item.title}") AND (${item.artist} OR people.name:"${item.artist}")`;
  const params = new URLSearchParams({ apikey: HARVARD_KEY, size: "10", q });
  const url = `${HARVARD_OBJECT_BASE}?${params.toString()}`;

  const json = await fetchJSON(url);
  const recs = json?.records || [];
  if (!recs.length) return null;

  const wantT = normalize(item.title);
  const wantA = normalize(item.artist);

  let best = null, bestScore = -1;
  for (const r of recs) {
    const rTitle = normalize(r.title);
    const rArtist = normalize((r.people && r.people[0] && r.people[0].name) || "");
    let score = 0;

    if (rArtist && wantA && rArtist.includes(wantA)) score += 6;
    if (rTitle && wantT && (rTitle.includes(wantT) || wantT.includes(rTitle))) score += 6;

    const cls = normalize(r.classification || "");
    const per = normalize(r.period || "");
    const txt = normalize((r.technique || "") + " " + (r.medium || "") + " " + (r.labeltext || "") + " " + (r.description || ""));

    const streetSignals = ["street", "graffiti", "stencil", "mural", "urban"];
    for (const s of streetSignals) {
      if (cls.includes(s) || per.includes(s) || txt.includes(s)) score += 2;
    }

    if (r.dated) score += 1;
    if (r.technique || r.medium) score += 1;
    if (r.labeltext || r.description) score += 1;

    if (score > bestScore) { bestScore = score; best = r; }
  }

  return best;
}
function harvardObjectLink(rec) { return rec?.url || ""; }

const cache = new Map();

async function buildArtwork(item) {
  const key = `${item.artist}::${item.title}`;
  if (cache.has(key)) return cache.get(key);

  const candidates = await aicSearchMany(item, 16);
  const chosen = pickBestNonDuplicate(candidates, item);
  const harvard = await harvardSearchOne(item).catch(() => null);

  if (!chosen) {
    cache.set(key, null);
    return null;
  }

  usedAicIds.add(chosen.id);
  usedImageIds.add(chosen.image_id);

  const unified = {
    artist: item.artist,
    title: item.title,
    year: item.year || null,

    aicId: chosen?.id || null,
    aicTitle: chosen?.title || null,
    aicArtist: chosen?.artist_title || null,
    aicDate: chosen?.date_display || null,
    aicMedium: chosen?.medium_display || null,
    aicStyle: chosen?.style_title || null,
    aicOrigin: chosen?.place_of_origin || null,
    aicClass: Array.isArray(chosen?.classification_titles) ? chosen.classification_titles.join(", ") : null,
    aicLink: aicArtworkLink(chosen?.id),
    image: aicImageUrl(chosen?.image_id, 1600),

    hTitle: harvard?.title || null,
    hArtist: (harvard?.people && harvard.people[0] && harvard.people[0].name) || null,
    hDate: harvard?.dated || null,
    hDesc: harvard?.labeltext || harvard?.description || null,
    hTechnique: harvard?.technique || null,
    hMedium: harvard?.medium || null,
    hClass: harvard?.classification || null,
    hPeriod: harvard?.period || null,
    hCulture: harvard?.culture || null,
    hCentury: harvard?.century || null,
    hLink: harvardObjectLink(harvard),

    fallbackDesc: "Obra representativa del Arte urbano."
  };

  cache.set(key, unified);
  return unified;
}

function workCardHTML(w, idx) {
  const title = safe(w.hTitle || w.aicTitle || w.title);
  const artist = safe(w.hArtist || w.aicArtist || w.artist);

  return `
    <article class="artCard" data-idx="${idx}" tabindex="0" aria-label="${title}">
      <div class="media">
        <img draggable="false" loading="eager" src="${w.image}" alt="${title}">
      </div>
      <div class="artMeta">
        <div class="kicker">${MOVEMENT_LABEL}</div>
        <h3>${title}</h3>
        <p>${artist}</p>
      </div>
    </article>
  `;
}

function renderWorks() {
  track.innerHTML = WORKS.map(workCardHTML).join("");
}

function factRow(label, value) {
  if (!value || !String(value).trim().length) return "";
  return `
    <div class="fact">
      <div class="factLabel">${label}</div>
      <div class="factValue">${value}</div>
    </div>
  `;
}

function openModal(rec) {
  if (!rec) return;

  lastFocusedEl = document.activeElement;

  const title = safe(rec.hTitle || rec.aicTitle || rec.title);
  const artist = safe(rec.hArtist || rec.aicArtist || rec.artist);

  // 👇 aquí entra tu año si la API no trae fecha
  const dated = firstNonEmpty(rec.hDate, rec.aicDate, rec.year);

  const technique = firstNonEmpty(rec.hTechnique, rec.hMedium, rec.aicMedium);
  const movement = firstNonEmpty(rec.hPeriod, rec.aicStyle, rec.hCentury, MOVEMENT_LABEL);
  const classification = firstNonEmpty(rec.hClass, rec.aicClass);
  const culture = firstNonEmpty(rec.hCulture, rec.aicOrigin);
  const desc = firstNonEmpty(rec.hDesc, rec.fallbackDesc);

  $mImg.attr("src", rec.image || "");
  $mImg.attr("alt", title);

  $mTitle.text(title);
  $mMeta.text(joinNonEmpty([artist, dated]));

  $mFacts.html(
    factRow("Descripción", desc) +
    factRow("Técnica / Medio", technique) +
    factRow("Movimiento / Estilo", movement) +
    factRow("Clasificación", classification) +
    factRow("Origen / Cultura", culture)
  );

  $mAic.attr("href", rec.aicLink || "#");
  if (rec.hLink) {
    $mHarvard.attr("href", rec.hLink).show();
  } else {
    $mHarvard.attr("href", "#").hide();
  }

  $modalOverlay.addClass("isOpen").attr("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $("#modalClose").focus();
}

function closeModal() {
  $modalOverlay.removeClass("isOpen").attr("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedEl && typeof lastFocusedEl.focus === "function") lastFocusedEl.focus();
}

$modalClose.on("click", closeModal);
$mCloseBtn.on("click", closeModal);
$modalOverlay.on("click", (e) => { if (e.target === $modalOverlay[0]) closeModal(); });
$(window).on("keydown", (e) => {
  if (e.key === "Escape" && $modalOverlay.hasClass("isOpen")) closeModal();
});

function setEndActionsVisible(visible) {
  if (!endActions) return;
  endActions.classList.toggle("isVisible", !!visible);
  endActions.setAttribute("aria-hidden", visible ? "false" : "true");
}

function isLastCardCentered() {
  const cards = track.querySelectorAll(".artCard");
  if (!cards.length) return false;

  const last = cards[cards.length - 1];
  const r = last.getBoundingClientRect();
  const center = window.innerWidth / 2;
  const lastCenter = r.left + r.width / 2;

  const TH = Math.max(18, r.width * 0.08);
  return Math.abs(lastCenter - center) <= TH;
}

function updateEndActions() {
  if (!WORKS || WORKS.length < 1) return;
  setEndActionsVisible(isLastCardCentered());
}

let currentX = 0, targetX = 0;
const ease = 0.075;

let startClientX = 0;
let startScrollY = 0;
let lastClientX  = 0;
let lastTime     = 0;
let velocityX    = 0;
let inertiaRAF   = null;
let snapTimer    = null;

function getScrollProgress() {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = section.offsetHeight - vh;
  const scrolled = clamp(-rect.top, 0, total);
  const p = total === 0 ? 0 : scrolled / total;
  return { p, total };
}
function maxX() {
  return Math.max(0, track.scrollWidth - window.innerWidth);
}
function updateEdgePadding() {
  const first = track.querySelector(".artCard");
  if (!first) return;
  const cardW = first.getBoundingClientRect().width;
  const edge = Math.max(18, (window.innerWidth - cardW) / 2);
  document.documentElement.style.setProperty("--edgePad", `${edge}px`);
}
function updateTargetX() {
  const { p } = getScrollProgress();
  targetX = -p * maxX();
}

function apply3DEffect() {
  const cards = track.querySelectorAll(".artCard");
  const centerX = window.innerWidth / 2;

  cards.forEach(card => {
    const r = card.getBoundingClientRect();
    const cardCenter = r.left + r.width / 2;
    const dist = (cardCenter - centerX) / centerX;
    const n = clamp(dist, -1, 1);

    const rotY  = n * -24;
    const z     = (1 - Math.abs(n)) * 160;
    const scale = 0.93 + (1 - Math.abs(n)) * 0.10;
    const tiltX = (1 - Math.abs(n)) * 1.8;

    card.style.transform =
      `translate3d(0,0,${z}px) rotateY(${rotY}deg) rotateX(${tiltX}deg) scale(${scale})`;

    const blur = Math.abs(n) * 1.05;
    const op   = 0.78 + (1 - Math.abs(n)) * 0.22;

    card.style.filter  = `blur(${blur}px)`;
    card.style.opacity = op;

    const img = card.querySelector("img");
    if (img) {
      const px = n * -18;
      const py = (1 - Math.abs(n)) * 6;
      img.style.transform = `translate3d(${px}px,${py}px,0) scale(1.08)`;
    }
  });
}

function tick() {
  currentX += (targetX - currentX) * ease;
  track.style.transform = `translate3d(${currentX}px,0,0)`;

  apply3DEffect();
  updateEndActions();

  requestAnimationFrame(tick);
}

function xToScrollDelta(dx) {
  const mx = maxX();
  const { total } = getScrollProgress();
  if (mx === 0 || total === 0) return 0;
  return (dx / mx) * total;
}
function stopInertia() {
  if (inertiaRAF) {
    cancelAnimationFrame(inertiaRAF);
    inertiaRAF = null;
  }
}
function snapToNearest() {
  const rect = section.getBoundingClientRect();
  if (!(rect.top <= 0 && rect.bottom >= window.innerHeight * 0.6)) return;

  const cards = Array.from(track.querySelectorAll(".artCard"));
  const centerX = window.innerWidth / 2;

  let best = null, bestDist = Infinity;
  for (const card of cards) {
    const r = card.getBoundingClientRect();
    const c = r.left + r.width / 2;
    const d = Math.abs(c - centerX);
    if (d < bestDist) { bestDist = d; best = card; }
  }
  if (!best) return;

  const r = best.getBoundingClientRect();
  const cardCenter = r.left + r.width / 2;
  const deltaToCenter = cardCenter - centerX;

  const mx = maxX();
  const { total } = getScrollProgress();
  if (mx === 0 || total === 0) return;

  const desiredX = currentX - deltaToCenter;
  const desiredXClamped = clamp(desiredX, -mx, 0);
  const desiredP = (-desiredXClamped) / mx;

  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const desiredScrollY = sectionTop + desiredP * total;

  window.scrollTo({ top: desiredScrollY, behavior: "smooth" });
}
function startInertia() {
  stopInertia();
  const friction = 0.92;
  const minV = 0.06;

  const step = () => {
    velocityX *= friction;
    if (Math.abs(velocityX) < minV) {
      inertiaRAF = null;
      snapToNearest();
      return;
    }
    window.scrollTo({ top: window.scrollY - xToScrollDelta(velocityX), behavior: "auto" });
    inertiaRAF = requestAnimationFrame(step);
  };
  inertiaRAF = requestAnimationFrame(step);
}

function onScroll() {
  updateTargetX();
  clearTimeout(snapTimer);
  snapTimer = setTimeout(() => snapToNearest(), 170);
}
function onResize() {
  updateEdgePadding();
  updateTargetX();
  apply3DEffect();
}

let isDown = false;
let dragged = false;
let downX = 0, downY = 0;
let pressedCardEl = null;

const DRAG_THRESHOLD_PX = 10;

function onPointerDown(e) {
  if (e.pointerType === "mouse" && e.button !== 0) return;

  const rect = sticky.getBoundingClientRect();
  if (e.clientY < rect.top || e.clientY > rect.bottom) return;

  isDown = true;
  dragged = false;

  downX = e.clientX;
  downY = e.clientY;

  pressedCardEl = e.target.closest(".artCard");

  startClientX = e.clientX;
  startScrollY = window.scrollY;
  lastClientX = e.clientX;
  lastTime = performance.now();
  velocityX = 0;

  stopInertia();
}

function onPointerMove(e) {
  if (!isDown) return;

  const dx0 = e.clientX - downX;
  const dy0 = e.clientY - downY;

  if (!dragged && Math.hypot(dx0, dy0) > DRAG_THRESHOLD_PX) {
    dragged = true;
    sticky.classList.add("isDragging");
    sticky.setPointerCapture?.(e.pointerId);
  }
  if (!dragged) return;

  const dragDx = e.clientX - startClientX;
  window.scrollTo({ top: startScrollY - xToScrollDelta(dragDx), behavior: "auto" });

  const now = performance.now();
  const dt = Math.max(8, now - lastTime);
  const dxFrame = e.clientX - lastClientX;
  velocityX = dxFrame / dt * 16;

  lastClientX = e.clientX;
  lastTime = now;
}

function onPointerUp() {
  if (!isDown) return;

  isDown = false;
  sticky.classList.remove("isDragging");

  if (dragged) {
    if (Math.abs(velocityX) > 0.35) startInertia();
    else snapToNearest();
  }
}

function onStickyClickCapture() {
  if (dragged) { pressedCardEl = null; return; }
  if (!pressedCardEl) return;

  const idx = Number(pressedCardEl.dataset.idx);
  if (!Number.isNaN(idx) && WORKS[idx]) openModal(WORKS[idx]);

  pressedCardEl = null;
}

async function loadWorks() {
  usedAicIds.clear();
  usedImageIds.clear();

  if (loadingTitle) loadingTitle.textContent = "Cargando obras de Arte urbano…";
  if (loadingSub) loadingSub.textContent = "AIC + Harvard";

  const built = [];
  for (const item of CURATED_STREET_ART) {
    try {
      const rec = await buildArtwork(item);
      if (rec && rec.image) built.push(rec);
    } catch (e) {}
  }

  WORKS = built;
  renderWorks();

  if (!WORKS.length) {
    if (loadingTitle) loadingTitle.textContent = "No se han podido cargar obras.";
    if (loadingSub) loadingSub.textContent = "Revisa consola / conexión / CORS.";
    return;
  }

  updateEdgePadding();
  updateTargetX();
  apply3DEffect();

  if (loadingLayer) {
    loadingLayer.style.display = "none";
    loadingLayer.setAttribute("aria-hidden", "true");
  }
}

function bind() {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  sticky.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", () => {
    isDown = false; dragged = false; pressedCardEl = null;
    sticky.classList.remove("isDragging");
  });

  sticky.addEventListener("click", onStickyClickCapture, true);

  window.addEventListener("keydown", (e) => {
    const card = document.activeElement?.closest?.(".artCard");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const idx = Number(card.dataset.idx);
      if (!Number.isNaN(idx) && WORKS[idx]) openModal(WORKS[idx]);
    }
  });

  if (btnContinue) {
    btnContinue.addEventListener("click", () => { window.location.href = CONTINUE_URL; });
  }
  if (btnExit) {
    btnExit.addEventListener("click", () => { window.location.href = EXIT_URL; });
  }
}

bind();
loadWorks().then(() => tick());

function focusWorkFromURL() {
  const params = new URLSearchParams(window.location.search);
  const idx = Number(params.get("obra"));
  if (Number.isNaN(idx)) return;

  const tryFocus = setInterval(() => {
    const card = document.querySelector(`.artCard[data-idx="${idx}"]`);
    if (!card) return;

    clearInterval(tryFocus);

    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const viewportCenter = window.innerWidth / 2;
    const deltaX = cardCenter - viewportCenter;

    const mx = maxX();
    const { total } = getScrollProgress();

    if (mx > 0 && total > 0) {
      const desiredX = currentX - deltaX;
      const clampedX = clamp(desiredX, -mx, 0);
      const p = (-clampedX) / mx;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const targetY = sectionTop + p * total;

      window.scrollTo({ top: targetY, behavior: "smooth" });
    }

  }, 100);
}
