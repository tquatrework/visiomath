import React, { ReactNode } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { Outlet } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode; // Les enfants sont de type ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto bg-white shadow-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
