// src/features/exercise/Exercises.tsx
import React, { useState } from 'react';
import ExerciseSearch from './ExerciseSearch';
import ExerciseView from './ExerciseView';

const sampleExercises = [
  {
    id: 1,
    title: 'Push-Up',
    statementText: 'Effectuez des pompes pour renforcer votre haut du corps.',
    statementImage: 'https://example.com/pushup-image.jpg',
    solutionText: 'Voici la solution pour bien effectuer des pompes...',
    solutionImage: 'https://example.com/solution-image.jpg',
    exercise_tags: ['upper-body', 'strength'],
    intendedDifficulty: 2,
    votedDifficulty: 1,
    votedInterest: 3,
  },
];

const Exercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [mode, setMode] = useState<'search' | 'view' | 'create'>('search');

  const handleSelectExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setMode('view');
  };

  const handleCreateExercise = () => {
    setSelectedExercise(null);
    setMode('create');
  };

  const handleBackToSearch = () => {
    setSelectedExercise(null);
    setMode('search');
  };

  const handleSaveExercise = (exerciseData: any) => {
    console.log('Exercice sauvegardé :', exerciseData);
    setMode('search');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Exercices</h1>

      {mode === 'search' && (
        <ExerciseSearch
          exercises={sampleExercises}
          onSelectExercise={handleSelectExercise}
          onCreateExercise={handleCreateExercise}
        />
      )}

      {mode !== 'search' && (
        <ExerciseView
          exercise={selectedExercise || {}}
          isCreating={mode === 'create'}
          onSave={handleSaveExercise}
          onBackToSearch={handleBackToSearch}
        />
      )}
    </div>
  );
};

export default Exercises;
