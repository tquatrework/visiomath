import React, { useEffect, useState } from 'react';
import { useRelations } from '../../hooks/useRelations';
import { useAuth } from '../../hooks/useAuth';
import UserDropdown from '../profile/UserDropdown';
import AdministrativeProfile from '../profile/AdministrativeProfile';
import PedagogicalProfile from '../profile/PedagogicalProfile';
import MessageModal from '../messages/MessageModal';
import RelationshipRequests from './RelationshipRequests';
import RelationConfirmationModal from './RelationConfirmationModal';
import { fetchRelationsFrom } from '../../services/userRelationService';
import { useProfileUser } from '../../hooks/useProfileUser';

const Contacts: React.FC = () => {
  const { userId } = useAuth(); // Utilisateur connecté
  const { relations, loading } = useRelations(); // Relations stockées localement
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Utilisateur sélectionné
  const [currentRelations, setCurrentRelations] = useState<any[]>([]); // Relations à afficher
  const [selectedRelation, setSelectedRelation] = useState<any | null>(null); // Relation sélectionnée
  const [isRelationsVisible, setIsRelationsVisible] = useState(true); // Contrôle de la fenêtre glissante
  const [showMessageModal, setShowMessageModal] = useState(false); // Contrôle de la modale de message
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showPedagogicalProfile, setShowPedagogicalProfile] = useState(false);

  const [selectedRelations, setSelectedRelations] = useState<any[]>([]); // Relations cochées
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Contrôle de la modale de confirmation
  // Récupération des données utilisateur via le hook
  const { userData, loadingData, avatarTempUrl } = useProfileUser(selectedRelation?.userTo?.id || null);

    const getRoleColor = (role: string) => {
      switch (role) {
        case 'student':
          return 'bg-green-400'; // Pastille verte claire
        case 'parent':
          return 'bg-green-700'; // Pastille verte foncée
        case 'teacher':
          return 'bg-blue-400'; // Pastille bleue
        case 'pedagogical_animator':
          return 'bg-purple-400'; // Pastille violette
        default:
          return 'bg-red-400'; // Pastille rouge
      }
    };
  
    const handleCheckboxChange = (relation: any) => {
    setSelectedRelations((prev) => {
      const alreadySelected = prev.find((r) => r.id === relation.id);
      if (alreadySelected) {
        return prev.filter((r) => r.id !== relation.id);
      }
      return [...prev, relation];
    });
  };

  // Charger les relations initiales (utilisateur connecté ou après sélection d'un autre utilisateur)
  useEffect(() => {
    const loadRelations = async () => {
      if (!selectedUser || selectedUser === userId) {
        setCurrentRelations(relations); // Relations de l'utilisateur connecté
      } else {
        try {
          const fetchedRelations = await fetchRelationsFrom(selectedUser); // Relations pour un autre utilisateur
          setCurrentRelations(fetchedRelations);
        } catch (error) {
          console.error('Erreur lors de la récupération des relations :', error);
          setCurrentRelations([]);
        }
      }
      setSelectedRelation(null); // Réinitialiser la relation sélectionnée
      setIsRelationsVisible(true); // Réafficher la liste des relations
    };

    loadRelations();
  }, [selectedUser, userId, relations]);

  useEffect(() => {
  if (selectedRelations.length === 2) {
    setShowConfirmationModal(true); // Affiche la modale si deux relations sont sélectionnées
  }
  }, [selectedRelations]);

  const handleViewAdminProfile = (relation: any) => {
    setSelectedRelation(relation);
    setShowMessageModal(false);
    setIsRelationsVisible(true);
    setShowAdminProfile(true);
    setShowPedagogicalProfile(false);
  };

  const handleViewPedagogicalProfile = (relation: any) => {
    setSelectedRelation(relation);
    setShowMessageModal(false);
    setIsRelationsVisible(true);
    setShowAdminProfile(false);
    setShowPedagogicalProfile(true);
  };

  const handleSendMessage = (relation: any) => {
    setSelectedRelation(relation);
    setShowMessageModal(true);
  };

  const handleToggleRelations = () => {
    setIsRelationsVisible((prev) => !prev);
  };

  const handleConfirmation = () => {
  // TODO: Ajouter la logique pour mettre en relation les deux utilisateurs sélectionnés
    setSelectedRelations([]); // Réinitialiser les sélections
    setShowConfirmationModal(false);
  };

  const handleCancel = () => {
    setSelectedRelations([]); // Réinitialiser les sélections
    setShowConfirmationModal(false);
  };

  if (loading || loadingData) {
    return <p>Chargement en cours...</p>;
  }

  // Relations demandées pour RelationshipRequests
  const requestedBackRelations = currentRelations.filter(
    (relation) => relation.relationState === 'requestedBack'
  );

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Choix du profil */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Choisir un utilisateur</h2>
        <UserDropdown selectedUserId={selectedUser} setSelectedUserId={setSelectedUser} />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-grow relative">
        {/* Liste des relations */}
        <div
          className={`transition-all duration-300 ${
            isRelationsVisible ? (selectedRelation ? 'w-1/4' : 'w-full') : 'w-0'
          } overflow-hidden`}
        >
          <div className="bg-gray-100 h-full shadow p-4">
            <div className="flex justify-between items-center mb-4 relative">
              <h3 className="text-xl font-bold">Relations</h3>
              {selectedRelation && isRelationsVisible && (
                <button
                  onClick={handleToggleRelations}
                  className="bg-gray-500 text-white rounded px-2 py-1"
                >
                  {'<<'}
                </button>
              )}
            </div>

            {selectedRelation && !isRelationsVisible && (
              <button
                onClick={handleToggleRelations}
                className="absolute top-16 left-0 bg-gray-500 text-white rounded px-2 py-1 z-20"
              >
                {'>>'}
              </button>
            )}

            <ul className="space-y-4">
              {currentRelations.length > 0 ? (
                currentRelations.map((relation) => (
                  <li key={relation.id} className="flex flex-col border-b pb-2 mb-2">
                    <div className="flex items-center">
                      {/* Pastille colorée */}
                      <span
                        className={`h-4 w-4 rounded-full mr-4 ${getRoleColor(relation.userTo.role)}`}
                        title={relation.userTo.role} // Info-bulle pour le rôle
                      ></span>

                      {/* Case à cocher */}
                      <input
                        type="checkbox"
                        className="mr-4 h-6 w-6 rounded-full border-gray-300 focus:ring-2 focus:ring-offset-2"
                        onChange={() => handleCheckboxChange(relation)}
                        checked={selectedRelations.some((r) => r.id === relation.id)}
                      />

                      {/* Informations sur la relation */}
                      <div>
                        <p className="font-semibold">{relation.contactName}</p>
                        <p className="text-sm text-gray-500">
                          En relation avec <span className="font-bold">{relation.userTo.pseudo}</span>.
                        </p>
                      </div>
                    </div>

                    {/* Liens d'actions */}
                    <div className="flex flex-wrap gap-4 mt-2">
                      <a
                        href="#"
                        onClick={() => handleViewAdminProfile(relation)}
                        className="text-blue-500 hover:underline"
                      >
                        Voir le profil admin
                      </a>
                      <a
                        href="#"
                        onClick={() => handleViewPedagogicalProfile(relation)}
                        className="text-blue-500 hover:underline"
                      >
                        Voir le profil péda
                      </a>
                      <a
                        href="#"
                        onClick={() => handleSendMessage(relation)}
                        className="text-blue-500 hover:underline"
                      >
                        Envoyer un message
                      </a>
                    </div>
                  </li>

                ))
              ) : (
                <p className="text-gray-500">Aucune relation disponible.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Profil affiché */}
        {selectedRelation && userData ? (
          <div
            className={`transition-all duration-300 flex-grow ${
              isRelationsVisible ? 'w-3/4' : 'w-full'
            }`}
          >
            <div className="p-4">
              <h3 className="text-2xl font-bold mb-4">
                Profil de {selectedRelation.userTo.pseudo}
              </h3>
              <div className="space-y-4">
                {showAdminProfile && (
                  <AdministrativeProfile data={{ ...userData, avatarTempUrl }} role={userData?.role} readOnly />
                )}
                {showPedagogicalProfile && (
                  <PedagogicalProfile data={userData} readOnly />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

{/*       {showConfirmationModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">
              Voulez-vous mettre{' '}
              <span className="font-bold">{selectedRelations[0]?.userTo.pseudo}</span> et{' '}
              <span className="font-bold">{selectedRelations[1]?.userTo.pseudo}</span> en relation ?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleConfirmation}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Oui
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )} */}
      {showConfirmationModal && selectedRelations.length === 2 && (
        <RelationConfirmationModal
          user1={selectedRelations[0]?.userTo}
          user2={selectedRelations[1]?.userTo}
          onClose={() => {
            setSelectedRelations([]); // Réinitialiser les sélections
            setShowConfirmationModal(false); // Fermer la modale
          }}
        />
      )}

      {/* Modale pour envoyer un message */}
      {showMessageModal && selectedRelation && (
        <MessageModal
          recipient={selectedRelation.userTo}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {/* RelationshipRequests */}
      <RelationshipRequests
        relations={requestedBackRelations}
        setRelations={setCurrentRelations}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Contacts;
