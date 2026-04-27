import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStore, FaArrowLeft, FaStar, FaComments, FaFilter } from 'react-icons/fa';
import { storeApi } from '../utils/api';
import { toast } from '../components/ToastContainer';
import { CardShimmer } from '../components/LoadingShimmer';

const StoreReviewsPage = () => {
  const { storeName } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchStoreReviews();
  }, [storeName]);

  const fetchStoreReviews = async () => {
    if (!storeName) return;
    
    setLoading(true);
    try {
      const response = await storeApi.getReviews(storeName);
      setReviews(response || []);
      if (!response || response.length === 0) {
        toast.info(`No reviews found for ${storeName}`);
      }
    } catch (error) {
      toast.error(`Failed to load reviews for ${storeName}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'all') return true;
    if (filter === 'positive') return review.sentiment === 'positive' || review.score > 0.7;
    if (filter === 'negative') return review.sentiment === 'negative' || review.score < 0.3;
    return true;
  });

  const getSentimentLabel = (review) => {
    if (review.sentiment) return review.sentiment;
    if (review.score > 0.7) return 'Positive';
    if (review.score < 0.3) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'bg-positive text-white';
    if (sentiment === 'Negative') return 'bg-accent text-white';
    return 'bg-gray-400 text-white';
  };

  const getAvgSentiment = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.score || 0), 0);
    return sum / reviews.length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/reviews')}
          className="flex items-center gap-2 text-trust hover:text-trust-light mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span className="font-medium">Back to All Reviews</span>
        </button>
        
        <div className="flex items-center gap-4 mb-2">
          <FaStore className="text-trust text-4xl" />
          <div>
            <h1 className="text-4xl font-bold text-deep">{storeName}</h1>
            <p className="text-gray-600">Store Reviews & Sentiment</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && reviews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-trust to-trust-light rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaComments className="text-2xl" />
              <h3 className="text-lg font-semibold">Total Reviews</h3>
            </div>
            <p className="text-4xl font-bold">{reviews.length}</p>
          </div>

          <div className="bg-gradient-to-br from-positive to-positive-light rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaStar className="text-2xl" />
              <h3 className="text-lg font-semibold">Avg Sentiment</h3>
            </div>
            <p className="text-4xl font-bold">{(getAvgSentiment() * 100).toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-accent to-accent-light rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FaFilter className="text-2xl" />
              <h3 className="text-lg font-semibold">Positive Rate</h3>
            </div>
            <p className="text-4xl font-bold">
              {filteredReviews.length > 0 
                ? ((filteredReviews.filter(r => (r.sentiment === 'positive' || r.score > 0.7)).length / reviews.length) * 100).toFixed(0)
                : 0}%
            </p>
          </div>
        </motion.div>
      )}

      {/* Filter */}
      <div className="mb-8 flex justify-between items-center">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-xl hover:border-trust transition-colors"
          >
            <FaFilter className="text-trust" />
            <span className="font-medium text-deep">Filter: {filter}</span>
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
        <p className="text-gray-600">
          {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Reviews List */}
      {loading ? (
        <CardShimmer count={3} />
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">
            {reviews.length === 0 
              ? `No reviews found for ${storeName}` 
              : 'No reviews match the selected filter'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReviews.map((review, idx) => (
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
                  {review.date && (
                    <p className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getSentimentColor(getSentimentLabel(review))}`}>
                  {getSentimentLabel(review)}
                </span>
              </div>
              
              {review.score && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <FaStar className="text-warning" />
                      Confidence Score
                    </span>
                    <span className="text-lg font-bold text-deep">
                      {(review.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${review.score * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-3 rounded-full ${review.score > 0.7 ? 'bg-positive' : 'bg-accent'}`}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StoreReviewsPage;
