import React from 'react';
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import apiSec from '../../utils/tokenapi.utils';

interface UploadFileComponentProps {
  category: string;
  subcategory: string;
//  comment?: string;
  onUpload: () => void;
}

const UploadFileComponent: React.FC<UploadFileComponentProps> = ({ category, subcategory, onUpload }) => {
  
  const { connectedUserId, userInfo, updateUserInfo } = useUser();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('category', category);  
    formData.append('subcategory', subcategory);
    formData.append('file', file);

    try {
      /* const response = await apiSec.post(`userfiles/upload/${connectedUserId}`, formData); */
      const response = await apiSec.post('userfiles/upload', { params: { userId: connectedUserId }, data: formData });
      if (response.status === 200 || response.status === 201) {
        alert('Fichier uploadé avec succès');
        onUpload();
      } else {
        console.error('Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };

  return (
    <div className="mt-4">
      <label className="block">
        <span className="text-gray-700">Ajouter un fichier {subcategory}</span>
        <input type="file" className="block mt-2" onChange={handleFileUpload} />
      </label>
    </div>
  );
};

export default UploadFileComponent;
