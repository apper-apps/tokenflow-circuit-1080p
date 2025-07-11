import { motion } from "framer-motion";

const Loading = ({ variant = "default", className = "" }) => {
  const variants = {
    default: (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="shimmer h-8 w-48 rounded-lg"></div>
          <div className="shimmer h-10 w-32 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-xl p-6 border border-surface-700">
              <div className="shimmer h-6 w-24 rounded mb-4"></div>
              <div className="shimmer h-16 w-full rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="shimmer h-4 w-full rounded"></div>
                <div className="shimmer h-4 w-3/4 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    cards: (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-800 rounded-xl p-6 border border-surface-700">
            <div className="shimmer h-6 w-24 rounded mb-4"></div>
            <div className="shimmer h-16 w-full rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="shimmer h-4 w-full rounded"></div>
              <div className="shimmer h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    table: (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-surface-800 rounded-xl border border-surface-700">
          <div className="p-4 border-b border-surface-700">
            <div className="shimmer h-6 w-32 rounded"></div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="shimmer h-5 w-48 rounded"></div>
                <div className="shimmer h-5 w-24 rounded"></div>
                <div className="shimmer h-5 w-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    dashboard: (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-xl p-6 border border-surface-700">
              <div className="shimmer h-4 w-24 rounded mb-2"></div>
              <div className="shimmer h-8 w-32 rounded mb-4"></div>
              <div className="shimmer h-2 w-16 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-800 rounded-xl p-6 border border-surface-700">
            <div className="shimmer h-6 w-32 rounded mb-4"></div>
            <div className="shimmer h-64 w-full rounded-lg"></div>
          </div>
          <div className="bg-surface-800 rounded-xl p-6 border border-surface-700">
            <div className="shimmer h-6 w-32 rounded mb-4"></div>
            <div className="shimmer h-64 w-full rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {variants[variant] || variants.default}
    </motion.div>
  );
};

export default Loading;