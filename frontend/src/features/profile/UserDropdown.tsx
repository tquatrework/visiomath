import React, { useState, useEffect } from "react";
import { fetchProfileDropdownOptions } from "../../services/userProfileService";
import { useAuth } from "../../hooks/useAuth";

interface UserDropdownProps {
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ selectedUserId, setSelectedUserId }) => {
  const { role, loading, email } = useAuth();
  const [selectOptions, setSelectOptions] = useState([]);
  const [usePseudo, setUsePseudo] = useState(false);

  useEffect(() => {
    if (!loading && role) {
      fetchProfileDropdownOptions(role, usePseudo)
        .then((options) => setSelectOptions(options))
        .catch((error) =>
          console.error("Erreur lors du chargement des options :", error)
        );
    }
  }, [role, usePseudo, loading]);

  useEffect(() => {
    if (selectOptions.length === 1) {
      setSelectedUserId(selectOptions[0].id);
    }
  }, [selectOptions, setSelectedUserId]);

  return (
    <div className="flex items-center space-x-2">
      <div className="flex border border-gray-300 rounded-full overflow-hidden">
        <button
          onClick={() => setUsePseudo(false)}
          className={`px-4 py-2 ${!usePseudo ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Email
        </button>
        <button
          onClick={() => setUsePseudo(true)}
          className={`px-4 py-2 ${usePseudo ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Pseudo
        </button>
      </div>

      <select
        onChange={(e) => setSelectedUserId(e.target.value)}
        value={selectedUserId || ""}
        className="px-4 py-2 border border-gray-300 rounded-lg"
      >
        <option value="" disabled>
          Choisissez un profil accessible
        </option>
        {selectOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.identifyer}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserDropdown;
