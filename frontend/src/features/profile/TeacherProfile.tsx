// src/features/profile/TeacherProfile.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTeacherProfile } from "../../hooks/useTeacherProfile";

interface TeacherProfileProps {
  data: any;
  readOnly?: boolean;
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ data, readOnly = false }) => {
  if (!data || !data.profile) return <div>Chargement du profil enseignant...</div>;
  const profileId = data.profile.id;
  const { teacherProfile, loading, error, handleUpdateProfile } = useTeacherProfile(profileId);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: teacherProfile,
  });

  useEffect(() => {
    if (teacherProfile) {
      reset(teacherProfile);
    }
  }, [teacherProfile, reset]);

  const onSubmit = async (formData: any) => {
    if (readOnly) return;
    try {
      await handleUpdateProfile(formData);
      alert("Profil enseignant mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil enseignant :", error);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Profil Enseignant</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Spécialités */}
        <div>
          <label htmlFor="specialites" className="block text-sm font-medium text-gray-700">
            Spécialités
          </label>
          <textarea
            id="specialites"
            {...register("specialites")}
            rows={4}
            className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            readOnly={readOnly}
          />
        </div>

        {/* Années d'expérience */}
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Années d'expérience
          </label>
          <input
            id="experience"
            {...register("experience")}
            type="number"
            className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            readOnly={readOnly}
          />
        </div>

        {/* Diplômes */}
        <div>
          <label htmlFor="diplomes" className="block text-sm font-medium text-gray-700">
            Diplômes
          </label>
          <textarea
            id="diplomes"
            {...register("diplomes")}
            rows={4}
            className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            readOnly={readOnly}
          />
        </div>

        {/* Modalités d'enseignement */}
        <div>
          <label htmlFor="modalites" className="block text-sm font-medium text-gray-700">
            Modalités d'enseignement
          </label>
          <textarea
            id="modalites"
            {...register("modalites")}
            rows={4}
            className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            readOnly={readOnly}
          />
        </div>
      </div>

      {!readOnly && (
        <button
          type="submit"
          className="mt-6 mx-auto block w-1/3 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sauvegarder
        </button>
      )}
    </form>
  );
};

export default TeacherProfile;
