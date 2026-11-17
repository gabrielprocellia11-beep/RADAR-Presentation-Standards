---
name: radar-diagram-konsep
description: Cara RAD+ar menganalisis desain dari model 3D dan membuat diagram konsep yang benar (massa, fasad, bukaan, layout/core, level & akses, lanskap) lengkap dengan penjelasan, gaya diagram, dan saran edit. Pakai saat diminta "diagram konsep", "concept diagram", "massing diagram", "facade diagram", "jelaskan desainnya".
---

# Diagram konsep RAD+ar

Baca dulu `radar-aturan-presentasi`. Bahan dasar dari `radar-sumber-3d` (ekspor sendiri, bukan screenshot user).
Hasil: **PSD berlayer** per papan (16:9, 1920×1080 atau A3 landscape) + JPG preview.

## 1. Analisis dulu (15–20 % waktu)
Ambil 4–7 ekspor ortografis dari model (iso SE/SW/NE/NW, tampak utama, denah atas) lalu jawab:
| Topik | Pertanyaan |
|---|---|
| Tapak | Jalan mana yang utama (datum FFL ±0.000)? Dari mana orang datang? Bagian mana dibiarkan terbuka? |
| Massa | Berapa massa? Kenapa di posisi itu (sudut, tepi, mundur)? Tinggi vs rendah? Apa hubungan antar massa (halaman, bingkai, latar)? |
| Layout | Di mana core (tangga, lift, toilet)? Grid kolom/bentang? Lantai bebas kolom? Rute evakuasi? |
| Level | FFL tiap lantai, double-height, mezanin, ramp 1:12, plinth, atap hijau. |
| Fasad | Material apa, pola apa (grid, digeser, sirip, kisi)? Di mana bukaan besar & kecil, kenapa (matahari, view, privasi)? Ada satu "gerakan" khas (potongan, puntiran, lubang)? |
| Lanskap | Di mana hijau (planter, atap hijau, cincin tanaman, median jalan)? Bagaimana dasar bangunan dibuat lunak? |
Tulis jawabannya sebagai kalimat sebab-akibat ("Karena X, maka Y"). Itu menjadi teks **WHY** di papan.
Bila fakta belum pasti (mis. material fasad belum terbaca), tulis sebagai asumsi dan beri tanda.

## 2. Pilih gaya diagram yang paling menjelaskan
| Gaya | Kapan |
|---|---|
| **Urutan pembentukan 01–05** (satu operasi per bingkai, sudut pandang sama) | Bagaimana bentuk/massa/fasad lahir |
| **Axo eksplosif dengan overlay warna** di atas konteks garis putih | Logika tapak, datum, grid, void |
| **Sketsa spidol** (garis hitam, massa abu, pohon hijau, 1 aksen) | Konsep awal, parameter |
| **Small multiples 2×3 / 3×2** axo massa + panah | Langkah massing di tapak |
| **Potongan zoning / lantai berwarna** + marka level | Program vertikal, level, ramp |
| **Axo program eksplosif** (lantai ditarik, tiap lantai diwarnai) | Mixed use |
| **Render beranotasi** (abu-abu + kotak label + leader putus-putus, nomor) | Menunjuk elemen fasad pada gambar nyata |
| **Diagram ikon/siluet** (bentuk hitam solid) | Satu ide sederhana |
| **Denah berwarna per zona** + strip foto referensi | Tenant mix, program per lantai |
| **Elevasi abstrak ritme** (bukaan sebagai blok hitam) | Pola jendela / panel fasad |
| **Diagram "berat di atas, ringan di bawah"** (tampak sederhana) | Massa melayang di atas dasar transparan/hijau |

Minimal tiga papan untuk satu bangunan: **MASSA**, **FASAD/BUKAAN**, **LAYOUT atau LEVEL**. Tambah **ANATOMI FASAD** (render beranotasi bernomor) bila fasadnya khas.

## 3. Susunan satu papan
```
[+]                                                        [+]   www…
  J U D U L   D I A G R A M                                       |
  satu baris italic: apa gerakan ini                             RADAR
                                                                  |
  01 LANGKAH   02 LANGKAH   03 …          WHY IT IS DESIGNED      @radarchitects
  [gambar]     [gambar]     [gambar]      THIS WAY
  1–2 baris    1–2 baris                  • 4–6 butir sebab-akibat
  keterangan   keterangan                 • angka nyata (m, FFL, m²)
  [bukti dari model: ekspor 3D]  [abstraksi pola]
  PROYEK – LOKASI | CONCEPT DIAGRAM 01/04                         [+]
```
- Satu aksen per set diagram; konteks abu-abu; manusia merah untuk skala.
- Angka nyata selalu (bentang 9 m, FFL +6.700, ±900 m²/lantai) — diambil dari DWG/model, bukan ditebak.
- Bilingual bila perlu: EN + 中文 (klien China), EN + Bahasa (developer Indonesia).

## 4. Layer PSD standar papan diagram
```
ANNOTATION      (judul, subjudul, teks WHY, nomor, leader, footer)
RADAR MARGIN    (sudut +, teks vertikal)
ACCENT          (overlay warna gerakan desain — 1 layer per langkah)
ENTOURAGE       (orang merah, pohon, semak — lihat radar-entourage)
LINEWORK        (garis dari ekspor 3D / CAD, Multiply)
3D BASE         (ekspor SketchUp per langkah, Smart Object)
PAPER           (putih)
```
Otomatis: `alat/board.jsx` membuat papan 16:9 berlayer (margin RADAR, judul, teks WHY, gambar dasar, nomor & leader dari konfigurasi). Isi blok CONFIG di atas file, lalu Photoshop → File → Scripts → Browse.

## 5. Contoh analisis yang baik (gedung kantor tower + bar rendah)
- **Massa**: jalan utama di timur dibiarkan terbuka untuk kedatangan & parkir → semua tinggi dikumpulkan di satu tower kompak di sudut barat (landmark) → bar rendah menutup tepi utara, membingkai forecourt.
- **Layout**: dua core di ujung pendek → dua tangga darurat berjauhan, lantai tengah bebas & terang, sisi panjang bebas untuk kaca.
- **Fasad tower**: panel bertekstur per lantai, baris selang-seling digeser, jendela celah di sambungan → ritme papan catur; bukaan kecil & dalam untuk iklim tropis.
- **Fasad bar**: kotak hitam melayang di atas kaca lengkung; satu pita diagonal terpuntir membuka jendela berbentuk lensa ke lounge double-height; atap hijau = fasad kelima.

## 6. Setelah papan jadi — selalu beri saran edit
Contoh: tambahkan rencana lanskap forecourt; jadikan atap hijau dapat dipakai; buat diagram material yang membuktikan fungsi peneduh; gambar ulang gerakan khas dari geometri model yang tepat; tambahkan hero render untuk tiap diagram.
