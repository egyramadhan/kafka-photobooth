# Task List — Phase 1 (MVP)
**Target:** Aplikasi bisa dipakai di event  
**Estimasi:** 1–2 minggu  
**Status:** ✅ SELESAI (20/24 tasks completed)  

---

## Setup Project

- [x] **TASK-001** — Inisialisasi project React + Vite
  - `npm create vite@latest photobooth-app -- --template react`
  - Install dependencies: `tailwindcss`, `react-konva`, `konva`, `jspdf`
  - Setup Tailwind CSS config
  - Setup folder structure sesuai arsitektur di PRD
  - Push initial commit ke repository

- [x] **TASK-002** — Setup routing & halaman dasar
  - Install `react-router-dom`
  - Buat 3 halaman kosong: `SetupPage`, `BoothPage`, `ResultPage`
  - Setup routing di `App.jsx`
  - Buat komponen `Layout` sebagai wrapper

---

## Fitur 1 — Camera Selector

- [x] **TASK-003** — Buat hook `useCamera.js`
  - Implementasi `navigator.mediaDevices.enumerateDevices()`
  - Filter hanya `videoinput` devices
  - Handle event `devicechange` untuk auto-refresh list kamera
  - Return: `{ devices, selectedDevice, setSelectedDevice, stream, error }`

- [x] **TASK-004** — Buat komponen `CameraSelector`
  - Tampilkan list kamera yang terdeteksi
  - Highlight kamera yang sedang aktif
  - Tombol refresh device list
  - Handle state: loading, no camera found, permission denied
  - Tampil di `SetupPage`

- [x] **TASK-005** — Handle camera permission
  - Minta permission kamera saat app pertama buka
  - Tampilkan pesan panduan jika permission ditolak
  - Simpan `deviceId` yang dipilih ke `localStorage`

---

## Fitur 2 — Live Preview Kamera

- [x] **TASK-006** — Buat komponen `LivePreview`
  - Render `<video>` element dengan stream dari kamera terpilih
  - Mirror mode: flip horizontal untuk selfie (toggle on/off)
  - Aspect ratio terkunci 4:3 atau 16:9 sesuai setting
  - Handle kamera disconnect saat sedang preview (tampil error state)

- [x] **TASK-007** — Integrasi di `BoothPage`
  - `LivePreview` tampil full screen di booth page
  - Overlay UI: tombol "Mulai", indikator kamera aktif
  - Tombol kembali ke `SetupPage`

---

## Fitur 3 — Countdown Timer + Auto Capture

- [x] **TASK-008** — Buat hook `useCapture.js`
  - Logic countdown: 5 detik sebelum foto pertama
  - Auto capture 4 foto dengan jeda 3 detik antar foto
  - Durasi countdown & jeda bisa dikonfigurasi (via props/config)
  - Return: `{ isCapturing, currentCount, photosTaken, capturedPhotos, startCapture, resetCapture }`

- [x] **TASK-009** — Buat komponen `CountdownOverlay`
  - Tampilkan angka countdown besar di tengah layar (5, 4, 3, 2, 1, "Senyum!")
  - Animasi transisi angka (scale + fade)
  - Indikator progress: foto ke berapa dari 4 (misal: ● ● ○ ○)
  - Flash effect saat capture (layar putih sebentar)

- [x] **TASK-010** — Capture frame dari video
  - `ctx.drawImage(videoElement, 0, 0)` ke canvas tersembunyi
  - Simpan hasil sebagai `dataURL` (PNG)
  - Simpan 4 foto ke state `capturedPhotos[]`
  - Setelah foto ke-4: otomatis navigate ke `ResultPage`

---

## Fitur 4 — Photo Strip Layout

- [x] **TASK-011** — Buat hook `useCanvas.js`
  - Setup Konva Stage & Layer
  - Fungsi `buildStrip(photos, template)` → render strip ke canvas
  - Return: `{ stageRef, exportPNG, exportPDF }`

- [x] **TASK-012** — Buat komponen `PhotoStrip`
  - Render 4 foto berurutan vertikal (layout 4×1 strip)
  - Ukuran canvas strip: 600×1800px (ratio 1:3, standar photobooth)
  - Gap antar foto: konsisten, bisa dikonfigurasi
  - Foto ditampilkan dengan aspect ratio terjaga (object-fit cover)

