import React, { useState, useEffect } from 'react';
import apiSec from '../../utils/tokenapi.utils';
import { fetchProfileDropdownOptions } from '../../services/userProfileService';
import { Relation } from '../../types/userrelation.types';
import { userfileCategories } from '../../types/userfile.types';

const SendUserFileComponent: React.FC = () => {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [selectedRelation, setSelectedRelation] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [usePseudo, setUsePseudo] = useState<boolean>(true); // Nouvel état pour choisir pseudo ou email

  const role = 'parent'; // Changez ce rôle selon vos besoins

  useEffect(() => {
    // Charger les relations via fetchProfileDropdownOptions
    const loadRelations = async () => {
      try {
        const options = await fetchProfileDropdownOptions(role, usePseudo);
        setRelations(
          options.map((option: any) => ({
            id: option.id,
            email: option.identifyer,
            pseudo: option.identifyer, // Utilise le même champ pour simplifier
            relationState: 'current',
            //userFrom: { id: option.userFromId, pseudo: option.userFromPseudo, email: option.userFromEmail },
            //userTo: { id: option.userToId, pseudo: option.userToPseudo, email: option.userToEmail },
          }))
        );
      } catch (error) {
        console.error('Erreur lors du chargement des relations :', error);
      }
    };
    loadRelations();
  }, [role, usePseudo]); // Recharger les relations lorsque `usePseudo` change

  // Gérer l'envoi du fichier
  const handleFileUpload = async () => {
    if (!selectedRelation) {
      alert('Veuillez sélectionner une relation.');
      return;
    }
    if (!file) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    //formData.append('relationId', selectedRelation);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('comment', comment);
    formData.append('file', file);

    try {
      /* const response = await apiSec.post(`userfiles/upload/${selectedRelation}`, formData); */
      const response = await apiSec.post('userfiles/upload', { params: { userId: selectedRelation }, data: formData });
      if (response.status === 200 || response.status === 201) {
        alert('Fichier envoyé avec succès !');
        setCategory('');
        setSubcategory('');
        setComment('');
        setFile(null);
      } else {
        console.error("Erreur lors de l'envoi du fichier");
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
    }
  };

  // Liste des catégories disponibles pour l'envoi
  const availableCategories = ['pedagogic', 'financial', 'other'];

  // Fonction pour obtenir les sous-catégories en fonction de la catégorie choisie
  const getSubcategories = () => {
    if (category === 'pedagogic') {
      return userfileCategories.pedagogic;
    } else if (category === 'financial') {
      return userfileCategories.financial;
    } else if (category === 'other') {
      return userfileCategories.other;
    } else {
      return [];
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Envoi de Documents</h1>

      {/* Toggle pour utiliser pseudo ou email */}
      <div className="inline-flex border border-gray-300 rounded-full overflow-hidden mb-4 w-fit">
        <button
          onClick={() => setUsePseudo(false)}
          className={`px-4 py-2 ${!usePseudo ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Email
        </button>
        <button
          onClick={() => setUsePseudo(true)}
          className={`px-4 py-2 ${usePseudo ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pseudo
        </button>
      </div>

      {/* Liste déroulante des relations */}
      <label className="block mb-4">
        <span className="text-gray-700">Sélectionnez une relation :</span>
        <select
          className="block w-full mt-2 border-gray-300 rounded"
          value={selectedRelation ?? ''}
          onChange={(e) => setSelectedRelation(Number(e.target.value))}
        >
          <option value="">-- Sélectionner --</option>
          {relations.map((relation) => (
            <option key={relation.id} value={relation.id}>
              {usePseudo ? relation.pseudo : relation.email}
            </option>
          ))}
        </select>
      </label>

      {/* Sélection de la catégorie */}
      <div className="mb-4">
        <label className="block mb-2">
          <span className="text-gray-700">Catégorie :</span>
          <select
            className="block w-full mt-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Sélectionner une catégorie --</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'pedagogic' ? 'Pédagogique' : cat === 'financial' ? 'Financier' : 'Autres'}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Sélection de la sous-catégorie */}
      <div className="mb-4">
        <label className="block mb-2">
          <span className="text-gray-700">Sous-catégorie :</span>
          <select
            className="block w-full mt-2 border-gray-300 rounded"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            <option value="">-- Sélectionner une sous-catégorie --</option>
            {getSubcategories().map((subcat, index) => (
              <option key={index} value={subcat}>
                {subcat}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Commentaire */}
      <div className="mb-4">
        <label className="block mb-2">
          <span className="text-gray-700">Commentaire :</span>
          <textarea
            className="block w-full mt-2 border-gray-300 rounded"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire (facultatif)"
          />
        </label>
      </div>

      {/* Upload du fichier */}
      <div className="mb-4">
        <label className="block mb-2">
          <span className="text-gray-700">Fichier :</span>
          <input
            type="file"
            className="block w-full mt-2"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </label>
      </div>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleFileUpload}
      >
        Envoyer le document
      </button>
    </div>
  );
};

export default SendUserFileComponent;
