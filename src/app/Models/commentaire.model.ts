export interface CommentaireModel {
  id?: number;
  description?: string;
  user_id?: number;
  employer_id: number;
  employer?: {
    nom: string;
    photo: string;
    prenom: string;
  };
}