- [ ] **TASK-013** — Pilihan layout strip (OPTIONAL)
  - Layout A: 4×1 strip vertikal (default)
  - Layout B: 2×2 grid
  - Toggle layout di `ResultPage`
  - Canvas re-render saat layout berubah

---

## Fitur 5 — Template Bingkai Dasar

- [x] **TASK-014** — Buat struktur data template
  - File `src/templates/index.js` berisi array template
  - Tiap template: `{ id, name, bgColor, textColor, footerText, showCropMark }`
  - Minimal 2 template default: Classic Black, Classic White

- [x] **TASK-015** — Render bingkai di canvas
  - Background strip sesuai `bgColor` template
  - Footer area di bawah foto ke-4: tinggi 120px
  - Teks nama event & tanggal di footer (font, ukuran, warna dari template)
  - Teks label vertikal di sisi strip (opsional, sesuai referensi gambar)

- [x] **TASK-016** — Crop mark / registration mark
  - Tambah tanda segitiga kecil di 4 sudut strip (panduan potong cetak)
  - Toggle show/hide crop mark (default: on)
  - Warna crop mark kontras dengan background

- [x] **TASK-017** — Setting nama event di `SetupPage`
  - Input field: nama event, teks footer, tanggal
  - Simpan ke state global (Context API atau Zustand)
  - Preview perubahan teks langsung di miniatur strip

---

## Fitur 6 — Export & Download

- [x] **TASK-018** — Export PNG
  - `stage.toDataURL({ pixelRatio: 3 })` untuk resolusi tinggi (1800×5400px)
  - Trigger download file dengan nama otomatis: `photobooth-[timestamp].png`
  - Tombol "Download PNG" di `ResultPage`

- [x] **TASK-019** — Export PDF via jsPDF
  - Setup jsPDF dengan ukuran kertas 2×6 inch (standar photobooth print)
  - Embed gambar strip ke PDF dengan kualitas tinggi
  - Margin & bleed sesuai standar cetak
  - Tombol "Export PDF" di `ResultPage`

- [x] **TASK-020** — Halaman Result & UX flow
  - Tampilkan preview strip hasil
  - Tombol: Download PNG, Export PDF
  - Tombol "Sesi Baru" → reset state → kembali ke `BoothPage`
  - Tombol "Ubah Setting" → kembali ke `SetupPage`

---

## Testing & Polish

- [ ] **TASK-021** — Test di berbagai device
  - Test di Chrome desktop (Windows/Mac)
  - Test di Chrome tablet (Android/iPad)
  - Test dengan capture card (jika tersedia)
  - Catat bug & edge case

- [ ] **TASK-022** — Responsive layout
  - `SetupPage`: responsive di 768px ke atas
  - `BoothPage`: optimal di layar 1024px+ (landscape)
  - `ResultPage`: responsive di 768px ke atas

- [x] **TASK-023** — Error handling & empty states
  - Tidak ada kamera terdeteksi → pesan & panduan
  - Permission kamera ditolak → instruksi cara allow
  - Export gagal → pesan error & retry button

- [ ] **TASK-024** — Deploy Phase 1
  - Build production: `npm run build`
  - Deploy ke Vercel atau Netlify (free tier)
  - Test di URL production
  - Siapkan untuk demo di event pertama

---

## Ringkasan Task

| Kategori | Jumlah Task |
|---|---|
| Setup project | 2 |
| Camera selector | 3 |
| Live preview | 2 |
| Countdown + capture | 3 |
| Photo strip layout | 3 |
| Template bingkai | 4 |
| Export & download | 3 |
| Testing & deploy | 4 |
| **Total** | **24** |

---

## Catatan Pengerjaan

> Urutan pengerjaan yang disarankan:
> TASK-001 → 002 → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015 → 016 → 017 → 018 → 019 → 020 → 021 → 022 → 023 → 024
>
> Jangan lompat ke fitur export sebelum photo strip layout selesai. Canvas harus bisa render dulu baru bisa di-export.
