---
name: radar-entourage
description: Menambahkan lanskap dan orang pada gambar presentasi RAD+ar (denah, tampak, potongan, axonometri) sebagai layer Photoshop terpisah dengan skala yang benar - pohon, semak, rumput, planter, orang berjalan, bayangan. Pakai setiap kali membuat diagram/tampak/denah presentasi atau diminta "tambah pohon", "tambah orang", "landscape", "entourage".
---

# Entourage berskala (lanskap + orang)

Baca dulu `radar-aturan-presentasi`. Semua entourage = **layer/grup terpisah** di PSD, diberi nama dengan ukurannya.

## 1. Hitung skala dulu (px per meter)
- Gambar ortografis (tampak, potongan, denah, axo paralel): skala sama di seluruh gambar.
  `ppm = lebar_px_elemen_diketahui / lebar_m_elemen` (mis. tower 26.2 m = 466 px → 17.8 px/m).
  Atau dari SketchUp: `view.screen_coords` titik dasar dan titik +10 m (lihat `alat/entourage.rb`) → px per meter tepat di tiap lokasi.
- Denah dari PDF A3: `ppm = (lebar_px_kertas / 420) × 1000 / skala` (200 dpi, 1:400 → 3308/420×1000/400 ≈ 19.7 px/m).
- Perspektif: **jangan** satu angka; skala orang mengikuti jarak (pakai screen_coords titik kaki & kepala).
Tulis skala di subjudul papan ("1.7 m figure = 30 px") dan beri **skala batang 0–5–10–20 m**.

## 2. Ukuran standar
| Elemen | Tinggi | Lebar / diameter | Catatan |
|---|---|---|---|
| Orang dewasa | 1.60–1.85 m | bahu ±0.45 m | variasi tinggi; jalan & berdiri |
| Anak | 1.10–1.30 m | | 1 di antara ±10 orang |
| Semak | 0.6–1.2 m | 0.8–1.6 m | barisan rapat di tepi planter |
| Rumput | 0.05–0.3 m | — | strip/bidang |
| Planter / bak tanaman | 0.45–0.6 m | sesuai DWG | |
| Pohon kecil (tabebuya, ketapang kencana) | 4–6 m | tajuk 3–4 m | |
| Pohon sedang/peneduh (trembesi muda, mahoni) | 6–9 m | tajuk 4–6.5 m | |
| Palem | 6–10 m | tajuk 3–4 m | |
| Mobil | 1.5 m | 1.8 × 4.5 m | parkir 2.5 × 5 m |
| Lantai tipikal kantor | 4.0–4.5 m | | cek proporsi: orang ≈ 0.38 tinggi lantai |

## 3. Penempatan
- **Rumput/semak/pohon hanya di tempat lanskap nyata**: planter, taman, atap hijau, median, tepi jalan (dari hatch GRASS di DWG atau face material rumput di model). Jangan di lantai ruangan.
- Pohon: jarak 6–8 m, sejajar tepi jalan/forecourt; jangan menutup pintu masuk & gerakan utama desain; tajuk semi-transparan (70–75 %) di tampak supaya fasad tetap terbaca.
- Orang: di perkerasan, forecourt, pintu masuk, teras, ramp — berkelompok 1–3, sebagian berjalan menuju pintu masuk. ±1 orang per 40–60 m² area publik.
- Gaya diagram RAD+ar: **figur merah terakota** (`#C8553D`) sebagai figur skala + beberapa abu-abu gelap; atau siluet foto untuk render.

## 4. Layer PSD
```
PEOPLE (1.2–1.85 m, <ppm> px/m)
   people RED (scale figures) · people #3A3A3A · people #6B6B6B · people shadows
TREES (6–9 m)
   tree canopies (72 %) · tree trunks · tree shadows (denah/axo: elips hitam 18 %, geser kanan-bawah)
LANDSCAPE
   SHRUBS (0.6–1.1 m) · PLANTERS (0.6 m) · GRASS (strip/bidang)
3D BASE – ekspor SketchUp
```
Otomatis:
- **Tampak/potongan ortografis**: `alat/entourage.jsx` mode `elevation` — isi garis tanah (px), ppm, rentang x; skrip menaruh rumput, planter, semak, pohon, orang sebagai layer.
- **Axo dari model**: jalankan `alat/entourage.rb` di Ruby Console SketchUp (ekspor view + posisi rumput/paving + ukuran orang/pohon dalam px), lalu `alat/entourage.jsx` mode `axo` membaca JSON-nya.

## 5. Cek
Bandingkan orang dengan tinggi lantai (≈ 0.38 × 4.5 m) dan pintu (2.1–2.4 m). Pohon tidak lebih tinggi dari yang realistis. Semua entourage di layer sendiri, bisa disembunyikan/digeser.
