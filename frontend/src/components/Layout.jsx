import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaChartLine, FaSearch, FaComments, FaStore, FaPaperPlane } from 'react-icons/fa';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/analyze', icon: FaChartLine, label: 'Analyze' },
    { path: '/recommend', icon: FaSearch, label: 'Recommend' },
    { path: '/reviews', icon: FaComments, label: 'Reviews' },
    { path: '/feedback', icon: FaPaperPlane, label: 'Feedback' },
    { path: '/add-store', icon: FaStore, label: 'Add Store' },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <nav className="bg-white shadow-md border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-linear-to-br from-trust to-trust-light rounded-xl flex items-center justify-center"
              >
                <span className="text-black font-bold text-5xl">V</span>
              </motion.div>
              <span className="text-2xl font-bold text-deep">FoodTrust</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'text-trust bg-cream'
                        : 'text-gray-600 hover:text-trust hover:bg-gray-50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-cream border-2 border-trust rounded-lg"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="text-lg" />
                      <span className="hidden md:inline">{item.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
