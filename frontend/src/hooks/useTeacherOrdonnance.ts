// src/hooks/useTeacherOrdonnance.ts
import { useState, useEffect } from 'react';
import {
  getTeacherOrdonnanceByProfileId,
  updateTeacherOrdonnance
} from '../services/teacherOrdonnanceService';

export const useTeacherOrdonnance = (profileId: number) => {
  const [teacherOrdonnance, setTeacherOrdonnance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherOrdonnance = async () => {
    try {
      setLoading(true);
      const data = await getTeacherOrdonnanceByProfileId(profileId);
      setTeacherOrdonnance(data);
    } catch {
      setError("Erreur lors de la récupération de l’ordonnance.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrdonnance = async (update: any) => {
    if (!teacherOrdonnance?.id) return;
    try {
      setLoading(true);
      const updated = await updateTeacherOrdonnance(teacherOrdonnance.id, update);
      setTeacherOrdonnance(updated);
    } catch {
      setError("Erreur lors de la mise à jour de l’ordonnance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherOrdonnance();
  }, [profileId]);

  return { teacherOrdonnance, loading, error, handleUpdateOrdonnance };
};
