// src/features/auth/components/RegistrationForm.tsx
import React, { useState, useEffect } from 'react';
import { BaseUser, UserRole } from '../../../types/user.types';
import { RegistrationStepper } from './RegistrationStepper';
import { useAuth } from '../../../hooks/useAuth';
import API_URL from '../../../config/api.config';
import { checkUsernameAvailability } from '../../../services/authService';
//import { createUserRelations } from '../../../services/registrationService';

const roleOptions: UserRole[] = [
  'student',
  'parent',
  'teacher',
  'pedagogical_animator',
  'pedagogical_manager',
  'it_admin',
  'financial_admin'
];

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onReset }) => {
  const [step, setStep] = useState<number>(1);
  const [user, setUser] = useState<Partial<BaseUser>>({});
  //const { user: currentUser, loading, error } = useCurrentUser();
  const { role } = useAuth();

  // Récupérer les options de rôle selon l'utilisateur actuel
  const availableRoles = role === 'it_admin' ? roleOptions : ['student', 'parent', 'teacher'];

  const handlePseudoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, pseudo: e.target.value });
  };

  useEffect(() => {
    if (user.firstName && user.lastName) {
      setUser((prev) => ({ ...prev, pseudo: `${user.firstName} ${user.lastName}` }));
    }
  }, [user.firstName, user.lastName]);

  const handleSubmit = async () => {
    console.log("handleSubmit appelé avec :", user);
    try {
      // Étape 1 : Création de l'utilisateurs
        const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
        });

        if (!response.ok) throw new Error("Erreur lors de l'inscription");
        const { user: createdUser, token } = await response.json(); 
        //const createdUser = await response.json(); // Récupère l'utilisateur créé

      // Étape 2 : Créer les relations si le rôle est `pedagogical_manager`
/*         if (['teacher', 'pedagogical_animator', 'pedagogical_manager'].includes(user.role)) {
          const targetRoles =
            user.role === 'pedagogical_manager'
              ? ['teacher', 'pedagogical_animator', 'pedagogical_manager']
              : ['pedagogical_manager']; // L'inverse : si l'utilisateur n'est pas manager
          await createUserRelations(createdUser.id, user.role, user.pseudo, targetRoles, token);
        }
       */
        onReset(); // Réinitialiser le formulaire
        alert('Utilisateur créé avec succès');
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la création de l\'utilisateur');
      }
    };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="usermail" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="usermail" 
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={user.email || ''}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="userpassword" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="userpassword" 
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={user.password || ''}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="userfirstname" className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="userfirstname"
                type="text"
                className="mt-1 block w-full"
                value={user.firstName || ''}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="username"
                type="text"
                className="mt-1 block w-full"
                value={user.lastName || ''}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="userpseudo" className="block text-sm font-medium text-gray-700">Pseudo</label>
              <input
                id="userpseudo"
                type="text"
                className="mt-1 block w-full"
                value={user.pseudo || ''}
                onChange={handlePseudoChange}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="usertel" className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
              <input
                id="usertel"
                type="tel"
                className="mt-1 block w-full"
                value={user.phone || ''}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="userrole" className="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                id="userrole" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={user.role || ''}
                onChange={(e) => setUser({ ...user, role: e.target.value as UserRole })}
              >
                <option value="">Sélectionnez un rôle</option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.replace('_', ' ').charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                id="activeuser" 
                type="checkbox"
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 mr-2"
                checked={user.isActive || false}
                onChange={(e) => setUser({ ...user, isActive: e.target.checked })}
              />
              <label htmlFor="activeuser" className="text-sm font-medium text-gray-700">Compte actif</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <RegistrationStepper currentStep={step} totalSteps={3} />
      
      <div className="mt-8">
        {renderStep()}
        
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Précédent
            </button>
          )}
          
          {step < 3 ? (
          <button
            onClick={async () => {
              if (step === 2) {
                // Vérification du pseudo au step 2
                const isAvailable = await checkUsernameAvailability(user.pseudo);
                if (!isAvailable) {
                  alert('Pseudo déjà pris, veuillez en choisir un autre.');
                  return; // Bloque l'avancement
                }
              }
              setStep(step + 1); // Avance vers l'étape suivante si tout est OK
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Suivant
          </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Créer le compte
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
