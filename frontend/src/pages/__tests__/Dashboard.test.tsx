import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import Dashboard from "../Dashboard";
import * as useAuthHook from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

describe("Dashboard", () => {
  const mockLogout = vi.fn();
  const mockUser = {
    id: "123",
    email: "test@example.com",
    is_active: true,
    is_superuser: false,
    is_verified: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: mockUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
    });
  });

  it("should render dashboard with user information", () => {
    render(<Dashboard />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText(`Welcome, ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.getByText("Welcome to your Dashboard!")).toBeInTheDocument();
    expect(
      screen.getByText(`You are successfully logged in as ${mockUser.email}`)
    ).toBeInTheDocument();

    // Check user information section
    expect(screen.getByText("User Information")).toBeInTheDocument();
    expect(screen.getByText(mockUser.id)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();

    // Check specific status fields
    expect(screen.getByText("Active:")).toBeInTheDocument();
    expect(screen.getByText("Verified:")).toBeInTheDocument();
    expect(screen.getByText("Superuser:")).toBeInTheDocument();

    // Should show "Yes" for active and verified, "No" for superuser
    const yesTexts = screen.getAllByText("Yes");
    const noTexts = screen.getAllByText("No");
    expect(yesTexts).toHaveLength(2); // Active and Verified
    expect(noTexts).toHaveLength(1); // Superuser
  });

  it("should call logout function when logout button is clicked", async () => {
    const user = userEvent.setup();
    mockLogout.mockResolvedValue(undefined);

    render(<Dashboard />);

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle superuser correctly", () => {
    const superUser = { ...mockUser, is_superuser: true };
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: superUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
    });

    render(<Dashboard />);

    // Should show two instances of "Yes" (for is_active and is_verified) and one for is_superuser
    const yesTexts = screen.getAllByText("Yes");
    expect(yesTexts).toHaveLength(3);
  });

  it("should handle inactive/unverified user correctly", () => {
    const inactiveUser = { ...mockUser, is_active: false, is_verified: false };
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: inactiveUser,
      login: vi.fn(),
      register: vi.fn(),
      logout: mockLogout,
    });

    render(<Dashboard />);

    // Should show three instances of "No" (for is_active, is_verified, and is_superuser)
    const noTexts = screen.getAllByText("No");
    expect(noTexts).toHaveLength(3);
  });
});
