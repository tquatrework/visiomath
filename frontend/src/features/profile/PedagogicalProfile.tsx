// src/features/profile/PedagogicalProfile.tsx
import React from "react";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";
import WeekSchedule from "./WeekSchedule";
import StudentOrdonnance from "./StudentOrdonnance";
import TeacherOrdonnance from "./TeacherOrdonnance";

interface PedagogicalProfileProps {
  data: Record<string, any>;
  readOnly?: boolean;
}

const PedagogicalProfile: React.FC<PedagogicalProfileProps> = ({ data, readOnly = false }) => {
  if (!data) {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Pour afficher les informations pédagogiques, veuillez choisir un profil élève ou professeur dans la liste déroulante.
        </h2>
      </div>
    );
  }

  const { role } = data.user;

  const renderStudentProfile = () => (
    <div className="grid grid-rows-3 gap-2">
      <section>
        <h1 className="text-2xl font-bold mb-4">Profil Étudiant</h1>
        <StudentProfile data={data} readOnly={readOnly} />
      </section>
      <section>
        <h1 className="text-2xl font-bold mb-4">Disponibilités</h1>
        <WeekSchedule selectedProfileId={data.user.id} calendarType="Availability" readOnly={readOnly} />
      </section>
      <section>
        <h1 className="text-2xl font-bold mb-4">Préconisations</h1>
        <StudentOrdonnance data={data} readOnly={readOnly} />
      </section>
    </div>
  );

  const renderTeacherProfile = () => (
    <div className="grid grid-rows-3 gap-2">
      <section>
        <h1 className="text-2xl font-bold mb-4">Profil Professeur</h1>
        <TeacherProfile data={data} readOnly={readOnly} />
      </section>
      <section>
        <h1 className="text-2xl font-bold mb-4">Disponibilités</h1>
        <WeekSchedule selectedProfileId={data.user.id} calendarType="Availability" readOnly={readOnly} />
      </section>
      <section>
        <h1 className="text-2xl font-bold mb-4">Préconisations</h1>
        <TeacherOrdonnance data={data} readOnly={readOnly} />
      </section>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {role === "student" && renderStudentProfile()}
      {role === "teacher" && renderTeacherProfile()}
    </div>
  );
};

export default PedagogicalProfile;
