/* ==========================================================================
   Trans Semarang Live — prototype logic (V1 screens + tab Rute gabungan)
   Semua data di file ini BERSIFAT SIMULASI untuk kebutuhan demo kompetisi.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
 * Data simulasi
 * ------------------------------------------------------------------------ */

const BUSES = [
  { id: "TS-101", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 3, max: 5 }, crowd: "low", note: "Pilihan nyaman", onboard: 14, capacity: 40, boarded: 6, alighted: 2, position: "Mendekati Pahlawan", latlng: [-6.9862, 110.4148] },
  { id: "TS-104", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 1, max: 3 }, crowd: "high", note: "Tiba lebih cepat", onboard: 36, capacity: 40, boarded: 11, alighted: 1, position: "Sekitar Kota Lama", latlng: [-6.9702, 110.4262] },
  { id: "TS-109", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 8, max: 11 }, crowd: "med", note: "Alternatif", onboard: 23, capacity: 40, boarded: 8, alighted: 4, position: "Mendekati Simpang Lima", latlng: [-6.9922, 110.4215] },
  { id: "TS-204", corridor: "Koridor 2", corridorKey: "corridor-2", destination: "Tembalang", eta: { min: 5, max: 8 }, crowd: "med", note: "Arah Tembalang", onboard: 21, capacity: 40, boarded: 5, alighted: 3, position: "Mendekati Simpang Lima", latlng: [-7.0200, 110.4300] },
];

// Daftar halte — kurasi halte nyata Trans Semarang (Koridor 1 & 2) sebagai
// REFERENSI peta. Koordinat adalah pendekatan (≈) untuk demo, bukan data
// operasional resmi. `distance` adalah simulasi jarak dari lokasi pengguna (m).
const STOPS = [
  // --- Koridor 1: Mangkang → Penggaron (via pusat kota) ---
  { id: "stop-mangkang", name: "Halte Mangkang", distance: 6800, corridor: "Koridor 1", accessible: true, latlng: [-6.9686, 110.3186] },
  { id: "stop-jerakah", name: "Halte Jerakah", distance: 5200, corridor: "Koridor 1", accessible: true, latlng: [-6.9731, 110.3392] },
  { id: "stop-krapyak", name: "Halte Krapyak", distance: 4300, corridor: "Koridor 1", accessible: true, latlng: [-6.9801, 110.3663] },
  { id: "stop-kalinjamu", name: "Halte Kalibanteng", distance: 3600, corridor: "Koridor 1", accessible: true, latlng: [-6.9847, 110.3808] },
  { id: "stop-pahlawan", name: "Halte Pahlawan", distance: 480, corridor: "Koridor 1", accessible: true, latlng: [-6.9845, 110.4090] },
  { id: "stop-madukoro", name: "Halte Madukoro", distance: 900, corridor: "Koridor 1", accessible: true, latlng: [-6.9819, 110.4028] },
  { id: "stop-simpanglima", name: "Halte Simpang Lima", distance: 120, corridor: "Koridor 1", accessible: true, latlng: [-6.9904, 110.4229] },
  { id: "stop-pandanaran", name: "Halte Pandanaran", distance: 350, corridor: "Koridor 1", accessible: true, latlng: [-6.9887, 110.4172] },
  { id: "stop-balaikota", name: "Halte Balaikota", distance: 780, corridor: "Koridor 1", accessible: true, latlng: [-6.9825, 110.4160] },
  { id: "stop-johar", name: "Halte Johar", distance: 1450, corridor: "Koridor 1", accessible: true, latlng: [-6.9765, 110.4196] },
  { id: "stop-stasiuntawang", name: "Halte Stasiun Tawang", distance: 1850, corridor: "Koridor 1", accessible: true, latlng: [-6.9689, 110.4235] },
  { id: "stop-kotalama", name: "Halte Kota Lama", distance: 2100, corridor: "Koridor 1", accessible: true, latlng: [-6.9683, 110.4279] },
  { id: "stop-mangunharjo", name: "Halte Mangkang Harjo", distance: 2450, corridor: "Koridor 1", accessible: true, latlng: [-6.9726, 110.4369] },
  { id: "stop-terboyo", name: "Halte Terboyo", distance: 4300, corridor: "Koridor 1", accessible: true, latlng: [-6.9525, 110.4488] },
  { id: "stop-penggaron", name: "Halte Penggaron", distance: 6100, corridor: "Koridor 1", accessible: true, latlng: [-6.9806, 110.4855] },

  // --- Koridor 2: Terboyo → Tembalang / Sisemut ---
  { id: "stop-pucanggading", name: "Halte Pucang Gading", distance: 4600, corridor: "Koridor 2", accessible: true, latlng: [-6.9760, 110.4645] },
  { id: "stop-pedurungan", name: "Halte Pedurungan", distance: 3900, corridor: "Koridor 2", accessible: true, latlng: [-6.9885, 110.4605] },
  { id: "stop-majapahit", name: "Halte Majapahit", distance: 2600, corridor: "Koridor 2", accessible: true, latlng: [-6.9930, 110.4470] },
  { id: "stop-undip", name: "Halte Undip", distance: 3200, corridor: "Koridor 2", accessible: true, latlng: [-7.0489, 110.4382] },
  { id: "stop-tembalang", name: "Halte Tembalang", distance: 5400, corridor: "Koridor 2", accessible: false, latlng: [-7.0560, 110.4380] },
  { id: "stop-banjarnegara", name: "Halte Sisemut", distance: 6300, corridor: "Koridor 2", accessible: false, latlng: [-7.0678, 110.4304] },
];

// Titik pusat peta Beranda (sekitar koridor Simpang Lima → Kota Lama)
const HOME_MAP_CENTER = [-6.9780, 110.4170];
const HOME_MAP_ZOOM = 14;

const CORRIDORS = [
  { key: "corridor-1", label: "Koridor 1", description: "Simpang Lima → Kota Lama", buses: 3 },
  { key: "corridor-2", label: "Koridor 2", description: "Simpang Lima → Tembalang", buses: 1 },
  { key: "feeder", label: "Feeder", description: "Penghubung Tembalang", buses: 0 },
];

const ROUTE_OPTIONS = [
  { id: "route-a", label: "Paling cepat", time: 32, transfers: 1, crowd: "med", via: "Koridor 2 → Koridor 1" },
  { id: "route-b", label: "Paling nyaman", time: 39, transfers: 0, crowd: "low", via: "Koridor 1 langsung" },
  { id: "route-c", label: "Alternatif", time: 35, transfers: 1, crowd: "high", via: "Feeder → Koridor 1" },
];

const CROWD_LABEL = { low: "Sepi", med: "Sedang", high: "Padat" };

