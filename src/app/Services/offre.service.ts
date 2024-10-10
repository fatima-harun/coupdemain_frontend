import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "./apiUrl";
import { OffreModel } from "../Models/offre.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})

export class OffreService {
    private http = inject(HttpClient);

    // Méthode pour ajouter une offre avec les headers contenant le token
    addOffre(offre: any) {
        const headers = this.getHeaders(); // Ajout des headers avec le token
        return this.http.post(`${apiUrl}/offres`, offre, { headers });
    }

    // Méthode pour récupérer toutes les offres avec les headers
    getAllOffre() {
        const headers = this.getHeaders();
        return this.http.get(`${apiUrl}/offres`, { headers });
    }
    //méthode pour récupérer une seule offre
    getOffresByid(OffreId: number){
      const headers = this.getHeaders();
      return this.http.get(`${apiUrl}/offres/${OffreId}`, { headers }); // Corrige l'URL
    }


    // Méthode pour récupérer les headers avec le token d'authentification
    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token');
        if (token) {
            return new HttpHeaders().set('Authorization', `Bearer ${token}`);
        } else {
            console.error('Token non trouvé');
            return new HttpHeaders();
        }
    }

    getOffresByService(serviceId: number){
      return this.http.get(`${apiUrl}/services/${serviceId}/offres`);
    }
}
