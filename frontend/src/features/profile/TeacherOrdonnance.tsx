// src/features/profile/TeacherOrdonnance.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTeacherOrdonnance } from '../../hooks/useTeacherOrdonnance';

interface Props {
  data: any;
  readOnly?: boolean;
}

const TeacherOrdonnance: React.FC<Props> = ({ data, readOnly = false }) => {
  const profileId = data.profile.id;
  const { teacherOrdonnance, loading, error, handleUpdateOrdonnance } = useTeacherOrdonnance(profileId);
  const { register, handleSubmit, reset } = useForm({ defaultValues: teacherOrdonnance });

  useEffect(() => {
    if (teacherOrdonnance) reset(teacherOrdonnance);
  }, [teacherOrdonnance, reset]);

  const onSubmit = async (formData: any) => {
    if (readOnly) return;
    try {
      await handleUpdateOrdonnance({ ...formData, id: teacherOrdonnance.id });
      alert("Ordonnance mise à jour avec succès.");
    } catch (err) {
      console.error("Erreur de mise à jour :", err);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const renderField = (
    name: string,
    label: string,
    type: 'text' | 'textarea' = 'text',
    rows = 4
  ) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          {...register(name)}
          rows={rows}
          readOnly={readOnly}
          className={`w-full mt-1 p-2 border rounded-md ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      ) : (
        <input
          id={name}
          {...register(name)}
          type="text"
          readOnly={readOnly}
          className={`w-full mt-1 p-2 border rounded-md ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-6">Ordonnance de l’enseignant</h2>
      <div className="grid gap-6">
        {renderField('niveau_max_valide', 'Niveau maximal validé')}
        {renderField('public_type', 'Type de public')}
        {renderField('resultats_test', 'Résultats du test', 'textarea')}
        {renderField('commentaires_test', 'Commentaires du test', 'textarea')}
        {renderField('rempli_par', 'Rempli par')}
        {renderField('preco_pedagogiques', 'Préconisations pédagogiques', 'textarea')}
        {renderField('ameliorations_proposees', 'Améliorations proposées', 'textarea')}
      </div>
      {!readOnly && (
        <button type="submit" className="mt-6 block w-1/3 mx-auto py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sauvegarder
        </button>
      )}
    </form>
  );
};

export default TeacherOrdonnance;
