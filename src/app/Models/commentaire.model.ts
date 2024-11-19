export interface CommentaireModel {
  id?: number;
  description?: string;
  candidat_id?: number;
  employer_id: number;
  note: number 
  employer?: {
    nom: string;
    photo: string;
    prenom: string;
  };
}
