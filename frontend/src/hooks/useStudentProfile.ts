// src/hooks/useStudentProfile.ts
import { useState, useEffect } from "react";
import { getStudentProfileByProfileId, updateStudentProfile } from "../services/studentProfileService";

export const useStudentProfile = (profileId: number) => {
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const data = await getStudentProfileByProfileId(profileId);
      setStudentProfile(data);
    } catch (err) {
      setError("Erreur lors de la récupération du profil étudiant.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      setLoading(true);
      const updated = await updateStudentProfile(studentProfile.id, updatedData);
      setStudentProfile(updated);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil étudiant.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [profileId]);

  return { studentProfile, loading, error, handleUpdateProfile };
};
