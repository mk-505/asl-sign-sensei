import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { User, Save, Loader2, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    db: {
      schema: 'public'
    }
  }
);

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          if (error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([{ 
                id: user.id, 
                full_name: '',
                updated_at: new Date().toISOString()
              }]);
            
            if (insertError) {
              console.error("Error creating profile:", insertError);
              toast.error("Error creating profile");
            }
          }
          return;
        }

        console.log("Profile data:", data);
        if (data) {
          setFullName(data.full_name || "");
        }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
      }
    };

    fetchProfile();
  }, [user, navigate]);

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
        console.error("Error updating profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
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

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl mx-auto"
      >
        <Card className="shadow-xl backdrop-blur-sm bg-white/90 border-t border-l border-white/20">
          <CardHeader className="space-y-1">
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center shadow-inner">
                <User className="w-12 h-12 text-gray-600" />
              </div>
            </motion.div>
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
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="space-y-6"
              >
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
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
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;