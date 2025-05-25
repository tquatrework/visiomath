// src/hooks/useRelations.ts
import { useState, useEffect } from "react";
import { fetchRelationsFrom } from "../services/userRelationService";
import { useUser } from "../providers/UserContext";

export const useRelations = () => {
  const { connectedUserId: userId } = useUser();
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLocal = () => {
    const local = localStorage.getItem("user_relations");
    if (local) {
      setRelations(JSON.parse(local));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;

    loadLocal();

    const fetch = async () => {
      try {
        const remote = await fetchRelationsFrom(userId);
        setRelations(remote);
        localStorage.setItem("user_relations", JSON.stringify(remote));
      } catch {
        setError("Erreur lors de la récupération des relations");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  return { relations, setRelations, loading, error };
};
