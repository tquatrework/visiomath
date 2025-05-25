import React, { useState } from "react";
import { createRelation } from "../../services/userRelationService"; // Chemin à adapter
import { createOneNotification } from "../../services/notificationService";


interface AddRelationWindowProps {
  usePseudo: boolean;
  connectedUser: { id: string; role: string };
}

const AddRelationWindow: React.FC<AddRelationWindowProps> = ({
  usePseudo,
  connectedUser,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // Récupération de la fonction de création de relation
  //const { createRelation } = userRelationService();

  const handleSendRequest = async () => {
    const inputType = usePseudo ? "pseudo" : "email";

    // Appel au service pour créer la relation
    const result = await createRelation({
      inputType,
      connectedUser: {
        id: connectedUser.id,
        role: connectedUser.role,
      },
      inputValue,
      isRequest: true,
    });

    if (result.success) {
      alert(result.message); // Message en cas de succès
    } else {
      alert(result.message); // Message en cas d'échec (même code donc bizarre)
    }
    setIsModalOpen(false); // Fermer la fenêtre modale
  };


  return (
    <>
      {/* Bouton "+" */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 font-bold text-xl"
      >
        +
      </button>

      {/* Fenêtre modale */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 text-center"
          >
            <h2 className="text-lg font-semibold mb-4">
              {usePseudo ? "Demande par pseudo" : "Demande par email"}
            </h2>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                usePseudo ? "Saisissez un pseudo" : "Saisissez un email"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRelationWindow;
