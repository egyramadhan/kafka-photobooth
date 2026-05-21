---
name: photobooth-web-app
description: >
  Panduan lengkap untuk mengerjakan kode aplikasi Web Photobooth berbasis
  React + Vite. Baca file ini sebelum menulis kode apapun di project ini.
  Mencakup konvensi, pola, library yang digunakan, dan aturan yang tidak boleh dilanggar.
---

# SKILL.md — Web Photobooth App

Baca file ini sebelum menulis satu baris kode pun. File ini adalah sumber
kebenaran tunggal untuk konvensi dan pola yang digunakan di project ini.

---

## 1. Stack & Versi

| Teknologi | Versi | Keterangan |
|---|---|---|
| React | 18.x | Gunakan functional components & hooks saja. Tidak ada class component. |
| Vite | 5.x | Build tool. Jangan ganti ke CRA atau Next.js. |
| Tailwind CSS | 3.x | Styling utama. Tidak ada CSS module atau styled-components. |
| Konva.js | 9.x | Canvas engine untuk photo strip & bingkai. |
| react-konva | 18.x | React binding untuk Konva. |
| jsPDF | 2.x | Export PDF. Tidak ada library PDF lain. |
| qrcode | 1.x | Generate QR code. |
| Firebase | 10.x | Storage untuk QR share (Phase 2+). |
| PostgreSQL | 16.x | Database statistik lokal (Phase 3+). |
| pg | 8.x | PostgreSQL client untuk Node.js. |
| react-router-dom | 6.x | Routing. Gunakan `createBrowserRouter`. |

---

## 2. Struktur Folder

```
src/
├── components/          # Komponen UI yang bisa di-reuse
│   ├── CameraSelector/
│   │   ├── index.jsx    # Entry point komponen
│   │   └── CameraSelector.test.jsx
│   ├── LivePreview/
│   ├── CaptureFlow/
│   ├── PhotoStrip/
│   ├── TemplateFrame/
│   ├── ExportPanel/
│   └── QRSharePanel/    # Phase 2
│
├── hooks/               # Custom hooks — logic, bukan UI
│   ├── useCamera.js
│   ├── useCapture.js
│   └── useCanvas.js
│
├── pages/               # Satu file per halaman/route
│   ├── SetupPage.jsx
│   ├── BoothPage.jsx
│   ├── ResultPage.jsx
│   └── DashboardPage.jsx  # Phase 3
│
├── templates/           # Data template bingkai (bukan komponen)
│   └── index.js         # Export array TEMPLATES
│
├── lib/                 # Inisialisasi third-party (firebase, database)
│   ├── firebase.js      # Phase 2+
│   └── db.js            # Phase 3+ PostgreSQL connection
│
├── utils/               # Pure functions, tidak ada React di sini
│   ├── canvasHelper.js
│   ├── exportHelper.js
│   └── uploadHelper.js  # Phase 2+
│
├── store/               # Global state (Zustand)
│   └── useBoothStore.js
│
└── App.jsx              # Router setup saja, tidak ada logic di sini
```

**Aturan folder:**
- Setiap komponen punya folder sendiri dengan `index.jsx` sebagai entry.
- Hooks hanya berisi logic. Tidak ada JSX di dalam file hook.
- Utils harus pure functions — tidak ada side effect, tidak ada import React.
- Tidak boleh import komponen dari `pages/` ke komponen lain.

---

## 3. Konvensi Penamaan

| Tipe | Format | Contoh |
|---|---|---|
| Komponen React | PascalCase | `CameraSelector`, `PhotoStrip` |
| Custom hook | camelCase + prefix `use` | `useCamera`, `useCapture` |
| Utility function | camelCase | `drawStripToCanvas`, `exportToPDF` |
| Konstanta | UPPER_SNAKE_CASE | `MAX_PHOTOS`, `DEFAULT_COUNTDOWN` |
| File komponen | PascalCase `.jsx` | `CameraSelector.jsx` |
| File hook/util | camelCase `.js` | `useCamera.js`, `canvasHelper.js` |
| CSS class (Tailwind) | gunakan langsung di JSX | tidak ada custom class kecuali sangat perlu |
| Event handler prop | prefix `on` | `onCapture`, `onExport` |
| Handler function | prefix `handle` | `handleCapture`, `handleExport` |

---

## 4. Pola State Management

Gunakan **Zustand** untuk global state. Jangan Context API untuk state yang
diakses banyak komponen — terlalu verbose dan menyebabkan re-render berlebih.

