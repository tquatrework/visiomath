// src/services/notificationService.ts
import apiSec from "../utils/tokenapi.utils";
import { getConnectedUserId, getUserInfo } from "./userService";

export const createOneNotification = async (
  userId: number,
  message: string,
  type: string,
  url: string,
  params: any,
  actionMode: string
) => {
  return apiSec.post("notifications", { userIds: [userId], message, type, url, params, actionMode });
};

export const createMultiConfirmation = async (userId: number, message: string, type = "message") => {
  await createOneNotification(userId, message, type, "", {}, "");
};

export const createMonoConfirmation = async (
  notificationId: number,
  messageOthers: string,
  mainUserId: number,
  messageUser = "",
  type = "message"
) => {
  const { data } = await apiSec.get("/notification-users", {
    params: { notificationId: notificationId.toString() }
  });

  const userIds = data.map((nu: any) => nu.user.id).filter((id: number) => id !== mainUserId);
  if (mainUserId) await createOneNotification(mainUserId, messageUser, type, "", {}, "");

  return apiSec.post("notifications", {
    userIds,
    message: messageOthers,
    type,
    url: "",
    params: {},
    actionMode: ""
  });
};

export const checkTeacherSearch = async (studentId: number) => {
  const { data } = await apiSec.get(`/teacher-search/${studentId}`);
  return data.exists;
};

export const cancelTeacherSearch = async (studentId: number) => {
  await apiSec.delete(`/teacher-search/${studentId}`);
};

export const updateRelation = async (relationId: number, updates: Partial<{ relationState: string }>) => {
  return apiSec.patch(`userrelations/state/${relationId}`, updates);
};

export const deleteRelation = async (relationId: number) => {
  return apiSec.delete(`userrelations/${relationId}`);
};

export const fetchRelationsFrom = async (userId: number) => {
  const { data } = await apiSec.get("/userrelations", {
    params: { userId: userId.toString(), direction: "from" }
  });
  return data;
};

export const fetchRelationsTo = async (userId: number) => {
  const { data } = await apiSec.get("/userrelations", {
    params: { userId: userId.toString(), direction: "to" }
  });
  return data;
};

export const handleUserCreation = async (notificationUser: any) => {
  try {
    const connectedUserId = getConnectedUserId();
    const connectedUserInfo = await getUserInfo();

    const { data: newRelation } = await apiSec.post("userrelations/pseudo", {
      connectedUserId,
      connectedUserRole: connectedUserInfo.role,
      userPseudo: notificationUser.notification.params.userPseudo,
      isRequest: false
    });

    const current = JSON.parse(localStorage.getItem("user_relations") || "[]");
    localStorage.setItem("user_relations", JSON.stringify([...current, newRelation]));

    const msgOthers = `L'utilisateur ${notificationUser.notification.params.userPseudo} a été pris en charge.`;
    const msgUser = `Vous avez pris en charge l'utilisateur ${notificationUser.notification.params.userPseudo}.`;

    await createMonoConfirmation(notificationUser.notification.id, msgOthers, connectedUserId, msgUser, "user_managed");

    return { success: true, message: "Relation créée et notifications envoyées." };
  } catch (err) {
    console.error("Erreur gestion création user", err);
    return { success: false, message: "Erreur lors de la prise en charge." };
  }
};
