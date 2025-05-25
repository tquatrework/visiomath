import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../providers/UserContext";
import { ChatBubbleLeftIcon, VideoCameraIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { handleLogout } from "../../services/authService";
import NotificationBadge from './NotificationBadge'; // Importer le badge de notification

const headerButtons = [
  { icon: "🔒", url: "/logout", tooltip: "Déconnexion", bgColor: "bg-blue-600", hoverColor: "hover:bg-green-400" },
  { icon: "👤", url: "/profile", tooltip: "Profil", bgColor: "bg-blue-600", hoverColor: "hover:bg-green-400" },
//  { icon: "🔔", url: "/notifications", tooltip: "Notifications", bgColor: "bg-blue-600", hoverColor: "hover:bg-green-400" },
  { icon: "📄", url: "/userfiles", tooltip: "Documents", bgColor: "bg-blue-600", hoverColor: "hover:bg-green-400" },
  { icon: "❓", url: "/support", tooltip: "Support", bgColor: "bg-blue-600", hoverColor: "hover:bg-green-400" },
];

const rightIcons = [
  { icon: <VideoCameraIcon className="h-6 w-6" />, tooltip: "Visio", url: "/visio" },
  { icon: <ChatBubbleLeftIcon className="h-6 w-6" />, tooltip: "Chat", url: "/chat" },
  { icon: <UserGroupIcon className="h-6 w-6" />, tooltip: "Contacts", url: "/contacts" },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { connectedUserId, userInfo, updateUserInfo, logout } = useUser();

  console.log('connectedUserId-Header', connectedUserId);
  
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white shadow-lg">
      {/* Logo */}
      {/* <div className="text-2xl font-bold tracking-wide">VisioMath</div>*/ }
      <button
        onClick={() => navigate('/user-space')}
        className="text-2xl font-bold tracking-wide focus:outline-none"
        title="Retour à l'accueil"
      >
        VisioMath
      </button>

      {/* Header Buttons */}
      <div className="flex space-x-4">
        {headerButtons.map((button, index) => (
          <button
            key={index}
            className={`p-3 text-lg text-white rounded-full shadow-md ${button.bgColor} ${button.hoverColor}`}
            onClick={() => {
              if (button.url === '/logout') {
                handleLogout(navigate, logout); // Appeler la déconnexion
              } else {
                navigate(button.url); // Naviguer vers l'autre route
              }
            }}
            title={button.tooltip}
          >
            {button.icon}
          </button>
        ))}
      </div>

      {/* Icônes à droite */}
      <div className="flex space-x-4">
        {rightIcons.map((icon, index) => (
          <button
            key={index}
            className="p-2 bg-transparent hover:bg-green-500 rounded-full transition-transform transform hover:scale-110 duration-200"
            onClick={() => navigate(icon.url)}
            title={icon.tooltip}
          >
            {icon.icon}
          </button>
        ))}

        {/* Notification Badge */}
        <NotificationBadge connectedUserId={connectedUserId} />
        {/* <NotificationBadge connectedUserId={connectedUserId} />  */} {/* Passer l'ID de l'utilisateur ici */}
      </div>
    </header>
  );
};

export default Header;
