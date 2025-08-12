import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import Home from "../Home";
import * as useAuthHook from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state when auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show welcome back message for authenticated users", () => {
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

    render(<Home />);

    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
    expect(screen.getByText("You are already logged in.")).toBeInTheDocument();
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
  });

  it("should show welcome message with auth options for unauthenticated users", () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<Home />);

    expect(screen.getByText("Welcome to Your App")).toBeInTheDocument();
    expect(screen.getByText(/start your journey/i)).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });
});
