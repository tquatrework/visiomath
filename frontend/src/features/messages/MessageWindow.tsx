import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import apiSec from '../../utils/tokenapi.utils';
import { Message } from '../../types/message.types';
import { useUser } from '../../providers/UserContext';
import { useRelations } from '../../hooks/useRelations';
import MessageModal from './MessageModal';

const MessageWindow = () => {
  const { connectedUserId: userId, connexionLoading } = useUser();
  const { relations, loading: relationsLoading } = useRelations();

  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]); // Filtrage appliqué ici
  const [viewMode, setViewMode] = useState<'date' | 'userrelation'>('date');
  const [selectedCorrespondent, setSelectedCorrespondent] = useState<number | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState<{ [key: string]: Message[] }>({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [viewMode, selectedCorrespondent]);

  useEffect(() => {
    if (messages.length > 0) {
      applyFilter();
    }
  }, [messages, selectedCorrespondent]);

  const fetchMessages = async () => {
    try {
      let query = `?filter=${viewMode}&userId=${userId}`;
      if (selectedCorrespondent) query += `&correspondentId=${selectedCorrespondent}`;

      console.log("Requête API envoyée :", `/messages${query}`);

      const { data } = await apiSec.get(`/messages${query}`);
      const sortedMessages = Array.isArray(data) ? data : [];
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages :", error);
      setMessages([]);
    }
  };

  const applyFilter = () => {
    if (!selectedCorrespondent) {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(
        msg => msg.senderId === selectedCorrespondent || msg.receiverId === selectedCorrespondent
      );
      setFilteredMessages(filtered);
    }
    groupMessages();
  };

  const groupMessages = () => {
    const grouped: { [key: string]: Message[] } = {};

    filteredMessages.forEach(msg => {
      const key = viewMode === 'date'
        ? new Date(msg.timestamp).toLocaleDateString()
        : (msg.senderId === userId ? msg.receiverId : msg.senderId).toString();

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(msg);
    });

    setGroupedMessages(grouped);
  };

  const handleOpenMessageModal = () => {
    if (!selectedCorrespondent) {
      setShowAlert(true);
      return;
    }
    setShowMessageModal(true);
  };

  const updateMessages = (newMessage: Message) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto border rounded shadow-lg">
      {/* Tri des messages */}
      <header className="flex justify-between mb-4">
        <button
          onClick={() => setViewMode('date')}
          className={`px-3 py-2 rounded ${viewMode === 'date' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Trier par Date
        </button>
        <button
          onClick={() => setViewMode('userrelation')}
          className={`px-3 py-2 rounded ${viewMode === 'userrelation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Trier par Correspondant
        </button>
      </header>
      
      {/* Sélection du destinataire */}
      <div className="mb-3">
        <label className="block text-sm font-semibold">Sélectionner un destinataire :</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedCorrespondent || ''}
          onChange={(e) => setSelectedCorrespondent(Number(e.target.value) || null)}
        >
          <option value="">-- Tous les messages --</option>
          {relations.map((relation) => (
            <option key={relation.id} value={relation.userTo.id}>
              {relation.userTo.pseudo}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des messages groupés */}
      <main className="border p-3 rounded bg-white max-h-80 overflow-y-auto">
        {Object.keys(groupedMessages).length > 0 ? (
          Object.keys(groupedMessages).map((groupKey, index) => {
            const bgColor = index % 3 === 0 ? 'bg-blue-50' : index % 3 === 1 ? 'bg-white' : 'bg-gray-50';
            const interlocutorId = parseInt(groupKey, 10);
            const interlocutor = relations.find(rel => rel.userTo.id === interlocutorId)?.userTo.pseudo || `Inconnu`;

            return (
              <div key={groupKey} className={`mb-4 p-3 rounded ${bgColor}`}>
                {/* Ajout de l'affichage du titre (date ou interlocuteur) */}
                <div className="mb-2 text-center font-bold text-gray-700">
                  {viewMode === 'date' ? groupKey : `Conversation avec ${interlocutor}`}
                </div>

                {groupedMessages[groupKey].map((msg) => (
                  <div key={msg.id} className={`p-2 border-b ${msg.senderId === userId ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-gray-600 italic flex items-center gap-1">
                      {msg.senderId === userId ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-blue-500" />
                          {viewMode === 'date' && !selectedCorrespondent && (
                            <>De <strong>Moi-même</strong> à {relations.find(rel => rel.userTo.id === msg.receiverId)?.userTo.pseudo || "Inconnu"}</>
                          )}
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          {viewMode === 'date' && !selectedCorrespondent && (
                            <>De <strong>{relations.find(rel => rel.userTo.id === msg.senderId)?.userTo.pseudo || "Inconnu"}</strong> à Moi-même</>
                          )}
                        </>
                      )}
                    </p>
                    <p className="text-sm">
                      <br />
                    </p>
                    <p className="text-gray-800">{msg.content}</p>
                    <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">Aucun message.</p>
        )}
      </main>

      {/* Bouton pour ouvrir MessageModal */}
      <button
        onClick={handleOpenMessageModal}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-3"
      >
        Écrire un message
      </button>

      {showMessageModal && selectedCorrespondent && (
        <MessageModal
          recipientId={selectedCorrespondent}
          recipientName={relations.find((rel) => rel.userTo.id === selectedCorrespondent)?.userTo.pseudo || "Utilisateur inconnu"}
          onClose={() => setShowMessageModal(false)}
          updateMessages={updateMessages}
        />
      )}
    </div>
  );
};

export default MessageWindow;
