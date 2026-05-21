# Task List — Phase 2 (Enhanced)
**Target:** Tamu bisa langsung dapat foto di HP via QR code  
**Estimasi:** 3–5 hari  
**Prasyarat:** Phase 1 selesai & sudah di-deploy  
**Status:** ✅ 6/9 tasks selesai (TASK-026 butuh user action, TASK-032/033 testing)  

---

## Persiapan

- [x] **TASK-025** — Setup Cloudinary account
  - Buat account di Cloudinary (free tier: 25GB storage, 25GB bandwidth/bulan)
  - Dapatkan Cloud Name, API Key, dan API Secret dari dashboard
  - Install: `npm install cloudinary-core`
  - Buat file `src/lib/cloudinary.js` dengan konfigurasi
  - Set environment variables: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_API_KEY`, `VITE_CLOUDINARY_UPLOAD_PRESET` di `.env`

- [ ] **TASK-026** — Setup Cloudinary upload preset (USER ACTION REQUIRED)
  - Buat unsigned upload preset di Cloudinary Console (Settings → Upload)
  - Set folder: `photobooth-strips`
  - Set access mode: public (untuk akses via URL)
  - Set auto-tagging dengan timestamp untuk tracking
  - Test upload via Cloudinary widget atau API dari browser

---

## Fitur — QR Code Share

- [x] **TASK-027** — Buat utility `uploadPhoto.js`
  - Fungsi `uploadStrip(dataURL)` → upload PNG ke Cloudinary
  - Generate nama file unik: `photobooth-strips/[timestamp]-[randomId].png`
  - Return URL publik file yang sudah diupload
  - Handle error: network error, upload failed, quota exceeded
  - Tampilkan progress upload (0–100%) menggunakan XMLHttpRequest atau fetch dengan progress tracking

- [x] **TASK-028** — Generate QR code
  - Install: `npm install qrcode`
  - Fungsi `generateQR(url)` → return QR code sebagai dataURL
  - Ukuran QR: 300×300px minimum (mudah di-scan)
  - Error correction level: M (15%) — cukup untuk URL Cloudinary

- [x] **TASK-029** — Buat komponen `QRSharePanel`
  - Tampilkan QR code di `ResultPage` setelah upload selesai
  - Teks panduan: "Scan QR ini untuk download foto ke HP kamu"
  - Tampilkan URL pendek di bawah QR (fallback jika scan gagal)
  - Tombol "Salin Link" untuk copy URL ke clipboard
  - Auto-hide panel setelah 60 detik (siap sesi berikutnya)

- [x] **TASK-030** — Integrasi di `ResultPage`
  - Tambah tombol "Bagikan via QR" di samping tombol Download PNG
  - Flow: klik → loading (upload) → tampil QR panel
  - Handle state: idle → uploading → success → error
  - Jika upload gagal: tetap bisa download PNG secara lokal

- [x] **TASK-031** — Halaman download untuk tamu
  - Buat halaman `/download/[fileId]` yang bisa diakses dari HP tamu
  - Tampilkan preview foto strip dari Cloudinary URL
  - Tombol download besar yang mobile-friendly
  - Branding event / nama aplikasi di halaman ini
  - Halaman otomatis expired setelah 24 jam (cek timestamp dari fileId atau metadata Cloudinary)

---

## Testing

- [ ] **TASK-032** — Test end-to-end QR flow
  - Simulasi sesi lengkap: capture → strip → upload → QR → scan dari HP
  - Test di jaringan lambat (simulasi 3G)
  - Test upload file besar (strip resolusi tinggi ~3–5MB)
  - Test scan QR dari berbagai HP (Android & iOS)

- [ ] **TASK-033** — Test halaman download di mobile
  - Test di Chrome Android, Safari iOS
  - Pastikan tombol download berfungsi (behavior download berbeda di iOS Safari)
  - Test di layar kecil (375px width)

---

## Ringkasan Task

| Kategori | Jumlah Task |
|---|---|
| Setup Cloudinary | 2 |
| Upload & QR | 4 |
| Halaman download tamu | 1 |
| Testing | 2 |
| **Total** | **9** |

---

## Catatan Pengerjaan

> Cloudinary free tier memberikan 25GB storage dan 25GB bandwidth per bulan — sangat cukup untuk event kecil hingga menengah (500+ tamu).
>
> Cloudinary memiliki fitur auto-optimization dan transformasi gambar on-the-fly, sehingga bisa menghemat bandwidth dengan serve gambar dalam format WebP atau ukuran yang sudah dioptimasi.
>
> File di-upload dalam format PNG asli. Cloudinary akan otomatis mengoptimasi delivery tanpa perlu kompresi manual. Ukuran file strip (~3–5MB) masih dalam batas wajar untuk download mobile.
