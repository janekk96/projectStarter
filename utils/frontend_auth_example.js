// Frontend JWT Authentication Integration Example
// This shows how to integrate with the JWT authentication from a frontend app

class AuthService {
  constructor(baseUrl = "http://localhost/api") {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("accessToken");
  }

  // Register a new user
  async register(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          is_active: true,
          is_superuser: false,
          is_verified: false,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User registered:", userData);
        return userData;
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Login user and store token
  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${this.baseUrl}/auth/jwt/login`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const tokenData = await response.json();
        this.token = tokenData.access_token;
        localStorage.setItem("accessToken", this.token);
        console.log("Login successful");
        return tokenData;
      } else {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      if (!this.token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${this.baseUrl}/auth/jwt/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        this.token = null;
        localStorage.removeItem("accessToken");
        console.log("Logout successful");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  // Get current user information
  async getCurrentUser() {
    try {
      if (!this.token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else {
        throw new Error("Failed to get user data");
      }
    } catch (error) {
      console.error("Get user error:", error);
      throw error;
    }
  }

  // Make authenticated API request
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired, remove it
      this.token = null;
      localStorage.removeItem("accessToken");
      throw new Error("Authentication expired");
    }

    return response;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!this.token;
  }
}

// Usage example
const auth = new AuthService();

// Example: Login form handler
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await auth.login(email, password);
    // Redirect to dashboard or update UI
    window.location.href = "/dashboard";
  } catch (error) {
    alert(`Login failed: ${error.message}`);
  }
}

// Example: Register form handler
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await auth.register(email, password);
    alert("Registration successful! Please log in.");
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  }
}

// Example: Make authenticated API call
async function fetchProtectedData() {
  try {
    const response = await auth.authenticatedRequest("/protected");
    const data = await response.json();
    console.log("Protected data:", data);
  } catch (error) {
    console.error("Failed to fetch protected data:", error);
  }
}

// Example: Check authentication status on page load
window.addEventListener("DOMContentLoaded", () => {
  if (auth.isLoggedIn()) {
    console.log("User is logged in");
    // Show authenticated UI
  } else {
    console.log("User is not logged in");
    // Show login form
  }
});

export default AuthService;
