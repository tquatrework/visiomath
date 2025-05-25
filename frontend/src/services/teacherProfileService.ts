// src/services/teacherProfileService.ts
import apiSec from '../utils/tokenapi.utils';

// Récupération du profil enseignant par ID de profil
export const getTeacherProfileByProfileId = async (profileId: number) => {
  const { data } = await apiSec.get('teacher-profiles', {
    params: { profileId: profileId.toString() }
  });
  return Array.isArray(data) ? data[0] : data;
};

// Mise à jour d'un profil enseignant via PATCH
export const updateTeacherProfile = async (id: number, updatedData: any) => {
  const { data } = await apiSec.patch(`teacher-profiles/${id}`, updatedData);
  return data;
};
