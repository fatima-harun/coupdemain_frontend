import { HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export function authInterceptor (req:HttpRequest<unknown>, next: HttpHandlerFn) {

    const token = localStorage.getItem('access_token');

    // Recuperation des infos de connexion de l'utilisateur au niveau du localstoge 
    if(token){
      
        // Donnees a ajouter dans l'entete de la requete 
    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
    })
       

    // Clonage de la requete en y ajoutant le header 
    const newReq = req.clone({
        headers
    })

    // On retourne maintenant la requete clonner 
    return next(newReq);
       
    }

    // S'il n'y a pas de token on retourne la requette en question 
    if(!token){
        return next(req);
    }


}