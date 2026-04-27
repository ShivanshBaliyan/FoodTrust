# Store-Specific Reviews Feature

## Overview

Added a new page to view reviews for a specific store, accessible via the route `/store/:storeName`.

## Implementation

### 1. New Page Component
**File:** `frontend/src/pages/StoreReviewsPage.jsx`

A dedicated page showing:
- Store name in the header
- Back button to return to all reviews
- Statistics cards:
  - Total Reviews
  - Average Sentiment Score
  - Positive Rate
- Filter options (All, Positive, Negative)
- Individual review cards with:
  - Review text
  - Date
  - Sentiment label (badge)
  - Confidence score with animated progress bar

### 2. Navigation
**File:** `frontend/src/pages/ReviewsPage.jsx`

Updated the Reviews page to include clickable store names that navigate to the store-specific page:
```jsx
<button onClick={() => navigate(`/store/${encodeURIComponent(review.store)}`)}>
  <FaStore />
  {review.store}
</button>
```

### 3. Routing
**File:** `frontend/src/App.jsx`

Added the new route:
```jsx
<Route path="/store/:storeName" element={<StoreReviewsPage />} />
```

### 4. API Integration
**File:** `frontend/src/utils/api.js`

Already implemented:
```js
getReviews: async (storeName) => {
  return apiClient.get(`/store_reviews/${storeName}`);
}
```

## API Endpoint

The page calls: `GET /api/store_reviews/{storeName}`

### Expected Response Format
```json
[
  {
    "text": "Review text",
    "score": 0.98,
    "sentiment": "positive",
    "date": "2024-01-15"
  }
]
```

## User Flow

1. User visits `/reviews` to see all reviews
2. User clicks on a store name in any review
3. User is navigated to `/store/{storeName}`
4. Page displays:
   - Store statistics
   - All reviews for that store
   - Filter options for positive/negative reviews
5. User can click "Back to All Reviews" to return

## Features

✅ **Dynamic URL** - Uses URL parameters to fetch store-specific data
✅ **Stats Dashboard** - Shows key metrics at a glance
✅ **Filtering** - Filter by sentiment (all/positive/negative)
✅ **Loading States** - Shimmer effects while fetching
✅ **Error Handling** - Toast notifications for errors
✅ **Animations** - Smooth transitions and progress bars
✅ **Responsive** - Works on all screen sizes
✅ **Navigation** - Back button to return to all reviews

## Color Scheme

Uses the same food/trust-inspired palette:
- **Trust Blue** for primary elements
- **Positive Green** for success states
- **Terracotta** for negative sentiments
- **Mustard Yellow** for warnings
- **Soft Cream** for backgrounds

## Usage

Access the page via:
- Clicking a store name in the Reviews page
- Direct URL: `http://localhost:3000/store/Store%20Name`
- Store names are URL-encoded automatically

## Example

If you have a store named "Bistro 21", the URL would be:
`http://localhost:3000/store/Bistro%2021`

The page will fetch all reviews for that store and display them with analytics.
