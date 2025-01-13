import { Calendar } from "lucide-react";

const ProfileLastUpdated = () => {
  return (
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
      <Calendar className="h-4 w-4" />
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default ProfileLastUpdated;