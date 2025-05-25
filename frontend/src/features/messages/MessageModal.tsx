import React, { useState } from 'react';
import { sendMessage } from '../../services/messageService';
import { useUser } from '../../providers/UserContext';

interface MessageModalProps {
  recipient?: { id: number; pseudo: string }; // Compatible avec Contacts.tsx
  recipientId?: number; // Compatible avec MessageWindow.tsx
  recipientName?: string;
  onClose: () => void;
  updateMessages?: (newMessage: Message) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ recipient, recipientId, recipientName, onClose, updateMessages }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { connectedUserId: userId } = useUser();

  const targetId = recipient?.id || recipientId;
  const targetName = recipient?.pseudo || recipientName || "Utilisateur inconnu";

  const handleSendMessage = async () => {
    if (!message.trim() || !targetId || isSending) return;

    setIsSending(true);

    try {
      const newMessage = await sendMessage({ senderId: userId, recipientId: targetId, content: message });

      setMessage('');
      onClose(); // Ferme la modale après envoi
      if (updateMessages) updateMessages(newMessage); // Met à jour l'affichage
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Envoyer un message à {targetName}</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="w-full p-2 border rounded mb-4"
          disabled={isSending}
        />
        <div className="flex justify-end">
          <button 
            onClick={handleSendMessage} 
            className={`px-4 py-2 rounded ${isSending ? 'bg-gray-400' : 'bg-green-500 text-white'}`}
            disabled={isSending}
          >
            {isSending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
