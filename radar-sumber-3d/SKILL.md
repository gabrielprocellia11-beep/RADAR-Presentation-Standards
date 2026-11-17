---
name: radar-sumber-3d
description: Cara mengambil bahan gambar presentasi dari model SketchUp RAD+ar tanpa export ke DWG dan tanpa memakai screenshot user - ekspor view ortografis lewat Ruby Console, daftar material + warna, posisi lanskap untuk entourage, ukuran px/m. Pakai sebelum membuat diagram, entourage, atau mewarnai denah dari model 3D.
---

# Bahan dari model 3D (SketchUp)

Baca dulu `radar-aturan-presentasi`.

## 1. Yang boleh & tidak
- ✔ Ekspor **gambar view** dari model dengan kamera yang kita atur sendiri (`view.write_image`) — untuk diagram, entourage, acuan warna.
- ✔ Membaca data model lewat Ruby: material & warna, bounding box, face rumput/paving, ukuran.
- ✘ Memakai **screenshot layar user** sebagai bahan.
- ✘ Export model/section ke DWG untuk dijadikan linework CAD (linework digambar sendiri).
- ✘ Mengubah atau menyimpan model user. Selalu kembalikan kamera ke posisi semula.

## 2. Membuka Ruby Console
SketchUp 2025: **Extensions → Developer → Ruby Console**. Ketik satu baris lalu Enter:
```ruby
load 'D:/…/alat/sketchup_views.rb'
```
Simpan skrip di folder proyek (bukan di folder SketchUp).

## 3. `alat/sketchup_views.rb` (isi CONFIG di atas file)
- Ekspor view **ortografis**: iso SE / SW / NE / NW, tampak S / E / N / W, atas — fokus pada titik yang sedang dilihat user (raytest dari kamera), lebar view dalam meter ditentukan (`VIEW_M`), resolusi 3000×1875.
- Tulis `materials.txt`: nama | R | G | B | tekstur — **tanpa** menghitung luas di seluruh definisi (pada model besar >100 MB perhitungan itu membuat SketchUp macet puluhan menit).
- Tulis `scale.txt`: px per meter untuk view ortografis (dari `camera.height`).
- Kamera dikembalikan setelah selesai.

## 4. Analisis yang diambil dari view
Dari ekspor: jumlah & posisi massa, ketinggian lantai, pola fasad (panel, sambungan, jendela), bukaan besar/kecil, material (warna gelap/terang, tekstur), lanskap (planter, atap hijau, median), akses (ramp, tangga, pintu). Catat ke teks WHY diagram (`radar-diagram-konsep`).

## 5. Entourage dari model
`alat/entourage.rb`: ekspor view axo + mencari face horizontal ber-material rumput (nama mengandung grass/rumput/lawn/green/plant atau warna dominan hijau) dan paving di dekat tanah, lalu menulis `E_entourage.json` berisi titik pohon, semak, orang beserta tinggi px yang **tepat** (`view.screen_coords` kaki & kepala). Dibaca oleh `alat/entourage.jsx` mode `axo`.
Batasi kedalaman pencarian (≤5 level) dan ukuran face (≥2 m²) supaya cepat pada model besar.

## 6. Pelajaran
- Model 178 MB butuh 1–2 menit untuk dibuka; jangan buka dua kali.
- Script berat di Ruby Console membekukan SketchUp; ekspor gambar dulu, hitungan berat terakhir atau tidak sama sekali.
- `write_image` memakai style tampilan aktif (tekstur, garis) — atur style dulu bila perlu (mis. Hidden Line untuk diagram garis).
