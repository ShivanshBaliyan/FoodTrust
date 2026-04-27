# Frontend Folder Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Layout.jsx         # Main layout with navigation bar
│   │   ├── ToastContainer.jsx # Toast notification system with animations
│   │   └── LoadingShimmer.jsx # Loading skeleton components
│   ├── pages/                  # Page-level components
│   │   ├── HomePage.jsx       # Landing page with feature cards
│   │   ├── AnalyzePage.jsx    # Sentiment analysis interface
│   │   ├── RecommendPage.jsx  # Restaurant recommendation page
│   │   ├── ReviewsPage.jsx    # Browse all reviews page
│   │   └── StorePage.jsx      # Add new store page
│   ├── utils/                  # Utility functions and helpers
│   │   ├── api.js             # API endpoint definitions
│   │   └── apiClient.js       # Axios instance with interceptors
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx               # Application entry point
│   ├── App.css                # App-specific styles
│   └── index.css              # Global styles & Tailwind imports
├── index.html                  # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── .gitignore                 # Git ignore rules
├── .env.example               # Environment variables template
└── README.md                  # Project documentation
```

## Component Hierarchy

```
App
├── Layout (Navigation)
│   └── ToastContainer
├── Routes
│   ├── HomePage
│   ├── AnalyzePage
│   ├── RecommendPage
│   ├── ReviewsPage
│   └── StorePage
```

## API Integration

All API calls go through:
1. `utils/apiClient.js` - Axios instance with interceptors
2. `utils/api.js` - Endpoint definitions organized by feature

This keeps API logic clean, testable, and maintainable.

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom colors** in `tailwind.config.js` following the food/trust theme
- **Framer Motion** for smooth animations
- **Responsive** design with mobile-first approach
