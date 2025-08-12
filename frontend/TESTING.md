# Frontend Testing Documentation

This document provides information about the testing setup and available tests for the frontend application.

## Testing Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast unit test framework for Vite projects
- **Testing Library**: [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) - Simple and complete testing utilities for React components
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/) - Fire events the same way the user does
- **Assertions**: [@testing-library/jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) - Custom matchers for DOM elements
- **Environment**: [jsdom](https://github.com/jsdom/jsdom) - Pure JavaScript implementation of DOM and HTML standards

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup and mocks
│   └── test-utils.tsx    # Custom render function with providers
├── __tests__/
│   ├── App.test.tsx      # Main App component tests
│   └── integration.test.tsx # Integration tests
├── components/
│   └── __tests__/
│       └── ProtectedRoute.test.tsx # Component tests
├── contexts/
│   └── __tests__/
│       └── AuthContext.test.tsx    # Context tests
├── hooks/
│   └── __tests__/
│       └── useAuth.test.tsx        # Hook tests
├── lib/
│   └── __tests__/
│       └── utils.test.ts           # Utility function tests
└── pages/
    └── __tests__/
        ├── Dashboard.test.tsx      # Page component tests
        ├── Home.test.tsx
        ├── Login.test.tsx
        └── Register.test.tsx
```

## Available Test Commands

```bash
# Run all tests in watch mode (for development)
npm test

# Run all tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## Test Categories

### 1. Unit Tests

- **Utils**: Test utility functions like className merging
- **Hooks**: Test custom hooks like `useAuth`
- **Components**: Test individual React components

### 2. Integration Tests

- **Authentication Flow**: Test complete login/logout process
- **Protected Routes**: Test route protection and redirection
- **Context Integration**: Test how components work with contexts

### 3. Component Tests

- **Login/Register Pages**: Test form validation, submission, and error handling
- **Dashboard**: Test authenticated user interface
- **Home**: Test landing page for different auth states
- **ProtectedRoute**: Test route protection logic

## Test Utilities

### Custom Render Function

Located in `src/test/test-utils.tsx`, this provides a custom render function that wraps components with necessary providers:

```tsx
import { render, screen } from "../test/test-utils";

// This render function automatically wraps with AuthProvider and MemoryRouter
render(<YourComponent />);
```

### Mocking

- **API calls**: Automatically mocked in test setup
- **localStorage**: Mocked with vi.fn() methods
- **window.location**: Mocked for navigation tests
- **React Router**: Uses MemoryRouter for controlled navigation

## Writing New Tests

### Component Test Example

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../../test/test-utils";
import userEvent from "@testing-library/user-event";
import YourComponent from "../YourComponent";

describe("YourComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    const user = userEvent.setup();
    render(<YourComponent />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Updated Text")).toBeInTheDocument();
  });
});
```

### Hook Test Example

```tsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useYourHook } from "../useYourHook";

describe("useYourHook", () => {
  it("should return expected values", () => {
    const { result } = renderHook(() => useYourHook());

    expect(result.current.value).toBe(expectedValue);
  });

  it("should update state correctly", () => {
    const { result } = renderHook(() => useYourHook());

    act(() => {
      result.current.updateValue("new value");
    });

    expect(result.current.value).toBe("new value");
  });
});
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Use Descriptive Test Names**: Make it clear what each test is verifying
3. **Clean Up Between Tests**: Use `beforeEach` to reset mocks and state
4. **Test Error States**: Don't forget to test error conditions and edge cases
5. **Keep Tests Focused**: Each test should verify one specific behavior
6. **Use waitFor for Async Operations**: Always wait for async operations to complete

## Debugging Tests

### Common Issues

1. **Router Conflicts**: If you see "cannot render Router inside another Router", use the integration test wrapper or mock React Router hooks
2. **Test Hanging**: If tests hang, especially with navigation components, mock `react-router-dom` hooks like `useLocation` and `Navigate`
3. **Async Issues**: Use `waitFor` for operations that might take time
4. **Mock Issues**: Ensure mocks are cleared between tests with `vi.clearAllMocks()`

### Debugging Tips

```bash
# Run a specific test file
npm test -- --run src/path/to/test.tsx

# Run tests with verbose output
npm test -- --reporter=verbose

# Run tests in UI mode for interactive debugging
npm run test:ui
```

## Coverage Goals

Aim for:

- **Statements**: >80%
- **Branches**: >75%
- **Functions**: >80%
- **Lines**: >80%

Check coverage with:

```bash
npm run test:coverage
```

This will generate an HTML coverage report in `coverage/index.html`.
