//import React, { useState, useEffect } from 'react';
import API_URL from '../config/api.config';

export const checkUsernameAvailability = async (username: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/check-username?username=${username}`);
    const data = await response.json();
    return !data.success;
  } catch (error) {
    console.error('Erreur lors de la vérification du pseudo:', error);
    return false;
  }
};

/* export const handleLogout = async (navigate: Function, logout : ()=> void) => {
    try {
      // Appel au back-end pour invalider le token
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Inclure le token si nécessaire
        },
      });

      // Appelle la méthode logout pour réinitialiser le contexte utilisateur
      logout();

  
      if (response.ok) {
        // Supprime le token local
        localStorage.removeItem("token");
  
        // Redirige vers la page de connexion
        navigate("/connect");
      } else {
        console.error("Erreur lors de la déconnexion : échec de l'appel au back-end.");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };
 */

export const handleLogout = async (navigate: Function, logout: () => void) => {
  try {
    const token = localStorage.getItem("access_token");
    console.log("Token avant appel au backend :", token);

    if (!token) {
      console.warn("Aucun token trouvé dans le localStorage, déconnexion forcée côté client.");
      logout(); // Nettoyage centralisé dans le contexte
      navigate("/connect");
      return;
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Erreur lors de la déconnexion côté backend :", response.status);
    }

    logout(); // Nettoyage centralisé
    navigate("/connect");
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
    logout(); // Assurez le nettoyage local même en cas d'échec
    navigate("/connect");
  }
};