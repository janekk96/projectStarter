import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to your Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                You are successfully logged in as {user?.email}
              </p>
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  User Information
                </h3>
                <div className="text-left space-y-2">
                  <p>
                    <strong>ID:</strong> {user?.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Active:</strong> {user?.is_active ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {user?.is_verified ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Superuser:</strong>{" "}
                    {user?.is_superuser ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
