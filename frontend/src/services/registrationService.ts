import axios from "axios"; // Importez axios
import API_URL from "../config/api.config";
import apiSec from "../utils/tokenapi.utils";

export const createUserRelations = async (
  userId: number,
  role: string,
  pseudo: string,
  targetRoles: string[],
  token: string // Ajout du token
) => {
  if (!userId || !role || targetRoles.length === 0) return;

  try {
    // Étape 1 : Récupérer tous les utilisateurs correspondant aux rôles cibles
    const response = await apiSec.get(`${API_URL}/roles/${targetRoles.join(",")}`);
    const targetUsers = response.data;

    // Étape 2 : Créer des relations pour chaque utilisateur cible
    for (const targetUser of targetUsers) {
      const directRelation = {
        userFrom: userId,
        userTo: targetUser.id,
        relationType: "is_manager_of",
        relationState: "current",
      };

      const inverseRelation = {
        userFrom: targetUser.id,
        userTo: userId,
        relationType: "is_managed_by",
        relationState: "current",
      };

      // Création des relations directes et inverses
      await apiSec.post(`${API_URL}/userrelations`, directRelation);
      await apiSec.post(`${API_URL}/userrelations`, inverseRelation);
    }

    // Étape 3 : Envoyer une notification à tous les utilisateurs cibles
    const message = `Un nouvel utilisateur : ${pseudo} de type ${role} vient de s'enregistrer`;
    console.log("Envoi de la notification :", message);


    //for (const targetUser of targetUsers) {
      const notification = {
        userIds: targetUsers.map((targetUser) => targetUser.id),
        type: "message",
        message: message,
        read: false, // Par défaut, la notification n'est pas lue
        createdAt: new Date().toISOString(), // Timestamp de création
      };

    await apiSec.post(`${API_URL}/notifications`, notification);

    console.log("Relations créées avec succès.");
  } catch (error) {
    console.error("Erreur lors de la création des relations utilisateur :", error);
    throw new Error("Impossible de créer les relations utilisateur.");
  }
};
