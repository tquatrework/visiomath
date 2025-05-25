// src/hooks/useProfileUser.ts
import { useState, useEffect } from "react";
import { fetchUserProfiles, fetchUserAvatar, updateUserAvatar } from "../services/userProfileService";
import { UserAdministrativeData } from "../types/user.types";

export const useProfileUser = (userId: string | null) => {
  const [userData, setUserData] = useState<UserAdministrativeData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [avatarTempUrl, setAvatarTempUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadingData(true);
      try {
        const data = await fetchUserProfiles(Number(userId));
        setUserData(data);

        if (data?.profile?.avatar) {
          const blob = await fetchUserAvatar(userId!);
          setAvatarTempUrl(URL.createObjectURL(blob));
        }
      } catch (e) {
        console.error("Erreur chargement user/avat.", e);
      } finally {
        setLoadingData(false);
      }
    };

    if (userId) load();
    else {
      setUserData(null);
      setAvatarTempUrl(null);
      setLoadingData(false);
    }
  }, [userId]);

  useEffect(() => {
    return () => {
      if (avatarTempUrl) URL.revokeObjectURL(avatarTempUrl);
    };
  }, [avatarTempUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await updateUserAvatar(Number(userId), formData);
      const blob = await fetchUserAvatar(userId!);
      setAvatarTempUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("Erreur upload avatar", err);
    }
  };

  return { userData, loadingData, avatarTempUrl, handleFileChange };
};
