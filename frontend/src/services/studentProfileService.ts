// src/services/studentProfileService.ts
import apiSec from "../utils/tokenapi.utils";

export const getStudentProfileByProfileId = async (profileId: number) => {
  const { data } = await apiSec.get("student-profiles", {
    params: { profileId: profileId.toString() }
  });
  return data[0];
};

export const updateStudentProfile = async (id: number, updatedData: any) => {
  const { data } = await apiSec.patch(`student-profiles/${id}`, updatedData);
  return data;
};
