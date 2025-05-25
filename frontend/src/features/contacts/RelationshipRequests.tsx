import React from 'react';
import {
  updateRelation,
  deleteRelation,
} from '../../services/userRelationService';
import { createOneNotification } from '../../services/notificationService';
import { Relation } from '../../types/userrelation.types';

interface Props {
  relations: Relation[];
  setRelations: React.Dispatch<React.SetStateAction<Relation[]>>;
  selectedUser?: any; // Utilisateur sélectionné (facultatif)
}

const RelationshipRequests: React.FC<Props> = ({ relations, setRelations }) => {
  const requestedBackRelations = relations.filter(
    (relation) => relation.relationState === 'requestedBack'
  );

  if (requestedBackRelations.length === 0) return null;

  const acceptRelation = async (relationId: number) => {
    try {
      await updateRelation(relationId, { relationState: 'current' });

      setRelations((prev) =>
        prev.map((relation) =>
          relation.id === relationId
            ? { ...relation, relationState: 'current' }
            : relation
        )
      );

      await createOneNotification(
        relations.find((r) => r.id === relationId)?.userTo.id,
        `Votre demande a été acceptée.`,
        'relation',
        '/contacts'
      );
    } catch (error) {
      console.error('Erreur lors de l’acceptation de la relation', error);
    }
  };

  const refuseRelation = async (relationId: number) => {
    try {
      await deleteRelation(relationId);
      setRelations((prev) => prev.filter((relation) => relation.id !== relationId));
    } catch (error) {
      console.error('Erreur lors du refus de la relation', error);
    }
  };

  return (
    <section className="p-4 bg-gray-100 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Demandes de relations</h3>
      <ul className="space-y-4">
        {requestedBackRelations.map((relation) => (
          <li
            key={relation.id}
            className="p-4 rounded shadow bg-gray-200 flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{relation.contactName}</p>
              <p className="text-sm text-gray-500">
                Demande de relation de <span className="font-bold">{relation.userTo.pseudo}</span>.
              </p>
            </div>
            <div>
              <button
                className="text-green-500 hover:text-green-700 mr-4"
                onClick={() => acceptRelation(relation.id)}
              >
                Accepter
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => refuseRelation(relation.id)}
              >
                Refuser
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RelationshipRequests;
