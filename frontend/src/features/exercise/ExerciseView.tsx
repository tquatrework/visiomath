// src/features/exercise/ExerciseView.tsx
import React, { useState } from 'react';
import MathInput from './MathInput';

interface ExerciseViewProps {
  exercise?: any;
  isCreating: boolean;
  onSave: (exerciseData: any) => void;
  onBackToSearch: () => void;
  onSubmitCorrection: () => void;
  onVoteDifficulty: (value: number) => void;
  onVoteInterest: (value: number) => void;
}

const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercise = {},
  isCreating,
  onSave,
  onBackToSearch,
  onSubmitCorrection,
  onVoteDifficulty,
  onVoteInterest
}) => {
  const [exerciseData, setExerciseData] = useState({
    title: exercise.title || '',
    statementText: exercise.statementText || '',
    statementImage: exercise.statementImage || '',
    solutionText: exercise.solutionText || '',
    solutionImage: exercise.solutionImage || '',
    chapter: exercise.chapter || '',
    subChapter: exercise.subChapter || '',
    level: exercise.level || '',
    intendedDifficulty: exercise.intendedDifficulty || '',
    language: exercise.language || '',
    exercise_tags: exercise.exercise_tags || [],
    answerText: exercise.answerText || '',
    published: exercise.published || false,
    mathAnswer: ''
  });

  const [activeTab, setActiveTab] = useState<'statement' | 'answer' | 'solution'>('statement');
  const [showHelp, setShowHelp] = useState(false);
  const [difficultyVote, setDifficultyVote] = useState<number | null>(null);
  const [interestVote, setInterestVote] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setExerciseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => onSave(exerciseData);

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button onClick={onBackToSearch} className="bg-gray-300 text-black px-4 py-2 rounded">
          Revenir à la recherche
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['statement', 'answer', 'solution'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {tab === 'statement' ? 'Enoncé' : tab === 'answer' ? 'Réponse' : 'Solution'}
          </button>
        ))}
      </div>

      {activeTab === 'statement' && (
        <>
          <input
            name="title"
            placeholder="Titre de l'exercice"
            value={exerciseData.title}
            onChange={handleChange}
            disabled={!isCreating}
            className="mb-2 w-full p-2 border rounded"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            {['chapter', 'subChapter', 'level', 'intendedDifficulty', 'language'].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={exerciseData[field]}
                onChange={handleChange}
                disabled={!isCreating}
                className="p-2 border rounded"
              />
            ))}

            <input
              name="exercise_tags"
              placeholder="Tags (séparés par virgules)"
              value={exerciseData.exercise_tags.join(', ')}
              onChange={(e) =>
                setExerciseData(prev => ({
                  ...prev,
                  exercise_tags: e.target.value.split(',').map(tag => tag.trim())
                }))
              }
              disabled={!isCreating}
              className="p-2 border rounded"
            />
          </div>

          <textarea
            name="statementText"
            placeholder="Texte de l'énoncé"
            value={exerciseData.statementText}
            onChange={handleChange}
            disabled={!isCreating}
            className="w-full p-2 border rounded mb-2"
          />

          <input
            name="statementImage"
            placeholder="Lien de l'image"
            value={exerciseData.statementImage}
            onChange={handleChange}
            disabled={!isCreating}
            className="w-full p-2 border rounded mb-2"
          />

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="published"
              checked={exerciseData.published}
              onChange={handleChange}
              disabled={!isCreating}
            />
            <span className="text-sm text-gray-600">Publié</span>
          </label>

          <button onClick={() => setShowHelp(!showHelp)} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
            {showHelp ? "Fermer l'aide" : "Aide"}
          </button>

          {showHelp && (
            <div className="mt-2 p-4 bg-gray-100 border rounded">
              <h4 className="font-semibold mb-2">Aide à la rédaction</h4>
              <p>Conseils de rédaction ou modèle...</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'answer' && (
        <>
          <textarea
            name="answerText"
            placeholder="Réponse"
            value={exerciseData.answerText}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          {isCreating ? (
            <textarea disabled placeholder="Zone réponse inactive" className="w-full p-2 border rounded bg-gray-200" />
          ) : (
            <>
              <MathInput
                value={exerciseData.mathAnswer}
                onChange={(value) => setExerciseData(prev => ({ ...prev, mathAnswer: value }))}
              />
              <button onClick={onSubmitCorrection} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
                Demander une correction
              </button>
            </>
          )}
        </>
      )}

      {activeTab === 'solution' && (
        <>
          <textarea
            name="solutionText"
            placeholder="Solution"
            value={exerciseData.solutionText}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            name="solutionImage"
            placeholder="Lien de l'image"
            value={exerciseData.solutionImage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Votes</h4>
            <div className="flex gap-2 flex-wrap">
              {[1, -1].map(val => (
                <button
                  key={`diff-${val}`}
                  onClick={() => onVoteDifficulty(val)}
                  className={`px-4 py-2 ${difficultyVote === val ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Difficulté {val > 0 ? '+1' : '-1'}
                </button>
              ))}
              {[1, -1].map(val => (
                <button
                  key={`int-${val}`}
                  onClick={() => onVoteInterest(val)}
                  className={`px-4 py-2 ${interestVote === val ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Intérêt {val > 0 ? '+1' : '-1'}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-between">
        {!isCreating && (
          <button onClick={() => console.warn("Edition locale uniquement")} className="bg-blue-500 text-white px-4 py-2 rounded">
            Modifier
          </button>
        )}
        {isCreating && (
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseView;
