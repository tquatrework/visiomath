// src/features/auth/pages/AuthPage.tsx
import React, { useState } from 'react';
import { RegistrationForm } from '../components/RegistrationForm';
import { LoginForm } from '../components/LoginForm';
import { ResetPasswordForm } from '../components/ResetPasswordForm';

export const AuthPage = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const resetRegistrationForm = () => {
    setShowRegistration(false); // Revenir à l'interface de connexion
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-red-900">
          {showResetPassword
            ? 'Réinitialiser le mot de passe'
            : showRegistration
            ? 'Créer un compte'
            : 'Se connecter'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {showResetPassword ? (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <ResetPasswordForm />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowResetPassword(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        ) : !showRegistration ? (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowResetPassword(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Mot de passe oublié ?
              </button>
              <button
                onClick={() => setShowRegistration(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 ml-4"
              >
                Pas encore de compte ? Créez-en un ici
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <RegistrationForm onReset={resetRegistrationForm} />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowRegistration(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Vous avez déjà un compte ? Connectez-vous ici
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};