import React, { createContext, useState, useContext, useEffect } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Changed to true initially
  const [error, setError] = useState(null);

  // Check for existing token and load user data
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            console.log('Profile Response:', userData);
            // Make sure we're setting the user object correctly
            setUser(userData.user || userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("userToken");
          }
        } catch (err) {
          console.error("Auth check error:", err);
          localStorage.removeItem("userToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login({ email, password });
      if (response.token) {
        console.log('Login Response:', response);
        // Store token in localStorage
        localStorage.setItem("userToken", response.token);
        // Set user data correctly
        setUser(response.user || response);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.register(userData);
      if (response.token) {
        setUser(response);
        setIsAuthenticated(true);
        localStorage.setItem("userToken", response.token);
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
