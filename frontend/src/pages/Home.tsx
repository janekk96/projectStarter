import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";

const Home = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-gray-600 mb-6">You are already logged in.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your App
          </h1>
          <p className="text-gray-600 mb-8">
            Start your journey by creating an account or signing in to an
            existing one.
          </p>
          <div className="space-y-4">
            <Link to="/login" className="block">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link to="/register" className="block">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
