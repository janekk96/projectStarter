import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import Register from "../Register";
import * as useAuthHook from "../../hooks/useAuth";

vi.mock("../../hooks/useAuth");
const mockedUseAuth = vi.mocked(useAuthHook.useAuth);

describe("Register", () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    });
  });

  it("should render register form", () => {
    render(<Register />);

    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
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
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
    });

    render(<Register />);

    // The component should redirect, so register form should not be present
    expect(screen.queryByText("Create your account")).not.toBeInTheDocument();
  });

  it("should show error if passwords do not match", async () => {
    const user = userEvent.setup();

    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(submitButton);

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should show error if password is too short", async () => {
    const user = userEvent.setup();

    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "12345");
    await user.type(confirmPasswordInput, "12345");
    await user.click(submitButton);

    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("should call register function with email and password when valid", async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue(undefined);

    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  it("should show error message on registration failure", async () => {
    const user = userEvent.setup();
    mockRegister.mockRejectedValue(new Error("Registration failed"));

    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });

  it("should show loading state when submitting", async () => {
    const user = userEvent.setup();
    mockRegister.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});
