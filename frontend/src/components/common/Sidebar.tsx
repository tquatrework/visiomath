import React from 'react';
import { useNavigate } from "react-router-dom";

const individualItems = [
  { title: "🏠 Accueil", url: "/user-space" },
  { title: "📅 Calendrier", url: "/calendar" },
  { title: "📊 Suivi", url: "/tracking" },
  { title: "📓 Cahier de texte", url: "/notebook" },
  { title: "📝 Carnet personnel", url: "/personal-notes" },
  { title: "📌 Mémos", url: "/memos" },
];

const collectiveItems = [
  { title :"🧠  Quizzs", url: "/quizzes" },
  { title: "✏️ Exercices", url: "/exercises" },
  { title: "📝 Évaluations", url: "/evaluations" },
  { title: "🎥 Tutos", url: "/tutorials" },
  { title: "💬 Forum", url: "/forum" },
  { title: "🏆 Parcours", url: "/journeys" },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
//    <aside className="w-64 bg-gradient-to-b from-green-600 via-green-500 to-green-400 text-white p-6 shadow-md">
      <aside className="w-64 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-6 shadow-md">
      {/* Section Individuelle */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-white/50 pb-2">Individuel</h3>
        <ul className="space-y-2">
          {individualItems.map((item, index) => (
            <li
              key={index}
              className="p-2 rounded cursor-pointer bg-white/10 hover:bg-green-300 hover:text-gray-900 transition-colors duration-200"
              onClick={() => navigate(item.url)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Section Collective */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-b border-white/50 pb-2">Collectif</h3>
        <ul className="space-y-2">
          {collectiveItems.map((item, index) => (
            <li
              key={index}
              className="p-2 rounded cursor-pointer bg-white/10 hover:bg-blue-400 hover:text-gray-900 transition-colors duration-200"
              onClick={() => navigate(item.url)}
            >
              {item.title}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
