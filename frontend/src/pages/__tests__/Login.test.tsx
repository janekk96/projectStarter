import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import * as useAuthHook from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

describe("Login", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("should render login form", () => {
    render(<Login />);

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it("should redirect to dashboard if already authenticated", () => {
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
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
    });

    render(<Login />);

    // The component should redirect, so login form should not be present
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });

  it("should call login function with email and password", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("should show error message on login failure", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error("Login failed"));

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/invalid email or password/i)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state when submitting", async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
