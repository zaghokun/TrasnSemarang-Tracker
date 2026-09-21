/* ==========================================================================
   Trans Semarang Live — prototype logic (V1 screens + tab Rute gabungan)
   Semua data di file ini BERSIFAT SIMULASI untuk kebutuhan demo kompetisi.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
 * Data simulasi
 * ------------------------------------------------------------------------ */

const BUSES = [
  { id: "TS-101", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 3, max: 5 }, crowd: "low", note: "Pilihan nyaman", position: "Mendekati Pahlawan" },
  { id: "TS-104", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 1, max: 3 }, crowd: "high", note: "Tiba lebih cepat", position: "Sekitar Kota Lama" },
  { id: "TS-109", corridor: "Koridor 1", corridorKey: "corridor-1", destination: "Kota Lama", eta: { min: 8, max: 11 }, crowd: "med", note: "Alternatif", position: "Mendekati Simpang Lima" },
  { id: "TS-204", corridor: "Koridor 2", corridorKey: "corridor-2", destination: "Tembalang", eta: { min: 5, max: 8 }, crowd: "med", note: "Arah Tembalang", position: "Mendekati Simpang Lima" },
];

const STOPS = [
  { id: "stop-simpanglima", name: "Halte Simpang Lima", distance: 120, corridor: "Koridor 1", accessible: true },
  { id: "stop-pahlawan", name: "Halte Pahlawan", distance: 480, corridor: "Koridor 1", accessible: true },
  { id: "stop-kotalama", name: "Halte Kota Lama", distance: 2100, corridor: "Koridor 1", accessible: true },
  { id: "stop-tembalang", name: "Halte Tembalang", distance: 5400, corridor: "Koridor 2", accessible: false },
];

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
  live: { chipClass: "", chipText: "Live · diperbarui 20 detik lalu", note: "Live · data diperbarui 20 detik lalu (simulasi).", offline: false, etaMode: "range", mapCaption: "3 bus aktif di sekitar Anda (simulasi)", busesVisible: true },
  recent: { chipClass: "freshness--stale", chipText: "Diperbarui 3 menit lalu", note: "Recent · data diperbarui 3 menit lalu; akurasi bisa menurun.", offline: false, etaMode: "rangeWide", mapCaption: "Data posisi mungkin tertinggal beberapa menit", busesVisible: true },
  schedule: { chipClass: "freshness--schedule", chipText: "Estimasi jadwal · data live tidak tersedia", note: "Schedule · ETA diturunkan dari jadwal, bukan posisi bus langsung.", offline: false, etaMode: "schedule", mapCaption: "Menampilkan estimasi berdasarkan jadwal", busesVisible: true },
  unavailable: { chipClass: "freshness--off", chipText: "Data live sementara tidak tersedia", note: "Unavailable · posisi bus tidak diketahui; tampilkan jadwal berikutnya.", offline: false, etaMode: "unavailable", mapCaption: "Posisi bus belum tersedia", busesVisible: false },
  weak: { chipClass: "freshness--off", chipText: "Koneksi lemah · data 2 menit lalu", note: "Koneksi lemah · menampilkan data tersimpan; live tracking dijeda.", offline: true, etaMode: "stale", mapCaption: "Live tracking dijeda — menampilkan data tersimpan", busesVisible: true },
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
  return `<span class="crowd-badge crowd-badge--${crowd}"><span class="crowd-badge__bars" aria-hidden="true"><i></i><i></i><i></i></span>${CROWD_LABEL[crowd]}</span>`;
}

/* --------------------------------------------------------------------------
 * Render — Beranda (daftar bus)
 * ------------------------------------------------------------------------ */

function renderBuses(state) {
  const list = document.getElementById("bus-list");
  if (!list) return;
  const mode = DATA_STATES[state].etaMode;
  list.innerHTML = "";
  BUSES.slice(0, 3).forEach((bus) => {
    const li = document.createElement("li");
    const sub = etaSubtext(mode);
    li.innerHTML = `
      <button class="bus-card" type="button" data-go="bus"
        aria-label="Bus ${bus.id}, ${bus.corridor} arah ${bus.destination}, tiba ${etaText(bus, mode)}, kepadatan ${CROWD_LABEL[bus.crowd]}">
        <span class="bus-card__badge" aria-hidden="true"><svg class="icon"><use href="#i-bus" /></svg></span>
        <span>
          <span class="bus-card__id">${bus.id} · ${bus.corridor}</span>
          <span class="bus-card__meta">Arah ${bus.destination} · ${bus.note}</span>
        </span>
        <span class="bus-card__right">
          <span class="eta-chip"><svg class="icon" aria-hidden="true"><use href="#i-clock" /></svg>${etaText(bus, mode)}</span>
          ${crowdBadgeHTML(bus.crowd)}
          ${sub ? `<span class="bus-card__meta">${sub}</span>` : ""}
        </span>
      </button>`;
    list.appendChild(li);
  });

  const existingHint = document.querySelector(".bus-hint");
  if (existingHint) existingHint.remove();
  if (mode === "range") {
    const hint = document.createElement("p");
    hint.className = "bus-hint";
    hint.innerHTML = "<strong>Rekomendasi:</strong> TS-101 tiba 3–5 menit dengan kabin sepi — menunggu 2 menit lebih lama untuk perjalanan yang lebih nyaman.";
    list.after(hint);
  }
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
      <p class="bus-hint"><strong>Rekomendasi:</strong> Route B 39 menit tanpa transfer dan kabin sepi — paling nyaman bila tidak terburu-buru.</p>
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
  const chipText = document.getElementById("freshness-text");
  const banner = document.getElementById("offline-banner");
  const mapCaption = document.getElementById("map-caption");
  const note = document.getElementById("demo-state-desc");

  if (chip) chip.className = `freshness ${cfg.chipClass}`.trim();
  if (chipText) chipText.textContent = cfg.chipText;
  if (banner) banner.hidden = !cfg.offline;
  if (mapCaption) mapCaption.textContent = cfg.mapCaption;
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
});