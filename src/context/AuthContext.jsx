import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("nokler_is_admin") === "true";
  });

  const [password, setPassword] = useState(() => {
  localStorage.setItem("nokler_admin_password", "admin123");
  return "admin123";
});

  function login(inputPassword) {
    if (inputPassword === password) {
      setIsAdmin(true);
      localStorage.setItem("nokler_is_admin", "true");
      return true;
    }

    return false;
  }

  function logout() {
    setIsAdmin(false);
    localStorage.setItem("nokler_is_admin", "false");
  }

  function changePassword(newPassword) {
    setPassword(newPassword);
    localStorage.setItem("nokler_admin_password", newPassword);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}