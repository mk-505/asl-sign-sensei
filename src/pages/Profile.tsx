import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { User, Save, Loader2 } from "lucide-react";
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
          // Create profile if it doesn't exist
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
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl mx-auto"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Profile Settings</h1>
            <p className="text-sm text-muted-foreground text-center">
              Update your personal information
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-gray-700">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="transition-all duration-200 hover:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white transition-colors duration-200"
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
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;