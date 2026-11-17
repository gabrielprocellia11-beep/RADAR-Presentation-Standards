# RAD+ar Presentation Standards (untuk Bambang / Claude)

Skill format Claude (`SKILL.md`) untuk gambar presentasi kantor RAD+ar: denah berwarna, diagram konsep,
entourage berskala, bahan dari model 3D, dan format deck proposal. Umum — tidak terikat satu proyek.

| Skill | Isi |
|---|---|
| `radar-aturan-presentasi` | **Baca pertama.** Aturan emas (tanpa screenshot user, hasil PSD/AI berlayer, lanskap + orang berskala, diagram sebelum render), gaya visual, folder, checklist |
| `radar-presentasi-deck` | Format deck portfolio (5 slide) & proposal klien (25–65 slide), template RADAR, gaya diagram, mood board, pelajaran pemenang kompetisi |
| `radar-diagram-konsep` | Analisis desain dari model 3D → diagram massa, fasad, bukaan, layout/core, level & akses; susunan papan; layer PSD; saran edit |
| `radar-warna-denah` | Plot DWG → PDF A3 (setting kantor) → warna di Photoshop berlayer; palet; zona dari polyline AREA |
| `radar-entourage` | Pohon, semak, rumput, planter, orang — ukuran standar, hitung px/m, penempatan, layer |
| `radar-sumber-3d` | Ekspor view ortografis & data material dari SketchUp via Ruby Console (tanpa export DWG, tanpa screenshot) |

## Alat (`alat/`)
| File | Program | Fungsi |
|---|---|---|
| `plot_frame.lsp` | AutoCAD | Plot frame A3 per judul ke PDF (AutoCAD PDF High Quality · ISO full bleed A3 · 214 plotstyle.ctb · window sheet · fit · center) + `regions_<tag>.txt` |
| `warna_denah.jsx` | Photoshop | Warnai PDF denah berlayer dari regions (site, rumput, paving, air, konteks, zona AREA, bayangan) → PSD + JPG |
| `sketchup_views.rb` | SketchUp | Ekspor iso/tampak/atas ortografis + `materials.txt` + `scale.txt` |
| `entourage.rb` | SketchUp | Ekspor view axo + posisi & ukuran px pohon/semak/orang dari face rumput/paving → JSON |
| `entourage.jsx` | Photoshop | Layer LANDSCAPE / TREES / PEOPLE berskala (mode `elevation` atau `axo`) → PSD + JPG |
| `board.jsx` | Photoshop | Papan diagram 16:9 berlayer: margin RADAR, judul, panel 01–05, teks WHY, nomor + leader |

Setiap alat punya blok **CONFIG** di bagian atas — isi path & parameter, lalu jalankan:
AutoCAD `(load "…/plot_frame.lsp")` · SketchUp *Extensions → Developer → Ruby Console* `load '…/x.rb'` · Photoshop *File → Scripts → Browse…*.

Status uji: alur `plot_frame.lsp` + pewarnaan dipakai nyata untuk 3 denah (GF, L2, L3) dan ekspor view SketchUp berhasil.
`warna_denah.jsx`, `entourage.jsx`, `board.jsx` versi umum ini lolos cek sintaks tetapi **belum dijalankan** di Photoshop — uji sekali sebelum dipakai rutin.

## Pasang di Bambang
Settings → **Skill** → **Tambah skill dari GitHub** → isi `<akun>/RADAR-Presentation-Standards` → aktifkan keenam skill.
Repo harus **public**. Bambang hanya mengimpor file `SKILL.md`; alat diunduh dari `alat/` saat dibutuhkan
(`https://raw.githubusercontent.com/<akun>/RADAR-Presentation-Standards/main/alat/<file>`).
Setelah repo diperbarui, impor ulang agar Bambang memakai versi terbaru.
