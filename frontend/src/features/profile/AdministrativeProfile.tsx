// src/features/profile/AdministrativeProfile.tsx
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { UserAdministrativeData } from "../../types/user.types";
import { updateUserProfile } from "../../services/userProfileService";

interface AdministrativeProfileProps {
  data: UserAdministrativeData & { avatarTempUrl?: string } | null;
  role?: string;
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  refetchUserData?: () => void;
}

const AdministrativeProfile: React.FC<AdministrativeProfileProps> = ({
  data,
  role,
  handleFileChange,
  readOnly = false,
  refetchUserData,
}) => {
  if (!data) return <p>Chargement des données...</p>;

  const { avatarTempUrl, profile } = data;

  const { register, handleSubmit, reset } = useForm({ defaultValues: data });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);


  const onSubmit = async (formData: UserAdministrativeData) => {
    if (readOnly || !data?.user?.id) return;
    try {
      await updateUserProfile(data.user.id, {
          user: formData.user,
          profile: formData.profile ?? {}
      });
      
      if (refetchUserData) await refetchUserData();

      alert("Profil administratif mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du profil administratif :", err);
      alert("Une erreur est survenue.");
    }
};
  

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6"
    >
      {/* Avatar */}
      <section>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Avatar</h3>
        <div className="flex items-center space-x-4">
          {avatarTempUrl ? (
            <img src={avatarTempUrl} alt="Avatar" className="h-12 w-12 rounded-full" />
          ) : (
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
          )}
          {!readOnly && handleFileChange && (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="avatarUpload"
              />
              <label htmlFor="avatarUpload" className="cursor-pointer text-blue-500">
                Ajouter une photo
              </label>
            </>
          )}
        </div>
      </section>

      {/* Informations de base */}
      <section>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Informations de base</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block font-medium text-gray-600">Prénom</label>
            <input
              id="firstName"
              {...register("user.firstName")}
              type="text"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block font-medium text-gray-600">Nom</label>
            <input
              id="lastName"
              {...register("user.lastName")}
              type="text"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="phoneNumber" className="block font-medium text-gray-600">Téléphone</label>
            <input
              id="phoneNumber"
              {...register("user.phoneNumber")}
              type="tel"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
          <div>
            <label htmlFor="dateOfBirth" className="block font-medium text-gray-600">Date de naissance</label>
            <input
              id="dateOfBirth"
              {...register("user.dateOfBirth")}
              type="date"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </section>

      {/* Adresse */}
      <section>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Adresse</h3>
        <input
          id="address"
          {...register("user.address")}
          type="text"
          readOnly={readOnly}
          className={`w-full px-4 py-2 border rounded-lg mb-4 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block font-medium text-gray-600">Code postal</label>
            <input
              id="zipCode"
              {...register("user.zipCode")}
              type="text"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
          <div>
            <label htmlFor="city" className="block font-medium text-gray-600">Ville</label>
            <input
              id="city"
              {...register("user.city")}
              type="text"
              readOnly={readOnly}
              className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </section>

      {/* Profil utilisateur */}
      <section>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Informations supplémentaires</h3>
        <label htmlFor="pseudo" className="block font-medium text-gray-600">Pseudo</label>
        <input
          id="pseudo"
          {...register("profile.pseudo")}
          type="text"
          readOnly={readOnly}
          className={`w-full px-4 py-2 border rounded-lg mb-4 ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        <label htmlFor="passions" className="block font-medium text-gray-600">Passions</label>
        <textarea
          id="passions"
          {...register("profile.passions")}
          rows={3}
          readOnly={readOnly}
          className={`w-full px-4 py-2 border rounded-lg ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
      </section>

      {!readOnly && (
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600"
          >
            Sauvegarder
          </button>
        </div>
      )}
    </form>
  );
};

export default AdministrativeProfile;
