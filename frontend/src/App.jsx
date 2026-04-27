import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from './components/ToastContainer';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import RecommendPage from './pages/RecommendPage';
import ReviewsPage from './pages/ReviewsPage';
import StorePage from './pages/StorePage';
import StoreReviewsPage from './pages/StoreReviewsPage';
import FeedbackPage from './pages/FeedbackPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/add-store" element={<StorePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/store/:storeName" element={<StoreReviewsPage />} />
        </Routes>
        <ToastContainer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
