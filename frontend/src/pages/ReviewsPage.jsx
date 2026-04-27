import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaComments, FaFilter, FaChevronDown, FaStore } from 'react-icons/fa';
import { reviewsApi } from '../utils/api';
import { toast } from '../components/ToastContainer';
import { CardShimmer } from '../components/LoadingShimmer';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await reviewsApi.getAll();
      setReviews(response || []);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    const label = review.label || review.sentiment;
    const normalizedLabel = label?.toLowerCase();
    if (filter === 'positive') return normalizedLabel === 'positive' || normalizedLabel === 'label_1' || review.score > 0.7;
    if (filter === 'negative') return normalizedLabel === 'negative' || normalizedLabel === 'label_0' || review.score < 0.3;
    return true;
  });

  const getSentimentLabel = (review) => {
    const label = review.label || review.sentiment;
    if (label) {
      const normalizedLabel = label.toLowerCase();
      if (normalizedLabel === 'positive' || normalizedLabel === 'label_1') return 'Positive';
      if (normalizedLabel === 'negative' || normalizedLabel === 'label_0') return 'Negative';
      return label;
    }
    if (review.score > 0.7) return 'Positive';
    if (review.score < 0.3) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (sentiment) => {
    const normalized = sentiment?.toLowerCase();
    if (normalized === 'positive') return 'bg-positive text-white';
    if (normalized === 'negative') return 'bg-accent text-white';
    return 'bg-gray-400 text-white';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-block mb-4"
        >
          <FaComments className="text-trust text-5xl" />
        </motion.div>
        <h1 className="text-4xl font-bold text-deep mb-3">All Reviews</h1>
        <p className="text-gray-600 text-lg">Browse through all customer reviews</p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-trust transition-colors"
          >
            <FaFilter className="text-trust" />
            <span className="font-medium text-deep">Filter: {filter}</span>
            <FaChevronDown className={`text-trust transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-48 z-10">
              {['all', 'positive', 'negative'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-cream transition-colors ${
                    filter === f ? 'bg-cream font-semibold text-trust' : 'text-deep'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-gray-600">{filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <CardShimmer count={5} />
      ) : (
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-xl text-gray-500">No reviews found</p>
            </div>
          ) : (
            filteredReviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-trust"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg mb-2">{review.text || review.review}</p>
                    {review.store && (
                      <button
                        onClick={() => navigate(`/store/${encodeURIComponent(review.store)}`)}
                        className="flex items-center gap-2 text-trust font-semibold hover:text-trust-light transition-colors"
                      >
                        <FaStore />
                        {review.store}
                      </button>
                    )}
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getSentimentColor(getSentimentLabel(review))}`}>
                    {getSentimentLabel(review)}
                  </span>
                </div>
                {review.score && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-lg font-bold text-deep">{(review.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${review.score * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-2 rounded-full ${review.score > 0.7 ? 'bg-positive' : 'bg-accent'}`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ReviewsPage;
