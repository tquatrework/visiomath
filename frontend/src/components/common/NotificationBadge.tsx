import React from 'react';
import { FaBell } from 'react-icons/fa'; // Vous pouvez utiliser n'importe quelle icône de votre choix
import useNotifications from '../../hooks/useNotifications'; // Import du hook personnalisé
import { useNavigate } from 'react-router-dom';

interface NotificationBadgeProps {
  connectedUserId: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ connectedUserId }) => {
  // Utilisation du hook pour obtenir le nombre de notifications non lues
  const navigate = useNavigate();
  const unreadCount = useNotifications(connectedUserId);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{ background: 'transparent', border: 'none', position: 'relative', cursor: 'pointer' }}
        onClick={() => navigate('/notifications')} // Redirection au clic
        title="Voir les notifications"
      >
        <FaBell size={30} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'red',
              color: 'white',
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: '20px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBadge;