```js
// src/store/useBoothStore.js
import { create } from 'zustand'

const useBoothStore = create((set) => ({
  // Kamera
  selectedDeviceId: null,
  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),

  // Setting event
  eventName: '',
  footerText: '',
  selectedTemplateId: 'classic-black',
  setEventSetting: (settings) => set(settings),

  // Hasil foto
  capturedPhotos: [],        // array of dataURL string, max 4
  addPhoto: (photo) => set((s) => ({
    capturedPhotos: [...s.capturedPhotos, photo]
  })),
  resetPhotos: () => set({ capturedPhotos: [] }),
}))
```

**Aturan state:**
- State lokal komponen (`useState`) untuk: UI state, loading, toggle, input sementara.
- Zustand untuk: data yang perlu diakses lintas halaman (foto hasil, setting event, deviceId).
- Jangan simpan blob/file object ke Zustand — simpan sebagai `dataURL` string saja.

---

## 5. Pola Custom Hook

Semua hook harus mengikuti pola ini:

```js
// src/hooks/useCamera.js
import { useState, useEffect, useRef } from 'react'

export function useCamera() {
  const [devices, setDevices]           = useState([])
  const [selectedId, setSelectedId]     = useState(null)
  const [stream, setStream]             = useState(null)
  const [error, setError]               = useState(null)
  const [isLoading, setIsLoading]       = useState(false)

  // Logic di sini...

  return { devices, selectedId, setSelectedId, stream, error, isLoading }
}
```

**Aturan hook:**
- Selalu return object `{}`, bukan array `[]` (kecuali meniru pola useState).
- Selalu sertakan `error` dan `isLoading` di return value.
- Cleanup di `useEffect` — jangan ada memory leak (stop stream, clear timer, dll).
- Jangan panggil hook lain di dalam kondisi atau loop.

---

## 6. Cara Kerja Kamera

### Enumerate devices
```js
const devices = await navigator.mediaDevices.enumerateDevices()
const cameras = devices.filter(d => d.kind === 'videoinput')
```

### Start stream dengan deviceId
```js
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    deviceId: { exact: deviceId },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  }
})
videoRef.current.srcObject = stream
```

### Stop stream (WAJIB saat unmount atau ganti kamera)
```js
stream.getTracks().forEach(track => track.stop())
```

### Capture frame dari video ke canvas
```js
const canvas = document.createElement('canvas')
canvas.width = videoRef.current.videoWidth
canvas.height = videoRef.current.videoHeight
canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
const dataURL = canvas.toDataURL('image/png')
```

**Aturan kamera:**
- Selalu stop stream lama sebelum buka stream baru.
- Selalu cleanup stream di `useEffect` return function.
- Gunakan `videoRef.current.videoWidth` bukan hardcode resolusi.
- Selalu handle error `NotAllowedError` (permission denied) dan `NotFoundError` (no camera).

---

## 7. Cara Kerja Canvas (Konva.js)

### Setup dasar
```jsx
import { Stage, Layer, Image, Rect, Text } from 'react-konva'

// Ukuran strip standar photobooth (300 DPI, 2x6 inch)
const STRIP_WIDTH  = 600   // px
const STRIP_HEIGHT = 1800  // px
```

### Render photo strip
```jsx
<Stage width={STRIP_WIDTH} height={STRIP_HEIGHT} ref={stageRef}>
  <Layer>
    {/* Background */}
    <Rect width={STRIP_WIDTH} height={STRIP_HEIGHT} fill={template.bgColor} />

    {/* 4 foto berurutan */}
    {photos.map((photo, i) => (
      <KonvaImage
        key={i}
        image={photoImages[i]}   // HTMLImageElement, bukan dataURL
        x={PADDING}
        y={PADDING + i * (PHOTO_HEIGHT + GAP)}
        width={PHOTO_WIDTH}
        height={PHOTO_HEIGHT}
      />
    ))}

    {/* Footer */}
    <Rect x={0} y={FOOTER_Y} width={STRIP_WIDTH} height={FOOTER_H} fill={template.footerBg} />
    <Text x={0} y={FOOTER_Y + 20} width={STRIP_WIDTH} text={eventName} align="center" />
  </Layer>
</Stage>
```

### Convert dataURL ke HTMLImageElement (WAJIB untuk Konva)
```js
function loadImage(dataURL) {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })
}
```

### Export canvas ke PNG
```js
// pixelRatio: 3 → output 3x resolusi (600px → 1800px actual)
const dataURL = stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/png' })
```

**Aturan canvas:**
- Konva perlu `HTMLImageElement`, bukan dataURL langsung. Selalu pakai `loadImage()`.
- `pixelRatio: 3` untuk export — jangan kurang dari ini untuk kualitas cetak.
- Jangan gunakan `document.createElement('canvas')` untuk photo strip — pakai Konva.
- Ukuran Stage di layar bisa kecil (preview), tapi export tetap pakai resolusi penuh.

---

## 8. Ukuran & Konstanta Canvas

