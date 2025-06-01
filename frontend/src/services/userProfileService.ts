// src/services/userProfileService.ts
import apiSec from "../utils/tokenapi.utils";

// 🔽 Dropdown options selon le rôle utilisateur
export const fetchProfileDropdownOptions = async (role: string, usePseudo: boolean): Promise<any[]> => {
  const userInfo = JSON.parse(localStorage.getItem("user_info") || "{}");
  const userRelations = JSON.parse(localStorage.getItem("user_relations") || "[]");
  const identifyerKey = usePseudo ? "pseudo" : "email";
  const self = { id: userInfo.id, identifyer: userInfo[identifyerKey] };

  const mapRelations = (type: string) =>
    userRelations
      .filter(r => r.relationType === type && r.relationState === "current")
      .map(r => ({ id: r.userTo.id, identifyer: r.userTo[identifyerKey] }));

  switch (role) {
    case "student":
    case "teacher":
      return [self];
    case "parent":
      return [self, ...mapRelations("is_parent_of")];
    case "pedagogical_animator":
      return [self, ...mapRelations("is_animator_of")];
    case "pedagogical_manager":
      return [self, ...mapRelations("is_manager_of")];
    default:
      throw new Error(`Rôle inconnu: ${role}`);
  }
};

// 🔽 Requête profil simple
export const fetchUserProfiles = async (userId: number) => {
  const { data } = await apiSec.get("userprofiles", {
    params: { userId: userId.toString() }
  });
  return data;
};

// 🔼 Initialisation complète du profil utilisateur
export const initializeUserProfile = async () => {
  return apiSec.post("/userprofiles/init");
};

// 🔼 Update partiel du profil
export const updateUserProfile = async (userId: number, data: any) => {
  const { data: updated } = await apiSec.patch(`userprofiles`, data, {
    params: { userId: userId.toString() }
  });
  return updated;
};


// 🔽 Requête profil complet
export const fetchAllUserProfiles = async (userId: number) => {
  const { data } = await apiSec.get("userprofiles/full", {
    params: { userId: userId.toString() }
  });
  return data;
};

// 🔼 Update complet du profil
export const updateAllUserProfile = async (userId: number, updateData: any) => {
  const { data } = await apiSec.patch("userprofiles/full", null, {
    params: { userId: userId.toString() },
    data: updateData
  });
  return data;
};

// 📤 Avatar : envoi
export const updateUserAvatar = async (userId: number, formData: FormData): Promise<void> => {
  await apiSec.put("userprofiles/upload-avatar", formData, {
    params: { userId: userId.toString() },
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// 📥 Avatar : récupération
export const fetchUserAvatar = async (userId: string): Promise<Blob> => {
  const { data } = await apiSec.get("userprofiles/user/avatar", {
    params: { userId: userId.toString() },
    responseType: "blob"
  });
  return data;
};
