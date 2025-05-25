//userfile.types.ts
export interface UserFile {
  id: string;
  name: string;
  category: string;
  subcategory: string;
};

// Définition des catégories de fichiers
export const userfileCategories = {
  pedagogic: ['Cours', 'Certificats', 'Exercices', 'Évaluations'],
  financial: ['Mandat', 'Factures', 'Reçus', 'Aides à la déclaration'],
  submission: ['Documents divers à envoyer'],
  other: ['Autres'],  // Catégorie "Autres" avec sous-catégorie "Autres"
};
/* export const UserFilesCategories = {
     pedagogic: ['Cours', 'Certificats', 'Exercices', 'Évaluations'],
    financial: ['Mandat', 'Factures', 'Reçus', 'Aides à la déclaration'],
  }; */