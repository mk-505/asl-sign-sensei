import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileLastUpdated from "@/components/profile/ProfileLastUpdated";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container max-w-2xl mx-auto">
        <Card className="shadow-xl backdrop-blur-sm bg-white/90 border-t border-l border-white/20">
          <CardHeader>
            <ProfileAvatar />
            <ProfileHeader />
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
          <CardFooter>
            <ProfileLastUpdated />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;