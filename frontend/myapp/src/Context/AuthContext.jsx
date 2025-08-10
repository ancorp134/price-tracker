// AuthContext.jsx
import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";
import { setAccessToken as storeAccessToken } from "../Auth/authHelper";
import { setLogoutFn } from "../Auth/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trackedProducts, setTrackedProducts] = useState([]);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  });

  const authHeader = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchUserData = async (token) => {
    try {
      const [userRes, trackedRes] = await Promise.all([
        api.get("/me/", authHeader(token)),
        api.get("/track-product/", authHeader(token)),
      ]);
      setUser(userRes.data);
      setTrackedProducts(trackedRes.data); // FIXED: replace array, don't nest
    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await api.post("/login/", { email, password }, { withCredentials: true });

      const token = res.data.access;
      storeAccessToken(token);
      setAccessTokenState(token);
      setIsAuthenticated(true);

      await fetchUserData(token);

      return { success: true, message: res.data.message };
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed. Please try again.";
      return { success: false, message: errMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout/", {}, { withCredentials: true });
    } catch {}
    storeAccessToken(null);
    setAccessTokenState(null);
    setIsAuthenticated(false);
    setUser(null);
    setTrackedProducts([]);
    navigate("/login");
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/token/refresh/", {}, { withCredentials: true });
        const newToken = res.data.access;

        storeAccessToken(newToken);
        setAccessTokenState(newToken);
        setIsAuthenticated(true);

        await fetchUserData(newToken);
      } catch {
        // session expired, do nothing
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
    setLogoutFn(logout);
  }, []);

  // ✅ Function to add a tracked product instantly
  const addTrackedProduct = (product) => {
    setTrackedProducts((prev) => [...prev, product]);
  };

  const value = {
    user,
    accessToken,
    isAuthenticated,
    trackedProducts,
    login,
    logout,
    addTrackedProduct, // expose this for frontend updates
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
