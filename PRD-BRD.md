# PRD / BRD — Web Photobooth App
**Versi:** 1.0.0  
**Tanggal:** 21 Mei 2026  
**Status:** Draft  

---

## 1. Ringkasan Eksekutif

Aplikasi photobooth berbasis web yang berjalan di browser tanpa instalasi. Dibangun dengan React + Vite, mendukung kamera bawaan device maupun DSLR/mirrorless via HDMI capture card. Output berupa photo strip 4 foto dengan template bingkai custom, dapat diunduh sebagai PNG/PDF dan dibagikan via QR code.

---

## 2. Latar Belakang & Tujuan Bisnis

### Masalah
- Software photobooth profesional yang ada (dslrBooth, LumaBooth) mahal, tertutup, dan tidak fleksibel untuk kustomisasi branding.
- Operator event membutuhkan solusi yang mudah di-setup, bisa jalan di tablet maupun laptop, tanpa perlu install software berat.
- Tidak ada solusi web-based photobooth yang mature dan terjangkau di pasar lokal Indonesia.

### Tujuan
- Membangun aplikasi photobooth web yang bisa digunakan di event (wedding, birthday, corporate, dll).
- Memberikan output foto berkualitas dengan template bingkai yang dapat dikustomisasi.
- Menyediakan jalur upgrade yang jelas dari MVP hingga fitur profesional.

### Ukuran Keberhasilan (KPI)
| Metrik | Target Phase 1 | Target Phase 3 |
|---|---|---|
| Waktu setup di venue | < 2 menit | < 1 menit |
| Waktu per sesi foto | < 60 detik | < 45 detik |
| Kualitas output | PNG 1080p | PNG/PDF print-ready |
| Jumlah kamera didukung | 2+ sumber | 2+ sumber |

---

## 3. Target Pengguna

### Operator (Primary User)
Fotografer atau penyedia jasa photobooth yang mengoperasikan booth di event. Kebutuhan utama: setup cepat, tampilan profesional, output bisa langsung dicetak atau dibagikan.

### Tamu Event (End User)
Pengunjung event yang menggunakan booth. Kebutuhan utama: pengalaman menyenangkan, foto bisa langsung didapat di HP.

---

## 4. Scope Produk

### In Scope
- Aplikasi web (React + Vite) yang berjalan di browser modern (Chrome, Edge, Safari)
- Dukungan kamera bawaan device dan eksternal via capture card
- Photo strip 4 foto dengan template bingkai
- Export PNG dan PDF
- QR code untuk share foto ke HP tamu
- Dashboard statistik event sederhana

### Out of Scope (saat ini)
- Koneksi DSLR via USB / tethering langsung (butuh Electron)
- Print otomatis tanpa dialog (butuh Electron)
- Filter real-time / AR face filter
- Stiker drag & drop interaktif
- Green screen / virtual background
- Aplikasi mobile native (iOS / Android)

---

## 5. Tech Stack

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | React 18 + Vite | UI & build tool |
| Styling | Tailwind CSS | Utility-first CSS |
| Canvas | Konva.js + react-konva | Render photo strip & bingkai |
| Export PDF | jsPDF | Generate file print-ready |
| QR Code | qrcode.js | Generate QR untuk share |
| Cloud Storage | Cloudinary | Upload foto sementara (Phase 2) |
| Backend/DB | PostgreSQL (lokal) | Statistik & analytics (Phase 3) |
| Kamera | getUserMedia() native | WebRTC API bawaan browser |

---

## 6. Arsitektur Aplikasi

```
src/
├── components/
│   ├── CameraSelector/     → pilih sumber kamera
│   ├── LivePreview/        → tampilan live kamera
│   ├── CaptureFlow/        → countdown + auto capture
│   ├── PhotoStrip/         → render canvas hasil foto
│   ├── TemplateFrame/      → bingkai & teks footer
│   └── ExportPanel/        → download PNG / PDF
├── hooks/
│   ├── useCamera.js        → logic getUserMedia & enumerateDevices
│   ├── useCapture.js       → logic countdown & capture frame
│   └── useCanvas.js        → logic render canvas & export
├── templates/              → data template bingkai
├── utils/
│   ├── canvasHelper.js     → helper draw canvas
│   └── exportHelper.js     → helper export PNG & PDF
└── pages/
    ├── SetupPage.jsx       → halaman konfigurasi awal
    ├── BoothPage.jsx       → halaman utama booth
    └── ResultPage.jsx      → halaman hasil & export
```

---

## 7. Alur Pengguna (User Flow)

```
Buka App
   ↓
Setup Page
  → Pilih kamera (tablet / capture card)
  → Setting nama event & teks footer
  → Pilih template bingkai
   ↓
Booth Page
  → Live preview kamera full screen
  → Tekan tombol "Mulai" → countdown 5 detik
  → Auto capture 4 foto (jeda 3 detik tiap foto)
   ↓
Result Page
  → Preview photo strip final
  → Pilih: Download PNG / Export PDF / Scan QR
  → Tombol "Sesi Baru" → kembali ke Booth Page
```

---

## 8. Roadmap Phase

| Phase | Nama | Estimasi | Deliverable |
|---|---|---|---|
| 1 | MVP | 1–2 minggu | Booth bisa dipakai di event, export PNG/PDF |
| 2 | Enhanced | +3–5 hari | QR code share ke HP tamu |
| 3 | Pro | +1–2 minggu | Print dialog + dashboard statistik |

---

## 9. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Browser tidak izinkan akses kamera | Tinggi | Tampilkan panduan permission yang jelas, fallback message |
| Capture card tidak terdeteksi | Sedang | Tombol refresh device list, instruksi troubleshoot |
| Kualitas foto kurang tajam (frame capture) | Sedang | Set resolusi kamera ke max, optimasi pencahayaan venue |
| PDF tidak sesuai ukuran cetak | Rendah | Test output di berbagai printer, sediakan preset ukuran kertas |
| Cloudinary storage overload di event besar | Rendah | Set TTL file (auto-delete 24 jam), batasi ukuran upload |

---

## 10. Definisi Done (DoD)

Sebuah fitur dianggap selesai jika:
- [ ] Fungsi utama berjalan di Chrome (desktop & tablet)
- [ ] Tidak ada error di console browser
- [ ] Responsive di layar 768px ke atas
- [ ] Sudah di-test manual minimal 3 sesi simulasi
- [ ] Kode sudah di-push ke repository
