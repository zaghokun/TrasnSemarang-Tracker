# Trans Semarang Live — High-Fidelity HTML Prototype (V3: Satu Halaman / KISS)

Prototype konsep untuk **SwitchFest 2026 UI/UX Design Competition**.

> **Perubahan arsitektur (V3 — KISS, mengikuti pola Google Maps):** bottom
> navigation **dihapus**. Aplikasi kini **satu halaman: Beranda**, dengan **satu
> peta nyata** (Leaflet/OpenStreetMap) sebagai pusatnya. Semua alur lain menjadi
> **mode/overlay di atas peta yang sama** dan dibuka dari Beranda:
>
> - **Cari Rute** → bottom sheet di atas peta Beranda (tujuan, filter koridor,
>   opsi rute A/B/C, mulai trip). Tidak ada peta kedua / peta SVG tiruan.
> - **Trip** → layar status perjalanan aktif (dibuka setelah memilih rute).
> - **Jelajah (Kota Lama)** dan **Profil/Aksesibilitas** → overlay, dibuka dari
>   ikon di kanan atas peta.
>
> Rasional: satu peta yang dikerjakan dengan sangat baik lebih kuat untuk
> presentasi juri daripada dua peta (satu nyata, satu tiruan) yang membingungkan.

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
  dapat **digeser (drag) atau di-tap** untuk 3 tinggi: **peta penuh** (sheet
  dikecilkan hingga menyisakan grip + chip aksi), **ringkas** (default), dan
  **daftar diperluas** — geser ke bawah saat berada di puncak isi untuk membuka
  peta penuh. Chip **"Bus terdekat"** memusatkan kamera ke bus terdekat dan chip
  **"Halte terdekat"** memusatkan ke halte terdekat — keduanya menyorot marker
  terpilih (berdenyut) sekaligus menampilkan toast ETA/jarak & kepadatan. Tombol
  recenter mengembalikan peta ke koridor utama.
- **Layar perjalanan utama:** onboarding, detail halte, detail bus, trip aktif,
  info layanan, Kota Lama mode, profil/pengaturan, dan aksesibilitas — dibuka
  sebagai overlay/layar dari Beranda (tanpa bottom nav).
- **Mode Cari Rute (bottom sheet di atas peta Beranda):** input tujuan, filter
  koridor (menyaring marker bus di peta nyata), opsi rute A/B/C, detail rute +
  pilih halte naik/turun, "Pilih rute ini" → satu `activeTrip` yang langsung
  membuka layar Trip.
- **Alur klik:** Beranda → Stop Detail/Bus Detail/Alert; "Mau ke mana? Cari rute…"
  → sheet Cari Rute → hasil → Trip aktif; ikon kanan atas → Jelajah / Profil;
  tombol Trip muncul saat ada perjalanan aktif.
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
