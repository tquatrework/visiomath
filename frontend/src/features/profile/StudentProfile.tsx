// src/features/profile/StudentProfile.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { updateStudentProfile } from "../../services/studentProfileService";
import { createOneNotification } from "../../services/notificationService";

interface StudentProfileProps {
  data: any;
  readOnly?: boolean;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ data, readOnly = false }) => {
  const profileId = data.profile.id;
  const { studentProfile, loading, error, handleUpdateProfile } = useStudentProfile(profileId);
  const [isModalOpen, setModalOpen] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState(data.profile.teacherSearch || false);

  const { register, handleSubmit, reset, watch, getValues } = useForm({ defaultValues: studentProfile });

  useEffect(() => {
    if (studentProfile) {
      reset(studentProfile);
      setTeacherSearch(studentProfile.teacherSearch || false);
    }
  }, [studentProfile, reset]);

  const onSubmit = async (formData: any) => {
    try {
      await handleUpdateProfile(formData);
      alert("Profil étudiant mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  const handleRequestProfessor = () => setModalOpen(true);

  const handleConfirmRequest = async () => {
    const { calendarUpdated } = getValues();
    if (!calendarUpdated) {
      alert("Vous devez valider la case à cocher avant de confirmer.");
      return;
    }

    setModalOpen(false);
    try {
      await updateStudentProfile(studentProfile.id, { teacherSearch: true });
      setTeacherSearch(true);

      await createOneNotification(
        data.user.id,
        `L'étudiant ${data.user.pseudo} demande à être mis en relation avec un nouveau professeur.`,
        "teacher_request",
        "/Contacts",
        { userId: data.user.id },
        "mono"
      );
      alert("Votre demande a été envoyée avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande :", err);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const difficulteVisible = watch("difficultes_visible", studentProfile?.difficultes_visible);
  const contexteVisible = watch("contexte_visible", studentProfile?.contexte_visible);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative p-6 bg-white shadow-md rounded-lg">
      {!readOnly && (
        teacherSearch ? (
          <span className="absolute top-4 right-4 px-3 py-1 text-sm bg-orange-500 text-white rounded-md shadow">
            Recherche professeur en cours...
          </span>
        ) : (
          <button
            type="button"
            onClick={handleRequestProfessor}
            className="absolute top-4 right-4 p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
          >
            Demander un professeur
          </button>
        )
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirmez-vous la demande ?</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <input type="checkbox" {...register("calendarUpdated")} className="mr-2" />
              Vérifiez que votre calendrier est à jour.
            </label>
            <label className="block text-sm font-medium text-gray-700">Message particulier :</label>
            <textarea {...register("customMessage")} rows={4} className="w-full mt-1 p-2 border rounded-md mb-4" />
            <div className="flex justify-end">
              <button onClick={() => setModalOpen(false)} className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
              <button onClick={handleConfirmRequest} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Générales</h2>

      <div className="mb-4">
        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700">Niveau (Classe)</label>
        <input id="niveau" {...register("niveau")} type="text" readOnly={readOnly} className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`} />
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input type="checkbox" {...register("difficultes_visible")} disabled={readOnly} className="mr-2 h-4 w-4" />
          Masquer Difficultés
        </label>
        {(!difficulteVisible || readOnly) && (
          <textarea {...register("difficultes")} rows={4} readOnly={readOnly} className={`w-full mt-2 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`} />
        )}
      </div>

      <div className="mb-4">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input type="checkbox" {...register("contexte_visible")} disabled={readOnly} className="mr-2 h-4 w-4" />
          Masquer Contexte
        </label>
        {(!contexteVisible || readOnly) && (
          <textarea {...register("contexte")} rows={4} readOnly={readOnly} className={`w-full mt-2 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`} />
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="objectifs" className="block text-sm font-medium text-gray-700">Objectifs</label>
        <textarea id="objectifs" {...register("objectifs")} rows={4} readOnly={readOnly} className={`w-full mt-1 p-2 border rounded-md ${readOnly ? "bg-gray-100" : ""}`} />
      </div>

      {!readOnly && (
        <div className="mt-6 flex justify-center">
          <button type="submit" className="w-1/3 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Sauvegarder</button>
        </div>
      )}
    </form>
  );
};

export default StudentProfile;
