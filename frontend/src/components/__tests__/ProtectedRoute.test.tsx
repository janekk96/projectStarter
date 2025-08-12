import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";
import * as useAuthHook from "../../hooks/useAuth";

// Mock useAuth hook
vi.mock("../../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

// Mock react-router-dom hooks
vi.mock("react-router-dom", () => ({
  Navigate: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="navigate-component">{children}</div>
  ),
  useLocation: () => ({ pathname: "/dashboard", state: null }),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading when auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when authenticated", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: "1",
        email: "test@example.com",
        is_active: true,
        is_superuser: false,
        is_verified: true,
      },
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should show navigate component when not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Should render Navigate component and not show protected content
    expect(screen.getByTestId("navigate-component")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
