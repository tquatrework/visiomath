// src/features/profile/StudentOrdonnance.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStudentOrdonnance } from "../../hooks/useStudentOrdonnance";

interface StudentOrdonnanceProps {
  data: any;
  readOnly?: boolean;
}

const StudentOrdonnance: React.FC<StudentOrdonnanceProps> = ({ data, readOnly = false }) => {
  const profileId = data.profile.id;
  const { studentOrdonnance, loading, error, handleUpdateOrdonnance } = useStudentOrdonnance(profileId);
  const { register, handleSubmit, reset } = useForm({ defaultValues: studentOrdonnance });

  useEffect(() => {
    if (studentOrdonnance) reset(studentOrdonnance);
  }, [studentOrdonnance, reset]);

  const onSubmit = async (formData: any) => {
    if (!readOnly) await handleUpdateOrdonnance(formData);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Ordonnances</h2>
      <div className="grid grid-cols-1 gap-6">
        {[
          { id: "consideration_generale", label: "Considérations Générales", textarea: true },
          { id: "preco_rythme", label: "Préconisations : Rythme" },
          { id: "preco_type_formateur", label: "Préconisations : Type de Formateur" },
          { id: "preco_parcours", label: "Préconisations : Parcours" },
          { id: "preco_activites", label: "Préconisations : Activités", textarea: true },
          { id: "preco_ressources", label: "Préconisations : Ressources pédagogiques", textarea: true },
          { id: "preco_amenagements", label: "Préconisations : Aménagements spécifiques", textarea: true }
        ].map(({ id, label, textarea }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            {textarea ? (
              <textarea
                id={id}
                {...register(id)}
                rows={4}
                readOnly={readOnly}
                className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`}
              />
            ) : (
              <input
                id={id}
                {...register(id)}
                type="text"
                readOnly={readOnly}
                className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`}
              />
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button type="submit" className="mt-6 mx-auto block w-1/3 py-2 px-4 bg-blue-500 text-white rounded-md">
          Sauvegarder
        </button>
      )}
    </form>
  );
};

export default StudentOrdonnance;