const DATA_STATES = {
  live: { chipClass: "", chipText: "Live · diperbarui 20 detik lalu", chipShort: "Live", note: "Live · data diperbarui 20 detik lalu (simulasi).", offline: false, etaMode: "range", mapCaption: "3 bus aktif di sekitar Anda (simulasi)", busesVisible: true },
  recent: { chipClass: "freshness--stale", chipText: "Diperbarui 3 menit lalu", chipShort: "3 mnt lalu", note: "Recent · data diperbarui 3 menit lalu; akurasi bisa menurun.", offline: false, etaMode: "rangeWide", mapCaption: "Data posisi mungkin tertinggal beberapa menit", busesVisible: true },
  schedule: { chipClass: "freshness--schedule", chipText: "Estimasi jadwal · data live tidak tersedia", chipShort: "Jadwal", note: "Schedule · ETA diturunkan dari jadwal, bukan posisi bus langsung.", offline: false, etaMode: "schedule", mapCaption: "Menampilkan estimasi berdasarkan jadwal", busesVisible: true },
  unavailable: { chipClass: "freshness--off", chipText: "Data live sementara tidak tersedia", chipShort: "Tidak tersedia", note: "Unavailable · posisi bus tidak diketahui; tampilkan jadwal berikutnya.", offline: false, etaMode: "unavailable", mapCaption: "Posisi bus belum tersedia", busesVisible: false },
  weak: { chipClass: "freshness--off", chipText: "Koneksi lemah · data 2 menit lalu", chipShort: "Koneksi lemah", note: "Koneksi lemah · menampilkan data tersimpan; live tracking dijeda.", offline: true, etaMode: "stale", mapCaption: "Live tracking dijeda — menampilkan data tersimpan", busesVisible: true },
};

/* --------------------------------------------------------------------------
 * State bersama (screen aktif, selection, activeTrip, dataState)
 * ------------------------------------------------------------------------ */

const appState = {
  screen: "home",                  // layar yang sedang tampil
  selection: { type: null, id: null, routeId: null },
  routeMode: { corridorFilter: "all", destination: null },
  activeTrip: { exists: false, status: "empty", routeId: null, busId: null, stopsRemaining: null },
  dataState: "live",
  homeStopId: "stop-simpanglima",  // halte yang sedang ditampilkan di bottom sheet Beranda
  preferences: { reducedMotion: false },
};

/* --------------------------------------------------------------------------
 * Helper ETA (dipakai ulang dari V1)
 * ------------------------------------------------------------------------ */

function etaText(bus, mode) {
  switch (mode) {
    case "range": return `${bus.eta.min}–${bus.eta.max} mnt`;
    case "rangeWide": return `sekitar ${bus.eta.min + 1}–${bus.eta.max + 2} mnt`;
    case "schedule": return "Jadwal 08.20";
    case "unavailable": return "Jadwal 08.20";
    case "stale": return `${bus.eta.min}–${bus.eta.max} mnt*`;
    default: return `${bus.eta.min}–${bus.eta.max} mnt`;
  }
}

function etaSubtext(mode) {
  switch (mode) {
    case "schedule": return "berdasarkan jadwal";
    case "unavailable": return "posisi belum tersedia";
    case "stale": return "*data 2 mnt lalu";
    default: return null;
  }
}

function crowdBadgeHTML(crowd) {
  return `<span class="crowd-badge crowd-badge--${crowd}">${CROWD_LABEL[crowd]}</span>`;
}

/* --------------------------------------------------------------------------
 * Render — Beranda (daftar bus)
 * ------------------------------------------------------------------------ */

function renderBuses(state) {
  const list = document.getElementById("bus-list");
  if (!list) return;
  const mode = DATA_STATES[state].etaMode;
  const buses = DATA_STATES[state].busesVisible ? BUSES : [];
  if (!buses.length) {
    list.innerHTML = `<li class="bus-empty">Tidak ada bus yang terdeteksi saat ini.</li>`;
    return;
  }
  list.innerHTML = buses.slice(0, 4).map((bus) => {
    const sub = etaSubtext(mode);
    const pct = Math.round((bus.onboard / bus.capacity) * 100);
    return `
    <li class="bus-timeline__item">
      <button class="bus-row" type="button" data-home-bus="${bus.id}"
        aria-label="Bus ${bus.id}, tiba ${etaText(bus, mode)}, ${bus.onboard} dari ${bus.capacity} penumpang, kepadatan ${CROWD_LABEL[bus.crowd]}">
        <span class="bus-row__tile" aria-hidden="true">
          <svg class="icon"><use href="#i-bus" /></svg>
        </span>
        <span class="bus-row__info">
          <strong><span class="bus-row__dot bus-row__dot--${bus.crowd}" aria-hidden="true"></span>${bus.id}</strong>
          <span class="bus-row__capacity">
            <span class="bus-row__capacity-label"><span>Penumpang</span><b>${bus.onboard}/${bus.capacity}</b></span>
            <span class="bus-row__capacity-bar bus-row__capacity-bar--${bus.crowd}" role="img" aria-label="Keterisian ${pct} persen"><i style="width:${pct}%"></i></span>
          </span>
        </span>
        <span class="bus-row__meta">
          <span class="bus-row__eta"><svg class="icon" aria-hidden="true"><use href="#i-clock" /></svg>${etaText(bus, mode)}</span>
          ${sub ? `<span class="bus-row__sub">${sub}</span>` : ""}
        </span>
        <svg class="icon bus-row__chev" aria-hidden="true"><use href="#i-chevron" /></svg>
      </button>
    </li>`;
  }).join("");
}

/* Petakan label koridor halte ("Koridor 1") ke key bus ("corridor-1"). */
function stopCorridorKey(stop) {
  const c = CORRIDORS.find((x) => x.label === stop.corridor);
  return c ? c.key : null;
}

/* Halte terdekat dari lokasi pengguna (simulasi: jarak terendah). */
function nearestStop() {
  return [...STOPS].sort((a, b) => a.distance - b.distance)[0];
}

