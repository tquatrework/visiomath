//RelationConfirmationModal.tsx
import React, { useState } from 'react';
import { createRelation } from '../../services/userRelationService';

interface RelationConfirmationModalProps {
  user1: any;
  user2: any;
  onClose: () => void;
}

const RelationConfirmationModal: React.FC<RelationConfirmationModalProps> = ({
  user1,
  user2,
  onClose,
}) => {
  const [showSubModal, setShowSubModal] = useState(false);

  const handleSubModalConfirm = async (type: 'present1to2' | 'present2to1' | 'connectBoth') => {
    try {
      const payload = {
        connectedUser: type === 'present2to1' ? user2 : user1,
        inputValue: type === 'present2to1' ? user1.pseudo : user2.pseudo,
        inputType: 'pseudo',
        isRequest: type !== 'connectBoth',
        isSymetricRequest: type === 'connectBoth',
      };

      await createRelation(payload);
      alert('Relation créée avec succès.');
    } catch (error) {
      console.error('Erreur lors de la création des relations :', error);
      alert('Une erreur est survenue.');
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">
          Voulez-vous mettre en relation {user1.pseudo} et {user2.pseudo} ?
        </h2>
        {!showSubModal ? (
          <div className="flex justify-end space-x-4">
            <button onClick={() => setShowSubModal(true)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Oui
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Annuler
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSubModalConfirm('present1to2')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Présenter {user1.pseudo} à {user2.pseudo}
            </button>
            <button onClick={() => handleSubModalConfirm('present2to1')} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Présenter {user2.pseudo} à {user1.pseudo}
            </button>
            <button onClick={() => handleSubModalConfirm('connectBoth')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Mettre en relation
            </button>
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Annuler
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelationConfirmationModal;
