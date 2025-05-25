// src/features/exercise/ExerciseSearch.tsx
import React, { useState } from 'react';

interface Props {
  exercises: any[];
  onSelectExercise: (exercise: any) => void;
  onCreateExercise: () => void;
  userRole?: string;
}

const ExerciseSearch: React.FC<Props> = ({ exercises, onSelectExercise, onCreateExercise, userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    chapter: '',
    subChapter: '',
    level: '',
    intendedDifficulty: '',
    language: '',
    tags: '',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filterExercises = () => {
    return exercises.filter((exercise) => {
      const searchMatch =
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.statementText.toLowerCase().includes(searchTerm.toLowerCase());

      const filterMatch =
        (filters.chapter === '' || exercise.chapter?.toLowerCase().includes(filters.chapter.toLowerCase())) &&
        (filters.subChapter === '' || exercise.subChapter?.toLowerCase().includes(filters.subChapter.toLowerCase())) &&
        (filters.level === '' || exercise.level?.toLowerCase().includes(filters.level.toLowerCase())) &&
        (filters.intendedDifficulty === '' || exercise.intendedDifficulty === parseInt(filters.intendedDifficulty)) &&
        (filters.language === '' || exercise.language?.toLowerCase() === filters.language.toLowerCase()) &&
        (filters.tags === '' || exercise.exercise_tags?.some((tag: string) => tag.toLowerCase().includes(filters.tags.toLowerCase())));

      return searchMatch && filterMatch;
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par titre ou énoncé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {filtersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
        {userRole !== 'student' && userRole !== 'parent' && (
          <button
            onClick={onCreateExercise}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Créer un nouvel exercice
          </button>
        )}
      </div>

      {filtersVisible && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input name="chapter" placeholder="Chapitre" value={filters.chapter} onChange={handleFilterChange} className="p-2 border rounded" />
          <input name="subChapter" placeholder="Sous-chapitre" value={filters.subChapter} onChange={handleFilterChange} className="p-2 border rounded" />
          <input name="level" placeholder="Niveau" value={filters.level} onChange={handleFilterChange} className="p-2 border rounded" />
          <input name="intendedDifficulty" type="number" placeholder="Difficulté" value={filters.intendedDifficulty} onChange={handleFilterChange} className="p-2 border rounded" />
          <input name="language" placeholder="Langue" value={filters.language} onChange={handleFilterChange} className="p-2 border rounded" />
          <input name="tags" placeholder="Tags" value={filters.tags} onChange={handleFilterChange} className="p-2 border rounded" />
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Résultats de recherche</h3>
        {filterExercises().length > 0 ? (
          filterExercises().map((exercise) => (
            <div
              key={exercise.id}
              className="p-4 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-200"
              onClick={() => onSelectExercise(exercise)}
            >
              <h4 className="text-md font-semibold">{exercise.title}</h4>
              <p className="text-sm text-gray-600">{exercise.statementText}</p>
              <p className="text-sm text-gray-500">
                Chapitre: {exercise.chapter} | Niveau: {exercise.level} | Difficulté: {exercise.intendedDifficulty}
              </p>
              <p className="text-sm text-gray-500">Tags: {exercise.exercise_tags?.join(', ')}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucun exercice trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseSearch;
