# FoodTrust Frontend

Modern, beautiful frontend for FoodTrust - Food Sentiment Analytics Platform.

## Features

- ✨ Modern UI with Tailwind CSS
- 🎨 Food-inspired color palette
- 🚀 Fast performance with Vite
- 🎬 Smooth animations with Framer Motion
- 🔔 Toast notifications
- 💫 Loading states with shimmer effects
- 📱 Fully responsive
- 🏪 Store-specific review pages

## Tech Stack

- React 18
- Vite
- Tailwind CSS 4
- Framer Motion
- React Router
- Axios
- React Icons

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:8000
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with navigation
│   ├── ToastContainer.jsx  # Toast notification system
│   └── LoadingShimmer.jsx  # Loading animations
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── AnalyzePage.jsx
│   ├── RecommendPage.jsx
│   ├── ReviewsPage.jsx
│   ├── StorePage.jsx
│   └── StoreReviewsPage.jsx  # Store-specific reviews
├── utils/              # Utility functions
│   ├── api.js          # API endpoint definitions
│   └── apiClient.js    # Axios configuration
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## Color Palette

- **Trust Blue**: `#26408B` - Primary actions, trust elements
- **Soft Cream**: `#F2F5EA` - Background, soft accents
- **Terracotta**: `#E85A3F` - CTAs, emphasis
- **Sage Green**: `#6BD425` - Positive, success states
- **Mustard**: `#FFEC51` - Warnings, attention
- **Deep Purple**: `#2B061E`, `#0D0221` - Dark text, headings
