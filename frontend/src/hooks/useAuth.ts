import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const useAuth = () => {
  const [authState, setAuthState] = useState({
    userId: null,
    role: null,
    email: null,
    isAuthenticated: false,
    loading: true, // Ajout initial
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setAuthState({
          userId: decodedToken.sub,
          role: decodedToken.role,
          email : decodedToken.email,
          isAuthenticated: true,
          loading: false, // Chargement terminé
        });
      } catch (error) {
        console.error("Invalid token:", error);
        setAuthState({
          userId: null,
          role: null,
          email: null,
          isAuthenticated: false,
          loading: false, // Même en cas d'erreur
        });
      }
    } else {
      setAuthState((prev) => ({
        ...prev,
        loading: false, // Pas de token, mais chargement terminé
      }));
    }
  }, []);

  return authState;
};
