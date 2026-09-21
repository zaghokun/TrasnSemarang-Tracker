/* ==========================================================================
   Trans Semarang Live — prototype logic (Home + primary journey screens)
   Semua data di file ini BERSIFAT SIMULASI untuk kebutuhan demo kompetisi.
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
 * Data simulasi
 * ------------------------------------------------------------------------ */

const BUSES = [
  {
    id: "TS-101",
    corridor: "Koridor 1",
    destination: "Kota Lama",
    eta: { min: 3, max: 5 },
    crowd: "low",
    note: "Pilihan nyaman",
  },
  {
    id: "TS-104",
    corridor: "Koridor 1",
    destination: "Kota Lama",
    eta: { min: 1, max: 3 },
    crowd: "high",
    note: "Tiba lebih cepat",
  },
  {
    id: "TS-109",
    corridor: "Koridor 1",
    destination: "Kota Lama",
    eta: { min: 8, max: 11 },
    crowd: "med",
    note: "Alternatif",
  },
];

const CROWD_LABEL = {
  low: "Sepi",
  med: "Sedang",
  high: "Padat",
};

const DATA_STATES = {
  live: {
    chipClass: "",
    chipText: "Live · diperbarui 20 detik lalu",
    note: "Live · data diperbarui 20 detik lalu (simulasi).",
    offline: false,
    etaMode: "range",
    mapCaption: "3 bus aktif di sekitar Anda (simulasi)",
  },
  recent: {
    chipClass: "freshness--stale",
    chipText: "Diperbarui 3 menit lalu",
    note: "Recent · data diperbarui 3 menit lalu; akurasi bisa menurun.",
    offline: false,
    etaMode: "rangeWide",
    mapCaption: "Data posisi mungkin tertinggal beberapa menit",
  },
  schedule: {
    chipClass: "freshness--schedule",
    chipText: "Estimasi jadwal · data live tidak tersedia",
    note: "Schedule · ETA diturunkan dari jadwal, bukan posisi bus langsung.",
    offline: false,
    etaMode: "schedule",
    mapCaption: "Menampilkan estimasi berdasarkan jadwal",
  },
  unavailable: {
    chipClass: "freshness--off",
    chipText: "Data live sementara tidak tersedia",
    note: "Unavailable · posisi bus tidak diketahui; tampilkan jadwal berikutnya.",
    offline: false,
    etaMode: "unavailable",
    mapCaption: "Posisi bus belum tersedia",
  },
  weak: {
    chipClass: "freshness--off",
    chipText: "Koneksi lemah · data 2 menit lalu",
    note: "Koneksi lemah · menampilkan data tersimpan; live tracking dijeda.",
    offline: true,
    etaMode: "stale",
    mapCaption: "Live tracking dijeda — menampilkan data tersimpan",
  },
};

/* --------------------------------------------------------------------------
 * Helper render
 * ------------------------------------------------------------------------ */

function etaText(bus, mode) {
  switch (mode) {
    case "range":
      return `${bus.eta.min}–${bus.eta.max} mnt`;
    case "rangeWide":
      return `sekitar ${bus.eta.min + 1}–${bus.eta.max + 2} mnt`;
    case "schedule":
      return `Jadwal ${bus.schedule || "08.20"}`;
    case "unavailable":
      return "Jadwal 08.20";
    case "stale":
      return `${bus.eta.min}–${bus.eta.max} mnt*`;
    default:
      return `${bus.eta.min}–${bus.eta.max} mnt`;
  }
}

function etaSubtext(mode) {
  switch (mode) {
    case "schedule":
      return "berdasarkan jadwal";
    case "unavailable":
      return "posisi belum tersedia";
    case "stale":
      return "*data 2 mnt lalu";
    default:
      return null;
  }
}

