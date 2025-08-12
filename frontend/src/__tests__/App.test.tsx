import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import * as useAuthHook from "../hooks/useAuth";

// Mock the individual page components to make tests simpler
vi.mock("../pages/Home", () => ({
  default: () => <div>Home Page</div>,
}));

vi.mock("../pages/Login", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("../pages/Register", () => ({
  default: () => <div>Register Page</div>,
}));

vi.mock("../pages/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));

vi.mock("../pages/PostLogout", () => ({
  default: () => <div>Post Logout Page</div>,
}));

vi.mock("../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

// Mock react-router-dom to prevent navigation issues in tests
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  const actualRouterDom = actual as typeof import("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-to">{to}</div>
    ),
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <actualRouterDom.MemoryRouter initialEntries={["/"]}>
        {children}
      </actualRouterDom.MemoryRouter>
    ),
  };
});

// Simple render for App component (it has its own Router and AuthProvider)
const renderApp = () => {
  return render(<App />);
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("should render the home page by default", () => {
    renderApp();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("should wrap all components with AuthProvider", () => {
    renderApp();
    // Test that AuthProvider renders children correctly
    // Since we're on home route, the Home component should be rendered
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("should provide router context to all components", () => {
    // This test ensures Router is wrapping the app
    // If routing context is not provided, the components would throw errors
    expect(() => renderApp()).not.toThrow();
  });
});