function formatDistance(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(1).replace(".", ",")} km` : `${m} m`;
}

/* --------------------------------------------------------------------------
 * Overlay slide-up: detail halte / detail bus (Beranda)
 * ------------------------------------------------------------------------ */

function openInfoOverlay(mode, id) {
  const overlay = document.getElementById("info-overlay");
  const body = document.getElementById("info-overlay-body");
  if (!overlay || !body) return;

  if (mode === "stop") {
    const stop = STOPS.find((s) => s.id === id) || nearestStop();
    body.innerHTML = stopDetailHTML(stop);
  } else {
    const bus = BUSES.find((b) => b.id === id) || BUSES[0];
    body.innerHTML = busDetailHTML(bus);
  }

  overlay.hidden = false;
  const close = overlay.querySelector("[data-close-overlay]");
  if (close) close.focus();
}

function closeInfoOverlay() {
  const overlay = document.getElementById("info-overlay");
  if (overlay) overlay.hidden = true;
}

function stopDetailHTML(stop) {
  const key = stopCorridorKey(stop);
  const buses = BUSES.filter((b) => b.corridorKey === key);
  const mode = DATA_STATES[appState.dataState].etaMode;
  return `
    <div class="info-detail">
      <div class="info-detail__head">
        <span class="info-detail__badge" aria-hidden="true"><svg class="icon"><use href="#i-location" /></svg></span>
        <div>
          <p class="info-detail__eyebrow">Halte terdekat</p>
          <h2 class="info-detail__title" id="info-overlay-title">${stop.name}</h2>
          <p class="info-detail__meta">${stop.corridor} · ${stop.accessible ? "akses tersedia" : "akses terbatas"}</p>
        </div>
      </div>
      <div class="info-detail__stats">
        <span class="info-detail__stat"><strong>${formatDistance(stop.distance)}</strong><small>jarak berjalan</small></span>
        <span class="info-detail__stat"><strong>${buses.length}</strong><small>bus terdeteksi</small></span>
        <span class="info-detail__stat"><strong>${stop.accessible ? "Ya" : "Tidak"}</strong><small>akses</small></span>
      </div>
      <section class="info-detail__section">
        <h3 class="section__title">Bus berikutnya</h3>
        <div class="info-detail__bus-list">
          ${buses.length ? buses.map((bus) => `
            <button class="info-detail__row" type="button" data-home-bus="${bus.id}">
              <span class="bus-row__tile" aria-hidden="true"><svg class="icon"><use href="#i-bus" /></svg></span>
              <div><strong>${bus.id}</strong><small>Arah ${bus.destination}</small></div>
              <span class="info-detail__spacer"></span>
              <span class="eta-chip"><svg class="icon" aria-hidden="true"><use href="#i-clock" /></svg>${etaText(bus, mode)}</span>
            </button>`).join("") : `<p class="muted">Belum ada bus terdeteksi.</p>`}
        </div>
      </section>
    </div>`;
}

function busDetailHTML(bus) {
  const mode = DATA_STATES[appState.dataState].etaMode;
  const pct = Math.round((bus.onboard / bus.capacity) * 100);
  return `
    <div class="info-detail">
      <div class="info-detail__head">
        <span class="info-detail__badge" aria-hidden="true"><svg class="icon"><use href="#i-bus" /></svg></span>
        <div>
          <p class="info-detail__eyebrow">Bus yang dipantau</p>
          <h2 class="info-detail__title" id="info-overlay-title">${bus.id}</h2>
          <p class="info-detail__meta">${bus.corridor} · arah ${bus.destination}</p>
        </div>
      </div>
      <div class="info-detail__stats">
        <span class="info-detail__stat"><strong>${etaText(bus, mode)}</strong><small>tiba di halte</small></span>
        <span class="info-detail__stat"><strong>${bus.onboard}/${bus.capacity}</strong><small>penumpang (sensor)</small></span>
        <span class="info-detail__stat"><strong>${CROWD_LABEL[bus.crowd]}</strong><small>kepadatan</small></span>
      </div>
      <section class="info-detail__section">
        <h3 class="section__title">Status perjalanan</h3>
        <div class="info-detail__bus-list">
          <div class="info-detail__row">
            ${crowdBadgeHTML(bus.crowd)}
            <div><strong>Keterisian ${pct}%</strong><small>dari kapasitas ${bus.capacity} kursi</small></div>
            <span class="info-detail__spacer"></span>
            <span class="info-detail__value">${bus.onboard}/${bus.capacity}</span>
          </div>
          <div class="info-detail__row">
            <div><strong>${bus.position}</strong><small>posisi dari GPS bus</small></div>
            <span class="info-detail__spacer"></span>
            <span class="info-detail__value info-detail__value--soft">+${bus.boarded} naik · −${bus.alighted} turun</span>
          </div>
          <div class="info-detail__row">
            <div><strong>${bus.note}</strong><small>catatan untuk perjalanan ini</small></div>
          </div>
        </div>
      </section>
    </div>`;
}

function renderStopBuses() {
  const list = document.getElementById("stop-buses");
  if (!list) return;
  list.innerHTML = BUSES.slice(0, 3).map((bus) => `
    <li><button class="detail-bus-row" type="button" data-go="bus" aria-label="Lihat detail ${bus.id}">
      <div><strong>${bus.id} · ${bus.corridor}</strong><small>Arah ${bus.destination}</small></div>
      <span class="eta-chip">${bus.eta.min}–${bus.eta.max} mnt</span>
      ${crowdBadgeHTML(bus.crowd)}
    </button></li>`).join("");
}

/* --------------------------------------------------------------------------
 * Mode Cari Rute — sheet di atas peta Beranda yang sama (Leaflet).
 * Tidak ada peta kedua: pencarian rute hanya panel + filter koridor.
 * ------------------------------------------------------------------------ */

/* Bus yang lolos filter koridor aktif. */
function visibleBusesByCorridor() {
  const f = appState.routeMode.corridorFilter;
  return BUSES.filter((bus) => f === "all" || bus.corridorKey === f);
}

/* Terapkan filter koridor pada marker bus di peta Beranda. */
function applyCorridorFilterToHomeMap() {
  const visibleIds = new Set(visibleBusesByCorridor().map((b) => b.id));
  const busesShown = DATA_STATES[appState.dataState].busesVisible;
  Object.entries(homeBusMarkers).forEach(([id, marker]) => {
    const el = marker.getElement();
    const show = busesShown && visibleIds.has(id);
    if (el) el.style.display = show ? "" : "none";
  });
}

/* Isi sheet Cari Rute: input tujuan, filter koridor, opsi rute A/B/C. */
function renderRouteSheet() {
  const body = document.getElementById("route-sheet-body");
  if (!body) return;
  const filter = appState.routeMode.corridorFilter;
  const corridors = CORRIDORS.filter((c) => filter === "all" || c.key === filter);
  const searchQuery = appState.routeMode.destination || "";
  body.innerHTML = `
    <div class="panel-section">
      <label class="panel-search-label">Tujuan
        <input class="panel-search-input" id="panel-destination" type="text" value="${searchQuery}"
          placeholder="Mis. Kota Lama" autocomplete="off" />
      </label>
    </div>
    <div class="panel-section">
      <div class="section__head"><h2 class="section__title">Filter koridor</h2><span class="muted">${corridors.length} aktif</span></div>
      <div class="map-filter-row" role="group" aria-label="Filter koridor">
        <button class="map-filter${filter === "all" ? " is-active" : ""}" type="button" data-panel-corridor="all">Semua</button>
        ${CORRIDORS.map((c) => `<button class="map-filter${filter === c.key ? " is-active" : ""}" type="button" data-panel-corridor="${c.key}">${c.label}</button>`).join("")}
      </div>
    </div>
    <div class="panel-section" id="panel-route-results">
      <div class="section__head"><h2 class="section__title">Pilihan rute</h2><span class="muted">simulasi</span></div>
      ${ROUTE_OPTIONS.map((r) => `
        <button class="route-option route-option--panel${appState.selection.routeId === r.id ? " is-selected" : ""}" type="button" data-select-route="${r.id}">
          <span class="route-option__label">${r.label}</span><strong>${r.time} menit</strong>
          <span>${r.transfers} transfer · <b class="crowd-text--${r.crowd}">${CROWD_LABEL[r.crowd]}</b></span>
          <small>${r.via}</small>
        </button>`).join("")}
    </div>
    ${routeDetailHTML(appState.selection.routeId)}`;
}

function routeDetailHTML(routeId) {
  const r = ROUTE_OPTIONS.find((x) => x.id === routeId);
  if (!r) return "";
  return `
    <div class="panel-section panel-route-detail">
      <div class="section__head"><h2 class="section__title">${r.label}</h2><button class="link-btn" type="button" data-clear-route>Hapus pilihan</button></div>
      <p class="muted">${r.via} · ${r.time} menit · ${r.transfers} transfer · ${CROWD_LABEL[r.crowd]}</p>
      <div class="route-legs">
        <div class="route-leg"><span class="route-leg__line route-leg__line--walk"></span>Jalan kaki 6 mnt ke Halte Tembalang</div>
        <div class="route-leg"><span class="route-leg__line route-leg__line--bus"></span>Bus ${r.via}</div>
        <div class="route-leg"><span class="route-leg__line route-leg__line--walk"></span>Jalan kaki 4 mnt ke tujuan</div>
      </div>
      <div class="route-stop-picker">
        <label>Halte naik<select id="board-stop">${STOPS.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select></label>
        <label>Halte turun<select id="alight-stop">${STOPS.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select></label>
      </div>
      <button class="btn btn--primary btn--full" type="button" data-choose-route="${r.id}">Pilih rute ini</button>
    </div>`;
}

/* Buka / tutup sheet Cari Rute (mode di atas peta Beranda). */
function openRouteSheet() {
  const sheet = document.getElementById("route-sheet");
  if (!sheet) return;
  sheet.dataset.sheetState = "open";
  sheet.setAttribute("aria-hidden", "false");
  renderRouteSheet();
  const input = document.getElementById("panel-destination");
  if (input) input.focus();
}

function closeRouteSheet() {
  const sheet = document.getElementById("route-sheet");
  if (!sheet) return;
  sheet.dataset.sheetState = "hidden";
  sheet.setAttribute("aria-hidden", "true");
}

/* --------------------------------------------------------------------------
 * Demo controls → data state (Beranda)
 * ------------------------------------------------------------------------ */

function applyState(state) {
  const cfg = DATA_STATES[state];
  if (!cfg) return;
  appState.dataState = state;

  const chip = document.getElementById("freshness-chip");
  const banner = document.getElementById("offline-banner");
  const note = document.getElementById("demo-state-desc");

  if (chip) {
    chip.className = `freshness freshness--home ${cfg.chipClass}`.trim();
    const chipLabel = chip.querySelector(".freshness__text");
    if (chipLabel) chipLabel.textContent = cfg.chipShort;
  }
  if (banner) banner.hidden = !cfg.offline;
  if (note) note.textContent = cfg.note;

  renderBuses(state);
  applyCorridorFilterToHomeMap();
  if (typeof renderRouteSheet === "function") renderRouteSheet();

  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.state === state);
  });
}

/* --------------------------------------------------------------------------
 * Navigasi antar-layar (tanpa bottom nav — semua dari Beranda)
 * ------------------------------------------------------------------------ */

// Layar sekunder yang bisa dibuka dari Beranda / flow.
const SCREEN_NAMES = ["home", "trip", "explore", "profile", "onboarding", "stop", "alerts", "accessibility"];

function setHeroVisible(screenName) {
  const hero = document.querySelector(".hero");
  if (hero) hero.hidden = screenName !== "home";
}

/* Tampilkan satu layar (semua layar lain disembunyikan). */
function showScreen(screenName) {
  document.querySelectorAll(".screen-view").forEach((screen) => {
    screen.hidden = screen.dataset.screen !== screenName;
  });
  setHeroVisible(screenName);
  const content = document.querySelector(`[data-screen="${screenName}"]`);
  if (content) content.scrollTop = 0;
  if (screenName !== "home") closeRouteSheet();
  updateHomeChrome();
}

function goHome() {
  closeRouteSheet();
  showScreen("home");
}

/* Tombol/aksi Beranda → layar. */
function initNavigation() {
  document.addEventListener("click", (event) => {
    // Tombol di Beranda
    if (event.target.closest("#home-explore-btn")) { showScreen("explore"); return; }
    if (event.target.closest("#home-profile-btn")) { showScreen("profile"); return; }
    if (event.target.closest("#home-trip-btn")) { showScreen("trip"); return; }

    const trigger = event.target.closest("[data-go]");
    if (!trigger) return;
    const dest = trigger.dataset.go;
    event.preventDefault();

    // Pencarian rute → buka sheet Cari Rute di atas peta Beranda
    if (dest === "map" || dest === "route-search" || dest === "route-results") {
      showScreen("home");
      openRouteSheet();
      return;
    }
    // "Lihat di peta" dari detail halte → fokus halte di peta Beranda
    const focusStopBtn = event.target.closest("[data-focus-stop]");
    if (focusStopBtn) {
      showScreen("home");
      showHomeStop(focusStopBtn.dataset.focusStop, { pan: true, flash: true });
      return;
    }
    if (dest === "home") { goHome(); return; }
    if (SCREEN_NAMES.includes(dest)) { showScreen(dest); return; }
    showScreen(dest);
  });
}

/* --------------------------------------------------------------------------
 * Interaksi sheet Cari Rute (mode di atas peta Beranda)
 * ------------------------------------------------------------------------ */

function initRouteSheet() {
  const sheet = document.getElementById("route-sheet");
  const grip = document.getElementById("route-sheet-grip");
  const back = document.getElementById("route-sheet-back");
  if (grip) grip.addEventListener("click", closeRouteSheet);
  if (back) back.addEventListener("click", closeRouteSheet);

  // Filter koridor di dalam sheet
  if (sheet) sheet.addEventListener("click", (event) => {
    const cor = event.target.closest("[data-panel-corridor]");
    if (cor) {
      appState.routeMode.corridorFilter = cor.dataset.panelCorridor;
      applyCorridorFilterToHomeMap();
      renderRouteSheet();
      return;
    }
    // Pilih opsi rute → tampilkan detail
    const selectRoute = event.target.closest("[data-select-route]");
    if (selectRoute) {
      appState.selection = { ...appState.selection, routeId: selectRoute.dataset.selectRoute };
      renderRouteSheet();
      return;
    }
    const clearRoute = event.target.closest("[data-clear-route]");
    if (clearRoute) {
      appState.selection = { ...appState.selection, routeId: null };
      renderRouteSheet();
      return;
    }
    // Pilih rute ini → buat trip aktif, buka layar Trip
    const chooseRoute = event.target.closest("[data-choose-route]");
    if (chooseRoute) {
      startActiveTrip(appState.selection.routeId || "route-b", null);
      return;
    }
  });

  // Input tujuan (delegasi — di-render ulang)
  document.addEventListener("input", (event) => {
    if (event.target.id === "panel-destination") {
      appState.routeMode.destination = event.target.value;
    }
  });
}

/* Mulai trip aktif dari sebuah rute / bus lalu tampilkan layar Trip. */
function startActiveTrip(routeId, busId) {
  const bus = busId || (appState.selection.type === "bus" ? appState.selection.id : "TS-101");
  appState.activeTrip = {
    exists: true,
    status: "waiting",
    routeId: routeId || "route-b",
    busId: bus,
    stopsRemaining: 2,
  };
  closeRouteSheet();
  renderTripScreen();
  showScreen("trip");
  updateHomeChrome();
}

/* --------------------------------------------------------------------------
 * Tab Trip — status empty / waiting / riding / arrived (SATU activeTrip)
 * ------------------------------------------------------------------------ */

function renderTripScreen() {
  const screen = document.getElementById("trip-screen");
  if (!screen) return;
  const t = appState.activeTrip;
  const bus = BUSES.find((b) => b.id === t.busId);
  const route = ROUTE_OPTIONS.find((r) => r.id === t.routeId);
  updateHomeChrome();

  if (!t.exists) {
    screen.innerHTML = `
      <div class="screen-topbar"><button class="icon-btn icon-btn--small" type="button" data-go="home" aria-label="Kembali">‹</button><span>Trip</span><span></span></div>
      <section class="trip-empty">
        <span class="trip-empty__icon"><svg class="icon"><use href="#i-trip" /></svg></span>
        <h1 class="screen-title">Belum ada perjalanan</h1>
        <p class="screen-copy">Cari rute dari Beranda untuk memulai perjalananmu.</p>
        <button class="btn btn--primary btn--full" type="button" data-go="route-search">Cari rute</button>
      </section>`;
    return;
  }

  if (t.status === "waiting") {
    screen.innerHTML = `
      <div class="screen-topbar"><span>Trip</span><button class="icon-btn icon-btn--small" type="button" aria-label="Info trip">Info</button></div>
      <section class="trip-hero"><p class="eyebrow">Menunggu bus</p><h1 class="screen-title">${bus ? bus.id : "Bus"} menuju halte</h1>
        <p class="muted" style="color:rgba(255,255,255,.85)">${route ? route.via + " · " + route.time + " menit" : ""} · ${bus ? CROWD_LABEL[bus.crowd] : ""}</p></section>
      <section class="card trip-now"><p class="eyebrow">Bus yang dipilih</p><h2>${bus ? bus.id + " · " + bus.corridor : "-"}</h2><p class="muted">ETA ${bus ? bus.eta.min + "–" + bus.eta.max + " menit" : ""} · ${bus ? bus.position : ""}</p></section>
      <div class="trip-actions">
        <button class="btn btn--ghost btn--full" type="button" id="trip-view-map">Lihat di peta live</button>
        <button class="btn btn--primary btn--full" type="button" id="trip-board">Saya sudah naik</button>
      </div>`;
    return;
  }

  if (t.status === "riding") {
    screen.innerHTML = `
      <div class="screen-topbar"><span>Trip</span><button class="icon-btn icon-btn--small" type="button" aria-label="Notifikasi trip">Info</button></div>
      <section class="trip-hero"><p class="eyebrow">Dalam perjalanan</p><h1 class="screen-title">Kota Lama</h1>
        <div class="trip-progress"><span style="width: 42%"></span></div>
        <div class="trip-progress-meta"><span>Naik ${bus ? bus.id : "bus"}</span><strong id="trip-countdown">Turun ${t.stopsRemaining} halte lagi</strong></div></section>
      <section class="card trip-now"><div class="trip-now__badge">Sekarang</div><p class="eyebrow">Halte saat ini</p><h2>Simpang Lima</h2><p class="muted">${bus ? bus.id + " · " + bus.corridor + " · " + CROWD_LABEL[bus.crowd] : ""}</p></section>
      <div class="trip-actions">
        <button class="btn btn--ghost btn--full" type="button" id="trip-view-map">Lihat di peta live</button>
        <button class="btn btn--primary btn--full" type="button" id="trip-advance">Saya sudah melewati halte ini</button>
      </div>`;
    return;
  }

  // arrived
  screen.innerHTML = `
    <div class="screen-topbar"><span>Trip</span><span></span></div>
    <section class="trip-empty">
      <span class="trip-empty__icon"><svg class="icon"><use href="#i-location" /></svg></span>
      <h1 class="screen-title">Tiba di tujuan</h1>
      <p class="screen-copy">Kamu sudah sampai di Kota Lama. Perjalanan selesai.</p>
      <button class="btn btn--primary btn--full" type="button" id="trip-end">Akhiri perjalanan</button>
    </section>`;
}

function applyTripTrackingUI() {
  const text = document.getElementById("trip-tracking-text");
  const t = appState.activeTrip;
  if (t.exists && text) {
    text.textContent = t.status === "riding" ? `Turun ${t.stopsRemaining} halte lagi` : `Menunggu ${t.busId}`;
  }
}

function initTripEvents() {
  document.addEventListener("click", (event) => {
    const t = appState.activeTrip;

    if (event.target.closest("#trip-view-map")) {
      // Kembali ke peta Beranda dan sorot bus trip
      showScreen("home");
      appState.selection = { ...appState.selection, type: "bus", id: t.busId };
      recenterToBus(t.busId);
      return;
    }

    if (event.target.closest("#trip-board")) {
      t.status = "riding";
      renderTripScreen();
      return;
    }

    if (event.target.closest("#trip-advance")) {
      t.stopsRemaining = Math.max(0, t.stopsRemaining - 1);
      if (t.stopsRemaining === 0) t.status = "arrived";
      renderTripScreen();
      return;
    }

    if (event.target.closest("#trip-end")) {
      appState.activeTrip = { exists: false, status: "empty", routeId: null, busId: null, stopsRemaining: null };
      renderTripScreen();
      return;
    }
  });
}

/* --------------------------------------------------------------------------
 * Interaksi V1 yang dipertahankan
 * ------------------------------------------------------------------------ */

function initFavorite() {
  const fav = document.getElementById("favorite-stop");
  if (!fav) return;
  fav.addEventListener("click", () => {
    const pressed = fav.getAttribute("aria-pressed") === "true";
    fav.setAttribute("aria-pressed", String(!pressed));
    fav.textContent = pressed ? "Simpan halte" : "Halte tersimpan";
  });
}

function initRouteSearchLegacy() {
  // Form rute V1 sudah digabung ke panel tab Rute — tidak lagi diperlukan.
}

function initToggles() {
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const active = toggle.getAttribute("aria-pressed") === "true" || toggle.classList.contains("is-on");
      toggle.classList.toggle("is-on", !active);
      toggle.setAttribute("aria-pressed", String(!active));
      if (toggle.getAttribute("aria-label") === "Kurangi gerakan") {
        appState.preferences.reducedMotion = !active;
      }
    });
  });
}

function initTripProgress() {
  const button = document.getElementById("advance-trip");
  const counter = document.getElementById("trip-countdown");
  if (!button || !counter) return;
  let step = 2;
  button.addEventListener("click", () => {
    step = Math.max(0, step - 1);
    counter.textContent = step === 0 ? "Sampai di tujuan" : `Turun ${step} halte lagi`;
    button.textContent = step === 0 ? "Perjalanan selesai" : "Saya sudah melewati halte ini";
    button.disabled = step === 0;
  });
}

function initDemoControls() {
  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyState(btn.dataset.state));
  });
}

/* --------------------------------------------------------------------------
 * Peta nyata Beranda — Leaflet + OpenStreetMap (gratis, tanpa API key).
 * Marker halte & bus adalah SIMULASI di atas peta nyata.
 * ------------------------------------------------------------------------ */

let homeMap = null;
let homeUserMarker = null;
let homeBusMarkers = {};
let homeStopMarkers = {};

const MAP_BUS_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="3.5" width="15" height="13" rx="2.5" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M4.5 10h15" stroke="#fff" stroke-width="1.8"/><circle cx="8" cy="19.2" r="1.6" fill="#fff"/><circle cx="16" cy="19.2" r="1.6" fill="#fff"/></svg>`;

// Jumlah halte terdekat yang labelnya ditampilkan di peta (sisanya disembunyikan
// agar peta tidak penuh). Halte terpilih selalu ditampilkan.
const HOME_STOP_VISIBLE = 4;

/* Pilih halte yang ditampilkan di peta: beberapa terdekat + halte terpilih. */
function visibleHomeStops() {
  const nearest = [...STOPS].sort((a, b) => a.distance - b.distance);
  const picked = nearest.slice(0, HOME_STOP_VISIBLE);
  const selected = STOPS.find((s) => s.id === appState.homeStopId);
  if (selected && !picked.includes(selected)) picked.push(selected);
  return picked;
}

/* Gambar ulang marker halte (dipanggil saat init & saat fokus halte berubah). */
function renderHomeStopMarkers() {
  if (!homeMap) return;
  Object.values(homeStopMarkers).forEach((m) => homeMap.removeLayer(m));
  homeStopMarkers = {};
  visibleHomeStops().forEach((stop) => {
    const selected = stop.id === appState.homeStopId ? " is-selected" : "";
    const icon = L.divIcon({
      className: "",
      html: `<span class="map-stop-pin${selected}"><svg class="icon map-stop-pin__icon" aria-hidden="true"><use href="#i-bus-stop" /></svg>${stop.name.replace("Halte ", "")}</span>`,
      iconSize: null,
      iconAnchor: [0, 0],
    });
    homeStopMarkers[stop.id] = L.marker(stop.latlng, { icon })
      .addTo(homeMap)
      .on("click", () => {
        appState.homeStopId = stop.id;
        renderHomeStopMarkers();
        openInfoOverlay("stop", stop.id);
      });
  });
}

function initHomeMap() {
  const el = document.getElementById("home-map-leaflet");
  if (!el) return;
  if (homeMap) return;

  const loading = document.getElementById("map-loading");
  const errorEl = document.getElementById("map-error");
  if (loading) loading.hidden = false;
  if (errorEl) errorEl.hidden = true;

  // Leaflet gagal dimuat (CDN offline): tampilkan state kegagalan, bukan peta kosong.
  if (typeof L === "undefined") {
    if (loading) loading.hidden = true;
    if (errorEl) errorEl.hidden = false;
    return;
  }

  homeMap = L.map(el, {
    center: HOME_MAP_CENTER,
    zoom: HOME_MAP_ZOOM,
    zoomControl: true,           // kontrol zoom tetap ada (aksesibilitas)
    zoomControlPosition: "topleft",
    attributionControl: true,
  });

  let tileLoaded = false;
  const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  tiles.on("load", () => {
    tileLoaded = true;
    if (loading) loading.hidden = true;
  });
  tiles.on("tileerror", () => {
    // Hanya tampilkan error bila tidak ada satupun tile yang berhasil.
    if (!tileLoaded) {
      if (loading) loading.hidden = true;
      if (errorEl) errorEl.hidden = false;
    }
  });
  tiles.addTo(homeMap);

  // Timeout cadangan: bila tile tak kunjung memuat, tampilkan error state.
  setTimeout(() => {
    if (!tileLoaded && errorEl && !homeMap._loadedOnce) {
      if (loading) loading.hidden = true;
      errorEl.hidden = false;
    }
  }, 8000);

  // Marker halte — hanya tampilkan beberapa halte terdekat + halte terpilih
  // agar peta tetap bersih (label tidak saling tumpang tindih).
  homeStopMarkers = {};

  // Marker bus (klik → buka detail bus)
  BUSES.forEach((bus, i) => {
    const icon = L.divIcon({
      className: "",
      html: `<span class="map-bus-dot${i % 2 ? " map-bus-dot--alt" : ""}">${MAP_BUS_ICON}</span>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    homeBusMarkers[bus.id] = L.marker(bus.latlng, { icon })
      .addTo(homeMap)
      .on("click", () => openInfoOverlay("bus", bus.id));
  });

  // Titik lokasi pengguna
  const userIcon = L.divIcon({
    className: "",
    html: '<span class="map-user-dot"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  homeUserMarker = L.marker(HOME_MAP_CENTER, { icon: userIcon, interactive: false }).addTo(homeMap);

  // Tampilkan halte terdekat secara default
  showHomeStop(nearestStop().id, { pan: true });

  // Paksa peta menghitung ukuran ulang setelah layout/animasi tab
  setTimeout(() => {
    if (!homeMap) return;
    homeMap.invalidateSize();
    homeMap._loadedOnce = true;
  }, 300);
}

/* Pusatkan peta ke lokasi pengguna (dengan offset sheet). */
function homeRecenter() {
  if (!homeMap) return;
  centerWithSheetOffset(HOME_MAP_CENTER, HOME_MAP_ZOOM);
}

/* Fokus peta ke sebuah halte. */
function showHomeStop(stopId, opts = {}) {
  const stop = STOPS.find((s) => s.id === stopId);
  if (!stop) return;
  appState.homeStopId = stop.id;
  if (homeMap) {
    clearBusHighlight(); // lepas sorotan bus bila ada
    renderHomeStopMarkers(); // pastikan halte terpilih ikut tampil + tersorot
    if (opts.pan) {
      centerWithSheetOffset(stop.latlng, HOME_MAP_ZOOM);
      if (opts.flash) pingStopMarker(stop.id);
    }
  }
}

/* Lepas sorotan + denyut pada semua marker bus. */
function clearBusHighlight() {
  Object.values(homeBusMarkers).forEach((marker) => {
    const el = marker.getElement();
    if (!el) return;
    const dot = el.querySelector(".map-bus-dot");
    if (dot) dot.classList.remove("is-selected", "is-pinged");
  });
  if (homeBusHighlightTimer) { clearTimeout(homeBusHighlightTimer); homeBusHighlightTimer = null; }
}

/* Denyut singkat pada marker halte terpilih. */
let homeStopHighlightTimer = null;
function pingStopMarker(stopId) {
  if (appState.preferences.reducedMotion) return;
  const marker = homeStopMarkers[stopId];
  const el = marker && marker.getElement();
  const pin = el && el.querySelector(".map-stop-pin");
  if (!pin) return;
  pin.classList.remove("is-pinged");
  if (homeStopHighlightTimer) clearTimeout(homeStopHighlightTimer);
  requestAnimationFrame(() => pin.classList.add("is-pinged"));
  homeStopHighlightTimer = setTimeout(() => pin.classList.remove("is-pinged"), 1200);
}

/* Fokus peta ke sebuah bus (recenter ke posisi bus + sorot markernya). */
let homeBusHighlightTimer = null;

/* Pusatkan peta ke sebuah latlng, lalu geser agar titik berada di tengah
   area peta yang terlihat (di atas bottom sheet). Sign-proof: setelah view
   diterapkan, posisi titik diukur di layar lalu digeser sebesar selisihnya. */
function centerWithSheetOffset(latlng, zoom) {
  if (!homeMap) return;
  homeMap.setView(latlng, zoom, { animate: false });

  const sheet = document.getElementById("home-sheet");
  const size = homeMap.getSize(); // area peta (px)
  // Pakai tinggi TARGET (target state) agar hasil benar walau transisi CSS
  // ketinggian sheet masih berjalan saat fungsi ini dipanggil.
  const targetState = sheet ? (sheet.dataset.sheetState || "default") : "default";
  const covered = sheet ? Math.min(sheetHeightPx(targetState), size.y) : 0;
  const visibleBottom = size.y - covered;      // dasar area peta yang terlihat
  const desiredY = visibleBottom / 2;          // tengah area yang terlihat

  const current = homeMap.latLngToContainerPoint(latlng);
  const deltaY = current.y - desiredY;         // geser titik ke posisi diinginkan
  if (Math.abs(deltaY) > 0.5) homeMap.panBy([0, deltaY], { animate: false });
}

function recenterToBus(busId, flash = true) {
  const bus = BUSES.find((b) => b.id === busId);
  if (!bus || !homeMap) return;

  // Lepas sorotan halte & bus lain, lalu fokuskan ke bus ini.
  appState.homeStopId = null;
  renderHomeStopMarkers();
  clearBusHighlight();

  centerWithSheetOffset(bus.latlng, HOME_MAP_ZOOM + 1);

  // Sorot marker bus terpilih, kosongkan lainnya.
  Object.entries(homeBusMarkers).forEach(([id, marker]) => {
    const el = marker.getElement();
    if (!el) return;
    const dot = el.querySelector(".map-bus-dot");
    if (dot) dot.classList.toggle("is-selected", id === bus.id);
  });

  // Denyut singkat: menarik perhatian ke bus yang baru difokuskan.
  const reduced = appState.preferences.reducedMotion;
  if (flash && !reduced) {
    const marker = homeBusMarkers[bus.id];
    const el = marker && marker.getElement();
    const dot = el && el.querySelector(".map-bus-dot");
    if (dot) {
      dot.classList.remove("is-pinged");
      if (homeBusHighlightTimer) clearTimeout(homeBusHighlightTimer);
      requestAnimationFrame(() => dot.classList.add("is-pinged"));
      homeBusHighlightTimer = setTimeout(() => dot.classList.remove("is-pinged"), 1200);
    }
  }
}

/* Bus terdekat (simulasi: ETA terkecil yang terlihat). */
function nearestBus() {
  return [...BUSES].sort((a, b) => a.eta.min - b.eta.min)[0];
}

/* Toast singkat di Beranda (aria-live) — mengonfirmasi aksi tanpa membuka overlay. */
let homeToastTimer = null;
function showHomeToast(message) {
  const toast = document.getElementById("home-toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  if (homeToastTimer) clearTimeout(homeToastTimer);
  homeToastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

/* --------------------------------------------------------------------------
 * Bottom sheet Beranda — geser (drag) antara 3 tinggi:
 *   full     : peta nyaris penuh (sheet hanya menyisakan grip + ringkasan)
 *   default  : tinggi ringkas (62%) untuk daftar bus
 *   expanded : daftar diperluas (92%)
 * State disimpan di data-sheet-state; ketinggian aktual dibaca dari DOM.
 * ------------------------------------------------------------------------ */

const SHEET_STATES = ["full", "default", "expanded"];

// Persentase tinggi sheet — harus selaras dengan token CSS:
//   --home-sheet-height (default) & --home-sheet-expanded.
const SHEET_HEIGHT_DEFAULT = 0.62;
const SHEET_HEIGHT_EXPANDED = 0.92;

function sheetViewportHeight() {
  const screen = document.querySelector(".phone__screen") || document.documentElement;
  return screen.clientHeight || 844;
}

function sheetHeightPx(state) {
  const base = sheetViewportHeight();
  if (state === "full") {
    const token = getComputedStyle(document.documentElement).getPropertyValue("--home-sheet-full");
    return parseFloat(token) || 96;
  }
  if (state === "expanded") return base * SHEET_HEIGHT_EXPANDED;
  return base * SHEET_HEIGHT_DEFAULT;
}

function setSheetState(state, opts = {}) {
  const sheet = document.getElementById("home-sheet");
  if (!sheet) return;
  if (!SHEET_STATES.includes(state)) return;
  sheet.dataset.sheetState = state;

  // Sinkronkan label aksesibilitas grip.
  const grip = document.getElementById("home-sheet-grip");
  if (grip) grip.setAttribute("aria-expanded", String(state === "expanded"));

  // Offset kontrol peta tidak perlu di-set manual — ResizeObserver menanganinya.
}

/* Selaraskan posisi tombol recenter dengan tepi atas sheet.
   Menulis tinggi sheet (px) ke variabel pada .home-map agar tombol tetap
   sejajar walau sheet sedang dianimasikan atau digeser. */
function updateSheetOffsetVar() {
  const sheet = document.getElementById("home-sheet");
  const map = document.querySelector(".home-map");
  if (!sheet || !map) return;
  const h = sheet.getBoundingClientRect().height;
  map.style.setProperty("--home-sheet-px", `${Math.round(h)}px`);
}

function initHomeSheet() {
  const sheet = document.getElementById("home-sheet");
  const grip = document.getElementById("home-sheet-grip");
  if (!sheet || !grip) return;

  updateSheetOffsetVar();
  setSheetState("default");

  // Ikuti tinggi sheet secara kontinu: saat transisi CSS maupun saat drag.
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => updateSheetOffsetVar());
    ro.observe(sheet);
  } else {
    // Fallback: rAF loop singkat saat state berubah sudah memadai.
    updateSheetOffsetVar();
  }

  const body = document.getElementById("home-sheet-body");
  let dragStartY = 0;
  let dragStartHeight = 0;
  let dragging = false;
  let moved = false;
  let pointerId = null;
  let lastTargetState = "default";

  const pointerToState = (deltaY) => {
    // deltaY > 0 = drag ke bawah (kecilkan sheet)
    const height = dragStartHeight - deltaY; // px tinggi sheet saat ini
    let best = SHEET_STATES[0];
    let bestDist = Infinity;
    SHEET_STATES.forEach((s) => {
      const d = Math.abs(sheetHeightPx(s) - height);
      if (d < bestDist) { bestDist = d; best = s; }
    });
    return best;
  };

  const onMove = (event) => {
    if (!dragging) return;
    const deltaY = event.clientY - dragStartY;
    if (Math.abs(deltaY) > 4) moved = true;
    let height = dragStartHeight - deltaY;
    // Batasi antara "full" dan "expanded"
    height = Math.max(sheetHeightPx("full"), Math.min(sheetHeightPx("expanded"), height));
    sheet.style.height = `${height}px`;
    updateSheetOffsetVar();
    const next = pointerToState(deltaY);
    if (next !== lastTargetState) {
      lastTargetState = next;
      sheet.dataset.sheetState = next;
    }
  };

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    sheet.classList.remove("is-dragging");
    sheet.style.height = "";
    const state = sheet.dataset.sheetState || "default";
    setSheetState(state);
    if (pointerId !== null) {
      try { grip.releasePointerCapture(pointerId); } catch (e) { /* abaikan */ }
    }
    pointerId = null;
  };

  const startDrag = (event) => {
    dragging = true;
    moved = false;
    pointerId = event.pointerId;
    dragStartY = event.clientY;
    dragStartHeight = sheet.getBoundingClientRect().height;
    lastTargetState = sheet.dataset.sheetState || "default";
    sheet.classList.add("is-dragging");
    try { grip.setPointerCapture(pointerId); } catch (e) { /* abaikan */ }
  };

  grip.addEventListener("pointerdown", (event) => {
    if (body && body.scrollTop > 0) return; // biarkan scroll isi sheet lebih dulu
    startDrag(event);
  });
  grip.addEventListener("pointermove", onMove);
  grip.addEventListener("pointerup", endDrag);
  grip.addEventListener("pointercancel", endDrag);

  // Klik murni (tanpa geser) pada grip: siklus full → default → expanded → full
  grip.addEventListener("click", () => {
    if (moved) { moved = false; return; } // geser tadi sudah menangani state
    const order = { full: "default", default: "expanded", expanded: "full" };
    const cur = sheet.dataset.sheetState || "default";
    setSheetState(order[cur]);
  });

  // Saat isi sheet di-scroll ke atas melewati batas, geser sheet ke state berikutnya
  if (body) {
    let touchStartY = null;
    body.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
    body.addEventListener("touchend", (e) => {
      if (touchStartY === null) return;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartY = null;
      if (dy > 40 && body.scrollTop <= 0) {
        // geser ke bawah di puncak isi → kecilkan sheet
        const cur = sheet.dataset.sheetState || "default";
        if (cur !== "full") setSheetState(cur === "expanded" ? "default" : "full");
      }
    }, { passive: true });
  }

  // Selaraskan offset saat ukuran layar berubah (responsif)
  window.addEventListener("resize", updateSheetOffsetVar);
}

function initHomeMapControls() {
  const recenter = document.getElementById("home-recenter");
  if (recenter) recenter.addEventListener("click", () => {
    homeRecenter();
  });

  // Halte terdekat → recenter ke halte terdekat (marker disorot + berdenyut)
  const nearest = document.getElementById("home-nearest-stop");
  if (nearest) nearest.addEventListener("click", () => {
    const stop = nearestStop();
    showHomeStop(stop.id, { pan: true, flash: true });
    showHomeToast(`Dipusatkan ke ${stop.name} · ${formatDistance(stop.distance)} · ${stop.corridor}`);
  });

  // Bus terdekat → recenter ke bus terdekat di peta (marker disorot + berdenyut)
  const busBtn = document.getElementById("home-bus-detail");
  if (busBtn) busBtn.addEventListener("click", () => {
    const bus = nearestBus();
    recenterToBus(bus.id);
    showHomeToast(`Dipusatkan ke ${bus.id} · ${etaText(bus, DATA_STATES[appState.dataState].etaMode)} · ${CROWD_LABEL[bus.crowd]}`);
  });

  // Bus di daftar diklik → buka detail bus (overlay), bukan recenter peta
  const busList = document.getElementById("bus-list");
  if (busList) busList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-home-bus]");
    if (btn) openInfoOverlay("bus", btn.dataset.homeBus);
  });

  // Tutup overlay (scrim / handle) + tombol Escape
  const overlay = document.getElementById("info-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target.closest("[data-close-overlay]")) closeInfoOverlay();
      const busBtn2 = e.target.closest("[data-home-bus]");
      if (busBtn2) openInfoOverlay("bus", busBtn2.dataset.homeBus);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) closeInfoOverlay();
    });
  }

  const retry = document.getElementById("map-retry");
  if (retry) retry.addEventListener("click", () => {
    const errorEl = document.getElementById("map-error");
    if (errorEl) errorEl.hidden = true;
    homeMap = null;
    initHomeMap();
  });
}

/* --------------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------------ */

/* Perbarui elemen chrome Beranda yang bergantung pada state (badge trip, banner). */
function updateHomeChrome() {
  const tripBtn = document.getElementById("home-trip-btn");
  const badge = document.getElementById("home-trip-badge");
  const banner = document.getElementById("trip-tracking-banner");
  const t = appState.activeTrip;
  const active = t.exists && t.status !== "arrived";
  if (tripBtn) tripBtn.hidden = !active;
  if (badge) badge.hidden = !active;
  applyTripTrackingUI();
  if (banner) banner.hidden = !active || appState.screen !== "home";
}

document.addEventListener("DOMContentLoaded", () => {
  initDemoControls();
  initFavorite();
  renderStopBuses();
  initNavigation();
  initRouteSheet();
  initRouteSearchLegacy();
  initToggles();
  initTripProgress();
  initTripEvents();
  renderTripScreen();
  applyState("live");
  showScreen("home");
  initHomeMap();
  initHomeMapControls();
  initHomeSheet();
});