// src/features/profile/Profile.tsx
import React, { useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import AddRelationWindow from "./AddRelationWindow";
import AdministrativeProfile from "./AdministrativeProfile";
import PedagogicalProfile from "./PedagogicalProfile";
import FinancialProfile from "./FinancialProfile";
import { useAuth } from "../../hooks/useAuth";
import { useProfileUser } from "../../hooks/useProfileUser";
import UserDropdown from "./UserDropdown";

const UserProfile = () => {
  const { connectedUserId, role, loading, isAuthenticated, email } = useAuth();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState(connectedUserId);

  const { userData, loadingData, handleFileChange, avatarTempUrl, refetchUserData } = useProfileUser(selectedProfileId);

  if (loading) return <p>Chargement en cours...</p>;
  if (!isAuthenticated) return <p>Veuillez vous connecter.</p>;

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-700 border-b pb-4">Mes Profils</h2>

      <div className="flex justify-between items-center mb-6 px-6">
        <p className="text-gray-600 text-left max-w-xs">Identifiant : {email}</p>

        <UserDropdown
          selectedUserId={selectedProfileId}
          setSelectedUserId={setSelectedProfileId}
        />

        <AddRelationWindow usePseudo={false} connectedUser={{ id: connectedUserId, role }} />
      </div>

      <Tabs selectedIndex={tabIndex} onSelect={setTabIndex}>
        <TabList className="flex border-b border-gray-200">
          {['Profil Administratif', 'Profil Pédagogique', 'Profil Financier'].map((label, idx) => (
            <Tab
              key={label}
              className={`cursor-pointer py-2 px-4 ${tabIndex === idx ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
            >
              {label}
            </Tab>
          ))}
        </TabList>

        <TabPanel className="p-4">
          <AdministrativeProfile
            data={{ ...userData, avatarTempUrl, refetchUserData }}
            role={userData?.user.role}
            handleFileChange={handleFileChange}
          />
        </TabPanel>
        <TabPanel className="p-4">
          <PedagogicalProfile data={userData} />
        </TabPanel>
        <TabPanel className="p-4">
          <FinancialProfile data={userData} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default UserProfile;
