// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import { Navigate } from 'react-router-dom';
import { AuthPage } from '../features/auth/pages/AuthPage';
import AppLayout from '../components/layout/AppLayout'; // Import de l'AppLayout
import UserSpace from '../features/user/UserSpace'; // Espace utilisateur existant
import Dashboard from '../features/dashboard/Dashboard'; // Une autre page exemple
import Calendar from '../features/calendar/Calendar'; // Une autre page exemple
import NotificationsList from '../features/notification/NotificationsList'; // Une autre page exemple
import UserProfile from '../features/profile/Profile';
import Contacts from '../features/contacts/Contacts';
import UserFilesManager from '../features/userfiles/UserFilesManager';
import Exercises from '../features/exercise/Exercises';
import MessageWindow from '../features/messages/MessageWindow';

export const router = createBrowserRouter([
  // Route publique : Authentification
  {
    path: "/connect",
    element: <AuthPage />,
  },

  // Route privée : Encapsule toutes les pages avec AppLayout
  {
    path: "/",
    element: <AppLayout />, // AppLayout constant
    children: [
      {
        path: "/",
        element: <ProtectedRoute />, // Vérifie l'authentification pour toutes les routes suivantes
        children: [
          {
            path: "/",
            element: <Navigate to="/user-space" />, // Redirige vers /user-space par défaut
          },
          

          // routes du menu latéral
          {
            path: "/user-space",
            element: <UserSpace />, // Page par défaut après authentification
          },
          {
            path: "/calendar",
            element: <Calendar />,
          },

          {
            path: "/exercises",
            element: <Exercises />,
          },

          // Routes du menu principal (en haut)
          {
            path: "/profile",
            element: <UserProfile />,
          },
          {
            path: "/contacts",
            element: <Contacts />,
          },
          {
            path: "/userfiles",
            element: <UserFilesManager />,
          },
          {
            path: "/chat",
            element: <MessageWindow />,
          },
          {
            path: "/notifications",
            element: <NotificationsList />,
          },

        ],
      },
    ],
  },
]);
