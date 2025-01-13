import { motion } from "framer-motion";

const ProfileHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
        Profile Settings
      </h1>
      <p className="text-sm text-muted-foreground text-center mt-2">
        Customize your personal information
      </p>
    </motion.div>
  );
};

export default ProfileHeader;