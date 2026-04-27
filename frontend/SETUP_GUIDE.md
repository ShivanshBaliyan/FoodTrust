# FoodTrust Frontend - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:8000
```

This sets up the proxy to your backend API.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Features Implemented

✅ **Sentiment Analysis** (`/analyze`) - Analyze text sentiment
✅ **Smart Recommendations** (`/recommend`) - Get restaurant recommendations based on queries
✅ **Review Browser** (`/reviews`) - Browse and filter all reviews
✅ **Store Management** (`/add-store`) - Add new restaurants
✅ **Toast Notifications** - Success/error alerts with animations
✅ **Loading States** - Shimmer effects during data fetching
✅ **Smooth Animations** - Framer Motion transitions
✅ **Responsive Design** - Works on all screen sizes

## API Endpoints

The frontend is configured to call these endpoints:

- `POST /api/analyze` - Analyze sentiment
- `POST /api/recommend` - Get recommendations
- `GET /api/reviews` - Get all reviews
- `GET /api/store_reviews/{store}` - Get store-specific reviews
- `POST /api/add_store` - Add a new store
- `POST /api/feedback` - Submit feedback

## Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```js
colors: {
  trust: '#26408B',      // Primary blue
  cream: '#F2F5EA',      // Background
  accent: '#E85A3F',     // CTA red-orange
  positive: '#6BD425',   // Success green
  warning: '#FFEC51',    // Warning yellow
}
```

### Animations

Modify animation durations in `tailwind.config.js`:

```js
animation: {
  'fade-in': 'fadeIn 0.4s ease-in-out',
  'slide-up': 'slideUp 0.5s ease-out',
}
```

## Troubleshooting

### Port Already in Use

Change the port in `vite.config.js`:

```js
server: {
  port: 3001, // Change to any available port
}
```

### API Not Connecting

1. Make sure your backend is running on port 8000
2. Check the proxy configuration in `vite.config.js`
3. Verify the `VITE_API_URL` in your `.env` file

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (super fast)
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icons

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Shared components
│   ├── pages/            # Page components
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app
│   └── main.jsx          # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

All components are self-contained and easy to modify!
