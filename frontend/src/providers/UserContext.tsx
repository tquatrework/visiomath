// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {getUserInfo} from '../services/userService';

interface UserContextValue {
  connectedUserId: number | null; // ID utilisateur
  userInfo: any | null; // Autres infos utilisateur si besoin
  updateUserInfo: (userInfo: any) => void; // Méthode pour mettre à jour les données dans le localStorage et le contexte
  logout: () => void; // Méthode pour déconnecter l'utilisateur
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectedUserId, setConnectedUserId] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [connexionLoading, setConnexionLoading] = useState<boolean>(true); // Ajout d'un état de chargement

  useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    console.warn("Aucun token détecté, utilisateur non connecté.");
    setConnexionLoading(false); // Fin du chargement si pas de token
    return;
  }

  const loadUserInfo = () => {
    const user_info = localStorage.getItem("user_info");
    if (user_info) {
      try {
        const parsedUserInfo = JSON.parse(user_info);
        if (parsedUserInfo?.id) {
          setConnectedUserId(parsedUserInfo.id);
          setUserInfo(parsedUserInfo);
          setConnexionLoading(false); // Fin du chargement après récupération des infos
          return;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de user_info :', error);
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const fetchedUserInfo = await getUserInfo(); // Récupère les données utilisateur depuis l'API
      setConnectedUserId(fetchedUserInfo.id);
      setUserInfo(fetchedUserInfo);
      localStorage.setItem("user_info", JSON.stringify(fetchedUserInfo));
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur :", error);
      if (error.response && error.response.status === 401) {
        console.warn("Token invalide ou expiré. Déconnexion nécessaire.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_info");
        setConnectedUserId(null);
        setUserInfo(null);
      }
    } finally {
      setConnexionLoading(false); // Fin du chargement après les tentatives
    }
  };

  loadUserInfo();

  if (!connectedUserId) {
    fetchUserInfo();
  }
}, []);



  const updateUserInfo = (newUserInfo: any) => {
    setUserInfo(newUserInfo);
    setConnectedUserId(newUserInfo.id || null);
    localStorage.setItem('user_info', JSON.stringify(newUserInfo)); // Mettre à jour le localStorage
  };

  // Si le chargement est en cours, on affiche un composant de chargement ou rien du tout
  /*   if (loading) {
      return <div>Chargement...</div>; // Ou un composant spinner, ou un fallback
    } */

const logout = () => {
  setConnectedUserId(null);
  setUserInfo(null);
  // Nettoyer le stockage local
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_info");
  localStorage.clear();
};

  try {
    return (
    <UserContext.Provider value={{ connectedUserId, userInfo, connexionLoading, updateUserInfo, logout }}>
      {connexionLoading ? <div>Chargement...</div> : children}
    </UserContext.Provider>
  );
  } catch (error) {
    return <div>Erreur dans UserProvider</div>;
  }
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
};
