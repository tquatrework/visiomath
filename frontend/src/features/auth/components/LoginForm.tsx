// src/features/auth/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../../providers/UserContext";
import { loginUser, getUserInfo, getAllUserRelations } from '../../../services/userService';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { updateUserInfo } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accessToken = await loginUser(email, password);

      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.removeItem('user_info');

        const userInfo = await getUserInfo();

        if (userInfo) {
          const userRelations = await getAllUserRelations(userInfo.id);

          updateUserInfo({ ...userInfo });

          if (userInfo.role !== 'pedgogical_manager') {
            localStorage.setItem('user_relations', JSON.stringify(userRelations));
          }

          navigate('/user-space');
        }
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          alert(data.message);
        } else if (status === 401) {
          setError("L'email ou le mot de passe est incorrect.");
        } else {
          alert('Une erreur inconnue est survenue.');
        }
      } else {
        alert('Impossible de se connecter au serveur.');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Adresse e-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Se connecter
        </button>
      </div>
    </form>
  );
};
