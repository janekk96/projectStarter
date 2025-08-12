import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { type ReactNode } from "react";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../lib/api";

vi.mock("../../lib/api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

const mockedAuthApi = vi.mocked(authApi);

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
    // Reset window.location
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  it("should initialize with no user and not authenticated", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should handle login API call", async () => {
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

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    // Verify API calls were made
    expect(mockedAuthApi.login).toHaveBeenCalledWith({
      username: "test@example.com",
      password: "password123",
    });
    expect(mockedAuthApi.getCurrentUser).toHaveBeenCalled();
  });

  it("should handle login failure", async () => {
    mockedAuthApi.login.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(
      result.current.login("test@example.com", "wrongpassword")
    ).rejects.toThrow("Invalid credentials");

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should handle registration API call", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      is_active: true,
      is_superuser: false,
      is_verified: true,
    };
    const mockAuthResponse = { access_token: "token123", token_type: "bearer" };

    mockedAuthApi.register.mockResolvedValue(mockUser);
    mockedAuthApi.login.mockResolvedValue(mockAuthResponse);
    mockedAuthApi.getCurrentUser.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.register("test@example.com", "password123");
    });

    // Verify register was called, and login was called automatically
    expect(mockedAuthApi.register).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(mockedAuthApi.login).toHaveBeenCalledWith({
      username: "test@example.com",
      password: "password123",
    });
  });

  it("should handle logout API call", async () => {
    mockedAuthApi.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedAuthApi.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(window.location.href).toBe("/post-logout");
  });

  it("should clear user data on invalid token", async () => {
    localStorage.setItem("access_token", "invalid-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ id: "1", email: "test@test.com" })
    );
    mockedAuthApi.getCurrentUser.mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    // localStorage should be cleared
    expect(localStorage.getItem("access_token")).toBeFalsy();
    expect(localStorage.getItem("user")).toBeFalsy();
  });

  it("should handle logout failure gracefully", async () => {
    mockedAuthApi.logout.mockRejectedValue(new Error("Logout failed"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedAuthApi.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(window.location.href).toBe("/post-logout");
    expect(consoleSpy).toHaveBeenCalledWith("Logout error:", expect.any(Error));

    consoleSpy.mockRestore();
  });
});
