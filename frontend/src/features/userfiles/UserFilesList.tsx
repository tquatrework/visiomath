import React, { useEffect, useState } from 'react';
import UploadFileComponent from './UploadFileComponent'; // Sous-composant pour l'upload
import apiSec from '../../utils/tokenapi.utils';
import { UserFile } from '../../types/userfiles.types';
import { useAuth } from '../../hooks/useAuth';

interface UserFilesListProps {
    category: string;
    subcategories: string[];
}

const UserFilesList: React.FC<UserFilesListProps> = ({ category, subcategories }) => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);

  const { userId, loading: authLoading } = useAuth();

  const fetchFiles = async () => {
    try {
      /* const response = await apiSec.get('userfiles/files'); */
      const response = await apiSec.get('userfiles/files', { params: { userId: userId.toString() }, });
      if (response.status === 200) {
        setFiles(response.data);
      } else {
        console.error('Erreur lors de la récupération des fichiers');
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || authLoading) return;
    fetchFiles();
  }, [userId, authLoading]);

  const handleDeleteFile = async (fileId: string) => {
    try {
      /* const response = await apiSec.delete(`userfiles/files/${fileId}`); */
      const response = await apiSec.delete('userfiles/files', { params: { fileId } });
      if (response.status === 200) {
        setFiles((prev) => prev.filter((file) => file.id !== fileId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      /* const response = await apiSec.get(`userfiles/files/download/${fileId}`, { responseType: 'blob' }); */
      const response = await apiSec.get('userfiles/files/download', { params: { fileId: fileId.toString() }, responseType: 'blob' });
          // Récupérer le nom de fichier depuis l'en-tête Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      
    let fileName = 'downloaded_file';

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+?)"/);
        console.log('match', match);
      if (match && match[1]) { 
        fileName = decodeURIComponent(match[1]); // Décoder le nom si encodé
      }
    }

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  return (
    <div className="mt-6">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        subcategories.map((subcategory) => (
          <div key={subcategory} className="mb-6">
            <h2 className="text-lg font-semibold">{subcategory}</h2>
            <ul className="list-disc ml-4 space-y-2">
              {files
                .filter((file) => file.category === category && file.subcategory === subcategory)
                .map((file) => (
                  <li key={file.id} className="flex justify-between items-center">
                    <span>{file.name.substring(14)}</span>
                    <div className="flex space-x-2">
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleDownloadFile(file.id)}
                      >
                        Télécharger
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
            {/* **Ajout du composant UploadFileComponent pour chaque sous-catégorie** */}
                <UploadFileComponent category={category} subcategory={subcategory} onUpload={fetchFiles} />
          </div>
        ))
      )}
    </div>
  );
};

export default UserFilesList;
