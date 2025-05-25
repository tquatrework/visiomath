import React, { useState } from 'react';
import UserFilesList from './UserFilesList'; // Sous-composant pour la liste des userfiles
import SendUserFileComponent from './SendUserFileComponent'; // Sous-composant pour l'envoi de documents
// import UploadFileComponent from './UploadFileComponent'; // Sous-composant pour l'upload des fichiers

const UserFilesManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pedagogic' | 'financial' | 'submission'>('pedagogic');

  const userfileCategories = {
    pedagogic: ['Cours', 'Certificats', 'Exercices', 'Évaluations'],
    financial: ['Mandat', 'Factures', 'Reçus', 'Aides à la déclaration'],
    submission: ['Documents divers à envoyer'], // Nouvelle catégorie
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Espace Documents</h1>
      {/* **Ajout d'un troisième onglet** */}
      <div className="flex space-x-4 mt-4">
        <button
          className={`px-4 py-2 ${activeTab === 'pedagogic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('pedagogic')}
        >
          Fichiers pédagogiques
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'financial' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('financial')}
        >
          Fichiers financiers
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'submission' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('submission')}
        >
          Envoi de documents
        </button>
      </div>

   {/* **Affichage conditionnel en fonction de activeTab** */}
    {activeTab === 'submission' ? (
      <SendUserFileComponent /> // Composant pour l'envoi de documents
    ) : (
      <UserFilesList 
        category={activeTab} 
        subcategories={userfileCategories[activeTab]} 
      />
    )}
    </div>
  );
};

export default UserFilesManager;
