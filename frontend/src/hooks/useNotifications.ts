// src/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import apiSec from "../utils/tokenapi.utils";

const useNotifications = (connectedUserId: number) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { data } = await apiSec.get("/notification-users", {
          params: { userId: connectedUserId.toString() }
        });
        setUnreadCount(data.filter((n: any) => !n.read).length);
      } catch (err) {
        console.error("Erreur notifications :", err);
      }
    };

    if (connectedUserId) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 20000);
      return () => clearInterval(interval);
    }
  }, [connectedUserId]);

  return unreadCount;
};

export default useNotifications;