```js
// src/utils/canvasHelper.js

// Ukuran strip standar photobooth 2x6 inch @ 300 DPI
export const STRIP = {
  WIDTH:        600,
  HEIGHT:       1800,
  PADDING:      20,
  PHOTO_WIDTH:  560,   // WIDTH - (PADDING * 2)
  PHOTO_HEIGHT: 374,   // (HEIGHT - FOOTER_H - PADDING*5 - GAP*3) / 4
  GAP:          14,    // jarak antar foto
  FOOTER_H:     120,   // tinggi area footer
  FOOTER_Y:     1680,  // HEIGHT - FOOTER_H
}

// Crop mark (registration mark)
export const CROP_MARK = {
  SIZE:   12,   // panjang garis
  OFFSET: 6,    // jarak dari sudut strip
  COLOR:  '#000000',
  WIDTH:  0.5,
}
```

---

## 9. Struktur Data Template

```js
// src/templates/index.js
export const TEMPLATES = [
  {
    id:           'classic-black',
    name:         'Classic Black',
    bgColor:      '#000000',
    footerBg:     '#000000',
    textColor:    '#ffffff',
    showCropMark: true,
    cropMarkColor:'#ffffff',
  },
  {
    id:           'classic-white',
    name:         'Classic White',
    bgColor:      '#ffffff',
    footerBg:     '#ffffff',
    textColor:    '#000000',
    showCropMark: true,
    cropMarkColor:'#000000',
  },
]
```

Tambahkan template baru dengan menambah object ke array ini. Tidak perlu ubah
kode di tempat lain — komponen sudah baca dari array ini secara dinamis.

---

## 10. Export PDF

```js
// src/utils/exportHelper.js
import jsPDF from 'jspdf'

export async function exportToPDF(stripDataURL) {
  // Ukuran kertas: 2x6 inch dalam satuan mm
  const W_MM = 50.8   // 2 inch
  const H_MM = 152.4  // 6 inch

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit:        'mm',
    format:      [W_MM, H_MM],
  })

  pdf.addImage(
    stripDataURL,
    'PNG',
    0,        // x
    0,        // y
    W_MM,     // width
    H_MM,     // height
  )

  pdf.save(`photobooth-${Date.now()}.pdf`)
}
```

---

## 11. Environment Variables

Semua env variable harus prefix `VITE_` agar ter-expose ke client.

```bash
# .env.local (tidak di-commit ke git)

# Phase 2 — Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Phase 3 — PostgreSQL (Local)
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=photobooth
VITE_DB_USER=postgres
VITE_DB_PASSWORD=

# Phase 3 — Dashboard password
VITE_DASHBOARD_PASSWORD=
```

**Aturan env:**
- Jangan hardcode API key di kode.
- File `.env.local` tidak boleh di-commit (sudah ada di `.gitignore`).
- Akses via `import.meta.env.VITE_KEY_NAME` di kode React.

---

## 12. Error Handling Kamera

Selalu handle error spesifik, bukan catch semua:

```js
try {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
} catch (err) {
  if (err.name === 'NotAllowedError') {
    // User menolak permission → tampilkan panduan cara allow
  } else if (err.name === 'NotFoundError') {
    // Tidak ada kamera → tampilkan pesan + refresh button
  } else if (err.name === 'NotReadableError') {
    // Kamera sedang dipakai app lain → minta user tutup app lain
  } else {
    // Error tidak dikenal
    console.error('Camera error:', err)
  }
}
```

---

## 13. Yang Tidak Boleh Dilakukan

- **Jangan** gunakan `var` — gunakan `const` / `let`.
- **Jangan** gunakan `any` type jika suatu saat pakai TypeScript.
- **Jangan** fetch data langsung di dalam komponen — taruh di hook atau util.
- **Jangan** simpan stream kamera di Zustand — stream tidak serializable.
- **Jangan** gunakan `document.querySelector` di dalam React component — gunakan `ref`.
- **Jangan** install library baru tanpa cek apakah sudah ada yang bisa menggantikannya.
- **Jangan** push ke `main` langsung — selalu buat branch per fitur/task.
- **Jangan** commit file `.env.local` atau file berisi API key.
- **Jangan** hardcode string yang ditampilkan ke user — taruh di konstanta atau i18n nantinya.

---

## 14. Checklist Sebelum Commit

- [ ] Tidak ada `console.log` yang tertinggal (kecuali sengaja untuk debug)
- [ ] Stream kamera di-cleanup di `useEffect` return
- [ ] Semua error state ditampilkan ke user (bukan hanya di console)
- [ ] Komponen baru sudah responsive di 768px ke atas
- [ ] Tidak ada hardcoded API key atau credential
- [ ] Branch name sesuai format: `feature/TASK-XXX-nama-singkat`