import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { authApi } from "../lib/api";

vi.mock("../lib/api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Mock react-router-dom to prevent navigation issues in tests
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-to">{to}</div>
    ),
    useLocation: () => ({ pathname: "/" }),
    useNavigate: () => vi.fn(),
  };
});

const mockedAuthApi = vi.mocked(authApi);

// Custom wrapper for integration tests
const IntegrationTestWrapper = ({
  children,
  initialEntries = ["/"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe("Authentication Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("should render login form", async () => {
    render(
      <IntegrationTestWrapper initialEntries={["/login"]}>
        <Login />
      </IntegrationTestWrapper>
    );

    // Check that login form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("should call login API when form is submitted", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      email: "test@example.com",
      is_active: true,
      is_superuser: false,
      is_verified: true,
    };
    const mockAuthResponse = { access_token: "token123", token_type: "bearer" };

    mockedAuthApi.login.mockResolvedValue(mockAuthResponse);
    mockedAuthApi.getCurrentUser.mockResolvedValue(mockUser);

    render(
      <IntegrationTestWrapper initialEntries={["/login"]}>
        <Login />
      </IntegrationTestWrapper>
    );

    // Fill in login form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    // Verify API was called with correct credentials
    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should redirect unauthenticated users from protected routes", async () => {
    render(
      <IntegrationTestWrapper initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </IntegrationTestWrapper>
    );

    // Should redirect to login when not authenticated
    expect(screen.getByTestId("navigate-to")).toHaveTextContent("/login");
  });

  it("should handle dashboard logout", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: "1",
      email: "test@example.com",
      is_active: true,
      is_superuser: false,
      is_verified: true,
    };

    // Set up authenticated state
    localStorage.setItem("access_token", "valid-token");
    localStorage.setItem("user", JSON.stringify(mockUser));
    mockedAuthApi.getCurrentUser.mockResolvedValue(mockUser);
    mockedAuthApi.logout.mockResolvedValue();

    render(
      <IntegrationTestWrapper initialEntries={["/dashboard"]}>
        <Dashboard />
      </IntegrationTestWrapper>
    );

    // Check if logout button exists and click it
    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutButton);

    // Verify logout API was called
    await waitFor(() => {
      expect(mockedAuthApi.logout).toHaveBeenCalled();
    });
  });
});
