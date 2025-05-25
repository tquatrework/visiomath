// src/features/user/UserSpace.tsx
import React, { useEffect, useState } from 'react';
import API_URL from '../../config/api.config';

const UserSpace : React.FC = () => {
  const [userData, setUserData] = useState(null);

  const fetchUserSpace = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/userspaces`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Erreur lors de la récupération des données de l'utilisateur");
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };

  useEffect(() => {
    fetchUserSpace();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {userData ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Bonjour, {userData.firstName} !</h1>
            <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mes actualités */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Mes actualités</h2>
              <ul className="text-sm text-gray-700 list-disc list-inside">
                <li>Messages non lus : {userData.unreadMessages || 0}</li>
                <li>Fichiers : {userData.userFiles.length}</li>
              </ul>
            </div>

            {/* Les news du réseau */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Les news du réseau</h2>
              <p className="text-sm text-gray-500 italic">Aucune activité récente</p>
            </div>

            {/* Les news de l'univers */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold mb-2">Les news de l'univers</h2>
              <p className="text-sm text-gray-600">Bientôt disponible : articles et découvertes en mathématiques, IA et plus encore !</p>
            </div>
          </div>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default UserSpace;