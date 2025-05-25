// src/services/studentOrdonnanceService.ts
import apiSec from "../utils/tokenapi.utils";

export const getStudentOrdonnanceByProfileId = async (profileId: number) => {
  const { data } = await apiSec.get('student-ordonnances', {
    params: { profileId: profileId.toString() }
  });
  return data;
};

export const updateStudentOrdonnance = async (id: number, updatedData: any) => {
  const { data } = await apiSec.patch(`student-ordonnances/${id}`, updatedData);
  return data;
};
