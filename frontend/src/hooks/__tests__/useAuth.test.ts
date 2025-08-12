import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAuth } from "../useAuth";
import { AuthProvider } from "../../contexts/AuthContext";
import { type ReactNode } from "react";
import React from "react";

const wrapper = ({ children }: { children: ReactNode }) =>
  React.createElement(AuthProvider, null, children);

describe("useAuth", () => {
  it("should throw error when used outside AuthProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });

  it("should return auth context when used within AuthProvider", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("isAuthenticated");
    expect(result.current).toHaveProperty("isLoading");
    expect(result.current).toHaveProperty("login");
    expect(result.current).toHaveProperty("register");
    expect(result.current).toHaveProperty("logout");
  });
});
