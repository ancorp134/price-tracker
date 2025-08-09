import React, { useEffect, useState } from "react";
import { useContext, createContext } from "react";
import axios from "axios";
import { setAccessToken } from "../Auth/authHelper";
import { setLogoutFn } from "../Auth/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, SetUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/login/",
        { email, password },
        {
          withCredentials: true,
        }
      );
      setAccessToken(res.data.access);
      console.log(res.data.access) 
      setAccessTokenState(res.data.access);
      setIsAuthenticated(true);

      const userRes = await axios.get("http://localhost:8000/api/v1/me/", {
        headers: {
          Authorization: `Bearer ${res.data.access}`,
        },
      });
      console.log(userRes.data);
      SetUser(userRes.data);

      return { success: true, message: res.data.message };
    } catch (err) {
      const errmssg =
        err.response?.data?.error || "Login failed. Please try again.";
      return { success: false, message: errmssg };
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/v1/logout/",
        {},
        { withCredentials: true }
      );
    } catch (err) {
      //pass
    }

    setAccessToken(null);
    setAccessTokenState(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await axios.post(
          "http://localhost:8000/api/v1/token/refresh/",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = res.data.access;
        setAccessToken(newAccessToken);
        setAccessTokenState(newAccessToken);
        setIsAuthenticated(true);

        const userRes = await axios.get("http://localhost:8000/api/v1/me/", {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        console.log(userRes.data);
        SetUser(userRes.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
    setLogoutFn(logout);
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
