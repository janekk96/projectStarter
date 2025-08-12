import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge classes correctly", () => {
      const result = cn("px-2 py-1", "px-4");
      expect(result).toBe("py-1 px-4");
    });

    it("should handle conditional classes", () => {
      const condition = false;
      const result = cn(
        "base-class",
        condition && "conditional-class",
        "another-class"
      );
      expect(result).toBe("base-class another-class");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });

    it("should handle arrays", () => {
      const result = cn(["class1", "class2"], "class3");
      expect(result).toBe("class1 class2 class3");
    });

    it("should handle objects", () => {
      const result = cn({ class1: true, class2: false, class3: true });
      expect(result).toBe("class1 class3");
    });
  });
});
