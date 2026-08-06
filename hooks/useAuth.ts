import { useState } from "react";

const useAuth = () => {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.hash = "#/";
  };

  return {
    user,
    setUser,
    handleLogout,
  };
};

export default useAuth;