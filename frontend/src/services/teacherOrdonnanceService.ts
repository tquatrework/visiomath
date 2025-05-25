// src/services/teacherOrdonnanceService.ts
import apiSec from '../utils/tokenapi.utils';

// Récupérer une ordonnance enseignant par ID de profil
export const getTeacherOrdonnanceByProfileId = async (profileId: number) => {
  const { data } = await apiSec.get('teacher-ordonnances', {
    params: { profileId: profileId.toString() }
  });
  return Array.isArray(data) ? data[0] : data;
};

// Mettre à jour une ordonnance enseignant via PATCH
export const updateTeacherOrdonnance = async (id: number, updatedData: any) => {
  const { data } = await apiSec.patch(`teacher-ordonnances/${id}`, updatedData);
  return data;
};
