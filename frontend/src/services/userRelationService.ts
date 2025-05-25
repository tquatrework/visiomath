// src/services/userRelationService.ts
import apiSec from "../utils/tokenapi.utils";

export const createRelation = async ({
  connectedUser,
  inputValue,
  inputType,
  isRequest,
  isSymetricRequest
}) => {
  try {
    const payload = {
      connectedUserId: connectedUser.id,
      connectedUserRole: connectedUser.role,
      [inputType === "pseudo" ? "userPseudo" : "userMail"]: inputValue,
      isRequest,
      isSymetricRequest
    };

    const { data } = await apiSec.post(`userrelations/${inputType}`, payload);

    return data.success
      ? { success: true, message: "Relation créée avec succès." }
      : { success: false, message: data.message };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Erreur lors de la création de la relation."
    };
  }
};

export const checkTeacherSearch = async (studentId) => {
  const { data } = await apiSec.get(`/teacher-search/${studentId}`);
  return data.exists;
};

export const cancelTeacherSearch = async (studentId) => {
  await apiSec.delete(`/teacher-search/${studentId}`);
};

export const fetchRelationsFrom = async (userId) => {
  const { data } = await apiSec.get(`/userrelations`, {
    params: { userId: userId.toString(), direction: "from" }
  });
  return data;
};

export const fetchRelationsTo = async (userId) => {
  const { data } = await apiSec.get(`/userrelations`, {
    params: { userId: userId.toString(), direction: "to" }
  });
  return data;
};

export const updateRelation = async (relationId, updates) => {
  return await apiSec.patch(`userrelations/state/${relationId}`, updates);
};

export const deleteRelation = async (relationId) => {
  return await apiSec.delete(`userrelations/${relationId}`);
};
