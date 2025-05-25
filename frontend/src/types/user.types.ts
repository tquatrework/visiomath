// src/types/user.ts
export type UserRole = 'student' | 'parent' | 'teacher' | 'pedagogical_animator' | 'pedagogical_manager' | 'it_admin' | 'financial_admin';

// Type de base pour l'utilisateur (pour l'enregistrement, authentification, etc.)
export interface BaseUser {
  // id: string; // Identifiant unique
  email: string; // Email
  password?: string; // Mot de passe (optionnel)
  role: UserRole; // Rôle (e.g., "student", "parent", etc.)
  isActive: boolean; // Statut de l'utilisateur (actif/inactif)
  firstName?: string; // Prénom (optionnel)
  lastName?: string; // Nom (optionnel)
  phoneNumber?: string; // Numéro de téléphone
  pseudo: string; // Pseudo
}

// Données administratives d'un utilisateur
export interface UserAdministrativeData {
  user: {
    firstName?: string; // Prénom ATTENTION COMMUN AVEC BASE USER
    lastName?: string;  //  ATTENTION COMMUN AVEC BASE USER
    dateOfBirth?: string; // Date de naissance
    address?: string; // Adresse
    zipCode?: string; // Code postal
    city?: string; // Ville
  };
  profile: {
    passion?: string; // Passion
    avatar?: string; // Avatar (URL)
  };
}

interface PedagogicalData {
  level?: string; // Niveau (obligatoire pour student)
  difficulties?: string; // Intime, peut être masqué
  comments?: string; // Intime, peut être masqué
  objective?: string;
  availability?: string; // Horaires indicatifs de disponibilité
  recommendations?: string; // Préconisations générales
  stats?: {
    contacts: number;
    privateVisioHours: number;
    masterClasses: number;
    exercisesCompleted: number;
    evaluationsCompleted: number;
    tutorialsViewed: number;
    comments: number;
    completedPaths: number;
    pedagogicalPoints: number;
  };
  // Spécifique au formateur
  experience?: string;
  maxLevel?: string;
  professionalStatus?: string;
  situation?: string;
  weeklyAvailability?: string; // Disponibilités hebdomadaires pour cours ou entretien
  cvUrl?: string; // Lien vers le CV
  testResults?: {
    levelAchieved?: string;
    validatedSkills?: string[];
    testComments?: string;
  };
}

// Type étendu pour le profil complet de l'utilisateur
//export interface UserProfile extends BaseUser {

/* // Données des différents profils
export interface UserProfile {
  user: BaseUSer & UserAdministrativeData['user'] & UserPedagogicalData['user'] & UserFinancialData['user'];
  profile: UserAdministrativeData['profile'] & UserPedagogicalData['profile'] & UserFinancialData['profile'];
  // Relations avec d'autres utilisateurs
  relations?: UserRelation[]; // Liste des relations avec d'autres utilisateurs
} */

/* export interface User {
  email: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
} */