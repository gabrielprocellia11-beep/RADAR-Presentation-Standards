---
name: radar-aturan-presentasi
description: Aturan utama RAD+ar untuk SEMUA gambar presentasi (denah berwarna, diagram konsep, entourage, deck proposal). Baca pertama kali sebelum membuat gambar presentasi apa pun, lalu buka skill yang lebih spesifik (radar-diagram-konsep, radar-warna-denah, radar-entourage, radar-sumber-3d, radar-presentasi-deck).
---

# Aturan presentasi RAD+ar (wajib)

Skill ini adalah "pintu masuk". Isinya aturan yang berlaku untuk semua gambar presentasi kantor.
Detail cara kerja ada di skill lain:

| Pekerjaan | Skill |
|---|---|
| Struktur deck / slide proposal, layout template RADAR | `radar-presentasi-deck` |
| Diagram konsep (massa, fasad, bukaan, layout, level, akses) | `radar-diagram-konsep` |
| Denah berwarna (plot PDF → Photoshop) | `radar-warna-denah` |
| Pohon, semak, rumput, planter, orang (skala benar) | `radar-entourage` |
| Mengambil gambar & data dari model 3D SketchUp | `radar-sumber-3d` |

## 1. Aturan emas
1. **Jangan pernah memakai screenshot user** sebagai bahan gambar. Gambar dasar harus diekspor sendiri dari model 3D (kamera yang diatur sendiri, ortografis bila perlu skala) atau di-plot dari DWG.
2. **Jangan export SketchUp ke DWG untuk dijadikan linework.** Linework CAD digambar sendiri (lihat standar CAD). Ekspor gambar 3D hanya untuk diagram/presentasi dan sebagai acuan ukur.
3. **Hasil akhir selalu berlayer & bisa diedit**: Photoshop **PSD** (atau Illustrator **AI/SVG**). Satu layer/grup per elemen, diberi nama jelas. Selalu sertakan **JPG preview** di sebelahnya. Jangan menyerahkan PNG datar sebagai hasil akhir.
4. **Lanskap & orang selalu ditambahkan** pada denah, tampak, potongan, dan axonometri: pohon, semak, rumput, planter, orang berjalan — **dengan skala yang benar** (lihat `radar-entourage`).
5. **Setiap ide desain harus dijelaskan dengan diagram sebelum render.** Diagram menjelaskan logika, render menjual suasana, mood image memberi rasa.
6. **Analisis dulu, gambar kemudian**: tulis *mengapa* desainnya begitu (tapak, jalan, matahari, program, struktur, fasad), baru buat diagram yang membuktikannya.
7. **Tanya bila data kurang** (lantai mana, skala, folder simpan, gaya). Kalau user sudah memberi batas waktu, kerjakan yang paling penting dulu dan laporkan jujur apa yang belum.
8. **Jangan pernah menimpa file user.** Nama file baru untuk setiap versi; jangan QSAVE DWG hanya karena plot.

## 2. Gaya visual kantor (ringkas)
- Latar **putih**, margin lega, tanda `+` di empat sudut, teks vertikal kanan: `www.radarchitecture.net` – **RADAR** – `@radarchitects`.
- Konteks = **abu-abu muda / garis putih**. Desain = **1–2 warna aksen** saja:
  **terakota/merah** (`#C8553D`) = gerakan desain & figur skala · **hijau** (`#8DB580`) = lanskap · **biru** (`#7FA7C9`) = air, kaca, void, langit · krem hangat (`#EFE3CF`) = lantai/zona.
- Judul diagram **HURUF BESAR berjarak** (`M A S S I N G   S T R A T E G Y`), di bawahnya satu baris *italic* penjelasan.
- Urutan bernomor `01 … 05`, **sudut pandang & skala sama** di setiap langkah.
- Linework tipis; poché hitam hanya untuk yang terpotong; hatch terrain abu-abu tipis.

## 3. Struktur folder hasil
```
<PROYEK>\PRESENTASI\
  01 DENAH WARNA\   <PROYEK> <LANTAI> - COLOUR.psd / .jpg  (+ PDF plot)
  02 DIAGRAM\       D01_<JUDUL>.psd / .jpg …
  03 ENTOURAGE\     E01_<VIEW>.psd / .jpg
  _sumber\          ekspor 3D (png), materials.txt, regions_*.txt, skrip
```

## 4. Checklist sebelum lapor (gaya juri Buildner)
Linework · kualitas gambar · keseimbangan warna · layout · hierarki · anotasi · teks · kejelasan cerita · kejelasan diagram.
Untuk setiap gerakan desain: (1) ada diagram yang menjelaskan, (2) ada gambar yang membuktikan skala & akses, (3) ada render/mood yang menjual suasana?
Laporkan: file yang dibuat (PSD + JPG), asumsi yang dipakai, dan yang belum selesai.
