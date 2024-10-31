import { Statut } from "./statut";
import { ServiceModel } from "./service.model";

export interface CandidatureModel{
  id: number;
  offre_id: number;
  user_id: number;
  user: {
    id?:number,
    photo?:string,
    nom?:string,
    prenom?:string,
    email?:string,
    nom_utilisateur?:string,
    sexe?:string,
    role?:string,
    telephone?:string,
    adresse?:string,
    password?:string,
    service_ids: any[];
  };
   date_candidature?:Date;
   statut?:Statut;

   //  la propriété services pour contenir un tableau de services
   services?: ServiceModel[];  // Utilise un tableau de ServiceModel
}