function renderBuses(state) {
  const list = document.getElementById("bus-list");
  const mode = DATA_STATES[state].etaMode;
  list.innerHTML = "";

  BUSES.forEach((bus) => {
    const li = document.createElement("li");

    const sub = etaSubtext(mode);
    li.innerHTML = `
      <button class="bus-card" type="button" data-go="bus"
        aria-label="Bus ${bus.id}, ${bus.corridor} arah ${bus.destination}, tiba ${etaText(bus, mode)}, kepadatan ${CROWD_LABEL[bus.crowd]}">
        <span class="bus-card__badge" aria-hidden="true">
          <svg class="icon"><use href="#i-bus" /></svg>
        </span>
        <span>
          <span class="bus-card__id">${bus.id} · ${bus.corridor}</span>
          <span class="bus-card__meta">Arah ${bus.destination} · ${bus.note}</span>
        </span>
        <span class="bus-card__right">
          <span class="eta-chip">
            <svg class="icon" aria-hidden="true"><use href="#i-clock" /></svg>
            ${etaText(bus, mode)}
          </span>
          <span class="crowd-badge crowd-badge--${bus.crowd}">
            <span class="crowd-badge__bars" aria-hidden="true"><i></i><i></i><i></i></span>
            ${CROWD_LABEL[bus.crowd]}
          </span>
          ${sub ? `<span class="bus-card__meta">${sub}</span>` : ""}
        </span>
      </button>
    `;
    list.appendChild(li);
  });

  // Hint keputusan: hanya pada mode yang punya ETA bermakna
  const existingHint = document.querySelector(".bus-hint");
  if (existingHint) existingHint.remove();

  if (mode === "range") {
    const hint = document.createElement("p");
    hint.className = "bus-hint";
    hint.innerHTML =
      "<strong>Rekomendasi:</strong> TS-101 tiba 3–5 menit dengan kabin sepi — " +
      "menunggu 2 menit lebih lama untuk perjalanan yang lebih nyaman.";
    list.after(hint);
  }
}

/* --------------------------------------------------------------------------
 * Demo controls
 * ------------------------------------------------------------------------ */

function applyState(state) {
  const cfg = DATA_STATES[state];
  if (!cfg) return;

  const chip = document.getElementById("freshness-chip");
  const chipText = document.getElementById("freshness-text");
  const banner = document.getElementById("offline-banner");
  const mapCaption = document.getElementById("map-caption");
  const note = document.getElementById("demo-state-desc");

  chip.className = `freshness ${cfg.chipClass}`.trim();
  chipText.textContent = cfg.chipText;
  banner.hidden = !cfg.offline;
  mapCaption.textContent = cfg.mapCaption;
  if (note) note.textContent = cfg.note;

  renderBuses(state);

  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.state === state);
  });
}

function initDemoControls() {
  document.querySelectorAll(".demo-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyState(btn.dataset.state));
  });
}

/* --------------------------------------------------------------------------
 * Interaksi kecil Home
 * ------------------------------------------------------------------------ */

function initFavorite() {
  const fav = document.getElementById("favorite-stop");
  fav.addEventListener("click", () => {
    const pressed = fav.getAttribute("aria-pressed") === "true";
    fav.setAttribute("aria-pressed", String(!pressed));
    fav.textContent = pressed ? "Simpan halte" : "Halte tersimpan";
  });
}

function renderStopBuses() {
  const list = document.getElementById("stop-buses");
  if (!list) return;
  list.innerHTML = BUSES.map((bus) => `
    <li><button class="detail-bus-row" type="button" data-go="bus" aria-label="Lihat detail ${bus.id}">
      <div><strong>${bus.id} · ${bus.corridor}</strong><small>Arah ${bus.destination}</small></div>
      <span class="eta-chip">${bus.eta.min}–${bus.eta.max} mnt</span>
      <span class="crowd-badge crowd-badge--${bus.crowd}"><span class="crowd-badge__bars"><i></i><i></i><i></i></span>${CROWD_LABEL[bus.crowd]}</span>
    </button></li>`).join("");
}

