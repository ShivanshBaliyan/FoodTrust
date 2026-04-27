import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaSearch, FaComments, FaStore, FaPaperPlane, FaArrowRight } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: FaChartLine,
      title: 'Sentiment Analysis',
      description: 'Analyze customer reviews and feedback with AI-powered sentiment detection',
      link: '/analyze',
      color: 'bg-trust',
    },
    {
      icon: FaSearch,
      title: 'Smart Recommendations',
      description: 'Get personalized restaurant recommendations based on your preferences',
      link: '/recommend',
      color: 'bg-accent',
    },
    {
      icon: FaComments,
      title: 'Review Explorer',
      description: 'Browse and filter through all customer reviews in one place',
      link: '/reviews',
      color: 'bg-positive',
    },
    {
      icon: FaPaperPlane,
      title: 'Submit Feedback',
      description: 'Share your dining experience and help improve restaurant ratings',
      link: '/feedback',
      color: 'bg-warning',
    },
    {
      icon: FaStore,
      title: 'Store Management',
      description: 'Add and manage your restaurant listings in our database',
      link: '/add-store',
      color: 'bg-trust',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-6xl font-bold text-deep mb-6"
        >
          Welcome to{' '}
          <span className="bg-linear-to-r from-trust to-trust-light bg-clip-text">
            FoodTrust
          </span>
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent food sentiment analytics platform. Discover trends, analyze feedback, and make data-driven decisions.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-2 gap-8 mb-12"
      >
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Link
                to={feature.link}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 h-full border-2 border-transparent hover:border-trust"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-deep mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="flex items-center text-trust font-semibold group-hover:gap-3 transition-all">
                  Explore
                  <FaArrowRight className="ml-2" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-linear-to-br from-trust to-trust-light rounded-3xl p-12 text-blue-900"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start analyzing sentiments or get recommendations for your perfect dining experience
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/analyze"
              className="bg-white text-trust px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Analyze Now
            </Link>
            <Link
              to="/recommend"
              className="bg-white text-trust px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
            >
              Get Recommendations
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
