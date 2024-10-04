import { ServiceModel } from "./service.model";

export interface OffreModel{
    id?:number,
    user_id?:number,
    description?:string,
    lieu?:string,
    salaire?:string,
    horaire?:string,
    nombre_postes?:number,
    date_debut?:string,
    date_fin?:string,
    date_limite?:string,
    profil?:string,
    service_id?: string,


    // Ajoute la propriété services pour contenir un tableau de services
    services?: ServiceModel[];  // Utilise un tableau de ServiceModel
}