# Kafka Photobooth

A professional, full-featured photobooth application built with React, Express, and PostgreSQL. Perfect for events, weddings, parties, and corporate gatherings.

## Features

### Core Photobooth Features
- 📸 **Live Camera Preview** - Real-time camera feed with mirror mode
- ⏱️ **Countdown Timer** - Configurable countdown (3, 5, or 10 seconds)
- 🎨 **Multiple Templates** - 4 beautiful photo strip designs
- 🖼️ **Photo Strip Generation** - Professional 2×6 inch strips at 300 DPI
- 💾 **Multiple Export Options** - PNG, PDF, and direct printing

### Advanced Features
- 🖨️ **Print Support** - 3 print layouts (thermal, single, double)
- 📱 **QR Code Sharing** - Instant mobile download via QR code
- 📊 **Analytics Dashboard** - Real-time session tracking and statistics
- 🔒 **Password Protection** - Secure dashboard access
- 🌐 **Offline Support** - Queue API calls when offline
- 🖥️ **Kiosk Mode** - Fullscreen mode for event venues

### Dashboard & Analytics
- Total sessions and photos taken
- Download and QR scan rates
- Hourly session distribution charts
- Template usage breakdown
- Multi-event management
- Auto-refresh every 30 seconds

## Tech Stack

**Frontend:**
- React 18.3.1
- React Router 6.26.0
- Zustand (state management)
- Tailwind CSS
- Konva (canvas rendering)
- Recharts (analytics charts)

**Backend:**
- Node.js + Express
- PostgreSQL 16.x
- Cloudinary (image hosting)

**Libraries:**
- jsPDF (PDF generation)
- qrcode (QR code generation)
- react-konva (photo strip rendering)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16.x
- Cloudinary account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kafka-photobooth
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup PostgreSQL database**
```bash
# Create database
createdb photobooth

# Run schema
psql -U postgres -d photobooth -f server/schema.sql
```

4. **Configure environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
```

Required environment variables:
```env
# Backend
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=photobooth
DB_USER=postgres
DB_PASSWORD=your_password

# Frontend
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_DASHBOARD_PASSWORD=admin123
VITE_API_BASE_URL=http://localhost:3001
```

5. **Start the application**
```bash
# Development mode (runs both frontend and backend)
npm start

# Or run separately:
npm run dev        # Frontend only (port 3000)
npm run server:dev # Backend only (port 3001)
```

6. **Access the application**
- Photobooth: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard/login

## Project Structure

```
kafka-photobooth/
├── server/                 # Backend Express API
│   ├── index.js           # Server entry point
│   ├── db.js              # PostgreSQL connection
│   ├── routes/            # API routes
│   │   └── sessions.js    # Session endpoints
│   └── schema.sql         # Database schema
├── src/                   # Frontend React app
│   ├── components/        # Reusable components
│   │   ├── CameraSelector.jsx
│   │   ├── EventSettings.jsx
│   │   ├── PhotoStrip.jsx
│   │   ├── StatCard.jsx
│   │   ├── HourlySessionsChart.jsx
│   │   └── TemplateBreakdownChart.jsx
│   ├── pages/            # Page components
│   │   ├── SetupPage.jsx
│   │   ├── BoothPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── DownloadPage.jsx
│   │   ├── DashboardLogin.jsx
│   │   └── DashboardPage.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useCamera.js
│   │   ├── useCapture.js
│   │   └── useCanvas.js
│   ├── services/         # API services
│   │   └── api.js
│   ├── utils/            # Utility functions
│   │   ├── canvasHelper.js
│   │   ├── printHelper.js
│   │   ├── uploadHelper.js
│   │   ├── qrHelper.js
│   │   └── offlineHelper.js
│   ├── store/            # State management
│   │   └── eventStore.js
│   └── templates/        # Photo strip templates
│       └── index.js
└── .env.example          # Environment variables template
```

## Usage

### For Event Operators

1. **Setup** - Configure camera, event name, and template
2. **Start Session** - Launch photobooth mode
3. **Capture** - Automatic 4-photo sequence with countdown
4. **Export** - Download, print, or share via QR code
5. **Monitor** - View real-time statistics in dashboard

### For Guests

1. **Pose** - Follow countdown prompts
2. **Review** - See your photo strip
3. **Download** - Get PNG or PDF
4. **Share** - Scan QR code for mobile download

## Printing

The application supports three print layouts:

1. **Thermal (2×6")** - For dye-sub photobooth printers (DNP, Citizen, HiTi)
2. **Standard Single** - One strip centered on A4/Letter paper
3. **Standard Double** - Two strips side-by-side (perfect for cutting)

**Print Settings:**
- Paper size: 2×6 inches (50.8×152.4mm)
- Resolution: 300 DPI
- Format: PNG or PDF
- Margins: None (borderless)

## Dashboard

Access the analytics dashboard at `/dashboard/login`.

**Default password:** Set via `VITE_DASHBOARD_PASSWORD` in `.env`

**Features:**
- Real-time session statistics
- Hourly activity charts
- Template usage breakdown
- Multi-event filtering
- Offline data caching
- Auto-refresh every 30 seconds

## Kiosk Mode

For event venues, activate Kiosk Mode from the setup page:

1. Click "Activate Kiosk Mode"
2. Browser enters fullscreen
3. Press `Esc` three times to exit

## Offline Support

The application works offline with limited functionality:

- ✅ Camera capture works
- ✅ Local downloads work
- ✅ Print works
- ❌ QR sharing requires internet
- ❌ Dashboard requires internet (uses cache)

API calls are queued when offline and synced when connection returns.

## Development

```bash
# Run tests (if configured)
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend (Express)
```bash
# Set NODE_ENV=production
# Run: node server/index.js
# Or use PM2: pm2 start server/index.js
```

### Database
- Ensure PostgreSQL is accessible
- Run schema.sql on production database
- Configure connection via environment variables

## Troubleshooting

**Camera not detected:**
- Check browser permissions
- Ensure HTTPS (required for camera access)
- Try different browser

**Print not working:**
- Check printer connection
- Verify paper size settings
- Set margins to "None" in print dialog

**Dashboard not loading:**
- Verify backend server is running
- Check PostgreSQL connection
- Confirm environment variables

**QR sharing fails:**
- Verify Cloudinary credentials
- Check internet connection
- Ensure upload preset is unsigned

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [repository-url]/issues
- Documentation: See OPERATOR_GUIDE.md for detailed usage

## Credits

Built with ❤️ using React, Express, and PostgreSQL
