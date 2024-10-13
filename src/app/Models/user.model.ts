import { ServiceModel } from "./service.model";

export interface UserModel{
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
    service_id?: any,

    //  la propriété services pour contenir un tableau de services
    services?: ServiceModel[];  // Utilise un tableau de ServiceModel
}
