import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaSmile, FaFrown, FaMeh } from 'react-icons/fa';
import { analyzeApi } from '../utils/api';
import { toast } from '../components/ToastContainer';
import { LoadingShimmer } from '../components/LoadingShimmer';

const AnalyzePage = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.warning('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeApi.analyze(text);
      setResult(response);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (label) => {
    if (label === 'LABEL_1' || label === 'Positive') {
      return <FaSmile className="text-positive text-4xl" />;
    } else if (label === 'LABEL_0' || label === 'Negative') {
      return <FaFrown className="text-accent text-4xl" />;
    }
    return <FaMeh className="text-warning text-4xl" />;
  };

  const getSentimentLabel = (label) => {
    if (label === 'LABEL_1' || label === 'Positive') return 'Positive';
    if (label === 'LABEL_0' || label === 'Negative') return 'Negative';
    return 'Neutral';
  };

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-positive';
    if (score >= 0.4) return 'text-warning';
    return 'text-accent';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-block mb-4"
        >
          <FaChartLine className="text-trust text-5xl" />
        </motion.div>
        <h1 className="text-4xl font-bold text-deep mb-3">Sentiment Analysis</h1>
        <p className="text-gray-600 text-lg">Analyze the sentiment of any text</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here... e.g., 'The food was amazing and the service was excellent!'"
          className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust resize-none transition-colors"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 w-full bg-trust text-white py-3 px-6 rounded-xl font-semibold hover:bg-trust-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <LoadingShimmer />
        </div>
      )}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg p-8"
        >
          <div className="flex items-center gap-4 mb-6">
            {getSentimentIcon(result.label)}
            <div>
              <h3 className="text-2xl font-bold text-deep">
                {getSentimentLabel(result.label)}
              </h3>
              <p className="text-gray-600">Sentiment Result</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-l-4 border-trust">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Confidence Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-3 rounded-full ${
                    result.score >= 0.7 ? 'bg-positive' : result.score >= 0.4 ? 'bg-warning' : 'bg-accent'
                  }`}
                />
              </div>
            </div>

            {result.label && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500">Detected Label</p>
                <p className="text-lg font-semibold text-deep">{result.label}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyzePage;
