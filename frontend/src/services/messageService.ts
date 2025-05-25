// src/services/messageService.ts
import apiSec from "../utils/tokenapi.utils";

export const fetchMessages = async (userId: number, filter: "date" | "userrelation") => {
  try {
    const { data } = await apiSec.get("/messages", {
      params: { userId: userId.toString(), filter }
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Erreur récupération messages :", err);
    return [];
  }
};

export const sendMessage = async ({
  senderId,
  recipientId,
  content
}: {
  senderId: number;
  recipientId: number;
  content: string;
}) => {
  try {
    const { data } = await apiSec.post("/messages", {
      senderId,
      receiverId: recipientId,
      content
    });
    return data;
  } catch {
    throw new Error("Impossible d'envoyer le message.");
  }
};
