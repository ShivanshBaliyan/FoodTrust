import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaStore, FaTags, FaStar } from 'react-icons/fa';
import { recommendApi } from '../utils/api';
import { toast } from '../components/ToastContainer';
import { CardShimmer } from '../components/LoadingShimmer';

const RecommendPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.warning('Please enter what you\'re looking for');
      return;
    }

    setLoading(true);
    try {
      const response = await recommendApi.recommend(query, limit);
      setResults(response.results || []);
      if (response.results?.length === 0) {
        toast.info('No recommendations found. Try a different query.');
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      // Error is already handled by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-positive';
    if (score >= 0.6) return 'text-trust';
    return 'text-warning';
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
          <FaSearch className="text-trust text-5xl" />
        </motion.div>
        <h1 className="text-4xl font-bold text-deep mb-3">Find Your Perfect Match</h1>
        <p className="text-gray-600 text-lg">Get personalized restaurant recommendations</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g., 'I want something light, fresh, and affordable for lunch'"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-trust text-white px-8 py-3 rounded-xl font-semibold hover:bg-trust-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Search
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-deep font-medium">Number of recommendations:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-trust transition-colors"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>

      {loading && <CardShimmer count={3} />}

      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {results.map((restaurant, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FaStore className="text-trust text-2xl" />
                    <h3 className="text-2xl font-bold text-deep">{restaurant.name}</h3>
                  </div>
                  <p className="text-gray-600 ml-8">{restaurant.description}</p>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(restaurant.score)}`}>
                  {(restaurant.score * 100).toFixed(0)}%
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                {restaurant.tags?.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className="bg-cream text-trust px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-cream rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaStar className="text-warning" />
                    <span>Sentiment Score</span>
                  </div>
                  <p className="text-lg font-bold text-deep">
                    {(restaurant.sentiment_score * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-cream rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FaSearch className="text-trust" />
                    <span>Match Score</span>
                  </div>
                  <p className="text-lg font-bold text-deep">
                    {(restaurant.similarity * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && results.length === 0 && !query && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">Enter a query to get started</p>
        </div>
      )}
    </motion.div>
  );
};

export default RecommendPage;