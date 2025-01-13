import { User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const ProfileAvatar = () => {
  return (
    <motion.div 
      className="flex items-center justify-center mb-4"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center shadow-inner">
        <Avatar className="w-20 h-20 border-4 border-white">
          <AvatarFallback className="bg-gradient-to-br from-purple-50 to-blue-50">
            <User className="w-10 h-10 text-gray-600" />
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.div>
  );
};

export default ProfileAvatar;