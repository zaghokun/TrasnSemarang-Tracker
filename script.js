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

// Tinggi area peta yang tertutup bottom sheet (px di viewport ponsel).
// Dipakai untuk menggeser peta agar marker berada di area yang terlihat.
function homeMapSheetOffset() {
  const canvas = document.getElementById("home-map-leaflet");
  if (!canvas) return 0;
  return Math.round(canvas.clientHeight * 0.26); // dorong koridor ke area peta yang terlihat
}

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
 * State bersama (activeTab, panel, selection, activeTrip, dataState)
 * ------------------------------------------------------------------------ */

const appState = {
  activeTab: "home",
  panelHeight: "ringkas",          // "ringkas" | "daftar"
  panelTab: "rute",               // "rute" | "halte" | "bus"
  selection: { type: null, id: null, routeId: null },
  routeMode: { view: "default", corridorFilter: "all", followBusId: null, legendOpen: false, destination: null },
  activeTrip: { exists: false, status: "empty", routeId: null, busId: null, stopsRemaining: null },
  dataState: "live",
  homeStopId: "stop-simpanglima",  // halte yang sedang ditampilkan di bottom sheet Beranda
  preferences: { reducedMotion: false },
};

/* --------------------------------------------------------------------------
 * Animasi bus: requestAnimationFrame, hormati reduced-motion,
 * berhenti saat tab Rute tidak terlihat.
 * ------------------------------------------------------------------------ */

const BUS_PATH = { x1: 20, y1: 264, x2: 340, y2: 54 }; // titik awal/akhir koridor 1
let busAnimationId = null;
const busProgress = { "TS-101": 0.25, "TS-104": 0.65, "TS-109": 0.45, "TS-204": 0.8 };

function busPoint(progress, phase = 0) {
  const t = (progress + phase) % 1;
  const x = BUS_PATH.x1 + (BUS_PATH.x2 - BUS_PATH.x1) * t;
  const y = BUS_PATH.y1 + (BUS_PATH.y2 - BUS_PATH.y1) * t;
  return { x: (x / 360) * 100, y: (y / 330) * 100 };
}

function animateBuses(timestamp) {
  if (appState.activeTab !== "route" || appState.dataState !== "live") {
    busAnimationId = null;
    return;
  }
  Object.keys(busProgress).forEach((id, i) => {
    busProgress[id] += 0.0006;
    const el = document.querySelector(`[data-map-bus="${id}"].live-bus`);
    if (el) {
      const p = busPoint(busProgress[id], i * 0.05);
      el.style.left = `${p.x}%`;
      el.style.top = `${p.y}%`;
    }
  });
  busAnimationId = requestAnimationFrame(animateBuses);
}

function startBusAnimation() {
  const reduced = appState.preferences.reducedMotion ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || busAnimationId) return;
  busAnimationId = requestAnimationFrame(animateBuses);
}

function stopBusAnimation() {
  if (busAnimationId) cancelAnimationFrame(busAnimationId);
  busAnimationId = null;
}

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
          <div class="info-detail__row"><div><strong>${bus.position}</strong><small>posisi dari GPS bus</small></div></div>
          <div class="info-detail__row"><div><strong>+${bus.boarded} naik · −${bus.alighted} turun</strong><small>sensor naik/turun (interval terakhir)</small></div></div>
          <div class="info-detail__row"><div><strong>Keterisian ${pct}%</strong><small>dari kapasitas ${bus.capacity} kursi</small></div>
            <span class="info-detail__spacer"></span>${crowdBadgeHTML(bus.crowd)}</div>
          <div class="info-detail__row"><div><strong>${bus.note}</strong><small>catatan untuk perjalanan ini</small></div></div>
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
 * Render — Tab Rute: marker peta + panel (3 tab internal)
 * ------------------------------------------------------------------------ */

function routeMapBuses() {
  return BUSES.filter((bus) => appState.routeMode.corridorFilter === "all" || bus.corridorKey === appState.routeMode.corridorFilter);
}

