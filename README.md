# Trans Semarang Live — High-Fidelity HTML Prototype

Prototype konsep untuk **SwitchFest 2026 UI/UX Design Competition**.

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
- **Layar Home:** lokasi/halte terdekat, 3 bus untuk perbandingan ETA vs kepadatan,
  rekomendasi keputusan, entry live map, info layanan, disclaimer data simulasi.
- **Layar perjalanan utama:** onboarding, detail halte, detail bus, pencarian rute,
  hasil rute, trip aktif, info layanan, Kota Lama mode, profil/pengaturan, dan aksesibilitas.
- **Live map interaktif:** peta simulasi dengan rute Koridor 1/Koridor 2, marker halte,
  lokasi pengguna, posisi beberapa bus, filter koridor, pilihan bus, dan detail posisi
  bus yang dipilih. Ini merupakan live tracker konseptual; tidak memakai API GPS/map nyata.
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
