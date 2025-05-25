// src/features/auth/components/ResetPasswordForm.tsx
import React, { useState } from 'react';

export const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour envoyer l’email pour le renouvellement de mot de passe
    console.log(`Reset password request for: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Adresse e-mail
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
      >
        Envoyer l’e-mail de réinitialisation
      </button>
    </form>
  );
};
