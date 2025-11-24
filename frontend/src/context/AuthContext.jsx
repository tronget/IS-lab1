import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi.js";
import { getStoredToken, setStoredToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    authApi
      .profile()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setToken(null);
        setStoredToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const persistToken = (value) => {
    setToken(value);
    setStoredToken(value);
  };

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    persistToken(data.token);
    setUser({ username: data.username, role: data.role });
    return data;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    persistToken(data.token);
    setUser({ username: data.username, role: data.role });
    return data;
  };

  const logout = () => {
    persistToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
