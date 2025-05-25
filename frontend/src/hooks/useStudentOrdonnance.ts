// src/hooks/useStudentOrdonnance.ts
import { useState, useEffect } from "react";
import {
  getStudentOrdonnanceByProfileId,
  updateStudentOrdonnance
} from "../services/studentOrdonnanceService";

export const useStudentOrdonnance = (profileId: number) => {
  const [studentOrdonnance, setStudentOrdonnance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentOrdonnance = async () => {
    try {
      setLoading(true);
      const result = await getStudentOrdonnanceByProfileId(profileId);
      setStudentOrdonnance(result[0]);
    } catch {
      setError("Erreur lors du chargement de l'ordonnance.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrdonnance = async (updatedData: any) => {
    try {
      setLoading(true);
      const updated = await updateStudentOrdonnance(studentOrdonnance.id, updatedData);
      setStudentOrdonnance(updated);
      alert("Ordonnance mise à jour avec succès !");
    } catch {
      setError("Erreur lors de la mise à jour de l'ordonnance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentOrdonnance();
  }, [profileId]);

  return { studentOrdonnance, loading, error, handleUpdateOrdonnance };
};
