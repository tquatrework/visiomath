export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string; // Ou Date si déjà converti en objet Date
}
