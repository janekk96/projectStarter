import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const PostLogout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            You've been logged out
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for using our application. You have been successfully
            logged out.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Logout Successful
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your session has been terminated securely.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/login" className="block">
              <Button className="w-full">Sign In Again</Button>
            </Link>

            <Link to="/register" className="block">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            For security reasons, please close your browser if you're on a
            shared computer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostLogout;
