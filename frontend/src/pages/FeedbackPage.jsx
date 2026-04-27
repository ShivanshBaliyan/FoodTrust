import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaComment, FaStore, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { feedbackApi } from '../utils/api';
import { toast } from '../components/ToastContainer';

const FeedbackPage = () => {
  const [storeName, setStoreName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!storeName.trim()) {
      toast.warning('Please enter a store name');
      return;
    }
    
    if (!feedback.trim()) {
      toast.warning('Please enter your feedback');
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackApi.submit({
        store_name: storeName,
        text: feedback,
      });
      
      setResult(response);
      setSubmitted(true);
      toast.success('Feedback submitted successfully!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setStoreName('');
        setFeedback('');
        setSubmitted(false);
        setResult(null);
      }, 3000);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (label) => {
    const normalizedLabel = label?.toLowerCase();
    if (normalizedLabel === 'positive' || normalizedLabel === 'label_1') {
      return 'bg-positive text-white';
    } else if (normalizedLabel === 'negative' || normalizedLabel === 'label_0') {
      return 'bg-accent text-white';
    }
    return 'bg-gray-400 text-white';
  };

  const getSentimentLabel = (label) => {
    const normalizedLabel = label?.toLowerCase();
    if (normalizedLabel === 'positive' || normalizedLabel === 'label_1') {
      return 'Positive';
    } else if (normalizedLabel === 'negative' || normalizedLabel === 'label_0') {
      return 'Negative';
    }
    return 'Neutral';
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
          <FaComment className="text-trust text-5xl" />
        </motion.div>
        <h1 className="text-4xl font-bold text-deep mb-3">Submit Feedback</h1>
        <p className="text-gray-600 text-lg">Share your experience and help us improve</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-deep font-semibold mb-2">
            <FaStore className="inline mr-2 text-trust" />
            Store Name *
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="e.g., Bistro 21"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-deep font-semibold mb-2">
            <FaComment className="inline mr-2 text-trust" />
            Your Feedback *
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your thoughts about the food, service, ambiance..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust resize-none transition-colors"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Your feedback will be analyzed for sentiment automatically
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || submitted}
          className="w-full bg-trust text-white py-4 px-6 rounded-xl font-semibold hover:bg-trust-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            'Submitting...'
          ) : submitted ? (
            <>
              <FaCheckCircle />
              Submitted!
            </>
          ) : (
            <>
              <FaPaperPlane />
              Submit Feedback
            </>
          )}
        </button>
      </form>

      {submitted && result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 bg-gradient-to-br from-cream to-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-6">
            <FaCheckCircle className="text-positive text-5xl mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-deep">Thank You!</h3>
            <p className="text-gray-600">Your feedback has been analyzed</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 border-2 border-trust">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">Sentiment Detected</span>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getSentimentColor(result.label)}`}>
                  {getSentimentLabel(result.label)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.score * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-3 rounded-full ${result.score > 0.7 ? 'bg-positive' : 'bg-accent'}`}
                />
              </div>
              <p className="text-center text-lg font-bold text-deep mt-2">
                {(result.score * 100).toFixed(1)}% Confidence
              </p>
            </div>

            {result.status === 'ok' && (
              <div className="bg-positive/10 border border-positive rounded-xl p-4 text-center">
                <p className="text-positive font-semibold">
                  ✓ Your feedback has been saved and will help improve the store's rating
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-cream rounded-2xl p-6 border-l-4 border-trust"
      >
        <h3 className="font-semibold text-deep mb-2">💡 Tips for great feedback</h3>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>• Be specific about what you liked or disliked</li>
          <li>• Mention food quality, service, cleanliness, or ambiance</li>
          <li>• Your honest opinion helps other customers make better decisions</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackPage;