function renderMapBuses() {
  const list = document.getElementById("map-bus-list");
  if (!list) return;
  const mapBuses = [
    { ...BUSES[0], route: "Koridor 1", position: "Mendekati Pahlawan" },
    { ...BUSES[1], route: "Koridor 1", position: "Sekitar Kota Lama" },
    { id: "TS-204", corridor: "Koridor 2", destination: "Tembalang", eta: { min: 5, max: 8 }, crowd: "med", position: "Mendekati Simpang Lima" },
  ];
  list.innerHTML = mapBuses.map((bus) => `
    <button class="map-bus-row" type="button" data-map-bus="${bus.id}">
      <span class="bus-card__badge"><svg class="icon"><use href="#i-bus" /></svg></span>
      <span class="map-bus-row__info"><strong>${bus.id} · ${bus.corridor}</strong><small>${bus.position} · arah ${bus.destination}</small></span>
      <span class="crowd-badge crowd-badge--${bus.crowd}"><span class="crowd-badge__bars"><i></i><i></i><i></i></span>${CROWD_LABEL[bus.crowd]}</span>
    </button>`).join("");
}

function initMapInteractions() {
  const mapToast = document.getElementById("map-toast");
  if (!mapToast) return;
  const selectBus = (id) => {
    document.querySelectorAll(".live-bus").forEach((bus) => bus.classList.toggle("is-selected", bus.dataset.bus === id));
    const bus = BUSES.find((item) => item.id === id) || { id, corridor: "Koridor 2", destination: "Tembalang", crowd: "med" };
    mapToast.textContent = `${bus.id} · ${bus.corridor} · arah ${bus.destination} · ${CROWD_LABEL[bus.crowd]}`;
  };
  document.querySelectorAll(".live-bus, .map-bus-row").forEach((button) => {
    button.addEventListener("click", () => selectBus(button.dataset.bus || button.dataset.mapBus));
  });
  document.querySelectorAll(".map-filter").forEach((filter) => {
    filter.addEventListener("click", () => {
      const route = filter.dataset.mapRoute;
      document.querySelectorAll(".map-filter").forEach((item) => item.classList.toggle("is-active", item === filter));
      document.querySelectorAll(".live-bus").forEach((bus) => {
        bus.hidden = route !== "all" && bus.dataset.route !== route;
      });
    });
  });
  const center = document.getElementById("center-map");
  if (center) center.addEventListener("click", () => { mapToast.textContent = "Peta dipusatkan ke lokasi Anda"; });
}

function showScreen(screenName) {
  const target = screenName || "home";
  document.querySelectorAll(".screen-view").forEach((screen) => {
    screen.hidden = screen.dataset.screen !== target;
  });

  const navMap = { home: "home", "route-search": "route-search", "route-results": "route-search", trip: "trip", explore: "explore", profile: "profile", map: "home" };
  const active = navMap[target] || "home";
  document.querySelectorAll(".nav-item").forEach((item) => {
    const isActive = item.dataset.go === active;
    item.classList.toggle("is-active", isActive);
    if (isActive) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });
  const content = document.querySelector(`[data-screen="${target}"]`);
  if (content) content.scrollTop = 0;
}

function initNavigation() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-go]");
    if (!trigger) return;
    const destination = trigger.dataset.go;
    if (!destination) return;
    event.preventDefault();
    showScreen(destination);
  });
}

function initRouteSearch() {
  const form = document.getElementById("route-form");
  if (form) form.addEventListener("submit", (event) => {
    event.preventDefault();
    showScreen("route-results");
  });
}

function initToggles() {
  document.querySelectorAll(".toggle").forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const active = toggle.getAttribute("aria-pressed") === "true" || toggle.classList.contains("is-on");
      toggle.classList.toggle("is-on", !active);
      toggle.setAttribute("aria-pressed", String(!active));
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

/* --------------------------------------------------------------------------
 * Init
 * ------------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  initDemoControls();
  initFavorite();
  renderStopBuses();
  renderMapBuses();
  initNavigation();
  initRouteSearch();
  initToggles();
  initTripProgress();
  initMapInteractions();
  applyState("live");
  showScreen("home");
});
