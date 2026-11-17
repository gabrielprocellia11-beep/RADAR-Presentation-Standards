---
name: radar-warna-denah
description: Membuat denah berwarna gaya presentasi RAD+ar - plot DWG ke PDF A3 dengan setting kantor, lalu mewarnai di Photoshop berlayer (zona, lantai, rumput, paving, jalan, konteks, bayangan) memakai warna material model 3D. Pakai saat diminta "warnai denah", "colour plan", "coloured floor plan", "plot lalu warnai".
---

# Denah berwarna RAD+ar

Baca dulu `radar-aturan-presentasi`. Hasil per lantai: `<PROYEK> <LANTAI> - COLOUR.psd` + `.jpg` (+ PDF plot), di folder yang ditentukan user.
Tanya bila belum jelas: DWG mana, lantai/frame mana, folder simpan, model 3D untuk warna material.

## 1. Plot ke PDF (setting kantor tetap)
| Setting | Nilai |
|---|---|
| Printer | **AutoCAD PDF (High Quality Print).pc3** |
| Kertas | **ISO full bleed A3 (297.00 x 420.00 MM)**, Landscape |
| Plot style | **214 plotstyle.ctb** (warna = tebal pena; jangan ubah warna entitas) |
| Opsi | ✔ object lineweights · ✔ plot styles · ✘ background · ✘ transparency · ✘ stamp · ✘ save changes |
| Shade | Legacy wireframe |
| Area | **Window = pojok sheet A3** (persegi Defpoints rasio 420:297, yang terluar) |
| Offset | ✔ Center · Skala: ✔ Fit to paper (skala sudah ditentukan frame) |
Frame dipilih lewat **judul di title block** (`LEVEL 2 PLAN`, `GROUND FLOOR PLAN` …), satu PDF per lantai.
Otomatis: `alat/plot_frame.lsp` (isi `pl:out`, `pl:proj`, `pl:levels` lalu `(load …)`). Skrip juga menulis `regions_<TAG>.txt`: teks ruang, hatch (GRASS, ANSI31, paving…), polyline tertutup — semua dalam **mm kertas** (0–420 × 0–297, origin kiri-atas) untuk Photoshop. Tidak pernah menyimpan DWG.

## 2. Warna
Ambil dari model 3D (lihat `radar-sumber-3d`, daftar material + warna rata-rata). Jadikan **lembut**: naikkan terang 15–30 %, turunkan saturasi.
Palet dasar kantor (bila model belum terbaca — tulis sebagai *provisional*):
| Zona | Hex |
|---|---|
| Kertas | `FFFFFF` |
| Perkerasan tapak / site | `ECE7DD` |
| Jalan aspal | `D5D5D2` |
| Rumput, planter, median, atap hijau | `A8C88A` |
| Lantai lobby / ruang publik | `F3E7D2` |
| Lantai kantor / ruang kerja | `F4EEE2` |
| Lounge / F&B / kafe | `EFDFC6` |
| Rapat / ruang khusus | `E8E0F0` |
| Toilet / servis | `DDE6EA` |
| Core (tangga, lift) | `D9D6D0` |
| Paving aksen (terakota) | `DDBFA6` |
| Air / kolam | `BFD8E6` |
| Bangunan tetangga / konteks | `E3E3E1` |
| Bayangan | hitam 15–20 %, geser kanan-bawah, Gaussian blur |

## 3. Susunan layer PSD (atas → bawah)
```
LINEWORK (multiply)        ← PDF plot, blend Multiply, selalu paling atas
SHADOW                     ← di bawah lantai bangunan
ZONE <NAMA RUANG>          ← satu layer per ruang/zona (dari polyline AREA + teks ruang)
FLOOR <BANGUNAN> <FFL>     ← lantai bangunan
GRASS / PLANTER / WATER / PAVING / CONTEXT
ROAD / ROAD MEDIAN
SITE PAVING
PAPER (putih)
```
Nama layer memakai nama ruang & level (mis. `FLOOR BAR – EXECUTIVE LOUNGE +6.650`) supaya mudah diedit.
Lantai atas: cincin/planter yang hanya ada di lantai dasar diwarnai sebagai teras/paving, bukan rumput; lansekap lantai dasar ditampilkan sebagai konteks muda.

## 4. Otomatis di Photoshop
`alat/warna_denah.jsx` — isi blok CONFIG (PDF, regions, nama output, palet), lalu **File → Scripts → Browse…**:
1. buka PDF 200 dpi RGB, buat PAPER putih, linework Multiply;
2. isi poligon dari regions: hatch GRASS*/longgrass/borderplant → rumput; ANSI31 → konteks; AR-B816/paving*/random*/PEBBLES → paving; water* → air; ASIT → site; polyline layer **AREA** → zona ruang (warna dipilih dari teks ruang di dalamnya: LOBBY, OFFICE, LOUNGE, CAFE, MEETING, TOILET, STAIR/LIFT, PARKING…);
3. bayangan lembut dari zona bangunan; simpan PSD + JPG.
Area yang tidak punya poligon (mis. jalan) → tambahkan poligon manual di CONFIG (`extra`), atau gambar polyline tertutup di layer AREA/AELE di DWG.
**Agar warna zona otomatis bekerja, gambar polyline tertutup di layer `AREA` untuk setiap ruang** (sudah standar kantor: AREA = polyline luas).

## 5. Gaya presentasi
- Warna datar, lembut, tidak menutup teks/grid/dimensi/title block.
- Lantai bangunan utama sedikit lebih hangat/terang dari perkerasan supaya massa terbaca.
- Maksimal 1–2 aksen. Konteks abu-abu muda. Hijau untuk lanskap, biru untuk air/kaca.
- Tambahkan entourage denah (pohon dilihat dari atas + bayangan, semak, orang) sesuai `radar-entourage`.

## 6. Cek & lapor
Buka JPG: warna tidak bocor keluar bangunan, linework di atas, title block bersih, warna konsisten antar lantai (palet sama).
Laporkan: PDF/PSD/JPG per lantai, palet (dari model atau provisional), asumsi lantai yang dipilih, yang belum (mis. ruang tanpa polyline AREA).
