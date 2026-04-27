import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaPlus, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { storeApi, feedbackApi } from '../utils/api';
import { toast } from '../components/ToastContainer';

const StorePage = () => {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) {
      toast.warning('Store name is required');
      return;
    }

    setLoading(true);
    try {
      await storeApi.addStore({
        name: storeName,
        description,
        tags: tags.split(',').map(t => t.trim()).join(','),
      });
      toast.success('Store added successfully!');
      setStoreName('');
      setDescription('');
      setTags('');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
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
          <FaStore className="text-trust text-5xl" />
        </motion.div>
        <h1 className="text-4xl font-bold text-deep mb-3">Add New Store</h1>
        <p className="text-gray-600 text-lg">Register your restaurant in our database</p>
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
            <FaMapMarkerAlt className="inline mr-2 text-trust" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dine-in casual meals and weekend specials"
            className="w-full h-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust resize-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-deep font-semibold mb-2">
            <FaTag className="inline mr-2 text-trust" />
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., casual, breakfast, lunch"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-trust transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-trust text-white py-4 px-6 rounded-xl font-semibold hover:bg-trust-light transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
        >
          <FaPlus className="text-xl" />
          {loading ? 'Adding Store...' : 'Add Store'}
        </button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-cream rounded-2xl p-6 border-l-4 border-trust"
      >
        <h3 className="font-semibold text-deep mb-2">💡 Tips</h3>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>• Be specific with your description</li>
          <li>• Use relevant tags to help users find your store</li>
          <li>• Make sure the name is unique and recognizable</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default StorePage;
