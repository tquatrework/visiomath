import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConnectedUserId } from '../../services/userService';
import apiSec from '../../utils/tokenapi.utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { handleUserCreation } from '../../services/notificationService';
import { useRelations } from '../../hooks/useRelations';

// Types
interface Notification {
  id: number;
  message: string;
  type: string;
  actionMode: 'mono' | 'multi';
  actionLabel: string;
  url: string;
  params: Record<string, any>;
  createdAt: string;
}

interface NotificationUser {
  id: number;
  notification: Notification;
  read: boolean;
  actionDone: boolean;
}

const NotificationsList = () => {
  const [notificationUsers, setNotificationUsers] = useState<NotificationUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const connectedUserId = getConnectedUserId();
  const { relations } = useRelations();

  // Chargement des notifications
  useEffect(() => {
    const fetchNotificationUsers = async () => {
      try {
        const { data } = await apiSec.get('/notification-users', {
          params: { userId: connectedUserId }
        });
        setNotificationUsers(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotificationUsers();
  }, [connectedUserId]);

  // Marquer comme lue
  const markAsRead = async (notificationId: number) => {
    try {
      await apiSec.patch('/notification-users', null, {
        params: {
          notificationId,
          userId: connectedUserId,
          read: true
        }
      });

      setNotificationUsers(prev =>
        prev.map(nu =>
          nu.notification.id === notificationId ? { ...nu, read: true } : nu
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification', error);
    }
  };

  // Exécuter l'action associée
  const handleAction = async (notificationUser: NotificationUser) => {
    const { notification } = notificationUser;

    if (notification.url) {
      navigate(notification.url);
    } else {
      switch (notification.type) {
        case 'client_creation':
          await handleUserCreation(notificationUser);
          break;
        default:
          console.warn('Type de notification non pris en charge');
      }
    }

    setNotificationUsers(prev =>
      prev.map(nu =>
        nu.id === notificationUser.id ? { ...nu, actionDone: true } : nu
      )
    );

    const params: Record<string, any> = {
      notificationId: notification.id,
      actionDone: true,
      userId: connectedUserId // toujours requis, quel que soit le mode
    };
    if (notification.actionMode === 'multi') {
      params.userId = connectedUserId;
    }

    try {
      await apiSec.patch('/notification-users', null, { params });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'action', error);
    }
  };

  const canPerformAction = (notificationUser: NotificationUser): boolean => {
    return !notificationUser.actionDone;
  };

  if (loading) {
    return <p>Chargement des notifications...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Vos notifications</h2>
      {notificationUsers.length === 0 ? (
        <p>Aucune notification pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {notificationUsers.map((notificationUser) => {
            let message = notificationUser.notification.message;
            const match = message.match(/l'utilisateur (\d+)/);
            if (match) {
              const userId = parseInt(match[1], 10);
              const pseudo = relations.find(rel =>
                rel.userTo?.id === userId || rel.userFrom?.id === userId
              )?.userTo?.pseudo || relations.find(rel =>
                rel.userFrom?.id === userId
              )?.userFrom?.pseudo;

              if (pseudo) {
                message = message.replace(`l'utilisateur ${userId}`, pseudo);
              }
            }

            return (
              <li
                key={notificationUser.id}
                className={`p-4 rounded shadow ${notificationUser.read ? 'bg-gray-100' : 'bg-blue-50'} flex items-center justify-between`}
              >
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(notificationUser.notification.createdAt).toLocaleString()}
                  </p>
                  <p className="font-semibold">{notificationUser.notification.type}</p>
                  <p>{message}</p>
                </div>
                <div className="flex space-x-4">
                  {!notificationUser.read ? (
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => markAsRead(notificationUser.notification.id)}
                      title="Marquer comme lue"
                    >
                      <FaEye />
                    </button>
                  ) : (
                    <button className="text-gray-400" disabled title="Déjà lue">
                      <FaEyeSlash />
                    </button>
                  )}
                  {canPerformAction(notificationUser) && (notificationUser.notification.actionLabel ||
                    notificationUser.notification.url) && (
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleAction(notificationUser)}
                    >
                      {notificationUser.notification.actionLabel || 'Ouvrir'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