function renderRouteMap() {
  const layer = document.getElementById("route-bus-layer");
  const stopsLayer = document.getElementById("route-stop-layer");
  const canvas = document.getElementById("route-canvas");
  if (!layer || !stopsLayer) return;
  if (canvas) canvas.classList.toggle("has-selected-route", !!appState.selection.routeId);
  const visible = routeMapBuses();
  const state = DATA_STATES[appState.dataState];
  const mode = state.etaMode;
  const busesShown = state.busesVisible ? visible : [];

  layer.innerHTML = busesShown.map((bus, i) => {
    const cls = ["one", "two", "three", "four"][i % 4];
    const selected = appState.selection.type === "bus" && appState.selection.id === bus.id ? " is-selected" : "";
    const stale = appState.dataState === "recent" || appState.dataState === "weak" ? " is-stale" : "";
    return `<button class="live-bus live-bus--${cls}${selected}${stale}" type="button" data-map-bus="${bus.id}"
      aria-label="Bus ${bus.id}, ${bus.corridor}, tiba ${etaText(bus, mode)}, kepadatan ${CROWD_LABEL[bus.crowd]}">
      <svg class="icon" aria-hidden="true"><use href="#i-bus" /></svg><span class="live-bus__id">${bus.id.replace("TS-", "")}</span></button>`;
  }).join("");

  stopsLayer.innerHTML = STOPS.map((stop) => {
    const posClass = stop.id === "stop-simpanglima" ? "one" : stop.id === "stop-pahlawan" ? "two" : stop.id === "stop-kotalama" ? "three" : "four";
    return `<button class="map-stop map-stop--${posClass}" type="button" data-map-stop="${stop.id}"
      aria-label="${stop.name}, jarak ${stop.distance} meter, ${stop.corridor}">
      <span></span><b>${stop.name.replace("Halte ", "")}</b></button>`;
  }).join("");
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

function renderPanelRute() {
  const el = document.getElementById("panel-rute");
  if (!el) return;
  const filter = appState.routeMode.corridorFilter;
  const corridors = CORRIDORS.filter((c) => filter === "all" || c.key === filter);
  const searchQuery = appState.routeMode.destination || "";
  el.innerHTML = `
    <div class="panel-section">
      <label class="panel-search-label">Tujuan
        <input class="panel-search-input" id="panel-destination" type="text" value="${searchQuery}" placeholder="Mis. Kota Lama" />
      </label>
    </div>
    <div class="panel-section">
      <div class="section__head"><h2 class="section__title">Koridor</h2><span class="muted">${corridors.length} aktif</span></div>
      ${corridors.map((c) => `
        <button class="panel-corridor-row" type="button" data-select-corridor="${c.key}">
          <span class="corridor-line corridor-line--${c.key}" aria-hidden="true"></span>
          <span class="panel-corridor-row__info"><strong>${c.label}</strong><small>${c.description}</small></span>
          <span class="eta-chip">${c.buses} bus</span>
        </button>`).join("")}
    </div>
    <div class="panel-section" id="panel-route-results">
      <div class="section__head"><h2 class="section__title">Tembalang → Kota Lama</h2><span class="muted">simulasi</span></div>
      ${ROUTE_OPTIONS.map((r) => `
        <button class="route-option route-option--panel${appState.selection.routeId === r.id ? " is-selected" : ""}" type="button" data-select-route="${r.id}">
          <span class="route-option__label">${r.label}</span><strong>${r.time} menit</strong>
          <span>${r.transfers} transfer · <b class="crowd-text--${r.crowd}">${CROWD_LABEL[r.crowd]}</b></span>
          <small>${r.via}</small>
        </button>`).join("")}
    </div>
    ${routeDetailHTML(appState.selection.routeId)}`;
}

function renderPanelHalte() {
  const el = document.getElementById("panel-halte");
  if (!el) return;
  const sorted = [...STOPS].sort((a, b) => a.distance - b.distance);
  el.innerHTML = `
    <div class="panel-section">
      <div class="section__head"><h2 class="section__title">Halte terdekat</h2><span class="muted">${sorted.length}</span></div>
      ${sorted.map((stop) => `
        <button class="panel-stop-row" type="button" data-map-stop="${stop.id}">
          <span class="stop-card__pin stop-card__pin--sm"><svg class="icon"><use href="#i-location" /></svg></span>
          <span class="panel-stop-row__info"><strong>${stop.name}</strong><small>${stop.distance} m · ${stop.corridor}${stop.accessible ? " · akses tersedia" : ""}</small></span>
          <svg class="icon panel-row-chev" aria-hidden="true"><use href="#i-chevron" /></svg>
        </button>`).join("")}
    </div>`;
}

function renderPanelBus() {
  const el = document.getElementById("panel-bus");
  if (!el) return;
  const state = DATA_STATES[appState.dataState];
  const mode = state.etaMode;
  el.innerHTML = `
    <div class="panel-section">
      <div class="section__head"><h2 class="section__title">Bus beroperasi</h2><span class="muted">${BUSES.length} bus</span></div>
      ${BUSES.map((bus) => `
        <button class="map-bus-row" type="button" data-map-bus="${bus.id}">
          <span class="bus-card__badge"><svg class="icon"><use href="#i-bus" /></svg></span>
          <span class="map-bus-row__info"><strong>${bus.id} · ${bus.corridor}</strong><small>${bus.position} · arah ${bus.destination}</small></span>
          <span class="eta-chip">${etaText(bus, mode)}</span>
          ${crowdBadgeHTML(bus.crowd)}
        </button>`).join("")}
      <button class="btn btn--primary btn--full" type="button" data-choose-bus="${appState.selection.type === "bus" ? appState.selection.id : ""}" id="choose-bus-btn"${appState.selection.type === "bus" ? "" : " disabled"}>${appState.selection.type === "bus" ? `Pilih bus ini (${appState.selection.id})` : "Pilih bus di peta atau daftar dahulu"}</button>
    </div>`;
}

function renderRoutePanels() {
  renderPanelRute();
  renderPanelHalte();
  renderPanelBus();
}

/* --------------------------------------------------------------------------
 * Panel — toggle Ringkas/Daftar + tab internal
 * ------------------------------------------------------------------------ */

function applyPanelHeight() {
  const panel = document.getElementById("route-panel");
  const handle = document.getElementById("panel-handle");
  if (!panel || !handle) return;
  const expanded = appState.panelHeight === "daftar";
  panel.classList.toggle("is-expanded", expanded);
  handle.setAttribute("aria-expanded", String(expanded));
  handle.querySelector("span").textContent = expanded ? "Ringkas" : "Daftar";
}

function applyPanelTab() {
  document.querySelectorAll(".panel-tab").forEach((tab) => {
    const active = tab.dataset.panelTab === appState.panelTab;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  ["rute", "halte", "bus"].forEach((key) => {
    const section = document.getElementById(`panel-${key}`);
    if (section) section.hidden = key !== appState.panelTab;
  });
}

/* --------------------------------------------------------------------------
 * Demo controls → data state (Beranda + Rute)
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

  // Freshness chip di tab Rute
  const routeChip = document.getElementById("route-freshness");
  if (routeChip) {
    routeChip.className = `freshness freshness--floating ${cfg.chipClass}`.trim();
    routeChip.querySelector(".freshness__text").textContent = cfg.chipText;
  }

  renderBuses(state);
  renderRouteMap();
  renderRoutePanels();

  if (appState.dataState === "live" && appState.activeTab === "route") startBusAnimation();
  else stopBusAnimation();

  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.state === state);
  });
}

/* --------------------------------------------------------------------------
 * Navigasi tab & layar
 * ------------------------------------------------------------------------ */

const TAB_TO_SCREEN = { home: "home", route: "route", trip: "trip", explore: "explore", profile: "profile" };

// Hero header ("Selamat pagi...") hanya milik Beranda; layar lain memakai areanya sendiri
function setHeroVisible(screenName) {
  const hero = document.querySelector(".hero");
  if (hero) hero.hidden = screenName !== "home";
}

function showTab(tab, options = {}) {
  appState.activeTab = tab;
  const targetScreen = options.screenOverride || TAB_TO_SCREEN[tab];
  document.querySelectorAll(".screen-view").forEach((screen) => {
    screen.hidden = screen.dataset.screen !== targetScreen;
  });
  setHeroVisible(targetScreen);
  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.dataset.tab === tab;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  const content = document.querySelector(`[data-screen="${TAB_TO_SCREEN[tab]}"]`);
  if (content) content.scrollTop = 0;

  if (options.routeView) appState.routeMode.view = options.routeView;
  if (options.panelTab) { appState.panelTab = options.panelTab; applyPanelTab(); }
  if (options.focusBus) { appState.selection = { type: "bus", id: options.focusBus }; }
  if (options.focusStop) { appState.selection = { type: "stop", id: options.focusStop }; }
  if (tab === "route") {
    renderRouteMap();
    applyPanelHeight();
    applyTripTrackingUI();
    startBusAnimation();
  } else {
    stopBusAnimation();
  }
}

// Kompatibilitas dengan layar detail V1 (stop, bus, alerts, accessibility)
function showLegacyScreen(screenName) {
  document.querySelectorAll(".screen-view").forEach((screen) => {
    screen.hidden = screen.dataset.screen !== screenName;
  });
  setHeroVisible(screenName);
  stopBusAnimation();
}

function initNavigation() {
  document.addEventListener("click", (event) => {
    const tabBtn = event.target.closest("[data-tab]");
    if (tabBtn) { showTab(tabBtn.dataset.tab); return; }

    const trigger = event.target.closest("[data-go]");
    if (!trigger) return;
    const dest = trigger.dataset.go;
    event.preventDefault();

    // "Lihat di peta" dari Stop/Bus Detail V1 → tab Rute terfokus
    const focusStopBtn = event.target.closest("[data-focus-stop]");
    if (focusStopBtn) {
      showTab("route", { panelTab: "halte" });
      appState.selection = { ...appState.selection, type: "stop", id: focusStopBtn.dataset.focusStop };
      renderRouteMap();
      return;
    }

    // Destinasi lama V1 yang kini masuk tab Rute
    if (dest === "map" || dest === "route-search" || dest === "route-results") {
      showTab("route", { routeView: dest === "route-search" ? "search" : "default" });
      return;
    }
    if (dest === "home" || dest === "trip" || dest === "explore" || dest === "profile") {
      showTab(dest);
      return;
    }
    // Detail V1 lain (stop, bus, alerts, accessibility, onboarding)
    showLegacyScreen(dest);
  });
}

/* --------------------------------------------------------------------------
 * Interaksi panel Rute
 * ------------------------------------------------------------------------ */

function initRoutePanel() {
  const handle = document.getElementById("panel-handle");
  if (handle) {
    handle.addEventListener("click", () => {
      appState.panelHeight = appState.panelHeight === "ringkas" ? "daftar" : "ringkas";
      applyPanelHeight();
    });
  }

  document.querySelectorAll(".panel-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      appState.panelTab = tab.dataset.panelTab;
      applyPanelTab();
    });
  });

  document.querySelectorAll(".map-filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      appState.routeMode.corridorFilter = filter.dataset.mapRoute;
      document.querySelectorAll(".map-filter").forEach((f) => f.classList.toggle("is-active", f === filter));
      renderRouteMap();
      renderRoutePanels();
    });
  });

  // Input tujuan di panel Rute (delegasi — di-render ulang)
  document.addEventListener("input", (event) => {
    if (event.target.id === "panel-destination") {
      appState.routeMode.destination = event.target.value;
    }
  });

  // Search bar mengambang di peta → fokus ke input panel
  const routeSearchBar = document.getElementById("route-search-bar");
  if (routeSearchBar) routeSearchBar.addEventListener("click", () => {
    appState.panelHeight = "daftar";
    appState.panelTab = "rute";
    applyPanelHeight();
    applyPanelTab();
    const input = document.getElementById("panel-destination");
    if (input) input.focus();
  });

  // Delegasi klik marker bus/halte (di-render ulang, jadi pakai delegation)
  document.addEventListener("click", (event) => {
    const busBtn = event.target.closest("[data-map-bus]");
    if (busBtn) {
      appState.selection = { type: "bus", id: busBtn.dataset.mapBus };
      appState.routeMode.followBusId = busBtn.dataset.mapBus;
      renderRouteMap();
      const toast = document.getElementById("route-toast");
      const bus = BUSES.find((b) => b.id === busBtn.dataset.mapBus);
      if (toast && bus) toast.textContent = `${bus.id} · ${bus.corridor} · arah ${bus.destination} · ${CROWD_LABEL[bus.crowd]} · kamera mengikuti bus`;
      return;
    }
    const stopBtn = event.target.closest("[data-map-stop]");
    if (stopBtn) {
      appState.selection = { ...appState.selection, type: "stop", id: stopBtn.dataset.mapStop };
      appState.panelTab = "halte";
      applyPanelTab();
      const stop = STOPS.find((s) => s.id === stopBtn.dataset.mapStop);
      const toast = document.getElementById("route-toast");
      if (toast && stop) toast.textContent = `${stop.name} · ${stop.distance} m · ${stop.corridor}`;
      return;
    }

    // Pilih opsi rute → detail + sorot garis
    const selectRoute = event.target.closest("[data-select-route]");
    if (selectRoute) {
      appState.selection = { ...appState.selection, routeId: selectRoute.dataset.selectRoute };
      renderRouteMap();
      renderPanelRute();
      const toast = document.getElementById("route-toast");
      if (toast) toast.textContent = "Rute disorot di peta — rute lain diredupkan";
      return;
    }

    const clearRoute = event.target.closest("[data-clear-route]");
    if (clearRoute) {
      appState.selection = { ...appState.selection, routeId: null };
      renderRouteMap();
      renderPanelRute();
      return;
    }

    // Pilih rute ini / bus ini → buat SATU trip aktif, pindah ke tab Trip
    const chooseRoute = event.target.closest("[data-choose-route]");
    const chooseBus = event.target.closest("[data-choose-bus]");
    if (chooseRoute || chooseBus) {
      const bus = appState.selection.type === "bus" ? appState.selection.id : "TS-101";
      const routeId = appState.selection.routeId || "route-b";
      appState.activeTrip = {
        exists: true,
        status: "waiting",
        routeId,
        busId: chooseBus ? appState.selection.id : bus,
        stopsRemaining: 2,
      };
      renderTripScreen();
      showTab("trip");
      return;
    }
  });

  const recenter = document.getElementById("route-recenter");
  if (recenter) recenter.addEventListener("click", () => {
    appState.routeMode.followBusId = null;
    const toast = document.getElementById("route-toast");
    if (toast) toast.textContent = "Peta dipusatkan ke lokasi Anda";
  });

  const legendToggle = document.getElementById("route-legend-toggle");
  const legend = document.getElementById("route-legend");
  if (legendToggle && legend) legendToggle.addEventListener("click", () => {
    appState.routeMode.legendOpen = !appState.routeMode.legendOpen;
    legend.hidden = !appState.routeMode.legendOpen;
  });
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
  const navTrip = document.querySelector('.nav-item[data-tab="trip"]');
  if (navTrip) navTrip.classList.toggle("has-active-trip", t.exists && t.status !== "arrived");

  if (!t.exists) {
    screen.innerHTML = `
      <div class="screen-topbar"><span>Trip</span><span></span></div>
      <section class="trip-empty">
        <span class="trip-empty__icon"><svg class="icon"><use href="#i-trip" /></svg></span>
        <h1 class="screen-title">Belum ada perjalanan</h1>
        <p class="screen-copy">Pilih rute atau bus di tab Rute untuk memulai perjalananmu.</p>
        <button class="btn btn--primary btn--full" type="button" data-tab="route">Jelajahi rute</button>
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
  const banner = document.getElementById("trip-tracking-banner");
  const text = document.getElementById("trip-tracking-text");
  const exploreBtn = document.getElementById("explore-other-routes");
  const t = appState.activeTrip;
  const tracking = appState.routeMode.view === "tripTracking" && t.exists;
  if (banner) banner.hidden = !tracking;
  if (exploreBtn) exploreBtn.hidden = !tracking;
  if (tracking && text) {
    text.textContent = t.status === "riding" ? `Turun ${t.stopsRemaining} halte lagi` : `Menunggu ${t.busId}`;
  }
}

function initTripEvents() {
  document.addEventListener("click", (event) => {
    const t = appState.activeTrip;

    if (event.target.closest("#trip-view-map")) {
      showTab("route");
      appState.routeMode.followBusId = t.busId;
      appState.routeMode.view = "tripTracking";
      appState.selection = { ...appState.selection, type: "bus", id: t.busId };
      renderRouteMap();
      applyTripTrackingUI();
      return;
    }

    if (event.target.closest("#explore-other-routes")) {
      appState.routeMode.view = "default";
      appState.routeMode.followBusId = null;
      applyTripTrackingUI();
      renderRouteMap();
      const toast = document.getElementById("route-toast");
      if (toast) toast.textContent = "Keluar dari mode pelacakan — trip tetap aktif di tab Trip";
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
        if (!active) stopBusAnimation();
        else startBusAnimation();
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
    const icon = L.divIcon({
      className: "",
      html: `<span class="map-stop-pin"><svg class="icon map-stop-pin__icon" aria-hidden="true"><use href="#i-bus-stop" /></svg>${stop.name.replace("Halte ", "")}</span>`,
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
  homeMap.setView(HOME_MAP_CENTER, HOME_MAP_ZOOM, { animate: false });
  const offset = homeMapSheetOffset();
  if (offset > 0) homeMap.panBy([0, offset], { animate: false });
}

/* Fokus peta ke sebuah halte. */
function showHomeStop(stopId, opts = {}) {
  const stop = STOPS.find((s) => s.id === stopId);
  if (!stop) return;
  appState.homeStopId = stop.id;
  if (homeMap) {
    renderHomeStopMarkers(); // pastikan halte terpilih ikut tampil
    if (opts.pan) {
      const offset = homeMapSheetOffset();
      homeMap.setView(stop.latlng, HOME_MAP_ZOOM, { animate: false });
      if (offset > 0) homeMap.panBy([0, offset], { animate: false });
    }
  }
}

/* Fokus peta ke sebuah bus (recenter ke posisi bus + sorot markernya). */
function recenterToBus(busId) {
  const bus = BUSES.find((b) => b.id === busId);
  if (!bus || !homeMap) return;
  const offset = homeMapSheetOffset();
  homeMap.setView(bus.latlng, HOME_MAP_ZOOM + 1, { animate: true });
  if (offset > 0) homeMap.panBy([0, offset], { animate: true });

  // Sorot marker bus terpilih, kosongkan lainnya.
  Object.entries(homeBusMarkers).forEach(([id, marker]) => {
    const el = marker.getElement();
    if (!el) return;
    const dot = el.querySelector(".map-bus-dot");
    if (dot) dot.classList.toggle("is-selected", id === bus.id);
  });
}

/* Bus terdekat (simulasi: ETA terkecil yang terlihat). */
function nearestBus() {
  return [...BUSES].sort((a, b) => a.eta.min - b.eta.min)[0];
}

function initHomeMapControls() {
  const recenter = document.getElementById("home-recenter");
  if (recenter) recenter.addEventListener("click", () => {
    homeRecenter();
  });

  // Halte terdekat → cukup recenter ke halte terdekat (tanpa popup)
  const nearest = document.getElementById("home-nearest-stop");
  if (nearest) nearest.addEventListener("click", () => {
    const stop = nearestStop();
    showHomeStop(stop.id, { pan: true });
  });

  // Bus terdekat → recenter ke bus terdekat di peta
  const busBtn = document.getElementById("home-bus-detail");
  if (busBtn) busBtn.addEventListener("click", () => {
    recenterToBus(nearestBus().id);
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

document.addEventListener("DOMContentLoaded", () => {
  initDemoControls();
  initFavorite();
  renderStopBuses();
  initNavigation();
  initRoutePanel();
  initRouteSearchLegacy();
  initToggles();
  initTripProgress();
  initTripEvents();
  renderTripScreen();
  applyState("live");
  showTab("home");
  initHomeMap();
  initHomeMapControls();
});