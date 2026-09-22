# Trans Semarang Live — High-Fidelity HTML Prototype (V2: Tab Rute Gabungan)

Prototype konsep untuk **SwitchFest 2026 UI/UX Design Competition**.

> **Perubahan arsitektur:** tab **Rute** kini menggabungkan Live Map, Route Search,
> dan Route Results V1 menjadi satu halaman — peta simulasi penuh di atas +
> panel Ringkas/Daftar di bawah. Beranda dan fitur V1 lain (Trip, Jelajah, Profil,
> detail halte/bus, alert) tetap dipertahankan.

> “Tahu kapan bus tiba, tahu seberapa penuh, tanpa menebak.”

> **Penting:** Semua posisi bus, ETA, kepadatan, dan info layanan di prototype ini
> adalah **data simulasi/fiktif** — bukan data operasional resmi Trans Semarang.

## Menjalankan

Tidak butuh build tools atau backend. Salah satu cara:

```bash
# Opsi 1 — buka langsung
index.html   # klik dua kali di file explorer

# Opsi 2 — server lokal (disarankan)
npx serve .
# atau
python -m http.server 8000
```

Lalu buka alamat yang ditampilkan (mis. `http://localhost:8000`).

## Yang sudah ada (Tahap 1–2 + Home + tahap 3 dan seterusnya)

- **Fondasi:** `index.html`, `styles.css`, `script.js` (HTML semantik, CSS variables, vanilla JS).
- **Design tokens:** warna brand cobalt/navy dari referensi, pastel (mint/amber/coral/sky)
  khusus latar badge & kartu, radius, shadow ambient, spacing 4px, type scale, durasi animasi.
- **Komponen reusable:** hero header dengan dekorasi organik, freshness chip, search bar,
  service-alert banner (berbeda dari crowding), stop card, bus card, ETA chip, crowding badge
  (ikon bar + label + warna — tidak pernah warna saja), map card simulasi + legenda,
  bottom navigation, tombol primary/ghost, offline banner.
- **Layar Home (peta nyata + bottom sheet, inspirasi HomeReference):** **peta
  OpenStreetMap asli** (Leaflet, gratis tanpa API key) memenuhi seluruh layar dan
  dapat digeser/zoom, dengan marker halte & bus **simulasi** di atasnya. Bottom sheet
  dengan header "bubble" merah transparan (blur) + tombol pusatkan lokasi, lalu panel
  putih berisi judul merah "Bus berikutnya" dan daftar bus bergaya timeline serta
  pencarian rute. Tombol recenter mengembalikan peta ke koridor utama.
- **Layar perjalanan utama:** onboarding, detail halte, detail bus, pencarian rute,
  hasil rute, trip aktif, info layanan, Kota Lama mode, profil/pengaturan, dan aksesibilitas.
- **Tab Rute gabungan:** peta simulasi SVG penuh (koridor dengan pola garis berbeda,
  halte, lokasi pengguna, bus bergerak via `requestAnimationFrame`, filter koridor,
  freshness chip, recenter, legend) + panel Ringkas/Daftar dengan 3 tab internal
  (Rute / Halte / Bus), search tujuan → Route A/B/C, detail rute + pilih halte
  naik/turun, "Pilih rute/bus ini" → satu `activeTrip` di tab Trip, dan mode
  pelacakan trip di peta ("Jelajahi rute lain" tanpa mengakhiri trip).
  Tidak memakai API GPS/map nyata.
- **Alur klik:** Home → Stop Detail/Bus Detail/Alert; Cari rute → hasil → trip aktif;
  bottom navigation berpindah ke Beranda/Rute/Trip/Jelajah/Profil; destination Kota Lama
  membuka pencarian rute; trip aktif memiliki progres halte interaktif.
- **Demo controls** (di luar frame ponsel): `Live`, `Recent`, `Schedule`,
  `Data tidak tersedia`, `Koneksi lemah` — mengubah chip kesegaran, format ETA,
  banner offline, dan caption peta.
- **Layout:** frame ponsel 390 × 844 di tengah layar desktop; di lebar ≤430 px
  menjadi full-screen mobile (panel demo disembunyikan).
- **Font:** Nunito (Google Fonts) dengan fallback sistem jika gagal dimuat.

## Aturan kontras yang diterapkan

- Teks di atas latar pastel (mint/amber/coral/sky/alert) **selalu** navy gelap (`#101C3d`).
- Coral hanya untuk status **Padat**; service alert memakai latar + ikon berbeda.
- Status kepadatan dikomunikasikan via ikon bar + teks + warna.

## Struktur

```text
trans-semarang-live/
├── index.html      # markup semantik + sprite ikon SVG inline
├── styles.css      # design tokens + komponen + responsif
├── script.js       # data simulasi + demo controls + interaksi Home
└── README.md
```

## Catatan tahap berikutnya

Prototype ini sudah mencakup seluruh layar primer dan alur demo yang direncanakan.
Tahap lanjutan dapat difokuskan pada pengujian usability, iterasi berdasarkan temuan
pengguna, penyempurnaan visual per layar, dan pemindahan komponen/varian ke Figma.
