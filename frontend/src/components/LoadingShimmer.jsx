import { motion } from 'framer-motion';

export const LoadingShimmer = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded-md w-3/4" />
      <div className="h-4 bg-gray-200 rounded-md" />
      <div className="h-4 bg-gray-200 rounded-md w-5/6" />
    </div>
  );
};

export const CardShimmer = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded-md w-1/3" />
            <div className="h-4 bg-gray-200 rounded-md w-full" />
            <div className="h-4 bg-gray-200 rounded-md w-4/5" />
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const ButtonShimmer = () => {
  return (
    <div className="inline-block">
      <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  );
};
