// src/hooks/useTeacherProfile.ts
import { useState, useEffect } from "react";
import {
  getTeacherProfileByProfileId,
  updateTeacherProfile
} from "../services/teacherProfileService";

export const useTeacherProfile = (profileId: number) => {
  const [teacherProfile, setTeacherProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getTeacherProfileByProfileId(profileId);
        setTeacherProfile(data);
      } catch {
        setError("Erreur lors de la récupération du profil enseignant.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [profileId]);

  const handleUpdateProfile = async (updatedData: any) => {
    try {
      setLoading(true);
      const updated = await updateTeacherProfile(teacherProfile.id, updatedData);
      setTeacherProfile(updated);
    } catch {
      setError("Erreur lors de la mise à jour du profil enseignant.");
    } finally {
      setLoading(false);
    }
  };

  return { teacherProfile, loading, error, handleUpdateProfile };
};
