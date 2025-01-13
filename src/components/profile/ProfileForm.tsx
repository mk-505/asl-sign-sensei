import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { Mail, Save, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ProfileForm = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      console.log("Updating profile for user:", user.id);
      
      const { error } = await supabase
        .from('profiles')
        .upsert([{ 
          id: user.id, 
          full_name: fullName,
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
      
      console.log("Profile updated successfully");
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleUpdateProfile} 
      className="space-y-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="space-y-6">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={user?.email}
              disabled
              className="pl-10 bg-gray-50/80 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="relative">
          <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-gray-700">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-500 transition-colors" />
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="pl-10 transition-all duration-200 hover:border-gray-400 focus:ring-2 focus:ring-purple-100 focus:border-purple-200"
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Update Profile
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default ProfileForm;