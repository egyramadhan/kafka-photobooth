# Task List — Phase 3 (Pro)
**Target:** Fitur print & dashboard operasional event  
**Estimasi:** 1–2 minggu  
**Prasyarat:** Phase 1 & 2 selesai  
**Status:** 🔴 Belum dimulai  

---

## Fitur 1 — Print via PDF (Browser Print Dialog)

- [ ] **TASK-034** — Optimasi output PDF untuk cetak
  - Setup ukuran kertas photobooth standar: **2×6 inch** (50.8×152.4mm)
  - Setup resolusi tinggi: 300 DPI minimum untuk hasil cetak tajam
  - Kalkulasi pixel canvas: 2in × 300dpi = 600px lebar, 6in × 300dpi = 1800px tinggi
  - Pastikan crop mark masuk dalam area bleed (3mm di setiap sisi)
  - Test output di jsPDF dengan preset ukuran ini

- [ ] **TASK-035** — Buat fungsi `printStrip()`
  - Render canvas ke blob URL
  - Buka window baru khusus print dengan CSS `@media print` yang dikontrol ketat
  - Set `@page { size: 2in 6in; margin: 0; }` di CSS print
  - Panggil `window.print()` otomatis setelah halaman load
  - Tutup window setelah print dialog ditutup user

- [ ] **TASK-036** — Tambah tombol Print di `ResultPage`
  - Tombol "Print Foto" dengan ikon printer
  - Tampilkan preview ukuran kertas sebelum print
  - Tampilkan catatan: "Pastikan printer sudah terhubung dan kertas ukuran 2×6 tersedia"
  - Handle: printer tidak terdeteksi (hanya tampil dialog browser biasa)

- [ ] **TASK-037** — Test print di berbagai printer
  - Test di printer dye-sub (Mitsubishi / HiTi jika tersedia)
  - Test di printer inkjet biasa sebagai fallback
  - Test di Windows (Chrome) dan macOS (Chrome & Safari)
  - Dokumentasikan setting printer yang direkomendasikan

---

## Fitur 2 — Dashboard Event & Statistik

- [ ] **TASK-038** — Setup PostgreSQL lokal
  - Install PostgreSQL 16.x di komputer lokal (jika belum ada)
  - Buat database baru: `CREATE DATABASE photobooth;`
  - Buat tabel `sessions`:
    ```sql
    CREATE TABLE sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_name TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      photos_taken INT DEFAULT 4,
      downloaded BOOLEAN DEFAULT FALSE,
      pdf_exported BOOLEAN DEFAULT FALSE,
      qr_scanned BOOLEAN DEFAULT FALSE,
      template_id TEXT
    );
    ```
  - Buat API backend sederhana (Express.js) untuk koneksi database
  - Install: `npm install pg express cors`
  - Set environment variables: `VITE_DB_HOST`, `VITE_DB_PORT`, `VITE_DB_NAME`, `VITE_DB_USER`, `VITE_DB_PASSWORD`
  - Backend API endpoint: POST `/api/sessions`, GET `/api/sessions`, PATCH `/api/sessions/:id`

- [ ] **TASK-039** — Tracking sesi
  - Setiap sesi selesai (4 foto diambil) → insert record ke tabel `sessions`
  - Update `downloaded = true` jika user download PNG
  - Update `pdf_exported = true` jika user export PDF
  - Update `qr_scanned = true` jika link QR diakses (dari halaman download)
  - Tracking bersifat anonim, tidak simpan foto atau data personal

- [ ] **TASK-040** — Buat halaman `/dashboard`
  - Proteksi dengan password sederhana (env variable `VITE_DASHBOARD_PASSWORD`)
  - Tidak perlu auth system penuh — ini hanya untuk operator internal

- [ ] **TASK-041** — Komponen statistik utama
  - Card: total sesi hari ini
  - Card: total foto diambil
  - Card: persentase download (downloaded / total sesi)
  - Card: persentase QR di-scan
  - Semua angka auto-refresh tiap 30 detik (polling ke backend API)

- [ ] **TASK-042** — Grafik & breakdown
  - Grafik sesi per jam (line chart — pakai recharts)
  - Breakdown template yang paling sering dipakai (bar chart)
  - Filter by: hari ini / 7 hari / semua waktu
  - Tombol export data sebagai CSV

- [ ] **TASK-043** — Manajemen multi-event
  - Dropdown pilih event (berdasarkan `event_name` yang unik)
  - Statistik terfilter per event
  - Berguna jika aplikasi dipakai di berbagai event berbeda

---

## Polish & Stabilitas

- [ ] **TASK-044** — Offline fallback
  - Deteksi koneksi internet hilang (event di venue dengan WiFi buruk)
  - QR share: tampil pesan "Tidak ada koneksi, hanya download lokal yang tersedia"
  - Dashboard: tampil data cache terakhir jika offline
  - Statistik tracking: antri di localStorage, kirim saat online kembali

- [ ] **TASK-045** — Kiosk mode (fullscreen tanpa UI browser)
  - Tombol "Aktifkan Kiosk Mode" di SetupPage
  - Panggil `document.documentElement.requestFullscreen()`
  - Sembunyikan semua UI browser
  - Tombol darurat keluar kiosk mode (shortcut keyboard: Escape 3x atau kombinasi khusus)

- [ ] **TASK-046** — Final QA & dokumentasi
  - Test lengkap semua fitur Phase 1, 2, 3 end-to-end
  - Buat `README.md` dengan panduan setup & deploy
  - Buat panduan operator: cara setup di venue, troubleshoot umum
  - Dokumentasi environment variables yang diperlukan
  - Final deploy ke production

---

## Ringkasan Task

| Kategori | Jumlah Task |
|---|---|
| Print via PDF | 4 |
| Setup Supabase | 1 |
| Tracking sesi | 1 |
| Dashboard & statistik | 4 |
| Polish & stabilitas | 3 |
| **Total** | **13** |

---

## Total Keseluruhan Semua Phase

| Phase | Task | Estimasi |
|---|---|---|
| Phase 1 — MVP | 24 task | 1–2 minggu |
| Phase 2 — Enhanced | 9 task | 3–5 hari |
| Phase 3 — Pro | 13 task | 1–2 minggu |
| **Total** | **46 task** | **3–5 minggu** |

---

## Catatan Pengerjaan

> PostgreSQL lokal memberikan kontrol penuh atas data dan tidak memerlukan koneksi internet.
>
> Backend API sederhana (Express.js) diperlukan sebagai middleware antara React frontend dan PostgreSQL.
>
> Kiosk mode sangat disarankan untuk setup di venue — mencegah tamu tidak sengaja close browser atau navigasi keluar dari aplikasi.
>
> Fitur print 2×6 inch harus ditest langsung di printer fisik sebelum dipakai di event. Setiap printer punya margin handling yang berbeda.
