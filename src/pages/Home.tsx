import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold sm:text-6xl mb-6">
              Learn ASL, One Sign at a Time
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Master American Sign Language through interactive lessons and real-time practice.
              Start your journey to fluent signing today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/learn"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 hover-lift"
            >
              Start Learning
            </Link>
            <Link
              to="/practice"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover-lift"
            >
              Practice Now
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16"
        >
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Interactive Learning</h3>
            <p className="text-gray-600">
              Learn ASL through our comprehensive visual guides and interactive lessons.
            </p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Real-time Practice</h3>
            <p className="text-gray-600">
              Practice your signs with instant feedback using our advanced recognition system.
            </p>
          </div>
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking and achievements.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;