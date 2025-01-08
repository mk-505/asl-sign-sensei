import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">ASL Learn</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/")
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/learn"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/learn")
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Learn
            </Link>
            <Link
              to="/practice"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive("/practice")
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Practice
            </Link>
            
            {user ? (
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/login")
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive("/signup")
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;