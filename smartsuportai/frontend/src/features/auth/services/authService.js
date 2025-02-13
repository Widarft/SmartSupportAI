const BASE_URL = "http://localhost:5000/api";

export const authService = {
  async login(credentials) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  },

  async register(userData) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
